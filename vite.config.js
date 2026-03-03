import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // listen on all interfaces so that the container port mapping works
    host: '0.0.0.0',
    // allow cross-origin requests during development
    cors: true,
    // proxy API calls to backend to avoid CORS issues and keep frontend-only project clean
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
