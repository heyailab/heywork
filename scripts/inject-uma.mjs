/**
 * Inject HEY plugin packages into a prepared dsh runtime tree.
 *
 * Runs inside the official packaging pipeline via the DSH_DESKTOP_HEY_INJECT hook
 * (patched into apps/desktop/scripts/package-target.ts), AFTER prepare:dsh has
 * materialized the target dsh tree and BEFORE electron-builder packs it.
 *
 * What it does:
 *  1. Copies every package in uma-assets/packages/@deepseek-ai/* into
 *     <tree>/node_modules/@deepseek-ai/ (fails if a target already exists).
 *     That directory holds two audited groups:
 *       - the 12 HEY product packages (hey-base/hey-web bundles, tools, clients);
 *       - the 11 first-party packages the HEY desktop layers mount but the public
 *         deepseek-harness ref does not publish (knowledge, project wiki, coding
 *         workbench, design studio, worktree, task query). Without them the Host
 *         cannot resolve those entries and the profile fails to start, which the
 *         prepare-stage runtime smoke cannot see because it runs pre-injection.
 *     Provenance and per-file hashes: uma-assets/packages.extras.json.
 *  2. Supplies missing external dependency packages from uma-assets/deps/
 *     (ssh2 closure — absent from the upstream dsh closure; skip if present).
 *  3. Registers the packages in the tree's package.json dependencies.
 *  4. Regenerates desktop-runtime.json: adds the packages to sharedPackages and
 *     re-inventories every file (bytes + sha256 + executable) so the post-pack
 *     verifyDesktopRuntime integrity check passes.
 *
 * Refs: apps/desktop/src/runtime-tree.ts (inventory format),
 *       prepare-dsh.ts (tree materialization), HEY Mac bundle (sharedPackages口径).
 */
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, readdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const CWD = process.cwd()
// CI runs with cwd = repository root of the port workspace (deepseek-harness's parent).
const REPO_ROOT = process.env.HEY_ROOT ?? CWD
const TARGET = process.env.HEY_DSH_TREE
  ?? join(REPO_ROOT, 'deepseek-harness', 'apps', 'desktop', '.desktop-build', 'targets', 'win-x64', 'dsh')
const ASSETS = process.env.HEY_ASSETS_DIR ?? join(REPO_ROOT, 'uma-assets')
const PACKAGES_SRC = join(ASSETS, 'packages')
const DEPS_SRC = join(ASSETS, 'deps')

const DESCRIPTOR = 'desktop-runtime.json'

/** Packages the HEY desktop composition cannot boot without. */
const REQUIRED_PACKAGES = [
  '@deepseek-ai/dsh-uma-base',
  '@deepseek-ai/dsh-uma-web',
  '@deepseek-ai/dsh-skill-uma',
  '@deepseek-ai/dsh-knowledge',
  '@deepseek-ai/dsh-tool-repo-wiki',
  '@deepseek-ai/dsh-coding-workbench',
]

function fail(message) {
  console.error(`hey inject: ${message}`)
  process.exit(1)
}

if (!existsSync(TARGET)) fail(`dsh tree not found: ${TARGET} (run the packaging pipeline first)`)
if (!existsSync(PACKAGES_SRC)) fail(`hey packages source not found: ${PACKAGES_SRC}`)

/** Audited package set: every directory in uma-assets/packages. */
const HEY_PACKAGES = readdirSync(PACKAGES_SRC, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => `@deepseek-ai/${entry.name}`)
  .sort()
if (HEY_PACKAGES.length < 12) fail(`expected at least 12 HEY packages, found ${HEY_PACKAGES.length}`)
for (const name of REQUIRED_PACKAGES) {
  if (!HEY_PACKAGES.includes(name)) fail(`required package missing from uma-assets/packages: ${name}`)
}

const modulesDir = join(TARGET, 'node_modules')

// ---- 1. copy HEY plugin packages ----
let copied = 0
for (const name of HEY_PACKAGES) {
  const source = join(PACKAGES_SRC, name.slice('@deepseek-ai/'.length))
  const destination = join(modulesDir, name)
  if (!existsSync(source)) fail(`missing package source: ${source}`)
  if (existsSync(destination)) fail(`target already exists, refusing to overwrite: ${destination}`)
  cpSync(source, destination, { recursive: true })
  copied++
}
console.log(`hey inject: copied ${copied} HEY plugin packages`)

// ---- 2. supply missing external dependency packages (ssh2 closure) ----
let depsCopied = 0
for (const entry of readdirSync(DEPS_SRC)) {
  const destination = join(modulesDir, entry)
  if (existsSync(destination)) continue // upstream closure already carries it
  cpSync(join(DEPS_SRC, entry), destination, { recursive: true })
  depsCopied++
}
console.log(`hey inject: supplied ${depsCopied} missing dependency packages from deps pool`)

// ---- 3. register in the tree's package.json dependencies ----
const treeManifestPath = join(TARGET, 'package.json')
const treeManifest = JSON.parse(readFileSync(treeManifestPath, 'utf8'))
treeManifest.dependencies ??= {}
for (const name of HEY_PACKAGES) {
  const manifest = JSON.parse(readFileSync(join(modulesDir, name, 'package.json'), 'utf8'))
  treeManifest.dependencies[name] = manifest.version
}
writeFileSync(treeManifestPath, `${JSON.stringify(treeManifest, undefined, 2)}\n`)

// ---- 4. regenerate desktop-runtime.json ----
const descriptorPath = join(TARGET, DESCRIPTOR)
const descriptor = JSON.parse(readFileSync(descriptorPath, 'utf8'))
if (descriptor.schemaVersion !== 1) fail(`unexpected descriptor schemaVersion: ${descriptor.schemaVersion}`)

// sharedPackages: merge HEY packages, sorted by name (same convention as writeDesktopRuntime)
const shared = new Map(descriptor.sharedPackages.map(entry => [entry.name, entry]))
for (const name of HEY_PACKAGES) {
  const manifest = JSON.parse(readFileSync(join(modulesDir, name, 'package.json'), 'utf8'))
  shared.set(name, { name, version: manifest.version, path: `node_modules/${name}` })
}
descriptor.sharedPackages = [...shared.values()].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))

// files: full re-inventory, byte-identical to runtime-tree.ts's inventoryDesktopRuntime
const files = []
const visit = directory => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    const name = relative(TARGET, path).split(sep).join('/')
    if (name === DESCRIPTOR) continue
    if (entry.isDirectory()) visit(path)
    else if (entry.isFile()) {
      const body = readFileSync(path)
      files.push({
        path: name,
        bytes: body.byteLength,
        sha256: createHash('sha256').update(body).digest('hex'),
        executable: process.platform !== 'win32' && (lstatSync(path).mode & 0o111) !== 0,
      })
    } else fail(`unsupported filesystem entry: ${name}`)
  }
}
visit(TARGET)
files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))
descriptor.files = files

writeFileSync(descriptorPath, `${JSON.stringify(descriptor, undefined, 2)}\n`)
console.log(`hey inject: descriptor updated — ${descriptor.sharedPackages.length} shared packages, ${files.length} files inventoried`)

// ---- 5. gate the composition while a fix is still cheap ----
// The prepare-stage runtime smoke runs before injection, so nothing downstream
// would notice an unresolvable layer entry until a user launched the app.
if (process.env.HEY_SKIP_VERIFY !== '1') {
  const verifier = join(REPO_ROOT, 'scripts', 'verify-hey-platform.mjs')
  if (!existsSync(verifier)) fail(`composition verifier not found: ${verifier}`)
  console.log('hey inject: verifying the packaged composition')
  const result = spawnSync(process.execPath, [verifier, '--tree', TARGET], {
    stdio: 'inherit',
    env: { ...process.env, HEY_ROOT: REPO_ROOT, HEY_DSH_ROOT: join(REPO_ROOT, 'deepseek-harness') },
  })
  if (result.status !== 0) fail('composition verification failed (see the ::error:: lines above)')
}
console.log('hey inject: done')
