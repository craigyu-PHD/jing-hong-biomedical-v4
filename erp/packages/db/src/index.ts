/**
 * @anubis/db｜資料庫連線與租界（legal entity）上下文
 * 合規防呆設計／風險提醒：
 * 1. 未設定 DATABASE_URL 時標 NOT_CONFIGURED，不拋錯、不讓 API 啟動失敗。
 * 2. 所有交易表以 legal_entity_id 分隔；連線必須先 set_config('app.legal_entity_id', ...)。
 * 3. 金額一律 NUMERIC(18,0) 整數分；禁用 float。全部為 SYNTHETIC_DEMO，PROTOTYPE_NOT_APPROVED。
 */
import pg from 'pg';
import type { LegalEntityId } from '@anubis/contracts';

const { Pool } = pg;

/** 合規防呆設計／風險提醒：未設定環境變數是可預期狀態，不是例外。 */
export type DbStatus = 'READY' | 'NOT_CONFIGURED';

export interface DbHandle {
  status: DbStatus;
  /** 僅在 READY 時非 undefined；呼叫端必須先檢查 status。 */
  pool?: pg.Pool;
  reason?: string;
}

let cached: DbHandle | undefined;

/**
 * 建立（並快取）連線池。
 * 合規防呆設計／風險提醒：DATABASE_URL 缺失時回 NOT_CONFIGURED；禁止把連線字串寫入 log。
 */
export function createPool(options: { databaseUrl?: string; forceNew?: boolean } = {}): DbHandle {
  if (cached && !options.forceNew) return cached;

  const databaseUrl = options.databaseUrl ?? process.env.DATABASE_URL;
  if (!databaseUrl) {
    cached = { status: 'NOT_CONFIGURED', reason: 'DATABASE_URL 未提供（合規防呆設計／風險提醒：不接受隱式預設連線）' };
    return cached;
  }

  cached = {
    status: 'READY',
    // 合規防呆設計／風險提醒：最大連線數保守，避免合成環境被誤當正式負載。
    pool: new Pool({ connectionString: databaseUrl, max: 10 })
  };
  return cached;
}

export interface HealthResult {
  ok: boolean;
  status: DbStatus;
  detail: string;
}

/**
 * 健康檢查：不連真 DB 也可回傳穩定結果，供 /health 使用。
 * 合規防呆設計／風險提醒：錯誤訊息只回 generic detail，不回連線字串或憑證。
 */
export async function healthCheck(handle: DbHandle = createPool()): Promise<HealthResult> {
  if (handle.status === 'NOT_CONFIGURED' || !handle.pool) {
    return { ok: false, status: 'NOT_CONFIGURED', detail: handle.reason ?? '資料庫未設定' };
  }
  try {
    await handle.pool.query('SELECT 1 AS ok');
    return { ok: true, status: 'READY', detail: '資料庫連線正常（SYNTHETIC_DEMO）' };
  } catch {
    return { ok: false, status: 'READY', detail: '資料庫連線失敗（合規防呆設計／風險提醒：請由管理員檢查，勿在 API 回傳堆疊）' };
  }
}

/**
 * 設定交易用的 RLS 上下文。
 * 合規防呆設計／風險提醒：必須在同一個 client 上呼叫；禁止跨請求共用 client，避免租界串味。
 */
export async function setLegalEntityContext(
  client: pg.PoolClient,
  legalEntityId: LegalEntityId
): Promise<void> {
  await client.query("SELECT set_config('app.legal_entity_id', $1, true)", [legalEntityId]);
}

/** 清空上下文，避免連線歸還池後殘留。 */
export async function clearLegalEntityContext(client: pg.PoolClient): Promise<void> {
  await client.query("SELECT set_config('app.legal_entity_id', '', true)");
}

/** 測試或重建快取用。合規防呆設計／風險提醒：僅供行程內使用，不可暴露成公開 API。 */
export function resetPoolCache(): void {
  cached = undefined;
}
