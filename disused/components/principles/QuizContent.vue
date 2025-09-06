<template>
  <div class="quiz-content">
    <!-- 测试模式选择 -->
    <div v-if="!isQuizActive" class="mode-selection mb-8">
      <h3 class="text-lg font-semibold text-center mb-6">选择测试模式</h3>
      <div class="mode-grid">
        <div 
          @click="selectMode('practice')" 
          :class="['mode-card', { active: selectedMode === 'practice' }]"
        >
          <div class="mode-icon">🎨</div>
          <h4 class="mode-title">练习模式</h4>
          <p class="mode-description">无时间限制，可查看解释</p>
        </div>
        
        <div 
          @click="selectMode('exam')" 
          :class="['mode-card', { active: selectedMode === 'exam' }]"
        >
          <div class="mode-icon">🏆</div>
          <h4 class="mode-title">考试模式</h4>
          <p class="mode-description">15分钟限时，模拟真实考试</p>
        </div>
        
        <div 
          @click="selectMode('review')" 
          :class="['mode-card', { active: selectedMode === 'review' }]"
        >
          <div class="mode-icon">📚</div>
          <h4 class="mode-title">复习模式</h4>
          <p class="mode-description">针对性复习错题和难点</p>
        </div>
      </div>
      
      <!-- 开始按钮 -->
      <div class="text-center mt-8">
        <button 
          @click="startQuiz" 
          :disabled="!selectedMode"
          class="neo-btn neo-btn-lg"
        >
          开始测试
        </button>
      </div>
    </div>

    <!-- 测试进行中 -->
    <div v-else class="quiz-active">
      <!-- 进度条 -->
      <div class="quiz-header mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-bold">问题 {{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</span>
          <span v-if="selectedMode === 'exam'" class="text-sm text-error-red">
            ⏰ {{ formatTime(timeRemaining) }}
          </span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 题目 -->
      <div class="question-card">
        <h3 class="question-title">{{ currentQuestion.question }}</h3>
        
        <!-- 选项 -->
        <div class="options-list">
          <div 
            v-for="(option, idx) in currentQuestion.options" 
            :key="idx"
            @click="selectAnswer(idx)"
            :class="getOptionClass(idx)"
            class="option-item"
          >
            <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
            <span class="option-text">{{ option }}</span>
          </div>
        </div>
        
        <!-- 解释（练习模式） -->
        <div v-if="selectedMode === 'practice' && showExplanation" class="explanation">
          <p class="font-bold mb-2">💡 解释：</p>
          <p>{{ currentQuestion.explanation }}</p>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="quiz-controls">
        <button 
          @click="previousQuestion" 
          :disabled="currentQuestionIndex === 0"
          class="neo-btn"
        >
          上一题
        </button>
        
        <button 
          v-if="selectedMode === 'practice'"
          @click="showHint"
          class="neo-btn neo-btn-secondary"
        >
          查看提示
        </button>
        
        <button 
          @click="nextQuestion"
          class="neo-btn neo-btn-primary"
        >
          {{ currentQuestionIndex === totalQuestions - 1 ? '完成' : '下一题' }}
        </button>
      </div>
    </div>

    <!-- 测试结果 -->
    <div v-if="showResults" class="quiz-results">
      <div class="neo-card p-8 text-center">
        <h2 class="text-3xl font-bold mb-4">
          {{ getResultEmoji() }} 测试完成！
        </h2>
        
        <div class="score-display">
          <div class="score-number">{{ score }}</div>
          <div class="score-label">分</div>
        </div>
        
        <div class="result-stats">
          <div class="stat">
            <span class="stat-value">{{ correctAnswers }}/{{ totalQuestions }}</span>
            <span class="stat-label">正确率</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ formatTime(timeSpent) }}</span>
            <span class="stat-label">用时</span>
          </div>
        </div>
        
        <div class="result-actions">
          <button @click="reviewWrongAnswers" class="neo-btn">
            查看错题
          </button>
          <button @click="restartQuiz" class="neo-btn">
            重新测试
          </button>
          <button @click="$emit('goToStudy')" class="neo-btn neo-btn-primary">
            返回学习
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'

const quizStore = useQuizStore()

// 状态
const selectedMode = ref('')
const isQuizActive = ref(false)
const showResults = ref(false)
const currentQuestionIndex = ref(0)
const selectedAnswers = ref<number[]>([])
const showExplanation = ref(false)
const timeRemaining = ref(900) // 15分钟
const timeSpent = ref(0)
const timer = ref<number | null>(null)

defineEmits<{
  goToStudy: []
}>()

// 模拟的题目数据
const mockQuestions = ref<any[]>([])

// 计算属性
const totalQuestions = computed(() => mockQuestions.value.length || 10)
const currentQuestion = computed(() => mockQuestions.value[currentQuestionIndex.value])
const score = computed(() => {
  const correct = correctAnswers.value
  return Math.round((correct / totalQuestions.value) * 100)
})
const correctAnswers = computed(() => {
  return selectedAnswers.value.filter((a, i) => 
    a === mockQuestions.value[i]?.correctAnswer
  ).length
})

// 选择模式
const selectMode = (mode: string) => {
  selectedMode.value = mode
}

// 开始测试
const startQuiz = async () => {
  // 生成模拟题目
  mockQuestions.value = generateMockQuestions()
  isQuizActive.value = true
  showResults.value = false
  currentQuestionIndex.value = 0
  selectedAnswers.value = []
  
  if (selectedMode.value === 'exam') {
    startTimer()
  }
}

// 生成模拟题目
const generateMockQuestions = () => {
  const questions = []
  for (let i = 0; i < 10; i++) {
    questions.push({
      id: `q${i}`,
      question: `这是第 ${i + 1} 道测试题目？`,
      options: ['选项A', '选项B', '选项C', '选项D'],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: '这是题目的解释说明'
    })
  }
  return questions
}

// 计时器
const startTimer = () => {
  timer.value = window.setInterval(() => {
    timeRemaining.value--
    timeSpent.value++
    
    if (timeRemaining.value <= 0) {
      finishQuiz()
    }
  }, 1000)
}

// 选择答案
const selectAnswer = (idx: number) => {
  selectedAnswers.value[currentQuestionIndex.value] = idx
  
  if (selectedMode.value === 'practice') {
    showExplanation.value = true
  }
}

// 获取选项样式
const getOptionClass = (idx: number) => {
  if (!selectedAnswers.value[currentQuestionIndex.value] === undefined) return ''
  
  const selected = selectedAnswers.value[currentQuestionIndex.value] === idx
  const correct = currentQuestion.value?.correctAnswer === idx
  
  if (selectedMode.value === 'practice' && selected) {
    return correct ? 'correct' : 'incorrect'
  }
  
  return selected ? 'selected' : ''
}

// 上一题
const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    showExplanation.value = false
  }
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
    showExplanation.value = false
  } else {
    finishQuiz()
  }
}

// 显示提示
const showHint = () => {
  showExplanation.value = true
}

// 完成测试
const finishQuiz = () => {
  isQuizActive.value = false
  showResults.value = true
  
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  
  // 保存答案（实际项目中可以提交到后端）
  console.log('提交答案:', selectedAnswers.value)
}

// 查看错题
const reviewWrongAnswers = () => {
  // 实现查看错题逻辑
}

// 重新开始
const restartQuiz = () => {
  showResults.value = false
  selectedMode.value = ''
  timeRemaining.value = 900
  timeSpent.value = 0
}

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 获取结果表情
const getResultEmoji = () => {
  const percentage = (correctAnswers.value / totalQuestions.value) * 100
  if (percentage >= 90) return '🎉'
  if (percentage >= 70) return '😊'
  if (percentage >= 50) return '🤔'
  return '😅'
}

// 清理
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
/* 模式选择 */
.mode-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto;
}

.mode-card {
  @apply neo-card p-6 text-center cursor-pointer transition-all;
}

.mode-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px theme('colors.border-black');
}

.mode-card.active {
  @apply bg-primary-blue text-white;
}

.mode-icon {
  @apply text-3xl mb-2;
}

.mode-title {
  @apply font-bold mb-2;
}

.mode-description {
  @apply text-sm opacity-80;
}

/* 进度条 */
.progress-bar {
  @apply w-full h-4 bg-gray-200 border-2 border-black;
}

.progress-fill {
  @apply h-full bg-primary-blue transition-all duration-300;
}

/* 题目卡片 */
.question-card {
  @apply neo-card p-6 mb-6;
}

.question-title {
  @apply text-xl font-bold mb-6;
}

/* 选项 */
.options-list {
  @apply space-y-3;
}

.option-item {
  @apply flex items-center p-4 bg-white border-2 border-black cursor-pointer transition-all;
  box-shadow: 2px 2px 0px theme('colors.border-black');
}

.option-item:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px theme('colors.border-black');
}

.option-item.selected {
  @apply bg-blue-100;
}

.option-item.correct {
  @apply bg-green-100 border-green-600;
}

.option-item.incorrect {
  @apply bg-red-100 border-red-600;
}

.option-letter {
  @apply w-8 h-8 bg-primary-blue text-white font-bold flex items-center justify-center mr-3;
  @apply border-2 border-black;
}

/* 解释 */
.explanation {
  @apply mt-4 p-4 bg-yellow-50 border-2 border-black;
}

/* 控制按钮 */
.quiz-controls {
  @apply flex justify-between items-center;
}

/* 结果 */
.score-display {
  @apply flex items-baseline justify-center mb-6;
}

.score-number {
  @apply text-5xl font-bold text-primary-blue;
}

.score-label {
  @apply text-xl ml-2;
}

.result-stats {
  @apply flex justify-center gap-8 mb-6;
}

.result-actions {
  @apply flex justify-center gap-4;
}
</style>