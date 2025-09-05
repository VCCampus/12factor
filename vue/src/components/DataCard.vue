<template>
  <div class="data-card neo-card">
    <!-- 卡片头部 -->
    <div class="card-header mb-6">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h3>
      <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <span class="status-indicator" :class="statusClass"></span>
        {{ statusText }}
      </div>
    </div>

    <!-- 数据展示区域 -->
    <div class="data-display mb-6" v-if="!loading && !error">
      <!-- 可视化组件 -->
      <div class="visualization-container mb-4">
        <!-- 温度计样式 (有知有行) -->
        <div v-if="data.visualization?.type === 'thermometer'" class="thermometer-container">
          <ThermometerWidget 
            :value="data.indicators.value"
            :color="data.visualization.color"
            :level="data.indicators.level"
          />
        </div>
        
        <!-- 仪表盘样式 (CoinMarketCap) -->
        <div v-else-if="data.visualization?.type === 'gauge'" class="gauge-container">
          <GaugeWidget
            :value="data.indicators.value" 
            :color="data.visualization.color"
            :level="data.indicators.level"
          />
        </div>
      </div>

      <!-- 数值显示 -->
      <div class="value-display text-center mb-4">
        <div class="main-value text-4xl font-bold mb-2" :style="{ color: data.visualization?.color }">
          {{ data.indicators.value }}
        </div>
        <div class="level-text text-lg font-medium text-gray-700 dark:text-gray-300">
          {{ data.indicators.level }}
          <span v-if="data.indicators.levelEn && data.indicators.levelEn !== data.indicators.level" 
                class="text-sm text-gray-500 dark:text-gray-400 ml-2">
            ({{ data.indicators.levelEn }})
          </span>
        </div>
        
        <!-- 趋势指示器 -->
        <div v-if="data.indicators.trend && data.indicators.changeFromYesterday !== null" 
             class="trend-indicator flex items-center justify-center mt-2 text-sm">
          <TrendIcon :trend="data.indicators.trend" />
          <span class="ml-1" :class="trendColorClass">
            {{ Math.abs(data.indicators.changeFromYesterday).toFixed(1) }}
          </span>
        </div>
      </div>

      <!-- 历史趋势图 -->
      <div v-if="data.history && data.history.length > 0" class="history-chart mb-4">
        <MiniChart :data="data.history" :color="data.visualization?.color" />
      </div>

      <!-- 描述信息 -->
      <p class="description text-sm text-gray-600 dark:text-gray-400 text-center">
        {{ data.indicators.description }}
      </p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state py-16 flex flex-col items-center">
      <div class="spinner mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-state py-8 text-center">
      <div class="text-red-600 dark:text-red-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="font-medium">数据暂时无法加载</p>
        <p class="text-sm mt-1">{{ errorMessage }}</p>
      </div>
      
      <!-- 回退数据显示 -->
      <div v-if="fallbackData" class="fallback-notice text-xs text-amber-600 dark:text-amber-400 mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border">
        <p class="font-medium mb-1">显示缓存数据</p>
        <p>更新时间: {{ formatTime(fallbackData.staleTime) }}</p>
      </div>

      <a v-if="data.source" 
         :href="data.source" 
         target="_blank"
         rel="noopener noreferrer"
         class="neo-btn-small mt-4 inline-flex items-center">
        访问数据源
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>

    <!-- 数据源和更新时间 -->
    <div v-if="!loading" class="card-footer mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span class="data-source">
          来源: {{ sourceDisplayName }}
        </span>
        <span class="update-time">
          {{ formatTime(data.fetchTime) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ThermometerWidget from './widgets/ThermometerWidget.vue'
import GaugeWidget from './widgets/GaugeWidget.vue'
import TrendIcon from './widgets/TrendIcon.vue'
import MiniChart from './widgets/MiniChart.vue'

interface DataCardProps {
  title: string
  data: any
  loading?: boolean
  error?: boolean
  errorMessage?: string
  fallbackData?: any
  source: string
}

const props = withDefaults(defineProps<DataCardProps>(), {
  loading: false,
  error: false,
  errorMessage: '网络连接失败'
})

// 数据源显示名称
const sourceDisplayName = computed(() => {
  if (props.source === 'youzhiyouxing') return '有知有行'
  if (props.source === 'coinmarketcap') return 'CoinMarketCap'
  return props.source
})

// 状态指示器样式
const statusClass = computed(() => {
  if (props.loading) return 'status-loading'
  if (props.error) return 'status-error'
  return 'status-success'
})

// 状态文本
const statusText = computed(() => {
  if (props.loading) return '加载中...'
  if (props.error) return '数据异常'
  if (props.fallbackData?.stale) return '离线数据'
  return '数据正常'
})

// 趋势颜色样式
const trendColorClass = computed(() => {
  if (!props.data.indicators?.trend) return ''
  return {
    'text-green-600 dark:text-green-400': props.data.indicators.trend === 'up',
    'text-red-600 dark:text-red-400': props.data.indicators.trend === 'down',
    'text-gray-600 dark:text-gray-400': props.data.indicators.trend === 'stable'
  }
})

// 格式化时间
const formatTime = (timeString: string) => {
  if (!timeString) return '--'
  const date = new Date(timeString)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.data-card {
  @apply bg-white dark:bg-gray-800 border-4 border-black p-6;
  box-shadow: 8px 8px 0px 0px #000;
  transition: transform 0.2s ease;
}

.data-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0px 0px #000;
}

/* 状态指示器 */
.status-indicator {
  @apply w-2 h-2 rounded-full;
}

.status-success {
  @apply bg-green-500;
}

.status-loading {
  @apply bg-yellow-500 animate-pulse;
}

.status-error {
  @apply bg-red-500;
}

/* 加载动画 */
.spinner {
  @apply w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin;
}

/* 可视化容器 */
.thermometer-container, .gauge-container {
  @apply flex justify-center items-center h-48;
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

/* 响应式适配 */
@media (max-width: 768px) {
  .data-card {
    box-shadow: 4px 4px 0px 0px #000;
  }
  
  .data-card:hover {
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0px 0px #000;
  }
  
  .main-value {
    @apply text-3xl;
  }
  
  .thermometer-container, .gauge-container {
    @apply h-36;
  }
}

/* 暗模式适配 */
.dark .data-card {
  box-shadow: 8px 8px 0px 0px #6b7280;
}

.dark .data-card:hover {
  box-shadow: 10px 10px 0px 0px #6b7280;
}

.dark .neo-btn-small {
  box-shadow: 2px 2px 0px 0px #6b7280;
}

.dark .neo-btn-small:hover {
  box-shadow: 3px 3px 0px 0px #6b7280;
}
</style>