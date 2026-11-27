/**
 * 權限邊界測試｜合規防呆設計／風險提醒：全數合成資料
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { canWriteData, canAccessEntity, canGrant, canApprove, rlsContext } from '../dist/index.js';

const owner = { id: 'boss', role: 'platform_owner', legalEntityScope: ['LE-01', 'LE-02', 'LE-03'], mfaVerified: true };
const admin = { id: 'admin1', role: 'access_admin', legalEntityScope: ['LE-01'], mfaVerified: true };
const acct = { id: 'acct1', role: 'accounting', legalEntityScope: ['LE-01'], mfaVerified: true };

test('T-AUTH-01 老闆任何業務寫入皆拒（D-008/ADR-001）', () => {
  for (const a of ['product.create', 'order.create', 'receivable.adjust']) {
    assert.equal(canWriteData(owner, a).reason, 'READ_ONLY_OWNER');
  }
  assert.equal(canWriteData(acct, 'receivable.adjust').allowed, true);
});

test('T-AUTH-02 法人範圍 ABAC', () => {
  assert.equal(canAccessEntity(owner, 'LE-02').allowed, true);
  assert.equal(canAccessEntity(acct, 'LE-02').reason, 'ENTITY_OUT_OF_SCOPE');
  assert.equal(canAccessEntity(acct, 'LE-01').allowed, true);
});

test('T-AUTH-03 委派上限與最高權不可下放', () => {
  assert.equal(canGrant(owner, { role: 'platform_owner', ceiling: [], legalEntityScope: ['LE-01'] }, 'x').reason, 'OWNER_ROLE_NON_DELEGABLE');
  assert.equal(canGrant(owner, { role: 'access_admin', ceiling: [], legalEntityScope: ['LE-01'] }, 'boss').reason, 'SELF_GRANT_FORBIDDEN');
  assert.equal(canGrant(admin, { role: 'accounting', ceiling: [], legalEntityScope: ['LE-02'] }, 'x').reason, 'SCOPE_EXCEEDS_GRANTOR');
  assert.equal(canGrant(owner, { role: 'accounting', ceiling: [], legalEntityScope: ['LE-01'] }, 'x').allowed, true);
});

test('T-AUTH-04 自審自核禁止與 MFA', () => {
  assert.equal(canApprove('u1', 'u1').reason, 'SELF_APPROVAL_FORBIDDEN');
  assert.equal(canApprove('u2', 'u1').allowed, true);
  assert.equal(canWriteData({ ...acct, mfaVerified: false }, 'product.create').reason, 'MFA_REQUIRED');
});

test('T-AUTH-05 RLS context 標記老闆唯讀', () => {
  const ctx = rlsContext(owner);
  assert.equal(ctx['app.read_only'], 'true');
  assert.equal(ctx['app.actor_role'], 'platform_owner');
  assert.equal(rlsContext(acct)['app.read_only'], 'false');
});
