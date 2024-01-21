import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      name: 'dudes',
      fileName: 'dudes'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'default',
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
