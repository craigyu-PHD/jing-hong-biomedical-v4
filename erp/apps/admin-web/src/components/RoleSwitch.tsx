/** 身份切換：老闆（platform_owner）全域唯讀，寫入在 Store 層已阻擋。 */
import type { Role } from '@anubis/contracts';
import { useStore } from '../store';

const OPTIONS: ReadonlyArray<{ value: Role; label: string }> = [
  { value: 'administration', label: '管理員（可增刪改）' },
  { value: 'platform_owner', label: '老闆（全域唯讀）' }
];

export function RoleSwitch() {
  const { currentRole, setRole, readOnly } = useStore();

  return (
    <div className="role-switch">
      <label className="ctl">
        身份
        <select aria-label="切換身份" value={currentRole} onChange={(event) => setRole(event.target.value as Role)}>
          {OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <span className={`role-badge ${readOnly ? 'is-readonly' : 'is-writable'}`} aria-live="polite">
        {readOnly ? '唯讀：寫入已停用' : '可寫入（示範）'}
      </span>
    </div>
  );
}
