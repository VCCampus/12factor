import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UnifiedStorage, StorageKeys } from '@/utils/storage'

// 类型定义
interface GrowthPrinciple {
  id: string
  title: string
  description: string
  stage: string
  difficulty: number
  content: string
}

interface FlashCard {
  id: string
  principle: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

interface QuizQuestion {
  id: string
  principle_id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface TestResult {
  id: string
  timestamp: string
  mode: string
  questions: QuizQuestion[]
  answers: Record<string, string | string[]>
  score: number
  correctCount: number
  totalQuestions: number
}

interface FlashcardSession {
  id: string
  timestamp: string
  cardsStudied: number
  timeSpent: number
  principles: string[]
}

interface ProgressData {
  principleProgress: Record<string, number>
  stageProgress: Record<string, number>
  flashcardHistory: FlashcardSession[]
  quizHistory: TestResult[]
  totalStudyTime: number
  lastUpdated: string
}

export const useGrowthStore = defineStore('growth', () => {
  // 状态
  const principles = ref<GrowthPrinciple[]>([])
  const flashcards = ref<FlashCard[]>([])
  const quizzes = ref<QuizQuestion[]>([])
  const currentSession = ref<any>(null)
  
  // 进度状态
  const principleProgress = ref<Record<string, number>>({})
  const stageProgress = ref<Record<string, number>>({})
  const flashcardHistory = ref<FlashcardSession[]>([])
  const quizHistory = ref<TestResult[]>([])
  const totalStudyTime = ref(0)
  
  // 计算属性
  const completedPrinciples = computed(() => {
    return Object.values(principleProgress.value).filter(progress => progress >= 80).length
  })
  
  const totalPrinciples = computed(() => principles.value.length)
  
  const overallProgress = computed(() => {
    if (totalPrinciples.value === 0) return 0
    const total = Object.values(principleProgress.value).reduce((sum, progress) => sum + progress, 0)
    return Math.round(total / totalPrinciples.value)
  })
  
  const recentSessions = computed(() => {
    return [...flashcardHistory.value, ...quizHistory.value]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
  })
  
  // 方法
  async function initialize(): Promise<void> {
    try {
      // 加载数据文件
      await Promise.all([
        loadPrinciplesData(),
        loadFlashcardsData(), 
        loadQuizzesData(),
        loadProgressData()
      ])
      
      console.log('Growth store initialized successfully')
    } catch (error) {
      console.error('Failed to initialize growth store:', error)
    }
  }
  
  async function loadPrinciplesData(): Promise<void> {
    try {
      // #ifdef H5
      const response = await fetch('/growth-principles-overview.json')
      const data = await response.json()
      principles.value = data.principles || []
      // #endif
      
      // #ifdef MP-WEIXIN
      // 小程序端需要将JSON文件放在static目录下
      uni.request({
        url: '/static/data/growth-principles-overview.json',
        success: (res) => {
          if (res.data && res.data.principles) {
            principles.value = res.data.principles
          }
        }
      })
      // #endif
    } catch (error) {
      console.error('Failed to load principles data:', error)
    }
  }
  
  async function loadFlashcardsData(): Promise<void> {
    try {
      // #ifdef H5
      const response = await fetch('/growth-principles-flashcards.json')
      const data = await response.json()
      flashcards.value = data.flashcards || []
      // #endif
      
      // #ifdef MP-WEIXIN
      uni.request({
        url: '/static/data/growth-principles-flashcards.json',
        success: (res) => {
          if (res.data && res.data.flashcards) {
            flashcards.value = res.data.flashcards
          }
        }
      })
      // #endif
    } catch (error) {
      console.error('Failed to load flashcards data:', error)
    }
  }
  
  async function loadQuizzesData(): Promise<void> {
    try {
      // #ifdef H5
      const response = await fetch('/growth-principles-quiz.json')
      const data = await response.json()
      quizzes.value = data.questions || []
      // #endif
      
      // #ifdef MP-WEIXIN
      uni.request({
        url: '/static/data/growth-principles-quiz.json',
        success: (res) => {
          if (res.data && res.data.questions) {
            quizzes.value = res.data.questions
          }
        }
      })
      // #endif
    } catch (error) {
      console.error('Failed to load quiz data:', error)
    }
  }
  
  async function loadProgressData(): Promise<void> {
    try {
      const data = await UnifiedStorage.getItem<ProgressData>(StorageKeys.GROWTH_PROGRESS)
      if (data) {
        principleProgress.value = data.principleProgress || {}
        stageProgress.value = data.stageProgress || {}
        flashcardHistory.value = data.flashcardHistory || []
        quizHistory.value = data.quizHistory || []
        totalStudyTime.value = data.totalStudyTime || 0
      }
    } catch (error) {
      console.error('Failed to load progress data:', error)
    }
  }
  
  async function saveProgressData(): Promise<void> {
    try {
      const progressData: ProgressData = {
        principleProgress: principleProgress.value,
        stageProgress: stageProgress.value,
        flashcardHistory: flashcardHistory.value,
        quizHistory: quizHistory.value,
        totalStudyTime: totalStudyTime.value,
        lastUpdated: new Date().toISOString()
      }
      
      await UnifiedStorage.setItem(StorageKeys.GROWTH_PROGRESS, progressData)
    } catch (error) {
      console.error('Failed to save progress data:', error)
    }
  }
  
  function updatePrincipleProgress(principleId: string, progress: number): void {
    principleProgress.value[principleId] = Math.max(0, Math.min(100, progress))
    updateStageProgress()
    saveProgressData()
  }
  
  function updateStageProgress(): void {
    const stageStats: Record<string, { total: number; completed: number }> = {}
    
    // 统计各阶段的完成情况
    principles.value.forEach(principle => {
      const stage = principle.stage
      if (!stageStats[stage]) {
        stageStats[stage] = { total: 0, completed: 0 }
      }
      stageStats[stage].total++
      
      const progress = principleProgress.value[principle.id] || 0
      if (progress >= 80) {
        stageStats[stage].completed++
      }
    })
    
    // 计算各阶段进度百分比
    Object.keys(stageStats).forEach(stage => {
      const stats = stageStats[stage]
      stageProgress.value[stage] = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100)
        : 0
    })
  }
  
  function recordFlashcardSession(session: FlashcardSession): void {
    flashcardHistory.value.unshift(session)
    
    // 保留最近50个会话
    if (flashcardHistory.value.length > 50) {
      flashcardHistory.value = flashcardHistory.value.slice(0, 50)
    }
    
    // 更新总学习时间
    totalStudyTime.value += session.timeSpent
    
    // 更新相关原则的进度
    session.principles.forEach(principleId => {
      const currentProgress = principleProgress.value[principleId] || 0
      updatePrincipleProgress(principleId, currentProgress + 5) // 每次闪卡练习增加5%进度
    })
    
    saveProgressData()
  }
  
  function recordQuizResult(result: TestResult): void {
    quizHistory.value.unshift(result)
    
    // 保留最近30个测试结果
    if (quizHistory.value.length > 30) {
      quizHistory.value = quizHistory.value.slice(0, 30)
    }
    
    // 更新相关原则的进度
    result.questions.forEach(question => {
      const currentProgress = principleProgress.value[question.principle_id] || 0
      const isCorrect = result.answers[question.id] === question.options[question.correct]
      const progressIncrease = isCorrect ? 10 : 2 // 正确答案增加10%，错误答案增加2%
      updatePrincipleProgress(question.principle_id, currentProgress + progressIncrease)
    })
    
    saveProgressData()
  }
  
  function getRandomFlashcards(count: number = 12, principleIds?: string[]): FlashCard[] {
    let availableCards = [...flashcards.value]
    
    // 如果指定了原则ID，则过滤
    if (principleIds && principleIds.length > 0) {
      availableCards = availableCards.filter(card => 
        principleIds.includes(card.principle)
      )
    }
    
    // 随机打乱并取指定数量
    const shuffled = availableCards.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }
  
  function getQuizQuestions(mode: string = 'practice', difficulty?: string, count: number = 20): QuizQuestion[] {
    let availableQuestions = [...quizzes.value]
    
    // 根据难度过滤
    if (difficulty) {
      availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty)
    }
    
    // 随机打乱并取指定数量
    const shuffled = availableQuestions.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }
  
  function resetProgress(): void {
    principleProgress.value = {}
    stageProgress.value = {}
    flashcardHistory.value = []
    quizHistory.value = []
    totalStudyTime.value = 0
    
    saveProgressData()
  }
  
  // 导出数据
  function exportProgress(): ProgressData {
    return {
      principleProgress: principleProgress.value,
      stageProgress: stageProgress.value,
      flashcardHistory: flashcardHistory.value,
      quizHistory: quizHistory.value,
      totalStudyTime: totalStudyTime.value,
      lastUpdated: new Date().toISOString()
    }
  }
  
  // 导入数据
  async function importProgress(data: ProgressData): Promise<void> {
    principleProgress.value = data.principleProgress || {}
    stageProgress.value = data.stageProgress || {}
    flashcardHistory.value = data.flashcardHistory || []
    quizHistory.value = data.quizHistory || []
    totalStudyTime.value = data.totalStudyTime || 0
    
    await saveProgressData()
  }
  
  return {
    // 状态
    principles,
    flashcards,
    quizzes,
    currentSession,
    principleProgress,
    stageProgress,
    flashcardHistory,
    quizHistory,
    totalStudyTime,
    
    // 计算属性
    completedPrinciples,
    totalPrinciples,
    overallProgress,
    recentSessions,
    
    // 方法
    initialize,
    updatePrincipleProgress,
    recordFlashcardSession,
    recordQuizResult,
    getRandomFlashcards,
    getQuizQuestions,
    resetProgress,
    exportProgress,
    importProgress,
    saveProgressData
  }
})