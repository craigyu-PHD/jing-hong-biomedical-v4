/**
 * 設備閘道測試（node --test）
 * 合規防呆設計／風險提醒：不接真實設備；注入的探測器也是假的，只驗證拒絕與去重行為。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { createDeviceGateway, DEVICE_CATALOG } from '../src/index.ts';

const base = {
  requestId: 'req-001',
  deviceId: 'epson-lq-690cii',
  authorized: true,
  interfaceAvailable: true
};

test('設備清單全部 DEFERRED / READ_ONLY', () => {
  const gw = createDeviceGateway();
  const devices = gw.listDevices();
  assert.equal(devices.length, 4);
  assert.equal(DEVICE_CATALOG.length, 4);
  for (const device of devices) {
    assert.equal(device.deployment, 'DEFERRED');
    assert.equal(device.scope, 'READ_ONLY');
  }
  assert.deepEqual(
    devices.map(d => d.id),
    ['epson-lq-690cii', 'nas-01', 'ups-01', 'scanner-future']
  );
});

test('未接設備回 NOT_CONNECTED 且不假裝已觀察', async () => {
  const gw = createDeviceGateway({
    now: () => new Date('2026-11-27T00:00:00.000Z')
  });
  const result = await gw.readDeviceEvent(base);
  assert.equal(result.status, 'NOT_CONNECTED');
  assert.equal(result.observed, false);
  assert.equal(result.readOnly, true);
  assert.equal(result.source, 'SYNTHETIC_DEMO');
  assert.equal(result.at, '2026-11-27T00:00:00.000Z');
});

test('未授權／無介面／未知設備分別標 UNSUPPORTED、OUT_OF_SCOPE', async () => {
  const gw = createDeviceGateway();
  const unauthorized = await gw.readDeviceEvent({
    ...base,
    requestId: 'req-002',
    authorized: false
  });
  assert.equal(unauthorized.status, 'OUT_OF_SCOPE');

  const noInterface = await gw.readDeviceEvent({
    ...base,
    requestId: 'req-003',
    interfaceAvailable: false
  });
  assert.equal(noInterface.status, 'UNSUPPORTED');

  const unknown = await gw.readDeviceEvent({
    ...base,
    requestId: 'req-004',
    deviceId: 'unknown-device'
  });
  assert.equal(unknown.status, 'UNSUPPORTED');
});

test('requestId 去重；即使探測到連線仍為 DEFERRED，不輸出事件', async () => {
  let probes = 0;
  const gw = createDeviceGateway({
    probe: () => {
      probes += 1;
      return { connected: true, source: 'INJECTED_PROBE' };
    }
  });
  const first = await gw.readDeviceEvent({ ...base, requestId: 'req-005', event: '機密不該輸出' });
  const second = await gw.readDeviceEvent({ ...base, requestId: 'req-005', event: '機密不該輸出' });

  assert.equal(first.status, 'DEFERRED');
  assert.equal(first.observed, true);
  assert.equal('event' in first, false);
  assert.equal(second.status, 'DUPLICATE_IGNORED');
  assert.equal(probes, 1);
});
