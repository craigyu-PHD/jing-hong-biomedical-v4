/**
 * /products CRUD
 * 合規防呆設計／風險提醒：
 * 1. 所有型別直接來自 @anubis/contracts，不在本檔重複定義。
 * 2. legalEntityId 以 actor 為準：一般寫入者不能跨法人寫入；前端傳錯就 403。
 * 3. 所有寫入寫入 audit_events（此原型為 in-memory append-only log）。
 * 4. Idempotency-Key 防止重試造成重複建立；相同 actor + key 回完全相同的 status/body。
 */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateProductSchema,
  ProductSchema,
  PageSchema,
  type AuditEvent,
  type CreateProductInput,
  type Product
} from '@anubis/contracts';
import { canReadEntity, canWriteEntity, requireRole, type AuthConfig } from '../auth.js';

export interface ProductStore {
  list(legalEntityId?: string): Product[];
  get(id: string): Product | undefined;
  findBySku(legalEntityId: string, sku: string, excludeId?: string): Product | undefined;
  create(input: CreateProductInput, id: string, now: string): Product;
  update(id: string, patch: Partial<CreateProductInput>, now: string): Product | undefined;
  remove(id: string): Product | undefined;
}

/** 合規防呆設計／風險提醒：原型用 in-memory store，測試不需真 DB；重新啟動資料即消失。 */
export class MemoryProductStore implements ProductStore {
  private readonly rows = new Map<string, Product>();

  list(legalEntityId?: string): Product[] {
    return [...this.rows.values()]
      .filter(p => legalEntityId === undefined || p.legalEntityId === legalEntityId)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  get(id: string): Product | undefined { return this.rows.get(id); }

  findBySku(legalEntityId: string, sku: string, excludeId?: string): Product | undefined {
    return [...this.rows.values()].find(
      p => p.legalEntityId === legalEntityId && p.sku === sku && p.id !== excludeId
    );
  }

  create(input: CreateProductInput, id: string, now: string): Product {
    const product = ProductSchema.parse({
      ...input,
      id,
      source: 'SYNTHETIC_DEMO',
      createdAt: now,
      updatedAt: now
    });
    this.rows.set(id, product);
    return product;
  }

  update(id: string, patch: Partial<CreateProductInput>, now: string): Product | undefined {
    const current = this.rows.get(id);
    if (!current) return undefined;
    const next = ProductSchema.parse({ ...current, ...patch, id: current.id, updatedAt: now });
    this.rows.set(id, next);
    return next;
  }

  remove(id: string): Product | undefined {
    const current = this.rows.get(id);
    if (!current) return undefined;
    this.rows.delete(id);
    return current;
  }
}

export interface IdempotencyCache {
  get(key: string): { status: number; body: unknown } | undefined;
  set(key: string, value: { status: number; body: unknown }): void;
}

/** 合規防呆設計／風險提醒：行程內快取，重啟即失效；正式環境須換成持久儲存。 */
export class MemoryIdempotencyCache implements IdempotencyCache {
  private readonly entries = new Map<string, { status: number; body: unknown }>();
  get(key: string) { return this.entries.get(key); }
  set(key: string, value: { status: number; body: unknown }) { this.entries.set(key, value); }
}

export interface ProductRouteOptions {
  store: ProductStore;
  auditEvents: AuditEvent[];
  idempotency: IdempotencyCache;
  /** 合規防呆設計／風險提醒：null 只在 node --test inject 使用；正式啟動必傳登入設定。 */
  auth: AuthConfig | null;
}

let sequence = 0;
function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence.toString(36)}`;
}

function appendAudit(
  options: ProductRouteOptions,
  request: FastifyRequest,
  action: string,
  targetId: string,
  before: unknown,
  after: unknown
): void {
  const actor = request.actor;
  if (!actor) return; // 合規防呆設計／風險提醒：requireRole 已擋，這只是保險。
  options.auditEvents.push({
    id: nextId('AUD'),
    at: new Date().toISOString(),
    actorId: actor.id,
    actorRole: actor.role,
    legalEntityId: actor.legalEntityId,
    action,
    targetType: 'product',
    targetId,
    before,
    after,
    requestId: typeof request.headers['x-request-id'] === 'string'
      ? request.headers['x-request-id'] : undefined
  });
}

function idempotencyKey(request: FastifyRequest): string | undefined {
  const raw = request.headers['idempotency-key'];
  const actorId = request.actor?.id ?? 'anonymous';
  if (typeof raw !== 'string' || raw.length === 0) return undefined;
  return `${actorId}:${raw}`;
}

/** 合規防呆設計／風險提醒：冪等檢查必須在任何驗證／衝突檢查之前，否則重試會先撞到 DUPLICATE_SKU。 */
function cachedResponse(
  request: FastifyRequest,
  reply: FastifyReply,
  options: ProductRouteOptions
): boolean {
  const key = idempotencyKey(request);
  if (!key) return false;
  const cached = options.idempotency.get(key);
  if (!cached) return false;
  reply.code(cached.status).send(cached.body);
  return true;
}

async function withIdempotency(
  request: FastifyRequest,
  reply: FastifyReply,
  options: ProductRouteOptions,
  action: () => Promise<{ status: number; body: unknown }>
): Promise<void> {
  const result = await action();
  const key = idempotencyKey(request);
  if (key) options.idempotency.set(key, result);
  reply.code(result.status).send(result.body);
}

export async function registerProductRoutes(
  app: FastifyInstance,
  options: ProductRouteOptions
): Promise<void> {
  const readHook = requireRole(options.auth);
  const writeHook = requireRole(
    options.auth,
    'security_admin', 'access_admin', 'accounting', 'administration',
    'warehouse', 'sales', 'content_compliance'
  );

  // 合規防呆設計／風險提醒：列表一律分頁（PageSchema），並預設以 actor 的法人隔離。
  app.get('/products', { preHandler: readHook }, async request => {
    // 合規防呆設計／風險提醒：HTTP query 全是字串，先轉數字再交給 contracts 驗證，避免 falsely 回 400。
    const rawQuery = (request.query ?? {}) as Record<string, unknown>;
    const query = PageSchema.safeParse({
      page: rawQuery['page'] === undefined ? undefined : Number(rawQuery['page']),
      pageSize: rawQuery['pageSize'] === undefined ? undefined : Number(rawQuery['pageSize'])
    });
    if (!query.success) {
      return { ok: false, error: { code: 'INVALID_QUERY', message: '分頁參數無效' } };
    }
    const actor = request.actor!;
    const requested = rawQuery['legalEntityId'];
    let entityFilter: string | undefined;
    if (typeof requested === 'string' && requested !== '') {
      if (!canReadEntity(actor, requested)) {
        return { ok: false, error: { code: 'ENTITY_FORBIDDEN', message: '不得讀取其他法人資料' } };
      }
      entityFilter = requested;
    } else if (actor.legalEntityId) {
      entityFilter = actor.legalEntityId;
    }
    const all = options.store.list(entityFilter);
    const { page, pageSize } = query.data;
    const start = (page - 1) * pageSize;
    return {
      ok: true,
      notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED',
      data: all.slice(start, start + pageSize),
      page,
      pageSize,
      total: all.length
    };
  });

  app.get<{ Params: { id: string } }>('/products/:id', { preHandler: readHook }, async (request, reply) => {
    const product = options.store.get(request.params.id);
    const actor = request.actor!;
    if (!product || !canReadEntity(actor, product.legalEntityId)) {
      return reply.code(404).send({ ok: false, error: { code: 'NOT_FOUND', message: '商品不存在或無權限' } });
    }
    return { ok: true, data: product };
  });

  app.post('/products', { preHandler: writeHook }, async (request, reply) => {
    if (cachedResponse(request, reply, options)) return;
    const parsed = CreateProductSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ ok: false, error: { code: 'INVALID_BODY', message: '欄位驗證失敗', issues: parsed.error.issues } });
    }
    const actor = request.actor!;
    if (!canWriteEntity(actor, parsed.data.legalEntityId)) {
      return reply.code(403).send({ ok: false, error: { code: 'ENTITY_MISMATCH', message: '不得跨法人寫入' } });
    }
    if (options.store.findBySku(parsed.data.legalEntityId, parsed.data.sku)) {
      return reply.code(409).send({ ok: false, error: { code: 'DUPLICATE_SKU', message: '同法人下 SKU 已存在' } });
    }
    await withIdempotency(request, reply, options, async () => {
      const id = nextId('PRD');
      const now = new Date().toISOString();
      const created = options.store.create(parsed.data, id, now);
      appendAudit(options, request, 'product.create', id, undefined, created);
      return { status: 201, body: { ok: true, notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED', data: created } };
    });
  });

  app.patch<{ Params: { id: string } }>('/products/:id', { preHandler: writeHook }, async (request, reply) => {
    if (cachedResponse(request, reply, options)) return;
    const patch = CreateProductSchema.partial().safeParse(request.body);
    if (!patch.success) {
      return reply.code(400).send({ ok: false, error: { code: 'INVALID_BODY', message: '欄位驗證失敗' } });
    }
    const actor = request.actor!;
    const current = options.store.get(request.params.id);
    if (!current) {
      return reply.code(404).send({ ok: false, error: { code: 'NOT_FOUND', message: '商品不存在' } });
    }
    if (!canWriteEntity(actor, current.legalEntityId)) {
      return reply.code(403).send({ ok: false, error: { code: 'ENTITY_MISMATCH', message: '不得跨法人寫入' } });
    }
    const nextSku = patch.data.sku ?? current.sku;
    if (options.store.findBySku(current.legalEntityId, nextSku, current.id)) {
      return reply.code(409).send({ ok: false, error: { code: 'DUPLICATE_SKU', message: '同法人下 SKU 已存在' } });
    }
    await withIdempotency(request, reply, options, async () => {
      const now = new Date().toISOString();
      const updated = options.store.update(current.id, patch.data, now);
      appendAudit(options, request, 'product.update', current.id, current, updated);
      return { status: 200, body: { ok: true, data: updated } };
    });
  });

  app.delete<{ Params: { id: string } }>('/products/:id', { preHandler: writeHook }, async (request, reply) => {
    if (cachedResponse(request, reply, options)) return;
    const actor = request.actor!;
    const current = options.store.get(request.params.id);
    if (!current) {
      return reply.code(404).send({ ok: false, error: { code: 'NOT_FOUND', message: '商品不存在' } });
    }
    if (!canWriteEntity(actor, current.legalEntityId)) {
      return reply.code(403).send({ ok: false, error: { code: 'ENTITY_MISMATCH', message: '不得跨法人寫入' } });
    }
    await withIdempotency(request, reply, options, async () => {
      const removed = options.store.remove(current.id);
      appendAudit(options, request, 'product.delete', current.id, current, undefined);
      return { status: 200, body: { ok: true, data: removed } };
    });
  });
}
