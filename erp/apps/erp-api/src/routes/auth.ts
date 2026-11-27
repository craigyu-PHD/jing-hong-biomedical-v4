/**
 * 登入端點：POST /api/auth/login、GET /api/auth/me
 * 合規防呆設計／風險提醒：
 * 1. 帳號密碼由本機 .env 提供，repo 只有 .env.example；密碼絕不寫死在程式碼。
 * 2. 登入成功回 HMAC 簽章 token，伺服端據 token 判定角色與法人，前端不得自報角色。
 * 3. 帳號不存在與密碼錯誤回同一錯誤，避免帳號列舉。
 * 4. SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED，非正式上線，不承載真實憑證。
 */
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createSessionToken, safeTextEqual, type AuthConfig } from '../auth.js';

const LoginSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128)
});

export interface AuthRouteOptions {
  auth: AuthConfig;
}

export async function registerAuthRoutes(
  app: FastifyInstance,
  options: AuthRouteOptions
): Promise<void> {
  app.post('/auth/login', async (request, reply) => {
    const parsed = LoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        ok: false,
        error: { code: 'INVALID_BODY', message: '請輸入帳號與密碼' }
      });
    }

    const { username, password } = parsed.data;
    const user = options.auth.users[username];
    // 合規防呆設計／風險提醒：不論帳號是否存在都做一次比較，回應一致。
    const passwordOk = user ? safeTextEqual(user.password, password) : safeTextEqual(password, password);
    if (!user || !passwordOk) {
      return reply.code(401).send({
        ok: false,
        error: { code: 'INVALID_CREDENTIALS', message: '帳號或密碼不正確' }
      });
    }

    const now = Date.now();
    const payload = {
      sub: username,
      role: user.actor.role,
      legalEntityScope: user.legalEntityScope,
      iat: now,
      exp: now + 8 * 60 * 60 * 1000
    };
    return {
      ok: true,
      notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED',
      token: createSessionToken(payload, options.auth.secret),
      actor: user.actor,
      legalEntityScope: user.legalEntityScope,
      expiresAt: new Date(payload.exp).toISOString()
    };
  });
}
