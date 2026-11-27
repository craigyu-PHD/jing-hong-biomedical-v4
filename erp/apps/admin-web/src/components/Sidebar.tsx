/** 左側導覽：僅本機原型頁面；未實作區塊一律標 DEFERRED，不假裝完成。 */
export type PageKey = 'dashboard' | 'products' | 'orders' | 'deferred';

type Props = {
  page: PageKey;
  onNavigate: (page: PageKey) => void;
};

const ITEMS: ReadonlyArray<{ key: PageKey; label: string; hint: string }> = [
  { key: 'dashboard', label: '儀表板', hint: 'SYNTHETIC_DEMO' },
  { key: 'products', label: '商品主檔', hint: '可增刪改' },
  { key: 'orders', label: '訂單', hint: '三類單據示範' },
  { key: 'deferred', label: '其他模組', hint: 'DEFERRED' }
];

export function Sidebar({ page, onNavigate }: Props) {
  return (
    <aside className="sidebar" aria-label="主導覽">
      <div className="sidebar-brand"><span className="mark" aria-hidden="true">A</span> ANUBIS ERP</div>
      <nav>
        <ul className="nav-list">
          {ITEMS.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={`nav-item ${page === item.key ? 'is-active' : ''}`}
                aria-current={page === item.key ? 'page' : undefined}
                onClick={() => onNavigate(item.key)}
              >
                <span>{item.label}</span><small>{item.hint}</small>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <p className="sidebar-note">
        合規防呆設計／風險提醒：全數合成資料 SYNTHETIC_DEMO；PROTOTYPE_NOT_APPROVED，非正式上線。
      </p>
    </aside>
  );
}
