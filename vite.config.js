import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'appErrors',
      fileName: format => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      // Имена классов ошибок попадают в this.name и в стектрейсы —
      // без этого потребитель увидит в логах однобуквенные огрызки.
      keep_classnames: true,
      format: {
        comments: 'some',
      },
    },
  },
})
