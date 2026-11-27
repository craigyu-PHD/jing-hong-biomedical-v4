/**
 * 登入頁：合規防呆設計／風險提醒
 * 1. 密碼不寫死在前端，帳號與密碼都由本機 .env 透過 erp-api 驗證。
 * 2. 成功後只保存 token 與角色，角色／法人權限一律由後端 token 決定。
 * 3. SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED，非正式上線。
 */
import { useState, type FormEvent } from 'react';
import { api, isApiError, setAuthToken } from '../api/client';
import { saveSession, type Session } from '../auth/session';

export function LoginPage({ onSuccess }: { onSuccess: (session: Session) => void }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await api.login(username.trim(), password);
      const session: Session = {
        token: result.token,
        actor: result.actor,
        legalEntityScope: result.legalEntityScope,
        expiresAt: result.expiresAt
      };
      setAuthToken(session.token);
      saveSession(session);
      onSuccess(session);
    } catch (cause) {
      setError(isApiError(cause) ? cause.message : '登入失敗，請稍後再試');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={event => { void submit(event); }}>
        <div className="login-brand">
          <span className="login-mark" aria-hidden>AN</span>
          <div>
            <h1>ANUBIS ERP</h1>
            <p>管理後台 · 原型登入</p>
          </div>
        </div>

        <div className="login-notice" role="note">
          合規防呆設計／風險提醒：全數合成資料 SYNTHETIC_DEMO，PROTOTYPE_NOT_APPROVED，非正式上線。
          本頁僅供本機前後端串接驗收，不承載真實憑證或交易。
        </div>

        <label className="login-field">
          帳號
          <input
            aria-label="帳號"
            name="username"
            autoComplete="username"
            value={username}
            onChange={event => setUsername(event.target.value)}
            required
          />
        </label>
        <label className="login-field">
          密碼
          <input
            aria-label="密碼"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="請輸入本機 .env 設定的密碼"
            required
          />
        </label>

        {error && <p className="login-error" role="alert">{error}</p>}

        <button className="login-submit" type="submit" disabled={busy}>
          {busy ? '登入中…' : '登入後台'}
        </button>

        <p className="login-hint">
          測試帳號由本機 <code>apps/erp-api/.env</code> 提供；密碼不進 repo、不寫在前端。
          管理者（security_admin）可跨法人操作；老闆帳號為全域唯讀。
        </p>
      </form>
    </div>
  );
}
