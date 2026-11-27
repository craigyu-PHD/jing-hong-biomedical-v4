/**
 * API 客戶端：合規防呆設計／風險提醒
 * - 所有請求帶 Bearer Token；角色／法人由後端 token 判定，前端自報無效。
 * - 請求帶 x-legal-entity-id 做三法人讀取隔離，不跨法人推論。
 * - 回应在 trust boundary 用共用契約（Zod）驗證；驗證失敗視為 API 不可用，由 store 留在本機合成資料。
 * - 全數合成資料 SYNTHETIC_DEMO，PROTOTYPE_NOT_APPROVED，非正式上線。
 */
import {
  CreateProductSchema,
  LegalEntityIdSchema,
  ProductSchema,
  RoleSchema,
  type CreateProductInput,
  type LegalEntityId,
  type Product
} from '@anubis/contracts';
import { z } from 'zod';
import { clearSession, readSession } from '../auth/session';

export const API_BASE = '/api';
export const UNAUTHORIZED_EVENT = 'anubis:unauthorized';

const LoginResponseSchema = z.object({
  ok: z.literal(true),
  token: z.string().min(10),
  actor: z.object({ id: z.string().min(1), role: RoleSchema }),
  legalEntityScope: z.array(LegalEntityIdSchema).min(1),
  expiresAt: z.string().optional()
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/** 合規防呆設計／風險提醒：後端回 { ok, data } 封裝，前端解封裝後再交給 store。 */
const ProductListResponseSchema = z.object({
  ok: z.literal(true),
  data: z.array(ProductSchema),
  total: z.number().int().nonnegative().optional()
});
const ProductResponseSchema = z.object({ ok: z.literal(true), data: ProductSchema });

/** 合規防呆設計／風險提醒：模組載入時承接既有工作階段；沒有 token 就不打 API。 */
let authToken: string | null = readSession()?.token ?? null;

/** 由 TopBar 的法人選擇器寫入；預設為空，避免誤用單一法人身分。 */
let requestLegalEntityId: LegalEntityId | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function setRequestLegalEntityId(id: LegalEntityId): void {
  requestLegalEntityId = id;
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly body: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, init: RequestInit, schema: z.ZodType<T>): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('x-legal-entity-id', requestLegalEntityId ?? '');
  if (authToken) headers.set('Authorization', `Bearer ${authToken}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch (cause) {
    throw new ApiError('無法連線至 API（將使用本機合成資料）', 0, cause);
  }

  if (response.status === 401 && authToken) {
    // 合規防呆設計／風險提醒：token 失效就登出，不用舊憑證繼續讀寫。
    clearSession();
    authToken = null;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw new ApiError(`API 錯誤 ${response.status}`, response.status, body);
  }

  const raw: unknown = await response.json().catch(() => {
    throw new ApiError('API 回應不是有效 JSON', response.status, null);
  });
  try {
    return schema.parse(raw);
  } catch (cause) {
    throw new ApiError('API 回應不符合共用契約', response.status, cause);
  }
}

export const api = {
  /** 合規防呆：登入不走 apiFetch，401 時只回錯給表單，不觸發自動登出事件。 */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    let response: Response;
    try {
      response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
    } catch (cause) {
      throw new ApiError('無法連線至後端登入服務（請先啟動 erp-api）', 0, cause);
    }
    const raw: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError('登入失敗：帳號或密碼不正確', response.status, raw);
    }
    const parsed = LoginResponseSchema.safeParse(raw);
    if (!parsed.success) throw new ApiError('登入回應不符合共用契約', response.status, raw);
    return parsed.data;
  },
  listProducts: async () => (await apiFetch('/products', {}, ProductListResponseSchema)).data,
  createProduct: async (input: CreateProductInput) =>
    (await apiFetch('/products', { method: 'POST', body: JSON.stringify(CreateProductSchema.parse(input)) }, ProductResponseSchema)).data,
  updateProduct: async (id: string, patch: Partial<CreateProductInput>) =>
    (await apiFetch(`/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) }, ProductResponseSchema)).data,
  removeProduct: (id: string) =>
    apiFetch(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }, z.unknown())
};

/** 寫入失敗時只回報，不清空畫面；由 store 決定是否保留本機合成資料。 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
