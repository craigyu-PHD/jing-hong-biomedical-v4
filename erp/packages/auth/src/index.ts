/**
 * @anubis/auth｜RBAC + ABAC + RLS 政策判斷（純函式，可測）
 * 合規防呆設計／風險提醒：
 * - D-008/ADR-001：platform_owner（老闆）＝委派權＋全域唯讀，無業務寫入；
 * - 不可自授最高權、不可自審自核；委派不得超過 grant ceiling；
 * - 帳密交接走代理人＋MFA＋稽核，不共用同一組密碼；
 * - 三法人以 legal_entity_id 隔離；RLS 由 DB 層再執行一次。
 */
import type { Role, LegalEntityId, Grant } from '@anubis/contracts';

export const WRITE_ROLES: Role[] = ['accounting', 'administration', 'warehouse', 'sales', 'security_admin', 'access_admin', 'content_compliance'];
export const OWNER_ROLE: Role = 'platform_owner';

export interface Actor {
  id: string;
  role: Role;
  legalEntityScope: LegalEntityId[];
  delegatedFrom?: string;
  mfaVerified: boolean;
}

/** 平台的寫入動作清單（業務資料）；委派本身是另一類特權 */
export const DATA_WRITE_ACTIONS = ['product.create', 'product.update', 'product.delete', 'order.create', 'order.update', 'receivable.adjust', 'contract.draw'] as const;
export type DataWriteAction = typeof DATA_WRITE_ACTIONS[number];

export interface Decision { allowed: boolean; reason: string; }

/** 老闆唯讀：任何業務寫入拒絕 */
export function canWriteData(actor: Actor, action: DataWriteAction): Decision {
  if (actor.role === OWNER_ROLE) return { allowed: false, reason: 'READ_ONLY_OWNER' };
  if (!WRITE_ROLES.includes(actor.role)) return { allowed: false, reason: 'ROLE_NOT_WRITE_CAPABLE' };
  if (!actor.mfaVerified && actor.role !== 'sales') return { allowed: false, reason: 'MFA_REQUIRED' };
  return { allowed: true, reason: 'OK' };
}

/** 法人範圍：ABAC */
export function canAccessEntity(actor: Actor, entity: LegalEntityId): Decision {
  if (actor.role === OWNER_ROLE) return { allowed: true, reason: 'OWNER_READ_ALL' };
  if (!actor.legalEntityScope.includes(entity)) return { allowed: false, reason: 'ENTITY_OUT_OF_SCOPE' };
  return { allowed: true, reason: 'OK' };
}

/** 委派上限：不得授予超過 grantor 自己的上限；最高權不可下放 */
export function canGrant(grantor: Actor, newGrant: Pick<Grant, 'role' | 'ceiling' | 'legalEntityScope'>, targetId: string): Decision {
  if (grantor.role !== OWNER_ROLE && grantor.role !== 'security_admin' && grantor.role !== 'access_admin') {
    return { allowed: false, reason: 'NOT_GRANTOR' };
  }
  if (newGrant.role === OWNER_ROLE) return { allowed: false, reason: 'OWNER_ROLE_NON_DELEGABLE' };
  if (targetId === grantor.id) return { allowed: false, reason: 'SELF_GRANT_FORBIDDEN' };
  if (!grantor.mfaVerified) return { allowed: false, reason: 'MFA_REQUIRED' };
  const outOfScope = newGrant.legalEntityScope.filter(e => !grantor.legalEntityScope.includes(e) && grantor.role !== OWNER_ROLE);
  if (outOfScope.length) return { allowed: false, reason: 'SCOPE_EXCEEDS_GRANTOR' };
  return { allowed: true, reason: 'OK' };
}

/** 自審自核禁止（S35） */
export function canApprove(approverId: string, createdBy: string): Decision {
  return approverId === createdBy
    ? { allowed: false, reason: 'SELF_APPROVAL_FORBIDDEN' }
    : { allowed: true, reason: 'OK' };
}

/** RLS 政策運算（供 DB set_config 使用） */
export function rlsContext(actor: Actor): Record<string, string> {
  return {
    'app.actor_role': actor.role,
    'app.actor_id': actor.id,
    'app.legal_entity_scope': actor.legalEntityScope.join(','),
    'app.read_only': actor.role === OWNER_ROLE ? 'true' : 'false'
  };
}
