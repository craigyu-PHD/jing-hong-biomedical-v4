import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 合規防呆設計／風險提醒：本設定僅供本機原型連接到尚未完成的後端；
// SYNTHETIC_DEMO、PROTOTYPE_NOT_APPROVED，非正式上線。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        // 合規防呆設計／風險提醒：前端 API_BASE=/api，後端路由為 /products、/auth/login。
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // 合規防呆設計／風險提醒：preview 也要代理，否則「API 已連線」無法在預覽模式驗收。
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        // 合規防呆設計／風險提醒：前端 API_BASE=/api，後端路由為 /products、/auth/login。
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
