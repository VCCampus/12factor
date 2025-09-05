<template>
  <AppLayout>
    <div class="analytics-view">
      <!-- 页面头部 -->
      <div class="header-section">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-text-dark mb-4">学习分析</h1>
          <p class="text-gray-600 mb-6">深入了解你的学习进展和表现</p>
        </div>

        <!-- 快速统计卡片 -->
        <div class="quick-stats" v-if="progressStore.isInitialized">
          <div class="quick-stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-info">
              <div class="stat-value">{{ progressStore.completionPercentage }}%</div>
              <div class="stat-label">整体完成度</div>
            </div>
          </div>
          
          <div class="quick-stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-info">
              <div class="stat-value">{{ Math.round(progressStore.userStats.totalStudyTime / 60) }}</div>
              <div class="stat-label">学习小时</div>
            </div>
          </div>
          
          <div class="quick-stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-info">
              <div class="stat-value">{{ progressStore.userStats.streak.currentStreak }}</div>
              <div class="stat-label">连续天数</div>
            </div>
          </div>
          
          <div class="quick-stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
              <div class="stat-value">{{ Math.round(progressStore.userStats.averageQuizScore) }}</div>
              <div class="stat-label">平均分数</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要分析内容 -->
      <div class="main-analytics" v-if="!isLoading">
        <LearningAnalytics />
      </div>

      <!-- 详细统计表格 -->
      <div class="detailed-stats">
        <h3 class="section-title">📊 详细统计</h3>
        
        <div class="stats-tabs">
          <button 
            @click="activeTab = 'principles'" 
            :class="['tab-btn', { active: activeTab === 'principles' }]"
          >
            原则掌握
          </button>
          <button 
            @click="activeTab = 'quizzes'" 
            :class="['tab-btn', { active: activeTab === 'quizzes' }]"
          >
            测试记录
          </button>
          <button 
            @click="activeTab = 'time'" 
            :class="['tab-btn', { active: activeTab === 'time' }]"
          >
            时间分布
          </button>
        </div>

        <div class="tab-content">
          <!-- 原则掌握详情 -->
          <div v-if="activeTab === 'principles'" class="principles-table">
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>原则名称</th>
                    <th>学习状态</th>
                    <th>学习时长</th>
                    <th>闪卡复习</th>
                    <th>测试次数</th>
                    <th>最佳成绩</th>
                    <th>最后学习</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="principle in principleStats" :key="principle.id">
                    <td class="principle-name">
                      <div class="principle-info">
                        <span class="principle-title">{{ principle.name }}</span>
                        <span class="principle-stage">{{ principle.stage }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="status-badge" :class="`status-${principle.status}`">
                        {{ getStatusText(principle.status) }}
                      </span>
                    </td>
                    <td>{{ formatTime(principle.studyTime) }}</td>
                    <td class="text-center">{{ principle.flashcardReviews }}</td>
                    <td class="text-center">{{ principle.quizAttempts }}</td>
                    <td class="text-center">
                      <span class="score" :class="getScoreClass(principle.quizBestScore)">
                        {{ principle.quizBestScore > 0 ? principle.quizBestScore : '-' }}
                      </span>
                    </td>
                    <td class="last-studied">{{ formatLastStudied(principle.lastStudied) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 测试记录 -->
          <div v-if="activeTab === 'quizzes'" class="quizzes-table">
            <div class="quiz-summary">
              <div class="summary-cards">
                <div class="summary-card">
                  <div class="summary-title">总测试次数</div>
                  <div class="summary-value">{{ quizHistory.length }}</div>
                </div>
                <div class="summary-card">
                  <div class="summary-title">平均分数</div>
                  <div class="summary-value">{{ averageQuizScore }}</div>
                </div>
                <div class="summary-card">
                  <div class="summary-title">最高分数</div>
                  <div class="summary-value">{{ maxQuizScore }}</div>
                </div>
                <div class="summary-card">
                  <div class="summary-title">通过率</div>
                  <div class="summary-value">{{ passRate }}%</div>
                </div>
              </div>
            </div>
            
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>测试时间</th>
                    <th>测试模式</th>
                    <th>题目数量</th>
                    <th>正确题数</th>
                    <th>得分</th>
                    <th>用时</th>
                    <th>结果</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="quiz in quizHistory" :key="quiz.id">
                    <td>{{ formatDate(quiz.date) }}</td>
                    <td>
                      <span class="mode-badge" :class="`mode-${quiz.mode}`">
                        {{ getModeText(quiz.mode) }}
                      </span>
                    </td>
                    <td class="text-center">{{ quiz.totalQuestions }}</td>
                    <td class="text-center">{{ quiz.correctAnswers }}</td>
                    <td class="text-center">
                      <span class="score" :class="getScoreClass(quiz.score)">
                        {{ Math.round(quiz.score) }}
                      </span>
                    </td>
                    <td class="text-center">{{ quiz.duration || '15:30' }}</td>
                    <td class="text-center">
                      <span class="result-badge" :class="quiz.score >= 60 ? 'passed' : 'failed'">
                        {{ quiz.score >= 60 ? '通过' : '未通过' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 时间分布 -->
          <div v-if="activeTab === 'time'" class="time-distribution">
            <div class="time-stats-grid">
              <div class="time-stat-card">
                <h4>学习习惯</h4>
                <div class="habit-chart">
                  <div class="chart-item">
                    <span class="time-label">早晨 (6-12点)</span>
                    <div class="time-bar">
                      <div class="time-fill morning" style="width: 25%"></div>
                    </div>
                    <span class="time-percent">25%</span>
                  </div>
                  <div class="chart-item">
                    <span class="time-label">下午 (12-18点)</span>
                    <div class="time-bar">
                      <div class="time-fill afternoon" style="width: 35%"></div>
                    </div>
                    <span class="time-percent">35%</span>
                  </div>
                  <div class="chart-item">
                    <span class="time-label">晚上 (18-24点)</span>
                    <div class="time-bar">
                      <div class="time-fill evening" style="width: 40%"></div>
                    </div>
                    <span class="time-percent">40%</span>
                  </div>
                </div>
              </div>
              
              <div class="time-stat-card">
                <h4>每周分布</h4>
                <div class="weekday-stats">
                  <div v-for="(day, index) in weeklyStats" :key="index" class="weekday-item">
                    <div class="weekday-name">{{ day.name }}</div>
                    <div class="weekday-time">{{ day.time }}h</div>
                    <div class="weekday-bar">
                      <div 
                        class="weekday-fill" 
                        :style="{ width: `${(day.time / maxWeeklyTime) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-section" v-if="isLoading">
        <div class="neo-card p-8 text-center">
          <div class="loading-icon mb-4">📊</div>
          <h2 class="text-xl font-bold mb-2">生成学习报告...</h2>
          <p class="text-gray-600">正在分析你的学习数据</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import LearningAnalytics from '@/components/LearningAnalytics.vue'
import { useProgressStore } from '@/stores/progress'
import { useConfigStore } from '@/stores/config'

interface PrincipleStats {
  id: string
  name: string
  stage: string
  status: string
  studyTime: number
  flashcardReviews: number
  quizAttempts: number
  quizBestScore: number
  lastStudied: string
}

interface QuizRecord {
  id: string
  date: string
  mode: 'practice' | 'exam' | 'review'
  totalQuestions: number
  correctAnswers: number
  score: number
  duration?: string
}

const progressStore = useProgressStore()
const configStore = useConfigStore()

// 状态管理
const isLoading = ref(true)
const activeTab = ref<'principles' | 'quizzes' | 'time'>('principles')

// 模拟数据
const quizHistory = ref<QuizRecord[]>([
  {
    id: '1',
    date: '2025-08-28',
    mode: 'practice',
    totalQuestions: 10,
    correctAnswers: 8,
    score: 80,
    duration: '12:30'
  },
  {
    id: '2',
    date: '2025-08-27',
    mode: 'exam',
    totalQuestions: 15,
    correctAnswers: 12,
    score: 80,
    duration: '14:45'
  },
  {
    id: '3',
    date: '2025-08-26',
    mode: 'review',
    totalQuestions: 8,
    correctAnswers: 7,
    score: 87.5,
    duration: '10:15'
  }
])

const weeklyStats = ref([
  { name: '周一', time: 2.5 },
  { name: '周二', time: 1.8 },
  { name: '周三', time: 3.2 },
  { name: '周四', time: 2.1 },
  { name: '周五', time: 1.9 },
  { name: '周六', time: 4.1 },
  { name: '周日', time: 3.5 }
])

// 计算属性
const principleStats = computed((): PrincipleStats[] => {
  if (!configStore.isInitialized) return []
  
  return configStore.getAllPrinciples().map(principle => {
    const progress = progressStore.getPrincipleProgress(principle.id)
    return {
      id: principle.id,
      name: principle.name,
      stage: principle.stage,
      status: progress?.status || 'not-started',
      studyTime: progress?.studyTime || 0,
      flashcardReviews: progress?.flashcardReviews || 0,
      quizAttempts: progress?.quizAttempts || 0,
      quizBestScore: progress?.quizBestScore || 0,
      lastStudied: progress?.lastStudied || ''
    }
  })
})

const averageQuizScore = computed(() => {
  if (quizHistory.value.length === 0) return 0
  const total = quizHistory.value.reduce((sum, quiz) => sum + quiz.score, 0)
  return Math.round(total / quizHistory.value.length)
})

const maxQuizScore = computed(() => {
  if (quizHistory.value.length === 0) return 0
  return Math.max(...quizHistory.value.map(quiz => quiz.score))
})

const passRate = computed(() => {
  if (quizHistory.value.length === 0) return 0
  const passed = quizHistory.value.filter(quiz => quiz.score >= 60).length
  return Math.round((passed / quizHistory.value.length) * 100)
})

const maxWeeklyTime = computed(() => {
  return Math.max(...weeklyStats.value.map(day => day.time))
})

// 方法
async function initializeAnalytics() {
  try {
    isLoading.value = true
    
    // 确保数据已加载
    if (!configStore.isInitialized) {
      await configStore.initialize()
    }
    
    if (!progressStore.isInitialized) {
      await progressStore.initialize()
    }
    
    // 模拟数据加载时间
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    console.error('分析数据初始化失败:', error)
  } finally {
    isLoading.value = false
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'not-started': return '未开始'
    case 'in-progress': return '学习中'
    case 'completed': return '已完成'
    case 'mastered': return '已掌握'
    default: return '未知'
  }
}

function getModeText(mode: string): string {
  switch (mode) {
    case 'practice': return '练习'
    case 'exam': return '考试'
    case 'review': return '复习'
    default: return '未知'
  }
}

function formatTime(minutes: number): string {
  if (minutes === 0) return '-'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}分钟`
  return `${hours}h${mins}m`
}

function formatLastStudied(dateStr: string): string {
  if (!dateStr) return '从未学习'
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN')
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getScoreClass(score: number): string {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 60) return 'score-pass'
  return 'score-fail'
}

// 生命周期
onMounted(async () => {
  await initializeAnalytics()
})
</script>

<style scoped>
.analytics-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  margin-bottom: 40px;
}

/* 快速统计卡片 */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.quick-stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.quick-stat-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 主要分析内容 */
.main-analytics {
  margin-bottom: 48px;
}

/* 详细统计 */
.detailed-stats {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  padding: 24px 24px 0;
  margin-bottom: 20px;
}

.stats-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.tab-btn {
  padding: 16px 24px;
  border: none;
  background: none;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  color: #1e293b;
  background: #f8fafc;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: white;
}

.tab-content {
  padding: 24px;
}

/* 表格样式 */
.table-container {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #374151;
}

.data-table tr:hover {
  background: #f8fafc;
}

.principle-name .principle-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.principle-title {
  font-weight: 600;
  color: #1e293b;
}

.principle-stage {
  font-size: 12px;
  color: #64748b;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-not-started { background: #f1f5f9; color: #64748b; }
.status-in-progress { background: #fef3c7; color: #92400e; }
.status-completed { background: #dcfce7; color: #166534; }
.status-mastered { background: #dbeafe; color: #1e40af; }

.score {
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.score-excellent { background: #dcfce7; color: #166534; }
.score-good { background: #dbeafe; color: #1e40af; }
.score-pass { background: #fef3c7; color: #92400e; }
.score-fail { background: #fee2e2; color: #dc2626; }

.mode-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.mode-practice { background: #f0fdf4; color: #166534; }
.mode-exam { background: #fef2f2; color: #dc2626; }
.mode-review { background: #fffbeb; color: #92400e; }

.result-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.result-badge.passed { background: #dcfce7; color: #166534; }
.result-badge.failed { background: #fee2e2; color: #dc2626; }

/* 测试总结 */
.quiz-summary {
  margin-bottom: 24px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.summary-title {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

/* 时间分布 */
.time-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.time-stat-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
}

.time-stat-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.habit-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-label {
  width: 120px;
  font-size: 14px;
  color: #374151;
}

.time-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.time-fill {
  height: 100%;
  transition: width 0.6s ease;
}

.time-fill.morning { background: #fbbf24; }
.time-fill.afternoon { background: #3b82f6; }
.time-fill.evening { background: #8b5cf6; }

.time-percent {
  width: 40px;
  text-align: right;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.weekday-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weekday-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weekday-name {
  width: 40px;
  font-size: 14px;
  color: #374151;
}

.weekday-time {
  width: 40px;
  font-size: 12px;
  color: #64748b;
  text-align: right;
}

.weekday-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.weekday-fill {
  height: 100%;
  background: #10b981;
  transition: width 0.6s ease;
}

.loading-section {
  margin: 60px 0;
  text-align: center;
}

.loading-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analytics-view {
    padding: 16px;
  }
  
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .stats-tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    white-space: nowrap;
    min-width: 120px;
  }
  
  .time-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .quick-stats {
    grid-template-columns: 1fr;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>