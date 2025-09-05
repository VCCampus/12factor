<template>
  <div class="trend-icon" :class="iconClass">
    <!-- 上升趋势 -->
    <svg v-if="trend === 'up'" xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l10-10M17 7v10H7" />
    </svg>
    
    <!-- 下降趋势 -->
    <svg v-else-if="trend === 'down'" xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-10 10M7 17V7h10" />
    </svg>
    
    <!-- 稳定趋势 -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TrendIconProps {
  trend: 'up' | 'down' | 'stable'
}

const props = defineProps<TrendIconProps>()

const iconClass = computed(() => ({
  'trend-up': props.trend === 'up',
  'trend-down': props.trend === 'down',
  'trend-stable': props.trend === 'stable'
}))
</script>

<style scoped>
.trend-icon {
  @apply inline-flex items-center justify-center;
}

.icon {
  @apply w-4 h-4;
}

.trend-up {
  @apply text-green-600 dark:text-green-400;
}

.trend-down {
  @apply text-red-600 dark:text-red-400;
}

.trend-stable {
  @apply text-gray-600 dark:text-gray-400;
}

/* 微动画效果 */
.trend-up .icon {
  animation: bounce-up 0.6s ease-in-out;
}

.trend-down .icon {
  animation: bounce-down 0.6s ease-in-out;
}

@keyframes bounce-up {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@keyframes bounce-down {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(2px); }
}
</style>