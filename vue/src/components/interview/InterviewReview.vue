<template>
  <AppLayout :show-footer-stats="false">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Review Header -->
      <div class="neo-card p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-text-dark dark:text-text-light">
              错题回顾
            </h1>
            <p class="text-text-muted mt-1">
              {{ jobTitle }} - {{ difficultyLabel }} | 共 {{ wrongQuestions.length }} 道错题
            </p>
          </div>
          <button @click="backToResult" class="neo-btn">
            ← 返回成绩
          </button>
        </div>
        
        <!-- Progress -->
        <div class="mt-4">
          <p class="text-sm text-text-muted mb-2">
            第 {{ currentIndex + 1 }} / {{ wrongQuestions.length }} 题
          </p>
          <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-primary-blue h-2 rounded-full transition-all duration-300"
              :style="`width: ${((currentIndex + 1) / wrongQuestions.length) * 100}%`"
            ></div>
          </div>
        </div>
      </div>

      <!-- Question Review Card -->
      <div class="neo-card p-8 mb-6">
        <!-- Question -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="neo-tag text-sm">{{ currentQuestion.category }}</span>
            <span v-if="currentQuestion.type === 'multiple'" class="neo-tag text-sm bg-orange-100 text-orange-700">
              多选题
            </span>
            <span class="neo-tag text-sm bg-red-100 text-red-700">
              原题目序号：{{ originalIndex + 1 }}
            </span>
          </div>
          <h2 class="text-xl font-medium text-text-dark dark:text-text-light">
            {{ currentQuestion.question }}
          </h2>
        </div>
        
        <!-- Options with Answer Status -->
        <div class="space-y-3 mb-6">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="neo-card p-4"
            :class="getOptionClass(option)"
          >
            <div class="flex items-start gap-3">
              <div class="mt-1">
                <div class="w-6 h-6 flex items-center justify-center">
                  <!-- Correct Answer Icon -->
                  <svg v-if="isCorrectAnswer(option)" class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <!-- Wrong Answer Icon -->
                  <svg v-else-if="isUserWrongAnswer(option)" class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                  <!-- Neutral Icon -->
                  <div v-else class="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                </div>
              </div>
              <div class="flex-1">
                <span class="text-text-dark dark:text-text-light">{{ option }}</span>
                <div v-if="isCorrectAnswer(option)" class="text-sm text-green-600 mt-1">
                  ✓ 正确答案
                </div>
                <div v-if="isUserWrongAnswer(option) && !isCorrectAnswer(option)" class="text-sm text-red-600 mt-1">
                  ✗ 你的选择（错误）
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Explanation -->
        <div class="neo-card p-6 bg-blue-50 dark:bg-blue-900 border-blue-300">
          <h3 class="font-bold text-lg mb-2 text-text-dark dark:text-text-light">
            💡 解析
          </h3>
          <p class="text-text-muted">{{ currentQuestion.explanation }}</p>
        </div>
      </div>

      <!-- Navigation -->
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
          <span class="text-text-muted self-center">
            题目 {{ currentIndex + 1 }} / {{ wrongQuestions.length }}
          </span>
        </div>
        
        <button
          @click="nextQuestion"
          :disabled="currentIndex === wrongQuestions.length - 1"
          class="neo-btn"
          :class="currentIndex === wrongQuestions.length - 1 ? 'opacity-50 cursor-not-allowed' : ''"
        >
          下一题 →
        </button>
      </div>

      <!-- Quick Jump -->
      <div class="mt-8 neo-card p-6">
        <p class="text-sm text-text-muted mb-3">快速跳转到错题</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(wrongIndex, i) in wrongQuestions"
            :key="i"
            @click="jumpToQuestion(i)"
            class="w-12 h-12 rounded text-sm font-medium transition-all"
            :class="{
              'bg-primary-blue text-white': i === currentIndex,
              'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300': i !== currentIndex
            }"
          >
            {{ wrongIndex + 1 }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

const result = ref<any>({
  questions: [],
  answers: {},
  wrongQuestions: [],
  jobType: '',
  difficulty: ''
})

const jobTitle = ref('')
const difficultyLabel = ref('')
const currentIndex = ref(0)

const wrongQuestions = computed(() => result.value.wrongQuestions || [])
const originalIndex = computed(() => wrongQuestions.value[currentIndex.value] || 0)
const currentQuestion = computed(() => {
  const idx = wrongQuestions.value[currentIndex.value]
  return result.value.questions[idx] || {}
})

const userAnswer = computed(() => {
  const idx = wrongQuestions.value[currentIndex.value]
  return result.value.answers[idx] || []
})

onMounted(async () => {
  // Load result from sessionStorage
  const sessionResult = sessionStorage.getItem('current_interview_result')
  if (sessionResult) {
    result.value = JSON.parse(sessionResult)
  } else {
    // Try to load from localStorage by sessionId
    const sessionId = route.query.sessionId as string
    if (sessionId) {
      const results = JSON.parse(localStorage.getItem('interview_results') || '[]')
      const found = results.find((r: any) => r.sessionId === sessionId)
      if (found) {
        result.value = found
      }
    }
  }
  
  // Load job metadata
  try {
    const response = await fetch('/interviews/job-index.json')
    const data = await response.json()
    
    jobTitle.value = data.jobs[result.value.jobType]?.title || result.value.jobType
    difficultyLabel.value = data.difficulties[result.value.difficulty]?.label || result.value.difficulty
  } catch (error) {
    console.error('Failed to load job metadata:', error)
  }
})

function isCorrectAnswer(option: string): boolean {
  const correctAnswer = currentQuestion.value.answer
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.includes(option)
  }
  return correctAnswer === option
}

function isUserWrongAnswer(option: string): boolean {
  return userAnswer.value.includes(option)
}

function getOptionClass(option: string): string {
  if (isCorrectAnswer(option)) {
    return 'border-green-500 bg-green-50 dark:bg-green-900'
  }
  if (isUserWrongAnswer(option) && !isCorrectAnswer(option)) {
    return 'border-red-500 bg-red-50 dark:bg-red-900'
  }
  return ''
}

function previousQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function nextQuestion() {
  if (currentIndex.value < wrongQuestions.value.length - 1) {
    currentIndex.value++
  }
}

function jumpToQuestion(index: number) {
  currentIndex.value = index
}

function backToResult() {
  router.push({
    path: `/mock-interview/${result.value.jobType}/${result.value.difficulty}/result`,
    query: { sessionId: result.value.sessionId }
  })
}
</script>

<style scoped>
</style>