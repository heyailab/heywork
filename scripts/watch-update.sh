#!/bin/bash
# 监测 UMA 应用内更新：记录缓存目录里出现的新文件（含完整版本化文件名）。
# 用法：
#   bash scripts/watch-update.sh start   # 记录基线并启动监测（前台，Ctrl-C 停止）
#   bash scripts/watch-update.sh diff    # 对比基线，输出新增文件
# 或直接：bash scripts/watch-update.sh watch 60   # 监测 60 秒

CACHE="$HOME/Library/Caches/uma-studio-updater"
SNAP="$HOME/.hey-update-baseline.txt"

case "${1:-watch}" in
  start)
    find "$CACHE" -type f -printf '%p %s %T@\n' 2>/dev/null | sort > "$SNAP" || \
      find "$CACHE" -type f -exec stat -f '%N %z %m' {} \; 2>/dev/null | sort > "$SNAP"
    echo "基线已记录：$SNAP ($(wc -l < "$SNAP" | tr -d ' ') 个文件)"
    echo "现在去应用里点更新，完成后运行：bash scripts/watch-update.sh diff"
    ;;
  diff)
    find "$CACHE" -type f -exec stat -f '%N %z %m' {} \; 2>/dev/null | sort > /tmp/hey-update-now.txt
    echo "=== 新增或修改的文件 ==="
    comm -13 "$SNAP" /tmp/hey-update-now.txt
    echo "=== pending 目录文件名（版本在此）==="
    ls -la "$CACHE/pending/" 2>/dev/null
    echo "=== update-info.json ==="
    cat "$CACHE/pending/update-info.json" 2>/dev/null; echo
    ;;
  watch)
    SECS="${2:-120}"
    find "$CACHE" -type f -exec stat -f '%N %z %m' {} \; 2>/dev/null | sort > "$SNAP"
    echo "监测 ${SECS}s，基线 $(wc -l < "$SNAP" | tr -d ' ') 个文件。现在去点更新..."
    end=$(( $(date +%s) + SECS ))
    while [ $(date +%s) -lt $end ]; do
      find "$CACHE" -type f -exec stat -f '%N %z %m' {} \; 2>/dev/null | sort > /tmp/hey-update-now.txt
      new=$(comm -13 "$SNAP" /tmp/hey-update-now.txt)
      if [ -n "$new" ]; then
        echo "[$(date +%H:%M:%S)] 变化："
        echo "$new"
        cp /tmp/hey-update-now.txt "$SNAP"
      fi
      sleep 3
    done
    echo "监测结束。最新 pending："
    ls -la "$CACHE/pending/" 2>/dev/null
    ;;
  *)
    echo "用法: $0 {start|diff|watch [秒数]}"
    ;;
esac
