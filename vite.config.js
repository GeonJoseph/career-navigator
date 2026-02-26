import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Only use the GitHub Pages base path in production builds.
  // During local dev (npm run dev) we serve from root '/'.
  base: mode === 'production' ? '/career-navigator/' : '/',
}))
