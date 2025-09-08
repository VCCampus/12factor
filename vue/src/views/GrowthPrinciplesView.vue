<template>
  <AppLayout>
    <!-- 桥接层：外层用标准HTML满足AppLayout，内层保持100% uniapp语法 -->
    <div class="growth-neo-wrapper">
      <view class="growth-principles-page">
        <!-- Hero区域 -->
        <GrowthHero 
          :show-progress="true"
          @start-learning="handleStartLearning"
          @check-progress="handleCheckProgress"
        />

        <!-- 学习阶段概览 -->
        <view class="stages-section">
          <text class="section-title">📚 学习阶段</text>
          <view class="stages-grid">
            <StageCard
              v-for="stage in stages"
              :key="stage.id"
              :stage="stage"
              :completed-count="getStageCompletedCount(stage.id)"
              :total-count="getStageTotalCount(stage.id)"
              @click="handleStageClick"
            />
          </view>
        </view>

        <!-- 原则概览 -->
        <view class="principles-section">
          <text class="section-title">📖 原则概览</text>
          <view class="principles-grid">
            <view
              v-for="principle in principles"
              :key="principle.id"
              class="growth-neo-card principle-card"
              @tap="handlePrincipleClick(principle)"
            >
              <text class="principle-name">{{ principle.name }}</text>
              <text class="principle-cards">{{ principle.total_cards }}张卡片</text>
              <view class="principle-progress">
                <view class="progress-bar">
                  <view 
                    class="progress-fill" 
                    :style="{ width: getPrincipleProgress(principle.id) + '%' }"
                  ></view>
                </view>
                <text class="progress-text">{{ getPrincipleProgress(principle.id) }}%</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 快速操作 -->
        <view class="quick-actions">
          <view class="growth-neo-card action-card" @tap="goToFlashcards">
            <text class="action-icon">🎯</text>
            <text class="action-title">闪卡练习</text>
            <text class="action-desc">随机12张卡片</text>
          </view>
          <view class="growth-neo-card action-card" @tap="goToQuiz">
            <text class="action-icon">📝</text>
            <text class="action-title">测试评估</text>
            <text class="action-desc">检验学习效果</text>
          </view>
        </view>

        <!-- 学习统计 -->
        <view class="stats-section" v-if="showStats">
          <text class="section-title">📊 学习统计</text>
          <view class="stats-grid">
            <view class="growth-neo-stat stat-item">
              <text class="stat-number">{{ flashcardHistory.length }}</text>
              <text class="stat-label">练习次数</text>
            </view>
            <view class="growth-neo-stat stat-item">
              <text class="stat-number">{{ testHistory.length }}</text>
              <text class="stat-label">测试次数</text>
            </view>
            <view class="growth-neo-stat stat-item">
              <text class="stat-number">{{ completedPrinciples }}</text>
              <text class="stat-label">已掌握原则</text>
            </view>
            <view class="growth-neo-stat stat-item">
              <text class="stat-number">{{ studyDays }}</text>
              <text class="stat-label">学习天数</text>
            </view>
          </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-overlay" v-if="loading">
          <text class="loading-text">加载中...</text>
        </view>
      </view>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGrowthStore, type LearningStage } from '@/stores/growthStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import GrowthHero from '@/components/growth/common/GrowthHero.vue'
import StageCard from '@/components/growth/common/StageCard.vue'

const router = useRouter()
const growthStore = useGrowthStore()

const loading = ref(true)
const showStats = ref(false)

// 计算属性  
const stages = computed((): LearningStage[] => growthStore.stages)
const principles = computed(() => growthStore.principles)
const flashcardHistory = computed(() => growthStore.progress.principleProgress)
const testHistory = computed(() => growthStore.quiz.testHistory)

const completedPrinciples = computed(() => {
  return Object.values(growthStore.progress.principleProgress).filter(p => p >= 100).length
})

const studyDays = computed(() => {
  const history = [...testHistory.value]
  const dates = new Set(history.map(item => {
    const date = new Date(item.completedAt)
    return date.toDateString()
  }))
  return dates.size
})

// 方法
const handleStartLearning = () => {
  goToFlashcards()
}

const handleCheckProgress = () => {
  showStats.value = !showStats.value
}

const handleStageClick = (stageId: string) => {
  // 可以跳转到阶段详情页或筛选显示该阶段的原则
  console.log('点击阶段:', stageId)
}

const handlePrincipleClick = (principle: any) => {
  // 可以跳转到原则详情页
  console.log('点击原则:', principle.name)
}

const goToFlashcards = () => {
  router.push('/flashcards')
}

const goToQuiz = () => {
  router.push('/quiz')
}

const getStageCompletedCount = (stageId: string): number => {
  // 计算该阶段已完成的原则数量
  let completed = 0
  principles.value.forEach(principle => {
    const cards = principle.cards || []
    const stageCards = cards.filter(card => card.stage === stageId)
    if (stageCards.length > 0) {
      const progress = getPrincipleProgress(principle.id)
      if (progress >= 100) completed++
    }
  })
  return completed
}

const getStageTotalCount = (stageId: string): number => {
  // 计算该阶段的总原则数量
  let total = 0
  principles.value.forEach(principle => {
    const cards = principle.cards || []
    const stageCards = cards.filter(card => card.stage === stageId)
    if (stageCards.length > 0) total++
  })
  return total
}

const getPrincipleProgress = (principleId: string): number => {
  return growthStore.progress.principleProgress[principleId] || 0
}

onMounted(async () => {
  try {
    await growthStore.initialize()
  } catch (error) {
    console.error('初始化失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 桥接层样式 */
.growth-neo-wrapper {
  @apply w-full;
}

/* Growth页面基础样式 */
.growth-principles-page {
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

.growth-neo-card:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px #000;
}

/* Neobrutalism统计卡片 */
.growth-neo-stat {
  @apply bg-gray-50 border-2 border-black p-4 text-center;
  box-shadow: 2px 2px 0px #000;
  @apply dark:bg-gray-700 dark:border-gray-300;
}

.section-title {
  @apply block text-lg font-bold text-gray-900 mb-4 px-4;
  @apply md:text-xl;
  @apply dark:text-white;
}

.stages-section {
  @apply py-6;
}

.stages-grid {
  @apply grid grid-cols-1 gap-4 px-4;
  @apply md:grid-cols-2 lg:grid-cols-4;
}

.principles-section {
  @apply py-6 bg-gray-50;
  @apply dark:bg-gray-800;
}

.principles-grid {
  @apply grid grid-cols-2 gap-4 px-4;
  @apply md:grid-cols-3 lg:grid-cols-4;
}

.principle-card {
  @apply p-4;
  @apply cursor-pointer;
}

.principle-name {
  @apply block font-medium text-gray-900 text-sm mb-1;
  @apply dark:text-white;
}

.principle-cards {
  @apply block text-xs text-gray-500 mb-2;
  @apply dark:text-gray-400;
}

.principle-progress {
  @apply space-y-1;
}

.progress-bar {
  @apply w-full h-1.5 bg-gray-200 rounded-full overflow-hidden;
  @apply dark:bg-gray-600;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-400 to-purple-500;
  @apply transition-all duration-500;
}

.progress-text {
  @apply text-xs text-gray-600;
  @apply dark:text-gray-400;
}

.quick-actions {
  @apply py-6 px-4;
  @apply grid grid-cols-2 gap-4;
}

.action-card {
  @apply p-4 text-center cursor-pointer;
  /* Neobrutalism styles are applied via growth-neo-card class */
}

.action-icon {
  @apply block text-2xl mb-2;
}

.action-title {
  @apply block font-medium text-gray-900 mb-1;
  @apply dark:text-white;
}

.action-desc {
  @apply text-sm text-gray-500;
  @apply dark:text-gray-400;
}

.stats-section {
  @apply py-6 px-4 bg-white;
  @apply dark:bg-gray-800;
}

.stats-grid {
  @apply grid grid-cols-2 gap-4;
  @apply md:grid-cols-4;
}

.stat-item {
  @apply text-center p-4 bg-gray-50 rounded-lg;
  @apply dark:bg-gray-700;
}

.stat-number {
  @apply block text-2xl font-bold text-blue-600 mb-1;
  @apply dark:text-blue-400;
}

.stat-label {
  @apply text-sm text-gray-600;
  @apply dark:text-gray-400;
}

.loading-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50;
  @apply flex items-center justify-center z-50;
}

.loading-text {
  @apply text-white text-lg;
}
</style>