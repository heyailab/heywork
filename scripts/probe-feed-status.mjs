#!/usr/bin/env node
/**
 * Feed 状态探针 —— 观察 beta5 分发的 held 状态是否变化。
 *
 * 用途：notes/update-feed-evidence.md §7 的"待观察假设"验证工具。
 * 定期运行，对比 x-uma-download-state 与官网 dmg 的 last-modified：
 *   - 若 held 一直是 held 且官网 dmg 停在 beta4 → 倾向 beta5 被撤回
 *   - 若状态恢复为 active/live，或官网更新到 beta5 → 说明是临时窗口
 *
 * 用法：node scripts/probe-feed-status.mjs
 * 无需 token，纯公开 HTTP 请求。
 */
import { request } from 'node:https'

const FEED = 'https://studio.umayun.com/uma-studio/feeds/mac-arm64/latest-mac.yml'
const ZIP = 'https://studio.umayun.com/uma-studio/feeds/mac-arm64/uma-studio-1.0.0-beta5.20261118.3-mac-arm64.zip'
const DMG = 'https://studio.umayun.com/desktop/uma-studio-latest-macos-arm64.dmg'

function head(url) {
  return new Promise((resolve) => {
    const req = request(url, { method: 'HEAD', timeout: 15000 }, (res) => {
      res.resume()
      resolve({
        code: res.statusCode,
        state: res.headers['x-uma-download-state'] ?? '-',
        lastModified: res.headers['last-modified'] ?? '-',
        length: res.headers['content-length'] ?? '-',
      })
    })
    req.on('error', (e) => resolve({ code: 'ERR', state: e.code ?? '-', lastModified: '-', length: '-' }))
    req.on('timeout', () => { req.destroy(); resolve({ code: 'TIMEOUT', state: '-', lastModified: '-', length: '-' }) })
    req.end()
  })
}

const [feed, zip, dmg] = await Promise.all([head(FEED), head(ZIP), head(DMG)])

console.log('probe time:', new Date().toISOString())
console.log('feed manifest:', `HTTP ${feed.code}`, `state=${feed.state}`)
console.log('beta5 zip    :', `HTTP ${zip.code}`, `state=${zip.state}`)
console.log('latest dmg   :', `HTTP ${dmg.code}`, `last-modified=${dmg.lastModified}`, `size=${dmg.length}`)

const verdict = feed.state === 'held'
  ? 'held 仍在持续 → 假设未变，继续观察（见 notes/update-feed-evidence.md §7.4）'
  : `state 已变为 ${feed.state} → 状态发生变化，需重新评估 §7.4 假设`
console.log('判定:', verdict)
