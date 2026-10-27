import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // INLINE=1 faqat bitta fayllik ko'rinish nusxasi uchun
    assetsInlineLimit: process.env.INLINE ? 100000000 : 4096,
  },
});
