/* 精鴻 ANUBIS ERP｜商品主檔原型 app.js
   合規防呆：全部為合成資料（SYNTHETIC/DEMO），非真實商品、非真實庫存、無後端寫入。
   角色示範 D-008：老闆身分全域唯讀（含 API/Store 層阻擋，不只是隱藏按鈕）。
   狀態：PROTOTYPE_NOT_APPROVED；不做 App/PWA/Service Worker。 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.AnubisCatalog = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SOURCE_TAG = 'SYNTHETIC_DEMO';

  // 合成商品種子：結構對齊既有官網 products-data.js，但全部為假資料。
  const SEED = [
    { sku: 'DEMO-H001', name: '牛樟椴木子實體膠囊（示意）', line: 'human', form: 'capsule', price: 1280, stock: 42, batch: 'DEMO2611A', expiry: '2028-11-30', status: 'draft' },
    { sku: 'DEMO-H002', name: '靈芝萃取粉末（示意）', line: 'human', form: 'powder', price: 980, stock: 30, batch: 'DEMO2611B', expiry: '2028-10-31', status: 'draft' },
    { sku: 'DEMO-H003', name: '綜合維生素錠（示意）', line: 'human', form: 'tablet', price: 760, stock: 18, batch: 'DEMO2611C', expiry: '2027-12-31', status: 'draft' },
    { sku: 'DEMO-P001', name: 'ANUBIS 寵物關節保健（示意）', line: 'pet', form: 'capsule', price: 1480, stock: 25, batch: 'DEMO2611P', expiry: '2028-09-30', status: 'draft' },
    { sku: 'DEMO-P002', name: 'ANUBIS 寵物腸胃益生菌（示意）', line: 'pet', form: 'powder', price: 1180, stock: 12, batch: 'DEMO2611Q', expiry: '2027-08-31', status: 'draft' },
    { sku: 'DEMO-P003', name: 'ANUBIS 寵物皮毛護理（示意）', line: 'pet', form: 'tablet', price: 880, stock: 8, batch: 'DEMO2611R', expiry: '2027-06-30', status: 'draft' }
  ];

  const LINE_LABEL = { human: '人用保健', pet: '寵物保健' };
  const FORM_LABEL = { capsule: '膠囊', powder: '粉末', tablet: '錠劑' };
  const STATUS_LABEL = { draft: '草稿（示意）', active: '已啟用', archived: '已停用' };

  function validateProduct(input, existing) {
    const errors = [];
    const v = input || {};
    if (!String(v.sku || '').trim()) errors.push('SKU 不可為空');
    else if ((existing || []).some(function (x) { return x.sku === String(v.sku).trim() && x.id !== v.id; })) errors.push('SKU 重複');
    if (!String(v.name || '').trim()) errors.push('名稱不可為空');
    if (!Number.isFinite(Number(v.price)) || Number(v.price) < 0) errors.push('價格須為非負數字');
    if (!Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) errors.push('庫存須為非負整數');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v.expiry || ''))) errors.push('效期格式須為 YYYY-MM-DD');
    if (!LINE_LABEL[v.line]) errors.push('線別無效');
    if (!FORM_LABEL[v.form]) errors.push('劑型無效');
    if (!STATUS_LABEL[v.status]) errors.push('狀態無效');
    return { ok: errors.length === 0, errors: errors };
  }

  function now() { return new Date().toISOString(); }

  class CatalogStore {
    constructor(seed) {
      this.items = (seed || SEED).map(function (x, i) {
        return Object.assign({ id: 'P' + String(i + 1).padStart(3, '0') }, x, {
          source: SOURCE_TAG, createdAt: now(), updatedAt: now()
        });
      });
      this.readOnly = false;
      this.audit = [];
      this.listeners = [];
    }
    subscribe(fn) { this.listeners.push(fn); return function () { this.listeners = this.listeners.filter(function (f) { return f !== fn; }); }.bind(this); }
    emit(type, payload) {
      const rec = { at: now(), type: type, payload: payload || {}, actor: this.readOnly ? 'OWNER_READONLY' : 'ADMIN_DEMO' };
      if (type !== 'role') this.audit.unshift(rec);
      this.audit = this.audit.slice(0, 20);
      this.listeners.forEach(function (f) { f(type, rec); });
      return rec;
    }
    setReadOnly(v) { this.readOnly = !!v; this.emit('role', { readOnly: this.readOnly }); return this.readOnly; }
    assertWritable() {
      if (this.readOnly) throw new Error('READ_ONLY_OWNER：老闆身分唯讀，禁止改動資料（D-008）');
    }
    list(q) {
      const query = q || {};
      const kw = String(query.keyword || '').trim().toLowerCase();
      return this.items.filter(function (x) {
        if (query.line && x.line !== query.line) return false;
        if (kw && (x.name + ' ' + x.sku).toLowerCase().indexOf(kw) === -1) return false;
        return true;
      }).slice().sort(function (a, b) { return a.sku.localeCompare(b.sku); });
    }
    find(id) { return this.items.filter(function (x) { return x.id === id; })[0] || null; }
    add(input) {
      this.assertWritable();
      const payload = Object.assign({}, input, { id: undefined });
      const check = validateProduct(payload, this.items);
      if (!check.ok) throw new Error('VALIDATION_FAILED: ' + check.errors.join('；'));
      const item = Object.assign({}, payload, {
        id: 'P' + String(this.items.length + 1).padStart(3, '0'),
        source: SOURCE_TAG, createdAt: now(), updatedAt: now()
      });
      this.items.push(item);
      this.emit('add', { id: item.id, sku: item.sku });
      return item;
    }
    update(id, patch) {
      this.assertWritable();
      const old = this.find(id);
      if (!old) throw new Error('NOT_FOUND: ' + id);
      const merged = Object.assign({}, old, patch, { id: id });
      const check = validateProduct(merged, this.items);
      if (!check.ok) throw new Error('VALIDATION_FAILED: ' + check.errors.join('；'));
      Object.assign(old, patch, { updatedAt: now() });
      this.emit('update', { id: id, sku: old.sku });
      return old;
    }
    remove(id) {
      this.assertWritable();
      const old = this.find(id);
      if (!old) throw new Error('NOT_FOUND: ' + id);
      this.items = this.items.filter(function (x) { return x.id !== id; });
      this.emit('remove', { id: id, sku: old.sku });
      return old;
    }
    stats() {
      const low = this.items.filter(function (x) { return x.stock < 10; }).length;
      return { total: this.items.length, human: this.items.filter(function (x) { return x.line === 'human'; }).length, pet: this.items.filter(function (x) { return x.line === 'pet'; }).length, lowStock: low };
    }
  }

  function boot() {
    if (typeof document === 'undefined') return null;
    const store = new CatalogStore();
    const $ = function (s) { return document.querySelector(s); };
    const tbody = $('#catalog-body');
    const banner = $('#role-banner');
    const auditBox = $('#audit-list');
    const form = $('#product-form');
    const roleSelect = $('#role-select');
    const keyword = $('#q-keyword');
    const lineFilter = $('#q-line');

    function label(map, k) { return map[k] || k; }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

    function render() {
      const rows = store.list({ keyword: keyword.value, line: lineFilter.value });
      tbody.innerHTML = rows.map(function (x) {
        return '<tr data-id="' + x.id + '">' +
          '<td class="mono">' + esc(x.sku) + '</td>' +
          '<td>' + esc(x.name) + '</td>' +
          '<td>' + label(LINE_LABEL, x.line) + '</td>' +
          '<td>' + label(FORM_LABEL, x.form) + '</td>' +
          '<td class="num">' + Number(x.price).toLocaleString('zh-TW') + '</td>' +
          '<td class="num' + (x.stock < 10 ? ' warn' : '') + '">' + x.stock + '</td>' +
          '<td class="mono">' + esc(x.batch) + '</td>' +
          '<td class="mono">' + esc(x.expiry) + '</td>' +
          '<td><span class="tag ' + x.status + '">' + label(STATUS_LABEL, x.status) + '</span></td>' +
          '<td class="ops">' +
          '<button type="button" class="btn-edit" data-id="' + x.id + '"' + (store.readOnly ? ' disabled' : '') + '>編輯</button>' +
          '<button type="button" class="btn-del danger" data-id="' + x.id + '"' + (store.readOnly ? ' disabled' : '') + '>刪除</button>' +
          '</td></tr>';
      }).join('') || '<tr><td colspan="10" class="empty">沒有符合條件的合成資料</td></tr>';

      const s = store.stats();
      $('#stat-total').textContent = s.total;
      $('#stat-human').textContent = s.human;
      $('#stat-pet').textContent = s.pet;
      $('#stat-low').textContent = s.lowStock;

      banner.textContent = store.readOnly
        ? '老闆（唯讀）｜可看全部，不能改任何資料；寫入在程式層已被拒絕（D-008）'
        : '管理員（原型）｜可新增／編輯／刪除；所有資料皆為合成示意，無後端';
      banner.className = store.readOnly ? 'banner readonly' : 'banner';
      $('#form-wrap').hidden = store.readOnly;
      $('#audit-list').innerHTML = store.audit.slice(0, 8).map(function (a) {
        return '<li><span class="mono">' + a.at.slice(11, 19) + '</span> ' + esc(a.actor) + ' · ' + esc(a.type) + ' · ' + esc(a.payload.sku || '') + '</li>';
      }).join('') || '<li>尚無操作紀錄</li>';
    }

    function openForm(id) {
      const item = id ? store.find(id) : null;
      form.reset();
      $('#f-id').value = item ? item.id : '';
      $('#f-sku').value = item ? item.sku : '';
      $('#f-name').value = item ? item.name : '';
      $('#f-line').value = item ? item.line : 'human';
      $('#f-form').value = item ? item.form : 'capsule';
      $('#f-price').value = item ? item.price : '';
      $('#f-stock').value = item ? item.stock : '';
      $('#f-batch').value = item ? item.batch : '';
      $('#f-expiry').value = item ? item.expiry : '';
      $('#f-status').value = item ? item.status : 'draft';
      $('#form-title').textContent = item ? '編輯商品（合成資料）' : '新增商品（合成資料）';
      $('#form-wrap').hidden = false;
      $('#f-sku').focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const payload = {
        sku: $('#f-sku').value.trim(), name: $('#f-name').value.trim(),
        line: $('#f-line').value, form: $('#f-form').value,
        price: Number($('#f-price').value), stock: Number($('#f-stock').value),
        batch: $('#f-batch').value.trim(), expiry: $('#f-expiry').value,
        status: $('#f-status').value
      };
      try {
        const id = $('#f-id').value;
        if (id) store.update(id, payload); else store.add(payload);
        $('#form-msg').textContent = '';
        $('#form-wrap').hidden = true;
      } catch (err) {
        $('#form-msg').textContent = err.message;
      }
    });
    $('#f-cancel').addEventListener('click', function () { $('#form-wrap').hidden = true; });
    $('#btn-add').addEventListener('click', function () { openForm(null); });
    tbody.addEventListener('click', function (e) {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.classList.contains('btn-edit')) openForm(t.dataset.id);
      if (t.classList.contains('btn-del')) {
        try { store.remove(t.dataset.id); } catch (err) { alert(err.message); }
      }
    });
    keyword.addEventListener('input', render);
    lineFilter.addEventListener('change', render);
    roleSelect.addEventListener('change', function () { store.setReadOnly(roleSelect.value === 'owner'); render(); });
    store.subscribe(function () { render(); });
    render();
    window.AnubisCatalogStore = store;
    return store;
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }

  return { CatalogStore: CatalogStore, SEED: SEED, validateProduct: validateProduct, SOURCE_TAG: SOURCE_TAG, boot: boot, LINE_LABEL: LINE_LABEL, FORM_LABEL: FORM_LABEL, STATUS_LABEL: STATUS_LABEL };
});
