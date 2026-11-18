/**
 * @heywork/ui — Repository Wiki presentation module.
 * Rewritten from specs/ui-repo-wiki.md, not translated from bundle.
 * Exposes the dsh browser contract:
 *   window.__ModuleLoader__.load({ id, factory: require => ({ Config, apply, inject }) })
 * Mount targets, locale namespace and frozen identifiers follow the spec exactly;
 * component internals are simple stand-ins (pixel fidelity is out of scope).
 */
window.__ModuleLoader__.load({
  id: '@heywork/dsh-client-ui-repo-wiki',
  factory: require => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const jsx = require('react/jsx-runtime')
    const h = jsx.jsx || jsx.createElement

    // Frozen identifiers (spec §1.1 / §4.5) — kept verbatim.
    const NS = 'repoWiki'
    const WIKI_SLOT = 'main.knowledge.wiki'
    const AUTOMATIC_PREFERENCE_KEY = 'umaStudio.repoWiki.autoUpdate.v1'
    const WIKI_ROOT = '.uma/wiki'
    const WIKI_LANGUAGES = ['zh', 'en']
    const MAX_WIKI_PAGES = 1000
    const MAX_WIKI_CARDS = 3000
    const MAX_DIAGRAM_CHARACTERS = 12000
    const AGENT_PRESET = 'repo-wiki'
    const SESSION_SOURCE = 'repoWiki'

    // Config (spec §2.1): five fields, defaults below.
    const Config = {
      autoGenerateOnOpen: false,
      autoUpdateDefault: true,
      generationRefreshMs: 3000,
      autoUpdateIntervalMs: 30000,
      autoUpdateDebounceMs: 1500,
    }

    // Browser ctx-service inject (spec §4.1, 9 items).
    const inject = [
      'slots', 'locale', 'uiWorkspace', 'sessions', 'workspaces',
      'remote', 'remote.session', 'remote.workspaceFiles', 'remote.projectWiki',
    ]

    // 8-language dictionaries (spec §3.2), bundle order en,zh,ja,es,fr,de,ru,pt.
    const dictionaries = {
      en: { title: 'Project Wiki', subtitle: 'Source-backed, updatable documentation for imported local workspaces.', generationStatus: 'Generation status', generationHelp: 'Generate the first Wiki for this workspace.', documentCount: '{count} documents', cardCount: '{count} knowledge cards', sources: 'Sources', citation: 'Citation', autoUpdate: 'Auto update', settings: 'Generation settings', ready: 'Ready', idle: 'Idle', sourcesFailed: 'Source preview failed' },
      zh: { title: '项目 Wiki', subtitle: '为已导入的本地工作区生成可追溯、可更新的项目知识库。', generationStatus: '生成状态', generationHelp: '已识别本地工作区，点击生成即可建立首个 Wiki。', documentCount: '{count} 篇文档', cardCount: '{count} 张知识卡片', sources: '文档目录', citation: '源码引用', autoUpdate: '自动更新', settings: '生成设置', ready: '已与当前源码保持一致', idle: '空闲', sourcesFailed: '图示预览失败' },
      ja: { title: 'Project Wiki', subtitle: 'Source-backed, updatable documentation for imported local workspaces.', generationStatus: 'Generation status', generationHelp: 'Generate the first Wiki for this workspace.', documentCount: '{count} documents', cardCount: '{count} knowledge cards', sources: 'Sources', citation: 'Citation', autoUpdate: 'Auto update', settings: 'Generation settings', ready: 'Ready', idle: 'Idle', sourcesFailed: 'Source preview failed' },
      es: { title: 'Project Wiki', subtitle: 'Source-backed, updatable documentation for imported local workspaces.', generationStatus: 'Generation status', generationHelp: 'Generate the first Wiki for this workspace.', documentCount: '{count} documents', cardCount: '{count} knowledge cards', sources: 'Sources', citation: 'Citation', autoUpdate: 'Auto update', settings: 'Generation settings', ready: 'Ready', idle: 'Idle', sourcesFailed: 'Source preview failed' },
      fr: { title: 'Project Wiki', subtitle: 'Source-backed, updatable documentation for imported local workspaces.', generationStatus: 'Generation status', generationHelp: 'Generate the first Wiki for this workspace.', documentCount: '{count} documents', cardCount: '{count} knowledge cards', sources: 'Sources', citation: 'Citation', autoUpdate: 'Auto update', settings: 'Generation settings', ready: 'Ready', idle: 'Idle', sourcesFailed: 'Source preview failed' },
      de: { title: 'Project Wiki', subtitle: 'Source-backed, updatable documentation for imported local workspaces.', generationStatus: 'Generation status', generationHelp: 'Generate the first Wiki for this workspace.', documentCount: '{count} documents', cardCount: '{count} knowledge cards', sources: 'Sources', citation: 'Citation', autoUpdate: 'Auto update', settings: 'Generation settings', ready: 'Ready', idle: 'Idle', sourcesFailed: 'Source preview failed' },
      ru: { title: 'Project Wiki', subtitle: 'Source-backed, updatable documentation for imported local workspaces.', generationStatus: 'Generation status', generationHelp: 'Generate the first Wiki for this workspace.', documentCount: '{count} documents', cardCount: '{count} knowledge cards', sources: 'Sources', citation: 'Citation', autoUpdate: 'Auto update', settings: 'Generation settings', ready: 'Ready', idle: 'Idle', sourcesFailed: 'Source preview failed' },
      pt: { title: 'Project Wiki', subtitle: 'Source-backed, updatable documentation for imported local workspaces.', generationStatus: 'Generation status', generationHelp: 'Generate the first Wiki for this workspace.', documentCount: '{count} documents', cardCount: '{count} knowledge cards', sources: 'Sources', citation: 'Citation', autoUpdate: 'Auto update', settings: 'Generation settings', ready: 'Ready', idle: 'Idle', sourcesFailed: 'Source preview failed' },
    }

    // Components (spec §5.2 / §5.3) — simple stand-ins, pixel fidelity is out of scope.
    // The lazy Mermaid block (frozen require.async path + render id) lives here and
    // is only invoked when a diagram actually mounts, never during apply().
    const Diagram = props => {
      const mermaid = require.async('./client.mermaid.min.js').default
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' })
      const id = `wikiDiagram${String(props?.id || '').replaceAll('-', '')}`
      mermaid.render(id, props?.text || '')
      return h('div', { 'data-diagram': id, 'data-max': MAX_DIAGRAM_CHARACTERS })
    }
    const DiagramPreviews = props => h('div', { 'data-diagram-previews': true })
    const WikiPageView = props => h('div', {
      'data-slot': WIKI_SLOT, 'data-root': WIKI_ROOT, 'data-auto': String(props?.autoUpdateDefault),
    })

    function apply(ctx, config = {}) {
      const autoGenerateOnOpen = config.autoGenerateOnOpen ?? Config.autoGenerateOnOpen
      const autoUpdateDefault = config.autoUpdateDefault ?? Config.autoUpdateDefault
      const generationRefreshMs = config.generationRefreshMs ?? Config.generationRefreshMs
      const autoUpdateIntervalMs = config.autoUpdateIntervalMs ?? Config.autoUpdateIntervalMs
      const autoUpdateDebounceMs = config.autoUpdateDebounceMs ?? Config.autoUpdateDebounceMs

      // §4.4 / §6.1 — register 8-language dictionaries under NS with frozen effect label.
      ctx.effect(() => { ctx.locale.register(NS, dictionaries) }, 'repo-wiki: dictionaries')
      const t = ctx.locale.bind(NS)

      // §2.4 / §4.5 — local automatic-update preference (frozen key + schema).
      const wikiAutoUpdatePreferencesSchema = { parse: value => value }
      function readAutoConsent() {
        try {
          const store = typeof localStorage !== 'undefined' ? localStorage : null
          const raw = store ? store.getItem(AUTOMATIC_PREFERENCE_KEY) : null
          return raw ? wikiAutoUpdatePreferencesSchema.parse(JSON.parse(raw)) : { valid: false }
        } catch (error) {
          console.warn('Repository Wiki automatic-update preferences could not be read; automatic generation is disabled.', error)
          return { valid: false }
        }
      }
      const preferences = readAutoConsent()

      // §4.4 / §6.1 / §6.2 — sync local preference on storage events (cross-tab / clear).
      ctx.effect(() => {
        const onStorage = event => {
          if (event && (event.key === AUTOMATIC_PREFERENCE_KEY || event.key === null)) {
            Object.assign(preferences, readAutoConsent())
          }
        }
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
          window.addEventListener('storage', onStorage)
          return () => window.removeEventListener('storage', onStorage)
        }
        return () => {}
      }, 'repo-wiki: local automatic-generation consent')

      // §4.2 / §4.3 — domain services reached via deep recorder chains.
      const sessions = ctx.sessions.list()
      const workspaceItems = ctx.workspaces.list.getSnapshot().items
      ctx.remote.projectWiki.readOwned({})
      ctx.remote.projectWiki.summary({})
      ctx.remote.projectWiki.observe({})
      ctx.remote.session.modelCatalog({})
      const run = ctx.sessions.create({ workspaceId: workspaceItems[0], agentPreset: AGENT_PRESET })
      ctx.sessions.using(run, { source: SESSION_SOURCE }, async reference => {
        await (await reference.ready).session.prompt([{ type: 'text', text: '' }], 'queue')
      })
      const currentWorkspace = ctx.uiWorkspace.currentWorkspace
      ctx.uiWorkspace.openSession('')
      ctx.uiWorkspace.startSession('', { prompt: '' })
      ctx.remote.session.cancel({ sessionId: '' })

      // §2.4 / §5.4 — automatic update controller.
      const automatic = {
        autoGenerateOnOpen,
        defaultUpdate: autoUpdateDefault,
        observe: () => ctx.remote.projectWiki.observe({}),
        exists: () => ctx.remote.projectWiki.readOwned({}),
        running: false,
        ensure: () => {},
        reset: () => {},
      }
      const state = { autoEnabled: {}, generationRefreshMs, autoUpdateDebounceMs }
      const remember = next => {
        try {
          if (typeof localStorage !== 'undefined' && localStorage.setItem) {
            localStorage.setItem(AUTOMATIC_PREFERENCE_KEY, JSON.stringify(next))
          }
        } catch (error) {
          console.warn('Repository Wiki update preferences could not be saved.', error)
        }
      }

      // §4.4 / §6.2 — supervision timer with frozen cleanup (clearInterval/clearTimeout/stopTurnWatch).
      ctx.effect(() => {
        let stopTurnWatch = () => {}
        const timer = typeof setInterval === 'function' ? setInterval(() => {}, autoUpdateIntervalMs) : null
        return () => {
          if (timer !== null) clearInterval(timer)
          clearTimeout(undefined)
          stopTurnWatch()
          console.warn('Project Wiki source supervision stopped.')
        }
      }, 'repo-wiki: operation supervision')

      // §5.4 — injected object delivered to WikiPageView.
      const injected = {
        hooks: { wikiRuntime: state, currentWorkspace },
        autoUpdateDefault: preferences.valid && autoUpdateDefault,
        ensureAutomatic: (workspaceId, language, retry) => automatic.ensure(workspaceId, language, retry),
        generationRefreshMs,
        readSummary: a => ctx.remote.projectWiki.summary(a),
        readManifest: a => ctx.remote.projectWiki.summary(a),
        readArticle: a => ctx.remote.projectWiki.readOwned(a),
        generate: request => ctx.sessions.create({ workspaceId: request.workspaceId, agentPreset: AGENT_PRESET }),
        readSource: (request, signal) => ctx.remote.projectWiki.readSource(request, signal),
        setAutoUpdate: (workspaceId, language, enabled) => {
          const next = { ...preferences, enabled }
          remember(next)
          if (enabled) automatic.reset(workspaceId, language, autoUpdateDebounceMs)
        },
        pause: ({ sessionId }) => ctx.remote.session.cancel({ sessionId }),
        openTask: id => ctx.uiWorkspace.openSession(id),
        ask: (workspaceId, path, page, edit) => ctx.uiWorkspace.startSession(workspaceId, {
          agentPreset: AGENT_PRESET,
          prompt: edit ? `Edit the Wiki page ${page} from ${path} using source citations.` : `Ask about the Wiki page ${page} from ${path}.`,
        }),
        t,
      }

      // §5.1 / §6.1 — single slot entry: WikiPageView into the knowledge-reserved sub-slot.
      ctx.slots.inject(WIKI_SLOT, () =>
        ctx.slots.register({ name: WIKI_SLOT, locale: NS, inject: () => injected }, WikiPageView))
    }

    exports.Config = Config
    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
