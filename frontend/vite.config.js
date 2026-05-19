import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const target = process.env.VITE_API_PROXY_TARGET || 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    },
    proxy: {
      '/auth': {
        target,
        changeOrigin: true,
        secure: false,
      },
      '/alunos': {
        target,
        changeOrigin: true,
        secure: false,
      },
      '/funcionarios': {
        target,
        changeOrigin: true,
        secure: false,
      },
      '/registro': {
        target,
        changeOrigin: true,
        secure: false,
      },
    }
  },
})
