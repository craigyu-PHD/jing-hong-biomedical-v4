# @anubis/db migrations

合規防呆設計／風險提醒：本目錄所有 schema 皆為 `SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED`，不是已上線系統；不得承載真實客戶個資或真實交易。

## 執行 migration

```bash
# 由 monorepo 根目錄
DATABASE_URL='postgresql://user:pass@host:5432/anubis_demo' pnpm db:migrate

# 或只對本 package
DATABASE_URL='...' pnpm --filter @anubis/db migrate
```

- 未設定 `DATABASE_URL` 時：`migrate` 直接以 `NOT_CONFIGURED` 結束（不做猜測連線、不拋堆疊給前端）。
- `001_init.sql` 在單一 transaction 內執行；失敗自動 `ROLLBACK`。
- 使用 `CREATE TABLE IF NOT EXISTS`／`DROP POLICY IF EXISTS`，可重複執行；不提供自動降版或刪表。

## RLS 啟動方式（必做）

合規防呆設計／風險提醒：連線不帶上下文時，RLS 會讓查詢看不到任何法人資料——這是刻意設計，不是 bug。

每一筆交易在取得 client 後、查詢前設定：

```ts
import { createPool, setLegalEntityContext, clearLegalEntityContext } from '@anubis/db';

const handle = createPool();
if (handle.status !== 'READY' || !handle.pool) throw new Error('NOT_CONFIGURED');
const client = await handle.pool.connect();
try {
  await client.query('BEGIN');
  await setLegalEntityContext(client, 'LE-01');
  await client.query("SELECT set_config('app.role', 'sales', true)", []);
  // ... 查詢 / 寫入
  await client.query('COMMIT');
} finally {
  await clearLegalEntityContext(client);
  client.release();
}
```

- `set_config(..., true)` 的第三個參數 `true` = 只在當前 transaction 有效；連線歸還前務必 `clearLegalEntityContext`。
- `app.legal_entity_id` 只接受 `LE-01 / LE-02 / LE-03`；由後端從已驗證的 actor 推導，不可直接信任前端 header 做為最終授權依據。
- `app.role` 必須是 `anubis_role` enum 白名單；`platform_owner` 在 API 層被強制唯讀。

## 金額與財務計算

- 所有金額欄位皆 `NUMERIC(18,0)` 整數分；禁止 `float` / `double precision`。
- 對外顯示或報表換算用 `::numeric / 100`（decimal），例如 `v_product_price_decimal`、`v_receivable_decimal`。
- `order_lines.amount_cents` 有 CHECK 約束等於 `qty * unit_price_cents`，避免四捨五入漂移。

## 不可竄改與人工確認

- `audit_events`：只 `GRANT INSERT / SELECT`；`UPDATE / DELETE` 沒有 grant，另有 BEFORE trigger 直接 raise exception。就算 table owner 也無法修改。
- `entity_aliases`：`confirmed_by` 為 NULL 時不得用於合併或申報；只有 `access_admin` / `security_admin` 可確認，且有 trigger 保險。
- `adjustment_previews`：只存差異預覽，`required_approvers >= 2`；核准後由獨立流程寫入，API 不提供直接改帳路徑。

## 合成資料宣告

合規防呆設計／風險提醒：每一張表都有 `source` 欄位，預設 `SYNTHETIC_DEMO`。任何寫入都必須保持這個值；RLS 的 write policy 會檢查 `source = 'SYNTHETIC_DEMO'`。若要導入真實資料，須先通過合規審查與獨立的 migration，不得直接改這個值。
