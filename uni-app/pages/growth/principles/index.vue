<template>
  <view class="principles-page">
    <!-- 成长原则概览页 -->
    <view class="page-header">
      <NeoCard variant="primary" class="hero-card">
        <template #header>
          <view class="hero-header">
            <text class="hero-title">个人成长12原则</text>
            <text class="hero-subtitle">Personal Growth 12 Principles</text>
          </view>
        </template>
        
        <view class="hero-content">
          <text class="hero-description">
            掌握个人成长的核心原则，通过系统化学习提升自我认知和能力发展
          </text>
          
          <view class="stats-grid">
            <view class="stat-item">
              <text class="stat-number">{{ totalPrinciples }}</text>
              <text class="stat-label">原则总数</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ completedPrinciples }}</text>
              <text class="stat-label">已掌握</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ studyProgress }}%</text>
              <text class="stat-label">学习进度</text>
            </view>
          </view>
        </view>
      </NeoCard>
    </view>
    
    <!-- 学习阶段导航 -->
    <view class="stages-section">
      <text class="section-title">学习阶段</text>
      
      <view class="stages-grid">
        <NeoCard 
          v-for="stage in learningStages" 
          :key="stage.id"
          class="stage-card"
          :variant="getStageVariant(stage.progress)"
          @click="navigateToStage(stage.id)"
        >
          <view class="stage-content">
            <view class="stage-icon">
              <text class="stage-emoji">{{ stage.icon }}</text>
            </view>
            <text class="stage-title">{{ stage.title }}</text>
            <text class="stage-description">{{ stage.description }}</text>
            
            <view class="stage-progress">
              <view class="progress-bar">
                <view 
                  class="progress-fill" 
                  :style="{ width: stage.progress + '%' }"
                ></view>
              </view>
              <text class="progress-text">{{ stage.progress }}%</text>
            </view>
          </view>
        </NeoCard>
      </view>
    </view>
    
    <!-- 快速操作 */
    <view class="actions-section">
      <text class="section-title">快速开始</text>
      
      <view class="actions-grid">
        <NeoButton 
          variant="primary" 
          size="lg" 
          @click="startFlashcards"
          class="action-button"
        >
          🎯 闪卡练习
        </NeoButton>
        
        <NeoButton 
          variant="accent" 
          size="lg" 
          @click="startQuiz"
          class="action-button"
        >
          🏆 知识测试
        </NeoButton>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGrowthStore } from '@/stores/growthStore'
import NeoCard from '@/components/neo/NeoCard.vue'
import NeoButton from '@/components/neo/NeoButton.vue'

// 状态管理
const growthStore = useGrowthStore()

// 页面数据
const totalPrinciples = computed(() => growthStore.principles?.length || 12)
const completedPrinciples = computed(() => {
  return Object.values(growthStore.principleProgress).filter(p => p >= 80).length
})
const studyProgress = computed(() => {
  const total = Object.values(growthStore.principleProgress).reduce((sum, progress) => sum + progress, 0)
  return Math.round(total / totalPrinciples.value)
})

// 学习阶段数据
const learningStages = computed(() => [
  {
    id: 'overview',
    title: '原则概览',
    description: '了解12个核心成长原则',
    icon: '📚',
    progress: growthStore.stageProgress.overview || 0
  },
  {
    id: 'flashcards', 
    title: '闪卡练习',
    description: '通过闪卡深化理解',
    icon: '🎯',
    progress: growthStore.stageProgress.flashcards || 0
  },
  {
    id: 'quiz',
    title: '知识测试',
    description: '验证学习成果',
    icon: '🏆', 
    progress: growthStore.stageProgress.quiz || 0
  }
])

// 辅助函数
const getStageVariant = (progress: number) => {
  if (progress >= 80) return 'success'
  if (progress >= 50) return 'warning'
  if (progress >= 20) return 'accent'
  return 'default'
}

const navigateToStage = (stageId: string) => {
  switch (stageId) {
    case 'flashcards':
      uni.navigateTo({ url: '/pages/growth/flashcards/index' })
      break
    case 'quiz':
      uni.navigateTo({ url: '/pages/growth/quiz/index' })
      break
    default:
      // 概览页面，可以展示更多详情
      break
  }
}

const startFlashcards = () => {
  uni.navigateTo({ url: '/pages/growth/flashcards/index' })
}

const startQuiz = () => {
  uni.navigateTo({ url: '/pages/growth/quiz/index' })
}

// 页面生命周期
onLoad(() => {
  console.log('成长原则页加载')
})

onMounted(async () => {
  // 初始化数据
  await growthStore.initialize()
})
</script>

<style lang="scss" scoped>
.principles-page {
  padding: var(--neo-spacing-lg);
  background: var(--neo-white);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--neo-spacing-2xl);
}

.hero-card {
  background: var(--neo-primary);
}

.hero-header {
  text-align: center;
}

.hero-title {
  display: block;
  font-size: var(--neo-font-size-3xl);
  font-weight: 700;
  color: var(--neo-black);
  margin-bottom: var(--neo-spacing-sm);
}

.hero-subtitle {
  display: block;
  font-size: var(--neo-font-size-lg);
  color: var(--neo-gray-700);
}

.hero-content {
  text-align: center;
  margin-top: var(--neo-spacing-lg);
}

.hero-description {
  display: block;
  font-size: var(--neo-font-size-base);
  line-height: 1.6;
  margin-bottom: var(--neo-spacing-xl);
}

.stats-grid {
  display: flex;
  justify-content: space-around;
  gap: var(--neo-spacing-lg);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: var(--neo-font-size-2xl);
  font-weight: 700;
  color: var(--neo-black);
}

.stat-label {
  font-size: var(--neo-font-size-sm);
  color: var(--neo-gray-600);
  margin-top: var(--neo-spacing-xs);
}

.stages-section,
.actions-section {
  margin-bottom: var(--neo-spacing-2xl);
}

.section-title {
  display: block;
  font-size: var(--neo-font-size-xl);
  font-weight: 600;
  margin-bottom: var(--neo-spacing-lg);
  color: var(--neo-black);
}

.stages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--neo-spacing-lg);
}

.stage-card {
  cursor: pointer;
}

.stage-content {
  text-align: center;
}

.stage-icon {
  margin-bottom: var(--neo-spacing-md);
}

.stage-emoji {
  font-size: var(--neo-font-size-4xl);
}

.stage-title {
  display: block;
  font-size: var(--neo-font-size-lg);
  font-weight: 600;
  margin-bottom: var(--neo-spacing-sm);
}

.stage-description {
  display: block;
  font-size: var(--neo-font-size-sm);
  color: var(--neo-gray-600);
  margin-bottom: var(--neo-spacing-lg);
}

.stage-progress {
  display: flex;
  align-items: center;
  gap: var(--neo-spacing-sm);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--neo-gray-200);
  border: 2px solid var(--neo-black);
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--neo-success);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: var(--neo-font-size-sm);
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

.actions-grid {
  display: flex;
  gap: var(--neo-spacing-lg);
  justify-content: center;
}

.action-button {
  min-width: 160px;
}

/* 响应式适配 */
/* #ifdef H5 */
@media (max-width: 768px) {
  .stats-grid {
    flex-direction: column;
    gap: var(--neo-spacing-md);
  }
  
  .stages-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}
/* #endif */

/* 小程序端适配 */
/* #ifdef MP-WEIXIN */
.stages-grid {
  display: flex;
  flex-direction: column;
  gap: var(--neo-spacing-lg);
}

.actions-grid {
  flex-direction: column;
  gap: var(--neo-spacing-lg);
}
/* #endif */
</style>