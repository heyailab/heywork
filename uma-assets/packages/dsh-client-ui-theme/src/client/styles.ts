import type { Context } from '@deepseek-ai/cordis'
import type { ThemeStylesheetLayer } from './index.ts'
import base from '../styles/base.css?inline'
import cornerShape from '../styles/corner-shape.css?inline'
import designPlatform from '../styles/design-platform.css?inline'
import focus from '../styles/focus.css?inline'
import onboarding from '../styles/onboarding.css?inline'
import scrollbar from '../styles/scrollbar.css?inline'
import gradientShadowText from '../styles/gradient-shadow-text.css?inline'
import shiki from '../styles/shiki.css?inline'

const PLUGIN_ID = '@deepseek-ai/dsh-client-ui-theme'
const HAIRLINE_WIDTH = '--dsh-hairline-width'

const STYLES = [
  ['base.css', base],
  ['corner-shape.css', cornerShape],
  ['design-platform.css', designPlatform],
  ['focus.css', focus],
  ['onboarding.css', onboarding],
  ['scrollbar.css', scrollbar],
  ['gradient-shadow-text.css', gradientShadowText],
  ['shiki.css', shiki],
] as const

/**
 * Mount global theme sheets; window-backed documents also publish the DPR-aware stroke width.
 * @param ctx - Owning plugin context.
 */
export function installThemeStyles(ctx: Context): void {
  if (typeof document === 'undefined') return
  const ownerDocument = document
  const view = ownerDocument.defaultView
  const focusAnchor = ownerDocument.createElement('style')
  const extensions = new Map<string, HTMLStyleElement>()
  if (view !== null) ctx.effect(() => {
    const root = ownerDocument.documentElement
    const previousWidth = root.style.getPropertyValue(HAIRLINE_WIDTH)
    const previousPriority = root.style.getPropertyPriority(HAIRLINE_WIDTH)
    const matchMedia = typeof view.matchMedia === 'function' ? view.matchMedia.bind(view) : undefined
    let resolution: MediaQueryList | undefined
    const updateStroke = (): void => {
      // Positive borders round down to whole device pixels, with a one-pixel minimum.
      const dpr = view.devicePixelRatio
      const width = Math.max(1, Math.floor(0.5 * dpr)) / dpr
      root.style.setProperty(HAIRLINE_WIDTH, `${width}px`)
      resolution?.removeEventListener('change', updateStroke)
      resolution = matchMedia?.(`(resolution: ${dpr}dppx)`)
      resolution?.addEventListener('change', updateStroke)
    }
    updateStroke()
    return () => {
      resolution?.removeEventListener('change', updateStroke)
      if (previousWidth === '') root.style.removeProperty(HAIRLINE_WIDTH)
      else root.style.setProperty(HAIRLINE_WIDTH, previousWidth, previousPriority)
    }
  }, 'ui-theme: DPR-aware hairline width')
  for (const [name, css] of STYLES) {
    ctx.effect(() => {
      const tag = name === 'focus.css' ? focusAnchor : ownerDocument.createElement('style')
      tag.dataset.plugin = PLUGIN_ID
      tag.dataset.pluginCss = `${PLUGIN_ID}/${name}`
      tag.textContent = css
      ownerDocument.head.appendChild(tag)
      return () => { tag.remove() }
    }, `ui-theme: ${name} stylesheet`)
  }
  const update = (layers: readonly ThemeStylesheetLayer[]): void => {
    const active = new Set(layers.map(layer => layer.source))
    for (const [source, tag] of extensions) {
      if (active.has(source)) continue
      tag.remove()
      extensions.delete(source)
    }
    for (const layer of layers) {
      let tag = extensions.get(layer.source)
      if (tag === undefined) {
        tag = ownerDocument.createElement('style')
        tag.dataset.plugin = PLUGIN_ID
        tag.dataset.pluginCss = layer.source
        extensions.set(layer.source, tag)
      }
      if (tag.textContent !== layer.css) tag.textContent = layer.css
      ownerDocument.head.insertBefore(tag, focusAnchor)
    }
  }
  ctx.on('theme/styles-change', update)
  ctx.effect(() => () => {
    for (const tag of extensions.values()) tag.remove()
    extensions.clear()
  }, 'ui-theme: extension stylesheets')
}
