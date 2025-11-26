import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⚠️ এটি সবচেয়ে গুরুত্বপূর্ণ লাইন। তোমার রিপোজিটরির নাম এখানে থাকতে হবে।
  base: "/studydashboardfinal/", 
  build: {
    outDir: 'dist',
  },
})
