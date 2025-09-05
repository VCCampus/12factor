import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref, computed, readonly } from 'vue'

// 徽章类型
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'learning' | 'consistency' | 'mastery' | 'social' | 'special'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  requirements: BadgeRequirement[]
  unlocked: boolean
  unlockedDate?: string
  progress: number // 0-100
}

// 徽章解锁条件
export interface BadgeRequirement {
  type: 'study_time' | 'principles_completed' | 'quiz_score' | 'streak_days' | 'flashcard_reviews' | 'perfect_scores' | 'speed_completion'
  target: number
  current: number
  description: string
}

// 成就类型
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  unlocked: boolean
  unlockedDate?: string
  progress: number
}

// 等级信息
export interface Level {
  level: number
  title: string
  minPoints: number
  maxPoints: number
  benefits: string[]
  badge: string
}

// 积分记录
export interface PointsHistory {
  id: string
  action: string
  points: number
  timestamp: string
  description: string
}

// 连击信息
export interface Streak {
  type: 'daily' | 'weekly' | 'monthly'
  current: number
  longest: number
  lastDate: string
  multiplier: number
}

export const useGamificationStore = defineStore('gamification', () => {
  // 状态变量
  const isLoading: Ref<boolean> = ref(false)
  const isInitialized: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  
  // 游戏化数据
  const totalPoints: Ref<number> = ref(0)
  const currentLevel: Ref<number> = ref(1)
  const badges: Ref<Badge[]> = ref([])
  const achievements: Ref<Achievement[]> = ref([])
  const pointsHistory: Ref<PointsHistory[]> = ref([])
  const streaks: Ref<Record<string, Streak>> = ref({})
  
  // 等级系统
  const levels: Level[] = [
    { level: 1, title: '初学者', minPoints: 0, maxPoints: 99, benefits: ['基础学习功能'], badge: '🌱' },
    { level: 2, title: '学徒', minPoints: 100, maxPoints: 299, benefits: ['解锁闪卡功能', '学习提醒'], badge: '📚' },
    { level: 3, title: '学者', minPoints: 300, maxPoints: 599, benefits: ['高级测试模式', '学习统计'], badge: '🎓' },
    { level: 4, title: '专家', minPoints: 600, maxPoints: 999, benefits: ['自定义学习计划', '导出学习报告'], badge: '🏆' },
    { level: 5, title: '大师', minPoints: 1000, maxPoints: 1999, benefits: ['专家模式', '学习社区功能'], badge: '👑' },
    { level: 6, title: '宗师', minPoints: 2000, maxPoints: 9999, benefits: ['全功能解锁', 'VIP特权'], badge: '⭐' }
  ]
  
  // 计算属性
  const currentLevelInfo = computed(() => {
    return levels.find(l => totalPoints.value >= l.minPoints && totalPoints.value <= l.maxPoints) || levels[0]
  })
  
  const nextLevelInfo = computed(() => {
    const nextLevel = currentLevelInfo.value.level + 1
    return levels.find(l => l.level === nextLevel) || null
  })
  
  const levelProgress = computed(() => {
    const current = currentLevelInfo.value
    if (!nextLevelInfo.value) return 100
    
    const currentLevelPoints = totalPoints.value - current.minPoints
    const levelRange = nextLevelInfo.value.minPoints - current.minPoints
    return Math.min(100, (currentLevelPoints / levelRange) * 100)
  })
  
  const unlockedBadges = computed(() => badges.value.filter(b => b.unlocked))
  const availableBadges = computed(() => badges.value.filter(b => !b.unlocked))
  const unlockedAchievements = computed(() => achievements.value.filter(a => a.unlocked))
  
  const weeklyPoints = computed(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return pointsHistory.value
      .filter(p => new Date(p.timestamp) > oneWeekAgo)
      .reduce((sum, p) => sum + p.points, 0)
  })
  
  // 徽章数据初始化
  function initializeBadges(): Badge[] {
    return [
      {
        id: 'first_principle',
        name: '初次尝试',
        description: '完成第一个原则学习',
        icon: '🌱',
        category: 'learning',
        rarity: 'common',
        requirements: [
          { type: 'principles_completed', target: 1, current: 0, description: '完成1个原则' }
        ],
        unlocked: false,
        progress: 0
      },
      {
        id: 'quick_learner',
        name: '快速学习者',
        description: '在30分钟内完成一个原则学习',
        icon: '⚡',
        category: 'mastery',
        rarity: 'uncommon',
        requirements: [
          { type: 'speed_completion', target: 30, current: 0, description: '30分钟内完成学习' }
        ],
        unlocked: false,
        progress: 0
      },
      {
        id: 'consistent_learner',
        name: '坚持不懈',
        description: '连续学习7天',
        icon: '🔥',
        category: 'consistency',
        rarity: 'uncommon',
        requirements: [
          { type: 'streak_days', target: 7, current: 0, description: '连续学习7天' }
        ],
        unlocked: false,
        progress: 0
      },
      {
        id: 'perfect_score',
        name: '完美主义者',
        description: '获得测试满分',
        icon: '💯',
        category: 'mastery',
        rarity: 'rare',
        requirements: [
          { type: 'quiz_score', target: 100, current: 0, description: '获得100分' }
        ],
        unlocked: false,
        progress: 0
      },
      {
        id: 'flashcard_master',
        name: '闪卡大师',
        description: '复习100张闪卡',
        icon: '🎯',
        category: 'learning',
        rarity: 'rare',
        requirements: [
          { type: 'flashcard_reviews', target: 100, current: 0, description: '复习100张闪卡' }
        ],
        unlocked: false,
        progress: 0
      },
      {
        id: 'marathon_learner',
        name: '马拉松学习者',
        description: '单次学习超过2小时',
        icon: '🏃',
        category: 'consistency',
        rarity: 'rare',
        requirements: [
          { type: 'study_time', target: 120, current: 0, description: '单次学习2小时' }
        ],
        unlocked: false,
        progress: 0
      },
      {
        id: 'perfectionist',
        name: '完美主义',
        description: '连续10次测试获得90分以上',
        icon: '👑',
        category: 'mastery',
        rarity: 'epic',
        requirements: [
          { type: 'perfect_scores', target: 10, current: 0, description: '10次90分以上' }
        ],
        unlocked: false,
        progress: 0
      },
      {
        id: 'legendary_learner',
        name: '传奇学习者',
        description: '完成所有原则学习并保持30天连击',
        icon: '⭐',
        category: 'special',
        rarity: 'legendary',
        requirements: [
          { type: 'principles_completed', target: 12, current: 0, description: '完成12个原则' },
          { type: 'streak_days', target: 30, current: 0, description: '30天学习连击' }
        ],
        unlocked: false,
        progress: 0
      }
    ]
  }
  
  // 成就数据初始化
  function initializeAchievements(): Achievement[] {
    return [
      {
        id: 'first_step',
        name: '第一步',
        description: '开始你的学习旅程',
        icon: '👶',
        category: 'milestone',
        points: 10,
        tier: 'bronze',
        unlocked: false,
        progress: 0
      },
      {
        id: 'week_warrior',
        name: '周战士',
        description: '完成一周的连续学习',
        icon: '⚔️',
        category: 'consistency',
        points: 50,
        tier: 'silver',
        unlocked: false,
        progress: 0
      },
      {
        id: 'knowledge_seeker',
        name: '知识探索者',
        description: '完成50%的学习内容',
        icon: '🔍',
        category: 'progress',
        points: 100,
        tier: 'silver',
        unlocked: false,
        progress: 0
      },
      {
        id: 'quiz_champion',
        name: '测试冠军',
        description: '在测试中获得95分以上',
        icon: '🏆',
        category: 'mastery',
        points: 75,
        tier: 'gold',
        unlocked: false,
        progress: 0
      },
      {
        id: 'master_learner',
        name: '学习大师',
        description: '完成所有学习内容',
        icon: '🎓',
        category: 'completion',
        points: 200,
        tier: 'gold',
        unlocked: false,
        progress: 0
      },
      {
        id: 'speed_demon',
        name: '速度恶魔',
        description: '在5分钟内完成一次测试',
        icon: '💨',
        category: 'skill',
        points: 60,
        tier: 'gold',
        unlocked: false,
        progress: 0
      },
      {
        id: 'legendary_status',
        name: '传奇地位',
        description: '达到最高等级并保持卓越表现',
        icon: '👑',
        category: 'legendary',
        points: 500,
        tier: 'platinum',
        unlocked: false,
        progress: 0
      }
    ]
  }
  
  // 初始化
  async function initialize() {
    if (isInitialized.value) return
    
    try {
      isLoading.value = true
      error.value = null
      
      // 从localStorage加载数据
      const savedData = localStorage.getItem('gamification-data')
      if (savedData) {
        const data = JSON.parse(savedData)
        totalPoints.value = data.totalPoints || 0
        currentLevel.value = data.currentLevel || 1
        pointsHistory.value = data.pointsHistory || []
        streaks.value = data.streaks || {}
        
        // 合并徽章数据（保持进度）
        const savedBadges = data.badges || []
        badges.value = initializeBadges().map(badge => {
          const saved = savedBadges.find((b: Badge) => b.id === badge.id)
          return saved ? { ...badge, ...saved } : badge
        })
        
        // 合并成就数据（保持进度）
        const savedAchievements = data.achievements || []
        achievements.value = initializeAchievements().map(achievement => {
          const saved = savedAchievements.find((a: Achievement) => a.id === achievement.id)
          return saved ? { ...achievement, ...saved } : achievement
        })
      } else {
        // 首次初始化
        badges.value = initializeBadges()
        achievements.value = initializeAchievements()
        totalPoints.value = 0
        pointsHistory.value = []
        streaks.value = {
          daily: { type: 'daily', current: 0, longest: 0, lastDate: '', multiplier: 1 }
        }
      }
      
      isInitialized.value = true
      console.log('🎮 游戏化系统初始化成功')
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : '初始化失败'
      console.error('❌ 游戏化系统初始化失败:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  // 保存数据
  function saveData() {
    try {
      const data = {
        totalPoints: totalPoints.value,
        currentLevel: currentLevel.value,
        badges: badges.value,
        achievements: achievements.value,
        pointsHistory: pointsHistory.value.slice(-100), // 只保留最近100条记录
        streaks: streaks.value
      }
      localStorage.setItem('gamification-data', JSON.stringify(data))
    } catch (error) {
      console.error('保存游戏化数据失败:', error)
    }
  }
  
  // 奖励积分
  function awardPoints(action: string, points: number, description?: string) {
    const historyItem: PointsHistory = {
      id: Date.now().toString(),
      action,
      points,
      timestamp: new Date().toISOString(),
      description: description || action
    }
    
    totalPoints.value += points
    pointsHistory.value.unshift(historyItem)
    
    // 检查等级提升
    checkLevelUp()
    
    // 检查成就和徽章解锁
    checkAchievements()
    checkBadges()
    
    // 保存数据
    saveData()
    
    return historyItem
  }
  
  // 检查等级提升
  function checkLevelUp() {
    const newLevel = levels.find(l => 
      totalPoints.value >= l.minPoints && totalPoints.value <= l.maxPoints
    )?.level || 1
    
    if (newLevel > currentLevel.value) {
      currentLevel.value = newLevel
      
      // 等级提升奖励
      awardPoints('level_up', 50, `升级到${newLevel}级`)
      
      console.log(`🎉 等级提升到 ${newLevel} 级！`)
      
      // 这里可以触发等级提升的UI反馈
      return true
    }
    
    return false
  }
  
  // 检查成就解锁
  function checkAchievements() {
    let newAchievements = 0
    
    achievements.value.forEach(achievement => {
      if (achievement.unlocked) return
      
      let shouldUnlock = false
      
      switch (achievement.id) {
        case 'first_step':
          shouldUnlock = totalPoints.value >= 10
          achievement.progress = Math.min(100, (totalPoints.value / 10) * 100)
          break
        case 'week_warrior': {
          const dailyStreak = streaks.value.daily?.current || 0
          shouldUnlock = dailyStreak >= 7
          achievement.progress = Math.min(100, (dailyStreak / 7) * 100)
          break
        }
        // 更多成就检查逻辑...
      }
      
      if (shouldUnlock && !achievement.unlocked) {
        achievement.unlocked = true
        achievement.unlockedDate = new Date().toISOString()
        awardPoints('achievement', achievement.points, `解锁成就: ${achievement.name}`)
        newAchievements++
      }
    })
    
    return newAchievements
  }
  
  // 检查徽章解锁
  function checkBadges() {
    let newBadges = 0
    
    badges.value.forEach(badge => {
      if (badge.unlocked) return
      
      let progress = 0
      let canUnlock = true
      
      // 检查所有要求
      badge.requirements.forEach(req => {
        let current = 0
        
        switch (req.type) {
          case 'principles_completed':
            // 这里需要从progress store获取已完成原则数
            current = 0 // 暂时设为0，实际需要获取真实数据
            break
          case 'streak_days':
            current = streaks.value.daily?.current || 0
            break
          case 'study_time':
            current = 0 // 从学习记录获取
            break
          // 更多类型...
        }
        
        req.current = current
        const reqProgress = Math.min(100, (current / req.target) * 100)
        progress += reqProgress / badge.requirements.length
        
        if (current < req.target) {
          canUnlock = false
        }
      })
      
      badge.progress = Math.round(progress)
      
      if (canUnlock && !badge.unlocked) {
        badge.unlocked = true
        badge.unlockedDate = new Date().toISOString()
        
        // 根据稀有度给予不同积分
        const rarityPoints = {
          common: 25,
          uncommon: 50,
          rare: 100,
          epic: 200,
          legendary: 500
        }
        
        awardPoints('badge', rarityPoints[badge.rarity], `解锁徽章: ${badge.name}`)
        newBadges++
      }
    })
    
    return newBadges
  }
  
  // 更新连击
  function updateStreak(type: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const today = new Date().toDateString()
    const streak = streaks.value[type] || {
      type,
      current: 0,
      longest: 0,
      lastDate: '',
      multiplier: 1
    }
    
    const lastDate = streak.lastDate
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (lastDate === today) {
      // 今天已经更新过
      return streak.current
    } else if (lastDate === yesterday.toDateString()) {
      // 连续学习
      streak.current++
      streak.longest = Math.max(streak.longest, streak.current)
    } else {
      // 连击中断
      streak.current = 1
    }
    
    streak.lastDate = today
    streak.multiplier = Math.min(3, 1 + streak.current * 0.1) // 最大3倍乘数
    
    streaks.value[type] = streak
    saveData()
    
    return streak.current
  }
  
  // 获取当前积分乘数
  function getCurrentMultiplier(): number {
    return streaks.value.daily?.multiplier || 1
  }
  
  // 重置数据（仅用于开发测试）
  function resetData() {
    localStorage.removeItem('gamification-data')
    totalPoints.value = 0
    currentLevel.value = 1
    badges.value = initializeBadges()
    achievements.value = initializeAchievements()
    pointsHistory.value = []
    streaks.value = {}
    
    console.log('🔄 游戏化数据已重置')
  }
  
  return {
    // 状态
    isLoading: readonly(isLoading),
    isInitialized: readonly(isInitialized),
    error: readonly(error),
    
    // 数据
    totalPoints: readonly(totalPoints),
    currentLevel: readonly(currentLevel),
    badges: readonly(badges),
    achievements: readonly(achievements),
    pointsHistory: readonly(pointsHistory),
    streaks: readonly(streaks),
    
    // 计算属性
    currentLevelInfo,
    nextLevelInfo,
    levelProgress,
    unlockedBadges,
    availableBadges,
    unlockedAchievements,
    weeklyPoints,
    levels: readonly(ref(levels)),
    
    // 方法
    initialize,
    awardPoints,
    updateStreak,
    getCurrentMultiplier,
    checkAchievements,
    checkBadges,
    resetData
  }
})