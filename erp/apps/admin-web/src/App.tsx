/** 版面外殼：未登入先顯示登入頁；合規宣告在所有畫面都可見；未實作區塊永遠顯示 DEFERRED。 */
import { useEffect, useState } from 'react';
import { UNAUTHORIZED_EVENT, setAuthToken } from './api/client';
import { clearSession, isServerReadOnly, readSession, type Session } from './auth/session';
import { Sidebar, type PageKey } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ComingSoon } from './pages/ComingSoon';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';
import { StoreProvider, useStore } from './store';

function Shell({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [page, setPage] = useState<PageKey>('products');
  const { readOnly, legalEntityId } = useStore();

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={setPage} />
      <div className="app-main">
        <TopBar session={session} onLogout={onLogout} />
        <div className={`compliance-banner ${readOnly ? 'is-readonly' : ''}`} role="note">
          合規防呆設計／風險提醒：全數合成資料 SYNTHETIC_DEMO，PROTOTYPE_NOT_APPROVED，非正式上線。
          已登入 {session.actor.id}（{session.actor.role}）／法人 {legalEntityId}；
          {readOnly ? '後端與前端皆為唯讀，所有寫入已被拒絕。' : '寫入權限由後端 token 決定，僅供本機示範。'}
        </div>
        <main className="page">
          {page === 'dashboard' && <DashboardPage />}
          {page === 'products' && <ProductsPage />}
          {page === 'orders' && <OrdersPage />}
          {page === 'deferred' && <ComingSoon />}
        </main>
        <footer className="app-footer">
          SYNTHETIC_DEMO · PROTOTYPE_NOT_APPROVED · 無 App／PWA／Service Worker／離線同步 · 無正式後端與驗收
        </footer>
      </div>
    </div>
  );
}

export function App() {
  const [session, setSession] = useState<Session | null>(() => readSession());

  useEffect(() => {
    const onUnauthorized = (): void => {
      clearSession();
      setAuthToken(null);
      setSession(null);
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  if (!session) return <LoginPage onSuccess={setSession} />;

  return (
    <StoreProvider
      serverReadOnly={isServerReadOnly(session.actor.role)}
      serverRole={session.actor.role}
      serverActorId={session.actor.id}
    >
      <Shell
        session={session}
        onLogout={() => {
          clearSession();
          setAuthToken(null);
          setSession(null);
        }}
      />
    </StoreProvider>
  );
}
