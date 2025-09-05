<template>
  <div class="thermometer-widget">
    <div class="thermometer" :style="thermometerStyle">
      <!-- 温度计主体 -->
      <div class="thermometer-body">
        <!-- 刻度标记 -->
        <div class="scale-marks">
          <div v-for="mark in scaleMarks" :key="mark.value" 
               class="scale-mark" 
               :style="{ bottom: mark.position }">
            <span class="scale-text">{{ mark.value }}</span>
          </div>
        </div>
        
        <!-- 温度计管 -->
        <div class="thermometer-tube">
          <div class="temperature-fill" :style="fillStyle"></div>
        </div>
        
        <!-- 温度计底部球形 -->
        <div class="thermometer-bulb" :style="{ backgroundColor: color }"></div>
      </div>
      
      <!-- 数值显示 -->
      <div class="value-display">
        <span class="temperature-value" :style="{ color: color }">{{ value }}</span>
        <span class="temperature-unit">°</span>
      </div>
      
      <!-- 级别显示 -->
      <div class="level-display">
        <span class="level-text">{{ level }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ThermometerProps {
  value: number
  color: string
  level: string
}

const props = defineProps<ThermometerProps>()

// 刻度标记
const scaleMarks = computed(() => [
  { value: 100, position: '90%' },
  { value: 75, position: '70%' },
  { value: 50, position: '45%' },
  { value: 25, position: '20%' },
  { value: 0, position: '0%' }
])

// 温度计样式
const thermometerStyle = computed(() => ({
  '--thermometer-color': props.color,
  '--value': props.value
}))

// 填充样式
const fillStyle = computed(() => ({
  height: `${Math.max(10, Math.min(90, props.value))}%`,
  backgroundColor: props.color,
  transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
}))
</script>

<style scoped>
.thermometer-widget {
  @apply flex flex-col items-center justify-center h-full py-4;
}

.thermometer {
  @apply relative flex flex-col items-center;
  width: 120px;
  height: 200px;
}

.thermometer-body {
  @apply relative;
  width: 40px;
  height: 160px;
  margin-bottom: 8px;
}

.scale-marks {
  @apply absolute left-0 w-full h-full pointer-events-none;
  transform: translateX(-100%);
  padding-right: 8px;
}

.scale-mark {
  @apply absolute right-0 flex items-center;
  width: 20px;
}

.scale-text {
  @apply text-xs text-gray-600 dark:text-gray-400 font-medium;
  font-size: 10px;
}

.thermometer-tube {
  @apply relative bg-gray-200 dark:bg-gray-700 border-4 border-black;
  width: 40px;
  height: 140px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
}

.temperature-fill {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  border-radius: 0 0 16px 16px;
  min-height: 10%;
}

.thermometer-bulb {
  @apply border-4 border-black rounded-full;
  width: 48px;
  height: 48px;
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.value-display {
  @apply flex items-baseline justify-center mt-2;
}

.temperature-value {
  @apply text-2xl font-bold;
  font-family: 'Courier New', monospace;
}

.temperature-unit {
  @apply text-lg font-bold text-gray-600 dark:text-gray-400 ml-1;
}

.level-display {
  @apply mt-2 text-center;
}

.level-text {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1 bg-gray-100 dark:bg-gray-700 border-2 border-black;
  font-size: 12px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .thermometer {
    width: 100px;
    height: 160px;
  }
  
  .thermometer-body {
    width: 32px;
    height: 120px;
  }
  
  .thermometer-tube {
    width: 32px;
    height: 100px;
    border-radius: 16px 16px 0 0;
  }
  
  .thermometer-bulb {
    width: 40px;
    height: 40px;
    bottom: -20px;
  }
  
  .temperature-value {
    @apply text-xl;
  }
  
  .scale-mark {
    width: 16px;
  }
  
  .scale-text {
    font-size: 9px;
  }
}

/* 动画效果 */
@keyframes thermometer-rise {
  from {
    height: 0%;
  }
  to {
    height: var(--value, 50%);
  }
}

.temperature-fill {
  animation: thermometer-rise 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 暗模式适配 */
.dark .thermometer-tube {
  @apply border-gray-400;
}

.dark .thermometer-bulb {
  @apply border-gray-400;
}

.dark .level-text {
  @apply border-gray-400;
}

/* Neobrutalism阴影效果 */
.thermometer-tube {
  box-shadow: 4px 4px 0px 0px #000;
}

.thermometer-bulb {
  box-shadow: 4px 4px 0px 0px #000;
}

.level-text {
  box-shadow: 2px 2px 0px 0px #000;
}

.dark .thermometer-tube,
.dark .thermometer-bulb,
.dark .level-text {
  box-shadow: 4px 4px 0px 0px #6b7280;
}

.dark .level-text {
  box-shadow: 2px 2px 0px 0px #6b7280;
}
</style>