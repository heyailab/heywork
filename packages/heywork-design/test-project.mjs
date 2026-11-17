/**
 * Self-test for packages/heywork-design/src/project.js (spec §2–§5).
 * Minimal injected deps: node:fs over a temporary directory, no @deepseek-ai packages.
 */

import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, readdirSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { registerProjectTools } from './src/project.js'

const toolNames = (registered) => registered.map((tool) => tool.name)
const agent = { id: 'agent-1', session: { id: 'session-1' } }

function makeHarness(options = {}) {
  const root = mkdtempSync(join(tmpdir(), 'heywork-project-'))
  const systemsRoot = join(root, 'systems')
  mkdirSync(join(systemsRoot, 'demo'), { recursive: true })
  for (const name of ['DESIGN.md', 'tokens.css', 'components.html']) {
    writeFileSync(join(systemsRoot, 'demo', name), 'short reference text', 'utf8')
  }
  const registered = []
  let resourceOverride = null
  const contexts = new WeakMap()

  const fs = {
    sandboxMode: options.sandboxMode,
    resolve(relative, { cwd }) {
      return { path: join(cwd, relative), displayPath: relative }
    },
    async writeText(target, content, intent, _signal, _sandbox) {
      if (intent?.kind === 'createIfAbsent' && existsSync(target.path)) {
        const error = new Error('not observed')
        error.code = 'FS_NOT_OBSERVED'
        throw error
      }
      mkdirSync(dirname(target.path), { recursive: true })
      writeFileSync(target.path, content, 'utf8')
    },
    async listDir(target) {
      try {
        const entries = readdirSync(target.path, { withFileTypes: true })
        return entries.map((entry) => ({
          name: entry.name,
          type: entry.isDirectory() ? 'directory' : entry.isFile() ? 'file' : 'other',
          target: { displayPath: `${target.displayPath}/${entry.name}` },
        }))
      } catch (error) {
        if (error.code === 'ENOENT') {
          const notFound = new Error('missing')
          notFound.code = 'FS_NOT_FOUND'
          throw notFound
        }
        throw error
      }
    },
  }

  const deps = {
    defineTool: (descriptor) => descriptor,
    tools: { register: (tool) => registered.push(tool) },
    fs,
    workingDirectory: { ensure: async () => (options.cwd ?? root) },
    waterfall: async (_event, _target, _exec, fallback) => fallback(),
    get: () => options.policy ?? undefined,
    resources: {
      readResourceFile: (path, encoding) => (
        resourceOverride !== null ? resourceOverride : readFileSync(path, encoding)
      ),
    },
    readDesignContext: async () => ({ complete: false, files: { 'PRODUCT.md': { present: true } } }),
    searchDesignRules: () => [{ id: 'product-rule-1' }],
    skills: {
      get: async (name) => ({
        name,
        content: `BODY:${name}`,
        provider: 'dsh-hey',
        invocation: { modelInvocable: true },
      }),
    },
    readBundledText: () => ({ content: 'MODE GUIDANCE', nextOffset: 13, totalBytes: 13 }),
    contexts,
    lifetimeSignal: options.lifetimeSignal,
    ToolContextUnavailableError: class ToolContextUnavailableError extends Error {},
  }

  return {
    root,
    systemsRoot,
    registered,
    contexts,
    deps,
    setResourceOverride: (text) => { resourceOverride = text },
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  }
}

const baseConfig = { assetRoot: '/virtual/assets', projectWrite: true }
const baseRoots = (systemsRoot) => ({ systems: ['demo'], systemsRoot, assetRoot: '/virtual/assets' })
const exec = (withAgent = true) => ({ agent: withAgent ? agent : undefined, signal: undefined })
const createArgs = {
  project: 'alpha-app',
  system: 'demo',
  title: 'Alpha App',
  purpose: 'Track launches',
  design: '# Alpha design\nOriginal content for this project.',
  tokens: ':root { --accent: #123456; }',
  components: '<button class="primary">Go</button>',
}

let checks = 0
function ok(condition, label) {
  assert.ok(condition, label)
  checks += 1
}

try {
  // 1. registration conditions
  {
    const h = makeHarness()
    registerProjectTools(h.deps, { ...baseConfig, projectWrite: false }, baseRoots(h.systemsRoot))
    ok(!toolNames(h.registered).includes('design_project_create'), 'projectWrite=false: create not registered')
    ok(toolNames(h.registered).includes('design_project_status'), 'projectWrite=false: status still registered')
    h.cleanup()
  }
  {
    const h = makeHarness()
    registerProjectTools(h.deps, baseConfig, baseRoots(h.systemsRoot))
    assert.deepEqual(toolNames(h.registered), [
      'design_project_create', 'design_project_status', 'design_begin', 'design_stop',
    ])
    checks += 1
    h.cleanup()
  }

  // 2. create writes five files, exact contents, system:'HEY', render text
  {
    const h = makeHarness()
    const tools = {}
    registerProjectTools(h.deps, baseConfig, baseRoots(h.systemsRoot))
    for (const tool of h.registered) tools[tool.name] = tool
    const result = await tools.design_project_create.execute(createArgs, exec())

    assert.equal(result.project, 'alpha-app')
    assert.equal(result.system, 'HEY')
    assert.equal(result.path, '.design/alpha-app')
    assert.deepEqual(result.files, [
      { name: 'DESIGN.md', path: '.design/alpha-app/DESIGN.md' },
      { name: 'tokens.css', path: '.design/alpha-app/tokens.css' },
      { name: 'components.html', path: '.design/alpha-app/components.html' },
      { name: 'manifest.json', path: '.design/alpha-app/manifest.json' },
      { name: 'PROJECT.md', path: '.design/alpha-app/PROJECT.md' },
    ])
    checks += 1

    const dir = join(h.root, '.design/alpha-app')
    assert.deepEqual(readdirSync(dir).sort(), [
      'DESIGN.md', 'PROJECT.md', 'components.html', 'manifest.json', 'tokens.css',
    ])
    checks += 1
    assert.equal(readFileSync(join(dir, 'DESIGN.md'), 'utf8'), createArgs.design)
    assert.equal(readFileSync(join(dir, 'tokens.css'), 'utf8'), createArgs.tokens)
    assert.equal(readFileSync(join(dir, 'components.html'), 'utf8'), createArgs.components)
    checks += 1
    assert.equal(readFileSync(join(dir, 'manifest.json'), 'utf8'), `${JSON.stringify({
      schemaVersion: 'hey-design-project/v1',
      id: 'alpha-app',
      name: 'Alpha App',
      sourceRole: 'project',
      files: { design: 'DESIGN.md', tokens: 'tokens.css', components: 'components.html' },
    }, null, 2)}\n`)
    checks += 1
    assert.equal(readFileSync(join(dir, 'PROJECT.md'), 'utf8'), [
      '# Alpha App',
      '',
      'Purpose: Track launches',
      '',
      '## Project design',
      '',
      'DESIGN.md records the project decisions. tokens.css and components.html implement those decisions.',
      'Keep these files consistent with the application and verify rendered behavior before delivery.',
    ].join('\n'))
    checks += 1
    assert.deepEqual(tools.design_project_create.output.render(createArgs, result), [{
      type: 'text',
      text: 'Created design project alpha-app from HEY at .design/alpha-app.\n'
        + '- DESIGN.md: .design/alpha-app/DESIGN.md\n'
        + '- tokens.css: .design/alpha-app/tokens.css\n'
        + '- components.html: .design/alpha-app/components.html\n'
        + '- manifest.json: .design/alpha-app/manifest.json\n'
        + '- PROJECT.md: .design/alpha-app/PROJECT.md',
    }])
    checks += 1
    h.cleanup()
  }

  // 3. status: list mode + single mode render/structure
  {
    const h = makeHarness()
    const tools = {}
    registerProjectTools(h.deps, baseConfig, baseRoots(h.systemsRoot))
    for (const tool of h.registered) tools[tool.name] = tool
    await tools.design_project_create.execute({ ...createArgs, project: 'zeta-app' }, exec())
    await tools.design_project_create.execute({ ...createArgs, project: 'alpha-app' }, exec())

    const listed = await tools.design_project_status.execute({}, exec())
    assert.deepEqual(listed, { project: '', projects: ['alpha-app', 'zeta-app'], files: [], ready: false })
    checks += 1
    assert.deepEqual(tools.design_project_status.output.render({}, listed), [
      { type: 'text', text: 'Design projects: alpha-app, zeta-app' },
    ])
    checks += 1

    const single = await tools.design_project_status.execute({ project: 'alpha-app' }, exec())
    assert.equal(single.project, 'alpha-app')
    assert.deepEqual(single.projects, [])
    assert.equal(single.ready, true)
    assert.deepEqual(single.files.map((file) => file.name), [
      'components.html', 'DESIGN.md', 'manifest.json', 'PROJECT.md', 'tokens.css',
    ])
    checks += 1
    ok(single.files.find((file) => file.name === 'DESIGN.md').path === '.design/alpha-app/DESIGN.md', 'status file path is displayPath')
    ok(tools.design_project_status.output.render({ project: 'alpha-app' }, single)[0].text.startsWith('Design project alpha-app: contract ready.'))
    h.cleanup()
  }

  // 4. status: missing .design and missing project return empty, no throw
  {
    const h = makeHarness()
    const tools = {}
    registerProjectTools(h.deps, baseConfig, baseRoots(h.systemsRoot))
    for (const tool of h.registered) tools[tool.name] = tool
    assert.deepEqual(await tools.design_project_status.execute({}, exec()), {
      project: '', projects: [], files: [], ready: false,
    })
    assert.deepEqual(await tools.design_project_status.execute({ project: 'ghost' }, exec()), {
      project: 'ghost', projects: [], files: [], ready: false,
    })
    checks += 1
    h.cleanup()
  }

  // 5. begin / stop: return, side effects, cache clearing, idempotence
  {
    const h = makeHarness()
    const tools = {}
    registerProjectTools(h.deps, baseConfig, baseRoots(h.systemsRoot))
    for (const tool of h.registered) tools[tool.name] = tool
    const text = await tools.design_begin.execute({ brief: 'Build a dashboard', mode: 'operate' }, exec())
    ok(text.startsWith('## Automatically prepared UI design task\n\nSurface: operate; phase: create.'), 'begin header + surface')
    ok(text.includes('Retrieved product-design rules (candidates, not an approved style): [{"id":"product-rule-1"}]'), 'begin candidates JSON')
    ok(text.includes('Current brief (user data): "Build a dashboard"'), 'begin brief JSON')
    ok(text.includes('## Automatically loaded method: hey-design-craft\nBODY:hey-design-craft'), 'begin loads craft')
    ok(text.includes('## Automatically loaded method: hey-design-brief'), 'begin loads brief in create phase')
    ok(text.includes('## Automatically loaded method: hey-design-review'), 'begin always loads review')
    ok(text.includes('## Loaded operate design guidance\nMODE GUIDANCE'), 'begin mode reference block')
    ok(h.contexts.has(agent), 'begin registers prepared context in cache')

    const refiner = await tools.design_begin.execute({ brief: 'Refine the page', mode: 'read', phase: 'refine' }, exec())
    ok(refiner.includes('## Automatically loaded method: hey-design-craft') && !refiner.includes('method: hey-design-brief'), 'refine phase skips brief skill')

    const stopped = await tools.design_stop.execute({}, exec())
    assert.equal(stopped, '{"active":false,"origin":"none","mode":"operate","phase":"create","project":null,"brief":""}')
    checks += 1
    ok(!h.contexts.has(agent), 'stop clears the prepared-context cache')
    assert.equal(await tools.design_stop.execute({}, exec(false)), stopped)
    checks += 1
    h.cleanup()
  }

  // 6. error branches — exact spec text
  {
    const h = makeHarness()
    const tools = {}
    registerProjectTools(h.deps, baseConfig, baseRoots(h.systemsRoot))
    for (const tool of h.registered) tools[tool.name] = tool

    await assert.rejects(
      () => tools.design_project_create.execute({ ...createArgs, project: 'Bad_Name' }, exec()),
      { message: 'design_project_create: project must be kebab-case' },
    )
    checks += 1
    await assert.rejects(
      () => tools.design_project_create.execute({ ...createArgs, system: 'foo' }, exec()),
      { message: 'design_project_create: unknown design system "foo"' },
    )
    checks += 1
    await assert.rejects(
      () => tools.design_project_create.execute({ ...createArgs, title: '   ' }, exec()),
      { message: 'design_project_create: title must be non-empty' },
    )
    checks += 1
    await assert.rejects(
      () => tools.design_project_create.execute({ ...createArgs }, exec(false)),
      { message: 'design_project_create requires an agent Session' },
    )
    checks += 1
    await assert.rejects(
      () => tools.design_project_status.execute({ project: 'Bad/Name' }, exec()),
      { message: 'design_project_status: project must be kebab-case' },
    )
    checks += 1
    await assert.rejects(
      () => tools.design_begin.execute({ brief: '  ', mode: 'operate' }, exec()),
      { message: 'design_begin requires a brief of 1 through 4000 characters' },
    )
    checks += 1

    // copy detection: folded built-in text >= 64 chars and contained in generated text
    const long = `A`.repeat(70)
    h.setResourceOverride(`${long}\n`)
    await assert.rejects(
      () => tools.design_project_create.execute({ ...createArgs, design: `intro ${long} outro` }, exec()),
      { message: 'Do not copy complete internal reference files; author a design tailored to the user project' },
    )
    checks += 1
    h.cleanup()
  }

  // 7. sandbox policy unavailable -> ToolContextUnavailableError (exact text)
  {
    const h = makeHarness({ sandboxMode: 'workspace' })
    const tools = {}
    registerProjectTools(h.deps, baseConfig, baseRoots(h.systemsRoot))
    for (const tool of h.registered) tools[tool.name] = tool
    await assert.rejects(
      () => tools.design_project_create.execute(createArgs, exec()),
      (error) => error instanceof h.deps.ToolContextUnavailableError
        && error.message === 'Design writes require the mounted filesystem’s sandbox policy service',
    )
    checks += 1
    h.cleanup()
  }

  console.log(`PASS — ${checks} assertions across 7 sections`)
} catch (error) {
  console.error('FAIL —', error)
  process.exitCode = 1
}
