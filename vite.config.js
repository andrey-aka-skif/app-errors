import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const entries = {
  'error-types': fileURLToPath(new URL('./src/errorTypes.js', import.meta.url)),
  logic: fileURLToPath(new URL('./src/logicAppError.js', import.meta.url)),
  axios: fileURLToPath(
    new URL('./src/axiosNetworkAppError.js', import.meta.url)
  ),
  superagent: fileURLToPath(
    new URL('./src/superagentNetworkAppError.js', import.meta.url)
  ),
}

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: entries,
      output: [
        {
          dir: 'dist/es',
          format: 'es',
          entryFileNames: '[name].js',
          preserveModules: false,
          exports: 'named',
        },
        {
          dir: 'dist/umd',
          format: 'umd',
          entryFileNames: '[name].umd.js',
          name: 'appErrors',
          globals: {},
          exports: 'named',
        },
      ],
      external: [],
    },
    minify: 'terser',
    terserOptions: {
      format: {
        comments: 'some',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
