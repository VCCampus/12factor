<template>
  <AppLayout>
    <!-- 主容器 -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Critical Error State -->
      <div v-if="criticalError" class="neo-card mb-8 bg-red-50 dark:bg-red-900/20 border-red-500">
        <h2 class="text-xl font-bold mb-2 text-red-800 dark:text-red-200">❌ 系统错误</h2>
        <p class="text-red-700 dark:text-red-300 mb-4">{{ criticalError }}</p>
        <button @click="handleRefresh" class="neo-btn-small bg-red-500 text-white">
          🔄 重试加载
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-else-if="!isInitialized" class="neo-card mb-8">
        <div class="flex items-center justify-center py-8">
          <div class="spinner mr-4"></div>
          <span class="text-lg text-gray-600 dark:text-gray-400">初始化市场数据...</span>
        </div>
      </div>
      
      <!-- Normal Content -->
      <template v-else>
      
      <!-- 标题卡片 -->
      <div class="neo-card mb-8">
        <h1 class="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          市场情绪指数
        </h1>
        <p class="text-center text-gray-600 dark:text-gray-400">
          实时监控加密货币市场恐慌与贪婪情绪
        </p>
      </div>

      <!-- 数据刷新控制 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <div class="status-indicator flex items-center gap-2">
            <span class="status-dot" :class="statusDotClass"></span>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ statusText }}</span>
          </div>
          <span v-if="lastUpdateTime" class="text-xs text-gray-500 dark:text-gray-400">
            最后更新: {{ lastUpdateTime }}
          </span>
        </div>
        
        <button 
          @click="handleRefresh"
          :disabled="marketStore.loading"
          class="neo-btn-small flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': marketStore.loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          刷新数据
        </button>
      </div>

      <!-- 数据卡片网格 -->
      <div class="data-cards-grid grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- 有知有行温度计卡片 -->
        <DataCard
          v-if="marketStore.youzhiyouxingData || marketStore.loading || marketStore.error"
          title="有知有行市场温度"
          :data="marketStore.youzhiyouxingData || {}"
          :loading="marketStore.loading && !marketStore.youzhiyouxingData"
          :error="!!(marketStore.error && !marketStore.youzhiyouxingData)"
          :error-message="marketStore.error || undefined"
          :fallback-data="marketStore.youzhiyouxingData?.stale ? marketStore.youzhiyouxingData : null"
          source="youzhiyouxing"
        />
        
        <!-- CoinMarketCap恐慌贪婪指数卡片 -->
        <DataCard
          v-if="marketStore.coinmarketcapData || marketStore.loading || marketStore.error"
          title="CoinMarketCap恐慌贪婪指数"
          :data="marketStore.coinmarketcapData || {}"
          :loading="marketStore.loading && !marketStore.coinmarketcapData"
          :error="!!(marketStore.error && !marketStore.coinmarketcapData)"
          :error-message="marketStore.error || undefined"
          :fallback-data="marketStore.coinmarketcapData?.stale ? marketStore.coinmarketcapData : null"
          source="coinmarketcap"
        />
      </div>

      <!-- 数据源链接 -->
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <a 
          href="https://youzhiyouxing.cn/data"
          target="_blank"
          rel="noopener noreferrer"
          class="neo-btn-secondary inline-flex items-center"
        >
          <span>有知有行数据源</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        
        <a 
          href="https://coinmarketcap.com/charts/fear-and-greed-index/"
          target="_blank"
          rel="noopener noreferrer"
          class="neo-btn-secondary inline-flex items-center"
        >
          <span>CoinMarketCap数据源</span>
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
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import DataCard from '@/components/DataCard.vue'
import { useMarketDataStore } from '@/stores/marketData'

// Store
const marketStore = useMarketDataStore()

// Error handling state
const isInitialized = ref(false)
const criticalError = ref<string | null>(null)

// 计算属性
const statusDotClass = computed(() => {
  switch (marketStore.dataStatus) {
    case 'loading':
      return 'status-loading animate-pulse'
    case 'error':
      return 'status-error'
    case 'stale':
      return 'status-warning'
    case 'fresh':
      return 'status-success'
    default:
      return 'status-unknown'
  }
})

const statusText = computed(() => {
  switch (marketStore.dataStatus) {
    case 'loading':
      return '加载中...'
    case 'error':
      return '数据异常'
    case 'stale':
      return '数据过期'
    case 'fresh':
      return '数据正常'
    case 'no-data':
      return '暂无数据'
    default:
      return '未知状态'
  }
})

const lastUpdateTime = computed(() => {
  if (!marketStore.data?.lastUpdate) return null
  return marketStore.formatUpdateTime(marketStore.data.lastUpdate)
})

// 事件处理
const handleRefresh = async () => {
  console.log('[ThermometerView] Manual refresh triggered')
  try {
    criticalError.value = null
    await marketStore.refreshData()
    console.log('[ThermometerView] Refresh completed successfully')
  } catch (error) {
    console.error('[ThermometerView] Refresh failed:', error)
    criticalError.value = error instanceof Error ? error.message : 'Refresh failed'
  }
}

// 生命周期
onMounted(async () => {
  console.log('[ThermometerView] Component mounting...')
  try {
    // Set loading state
    isInitialized.value = false
    criticalError.value = null
    
    console.log('[ThermometerView] Initializing market data store...')
    await marketStore.initializeStore()
    
    console.log('[ThermometerView] Store initialized successfully')
    isInitialized.value = true
  } catch (error) {
    console.error('[ThermometerView] Failed to initialize:', error)
    criticalError.value = error instanceof Error ? error.message : 'Unknown error occurred'
    isInitialized.value = true // Still set to true to show error state
  }
})
</script>

<style scoped>
/* Neo-brutalism 卡片样式 */
.neo-card {
  @apply bg-white dark:bg-gray-800 border-4 border-black p-6 relative;
  box-shadow: 8px 8px 0px 0px #000;
}

/* 状态指示器 */
.status-dot {
  @apply w-3 h-3 rounded-full;
}

.status-success {
  @apply bg-green-500;
}

.status-loading {
  @apply bg-yellow-500;
}

.status-error {
  @apply bg-red-500;
}

.status-warning {
  @apply bg-orange-500;
}

.status-unknown {
  @apply bg-gray-500;
}

/* 数据卡片网格 */
.data-cards-grid {
  gap: 2rem;
}

/* 小按钮样式 */
.neo-btn-small {
  @apply px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border-2 border-black text-sm font-medium transition-all;
  box-shadow: 2px 2px 0px 0px #000;
}

.neo-btn-small:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px 0px #000;
}

.neo-btn-small:active {
  transform: translate(0, 0);
  box-shadow: 1px 1px 0px 0px #000;
}

.neo-btn-small:disabled {
  @apply opacity-50 cursor-not-allowed;
  transform: none;
  box-shadow: 2px 2px 0px 0px #000;
}

/* Neo-brutalism 次要按钮样式 */
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
@media (max-width: 1024px) {
  .data-cards-grid {
    @apply grid-cols-1;
    gap: 1.5rem;
  }
}

@media (max-width: 640px) {
  .neo-card {
    @apply px-4 py-4;
    box-shadow: 4px 4px 0px 0px #000;
  }
  
  .data-cards-grid {
    gap: 1rem;
  }
  
  .neo-btn-secondary {
    @apply px-4 py-2 text-sm;
    box-shadow: 2px 2px 0px 0px #000;
  }
  
  .neo-btn-secondary:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px 0px #000;
  }
}

/* 暗模式适配 */
.dark .neo-card {
  box-shadow: 8px 8px 0px 0px #6b7280;
}

.dark .neo-btn-small {
  box-shadow: 2px 2px 0px 0px #6b7280;
}

.dark .neo-btn-small:hover {
  box-shadow: 3px 3px 0px 0px #6b7280;
}

.dark .neo-btn-small:active {
  box-shadow: 1px 1px 0px 0px #6b7280;
}

.dark .neo-btn-secondary {
  box-shadow: 4px 4px 0px 0px #6b7280;
}

.dark .neo-btn-secondary:hover {
  box-shadow: 6px 6px 0px 0px #6b7280;
}

.dark .neo-btn-secondary:active {
  box-shadow: 2px 2px 0px 0px #6b7280;
}

/* 动画过渡 */
.data-cards-grid > * {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.data-cards-grid > *:nth-child(2) {
  animation-delay: 0.1s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 状态指示器动画 */
.status-loading {
  animation: pulse 2s infinite;
}

@media (max-width: 640px) {
  .dark .neo-card {
    box-shadow: 4px 4px 0px 0px #6b7280;
  }
}
</style>