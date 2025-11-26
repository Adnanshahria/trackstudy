import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: Sets the base path to relative ('./') to ensure assets are loaded 
  // from the current directory, fixing blank screen issues on GitHub Pages subdirectories.
  base: './',
  server: {
    host: true,
    port: 3000
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