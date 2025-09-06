<template>
  <view class="growth-hero">
    <!-- 主标题区域 -->
    <view class="hero-title">
      <text class="title-main">🧠 个人成长12原则</text>
      <text class="title-sub">四阶段成长体系，系统化人生进化</text>
    </view>
    
    <!-- CTA按钮区域 -->
    <view class="hero-actions">
      <view class="action-btn primary" @tap="onStartLearning">
        <text class="btn-text">开始学习</text>
      </view>
      <view class="action-btn secondary" @tap="onCheckProgress">
        <text class="btn-text">查看进度</text>
      </view>
    </view>
    
    <!-- 进度概览 -->
    <view class="hero-progress" v-if="showProgress">
      <text class="progress-text">总进度: {{ globalProgress }}%</text>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: globalProgress + '%' }"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGrowthStore } from '@/stores/growthStore'

interface Props {
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true
})

const emit = defineEmits<{
  startLearning: []
  checkProgress: []
}>()

const growthStore = useGrowthStore()

const globalProgress = computed(() => growthStore.progress.globalProgress || 0)

const onStartLearning = () => {
  emit('startLearning')
}

const onCheckProgress = () => {
  emit('checkProgress')
}
</script>

<style scoped>
.growth-hero {
  @apply px-4 py-6 text-center;
  @apply md:px-6 md:py-8;
  @apply bg-gradient-to-br from-blue-50 to-purple-50;
  @apply dark:from-gray-800 dark:to-gray-900;
}

.hero-title {
  @apply mb-6;
}

.title-main {
  @apply block text-2xl font-bold text-gray-900 mb-2;
  @apply md:text-3xl lg:text-4xl;
  @apply dark:text-white;
}

.title-sub {
  @apply block text-sm text-gray-600;
  @apply md:text-base;
  @apply dark:text-gray-300;
}

.hero-actions {
  @apply flex flex-col gap-3 mb-6;
  @apply sm:flex-row sm:justify-center sm:gap-4;
}

.action-btn {
  @apply px-6 py-3 rounded-lg font-medium;
  @apply transition-colors duration-200;
  @apply min-h-[44px] flex items-center justify-center;
}

.action-btn.primary {
  @apply bg-blue-500 text-white;
  @apply hover:bg-blue-600 active:bg-blue-700;
  @apply dark:bg-blue-600 dark:hover:bg-blue-700;
}

.action-btn.secondary {
  @apply bg-gray-200 text-gray-700;
  @apply hover:bg-gray-300 active:bg-gray-400;
  @apply dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600;
}

.btn-text {
  @apply text-sm font-medium;
  @apply md:text-base;
}

.hero-progress {
  @apply max-w-sm mx-auto;
}

.progress-text {
  @apply block text-xs text-gray-600 mb-2;
  @apply dark:text-gray-400;
}

.progress-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
  @apply dark:bg-gray-700;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-500;
  @apply transition-all duration-500;
}
</style>