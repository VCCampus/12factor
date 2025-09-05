<template>
  <AppLayout>
    <div class="export-page py-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">数据导出</h1>
        <p class="text-gray-600">导出你的学习数据和个性化报告</p>
      </div>
      
      <DataExporter />
      
      <!-- 导出说明 -->
      <div class="mt-12 max-w-2xl mx-auto">
        <div class="neo-card p-6">
          <h3 class="text-lg font-bold mb-4">📋 导出说明</h3>
          <div class="space-y-3 text-sm text-gray-700">
            <p><strong>Markdown格式</strong>：适合在笔记应用中查看，支持标题、列表等格式</p>
            <p><strong>JSON格式</strong>：适合数据分析或导入其他系统</p>
            <p><strong>报告内容</strong>：包含学习进度、测试成绩、成就徽章等详细数据</p>
            <p><strong>隐私保护</strong>：所有数据均在本地生成，不会上传到服务器</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import DataExporter from '@/components/DataExporter.vue'
</script>

<style scoped>
.export-page {
  min-height: 60vh;
}
</style>