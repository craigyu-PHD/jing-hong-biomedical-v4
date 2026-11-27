/**
 * @anubis/db migration 執行器
 * 合規防呆設計／風險提醒：
 * 1. 只執行 src/migrations/001_init.sql，不自動降版、不自動刪表。
 * 2. 需明確 DATABASE_URL；缺漏時直接結束並提示，不猜測連線目標。
 * 3. 全部物件為合成資料結構；PROTOTYPE_NOT_APPROVED。
 */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool } from './index.js';

const here = dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const handle = createPool();
  if (handle.status !== 'READY' || !handle.pool) {
    console.error('合規防呆設計／風險提醒：DATABASE_URL 未設定，migration 終止（NOT_CONFIGURED）。');
    process.exitCode = 1;
    return;
  }

  // dist/migrate.js -> dist/../src/migrations/001_init.sql
  const sqlPath = join(here, '..', 'src', 'migrations', '001_init.sql');
  const sql = await readFile(sqlPath, 'utf8');
  const client = await handle.pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('migration 001_init 完成（SYNTHETIC_DEMO／PROTOTYPE_NOT_APPROVED）。');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('合規防呆設計／風險提醒：migration 失敗已回滾，請人工確認 schema 狀態。', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await handle.pool.end();
  }
}

void main();
