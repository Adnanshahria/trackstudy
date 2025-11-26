import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: Sets the base path to relative ('') instead of absolute ('/') or './'.
  // This allows the app to work on Vercel (root) AND GitHub Pages (subdirectory) seamlessly.
  base: '',
  server: {
    host: true,
    port: 3000
  },
  build: {
    target: 'es2015'
  },
  esbuild: {
    target: 'es2015'
  }
})