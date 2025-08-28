<template>
  <AppLayout>
    <div class="quiz-view">
      <!-- 页面头部 -->
      <div class="header-section" v-if="!isQuizActive">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-text-dark mb-4">知识测试</h1>
          <p class="text-gray-600 mb-6">检验学习成果，巩固知识理解</p>
        </div>

        <!-- 测试模式选择 -->
        <div class="mode-selection mb-8">
          <h3 class="text-lg font-semibold text-center mb-6">选择测试模式</h3>
          <div class="mode-grid">
            <div 
              @click="selectMode('practice')" 
              :class="['mode-card', { active: selectedMode === 'practice' }]"
            >
              <div class="mode-icon">🎨</div>
              <h4 class="mode-title">练习模式</h4>
              <p class="mode-description">无时间限制，可查看解释</p>
              <div class="mode-features">
                <span class="feature-tag">✅ 即时反馈</span>
                <span class="feature-tag">✅ 详细解释</span>
              </div>
            </div>
            
            <div 
              @click="selectMode('exam')" 
              :class="['mode-card', { active: selectedMode === 'exam' }]"
            >
              <div class="mode-icon">🏆</div>
              <h4 class="mode-title">考试模式</h4>
              <p class="mode-description">有时间限制，模拟真实考试</p>
              <div class="mode-features">
                <span class="feature-tag">⏰ 15分钟限时</span>
                <span class="feature-tag">✅ 成绩记录</span>
              </div>
            </div>
            
            <div 
              @click="selectMode('review')" 
              :class="['mode-card', { active: selectedMode === 'review' }]"
            >
              <div class="mode-icon">📚</div>
              <h4 class="mode-title">复习模式</h4>
              <p class="mode-description">针对性复习错题和难点</p>
              <div class="mode-features">
                <span class="feature-tag">🎯 精准复习</span>
                <span class="feature-tag">✅ 个性化</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 难度选择 -->
        <div class="difficulty-selection mb-8" v-if="selectedMode">
          <h4 class="text-md font-semibold text-center mb-4">选择难度</h4>
          <div class="difficulty-options">
            <button 
              @click="selectedDifficulty = 'basic'" 
              :class="['difficulty-btn', { active: selectedDifficulty === 'basic' }]"
            >
              😊 基础级
            </button>
            <button 
              @click="selectedDifficulty = 'intermediate'" 
              :class="['difficulty-btn', { active: selectedDifficulty === 'intermediate' }]"
            >
              🤔 中级
            </button>
            <button 
              @click="selectedDifficulty = 'advanced'" 
              :class="['difficulty-btn', { active: selectedDifficulty === 'advanced' }]"
            >
              😤 高级
            </button>
            <button 
              @click="selectedDifficulty = 'mixed'" 
              :class="['difficulty-btn', { active: selectedDifficulty === 'mixed' }]"
            >
              🌈 混合
            </button>
          </div>
        </div>

        <!-- 开始测试按钮 -->
        <div class="start-section" v-if="selectedMode && selectedDifficulty">
          <div class="quiz-preview neo-card">
            <div class="preview-stats">
              <div class="stat-item">
                <div class="stat-number">{{ filteredQuestions.length }}</div>
                <div class="stat-label">题目数量</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ getEstimatedTime() }}</div>
                <div class="stat-label">预计用时</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">60</div>
                <div class="stat-label">及格线</div>
              </div>
            </div>
            
            <button @click="startQuiz" class="start-quiz-btn">
              🚀 开始测试
            </button>
          </div>
        </div>

        <!-- 历史记录 -->
        <div class="history-section" v-if="quizHistory.length > 0">
          <h4 class="text-md font-semibold mb-4">最近记录</h4>
          <div class="history-list">
            <div 
              v-for="record in quizHistory.slice(0, 3)" 
              :key="record.id"
              class="history-item"
            >
              <div class="history-info">
                <div class="history-mode">{{ getModeText(record.mode) }}</div>
                <div class="history-date">{{ formatDate(record.date) }}</div>
              </div>
              <div class="history-score" :class="getScoreClass(record.score)">
                {{ Math.round(record.score) }}分
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 测试进行中 -->
      <div class="quiz-section" v-if="isQuizActive">
        <QuizEngine
          :questions="filteredQuestions"
          :mode="selectedMode as 'practice' | 'exam' | 'review'"
          :time-limit="getTimeLimit()"
          :passing-score="60"
          :randomize-questions="selectedMode === 'exam'"
          :randomize-options="true"
          @complete="handleQuizComplete"
          @exit="exitQuiz"
        />
      </div>

      <!-- 无数据状态 -->
      <div class="empty-section" v-if="!isLoading && !isQuizActive && filteredQuestions.length === 0">
        <div class="neo-card p-8 text-center">
          <div class="empty-icon mb-4">📋</div>
          <h2 class="text-xl font-bold mb-2">暂无测试题目</h2>
          <p class="text-gray-600 mb-6">请先在原则学习中获取题目内容</p>
          <RouterLink to="/principles" class="neo-btn">
            📖 开始学习
          </RouterLink>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-section" v-if="isLoading">
        <div class="neo-card p-8 text-center">
          <div class="loading-icon mb-4">⏳</div>
          <h2 class="text-xl font-bold mb-2">准备测试...</h2>
          <p class="text-gray-600">正在加载题目内容</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import QuizEngine from '@/components/QuizEngine.vue'
import { useConfigStore, type Principle } from '@/stores/config'
import { useQuizStore } from '@/stores/quiz'
import type { QuizQuestion } from '@/stores/quiz'

// 测试模式类型
type QuizMode = 'practice' | 'exam' | 'review'
type DifficultyLevel = 'basic' | 'intermediate' | 'advanced' | 'mixed'

// 历史记录类型
interface QuizRecord {
  id: string
  mode: QuizMode
  score: number
  date: string
  difficulty: DifficultyLevel
  totalQuestions: number
  correctAnswers: number
}

const configStore = useConfigStore()
const quizStore = useQuizStore()

// 状态管理
const isLoading = ref(true)
const isQuizActive = ref(false)
const selectedMode = ref<QuizMode | null>(null)
const selectedDifficulty = ref<DifficultyLevel>('mixed')

// 模拟历史记录数据
const quizHistory = ref<QuizRecord[]>([
  {
    id: '1',
    mode: 'practice',
    score: 85,
    date: '2025-08-27',
    difficulty: 'intermediate',
    totalQuestions: 10,
    correctAnswers: 8
  },
  {
    id: '2', 
    mode: 'exam',
    score: 72,
    date: '2025-08-26',
    difficulty: 'mixed',
    totalQuestions: 15,
    correctAnswers: 11
  },
  {
    id: '3',
    mode: 'review',
    score: 91,
    date: '2025-08-25',
    difficulty: 'basic',
    totalQuestions: 8,
    correctAnswers: 7
  }
])

// 计算属性 - 生成模拟测试题目
const allQuestions = computed((): QuizQuestion[] => {
  if (!configStore.isInitialized) return []
  
  // 从原则数据生成测试题目
  return configStore.getAllPrinciples().map((principle: Principle, index: number) => ({
    id: `q_${principle.id}`,
    principle_id: principle.id,
    question: principle.quiz?.question || `下列关于“${principle.name}”的说法哪个是正确的？`,
    correct_answer: principle.quiz?.correct_answer || principle.concept.substring(0, 100) + '...',
    wrong_answers: principle.quiz?.wrong_answers || [
      '这是一个错误答案A',
      '这是一个错误答案B',
      '这是一个错误答案C'
    ],
    difficulty: index % 3 === 0 ? 'basic' : index % 3 === 1 ? 'intermediate' : 'advanced',
    explanation: `${principle.name}: ${principle.concept.substring(0, 150)}...`
  }))
})

const filteredQuestions = computed(() => {
  if (selectedDifficulty.value === 'mixed') {
    return allQuestions.value
  }
  return allQuestions.value.filter(q => q.difficulty === selectedDifficulty.value)
})

// 方法
async function initializeQuiz() {
  try {
    isLoading.value = true
    
    if (!configStore.isInitialized) {
      await configStore.initialize()
    }
    
    // 初始化测试存储
    quizStore.initialize()
    
  } catch (error) {
    console.error('测试初始化失败:', error)
  } finally {
    isLoading.value = false
  }
}

function selectMode(mode: QuizMode) {
  selectedMode.value = mode
  
  // 根据模式设置默认雾度
  if (mode === 'practice') {
    selectedDifficulty.value = 'basic'
  } else if (mode === 'exam') {
    selectedDifficulty.value = 'mixed'
  } else if (mode === 'review') {
    selectedDifficulty.value = 'intermediate'
  }
}

function startQuiz() {
  if (!selectedMode.value || filteredQuestions.value.length === 0) return
  isQuizActive.value = true
}

function exitQuiz() {
  isQuizActive.value = false
  selectedMode.value = null
}

function handleQuizComplete(results: any) {
  // 保存测试结果
  const newRecord: QuizRecord = {
    id: Date.now().toString(),
    mode: selectedMode.value!,
    score: results.score,
    date: new Date().toISOString().split('T')[0],
    difficulty: selectedDifficulty.value,
    totalQuestions: results.totalQuestions,
    correctAnswers: results.correctCount
  }
  
  quizHistory.value.unshift(newRecord)
  
  // 限制历史记录数量
  if (quizHistory.value.length > 10) {
    quizHistory.value = quizHistory.value.slice(0, 10)
  }
  
  console.log('测试结果已保存:', newRecord)
}

function getEstimatedTime(): string {
  const questionCount = filteredQuestions.value.length
  if (selectedMode.value === 'exam') {
    return '15分钟'
  }
  
  const minutes = Math.max(5, Math.round(questionCount * 1.5))
  return `${minutes}分钟`
}

function getTimeLimit(): number {
  if (selectedMode.value === 'exam') {
    return 15 * 60 // 15分钟 = 900秒
  }
  return 0 // 无时间限制
}

function getModeText(mode: QuizMode): string {
  switch (mode) {
    case 'practice': return '练习模式'
    case 'exam': return '考试模式'
    case 'review': return '复习模式'
    default: return '未知模式'
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN')
}

function getScoreClass(score: number): string {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 60) return 'score-pass'
  return 'score-fail'
}

// 生命周期
onMounted(async () => {
  await initializeQuiz()
})
</script>

<style scoped>
.quiz-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  margin-bottom: 40px;
}

.mode-selection {
  margin-bottom: 32px;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin: 0 auto;
  max-width: 900px;
}

.mode-card {
  padding: 24px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.mode-card:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.mode-card.active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
}

.mode-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.mode-card:hover::before {
  left: 100%;
}

.mode-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.mode-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.mode-description {
  color: #64748b;
  margin-bottom: 16px;
  line-height: 1.5;
}

.mode-features {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-tag {
  font-size: 12px;
  color: #059669;
  font-weight: 500;
}

.difficulty-selection {
  text-align: center;
}

.difficulty-options {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.difficulty-btn {
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.difficulty-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-1px);
}

.difficulty-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.start-section {
  display: flex;
  justify-content: center;
  margin: 32px 0;
}

.quiz-preview {
  padding: 24px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.start-quiz-btn {
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.start-quiz-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.start-quiz-btn:active {
  transform: translateY(0);
}

.history-section {
  margin-top: 48px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-mode {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.history-date {
  font-size: 12px;
  color: #64748b;
}

.history-score {
  font-size: 16px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 20px;
  min-width: 60px;
  text-align: center;
}

.score-excellent {
  background: #dcfce7;
  color: #166534;
}

.score-good {
  background: #dbeafe;
  color: #1e40af;
}

.score-pass {
  background: #fef3c7;
  color: #92400e;
}

.score-fail {
  background: #fee2e2;
  color: #dc2626;
}

.quiz-section {
  margin-top: 20px;
}

.empty-section,
.loading-section {
  margin: 60px 0;
  text-align: center;
}

.empty-icon,
.loading-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.loading-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quiz-view {
    padding: 16px;
  }
  
  .mode-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .mode-card {
    padding: 20px;
  }
  
  .difficulty-options {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .difficulty-btn {
    width: 200px;
  }
  
  .preview-stats {
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: center;
  }
  
  .history-item {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .history-info {
    align-items: center;
  }
}

@media (max-width: 480px) {
  .mode-card {
    padding: 16px;
  }
  
  .mode-icon {
    font-size: 36px;
  }
  
  .mode-title {
    font-size: 16px;
  }
  
  .start-quiz-btn {
    padding: 14px 24px;
    font-size: 14px;
  }
}
</style>