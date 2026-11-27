/**
 * 合約池與三類單據｜金額池／品項池、提領、展期、轉讓
 * 合規防呆設計／風險提醒：
 * - 補貨單（replacement）紙面總額必為 0，內部扣權益另記，不得混入營收。
 * - 換貨（exchange）不計營收。
 * - 提領不得超過合約剩餘；跨法人不得互用。
 */
import type { Contract, Order, OrderLine, DocumentType } from '@anubis/contracts';

export function remainingCents(c: Contract): number {
  return Math.max(0, c.totalCents - c.drawnCents);
}

/** 金額池提領：超額拒絕 */
export function drawAmount(c: Contract, amountCents: number): Contract {
  if (c.kind !== 'amount_pool') throw new Error('NOT_AMOUNT_POOL');
  if (!Number.isInteger(amountCents) || amountCents <= 0) throw new Error('INVALID_AMOUNT');
  if (amountCents > remainingCents(c)) throw new Error('EXCEEDS_REMAINING');
  if (c.status !== 'active') throw new Error('CONTRACT_NOT_ACTIVE');
  return { ...c, drawnCents: c.drawnCents + amountCents };
}

/** 品項池提領：回傳更新後 quota，超額拒絕 */
export function drawItem(c: Contract, sku: string, qty: number): Contract {
  if (c.kind !== 'item_pool') throw new Error('NOT_ITEM_POOL');
  const quota = c.itemQuota[sku];
  if (quota === undefined || qty <= 0 || qty > quota) throw new Error('EXCEEDS_ITEM_QUOTA');
  return { ...c, itemQuota: { ...c.itemQuota, [sku]: quota - qty } };
}

/** 展期 */
export function extend(c: Contract, newValidTo: string): Contract {
  if (newValidTo <= c.validTo) throw new Error('NEW_END_NOT_AFTER');
  return { ...c, validTo: newValidTo };
}

/** 轉讓（所有權移轉需書面，這裡只標狀態，實際轉讓人由外部授權） */
export function transfer(c: Contract): Contract {
  return { ...c, status: 'transferred' };
}

/** 建立單據：補貨／換貨的金額規則 */
export function buildDocument(input: {
  id: string; legalEntityId: string; customerId: string;
  documentType: DocumentType; lines: OrderLine[]; createdBy: string; createdAt: string;
}): Order {
  const gross = input.lines.reduce((s, l) => s + l.amountCents, 0);
  const isReplacement = input.documentType === 'replacement';
  const isExchange = input.documentType === 'exchange';
  // 補貨紙面 0 元：內部位移記 internalEquityCents；換貨也為 0
  const totalCents = isReplacement || isExchange ? 0 : gross;
  const internalEquityCents = isReplacement ? gross : 0;
  return {
    id: input.id,
    legalEntityId: input.legalEntityId as Order['legalEntityId'],
    customerId: input.customerId,
    documentType: input.documentType,
    lines: input.lines,
    totalCents,
    internalEquityCents,
    status: 'draft',
    createdBy: input.createdBy,
    createdAt: input.createdAt,
    source: 'SYNTHETIC_DEMO'
  };
}

/** 人工核准後才出貨：狀態流轉 */
export function approveOrder(o: Order, approverId: string): Order {
  if (o.status !== 'pending_approval') throw new Error('NOT_PENDING_APPROVAL');
  if (approverId === o.createdBy) throw new Error('SELF_APPROVAL_FORBIDDEN');
  return { ...o, status: 'approved' };
}
