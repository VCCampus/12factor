<template>
  <footer class="neo-card mt-8 border-t-4 border-border-black">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- Copyright Info -->
        <div class="text-center md:text-left">
          <p class="text-sm text-text-dark font-medium">
            © 2024 CSS数创学习平台
          </p>
          <p class="text-xs text-gray-600 mt-1">
            基于CSS数创班8期知识体系
          </p>
        </div>
        
        <!-- Version Info -->
        <div class="text-center md:text-right">
          <p class="text-xs text-gray-600">
            版本 v4.0.0 | Vue 3 + Vite
          </p>
          <p class="text-xs text-gray-500 mt-1">
            🚀 PWA离线支持
          </p>
        </div>
      </div>
      
      <!-- Progress Stats (Optional) -->
      <div v-if="showStats" class="mt-4 pt-4 border-t-2 border-border-black">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div class="neo-card p-3">
            <div class="text-lg font-bold text-primary-blue">21</div>
            <div class="text-xs text-gray-600">核心概念</div>
          </div>
          <div class="neo-card p-3">
            <div class="text-lg font-bold text-primary-blue">5</div>
            <div class="text-xs text-gray-600">学习模块</div>
          </div>
          <div class="neo-card p-3">
            <div class="text-lg font-bold text-primary-blue">193</div>
            <div class="text-xs text-gray-600">测试题目</div>
          </div>
          <div class="neo-card p-3">
            <div class="text-lg font-bold text-primary-blue">100%</div>
            <div class="text-xs text-gray-600">离线可用</div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Optional: Show statistics in footer
defineProps<{
  showStats?: boolean
}>()
</script>

<style scoped>
/* Footer特定样式 */
footer {
  border-bottom: none;
  box-shadow: none;
}

/* Stats cards in footer */
.neo-card {
  box-shadow: 2px 2px 0px theme('colors.border-black');
}
</style>