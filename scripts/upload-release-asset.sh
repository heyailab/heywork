#!/usr/bin/env bash
# 把 beta5 安装包上传为 GitHub Release 资产，得到 Windows 可直连的固定下载地址。
# token 从 ~/.github-token 或环境变量 GITHUB_TOKEN 读取，绝不写入仓库或日志。
set -euo pipefail

OWNER="heyailab"
REPO="uma-window"
TAG="uma-beta5-archive"
RELEASE_NAME="UMA Studio beta5 (mac-arm64) — reference archive"
ZIP="$HOME/Library/Caches/uma-studio-updater/pending/uma-studio-1.0.0-beta5.20261118.3-mac-arm64.zip"
ASSET_NAME="uma-studio-1.0.0-beta5.20261118.3-mac-arm64.zip"

# --- token ---
if [ -f "$HOME/.github-token" ]; then
  TOKEN=$(tr -d '\r\n' < "$HOME/.github-token")
elif [ -n "${GITHUB_TOKEN:-}" ]; then
  TOKEN="$GITHUB_TOKEN"
else
  echo "ERROR: 未找到 token。请把 PAT 写入 ~/.github-token 或设置 GITHUB_TOKEN。" >&2
  exit 1
fi
[ -n "$TOKEN" ] || { echo "ERROR: token 为空" >&2; exit 1; }

[ -f "$ZIP" ] || { echo "ERROR: 安装包不存在: $ZIP" >&2; exit 1; }
echo "安装包: $(du -h "$ZIP" | cut -f1)"

API="https://api.github.com/repos/$OWNER/$REPO"

# --- 确认 token 有效 ---
echo "校验 token..."
AUTH_JSON=$(curl -sSL --max-time 20 -H "Authorization: Bearer $TOKEN" "$API" 2>/dev/null)
if echo "$AUTH_JSON" | grep -q '"full_name"'; then
  echo "  token 有效: $(echo "$AUTH_JSON" | python3 -c 'import json,sys;print(json.load(sys.stdin)["full_name"])')"
else
  echo "  token 无效: $(echo "$AUTH_JSON" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("message","?"))' 2>/dev/null)"
  exit 1
fi

# --- 复用或创建 release ---
echo "准备 release ($TAG)..."
REL=$(curl -sSL --max-time 20 -H "Authorization: Bearer $TOKEN" "$API/releases/tags/$TAG" 2>/dev/null)
REL_ID=$(echo "$REL" | python3 -c 'import json,sys
d=json.load(sys.stdin)
print(d.get("id",""))' 2>/dev/null || true)

if [ -z "$REL_ID" ]; then
  echo "  创建新 release..."
  REL=$(curl -sSL --max-time 30 -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "$API/releases" \
    -d "{\"tag_name\":\"$TAG\",\"name\":\"$RELEASE_NAME\",\"body\":\"UMA Studio 1.0.0-beta5.20261118.3 mac-arm64 reference archive. Captured from the in-app updater. For Windows-side analysis only — this is a macOS build.\",\"draft\":false,\"prerelease\":true}" 2>/dev/null)
  REL_ID=$(echo "$REL" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("id",""))' 2>/dev/null || true)
fi
[ -n "$REL_ID" ] || { echo "ERROR: 无法创建 release: $(echo "$REL" | head -c 200)" >&2; exit 1; }
echo "  release id: $REL_ID"

# --- 上传资产（若同名已存在则跳过）---
EXISTING=$(curl -sSL --max-time 20 -H "Authorization: Bearer $TOKEN" "$API/releases/$REL_ID/assets" 2>/dev/null \
  | python3 -c 'import json,sys
try:
  print(any(a["name"]=="'"$ASSET_NAME"'" for a in json.load(sys.stdin)))
except: print(False)')
if [ "$EXISTING" = "True" ]; then
  echo "  资产已存在，跳过上传"
else
  echo "  上传资产（420MB，可能需要几分钟）..."
  curl -sSL --max-time 900 -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/zip" \
    --data-binary @"$ZIP" \
    "https://uploads.github.com/repos/$OWNER/$REPO/releases/$REL_ID/assets?name=$ASSET_NAME" 2>/dev/null \
    | python3 -c 'import json,sys
d=json.load(sys.stdin)
if "browser_download_url" in d: print("  上传完成:",d["browser_download_url"])
else: print("  上传失败:",d.get("message",str(d)[:200]))'
fi

echo ""
echo "=== Windows 固定下载地址 ==="
echo "https://github.com/$OWNER/$REPO/releases/latest/download/$ASSET_NAME"
