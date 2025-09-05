<template>
  <div class="gauge-widget">
    <div class="gauge-container" :style="gaugeStyle">
      <!-- 背景刻度盘 -->
      <div class="gauge-background">
        <!-- 刻度标记 -->
        <div class="gauge-ticks">
          <div v-for="tick in tickMarks" :key="tick.value"
               class="gauge-tick"
               :style="{ transform: `rotate(${tick.angle}deg)` }">
            <div class="tick-mark"></div>
            <span class="tick-label" :style="{ transform: `rotate(${-tick.angle}deg)` }">
              {{ tick.value }}
            </span>
          </div>
        </div>
        
        <!-- 颜色扇形区域 -->
        <div class="gauge-sectors">
          <div class="sector fear-extreme" :style="sectorStyles.extremeFear"></div>
          <div class="sector fear" :style="sectorStyles.fear"></div>
          <div class="sector neutral" :style="sectorStyles.neutral"></div>
          <div class="sector greed" :style="sectorStyles.greed"></div>
          <div class="sector greed-extreme" :style="sectorStyles.extremeGreed"></div>
        </div>
        
        <!-- 指针 -->
        <div class="gauge-needle" :style="needleStyle">
          <div class="needle-line"></div>
          <div class="needle-center"></div>
        </div>
      </div>
      
      <!-- 中心数值显示 -->
      <div class="gauge-value">
        <span class="main-value" :style="{ color: color }">{{ value }}</span>
        <span class="value-unit">/100</span>
      </div>
      
      <!-- 级别显示 -->
      <div class="gauge-level">
        <span class="level-badge" :style="{ backgroundColor: color, color: textColor }">
          {{ level }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface GaugeProps {
  value: number
  color: string
  level: string
}

const props = defineProps<GaugeProps>()

// 刻度标记
const tickMarks = computed(() => [
  { value: 0, angle: -90 },
  { value: 25, angle: -45 },
  { value: 50, angle: 0 },
  { value: 75, angle: 45 },
  { value: 100, angle: 90 }
])

// 扇形区域样式
const sectorStyles = computed(() => ({
  extremeFear: {
    background: `conic-gradient(from 180deg, #3b82f6 0deg 36deg, transparent 36deg)`,
  },
  fear: {
    background: `conic-gradient(from 216deg, #60a5fa 0deg 36deg, transparent 36deg)`,
  },
  neutral: {
    background: `conic-gradient(from 252deg, #6b7280 0deg 18deg, transparent 18deg)`,
  },
  greed: {
    background: `conic-gradient(from 270deg, #f59e0b 0deg 36deg, transparent 36deg)`,
  },
  extremeGreed: {
    background: `conic-gradient(from 306deg, #ef4444 0deg 36deg, transparent 36deg)`,
  }
}))

// 仪表盘样式
const gaugeStyle = computed(() => ({
  '--gauge-color': props.color,
  '--gauge-value': props.value
}))

// 指针样式
const needleStyle = computed(() => {
  const angle = -90 + (props.value / 100) * 180
  return {
    transform: `rotate(${angle}deg)`,
    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  }
})

// 文字颜色（根据背景色自动选择）
const textColor = computed(() => {
  // 简单的亮度判断来选择文字颜色
  const hex = props.color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000' : '#fff'
})
</script>

<style scoped>
.gauge-widget {
  @apply flex flex-col items-center justify-center h-full py-4;
}

.gauge-container {
  @apply relative;
  width: 200px;
  height: 200px;
}

.gauge-background {
  @apply relative w-full h-full border-4 border-black rounded-full bg-white dark:bg-gray-800;
  box-shadow: 8px 8px 0px 0px #000;
}

.gauge-sectors {
  @apply absolute inset-0 rounded-full overflow-hidden;
}

.sector {
  @apply absolute inset-0 rounded-full;
  -webkit-mask: radial-gradient(circle, transparent 65%, black 65%, black 85%, transparent 85%);
  mask: radial-gradient(circle, transparent 65%, black 65%, black 85%, transparent 85%);
}

.gauge-ticks {
  @apply absolute inset-0;
}

.gauge-tick {
  @apply absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 100px;
  transform-origin: center bottom;
}

.tick-mark {
  @apply bg-black dark:bg-gray-400;
  width: 2px;
  height: 15px;
  margin-bottom: 15px;
}

.tick-label {
  @apply text-xs font-bold text-gray-700 dark:text-gray-300 absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
}

.gauge-needle {
  @apply absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 60px;
  transform-origin: center bottom;
  z-index: 20;
}

.needle-line {
  @apply bg-black dark:bg-gray-200;
  width: 4px;
  height: 50px;
  border-radius: 2px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.needle-center {
  @apply bg-black dark:bg-gray-200 rounded-full border-2 border-white dark:border-gray-800;
  width: 12px;
  height: 12px;
  position: absolute;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.gauge-value {
  @apply absolute inset-0 flex flex-col items-center justify-center text-center z-10;
}

.main-value {
  @apply text-3xl font-bold;
  font-family: 'Courier New', monospace;
}

.value-unit {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.gauge-level {
  @apply absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10;
}

.level-badge {
  @apply px-3 py-1 text-sm font-bold border-2 border-black rounded;
  box-shadow: 2px 2px 0px 0px #000;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .gauge-container {
    width: 160px;
    height: 160px;
  }
  
  .needle-line {
    height: 40px;
  }
  
  .needle-center {
    bottom: 35px;
    width: 10px;
    height: 10px;
  }
  
  .main-value {
    @apply text-2xl;
  }
  
  .tick-label {
    font-size: 9px;
  }
  
  .level-badge {
    @apply text-xs px-2;
  }
}

/* 暗模式适配 */
.dark .gauge-background {
  @apply border-gray-400;
  box-shadow: 8px 8px 0px 0px #6b7280;
}

.dark .level-badge {
  @apply border-gray-400;
  box-shadow: 2px 2px 0px 0px #6b7280;
}

/* 动画效果 */
@keyframes gauge-sweep {
  from {
    transform: rotate(-90deg);
  }
  to {
    transform: rotate(calc(-90deg + var(--gauge-value, 50) * 1.8deg));
  }
}

.gauge-needle {
  animation: gauge-sweep 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 悬浮效果 */
.gauge-container:hover .gauge-background {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0px 0px #000;
}

.dark .gauge-container:hover .gauge-background {
  box-shadow: 10px 10px 0px 0px #6b7280;
}
</style>