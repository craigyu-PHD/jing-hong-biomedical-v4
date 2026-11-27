/**
 * 報表測試（node --test）
 * 合規防呆設計／風險提醒：只用 SYNTHETIC_INPUT；驗證口徑分隔、收款不等於營收、
 * 公式注入 escape 與數字一致；不產生實體檔案、不上傳任何資料。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BASIS_VERSIONS,
  RECEIVABLE_COLUMNS,
  SYNTHETIC_INPUT,
  basisVersion,
  buildNetSalesDrilldown,
  computeKpis,
  ensureIntegerCents,
  exportXlsxDraft,
  receivableExportRows,
  safeCell,
  toSafeRows
} from '../src/index.ts';

test('口徑分離：Management 與 Statutory 各有版本與調整規則', () => {
  const management = computeKpis('management');
  const statutory = computeKpis('statutory');

  assert.equal(management.basis, 'management');
  assert.equal(statutory.basis, 'statutory');
  assert.notEqual(management.version, statutory.version);
  assert.equal(management.version, basisVersion('management'));
  assert.equal(statutory.version, BASIS_VERSIONS.statutory.version);
  assert.equal(management.managementAdjustmentCents, 120_000);
  assert.equal(statutory.managementAdjustmentCents, 0);
  // 管理性調整不論哪個口徑都不改動銷貨淨額。
  assert.equal(management.netSalesCents, statutory.netSalesCents);
});

test('收款不等於營收：只有收款也不得認列銷貨淨額', () => {
  const onlyCollected = { ...SYNTHETIC_INPUT, sales: [] };
  const kpis = computeKpis('statutory', onlyCollected);

  assert.equal(kpis.netSalesCents, 0);
  assert.equal(kpis.collectedCents, 2_100_000);
  assert.notEqual(kpis.netSalesCents, kpis.collectedCents);
  assert.equal(kpis.salesSource, 'SALE_DOCUMENTS_ONLY');

  const normal = computeKpis('statutory');
  assert.equal(normal.netSalesCents, 3_000_000);
  assert.notEqual(normal.netSalesCents, normal.collectedCents);
});

test('XLSX 公式注入：前綴 \' = + - @ 一律 escape，數字維持數字', () => {
  for (const value of ["'quoted", '=SUM(1+1)', '+cmd', '-cmd', '@evil', '=HYPERLINK("x")']) {
    assert.equal(safeCell(value).kind, 'text', value);
    assert.equal(safeCell(value).value.startsWith("'"), true, value);
  }
  assert.deepEqual(safeCell(2_000_000), { kind: 'number', value: 2_000_000 });
  assert.equal(safeCell('一般文字').value, '一般文字');
  assert.equal(safeCell('換行\n-tab\t').value.includes('\n'), false);

  const rows = toSafeRows(RECEIVABLE_COLUMNS, receivableExportRows());
  const nameIndex = RECEIVABLE_COLUMNS.indexOf('customerName');
  const injected = rows.find(row => row[0].kind === 'text' && row[0].value === 'AR-004');
  assert.ok(injected, '應找到合成惡意客戶名的那一列');
  assert.equal(injected[nameIndex].kind, 'text');
  assert.equal(injected[nameIndex].value.startsWith("'="), true);
});

test('數字一致：一筆一列、下鑽合計等於 KPI、短效連結與稽核俱在', () => {
  const kpis = computeKpis('management');
  const records = receivableExportRows();
  assert.equal(records.length, 4); // 一筆應收一列

  const rowSum = records.reduce((sum, row) => sum + row.receivableCents, 0);
  assert.equal(rowSum, kpis.receivableCents);
  assert.equal(rowSum, 1_000_000);
  assert.equal(Object.values(kpis.aging).reduce((a, b) => a + b, 0), kpis.receivableCents);
  assert.equal(kpis.contractRemainingCents, 2_400_000);
  assert.equal(kpis.inventoryValueCents, 2_940_000);
  assert.equal(kpis.inventoryQuantity, 165);

  const leaves = [];
  const walk = node => {
    if (node.children.length === 0) leaves.push(node);
    for (const child of node.children) walk(child);
  };
  const tree = buildNetSalesDrilldown(kpis);
  walk(tree);
  assert.equal(leaves.reduce((sum, leaf) => sum + leaf.valueCents, 0), tree.valueCents);
  assert.equal(tree.valueCents, kpis.netSalesCents);

  const draft = exportXlsxDraft({
    columns: RECEIVABLE_COLUMNS,
    records,
    actorId: 'test-actor',
    actorRole: 'accounting',
    legalEntityId: 'LE-01',
    requestId: 'req-report-001',
    ttlSeconds: 300,
    now: new Date('2026-11-27T00:00:00.000Z')
  });
  assert.equal(draft.rows.length, records.length + 1); // 表頭＋每筆一列
  assert.equal(draft.link.ttlSeconds, 300);
  assert.equal(draft.link.expiresAt, '2026-11-27T00:05:00.000Z');
  assert.match(draft.link.url, /\.invalid/);
  assert.equal(draft.audit.action, 'REPORT_XLSX_DRAFT_EXPORT');
  assert.equal(draft.audit.targetId, 'req-report-001');
  assert.equal(draft.audit.actorId, 'test-actor');
});

test('非整數分直接丟錯，不產生浮點金額', () => {
  assert.equal(ensureIntegerCents(12_345, 'test'), 12_345);
  assert.throws(() => ensureIntegerCents(1.5, 'bad'), /NON_INTEGER_CENTS/);
  assert.throws(() => safeCell(0.1), /XLSX_NUMBER_NOT_INTEGER/);
});
