/**
 * ERP API 測試（node --test，不接真 DB）
 * 合規防呆設計／風險提醒：全部使用 in-memory store；測試資料皆為 SYNTHETIC_DEMO，
 * 不得把測試憑證、真實法人資料或真實交易寫入 repo。
 */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../dist/index.js';
import { MemoryProductStore, MemoryIdempotencyCache } from '../dist/routes/products.js';

const salesHeaders = {
  'x-actor-id': 'u-sales-1',
  'x-actor-role': 'sales',
  'x-legal-entity-id': 'LE-01'
};
const bossHeaders = {
  'x-actor-id': 'boss-1',
  'x-actor-role': 'platform_owner',
  'x-legal-entity-id': 'LE-01'
};

const makeProduct = sku => ({
  legalEntityId: 'LE-01',
  sku,
  name: `合成商品 ${sku}`,
  line: 'human',
  form: 'capsule',
  priceCents: 19900,
  stock: 10,
  batch: 'B-DEMO',
  expiry: '2027-12-31',
  status: 'active'
});

let app;
let store;
let auditEvents;

before(async () => {
  store = new MemoryProductStore();
  auditEvents = [];
  app = await buildApp({ store, auditEvents, idempotency: new MemoryIdempotencyCache() });
});

test('健康檢查：不需要授權，回 UP 與合成資料宣告', async () => {
  const res = await app.inject({ method: 'GET', url: '/health' });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.status, 'UP');
  assert.match(body.notice, /SYNTHETIC_DEMO/);
});

test('商品列表：分頁與 legalEntityId 過濾', async () => {
  await app.inject({
    method: 'POST', url: '/products', headers: salesHeaders,
    payload: makeProduct('SKU-LIST-1')
  });
  const res = await app.inject({
    method: 'GET', url: '/products?page=1&pageSize=1&legalEntityId=LE-01', headers: salesHeaders
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.data.length, 1);
  assert.equal(body.page, 1);
  assert.ok(body.total >= 1);
  assert.ok(body.data.every(p => p.legalEntityId === 'LE-01'));
});

test('新增商品：201 且 source 固定 SYNTHETIC_DEMO', async () => {
  const res = await app.inject({
    method: 'POST', url: '/products', headers: salesHeaders,
    payload: makeProduct('SKU-CREATE-1')
  });
  assert.equal(res.statusCode, 201);
  assert.equal(res.json().data.source, 'SYNTHETIC_DEMO');
});

test('重複 SKU：同法人下回 409 DUPLICATE_SKU', async () => {
  const payload = makeProduct('SKU-DUP-1');
  const first = await app.inject({ method: 'POST', url: '/products', headers: salesHeaders, payload });
  assert.equal(first.statusCode, 201);
  const second = await app.inject({ method: 'POST', url: '/products', headers: salesHeaders, payload });
  assert.equal(second.statusCode, 409);
  assert.equal(second.json().error.code, 'DUPLICATE_SKU');
});

test('老闆寫入：403 READ_ONLY_OWNER', async () => {
  const res = await app.inject({
    method: 'POST', url: '/products', headers: bossHeaders,
    payload: makeProduct('SKU-BOSS-1')
  });
  assert.equal(res.statusCode, 403);
  assert.equal(res.json().error.code, 'READ_ONLY_OWNER');
});

test('Idempotency-Key：相同 key 回完全相同的結果', async () => {
  const headers = { ...salesHeaders, 'idempotency-key': 'idem-fixed-001' };
  const payload = makeProduct('SKU-IDEM-1');
  const first = await app.inject({ method: 'POST', url: '/products', headers, payload });
  const second = await app.inject({ method: 'POST', url: '/products', headers, payload });
  assert.equal(first.statusCode, 201);
  assert.equal(second.statusCode, 201);
  assert.deepEqual(second.json(), first.json());
  assert.equal(second.json().data.id, first.json().data.id);
});

test('寫入進稽核事件：audit_events 只增值不可改', async () => {
  const before = auditEvents.length;
  await app.inject({
    method: 'POST', url: '/products', headers: salesHeaders,
    payload: makeProduct('SKU-AUDIT-1')
  });
  assert.equal(auditEvents.length, before + 1);
  assert.equal(auditEvents.at(-1).action, 'product.create');
});

test('法人隔離：LE-02 讀不到 LE-01 的商品', async () => {
  const res = await app.inject({
    method: 'GET', url: '/products', headers: {
      'x-actor-id': 'u-sales-2', 'x-actor-role': 'sales', 'x-legal-entity-id': 'LE-02'
    }
  });
  assert.equal(res.statusCode, 200);
  assert.ok(res.json().data.every(p => p.legalEntityId !== 'LE-01'));
});
