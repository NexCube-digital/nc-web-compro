import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['chunk-OU5AQDZK.js'],
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (/node_modules\/(react|react-dom|react-router-dom|react-helmet-async)\//.test(id)) {
            return 'react-vendor'
          }

          if (/node_modules\/three\//.test(id)) {
            return 'three-core'
          }

          if (/node_modules\/@react-three\/(fiber|drei)\//.test(id)) {
            return 'three-react'
          }

          if (/node_modules\/(gsap|animejs)\//.test(id)) {
            return 'animation-vendor'
          }

          if (/node_modules\/(react-icons|lucide-react)\//.test(id)) {
            return 'icons-vendor'
          }

          if (/node_modules\/axios\//.test(id)) {
            return 'network-vendor'
          }

          return
        }
      }
    }
  }
})
