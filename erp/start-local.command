#!/bin/bash
# ANUBIS ERP 本機一鍵啟動｜合規防呆設計／風險提醒：SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED
# 雙擊本檔即可同時啟動後端（3001）與前端（5173）；帳號密碼讀 apps/erp-api/.env，不進 repo。
cd "$(dirname "$0")" || exit 1

if ! command -v pnpm >/dev/null 2>&1; then
  echo "需要先安裝 pnpm：corepack enable && corepack prepare pnpm@12.14.0 --activate"
  read -r -p "按 Enter 結束…"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "首次執行：安裝相依套件…"
  pnpm install
fi

echo "合規防呆設計／風險提醒：全部為合成資料，非正式上線。"
echo "啟動後端 http://127.0.0.1:3001 與前端 http://127.0.0.1:5173"
echo "關閉本視窗即停止服務。"

pnpm --filter @anubis/erp-api dev &
API_PID=$!
pnpm --filter @anubis/admin-web exec vite --host 127.0.0.1 --port 5173 &
WEB_PID=$!

trap 'kill $API_PID $WEB_PID 2>/dev/null; exit 0' INT TERM
wait
