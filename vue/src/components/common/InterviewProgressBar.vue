<template>
  <div v-if="interviewStore.isActive" class="interview-progress-bar">
    <!-- 桌面端进度条 -->
    <div class="hidden md:block bg-white border-b-2 border-gray-200 py-2">
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-700">面试进度:</span>
          <div class="flex items-center space-x-2">
            <div class="progress-bar-container">
              <div 
                class="progress-bar-fill"
                :style="{ width: `${interviewStore.progressPercentage}%` }"
              ></div>
            </div>
            <span class="text-sm font-bold text-primary-blue">
              {{ interviewStore.progressText }} ({{ interviewStore.progressPercentage }}%)
            </span>
          </div>
        </div>
        <span class="text-xs text-gray-500">{{ interviewStore.difficultyTitle }}</span>
      </div>
    </div>
    
    <!-- 移动端紧凑型进度条 -->
    <div class="block md:hidden bg-white border-b border-gray-200 py-1">
      <div class="px-4 flex items-center justify-between">
        <div class="progress-bar-container-mobile">
          <div 
            class="progress-bar-fill-mobile"
            :style="{ width: `${interviewStore.progressPercentage}%` }"
          ></div>
        </div>
        <span class="text-xs font-bold text-primary-blue ml-3">
          {{ interviewStore.progressText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInterviewStore } from '@/stores/interview'

const interviewStore = useInterviewStore()
</script>

<style scoped>
.interview-progress-bar {
  position: sticky;
  top: 0;
  z-index: 40;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 桌面端进度条 */
.progress-bar-container {
  width: 300px;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid #374151;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
  transition: width 0.3s ease;
  border-radius: 2px;
}

/* 移动端进度条 */
.progress-bar-container-mobile {
  flex: 1;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid #6b7280;
}

.progress-bar-fill-mobile {
  height: 100%;
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  transition: width 0.3s ease;
  border-radius: 2px;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .progress-bar-container-mobile {
    height: 4px;
  }
}
</style>