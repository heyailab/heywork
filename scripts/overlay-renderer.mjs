/**
 * Overlay the UMA-branded renderer files onto the upstream apps/desktop/renderer tree.
 * Runs in CI before dependency install / packaging; upstream files not present in the
 * overlay set stay untouched, so the shell keeps upstream behaviour elsewhere.
 *
 * Env: UMA_ASSETS_DIR (default: <repo>/uma-assets), UMA_RENDERER_TARGET (default:
 * <repo>/deepseek-harness/apps/desktop/renderer).
 */
import { copyFileSync, existsSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = process.env.UMA_PORT_ROOT ?? fileURLToPath(new URL('..', import.meta.url))
const assets = process.env.UMA_ASSETS_DIR ?? join(repoRoot, 'uma-assets')
const sourceRoot = join(assets, 'renderer')
const targetRoot = process.env.UMA_RENDERER_TARGET ?? join(repoRoot, 'deepseek-harness', 'apps', 'desktop', 'renderer')

// Files whose main-process counterparts still speak upstream dsh-app keep the
// upstream internal origin; the UMA frame script was already rewritten at asset
// preparation time (uma-app -> dsh-app).
const overlay = [
  'welcome.css',
  'update-dialog.html',
  'update-dialog.css',
  'update-dialog.js',
  'mandatory-update-frame.js',
  'assets/welcome-brand.svg',
  'assets/welcome-brand-dark.svg',
  'assets/uma-studio-mark.svg',
]

let copied = 0
for (const name of overlay) {
  const source = join(sourceRoot, name)
  const target = join(targetRoot, name)
  if (!existsSync(source)) throw new Error(`overlay source missing: ${relative(repoRoot, source)}`)
  if (!existsSync(dirname(target))) throw new Error(`overlay target directory missing: ${dirname(target)}`)
  copyFileSync(source, target)
  copied++
}
console.log(`uma renderer overlay: applied ${copied}/${overlay.length} files onto ${relative(repoRoot, targetRoot)}`)
