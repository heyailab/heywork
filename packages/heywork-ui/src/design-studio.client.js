/**
 * @heywork/ui — Design Studio presentation module.
 * Rewritten from specs/ui-design-studio.md, not translated from bundle.
 * Exposes the dsh browser contract:
 *   window.__ModuleLoader__.load({ id, factory: require => ({ Config, apply, inject }) })
 * Mount targets, locale namespace and invariants follow the spec exactly;
 * component internals are simple stand-ins (pixel fidelity is out of scope).
 */
window.__ModuleLoader__.load({
  id: '@heywork/dsh-client-ui-design-studio',
  factory: require => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const jsx = require('react/jsx-runtime')
    const h = jsx.jsx || jsx.createElement

    // Frozen identifiers (spec §1.1 / §4.4 / §5.1) — kept verbatim.
    const NS = 'uiDesignStudio'
    const PANEL_ID = 'design'
    const DELIVERY_PANEL_ID = 'delivery'
    const OPERATIONS_PANEL_ID = 'uma-operations'
    const SSH_PATH = '/uma/operations/ssh'

    // Config (spec §2.1): z.object({ showInternalLibrary: z.boolean().default(false) }).
    // Client side exposes the resolved default as a harness-observable plain object.
    const Config = { showInternalLibrary: false }

    // Browser ctx-service inject (spec §4.1, 11 items).
    const inject = [
      'slots', 'locale', 'layout', 'uiWorkspace', 'remote',
      'remote.commands', 'remote.workspaceFiles', 'remote.codingWorkbench',
      'workspaces', 'resources', 'sessions',
    ]

    // 8-language dictionaries (spec §3.1 / §3.2); representative keys per language.
    const dictionaries = {
      zh: { 'meta.title': '设计工作台', panel: '面板', 'operations.title': '运维', 'brief.title': '设计简报', 'delivery.title': '交付工作台' },
      en: { 'meta.title': 'Design Studio', panel: 'Panel', 'operations.title': 'Operations', 'brief.title': 'Design brief', 'delivery.title': 'Delivery' },
      ja: { 'meta.title': 'デザインスタジオ', panel: 'パネル', 'operations.title': '運用', 'brief.title': 'デザイン概要', 'delivery.title': 'デリバリー' },
      es: { 'meta.title': 'Estudio de diseño', panel: 'Panel', 'operations.title': 'Operaciones', 'brief.title': 'Resumen de diseño', 'delivery.title': 'Entrega' },
      fr: { 'meta.title': 'Studio de design', panel: 'Panneau', 'operations.title': 'Opérations', 'brief.title': 'Brief de design', 'delivery.title': 'Livraison' },
      de: { 'meta.title': 'Designstudio', panel: 'Bereich', 'operations.title': 'Betrieb', 'brief.title': 'Design-Briefing', 'delivery.title': 'Auslieferung' },
      ru: { 'meta.title': 'Студия дизайна', panel: 'Панель', 'operations.title': 'Операции', 'brief.title': 'Бриф', 'delivery.title': 'Поставка' },
      pt: { 'meta.title': 'Estúdio de design', panel: 'Painel', 'operations.title': 'Operações', 'brief.title': 'Brief de design', 'delivery.title': 'Entrega' },
    }

    // Components (spec §5.3) — simple stand-ins.
    const DesignStudioPage = props => h('div', { 'data-panel': PANEL_ID, 'data-show-raw': String(props?.showRawReference) })
    const DeliveryPage = () => h('div', { 'data-panel': DELIVERY_PANEL_ID })
    const OperationsPage = props => h('div', { 'data-panel': OPERATIONS_PANEL_ID, 'data-ssh': SSH_PATH })
    const DesignStudioIcon = () => h('span', { 'data-icon': PANEL_ID })
    const OperationsIcon = () => h('span', { 'data-icon': 'operations' })
    const TaskDetailsTab = () => h('div', { 'data-tab': 'uma-task-details' })
    const TaskDetailsMenu = () => h('button', { 'data-menu': 'uma-task-details' })

    function apply(ctx, config = {}) {
      const showRawReference = config.showInternalLibrary ?? Config.showInternalLibrary
      const desktop = typeof document !== 'undefined' &&
        !!document.documentElement && document.documentElement.hasAttribute('data-platform')

      // §3.2 / §6.1 — register 8-language dictionary under NS with frozen effect label.
      ctx.effect(() => { ctx.locale.register(NS, dictionaries) }, 'ui-design-studio: dictionaries')
      const t = ctx.locale.bind(NS)

      // §6.2 — register two virtual resource protocols (frozen names).
      ctx.effect(() => {
        ctx.resources.register({ name: 'uma-verification', open: async function* open() {} })
        ctx.resources.register({ name: 'uma-delivery-artifacts', open: async function* open() {} })
      }, 'ui-design-studio: resources')

      // §6.1 / §6.4 — native menu subscription switches to the operations panel.
      ctx.effect(() => {
        const openOperations = () => ctx.layout.selectPanel(OPERATIONS_PANEL_ID)
        const bridge = typeof window !== 'undefined' ? window.umaOperations : null
        if (bridge && typeof bridge.subscribeOpen === 'function') bridge.subscribeOpen(openOperations)
      }, 'UMA Operations: native menu')

      // §6.1 / §6.3 — sub-scope injection and right-click menus (frozen ids/order).
      ctx.effect(() => {
        const registerMenus = scope => {
          const menus = (scope && scope.contextMenus) || ctx.contextMenus
          menus.register({ id: 'uma-project-task-details', target: 'workspace', order: 440, observe: [] }, () => null)
          menus.register({ id: 'uma-task-details', target: 'session', order: 440 }, () => null)
        }
        ctx.inject(['sidebarRight', 'sidebarRightTabs', 'contextMenus'], registerMenus)
      }, 'ui-design-studio: context menus')

      // §5.2 / §6.1 — 7 slot entries across 4 distinct slots.
      // main: showRawReference:false + workspace/session hooks (spec §6.4).
      const startSession = (prompt, workspaceId) => ctx.uiWorkspace.startSession(
        workspaceId,
        { ...(desktop ? {} : { agentPreset: 'uma-design' }), prompt, whenDraftExists: 'append' },
      )
      const openSession = sessionId => ctx.uiWorkspace.openSession(sessionId, { whenDraftExists: 'append' })
      const mount = (slot, registration, Component) =>
        ctx.slots.inject(slot, () => ctx.slots.register({ name: slot, locale: NS, ...registration }, Component))

      mount('main', { key: PANEL_ID, inject: () => ({ showRawReference, currentWorkspace: ctx.uiWorkspace.currentWorkspace, startSession, openSession }) }, DesignStudioPage)
      mount('main', { key: DELIVERY_PANEL_ID, inject: () => ({ startSession, openSession }) }, DeliveryPage)
      mount('main', { key: OPERATIONS_PANEL_ID, inject: () => ({ sshPath: SSH_PATH }) }, OperationsPage)
      mount('sidebar.panellist', { key: OPERATIONS_PANEL_ID, order: 8, label: 'operations.title' }, OperationsIcon)
      mount('sidebar.panellist', { key: PANEL_ID, order: 7, label: 'panel' }, DesignStudioIcon)
      mount('sidebar.right.pane.tab', { key: 'uma-task-details', inject: () => ({ openDetails: sessionId => openSession(sessionId) }) }, TaskDetailsTab)
      mount('conversation.session.header.menu', { key: 'uma-task-details', inject: () => ({ openDetails: sessionId => openSession(sessionId) }) }, TaskDetailsMenu)
    }

    exports.Config = Config
    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
