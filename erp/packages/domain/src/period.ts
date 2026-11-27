/**
 * 25 日切帳｜Asia/Taipei 半開區間 [前月26日, 當月26日)
 * 合規防呆設計／風險提醒：時區固定 Asia/Taipei，不用本地時區；
 * 金額由 money.ts 整數分處理，本檔只處理期間邊界。
 */

/** 依「所屬月份 YYYY-MM」回切帳區間（半開區間） */
export function billingWindow(period: string): { start: string; end: string } {
  if (!/^\d{4}-\d{2}$/.test(period)) throw new Error(`INVALID_PERIOD: ${period}`);
  const [y, m] = period.split('-').map(Number) as [number, number];
  if (m < 1 || m > 12) throw new Error(`INVALID_PERIOD: ${period}`);
  // 當月 26 日 00:00:00+08:00；起點為前月 26 日
  const endMonth = new Date(Date.UTC(y, m - 1, 26, 0, 0, 0)); // UTC 00:00 == Taipei 08:00
  const startMonth = new Date(Date.UTC(y, m - 2, 26, 0, 0, 0));
  const fmt = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  return { start: fmt(startMonth), end: fmt(endMonth) };
}

/** 依交易日期（YYYY-MM-DD）判定歸屬切帳月份 */
export function periodOfDate(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`INVALID_DATE: ${date}`);
  const day = Number(date.slice(8, 10));
  let [y, m] = [Number(date.slice(0, 4)), Number(date.slice(5, 7))];
  if (day >= 26) {
    // 26 日起歸入下個月
    if (m === 12) { y += 1; m = 1; } else { m += 1; }
  }
  return `${y}-${String(m).padStart(2, '0')}`;
}

/** 判斷日期是否落在半開區間 [start, end) */
export function inWindow(date: string, start: string, end: string): boolean {
  return date >= start && date < end;
}
