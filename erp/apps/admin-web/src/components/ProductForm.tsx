/** 商品表單：共用契約 Zod 驗證；老闆唯讀時不顯示可寫表單，Store 層另有阻擋。 */
import { CreateProductSchema, type Product } from '@anubis/contracts';
import { useEffect, useState, type FormEvent } from 'react';
import { useStore } from '../store';

type Fields = {
  sku: string; name: string; line: string; form: string; price: string;
  stock: string; batch: string; expiry: string; status: string;
};

const EMPTY: Fields = {
  sku: '', name: '', line: 'human', form: 'capsule', price: '',
  stock: '', batch: '', expiry: '', status: 'draft'
};

function toFields(product: Product | null): Fields {
  if (!product) return EMPTY;
  return {
    sku: product.sku, name: product.name, line: product.line, form: product.form,
    price: String(product.priceCents), stock: String(product.stock), batch: product.batch,
    expiry: product.expiry, status: product.status
  };
}

type Props = {
  editing: Product | null;
  onDone: () => void;
};

export function ProductForm({ editing, onDone }: Props) {
  const { addProduct, updateProduct, legalEntityId, readOnly } = useStore();
  const [fields, setFields] = useState<Fields>(() => toFields(editing));
  const [error, setError] = useState('');

  useEffect(() => {
    setFields(toFields(editing));
    setError('');
  }, [editing]);

  function set(key: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (readOnly) {
      setError('READ_ONLY_OWNER：老闆身分唯讀，寫入已被 Store 層拒絕');
      return;
    }
    const parsed = CreateProductSchema.safeParse({
      legalEntityId,
      sku: fields.sku.trim(),
      name: fields.name.trim(),
      line: fields.line,
      form: fields.form,
      priceCents: Number(fields.price),
      stock: Number(fields.stock),
      batch: fields.batch.trim(),
      expiry: fields.expiry,
      status: fields.status
    });
    if (!parsed.success) {
      setError(`欄位驗證失敗：${parsed.error.issues.map((issue) => issue.message).join('；')}`);
      return;
    }
    try {
      if (editing) updateProduct(editing.id, parsed.data);
      else addProduct(parsed.data);
      onDone();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '寫入失敗');
    }
  }

  if (readOnly) {
    return (
      <section className="panel" aria-label="商品表單">
        <h2>新增／編輯商品</h2>
        <p className="notice">老闆（platform_owner）為全域唯讀：表單已停用，寫入 API 也不會被呼叫。</p>
        <button type="button" onClick={onDone}>返回清單</button>
      </section>
    );
  }

  return (
    <section className="panel" aria-label="商品表單">
      <h2>{editing ? '編輯商品（合成資料）' : '新增商品（合成資料）'}</h2>
      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <label>SKU<input required placeholder="DEMO-H009" value={fields.sku} onChange={(e) => set('sku', e.target.value)} /></label>
          <label>名稱<input required placeholder="示意品名" value={fields.name} onChange={(e) => set('name', e.target.value)} /></label>
          <label>線別
            <select value={fields.line} onChange={(e) => set('line', e.target.value)}>
              <option value="human">人用保健</option><option value="pet">寵物保健</option>
            </select>
          </label>
          <label>劑型
            <select value={fields.form} onChange={(e) => set('form', e.target.value)}>
              <option value="capsule">膠囊</option><option value="powder">粉末</option><option value="tablet">錠劑</option>
            </select>
          </label>
          <label>價格（NT$ 整數）<input type="number" min="0" step="1" value={fields.price} onChange={(e) => set('price', e.target.value)} /></label>
          <label>庫存<input type="number" min="0" step="1" value={fields.stock} onChange={(e) => set('stock', e.target.value)} /></label>
          <label>批號<input value={fields.batch} onChange={(e) => set('batch', e.target.value)} /></label>
          <label>效期<input type="date" value={fields.expiry} onChange={(e) => set('expiry', e.target.value)} /></label>
          <label>狀態
            <select value={fields.status} onChange={(e) => set('status', e.target.value)}>
              <option value="draft">草稿</option><option value="active">已啟用</option><option value="archived">已停用</option>
            </select>
          </label>
        </div>
        <p className="form-error" role="alert">{error}</p>
        <div className="form-actions">
          <button type="submit" className="primary">儲存（本機示範）</button>
          <button type="button" onClick={onDone}>取消</button>
        </div>
      </form>
    </section>
  );
}
