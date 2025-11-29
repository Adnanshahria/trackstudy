import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    hmr: {
      clientPort: 5000
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets'
  },
  esbuild: {
    target: 'es2015'
  }
})