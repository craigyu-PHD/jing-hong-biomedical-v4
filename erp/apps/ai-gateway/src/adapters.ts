/**
 * @anubis/ai-gateway｜模型適配器（ASR / 本機 LLM）
 * 合規防呆設計／風險提醒：預設一律 NOT_DEPLOYED。未安裝語音模型、未設定本機
 *模型 URL 時如實回報，不偽裝可語音、不偽造推論結果；不接觸 DB、不產生 SQL；
 *所有回傳內容標示 SYNTHETIC_DEMO，正式上線前須另外審核（PROTOTYPE_NOT_APPROVED）。
 */

/** 適配器回應狀態：只有真正可用才回 OK */
export type AdapterStatus = 'OK' | 'NOT_DEPLOYED';

/** 未部署／未設定：如實告知，不得以空字串冒充成功 */
export interface NotDeployed {
  readonly status: 'NOT_DEPLOYED';
  readonly code: 'NOT_DEPLOYED';
  readonly reason: string;
  readonly requestId: string;
}

/** 工作階段最小介面：ASR 與 LLM 都必須帶 sessionId，避免跨工作階段混用 */
export interface SessionLike {
  readonly sessionId: string;
}

export interface TranscriptionSegment {
  readonly startMs: number;
  readonly endMs: number;
  readonly text: string;
  readonly confidence: number;
}

export interface TranscriptionSuccess {
  readonly status: 'OK';
  readonly text: string;
  readonly segments: readonly TranscriptionSegment[];
  readonly confidence: number;
  readonly modelVersion: string;
  readonly latencyMs: number;
  readonly requestId: string;
  readonly notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED';
}

export type TranscriptionResult = TranscriptionSuccess | NotDeployed;

/** 由外部注入的真實辨識引擎；未注入即視為未安裝 */
export type AsrEngine = (input: {
  readonly audio: Uint8Array;
  readonly language: string;
  readonly session: SessionLike;
  readonly requestId: string;
}) => Promise<Omit<TranscriptionSuccess, 'status' | 'requestId' | 'notice'>>;

export interface AsrAdapterOptions {
  /** 預設 false：沒有明確開啟就回 NOT_DEPLOYED */
  readonly enabled?: boolean;
  /** 必須由部署方提供實際模型版本，不自動捏造 */
  readonly modelVersion?: string;
  readonly engine?: AsrEngine;
}

export interface AsrAdapter {
  readonly kind: 'asr';
  transcribe(
    audio: Uint8Array,
    language: string,
    session: SessionLike,
    requestId: string
  ): Promise<TranscriptionResult>;
}

export interface LlmSuccess {
  readonly status: 'OK';
  readonly text: string;
  readonly modelVersion: string;
  readonly latencyMs: number;
  readonly requestId: string;
  readonly notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED';
}

export type LlmResult = LlmSuccess | NotDeployed;

export interface LlmAdapterOptions {
  /** 本機小模型 HTTP 端點；未設定即 NOT_DEPLOYED */
  readonly endpointUrl?: string;
  readonly modelVersion?: string;
  readonly fetchImpl?: typeof fetch;
}

export interface LlmAdapter {
  readonly kind: 'llm';
  complete(prompt: string, session: SessionLike, requestId: string): Promise<LlmResult>;
}

/** 系統防呆指引：LLM 只能讀取與草擬，不得改帳或執行 SQL */
export const AI_SYSTEM_GUARD =
  '僅可讀取與產生草稿；不得直接寫入資料庫、不得產生或執行 SQL；' +
  '高風險改帳只做差異預覽並經雙人覆核；高風險欄位須逐字回顯確認；全數合成資料。';

function denied(requestId: string, reason: string): NotDeployed {
  return { status: 'NOT_DEPLOYED', code: 'NOT_DEPLOYED', reason, requestId };
}

/** 建立 ASR 適配器：未明確啟用或無引擎時一律回 NOT_DEPLOYED */
export function createAsrAdapter(options: AsrAdapterOptions = {}): AsrAdapter {
  return {
    kind: 'asr',
    async transcribe(audio, language, session, requestId) {
      if (!options.enabled) return denied(requestId, 'ASR_MODEL_NOT_INSTALLED');
      if (!options.engine) return denied(requestId, 'ASR_ENGINE_NOT_INJECTED');
      if (!options.modelVersion) return denied(requestId, 'ASR_MODEL_VERSION_UNKNOWN');

      const started = Date.now();
      const result = await options.engine({ audio, language, session, requestId });
      return {
        status: 'OK',
        ...result,
        latencyMs: Math.max(0, Date.now() - started),
        requestId,
        notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED'
      };
    }
  };
}

/** 建立本機 LLM 適配器：端點未設定或協定不符即 NOT_DEPLOYED */
export function createLlmAdapter(options: LlmAdapterOptions = {}): LlmAdapter {
  return {
    kind: 'llm',
    async complete(prompt, session, requestId) {
      const raw = options.endpointUrl?.trim();
      if (!raw) return denied(requestId, 'LLM_ENDPOINT_NOT_CONFIGURED');

      let url: URL;
      try {
        url = new URL(raw);
      } catch {
        return denied(requestId, 'LLM_ENDPOINT_INVALID');
      }
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return denied(requestId, 'LLM_ENDPOINT_UNSUPPORTED_PROTOCOL');
      }

      const doFetch = options.fetchImpl ?? globalThis.fetch;
      const started = Date.now();
      try {
        const response = await doFetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            model: options.modelVersion ?? 'unspecified',
            prompt,
            guard: AI_SYSTEM_GUARD,
            sessionId: session.sessionId,
            requestId
          })
        });
        if (!response.ok) return denied(requestId, `LLM_UPSTREAM_HTTP_${response.status}`);
        const payload = (await response.json()) as { text?: unknown; modelVersion?: unknown };
        if (typeof payload.text !== 'string' || payload.text.length === 0) {
          return denied(requestId, 'LLM_UPSTREAM_EMPTY_RESPONSE');
        }
        return {
          status: 'OK',
          text: payload.text,
          modelVersion:
            typeof payload.modelVersion === 'string'
              ? payload.modelVersion
              : (options.modelVersion ?? 'unspecified'),
          latencyMs: Math.max(0, Date.now() - started),
          requestId,
          notice: 'SYNTHETIC_DEMO / PROTOTYPE_NOT_APPROVED'
        };
      } catch {
        return denied(requestId, 'LLM_UPSTREAM_UNREACHABLE');
      }
    }
  };
}
