import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// PENTING untuk GitHub Pages: ganti '/toko-online/' di bawah dengan
// '/<nama-repo-github-kamu>/' sebelum build & deploy. Kalau situs akan
// diakses dari domain root (bukan github.io/nama-repo), ganti jadi '/'.
export default defineConfig({
  plugins: [react()],
  base: '/aisyrienne-fashion-house/',
})
