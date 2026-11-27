# @anubis/device-gateway｜設備事件唯讀閘道

## 合規防呆設計／風險提醒

- 本套件**只讀**設備事件，沒有任何寫入、下達指令或遠端控制的入口。
- 未取得唯讀授權 → `OUT_OF_SCOPE`；無可用介面（含網路介面）→ `UNSUPPORTED`；不在清單的設備 → `UNSUPPORTED`。
- 未注入探測器或探測失敗 → `NOT_CONNECTED` 且 `observed: false`，**不假裝已接、不偽造事件**。
- 即使注入探測器並回報已連線，部署狀態仍是 `DEFERRED`，不輸出事件內容。
- `requestId` 去重；重複請求回 `DUPLICATE_IGNORED`，不再探測。
- 不含真實設備資料、IP、憑證；回應一律標記 `SYNTHETIC_DEMO`，`PROTOTYPE_NOT_APPROVED`。

## 設備清單與狀態

| 設備 ID | 名稱 | 介面 | 用途 | 部署狀態 | 讀取狀態 |
|---|---|---|---|---|---|
| `epson-lq-690cii` | EPSON LQ-690CII 點陣印表機 | PARALLEL | 列印（唯讀狀態） | `DEFERRED` | `NOT_CONNECTED` |
| `nas-01` | NAS 網路儲存裝置 | NETWORK | 儲存狀態（唯讀） | `DEFERRED` | `NOT_CONNECTED` |
| `ups-01` | UPS 不斷電系統 | USB | 電力狀態（唯讀） | `DEFERRED` | `NOT_CONNECTED` |
| `scanner-future` | 未來條碼／文件掃描器（預留） | HID | 掃描事件（未來預留） | `DEFERRED` | `NOT_CONNECTED` |

> 上表為原型現況，不代表設備已採購、已安裝或已上線。正式接設備前須另行完成授權、介面盤點與資安審核。

## 使用方式

```ts
import { createDeviceGateway } from '@anubis/device-gateway';

const gateway = createDeviceGateway(); // 不注入探測器 → 一律 NOT_CONNECTED
const devices = gateway.listDevices();
const result = await gateway.readDeviceEvent({
  requestId: 'req-001',
  deviceId: 'epson-lq-690cii',
  authorized: true,
  interfaceAvailable: true
});
// result.status === 'NOT_CONNECTED'，result.observed === false
```

## 測試

```bash
pnpm --filter @anubis/device-gateway test
```
