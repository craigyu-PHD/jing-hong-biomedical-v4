/**
 * @anubis/erp-api｜Fastify 後端入口
 * 合規防呆設計／風險提醒：
 * 1. 全數 SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED，非已上線系統；不得承載真實個資或真實交易。
 * 2. 正式啟動一律要求 Bearer Token；角色與法人由 token 判定，前端自報角色無效。
 * 3. platform_owner 只能唯讀（403 READ_ONLY_OWNER）；所有寫入進 audit_events。
 * 4. 密碼只讀本機 .env（gitignored），repo 只有 .env.example；Idempotency-Key 防止重試重複寫入。
 */
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { pathToFileURL } from 'node:url';
import type { AuditEvent } from '@anubis/contracts';
import { healthCheck } from '@anubis/db';
import { registerAuthRoutes } from './routes/auth.js';
import type { AuthConfig, AuthUser } from './auth.js';
import {
  MemoryIdempotencyCache,
  MemoryProductStore,
  registerProductRoutes,
  type IdempotencyCache,
  type ProductRouteOptions,
  type ProductStore
} from './routes/products.js';

export interface BuildAppOptions {
  store?: ProductStore;
  auditEvents?: AuditEvent[];
  idempotency?: IdempotencyCache;
  /** 合規防呆設計／風險提醒：null 僅供 node --test inject；正式啟動由 start() 傳入。 */
  auth?: AuthConfig | null;
}

/** 合規防呆設計／風險提醒：極簡 .env 讀取器；不引入 dotenv 依賴，也不把值寫回任何檔案。 */
function readDotEnv(path: string): Record<string, string> {
  const result: Record<string, string> = {};
  try {
    const text = readFileSync(path, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const equal = trimmed.indexOf('=');
      if (equal <= 0) continue;
      const key = trimmed.slice(0, equal).trim();
      let value = trimmed.slice(equal + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      result[key] = value;
    }
  } catch {
    // 合規防呆設計／風險提醒：.env 不存在時仍啟動，但沒有任何可用帳號，登入一律 401。
  }
  return result;
}

/** 匯出供 node --test 以 inject 測試；不監聽 port。 */
export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true });

  const auth = options.auth ?? null;
  const authForRoutes: AuthConfig = auth ?? {
    secret: randomBytes(32).toString('hex'),
    users: {},
    allowHeaderAuth: false
  };

  const routeOptions: ProductRouteOptions = {
    store: options.store ?? new MemoryProductStore(),
    auditEvents: options.auditEvents ?? [],
    idempotency: options.idempotency ?? new MemoryIdempotencyCache(),
    auth
  };

  // 合規防呆設計／風險提醒：健康檢查不需授權；DB 未設定時如實回報 NOT_CONFIGURED，但不讓服務崩潰。
  app.get('/health', async () => {
    const db = await healthCheck();
    return {
      ok: true,
      status: 'UP',
      notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED',
      db: { ok: db.ok, status: db.status, detail: db.detail }
    };
  });

  await registerAuthRoutes(app, { auth: authForRoutes });
  await registerProductRoutes(app, routeOptions);
  return app;
}

async function start(): Promise<void> {
  // 合規防呆設計／風險提醒：src/index.ts 與 dist/index.js 皆往下一個階層讀 apps/erp-api/.env。
  const envPath = fileURLToPath(new URL('../.env', import.meta.url));
  const env = { ...readDotEnv(envPath), ...process.env };
  const users: Record<string, AuthUser> = {};

  const adminPassword = env.ANUBIS_ADMIN_PASSWORD;
  if (adminPassword) {
    const username = env.ANUBIS_ADMIN_USER ?? 'admin';
    users[username] = {
      password: adminPassword,
      actor: { id: username, role: 'security_admin', legalEntityId: 'LE-01' },
      legalEntityScope: ['LE-01', 'LE-02', 'LE-03']
    };
  }

  const ownerPassword = env.ANUBIS_OWNER_PASSWORD;
  if (ownerPassword) {
    const username = env.ANUBIS_OWNER_USER ?? 'owner';
    users[username] = {
      password: ownerPassword,
      actor: { id: username, role: 'platform_owner', legalEntityId: 'LE-01' },
      legalEntityScope: ['LE-01', 'LE-02', 'LE-03']
    };
  }

  if (Object.keys(users).length === 0) {
    console.warn('合規防呆設計／風險提醒：apps/erp-api/.env 未設定任何帳號，登入端點將一律拒絕。');
  }

  const auth: AuthConfig = {
    secret: env.ANUBIS_AUTH_SECRET || randomBytes(32).toString('hex'),
    users,
    allowHeaderAuth: false
  };
  const app = await buildApp({ auth });
  const port = Number(process.env.PORT ?? env.PORT ?? 3001);
  await app.listen({ host: '127.0.0.1', port });
}

const invokedDirectly = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;
if (invokedDirectly) {
  void start().catch(error => {
    console.error('合規防呆設計／風險提醒：API 啟動失敗，請檢查 PORT 與相依套件。', error);
    process.exitCode = 1;
  });
}
