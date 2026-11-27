/**
 * 核心業務規則測試｜合規防呆設計／風險提醒：全數合成資料
 * 執行：node --test packages/domain/tests/domain.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { billingWindow, periodOfDate, inWindow } from '../dist/period.js';
import { addCents, splitEvenly, splitWithTail, allocateByWeight, settle, formatTwd } from '../dist/money.js';
import { remainingCents, drawAmount, drawItem, buildDocument, approveOrder } from '../dist/contracts.js';

const orderLine = (sku, qty, unit) => ({ productId: sku, sku, qty, unitPriceCents: unit, amountCents: qty * unit });
const contract = (over = {}) => ({
  id: 'C1', legalEntityId: 'LE-01', customerId: 'CU1', kind: 'amount_pool',
  totalCents: 100000, drawnCents: 0, itemQuota: { 'P1': 10 },
  validFrom: '2026-01-01', validTo: '2026-12-31', status: 'active',
  source: 'SYNTHETIC_DEMO', ...over
});

test('T-DOM-01 25日切帳區間 [前月26日, 當月26日)', () => {
  assert.deepEqual(billingWindow('2026-11'), { start: '2026-10-26', end: '2026-11-26' });
  assert.deepEqual(billingWindow('2026-01'), { start: '2025-12-26', end: '2026-01-26' });
  assert.equal(periodOfDate('2026-11-25'), '2026-11');
  assert.equal(periodOfDate('2026-11-26'), '2026-12');
  assert.equal(inWindow('2026-11-25', '2026-10-26', '2026-11-26'), true);
  assert.equal(inWindow('2026-11-26', '2026-10-26', '2026-11-26'), false);
});

test('T-DOM-02 整數分加總與分攤，尾差在最後一期', () => {
  assert.equal(addCents(100, 250, 50), 400);
  assert.deepEqual(splitEvenly(1000, 3), [334, 333, 333]);
  assert.deepEqual(splitWithTail(1000, 3), [333, 333, 334]);
  assert.deepEqual(allocateByWeight(1000, [1, 2, 1]), [250, 500, 250]);
  assert.equal(formatTwd(123456), 'NT$1,234.56');
});

test('T-DOM-03 收款沖銷：部分／超收／折讓', () => {
  assert.deepEqual(settle(100000, 40000), { outstandingCents: 60000, overpayCents: 0, status: 'partial' });
  assert.deepEqual(settle(100000, 120000), { outstandingCents: 0, overpayCents: 20000, status: 'overpaid' });
  assert.deepEqual(settle(100000, 90000, 10000), { outstandingCents: 0, overpayCents: 0, status: 'settled' });
});

test('T-DOM-04 合約提領不得超過剩餘', () => {
  const c = contract();
  assert.equal(remainingCents(c), 100000);
  assert.equal(drawAmount(c, 30000).drawnCents, 30000);
  assert.throws(() => drawAmount(c, 100001), /EXCEEDS_REMAINING/);
  assert.throws(() => drawItem(contract({ kind: 'amount_pool' }), 'P1', 1), /NOT_ITEM_POOL/);
  assert.equal(drawItem(contract({ kind: 'item_pool' }), 'P1', 3).itemQuota.P1, 7);
  assert.throws(() => drawItem(contract({ kind: 'item_pool' }), 'P1', 99), /EXCEEDS_ITEM_QUOTA/);
});

test('T-DOM-05 補貨紙面 0 元、換貨不計營收、自審禁止', () => {
  const lines = [orderLine('P1', 2, 5000)];
  const base = { id: 'O1', legalEntityId: 'LE-01', customerId: 'CU1', lines, createdBy: 'u1', createdAt: '2026-11-27T00:00:00.000Z' };
  const sale = buildDocument({ ...base, documentType: 'sale' });
  const replacement = buildDocument({ ...base, documentType: 'replacement' });
  const exchange = buildDocument({ ...base, documentType: 'exchange' });
  assert.equal(sale.totalCents, 10000);
  assert.equal(replacement.totalCents, 0);
  assert.equal(replacement.internalEquityCents, 10000);
  assert.equal(exchange.totalCents, 0);
  assert.throws(() => approveOrder({ ...sale, status: 'pending_approval' }, 'u1'), /SELF_APPROVAL_FORBIDDEN/);
  assert.equal(approveOrder({ ...sale, status: 'pending_approval' }, 'u2').status, 'approved');
});
