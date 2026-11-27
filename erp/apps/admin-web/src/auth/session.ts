/**
 * 前端登入工作階段：只保存 token 與角色，不保存密碼。
 * 合規防呆設計／風險提醒：
 * 1. 角色與法人授權由後端 token 決定，前端不得自報角色（D-008／D-013）。
 * 2. sessionStorage  sacrificial：關閉分頁即需重新登入；不寫入 repo、不進 localStorage 的商品快取。
 * 3. SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED，非正式上線。
 */
import { z } from 'zod';
import { LegalEntityIdSchema, RoleSchema } from '@anubis/contracts';

const SessionSchema = z.object({
  token: z.string().min(10),
  actor: z.object({
    id: z.string().min(1),
    role: RoleSchema
  }),
  legalEntityScope: z.array(LegalEntityIdSchema).min(1),
  expiresAt: z.string().optional()
});

export type Session = z.infer<typeof SessionSchema>;

const KEY = 'anubis.admin-web.session.v1';

export function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = SessionSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;
    if (parsed.data.expiresAt && Date.parse(parsed.data.expiresAt) <= Date.now()) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession(): void {
  sessionStorage.removeItem(KEY);
}

export function isServerReadOnly(role: Session['actor']['role']): boolean {
  return role === 'platform_owner' || role === 'executive_readonly' || role === 'auditor_readonly';
}
