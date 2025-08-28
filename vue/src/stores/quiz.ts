import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref, computed, readonly } from 'vue'
import { useProgressStore } from './progress'

// 测试相关类型
export interface QuizQuestion {
  id: string
  principle_id: string
  question: string
  correct_answer: string
  wrong_answers: string[]
  difficulty: 'basic' | 'intermediate' | 'advanced'
  explanation: string
}

export interface QuizAnswer {
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
  timeSpent: number // 秒
  timestamp: string
}

export interface QuizSession {
  sessionId: string
  moduleId: string
  questions: QuizQuestion[]
  answers: QuizAnswer[]
  startTime: string
  endTime?: string
  totalTime: number
  score: number
  passed: boolean
  mode: 'practice' | 'exam' | 'review'
}

export type QuizMode = 'practice' | 'exam' | 'review'

export const useQuizStore = defineStore('quiz', () => {
  const progressStore = useProgressStore()
  
  // 当前测试状态
  const currentSession: Ref<QuizSession | null> = ref(null)
  const currentQuestionIndex: Ref<number> = ref(0)
  const isActive: Ref<boolean> = ref(false)
  const isPaused: Ref<boolean> = ref(false)
  const timeRemaining: Ref<number> = ref(0) // 秒
  const questionStartTime: Ref<number> = ref(0)
  
  // 历史记录
  const completedSessions: Ref<QuizSession[]> = ref([])
  
  // 设置
  const settings = ref({
    timeLimit: 3600, // 1小时时间限制 (exam mode)
    passingScore: 80, // 及格分数
    shuffleQuestions: true,
    shuffleAnswers: true,
    showExplanation: true,
    autoNext: false
  })
  
  // 计算属性
  const currentQuestion = computed(() => {
    if (!currentSession.value || currentQuestionIndex.value >= currentSession.value.questions.length) {
      return null
    }
    return currentSession.value.questions[currentQuestionIndex.value]
  })
  
  const progress = computed(() => {
    if (!currentSession.value) return 0
    return Math.round((currentQuestionIndex.value / currentSession.value.questions.length) * 100)
  })
  
  const remainingQuestions = computed(() => {
    if (!currentSession.value) return 0
    return currentSession.value.questions.length - currentQuestionIndex.value
  })
  
  const sessionScore = computed(() => {
    if (!currentSession.value) return 0
    const correctAnswers = currentSession.value.answers.filter(a => a.isCorrect).length
    const totalQuestions = currentSession.value.questions.length
    return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  })
  
  const averageTimePerQuestion = computed(() => {
    if (!currentSession.value || currentSession.value.answers.length === 0) return 0
    const totalTime = currentSession.value.answers.reduce((sum, a) => sum + a.timeSpent, 0)
    return Math.round(totalTime / currentSession.value.answers.length)
  })
  
  // 本地存储
  const STORAGE_KEY = 'css_digital_quiz_history'
  
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSessions.value))
    } catch (err) {
      console.error('❌ 保存测试记录失败:', err)
    }
  }
  
  function loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        completedSessions.value = JSON.parse(data)
      }
    } catch (err) {
      console.error('❌ 加载测试记录失败:', err)
    }
  }
  
  // 工具函数
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
  
  // 测试会话管理
  function startQuiz(
    moduleId: string,
    questions: QuizQuestion[],
    mode: QuizMode = 'practice'
  ) {
    // 打乱题目顺序（如果启用）
    const sessionQuestions = settings.value.shuffleQuestions ? 
      shuffleArray(questions) : [...questions]
    
    // 为每个问题打乱答案选项（如果启用）
    if (settings.value.shuffleAnswers) {
      sessionQuestions.forEach(q => {
        const allAnswers = [q.correct_answer, ...q.wrong_answers]
        q.wrong_answers = shuffleArray(allAnswers.filter(a => a !== q.correct_answer))
      })
    }
    
    currentSession.value = {
      sessionId: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      moduleId,
      questions: sessionQuestions,
      answers: [],
      startTime: new Date().toISOString(),
      totalTime: 0,
      score: 0,
      passed: false,
      mode
    }
    
    currentQuestionIndex.value = 0
    isActive.value = true
    isPaused.value = false
    
    // 设置时间限制（仅考试模式）
    if (mode === 'exam') {
      timeRemaining.value = settings.value.timeLimit
      startTimer()
    }
    
    questionStartTime.value = Date.now()
    
    console.log(`🧪 开始${mode}测试:`, moduleId, questions.length, '道题目')
  }
  
  function pauseQuiz() {
    if (isActive.value && !isPaused.value) {
      isPaused.value = true
      console.log('⏸️ 测试已暂停')
    }
  }
  
  function resumeQuiz() {
    if (isActive.value && isPaused.value) {
      isPaused.value = false
      questionStartTime.value = Date.now()
      console.log('▶️ 测试已恢复')
    }
  }
  
  function submitAnswer(selectedAnswer: string) {
    if (!currentSession.value || !currentQuestion.value || isPaused.value) return
    
    const isCorrect = selectedAnswer === currentQuestion.value.correct_answer
    const timeSpent = Math.round((Date.now() - questionStartTime.value) / 1000)
    
    const answer: QuizAnswer = {
      questionId: currentQuestion.value.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
      timestamp: new Date().toISOString()
    }
    
    currentSession.value.answers.push(answer)
    
    // 记录到进度系统
    progressStore.recordQuizAttempt(
      currentQuestion.value.principle_id,
      isCorrect ? 100 : 0,
      false
    )
    
    console.log(`📝 提交答案: ${currentQuestion.value.id} -> ${isCorrect ? '✓' : '✗'}`)
    
    // 自动进入下一题（如果启用）
    if (settings.value.autoNext) {
      setTimeout(() => nextQuestion(), 1500)
    }
  }
  
  function nextQuestion() {
    if (!currentSession.value) return
    
    if (currentQuestionIndex.value < currentSession.value.questions.length - 1) {
      currentQuestionIndex.value++
      questionStartTime.value = Date.now()
    } else {
      finishQuiz()
    }
  }
  
  function previousQuestion() {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
      questionStartTime.value = Date.now()
    }
  }
  
  function finishQuiz() {
    if (!currentSession.value) return
    
    const session = currentSession.value
    session.endTime = new Date().toISOString()
    session.totalTime = Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000)
    session.score = sessionScore.value
    session.passed = session.score >= settings.value.passingScore
    
    // 保存到历史记录
    completedSessions.value.push(session)
    saveToStorage()
    
    // 更新每个原则的进度
    session.questions.forEach(q => {
      const answer = session.answers.find(a => a.questionId === q.id)
      if (answer) {
        progressStore.recordQuizAttempt(
          q.principle_id,
          answer.isCorrect ? 100 : 0,
          session.passed
        )
      }
    })
    
    // 重置状态
    isActive.value = false
    isPaused.value = false
    timeRemaining.value = 0
    
    console.log(`🏁 测试完成: 得分 ${session.score}% (${session.passed ? '通过' : '未通过'})`)
    
    return session
  }
  
  // 定时器管理
  let timerInterval: number | null = null
  
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval)
    
    timerInterval = setInterval(() => {
      if (!isPaused.value && timeRemaining.value > 0) {
        timeRemaining.value--
      }
      
      if (timeRemaining.value <= 0) {
        finishQuiz()
      }
    }, 1000)
  }
  
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }
  
  // 统计函数
  function getModuleStats(moduleId: string) {
    const moduleSessions = completedSessions.value.filter(s => s.moduleId === moduleId)
    
    if (moduleSessions.length === 0) {
      return {
        totalAttempts: 0,
        bestScore: 0,
        averageScore: 0,
        totalTime: 0,
        passedAttempts: 0
      }
    }
    
    const scores = moduleSessions.map(s => s.score)
    const totalTime = moduleSessions.reduce((sum, s) => sum + s.totalTime, 0)
    const passedAttempts = moduleSessions.filter(s => s.passed).length
    
    return {
      totalAttempts: moduleSessions.length,
      bestScore: Math.max(...scores),
      averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      totalTime,
      passedAttempts
    }
  }
  
  function getAllStats() {
    const allSessions = completedSessions.value
    if (allSessions.length === 0) return null
    
    const scores = allSessions.map(s => s.score)
    const totalTime = allSessions.reduce((sum, s) => sum + s.totalTime, 0)
    const passedSessions = allSessions.filter(s => s.passed)
    
    return {
      totalSessions: allSessions.length,
      totalTime,
      averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      bestScore: Math.max(...scores),
      passRate: Math.round((passedSessions.length / allSessions.length) * 100),
      averageTimePerSession: Math.round(totalTime / allSessions.length)
    }
  }
  
  // 初始化
  function initialize() {
    loadFromStorage()
    console.log('🧪 测试系统初始化完成')
  }
  
  // 清理函数
  function cleanup() {
    stopTimer()
    isActive.value = false
    isPaused.value = false
    currentSession.value = null
    currentQuestionIndex.value = 0
  }
  
  return {
    // 状态
    currentSession: readonly(currentSession),
    currentQuestion,
    currentQuestionIndex: readonly(currentQuestionIndex),
    isActive: readonly(isActive),
    isPaused: readonly(isPaused),
    timeRemaining: readonly(timeRemaining),
    completedSessions: readonly(completedSessions),
    settings,
    
    // 计算属性
    progress,
    remainingQuestions,
    sessionScore,
    averageTimePerQuestion,
    
    // 方法
    initialize,
    startQuiz,
    pauseQuiz,
    resumeQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    getModuleStats,
    getAllStats,
    cleanup
  }
})