import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import styles
import './styles/neobrutalism.css'
import './styles/responsive.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ Service Worker 注册成功:', registration.scope)
      
      // 监听服务工作线程更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 新版本可用，提示用户刷新
              if (confirm('发现新版本，是否立即更新？')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' })
                window.location.reload()
              }
            }
          })
        }
      })
      
      // 监听服务工作线程消息
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          console.log('Service Worker 已更新')
        }
      })
      
      // 启用后台同步（如果支持）
      if ('sync' in window.ServiceWorkerRegistration.prototype) {
        (registration as any).sync.register('background-sync')
      }
      
    } catch (error) {
      console.error('❌ Service Worker 注册失败:', error)
    }
  })
}