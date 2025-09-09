import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

export default defineConfig({
  plugins: [
    uni({
      // uni-app 插件选项
    })
  ],
  
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  // 构建配置
  build: {
    // H5端构建输出到项目根目录的dist
    outDir: process.env.UNI_PLATFORM === 'h5' ? '../dist' : 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production'
      }
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split('.').pop()
          if (ext === 'css') {
            return 'css/[name]-[hash].[ext]'
          }
          if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext || '')) {
            return 'img/[name]-[hash].[ext]'
          }
          return 'assets/[name]-[hash].[ext]'
        }
      }
    }
  },
  
  // CSS 配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    },
    postcss: {
      plugins: [
        require('autoprefixer'),
        // 小程序端需要 rpx 转换
        process.env.UNI_PLATFORM?.startsWith('mp-') && require('postcss-rem-to-responsive-pixel')({
          rootValue: 32,
          propList: ['*'],
          transformUnit: 'rpx'
        })
      ].filter(Boolean)
    }
  },
  
  // 开发服务器配置  
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: true,
    open: false
  },
  
  // 环境变量
  define: {
    __UNI_PLATFORM__: JSON.stringify(process.env.UNI_PLATFORM),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },
  
  // 优化配置
  optimizeDeps: {
    include: [
      'pinia',
      '@dcloudio/uni-app',
      '@dcloudio/uni-components'
    ]
  }
})