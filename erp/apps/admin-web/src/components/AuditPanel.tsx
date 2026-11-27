/** 稽核面板：示範紀錄只存在本機，非正式不可竄改稽核表。 */
import { useStore } from '../store';

export function AuditPanel() {
  const { audit } = useStore();

  return (
    <section className="panel" aria-label="操作紀錄">
      <h2>操作紀錄（原型稽核）</h2>
      <ul className="audit-list">
        {audit.length === 0 && <li>尚無操作紀錄</li>}
        {audit.map((event) => (
          <li key={event.id}>
            <span className="mono">{event.at.slice(11, 19)}</span>
            <span>{event.actorId}（{event.actorRole}）</span>
            <span>{event.action}</span>
            <span className="mono">{event.legalEntityId ?? '—'}</span>
          </li>
        ))}
      </ul>
      <p className="note">風險提醒：此紀錄只存於本機 localStorage／記憶體，重載與清除資料後即消失；正式系統須寫入不可竄改稽核表。</p>
    </section>
  );
}
