/**
 * Print the facts we quote about a Mac HEY build, straight out of `app.asar`.
 *
 * Every comparison in notes/parity-gap-review.md rests on four numbers that live in
 * the packaged app, not in our repo: the product version, the bundled kernel version,
 * the `dshBuildCommit` we pin against, and the mandatory-update policy the Mac build
 * actually ships. Re-running this after a HEY upgrade is how the port notices that a
 * baseline drifted (beta3 → beta4 changed the shell but not the plugin layer).
 *
 * Usage:
 *   node scripts/inspect-mac-manifest.mjs [--asar "/Applications/HeyWork.app/Contents/Resources/app.asar"]
 */
import { existsSync, openSync, readSync, closeSync } from 'node:fs'

const MAC_DEFAULT = '/Applications/HeyWork.app/Contents/Resources/app.asar'
const asar = process.argv[process.argv.indexOf('--asar') + 1] !== undefined && process.argv.includes('--asar')
  ? process.argv[process.argv.indexOf('--asar') + 1]
  : MAC_DEFAULT

if (!existsSync(asar)) {
  console.error(`inspect-mac-manifest: not found: ${asar}`)
  console.error('pass --asar "<...>/HeyWork.app/Contents/Resources/app.asar"')
  process.exit(2)
}

/** Asar layout: [u32=4][u32=pickle size][u32=header string size][header JSON][pad to 4][data]. */
const fd = openSync(asar, 'r')
const head = Buffer.alloc(16)
readSync(fd, head, 0, 16, 0)
const headerStringSize = head.readUInt32LE(12)
const header = Buffer.alloc(headerStringSize)
readSync(fd, header, 0, headerStringSize, 16)
const tree = JSON.parse(header.toString('utf8'))
const dataStart = Math.ceil((16 + headerStringSize) / 4) * 4

function read(node) {
  if (node.link !== undefined) throw new Error('asar link entries are not supported here')
  const buffer = Buffer.alloc(node.size ?? 0)
  if (buffer.length > 0) readSync(fd, buffer, 0, buffer.length, dataStart + Number(node.offset ?? 0))
  return buffer
}

const manifest = JSON.parse(read(tree.files['package.json']).toString('utf8'))
const runtime = tree.files.dsh?.files?.['desktop-runtime.json']
const scoped = tree.files.dsh?.files?.node_modules?.files?.['@deepseek-ai']?.files ?? {}
const umaPackages = Object.keys(scoped).filter(name => name.includes('hey')).sort()

console.log(`asar: ${asar}`)
console.log(`product:        ${manifest.name} ${manifest.version}${manifest.umaProductVersion === undefined ? '' : ` (umaProductVersion ${manifest.umaProductVersion})`}`)
console.log(`kernel:         ${manifest.dshBundledKernelVersion ?? '?'}${runtime === undefined ? '' : ` (runtime release ${JSON.parse(read(runtime).toString('utf8')).release?.version ?? '?'})`}`)
console.log(`build commit:   ${manifest.dshBuildCommit ?? '?'}${manifest.dshBuildDirty === true ? ' (dirty)' : ''}`)
console.log(`app id:         ${manifest.dshDesktopAppId ?? '?'}`)
console.log(`managedAccount: ${manifest.dshDesktopManagedAccount === true}`)
console.log(`channel:        ${manifest.dshDesktopUpdateChannel ?? '?'}`)
console.log(`policy:         ${JSON.stringify(manifest.dshMandatoryUpdatePolicy ?? null)}`)
console.log(`packages:       ${Object.keys(scoped).length} @deepseek-ai, ${umaPackages.length} HEY`)
console.log(`hey packages:   ${umaPackages.join(' ')}`)
closeSync(fd)
