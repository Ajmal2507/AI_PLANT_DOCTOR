import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
// ──────────────
// Vite is the build tool that runs our React app.
// This config sets up the React plugin and a proxy so API calls work.

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // React runs on port 5173
    proxy: {
      // Any request starting with /api will be forwarded to Django
      // This avoids CORS issues during development
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
