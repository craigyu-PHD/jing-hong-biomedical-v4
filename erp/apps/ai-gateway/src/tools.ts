/**
 * @anubis/ai-gateway｜工具白名單、權限回呼與高風險防呆
 * 合規防呆設計／風險提醒：
 * 1) 只允許 @anubis/contracts 的 AiToolNameSchema 十項工具，其餘一律 TOOL_NOT_ALLOWED；
 * 2) 每項工具執行前都向呼叫端注入的 authorize() 回呼查核權限，預設拒絕；
 * 3) preview_adjustment 只回 AdjustmentPreview（awaiting_approval、requiredApprovers=2），
 *    本檔案不 import db、不產生 SQL、沒有任何寫入 sink；
 * 4) 高風險欄位（金額／品號／法人／日期）逐字回顯才算覆核完成；
 * 5) 工作階段依 sessionId / actorId / 法人範圍隔離；全部資料為 SYNTHETIC_DEMO。
 */
import {
  AdjustmentPreviewSchema,
  AiToolCallSchema,
  AiToolNameSchema,
  LegalEntityIdSchema,
  type AiToolName,
  type LegalEntityId
} from '@anubis/contracts';

export type { AiToolName } from '@anubis/contracts';

export interface AiSession {
  readonly sessionId: string;
  readonly actorId: string;
  readonly legalEntityIds: readonly LegalEntityId[];
  readonly roles: readonly string[];
}

export function createSession(input: {
  readonly sessionId: string;
  readonly actorId: string;
  readonly legalEntityIds: readonly LegalEntityId[];
  readonly roles?: readonly string[];
}): AiSession {
  return {
    sessionId: input.sessionId,
    actorId: input.actorId,
    legalEntityIds: input.legalEntityIds,
    roles: input.roles ?? []
  };
}

export type GatewayErrorCode =
  | 'TOOL_NOT_ALLOWED'
  | 'INVALID_CALL'
  | 'PERMISSION_DENIED'
  | 'SESSION_MISMATCH'
  | 'OUT_OF_SCOPE'
  | 'CONFIRMATION_REQUIRED'
  | 'TARGET_NOT_FOUND'
  | 'INVALID_ARGUMENT';

export type ToolResult =
  | {
      readonly ok: true;
      readonly tool: AiToolName;
      readonly requestId: string;
      readonly data: unknown;
      readonly notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED';
    }
  | {
      readonly ok: false;
      readonly code: GatewayErrorCode;
      readonly requestId: string;
      readonly message: string;
      readonly tool?: string;
      readonly requiredEchoes?: Readonly<Record<string, string>>;
    };

export class ToolError extends Error {
  constructor(
    readonly code: GatewayErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'ToolError';
  }
}

/** 十項白名單與所需權限代號；授權仍須由外部回呼實際查核 */
export const TOOL_PERMISSIONS: Readonly<Record<AiToolName, string>> = {
  query_sales_by_period: 'report.read',
  compute_average_monthly_sales: 'report.read',
  generate_receivable_report: 'report.export',
  preview_adjustment: 'ar.preview',
  list_customers: 'customer.read',
  list_products: 'product.read',
  query_contract_balance: 'contract.read',
  query_inventory: 'inventory.read',
  query_ar_aging: 'ar.read',
  draft_order: 'order.draft'
};

/** 會動到帳面或單據的工具，強制文字覆核 */
export const TEXT_REVIEW_TOOLS: ReadonlySet<AiToolName> = new Set<AiToolName>([
  'preview_adjustment',
  'draft_order'
]);

/** 高風險欄位：金額／品號／法人名／日期，逐字回顯 */
export const HIGH_RISK_FIELDS: readonly string[] = [
  'amount',
  'amountCents',
  'desiredValueCents',
  'billedCents',
  'collectedCents',
  'sku',
  'productId',
  'legalEntityId',
  'date',
  'period'
];

export type Args = Record<string, unknown>;

function isRecord(value: unknown): value is Args {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asInteger(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) ? value : undefined;
}

/** 從參數抽出需要逐字回顯的欄位值 */
export function highRiskEchoes(args: Args): Record<string, string> {
  const echoes: Record<string, string> = {};
  for (const field of HIGH_RISK_FIELDS) {
    const value = args[field];
    if (value === undefined || typeof value === 'object') continue;
    echoes[field] = String(value);
  }
  return echoes;
}

/** 文字覆核：confirmations[欄位] 必須與原值逐字相同 */
export function checkTextReview(args: Args): {
  readonly ok: boolean;
  readonly required: Readonly<Record<string, string>>;
} {
  const echoes = highRiskEchoes(args);
  const confirmations = isRecord(args.confirmations) ? args.confirmations : {};
  const required: Record<string, string> = {};
  for (const [field, value] of Object.entries(echoes)) {
    if (confirmations[field] !== value) required[field] = value;
  }
  return { ok: Object.keys(required).length === 0, required };
}

/** 合成資料（無真實客戶、單據或庫存） */
interface CustomerRow {
  readonly id: string;
  readonly legalEntityId: LegalEntityId;
  readonly name: string;
}

interface ReceivableRow {
  readonly id: string;
  readonly legalEntityId: LegalEntityId;
  readonly customerId: string;
  readonly period: string;
  readonly billedCents: number;
  readonly collectedCents: number;
  readonly daysPastDue: number;
}

interface OrderRow {
  readonly id: string;
  readonly legalEntityId: LegalEntityId;
  readonly period: string;
  readonly totalCents: number;
}

interface ProductRow {
  readonly id: string;
  readonly legalEntityId: LegalEntityId;
  readonly sku: string;
  readonly name: string;
  readonly priceCents: number;
  readonly stock: number;
}

interface ContractRow {
  readonly id: string;
  readonly legalEntityId: LegalEntityId;
  readonly customerId: string;
  readonly totalCents: number;
  readonly drawnCents: number;
}

export const SYNTHETIC_CUSTOMERS: readonly CustomerRow[] = [
  { id: 'C-001', legalEntityId: 'LE-01', name: '合成客戶甲' },
  { id: 'C-002', legalEntityId: 'LE-01', name: '合成客戶乙' },
  { id: 'C-003', legalEntityId: 'LE-02', name: '合成客戶丙' }
];

export const SYNTHETIC_RECEIVABLES: readonly ReceivableRow[] = [
  { id: 'AR-202610-001', legalEntityId: 'LE-01', customerId: 'C-001', period: '2026-10', billedCents: 1_200_000, collectedCents: 800_000, daysPastDue: 12 },
  { id: 'AR-202610-002', legalEntityId: 'LE-01', customerId: 'C-002', period: '2026-10', billedCents: 900_000, collectedCents: 900_000, daysPastDue: 0 },
  { id: 'AR-202610-003', legalEntityId: 'LE-02', customerId: 'C-003', period: '2026-10', billedCents: 500_000, collectedCents: 200_000, daysPastDue: 45 },
  { id: 'AR-202611-001', legalEntityId: 'LE-01', customerId: 'C-001', period: '2026-11', billedCents: 700_000, collectedCents: 0, daysPastDue: 0 },
  { id: 'AR-202611-002', legalEntityId: 'LE-02', customerId: 'C-003', period: '2026-11', billedCents: 300_000, collectedCents: 0, daysPastDue: 0 }
];

export const SYNTHETIC_ORDERS: readonly OrderRow[] = [
  { id: 'O-001', legalEntityId: 'LE-01', period: '2026-09', totalCents: 1_000_000 },
  { id: 'O-002', legalEntityId: 'LE-02', period: '2026-09', totalCents: 500_000 },
  { id: 'O-003', legalEntityId: 'LE-01', period: '2026-10', totalCents: 1_500_000 },
  { id: 'O-004', legalEntityId: 'LE-02', period: '2026-10', totalCents: 700_000 },
  { id: 'O-005', legalEntityId: 'LE-01', period: '2026-11', totalCents: 900_000 },
  { id: 'O-006', legalEntityId: 'LE-02', period: '2026-11', totalCents: 400_000 }
];

export const SYNTHETIC_PRODUCTS: readonly ProductRow[] = [
  { id: 'P-001', legalEntityId: 'LE-01', sku: 'AN-1001', name: '合成膠囊', priceCents: 25_000, stock: 120 },
  { id: 'P-002', legalEntityId: 'LE-02', sku: 'AN-2001', name: '合成粉劑', priceCents: 18_000, stock: 45 }
];

export const SYNTHETIC_CONTRACTS: readonly ContractRow[] = [
  { id: 'CT-001', legalEntityId: 'LE-01', customerId: 'C-001', totalCents: 5_000_000, drawnCents: 3_200_000 }
];

export interface AuthorizationRequest {
  readonly actorId: string;
  readonly tool: AiToolName;
  readonly permission: string;
  readonly session: AiSession;
  readonly args: Readonly<Args>;
}

/** 授權回呼：由呼叫端提供，未提供者一律拒絕 */
export type Authorize = (request: AuthorizationRequest) => boolean | Promise<boolean>;

export interface ToolDeps {
  readonly authorize: Authorize;
  readonly idFactory?: (kind: string) => string;
}

type Handler = (args: Args, ctx: { readonly session: AiSession; readonly requestId: string }) => unknown;

interface ToolDefinition {
  readonly name: AiToolName;
  readonly permission: string;
  readonly requiresTextReview: boolean;
  readonly handler: Handler;
}

function visibleEntities(session: AiSession): ReadonlySet<LegalEntityId> {
  return new Set(session.legalEntityIds);
}

function periodRange(args: Args): { from: string; to: string } {
  const from = asString(args.from);
  const to = asString(args.to);
  if (!from || !to || from > to) throw new ToolError('INVALID_ARGUMENT', '無效期間區間');
  return { from, to };
}

function makeHandlers(): Readonly<Record<AiToolName, ToolDefinition>> {
  const definitions: readonly ToolDefinition[] = [
    {
      name: 'query_sales_by_period',
      permission: TOOL_PERMISSIONS.query_sales_by_period,
      requiresTextReview: false,
      handler: (args, ctx) => {
        const period = asString(args.period);
        if (!period) throw new ToolError('INVALID_ARGUMENT', '缺少 period');
        const metric = asString(args.metric) === 'billed' ? 'billed' : 'collected';
        const entities = visibleEntities(ctx.session);
        const rows = SYNTHETIC_RECEIVABLES.filter(
          r => r.period === period && entities.has(r.legalEntityId)
        ).map(r => ({
          customerId: r.customerId,
          legalEntityId: r.legalEntityId,
          billedCents: r.billedCents,
          collectedCents: r.collectedCents,
          selectedCents: metric === 'billed' ? r.billedCents : r.collectedCents
        }));
        rows.sort((a, b) => b.selectedCents - a.selectedCents);
        return {
          period,
          metric,
          rows,
          notice: '實收為收款口徑，非營收；銷貨淨額請見 @anubis/reporting'
        };
      }
    },
    {
      name: 'compute_average_monthly_sales',
      permission: TOOL_PERMISSIONS.compute_average_monthly_sales,
      requiresTextReview: false,
      handler: (args, ctx) => {
        const { from, to } = periodRange(args);
        const entities = visibleEntities(ctx.session);
        const orders = SYNTHETIC_ORDERS.filter(
          o => o.period >= from && o.period <= to && entities.has(o.legalEntityId)
        );
        const months = new Set(orders.map(o => o.period)).size;
        if (months === 0) throw new ToolError('INVALID_ARGUMENT', '區間內無資料');
        const totalCents = orders.reduce((sum, o) => sum + o.totalCents, 0);
        return { from, to, months, totalCents, averageCents: Math.round(totalCents / months) };
      }
    },
    {
      name: 'generate_receivable_report',
      permission: TOOL_PERMISSIONS.generate_receivable_report,
      requiresTextReview: false,
      handler: (args, ctx) => {
        const period = asString(args.period);
        if (!period) throw new ToolError('INVALID_ARGUMENT', '缺少 period');
        const entities = visibleEntities(ctx.session);
        const rows = SYNTHETIC_RECEIVABLES.filter(
          r => r.period === period && entities.has(r.legalEntityId)
        ).map(r => ({
          id: r.id,
          customerId: r.customerId,
          legalEntityId: r.legalEntityId,
          billedCents: r.billedCents,
          collectedCents: r.collectedCents
        }));
        return {
          period,
          format: 'xlsx_draft',
          rows,
          linkTtlSeconds: 300,
          notice: '僅草稿描述，不產生實體檔案；正式匯出請用 @anubis/reporting'
        };
      }
    },
    {
      name: 'preview_adjustment',
      permission: TOOL_PERMISSIONS.preview_adjustment,
      requiresTextReview: true,
      handler: (args, ctx) => {
        const targetId = asString(args.targetId);
        const field = asString(args.field) ?? 'billedCents';
        if (!targetId) throw new ToolError('INVALID_ARGUMENT', '缺少 targetId');
        if (field !== 'billedCents' && field !== 'collectedCents') {
          throw new ToolError('INVALID_ARGUMENT', '僅允許調整應收金額欄位');
        }
        const desired = asInteger(args.desiredValueCents);
        if (desired === undefined || desired < 0) throw new ToolError('INVALID_ARGUMENT', '金額須為整數分');

        const entities = visibleEntities(ctx.session);
        const row = SYNTHETIC_RECEIVABLES.find(
          r => r.id === targetId && entities.has(r.legalEntityId)
        );
        if (!row) throw new ToolError('TARGET_NOT_FOUND', '查無標的或不在法人範圍內');

        const before = field === 'billedCents' ? row.billedCents : row.collectedCents;
        // 關鍵防呆：只建構 AdjustmentPreview，沒有任何 DB / SQL / 寫入呼叫。
        return AdjustmentPreviewSchema.parse({
          id: `AP-${ctx.requestId}`,
          requestId: ctx.requestId,
          targetType: asString(args.targetType) ?? 'Receivable',
          targetId,
          before: { [field]: before },
          after: { [field]: desired },
          status: 'awaiting_approval',
          requiredApprovers: 2,
          source: 'SYNTHETIC_DEMO'
        });
      }
    },
    {
      name: 'list_customers',
      permission: TOOL_PERMISSIONS.list_customers,
      requiresTextReview: false,
      handler: (_args, ctx) => {
        const entities = visibleEntities(ctx.session);
        return SYNTHETIC_CUSTOMERS.filter(c => entities.has(c.legalEntityId));
      }
    },
    {
      name: 'list_products',
      permission: TOOL_PERMISSIONS.list_products,
      requiresTextReview: false,
      handler: (_args, ctx) => {
        const entities = visibleEntities(ctx.session);
        return SYNTHETIC_PRODUCTS.filter(p => entities.has(p.legalEntityId));
      }
    },
    {
      name: 'query_contract_balance',
      permission: TOOL_PERMISSIONS.query_contract_balance,
      requiresTextReview: false,
      handler: (_args, ctx) => {
        const entities = visibleEntities(ctx.session);
        return SYNTHETIC_CONTRACTS.filter(c => entities.has(c.legalEntityId)).map(c => ({
          id: c.id,
          legalEntityId: c.legalEntityId,
          totalCents: c.totalCents,
          drawnCents: c.drawnCents,
          remainingCents: c.totalCents - c.drawnCents
        }));
      }
    },
    {
      name: 'query_inventory',
      permission: TOOL_PERMISSIONS.query_inventory,
      requiresTextReview: false,
      handler: (_args, ctx) => {
        const entities = visibleEntities(ctx.session);
        return SYNTHETIC_PRODUCTS.filter(p => entities.has(p.legalEntityId)).map(p => ({
          sku: p.sku,
          legalEntityId: p.legalEntityId,
          stock: p.stock,
          stockValueCents: p.stock * p.priceCents
        }));
      }
    },
    {
      name: 'query_ar_aging',
      permission: TOOL_PERMISSIONS.query_ar_aging,
      requiresTextReview: false,
      handler: (_args, ctx) => {
        const entities = visibleEntities(ctx.session);
        const buckets: Record<string, number> = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
        for (const r of SYNTHETIC_RECEIVABLES) {
          if (!entities.has(r.legalEntityId)) continue;
          const open = r.billedCents - r.collectedCents;
          if (open <= 0) continue;
          const key = r.daysPastDue <= 30 ? '0-30' : r.daysPastDue <= 60 ? '31-60' : r.daysPastDue <= 90 ? '61-90' : '90+';
          buckets[key] = (buckets[key] ?? 0) + open;
        }
        return { unit: 'integer_cents', buckets };
      }
    },
    {
      name: 'draft_order',
      permission: TOOL_PERMISSIONS.draft_order,
      requiresTextReview: true,
      handler: (args, ctx) => {
        const sku = asString(args.sku);
        const qty = asInteger(args.qty) ?? 1;
        if (!sku || qty <= 0) throw new ToolError('INVALID_ARGUMENT', 'sku/qty 無效');
        const entities = visibleEntities(ctx.session);
        const product = SYNTHETIC_PRODUCTS.find(p => p.sku === sku && entities.has(p.legalEntityId));
        if (!product) throw new ToolError('TARGET_NOT_FOUND', '查無品號或不在法人範圍內');
        // 只回草稿，不寫入訂單；上線前仍須人工核准。
        return {
          status: 'draft',
          sku: product.sku,
          qty,
          amountCents: product.priceCents * qty,
          requiredApprovers: 2,
          source: 'SYNTHETIC_DEMO'
        };
      }
    }
  ];

  return Object.fromEntries(definitions.map(d => [d.name, d])) as Readonly<Record<AiToolName, ToolDefinition>>;
}

const HANDLERS = makeHandlers();

export interface ToolRegistry {
  readonly allowedTools: readonly AiToolName[];
  invoke(call: unknown, session: AiSession): Promise<ToolResult>;
}

export function createToolRegistry(deps: ToolDeps): ToolRegistry {
  return {
    allowedTools: AiToolNameSchema.options,
    async invoke(call, session) {
      const requestId = isRecord(call) && typeof call.requestId === 'string' ? call.requestId : 'UNKNOWN_REQUEST';

      if (!isRecord(call) || !('tool' in call) || typeof call.tool !== 'string') {
        return { ok: false, code: 'INVALID_CALL', requestId, message: '工具呼叫格式無效' };
      }
      // 白名單先擋：未知工具甚至不會進入 Zod 完整解析或任何 handler。
      const allowed = AiToolNameSchema.safeParse(call.tool);
      if (!allowed.success) {
        return { ok: false, code: 'TOOL_NOT_ALLOWED', requestId, tool: call.tool, message: '工具不在白名單內' };
      }
      const tool = allowed.data;
      const parsed = AiToolCallSchema.safeParse({
        tool,
        args: isRecord(call.args) ? call.args : {},
        requestId: call.requestId,
        actorId: call.actorId
      });
      if (!parsed.success) {
        return { ok: false, code: 'INVALID_CALL', requestId, tool, message: '工具呼叫欄位無效' };
      }
      const { args, actorId } = parsed.data;

      // 工作階段隔離：actor 必屬本次 session，且傳入的 sessionId 必須一致。
      if (actorId !== session.actorId || !session.sessionId || !session.actorId) {
        return { ok: false, code: 'SESSION_MISMATCH', requestId, tool, message: 'actor 與工作階段不符' };
      }
      const argSessionId = asString(args.sessionId);
      if (argSessionId !== undefined && argSessionId !== session.sessionId) {
        return { ok: false, code: 'SESSION_MISMATCH', requestId, tool, message: 'sessionId 與工作階段不符' };
      }

      // 法人範圍隔離：跨法人查詢直接拒絕，不靠推論共用資料。
      const argEntity = asString(args.legalEntityId);
      if (argEntity !== undefined) {
        const entityCheck = LegalEntityIdSchema.safeParse(argEntity);
        if (!entityCheck.success || !session.legalEntityIds.includes(entityCheck.data)) {
          return { ok: false, code: 'OUT_OF_SCOPE', requestId, tool, message: '法人不在授權範圍內' };
        }
      }

      const definition = HANDLERS[tool];
      const permission = definition.permission;
      const granted = await deps.authorize({ actorId, tool, permission, session, args });
      if (granted !== true) {
        return { ok: false, code: 'PERMISSION_DENIED', requestId, tool, message: '權限查核未通過' };
      }

      if (definition.requiresTextReview) {
        const review = checkTextReview(args);
        if (!review.ok) {
          return {
            ok: false,
            code: 'CONFIRMATION_REQUIRED',
            requestId,
            tool,
            message: '高風險欄位須逐字回顯確認',
            requiredEchoes: review.required
          };
        }
      }

      try {
        const data = await definition.handler(args, { session, requestId });
        return { ok: true, tool, requestId, data, notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED' };
      } catch (error) {
        if (error instanceof ToolError) {
          return { ok: false, code: error.code, requestId, tool, message: error.message };
        }
        return { ok: false, code: 'INVALID_CALL', requestId, tool, message: '工具執行失敗' };
      }
    }
  };
}
