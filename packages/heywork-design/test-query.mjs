/**
 * Self-test for packages/heywork-design/src/query.js.
 *
 * Minimal injected deps: defineTool is a passthrough, fs is node:fs,
 * resources is the real rewritten @heywork/skill layer, assetRoot points at
 * uma-assets/packages/dsh-skill-uma/assets.
 *
 * Run: node packages/heywork-design/test-query.mjs
 */
import assert from 'node:assert/strict'
import nodeFs, {
  mkdirSync, mkdtempSync, rmSync, writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve as pathResolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { registerQueryTools } from './src/query.js'
import * as resources from '../heywork-skill/src/resources.js'

const repoRoot = pathResolve(fileURLToPath(new URL('../../', import.meta.url)))
const assetRoot = join(repoRoot, 'uma-assets/packages/dsh-skill-uma/assets')
const systemsRoot = join(assetRoot, 'uma-design-systems/systems')
const referencesRoot = join(assetRoot, 'uma-design-md/brands')

const childDirs = (path) => resources.listResourceDirectory(path, { withFileTypes: true })
  .filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
const chosenNames = ['apple', 'airbnb', 'stripe', 'figma', 'notion', 'default']
const allSystems = childDirs(systemsRoot)
const chosenSystems = chosenNames.filter((name) => allSystems.includes(name))
const references = childDirs(referencesRoot)
assert.equal(chosenSystems.length, 6, 'fixture systems must exist in the container')

const exec = { agent: { session: {} }, signal: new AbortController().signal }
const noAgent = { signal: new AbortController().signal }

function makeDeps(workDir) {
  const registered = []
  const sections = []
  return {
    registered,
    sections,
    deps: {
      defineTool: (descriptor) => descriptor,
      tools: { register: (tool) => registered.push(tool) },
      fs: nodeFs,
      workingDirectory: { ensure: async () => workDir },
      resources,
      systemPrompt: { section: (section) => sections.push(section) },
    },
  }
}

function toolByName(registered, name) {
  const tool = registered.find((entry) => entry.name === name)
  assert.ok(tool, `tool ${name} must be registered`)
  return tool
}

function expectThrow(fn, expected) {
  assert.throws(fn, (error) => {
    assert.equal(error.message, expected)
    return true
  })
}

async function expectReject(fn, expected) {
  await assert.rejects(fn, (error) => {
    assert.equal(error.message, expected)
    return true
  })
}

const workDir = mkdtempSync(join(tmpdir(), 'query-ctx-'))
const fixtures = []
try {
  // ----- 1) registration -----------------------------------------------------
  const host = makeDeps(workDir)
  registerQueryTools(host.deps, {}, {
    assetRoot,
    systemsRoot,
    referencesRoot,
    systems: chosenSystems,
    references,
    knowledge: [],
  })
  const { registered, sections } = host
  assert.equal(registered.length, 4)
  assert.deepEqual(registered.map((tool) => tool.name), [
    'design_context',
    'design_rule_search',
    'design_asset_list',
    'design_asset_get',
  ])
  assert.equal(sections.length, 1)
  assert.equal(sections[0].name, 'native-design-workflow')
  assert.equal(sections[0].order, 112)
  assert.ok(sections[0].text.startsWith('## Native UI design workflow\nFor UI work, call design_context before changing visuals'))
  assert.ok(sections[0].text.endsWith('Do not start another agent runtime or copy third-party logos to satisfy a reference.'))
  assert.ok(sections[0].text.length > 2000)
  expectThrow(
    () => registerQueryTools(host.deps, {}, {
      assetRoot: 'relative/assets', systemsRoot, referencesRoot,
      systems: chosenSystems, references, knowledge: [],
    }),
    'tool-hey-design: assetRoot must be an absolute directory',
  )

  // descriptor shapes (schema fields are checked per-field as the spec requires)
  const contextTool = toolByName(registered, 'design_context')
  const ruleTool = toolByName(registered, 'design_rule_search')
  const listTool = toolByName(registered, 'design_asset_list')
  const getTool = toolByName(registered, 'design_asset_get')
  assert.deepEqual(contextTool.output.schema, { type: 'string' })
  assert.deepEqual(ruleTool.output.schema, { type: 'string' })
  assert.equal(listTool.output.schema.additionalProperties, false)
  assert.deepEqual(Object.keys(listTool.output.schema.properties), [
    'systems', 'references', 'total', 'catalogSize', 'offset', 'nextOffset',
  ])
  assert.equal(getTool.output.schema.properties.files.items.additionalProperties, false)
  assert.deepEqual(ruleTool.parameters.domain.enum, [
    'ux', 'web', 'react', 'style', 'color', 'typography', 'chart', 'motion',
    'product', 'layout', 'reasoning', 'icons', 'stack',
  ])
  assert.equal(ruleTool.parameters.query.required, true)
  assert.deepEqual(getTool.parameters.kind.enum, ['system', 'reference'])
  assert.deepEqual(getTool.parameters.include.items.enum, ['design', 'tokens', 'components', 'manifest'])
  assert.deepEqual(listTool.presentCall({}), { card: 'generic', title: 'List design assets', kind: 'other' })
  assert.deepEqual(contextTool.presentCall({ target: 'apps/web' }), {
    card: 'generic', title: 'Read project design context', kind: 'search', rawInput: { target: 'apps/web' },
  })

  // ----- 2) design_asset_list ------------------------------------------------
  const listed = await listTool.execute({}, exec)
  assert.equal(listed.total, 6)
  assert.equal(listed.catalogSize, 6)
  assert.equal(listed.offset, 0)
  assert.equal(listed.systems.length, 6)
  assert.ok(listed.systems.every((s) => typeof s.name === 'string' && typeof s.category === 'string' && typeof s.description === 'string'))
  assert.ok(listed.references.includes('apple'))
  assert.equal(listed.nextOffset, undefined)
  const listText = listTool.output.render({}, listed)[0].text
  assert.ok(listText.startsWith('Design systems:\n'))
  assert.ok(listText.includes('Catalog total: 6; offset: 0; next offset: none'))
  assert.ok(listText.includes(`DESIGN.md references: ${listed.references.join(', ')}`))

  const paged = await listTool.execute({ offset: 1, limit: 2 }, exec)
  assert.equal(paged.systems.length, 2)
  assert.equal(paged.nextOffset, 3)
  const appleHit = await listTool.execute({ query: 'apple' }, exec)
  assert.ok(appleHit.systems.some((s) => s.name === 'apple'))
  const noHit = await listTool.execute({ category: '__no_such_category__' }, exec)
  assert.equal(noHit.total, 0)
  assert.ok(listTool.output.render({}, noHit)[0].text.includes('No systems matched. Shorten the query or omit filters to browse the installed catalog.'))

  expectThrow(() => listTool.execute({ offset: -1 }, exec), 'design_asset_list: offset must be a nonnegative integer')
  expectThrow(() => listTool.execute({ limit: 101 }, exec), 'design_asset_list: limit must be a positive integer within catalogMaxPageSize')

  // ----- 3) design_asset_get -------------------------------------------------
  const systemAsset = await getTool.execute({ kind: 'system', name: 'apple' }, exec)
  assert.equal(systemAsset.kind, 'system')
  assert.equal(systemAsset.name, 'apple')
  assert.deepEqual(systemAsset.files.map((file) => file.name), ['DESIGN.md', 'tokens.css'])
  assert.equal(systemAsset.files[0].path, 'hey-design://systems/apple/DESIGN.md')
  assert.ok(systemAsset.files[0].content.length > 0)
  assert.equal(typeof systemAsset.files[0].truncated, 'boolean')
  const systemRender = getTool.output.render({ kind: 'system', name: 'apple' }, systemAsset)
  assert.equal(systemRender.length, 2)
  assert.ok(systemRender[0].text.startsWith('## hey-design://systems/apple/DESIGN.md\n\n'))
  assert.deepEqual(getTool.output.presentationMeta({ kind: 'system', name: 'apple' }, systemAsset), {
    kind: 'hey-public-design-reference',
    version: 1,
    title: 'Apple',
    hasDesign: true,
    hasTokens: true,
    hasComponents: false,
    partial: false,
  })

  const referenceAsset = await getTool.execute({ kind: 'reference', name: 'apple', include: ['design', 'tokens'] }, exec)
  assert.deepEqual(referenceAsset.files.map((file) => file.name), ['DESIGN.md'])
  assert.equal(referenceAsset.files[0].path, 'hey-design://brands/apple/DESIGN.md')
  assert.equal(getTool.output.presentationMeta({ kind: 'reference', name: 'apple' }, referenceAsset), null)
  assert.deepEqual(
    getTool.output.render({}, { kind: 'system', name: 'empty', files: [] })[0].text,
    'No readable files for system empty.',
  )

  expectThrow(
    () => getTool.execute({ kind: 'system', name: 'not-a-system' }, exec),
    'unknown system "not-a-system"; call design_asset_list for valid names',
  )
  expectThrow(
    () => getTool.execute({ kind: 'reference', name: 'not-a-brand' }, exec),
    'unknown reference "not-a-brand"; call design_asset_list for valid names',
  )

  // ----- 4) design_context: errors + normal path -----------------------------
  await expectReject(() => contextTool.execute({}, noAgent), 'design_context requires an agent Session')
  await expectReject(() => contextTool.execute({ target: '../x' }, exec), 'design_context: target must be a relative directory without parent segments')
  await expectReject(() => contextTool.execute({ project: 'Bad_Name' }, exec), 'design_context: project must be kebab-case')
  await expectReject(() => contextTool.execute({ page: 'page-one' }, exec), 'design_context: page requires an explicit project and a kebab-case page id')

  writeFileSync(join(workDir, 'PRODUCT.md'), 'Acme product\n')
  writeFileSync(join(workDir, 'DESIGN.md'), '# Design\n')
  writeFileSync(join(workDir, 'package.json'), JSON.stringify({ dependencies: { react: '^18', lodash: '^4' } }))
  mkdirSync(join(workDir, 'DESIGN.json'))
  mkdirSync(join(workDir, 'apps'))
  writeFileSync(join(workDir, 'apps', 'DESIGN.md'), '# App design\n')
  const contextRaw = await contextTool.execute({ target: 'apps' }, exec)
  const context = JSON.parse(contextRaw)
  assert.equal(context.target, 'apps')
  assert.equal(context.project, '')
  assert.equal(context.declaredStack[0], 'react')
  assert.equal(context.hasDesign, true)
  assert.equal(context.complete, false, 'a non-file input makes the result incomplete')
  assert.match(context.fingerprint, /^[0-9a-f]{64}$/)
  assert.equal(context.files.find((file) => file.path === 'DESIGN.json').state, 'non-file')
  assert.equal(context.files.find((file) => file.path === 'PRODUCT.md').state, 'read')
  assert.equal(context.files.find((file) => file.path === 'apps/DESIGN.md').state, 'read')
  assert.equal(context.files.find((file) => file.path === 'apps/package.json').state, 'missing')
  assert.deepEqual(contextTool.output.render({}, contextRaw), [{ type: 'text', text: contextRaw }])

  // ----- 5) design_rule_search -----------------------------------------------
  // Spec §3.3 derives the rules root as `<assetRoot>/uma-design-system/data`,
  // while this container ships the CSVs under `uma-design-system/data`.
  // A spec-conformant fixture (see report) exercises the normal path here.
  expectThrow(
    () => ruleTool.execute({ domain: 'ux', stack: 'react', query: 'focus' }, exec),
    'design_rule_search: stack is accepted only for the stack domain',
  )

  const ruleFixture = mkdtempSync(join(tmpdir(), 'query-rules-'))
  fixtures.push(ruleFixture)
  const dataDir = join(ruleFixture, 'uma-design-system', 'data')
  mkdirSync(join(dataDir, 'stacks'), { recursive: true })
  for (const file of ['ux-guidelines.csv', 'stacks/react.csv']) {
    writeFileSync(
      join(dataDir, file),
      resources.readResourceFile(join(assetRoot, 'uma-design-system/data', file), 'utf8'),
    )
  }
  const ruleHost = makeDeps(workDir)
  registerQueryTools(ruleHost.deps, {}, {
    assetRoot: ruleFixture,
    systemsRoot,
    referencesRoot,
    systems: chosenSystems,
    references,
    knowledge: [],
  })
  const fixtureRuleTool = toolByName(ruleHost.registered, 'design_rule_search')
  const hits = JSON.parse(await fixtureRuleTool.execute({ query: 'smooth scroll', domain: 'ux', limit: 2 }, exec))
  assert.ok(Array.isArray(hits) && hits.length > 0 && hits.length <= 2)
  assert.equal(hits[0].source, 'uma-design-system/data/ux-guidelines.csv')
  assert.equal(typeof hits[0].row, 'number')
  assert.equal(typeof hits[0].fields, 'object')
  assert.ok(typeof hits[0].fields['Issue'] === 'string')
  assert.ok(hits[0].score > 0)
  assert.deepEqual(fixtureRuleTool.presentCall({ query: 'smooth scroll', domain: 'ux' }), {
    card: 'generic', title: 'Search design rules', kind: 'search',
    rawInput: { query: 'smooth scroll', domain: 'ux' },
  })

  const zhHits = JSON.parse(await fixtureRuleTool.execute({ query: '键盘 焦点', domain: 'ux', limit: 1 }, exec))
  assert.ok(zhHits.length > 0)
  expectThrow(
    () => fixtureRuleTool.execute({ query: '!!! ???', domain: 'ux' }, exec),
    'design_rule_search: query must contain searchable words',
  )
  expectThrow(
    () => fixtureRuleTool.execute({ query: 'react', domain: 'stack' }, exec),
    'design_rule_search: choose an available stack: react',
  )

  const badCsvDir = mkdtempSync(join(tmpdir(), 'query-badcsv-'))
  fixtures.push(badCsvDir)
  const badDataDir = join(badCsvDir, 'uma-design-system', 'data')
  mkdirSync(badDataDir, { recursive: true })
  writeFileSync(join(badDataDir, 'ux-guidelines.csv'), 'Issue,Do\nbroken,"unterminated')
  const badHost = makeDeps(workDir)
  registerQueryTools(badHost.deps, {}, {
    assetRoot: badCsvDir,
    systemsRoot,
    referencesRoot,
    systems: chosenSystems,
    references,
    knowledge: [],
  })
  expectThrow(
    () => toolByName(badHost.registered, 'design_rule_search').execute({ query: 'focus', domain: 'ux' }, exec),
    'design_rule_search: invalid CSV at ux-guidelines.csv: Quoted field unterminated',
  )

  console.log('PASS: 4 tools registered; normal paths + error texts match spec')
  console.log(`  systems=${chosenSystems.length} references=${references.length} ruleHits=${hits.length} contextFiles=${context.files.length}`)
} finally {
  rmSync(workDir, { recursive: true, force: true })
  for (const fixture of fixtures) rmSync(fixture, { recursive: true, force: true })
}
