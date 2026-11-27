/** 合成 KPI：每一張卡都標 SYNTHETIC_DEMO，明確不是真實營運數字。 */
import { useMemo } from 'react';
import { useStore } from '../store';

const money = new Intl.NumberFormat('zh-TW');

export function DashboardPage() {
  const { products, legalEntityId } = useStore();
  const cards = useMemo(() => [
    { label: '品項總數', value: String(products.length), note: '合成商品筆數' },
    { label: '已啟用品項', value: String(products.filter((item) => item.status === 'active').length), note: '狀態為 active' },
    { label: '低庫存警示', value: String(products.filter((item) => item.stock < 10).length), note: '庫存小於 10' },
    { label: '帳面庫存金額（分）', value: money.format(products.reduce((sum, item) => sum + item.priceCents * item.stock, 0)), note: '整數分相加，非營收' }
  ], [products]);

  return (
    <section aria-labelledby="dashboard-title">
      <div className="page-head">
        <div>
          <h1 id="dashboard-title">儀表板 <small>Synthetic KPI</small></h1>
          <p className="lede">以下數值由本機合成商品即時計算，僅供介面配置示範，不代表任何真實銷售、庫存或財務結果。</p>
        </div>
        <span className="demo-chip">SYNTHETIC_DEMO</span>
      </div>
      <div className="kpi-grid">
        {cards.map((card) => (
          <article className="kpi-card" key={card.label}>
            <span className="kpi-label">{card.label}</span>
            <b className="kpi-value">{card.value}</b>
            <span className="kpi-note">{card.note} · SYNTHETIC_DEMO</span>
          </article>
        ))}
      </div>
      <div className="panel">
        <h2>資料邊界</h2>
        <p className="note">目前法人：{legalEntityId}（示範）。所有 KPI 只讀取本機合成資料；PROTOTYPE_NOT_APPROVED，非正式上線。</p>
      </div>
    </section>
  );
}
