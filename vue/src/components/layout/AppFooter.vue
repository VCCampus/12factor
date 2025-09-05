<template>
  <footer class="neo-card mt-8 border-t-4 border-border-black">
    <div class="container mx-auto px-4" :class="minimal ? 'py-3' : 'py-6'">
      <!-- 极简模式 -->
      <div v-if="minimal" class="text-center">
        <p class="text-sm text-text-dark">
          © 2024 <RouterLink to="/" class="font-medium hover:text-primary-blue transition-colors">📚 CSS数创学习平台</RouterLink>
        </p>
      </div>
      
      <!-- 标准模式 -->
      <div v-else>
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <!-- Copyright Info -->
          <div class="text-center md:text-left">
            <p class="text-sm text-text-dark font-medium">
              © 2024 <RouterLink to="/" class="hover:text-primary-blue transition-colors">📚 CSS数创学习平台</RouterLink>
            </p>
            <p class="text-xs text-gray-600 mt-1">
              基于CSS数创班8期知识体系
            </p>
          </div>
          
          <!-- Version Info -->
          <div class="text-center md:text-right">
            <p class="text-xs text-gray-600">
              版本 v4.0.0 | Vue 3 + Vite
            </p>
            <p class="text-xs text-gray-500 mt-1">
              🚀 PWA离线支持
            </p>
          </div>
        </div>
        
        <!-- 数据管理区域 -->
        <div class="mt-4 pt-4 border-t-2 border-border-black">
          <div class="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span class="text-gray-600">📊 数据管理：</span>
            <button 
              @click="exportData"
              class="neo-btn-text hover:text-primary-blue transition-colors"
            >
              导出学习数据
            </button>
            <span class="text-gray-400">|</span>
            <button 
              @click="clearCache"
              class="neo-btn-text hover:text-error-red transition-colors"
            >
              清除缓存
            </button>
            <span class="text-gray-400">|</span>
            <span class="text-xs text-gray-500">
              存储空间: {{ storageSize }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Progress Stats (Optional) -->
      <div v-if="showStats" class="mt-4 pt-4 border-t-2 border-border-black">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="neo-card p-3">
            <div class="text-lg font-bold text-primary-blue">21</div>
            <div class="text-xs text-gray-600">核心概念</div>
          </div>
          <div class="neo-card p-3">
            <div class="text-lg font-bold text-primary-blue">5</div>
            <div class="text-xs text-gray-600">学习模块</div>
          </div>
          <div class="neo-card p-3">
            <div class="text-lg font-bold text-primary-blue">193</div>
            <div class="text-xs text-gray-600">测试题目</div>
          </div>
          <div class="neo-card p-3">
            <div class="text-lg font-bold text-primary-blue">100%</div>
            <div class="text-xs text-gray-600">离线可用</div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import dataManager from '@/utils/dataManager'

// Optional: Show statistics in footer, minimal mode
defineProps<{
  showStats?: boolean
  minimal?: boolean
}>()

// 存储空间大小
const storageSize = ref('0 KB')

// 导出数据
const exportData = () => {
  dataManager.export()
}

// 清除缓存
const clearCache = () => {
  dataManager.clear()
  updateStorageSize()
}

// 更新存储空间显示
const updateStorageSize = () => {
  storageSize.value = dataManager.getSizeFormatted()
}

// 组件挂载时更新存储空间
onMounted(() => {
  updateStorageSize()
})
</script>

<style scoped>
/* Footer特定样式 */
footer {
  border-bottom: none;
  box-shadow: none;
}

/* Stats cards in footer */
.neo-card {
  box-shadow: 2px 2px 0px theme('colors.border-black');
}
</style>