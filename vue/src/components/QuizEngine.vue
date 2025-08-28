<template>
  <div class="quiz-engine">
    <!-- 测试进行中 -->
    <div v-if="isQuizActive" class="active-quiz">
      <!-- 题目头部信息 -->
      <div class="quiz-header">
        <div class="question-progress">
          <div class="progress-info">
            第 {{ currentQuestionIndex + 1 }} 题 / 共 {{ questions.length }} 题
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
            ></div>
          </div>
        </div>
        
        <div class="quiz-stats">
          <div class="stat-item">
            <span class="stat-label">正确率</span>
            <span class="stat-value">{{ Math.round(accuracyRate) }}%</span>
          </div>
          <div class="stat-item" v-if="timeLimit > 0">
            <span class="stat-label">剩余时间</span>
            <span class="stat-value">{{ formatTime(timeRemaining) }}</span>
          </div>
        </div>
      </div>

      <!-- 当前题目 -->
      <div class="question-container" v-if="currentQuestion">
        <div class="question-card neo-card">
          <!-- 题目类型标识 -->
          <div class="question-type-badge">
            <span class="difficulty-badge" :class="`difficulty-${currentQuestion.difficulty}`">
              {{ getDifficultyText(currentQuestion.difficulty) }}
            </span>
            <span class="type-badge">选择题</span>
          </div>

          <!-- 题目内容 -->
          <div class="question-content">
            <h3 class="question-text">{{ currentQuestion.question }}</h3>
            
            <!-- 关联原则信息 -->
            <div class="principle-reference" v-if="currentQuestion.principle_id">
              <span class="principle-tag">
                📖 {{ getPrincipleName(currentQuestion.principle_id) }}
              </span>
            </div>
          </div>

          <!-- 选项列表 -->
          <div class="answer-options">
            <div 
              v-for="(option, index) in shuffledOptions" 
              :key="index"
              class="option-item"
              :class="{ 
                selected: selectedAnswer === option,
                correct: showResult && option === currentQuestion.correct_answer,
                incorrect: showResult && selectedAnswer === option && option !== currentQuestion.correct_answer
              }"
              @click="selectAnswer(option)"
            >
              <div class="option-marker">{{ String.fromCharCode(65 + index) }}</div>
              <div class="option-text">{{ option }}</div>
              <div class="option-status" v-if="showResult">
                <span v-if="option === currentQuestion.correct_answer">✅</span>
                <span v-else-if="selectedAnswer === option">❌</span>
              </div>
            </div>
          </div>

          <!-- 结果解释 -->
          <div class="explanation" v-if="showResult && currentQuestion.explanation">
            <div class="explanation-header">💡 答案解释</div>
            <p class="explanation-text">{{ currentQuestion.explanation }}</p>
          </div>

          <!-- 操作按钮 -->
          <div class="question-actions">
            <button 
              v-if="!showResult"
              @click="submitAnswer" 
              :disabled="!selectedAnswer"
              class="submit-btn"
              :class="{ disabled: !selectedAnswer }"
            >
              确认答案
            </button>
            
            <div v-else class="result-actions">
              <button 
                v-if="currentQuestionIndex < questions.length - 1"
                @click="nextQuestion" 
                class="next-btn"
              >
                下一题 →
              </button>
              <button 
                v-else
                @click="finishQuiz" 
                class="finish-btn"
              >
                完成测试
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 测试结果 -->
    <div v-else-if="showResults" class="quiz-results">
      <div class="results-card neo-card">
        <div class="results-header">
          <div class="result-icon">
            {{ score >= passingScore ? '🎉' : '📚' }}
          </div>
          <h2 class="result-title">
            {{ score >= passingScore ? '恭喜通过!' : '继续加油!' }}
          </h2>
          <div class="result-subtitle">
            测试完成，成绩已保存
          </div>
        </div>

        <div class="score-display">
          <div class="score-circle">
            <div class="score-number">{{ Math.round(score) }}</div>
            <div class="score-label">分</div>
          </div>
        </div>

        <div class="results-breakdown">
          <div class="breakdown-item">
            <div class="breakdown-label">正确题数</div>
            <div class="breakdown-value">{{ correctCount }} / {{ questions.length }}</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-label">正确率</div>
            <div class="breakdown-value">{{ Math.round(accuracyRate) }}%</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-label">用时</div>
            <div class="breakdown-value">{{ formatTime(totalTime) }}</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-label">平均每题</div>
            <div class="breakdown-value">{{ formatTime(Math.round(totalTime / questions.length)) }}</div>
          </div>
        </div>

        <div class="difficulty-analysis">
          <h4 class="analysis-title">难度分析</h4>
          <div class="difficulty-stats">
            <div class="difficulty-item">
              <span class="difficulty-label">基础题</span>
              <div class="difficulty-bar">
                <div 
                  class="difficulty-fill basic" 
                  :style="{ width: `${getDifficultyAccuracy('basic')}%` }"
                ></div>
              </div>
              <span class="difficulty-percent">{{ Math.round(getDifficultyAccuracy('basic')) }}%</span>
            </div>
            <div class="difficulty-item">
              <span class="difficulty-label">中等题</span>
              <div class="difficulty-bar">
                <div 
                  class="difficulty-fill intermediate" 
                  :style="{ width: `${getDifficultyAccuracy('intermediate')}%` }"
                ></div>
              </div>
              <span class="difficulty-percent">{{ Math.round(getDifficultyAccuracy('intermediate')) }}%</span>
            </div>
            <div class="difficulty-item">
              <span class="difficulty-label">进阶题</span>
              <div class="difficulty-bar">
                <div 
                  class="difficulty-fill advanced" 
                  :style="{ width: `${getDifficultyAccuracy('advanced')}%` }"
                ></div>
              </div>
              <span class="difficulty-percent">{{ Math.round(getDifficultyAccuracy('advanced')) }}%</span>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button @click="reviewQuiz" class="review-btn">
            📋 查看详解
          </button>
          <button @click="restartQuiz" class="restart-btn">
            🔄 再测一次
          </button>
          <button @click="$emit('exit')" class="exit-btn">
            🏠 返回首页
          </button>
        </div>
      </div>
    </div>

    <!-- 答题回顾 -->
    <div v-else-if="showReview" class="quiz-review">
      <div class="review-header">
        <h3>详细解答</h3>
        <button @click="exitReview" class="close-review">✕</button>
      </div>
      
      <div class="review-questions">
        <div 
          v-for="(question, index) in questions" 
          :key="question.id"
          class="review-item"
          :class="{ 
            correct: getUserAnswer(question.id)?.isCorrect,
            incorrect: !getUserAnswer(question.id)?.isCorrect
          }"
        >
          <div class="review-header">
            <div class="question-number">第 {{ index + 1 }} 题</div>
            <div class="result-badge">
              {{ getUserAnswer(question.id)?.isCorrect ? '✅ 正确' : '❌ 错误' }}
            </div>
          </div>
          
          <div class="review-question">{{ question.question }}</div>
          
          <div class="review-answers">
            <div class="answer-line">
              <strong>你的答案：</strong>
              <span :class="{ correct: getUserAnswer(question.id)?.isCorrect, incorrect: !getUserAnswer(question.id)?.isCorrect }">
                {{ getUserAnswer(question.id)?.selectedAnswer || '未作答' }}
              </span>
            </div>
            <div class="answer-line">
              <strong>正确答案：</strong>
              <span class="correct-answer">{{ question.correct_answer }}</span>
            </div>
          </div>
          
          <div class="review-explanation" v-if="question.explanation">
            <strong>解释：</strong>{{ question.explanation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { QuizQuestion, QuizAnswer } from '@/stores/quiz'

interface Props {
  questions: QuizQuestion[]
  mode: 'practice' | 'exam' | 'review'
  timeLimit?: number // 秒数，0表示无限制
  passingScore?: number // 及格分数
  randomizeQuestions?: boolean
  randomizeOptions?: boolean
}

interface Emits {
  (e: 'complete', results: QuizResults): void
  (e: 'exit'): void
}

interface QuizResults {
  score: number
  correctCount: number
  totalQuestions: number
  answers: QuizAnswer[]
  totalTime: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'practice',
  timeLimit: 0,
  passingScore: 60,
  randomizeQuestions: false,
  randomizeOptions: true
})

const emit = defineEmits<Emits>()

// 状态管理
const isQuizActive = ref(false)
const showResults = ref(false)
const showReview = ref(false)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref('')
const showResult = ref(false)
const startTime = ref(0)
const questionStartTime = ref(0)
const timeRemaining = ref(0)
const answers = ref<QuizAnswer[]>([])

// 定时器
let timer: number | null = null

// 计算属性
const currentQuestion = computed(() => {
  if (currentQuestionIndex.value < props.questions.length) {
    return props.questions[currentQuestionIndex.value]
  }
  return null
})

const shuffledOptions = computed(() => {
  if (!currentQuestion.value) return []
  
  const options = [
    currentQuestion.value.correct_answer,
    ...currentQuestion.value.wrong_answers
  ]
  
  if (props.randomizeOptions) {
    return shuffleArray([...options])
  }
  return options
})

const correctCount = computed(() => {
  return answers.value.filter(a => a.isCorrect).length
})

const accuracyRate = computed(() => {
  if (answers.value.length === 0) return 0
  return (correctCount.value / answers.value.length) * 100
})

const score = computed(() => {
  return (correctCount.value / props.questions.length) * 100
})

const totalTime = computed(() => {
  if (startTime.value === 0) return 0
  return Math.round((Date.now() - startTime.value) / 1000)
})

// 方法
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function startQuiz() {
  isQuizActive.value = true
  showResults.value = false
  showReview.value = false
  currentQuestionIndex.value = 0
  selectedAnswer.value = ''
  showResult.value = false
  answers.value = []
  startTime.value = Date.now()
  questionStartTime.value = Date.now()
  
  if (props.timeLimit > 0) {
    timeRemaining.value = props.timeLimit
    startTimer()
  }
}

function selectAnswer(option: string) {
  if (!showResult.value) {
    selectedAnswer.value = option
  }
}

function submitAnswer() {
  if (!selectedAnswer.value || !currentQuestion.value) return
  
  const isCorrect = selectedAnswer.value === currentQuestion.value.correct_answer
  const timeSpent = Math.round((Date.now() - questionStartTime.value) / 1000)
  
  const answer: QuizAnswer = {
    questionId: currentQuestion.value.id,
    selectedAnswer: selectedAnswer.value,
    isCorrect,
    timeSpent,
    timestamp: new Date().toISOString()
  }
  
  answers.value.push(answer)
  showResult.value = true
}

function nextQuestion() {
  currentQuestionIndex.value++
  selectedAnswer.value = ''
  showResult.value = false
  questionStartTime.value = Date.now()
}

function finishQuiz() {
  isQuizActive.value = false
  showResults.value = true
  
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  
  const results: QuizResults = {
    score: score.value,
    correctCount: correctCount.value,
    totalQuestions: props.questions.length,
    answers: answers.value,
    totalTime: totalTime.value
  }
  
  emit('complete', results)
}

function restartQuiz() {
  startQuiz()
}

function reviewQuiz() {
  showResults.value = false
  showReview.value = true
}

function exitReview() {
  showReview.value = false
  showResults.value = true
}

function startTimer() {
  if (timer) clearInterval(timer)
  
  timer = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      finishQuiz()
    }
  }, 1000)
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getDifficultyText(difficulty: string): string {
  switch (difficulty) {
    case 'basic': return '基础'
    case 'intermediate': return '中等'
    case 'advanced': return '进阶'
    default: return '未知'
  }
}

function getPrincipleName(principleId: string): string {
  // 这里需要从配置存储中获取原则名称
  // 暂时返回简化版本
  return `原则 ${principleId}`
}

function getDifficultyAccuracy(difficulty: string): number {
  const difficultyQuestions = props.questions.filter(q => q.difficulty === difficulty)
  if (difficultyQuestions.length === 0) return 0
  
  const correctAnswers = answers.value.filter(a => {
    const question = props.questions.find(q => q.id === a.questionId)
    return question?.difficulty === difficulty && a.isCorrect
  })
  
  return (correctAnswers.length / difficultyQuestions.length) * 100
}

function getUserAnswer(questionId: string): QuizAnswer | undefined {
  return answers.value.find(a => a.questionId === questionId)
}

// 生命周期
onMounted(() => {
  startQuiz()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 监听时间限制变化
watch(() => props.timeLimit, (newLimit) => {
  if (newLimit > 0 && isQuizActive.value) {
    timeRemaining.value = newLimit
    startTimer()
  }
})
</script>

<style scoped>
.quiz-engine {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.question-progress {
  flex: 1;
}

.progress-info {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  transition: width 0.3s ease;
}

.quiz-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.question-container {
  margin-bottom: 24px;
}

.question-card {
  padding: 32px;
}

.question-type-badge {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.difficulty-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty-basic { background: #dcfce7; color: #166534; }
.difficulty-intermediate { background: #fef3c7; color: #92400e; }
.difficulty-advanced { background: #fce7f3; color: #be185d; }

.type-badge {
  padding: 4px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.question-content {
  margin-bottom: 32px;
}

.question-text {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.6;
  margin-bottom: 16px;
}

.principle-reference {
  margin-top: 16px;
}

.principle-tag {
  display: inline-block;
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-size: 12px;
  color: #475569;
}

.answer-options {
  margin-bottom: 32px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-item:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.option-item.selected {
  border-color: #3b82f6;
  background: #dbeafe;
}

.option-item.correct {
  border-color: #22c55e;
  background: #dcfce7;
}

.option-item.incorrect {
  border-color: #ef4444;
  background: #fee2e2;
}

.option-marker {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: #64748b;
  border-radius: 50%;
  font-weight: 600;
  margin-right: 16px;
}

.option-item.selected .option-marker {
  background: #3b82f6;
  color: white;
}

.option-item.correct .option-marker {
  background: #22c55e;
  color: white;
}

.option-item.incorrect .option-marker {
  background: #ef4444;
  color: white;
}

.option-text {
  flex: 1;
  font-size: 16px;
  color: #1e293b;
}

.option-status {
  font-size: 20px;
}

.explanation {
  margin-bottom: 24px;
  padding: 20px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
}

.explanation-header {
  font-weight: 600;
  color: #0c4a6e;
  margin-bottom: 8px;
}

.explanation-text {
  color: #164e63;
  line-height: 1.6;
}

.question-actions {
  text-align: center;
}

.submit-btn, .next-btn, .finish-btn {
  padding: 12px 32px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover, .next-btn:hover, .finish-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.submit-btn.disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

.results-card {
  padding: 40px;
  text-align: center;
}

.results-header {
  margin-bottom: 32px;
}

.result-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.result-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.result-subtitle {
  color: #64748b;
}

.score-display {
  margin: 32px 0;
}

.score-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 4px solid #3b82f6;
  border-radius: 50%;
  background: #dbeafe;
}

.score-number {
  font-size: 32px;
  font-weight: 700;
  color: #1e40af;
}

.score-label {
  font-size: 14px;
  color: #1e40af;
}

.results-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin: 32px 0;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
}

.breakdown-item {
  text-align: center;
}

.breakdown-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.breakdown-value {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.difficulty-analysis {
  margin: 32px 0;
  text-align: left;
}

.analysis-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.difficulty-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.difficulty-label {
  width: 60px;
  font-size: 14px;
  color: #64748b;
}

.difficulty-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.difficulty-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.difficulty-fill.basic { background: #22c55e; }
.difficulty-fill.intermediate { background: #f59e0b; }
.difficulty-fill.advanced { background: #ef4444; }

.difficulty-percent {
  width: 40px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.review-btn, .restart-btn, .exit-btn {
  padding: 12px 24px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.review-btn:hover { border-color: #3b82f6; color: #3b82f6; }
.restart-btn:hover { border-color: #22c55e; color: #22c55e; }
.exit-btn:hover { border-color: #64748b; color: #64748b; }

.quiz-review {
  max-width: 100%;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
}

.close-review {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
}

.review-item {
  margin-bottom: 32px;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.review-item.correct {
  background: #f0fdf4;
  border-color: #22c55e;
}

.review-item.incorrect {
  background: #fef2f2;
  border-color: #ef4444;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-number {
  font-weight: 600;
  color: #1e293b;
}

.result-badge {
  font-size: 14px;
  font-weight: 600;
}

.review-question {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.review-answers {
  margin-bottom: 16px;
}

.answer-line {
  margin-bottom: 8px;
}

.answer-line .correct {
  color: #22c55e;
}

.answer-line .incorrect {
  color: #ef4444;
}

.correct-answer {
  color: #22c55e;
}

.review-explanation {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  color: #475569;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quiz-engine {
    padding: 16px;
  }
  
  .quiz-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .progress-bar {
    width: 100%;
  }
  
  .quiz-stats {
    justify-content: space-around;
  }
  
  .question-card {
    padding: 24px;
  }
  
  .question-text {
    font-size: 18px;
  }
  
  .results-breakdown {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .difficulty-item {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .difficulty-label {
    width: auto;
    text-align: center;
  }
}
</style>