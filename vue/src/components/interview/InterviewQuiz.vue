<template>
  <AppLayout :show-footer-stats="false">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Quiz Header -->
      <div class="neo-card p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-text-dark dark:text-text-light">
              {{ jobTitle }} - {{ difficultyLabel }}测试
            </h1>
            <p class="text-text-muted mt-1">随机抽取25题，全面测试你的能力</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-medium text-text-dark dark:text-text-light">
              题目 {{ currentIndex + 1 }}/{{ questions.length }}
            </p>
            <p class="text-sm text-text-muted">
              ⏱️ {{ formatTime(elapsedTime) }}
            </p>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="bg-primary-blue h-2 rounded-full transition-all duration-300"
            :style="`width: ${progressPercentage}%`"
          ></div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="neo-card p-8 mb-6">
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="neo-tag text-sm">{{ currentQuestion.category }}</span>
            <span v-if="currentQuestion.type === 'multiple'" class="neo-tag text-sm bg-orange-100 text-orange-700">
              多选题
            </span>
          </div>
          <h2 class="text-xl font-medium text-text-dark dark:text-text-light">
            {{ currentQuestion.question }}
          </h2>
        </div>
        
        <!-- Options -->
        <div class="space-y-3">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="neo-card option-card p-4 cursor-pointer"
            :class="{
              'selected': isOptionSelected(index),
              'border-primary-blue': isOptionSelected(index)
            }"
            @click="toggleOption(index)"
          >
            <div class="flex items-start gap-3">
              <div class="mt-1">
                <div
                  v-if="currentQuestion.type === 'single'"
                  class="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center"
                  :class="isOptionSelected(index) ? 'bg-primary-blue border-primary-blue' : ''"
                >
                  <div v-if="isOptionSelected(index)" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div
                  v-else
                  class="w-5 h-5 rounded border-2 border-gray-400 flex items-center justify-center"
                  :class="isOptionSelected(index) ? 'bg-primary-blue border-primary-blue' : ''"
                >
                  <svg v-if="isOptionSelected(index)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <span class="text-text-dark dark:text-text-light">{{ option }}</span>
            </div>
          </div>
        </div>
        
        <!-- Warning for unanswered -->
        <div v-if="showWarning" class="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <p class="text-yellow-700 dark:text-yellow-300 text-sm">
            ⚠️ 请先选择答案再继续
          </p>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between">
        <button
          @click="previousQuestion"
          :disabled="currentIndex === 0"
          class="neo-btn"
          :class="currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''"
        >
          ← 上一题
        </button>
        
        <div class="flex gap-2">
          <button
            v-if="currentIndex < questions.length - 1"
            @click="nextQuestion"
            class="neo-btn btn-primary"
          >
            下一题 →
          </button>
          <button
            v-else
            @click="submitQuiz"
            class="neo-btn btn-success"
          >
            提交答卷
          </button>
        </div>
      </div>
      
      <!-- Answer Grid -->
      <div class="mt-8 neo-card p-6">
        <p class="text-sm text-text-muted mb-3">答题进度</p>
        <div class="grid grid-cols-10 gap-2">
          <button
            v-for="(q, index) in questions"
            :key="index"
            @click="jumpToQuestion(index)"
            class="w-10 h-10 rounded text-sm font-medium transition-all"
            :class="{
              'bg-primary-blue text-white': answers[index] && answers[index].length > 0,
              'bg-gray-200 dark:bg-gray-700': !answers[index] || answers[index].length === 0,
              'ring-2 ring-primary-blue': index === currentIndex
            }"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const router = useRouter()

interface Question {
  id: string
  category: string
  type: 'single' | 'multiple'
  question: string
  options: string[]
  answer: string | string[]
  explanation: string
}

const jobType = ref<string>('')
const difficulty = ref<string>('')
const jobTitle = ref<string>('')
const difficultyLabel = ref<string>('')

const questions = ref<Question[]>([])
const currentIndex = ref(0)
const answers = ref<Record<number, string[]>>({})
const startTime = ref<number>(Date.now())
const elapsedTime = ref(0)
const showWarning = ref(false)

let timer: ReturnType<typeof setInterval> | null = null

const currentQuestion = computed(() => questions.value[currentIndex.value] || {})
const progressPercentage = computed(() => {
  const answered = Object.values(answers.value).filter(a => a && a.length > 0).length
  return Math.round((answered / questions.value.length) * 100)
})

onMounted(async () => {
  jobType.value = route.params.jobType as string
  difficulty.value = route.params.difficulty as string
  
  // Load questions
  await loadQuestions()
  
  // Start timer
  startTime.value = Date.now()
  timer = setInterval(() => {
    elapsedTime.value = Date.now() - startTime.value
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

async function loadQuestions() {
  try {
    // Load job index for metadata
    const indexResponse = await fetch('/interviews/job-index.json')
    const indexData = await indexResponse.json()
    
    jobTitle.value = indexData.jobs[jobType.value]?.title || jobType.value
    difficultyLabel.value = indexData.difficulties[difficulty.value]?.label || difficulty.value
    
    // Load question bank
    const questionsResponse = await fetch(`/interviews/${jobType.value}_${difficulty.value}.json`)
    const questionData = await questionsResponse.json()
    
    // Random select 25 questions
    const allQuestions = questionData.questions
    const selectedQuestions = randomSelectQuestions(allQuestions, 25)
    questions.value = selectedQuestions
    
    // Initialize answers
    questions.value.forEach((_, index) => {
      answers.value[index] = []
    })
  } catch (error) {
    console.error('Failed to load questions:', error)
    alert('加载题目失败，请刷新重试')
  }
}

function randomSelectQuestions(allQuestions: Question[], count: number): Question[] {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function isOptionSelected(optionIndex: number): boolean {
  const currentAnswers = answers.value[currentIndex.value] || []
  const optionValue = currentQuestion.value.options[optionIndex]
  return currentAnswers.includes(optionValue)
}

function toggleOption(optionIndex: number) {
  const optionValue = currentQuestion.value.options[optionIndex]
  const currentAnswers = answers.value[currentIndex.value] || []
  
  if (currentQuestion.value.type === 'single') {
    // Single choice - replace answer
    answers.value[currentIndex.value] = [optionValue]
  } else {
    // Multiple choice - toggle
    const index = currentAnswers.indexOf(optionValue)
    if (index > -1) {
      currentAnswers.splice(index, 1)
    } else {
      currentAnswers.push(optionValue)
    }
    answers.value[currentIndex.value] = [...currentAnswers]
  }
  
  showWarning.value = false
}

function nextQuestion() {
  // Check if current question is answered
  if (!answers.value[currentIndex.value] || answers.value[currentIndex.value].length === 0) {
    showWarning.value = true
    return
  }
  
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    showWarning.value = false
  }
}

function previousQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showWarning.value = false
  }
}

function jumpToQuestion(index: number) {
  currentIndex.value = index
  showWarning.value = false
}

function submitQuiz() {
  // Check if current question is answered
  if (!answers.value[currentIndex.value] || answers.value[currentIndex.value].length === 0) {
    showWarning.value = true
    return
  }
  
  // Check for unanswered questions
  const unanswered = questions.value.filter((_, i) => 
    !answers.value[i] || answers.value[i].length === 0
  )
  
  if (unanswered.length > 0) {
    const confirmed = confirm(`还有 ${unanswered.length} 题未作答，确定要提交吗？`)
    if (!confirmed) return
  }
  
  // Calculate score
  const result = calculateScore()
  
  // Save result to localStorage
  saveResult(result)
  
  // Navigate to result page
  router.push({
    path: `/mock-interview/${jobType.value}/${difficulty.value}/result`,
    query: { sessionId: result.sessionId }
  })
}

function calculateScore() {
  let correctCount = 0
  const wrongQuestions: number[] = []
  const categoryScores: Record<string, { correct: number; total: number }> = {}
  
  questions.value.forEach((question, index) => {
    const userAnswer = answers.value[index] || []
    const correctAnswer = Array.isArray(question.answer) ? question.answer : [question.answer]
    
    // Initialize category score
    if (!categoryScores[question.category]) {
      categoryScores[question.category] = { correct: 0, total: 0 }
    }
    categoryScores[question.category].total++
    
    // Check if answer is correct
    const isCorrect = userAnswer.length === correctAnswer.length &&
      userAnswer.every(a => correctAnswer.includes(a))
    
    if (isCorrect) {
      correctCount++
      categoryScores[question.category].correct++
    } else {
      wrongQuestions.push(index)
    }
  })
  
  const totalScore = Math.round((correctCount / questions.value.length) * 100)
  
  return {
    sessionId: `${jobType.value}_${difficulty.value}_${Date.now()}`,
    jobType: jobType.value,
    difficulty: difficulty.value,
    totalScore,
    correctCount,
    totalQuestions: questions.value.length,
    timeSpent: Math.floor(elapsedTime.value / 60000), // minutes
    categoryScores,
    wrongQuestions,
    answers: answers.value,
    questions: questions.value,
    completedAt: new Date().toISOString()
  }
}

function saveResult(result: any) {
  // Save to interview_results
  const existingResults = JSON.parse(localStorage.getItem('interview_results') || '[]')
  existingResults.unshift(result)
  // Keep only last 20 results
  if (existingResults.length > 20) {
    existingResults.pop()
  }
  localStorage.setItem('interview_results', JSON.stringify(existingResults))
  
  // Update interview_sessions
  const sessions = JSON.parse(localStorage.getItem('interview_sessions') || '{}')
  const sessionKey = `${jobType.value}_${difficulty.value}`
  
  if (!sessions[sessionKey] || result.totalScore > sessions[sessionKey].bestScore) {
    sessions[sessionKey] = {
      bestScore: result.totalScore,
      attempts: (sessions[sessionKey]?.attempts || 0) + 1,
      lastAttempt: result.completedAt
    }
  }
  
  localStorage.setItem('interview_sessions', JSON.stringify(sessions))
  
  // Store current session for result page
  sessionStorage.setItem('current_interview_result', JSON.stringify(result))
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.option-card {
  transition: all 0.2s ease;
  border: 2px solid var(--color-border);
}

.option-card:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
}

.option-card.selected {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
}
</style>