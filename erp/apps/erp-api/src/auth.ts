/**
 * @anubis/erp-api｜身份、登入 Token 與角色中介層
 * 合規防呆設計／風險提醒：
 * 1. 正式啟動一律用 HMAC 簽章的 Bearer Token；舊的 x-actor-* header 只開放給 node --test inject，
 *    避免任何人偽裝成老闆或管理者。
 * 2. platform_owner（老闆）只能唯讀；所有寫入回 403 READ_ONLY_OWNER（D-008）。
 * 3. security_admin 是唯一可跨法人寫入的角色，仅由登入設定授予（D-010 書面授權、各自帳號）。
 * 4. 密碼不進程式碼、不進 repo：只從本機 .env 讀取；repo 僅放 .env.example。
 * 5. 全數 SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED，非正式上線。
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import {
  LegalEntityIdSchema,
  RoleSchema,
  type LegalEntityId,
  type Role
} from '@anubis/contracts';

export interface Actor {
  id: string;
  role: Role;
  legalEntityId: LegalEntityId | null;
}

export interface AuthUser {
  password: string;
  actor: Actor;
  legalEntityScope: LegalEntityId[];
}

export interface AuthConfig {
  secret: string;
  users: Record<string, AuthUser>;
  /** 合規防呆設計／風險提醒：僅供測試 inject；正式啟動必須為 false。 */
  allowHeaderAuth: boolean;
}

const SessionPayloadSchema = z.object({
  sub: z.string().min(1),
  role: RoleSchema,
  legalEntityScope: z.array(LegalEntityIdSchema).min(1),
  iat: z.number().int().nonnegative(),
  exp: z.number().int().positive()
});
export type SessionPayload = z.infer<typeof SessionPayloadSchema>;

declare module 'fastify' {
  interface FastifyRequest {
    actor?: Actor;
  }
}

function toBase64Url(value: string | Buffer): string {
  return Buffer.from(value).toString('base64url');
}

function fromBase64Url(value: string): Buffer {
  return Buffer.from(value, 'base64url');
}

/** 合規防呆設計／風險提醒：固定长度比較，避免計時攻擊推測密碼或簽章。 */
export function safeTextEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function createSessionToken(payload: SessionPayload, secret: string): string {
  const body = toBase64Url(JSON.stringify(payload));
  const signature = toBase64Url(createHmac('sha256', secret).update(body).digest());
  return `${body}.${signature}`;
}

export function verifySessionToken(token: string, secret: string): SessionPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const [body, signaturePart] = parts as [string, string];
  const expected = createHmac('sha256', secret).update(body).digest();
  const actual = fromBase64Url(signaturePart);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const parsed = SessionPayloadSchema.safeParse(JSON.parse(fromBase64Url(body).toString('utf8')));
    if (!parsed.success) return null;
    // 合規防呆設計／風險提醒：過期 token 一律拒絕，前端需重新登入。
    if (parsed.data.exp <= Date.now()) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

/** 合規防呆設計／風險提醒：header 缺失或格式錯誤時不降級為匿名管理者。 */
export function getActorFromHeaders(headers: Record<string, unknown>): Actor | null {
  const read = (name: string): string | undefined => {
    const value = headers[name];
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    return undefined;
  };

  const id = read('x-actor-id');
  const roleRaw = read('x-actor-role');
  const entityRaw = read('x-legal-entity-id');
  if (!id || !roleRaw) return null;

  const roleParsed = RoleSchema.safeParse(roleRaw);
  if (!roleParsed.success) return null;

  let legalEntityId: LegalEntityId | null = null;
  if (entityRaw !== undefined && entityRaw !== '') {
    const entityParsed = LegalEntityIdSchema.safeParse(entityRaw);
    if (!entityParsed.success) return null;
    legalEntityId = entityParsed.data;
  }
  return { id, role: roleParsed.data, legalEntityId };
}

function bearerToken(request: FastifyRequest): string | null {
  const raw = request.headers.authorization;
  if (typeof raw !== 'string') return null;
  const match = /^Bearer\s+(.+)$/i.exec(raw.trim());
  return match?.[1] ?? null;
}

/** 合規防呆設計／風險提醒：優先驗證簽章 Token；只有在測試模式才退回 header。 */
export function resolveActor(request: FastifyRequest, auth: AuthConfig | null): Actor | null {
  if (!auth) return getActorFromHeaders(request.headers as Record<string, unknown>);
  const token = bearerToken(request);
  if (!token) {
    return auth.allowHeaderAuth ? getActorFromHeaders(request.headers as Record<string, unknown>) : null;
  }
  const payload = verifySessionToken(token, auth.secret);
  if (!payload) return null;
  return {
    id: payload.sub,
    role: payload.role,
    legalEntityId: payload.legalEntityScope[0] ?? null
  };
}

/** 合規防呆設計／風險提醒：老闆與唯讀稽核角色永遠不得寫入。 */
export function isReadOnlyRole(role: Role): boolean {
  return role === 'platform_owner' || role === 'auditor_readonly' || role === 'executive_readonly';
}

/** 合規防呆設計／風險提醒：security_admin 為書面授權的最高行政角色，可跨法人；其餘僅能寫自己法人。 */
export function canWriteEntity(actor: Actor, legalEntityId: string): boolean {
  if (actor.role === 'security_admin') return true;
  return actor.legalEntityId === legalEntityId;
}

function deny(reply: FastifyReply, status: number, code: string, message: string): void {
  reply.code(status).send({ ok: false, error: { code, message } });
}

/**
 * requireRole(...roles) hook。
 * 合規防呆設計／風險提醒：先擋寫入唯讀角色，再檢查角色白名單；順序不可調換，
 * 否則老闆寫入會被誤報成一般 FORBIDDEN，審計無法區分。
 */
export function requireRole(auth: AuthConfig | null, ...allowed: Role[]) {
  return async function requireRoleHook(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const actor = resolveActor(request, auth);
    if (!actor) {
      deny(reply, 401, 'UNAUTHORIZED', '缺少或無效的登入憑證（請先登入）');
      return;
    }
    request.actor = actor;

    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method) && isReadOnlyRole(actor.role)) {
      const code = actor.role === 'platform_owner' ? 'READ_ONLY_OWNER' : 'READ_ONLY_ROLE';
      deny(reply, 403, code, '合規防呆設計／風險提醒：此角色僅供唯讀，寫入须由授權代理人執行');
      return;
    }

    if (allowed.length > 0 && !allowed.includes(actor.role)) {
      deny(reply, 403, 'FORBIDDEN', '角色不在允許清單');
    }
  };
}

/** 合規防呆設計／風險提醒：一般使用者只能讀自己法人；老闆 / 稽核 / security_admin 可跨法人讀。 */
export function canReadEntity(actor: Actor, legalEntityId: string): boolean {
  if (actor.role === 'platform_owner' ||
      actor.role === 'auditor_readonly' ||
      actor.role === 'executive_readonly' ||
      actor.role === 'security_admin') return true;
  return actor.legalEntityId === legalEntityId;
}
