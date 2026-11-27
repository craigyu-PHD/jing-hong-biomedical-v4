/** 訂單列表示範：銷貨／補貨／換貨三類單據；補貨紙面金額必為 0，內部權益扣抵另記。 */
import type { DocumentType, Order } from '@anubis/contracts';
import { useStore } from '../store';

const DEMO_ORDERS: Order[] = [
  {
    id: 'D-DEMO-001', legalEntityId: 'LE-01', customerId: 'C-DEMO-001', documentType: 'sale',
    lines: [{ productId: 'P001', sku: 'DEMO-H001', qty: 10, unitPriceCents: 128000, amountCents: 1280000 }],
    totalCents: 1280000, internalEquityCents: 0, status: 'pending_approval',
    createdBy: 'ADMIN_DEMO', createdAt: '2026-11-26T09:00:00.000Z', source: 'SYNTHETIC_DEMO'
  },
  {
    id: 'D-DEMO-002', legalEntityId: 'LE-01', customerId: 'C-DEMO-002', documentType: 'replacement',
    lines: [{ productId: 'P004', sku: 'DEMO-P001', qty: 2, unitPriceCents: 0, amountCents: 0 }],
    totalCents: 0, internalEquityCents: 296000, status: 'approved',
    createdBy: 'ADMIN_DEMO', createdAt: '2026-11-26T10:30:00.000Z', source: 'SYNTHETIC_DEMO'
  },
  {
    id: 'D-DEMO-003', legalEntityId: 'LE-01', customerId: 'C-DEMO-003', documentType: 'exchange',
    lines: [{ productId: 'P002', sku: 'DEMO-H002', qty: 1, unitPriceCents: 0, amountCents: 0 }],
    totalCents: 0, internalEquityCents: 0, status: 'draft',
    createdBy: 'ADMIN_DEMO', createdAt: '2026-11-27T02:15:00.000Z', source: 'SYNTHETIC_DEMO'
  }
];

const DOC_LABEL: Record<DocumentType, string> = {
  sale: '銷貨單', replacement: '補貨單（紙面 0 元）', exchange: '換貨單'
};
const DOC_MARK: Record<DocumentType, string> = { sale: 'S', replacement: 'R', exchange: 'E' };
const STATUS_LABEL: Record<Order['status'], string> = {
  draft: '草稿', pending_approval: '待審核', approved: '已核准', printed: '已列印', shipped: '已出貨'
};
const money = new Intl.NumberFormat('zh-TW');

export function OrdersPage() {
  const { legalEntityId } = useStore();
  // 法人隔離：只顯示目前選取法人的合成單據；沒有資料就明說，不跨法人借資料。
  const orders = DEMO_ORDERS.filter((order) => order.legalEntityId === legalEntityId);

  return (
    <section aria-labelledby="orders-title">
      <div className="page-head">
        <div>
          <h1 id="orders-title">訂單 <small>Order Demo</small></h1>
          <p className="lede">三類單據的視覺示範，無後端、無真實客戶、無出貨流程；正式審核與列印功能 DEFERRED。</p>
        </div>
        <span className="demo-chip">SYNTHETIC_DEMO</span>
      </div>
      <div className="table-scroll" role="region" aria-label="合成訂單清單（可水平捲動）" tabIndex={0}>
        <table className="product-table">
          <thead>
            <tr><th scope="col">單號</th><th scope="col">單據類別</th><th scope="col">客戶</th><th scope="col">品項</th><th scope="col" className="num">紙面金額（分）</th><th scope="col" className="num">內部權益（分）</th><th scope="col">狀態</th></tr>
          </thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan={7} className="empty">目前法人 {legalEntityId} 沒有合成單據（不跨法人取樣）</td></tr>}
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="mono">{order.id}</td>
                <td><span className="doc-tag"><span aria-hidden="true">{DOC_MARK[order.documentType]}</span> {DOC_LABEL[order.documentType]}</span></td>
                <td className="mono">{order.customerId}</td>
                <td>{order.lines.map((line) => line.sku).join('、')}</td>
                <td className="num">{money.format(order.totalCents)}</td>
                <td className="num">{money.format(order.internalEquityCents)}</td>
                <td><span className="status-tag status-draft"><span aria-hidden="true">○</span> {STATUS_LABEL[order.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">風險提醒：補貨單紙面金額為 0，內部權益扣抵為示意數字；真實單據需人工核准後才能列印／出貨。PROTOTYPE_NOT_APPROVED。</p>
    </section>
  );
}
