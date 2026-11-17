/**
 * Self-test for packages/heywork-workflow (specs/workflow.md §1–§5).
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-tool-uma-workflow/src/.
 * Minimal injected deps: node:fs over a temporary directory, no @deepseek-ai
 * imports. Run: node packages/heywork-workflow/test-workflow.mjs
 */

import assert from 'node:assert/strict'
import {
  mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import * as workflow from './src/index.js'

const { apply, name, inject } = workflow
const agent = { id: 'agent-1', session: { id: 'session-1' } }
const exec = (withAgent = true) => ({ agent: withAgent ? agent : undefined, signal: undefined })
const toolNames = (registered) => registered.map((tool) => tool.name)

class ToolContextUnavailableError extends Error {}

function makeHarness(options = {}) {
  const root = mkdtempSync(join(tmpdir(), 'heywork-workflow-'))
  const registered = []
  const sandboxSeen = []

  const fs = {
    sandboxMode: options.sandboxMode,
    resolve(relative, { cwd }) {
      return { path: join(cwd, relative), displayPath: relative }
    },
    async writeText(target, content, _intent, _signal, sandbox) {
      sandboxSeen.push(sandbox)
      mkdirSync(dirname(target.path), { recursive: true })
      writeFileSync(target.path, content, 'utf8')
    },
    async readText(target) {
      return readFileSync(target.path, 'utf8')
    },
    async listDir(target) {
      if (options.listDirError) throw options.listDirError
      const makeEntry = (name, type = 'file', diskName = name) => ({
        name,
        type,
        target: {
          path: join(target.path, diskName),
          displayPath: `${target.displayPath}/${name}`,
        },
      })
      if (options.listDirEntries) return options.listDirEntries(makeEntry)
      let entries
      try {
        entries = readdirSync(target.path, { withFileTypes: true })
      } catch (error) {
        if (error.code === 'ENOENT') {
          const notFound = new Error('missing')
          notFound.code = 'FS_NOT_FOUND'
          throw notFound
        }
        throw error
      }
      return entries.map((entry) => makeEntry(
        entry.name,
        entry.isDirectory() ? 'directory' : entry.isFile() ? 'file' : 'other',
      ))
    },
  }

  const deps = {
    defineTool: (descriptor) => descriptor,
    tools: { register: (tool) => registered.push(tool) },
    fs,
    workingDirectory: { ensure: async () => root },
    waterfall: async (_event, _target, _exec, fallback) => fallback(),
    get: (key) => (key === 'sandboxPolicy' ? options.policy : undefined),
    ToolContextUnavailableError,
  }
  apply(deps)
  const tools = Object.fromEntries(registered.map((tool) => [tool.name, tool]))
  return {
    root,
    deps,
    registered,
    tools,
    sandboxSeen,
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  }
}

/** Build an artifact file with valid frontmatter (gate reads the full text). */
function artifactFile(status, body) {
  return `---\nartifact: stub\nstatus: ${status}\nowner: hey-team\nupdated: 2026-01-01T00:00:00.000Z\n---\n\n${body}\n`
}

let checks = 0
function ok(condition, label) {
  assert.ok(condition, label)
  checks += 1
}

const cleanups = []
try {
  // 1. exports + registration order (spec §2)
  {
    const h = makeHarness()
    cleanups.push(h.cleanup)
    ok(name === 'tool-hey-workflow', 'name is frozen tool-hey-workflow')
    ok(JSON.stringify(inject) === JSON.stringify(['tools', 'fs', 'workingDirectory']), 'inject frozen')
    ok(JSON.stringify(Object.keys(workflow).sort()) === JSON.stringify(['apply', 'inject', 'name']), 'only 3 exports')
    ok(JSON.stringify(toolNames(h.registered)) === JSON.stringify([
      'hey_artifact_write', 'hey_artifact_read', 'hey_gate_status',
    ]), '3 tools registered in write/read/gate order')
  }

  // 2. write: frontmatter, trim, bytes, evaluation, render, presentCall
  {
    const h = makeHarness()
    cleanups.push(h.cleanup)
    const write = h.tools.hey_artifact_write
    const args = {
      artifact: 'research',
      content: '\n## Finding\nWe found a TODO. Open question pending.\n\n',
    }
    const result = await write.execute(args, exec())
    const written = readFileSync(join(h.root, '.hey/research.md'), 'utf8')
    const updatedLine = written.split('\n')[4]
    ok(/^updated: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u.test(updatedLine), 'updated is an ISO timestamp')
    ok(written === [
      '---', 'artifact: research', 'status: draft', 'owner: hey-team', updatedLine,
      '---', '', `${args.content.trim()}\n`,
    ].join('\n'), 'composed file = frontmatter + blank line + trimmed body + newline')
    ok(result.path === '.hey/research.md', 'write path')
    ok(result.artifact === 'research' && result.status === 'draft', 'write artifact/status')
    ok(result.bytes === Buffer.byteLength(written, 'utf8'), 'bytes are UTF-8 byte length')
    ok(JSON.stringify(result.missingSections) === JSON.stringify([]), 'both research sections present')
    ok(JSON.stringify(result.placeholders) === JSON.stringify(['TODO']), 'TODO placeholder detected')
    ok(result.ready === false, 'write ready=false with placeholder')
    ok(write.output.render(args, result)[0].text === [
      `Wrote .hey/research.md (${result.bytes} bytes, draft).`,
      'Required sections present.',
      'Placeholders to resolve: TODO.',
    ].join('\n'), 'write render three lines')
    ok(JSON.stringify(write.presentCall(args)) === JSON.stringify({
      card: 'generic', title: 'Write .hey/research.md', kind: 'other', rawInput: args,
    }), 'write presentCall')

    const cleanArgs = { artifact: 'prd', content: '目标达成，验收通过。', status: 'approved', owner: 'alice' }
    const clean = await write.execute(cleanArgs, exec())
    const cleanFile = readFileSync(join(h.root, '.hey/prd.md'), 'utf8')
    ok(clean.status === 'approved', 'approved status honored')
    ok(cleanFile.includes('status: approved\n') && cleanFile.includes('owner: alice\n'), 'status/owner frontmatter')
    ok(clean.ready === true, 'clean content ready=true')
    ok(clean.bytes > cleanArgs.content.length, 'multi-byte content counts bytes not chars')
    ok(write.output.render(cleanArgs, clean)[0].text.includes('No placeholder markers.'), 'render no-placeholder line')
  }

  // 3. write error branches (spec §3)
  {
    const h = makeHarness()
    cleanups.push(h.cleanup)
    const write = h.tools.hey_artifact_write
    await assert.rejects(write.execute({ artifact: 'prd', content: 'goal' }, exec(false)), {
      message: 'hey_artifact_write requires an agent Session',
    }); checks += 1
    await assert.rejects(write.execute({ artifact: 'prd', content: '  \n  ' }, exec()), {
      message: 'hey_artifact_write requires non-empty content',
    }); checks += 1
  }
  {
    const h = makeHarness({ sandboxMode: 'workspace' })
    cleanups.push(h.cleanup)
    await assert.rejects(h.tools.hey_artifact_write.execute({ artifact: 'prd', content: 'goal' }, exec()), (error) => (
      error instanceof ToolContextUnavailableError
      && error.message === 'Artifact writes require the mounted filesystem’s sandbox policy service'
    )); checks += 1
    ok(!readdirSync(h.root).includes('.hey'), 'sandbox error happens before any fs write')
  }
  {
    const policy = { resolve: ({ session }) => `sandbox:${session.id}` }
    const h = makeHarness({ sandboxMode: 'workspace', policy })
    cleanups.push(h.cleanup)
    await h.tools.hey_artifact_write.execute({ artifact: 'prd', content: 'goal' }, exec())
    ok(JSON.stringify(h.sandboxSeen) === JSON.stringify(['sandbox:session-1']), 'sandbox from policy.resolve passed to writeText')
  }

  // 4. read: verbatim content, render, presentCall, errors
  {
    const h = makeHarness()
    cleanups.push(h.cleanup)
    const write = h.tools.hey_artifact_write
    const read = h.tools.hey_artifact_read
    await write.execute({ artifact: 'spec', content: 'Task and acceptance.' }, exec())
    const result = await read.execute({ artifact: 'spec' }, exec())
    const onDisk = readFileSync(join(h.root, '.hey/spec.md'), 'utf8')
    ok(result.path === '.hey/spec.md' && result.artifact === 'spec', 'read path/artifact')
    ok(result.content === onDisk && result.content.includes('updated:'), 'read returns full text with frontmatter verbatim')
    ok(read.output.render({}, result)[0].text === result.content, 'read render is raw content')
    ok(JSON.stringify(read.presentCall({ artifact: 'spec' })) === JSON.stringify({
      card: 'generic', title: 'Read .hey/spec.md', kind: 'other', rawInput: { artifact: 'spec' },
    }), 'read presentCall')
    await assert.rejects(read.execute({ artifact: 'spec' }, exec(false)), {
      message: 'hey_artifact_read requires an agent Session',
    }); checks += 1
    await assert.rejects(read.execute({ artifact: 'qa' }, exec()), { code: 'ENOENT' }); checks += 1
  }

  // 5. gate: missing .hey directory × depths (normal result, patch always ready)
  {
    const h = makeHarness()
    cleanups.push(h.cleanup)
    const gate = h.tools.hey_gate_status
    const cases = [
      [{ depth: 'patch' }, []],
      [{ depth: 'feature', phase: 'documents' }, ['spec']],
      [{ depth: 'feature', phase: 'delivery' }, ['spec', 'qa', 'delivery']],
      [{ depth: 'product', phase: 'documents' }, ['research', 'prd', 'architecture', 'uiux']],
      [{}, ['research', 'prd', 'architecture', 'uiux', 'spec', 'qa', 'delivery']],
    ]
    for (const [args, missing] of cases) {
      const result = await gate.execute(args, exec())
      ok(result.exists === false, 'missing dir: exists=false')
      ok(JSON.stringify(result.missing) === JSON.stringify(missing), `missing set for ${JSON.stringify(args)}`)
      ok(JSON.stringify(result.blocked) === JSON.stringify(missing), 'blocked equals missing')
      ok(result.ready === (missing.length === 0), 'ready from missing.length')
      ok(JSON.stringify(result.artifacts) === JSON.stringify([]), 'artifacts empty')
    }
    const patch = await gate.execute({ depth: 'patch' }, exec())
    ok(gate.output.render({ depth: 'patch' }, patch)[0].text === [
      'No .hey directory exists.',
      'Document checks only; this result does not prove tests, human approval or deployment.',
      'Ready: every required artifact is present and clean.',
    ].join('\n'), 'patch render has no blocked/missing lines')
    const product = await gate.execute({}, exec())
    ok(gate.output.render({}, product)[0].text.includes('Blocked: research, prd, architecture, uiux, spec, qa, delivery.'), 'missing-dir render blocked line')
    ok(JSON.stringify(gate.presentCall()) === JSON.stringify({
      card: 'generic', title: 'Check Uma delivery gates', kind: 'other',
    }), 'gate presentCall has no rawInput and keeps Uma title')
  }

  // 6. gate: mixed valid / not-ready / ignored files, three gradings
  {
    // `QA.md` is simulated as a directory entry pointing at another on-disk file:
    // macOS filesystems are often case-insensitive, where writing QA.md would
    // overwrite qa.md and mask the case-sensitive filter under test.
    const h = makeHarness({
      listDirEntries: (entry) => [
        entry('research.md'), entry('spec.md'), entry('qa.md'), entry('delivery.md'),
        entry('preview.md'), entry('notes.md'), entry('README'),
        entry('QA.md', 'file', 'qa-uppercase.md'), entry('subdir', 'directory'),
      ],
    })
    cleanups.push(h.cleanup)
    mkdirSync(join(h.root, '.hey'), { recursive: true })
    const files = {
      'research.md': artifactFile('draft', 'Finding: done. Open question: none.'),
      'spec.md': artifactFile('approved', 'Task and acceptance criteria.'),
      'qa.md': artifactFile('draft', 'Gate result has a TODO.'),
      'delivery.md': artifactFile('draft', 'Deliver the result.'),
      'preview.md': artifactFile('draft', 'garbage'),
      'notes.md': artifactFile('draft', 'Finding'),
      'qa-uppercase.md': artifactFile('draft', 'gate'),
      README: artifactFile('draft', 'gate'),
    }
    for (const [filename, content] of Object.entries(files)) {
      writeFileSync(join(h.root, '.hey', filename), content, 'utf8')
    }
    const gate = h.tools.hey_gate_status

    const product = await gate.execute({ depth: 'product', phase: 'delivery' }, exec())
    ok(product.exists === true, 'existing dir: exists=true')
    ok(product.ready === false, 'product/delivery blocked by missing + not-ready')
    ok(JSON.stringify(product.artifacts.map((a) => a.artifact)) === JSON.stringify([
      'research', 'spec', 'preview', 'qa', 'delivery',
    ]), 'artifacts sorted by ARTIFACTS; non-md / bad-case / dir ignored')
    ok(JSON.stringify(product.missing) === JSON.stringify(['prd', 'architecture', 'uiux']), 'product missing excludes present preview')
    ok(JSON.stringify(product.blocked) === JSON.stringify(['prd', 'architecture', 'uiux', 'qa']), 'non-required preview does not block')
    const qa = product.artifacts.find((a) => a.artifact === 'qa')
    const preview = product.artifacts.find((a) => a.artifact === 'preview')
    ok(qa.status === 'draft' && JSON.stringify(qa.placeholders) === JSON.stringify(['TODO']), 'qa status/placeholders from frontmatter+body')
    ok(JSON.stringify(preview.missingSections) === JSON.stringify(['preview|预览']), 'preview section pattern source')
    const text = gate.output.render({ depth: 'product', phase: 'delivery' }, product)[0].text
    ok(text.startsWith('Uma delivery state:\nDocument checks only; this result does not prove tests, human approval or deployment.\nBlocked: prd, architecture, uiux, qa.\nMissing required artifacts: prd, architecture, uiux.\n'), 'gate render header lines')
    ok(text.includes('- qa (draft, not ready)\n  placeholders: TODO'), 'gate render placeholder detail')
    ok(text.includes('- preview (draft, not ready)\n  missing sections: preview|预览'), 'gate render section detail')

    const featureDocs = await gate.execute({ depth: 'feature', phase: 'documents' }, exec())
    ok(featureDocs.ready === true && featureDocs.missing.length === 0 && featureDocs.blocked.length === 0, 'feature/documents only checks spec')
    const featureDelivery = await gate.execute({ depth: 'feature', phase: 'delivery' }, exec())
    ok(JSON.stringify(featureDelivery.missing) === JSON.stringify([]) && JSON.stringify(featureDelivery.blocked) === JSON.stringify(['qa']), 'feature/delivery blocked by qa only')
    const patch = await gate.execute({ depth: 'patch', phase: 'delivery' }, exec())
    ok(patch.ready === true && patch.missing.length === 0 && patch.blocked.length === 0, 'patch ignores not-ready required files')
    const productDocs = await gate.execute({ depth: 'product', phase: 'documents' }, exec())
    ok(JSON.stringify(productDocs.missing) === JSON.stringify(['prd', 'architecture', 'uiux']), 'product/documents required set')
  }

  // 7. gate error branches
  {
    const h = makeHarness()
    cleanups.push(h.cleanup)
    await assert.rejects(h.tools.hey_gate_status.execute({}, exec(false)), {
      message: 'hey_gate_status requires an agent Session',
    }); checks += 1
  }
  {
    const error = new Error('permission denied')
    error.code = 'EACCES'
    const h = makeHarness({ listDirError: error })
    cleanups.push(h.cleanup)
    await assert.rejects(h.tools.hey_gate_status.execute({}, exec()), { code: 'EACCES' }); checks += 1
  }
} finally {
  for (const cleanup of cleanups) cleanup()
}

console.log(`workflow self-test passed: ${checks} checks`)
