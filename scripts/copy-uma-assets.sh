#!/usr/bin/env bash
# 从逆向分析产物 (uma-analysis) 搬运 UMA 专属资产到移植工作区
# 用法: bash scripts/copy-uma-assets.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/../uma-analysis"
STAGE="$ROOT/uma-assets"
mkdir -p "$STAGE"

echo "[1/5] 搬运 12 个 uma 插件包源码..."
cp -R "$SRC/uma-plugins/@deepseek-ai" "$STAGE/packages"

echo "[2/5] 搬运加密技能库 (跨平台直接复用)..."
UMADB="$SRC/UMA Studio.app/Contents/Resources/app.asar.unpacked/dsh/node_modules/@deepseek-ai/dsh-skill-uma/resources.umadb"
mkdir -p "$STAGE/dsh-skill-uma"
cp "$UMADB" "$STAGE/dsh-skill-uma/"
# 已解密可读版 (参考用): $SRC/skill-uma-assets/

echo "[3/5] 搬运产品配置..."
cp "$SRC/UMA Studio.app/Contents/Resources/uma-platform.patch.yml" "$STAGE/"
# TODO(必改): uma-platform.patch.yml 中 deepseek-account.desktopPlatform: darwin -> win32
grep -n '"desktopPlatform"' "$STAGE/uma-platform.patch.yml" || true

echo "[4/5] 搬运壳层代码 (与上游 apps/desktop 比对用)..."
mkdir -p "$STAGE/shell"
cp -R "$SRC/shell/lib" "$STAGE/shell/" 2>/dev/null || true
cp -R "$SRC/shell/renderer" "$STAGE/shell/" 2>/dev/null || true
# TODO: icon.icns 需转换为 icon.ico (Windows 安装包用)
cp "$SRC/UMA Studio.app/Contents/Resources/icon.icns" "$STAGE/" 2>/dev/null || true

echo "[5/5] 搬运更新配置..."
cp "$SRC/UMA Studio.app/Contents/Resources/app-update.yml" "$STAGE/"
# TODO(必改): url: https://studio.umayun.com/uma-studio/feeds/mac-arm64/ -> feeds/win-x64/

echo ""
echo "✅ 搬运完成 -> $STAGE"
echo "待办清单:"
echo "  1. uma-platform.patch.yml: desktopPlatform darwin->win32"
echo "  2. app-update.yml: feed 路径 mac-arm64 -> win-x64"
echo "  3. icon.icns -> icon.ico 转换"
echo "  4. shell/lib/main.js 与 deepseek-harness/apps/desktop/src 逐段比对，搬运 UMA 定制"
