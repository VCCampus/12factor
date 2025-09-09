import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  
  // 安装 Pinia 状态管理
  app.use(Pinia.createPinia())
  
  return {
    app,
    Pinia
  }
}