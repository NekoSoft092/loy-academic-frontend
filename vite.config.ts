import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(async () => ({
  resolve: {
    alias: {
      '@': '/src'
    }
  },

  plugins: [react()],

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true
  },

  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: (process.env.TAURI_DEBUG == null) ? 'esbuild' : false,
    sourcemap: process.env.TAURI_DEBUG == null ? false : 'inline',
  }
}))
