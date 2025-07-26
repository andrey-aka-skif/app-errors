import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'appErrors',
      fileName: format => `index.${format}.js`,
    },
  },
})
