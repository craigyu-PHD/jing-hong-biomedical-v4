/** 未實作模組：一律 DEFERRED，不假裝完成。 */
const AREAS = [
  { name: '合約池', detail: '額度／ item pool、提領、分期尾差、展期與轉讓尚未設計完成。' },
  { name: '應收帳款', detail: '25 日切帳、溢收與折扣規則待後端與會計確認。' },
  { name: 'BI 報表', detail: '口徑、權限遮罩與匯出稽核未定義。' },
  { name: '權限與委派', detail: '老闆委派上限、MFA、不可自授自審需落實在後端 RBAC。' },
  { name: 'AI 助手', detail: '工具白名單、Session 隔離與「不直接寫帳」尚未串接。' }
] as const;

export function ComingSoon() {
  return (
    <section aria-labelledby="deferred-title">
      <div className="page-head">
        <div>
          <h1 id="deferred-title">其他模組 <small>DEFERRED</small></h1>
          <p className="lede">下列功能僅保留位置，尚未實作、未驗收，不可視為已完成或已上線。</p>
        </div>
        <span className="deferred-chip">DEFERRED</span>
      </div>
      <div className="deferred-grid">
        {AREAS.map((area) => (
          <article className="panel deferred-card" key={area.name}>
            <span className="deferred-chip">DEFERRED</span>
            <h2>{area.name}</h2>
            <p className="note">{area.detail}</p>
          </article>
        ))}
      </div>
      <p className="notice">合規防呆設計／風險提醒：全數合成資料 SYNTHETIC_DEMO，PROTOTYPE_NOT_APPROVED，非正式上線。</p>
    </section>
  );
}
