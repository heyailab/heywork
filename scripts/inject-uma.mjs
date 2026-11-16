/**
 * Inject UMA plugin packages into a prepared dsh runtime tree.
 *
 * Runs inside the official packaging pipeline via the DSH_DESKTOP_UMA_INJECT hook
 * (patched into apps/desktop/scripts/package-target.ts), AFTER prepare:dsh has
 * materialized the target dsh tree and BEFORE electron-builder packs it.
 *
 * What it does:
 *  1. Copies the 12 UMA plugin packages (uma-assets/packages/@deepseek-ai/*)
 *     into <tree>/node_modules/@deepseek-ai/ (fails if a target already exists).
 *  2. Supplies missing external dependency packages from uma-assets/deps/
 *     (ssh2 closure — absent from the upstream dsh closure; skip if present).
 *  3. Registers the packages in the tree's package.json dependencies.
 *  4. Regenerates desktop-runtime.json: adds the packages to sharedPackages and
 *     re-inventories every file (bytes + sha256 + executable) so the post-pack
 *     verifyDesktopRuntime integrity check passes.
 *
 * Refs: apps/desktop/src/runtime-tree.ts (inventory format),
 *       prepare-dsh.ts (tree materialization), UMA Mac bundle (sharedPackages口径).
 */
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, readdirSync, readFileSync, writeFileSync, cpSync, rmSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const CWD = process.cwd()
// CI runs with cwd = repository root of the port workspace (deepseek-harness's parent).
const REPO_ROOT = process.env.UMA_PORT_ROOT ?? CWD
const TARGET = process.env.UMA_DSH_TREE
  ?? join(REPO_ROOT, 'deepseek-harness', 'apps', 'desktop', '.desktop-build', 'targets', 'win-x64', 'dsh')
const ASSETS = process.env.UMA_ASSETS_DIR ?? join(REPO_ROOT, 'uma-assets')
const PACKAGES_SRC = join(ASSETS, 'packages')
const DEPS_SRC = join(ASSETS, 'deps')

const DESCRIPTOR = 'desktop-runtime.json'

// 12 UMA plugin packages (matches UMA Mac bundle sharedPackages 口径)
const UMA_PACKAGES = [
  '@deepseek-ai/dsh-client-ui-uma-brand',
  '@deepseek-ai/dsh-client-ui-uma-design',
  '@deepseek-ai/dsh-client-ui-uma-task-budget',
  '@deepseek-ai/dsh-client-uma-remotes',
  '@deepseek-ai/dsh-skill-uma',
  '@deepseek-ai/dsh-tool-uma-design',
  '@deepseek-ai/dsh-tool-uma-workflow',
  '@deepseek-ai/dsh-uma-base',
  '@deepseek-ai/dsh-uma-guidance',
  '@deepseek-ai/dsh-uma-task-budget',
  '@deepseek-ai/dsh-uma-web',
  '@deepseek-ai/dsh-util-uma-delivery',
]

function fail(message) {
  console.error(`uma inject: ${message}`)
  process.exit(1)
}

if (!existsSync(TARGET)) fail(`dsh tree not found: ${TARGET} (run the packaging pipeline first)`)
if (!existsSync(PACKAGES_SRC)) fail(`uma packages source not found: ${PACKAGES_SRC}`)

const modulesDir = join(TARGET, 'node_modules')

// ---- 1. copy UMA plugin packages ----
let copied = 0
for (const name of UMA_PACKAGES) {
  const source = join(PACKAGES_SRC, name.slice('@deepseek-ai/'.length))
  const destination = join(modulesDir, name)
  if (!existsSync(source)) fail(`missing package source: ${source}`)
  if (existsSync(destination)) fail(`target already exists, refusing to overwrite: ${destination}`)
  cpSync(source, destination, { recursive: true })
  copied++
}
console.log(`uma inject: copied ${copied} UMA plugin packages`)

// ---- 2. supply missing external dependency packages (ssh2 closure) ----
let depsCopied = 0
for (const entry of readdirSync(DEPS_SRC)) {
  const destination = join(modulesDir, entry)
  if (existsSync(destination)) continue // upstream closure already carries it
  cpSync(join(DEPS_SRC, entry), destination, { recursive: true })
  depsCopied++
}
console.log(`uma inject: supplied ${depsCopied} missing dependency packages from deps pool`)

// ---- 3. register in the tree's package.json dependencies ----
const treeManifestPath = join(TARGET, 'package.json')
const treeManifest = JSON.parse(readFileSync(treeManifestPath, 'utf8'))
treeManifest.dependencies ??= {}
for (const name of UMA_PACKAGES) {
  const manifest = JSON.parse(readFileSync(join(modulesDir, name, 'package.json'), 'utf8'))
  treeManifest.dependencies[name] = manifest.version
}
writeFileSync(treeManifestPath, `${JSON.stringify(treeManifest, undefined, 2)}\n`)

// ---- 4. regenerate desktop-runtime.json ----
const descriptorPath = join(TARGET, DESCRIPTOR)
const descriptor = JSON.parse(readFileSync(descriptorPath, 'utf8'))
if (descriptor.schemaVersion !== 1) fail(`unexpected descriptor schemaVersion: ${descriptor.schemaVersion}`)

// sharedPackages: merge UMA packages, sorted by name (same convention as writeDesktopRuntime)
const shared = new Map(descriptor.sharedPackages.map(entry => [entry.name, entry]))
for (const name of UMA_PACKAGES) {
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
console.log(`uma inject: descriptor updated — ${descriptor.sharedPackages.length} shared packages, ${files.length} files inventoried`)
console.log('uma inject: done')
