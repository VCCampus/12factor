<template>
  <view class="growth-quiz-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">📝 测试评估</text>
      <text class="page-subtitle">多种模式，检验学习效果</text>
    </view>

    <!-- 测试模式选择 -->
    <view class="modes-section" v-if="!currentTest">
      <text class="section-title">选择测试模式</text>
      <view class="modes-grid">
        <view 
          v-for="mode in testModes"
          :key="mode.id"
          class="mode-card"
          @tap="startTest(mode.id)"
        >
          <text class="mode-icon">{{ getModeIcon(mode.id) }}</text>
          <text class="mode-name">{{ mode.name }}</text>
          <text class="mode-desc">{{ mode.description }}</text>
          
          <view class="mode-details">
            <text class="detail-item" v-if="mode.time_limit">
              ⏱️ {{ mode.time_limit }}秒/题
            </text>
            <text class="detail-item" v-if="mode.question_count">
              📋 {{ mode.question_count }}题
            </text>
            <text class="detail-item" v-if="mode.bonus_system">
              🎁 连对奖励
            </text>
            <text class="detail-item" v-if="mode.show_answers">
              👁️ 显示答案
            </text>
          </view>
          
          <view class="start-btn">
            <text class="btn-text">开始</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 测试进行中 -->
    <view class="test-section" v-if="currentTest && !showResult">
      <view class="test-header">
        <view class="test-progress">
          <text class="progress-text">
            {{ currentQuestionIndex + 1 }} / {{ currentTest.questions.length }}
          </text>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: testProgressPercentage + '%' }"
            ></view>
          </view>
        </view>
        
        <view class="test-timer" v-if="timeRemaining > 0">
          <text class="timer-text">⏱️ {{ timeRemaining }}s</text>
        </view>
      </view>

      <view class="question-card" v-if="currentQuestion">
        <view class="question-header">
          <text class="question-principle">【{{ currentQuestion.principle }}】</text>
          <text class="question-difficulty">{{ currentQuestion.difficulty }}</text>
        </view>
        
        <text class="question-text">{{ currentQuestion.question }}</text>
        
        <view class="options-list">
          <view 
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-item"
            :class="{ 
              selected: isOptionSelected(option),
              multiple: currentQuestion.type === 'multiple'
            }"
            @tap="selectOption(option)"
          >
            <view class="option-indicator">
              <text class="indicator-text">
                {{ currentQuestion.type === 'multiple' ? '☐' : '○' }}
              </text>
            </view>
            <text class="option-text">{{ option }}</text>
          </view>
        </view>
        
        <view class="question-actions">
          <view class="action-btn secondary" @tap="previousQuestion" v-if="currentQuestionIndex > 0">
            <text class="btn-text">上一题</text>
          </view>
          <view class="action-btn primary" @tap="nextQuestion">
            <text class="btn-text">
              {{ currentQuestionIndex < currentTest.questions.length - 1 ? '下一题' : '完成测试' }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 测试结果 -->
    <view class="result-section" v-if="showResult && testResult">
      <view class="result-header">
        <text class="result-title">🎉 测试完成</text>
        <text class="result-score">{{ testResult.score }}分</text>
        <text class="result-details">
          {{ testResult.correctAnswers }} / {{ testResult.totalQuestions }} 题正确
        </text>
      </view>
      
      <view class="result-stats">
        <view class="stat-item">
          <text class="stat-label">用时</text>
          <text class="stat-value">{{ formatTime(testResult.timeSpent) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">正确率</text>
          <text class="stat-value">{{ Math.round(testResult.score) }}%</text>
        </view>
      </view>

      <view class="result-actions">
        <view class="action-btn secondary" @tap="reviewAnswers">
          <text class="btn-text">查看答案</text>
        </view>
        <view class="action-btn primary" @tap="restartQuiz">
          <text class="btn-text">重新测试</text>
        </view>
      </view>
    </view>

    <!-- 测试历史 -->
    <view class="history-section" v-if="!currentTest && testHistory.length > 0">
      <text class="section-title">📈 测试记录</text>
      <view class="history-list">
        <view 
          v-for="(result, index) in recentTestHistory"
          :key="index"
          class="history-item"
        >
          <view class="history-info">
            <text class="history-mode">{{ getModeDisplayName(result.mode) }}</text>
            <text class="history-date">{{ formatDate(result.completedAt) }}</text>
          </view>
          <view class="history-score">
            <text class="score-text">{{ result.score }}分</text>
            <text class="score-details">{{ result.correctAnswers }}/{{ result.totalQuestions }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 返回按钮 -->
    <view class="back-section" v-if="!currentTest">
      <view class="back-btn" @tap="goBack">
        <text class="btn-text">← 返回原则学习</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGrowthStore } from '@/stores/growthStore'

const router = useRouter()
const growthStore = useGrowthStore()

const currentTest = ref<any>(null)
const currentQuestionIndex = ref(0)
const selectedAnswers = ref<Record<string, string | string[]>>({})
const timeRemaining = ref(0)
const timer = ref<number | null>(null)
const showResult = ref(false)
const testResult = ref<any>(null)

const testModes = computed(() => growthStore.quiz.questions.length > 0 ? [
  {
    id: 'practice',
    name: '练习模式',
    description: '无时间限制，适合初学',
    time_limit: null,
    question_count: 25,
    shuffle: true,
    immediate_feedback: true
  },
  {
    id: 'timed',
    name: '限时模式', 
    description: '每题30秒，模拟考试',
    time_limit: 30,
    question_count: 25,
    shuffle: true,
    immediate_feedback: false
  },
  {
    id: 'challenge',
    name: '挑战模式',
    description: '高难度题目，连对奖励',
    time_limit: 45,
    question_count: 20,
    shuffle: true,
    difficulty_filter: ['进阶', '应用'],
    bonus_system: true
  },
  {
    id: 'review',
    name: '复习模式',
    description: '查看所有题目和答案',
    time_limit: null,
    question_count: null,
    shuffle: false,
    show_answers: true
  }
] : [])

const testHistory = computed(() => growthStore.quiz.testHistory || [])
const recentTestHistory = computed(() => testHistory.value.slice(0, 10))

const currentQuestion = computed(() => {
  if (!currentTest.value) return null
  return currentTest.value.questions[currentQuestionIndex.value] || null
})

const testProgressPercentage = computed(() => {
  if (!currentTest.value) return 0
  return Math.round(((currentQuestionIndex.value + 1) / currentTest.value.questions.length) * 100)
})

const getModeIcon = (modeId: string): string => {
  const icons: Record<string, string> = {
    practice: '🎯',
    timed: '⏱️',
    challenge: '🔥',
    review: '📚'
  }
  return icons[modeId] || '📝'
}

const getModeDisplayName = (modeId: string): string => {
  const mode = testModes.value.find(m => m.id === modeId)
  return mode ? mode.name : modeId
}

const startTest = async (modeId: string) => {
  const session = growthStore.startTest(modeId)
  if (!session) return
  
  currentTest.value = session
  currentQuestionIndex.value = 0
  selectedAnswers.value = {}
  showResult.value = false
  testResult.value = null
  
  // 启动定时器（如果有时间限制）
  const mode = testModes.value.find(m => m.id === modeId)
  if (mode?.time_limit) {
    startTimer(mode.time_limit)
  }
}

const startTimer = (seconds: number) => {
  timeRemaining.value = seconds
  timer.value = window.setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      nextQuestion() // 自动跳转到下一题
    }
  }, 1000)
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const selectOption = (option: string) => {
  if (!currentQuestion.value) return
  
  const questionId = currentQuestion.value.id
  
  if (currentQuestion.value.type === 'multiple') {
    // 多选题
    const current = selectedAnswers.value[questionId] as string[] || []
    const index = current.indexOf(option)
    
    if (index > -1) {
      // 已选中，取消选择
      current.splice(index, 1)
    } else {
      // 未选中，添加选择
      current.push(option)
    }
    
    selectedAnswers.value[questionId] = [...current]
  } else {
    // 单选题
    selectedAnswers.value[questionId] = option
  }
  
  // 提交答案到store
  growthStore.submitAnswer(questionId, selectedAnswers.value[questionId])
}

const isOptionSelected = (option: string): boolean => {
  if (!currentQuestion.value) return false
  
  const questionId = currentQuestion.value.id
  const selected = selectedAnswers.value[questionId]
  
  if (Array.isArray(selected)) {
    return selected.includes(option)
  } else {
    return selected === option
  }
}

const nextQuestion = () => {
  if (!currentTest.value) return
  
  if (currentQuestionIndex.value < currentTest.value.questions.length - 1) {
    currentQuestionIndex.value++
    
    // 重新启动定时器
    const mode = testModes.value.find(m => m.id === currentTest.value.mode)
    if (mode?.time_limit) {
      stopTimer()
      startTimer(mode.time_limit)
    }
  } else {
    finishTest()
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const finishTest = () => {
  stopTimer()
  const result = growthStore.finishTest()
  if (result) {
    testResult.value = result
    showResult.value = true
    currentTest.value = null
  }
}

const reviewAnswers = () => {
  // 可以跳转到答案详情页面
  console.log('查看答案详情')
}

const restartQuiz = () => {
  showResult.value = false
  testResult.value = null
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    })
  }
}

const goBack = () => {
  router.push('/principles')
}

onMounted(async () => {
  if (!growthStore.quiz.questions.length) {
    await growthStore.loadQuiz()
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.growth-quiz-page {
  @apply min-h-screen bg-gray-50;
  @apply dark:bg-gray-900;
}

.page-header {
  @apply text-center py-6 px-4 bg-gradient-to-r from-green-500 to-blue-500;
}

.page-title {
  @apply block text-2xl font-bold text-white mb-2;
  @apply md:text-3xl;
}

.page-subtitle {
  @apply text-green-100 text-sm;
  @apply md:text-base;
}

.modes-section {
  @apply p-4;
}

.section-title {
  @apply block text-lg font-semibold text-gray-900 mb-4;
  @apply dark:text-white;
}

.modes-grid {
  @apply grid grid-cols-1 gap-4;
  @apply md:grid-cols-2;
}

.mode-card {
  @apply p-4 bg-white rounded-lg border border-gray-200;
  @apply hover:shadow-md transition-shadow cursor-pointer;
  @apply dark:bg-gray-800 dark:border-gray-700;
}

.mode-icon {
  @apply block text-3xl text-center mb-3;
}

.mode-name {
  @apply block text-lg font-semibold text-gray-900 mb-2 text-center;
  @apply dark:text-white;
}

.mode-desc {
  @apply block text-sm text-gray-600 mb-3 text-center;
  @apply dark:text-gray-300;
}

.mode-details {
  @apply flex flex-wrap justify-center gap-2 mb-4;
}

.detail-item {
  @apply text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded;
  @apply dark:bg-gray-700 dark:text-gray-300;
}

.start-btn {
  @apply py-2 bg-blue-500 text-white rounded-lg text-center;
  @apply hover:bg-blue-600 transition-colors;
}

.test-section {
  @apply p-4;
}

.test-header {
  @apply flex justify-between items-center mb-6;
}

.test-progress {
  @apply flex-1 mr-4;
}

.progress-text {
  @apply block text-sm text-gray-600 mb-2;
  @apply dark:text-gray-400;
}

.progress-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
  @apply dark:bg-gray-700;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-500;
  @apply transition-all duration-300;
}

.test-timer {
  @apply px-3 py-1 bg-orange-100 text-orange-800 rounded-full;
  @apply dark:bg-orange-900 dark:text-orange-200;
}

.timer-text {
  @apply text-sm font-medium;
}

.question-card {
  @apply bg-white rounded-lg border border-gray-200 p-6;
  @apply dark:bg-gray-800 dark:border-gray-700;
}

.question-header {
  @apply flex justify-between items-center mb-4;
}

.question-principle {
  @apply text-sm font-medium text-blue-600;
  @apply dark:text-blue-400;
}

.question-difficulty {
  @apply text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded;
  @apply dark:text-gray-400 dark:bg-gray-700;
}

.question-text {
  @apply text-lg text-gray-900 mb-6 leading-relaxed;
  @apply dark:text-white;
}

.options-list {
  @apply space-y-3 mb-6;
}

.option-item {
  @apply flex items-start gap-3 p-3 rounded-lg border border-gray-200;
  @apply cursor-pointer hover:bg-gray-50 transition-colors;
  @apply dark:border-gray-700 dark:hover:bg-gray-700;
}

.option-item.selected {
  @apply bg-blue-50 border-blue-200;
  @apply dark:bg-blue-900 dark:border-blue-700;
}

.option-indicator {
  @apply flex-shrink-0;
}

.indicator-text {
  @apply text-gray-400;
}

.option-item.selected .indicator-text {
  @apply text-blue-500;
}

.option-text {
  @apply flex-1 text-gray-900;
  @apply dark:text-white;
}

.question-actions {
  @apply flex gap-3 justify-between;
}

.action-btn {
  @apply flex-1 py-3 rounded-lg font-medium text-center;
  @apply min-h-[44px] flex items-center justify-center;
  @apply cursor-pointer transition-colors;
}

.action-btn.primary {
  @apply bg-blue-500 text-white;
  @apply hover:bg-blue-600;
}

.action-btn.secondary {
  @apply bg-gray-200 text-gray-700;
  @apply hover:bg-gray-300;
  @apply dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600;
}

.result-section {
  @apply p-4;
}

.result-header {
  @apply text-center mb-6;
}

.result-title {
  @apply block text-2xl font-bold text-gray-900 mb-2;
  @apply dark:text-white;
}

.result-score {
  @apply block text-4xl font-bold text-green-600 mb-2;
  @apply dark:text-green-400;
}

.result-details {
  @apply text-gray-600;
  @apply dark:text-gray-400;
}

.result-stats {
  @apply grid grid-cols-2 gap-4 mb-6;
}

.stat-item {
  @apply text-center p-4 bg-white rounded-lg;
  @apply dark:bg-gray-800;
}

.stat-label {
  @apply block text-sm text-gray-600 mb-1;
  @apply dark:text-gray-400;
}

.stat-value {
  @apply block text-xl font-bold text-gray-900;
  @apply dark:text-white;
}

.result-actions {
  @apply flex gap-3;
}

.history-section {
  @apply p-4;
}

.history-list {
  @apply space-y-3;
}

.history-item {
  @apply flex items-center justify-between p-3;
  @apply bg-white rounded-lg border border-gray-200;
  @apply dark:bg-gray-800 dark:border-gray-700;
}

.history-info {
  @apply flex-1;
}

.history-mode {
  @apply block text-sm font-medium text-gray-900;
  @apply dark:text-white;
}

.history-date {
  @apply block text-xs text-gray-500;
  @apply dark:text-gray-400;
}

.history-score {
  @apply text-right;
}

.score-text {
  @apply block text-sm font-bold text-green-600;
  @apply dark:text-green-400;
}

.score-details {
  @apply block text-xs text-gray-500;
  @apply dark:text-gray-400;
}

.back-section {
  @apply p-4;
}

.back-btn {
  @apply w-full py-3 bg-gray-200 rounded-lg text-center;
  @apply hover:bg-gray-300 transition-colors cursor-pointer;
  @apply dark:bg-gray-700 dark:hover:bg-gray-600;
}

.btn-text {
  @apply text-gray-700 font-medium;
  @apply dark:text-gray-200;
}
</style>