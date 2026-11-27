/**
 * 金額運算｜一律整數分（cents），禁止 float
 * 合規防呆設計／風險提醒：所有加總、分攤、尾差皆在此處理；
 * 分期尾差記載於最後一期；不得用 Number 小數直接運算金額。
 */

export function addCents(...values: number[]): number {
  return values.reduce((s, v) => s + v, 0);
}

/** 平均每段（整數分，四捨五入到分） */
export function splitEvenly(totalCents: number, parts: number): number[] {
  if (!Number.isInteger(totalCents) || parts < 1 || !Number.isInteger(parts)) throw new Error('INVALID_INPUT');
  const base = Math.floor(totalCents / parts);
  const remainder = totalCents - base * parts;
  const out = new Array(parts).fill(base);
  // 餘數分攤到前面幾期，最後一期不再有尾差（若需尾差在最後一期，用 splitWithTail）
  for (let i = 0; i < remainder; i++) out[i] = (out[i] as number) + 1;
  return out;
}

/** 分期：尾差放最後一期 */
export function splitWithTail(totalCents: number, parts: number): number[] {
  if (!Number.isInteger(totalCents) || parts < 1 || !Number.isInteger(parts)) throw new Error('INVALID_INPUT');
  const per = Math.floor(totalCents / parts);
  const out = new Array(parts).fill(per);
  out[parts - 1] = totalCents - per * (parts - 1);
  return out;
}

/** 多筆金額依權重分攤，尾差給最後一筆 */
export function allocateByWeight(totalCents: number, weights: number[]): number[] {
  const sum = weights.reduce((s, w) => s + w, 0);
  if (sum <= 0) throw new Error('INVALID_WEIGHT');
  const raw = weights.map(w => (totalCents * w) / sum);
  const out = raw.map(v => Math.floor(v));
  let used = out.reduce((s, v) => s + v, 0);
  for (let i = 0; i < out.length && used < totalCents; i++) { (out[i] as number)++; used++; }
  return out;
}

/** 收款沖銷：部分收款、超收、折讓；回傳未收與超收 */
export function settle(billedCents: number, collectedCents: number, discountCents = 0) {
  if (![billedCents, collectedCents, discountCents].every(Number.isInteger)) throw new Error('INVALID_INPUT');
  const effectiveBilled = billedCents - discountCents;
  const outstandingCents = Math.max(0, effectiveBilled - collectedCents);
  const overpayCents = Math.max(0, collectedCents - effectiveBilled);
  const status = overpayCents > 0 ? 'overpaid' : outstandingCents === 0 ? 'settled' : collectedCents > 0 ? 'partial' : 'open';
  return { outstandingCents, overpayCents, status: status as 'overpaid' | 'settled' | 'partial' | 'open' };
}

/** 格式化顯示（僅供畫面，不用于計算） */
export function formatTwd(cents: number): string {
  return `NT$${(cents / 100).toLocaleString('zh-TW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
