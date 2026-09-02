import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'appErrors',
      // Расширение `.cjs` у UMD-сборки обязательно: при `"type": "module"`
      // файл с `.js` Node читает как ESM, и обёртка не отрабатывает.
      fileName: format => `index.${format}.${format === 'umd' ? 'cjs' : 'js'}`,
      formats: ['es', 'umd'],
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: 'some',
      },
    },
  },
})
