import { createPinia } from 'pinia'
import type { App } from 'vue'

const pinia = createPinia()

export function setupPinia(app?: App) {
  if (app) {
    app.use(pinia)
  }
  return pinia
}

// 导出所有store
export { useGrowthStore } from './growthStore'
export { useConfigStore } from './configStore'
export { useProgressStore } from './progressStore'

export default pinia