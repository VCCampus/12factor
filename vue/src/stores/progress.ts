import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref, computed, readonly } from 'vue'

// 进度状态类型
export type ProgressStatus = 'not-started' | 'in-progress' | 'completed' | 'mastered'

// 学习进度接口
export interface PrincipleProgress {
  principleId: string
  status: ProgressStatus
  studyTime: number // 学习时长（分钟）
  flashcardReviews: number
  quizAttempts: number
  quizBestScore: number
  lastStudied: string // ISO时间戳
  notes?: string
}

export interface ModuleProgress {
  moduleId: string
  status: ProgressStatus
  completedPrinciples: number
  totalPrinciples: number
  totalStudyTime: number
  averageScore: number
  lastAccessed: string
  isUnlocked: boolean
}

export interface LearningStreak {
  currentStreak: number
  longestStreak: number
  lastStudyDate: string
}

export interface UserStats {
  totalStudyTime: number // 总学习时间（分钟）
  completedPrinciples: number
  totalPrinciples: number
  averageQuizScore: number
  streak: LearningStreak
  startDate: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  points: number
}

export const useProgressStore = defineStore('progress', () => {
  // 状态变量
  const isLoading: Ref<boolean> = ref(false)
  const isInitialized: Ref<boolean> = ref(false)
  
  // 进度数据
  const principleProgress: Ref<Record<string, PrincipleProgress>> = ref({})
  const moduleProgress: Ref<Record<string, ModuleProgress>> = ref({})
  const userStats: Ref<UserStats> = ref({
    totalStudyTime: 0,
    completedPrinciples: 0,
    totalPrinciples: 21, // 从TOML配置获得的总数
    averageQuizScore: 0,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: ''
    },
    startDate: new Date().toISOString(),
    level: 'beginner',
    points: 0
  })
  
  // 计算属性
  const completionPercentage = computed(() => {
    if (userStats.value.totalPrinciples === 0) return 0
    return Math.round((userStats.value.completedPrinciples / userStats.value.totalPrinciples) * 100)
  })
  
  const currentLevel = computed(() => {
    const percentage = completionPercentage.value
    if (percentage < 25) return 'beginner'
    if (percentage < 50) return 'intermediate'  
    if (percentage < 80) return 'advanced'
    return 'expert'
  })
  
  const nextMilestone = computed(() => {
    const current = completionPercentage.value
    if (current < 25) return { target: 25, label: '新手毕业' }
    if (current < 50) return { target: 50, label: '中级水平' }
    if (current < 80) return { target: 80, label: '高级水平' }
    if (current < 100) return { target: 100, label: '专家认证' }
    return { target: 100, label: '已完成所有学习' }
  })
  
  const recentActivity = computed(() => {
    const recent = Object.values(principleProgress.value)
      .filter(p => p.lastStudied)
      .sort((a, b) => new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime())
      .slice(0, 5)
    
    return recent.map(p => ({
      principleId: p.principleId,
      status: p.status,
      studyTime: p.studyTime,
      lastStudied: p.lastStudied
    }))
  })
  
  // 本地存储键
  const STORAGE_KEYS = {
    PRINCIPLE_PROGRESS: 'css_digital_principle_progress',
    MODULE_PROGRESS: 'css_digital_module_progress', 
    USER_STATS: 'css_digital_user_stats'
  }
  
  // 持久化函数
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.PRINCIPLE_PROGRESS, JSON.stringify(principleProgress.value))
      localStorage.setItem(STORAGE_KEYS.MODULE_PROGRESS, JSON.stringify(moduleProgress.value))
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(userStats.value))
      console.log('💾 学习进度已保存到本地存储')
    } catch (err) {
      console.error('❌ 保存学习进度失败:', err)
    }
  }
  
  function loadFromStorage() {
    try {
      // 加载原则进度
      const principleData = localStorage.getItem(STORAGE_KEYS.PRINCIPLE_PROGRESS)
      if (principleData) {
        principleProgress.value = JSON.parse(principleData)
      }
      
      // 加载模块进度
      const moduleData = localStorage.getItem(STORAGE_KEYS.MODULE_PROGRESS)
      if (moduleData) {
        moduleProgress.value = JSON.parse(moduleData)
      }
      
      // 加载用户统计
      const statsData = localStorage.getItem(STORAGE_KEYS.USER_STATS)
      if (statsData) {
        userStats.value = { ...userStats.value, ...JSON.parse(statsData) }
      }
      
      console.log('📂 学习进度从本地存储加载完成')
    } catch (err) {
      console.error('❌ 加载学习进度失败:', err)
    }
  }
  
  // 进度更新函数
  function updatePrincipleProgress(
    principleId: string, 
    updates: Partial<PrincipleProgress>
  ) {
    const current = principleProgress.value[principleId] || {
      principleId,
      status: 'not-started',
      studyTime: 0,
      flashcardReviews: 0,
      quizAttempts: 0,
      quizBestScore: 0,
      lastStudied: ''
    }
    
    principleProgress.value[principleId] = {
      ...current,
      ...updates,
      lastStudied: new Date().toISOString()
    }
    
    // 更新用户统计
    updateUserStats()
    saveToStorage()
    
    console.log(`📈 更新原则进度: ${principleId} -> ${updates.status || current.status}`)
  }
  
  function recordStudySession(principleId: string, timeSpent: number) {
    const current = principleProgress.value[principleId]
    if (!current) {
      updatePrincipleProgress(principleId, {
        status: 'in-progress',
        studyTime: timeSpent
      })
    } else {
      updatePrincipleProgress(principleId, {
        studyTime: current.studyTime + timeSpent
      })
    }
    
    // 更新连击记录
    updateStreak()
  }
  
  function recordQuizAttempt(
    principleId: string, 
    score: number, 
    isCompleted: boolean = false
  ) {
    const current = principleProgress.value[principleId] || {
      principleId,
      status: 'not-started',
      studyTime: 0,
      flashcardReviews: 0,
      quizAttempts: 0,
      quizBestScore: 0,
      lastStudied: ''
    }
    
    const newBestScore = Math.max(current.quizBestScore, score)
    const newStatus = isCompleted && score >= 80 ? 'completed' : 
                     score >= 90 ? 'mastered' : 
                     current.status === 'not-started' ? 'in-progress' : current.status
    
    updatePrincipleProgress(principleId, {
      status: newStatus as ProgressStatus,
      quizAttempts: current.quizAttempts + 1,
      quizBestScore: newBestScore
    })
  }
  
  function recordFlashcardReview(principleId: string) {
    const current = principleProgress.value[principleId]
    if (current) {
      updatePrincipleProgress(principleId, {
        flashcardReviews: current.flashcardReviews + 1,
        status: current.status === 'not-started' ? 'in-progress' : current.status
      })
    } else {
      updatePrincipleProgress(principleId, {
        status: 'in-progress',
        flashcardReviews: 1
      })
    }
  }
  
  // 用户统计更新
  function updateUserStats() {
    const principles = Object.values(principleProgress.value)
    const completed = principles.filter(p => p.status === 'completed' || p.status === 'mastered').length
    const totalTime = principles.reduce((sum, p) => sum + p.studyTime, 0)
    const avgScore = principles.length > 0 ? 
      principles.reduce((sum, p) => sum + p.quizBestScore, 0) / principles.length : 0
    
    userStats.value = {
      ...userStats.value,
      completedPrinciples: completed,
      totalStudyTime: totalTime,
      averageQuizScore: Math.round(avgScore),
      level: currentLevel.value,
      points: completed * 100 + Math.floor(totalTime / 10) * 5
    }
  }
  
  // 连击更新
  function updateStreak() {
    const today = new Date().toDateString()
    const lastStudyDate = userStats.value.streak.lastStudyDate
    
    if (!lastStudyDate) {
      // 首次学习
      userStats.value.streak = {
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: today
      }
    } else if (lastStudyDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastStudyDate === yesterday.toDateString()) {
        // 连续学习
        userStats.value.streak.currentStreak += 1
        userStats.value.streak.longestStreak = Math.max(
          userStats.value.streak.longestStreak,
          userStats.value.streak.currentStreak
        )
      } else {
        // 中断连击
        userStats.value.streak.currentStreak = 1
      }
      
      userStats.value.streak.lastStudyDate = today
    }
  }
  
  // 获取函数
  function getPrincipleProgress(principleId: string): PrincipleProgress | null {
    return principleProgress.value[principleId] || null
  }
  
  function getModuleProgress(moduleId: string): ModuleProgress | null {
    return moduleProgress.value[moduleId] || null
  }
  
  // 初始化
  async function initialize() {
    if (isInitialized.value) return
    
    try {
      isLoading.value = true
      loadFromStorage()
      isInitialized.value = true
      console.log('📊 进度系统初始化完成')
    } catch (err) {
      console.error('❌ 进度系统初始化失败:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  // 重置函数
  function resetProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可撤销。')) {
      principleProgress.value = {}
      moduleProgress.value = {}
      userStats.value = {
        totalStudyTime: 0,
        completedPrinciples: 0,
        totalPrinciples: 21,
        averageQuizScore: 0,
        streak: {
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: ''
        },
        startDate: new Date().toISOString(),
        level: 'beginner',
        points: 0
      }
      saveToStorage()
      console.log('🔄 学习进度已重置')
    }
  }
  
  return {
    // 状态
    isLoading: readonly(isLoading),
    isInitialized: readonly(isInitialized),
    principleProgress: readonly(principleProgress),
    moduleProgress: readonly(moduleProgress),
    userStats: readonly(userStats),
    
    // 计算属性
    completionPercentage,
    currentLevel,
    nextMilestone,
    recentActivity,
    
    // 方法
    initialize,
    updatePrincipleProgress,
    recordStudySession,
    recordQuizAttempt,
    recordFlashcardReview,
    getPrincipleProgress,
    getModuleProgress,
    resetProgress,
    saveToStorage
  }
})