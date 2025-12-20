import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        'error-types': fileURLToPath(
          new URL('./src/errorTypes.js', import.meta.url)
        ),
        logic: fileURLToPath(
          new URL('./src/logicAppError.js', import.meta.url)
        ),
        axios: fileURLToPath(
          new URL('./src/axiosNetworkAppError.js', import.meta.url)
        ),
        superagent: fileURLToPath(
          new URL('./src/superagentNetworkAppError.js', import.meta.url)
        ),
      },

      preserveEntrySignatures: 'strict',

      output: {
        dir: 'dist',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },

    sourcemap: false,
    emptyOutDir: true,
  },
})
