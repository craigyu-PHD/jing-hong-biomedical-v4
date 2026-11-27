/**
 * @anubis/reporting｜BI 口徑、KPI、下鑽與 XLSX 安全草稿
 * 合規防呆設計／風險提醒：
 * 1) Management 與 Statutory 口徑版本分開管理，互不覆寫；
 * 2) 銷貨淨額只由 sale 單據計算，收款／請款不得當營收（salesSource 明確標註）；
 * 3) 所有金額皆為整數分，非整數直接丟錯，不做 float 運算；
 * 4) 下鑽結構可追溯到法人／客戶，葉節點合計必須等於上層；
 * 5) XLSX 草稿一筆一列、數字維持數字、文字前綴 ' = + - @ 一律 escape，
 *    短效連結（.invalid 不可實際下載）＋不可竄改稽核事件；資料全數合成。
 */
import {
  AuditEventSchema,
  LegalEntityIdSchema,
  type AuditEvent,
  type LegalEntityId,
  type Role
} from '@anubis/contracts';

export type MetricBasis = 'management' | 'statutory';
export type AgingBucket = '0-30' | '31-60' | '61-90' | '90+';

export interface BasisVersion {
  readonly basis: MetricBasis;
  readonly version: string;
  readonly description: string;
  readonly salesSource: 'SALE_DOCUMENTS_ONLY';
}

/** 口徑版本：變更口徑必須改版號，不得直接改既有數字 */
export const BASIS_VERSIONS: Readonly<Record<MetricBasis, BasisVersion>> = {
  management: {
    basis: 'management',
    version: 'MGMT-2026.11-r1',
    description: '管理口徑：可另列管理性調整，但調整不視為銷貨淨額',
    salesSource: 'SALE_DOCUMENTS_ONLY'
  },
  statutory: {
    basis: 'statutory',
    version: 'STAT-2026.11-r1',
    description: '法定口徑：排除管理性調整，銷貨淨額依銷貨單據認列',
    salesSource: 'SALE_DOCUMENTS_ONLY'
  }
};

export function basisVersion(basis: MetricBasis): string {
  return BASIS_VERSIONS[basis].version;
}

/** 整數分防呆：不接受 float、NaN 或超安全整數 */
export function ensureIntegerCents(value: number, label: string): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`NON_INTEGER_CENTS: ${label}`);
  }
  return value;
}

export interface SalesRow {
  readonly id: string;
  readonly legalEntityId: LegalEntityId;
  readonly customerId: string;
  readonly period: string;
  readonly documentType: 'sale' | 'replacement' | 'exchange';
  /** 補貨／換貨紙面金額為 0；只有 sale 計入銷貨淨額 */
  readonly netAmountCents: number;
}

export interface ReceivableRow {
  readonly id: string;
  readonly legalEntityId: LegalEntityId;
  readonly customerId: string;
  readonly period: string;
  readonly billedCents: number;
  readonly collectedCents: number;
  readonly discountCents: number;
  readonly overpayCents: number;
  readonly daysPastDue: number;
}

export interface ContractRow {
  readonly id: string;
  readonly legalEntityId: LegalEntityId;
  readonly totalCents: number;
  readonly drawnCents: number;
}

export interface InventoryRow {
  readonly sku: string;
  readonly legalEntityId: LegalEntityId;
  readonly quantity: number;
  readonly unitCostCents: number;
}

export interface ManagementAdjustmentRow {
  readonly id: string;
  readonly legalEntityId: LegalEntityId;
  readonly amountCents: number;
  readonly reason: string;
}

export interface ReportingInput {
  readonly sales: readonly SalesRow[];
  readonly receivables: readonly ReceivableRow[];
  readonly contracts: readonly ContractRow[];
  readonly inventory: readonly InventoryRow[];
  readonly managementAdjustments: readonly ManagementAdjustmentRow[];
  readonly customerNames: Readonly<Record<string, string>>;
}

/** 全數合成：含一筆惡意客戶名，用來驗證 XLSX 公式注入防呆 */
export const SYNTHETIC_INPUT: ReportingInput = {
  sales: [
    { id: 'S-001', legalEntityId: 'LE-01', customerId: 'C-001', period: '2026-11', documentType: 'sale', netAmountCents: 1_500_000 },
    { id: 'S-002', legalEntityId: 'LE-01', customerId: 'C-002', period: '2026-11', documentType: 'sale', netAmountCents: 900_000 },
    { id: 'S-003', legalEntityId: 'LE-02', customerId: 'C-003', period: '2026-11', documentType: 'sale', netAmountCents: 600_000 },
    { id: 'S-004', legalEntityId: 'LE-01', customerId: 'C-001', period: '2026-11', documentType: 'replacement', netAmountCents: 0 },
    { id: 'S-005', legalEntityId: 'LE-01', customerId: 'C-002', period: '2026-11', documentType: 'exchange', netAmountCents: 0 }
  ],
  receivables: [
    { id: 'AR-001', legalEntityId: 'LE-01', customerId: 'C-001', period: '2026-11', billedCents: 1_500_000, collectedCents: 1_000_000, discountCents: 0, overpayCents: 0, daysPastDue: 5 },
    { id: 'AR-002', legalEntityId: 'LE-01', customerId: 'C-002', period: '2026-11', billedCents: 900_000, collectedCents: 900_000, discountCents: 0, overpayCents: 0, daysPastDue: 0 },
    { id: 'AR-003', legalEntityId: 'LE-02', customerId: 'C-003', period: '2026-11', billedCents: 600_000, collectedCents: 200_000, discountCents: 0, overpayCents: 0, daysPastDue: 45 },
    { id: 'AR-004', legalEntityId: 'LE-01', customerId: 'C-004', period: '2026-11', billedCents: 100_000, collectedCents: 0, discountCents: 0, overpayCents: 0, daysPastDue: 10 }
  ],
  contracts: [
    { id: 'CT-001', legalEntityId: 'LE-01', totalCents: 5_000_000, drawnCents: 3_200_000 },
    { id: 'CT-002', legalEntityId: 'LE-02', totalCents: 1_000_000, drawnCents: 400_000 }
  ],
  inventory: [
    { sku: 'AN-1001', legalEntityId: 'LE-01', quantity: 120, unitCostCents: 20_000 },
    { sku: 'AN-2001', legalEntityId: 'LE-02', quantity: 45, unitCostCents: 12_000 }
  ],
  managementAdjustments: [
    { id: 'MA-001', legalEntityId: 'LE-01', amountCents: 120_000, reason: '管理性折讓（法定口徑排除）' }
  ],
  customerNames: {
    'C-001': '合成客戶甲',
    'C-002': '合成客戶乙',
    'C-003': '合成客戶丙',
    'C-004': '=SUM(1+1);@evil' // 刻意模擬公式注入，匯出必須 escape
  }
};

export interface KpiSet {
  readonly basis: MetricBasis;
  readonly version: string;
  readonly period: string;
  readonly unit: 'INTEGER_CENTS';
  readonly salesSource: 'SALE_DOCUMENTS_ONLY';
  readonly netSalesCents: number;
  readonly billedCents: number;
  readonly collectedCents: number;
  readonly receivableCents: number;
  readonly managementAdjustmentCents: number;
  readonly aging: Readonly<Record<AgingBucket, number>>;
  readonly contractRemainingCents: number;
  readonly inventoryValueCents: number;
  readonly inventoryQuantity: number;
  readonly notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED｜收款不等於營收';
}

function agingBucket(daysPastDue: number): AgingBucket {
  if (daysPastDue <= 30) return '0-30';
  if (daysPastDue <= 60) return '31-60';
  if (daysPastDue <= 90) return '61-90';
  return '90+';
}

/** 計算 KPI：口徑分離，收款／請款絕不寫入銷貨淨額 */
export function computeKpis(
  basis: MetricBasis,
  input: ReportingInput = SYNTHETIC_INPUT,
  period = '2026-11'
): KpiSet {
  const version = basisVersion(basis);
  const sales = input.sales.filter(r => r.period === period && r.documentType === 'sale');
  const netSalesCents = ensureIntegerCents(
    sales.reduce((sum, row) => sum + ensureIntegerCents(row.netAmountCents, row.id), 0),
    'netSalesCents'
  );

  const receivables = input.receivables.filter(r => r.period === period);
  const billedCents = receivables.reduce((sum, r) => sum + ensureIntegerCents(r.billedCents, r.id), 0);
  const collectedCents = receivables.reduce((sum, r) => sum + ensureIntegerCents(r.collectedCents, r.id), 0);
  const receivableCents = receivables.reduce((sum, r) => {
    const open = r.billedCents - r.collectedCents - r.discountCents - r.overpayCents;
    return sum + Math.max(0, ensureIntegerCents(open, r.id));
  }, 0);

  const aging: Record<AgingBucket, number> = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
  for (const r of receivables) {
    const open = Math.max(0, r.billedCents - r.collectedCents - r.discountCents - r.overpayCents);
    const bucket = agingBucket(r.daysPastDue);
    aging[bucket] = (aging[bucket] ?? 0) + open;
  }

  const contractRemainingCents = input.contracts.reduce((sum, c) => {
    return sum + ensureIntegerCents(
      ensureIntegerCents(c.totalCents, c.id) - ensureIntegerCents(c.drawnCents, c.id),
      `${c.id}:remaining`
    );
  }, 0);

  const inventoryValueCents = input.inventory.reduce(
    (sum, row) => sum + row.quantity * ensureIntegerCents(row.unitCostCents, row.sku),
    0
  );
  const inventoryQuantity = input.inventory.reduce((sum, row) => sum + row.quantity, 0);

  // 管理性調整只在管理口徑呈現，且絕不計入銷貨淨額。
  const managementAdjustmentCents =
    basis === 'management'
      ? input.managementAdjustments.reduce(
          (sum, row) => sum + ensureIntegerCents(row.amountCents, row.id),
          0
        )
      : 0;

  return {
    basis,
    version,
    period,
    unit: 'INTEGER_CENTS',
    salesSource: 'SALE_DOCUMENTS_ONLY',
    netSalesCents,
    billedCents: ensureIntegerCents(billedCents, 'billedCents'),
    collectedCents: ensureIntegerCents(collectedCents, 'collectedCents'),
    receivableCents: ensureIntegerCents(receivableCents, 'receivableCents'),
    managementAdjustmentCents,
    aging,
    contractRemainingCents: ensureIntegerCents(contractRemainingCents, 'contractRemainingCents'),
    inventoryValueCents: ensureIntegerCents(inventoryValueCents, 'inventoryValueCents'),
    inventoryQuantity,
    notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED｜收款不等於營收'
  };
}

export type DrilldownMetric =
  | 'netSalesCents'
  | 'billedCents'
  | 'collectedCents'
  | 'receivableCents'
  | 'contractRemainingCents'
  | 'inventoryValueCents';

export interface DrilldownNode {
  readonly id: string;
  readonly label: string;
  readonly metric: DrilldownMetric;
  readonly valueCents: number;
  readonly basis: MetricBasis;
  readonly children: readonly DrilldownNode[];
  readonly source: 'SYNTHETIC_DEMO';
}

function node(input: {
  id: string;
  label: string;
  metric: DrilldownMetric;
  valueCents: number;
  basis: MetricBasis;
  children?: readonly DrilldownNode[];
}): DrilldownNode {
  return { ...input, valueCents: ensureIntegerCents(input.valueCents, input.id), children: input.children ?? [], source: 'SYNTHETIC_DEMO' };
}

/** 銷貨淨額下鑽：total → 法人 → 客戶；葉節點合計等於根節點 */
export function buildNetSalesDrilldown(kpis: KpiSet, input: ReportingInput = SYNTHETIC_INPUT): DrilldownNode {
  const sales = input.sales.filter(
    r => r.period === kpis.period && r.documentType === 'sale'
  );
  const entities = [...new Set(sales.map(r => r.legalEntityId))].sort();
  const children = entities.map(entity => {
    const entityRows = sales.filter(r => r.legalEntityId === entity);
    const customers = [...new Set(entityRows.map(r => r.customerId))].sort();
    return node({
      id: `entity:${entity}`,
      label: entity,
      metric: 'netSalesCents',
      basis: kpis.basis,
      valueCents: entityRows.reduce((sum, r) => sum + r.netAmountCents, 0),
      children: customers.map(customer =>
        node({
          id: `customer:${entity}:${customer}`,
          label: input.customerNames[customer] ?? customer,
          metric: 'netSalesCents',
          basis: kpis.basis,
          valueCents: entityRows
            .filter(r => r.customerId === customer)
            .reduce((sum, r) => sum + r.netAmountCents, 0)
        })
      )
    });
  });
  return node({
    id: `root:${kpis.basis}:${kpis.period}`,
    label: `銷貨淨額（${kpis.version}）`,
    metric: 'netSalesCents',
    basis: kpis.basis,
    valueCents: kpis.netSalesCents,
    children
  });
}

/** XLSX 安全儲存格：數字維持數字；文字前綴 ' = + - @ 加前導單引號 */
export type SafeCell =
  | { readonly kind: 'number'; readonly value: number }
  | { readonly kind: 'text'; readonly value: string };

export const FORMULA_PREFIXES: readonly string[] = ["'", '=', '+', '-', '@'];

export function safeCell(value: string | number): SafeCell {
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) throw new Error('XLSX_NUMBER_NOT_INTEGER');
    return { kind: 'number', value };
  }
  const cleaned = value.replace(/[\r\n\t]/g, ' ');
  const first = cleaned.slice(0, 1);
  const escaped = FORMULA_PREFIXES.includes(first) ? `'${cleaned}` : cleaned;
  return { kind: 'text', value: escaped };
}

export type RawValue = string | number;
export type RawRecord = Readonly<Record<string, RawValue>>;

/** 一筆一列：表頭＋每筆資料一列；數字維持數字，不改為文字 */
export function toSafeRows(
  columns: readonly string[],
  records: readonly RawRecord[]
): readonly (readonly SafeCell[])[] {
  const header = columns.map(c => safeCell(c));
  return [
    header,
    ...records.map(record =>
      columns.map(column => safeCell(record[column] ?? ''))
    )
  ];
}

/** 應收匯出列：一筆應收一列，金額皆為整數分 */
export function receivableExportRows(
  input: ReportingInput = SYNTHETIC_INPUT,
  period = '2026-11'
): readonly RawRecord[] {
  return input.receivables.filter(r => r.period === period).map(r => ({
    id: r.id,
    legalEntityId: r.legalEntityId,
    customerName: input.customerNames[r.customerId] ?? r.customerId,
    billedCents: r.billedCents,
    collectedCents: r.collectedCents,
    receivableCents: Math.max(0, r.billedCents - r.collectedCents - r.discountCents - r.overpayCents)
  }));
}

export const RECEIVABLE_COLUMNS: readonly string[] = [
  'id',
  'legalEntityId',
  'customerName',
  'billedCents',
  'collectedCents',
  'receivableCents'
];

export interface XlsxDraftOptions {
  readonly columns: readonly string[];
  readonly records: readonly RawRecord[];
  readonly actorId: string;
  readonly actorRole: Role;
  readonly legalEntityId: LegalEntityId;
  readonly requestId?: string;
  readonly ttlSeconds?: number;
  readonly now?: Date;
}

export interface XlsxDraft {
  readonly fileName: string;
  readonly sheetName: string;
  readonly rows: readonly (readonly SafeCell[])[];
  readonly link: {
    readonly url: string;
    readonly expiresAt: string;
    readonly ttlSeconds: number;
  };
  readonly audit: AuditEvent;
  readonly source: 'SYNTHETIC_DEMO';
  readonly notice: '短效連結為 .invalid 示意，不可實際下載；PROTOTYPE_NOT_APPROVED';
}

/** 產生 XLSX「草稿描述」：不產生實體檔、不上傳，附短效連結與稽核事件 */
export function exportXlsxDraft(options: XlsxDraftOptions): XlsxDraft {
  const now = options.now ?? new Date();
  const ttlSeconds = Math.min(Math.max(1, options.ttlSeconds ?? 300), 900);
  const requestId = options.requestId ?? `xlsx-${now.getTime()}`;
  const rows = toSafeRows(options.columns, options.records);
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();

  const audit = AuditEventSchema.parse({
    id: `AUD-${requestId}`,
    at: now.toISOString(),
    actorId: options.actorId,
    actorRole: options.actorRole,
    legalEntityId: LegalEntityIdSchema.parse(options.legalEntityId),
    action: 'REPORT_XLSX_DRAFT_EXPORT',
    targetType: 'XlsxDraft',
    targetId: requestId,
    after: { rowCount: options.records.length, ttlSeconds },
    requestId
  });

  return {
    fileName: `receivable-draft-${requestId}.xlsx`,
    sheetName: '應收草稿',
    rows,
    link: {
      url: `https://synthetic.invalid/xlsx-draft/${encodeURIComponent(requestId)}`,
      expiresAt,
      ttlSeconds
    },
    audit,
    source: 'SYNTHETIC_DEMO',
    notice: '短效連結為 .invalid 示意，不可實際下載；PROTOTYPE_NOT_APPROVED'
  };
}
