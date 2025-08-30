<template>
  <AppLayout>
    <!-- 主容器 -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- 标题卡片 -->
      <div class="neo-card mb-8">
        <h1 class="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          加密货币恐慌与贪婪指数
        </h1>
      </div>

      <!-- 图片展示卡片 -->
      <div class="neo-card mb-6">
        <!-- 图片容器 -->
        <div class="image-container relative">
          <!-- 加载指示器 -->
          <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
          </div>
          
          <!-- 主图片 -->
          <img 
            v-show="!isLoading && !hasError"
            ref="indexImage"
            :src="imageSrc"
            alt="Crypto Fear & Greed Index"
            @load="handleImageLoad"
            @error="handleImageError"
            class="w-full h-auto"
          />
          
          <!-- 错误状态 -->
          <div v-if="hasError" class="error-state p-8 text-center">
            <p class="text-red-600 dark:text-red-400 mb-4">图片暂时无法显示</p>
            <a 
              :href="cryptoDashboardUrl" 
              target="_blank"
              rel="noopener noreferrer"
              class="neo-btn-secondary inline-flex items-center"
            >
              <span>访问源网站</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
        
        <!-- 更新时间 -->
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
          数据更新于：{{ updateDate }}
        </p>
      </div>

      <!-- 数据源链接 -->
      <div class="text-center">
        <a 
          :href="cryptoDashboardUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="neo-btn-secondary inline-flex items-center"
        >
          <span>Crypto Dashboard</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <!-- 指数说明卡片 -->
      <div class="neo-card mt-8">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">📊 指数说明</h2>
        <div class="space-y-2 text-gray-700 dark:text-gray-300">
          <div class="flex items-center">
            <span class="inline-block w-20 h-4 bg-red-500 mr-3"></span>
            <span>0-25: 极度恐慌 (Extreme Fear)</span>
          </div>
          <div class="flex items-center">
            <span class="inline-block w-20 h-4 bg-orange-500 mr-3"></span>
            <span>25-50: 恐慌 (Fear)</span>
          </div>
          <div class="flex items-center">
            <span class="inline-block w-20 h-4 bg-yellow-500 mr-3"></span>
            <span>50-75: 贪婪 (Greed)</span>
          </div>
          <div class="flex items-center">
            <span class="inline-block w-20 h-4 bg-green-500 mr-3"></span>
            <span>75-100: 极度贪婪 (Extreme Greed)</span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

// 状态管理
const isLoading = ref(true)
const hasError = ref(false)
const updateDate = ref('')
const imageSrc = '/fear-and-greed-index.png'
const cryptoDashboardUrl = 'https://alternative.me/crypto/'
const indexImage = ref(null)

// 图片加载处理
const handleImageLoad = () => {
  isLoading.value = false
  // 获取文件修改时间
  getUpdateDate()
}

// 图片错误处理
const handleImageError = () => {
  isLoading.value = false
  hasError.value = true
}

// 获取更新日期
const getUpdateDate = async () => {
  try {
    const response = await fetch(imageSrc, { method: 'HEAD' })
    const lastModified = response.headers.get('last-modified')
    if (lastModified) {
      const date = new Date(lastModified)
      updateDate.value = date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '.')
    } else {
      setCurrentDate()
    }
  } catch (error) {
    // 如果无法获取，使用当前日期
    setCurrentDate()
  }
}

// 设置当前日期
const setCurrentDate = () => {
  const now = new Date()
  updateDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit'
  }).replace(/\//g, '.')
}

// 懒加载实现
onMounted(async () => {
  await nextTick()
  
  const imageElement = indexImage.value
  
  if ('IntersectionObserver' in window && imageElement) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 图片进入视口，触发加载
          imageObserver.unobserve(entry.target)
        }
      })
    }, {
      rootMargin: '50px'
    })
    
    imageObserver.observe(imageElement)
  }
})
</script>

<style scoped>
/* 加载指示器样式 */
.loading-indicator {
  @apply flex flex-col items-center justify-center py-16;
}

.spinner {
  @apply w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin;
}

/* 图片容器样式 */
.image-container {
  @apply border-4 border-black bg-white dark:bg-gray-800 p-4;
  box-shadow: 8px 8px 0px 0px #000;
}

/* 错误状态样式 */
.error-state {
  @apply bg-red-50 dark:bg-red-900/20;
}

/* Neo-brutalism 卡片样式 */
.neo-card {
  @apply bg-white dark:bg-gray-800 border-4 border-black p-6 relative;
  box-shadow: 8px 8px 0px 0px #000;
}

/* Neo-brutalism 按钮样式 */
.neo-btn-secondary {
  @apply px-6 py-3 bg-white dark:bg-gray-800 text-black dark:text-white border-4 border-black font-bold transition-all;
  box-shadow: 4px 4px 0px 0px #000;
}

.neo-btn-secondary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px 0px #000;
}

.neo-btn-secondary:active {
  transform: translate(0, 0);
  box-shadow: 2px 2px 0px 0px #000;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .neo-card {
    box-shadow: 4px 4px 0px 0px #000;
  }
  
  .image-container {
    box-shadow: 4px 4px 0px 0px #000;
  }
}

/* 暗模式优化 */
@media (prefers-color-scheme: dark) {
  .neo-card,
  .image-container {
    box-shadow: 8px 8px 0px 0px #6b7280;
  }
  
  .neo-btn-secondary {
    box-shadow: 4px 4px 0px 0px #6b7280;
  }
  
  .neo-btn-secondary:hover {
    box-shadow: 6px 6px 0px 0px #6b7280;
  }
  
  .neo-btn-secondary:active {
    box-shadow: 2px 2px 0px 0px #6b7280;
  }
}
</style>