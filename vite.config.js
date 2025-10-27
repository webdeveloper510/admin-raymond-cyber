import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // 👇 Only use /admin/ base path for production build
  base: mode === 'production' ? '/admin/' : '/',
}))
