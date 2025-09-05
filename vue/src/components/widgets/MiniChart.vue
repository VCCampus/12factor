<template>
  <div class="mini-chart">
    <div class="chart-title text-xs text-gray-600 dark:text-gray-400 mb-2">
      7日趋势
    </div>
    <div class="chart-container" ref="chartContainer">
      <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="chart-svg">
        <!-- 网格线 -->
        <defs>
          <pattern id="grid" width="20" height="10" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <!-- 面积填充 -->
        <path v-if="areaPath" :d="areaPath" :fill="areaColor" opacity="0.2" />
        
        <!-- 折线 -->
        <path v-if="linePath" :d="linePath" 
              :stroke="color" 
              stroke-width="2" 
              fill="none" 
              stroke-linecap="round" 
              stroke-linejoin="round" />
        
        <!-- 数据点 -->
        <circle v-for="(point, index) in dataPoints" :key="index"
                :cx="point.x" 
                :cy="point.y" 
                r="3"
                :fill="color"
                :stroke="color"
                stroke-width="1"
                class="data-point" />
      </svg>
      
      <!-- 悬浮提示 -->
      <div v-if="tooltip.visible" 
           class="chart-tooltip" 
           :style="tooltipStyle">
        <div class="tooltip-content">
          <div class="tooltip-date">{{ tooltip.date }}</div>
          <div class="tooltip-value" :style="{ color: color }">
            {{ tooltip.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

interface ChartData {
  date: string
  value: number
}

interface MiniChartProps {
  data: ChartData[]
  color: string
}

const props = defineProps<MiniChartProps>()

const chartContainer = ref<HTMLElement>()
const chartWidth = 200
const chartHeight = 60
const padding = { top: 5, right: 5, bottom: 5, left: 5 }

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  date: '',
  value: 0
})

// 数据处理
const processedData = computed(() => {
  if (!props.data || props.data.length === 0) return []
  
  // 按日期排序
  return [...props.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// 值的范围
const valueRange = computed(() => {
  if (processedData.value.length === 0) return { min: 0, max: 100 }
  
  const values = processedData.value.map(d => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  
  // 添加一些边距
  const range = max - min
  const margin = range * 0.1
  
  return {
    min: Math.max(0, min - margin),
    max: Math.min(100, max + margin)
  }
})

// 坐标点
const dataPoints = computed(() => {
  if (processedData.value.length === 0) return []
  
  const dataLength = processedData.value.length
  const availableWidth = chartWidth - padding.left - padding.right
  const availableHeight = chartHeight - padding.top - padding.bottom
  
  return processedData.value.map((item, index) => {
    const x = padding.left + (index / Math.max(1, dataLength - 1)) * availableWidth
    const normalizedValue = (item.value - valueRange.value.min) / (valueRange.value.max - valueRange.value.min)
    const y = padding.top + (1 - normalizedValue) * availableHeight
    
    return { x, y, ...item }
  })
})

// 折线路径
const linePath = computed(() => {
  if (dataPoints.value.length === 0) return ''
  
  let path = `M ${dataPoints.value[0].x} ${dataPoints.value[0].y}`
  
  for (let i = 1; i < dataPoints.value.length; i++) {
    path += ` L ${dataPoints.value[i].x} ${dataPoints.value[i].y}`
  }
  
  return path
})

// 面积填充路径
const areaPath = computed(() => {
  if (dataPoints.value.length === 0) return ''
  
  let path = `M ${dataPoints.value[0].x} ${chartHeight - padding.bottom}`
  path += ` L ${dataPoints.value[0].x} ${dataPoints.value[0].y}`
  
  for (let i = 1; i < dataPoints.value.length; i++) {
    path += ` L ${dataPoints.value[i].x} ${dataPoints.value[i].y}`
  }
  
  path += ` L ${dataPoints.value[dataPoints.value.length - 1].x} ${chartHeight - padding.bottom}`
  path += ' Z'
  
  return path
})

// 面积颜色
const areaColor = computed(() => props.color)

// 提示框样式
const tooltipStyle = computed(() => ({
  left: `${tooltip.value.x}px`,
  top: `${tooltip.value.y}px`,
  transform: 'translate(-50%, -100%)'
}))

// 鼠标事件处理
const handleMouseMove = (event: MouseEvent) => {
  const rect = chartContainer.value?.getBoundingClientRect()
  if (!rect) return
  
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  
  // 查找最近的数据点
  let nearestPoint = null
  let minDistance = Infinity
  
  for (const point of dataPoints.value) {
    const distance = Math.sqrt(Math.pow(point.x - mouseX, 2) + Math.pow(point.y - mouseY, 2))
    if (distance < minDistance && distance < 20) {
      minDistance = distance
      nearestPoint = point
    }
  }
  
  if (nearestPoint) {
    tooltip.value = {
      visible: true,
      x: nearestPoint.x,
      y: nearestPoint.y,
      date: formatDate(nearestPoint.date),
      value: nearestPoint.value
    }
  } else {
    tooltip.value.visible = false
  }
}

const handleMouseLeave = () => {
  tooltip.value.visible = false
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}

onMounted(() => {
  if (chartContainer.value) {
    chartContainer.value.addEventListener('mousemove', handleMouseMove)
    chartContainer.value.addEventListener('mouseleave', handleMouseLeave)
  }
})
</script>

<style scoped>
.mini-chart {
  @apply w-full;
}

.chart-container {
  @apply relative bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded p-2;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-svg {
  @apply w-full h-12 text-gray-400 dark:text-gray-500;
}

.data-point {
  @apply cursor-pointer transition-all;
}

.data-point:hover {
  r: 4;
  opacity: 0.8;
}

.chart-tooltip {
  @apply absolute pointer-events-none z-10;
}

.tooltip-content {
  @apply bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-xs border-2 border-black dark:border-white;
  box-shadow: 2px 2px 0px 0px #000;
}

.dark .tooltip-content {
  box-shadow: 2px 2px 0px 0px #fff;
}

.tooltip-date {
  @apply text-xs opacity-75;
}

.tooltip-value {
  @apply font-bold;
}

/* 空状态 */
.chart-svg:empty::after {
  content: "暂无历史数据";
  @apply text-gray-400 dark:text-gray-500 text-xs;
}
</style>