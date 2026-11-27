/**
 * @anubis/ai-gateway｜AI 閘道入口（可測的純函式組合，無 HTTP 框架依賴）
 * 合規防呆設計／風險提醒：ASR／LLM 未部署如實回 NOT_DEPLOYED；工具走白名單＋
 * 授權回呼＋工作階段隔離；高風險改帳只產生差異預覽（雙人覆核），不寫 DB、不發 SQL；
 * 四個示範查詢全數使用 SYNTHETIC_DEMO 合成資料，PROTOTYPE_NOT_APPROVED。
 */
import {
  AI_SYSTEM_GUARD,
  createAsrAdapter,
  createLlmAdapter,
  type AsrAdapter,
  type LlmAdapter
} from './adapters.js';
import {
  createSession,
  createToolRegistry,
  type AiSession,
  type AiToolName,
  type Args,
  type ToolDeps,
  type ToolRegistry,
  type ToolResult
} from './tools.js';

export * from './adapters.js';
export * from './tools.js';

export interface AiGatewayDeps extends ToolDeps {
  readonly asr?: AsrAdapter;
  readonly llm?: LlmAdapter;
}

export interface DemoQueries {
  /** 查上月（示範基準月 2026-11 的前一月）已收款排行：收款口徑，不是營收 */
  lastMonthCollectedRanking(): Promise<ToolResult>;
  /** 計算平均月銷量：整數分 */
  averageMonthlySales(): Promise<ToolResult>;
  /** 輸出 11 月應收 Excel 草稿描述：不產生實體檔案 */
  novemberReceivableDraft(): Promise<ToolResult>;
  /** 改應收為 20000 元（2,000,000 分）：先要逐字覆核，再只回差異預覽 */
  adjustReceivableTo20000(): Promise<ToolResult>;
}

/** 四個示範查詢：固定合成 session，便於重現與測試 */
export function createDemoQueries(registry: ToolRegistry): DemoQueries {
  const actorId = 'demo-actor';
  const session = createSession({
    sessionId: 'demo-session',
    actorId,
    legalEntityIds: ['LE-01']
  });
  const call = (tool: AiToolName, args: Args, requestId: string): Promise<ToolResult> =>
    registry.invoke({ tool, args, requestId, actorId }, session);

  return {
    lastMonthCollectedRanking: () =>
      call(
        'query_sales_by_period',
        { period: '2026-10', metric: 'collected', legalEntityId: 'LE-01' },
        'demo-collected-101'
      ),
    averageMonthlySales: () =>
      call(
        'compute_average_monthly_sales',
        { from: '2026-09', to: '2026-11', legalEntityId: 'LE-01' },
        'demo-average-102'
      ),
    novemberReceivableDraft: () =>
      call(
        'generate_receivable_report',
        { period: '2026-11', format: 'xlsx_draft', legalEntityId: 'LE-01' },
        'demo-ar-draft-103'
      ),
    async adjustReceivableTo20000() {
      const base: Args = {
        targetType: 'Receivable',
        targetId: 'AR-202610-001',
        field: 'billedCents',
        desiredValueCents: 2_000_000,
        legalEntityId: 'LE-01'
      };
      const requestId = 'demo-adjust-104';
      // 第一步一定先被文字覆核攔下；把要求的逐字回顯帶回第二步。
      const first = await call('preview_adjustment', base, requestId);
      if (!first.ok && first.code === 'CONFIRMATION_REQUIRED' && first.requiredEchoes) {
        const confirmations: Args = {};
        for (const [field, value] of Object.entries(first.requiredEchoes)) confirmations[field] = value;
        return call('preview_adjustment', { ...base, confirmations }, requestId);
      }
      return first;
    }
  };
}

export interface AiGateway {
  readonly asr: AsrAdapter;
  readonly llm: LlmAdapter;
  readonly registry: ToolRegistry;
  readonly demos: DemoQueries;
  readonly guard: typeof AI_SYSTEM_GUARD;
  invoke(call: unknown, session: AiSession): Promise<ToolResult>;
}

export function createAiGateway(deps: AiGatewayDeps): AiGateway {
  const asr = deps.asr ?? createAsrAdapter();
  const llm = deps.llm ?? createLlmAdapter();
  const registry = createToolRegistry(deps);
  return {
    asr,
    llm,
    registry,
    demos: createDemoQueries(registry),
    guard: AI_SYSTEM_GUARD,
    invoke: (call, session) => registry.invoke(call, session)
  };
}
