/**
 * 登入與授權測試（node --test，不接真 DB）
 * 合規防呆設計／風險提醒：密碼只存在於測試行程內，不進 repo、不進 .env、不進程式碼常數。
 * SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED。
 */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../dist/index.js';
import { MemoryProductStore, MemoryIdempotencyCache } from '../dist/routes/products.js';

const SECRET = 'test-only-secret-not-a-real-credential';
const PASSWORD = `test-${Math.random().toString(36).slice(2)}`;

const auth = {
  secret: SECRET,
  allowHeaderAuth: false,
  users: {
    admin: {
      password: PASSWORD,
      actor: { id: 'admin', role: 'security_admin', legalEntityId: 'LE-01' },
      legalEntityScope: ['LE-01', 'LE-02', 'LE-03']
    },
    owner: {
      password: PASSWORD,
      actor: { id: 'owner', role: 'platform_owner', legalEntityId: 'LE-01' },
      legalEntityScope: ['LE-01', 'LE-02', 'LE-03']
    }
  }
};

const makeProduct = sku => ({
  legalEntityId: sku.endsWith('2') ? 'LE-02' : 'LE-01',
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
let adminToken;
let ownerToken;

before(async () => {
  app = await buildApp({
    store: new MemoryProductStore(),
    auditEvents: [],
    idempotency: new MemoryIdempotencyCache(),
    auth
  });
  const adminRes = await app.inject({
    method: 'POST', url: '/auth/login', payload: { username: 'admin', password: PASSWORD }
  });
  adminToken = adminRes.json().token;
  const ownerRes = await app.inject({
    method: 'POST', url: '/auth/login', payload: { username: 'owner', password: PASSWORD }
  });
  ownerToken = ownerRes.json().token;
});

test('登入：正確帳密回簽章 token 與角色', async () => {
  const res = await app.inject({
    method: 'POST', url: '/auth/login', payload: { username: 'admin', password: PASSWORD }
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.actor.role, 'security_admin');
  assert.equal(body.legalEntityScope.length, 3);
  assert.match(body.token, /^[\w-]+\.[\w-]+$/);
});

test('登入：錯密碼與不存在的帳號回同一 401，不洩漏帳號是否存在', async () => {
  const wrong = await app.inject({
    method: 'POST', url: '/auth/login', payload: { username: 'admin', password: 'wrong' }
  });
  const missing = await app.inject({
    method: 'POST', url: '/auth/login', payload: { username: 'nobody', password: PASSWORD }
  });
  assert.equal(wrong.statusCode, 401);
  assert.equal(missing.statusCode, 401);
  assert.deepEqual(wrong.json().error, missing.json().error);
});

test('未登入時不能讀商品；偽造 token 也拒絕', async () => {
  const noToken = await app.inject({ method: 'GET', url: '/products' });
  const forged = await app.inject({
    method: 'GET', url: '/products', headers: { authorization: 'Bearer forged.token' }
  });
  assert.equal(noToken.statusCode, 401);
  assert.equal(forged.statusCode, 401);
});

test('正式模式不接受自報角色的 header', async () => {
  const res = await app.inject({
    method: 'GET', url: '/products',
    headers: { 'x-actor-id': 'fake', 'x-actor-role': 'platform_owner', 'x-legal-entity-id': 'LE-01' }
  });
  assert.equal(res.statusCode, 401);
});

test('admin token 可建立跨法人商品（security_admin 最高行政權）', async () => {
  const res = await app.inject({
    method: 'POST', url: '/products',
    headers: { authorization: `Bearer ${adminToken}` },
    payload: makeProduct('SKU-AUTH-2')
  });
  assert.equal(res.statusCode, 201);
  assert.equal(res.json().data.legalEntityId, 'LE-02');
});

test('老闆 token 唯讀：寫入回 403 READ_ONLY_OWNER（D-008 三層強制）', async () => {
  const res = await app.inject({
    method: 'POST', url: '/products',
    headers: { authorization: `Bearer ${ownerToken}` },
    payload: makeProduct('SKU-AUTH-OWNER')
  });
  assert.equal(res.statusCode, 403);
  assert.equal(res.json().error.code, 'READ_ONLY_OWNER');
});

test('老闆 token 仍可跨法人唯讀', async () => {
  const res = await app.inject({
    method: 'GET', url: '/products?legalEntityId=LE-02',
    headers: { authorization: `Bearer ${ownerToken}` }
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().ok, true);
});
