<template>
  <AppLayout>
    <div class="principles-view">
      <!-- 页面头部 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-text-dark mb-4">📚 原则学习中心</h1>
        <p class="text-gray-600">系统学习CSS数字创业核心知识体系</p>
      </div>
      
      <!-- Tab导航 -->
      <PrinciplesTab 
        :activeTab="activeTab" 
        @change="changeTab"
      />
      
      <!-- 内容区域 -->
      <div class="content-area">
        <component 
          :is="currentComponent"
          @goToStudy="changeTab('study')"
          @goToFlashcards="changeTab('flashcards')"
          @goToQuiz="changeTab('quiz')"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import PrinciplesTab from '@/components/principles/PrinciplesTab.vue'
import StudyContent from '@/components/principles/StudyContent.vue'
import FlashcardsContent from '@/components/principles/FlashcardsContent.vue'
import QuizContent from '@/components/principles/QuizContent.vue'

const route = useRoute()
const router = useRouter()

// 当前激活的Tab
const activeTab = ref('study')

// 组件映射
const componentMap = {
  'study': StudyContent,
  'flashcards': FlashcardsContent,
  'quiz': QuizContent
}

// 当前组件
const currentComponent = computed(() => {
  return componentMap[activeTab.value] || StudyContent
})

// 切换Tab
const changeTab = (tabId: string) => {
  activeTab.value = tabId
  // 更新路由
  router.push(`/principles/${tabId}`)
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  if (newPath.includes('/principles/')) {
    const tab = newPath.split('/').pop()
    if (tab && ['study', 'flashcards', 'quiz'].includes(tab)) {
      activeTab.value = tab
    }
  }
})

// 初始化
onMounted(() => {
  // 根据当前路由设置初始Tab
  const path = route.path
  if (path.includes('/principles/flashcards')) {
    activeTab.value = 'flashcards'
  } else if (path.includes('/principles/quiz')) {
    activeTab.value = 'quiz'
  } else {
    activeTab.value = 'study'
  }
})
</script>

<style scoped>
.principles-view {
  @apply py-8;
}

.content-area {
  @apply mt-6;
}
</style>