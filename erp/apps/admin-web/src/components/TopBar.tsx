/** 頂部控制列：登入身分（由後端 token 決定）、法人選擇器、密度三檔、字級 90–200%、亮暗主題。 */
import { LegalEntityIdSchema, type LegalEntityId } from '@anubis/contracts';
import type { Session } from '../auth/session';
import { useStore, type Density } from '../store';

const ENTITIES: ReadonlyArray<{ value: LegalEntityId; label: string }> = [
  { value: 'LE-01', label: 'LE-01（示範法人一）' },
  { value: 'LE-02', label: 'LE-02（示範法人二）' },
  { value: 'LE-03', label: 'LE-03（示範法人三）' }
];
const FONTS = [90, 100, 110, 125, 150, 175, 200] as const;

export function TopBar({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const { legalEntityId, setLegalEntityId, prefs, setDensity, setFont, setTheme, apiMode } = useStore();
  const allowed = ENTITIES.filter(entity => session.legalEntityScope.includes(entity.value));
  const activeEntity = allowed.some(entity => entity.value === legalEntityId) ? legalEntityId : (allowed[0]?.value ?? legalEntityId);

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <strong>ANUBIS ERP</strong><span className="sub">管理後台 · 原型</span>
        <span className="demo-chip">SYNTHETIC_DEMO</span>
      </div>
      <div className="top-actions">
        <span className="actor-chip" title="寫入權限由後端 token 決定">
          已登入 {session.actor.id} · {session.actor.role}
        </span>
        <label className="ctl">
          法人
          <select
            aria-label="選擇法人（x-legal-entity-id）"
            value={activeEntity}
            onChange={(event) => {
              const parsed = LegalEntityIdSchema.safeParse(event.target.value);
              if (parsed.success && session.legalEntityScope.includes(parsed.data)) setLegalEntityId(parsed.data);
            }}
          >
            {allowed.map((entity) => <option key={entity.value} value={entity.value}>{entity.label}</option>)}
          </select>
        </label>
        <label className="ctl">
          密度
          <select aria-label="切換密度" value={prefs.density} onChange={(event) => setDensity(event.target.value as Density)}>
            <option value="comfortable">舒適</option>
            <option value="standard">標準</option>
            <option value="compact">緊湊</option>
          </select>
        </label>
        <label className="ctl">
          字級
          <select aria-label="切換字級" value={prefs.font} onChange={(event) => setFont(Number(event.target.value))}>
            {FONTS.map((font) => <option key={font} value={font}>{font}%</option>)}
          </select>
        </label>
        <label className="ctl">
          主題
          <select aria-label="切換亮暗主題" value={prefs.theme} onChange={(event) => setTheme(event.target.value === 'dark' ? 'dark' : 'light')}>
            <option value="light">明亮</option>
            <option value="dark">暗色</option>
          </select>
        </label>
        <span className={`api-chip ${apiMode === 'api' ? 'is-api' : 'is-fallback'}`}>
          {apiMode === 'api' ? 'API 已連線' : '本機合成資料'}
        </span>
        <button className="logout-btn" type="button" onClick={onLogout}>登出</button>
      </div>
    </header>
  );
}
