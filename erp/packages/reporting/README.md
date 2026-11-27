# @anubis/reporting｜報表與 BI 口徑

## 合規防呆設計／風險提醒

- **口徑分離**：`management`（`MGMT-2026.11-r1`）與 `statutory`（`STAT-2026.11-r1`）版本不同，管理性調整只出現在管理口徑，且絕不計入銷貨淨額。
- **收款不等於營收**：`netSalesCents` 只由 `sale` 單據認列；`billedCents`（請款）與 `collectedCents`（實收）是獨立 KPI，`salesSource` 固定為 `SALE_DOCUMENTS_ONLY`。
- **整數分**：所有金額以整數分處理，非整數或超出安全整數直接丟錯，不用浮點。
- **下鑽**：`buildNetSalesDrilldown()` 提供 total → 法人 → 客戶三層，葉節點合計等於根節點。
- **XLSX 安全**：一筆一列、表頭一列；數字維持數字型別；文字前綴 `' = + - @` 加前導單引號 escape；換行／Tab 轉空格。
- **短效連結＋稽核**：`exportXlsxDraft()` 只回草稿描述，連結網域為 `.invalid`（不可實際下載），預設 TTL 300 秒、上限 900 秒，並產生 `AuditEventSchema` 稽核事件。
- 全部資料為 `SYNTHETIC_DEMO`，`PROTOTYPE_NOT_APPROVED`；不產生實體檔案、不上傳。

## 測試

```bash
pnpm --filter @anubis/reporting test
```
