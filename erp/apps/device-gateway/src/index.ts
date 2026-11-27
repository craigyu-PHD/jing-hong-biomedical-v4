/**
 * @anubis/device-gateway｜設備事件唯讀閘道
 * 合規防呆設計／風險提醒：
 * 1) 只讀事件，不提供任何寫入／下達指令的介面；所有設備 deployment 皆為 DEFERRED；
 * 2) 未授權回 OUT_OF_SCOPE，無可用介面回 UNSUPPORTED，未知設備回 UNSUPPORTED；
 * 3) 未明確探測到連線一律 NOT_CONNECTED 且 observed=false，不假裝已接、不偽造事件；
 * 4) requestId 去重，重複請求不再次探測；不含任何真實設備資料（SYNTHETIC_DEMO）。
 */

export type DeviceStatus =
  | 'NOT_CONNECTED'
  | 'UNSUPPORTED'
  | 'OUT_OF_SCOPE'
  | 'DEFERRED'
  | 'DUPLICATE_IGNORED'
  | 'INVALID_REQUEST';

export type DeviceInterface = 'PARALLEL' | 'USB' | 'NETWORK' | 'HID';
export type DeviceCapability = 'print' | 'storage' | 'power' | 'scan';

export interface DeviceDescriptor {
  readonly id: string;
  readonly label: string;
  readonly interfaceType: DeviceInterface;
  readonly capability: DeviceCapability;
  /** 全部延期部署：本套件不啟用任何真實設備 */
  readonly deployment: 'DEFERRED';
  readonly scope: 'READ_ONLY';
}

/** 設備清單（型號與未來預留）；狀態一律 DEFERRED / NOT_CONNECTED */
export const DEVICE_CATALOG: readonly DeviceDescriptor[] = [
  {
    id: 'epson-lq-690cii',
    label: 'EPSON LQ-690CII 點陣印表機',
    interfaceType: 'PARALLEL',
    capability: 'print',
    deployment: 'DEFERRED',
    scope: 'READ_ONLY'
  },
  {
    id: 'nas-01',
    label: 'NAS 網路儲存裝置',
    interfaceType: 'NETWORK',
    capability: 'storage',
    deployment: 'DEFERRED',
    scope: 'READ_ONLY'
  },
  {
    id: 'ups-01',
    label: 'UPS 不斷電系統',
    interfaceType: 'USB',
    capability: 'power',
    deployment: 'DEFERRED',
    scope: 'READ_ONLY'
  },
  {
    id: 'scanner-future',
    label: '未來條碼／文件掃描器（預留）',
    interfaceType: 'HID',
    capability: 'scan',
    deployment: 'DEFERRED',
    scope: 'READ_ONLY'
  }
];

export interface DeviceEventRequest {
  readonly requestId: string;
  readonly deviceId: string;
  /** 是否具備該設備的唯讀授權 */
  readonly authorized: boolean;
  /** 是否存在可用網路／實體介面 */
  readonly interfaceAvailable: boolean;
  /** 事件內容僅在 OK 且有探測證據時才會輸出；本套件預設永不輸出 */
  readonly event?: unknown;
}

export interface DeviceProbe {
  readonly connected: boolean;
  readonly source: 'INJECTED_PROBE';
}

export type ProbeFn = (deviceId: string) => DeviceProbe | Promise<DeviceProbe>;

export interface DeviceEventResult {
  readonly status: DeviceStatus;
  readonly requestId: string;
  readonly deviceId: string;
  readonly at: string;
  /** 是否真的觀察到設備；未探測成功一律 false */
  readonly observed: boolean;
  readonly reason: string;
  readonly readOnly: true;
  readonly source: 'SYNTHETIC_DEMO';
}

export interface DeviceGatewayOptions {
  /** 由部署方注入的真實探測器；未提供一律視為未連接 */
  readonly probe?: ProbeFn;
  readonly now?: () => Date;
}

export interface DeviceGateway {
  listDevices(): readonly DeviceDescriptor[];
  readDeviceEvent(request: DeviceEventRequest): Promise<DeviceEventResult>;
}

function result(
  status: DeviceStatus,
  requestId: string,
  deviceId: string,
  reason: string,
  at: string,
  observed = false
): DeviceEventResult {
  return {
    status,
    requestId,
    deviceId,
    at,
    observed,
    reason,
    readOnly: true,
    source: 'SYNTHETIC_DEMO'
  };
}

export function createDeviceGateway(options: DeviceGatewayOptions = {}): DeviceGateway {
  // requestId 去重：同一請求只處理一次，避免重複讀取或重複探測。
  const seen = new Set<string>();

  return {
    listDevices: () => DEVICE_CATALOG,

    async readDeviceEvent(request) {
      const now = options.now ?? (() => new Date());
      const at = now().toISOString();
      const requestId = typeof request?.requestId === 'string' ? request.requestId : '';
      const deviceId = typeof request?.deviceId === 'string' ? request.deviceId : '';

      if (!requestId || !deviceId) {
        return result('INVALID_REQUEST', requestId, deviceId, 'requestId/deviceId 無效', at);
      }
      if (seen.has(requestId)) {
        return result('DUPLICATE_IGNORED', requestId, deviceId, 'requestId 重複，已忽略', at);
      }
      seen.add(requestId);

      const device = DEVICE_CATALOG.find(d => d.id === deviceId);
      if (!device) {
        return result('UNSUPPORTED', requestId, deviceId, '設備不在支援清單', at);
      }
      if (request.authorized !== true) {
        return result('OUT_OF_SCOPE', requestId, deviceId, '未取得唯讀授權', at);
      }
      if (request.interfaceAvailable !== true) {
        return result('UNSUPPORTED', requestId, deviceId, '無可用介面（含網路介面）', at);
      }

      // 沒有注入探測器就一律 NOT_CONNECTED；絕不憑空判定已連線。
      if (!options.probe) {
        return result('NOT_CONNECTED', requestId, deviceId, '未提供設備探測器，視為未連接', at);
      }
      let probe: DeviceProbe;
      try {
        probe = await options.probe(deviceId);
      } catch {
        return result('NOT_CONNECTED', requestId, deviceId, '設備探測失敗，視為未連接', at);
      }
      if (probe.connected !== true) {
        return result('NOT_CONNECTED', requestId, deviceId, '探測結果為未連接', at);
      }

      // 即使探測到設備，部署狀態仍是 DEFERRED：不輸出事件內容、不假裝已上線。
      return result('DEFERRED', requestId, deviceId, '設備已探測但部署延期，尚未啟用事件讀取', at, true);
    }
  };
}
