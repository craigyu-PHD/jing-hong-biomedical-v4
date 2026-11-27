/** 商品主檔：搜尋／線別篩選／統計卡／增刪改；全部為合成資料。 */
import type { Product } from '@anubis/contracts';
import { useMemo, useState } from 'react';
import { AuditPanel } from '../components/AuditPanel';
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';
import { useStore } from '../store';

export function ProductsPage() {
  const { products, readOnly, syncError, removeProduct } = useStore();
  const [keyword, setKeyword] = useState('');
  const [line, setLine] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return products
      .filter((product) => (line === '' || product.line === line) && (kw === '' || `${product.sku} ${product.name}`.toLowerCase().includes(kw)))
      .slice()
      .sort((a, b) => a.sku.localeCompare(b.sku));
  }, [products, keyword, line]);

  const stats = useMemo(() => ({
    total: products.length,
    human: products.filter((item) => item.line === 'human').length,
    pet: products.filter((item) => item.line === 'pet').length,
    low: products.filter((item) => item.stock < 10).length
  }), [products]);

  function requestDelete(product: Product) {
    if (readOnly) return;
    if (!window.confirm(`刪除合成商品 ${product.sku}？此操作只影響本機示範資料。`)) return;
    try {
      removeProduct(product.id);
      setDeleteError('');
      if (editing?.id === product.id) setEditing(null);
    } catch (cause) {
      setDeleteError(cause instanceof Error ? cause.message : '刪除失敗');
    }
  }

  return (
    <section aria-labelledby="products-title">
      <div className="page-head">
        <div>
          <h1 id="products-title">商品主檔 <small>Product Master</small></h1>
          <p className="lede">示範增／刪／改流程。品名、價格、庫存、批號與效期全為合成假資料，不可對帳、不可上線。</p>
        </div>
        <button type="button" className="primary" disabled={readOnly} onClick={() => setEditing(null)}>＋ 新增商品</button>
      </div>

      <div className="stats" aria-label="合成資料統計">
        <div className="stat"><span>品項總數</span><b>{stats.total}</b></div>
        <div className="stat"><span>人用保健</span><b>{stats.human}</b></div>
        <div className="stat"><span>寵物保健</span><b>{stats.pet}</b></div>
        <div className="stat"><span>低庫存（&lt;10）</span><b>{stats.low}</b></div>
      </div>

      <div className="filters">
        <label className="ctl">搜尋<input type="search" placeholder="名稱或 SKU" value={keyword} onChange={(e) => setKeyword(e.target.value)} /></label>
        <label className="ctl">線別
          <select value={line} onChange={(e) => setLine(e.target.value)}>
            <option value="">全部</option><option value="human">人用保健</option><option value="pet">寵物保健</option>
          </select>
        </label>
        <span className="source-chip">來源標籤：SYNTHETIC_DEMO</span>
      </div>

      {syncError && <p className="notice" role="status">API 狀態：{syncError}（畫面仍可操作本機合成資料）</p>}
      {deleteError && <p className="form-error" role="alert">{deleteError}</p>}

      <ProductTable products={filtered} onEdit={setEditing} onDelete={requestDelete} />
      <div className="two-col">
        <ProductForm editing={editing} onDone={() => setEditing(null)} />
        <AuditPanel />
      </div>
    </section>
  );
}
