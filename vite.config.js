import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base must match the GitHub repo name so asset paths resolve correctly
// on GitHub Pages (https://<username>.github.io/yale-financial-markets-course/).
export default defineConfig({
  plugins: [react()],
  base: '/yale-financial-markets-course/',
})
