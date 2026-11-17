/**
 * Extract the HEY shell locale dictionaries from the bundled main.js, compare them
 * against the upstream apps/desktop/src/locale.ts key sets, and emit a replacement
 * locale.ts (upstream helper functions preserved verbatim).
 *
 * Usage: node locale-port.mjs <hey-main.js> <upstream-locale.ts> <out-locale.ts> [--report-only]
 */
import { readFileSync, writeFileSync } from 'node:fs'

const [mainJsPath, upstreamPath, outPath] = process.argv.slice(2, 5)
const reportOnly = process.argv.includes('--report-only')
if (mainJsPath === undefined || upstreamPath === undefined) {
  console.error('usage: node locale-port.mjs <hey-main.js> <upstream-locale.ts> <out-locale.ts> [--report-only]')
  process.exit(1)
}

const evalDictionaries = (code, names) => {
  const runner = new Function(`${code}
    return { ${names.join(', ')} };`)
  return runner()
}

// --- 1. HEY bundle dictionaries ---------------------------------------------
const mainJs = readFileSync(mainJsPath, 'utf8').split('\n')
const enStart = mainJs.findIndex(line => line.trim() === 'const en = {')
const dictStart = mainJs.findIndex(line => line.trim() === 'const dictionaries = {')
const resolveStart = mainJs.findIndex(line => line.trim() === 'function resolveDesktopLocale(locale) {')
if (enStart < 0 || dictStart < 0 || resolveStart < 0) throw new Error('locale region markers not found in main.js')
const dictEnd = mainJs.findIndex((line, index) => index > dictStart && index < resolveStart && line.trim() === '};')
if (dictEnd < 0) throw new Error('dictionaries closing brace not found')

// en object spans from its start to the dictionary start (closing brace of en sits just before).
const enSource = mainJs.slice(enStart, dictStart).join('\n')
const dictionariesSource = mainJs.slice(dictStart, dictEnd + 1).join('\n')
const hey = evalDictionaries(`${enSource}\n${dictionariesSource}`, ['en', 'dictionaries'])
const umaDictionaries = { ...hey.dictionaries, en: hey.en }
const umaLanguages = Object.keys(umaDictionaries)

// --- 2. Upstream dictionaries -------------------------------------------------
const originalUpstream = readFileSync(upstreamPath, 'utf8')
let upstreamTs = originalUpstream
upstreamTs = upstreamTs
  .replace(/^export /gm, '')
  .replace(/\s+satisfies\s+[^;\n]*(?=\s*$)/gm, '\n')
  .replace(/\s+as const\s*$/gm, '\n')
  .replace(/^type\s[^\n]*$/gm, '')
// strip everything after the last dictionary so helper functions cannot fail evaluation
const dictsMatch = upstreamTs.match(/const dictionaries = \{[^}]*\}/)
if (dictsMatch === null) throw new Error('upstream dictionaries marker not found')
const dictsStart = upstreamTs.indexOf(dictsMatch[0])
const upstreamHead = upstreamTs.slice(0, dictsStart)
const upstreamDicts = dictsMatch[0]
const upstreamEvalSource = `${upstreamHead}\n${upstreamDicts}\nreturn { en, zh, ja, es, fr, de, ru, pt };`
const upstream = evalDictionaries(upstreamEvalSource, ['en', 'zh', 'ja', 'es', 'fr', 'de', 'ru', 'pt'])

// --- 3. Compare ---------------------------------------------------------------
const keys = dictionary => Object.keys(dictionary).sort()
const upstreamKeys = keys(upstream.en)
const report = { languages: {}, upstreamOnly: [], summary: {} }
for (const language of umaLanguages) {
  const umaKeys = keys(umaDictionaries[language])
  const missing = upstreamKeys.filter(key => !umaKeys.includes(key))
  const added = umaKeys.filter(key => !upstreamKeys.includes(key))
  report.languages[language] = { keys: umaKeys.length, missing, added }
}
report.upstreamOnly = upstreamKeys.filter(key => !keys(umaDictionaries.en).includes(key))
const enMissing = report.languages.en?.missing ?? []
console.log('=== per-language key counts ===')
for (const language of umaLanguages) {
  const entry = report.languages[language]
  console.log(`${language}: ${entry.keys} keys, ${entry.missing.length} missing-from-HEY, ${entry.added.length} HEY-added`)
}
console.log(`upstream keys absent from HEY en (${enMissing.length}):`)
for (const key of enMissing) console.log(`  - ${key}`)
const addedEn = report.languages.en?.added ?? []
console.log(`HEY-added keys in en (${addedEn.length}): ${addedEn.slice(0, 12).join(', ')}${addedEn.length > 12 ? ' …' : ''}`)
// non-en completeness: every HEY-en key must exist in each language
for (const language of umaLanguages.filter(name => name !== 'en')) {
  const missingAgainstEn = keys(umaDictionaries.en).filter(key => !(key in umaDictionaries[language]))
  if (missingAgainstEn.length > 0) console.log(`WARN ${language}: missing ${missingAgainstEn.length} keys vs HEY en`)
}

if (reportOnly) process.exit(0)

// --- 4. Emit replacement locale.ts ---------------------------------------------
// Values are JSON-serialized (safe quoting); upstream helper functions are preserved.
const serializeValue = (value, indent) => {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'object' && value !== null) {
    const inner = Object.entries(value).map(([key, entry]) =>
      `${indent}\t${JSON.stringify(key)}: ${serializeValue(entry, `${indent}\t`)},`).join('\n')
    return `{\n${inner}\n${indent}}`
  }
  throw new Error(`unsupported locale value type: ${typeof value}`)
}
const serializeDictionary = (dictionary, indent) => {
  const lines = Object.entries(dictionary).map(([key, value]) =>
    `${indent}${JSON.stringify(key)}: ${serializeValue(value, indent)},`)
  return lines.join('\n')
}
const dictNames = ['en', 'zh', 'ja', 'es', 'fr', 'de', 'ru', 'pt']
for (const name of dictNames) if (!(name in umaDictionaries)) throw new Error(`HEY dictionaries lack ${name}`)

// Backfill upstream keys that HEY dropped (its welcome redesign stopped using them),
// keeping the current upstream WelcomePage.tsx compilable until lib/welcome is ported.
const droppedKeys = keys(upstream.en).filter(key => !(key in umaDictionaries.en))
for (const name of dictNames) {
  for (const key of droppedKeys) {
    umaDictionaries[name][key] = String(upstream[name][key] ?? upstream.en[key])
      .replaceAll('DeepSeek Harness', 'HeyWork')
  }
}

// Deep-complete every language against the HEY en dictionary (DesktopMessages
// requires the exact en key shape; nested objects like trayRoles included).
const deepComplete = (target, source) => {
  for (const [key, value] of Object.entries(source)) {
    if (!(key in target) || target[key] === undefined) target[key] = value
    else if (typeof value === 'object' && value !== null && typeof target[key] === 'object' && target[key] !== null) {
      deepComplete(target[key], value)
    }
  }
}
for (const name of dictNames.filter(candidate => candidate !== 'en')) deepComplete(umaDictionaries[name], umaDictionaries.en)

const header = `/** Typed shell copy for every shipped language owned by the Electron shell. */

// Values widen to \`string\`; nested records (trayRoles) widen per-key to \`string\` so
// translations satisfy the shape without inheriting the en literal types.
export type DesktopMessages = {
  readonly [Key in keyof typeof en]: (typeof en)[Key] extends string
    ? string
    : { readonly [Nested in keyof (typeof en)[Key]]: string }
}

`
const blocks = dictNames.map((name, index) => {
  const body = serializeDictionary(umaDictionaries[name], '\t')
  const tail = index === 0 ? ' as const\n' : index === 1
    ? ' as const satisfies DesktopMessages\n'
    : ' satisfies DesktopMessages\n'
  return `export const ${name} = {\n${body}\n}${tail}`
})
const tail = originalUpstream.slice(originalUpstream.indexOf('const dictionaries = {'))
const output = `${header}${blocks.join('\n')}\n${tail}`
writeFileSync(outPath, output)
console.log(`wrote ${outPath} (${output.length} bytes)`)
