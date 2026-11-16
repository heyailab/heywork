/**
 * Assemble a Windows .ico file from PNG sources (PNG-compressed entries, Vista+ format).
 * No dependencies: reads PNG files, writes ICONDIR + ICONDIRENTRY array + raw PNG blobs.
 *
 * Usage: node build-ico.mjs <output.ico> <size:png> [<size:png> ...]
 */
import { readFileSync, writeFileSync } from 'node:fs'

const [, , output, ...specs] = process.argv
if (output === undefined || specs.length === 0) {
  console.error('usage: node build-ico.mjs <output.ico> <size:png> [...]')
  process.exit(1)
}

const entries = specs.map(spec => {
  const colon = spec.lastIndexOf(':')
  const size = Number(spec.slice(0, colon))
  const file = spec.slice(colon + 1)
  const body = readFileSync(file)
  if (body.readUInt32BE(0) !== 0x89504e47) throw new Error(`${file}: not a PNG`)
  return { size, body }
})

const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(entries.length, 4)

const directory = Buffer.alloc(16 * entries.length)
let offset = header.length + directory.length
entries.forEach((entry, index) => {
  const base = index * 16
  directory.writeUInt8(entry.size >= 256 ? 0 : entry.size, base + 0) // width (0 = 256)
  directory.writeUInt8(entry.size >= 256 ? 0 : entry.size, base + 1) // height
  directory.writeUInt8(0, base + 2) // palette
  directory.writeUInt8(0, base + 3) // reserved
  directory.writeUInt16LE(1, base + 4) // planes
  directory.writeUInt16LE(32, base + 6) // bit depth
  directory.writeUInt32LE(entry.body.length, base + 8)
  directory.writeUInt32LE(offset, base + 12)
  offset += entry.body.length
})

writeFileSync(output, Buffer.concat([header, directory, ...entries.map(entry => entry.body)]))
console.log(`wrote ${output}: ${entries.map(entry => entry.size).join(', ')} (${offset} bytes)`)
