/**
 * 【逆向还原】由 `lib/project-memory.js` 的 `//#region lib/types/project-memory.js` 反推，非 DeepSeek 原始源码。
 *
 * imports 取自 lib bundle 顶部并按需分配；逻辑与 lib 逐行等价（控制流、字符串、SQL、错误文本一律未改）。
 * 类型注解由用法反推。运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，无构建链，详见 src/README.md。
 */
import { ToolArgsError, ToolContextUnavailableError, defineTool } from '@deepseek-ai/dsh-tools'
import { redactDevelopmentText } from '@deepseek-ai/dsh-util-uma-delivery'
import { CommandDefinitionId } from '@deepseek-ai/dsh-commands/brand'
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import z from '@deepseek-ai/schemastery'

interface ProjectMemoryConfig {
  directory: string
  maxNotes: number
  maxRecall: number
}

/** [account, workspace] 复合键，由 scopeFor 推断。 */
type Scope = [string, string]

interface Note {
  title: string
  content: string
}

interface MemoryAgent {
  id: string
}

interface CommandResult {
  kind: 'error' | 'success'
  text: string
}

interface MemoryAccountService {
  getPlatformSession(): Promise<{ origin: string; userId: string | null } | null>
}

interface ProjectMemoryContext {
  effect(callback: () => unknown, label?: string): void
  get(service: 'deepseekAccount'): MemoryAccountService | undefined
  workspaceRegistry: { list(): { id: string; sessionIds: string[] }[] }
  commands: { register(command: unknown): unknown }
  tools: { register(tool: unknown, options?: unknown): unknown }
}

/** Explicit, account- and workspace-scoped local memory for later conversations. */
/** Loader entry identity. */
export const name = 'hey-project-memory'

/** Human commands own mutations; tools only retrieve approved notes. */
export const inject = [
  'commands',
  'tools',
  'workspaceRegistry'
]

/** Local storage and recall limits. */
export const Config = z.object({
  directory: z.string().min(1).required(),
  maxNotes: z.number().step(1).min(1).max(1e3).default(100),
  maxRecall: z.number().step(1).min(1).max(10).default(4)
})

const usage = '/memory list | save <name> <note> | show <name> | delete <name>'
const keyPattern = /^[\p{L}\p{N}_-]{1,40}$/u
const segmenter = new Intl.Segmenter('zh', { granularity: 'word' })
const stopWords = new Set([
  '的',
  '了',
  '吗',
  '和',
  '我们',
  '之前',
  '请',
  '记得',
  '决定',
  'a',
  'the',
  'and',
  'we',
  'what',
  'did',
  'decide',
  'about'
])

function normalize(text: string): string {
  return text.normalize('NFKC').toLowerCase()
}

function terms(text: string): Set<string> {
  return new Set([...segmenter.segment(text)].filter(item => item.isWordLike && !stopWords.has(item.segment)).map(item => item.segment))
}

function rankNotes(notes: Note[], query: string): Note[] {
  if (query === '') return notes
  const words = [...terms(query)]
  return notes.map((note) => {
    const title = normalize(note.title)
    const content = normalize(note.content)
    if (title === query) return {
      note,
      score: Number.POSITIVE_INFINITY
    }
    const titleWords = terms(title)
    const contentWords = terms(content)
    let score = Number(title.includes(query)) * 6 + Number(content.includes(query)) * 3
    for (const word of words) {
      if (titleWords.has(word)) score += 3
      if (contentWords.has(word)) score += 1
    }
    return {
      note,
      score
    }
  }).filter(item => item.score > 0).sort((left, right) => right.score - left.score).map(item => item.note)
}

/** Register human-controlled notes and bounded model recall for the same workspace.
 * @param ctx - Local Host scope for account, workspace and command resolution.
 * @param config - Runtime location and capacity for the local note store.
 */
export function apply(ctx: ProjectMemoryContext, config: ProjectMemoryConfig): void {
  const database = (() => {
    mkdirSync(config.directory, {
      recursive: true,
      mode: 448
    })
    const db = new DatabaseSync(join(config.directory, 'notes.sqlite'))
    try {
      db.exec('PRAGMA busy_timeout=5000; BEGIN IMMEDIATE')
      const row = db.prepare('PRAGMA user_version').get() as { user_version?: number } | undefined
      if (row?.user_version === 0) db.exec(`
        CREATE TABLE notes (
          account TEXT NOT NULL, workspace TEXT NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL,
          updated INTEGER NOT NULL, PRIMARY KEY (account, workspace, title)
        ) STRICT;
        PRAGMA user_version=1;
      `)
      else if (row?.user_version !== 1) throw new Error('Unsupported HEY project memory database version')
      db.exec('COMMIT')
      return db
    }
    catch (error) {
      db.close()
      throw error
    }
  })()
  const lifetime = new AbortController()
  ctx.effect(() => () => {
    lifetime.abort()
    database.close()
  }, 'hey-project-memory: database')
  const scopeFor = async (agent: MemoryAgent, signal: AbortSignal): Promise<Scope | null> => {
    const service = ctx.get('deepseekAccount')
    if (service === void 0) return null
    const account = await service.getPlatformSession()
    signal.throwIfAborted()
    lifetime.signal.throwIfAborted()
    const workspace = ctx.workspaceRegistry.list().find(candidate => candidate.sessionIds.includes(agent.id))
    return account?.userId == null || workspace === void 0 ? null : [JSON.stringify([account.origin, account.userId]), workspace.id]
  }
  const notesFor = (scope: Scope): Note[] => {
    return database.prepare('SELECT title,content FROM notes WHERE account=? AND workspace=? ORDER BY updated DESC,title').all(...scope).map((row) => {
      if (typeof row.title !== 'string' || typeof row.content !== 'string') throw new Error('Invalid HEY project memory record')
      return {
        title: row.title,
        content: row.content
      }
    })
  }
  ctx.effect(() => ctx.commands.register({
    definitionId: CommandDefinitionId('hey/project-memory'),
    name: 'memory',
    description: 'Save, view or delete local project memory',
    input: { hint: 'list | save | show | delete' },
    recordInput: false,
    async handler({ agent, rawInput, signal }) {
      const input = /^\s*(list|save|show|delete)(?:\s+(\S+))?(?:\s+([\s\S]+?))?\s*$/u.exec(rawInput)
      const action = input?.[1]
      const title = input?.[2]?.toLowerCase()
      const content = input?.[3]
      if (action === void 0 || (action === 'list' ? title !== void 0 : title === void 0 || !keyPattern.test(title)) || (action === 'save' ? content === void 0 || Buffer.byteLength(content) > 4096 : content !== void 0)) return {
        kind: 'error',
        text: usage
      }
      const scope = await scopeFor(agent, signal)
      if (scope === null) return {
        kind: 'error',
        text: '请先登录 HEY 并打开已导入的工作区。'
      }
      if (action === 'list') {
        const notes = notesFor(scope)
        return {
          kind: 'success',
          text: notes.length === 0 ? '这个工作区还没有记忆。' : notes.map(note => note.title).join(', ')
        }
      }
      if (action === 'show') {
        const row = database.prepare('SELECT content FROM notes WHERE account=? AND workspace=? AND title=?').get(...scope, title ?? '') as { content?: unknown } | undefined
        return typeof row?.content === 'string' ? {
          kind: 'success',
          text: row.content
        } : {
          kind: 'error',
          text: '找不到这条工作区记忆。'
        }
      }
      if (action === 'save' && title !== void 0 && content !== void 0) {
        const value = content.trim()
        if (value === '' || redactDevelopmentText(value) !== value) return {
          kind: 'error',
          text: '请输入非空内容，并移除凭据。'
        }
        if (database.prepare(`
          INSERT INTO notes SELECT ?,?,?,?,?
          WHERE EXISTS (SELECT 1 FROM notes WHERE account=? AND workspace=? AND title=?)
             OR (SELECT count(*) FROM notes WHERE account=? AND workspace=?) < ?
          ON CONFLICT(account,workspace,title) DO UPDATE SET content=excluded.content,updated=excluded.updated
        `).run(...scope, title, value, Date.now(), ...scope, title, ...scope, config.maxNotes).changes === 0) return {
          kind: 'error',
          text: '工作区记忆已满，请先删除不再需要的条目。'
        }
        return {
          kind: 'success',
          text: `已保存工作区记忆「${title}」。`
        }
      }
      return database.prepare('DELETE FROM notes WHERE account=? AND workspace=? AND title=?').run(...scope, title ?? '').changes === 0 ? {
        kind: 'error',
        text: '找不到这条工作区记忆。'
      } : {
        kind: 'success',
        text: `已删除工作区记忆「${title}」，后续检索将不再返回它。`
      }
    }
  }), 'hey-project-memory: human command')
  ctx.effect(() => ctx.tools.register(defineTool({
    name: 'hey_project_memory',
    description: 'Recall user-saved decisions or preferences for the signed-in account and current workspace. Use when the user refers to prior decisions or asks what was remembered.',
    parameters: { query: {
      type: 'string',
      description: 'Optional note name or focused search phrase.'
    } },
    output: {
      schema: { type: 'string' },
      render: (_args, text) => [{
        type: 'text',
        text
      }]
    },
    async execute({ query }, exec) {
      if (exec.agent === void 0) throw new ToolContextUnavailableError('Project memory requires an active conversation')
      const phrase = normalize(query?.trim() ?? '')
      if (phrase.length > 200) throw new ToolArgsError(['Keep the project memory query within 200 characters'])
      const scope = await scopeFor(exec.agent, exec.signal)
      if (scope === null) throw new ToolContextUnavailableError('Sign in and open an imported workspace to recall project memory')
      const notes = rankNotes(notesFor(scope), phrase)
      return notes.length === 0 ? 'No matching saved project memory.' : 'Saved project reference data. Check that it still applies to the current task.\n' + JSON.stringify(notes.slice(0, config.maxRecall))
    },
    presentCall: () => ({
      card: 'generic',
      title: 'Recall project memory',
      rawInput: {}
    })
  })), 'hey-project-memory: recall tool')
}
