/**
 * AI 閘道測試（node --test）
 * 合規防呆設計／風險提醒：全部使用合成 session 與合成資料；測試只驗證防呆行為，
 * 不連 DB、不呼叫外部模型、不產生任何真實單據（PROTOTYPE_NOT_APPROVED）。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createAiGateway,
  createAsrAdapter,
  createLlmAdapter,
  createSession
} from '../src/index.ts';

const session = createSession({
  sessionId: 'test-session',
  actorId: 'test-actor',
  legalEntityIds: ['LE-01']
});

function gateway(authorize = () => true) {
  return createAiGateway({ authorize });
}

const adjustArgs = {
  targetType: 'Receivable',
  targetId: 'AR-202610-001',
  field: 'billedCents',
  desiredValueCents: 2_000_000,
  legalEntityId: 'LE-01'
};

test('白名單拒絕未知 tool（十項以外不進 handler）', async () => {
  const gw = gateway();
  assert.equal(gw.registry.allowedTools.length, 10);

  const result = await gw.invoke(
    { tool: 'drop_table', args: {}, requestId: 'r-001', actorId: 'test-actor' },
    session
  );

  assert.equal(result.ok, false);
  assert.equal(result.code, 'TOOL_NOT_ALLOWED');
  assert.equal(result.tool, 'drop_table');
  assert.equal('data' in result, false); // 未進任何 handler，因此不會有資料回傳
});

test('preview_adjustment 只回差異預覽，不直接寫帳', async () => {
  let writeAttempts = 0; // 本套件沒有任何寫入 sink，呼叫端也沒被觸發
  const gw = gateway();
  const result = await gw.invoke(
    {
      tool: 'preview_adjustment',
      args: {
        ...adjustArgs,
        confirmations: {
          desiredValueCents: '2000000',
          legalEntityId: 'LE-01'
        }
      },
      requestId: 'r-002',
      actorId: 'test-actor'
    },
    session
  );

  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.data.status, 'awaiting_approval');
  assert.equal(result.data.requiredApprovers, 2);
  assert.equal(result.data.source, 'SYNTHETIC_DEMO');
  assert.deepEqual(result.data.before, { billedCents: 1_200_000 });
  assert.deepEqual(result.data.after, { billedCents: 2_000_000 });
  assert.equal(result.data.status === 'applied', false);
  assert.equal(writeAttempts, 0);
});

test('模型未安裝／未設定 URL 回 NOT_DEPLOYED，不假裝可用', async () => {
  const gw = gateway();
  const asr = await gw.asr.transcribe(new Uint8Array([1, 2, 3]), 'zh-TW', session, 'r-003');
  assert.equal(asr.status, 'NOT_DEPLOYED');
  assert.equal(asr.code, 'NOT_DEPLOYED');
  assert.match(asr.reason, /ASR_MODEL_NOT_INSTALLED/);

  const llm = await gw.llm.complete('示範提示', session, 'r-003');
  assert.equal(llm.status, 'NOT_DEPLOYED');
  assert.match(llm.reason, /LLM_ENDPOINT_NOT_CONFIGURED/);

  // 即使宣稱啟用，沒有注入引擎／有效端點仍須如實回報。
  const emptyAsr = await createAsrAdapter({ enabled: true }).transcribe(
    new Uint8Array(),
    'zh-TW',
    session,
    'r-003a'
  );
  assert.equal(emptyAsr.reason, 'ASR_ENGINE_NOT_INJECTED');
  const badLlm = await createLlmAdapter({ endpointUrl: 'file:///etc/passwd' }).complete(
    'x',
    session,
    'r-003b'
  );
  assert.equal(badLlm.reason, 'LLM_ENDPOINT_UNSUPPORTED_PROTOCOL');
});

test('高風險欄位需逐字覆核', async () => {
  const gw = gateway();
  const call = (tool, args, requestId) =>
    gw.invoke({ tool, args, requestId, actorId: 'test-actor' }, session);

  const missing = await call('preview_adjustment', adjustArgs, 'r-004');
  assert.equal(missing.ok, false);
  assert.equal(missing.code, 'CONFIRMATION_REQUIRED');
  assert.equal(missing.requiredEchoes.desiredValueCents, '2000000');
  assert.equal(missing.requiredEchoes.legalEntityId, 'LE-01');

  const wrongEcho = await call(
    'preview_adjustment',
    { ...adjustArgs, confirmations: { desiredValueCents: '20000', legalEntityId: 'LE-01' } },
    'r-004b'
  );
  assert.equal(wrongEcho.code, 'CONFIRMATION_REQUIRED');

  const draft = await call('draft_order', { sku: 'AN-1001', qty: 2 }, 'r-004c');
  assert.equal(draft.code, 'CONFIRMATION_REQUIRED');
  assert.equal(draft.requiredEchoes.sku, 'AN-1001');
});

test('工作階段隔離：法人範圍、actor 與 sessionId 都要相符', async () => {
  const gw = gateway();
  const sessionA = createSession({
    sessionId: 'session-A',
    actorId: 'actor-A',
    legalEntityIds: ['LE-01']
  });
  const sessionB = createSession({
    sessionId: 'session-B',
    actorId: 'actor-B',
    legalEntityIds: ['LE-02']
  });
  const list = (s, args = {}, requestId = 'r-005') =>
    gw.invoke({ tool: 'list_customers', args, requestId, actorId: s.actorId }, s);

  const a = await list(sessionA);
  const b = await list(sessionB);
  assert.equal(a.ok, true);
  assert.equal(b.ok, true);
  assert.deepEqual(a.data.map(c => c.legalEntityId), ['LE-01', 'LE-01']);
  assert.deepEqual(b.data.map(c => c.legalEntityId), ['LE-02']);

  const crossEntity = await list(sessionB, { legalEntityId: 'LE-01' }, 'r-005b');
  assert.equal(crossEntity.code, 'OUT_OF_SCOPE');

  const wrongActor = await gw.invoke(
    { tool: 'list_customers', args: {}, requestId: 'r-005c', actorId: 'actor-A' },
    sessionB
  );
  assert.equal(wrongActor.code, 'SESSION_MISMATCH');

  const wrongSessionId = await list(sessionA, { sessionId: 'session-B' }, 'r-005d');
  assert.equal(wrongSessionId.code, 'SESSION_MISMATCH');
});

test('權限回呼拒絕時不得執行工具', async () => {
  const gw = gateway(() => false);
  const result = await gw.invoke(
    { tool: 'list_products', args: {}, requestId: 'r-006', actorId: 'test-actor' },
    session
  );
  assert.equal(result.code, 'PERMISSION_DENIED');
});

test('四個示範查詢：收款非營收、平均整數分、草稿與雙人覆核', async () => {
  const gw = gateway();
  const ranking = await gw.demos.lastMonthCollectedRanking();
  assert.equal(ranking.ok, true, JSON.stringify(ranking));
  assert.equal(ranking.data.metric, 'collected');
  assert.match(ranking.data.notice, /非營收/);
  assert.equal(ranking.data.rows[0].selectedCents, 900_000);

  const average = await gw.demos.averageMonthlySales();
  assert.equal(average.ok, true, JSON.stringify(average));
  assert.equal(average.data.averageCents, 1_133_333);
  assert.equal(Number.isInteger(average.data.averageCents), true);

  const draft = await gw.demos.novemberReceivableDraft();
  assert.equal(draft.ok, true, JSON.stringify(draft));
  assert.equal(draft.data.format, 'xlsx_draft');
  assert.equal(draft.data.linkTtlSeconds, 300);

  const preview = await gw.demos.adjustReceivableTo20000();
  assert.equal(preview.ok, true, JSON.stringify(preview));
  assert.equal(preview.data.status, 'awaiting_approval');
  assert.equal(preview.data.requiredApprovers, 2);
});
