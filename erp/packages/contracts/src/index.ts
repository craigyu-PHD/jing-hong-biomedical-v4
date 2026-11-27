/**
 * @anubis/contracts｜共用契約（Zod schema + 型別）
 * 合規防呆設計／風險提醒：所有 empresa 識別、金額、單據皆需 legal_entity_id；
 * 金額一律用整數分或 NUMERIC 字串，禁止 float；全數合成資料，PROTOTYPE_NOT_APPROVED。
 */
import { z } from 'zod';

/** 法人 ID：三法人先隔離，不得因關係推論共用 */
export const LegalEntityIdSchema = z.enum(['LE-01', 'LE-02', 'LE-03']);
export type LegalEntityId = z.infer<typeof LegalEntityIdSchema>;

/** 角色：D-008 老闆 = platform_owner（委派＋全域唯讀，不含業務寫入） */
export const RoleSchema = z.enum([
  'platform_owner', 'security_admin', 'access_admin', 'accounting',
  'administration', 'warehouse', 'sales', 'executive_readonly',
  'content_compliance', 'auditor_readonly'
]);
export type Role = z.infer<typeof RoleSchema>;

/** 金額：整數分（避免 float）；API 輸入用字串或整數 */
export const MoneySchema = z.union([
  z.string().regex(/^-?\d+$/),
  z.number().int()
]);
export type Money = z.infer<typeof MoneySchema>;

/** 商品（合成資料） */
export const ProductSchema = z.object({
  id: z.string().min(1),
  legalEntityId: LegalEntityIdSchema,
  sku: z.string().min(1),
  name: z.string().min(1),
  line: z.enum(['human', 'pet']),
  form: z.enum(['capsule', 'powder', 'tablet']),
  priceCents: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  batch: z.string(),
  expiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['draft', 'active', 'archived']),
  source: z.literal('SYNTHETIC_DEMO'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = ProductSchema.omit({
  id: true, source: true, createdAt: true, updatedAt: true
});
export type CreateProductInput = z.infer<typeof CreateProductSchema>;

/** 客戶／院所（合成資料，需法人與業務歸屬） */
export const CustomerSchema = z.object({
  id: z.string().min(1),
  legalEntityId: LegalEntityIdSchema,
  name: z.string().min(1),
  alias: z.array(z.string()).default([]),
  ownerSalesId: z.string().nullable().default(null),
  city: z.string().default(''),
  specialRule: z.boolean().default(false),
  source: z.literal('SYNTHETIC_DEMO')
});
export type Customer = z.infer<typeof CustomerSchema>;

/** 三類單據：sale 銷貨／replacement 補貨（紙面0元、內部扣權益）／exchange 換貨 */
export const DocumentTypeSchema = z.enum(['sale', 'replacement', 'exchange']);
export type DocumentType = z.infer<typeof DocumentTypeSchema>;

export const OrderLineSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  qty: z.number().int().positive(),
  unitPriceCents: z.number().int().nonnegative(),
  amountCents: z.number().int().nonnegative()
});
export type OrderLine = z.infer<typeof OrderLineSchema>;

export const OrderSchema = z.object({
  id: z.string().min(1),
  legalEntityId: LegalEntityIdSchema,
  customerId: z.string().min(1),
  documentType: DocumentTypeSchema,
  lines: z.array(OrderLineSchema).min(1),
  totalCents: z.number().int().nonnegative(),
  /** 補貨紙面金額必為 0；內部權益扣抵另記 */
  internalEquityCents: z.number().int().nonnegative().default(0),
  status: z.enum(['draft', 'pending_approval', 'approved', 'printed', 'shipped']),
  createdBy: z.string().min(1),
  createdAt: z.string().datetime(),
  source: z.literal('SYNTHETIC_DEMO')
});
export type Order = z.infer<typeof OrderSchema>;

/** 合約池：amount_pool／item_pool；提領、分期尾差、展期、轉讓 */
export const ContractSchema = z.object({
  id: z.string().min(1),
  legalEntityId: LegalEntityIdSchema,
  customerId: z.string().min(1),
  kind: z.enum(['amount_pool', 'item_pool']),
  totalCents: z.number().int().nonnegative(),
  drawnCents: z.number().int().nonnegative(),
  itemQuota: z.record(z.string(), z.number().int().nonnegative()).default({}),
  validFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  validTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['active', 'expired', 'transferred']),
  source: z.literal('SYNTHETIC_DEMO')
});
export type Contract = z.infer<typeof ContractSchema>;

/** 請款／收款：25 日切帳 [前月26日, 當月26日) Asia/Taipei */
export const ReceivableSchema = z.object({
  id: z.string().min(1),
  legalEntityId: LegalEntityIdSchema,
  customerId: z.string().min(1),
  period: z.string().regex(/^\d{4}-\d{2}$/),
  billedCents: z.number().int().nonnegative(),
  collectedCents: z.number().int().nonnegative(),
  overpayCents: z.number().int().nonnegative().default(0),
  discountCents: z.number().int().nonnegative().default(0),
  status: z.enum(['open', 'partial', 'settled', 'overpaid']),
  source: z.literal('SYNTHETIC_DEMO')
});
export type Receivable = z.infer<typeof ReceivableSchema>;

/** 稽核事件：不可竄改 */
export const AuditEventSchema = z.object({
  id: z.string().min(1),
  at: z.string().datetime(),
  actorId: z.string().min(1),
  actorRole: RoleSchema,
  legalEntityId: LegalEntityIdSchema.nullable(),
  action: z.string().min(1),
  targetType: z.string().min(1),
  targetId: z.string(),
  before: z.unknown().optional(),
  after: z.unknown().optional(),
  requestId: z.string().optional()
});
export type AuditEvent = z.infer<typeof AuditEventSchema>;

/** 授權委派：老闆上限、不可自授、不可自審自核；代理人書面＋MFA */
export const GrantSchema = z.object({
  id: z.string().min(1),
  grantorId: z.string().min(1),
  granteeId: z.string().min(1),
  role: RoleSchema,
  ceiling: z.array(z.string()),
  legalEntityScope: z.array(LegalEntityIdSchema),
  delegated: z.boolean().default(false),
  approvedBy: z.string().nullable().default(null),
  effectiveFrom: z.string().datetime(),
  effectiveTo: z.string().datetime().nullable().default(null),
  source: z.literal('SYNTHETIC_DEMO')
});
export type Grant = z.infer<typeof GrantSchema>;

/** AI Tool 白名單：AI 不直接寫帳、不接 SQL */
export const AiToolNameSchema = z.enum([
  'query_sales_by_period', 'compute_average_monthly_sales',
  'generate_receivable_report', 'preview_adjustment',
  'list_customers', 'list_products', 'query_contract_balance',
  'query_inventory', 'query_ar_aging', 'draft_order'
]);
export type AiToolName = z.infer<typeof AiToolNameSchema>;

export const AiToolCallSchema = z.object({
  tool: AiToolNameSchema,
  args: z.record(z.string(), z.unknown()),
  requestId: z.string().min(1),
  actorId: z.string().min(1)
});
export type AiToolCall = z.infer<typeof AiToolCallSchema>;

/** 高風險改帳：只產生差異預覽＋核准單，不直接寫 */
export const AdjustmentPreviewSchema = z.object({
  id: z.string().min(1),
  requestId: z.string().min(1),
  targetType: z.string().min(1),
  targetId: z.string().min(1),
  before: z.record(z.string(), z.unknown()),
  after: z.record(z.string(), z.unknown()),
  status: z.enum(['awaiting_approval', 'approved', 'rejected', 'applied']),
  requiredApprovers: z.number().int().min(2),
  source: z.literal('SYNTHETIC_DEMO')
});
export type AdjustmentPreview = z.infer<typeof AdjustmentPreviewSchema>;

/** 分頁／回應 */
export const PageSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(200).default(20)
});
export type Page = z.infer<typeof PageSchema>;

export const OK = { ok: true as const, notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED' };
