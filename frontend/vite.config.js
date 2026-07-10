import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Actively compiles Tailwind v4 directives smoothly
  ],
  // Vercel serves applications from the root folder, so we use '/'
  base: '/', 
})