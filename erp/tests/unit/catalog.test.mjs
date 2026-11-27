/**
 * 商品主檔原型 單元測試（Node 內建 test runner，無外部套件）
 * 涵蓋：新增／編輯／刪除／驗證／老闆唯讀阻擋／RWD 詞彙上的 source tag
 * 狀態：PROTOTYPE_NOT_APPROVED；測試的是原型邏輯，不是正式 ERP。
 * 執行：node --test 05_SOURCE_CODE/tests/unit/catalog.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
// 舊原型已由前端正式版移至 legacy/，測試仍針對該原型邏輯（PROTOTYPE_NOT_APPROVED）
const appPath = resolve(here, '../../apps/admin-web/legacy/app.js');
const { CatalogStore, validateProduct, SOURCE_TAG } = require(appPath);

function sample(i) {
  return { sku: 'DEMO-X' + i, name: '測試品' + i, line: 'pet', form: 'tablet', price: 100, stock: 5, batch: 'B' + i, expiry: '2028-01-01', status: 'draft' };
}

test('T-CAT-01 合成種子載入且全部標 SYNTHETIC_DEMO', () => {
  const s = new CatalogStore();
  assert.equal(s.list().length, 6);
  assert.ok(s.list().every(x => x.source === SOURCE_TAG));
  assert.equal(s.stats().total, 6);
  assert.equal(s.stats().lowStock, 1); // 庫存 8 < 10
});

test('T-CAT-02 新增商品成功並寫入稽核', () => {
  const s = new CatalogStore();
  const item = s.add(sample(1));
  assert.equal(item.sku, 'DEMO-X1');
  assert.equal(s.list().length, 7);
  assert.equal(s.audit[0].type, 'add');
  assert.equal(s.audit[0].payload.sku, 'DEMO-X1');
});

test('T-CAT-03 SKU 重複被拒絕', () => {
  const s = new CatalogStore();
  const dup = Object.assign(sample(1), { sku: 'DEMO-H001' });
  assert.throws(() => s.add(dup), /SKU 重複/);
  assert.equal(s.list().length, 6);
});

test('T-CAT-04 驗證：負價格、負庫存、錯誤日期格式被拒絕', () => {
  const base = sample(2);
  assert.equal(validateProduct(Object.assign({}, base, { price: -1 }), []).ok, false);
  assert.equal(validateProduct(Object.assign({}, base, { stock: -3 }), []).ok, false);
  assert.equal(validateProduct(Object.assign({}, base, { expiry: '2028/01/01' }), []).ok, false);
  assert.equal(validateProduct(base, []).ok, true);
});

test('T-CAT-05 編輯商品更新欄位與 updatedAt', async () => {
  const s = new CatalogStore();
  const id = s.list()[0].id;
  const before = s.find(id).updatedAt;
  await new Promise(r => setTimeout(r, 5)); // 避免同毫秒造成假 FAIL
  s.update(id, { price: 1999, stock: 3 });
  assert.equal(s.find(id).price, 1999);
  assert.equal(s.find(id).stock, 3);
  assert.notEqual(s.find(id).updatedAt, before);
  assert.equal(s.audit[0].type, 'update');
});

test('T-CAT-06 刪除商品並寫入稽核', () => {
  const s = new CatalogStore();
  const id = s.list()[0].id;
  const sku = s.find(id).sku;
  s.remove(id);
  assert.equal(s.list().length, 5);
  assert.equal(s.find(id), null);
  assert.equal(s.audit[0].type, 'remove');
  assert.equal(s.audit[0].payload.sku, sku);
});

test('T-CAT-07 老闆唯讀：新增／編輯／刪除全部在 Store 層被拒（D-008）', () => {
  const s = new CatalogStore();
  s.setReadOnly(true);
  const id = s.list()[0].id;
  assert.throws(() => s.add(sample(3)), /READ_ONLY_OWNER/);
  assert.throws(() => s.update(id, { price: 1 }), /READ_ONLY_OWNER/);
  assert.throws(() => s.remove(id), /READ_ONLY_OWNER/);
  assert.equal(s.list().length, 6);
  assert.equal(s.find(id).price, 1280);
});

test('T-CAT-08 搜尋與線別篩選', () => {
  const s = new CatalogStore();
  assert.equal(s.list({ line: 'pet' }).length, 3);
  assert.equal(s.list({ keyword: 'ANUBIS' }).length, 3);
  assert.equal(s.list({ keyword: '不存在' }).length, 0);
});

test('T-CAT-09 畫面含 RWD／無 App/PWA／合成資料宣告', () => {
  const html = readFileSync(resolve(here, '../../apps/admin-web/legacy/index.html'), 'utf8');
  assert.match(html, /name="viewport"/);
  assert.match(html, /合成資料/);
  assert.match(html, /無 App／PWA／Service Worker/);
  assert.match(html, /老闆（唯讀）/);
});

test('T-CAT-10 唯讀時按鈕由 render 停用（靜態檢查）', () => {
  const js = readFileSync(appPath, 'utf8');
  assert.match(js, /store\.readOnly \? ' disabled' : ''/);
  assert.match(js, /READ_ONLY_OWNER/);
});
