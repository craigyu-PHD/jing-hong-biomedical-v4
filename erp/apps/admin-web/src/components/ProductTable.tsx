/** 商品表格：窄螢幕在容器內水平捲動；狀態以文字＋符號標示，不只靠顏色。 */
import type { Product } from '@anubis/contracts';
import { useStore } from '../store';

const LINE_LABEL: Record<Product['line'], string> = { human: '人用保健', pet: '寵物保健' };
const FORM_LABEL: Record<Product['form'], string> = { capsule: '膠囊', powder: '粉末', tablet: '錠劑' };
const STATUS_LABEL: Record<Product['status'], string> = { draft: '草稿', active: '已啟用', archived: '已停用' };
const STATUS_MARK: Record<Product['status'], string> = { draft: '○', active: '●', archived: '✕' };
const money = new Intl.NumberFormat('zh-TW');

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductTable({ products, onEdit, onDelete }: Props) {
  const { readOnly } = useStore();

  return (
    <div className="table-scroll" role="region" aria-label="合成商品清單（可水平捲動）" tabIndex={0}>
      <table className="product-table">
        <thead>
          <tr>
            <th scope="col">SKU</th><th scope="col">名稱</th><th scope="col">線別</th>
            <th scope="col">劑型</th><th scope="col" className="num">價格（分）</th>
            <th scope="col" className="num">庫存</th><th scope="col">批號</th><th scope="col">效期</th>
            <th scope="col">狀態</th><th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr><td colSpan={10} className="empty">沒有符合條件的合成資料</td></tr>
          )}
          {products.map((product) => (
            <tr key={product.id}>
              <td className="mono">{product.sku}</td>
              <td>{product.name}</td>
              <td>{LINE_LABEL[product.line]}</td>
              <td>{FORM_LABEL[product.form]}</td>
              <td className="num">{money.format(product.priceCents)}</td>
              <td className="num">
                {product.stock}
                {product.stock < 10 && <span className="stock-flag">低庫存</span>}
              </td>
              <td className="mono">{product.batch}</td>
              <td className="mono">{product.expiry}</td>
              <td><span className={`status-tag status-${product.status}`}><span aria-hidden="true">{STATUS_MARK[product.status]}</span> {STATUS_LABEL[product.status]}</span></td>
              <td>
                <div className="row-actions">
                  <button type="button" disabled={readOnly} onClick={() => onEdit(product)} aria-label={`編輯 ${product.sku}`}>編輯</button>
                  <button type="button" className="danger" disabled={readOnly} onClick={() => onDelete(product)} aria-label={`刪除 ${product.sku}`}>刪除</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
