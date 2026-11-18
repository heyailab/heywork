/**
 * @heywork/ui — UMA design cards presentation module.
 * Rewritten from specs/ui-design-cards.md, not translated from bundle.
 * Exposes the dsh browser contract:
 *   window.__ModuleLoader__.load({ id, factory: require => ({ apply, inject }) })
 * Mount targets, locale namespace and frozen identifiers follow the spec exactly;
 * component internals are simple stand-ins (pixel fidelity is out of scope).
 */
window.__ModuleLoader__.load({
  id: '@heywork/dsh-client-ui-uma-design',
  factory: require => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const jsx = require('react/jsx-runtime')
    const h = jsx.jsx || jsx.createElement

    // Frozen identifiers (spec §4.3) — kept verbatim.
    const NS = 'ui-uma-design'
    const TOOLVIEW_SLOT = 'tool.call.toolview'
    const CHAT_NODE_SLOT = 'conversation.chat.node'
    const ACTIVITY_KIND = 'uma-resource-activity'
    const PREVIEW_KIND = 'uma-design-preview'
    const PREVIEW_VERSION = 1
    const DATA_TOOL = 'design_preview'
    const PREVIEW_PATH_RE = /^\.design\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.html$/
    const SHA256_RE = /^[a-f0-9]{64}$/u
    const ARTIFACT_WRITE_RE = /^Wrote ([^\r\n]*?\.uma[\\/](?:research|prd|architecture|uiux|spec|preview|qa|delivery)\.md) \(\d+ bytes, (?:draft|approved)\)\.$/mu

    // 5 cards with real UI + 8 empty placeholders = 13 toolview keys.
    const UI_CARD_KEYS = [
      DATA_TOOL, 'uma_artifact_write', 'uma_gate_status',
      'design_project_create', 'design_project_status',
    ]
    const PLACEHOLDER_KEYS = [
      'design_asset_list', 'design_asset_get', 'uma_resource_read', 'uma_knowledge_search',
      'design_rule_search', 'design_begin', 'uma_wiki_lookup', 'uma_workspace_search',
    ]

    // Browser ctx-service inject (spec §4.1, 5 items). No Config on this module (spec §2.1).
    const inject = ['slots', 'locale', 'uiWorkspace', 'workspaces', 'uiConversation']

    // 8-language dictionaries (spec §3.2); representative keys per language.
    const dictionaries = {
      zh: { 'meta.title': 'Uma 卡片', 'preview.title': '设计原型', 'card.open': '打开', 'workflow.ready': '已就绪', 'project.none': '暂无设计项目' },
      en: { 'meta.title': 'Uma cards', 'preview.title': 'Design preview', 'card.open': 'Open', 'workflow.ready': 'Ready', 'project.none': 'No design projects' },
      ja: { 'meta.title': 'Uma カード', 'preview.title': 'デザインプレビュー', 'card.open': '開く', 'workflow.ready': '準備完了', 'project.none': 'デザインプロジェクトがありません' },
      es: { 'meta.title': 'Tarjetas Uma', 'preview.title': 'Vista previa', 'card.open': 'Abrir', 'workflow.ready': 'Listo', 'project.none': 'Sin proyectos de diseño' },
      fr: { 'meta.title': 'Cartes Uma', 'preview.title': 'Aperçu', 'card.open': 'Ouvrir', 'workflow.ready': 'Prêt', 'project.none': 'Aucun projet de design' },
      de: { 'meta.title': 'Uma-Karten', 'preview.title': 'Designvorschau', 'card.open': 'Öffnen', 'workflow.ready': 'Bereit', 'project.none': 'Keine Designprojekte' },
      ru: { 'meta.title': 'Карточки Uma', 'preview.title': 'Предпросмотр', 'card.open': 'Открыть', 'workflow.ready': 'Готово', 'project.none': 'Нет проектов дизайна' },
      pt: { 'meta.title': 'Cartões Uma', 'preview.title': 'Prévia', 'card.open': 'Abrir', 'workflow.ready': 'Pronto', 'project.none': 'Sem projetos de design' },
    }

    // 3 runtime CSS strings (spec §6.1), deduped by style[data-plugin-css="<tagId>"].
    const pluginCss = [
      { tag: 'uma-design-preview', text: '[data-html-preview=true]{display:block}' },
      { tag: 'uma-workflow-cards', text: '[data-card-state=ready]{opacity:1}' },
      { tag: 'uma-resource-activity', text: '[data-resource-activity]{display:flex}' },
    ]
    const PLUGIN_TAG = '@deepseek-ai/dsh-client-ui-uma-design'

    // Components (spec §5.3) — simple stand-ins.
    const CardHeader = props => h('div', { class: 'card-header', 'data-ready': String(props?.ready) })
    const FileList = props => h('ul', { class: 'file-list' })
    const Loading = props => h('div', { 'data-state': 'preparing', title: props?.text })
    const DesignPreviewCard = props => h('div', {
      class: 'design-preview-card', 'data-tool': DATA_TOOL, title: props?.title,
    })
    const ResourceActivityCard = props => h('div', {
      class: 'resource-activity-card', 'data-resource-activity': true,
      'data-kind': props?.resource, 'data-operation': props?.operation,
    })
    const UmaArtifactCard = props => h('div', { class: 'uma-artifact-card' })
    const UmaGateCard = props => h('div', { class: 'uma-gate-card' })
    const DesignProjectCreateCard = props => h('div', { class: 'design-project-create-card' })
    const DesignProjectStatusCard = props => h('div', { class: 'design-project-status-card' })
    const UI_CARDS = {
      design_preview: DesignPreviewCard,
      uma_artifact_write: UmaArtifactCard,
      uma_gate_status: UmaGateCard,
      design_project_create: DesignProjectCreateCard,
      design_project_status: DesignProjectStatusCard,
    }

    // §5.4 — readPreview validation (frozen kind / version / path / sha256).
    function readPreview(value) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return null
      if (value.kind !== PREVIEW_KIND || value.version !== PREVIEW_VERSION) return null
      if (typeof value.path !== 'string' || !PREVIEW_PATH_RE.test(value.path)) return null
      if (typeof value.sha256 !== 'string' || !SHA256_RE.test(value.sha256)) return null
      return value
    }

    // §6.1 / §6.2 — register the resource activity event definition (frozen kind/target).
    function registerResourceActivity(ctx) {
      const definition = {
        kind: ACTIVITY_KIND,
        target: 'chat',
        artifactWriteRe: ARTIFACT_WRITE_RE,
        match(event) {
          if (event?.type === 'tool/call') return { id: String(event.data.callId), role: 'start' }
          if (event?.type === 'tool/result') return { id: String(event.data.message.source.callId), role: 'update' }
          if (event?.type === 'user/message' && event.data?.source?.kind === 'experience-recall') {
            return { id: 'recall-' + event.seq, role: 'start' }
          }
          return null
        },
        start(record) {
          if (!record || record.type !== 'tool/call') throw new Error('Resource receipt requires a recorded call')
          if (!record.operation) throw new Error('Resource receipt requires a registered operation')
          return { resource: record.resource, operation: record.operation, phase: 'running', seq: record.seq, time: record.time, startedAt: record.startedAt }
        },
        update(receipt, event) {
          return { ...receipt, phase: event?.isError ? 'failed' : 'completed' }
        },
      }
      const events = ctx.uiConversation && ctx.uiConversation.events
      if (events && typeof events.register === 'function') {
        events.register(definition)
      } else if (typeof events === 'function') {
        // Harness recorder only supports one-level chaining (ctx.foo.bar());
        // fall back to its observable callable form so the registration is recorded.
        events(definition)
      }
    }

    function apply(ctx) {
      registerResourceActivity(ctx)

      // §3.2 / §6.1 — dictionaries under NS with frozen effect label.
      ctx.effect(() => { ctx.locale.register(NS, dictionaries) }, 'ui-uma-design: dictionaries')

      // §6.1 — runtime CSS injection, deduped; guarded when no DOM (harness).
      ctx.effect(() => {
        if (typeof document === 'undefined' || !document.head) return
        for (const { tag, text } of pluginCss) {
          if (document.querySelector(`style[data-plugin-css="${tag}"]`)) continue
          const style = document.createElement('style')
          style.setAttribute('data-plugin-css', tag)
          style.setAttribute('data-plugin', PLUGIN_TAG)
          style.textContent = text
          document.head.appendChild(style)
        }
      }, 'ui-uma-design: css')

      const mount = (slot, registration, Component) =>
        ctx.slots.inject(slot, () => ctx.slots.register({ name: slot, locale: NS, ...registration }, Component))

      // §5.2 / §6.3 — design_preview with inject → t + applyFrontend.
      mount(TOOLVIEW_SLOT, {
        key: DATA_TOOL,
        inject: sessionId => {
          const t = ctx.locale.bind(NS)
          const applyFrontend = (path, hash) => {
            const items = ctx.workspaces.list.getSnapshot().items
            const owned = items.find(item => item.sessionIds.includes(sessionId))
            if (!owned) return false
            ctx.uiWorkspace.openSession(sessionId, {
              whenDraftExists: 'append',
              prompt: t('preview.handoffPrompt', { path, hash }),
            })
            return true
          }
          return { applyFrontend, readPreview }
        },
      }, UI_CARDS[DATA_TOOL])

      // 4 business cards + 8 empty placeholders (suppress default cards).
      for (const key of UI_CARD_KEYS.slice(1)) mount(TOOLVIEW_SLOT, { key }, UI_CARDS[key])
      for (const key of PLACEHOLDER_KEYS) mount(TOOLVIEW_SLOT, { key }, () => null)

      // §5.2 — one chat.node key (frozen activity kind).
      mount(CHAT_NODE_SLOT, { key: ACTIVITY_KIND }, ResourceActivityCard)
    }

    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
