<template>
  <view class="stage-card" @tap="onCardClick">
    <view class="stage-header">
      <text class="stage-icon">{{ stage.icon }}</text>
      <view class="stage-info">
        <text class="stage-name">{{ stage.name }}</text>
        <text class="stage-progress">{{ completedCount }}/{{ totalCount }}</text>
      </view>
    </view>
    
    <view class="progress-section">
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progressPercentage + '%' }"></view>
      </view>
      <text class="progress-text">{{ progressPercentage }}% 完成</text>
    </view>
    
    <view class="stage-description">
      <text class="description-text">{{ stage.description }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Stage {
  id: string
  name: string
  icon: string
  description: string
  order: number
}

interface Props {
  stage: Stage
  completedCount: number
  totalCount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [stageId: string]
}>()

const progressPercentage = computed(() => {
  if (props.totalCount === 0) return 0
  return Math.round((props.completedCount / props.totalCount) * 100)
})

const onCardClick = () => {
  emit('click', props.stage.id)
}
</script>

<style scoped>
.stage-card {
  @apply p-4 bg-white rounded-lg border border-gray-200;
  @apply shadow-sm hover:shadow-md transition-shadow;
  @apply cursor-pointer active:scale-95;
  @apply dark:bg-gray-800 dark:border-gray-700;
}

.stage-header {
  @apply flex items-center mb-3;
}

.stage-icon {
  @apply text-2xl mr-3;
  @apply md:text-3xl;
}

.stage-info {
  @apply flex-1;
}

.stage-name {
  @apply block font-medium text-gray-900 text-base;
  @apply md:text-lg;
  @apply dark:text-white;
}

.stage-progress {
  @apply block text-sm text-gray-500;
  @apply dark:text-gray-400;
}

.progress-section {
  @apply mb-3;
}

.progress-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1;
  @apply dark:bg-gray-700;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-green-400 to-blue-500;
  @apply transition-all duration-500;
}

.progress-text {
  @apply text-xs text-gray-600;
  @apply dark:text-gray-400;
}

.stage-description {
  @apply text-sm text-gray-600 leading-relaxed;
  @apply dark:text-gray-300;
}

.description-text {
  @apply line-clamp-2;
}
</style>