/**
 * Rename the UMA identity to HEY across the tracked source tree.
 *
 * This is a deliberate, ordered replacement — NOT a blind global sed. UMA appears
 * in several distinct namespaces, some of which must NOT be renamed:
 *
 *   rename   project/repo names, tool names, package names, skill names,
 *            environment variables, protocol scheme, data-root, product label
 *   KEEP     upstream DeepSeek identifiers (@deepseek-ai/*, dsh-* core APIs),
 *            the v0.2.2-rc.3 baseline, and all vendored 3rd-party deps
 *   DEFER    the platform origin (studio.umayun.com) — needs a real new domain,
 *            centralized as HEY_PLATFORM_ORIGIN and substituted separately
 *
 * Usage:
 *   node scripts/rename-uma-to-hey.mjs --dry-run     # show what would change
 *   node scripts/rename-uma-to-hey.mjs               # apply to tracked text files
 *   node scripts/rename-uma-to-hey.mjs --origin https://your.new.domain
 *
 * The replacement is idempotent: running it twice produces no further changes.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

const ROOT = process.env.HEY_ROOT ?? resolve(import.meta.dirname, '..')
const DRY = process.argv.includes('--dry-run')
const originFlag = process.argv.indexOf('--origin')
const NEW_ORIGIN = originFlag >= 0 ? process.argv[originFlag + 1] : undefined

if (NEW_ORIGIN !== undefined && !/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/iu.test(NEW_ORIGIN)) {
  console.error(`rename: --origin must be an https origin without path, got: ${NEW_ORIGIN}`)
  process.exit(2)
}

/**
 * Ordered replacements. Longer/more-specific patterns come first so that e.g.
 * `DSH_DESKTOP_UMA_INJECT` is handled before a bare `UMA_`.
 * Keys are regex source strings; values are either a string or a function.
 */
const RULES = [
  // --- product & project identity -------------------------------------------
  [/\bUMA Studio\b/g, 'HeyWork'],
  [/\buma-studio\b/g, 'heywork'],
  [/\buma-windows-port\b/g, 'heywork'],
  [/\buma-window\b/g, 'heywork'],
  [/\bheyailab\/uma-window\b/g, 'heyailab/heywork'],

  // --- environment variables (before generic UMA_) -------------------------
  [/\bDSH_DESKTOP_UMA_INJECT\b/g, 'DSH_DESKTOP_HEY_INJECT'],
  [/\bUMA_DESKTOP_BUNDLES\b/g, 'HEY_DESKTOP_BUNDLES'],
  [/\bUMA_PROFILE_BUNDLES\b/g, 'HEY_PROFILE_BUNDLES'],
  [/\bUMA_ASSETS_DIR\b/g, 'HEY_ASSETS_DIR'],
  [/\bUMA_PORT_ROOT\b/g, 'HEY_ROOT'],
  [/\bUMA_DSH_ROOT\b/g, 'HEY_DSH_ROOT'],
  [/\bUMA_DSH_TREE\b/g, 'HEY_DSH_TREE'],
  [/\bUMA_PACKAGES\b/g, 'HEY_PACKAGES'],
  [/\bUMA_RENDERER_TARGET\b/g, 'HEY_RENDERER_TARGET'],
  [/\bUMA_SKIP_VERIFY\b/g, 'HEY_SKIP_VERIFY'],
  [/\bUMA_HOME\b/g, 'HEY_HOME'],

  // --- protocol, data root, product id -------------------------------------
  [/uma:\/\//g, 'hey://'],
  [/\.uma\b/g, '.hey'],                      // ~/.uma, studio.uma, .uma/ 数据根

  // --- tool names (14) ------------------------------------------------------
  [/\buma_artifact_write\b/g, 'hey_artifact_write'],
  [/\buma_artifact_read\b/g, 'hey_artifact_read'],
  [/\buma_gate_status\b/g, 'hey_gate_status'],
  [/\buma_workspace_search\b/g, 'hey_workspace_search'],
  [/\buma_ssh_servers\b/g, 'hey_ssh_servers'],
  [/\buma_ssh_run\b/g, 'hey_ssh_run'],
  [/\buma_project_memory\b/g, 'hey_project_memory'],
  [/\buma_experience_record\b/g, 'hey_experience_record'],
  [/\buma_weknora_search\b/g, 'hey_weknora_search'],
  [/\buma_wiki_lookup\b/g, 'hey_wiki_lookup'],
  [/\buma_resource_read\b/g, 'hey_resource_read'],
  [/\buma_knowledge_search\b/g, 'hey_knowledge_search'],
  [/\buma_session_budgets\b/g, 'hey_session_budgets'],
  [/\buma_guidance\b/g, 'hey_guidance'],

  // --- package / plugin / skill ids ----------------------------------------
  [/\bdsh-client-ui-uma-/g, 'dsh-client-ui-hey-'],
  [/\bdsh-client-uma-/g, 'dsh-client-hey-'],
  [/\bdsh-tool-uma-/g, 'dsh-tool-hey-'],
  [/\bdsh-util-uma-/g, 'dsh-util-hey-'],
  [/\bdsh-uma-/g, 'dsh-hey-'],
  [/\bui-uma-/g, 'ui-hey-'],
  [/\bskill-uma\b/g, 'skill-hey'],
  [/\btool-uma-/g, 'tool-hey-'],
  [/\buma-(?=[a-z])/g, 'hey-'],

  // --- remaining word-boundary UMA tokens ----------------------------------
  // UMA_* env/markers: replace only the prefix so UMA_KNOWLEDGE_BASE -> HEY_KNOWLEDGE_BASE
  // Also catch `UMA_*` written literally in prose (the * is not a word char).
  [/\bUMA_\*/g, 'HEY_*'],
  [/\bUMA_([A-Z][A-Z0-9_]*)\b/g, 'HEY_$1'],
  // uma_ identifiers not covered by the named tool list (badges, schema ids, prefixes)
  [/\buma_([a-z][a-z0-9_]*)\b/g, 'hey_$1'],
  [/\bUMA\b/g, 'HEY'],
  [/\buma\b/g, 'hey'],
]

// Paths we must never rewrite: upstream sources, vendored deps, git internals,
// the encrypted container, and this script itself (which documents the old names).
const SKIP = /(^|\/)(deepseek-harness|\.git|node_modules|deps)(\/|$)|resources\.umadb$|rename-uma-to-hey\.mjs$/u

/**
 * FROZEN IDENTIFIERS — discovered the hard way on 2026-11-17.
 *
 * A blind uma->hey pass broke five classes of byte-exact contracts. These must
 * stay UMA even in a HEY-branded build; changing any of them silently kills the
 * product (container undecryptable, tools unregistered, patches unappliable):
 *
 *  1. the AES key derivation string (umadb is encrypted with the old bytes)
 *  2. container-internal virtual paths (uma-team/references, uma-design-systems/…)
 *  3. package names / on-disk directory names (@deepseek-ai/dsh-uma-*, dsh-skill-uma/)
 *  4. filenames referenced by config (uma-platform.patch.yml, *-design.patch.yml)
 *  5. switch ids and typert tool ids bound to the layer/product patch
 *     (uma-feedback, uma-guidance, uma_session_budgets)
 *
 * The rename pass is therefore split: this script only ever touched *external*
 * identity (product name, protocol, data root, repo name, env var prefix).
 * Run `node scripts/rename-uma-to-hey.mjs --verify-frozen` to assert none of
 * the frozen strings drifted.
 */
const FROZEN = [
  'UMA Studio local resource container v1',
  'uma-design-systems', 'uma-design-md',
  'uma-team/references', 'uma-quality-gate/references', 'uma-delivery-docs/templates',
  'uma-design-taste/references', 'uma-design-craft/references', 'uma-apple-review/references',
  'dsh-skill-uma', 'dsh-uma-base', 'dsh-uma-web', 'dsh-tool-uma-design',
  'uma-platform.patch.yml', 'uma-feedback', 'uma-guidance', 'uma_session_budgets',
]

if (process.argv.includes('--verify-frozen')) {
  let bad = 0
  for (const rel of trackedFiles().filter(f => !SKIP.test(f))) {
    let src
    try { src = readFileSync(join(ROOT, rel), 'utf8') } catch { continue }
    // Only flag the "HeyWork-ified" corruptions we actually observed.
    for (const frozen of FROZEN) {
      const corrupted = frozen.replace(/UMA Studio/g, 'HeyWork').replace(/uma/g, 'hey')
      if (corrupted !== frozen && src.includes(corrupted)) {
        console.error(`frozen identifier drifted in ${rel}: ${frozen} -> ${corrupted}`)
        bad++
      }
    }
  }
  console.log(bad === 0 ? 'frozen identifiers: OK' : `frozen identifiers: ${bad} drift(s)`)
  process.exit(bad === 0 ? 0 : 1)
}

function trackedFiles() {
  const out = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
  return out.split('\0').filter(Boolean)
}

const TEXT_EXT = /\.(md|txt|ts|tsx|js|cjs|mjs|json|yml|yaml|sh|ps1|csv|html|css|svg|example|patch|diff)$/iu
const files = trackedFiles().filter(f => !SKIP.test(f) && (TEXT_EXT.test(f) || /^(README|PLAN|WINDOWS-DEV|REWRITE-PLAN)/.test(f)))

let changed = 0
let totalSubs = 0
for (const rel of files) {
  const path = join(ROOT, rel)
  if (!existsSync(path)) continue
  let src = readFileSync(path, 'utf8')
  let out = src
  for (const [re, to] of RULES) out = out.replace(re, to)
  if (out !== src) {
    const subs = (src.match(/uma/giu) ?? []).length
    totalSubs += subs
    changed++
    if (!DRY) writeFileSync(path, out, 'utf8')
    console.log(`${DRY ? 'would change' : 'changed'}: ${rel} (${subs} uma tokens)`)
  }
}

if (NEW_ORIGIN !== undefined) {
  console.log(`\nplatform origin would be set to: ${NEW_ORIGIN}`)
  console.log('  (run the dedicated origin pass after you confirm the domain)')
}

console.log(`\n${DRY ? 'DRY RUN' : 'APPLIED'}: ${changed} files, ${totalSubs} tokens replaced`)
