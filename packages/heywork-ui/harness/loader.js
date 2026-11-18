/**
 * @heywork/ui — verification harness.
 *
 * Client UI modules use the dsh browser contract:
 *   window.__ModuleLoader__.load({ id, factory: require => module.exports })
 *   module.exports = { Config, apply(ctx, config), inject }
 *
 * The real factory calls ctx.slots.inject(...) / registerFactory(...) to mount
 * React components, and reads services off ctx. We cannot run React in this
 * sandbox (no pnpm), so the harness injects minimal mocks and RECORDS which
 * slots/services/locale keys are touched. That is exactly the mounting
 * contract the specs freeze — no pixel rendering required.
 *
 * Usage:
 *   const { runModule } = await import('./harness/loader.js')
 *   const result = await runModule('./src/brand.client.js', { config: {...} })
 *   // result.slots, result.services, result.locale, result.exports
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import vm from 'node:vm'

/** Repo root, resolved from this file's location so tests run from any cwd. */
export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

/** Minimal React stand-ins: components are functions returning a descriptor. */
function makeReact() {
  const el = (type, props, ...children) => ({ $$el: type, props: props ?? {}, children })
  return {
    createElement: el,
    Fragment: Symbol.for('react.fragment'),
    jsx: el,
    jsxs: el,
    jsxDEV: el,
    useState: init => [typeof init === 'function' ? init() : init, () => {}],
    useEffect: () => {},
    useMemo: fn => (typeof fn === 'function' ? fn() : fn),
    useCallback: fn => fn,
    useRef: v => ({ current: v }),
    useContext: () => undefined,
    memo: c => c,
    forwardRef: c => c,
    lazy: f => ({ $$lazy: true, loader: f }),
    Suspense: ({ children }) => children,
    createContext: () => ({ Provider: () => null, Consumer: () => null }),
  }
}

/** A ctx that records every service access and slot mount. */
export function makeCtx(overrides = {}) {
  const calls = { slots: [], services: [], effects: [], remotes: [], locale: [] }
  const slotRegistry = new Map()

  const slots = {
    inject(name, factory) {
      calls.slots.push({ op: 'inject', name })
      const registration = factory?.()
      if (registration) slotRegistry.set(name, registration)
      return () => {}
    },
    registerFactory(where, component) {
      const name = typeof where === 'string' ? where : where?.name
      calls.slots.push({ op: 'registerFactory', name, scope: where?.scope })
      return () => {}
    },
    register(registration, component) {
      calls.slots.push({ op: 'register', name: registration?.name, priority: registration?.priority })
      return registration
    },
    get(name) { calls.slots.push({ op: 'get', name }); return undefined },
  }

  // Build a sub-scope that shares the same call recorder, so slots mounted via
  // ctx.inject([...], scope => ...) are observable in the same `calls`.
  function makeScope() {
    const scopeSlots = {
      inject(name, factory) {
        calls.slots.push({ op: 'inject', name, scope: 'child' })
        const reg = factory?.()
        if (reg) slotRegistry.set(name, reg)
        return () => {}
      },
      register(registration, component) {
        calls.slots.push({ op: 'register', name: registration?.name, priority: registration?.priority, scope: 'child' })
        return registration
      },
      registerFactory(where, component) {
        const name = typeof where === 'string' ? where : where?.name
        calls.slots.push({ op: 'registerFactory', name, scope: where?.scope, child: true })
        return () => {}
      },
      get(name) { calls.slots.push({ op: 'get', name, scope: 'child' }); return undefined },
    }
    const scopeBase = {
      slots: scopeSlots,
      locale: base.locale,
      effect: base.effect,
      logger: base.logger,
    }
    return new Proxy(scopeBase, {
      get(target, prop) {
        if (prop in target) return target[prop]
        calls.services.push(`scope.${String(prop)}`)
        const rec = recorder(['scope', String(prop)])
        target[prop] = rec
        return rec
      },
    })
  }

  const base = {
    // ctx.inject(names, fn) — support both callback and property styles
    inject: (names, fn) => {
      calls.services.push(`inject(${Array.isArray(names) ? names.join(',') : names})`)
      if (typeof fn === 'function') return fn(makeScope())
      return makeScope()
    },
    slots,
    locale: {
      register: (ns, dict) => { calls.locale.push({ op: 'register', ns }); return () => {} },
      bind: ns => (key, ...args) => { calls.locale.push({ op: 't', ns, key }); return key },
      t: (key, ...args) => { calls.locale.push({ op: 't', key }); return key },
    },
    // Execute immediately so registrations inside effects are observable.
    effect: (fn, label) => {
      calls.effects.push({ label, fn })
      if (typeof fn === 'function') {
        try { fn() } catch (e) { calls.effects[calls.effects.length - 1].error = e.message }
      }
      return () => {}
    },
    logger: { warn: () => {}, error: () => {}, info: () => {}, debug: () => {} },
    ...overrides,
  }

  // A fully recursive chainable recorder: supports ctx.a, ctx.a.b, ctx.a.b(),
  // ctx.a.b.c(...). Every property access and call is logged with its full path.
  function recorder(path = []) {
    const fn = (...args) => {
      calls.services.push(`${path.join('.')}()`)
      return recorder(path) // calls can be chained too
    }
    return new Proxy(fn, {
      get(_t, prop) {
        // Do not become thenable/iterable — otherwise `await mockValue` hangs forever.
        if (prop === 'then' || prop === Symbol.iterator || prop === Symbol.toPrimitive ||
            prop === 'toString' || prop === 'catch' || prop === 'finally') return undefined
        const next = [...path, String(prop)]
        calls.services.push(next.join('.'))
        return recorder(next)
      },
      apply(_t, _this, args) {
        calls.services.push(`${path.join('.')}()`)
        return recorder(path)
      },
    })
  }

  // Proxy ctx so any service access is recorded (including deep chains).
  const ctx = new Proxy(base, {
    get(target, prop) {
      if (prop in target) return target[prop]
      const rec = recorder([String(prop)])
      calls.services.push(String(prop))
      target[prop] = rec
      return rec
    },
  })
  return { ctx, calls, slotRegistry }
}

/**
 * Execute a client module file in a sandbox with mocks, then call apply().
 * @param {string} file - absolute path to the rewritten client module
 * @param {object} opts - { config, ctxOverrides, extras }
 */
export async function runModule(file, opts = {}) {
  const abs = file.startsWith('/') ? file : resolve(REPO_ROOT, file)
  const source = readFileSync(abs, 'utf8')
  const modules = {
    'react': makeReact(),
    'react/jsx-runtime': makeReact(),
    'react/jsx-dev-runtime': makeReact(),
    '@deepseek-ai/cordis': { defineConfig: x => x, ctx: {} },
    '@deepseek-ai/schemastery': makeZod(),
    'zod': makeZod(),
    ...(opts.extras ?? {}),
  }
  const requireFn = (name) => {
    if (name in modules) return modules[name]
    // Auto-mock any @deepseek-ai/* service with a chainable proxy
    const rec = new Proxy(() => {}, {
      get: (_t, m) => (...args) => undefined,
      apply: () => undefined,
    })
    modules[name] = rec
    return rec
  }

  let loaded = null
  const sandbox = {
    window: { __ModuleLoader__: { load: mod => { loaded = mod } } },
    globalThis: {},
    console,
    require: requireFn,
    module: { exports: {} },
    exports: {},
    Symbol, Object, Array, String, Number, Boolean, JSON, Math, Date, Set, Map,
    Promise, Error, TypeError, RegExp, Function, Uint8Array, ArrayBuffer,
    setTimeout, clearTimeout, queueMicrotask,
  }
  sandbox.globalThis = sandbox
  vm.createContext(sandbox)
  vm.runInContext(source, sandbox, { filename: abs })

  if (!loaded) throw new Error('module did not call __ModuleLoader__.load')
  const factory = loaded.factory
  const moduleExports = factory(requireFn)

  const { ctx, calls, slotRegistry } = makeCtx(opts.ctxOverrides)
  if (typeof moduleExports.apply === 'function') {
    await moduleExports.apply(ctx, opts.config ?? {})
  }

  return {
    id: loaded.id,
    exports: Object.keys(moduleExports ?? {}).sort(),
    Config: moduleExports.Config,
    calls,
    slotRegistry,
    source,
  }
}

function makeZod() {
  const chain = () => {
    const p = new Proxy(function () {}, {
      get: (_t, k) => {
        if (k === 'default' || k === 'min' || k === 'max' || k === 'step' || k === 'optional') return () => p
        if (k === 'parse') return v => v
        return p
      },
      apply: () => p,
    })
    return p
  }
  const z = new Proxy({}, { get: () => chain() })
  z.object = () => chain()
  return z
}
