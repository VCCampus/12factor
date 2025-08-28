<template>
  <div class="learning-analytics">
    <!-- 概览统计 -->
    <div class="analytics-overview">
      <h3 class="analytics-title">🎯 学习分析</h3>
      
      <div class="stats-grid">
        <!-- 整体进度 -->
        <div class="stat-card primary">
          <div class="stat-header">
            <div class="stat-icon">📊</div>
            <div class="stat-label">整体进度</div>
          </div>
          <div class="stat-content">
            <div class="progress-circle">
              <svg viewBox="0 0 36 36" class="circular-chart">
                <path class="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path class="circle"
                  :stroke-dasharray="`${completionPercentage}, 100`"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" class="percentage">{{ Math.round(completionPercentage) }}%</text>
              </svg>
            </div>
            <div class="stat-details">
              <div class="detail-item">
                <span class="detail-label">已完成</span>
                <span class="detail-value">{{ userStats.completedPrinciples }} / {{ userStats.totalPrinciples }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 学习时长 -->
        <div class="stat-card secondary">
          <div class="stat-header">
            <div class="stat-icon">⏱️</div>
            <div class="stat-label">学习时长</div>
          </div>
          <div class="stat-content">
            <div class="time-display">
              <div class="time-value">{{ formatStudyTime(userStats.totalStudyTime) }}</div>
              <div class="time-breakdown">
                <div class="breakdown-item">
                  <span class="breakdown-label">本周</span>
                  <span class="breakdown-value">{{ weeklyStudyTime }}h</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">日均</span>
                  <span class="breakdown-value">{{ averageDailyTime }}h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 连续学习 -->
        <div class="stat-card accent">
          <div class="stat-header">
            <div class="stat-icon">🔥</div>
            <div class="stat-label">学习连击</div>
          </div>
          <div class="stat-content">
            <div class="streak-display">
              <div class="streak-number">{{ userStats.streak.currentStreak }}</div>
              <div class="streak-unit">天</div>
            </div>
            <div class="streak-details">
              <div class="detail-item">
                <span class="detail-label">最长记录</span>
                <span class="detail-value">{{ userStats.streak.longestStreak }}天</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 测试成绩 -->
        <div class="stat-card success">
          <div class="stat-header">
            <div class="stat-icon">🏆</div>
            <div class="stat-label">测试成绩</div>
          </div>
          <div class="stat-content">
            <div class="score-display">
              <div class="score-value">{{ Math.round(userStats.averageQuizScore) }}</div>
              <div class="score-unit">分</div>
            </div>
            <div class="score-trend">
              <span class="trend-icon" :class="getScoreTrendClass()">{{ getScoreTrendIcon() }}</span>
              <span class="trend-text">{{ getScoreTrendText() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习时间分析 -->
    <div class="time-analysis">
      <h4 class="section-title">⏰ 学习时间分析</h4>
      <div class="time-chart-container">
        <!-- 简化的学习时间图表 -->
        <div class="time-chart">
          <div class="chart-bars">
            <div 
              v-for="(day, index) in weeklyData" 
              :key="index"
              class="chart-bar"
              :style="{ height: `${(day.studyTime / maxDailyTime) * 100}%` }"
              :title="`${day.label}: ${day.studyTime}小时`"
            >
              <div class="bar-value">{{ day.studyTime }}h</div>
            </div>
          </div>
          <div class="chart-labels">
            <div v-for="day in weeklyData" :key="day.label" class="chart-label">
              {{ day.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 知识掌握分析 -->
    <div class="mastery-analysis">
      <h4 class="section-title">🧠 知识掌握分析</h4>
      <div class="mastery-grid">
        <div 
          v-for="stage in stageProgress" 
          :key="stage.id"
          class="mastery-item"
        >
          <div class="mastery-header">
            <div class="stage-icon">{{ stage.icon }}</div>
            <div class="stage-name">{{ stage.name }}</div>
          </div>
          <div class="mastery-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${stage.completionRate}%` }"
                :class="`mastery-${stage.level}`"
              ></div>
            </div>
            <div class="mastery-stats">
              <span class="completion-rate">{{ Math.round(stage.completionRate) }}%</span>
              <span class="principles-count">{{ stage.completed }}/{{ stage.total }}</span>
            </div>
          </div>
          <div class="mastery-level">
            <span class="level-badge" :class="`level-${stage.level}`">
              {{ getMasteryText(stage.level) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习建议 -->
    <div class="learning-recommendations">
      <h4 class="section-title">💡 个性化建议</h4>
      <div class="recommendation-list">
        <div 
          v-for="recommendation in recommendations" 
          :key="recommendation.id"
          class="recommendation-item"
          :class="`priority-${recommendation.priority}`"
        >
          <div class="rec-icon">{{ recommendation.icon }}</div>
          <div class="rec-content">
            <div class="rec-title">{{ recommendation.title }}</div>
            <div class="rec-description">{{ recommendation.description }}</div>
          </div>
          <div class="rec-action">
            <button 
              @click="handleRecommendationAction(recommendation)"
              class="rec-button"
            >
              {{ recommendation.actionText }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就展示 -->
    <div class="achievements-section" v-if="achievements.length > 0">
      <h4 class="section-title">🏅 最近成就</h4>
      <div class="achievements-list">
        <div 
          v-for="achievement in achievements.slice(0, 3)" 
          :key="achievement.id"
          class="achievement-item"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-info">
            <div class="achievement-name">{{ achievement.name }}</div>
            <div class="achievement-desc">{{ achievement.description }}</div>
            <div class="achievement-date" v-if="achievement.unlockedDate">
              {{ formatDate(achievement.unlockedDate) }}
            </div>
          </div>
          <div class="achievement-progress" v-if="!achievement.unlocked">
            <div class="progress-bar small">
              <div 
                class="progress-fill"
                :style="{ width: `${achievement.progress}%` }"
              ></div>
            </div>
            <div class="progress-text">{{ achievement.progress }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useConfigStore } from '@/stores/config'

interface StageProgress {
  id: string
  name: string
  icon: string
  completed: number
  total: number
  completionRate: number
  level: 'novice' | 'learning' | 'proficient' | 'mastered'
}

interface Recommendation {
  id: string
  title: string
  description: string
  icon: string
  priority: 'high' | 'medium' | 'low'
  actionText: string
  action: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
  progress: number
}

const progressStore = useProgressStore()
const configStore = useConfigStore()

// 响应式数据
const weeklyData = ref([
  { label: '一', studyTime: 2.5 },
  { label: '二', studyTime: 1.8 },
  { label: '三', studyTime: 3.2 },
  { label: '四', studyTime: 2.1 },
  { label: '五', studyTime: 1.9 },
  { label: '六', studyTime: 4.1 },
  { label: '日', studyTime: 3.5 }
])

const achievements = ref<Achievement[]>([
  {
    id: '1',
    name: '初学者',
    description: '完成第一个原则学习',
    icon: '🌱',
    unlocked: true,
    unlockedDate: '2025-08-27',
    progress: 100
  },
  {
    id: '2',
    name: '坚持不懈',
    description: '连续学习7天',
    icon: '🔥',
    unlocked: true,
    unlockedDate: '2025-08-26',
    progress: 100
  },
  {
    id: '3',
    name: '测试达人',
    description: '测试成绩达到90分',
    icon: '🎯',
    unlocked: false,
    progress: 75
  }
])

// 计算属性
const userStats = computed(() => progressStore.userStats)

const completionPercentage = computed(() => {
  if (userStats.value.totalPrinciples === 0) return 0
  return (userStats.value.completedPrinciples / userStats.value.totalPrinciples) * 100
})

const weeklyStudyTime = computed(() => {
  return weeklyData.value.reduce((sum, day) => sum + day.studyTime, 0)
})

const averageDailyTime = computed(() => {
  const totalDays = Math.max(1, Math.floor((Date.now() - new Date(userStats.value.startDate).getTime()) / (1000 * 60 * 60 * 24)))
  return Math.round((userStats.value.totalStudyTime / 60) / totalDays * 10) / 10
})

const maxDailyTime = computed(() => {
  return Math.max(...weeklyData.value.map(d => d.studyTime), 1)
})

const stageProgress = computed((): StageProgress[] => {
  if (!configStore.isInitialized) return []
  
  // 模拟阶段进度数据
  return [
    {
      id: 'prepare',
      name: '准备阶段',
      icon: '🎯',
      completed: 3,
      total: 3,
      completionRate: 100,
      level: 'mastered'
    },
    {
      id: 'execute',
      name: '执行阶段',
      icon: '⚡',
      completed: 2,
      total: 3,
      completionRate: 66.7,
      level: 'proficient'
    },
    {
      id: 'collaborate',
      name: '协作阶段',
      icon: '🤝',
      completed: 1,
      total: 3,
      completionRate: 33.3,
      level: 'learning'
    },
    {
      id: 'iterate',
      name: '迭代阶段',
      icon: '🔄',
      completed: 0,
      total: 3,
      completionRate: 0,
      level: 'novice'
    }
  ]
})

const recommendations = computed((): Recommendation[] => {
  const recs: Recommendation[] = []
  
  // 基于学习进度生成建议
  if (completionPercentage.value < 25) {
    recs.push({
      id: '1',
      title: '开始基础学习',
      description: '建议先完成"准备阶段"的核心原则学习',
      icon: '🚀',
      priority: 'high',
      actionText: '开始学习',
      action: 'start_basic'
    })
  }
  
  if (userStats.value.streak.currentStreak === 0) {
    recs.push({
      id: '2',
      title: '保持学习节奏',
      description: '每天花15分钟学习，建立良好的学习习惯',
      icon: '⏰',
      priority: 'medium',
      actionText: '设置提醒',
      action: 'set_reminder'
    })
  }
  
  if (userStats.value.averageQuizScore < 80) {
    recs.push({
      id: '3',
      title: '加强练习',
      description: '通过闪卡练习和测试来巩固知识点',
      icon: '📚',
      priority: 'high',
      actionText: '开始练习',
      action: 'practice'
    })
  }
  
  return recs
})

// 方法
function formatStudyTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}分钟`
  if (mins === 0) return `${hours}小时`
  return `${hours}h${mins}m`
}

function getScoreTrendClass(): string {
  // 简化的趋势判断
  const score = userStats.value.averageQuizScore
  if (score > 85) return 'trend-up'
  if (score > 70) return 'trend-stable'
  return 'trend-down'
}

function getScoreTrendIcon(): string {
  const score = userStats.value.averageQuizScore
  if (score > 85) return '📈'
  if (score > 70) return '➡️'
  return '📉'
}

function getScoreTrendText(): string {
  const score = userStats.value.averageQuizScore
  if (score > 85) return '表现优秀'
  if (score > 70) return '稳步提升'
  return '需要加强'
}

function getMasteryText(level: string): string {
  switch (level) {
    case 'mastered': return '精通'
    case 'proficient': return '熟练'
    case 'learning': return '学习中'
    case 'novice': return '入门'
    default: return '未知'
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天获得'
  if (diffDays === 1) return '昨天获得'
  if (diffDays < 7) return `${diffDays}天前获得`
  return `${date.toLocaleDateString('zh-CN')}获得`
}

function handleRecommendationAction(recommendation: Recommendation) {
  console.log('执行建议操作:', recommendation.action)
  // 根据action类型执行相应操作
  switch (recommendation.action) {
    case 'start_basic':
      // 跳转到基础学习
      break
    case 'set_reminder':
      // 设置学习提醒
      break
    case 'practice':
      // 开始练习
      break
  }
}

onMounted(() => {
  console.log('学习分析组件已加载')
})
</script>

<style scoped>
.learning-analytics {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.analytics-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
  text-align: center;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 统计概览 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  padding: 24px;
  border-radius: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-card.primary::before { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
.stat-card.secondary::before { background: linear-gradient(90deg, #10b981, #047857); }
.stat-card.accent::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
.stat-card.success::before { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-icon {
  font-size: 24px;
}

.stat-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 进度圆环 */
.progress-circle {
  width: 80px;
  height: 80px;
  margin-bottom: 12px;
}

.circular-chart {
  display: block;
  margin: 0 auto;
  max-width: 80%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 2.8;
  stroke-linecap: round;
  animation: progress 1.5s ease-in-out forwards;
}

.percentage {
  fill: #1e293b;
  font-family: sans-serif;
  font-size: 0.5em;
  font-weight: 700;
  text-anchor: middle;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.stat-details,
.time-breakdown,
.streak-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item,
.breakdown-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.detail-label,
.breakdown-label {
  color: #64748b;
}

.detail-value,
.breakdown-value {
  font-weight: 600;
  color: #1e293b;
}

/* 时间显示 */
.time-display,
.streak-display,
.score-display {
  text-align: center;
  margin-bottom: 12px;
}

.time-value,
.streak-number,
.score-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.time-unit,
.streak-unit,
.score-unit {
  font-size: 14px;
  color: #64748b;
  margin-left: 4px;
}

.score-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
}

.trend-up { color: #10b981; }
.trend-stable { color: #f59e0b; }
.trend-down { color: #ef4444; }

/* 时间分析图表 */
.time-analysis {
  margin-bottom: 40px;
}

.time-chart-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

.time-chart {
  height: 200px;
  position: relative;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 150px;
  gap: 8px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  background: linear-gradient(to top, #1d4ed8, #3b82f6);
  transform: scaleY(1.1);
}

.bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}

.chart-label {
  font-size: 12px;
  color: #64748b;
  text-align: center;
}

/* 知识掌握分析 */
.mastery-analysis {
  margin-bottom: 40px;
}

.mastery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.mastery-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.mastery-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.mastery-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stage-icon {
  font-size: 24px;
}

.stage-name {
  font-weight: 600;
  color: #1e293b;
}

.mastery-progress {
  margin-bottom: 12px;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar.small {
  height: 4px;
}

.progress-fill {
  height: 100%;
  transition: width 0.6s ease;
}

.mastery-novice { background: #e2e8f0; }
.mastery-learning { background: #fbbf24; }
.mastery-proficient { background: #3b82f6; }
.mastery-mastered { background: #10b981; }

.mastery-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.completion-rate {
  font-weight: 600;
}

.mastery-level {
  text-align: right;
}

.level-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.level-novice { background: #f1f5f9; color: #64748b; }
.level-learning { background: #fef3c7; color: #92400e; }
.level-proficient { background: #dbeafe; color: #1e40af; }
.level-mastered { background: #dcfce7; color: #166534; }

/* 学习建议 */
.learning-recommendations {
  margin-bottom: 40px;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;
}

.recommendation-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
}

.priority-high::before { background: #ef4444; }
.priority-medium::before { background: #f59e0b; }
.priority-low::before { background: #10b981; }

.recommendation-item:hover {
  border-color: #cbd5e1;
  transform: translateX(4px);
}

.rec-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.rec-content {
  flex: 1;
}

.rec-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.rec-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
}

.rec-button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.rec-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* 成就展示 */
.achievements-section {
  margin-bottom: 40px;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.achievement-item.unlocked {
  background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 1%, white 1%);
  border-color: #fbbf24;
}

.achievement-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.achievement-date {
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

.achievement-progress {
  text-align: right;
  min-width: 80px;
}

.progress-text {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .learning-analytics {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .mastery-grid {
    grid-template-columns: 1fr;
  }
  
  .recommendation-item {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .achievement-item {
    flex-direction: column;
    text-align: center;
  }
  
  .achievement-progress {
    text-align: center;
  }
}
</style>