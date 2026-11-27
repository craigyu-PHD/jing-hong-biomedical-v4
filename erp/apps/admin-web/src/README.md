# @anubis/admin-web（React + Vite 管理後台）

合規防呆設計／風險提醒：**全數合成資料 SYNTHETIC_DEMO，PROTOTYPE_NOT_APPROVED，非正式上線。** 無真實客戶、商品、訂單或財務數字；未部署、未驗收。

## 如何跑

在 monorepo 根目錄（`05_SOURCE_CODE/`）：

```bash
pnpm install
pnpm --filter @anubis/admin-web dev      # http://localhost:5173
pnpm --filter @anubis/admin-web build    # tsc --noEmit + vite build
pnpm --filter @anubis/admin-web typecheck
```

舊原型保留在 `legacy/`（原始 `index.html`／`app.js`／`styles.css`），正式進入點是新的 `index.html` → `src/main.tsx`。

## 角色測試（老闆唯讀）

1. 頂部「身份」選「管理員（可增刪改）」：可新增／編輯／刪除合成商品，操作會寫入本機稽核面板。
2. 切到「老闆（全域唯讀）」：新增／編輯／Delete 按鈕停用，表單改為唯讀說明；即使直接呼叫 Store 的 `addProduct`／`updateProduct`／`removeProduct`，也在 `src/store.ts` 以 `READ_ONLY_OWNER` 拋錯，不會發出寫入 API。
3. 切換「法人」會同時更新 `x-legal-entity-id` 請求頭，並重新讀取該法人的合成單據；不跨法人借資料。
4. 密度（舒適／標準／緊湊）、字級 90–200%、亮暗主題會寫入 `localStorage`，重載後保留。

## API 串接狀態

- `vite.config.ts` 把 `/api` proxy 到 `http://127.0.0.1:3001`；`src/api/client.ts` 提供 `GET/POST/PATCH/DELETE /products`，所有請求帶 `x-legal-entity-id`，回需在 trust boundary 用 `@anubis/contracts` 的 Zod schema 驗證。
- **後端尚未完成**：初始資料來自 `SEED_PRODUCTS`＋`localStorage`（key `anubis.admin-web.demo.v1`）。 startup 嘗試 `GET /api/products`；失敗時留在 in-memory／localStorage fallback，畫面不會白掉，頂部顯示「本機合成資料」。寫入失敗時保留本機變更並顯示錯誤，不清空畫面。
- 真實後端上線前不得移除 fallback 與合規宣告；正式稽核須改寫不可竄改稽核表。

## 檔案對應

- `src/store.ts`：角色／法人／商品 CRUD／稽核／偏好設定，含老闆寫入阻擋。
- `src/components/`：Sidebar、TopBar、RoleSwitch、ProductTable、ProductForm、AuditPanel。
- `src/pages/`：DashboardPage（每張 KPI 標 SYNTHETIC_DEMO）、ProductsPage、OrdersPage（銷貨／補貨／換貨三類）、ComingSoon（DEFERRED）。
- `src/styles.css`：v17 設計 token 的 ERP 緊湊版；8pt grid、RWD、`prefers-reduced-motion`、WCAG 焦點可見、狀態不只靠顏色、表格容器水平捲動。
