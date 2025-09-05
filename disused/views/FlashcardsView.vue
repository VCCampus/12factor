<template>
  <AppLayout>
    <div class="flashcards-view">
      <!-- 头部标题区域 -->
      <div class="header-section">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-text-dark mb-4">闪卡练习</h1>
          <p class="text-gray-600 mb-6">通过间隔重复算法，高效掌握核心概念</p>
        </div>

        <!-- 学习模式选择 -->
        <div class="mode-selector mb-8">
          <div class="flex justify-center gap-4">
            <button 
              @click="setMode('review')" 
              :class="['mode-btn', { active: currentMode === 'review' }]"
            >
              📚 复习模式
            </button>
            <button 
              @click="setMode('learn')" 
              :class="['mode-btn', { active: currentMode === 'learn' }]"
            >
              🎯 学习模式
            </button>
            <button 
              @click="setMode('challenge')" 
              :class="['mode-btn', { active: currentMode === 'challenge' }]"
            >
              🏆 挑战模式
            </button>
          </div>
        </div>

        <!-- 学习统计 -->
        <div class="stats-overview mb-8" v-if="configStore.isInitialized">
          <div class="flex justify-center gap-8">
            <div class="stat-card">
              <div class="stat-number">{{ filteredPrinciples.length }}</div>
              <div class="stat-label">待学习卡片</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ sessionStats.completed }}</div>
              <div class="stat-label">本次完成</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ Math.round(sessionStats.averageScore) }}%</div>
              <div class="stat-label">平均得分</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主学习区域 -->
      <div class="learning-section" v-if="!isLoading && currentPrinciple">
        <FlashCard
          :principle="currentPrinciple"
          :current-index="currentIndex"
          :total-cards="filteredPrinciples.length"
          @difficulty="handleDifficultyRating"
          @next="nextCard"
          @previous="previousCard"
          @flip="handleCardFlip"
        />
      </div>

      <!-- 学习完成 -->
      <div class="completion-section" v-else-if="!isLoading && isSessionComplete">
        <div class="neo-card p-8 text-center">
          <div class="completion-icon mb-6">🎉</div>
          <h2 class="text-2xl font-bold mb-4">学习完成！</h2>
          <p class="text-gray-600 mb-6">太棒了！你已经完成了本次闪卡练习</p>
          
          <div class="session-summary mb-8">
            <div class="flex justify-center gap-8">
              <div class="summary-item">
                <div class="summary-number text-green-600">{{ sessionStats.completed }}</div>
                <div class="summary-label">已完成</div>
              </div>
              <div class="summary-item">
                <div class="summary-number text-blue-600">{{ Math.round(sessionStats.totalTime / 60) }}min</div>
                <div class="summary-label">学习时长</div>
              </div>
              <div class="summary-item">
                <div class="summary-number text-purple-600">{{ Math.round(sessionStats.averageScore) }}%</div>
                <div class="summary-label">平均得分</div>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button @click="restartSession" class="neo-btn mr-4">
              🔄 重新开始
            </button>
            <RouterLink to="/principles" class="neo-btn-secondary">
              📖 学习原则
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-section" v-else-if="isLoading">
        <div class="neo-card p-8 text-center">
          <div class="loading-icon mb-4">⏳</div>
          <h2 class="text-xl font-bold mb-2">准备闪卡...</h2>
          <p class="text-gray-600">正在加载学习内容</p>
        </div>
      </div>

      <!-- 无内容状态 -->
      <div class="empty-section" v-else>
        <div class="neo-card p-8 text-center">
          <div class="empty-icon mb-4">📋</div>
          <h2 class="text-xl font-bold mb-2">暂无闪卡</h2>
          <p class="text-gray-600 mb-6">请先在原则学习中选择要练习的内容</p>
          <RouterLink to="/principles" class="neo-btn">
            📖 开始学习
          </RouterLink>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import FlashCard from '@/components/FlashCard.vue'
import { useConfigStore } from '@/stores/config'
import { useProgressStore } from '@/stores/progress'
import type { Principle } from '@/stores/config'

// 学习模式类型
type LearningMode = 'review' | 'learn' | 'challenge'

// 会话统计类型
interface SessionStats {
  completed: number
  totalTime: number
  averageScore: number
  difficulties: Record<'easy' | 'medium' | 'hard', number>
}

const configStore = useConfigStore()
const progressStore = useProgressStore()

// 状态管理
const isLoading = ref(true)
const currentMode = ref<LearningMode>('learn')
const currentIndex = ref(0)
const sessionStartTime = ref(Date.now())

// 会话统计
const sessionStats = ref<SessionStats>({
  completed: 0,
  totalTime: 0,
  averageScore: 0,
  difficulties: { easy: 0, medium: 0, hard: 0 }
})

// 计算属性
const filteredPrinciples = computed((): Principle[] => {
  if (!configStore.isInitialized) return []
  
  const allPrinciples = configStore.getAllPrinciples()
  
  switch (currentMode.value) {
    case 'review':
      // 复习模式：显示需要复习的卡片（已学习但需要巩固）
      return allPrinciples.filter((principle: Principle) => {
        const progress = progressStore.getPrincipleProgress(principle.id)
        return progress && progress.status !== 'not-started'
      })
    
    case 'learn':
      // 学习模式：显示所有卡片
      return allPrinciples
    
    case 'challenge':
      // 挑战模式：只显示困难的卡片
      return allPrinciples.filter((principle: Principle) => {
        const progress = progressStore.getPrincipleProgress(principle.id)
        return !progress || progress.status === 'not-started' || progress.status === 'in-progress'
      })
    
    default:
      return allPrinciples
  }
})

const currentPrinciple = computed(() => {
  if (currentIndex.value >= 0 && currentIndex.value < filteredPrinciples.value.length) {
    return filteredPrinciples.value[currentIndex.value]
  }
  return null
})

const isSessionComplete = computed(() => {
  return filteredPrinciples.value.length > 0 && 
         currentIndex.value >= filteredPrinciples.value.length
})

// 方法
async function initializeFlashcards() {
  try {
    isLoading.value = true
    
    // 等待数据加载完成
    if (!configStore.isInitialized) {
      await configStore.initialize()
    }
    
    if (!progressStore.isInitialized) {
      await progressStore.initialize()
    }
    
    // 重置会话状态
    resetSession()
    
  } catch (error) {
    console.error('闪卡初始化失败:', error)
  } finally {
    isLoading.value = false
  }
}

function setMode(mode: LearningMode) {
  currentMode.value = mode
  currentIndex.value = 0
  resetSession()
}

function resetSession() {
  sessionStartTime.value = Date.now()
  sessionStats.value = {
    completed: 0,
    totalTime: 0,
    averageScore: 0,
    difficulties: { easy: 0, medium: 0, hard: 0 }
  }
}

function handleDifficultyRating(difficulty: 'easy' | 'medium' | 'hard') {
  if (!currentPrinciple.value) return
  
  // 更新会话统计
  sessionStats.value.difficulties[difficulty]++
  sessionStats.value.completed++
  sessionStats.value.totalTime = Date.now() - sessionStartTime.value
  
  // 计算平均得分 (简化算法)
  const scores = {
    easy: 100,
    medium: 75,
    hard: 50
  }
  
  const totalScore = Object.entries(sessionStats.value.difficulties)
    .reduce((sum, [diff, count]) => {
      return sum + (scores[diff as keyof typeof scores] * count)
    }, 0)
  
  sessionStats.value.averageScore = totalScore / sessionStats.value.completed
  
  // 更新进度存储
  progressStore.recordStudySession(currentPrinciple.value.id, 5) // 5分钟学习时间
  
  // 根据难度更新原则状态
  const currentProgress = progressStore.getPrincipleProgress(currentPrinciple.value.id)
  let newStatus = 'in-progress'
  
  if (difficulty === 'easy') {
    newStatus = 'completed'
  } else if (difficulty === 'medium') {
    newStatus = 'in-progress'
  }
  
  progressStore.updatePrincipleProgress(currentPrinciple.value.id, {
    status: newStatus as any,
    studyTime: (currentProgress?.studyTime || 0) + 5
  })
}

function nextCard() {
  if (currentIndex.value < filteredPrinciples.value.length - 1) {
    currentIndex.value++
  } else {
    // 会话完成
    currentIndex.value = filteredPrinciples.value.length
  }
}

function previousCard() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function handleCardFlip() {
  // 处理卡片翻转事件（如果需要额外逻辑）
  console.log('卡片已翻转')
}

function restartSession() {
  currentIndex.value = 0
  resetSession()
}

// 监听模式变化，重新筛选卡片
watch(currentMode, () => {
  currentIndex.value = 0
})

// 生命周期
onMounted(async () => {
  await initializeFlashcards()
})
</script>

<style scoped>
.flashcards-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  margin-bottom: 40px;
}

.mode-selector {
  display: flex;
  justify-content: center;
}

.mode-btn {
  padding: 12px 24px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.mode-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-1px);
}

.mode-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.stats-overview {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-card {
  text-align: center;
  padding: 12px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.learning-section {
  margin: 40px 0;
}

.completion-section,
.loading-section,
.empty-section {
  margin: 60px 0;
}

.completion-icon,
.loading-icon,
.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.loading-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.session-summary {
  background: #f1f5f9;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.summary-item {
  text-align: center;
}

.summary-number {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .flashcards-view {
    padding: 16px;
  }
  
  .mode-selector .flex {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  
  .mode-btn {
    width: 200px;
  }
  
  .stats-overview .flex {
    flex-direction: column;
    gap: 16px;
  }
  
  .session-summary .flex {
    flex-direction: column;
    gap: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .neo-btn,
  .action-buttons .neo-btn-secondary {
    width: 100%;
    text-align: center;
  }
}
</style>