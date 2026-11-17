/**
 * 【逆向还原】由 `lib/profiles.js` 的 `//#region lib/types/profiles.js` 反推，非 DeepSeek 原始源码。
 *
 * 逻辑与 lib 逐行等价（控制流、字符串、错误文本一律未改）；类型注解由用法反推。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，无构建链，详见 src/README.md。
 */

/** UMA 已知 profile 名（由 UMA_PROFILE_BUNDLES 的键推断）。 */
type UmaProfileName = 'uma-web' | 'desktop' | 'uma-headless' | 'uma-sdk'

const BASE = '@deepseek-ai/dsh-base'
const UMA_BASE = '@deepseek-ai/dsh-uma-base'

/** Ordered UMA profile layers shared by source preparation and the Desktop runtime. */
export const UMA_PROFILE_BUNDLES: Record<UmaProfileName, string[]> = {
  'uma-web': [
    BASE,
    '@deepseek-ai/dsh-web-app',
    UMA_BASE,
    '@deepseek-ai/dsh-uma-web'
  ],
  desktop: [
    BASE,
    '@deepseek-ai/dsh-web-app',
    UMA_BASE,
    '@deepseek-ai/dsh-uma-web'
  ],
  'uma-headless': [
    BASE,
    '@deepseek-ai/dsh-headless',
    UMA_BASE,
    '@deepseek-ai/dsh-uma-automation'
  ],
  'uma-sdk': [
    BASE,
    '@deepseek-ai/dsh-sdk-app',
    UMA_BASE,
    '@deepseek-ai/dsh-uma-automation'
  ]
}

/**
 * Recognize a profile identity accepted by the UMA composition owner.
 * @param name - Requested profile name.
 * @returns Whether the name has a managed UMA bundle tuple.
 */
export function isUmaProfileName(name: string): boolean {
  return Object.hasOwn(UMA_PROFILE_BUNDLES, name)
}

/**
 * Insert missing UMA layers after a recognized legacy kernel pair, preserving all existing third-party order.
 * Current UMA tuples remain unchanged. Partial, duplicated or reordered owned layers reject without mutation.
 * @param name - UMA profile whose ordered layers are required.
 * @param current - Parsed ordered bundle names from an existing profile.
 * @returns The existing list or a new migrated list; the input is never modified.
 */
export function migrateUmaProfileBundles(name: string, current: string[]): string[] {
  const expected = UMA_PROFILE_BUNDLES[name as UmaProfileName]
  const owned = new Set(Object.values(UMA_PROFILE_BUNDLES).flat())
  const present = current.filter(bundle => owned.has(bundle))
  if (present.length === expected.length && present.every((bundle, index) => bundle === expected[index])) return current
  if (present.length !== 2 || present[0] !== expected[0] || present[1] !== expected[1]) throw new Error(`UMA profile ${name}: unrecognized owned bundle order; review the profile before preparing it`)
  const insertion = current.indexOf(expected[1]) + 1
  return [
    ...current.slice(0, insertion),
    ...expected.slice(2),
    ...current.slice(insertion)
  ]
}
