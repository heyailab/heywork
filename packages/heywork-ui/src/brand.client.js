/**
 * @heywork/ui — brand presentation module.
 * Rewritten from specs/ui-brand.md (mounting contract), not translated from the
 * minified UMA bundle. Exposes the dsh browser contract:
 *   window.__ModuleLoader__.load({ id, factory: require => ({ Config, apply, inject }) })
 * Mount targets, locale keys and export surface follow the spec exactly;
 * component internals are simple stand-ins (pixel fidelity is out of scope).
 */
window.__ModuleLoader__.load({
  id: '@heywork/dsh-client-ui-brand',
  factory: require => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const jsxRuntime = require('react/jsx-runtime')
    const h = jsxRuntime.jsx || jsxRuntime.createElement

    // --- Config (spec §2): name default 'UMA Studio' ---
    const Config = { name: 'UMA Studio' }
    const inject = ['locale', 'theme', 'slots', 'effect']

    // --- running status copy (spec §3.2), 8 languages, 2 keys each ---
    const runningCopy = {
      zh: { running: 'Uma 正在处理', elapsed: 'Uma 正在处理，已用时 {duration}' },
      en: { running: 'Uma is working', elapsed: 'Uma is working · {duration}' },
      ja: { running: 'Uma が処理中', elapsed: 'Uma が処理中 · {duration}' },
      es: { running: 'Uma está trabajando', elapsed: 'Uma está trabajando · {duration}' },
      fr: { running: 'Uma travaille', elapsed: 'Uma travaille · {duration}' },
      de: { running: 'Uma arbeitet', elapsed: 'Uma arbeitet · {duration}' },
      ru: { running: 'Uma работает', elapsed: 'Uma работает · {duration}' },
      pt: { running: 'Uma está trabalhando', elapsed: 'Uma está trabalhando · {duration}' },
    }

    // --- stylesheet override (spec §6.1): design tokens, light/dark + reduced transparency ---
    const brandCss = [
      'body{--dsw-alias-bg-base:#f7f8fa;--dsw-alias-brand-primary:#191a1d;--dsw-focus-ring-color:#505257;--dsw-alias-brand-primary-display:var(--dsw-alias-brand-primary);--dsw-alias-brand-reverse-display:#fff}',
      'body[data-ds-dark-theme]{--dsw-alias-bg-base:#15171b;--dsw-alias-brand-primary:#edf0f4;--dsw-focus-ring-color:#c3cbd7;--dsw-alias-brand-primary-display:var(--dsw-alias-brand-reverse);--dsw-alias-brand-reverse-display:var(--dsw-alias-brand-primary)}',
      '@media (prefers-reduced-transparency:reduce){body{--dsw-alias-composer-background:#fff;backdrop-filter:none}}',
    ].join('\n')

    // --- components (spec §5.3): semantic stand-ins ---
    const UmaBrandMark = props => h('img', { class: 'uma-brand-mark', size: props?.size })
    const BrandName = props => h('span', { class: 'brand-name' }, props?.name)
    const SidebarBrandIdentity = props => {
      const name = props?.name
      if (name === 'UMA Studio') return h('img', { class: 'studio-lock', width: 156, height: 26 })
      if (name !== '优码云') return h('span', null, h(UmaBrandMark, {}), h(BrandName, { name }))
      return h('img', { class: 'parent-lock', width: 132, height: 40 })
    }
    const SidebarBrandMark = props => h(UmaBrandMark, { size: props?.size })
    const SidebarBrandName = props => h(BrandName, { name: props?.name })
    const HeroBrandMark = props => h(UmaBrandMark, { size: Math.round((props?.size ?? 1) * 1.4), class: 'heroMark' })
    const ProjectDirectorMark = () => h('img', { class: 'project-director-mark' })
    const RunningIndicator = props => {
      const t = props?.t || (key => key)
      const text = props?.duration == null ? t('running') : t('elapsed', { duration: props.duration })
      return props?.holding ? null : h('span', { role: 'status', 'aria-live': 'polite' }, text)
    }

    function apply(ctx, config = {}) {
      const name = config.name ?? Config.name

      // stylesheet + locale registration (spec §6.1)
      ctx.effect(() => {
        ctx.theme.overrideStylesheet('@heywork/dsh-client-ui-brand/brand.css', brandCss)
      })
      ctx.effect(() => {
        ctx.locale.register('uma-running', runningCopy)
      })

      // 5 slots via slots.inject → register (spec §5.2)
      const injectSlot = (slot, Component, withName) => {
        ctx.slots.inject(slot, () => ctx.slots.register(
          { name: slot, priority: -1, ...(withName ? { inject: () => ({ name }) } : {}) },
          Component,
        ))
      }
      injectSlot('sidebar.brand.identity', SidebarBrandIdentity, true)
      injectSlot('sidebar.brand.mark', SidebarBrandMark, false)
      injectSlot('sidebar.brand.name', SidebarBrandName, true)
      injectSlot('conversation.hero.brand.mark', HeroBrandMark, false)
      injectSlot('conversation.chat.running-indicator', RunningIndicator, false)

      // 1 slot via effect → registerFactory(root) (spec §5.2)
      ctx.effect(() => {
        ctx.slots.registerFactory(
          { name: 'conversation.chat.assistant.brand', scope: 'root' },
          ProjectDirectorMark,
        )
      })
    }

    exports.Config = Config
    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
