import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    // 性能优化
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // 分块策略
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia']
        },
        // 资源文件名
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    // 压缩大小警告
    chunkSizeWarningLimit: 500,
    // CSS代码分割
    cssCodeSplit: true
  },
  server: {
    port: 5173,
    open: true
  },
  css: {
    postcss: './postcss.config.js'
  }
})