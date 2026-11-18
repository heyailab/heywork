#!/usr/bin/env node
/**
 * build-profile.mjs — 把重写的 @heywork/* 包组装成 V1 profile/bundle。
 *
 * V1 形态（V1-PLAN.md §3）：官方 dsh 壳零补丁，heywork 作为一个 bundle
 * 挂进官方 profile。本脚本纯 Node 文件操作，不依赖 pnpm，可在 Mac/Windows 跑。
 *
 * 格式依据（deepseek-harness@39163dd 源码实证，非推测）：
 *   - initProfile(): packages/boot/app-boot/src/profile.ts:198
 *       profile = package.json{dsh.profile.bundles:[...]} + cordis.patch.yml([])
 *                 + pnpm-workspace.yaml + cordis.yml
 *       PROFILE_PATCH_TEMPLATE / PROFILE_PNPM_WORKSPACE 见同文件 :174/:184
 *   - bundle 夹具: packages/boot/plugin-manager/tests/manager.spec.ts:52
 *       node_modules/<name>/package.json{dsh.bundle.patch:'./cordis.patch.yml'}
 *       + cordis.patch.yml([{insert:[rows]}]) + plugin.mjs
 *   - patch row: `name` 是 npm 包名，cordis 加载其默认导出/export function apply
 *
 * 用法：
 *   node scripts/build-profile.mjs [--out <dir>] [--assets <dir>] [--verify-only]
 * 默认 --out = <root>/profile-build, --assets = <root>
 */
import {
  mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, readdirSync, statSync,
} from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const arg = (n, f) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : f }
const OUT = resolve(arg('--out', join(ROOT, 'profile-build')))
const ASSETS = resolve(arg('--assets', ROOT))
const VERIFY_ONLY = process.argv.includes('--verify-only')

// profile 的模板常量——逐字取自官方源码（见文件头证据）
const PROFILE_PATCH_TEMPLATE = `# Your patch layer for this dsh profile, applied after every bundle layer:
# a top-level YAML array of loader patch entries (id-targeted config
# overrides, disables, and insert lists; \`!!js\` expressions allowed).
[]
`
const PROFILE_PNPM_WORKSPACE = `packages:
  - .

nodeLinker: hoisted
autoInstallPeers: false
`

// 9 个重写包 → patch row。id 用 @heywork 的插件 id；name 指向包名。
// 依据：cordis patch row = {id, name, [disabled], [config]}。
const PACKAGES = [
  { dir: 'heywork-skill', name: '@heywork/skill', id: 'hey-skill', client: false },
  { dir: 'heywork-design', name: '@heywork/design', id: 'hey-design', client: false },
  { dir: 'heywork-workflow', name: '@heywork/workflow', id: 'hey-workflow', client: false },
  { dir: 'heywork-delivery', name: '@heywork/delivery', id: 'hey-delivery', client: false, libOnly: true },
  { dir: 'heywork-budget', name: '@heywork/budget', id: 'hey-budget', client: false },
  { dir: 'heywork-knowledge', name: '@heywork/knowledge', id: 'hey-knowledge', client: false },
  { dir: 'heywork-task-query', name: '@heywork/task-query', id: 'hey-task-query', client: false },
  { dir: 'heywork-wiki', name: '@heywork/wiki', id: 'hey-wiki', client: false },
  { dir: 'heywork-coding', name: '@heywork/coding', id: 'hey-coding', client: false },
  { dir: 'heywork-ui', name: '@heywork/ui', id: 'hey-ui', client: true },
]

function writeIfAbsent(path, content) {
  if (!existsSync(path)) writeFileSync(path, content)
}

function build() {
  mkdirSync(OUT, { recursive: true })

  // 1. profile 骨架
  const profileManifest = {
    name: 'dsh-profile-heywork',
    private: true,
    dependencies: { heywork: '0.1.0' },
    dsh: { profile: { bundles: ['heywork'] } },
  }
  writeIfAbsent(join(OUT, 'package.json'), JSON.stringify(profileManifest, undefined, 2) + '\n')
  writeIfAbsent(join(OUT, 'cordis.patch.yml'), PROFILE_PATCH_TEMPLATE)
  writeIfAbsent(join(OUT, 'pnpm-workspace.yaml'), PROFILE_PNPM_WORKSPACE)
  writeIfAbsent(join(OUT, 'cordis.yml'), '[]\n')

  // 2. heywork bundle
  const bundleDir = join(OUT, 'node_modules', 'heywork')
  const bundleModules = join(bundleDir, 'node_modules')
  mkdirSync(bundleModules, { recursive: true })

  const bundleManifest = {
    name: 'heywork',
    version: '0.1.0',
    private: true,
    type: 'module',
    description: 'HeyWork rewritten feature layer — V1 profile bundle',
    dsh: { bundle: { patch: './cordis.patch.yml' } },
    dependencies: Object.fromEntries(PACKAGES.map(p => [p.name, '0.1.0'])),
  }
  writeFileSync(join(bundleDir, 'package.json'), JSON.stringify(bundleManifest, undefined, 2) + '\n')

  // 3. bundle patch rows（Host 插件；UI 走 ./client，不放 host patch）
  const rows = PACKAGES.filter(p => !p.client && !p.libOnly).map(p => ({ id: p.id, name: p.name }))
  writeFileSync(join(bundleDir, 'cordis.patch.yml'),
    JSON.stringify([{ insert: rows }], null, 2) + '\n')

  // 4. 复制 @heywork/* 包 + UI client 模块
  const copied = []
  for (const p of PACKAGES) {
    const src = join(ASSETS, 'packages', p.dir)
    if (!existsSync(src)) { console.error(`MISSING package: ${src}`); process.exit(1) }
    const scopeDir = join(bundleModules, '@heywork')
    mkdirSync(scopeDir, { recursive: true })
    const dst = join(scopeDir, p.dir.replace(/^heywork-/, ''))
    cpSync(src, dst, { recursive: true, force: true })
    copied.push({ name: p.name, dir: dst })
  }

  // 4b. 技能容器数据：heywork-skill 用 locate() 从 <skillRoot>/assets 向上找
  // 同级 resources.umadb。这是只读加密资产，直接从旧技能包复制过来（不重加密）。
  const skillDst = join(bundleModules, '@heywork', 'skill')
  const skillSrc = join(ASSETS, 'uma-assets', 'packages', 'dsh-skill-uma')
  const umadbSrc = join(skillSrc, 'resources.umadb')
  if (existsSync(umadbSrc)) {
    mkdirSync(join(skillDst, 'assets'), { recursive: true })
    cpSync(umadbSrc, join(skillDst, 'resources.umadb'))
    // assets/ 目录保持为空是契约：locate() 命中容器而非明文磁盘（见 README 已知坑）
  } else {
    console.error(`WARN: skill container not found at ${umadbSrc} — skill reads will fail`)
  }

  // 5. 为 UI client 模块补 dsh.client 声明（重写包目前缺，Loader 需要它扫 ./client）
  const uiPkg = join(bundleModules, '@heywork', 'ui')
  const uiManifestPath = join(uiPkg, 'package.json')
  if (existsSync(uiManifestPath)) {
    const m = JSON.parse(readFileSync(uiManifestPath, 'utf8'))
    const clientFiles = readdirSync(join(uiPkg, 'src')).filter(f => f.endsWith('.client.js'))
    m.dsh = {
      ...(m.dsh ?? {}),
      client: {
        entry: './src/index.client.js',
        modules: clientFiles.map(f => `./src/${f}`),
        platform: 'web',
      },
    }
    m.exports = { ...(m.exports ?? {}), '.': './src/index.js', './client': './src/index.client.js' }
    writeFileSync(uiManifestPath, JSON.stringify(m, undefined, 2) + '\n')
    // 生成一个 client 汇总入口，import 各模块（浏览器 Loader 会执行 __ModuleLoader__.load）
    const barrel = [
      '// auto-generated by build-profile.mjs — registers all HeyWork client modules',
      ...clientFiles.map(f => `import './${f}'`),
    ].join('\n')
    writeFileSync(join(uiPkg, 'src', 'index.client.js'), barrel + '\n')
  }

  // 6. compatibility.json（版本豁免——跨官方升级时的安全带）
  const compat = {
    protocol: { hostProtocolVersion: '0.2.2-rc.3' },
    exemptions: [],
    note: 'Empty by default. Add per-release version exemptions here when the official dsh protocol drifts.',
  }
  writeFileSync(join(OUT, 'compatibility.json'), JSON.stringify(compat, undefined, 2) + '\n')

  console.log(`built: ${OUT}`)
  console.log(`  profile bundles: ${profileManifest.dsh.profile.bundles.join(', ')}`)
  console.log(`  host patch rows: ${rows.length} (${rows.map(r => r.id).join(', ')})`)
  console.log(`  packages copied: ${copied.length}`)
  const clientCount = existsSync(uiManifestPath)
    ? readdirSync(join(uiPkg, 'src')).filter(f => f.endsWith('.client.js') && f !== 'index.client.js').length
    : 0
  console.log(`  ui client modules: ${clientCount} (+1 barrel)`)
}

function verify() {
  const problems = []
  const req = (cond, msg) => { if (!cond) problems.push(msg) }
  const pj = join(OUT, 'package.json')
  req(existsSync(pj), 'profile package.json missing')
  if (existsSync(pj)) {
    const m = JSON.parse(readFileSync(pj, 'utf8'))
    req(m.dsh?.profile?.bundles?.includes('heywork'), 'profile does not list heywork bundle')
  }
  for (const f of ['cordis.patch.yml', 'pnpm-workspace.yaml', 'cordis.yml', 'compatibility.json']) {
    req(existsSync(join(OUT, f)), `${f} missing`)
  }
  const bundleDir = join(OUT, 'node_modules', 'heywork')
  req(existsSync(join(bundleDir, 'package.json')), 'bundle package.json missing')
  req(existsSync(join(bundleDir, 'cordis.patch.yml')), 'bundle patch missing')
  if (existsSync(join(bundleDir, 'cordis.patch.yml'))) {
    const patch = JSON.parse(readFileSync(join(bundleDir, 'cordis.patch.yml'), 'utf8'))
    req(Array.isArray(patch) && patch[0]?.insert?.length >= 8, 'bundle patch rows < 8')
  }
  for (const p of PACKAGES) {
    const sub = p.dir.replace(/^heywork-/, '')
    const dst = join(bundleDir, 'node_modules', '@heywork', sub)
    req(existsSync(dst), `package not copied: @heywork/${sub}`)
    req(existsSync(join(dst, 'package.json')), `package.json missing: @heywork/${sub}`)
  }
  // 技能容器必须随包走，否则 20 技能读不到
  req(existsSync(join(bundleDir, 'node_modules', '@heywork', 'skill', 'resources.umadb')),
      'skill resources.umadb missing — skill reads will fail')

  const uiBarrel = join(bundleDir, 'node_modules', '@heywork', 'ui', 'src', 'index.client.js')
  req(existsSync(uiBarrel), 'ui client barrel missing')
  if (existsSync(uiBarrel)) {
    const n = (readFileSync(uiBarrel, 'utf8').match(/import /g) ?? []).length
    req(n === 7, `ui client barrel imports ${n} modules, expected 7`)
  }

  if (problems.length) {
    console.error('VERIFY FAILED:')
    problems.forEach(p => console.error('  - ' + p))
    process.exit(1)
  }
  console.log(`verify OK — profile/bundle structure self-consistent (${PACKAGES.length} packages, 7 client modules)`)
}

if (VERIFY_ONLY) verify()
else { build(); verify() }
