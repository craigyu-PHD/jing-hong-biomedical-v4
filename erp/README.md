# ANUBIS ERP 管理後台原型

合規防呆設計／風險提醒：全數 `SYNTHETIC_DEMO`、`PROTOTYPE_NOT_APPROVED`，非正式上線，不承載真實個資與交易。

本目錄是精鴻動物生醫 ANUBIS ERP 的前後端原型原始碼，放在官網 repo 的 `erp/` 子資料夾；既有 v17 官網檔案未被覆蓋。GitHub Pages 只能托管靜態檔，無法執行 Fastify 後端，因此登入驗收在本機進行。

## 本機啟動

```bash
cd erp
pnpm install
cp apps/erp-api/.env.example apps/erp-api/.env   # 再自行填入本機密碼
./start-local.command                             # macOS 可直接雙擊
```

- 前端：<http://127.0.0.1:5173/>
- 後端：<http://127.0.0.1:3001/health>
- 測試帳號：`admin`，密碼由本機 `apps/erp-api/.env` 的 `ANUBIS_ADMIN_PASSWORD` 提供；**密碼不進 repo**。
- 另有唯讀老闆帳號（`ANUBIS_OWNER_USER` / `ANUBIS_OWNER_PASSWORD`）可驗證 D-008 全域唯讀。

## 測試

```bash
pnpm -r --if-present build
pnpm -r --if-present test
```

##  structure

- `apps/erp-api`：Fastify API、HMAC Bearer 登入、商品 CRUD、稽核、冪等、法人隔離
- `apps/admin-web`：React＋Vite 管理後台，登入閘道、RWD、密度／字級／亮暗主題
- `packages/contracts`／`domain`／`auth`／`db`／`reporting`：共用契約、25 日切帳與整數分、RBAC/ABAC/RLS、PostgreSQL migration、BI 口徑
- `apps/ai-gateway`／`device-gateway`：未部署／未接設備時如實回 `NOT_DEPLOYED`／`NOT_CONNECTED`

## 上線前缺件

改制生效文件、三法人契約、真實商品總表／e-Go 授權、法規審查人、正式 PostgreSQL RLS 與不可竄改稽核表部署。
