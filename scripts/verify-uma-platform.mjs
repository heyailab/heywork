/**
 * Phase 4 composition acceptance: prove the UMA product layer still resolves on
 * the Windows desktop profile before anything is packaged.
 *
 * The Mac app ships the same pieces, so every failure here is a difference a
 * Windows user would hit at runtime (blank renderer, Host boot failure, missing
 * tool family, silently ignored switch):
 *
 *  1. `apps/desktop/resources/uma-platform.patch.yml` (the 22 product switches)
 *     must differ from the Mac original only in `desktopPlatform`.
 *  2. Every switch id must exist in the desktop layer stack
 *     (`dsh-base` + `dsh-web-app` + `dsh-uma-base` + `dsh-uma-web`); the launcher
 *     applies the product patch last, so an id no layer declares is silently dead.
 *  3. Every `@deepseek-ai/*` package the UMA layers name must resolve — either an
 *     upstream package or one of the packages vendored under uma-assets/packages.
 *     The public ref does not publish the knowledge base, project wiki, coding
 *     workbench, design studio, worktree or task query, which is why the extras
 *     are vendored at all.
 *  4. Every tool the packages register must still be present (the UMA system
 *     prompt names design_begin, uma_workspace_search, coding_inspect and
 *     uma_wiki_lookup by hand), and every client package must keep a prebuilt
 *     `lib/client.js`.
 *  5. The skill container must stay outside the asar (node:sqlite cannot open a
 *     virtual path) and all eight locales must ship.
 *
 * Usage:
 *   node scripts/verify-uma-platform.mjs                 # source checkout + uma-assets
 *   node scripts/verify-uma-platform.mjs --tree <dir>    # materialized dsh tree (post-inject)
 *
 * Refs: packages/bundle/base/cordis.patch.yml (desktopPlatform expression),
 *       packages/util/official-bundles/src/bundles.ts (PROFILE_TEMPLATES.web),
 *       apps/desktop/scripts/electron-builder-config.mjs (asarUnpack).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const ARGS = process.argv.slice(2)
const treeIndex = ARGS.indexOf('--tree')
const TREE = treeIndex === -1 ? undefined : resolve(ARGS[treeIndex + 1] ?? '')
if (treeIndex !== -1 && (TREE === undefined || !existsSync(TREE))) {
  console.error(`verify-uma-platform: --tree path not found: ${ARGS[treeIndex + 1]}`)
  process.exit(2)
}

const PORT_ROOT = process.env.UMA_PORT_ROOT ?? resolve(import.meta.dirname, '..')
const DSH_ROOT = process.env.UMA_DSH_ROOT ?? join(PORT_ROOT, 'deepseek-harness')
const ASSETS = process.env.UMA_ASSETS_DIR ?? join(PORT_ROOT, 'uma-assets')

const failures = []
const notes = []
const fail = message => failures.push(message)

// ---------------------------------------------------------------- expectations

/** The 22 switches of the Mac product patch: 8 mounted, 14 retired (telemetry and DeepSeek-branded twins). */
const EXPECTED_SWITCHES = {
  enabled: [
    'ui-skill', 'session-log-download', 'uma-feedback', 'deepseek-account',
    'llm-deepseek-account', 'ui-settings-models', 'session-controller', 'web',
  ],
  disabled: [
    'uma-guidance', 'llm-deepseek', 'web-search-deepseek', 'web-deepseek-api',
    'session-title-llm', 'session-log-deepseek', 'plugin-package-inventory-deepseek',
    'desktop-product-telemetry', 'session-telemetry-otel', 'product-analytics',
    'ui-message-feedback', 'ui-settings-web-search', 'ui-settings-session-log',
    'ui-brand-official',
  ],
}

/**
 * Tools the injected packages must register on Windows. The UMA system prompt
 * (uma-base/cordis.patch.yml) tells the model to call design_begin,
 * uma_workspace_search, coding_inspect and uma_wiki_lookup by name, so a missing
 * family is a product-level regression, not merely a missing button.
 */
const EXPECTED_TOOLS = [
  // delivery pipeline + gate (dsh-tool-uma-workflow)
  'uma_artifact_write', 'uma_artifact_read', 'uma_gate_status',
  // design tool family (dsh-tool-uma-design)
  'design_begin', 'design_context', 'design_asset_list', 'design_asset_get',
  'design_rule_search', 'design_preview', 'design_project_create',
  'design_project_status', 'design_stop',
  // bundled skills + knowledge retrieval (dsh-tool-uma-design)
  'uma_resource_read', 'uma_knowledge_search',
  // recall, SSH operations, WeKnora (dsh-uma-base)
  'uma_workspace_search', 'uma_ssh_servers', 'uma_ssh_run',
  'uma_project_memory', 'uma_experience_record', 'uma_weknora_search',
  // task budget (dsh-uma-task-budget, typert-defined) and guidance (dsh-uma-guidance)
  'uma_session_budgets', 'uma_guidance',
  // project wiki (dsh-tool-repo-wiki)
  'uma_wiki_lookup', 'wiki_status', 'wiki_inventory', 'wiki_read_source',
  'wiki_read_page', 'wiki_search', 'wiki_plan', 'wiki_write_page', 'wiki_finish',
  'wiki_export', 'wiki_import',
  // coding workbench (dsh-coding-workbench)
  'coding_task', 'coding_inspect', 'coding_check', 'coding_repair',
  'coding_review', 'coding_acceptance', 'coding_restore',
]

/** Locale files every localized package ships; the Mac app carries the same eight. */
const LOCALES = ['de', 'en', 'es', 'fr', 'ja', 'pt', 'ru', 'zh']

/** Vendored packages the Windows composition cannot boot without. */
const REQUIRED_PACKAGES = [
  '@deepseek-ai/dsh-uma-base',
  '@deepseek-ai/dsh-uma-web',
  '@deepseek-ai/dsh-skill-uma',
  '@deepseek-ai/dsh-knowledge',
  '@deepseek-ai/dsh-tool-repo-wiki',
  '@deepseek-ai/dsh-coding-workbench',
]

// ------------------------------------------------------------------ file utils

const readJson = path => JSON.parse(readFileSync(path, 'utf8'))
const walk = (directory, visit) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.desktop-build') continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) walk(path, visit)
    else visit(path)
  }
}

// ------------------------------------------------------------- 1. product patch

const patchPath = join(DSH_ROOT, 'apps', 'desktop', 'resources', 'uma-platform.patch.yml')
if (!existsSync(patchPath)) fail(`product patch not found: ${patchPath} (apply patches/uma-phase1.patch first)`)

let entries = []
if (existsSync(patchPath)) {
  try {
    entries = readJson(patchPath)
  } catch (error) {
    fail(`product patch is not valid JSON (the launcher parses it as an overlay): ${error.message}`)
  }
}

if (entries.length > 0) {
  const ids = new Set(entries.map(entry => entry.id))
  const enabled = [...ids].filter(id => entries.find(entry => entry.id === id).disabled !== true)
  const disabled = [...ids].filter(id => entries.find(entry => entry.id === id).disabled === true)

  for (const id of EXPECTED_SWITCHES.enabled) {
    if (!ids.has(id)) fail(`switch missing from the product patch: ${id}`)
    else if (!enabled.includes(id)) fail(`switch must stay enabled: ${id}`)
  }
  for (const id of EXPECTED_SWITCHES.disabled) {
    if (!ids.has(id)) fail(`switch missing from the product patch: ${id}`)
    else if (!disabled.includes(id)) fail(`switch must stay disabled: ${id}`)
  }
  if (ids.size !== entries.length) fail(`product patch repeats an id (${entries.length} entries, ${ids.size} distinct)`)
  notes.push(`product patch: ${entries.length} switches — ${enabled.length} enabled, ${disabled.length} disabled`)

  // Windows identity: the base layer derives desktopPlatform from process.platform,
  // and the product patch pins it so a mis-set environment cannot downgrade the
  // client to "web" (Platform would then reject the managed-account flow).
  const account = entries.find(entry => entry.id === 'deepseek-account')
  if (account === undefined) fail('product patch has no deepseek-account entry')
  else if (account.config?.desktopPlatform !== 'win32') {
    fail(`deepseek-account.desktopPlatform must be "win32" for the Windows build, found ${JSON.stringify(account.config?.desktopPlatform)}`)
  } else notes.push('deepseek-account.desktopPlatform = win32 (x-client-platform: desktop-win)')
}

// Drift guard: uma-assets keeps the Mac original as the reference, so a change to
// the shipped copy has to be an intentional, reviewed difference.
const macOriginal = join(ASSETS, 'uma-platform.patch.mac.yml')
if (existsSync(macOriginal) && entries.length > 0) {
  const original = readJson(macOriginal)
  const originalById = new Map(original.map(entry => [entry.id, entry]))
  const patchById = new Map(entries.map(entry => [entry.id, entry]))
  const normalize = value => JSON.stringify(value, Object.keys(value ?? {}).sort())
  for (const [id, entry] of patchById) {
    const before = originalById.get(id)
    if (before === undefined) { fail(`switch ${id} exists only in the Windows copy — document the reason`); continue }
    if ((entry.disabled ?? false) !== (before.disabled ?? false)) {
      fail(`switch ${id}: disabled ${before.disabled ?? false} → ${entry.disabled ?? false} diverges from the Mac original`)
    }
    for (const key of new Set([...Object.keys(entry.config ?? {}), ...Object.keys(before.config ?? {})])) {
      if (key === 'desktopPlatform') continue
      if (normalize(entry.config?.[key]) !== normalize(before.config?.[key])) {
        fail(`switch ${id}.config.${key} diverges from the Mac original`)
      }
    }
  }
  for (const id of originalById.keys()) if (!patchById.has(id)) fail(`switch ${id} was dropped from the Windows copy`)
  notes.push(`drift guard: compared against ${relative(PORT_ROOT, macOriginal)} (desktopPlatform exempt)`)
}

// -------------------------------------------------- 2. desktop layer stack by name

/** Index every package.json under the tree (or the source checkout) by package name. */
function indexPackages(root) {
  const index = new Map()
  if (!existsSync(root)) return index
  walk(root, path => {
    if (!path.endsWith('package.json')) return
    try {
      const manifest = readJson(path)
      if (typeof manifest.name === 'string' && !index.has(manifest.name)) {
        index.set(manifest.name, { dir: resolve(path, '..'), manifest })
      }
    } catch { /* unreadable manifests are not layer carriers */ }
  })
  return index
}

const packageIndex = (() => {
  if (TREE !== undefined) return indexPackages(join(TREE, 'node_modules'))
  const index = new Map()
  for (const scope of ['packages', 'apps', 'vendor']) {
    const root = join(DSH_ROOT, scope)
    if (existsSync(root)) for (const [name, value] of indexPackages(root)) index.set(name, value)
  }
  for (const [name, value] of indexPackages(join(ASSETS, 'packages'))) index.set(name, value)
  return index
})()

/** Patch files a bundle declares (string or array form), resolved and checked. */
function bundlePatchFiles(name) {
  const found = packageIndex.get(name)
  if (found === undefined) { fail(`bundle package not found in the composition: ${name}`); return [] }
  const declared = found.manifest.dsh?.bundle?.patch
  const list = declared === undefined ? [] : Array.isArray(declared) ? declared : [declared]
  if (list.length === 0) { fail(`bundle declares no dsh.bundle.patch: ${name}`); return [] }
  return list.map(relativePath => join(found.dir, relativePath)).filter(path => {
    if (!existsSync(path)) { fail(`bundle patch file missing: ${relative(PORT_ROOT, path)}`); return false }
    return true
  })
}

// The desktop profile is PROFILE_TEMPLATES.web plus the UMA pair; read both from
// the patched sources so a rename there fails this check too.
const projectManagerPath = join(DSH_ROOT, 'apps', 'desktop', 'src', 'project-manager.ts')
let desktopBundles = []
if (existsSync(projectManagerPath)) {
  const source = readFileSync(projectManagerPath, 'utf8')
  // `const UMA_DESKTOP_BUNDLES: readonly string[] = [...]` — anchor on the
  // initializer so the type annotation's `[]` is not mistaken for the array.
  const block = /const UMA_DESKTOP_BUNDLES[^=]*=\s*\[([\s\S]*?)\]/.exec(source)
  if (block === null) fail('apps/desktop/src/project-manager.ts no longer defines UMA_DESKTOP_BUNDLES')
  else {
    desktopBundles = [...block[0].matchAll(/'(@deepseek-ai\/[^']+)'/g)].map(match => match[1])
    if (!source.includes('...WEB_PROFILE.bundles')) fail('UMA_DESKTOP_BUNDLES no longer starts from PROFILE_TEMPLATES.web')
    const templatesPath = join(DSH_ROOT, 'packages', 'util', 'official-bundles', 'src', 'bundles.ts')
    const templates = existsSync(templatesPath) ? readFileSync(templatesPath, 'utf8') : ''
    const webTemplate = /web:\s*\{\s*bundles:\s*\[([^\]]*)\]/.exec(templates)
    if (webTemplate === null) fail('PROFILE_TEMPLATES.web is no longer declared in packages/util/official-bundles/src/bundles.ts')
    else {
      const webBundles = [...webTemplate[1].matchAll(/'(@deepseek-ai\/[^']+)'/g)].map(match => match[1])
      desktopBundles = [...webBundles, ...desktopBundles]
      notes.push(`desktop profile = web template [${webBundles.join(', ')}] + UMA pair`)
    }
  }
} else fail(`project-manager.ts not found: ${projectManagerPath}`)
for (const required of ['@deepseek-ai/dsh-uma-base', '@deepseek-ai/dsh-uma-web']) {
  if (!desktopBundles.includes(required)) fail(`UMA_DESKTOP_BUNDLES is missing ${required}`)
}

const layerFiles = [...new Set(desktopBundles)].flatMap(bundlePatchFiles)

/** Collect the ids a layer file may mount. */
function collectIds(files) {
  const ids = new Set()
  for (const file of files) {
    for (const match of readFileSync(file, 'utf8').matchAll(/^\s*-?\s*id:\s*['"]?([A-Za-z0-9._-]+)['"]?\s*$/gm)) ids.add(match[1])
  }
  return ids
}

const declaredIds = collectIds(layerFiles)
notes.push(`desktop layer stack: ${new Set(desktopBundles).size} bundles, ${layerFiles.length} patch files, ${declaredIds.size} mountable ids`)

if (entries.length > 0) {
  for (const entry of entries) {
    if (!declaredIds.has(entry.id)) fail(`switch ${entry.id} is not declared by any desktop layer — the overlay would be a no-op`)
  }
}

// --------------------- 3. UMA layer package references must resolve to real packages

// The inject list is the audited directory set: the 12 UMA product packages plus
// the 11 first-party packages the public ref does not publish.
const injectedPackages = existsSync(join(ASSETS, 'packages'))
  ? readdirSync(join(ASSETS, 'packages'), { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => `@deepseek-ai/${entry.name}`)
      .sort()
  : []
if (injectedPackages.length < 12) fail(`uma-assets/packages must carry at least the 12 UMA packages, found ${injectedPackages.length}`)
for (const required of REQUIRED_PACKAGES) {
  if (!injectedPackages.includes(required)) fail(`required package missing from uma-assets/packages: ${required}`)
}
notes.push(`injected packages: ${injectedPackages.length} (12 UMA + ${injectedPackages.length - 12} first-party extras)`)

const upstreamNames = new Set()
for (const scope of ['packages', 'apps', 'vendor']) {
  const root = join(DSH_ROOT, scope)
  if (!existsSync(root)) continue
  walk(root, path => {
    if (!path.endsWith('package.json')) return
    try {
      const manifest = readJson(path)
      if (typeof manifest.name === 'string') upstreamNames.add(manifest.name)
    } catch { /* ignore */ }
  })
}
if (upstreamNames.size === 0) fail(`no upstream package manifests found under ${DSH_ROOT}`)

for (const file of layerFiles) {
  if (!/uma-(base|web)\//.test(file)) continue
  for (const match of readFileSync(file, 'utf8').matchAll(/^\s*name:\s*['"](@deepseek-ai\/[^'"]+)['"]\s*$/gm)) {
    const specifier = match[1]
    // Subpath mounts (`pkg/experience-capture`) resolve through the package root.
    const packageName = specifier.split('/').slice(0, 2).join('/')
    if (upstreamNames.has(packageName) || injectedPackages.includes(packageName)) continue
    fail(`${relative(PORT_ROOT, file)} mounts ${specifier}, but ${packageName} is neither upstream nor vendored`)
  }
}
if (TREE !== undefined) {
  for (const name of injectedPackages) {
    if (!existsSync(join(TREE, 'node_modules', name, 'package.json'))) fail(`injected package missing from the packaged tree: ${name}`)
  }
}

// -------------------------------------------- 4. tools and client bundles survive

const toolNames = new Map()
const clientBundles = new Set()
const thirdPartyNeeds = new Set()
for (const name of injectedPackages) {
  const entry = packageIndex.get(name)
  if (entry === undefined) { fail(`UMA package not found: ${name}`); continue }
  if (entry.manifest.version !== '0.2.2-rc.3') {
    fail(`${name} version ${entry.manifest.version} diverges from the 0.2.2-rc.3 baseline`)
  }
  for (const dependency of Object.keys({ ...entry.manifest.dependencies, ...entry.manifest.optionalDependencies })) {
    if (!dependency.startsWith('@deepseek-ai/')) thirdPartyNeeds.add(dependency)
  }
  const libraryDir = join(entry.dir, 'lib')
  if (!existsSync(libraryDir)) { fail(`${name} ships no lib/`); continue }
  for (const file of readdirSync(libraryDir)) {
    const path = join(libraryDir, file)
    if (!statSync(path).isFile() || !path.endsWith('.js')) continue
    if (file === 'client.js') { clientBundles.add(name); continue }
    // A tool definition names itself within the first few hundred bytes of the call.
    for (const match of readFileSync(path, 'utf8').matchAll(/defineTool\(\{[\s\S]{0,400}?name:\s*['"]([a-z][a-z0-9_]*)['"]/g)) {
      toolNames.set(match[1], name)
    }
  }
}
// typert-defined tools declare their name in a versioned descriptor, not through defineTool.
{
  const budget = packageIndex.get('@deepseek-ai/dsh-uma-task-budget')
  if (budget !== undefined) {
    const text = readFileSync(join(budget.dir, 'lib', 'index.js'), 'utf8')
    for (const match of text.matchAll(/name:\s*["'](uma_[a-z_]+)["']/g)) toolNames.set(match[1], '@deepseek-ai/dsh-uma-task-budget')
  }
}

for (const tool of EXPECTED_TOOLS) {
  if (!toolNames.has(tool)) fail(`tool no longer registered: ${tool}`)
}
for (const tool of toolNames.keys()) {
  if (!EXPECTED_TOOLS.includes(tool)) notes.push(`note: additional tool registered: ${tool} (${toolNames.get(tool)})`)
}
notes.push(`tools: ${toolNames.size} registered across ${new Set(toolNames.values()).size} packages`)

for (const name of injectedPackages) {
  const entry = packageIndex.get(name)
  if (entry === undefined) continue
  if (/dsh-client-ui-|dsh-client-uma-/.test(name) && !clientBundles.has(name)) {
    fail(`${name} is a client package without a prebuilt lib/client.js — the window would render no UMA UI`)
  }
}

// ------------------------------------- 4b. client composition reaches the window
//
// Client packages are not mounted by layer id alone: dsh-client-modules builds
// the browser module graph by scanning the Host Loader's entries for packages
// declaring `dsh.client`, and each graph row resolves its `inject` targets out of
// that same table. A client package that no layer mounts as an entry, or an
// inject target nothing provides, produces a window missing that UI with no
// error at build time — exactly the failure class this gate exists for.

/** Package names a layer file mounts as Host Loader entries. */
function collectEntryNames(files) {
  const names = new Set()
  for (const file of files) {
    for (const match of readFileSync(file, 'utf8').matchAll(/^\s*-?\s*name:\s*['"](@[^'"]+)['"]\s*$/gm)) names.add(match[1])
  }
  return names
}

const declaredNames = collectEntryNames(layerFiles)
const clientPackages = []
const unresolvedInject = new Map()
for (const name of injectedPackages) {
  const entry = packageIndex.get(name)
  const client = entry?.manifest.dsh?.client
  if (client === undefined) continue
  clientPackages.push(name)
  if (client.platform !== 'web') fail(`${name} declares dsh.client.platform = ${String(client.platform)}; the desktop profile is a web profile`)
  const mounted = declaredNames.has(name) || declaredIds.has(name.replace('@deepseek-ai/', ''))
  if (!mounted) fail(`${name} declares dsh.client but no desktop layer mounts it as an entry — its UI would never load`)
  for (const target of client.inject ?? []) {
    if (packageIndex.has(target)) continue
    const bucket = unresolvedInject.get(target) ?? []
    bucket.push(name)
    unresolvedInject.set(target, bucket)
  }
}
for (const [target, requesters] of unresolvedInject) {
  // UMA client packages inject each other; anything else must be a real package
  // in the composition or the browser module table cannot satisfy the row.
  if (!injectedPackages.includes(target) && !declaredNames.has(target)) {
    fail(`${target} is injected by ${requesters.join(', ')} but is not part of the composition`)
  }
}
notes.push(`client packages: ${clientPackages.length} mounted as loader entries, ${new Set([...clientPackages].flatMap(name => packageIndex.get(name)?.manifest.dsh?.client?.inject ?? [])).size} distinct inject targets resolve`)

// The extras import third-party packages that no composed upstream package
// declares, so the tree only carries them because uma-assets/deps tops it up.
if (TREE !== undefined) {
  for (const dependency of [...thirdPartyNeeds].sort()) {
    if (!existsSync(join(TREE, 'node_modules', dependency, 'package.json'))) {
      fail(`third-party dependency missing from the packaged tree: ${dependency}`)
    }
  }
  notes.push(`third-party closure: ${thirdPartyNeeds.size} packages present at tree root`)
}

// ----------------------------------- 5. skill container outside asar + locales

const skillPackage = packageIndex.get('@deepseek-ai/dsh-skill-uma')
if (skillPackage === undefined) fail('@deepseek-ai/dsh-skill-uma is missing from the composition')
else {
  const container = join(skillPackage.dir, 'resources.umadb')
  if (!existsSync(container)) fail('dsh-skill-uma/resources.umadb is missing — every bundled skill would fail to load')
  else notes.push(`skill container: ${(statSync(container).size / 1024 / 1024).toFixed(1)} MB`)
  const builderConfig = join(DSH_ROOT, 'apps', 'desktop', 'scripts', 'electron-builder-config.mjs')
  if (existsSync(builderConfig) && !readFileSync(builderConfig, 'utf8').includes('dsh-skill-uma/resources.umadb')) {
    fail('electron-builder-config.mjs no longer unpacks resources.umadb — node:sqlite cannot open a path inside app.asar')
  }
}

let localized = 0
for (const name of injectedPackages) {
  const entry = packageIndex.get(name)
  if (entry === undefined) continue
  const localeDir = join(entry.dir, 'locale')
  if (!existsSync(localeDir)) continue
  localized++
  const shipped = new Set(readdirSync(localeDir).filter(file => file.endsWith('.json')).map(file => file.replace(/\.json$/, '')))
  for (const locale of LOCALES) {
    if (!shipped.has(locale)) fail(`${name} is missing locale/${locale}.json (the Mac app ships eight languages)`)
  }
}
notes.push(`locales: ${localized} localized packages × ${LOCALES.length} languages`)

// ---------------------------------------------------------------------- report

for (const note of notes) console.log(`  ${note}`)
if (failures.length === 0) {
  console.log(`verify-uma-platform: OK — ${entries.length} switches, ${toolNames.size} tools, ${injectedPackages.length} packages`)
  process.exit(0)
}
for (const failure of failures) {
  console.error(`::error::verify-uma-platform: ${failure}`)
}
console.error(`verify-uma-platform: ${failures.length} failure(s)`)
process.exit(1)
