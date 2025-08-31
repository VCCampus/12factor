<template>
  <AppLayout :show-footer-stats="false" :minimal-footer="true">
    <div v-if="loading" class="loading-container">
      <div class="neo-card text-center p-8">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-bold mb-2">正在加载面试题目...</h3>
        <p class="text-text-muted">{{ difficultyTitle }} | {{ questions.length > 0 ? questions.length : 100 }} 道题目</p>
        <div class="loading-bar mt-4">
          <div class="loading-progress"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="neo-card text-center p-8 border-red-300 bg-red-50">
        <div class="text-6xl mb-4">❌</div>
        <h3 class="text-xl font-bold mb-2 text-red-800">加载失败</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <div class="space-x-4">
          <button @click="loadInterviewQuestions" class="neo-btn bg-red-600 text-white">
            重试加载
          </button>
          <button @click="backToHome" class="neo-btn-secondary">
            返回首页
          </button>
        </div>
      </div>
    </div>
    
    <div v-else-if="questions.length > 0" class="quiz-container">
      <!-- 面试信息头部 -->
      <div class="interview-header neo-card mb-6 p-4 bg-blue-50 border-blue-200">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="interview-info">
            <h2 class="text-xl font-bold text-blue-900">
              {{ getDifficultyIcon(difficulty) }} {{ difficultyTitle }}
            </h2>
            <p class="text-blue-700">ChainCatcher 区块链记者岗位 • {{ questions.length }} 道题目</p>
          </div>
          <div class="interview-actions mt-4 md:mt-0">
            <button @click="backToHome" class="neo-btn-secondary text-sm">
              返回选择
            </button>
          </div>
        </div>
      </div>
      
      <!-- 使用扩展的 QuizEngine -->
      <QuizEngine 
        :questions="questions"
        :mode="'interview'"
        :time-limit="0"
        :passing-score="60"
        :randomize-questions="true"
        :randomize-options="true"
        :job-info="jobInfo"
        @complete="handleInterviewComplete"
        @exit="handleExit"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuizEngine from '@/components/QuizEngine.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useInterviewStore } from '@/stores/interview'
import type { QuizQuestion } from '@/stores/quiz'

const route = useRoute()
const router = useRouter()
const interviewStore = useInterviewStore()

// 状态管理
const questions = ref<QuizQuestion[]>([])
const loading = ref(true)
const error = ref<string>('')
const jobInfo = ref<any>({})

// 计算属性
const difficulty = computed(() => route.params.difficulty as string)
const difficultyTitle = computed(() => {
  const titles = {
    basic: '基础级别 - 通用素质测评',
    advanced: '进阶级别 - 深度研究能力',
    expert: '专家级别 - 新闻实战技能'
  }
  return titles[difficulty.value as keyof typeof titles] || '模拟面试'
})

onMounted(async () => {
  await loadInterviewQuestions()
})

const loadInterviewQuestions = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log(`🔄 加载面试题目: ${difficulty.value}`)
    
    const response = await fetch(`/data/interview-${difficulty.value}.json`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log(`📚 加载完成:`, data.meta)
    
    if (!data.questions || data.questions.length === 0) {
      throw new Error('题目数据为空')
    }
    
    questions.value = data.questions
    jobInfo.value = data.jobInfo || {}
    
    // 初始化面试Store
    interviewStore.startInterview(
      difficulty.value as 'basic' | 'advanced' | 'expert',
      difficultyTitle.value,
      questions.value.length
    )
    
    console.log(`✅ 成功加载 ${questions.value.length} 道题目`)
    
  } catch (err) {
    console.error('❌ 加载面试题目失败:', err)
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    loading.value = false
  }
}

const getDifficultyIcon = (diff: string) => {
  const icons = {
    basic: '📝',
    advanced: '🔍',
    expert: '⚡'
  }
  return icons[diff as keyof typeof icons] || '📋'
}

const handleInterviewComplete = (results: any) => {
  console.log('🎉 面试完成:', results)
  
  // 完成面试状态
  interviewStore.completeInterview()
  
  // 保存面试结果到 localStorage
  const interviewResult = {
    ...results,
    difficulty: difficulty.value,
    difficultyTitle: difficultyTitle.value,
    jobInfo: jobInfo.value,
    completedAt: new Date().toISOString(),
    type: 'interview'
  }
  
  // 保存到本地存储
  const existingResults = JSON.parse(localStorage.getItem('interview-results') || '[]')
  existingResults.push(interviewResult)
  localStorage.setItem('interview-results', JSON.stringify(existingResults))
  
  console.log('💾 面试结果已保存')
}

const handleExit = () => {
  interviewStore.resetInterview()
  backToHome()
}

const backToHome = () => {
  interviewStore.resetInterview()
  router.push('/mock-interview')
}
</script>

<style scoped>
.interview-quiz {
  min-height: calc(100vh - 80px);
  padding: 1rem;
}

.loading-container,
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loading-bar {
  width: 200px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.loading-progress {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.interview-header {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.quiz-container {
  max-width: 900px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .interview-quiz {
    padding: 0.5rem;
  }
  
  .interview-header {
    margin-bottom: 1rem;
    padding: 1rem;
  }
  
  .interview-info h2 {
    font-size: 1.125rem;
  }
  
  .interview-actions {
    width: 100%;
  }
  
  .interview-actions button {
    width: 100%;
  }
}
</style>