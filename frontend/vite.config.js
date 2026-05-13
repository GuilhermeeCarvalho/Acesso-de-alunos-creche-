import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
      '/alunos': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
      '/funcionarios': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
      '/registro': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false,
      },
    }
  },
})
