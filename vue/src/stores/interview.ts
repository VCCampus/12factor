import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface InterviewState {
  // 显示层数据（给导航栏进度条用）
  display: {
    currentQuestion: number
    totalQuestions: number
    progressText: string
    progressPercentage: number
    isActive: boolean
  }
  
  // 会话层数据（给面试组件用）
  session: {
    difficulty: 'basic' | 'advanced' | 'expert'
    difficultyTitle: string
    sessionId: string
    startTime: number | null
  }
}

export const useInterviewStore = defineStore('interview', () => {
  // 状态
  const currentQuestion = ref(0)
  const totalQuestions = ref(0)
  const difficulty = ref<'basic' | 'advanced' | 'expert'>('basic')
  const difficultyTitle = ref('')
  const sessionId = ref('')
  const startTime = ref<number | null>(null)
  const isActive = ref(false)

  // 计算属性
  const progressText = computed(() => {
    if (!isActive.value || totalQuestions.value === 0) return ''
    return `${currentQuestion.value}/${totalQuestions.value}`
  })

  const progressPercentage = computed(() => {
    if (!isActive.value || totalQuestions.value === 0) return 0
    return Math.round((currentQuestion.value / totalQuestions.value) * 100)
  })

  const displayData = computed(() => ({
    currentQuestion: currentQuestion.value,
    totalQuestions: totalQuestions.value,
    progressText: progressText.value,
    progressPercentage: progressPercentage.value,
    isActive: isActive.value
  }))

  const sessionData = computed(() => ({
    difficulty: difficulty.value,
    difficultyTitle: difficultyTitle.value,
    sessionId: sessionId.value,
    startTime: startTime.value
  }))

  // Actions
  const startInterview = (
    diff: 'basic' | 'advanced' | 'expert',
    title: string,
    questionCount: number
  ) => {
    difficulty.value = diff
    difficultyTitle.value = title
    totalQuestions.value = questionCount
    currentQuestion.value = 0
    sessionId.value = `interview_${Date.now()}`
    startTime.value = Date.now()
    isActive.value = true
    
    console.log(`📊 面试开始: ${title} (${questionCount}题)`)
  }

  const updateProgress = (questionIndex: number) => {
    currentQuestion.value = questionIndex + 1 // 显示从1开始
    console.log(`📊 面试进度更新: ${progressText.value}`)
  }

  const completeInterview = () => {
    isActive.value = false
    console.log(`📊 面试完成: ${progressText.value}`)
  }

  const resetInterview = () => {
    currentQuestion.value = 0
    totalQuestions.value = 0
    difficulty.value = 'basic'
    difficultyTitle.value = ''
    sessionId.value = ''
    startTime.value = null
    isActive.value = false
    console.log('📊 面试状态已重置')
  }

  return {
    // 状态
    currentQuestion,
    totalQuestions,
    difficulty,
    difficultyTitle,
    sessionId,
    startTime,
    isActive,
    
    // 计算属性
    progressText,
    progressPercentage,
    displayData,
    sessionData,
    
    // 方法
    startInterview,
    updateProgress,
    completeInterview,
    resetInterview
  }
})