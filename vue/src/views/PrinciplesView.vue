<template>
  <AppLayout>
    <div class="text-center py-8">
      <h1 class="text-3xl font-bold text-text-dark mb-4">原则学习</h1>
      <p class="text-gray-600 mb-8">系统学习CSS数字创业核心知识体系</p>
      
      <!-- 临时内容，Phase 2将实现完整功能 -->
      <div class="neo-card p-8">
        <div class="neo-icon mx-auto mb-4 text-2xl">
          🚧
        </div>
        <h2 class="text-xl font-bold mb-4">功能开发中</h2>
        <p class="text-gray-600 mb-6">
          原则学习页面将在Phase 2数据系统实现后完成
        </p>
        <RouterLink to="/" class="neo-btn">
          返回首页
        </RouterLink>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
</script>