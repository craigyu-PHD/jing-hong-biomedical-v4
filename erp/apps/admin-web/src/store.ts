/**
 * 管理後台狀態：React Context + localStorage 合成資料 fallback
 * 合規防呆設計／風險提醒：老闆（platform_owner／executive_readonly）在 Store 層禁止任何寫入，
 * 不是只隱藏按鈕。全部資料為 SYNTHETIC_DEMO；PROTOTYPE_NOT_APPROVED，非正式上線。
 */
import {
  AuditEventSchema,
  CreateProductSchema,
  LegalEntityIdSchema,
  ProductSchema,
  RoleSchema,
  type AuditEvent,
  type CreateProductInput,
  type LegalEntityId,
  type Product,
  type Role
} from '@anubis/contracts';
import { z } from 'zod';
import {
  createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode
} from 'react';
import { api, isApiError, setRequestLegalEntityId } from './api/client';

export type Density = 'comfortable' | 'standard' | 'compact';
export type Theme = 'light' | 'dark';
export type ApiMode = 'fallback' | 'api';

type Prefs = {
  role: Role;
  legalEntityId: LegalEntityId;
  density: Density;
  font: number;
  theme: Theme;
};

const STORAGE_KEY = 'anubis.admin-web.demo.v1';
const FONT_OPTIONS = [90, 100, 110, 125, 150, 175, 200] as const;

export const DEFAULT_PREFS: Prefs = {
  role: 'administration',
  legalEntityId: 'LE-01',
  density: 'standard',
  font: 100,
  theme: 'light'
};

/** 合成商品種子：沿用舊原型六筆資料，金額改為契約要求的整數分。 */
export const SEED_PRODUCTS: Product[] = [
  { sku: 'DEMO-H001', name: '牛樟椴木子實體膠囊（示意）', line: 'human', form: 'capsule', priceCents: 128000, stock: 42, batch: 'DEMO2611A', expiry: '2028-11-30', status: 'draft' },
  { sku: 'DEMO-H002', name: '靈芝萃取粉末（示意）', line: 'human', form: 'powder', priceCents: 98000, stock: 30, batch: 'DEMO2611B', expiry: '2028-10-31', status: 'draft' },
  { sku: 'DEMO-H003', name: '綜合維生素錠（示意）', line: 'human', form: 'tablet', priceCents: 76000, stock: 18, batch: 'DEMO2611C', expiry: '2027-12-31', status: 'draft' },
  { sku: 'DEMO-P001', name: 'ANUBIS 寵物關節保健（示意）', line: 'pet', form: 'capsule', priceCents: 148000, stock: 25, batch: 'DEMO2611P', expiry: '2028-09-30', status: 'draft' },
  { sku: 'DEMO-P002', name: 'ANUBIS 寵物腸胃益生菌（示意）', line: 'pet', form: 'powder', priceCents: 118000, stock: 12, batch: 'DEMO2611Q', expiry: '2027-08-31', status: 'draft' },
  { sku: 'DEMO-P003', name: 'ANUBIS 寵物皮毛護理（示意）', line: 'pet', form: 'tablet', priceCents: 88000, stock: 8, batch: 'DEMO2611R', expiry: '2027-06-30', status: 'draft' }
].map((row, index) => {
  const at = new Date().toISOString();
  return ProductSchema.parse({
    ...row,
    id: `P${String(index + 1).padStart(3, '0')}`,
    legalEntityId: DEFAULT_PREFS.legalEntityId,
    source: 'SYNTHETIC_DEMO',
    createdAt: at,
    updatedAt: at
  });
});

/** D-008：唯讀角色一律不可寫入（Store 層強制）。 */
export function isReadOnlyRole(role: Role): boolean {
  return role !== 'administration';
}

function readStoredState(): { products: Product[]; audit: AuditEvent[]; prefs: Prefs } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const obj = parsed as Record<string, unknown>;

    const products = z.array(ProductSchema).safeParse(obj.products);
    const audit = z.array(AuditEventSchema).safeParse(obj.audit);
    const rawPrefs = (obj.prefs && typeof obj.prefs === 'object') ? obj.prefs as Record<string, unknown> : {};
    const role = RoleSchema.safeParse(rawPrefs.role);
    const legalEntityId = LegalEntityIdSchema.safeParse(rawPrefs.legalEntityId);
    const density = rawPrefs.density;
    const font = rawPrefs.font;
    const theme = rawPrefs.theme;

    return {
      products: products.success ? products.data : SEED_PRODUCTS,
      audit: audit.success ? audit.data : [],
      prefs: {
        role: role.success ? role.data : DEFAULT_PREFS.role,
        legalEntityId: legalEntityId.success ? legalEntityId.data : DEFAULT_PREFS.legalEntityId,
        density: density === 'comfortable' || density === 'compact' ? density : DEFAULT_PREFS.density,
        font: typeof font === 'number' && FONT_OPTIONS.includes(font as typeof FONT_OPTIONS[number]) ? font : DEFAULT_PREFS.font,
        theme: theme === 'dark' ? 'dark' : 'light'
      }
    };
  } catch {
    // localStorage 不可用或內容損毀：靜默回到合成種子，避免白畫面。
    return null;
  }
}

function newAuditEvent(
  action: string, targetType: string, targetId: string,
  role: Role, legalEntityId: LegalEntityId, before: unknown, after: unknown,
  actorId?: string
): AuditEvent {
  const suffix = typeof globalThis.crypto?.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return AuditEventSchema.parse({
    id: `AUD-${suffix}`,
    at: new Date().toISOString(),
    actorId: actorId ?? (isReadOnlyRole(role) ? 'OWNER_READONLY' : 'ADMIN_DEMO'),
    actorRole: role,
    legalEntityId,
    action,
    targetType,
    targetId,
    before,
    after,
    requestId: `REQ-${suffix}`
  });
}

type StoreValue = {
  currentRole: Role;
  legalEntityId: LegalEntityId;
  products: Product[];
  audit: AuditEvent[];
  prefs: Prefs;
  apiMode: ApiMode;
  syncError: string;
  readOnly: boolean;
  setRole: (role: Role) => void;
  setLegalEntityId: (id: LegalEntityId) => void;
  setDensity: (density: Density) => void;
  setFont: (font: number) => void;
  setTheme: (theme: Theme) => void;
  addProduct: (input: CreateProductInput) => Product;
  updateProduct: (id: string, patch: Partial<CreateProductInput>) => Product;
  removeProduct: (id: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({
  children, serverReadOnly = false, serverRole, serverActorId
}: {
  children: ReactNode;
  /** 合規防呆設計／風險提醒：寫入權限以登入 token 為準，不由前端下拉決定（D-013）。 */
  serverReadOnly?: boolean;
  serverRole?: Role;
  serverActorId?: string;
}) {
  const initial = useMemo(() => readStoredState(), []);
  const [products, setProducts] = useState<Product[]>(initial?.products ?? SEED_PRODUCTS);
  const [audit, setAudit] = useState<AuditEvent[]>(initial?.audit ?? []);
  const [prefs, setPrefs] = useState<Prefs>(initial?.prefs ?? DEFAULT_PREFS);
  const [apiMode, setApiMode] = useState<ApiMode>('fallback');
  const [syncError, setSyncError] = useState('');
  const productsRef = useRef(products);
  productsRef.current = products;

  const readOnly = serverReadOnly;

  useEffect(() => {
    document.body.dataset.density = prefs.density;
    document.body.dataset.font = String(prefs.font);
    document.body.dataset.theme = prefs.theme;
  }, [prefs.density, prefs.font, prefs.theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ products, audit, prefs }));
    } catch {
      // 隱私模式或配額不足：仍可在本記憶體操作，不中斷畫面。
    }
  }, [products, audit, prefs]);

  // API 未完成前：讀取失敗就留在 localStorage／記憶體合成資料，绝不白畫面。
  useEffect(() => {
    setRequestLegalEntityId(prefs.legalEntityId);
    let cancelled = false;
    api.listProducts()
      .then((list) => {
        if (!cancelled) {
          setProducts(list);
          setApiMode('api');
          setSyncError('');
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setApiMode('fallback');
        setSyncError(isApiError(error) ? error.message : 'API 不可用，已使用本機合成資料');
      });
    return () => { cancelled = true; };
  }, [prefs.legalEntityId]);

  const appendAudit = useCallback((
    action: string, targetType: string, targetId: string, before: unknown, after: unknown
  ) => {
    setAudit((prev) => [newAuditEvent(action, targetType, targetId, serverRole ?? prefs.role, prefs.legalEntityId, before, after, serverActorId), ...prev].slice(0, 30));
  }, [prefs.role, prefs.legalEntityId, serverRole, serverActorId]);

  const assertWritable = useCallback(() => {
    if (readOnly) {
      throw new Error('READ_ONLY_OWNER：此帳號唯讀，寫入已在 Store 層拒絕（D-008）');
    }
  }, [readOnly]);

  const attemptWrite = useCallback((work: () => Promise<unknown>) => {
    void work().catch((error: unknown) => {
      setSyncError(isApiError(error) ? `API 寫入失敗，已保留本機合成資料：${error.message}` : 'API 寫入失敗，已保留本機合成資料');
    });
  }, []);

  const addProduct = useCallback((input: CreateProductInput): Product => {
    assertWritable();
    const parsed = CreateProductSchema.parse({ ...input, legalEntityId: prefs.legalEntityId });
    if (productsRef.current.some((item) => item.sku === parsed.sku && item.legalEntityId === parsed.legalEntityId)) {
      throw new Error('SKU 重複：同一法人已有相同 SKU');
    }
    const at = new Date().toISOString();
    const item = ProductSchema.parse({
      ...parsed,
      id: `P-${at.replace(/\D/g, '').slice(0, 12)}`,
      source: 'SYNTHETIC_DEMO',
      createdAt: at,
      updatedAt: at
    });
    setProducts((prev) => [...prev, item]);
    appendAudit('create_product', 'product', item.id, undefined, item);
    attemptWrite(() => api.createProduct(parsed));
    return item;
  }, [assertWritable, prefs.legalEntityId, appendAudit, attemptWrite]);

  const updateProduct = useCallback((id: string, patch: Partial<CreateProductInput>): Product => {
    assertWritable();
    const old = productsRef.current.find((item) => item.id === id);
    if (!old) throw new Error(`NOT_FOUND：找不到商品 ${id}`);
    const merged = ProductSchema.parse({ ...old, ...patch, id, updatedAt: new Date().toISOString() });
    if (productsRef.current.some((item) => item.id !== id && item.sku === merged.sku && item.legalEntityId === merged.legalEntityId)) {
      throw new Error('SKU 重複：同一法人已有相同 SKU');
    }
    setProducts((prev) => prev.map((item) => item.id === id ? merged : item));
    appendAudit('update_product', 'product', id, old, merged);
    attemptWrite(() => api.updateProduct(id, patch));
    return merged;
  }, [assertWritable, appendAudit, attemptWrite]);

  const removeProduct = useCallback((id: string): void => {
    assertWritable();
    const old = productsRef.current.find((item) => item.id === id);
    if (!old) throw new Error(`NOT_FOUND：找不到商品 ${id}`);
    setProducts((prev) => prev.filter((item) => item.id !== id));
    appendAudit('delete_product', 'product', id, old, undefined);
    attemptWrite(() => api.removeProduct(id));
  }, [assertWritable, appendAudit, attemptWrite]);

  const value: StoreValue = {
    currentRole: prefs.role,
    legalEntityId: prefs.legalEntityId,
    products,
    audit,
    prefs,
    apiMode,
    syncError,
    readOnly,
    setRole: (role) => { setPrefs((prev) => ({ ...prev, role })); },
    setLegalEntityId: (id) => { setPrefs((prev) => ({ ...prev, legalEntityId: id })); },
    setDensity: (density) => { setPrefs((prev) => ({ ...prev, density })); },
    setFont: (font) => { setPrefs((prev) => ({ ...prev, font })); },
    setTheme: (theme) => { setPrefs((prev) => ({ ...prev, theme })); },
    addProduct,
    updateProduct,
    removeProduct
  };

  // 本檔刻意維持 .ts：用 createElement 而不是 JSX。
  return createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore 必須在 StoreProvider 內使用');
  return value;
}
