<template>
  <AppLayout>
    <!-- 桥接层：外层用标准HTML满足AppLayout，内层保持100% uniapp语法 -->
    <div class="growth-neo-wrapper">
      <view class="growth-flashcards-page">
        <!-- 页面标题 -->
        <view class="page-header">
          <text class="page-title">🎯 闪卡练习</text>
          <text class="page-subtitle">每次随机12张 | 手动翻转学习</text>
        </view>

        <FlashcardRandomizer />

        <!-- 学习提示 -->
        <view class="growth-neo-card learning-tips">
          <text class="tips-title">💡 学习提示</text>
          <view class="tips-list">
            <text class="tip-item">• 先仔细思考问题，再点击翻转查看答案</text>
            <text class="tip-item">• 每次练习覆盖所有12个原则各1张卡片</text>
            <text class="tip-item">• 不熟悉的内容可以多练习几轮</text>
            <text class="tip-item">• 建议每日练习，加深记忆印象</text>
          </view>
        </view>

        <!-- 练习历史 -->
        <view class="history-section" v-if="flashcardHistory.length > 0">
          <text class="section-title">📈 最近练习</text>
          <view class="history-list">
            <view 
              v-for="(session, index) in recentHistory" 
              :key="index"
              class="growth-neo-card history-item"
            >
              <view class="history-info">
                <text class="history-date">{{ formatDate(session.timestamp) }}</text>
                <text class="history-details">{{ session.totalCards }}张卡片</text>
              </view>
              <view class="history-stats">
                <view class="difficulty-tags">
                  <text 
                    v-for="difficulty in getSessionDifficulties(session)"
                    :key="difficulty"
                    class="difficulty-tag"
                    :class="difficulty"
                  >
                    {{ difficulty }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 返回按钮 -->
        <view class="back-section">
          <view class="growth-neo-button back-btn" @tap="goBack">
            <text class="btn-text">← 返回原则学习</text>
          </view>
        </view>
      </view>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGrowthStore } from '@/stores/growthStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import FlashcardRandomizer from '@/components/growth/flashcards/FlashcardRandomizer.vue'

interface FlashcardSession {
  timestamp: string
  totalCards: number
  cards: Array<{
    id: string
    principle: string
    difficulty: string
  }>
}

const router = useRouter()
const growthStore = useGrowthStore()

const flashcardHistory = computed(() => {
  // 从localStorage获取练习历史
  try {
    const stored = localStorage.getItem('growth-progress')
    if (stored) {
      const data = JSON.parse(stored)
      return data.flashcardHistory || []
    }
  } catch (error) {
    console.error('获取练习历史失败:', error)
  }
  return []
})

const recentHistory = computed(() => {
  return flashcardHistory.value.slice(0, 5) // 显示最近5次练习
})

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天 ' + date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else if (diffDays === 1) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    })
  }
}

const getSessionDifficulties = (session: FlashcardSession): string[] => {
  const difficulties = new Set(session.cards.map(card => card.difficulty))
  return Array.from(difficulties).sort()
}

const goBack = () => {
  router.push('/principles')
}

onMounted(async () => {
  // 确保数据已加载
  if (!growthStore.flashcards.allCards.length) {
    await growthStore.loadFlashcards()
  }
})
</script>

<style scoped>
/* 桥接层样式 */
.growth-neo-wrapper {
  @apply w-full;
}

/* Growth页面基础样式 */
.growth-flashcards-page {
  @apply min-h-screen bg-white;
  @apply dark:bg-gray-900;
}

/* Neobrutalism风格卡片 - 命名空间隔离 */
.growth-neo-card {
  @apply bg-white border-black;
  border-width: 3px;
  box-shadow: 4px 4px 0px #000;
  @apply transition-all duration-200;
  @apply dark:bg-gray-800 dark:border-gray-100;
}

.growth-neo-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #000;
}

/* Neobrutalism按钮样式 */
.growth-neo-button {
  @apply bg-blue-500 text-white font-bold border-black;
  border-width: 3px;
  box-shadow: 4px 4px 0px #000;
  @apply transition-all duration-200;
}

.growth-neo-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #000;
}

.growth-neo-button:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px #000;
}

.page-header {
  @apply text-center py-6 px-4 bg-gradient-to-r from-purple-500 to-blue-500;
}

.page-title {
  @apply block text-2xl font-bold text-white mb-2;
  @apply md:text-3xl;
}

.page-subtitle {
  @apply text-purple-100 text-sm;
  @apply md:text-base;
}

.learning-tips {
  @apply p-4 m-4;
}

.tips-title {
  @apply block font-medium text-blue-800 mb-3;
  @apply dark:text-blue-200;
}

.tips-list {
  @apply space-y-2;
}

.tip-item {
  @apply block text-sm text-blue-700;
  @apply dark:text-blue-300;
}

.history-section {
  @apply p-4;
}

.section-title {
  @apply block text-lg font-semibold text-gray-900 mb-4;
  @apply dark:text-white;
}

.history-list {
  @apply space-y-3;
}

.history-item {
  @apply flex items-center justify-between p-3;
}

.history-info {
  @apply flex-1;
}

.history-date {
  @apply block text-sm font-medium text-gray-900;
  @apply dark:text-white;
}

.history-details {
  @apply block text-xs text-gray-500;
  @apply dark:text-gray-400;
}

.history-stats {
  @apply flex flex-col items-end;
}

.difficulty-tags {
  @apply flex gap-1;
}

.difficulty-tag {
  @apply px-2 py-1 text-xs rounded;
}

.difficulty-tag.基础 {
  @apply bg-green-100 text-green-800;
  @apply dark:bg-green-900 dark:text-green-200;
}

.difficulty-tag.进阶 {
  @apply bg-blue-100 text-blue-800;
  @apply dark:bg-blue-900 dark:text-blue-200;
}

.difficulty-tag.应用 {
  @apply bg-orange-100 text-orange-800;
  @apply dark:bg-orange-900 dark:text-orange-200;
}

.difficulty-tag.反思 {
  @apply bg-purple-100 text-purple-800;
  @apply dark:bg-purple-900 dark:text-purple-200;
}

.back-section {
  @apply p-4;
}

.back-btn {
  @apply w-full py-3 text-center cursor-pointer;
}

.btn-text {
  @apply text-gray-700 font-medium;
  @apply dark:text-gray-200;
}
</style>