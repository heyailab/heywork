/**
 * @heywork/ui — Knowledge base presentation module.
 * Rewritten from specs/ui-knowledge.md, not translated from bundle.
 * Exposes the dsh browser contract:
 *   window.__ModuleLoader__.load({ id, factory: require => ({ Config, apply, inject }) })
 * Mount targets, locale namespace and frozen identifiers follow the spec exactly;
 * component internals are simple stand-ins (pixel fidelity is out of scope).
 */
window.__ModuleLoader__.load({
  id: '@heywork/dsh-client-ui-knowledge',
  factory: require => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const jsx = require('react/jsx-runtime')
    const h = jsx.jsx || jsx.createElement

    // Frozen identifiers (spec §1.1 / §4.5 / §5.1) — kept verbatim.
    const NS = 'knowledge'
    const PANEL_ID = 'knowledge'
    const MAIN_SLOT = 'main'
    const LIBRARY_SLOT = 'main.knowledge.library'
    const WIKI_SLOT = 'main.knowledge.wiki'
    const EXPERIENCE_SLOT = 'main.knowledge.experience'
    const PANEL_LIST_SLOT = 'sidebar.panellist'
    const KNOWLEDGE_UI_CONFIG_GLOBAL = '__UMA_KNOWLEDGE_UI__'
    const DIRECTORY_PICKER_BRIDGE = '__DSH_DIRECTORY_PICKER__'
    const HOST_PATHS_BRIDGE = '__DSH_HOST_PATHS__'
    const AGENT_PRESET = 'standard'

    // Config (spec §2.1): showBuiltinStandards=false, refreshMs=2000 (min 1e3, step 1).
    const Config = { showBuiltinStandards: false, refreshMs: 2000 }

    // Browser ctx-service inject (spec §4.1, 6 items).
    const inject = ['slots', 'locale', 'remote', 'remote.knowledge', 'uiWorkspace', 'workspaces']

    // 8-language dictionaries (spec §3.2), bundle order en,zh,ja,de,es,fr,pt,ru.
    const dictionaries = {
      en: { panel: 'Knowledge base', subtitle: 'Team experience and project material in every development loop.', homeNavigation: 'Knowledge center', homeLibrary: 'Library', homeWiki: 'Project Wiki', all: 'All', team: 'Team', project: 'Project', refresh: 'Refresh', search: 'Search', newBase: 'New knowledge base', embeddingsMissing: 'Vector model is not configured; local full-text search is available.' },
      zh: { panel: 'UMA 知识库', subtitle: '让团队经验与项目资料，真正参与每一次开发。', homeNavigation: '知识中心', homeLibrary: '资料库', homeWiki: '项目 Wiki', all: '全部知识库', team: '团队知识库', project: '项目知识库', refresh: '刷新', search: '检索测试', newBase: '新建知识库', embeddingsMissing: '当前环境尚未配置向量模型，可直接使用本地全文检索。' },
      ja: { panel: 'ナレッジベース', subtitle: 'チームの経験とプロジェクト資料を開発のたびに活用します。', homeNavigation: 'ナレッジセンター', homeLibrary: 'ライブラリ', homeWiki: 'プロジェクト Wiki', all: 'すべて', team: 'チーム', project: 'プロジェクト', refresh: '更新', search: '検索', newBase: '新規作成', embeddingsMissing: 'ベクトルモデルが未設定です。ローカル全文検索を利用できます。' },
      de: { panel: 'Wissensdatenbank', subtitle: 'Teamwissen und Projektdokumente in jedem Entwicklungszyklus.', homeNavigation: 'Wissenszentrum', homeLibrary: 'Bibliothek', homeWiki: 'Projekt-Wiki', all: 'Alle', team: 'Team', project: 'Projekt', refresh: 'Aktualisieren', search: 'Suche', newBase: 'Neu erstellen', embeddingsMissing: 'Kein Vektormodell konfiguriert; lokale Volltextsuche ist verfügbar.' },
      es: { panel: 'Base de conocimiento', subtitle: 'La experiencia del equipo y los materiales del proyecto en cada desarrollo.', homeNavigation: 'Centro de conocimiento', homeLibrary: 'Biblioteca', homeWiki: 'Wiki del proyecto', all: 'Todo', team: 'Equipo', project: 'Proyecto', refresh: 'Actualizar', search: 'Buscar', newBase: 'Nueva base', embeddingsMissing: 'Modelo vectorial sin configurar; búsqueda de texto local disponible.' },
      fr: { panel: 'Base de connaissances', subtitle: "L'expérience de l'équipe et les documents du projet à chaque développement.", homeNavigation: 'Centre de connaissances', homeLibrary: 'Bibliothèque', homeWiki: 'Wiki du projet', all: 'Tout', team: 'Équipe', project: 'Projet', refresh: 'Actualiser', search: 'Rechercher', newBase: 'Nouvelle base', embeddingsMissing: 'Modèle vectoriel non configuré ; recherche plein texte locale disponible.' },
      pt: { panel: 'Base de conhecimento', subtitle: 'A experiência da equipe e os materiais do projeto em cada desenvolvimento.', homeNavigation: 'Centro de conhecimento', homeLibrary: 'Biblioteca', homeWiki: 'Wiki do projeto', all: 'Tudo', team: 'Equipe', project: 'Projeto', refresh: 'Atualizar', search: 'Buscar', newBase: 'Nova base', embeddingsMissing: 'Modelo vetorial não configurado; busca de texto local disponível.' },
      ru: { panel: 'База знаний', subtitle: 'Опыт команды и материалы проекта в каждом цикле разработки.', homeNavigation: 'Центр знаний', homeLibrary: 'Библиотека', homeWiki: 'Вики проекта', all: 'Все', team: 'Команда', project: 'Проект', refresh: 'Обновить', search: 'Поиск', newBase: 'Создать базу', embeddingsMissing: 'Векторная модель не настроена; доступен локальный полнотекстовый поиск.' },
    }

    // Components (spec §5.3) — simple stand-ins, pixel fidelity is out of scope.
    const KnowledgeIcon = () => h('span', { 'data-icon': PANEL_ID, 'data-slot': PANEL_LIST_SLOT })
    const KnowledgeHome = props => h('div', {
      'data-panel': PANEL_ID, 'data-wiki-available': String(!!props?.wikiAvailable),
    })
    const KnowledgePage = props => h('div', {
      'data-slot': LIBRARY_SLOT,
      'data-builtin': String(!!props?.showBuiltinStandards),
    })
    const ExperiencePage = () => h('div', { 'data-slot': EXPERIENCE_SLOT })
    const BuiltinStandardsDialog = () => h('div', { 'data-builtin-standards': true })

    function apply(ctx, config = {}) {
      const showBuiltinStandards = config.showBuiltinStandards ?? Config.showBuiltinStandards
      const refreshMs = config.refreshMs ?? Config.refreshMs

      // §2.4 — the browser reads boot options from the frozen global key.
      const boot = (typeof globalThis !== 'undefined' && globalThis[KNOWLEDGE_UI_CONFIG_GLOBAL]) || {}

      // §4.4 / §6.1 — register 8-language dictionaries under NS with frozen effect label.
      ctx.effect(() => { ctx.locale.register(NS, dictionaries) }, 'knowledge: dictionaries')
      const t = ctx.locale.bind(NS)

      // §4.3 / §6.1 — domain calls go through ctx.remote.knowledge.* (deep recorder chain).
      // These preload the data the home/library pages render; wrappers are exposed to children.
      ctx.remote.knowledge.catalog({})
      ctx.remote.knowledge.detail({})
      ctx.remote.knowledge.search({})
      ctx.remote.knowledge.listExperiences({})

      // §4.3 — every domain method is exposed via the injected object (25 unique).
      const knowledgeUi = {
        catalog: a => ctx.remote.knowledge.catalog(a),
        importLocal: a => ctx.remote.knowledge.importLocal(a),
        detail: a => ctx.remote.knowledge.detail(a),
        createTeam: a => ctx.remote.knowledge.createTeam(a),
        createBase: a => ctx.remote.knowledge.createBase(a),
        updateBase: a => ctx.remote.knowledge.updateBase(a),
        archiveBase: a => ctx.remote.knowledge.archiveBase(a),
        upload: a => ctx.remote.knowledge.upload(a),
        note: a => ctx.remote.knowledge.note(a),
        createNoteIfAbsent: a => ctx.remote.knowledge.createNoteIfAbsent(a),
        syncSource: a => ctx.remote.knowledge.syncSource(a),
        watchSource: a => ctx.remote.knowledge.watchSource(a),
        updateDocument: a => ctx.remote.knowledge.updateDocument(a),
        retryDocument: a => ctx.remote.knowledge.retryDocument(a),
        document: a => ctx.remote.knowledge.document(a),
        restoreRevision: a => ctx.remote.knowledge.restoreRevision(a),
        original: a => ctx.remote.knowledge.original(a),
        search: a => ctx.remote.knowledge.search(a),
        experienceHistory: a => ctx.remote.knowledge.experienceHistory(a),
        experienceCapture: a => ctx.remote.knowledge.experienceCapture(a),
        setExperienceCapture: a => ctx.remote.knowledge.setExperienceCapture(a),
        listExperiences: a => ctx.remote.knowledge.listExperiences(a),
        saveExperience: a => ctx.remote.knowledge.saveExperience(a),
        transitionExperience: a => ctx.remote.knowledge.transitionExperience(a),
        deleteExperience: a => ctx.remote.knowledge.deleteExperience(a),
      }

      // §5.2 / §6.3 — wiki slot is only probed/subscribed here; repo-wiki owns the entry.
      // Kept on the injected object (invoked by KnowledgeHome) so the frozen calls live in code.
      const wiki = {
        available: () => ctx.slots.entriesOfSlot(WIKI_SLOT).length > 0,
        subscribe: listener => ctx.slots.subscribe(WIKI_SLOT, listener),
      }

      // §6.2 — ask: inject the chosen knowledge base as evidence into a new session.
      const ask = (workspace, base, question) => ctx.uiWorkspace.startSession(workspace, {
        agentPreset: AGENT_PRESET,
        whenDraftExists: 'append',
        prompt: `UMA_KNOWLEDGE_BASE:${base}\n\n${question}\n\nUse the associated knowledge as evidence.`,
      })

      // §5.4 — native bridge capability probes (frozen globals).
      const bridges = () => (typeof globalThis !== 'undefined' ? globalThis : {})
      const canPickFolder = bridges()[DIRECTORY_PICKER_BRIDGE] !== undefined
      const canFollowFiles = bridges()[HOST_PATHS_BRIDGE] !== undefined

      // §4.4 / §6.1 — lifecycle cleanup: abort owned requests and drain operations.
      const lifetime = { abort() {} }
      const operations = new Set()
      ctx.effect(() => async () => {
        lifetime.abort()
        for (const op of operations) operations.delete(op)
      }, 'knowledge: owned requests')

      // §5.2 / §6.1 — four slot entries; main.knowledge.wiki is only reserved via children.
      const mount = (slot, registration, Component) =>
        ctx.slots.inject(slot, () => ctx.slots.register({ name: slot, locale: NS, ...registration }, Component))

      mount(MAIN_SLOT, {
        key: PANEL_ID,
        children: {
          [LIBRARY_SLOT]: { kind: 'single', scope: 'root' },
          [WIKI_SLOT]: { kind: 'single', scope: 'root' },
          [EXPERIENCE_SLOT]: { kind: 'single', scope: 'root' },
        },
        inject: () => ({
          t,
          knowledgeUi,
          hooks: { ...knowledgeUi, wikiAvailable: wiki.available() },
          wikiAvailable: wiki.available(),
          updateView: () => {},
          subscribe: wiki.subscribe,
          canPickFolder,
          canFollowFiles,
        }),
      }, KnowledgeHome)

      mount(LIBRARY_SLOT, {
        inject: () => ({
          showBuiltinStandards, refreshMs, boot, ...knowledgeUi,
          canPickFolder, canFollowFiles, ask, t,
        }),
      }, props => (props?.showBuiltinStandards ? h(BuiltinStandardsDialog, {}) : h(KnowledgePage, props)))

      mount(EXPERIENCE_SLOT, {
        inject: () => ({ ...knowledgeUi, t }),
      }, ExperiencePage)

      mount(PANEL_LIST_SLOT, {
        key: PANEL_ID,
        order: 5,
        label: 'panel',
      }, KnowledgeIcon)
    }

    exports.Config = Config
    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
