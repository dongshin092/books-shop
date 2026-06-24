import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open : true,
    port: 3000,
        proxy: {
          // 개발 모드: /api 요청을 Spring Boot(8080)로 전달한다.
          '/api': {
            target: 'http://localhost:9090',
            changeOrigin: true,
          },
        },
  },
})