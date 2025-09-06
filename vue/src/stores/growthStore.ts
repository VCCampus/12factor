import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 类型定义
export interface LearningStage {
  id: string
  name: string
  icon: string
  description: string
  order: number
}

interface GrowthPrinciple {
  id: string
  name: string
  description: string
  total_cards: number
  difficulty_distribution: Record<string, number>
  cards: FlashCard[]
}

interface FlashCard {
  id: string
  principle: string
  difficulty: string
  type: string
  question: string
  answer: string
  tags: string[]
  stage: string
}

interface QuizQuestion {
  id: string
  principle: string
  type: 'single' | 'multiple'
  difficulty: string
  question: string
  options: string[]
  answer: string | string[]
  explanation: string
}

interface TestMode {
  id: string
  name: string
  description: string
  time_limit: number | null
  question_count: number | null
  shuffle: boolean
  immediate_feedback?: boolean
  difficulty_filter?: string[]
  bonus_system?: boolean
  show_answers?: boolean
}

interface TestSession {
  id: string
  mode: string
  questions: QuizQuestion[]
  startTime: string
  answers: Record<string, string | string[]>
  currentIndex: number
  completed: boolean
}

interface TestResult {
  sessionId: string
  mode: string
  totalQuestions: number
  correctAnswers: number
  score: number
  timeSpent: number
  completedAt: string
  answers: Array<{
    questionId: string
    userAnswer: string | string[]
    correctAnswer: string | string[]
    isCorrect: boolean
  }>
}

interface FlashcardSession {
  timestamp: string
  totalCards: number
  cards: Array<{
    id: string
    principle: string
    difficulty: string
  }>
}

interface ProgressData {
  principleProgress: Record<string, number>
  stageProgress: Record<string, number>
  flashcardHistory: FlashcardSession[]
  quizHistory: TestResult[]
  globalProgress: number
  lastUpdated: string
}

// localStorage存储键
const STORAGE_KEY = 'growth-progress'
const FLASHCARD_KEY = 'growth-flashcards'
const QUIZ_KEY = 'growth-quiz'
const INDEX_KEY = 'growth-index'

export const useGrowthStore = defineStore('growth', () => {
  // 状态
  const stages = ref<LearningStage[]>([])
  const principles = ref<GrowthPrinciple[]>([])
  const allFlashcards = ref<FlashCard[]>([])
  const allQuestions = ref<QuizQuestion[]>([])
  const testModes = ref<TestMode[]>([])
  
  // 闪卡相关状态
  const currentFlashcardSession = ref<FlashCard[]>([])
  const flashcardHistory = ref<FlashcardSession[]>([])
  
  // 测试相关状态
  const currentTestSession = ref<TestSession | null>(null)
  const testHistory = ref<TestResult[]>([])
  
  // 进度状态
  const principleProgress = ref<Record<string, number>>({})
  const stageProgress = ref<Record<string, number>>({})
  
  // 计算属性
  const globalProgress = computed(() => {
    const totalPrinciples = principles.value.length
    if (totalPrinciples === 0) return 0
    
    const completedCount = Object.values(principleProgress.value).filter(p => p >= 100).length
    return Math.round((completedCount / totalPrinciples) * 100)
  })

  const flashcards = computed(() => ({
    allCards: allFlashcards.value,
    currentSession: currentFlashcardSession.value,
    sessionProgress: {
      total: currentFlashcardSession.value.length,
      current: 0
    }
  }))

  const quiz = computed(() => ({
    questions: allQuestions.value,
    currentTest: currentTestSession.value,
    testHistory: testHistory.value
  }))

  const progress = computed(() => ({
    principleProgress: principleProgress.value,
    stageProgress: stageProgress.value,
    globalProgress: globalProgress.value
  }))

  // 数据加载方法
  const loadFlashcards = async () => {
    try {
      const response = await fetch('/growth-principles-flashcards.json')
      if (!response.ok) throw new Error('Failed to load flashcards data')
      
      const data = await response.json()
      stages.value = data.stages || []
      principles.value = data.principles || []
      
      // 提取所有闪卡
      const cards: FlashCard[] = []
      data.principles?.forEach((principle: GrowthPrinciple) => {
        if (principle.cards) {
          cards.push(...principle.cards)
        }
      })
      allFlashcards.value = cards
      
      console.log(`✅ 已加载 ${cards.length} 张闪卡`)
    } catch (error) {
      console.error('❌ 加载闪卡数据失败:', error)
      // 显示用户友好的错误提示
      alert('数据加载失败，请刷新页面重试')
    }
  }

  const loadQuiz = async () => {
    try {
      const response = await fetch('/growth-principles-quiz.json')
      if (!response.ok) throw new Error('Failed to load quiz data')
      
      const data = await response.json()
      allQuestions.value = data.questions || []
      testModes.value = data.test_modes || []
      
      console.log(`✅ 已加载 ${data.questions?.length || 0} 道题目`)
    } catch (error) {
      console.error('❌ 加载测试数据失败:', error)
      alert('测试数据加载失败，请刷新页面重试')
    }
  }

  const loadIndex = async () => {
    try {
      const response = await fetch('/growth-principles-index.json')
      if (!response.ok) throw new Error('Failed to load index data')
      
      const data = await response.json()
      // 索引数据主要用于导航，这里可以根据需要使用
      console.log('✅ 已加载索引数据')
    } catch (error) {
      console.error('❌ 加载索引数据失败:', error)
    }
  }

  // 进度管理方法
  const loadProgress = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: ProgressData = JSON.parse(stored)
        principleProgress.value = data.principleProgress || {}
        stageProgress.value = data.stageProgress || {}
        flashcardHistory.value = data.flashcardHistory || []
        testHistory.value = data.quizHistory || []
        
        console.log('✅ 已加载学习进度')
      }
    } catch (error) {
      console.error('❌ 加载进度数据失败:', error)
    }
  }

  const saveProgress = () => {
    try {
      const progressData: ProgressData = {
        principleProgress: principleProgress.value,
        stageProgress: stageProgress.value,
        flashcardHistory: flashcardHistory.value,
        quizHistory: testHistory.value,
        globalProgress: globalProgress.value,
        lastUpdated: new Date().toISOString()
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData))
      console.log('✅ 已保存学习进度')
    } catch (error) {
      console.error('❌ 保存进度失败:', error)
    }
  }

  // 闪卡相关方法
  const saveFlashcardSession = (session: FlashcardSession) => {
    flashcardHistory.value.unshift(session)
    
    // 只保留最近10次记录
    if (flashcardHistory.value.length > 10) {
      flashcardHistory.value = flashcardHistory.value.slice(0, 10)
    }
    
    saveProgress()
  }

  const updatePrincipleProgress = (principleId: string, progress: number) => {
    principleProgress.value[principleId] = progress
    
    // 更新阶段进度
    updateStageProgress()
    saveProgress()
  }

  const updateStageProgress = () => {
    const stageStats: Record<string, { total: number; completed: number }> = {}
    
    // 统计各阶段的完成情况
    principles.value.forEach(principle => {
      const cards = principle.cards || []
      cards.forEach(card => {
        const stage = card.stage
        if (!stageStats[stage]) {
          stageStats[stage] = { total: 0, completed: 0 }
        }
        stageStats[stage].total++
        
        // 假设原则进度100%表示该原则的所有卡片都已掌握
        const principleProgressValue = principleProgress.value[principle.id] || 0
        if (principleProgressValue >= 100) {
          stageStats[stage].completed++
        }
      })
    })
    
    // 计算各阶段进度百分比
    Object.keys(stageStats).forEach(stage => {
      const stats = stageStats[stage]
      stageProgress.value[stage] = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100)
        : 0
    })
  }

  // 测试相关方法
  const startTest = (modeId: string): TestSession | null => {
    const mode = testModes.value.find(m => m.id === modeId)
    if (!mode) return null

    let questions = [...allQuestions.value]
    
    // 应用难度过滤
    if (mode.difficulty_filter) {
      questions = questions.filter(q => mode.difficulty_filter!.includes(q.difficulty))
    }
    
    // 随机抽取题目
    if (mode.shuffle) {
      questions = shuffleArray(questions)
    }
    
    if (mode.question_count && mode.question_count > 0) {
      questions = questions.slice(0, mode.question_count)
    }

    const session: TestSession = {
      id: Date.now().toString(),
      mode: modeId,
      questions,
      startTime: new Date().toISOString(),
      answers: {},
      currentIndex: 0,
      completed: false
    }

    currentTestSession.value = session
    return session
  }

  const submitAnswer = (questionId: string, answer: string | string[]) => {
    if (!currentTestSession.value) return
    
    currentTestSession.value.answers[questionId] = answer
  }

  const finishTest = (): TestResult | null => {
    if (!currentTestSession.value) return null

    const session = currentTestSession.value
    const endTime = new Date()
    const startTime = new Date(session.startTime)
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000)

    let correctAnswers = 0
    const detailedAnswers = session.questions.map(question => {
      const userAnswer = session.answers[question.id]
      const correctAnswer = question.answer
      const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)
      
      if (isCorrect) correctAnswers++

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer,
        isCorrect
      }
    })

    const result: TestResult = {
      sessionId: session.id,
      mode: session.mode,
      totalQuestions: session.questions.length,
      correctAnswers,
      score: Math.round((correctAnswers / session.questions.length) * 100),
      timeSpent,
      completedAt: endTime.toISOString(),
      answers: detailedAnswers
    }

    testHistory.value.unshift(result)
    // 只保留最近20次测试记录
    if (testHistory.value.length > 20) {
      testHistory.value = testHistory.value.slice(0, 20)
    }

    currentTestSession.value = null
    saveProgress()
    
    return result
  }

  // 工具方法
  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // 网络状态检测
  const isOnline = ref(navigator.onLine)
  const handleOnlineStatus = () => {
    isOnline.value = navigator.onLine
    if (!isOnline.value) {
      alert('网络连接已断开，部分功能可能无法正常使用')
    }
  }

  // 初始化方法
  const initialize = async () => {
    // 监听网络状态
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    
    // 加载本地进度
    loadProgress()
    
    // 加载远程数据
    await Promise.all([
      loadFlashcards(),
      loadQuiz(),
      loadIndex()
    ])
  }

  return {
    // 状态
    stages,
    principles,
    flashcards,
    quiz,
    progress,
    isOnline,
    
    // 方法
    initialize,
    loadFlashcards,
    loadQuiz,
    saveFlashcardSession,
    updatePrincipleProgress,
    startTest,
    submitAnswer,
    finishTest,
    saveProgress,
    loadProgress
  }
})