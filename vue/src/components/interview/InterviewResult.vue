<template>
  <AppLayout :show-footer-stats="false">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Result Header -->
      <div class="neo-card p-8 mb-6 text-center">
        <h1 class="text-4xl font-bold mb-4 text-text-dark dark:text-text-light">
          🎉 测试完成！
        </h1>
        
        <!-- Score Display -->
        <div class="mb-6">
          <p class="text-xl mb-2 text-text-muted">
            {{ jobTitle }} - {{ difficultyLabel }}
          </p>
          <div class="text-6xl font-bold mb-2" :class="scoreColorClass">
            {{ result.totalScore }}
          </div>
          <p class="text-lg text-text-muted">总分：100分</p>
        </div>
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="neo-tag py-3">
            <p class="text-sm text-text-muted">正确率</p>
            <p class="text-xl font-bold">{{ result.correctCount }}/{{ result.totalQuestions }}</p>
          </div>
          <div class="neo-tag py-3">
            <p class="text-sm text-text-muted">用时</p>
            <p class="text-xl font-bold">{{ result.timeSpent }}分钟</p>
          </div>
          <div class="neo-tag py-3">
            <p class="text-sm text-text-muted">等级</p>
            <p class="text-xl font-bold">{{ scoreLevel }}</p>
          </div>
        </div>
      </div>

      <!-- Category Analysis -->
      <div class="neo-card p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4 text-text-dark dark:text-text-light">
          📊 能力分析
        </h2>
        <div class="space-y-4">
          <div
            v-for="(score, category) in result.categoryScores"
            :key="category"
            class="category-item"
          >
            <div class="flex justify-between mb-2">
              <span class="text-text-dark dark:text-text-light font-medium">{{ category }}</span>
              <span class="text-text-muted">{{ score.correct }}/{{ score.total }}</span>
            </div>
            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                class="h-3 rounded-full transition-all duration-500"
                :class="getScoreBarColor(score.correct, score.total)"
                :style="`width: ${(score.correct / score.total) * 100}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning Suggestions -->
      <div class="neo-card p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4 text-text-dark dark:text-text-light">
          💡 学习建议
        </h2>
        <div class="space-y-3">
          <p class="text-text-muted">{{ learningSuggestion }}</p>
          <div v-if="weakCategories.length > 0" class="mt-4">
            <p class="font-medium text-text-dark dark:text-text-light mb-2">重点加强领域：</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="cat in weakCategories"
                :key="cat"
                class="neo-tag text-sm px-3 py-1"
              >
                {{ cat }}
              </span>
            </div>
          </div>
          <router-link to="/principles" class="neo-btn btn-primary inline-block mt-4">
            前往原则学习 →
          </router-link>
        </div>
      </div>

      <!-- Share Card -->
      <div class="neo-card p-6 mb-6 bg-blue-50 dark:bg-blue-900">
        <h3 class="text-xl font-bold mb-3 text-text-dark dark:text-text-light">
          💬 分享你的成绩
        </h3>
        <p class="text-text-muted mb-4">
          我在{{ jobTitle }}{{ difficultyLabel }}测试中获得{{ result.totalScore }}分！你也来试试？
        </p>
        <div class="flex gap-3">
          <button @click="shareResult" class="neo-btn btn-primary">
            分享成绩
          </button>
          <button @click="copyShareText" class="neo-btn">
            复制文本
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-4 justify-center">
        <button
          @click="viewWrongAnswers"
          v-if="result.wrongQuestions && result.wrongQuestions.length > 0"
          class="neo-btn btn-warning"
        >
          查看错题解析 ({{ result.wrongQuestions.length }}题)
        </button>
        <button @click="retakeQuiz" class="neo-btn btn-primary">
          重新测试
        </button>
        <button @click="tryOtherDifficulty" class="neo-btn">
          挑战其他难度
        </button>
        <router-link to="/mock-interview" class="neo-btn">
          返回首页
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const router = useRouter()

const result = ref<any>({
  totalScore: 0,
  correctCount: 0,
  totalQuestions: 25,
  timeSpent: 0,
  categoryScores: {},
  wrongQuestions: []
})

const jobTitle = ref('')
const difficultyLabel = ref('')

const scoreColorClass = computed(() => {
  const score = result.value.totalScore
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
})

const scoreLevel = computed(() => {
  const score = result.value.totalScore
  if (score >= 90) return '🏆 优秀'
  if (score >= 70) return '🎯 良好'
  if (score >= 60) return '📚 及格'
  return '💪 加油'
})

const learningSuggestion = computed(() => {
  const score = result.value.totalScore
  if (score >= 90) return '表现优秀！建议挑战更高难度，进一步提升专业能力。'
  if (score >= 70) return '表现良好！查看错题解析，巩固薄弱知识点。'
  if (score >= 60) return '基础扎实！建议重点学习错题涉及的知识领域。'
  return '继续努力！建议系统学习相关基础知识，打牢根基。'
})

const weakCategories = computed(() => {
  const weak: string[] = []
  Object.entries(result.value.categoryScores).forEach(([category, score]: [string, any]) => {
    const percentage = (score.correct / score.total) * 100
    if (percentage < 60) {
      weak.push(category)
    }
  })
  return weak
})

onMounted(async () => {
  // Try to load result from sessionStorage first
  const sessionResult = sessionStorage.getItem('current_interview_result')
  if (sessionResult) {
    result.value = JSON.parse(sessionResult)
  } else {
    // Try to load from localStorage by sessionId
    const sessionId = route.query.sessionId as string
    if (sessionId) {
      const results = JSON.parse(localStorage.getItem('interview_results') || '[]')
      const found = results.find((r: any) => r.sessionId === sessionId)
      if (found) {
        result.value = found
      }
    }
  }
  
  // Load job metadata
  try {
    const response = await fetch('/interviews/job-index.json')
    const data = await response.json()
    
    jobTitle.value = data.jobs[result.value.jobType]?.title || result.value.jobType
    difficultyLabel.value = data.difficulties[result.value.difficulty]?.label || result.value.difficulty
  } catch (error) {
    console.error('Failed to load job metadata:', error)
  }
})

function getScoreBarColor(correct: number, total: number): string {
  const percentage = (correct / total) * 100
  if (percentage >= 80) return 'bg-green-500'
  if (percentage >= 60) return 'bg-blue-500'
  if (percentage >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

function viewWrongAnswers() {
  router.push({
    path: `/mock-interview/${result.value.jobType}/${result.value.difficulty}/review`,
    query: { sessionId: result.value.sessionId }
  })
}

function retakeQuiz() {
  router.push(`/mock-interview/${result.value.jobType}/${result.value.difficulty}/quiz`)
}

function tryOtherDifficulty() {
  router.push(`/mock-interview/${result.value.jobType}`)
}

async function shareResult() {
  const shareText = `我在${jobTitle.value}${difficultyLabel.value}测试中获得${result.value.totalScore}分！你也来试试？`
  const shareUrl = 'http://web3mh.101.so:11181/mock-interview'
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: '模拟面试成绩',
        text: shareText,
        url: shareUrl
      })
    } catch (err) {
      console.log('Share failed:', err)
    }
  } else {
    // Fallback to copy
    copyShareText()
  }
}

function copyShareText() {
  const shareText = `我在${jobTitle.value}${difficultyLabel.value}测试中获得${result.value.totalScore}分！你也来试试？ http://web3mh.101.so:11181/mock-interview`
  navigator.clipboard.writeText(shareText)
  alert('分享文本已复制到剪贴板')
}
</script>

<style scoped>
.category-item {
  padding: 0.75rem 0;
}
</style>