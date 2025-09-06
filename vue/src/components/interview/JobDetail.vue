<template>
  <AppLayout :show-footer-stats="false">
    <div class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="neo-btn mb-6 inline-flex items-center gap-2"
      >
        ← 返回岗位列表
      </button>

      <!-- Job Info Card -->
      <div class="neo-card p-8 mb-8">
        <div class="flex items-start gap-6">
          <div class="text-6xl">{{ jobInfo.icon }}</div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-text-dark dark:text-text-light mb-2">
              {{ jobInfo.title }}
            </h1>
            <p class="text-text-muted mb-4">{{ jobInfo.description }}</p>
            
            <!-- Job Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="neo-tag text-center py-2">
                <span class="text-sm text-text-muted">地点</span>
                <p class="font-bold">{{ jobInfo.location }}</p>
              </div>
              <div class="neo-tag text-center py-2">
                <span class="text-sm text-text-muted">薪资</span>
                <p class="font-bold">{{ jobInfo.salary }}</p>
              </div>
              <div class="neo-tag text-center py-2">
                <span class="text-sm text-text-muted">经验</span>
                <p class="font-bold">{{ jobInfo.experience }}</p>
              </div>
            </div>
            
            <!-- Requirements -->
            <div class="border-t pt-4">
              <h3 class="font-bold text-lg mb-3 text-text-dark dark:text-text-light">
                📋 岗位要求
              </h3>
              <ul class="space-y-2">
                <li
                  v-for="(req, index) in jobInfo.requirements"
                  :key="index"
                  class="flex items-start gap-2"
                >
                  <span class="text-primary-blue mt-1">•</span>
                  <span class="text-text-muted">{{ req }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Difficulty Selection -->
      <div>
        <h2 class="text-2xl font-bold text-text-dark dark:text-text-light mb-6">
          选择挑战难度
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="difficulty in difficulties"
            :key="difficulty.id"
            class="neo-card difficulty-card p-6 cursor-pointer"
            @click="startQuiz(difficulty.id)"
          >
            <!-- Difficulty Header -->
            <div class="text-center mb-4">
              <div class="text-5xl mb-2">{{ difficulty.icon }}</div>
              <h3 class="text-xl font-bold text-text-dark dark:text-text-light">
                {{ difficulty.label }}
              </h3>
            </div>
            
            <!-- Difficulty Details -->
            <div class="space-y-3 mb-4">
              <div class="text-center">
                <p class="text-sm text-text-muted">题目数量</p>
                <p class="font-bold text-lg">25题</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-text-muted">参考时间</p>
                <p class="font-bold text-lg">{{ difficulty.timeLimit }}分钟</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-text-muted">题库总量</p>
                <p class="font-bold text-lg">{{ difficulty.questionCount }}题</p>
              </div>
            </div>
            
            <!-- History -->
            <div class="border-t pt-4">
              <div v-if="difficultyProgress[difficulty.id]" class="text-center">
                <p class="text-sm text-text-muted">最佳成绩</p>
                <p class="text-2xl font-bold text-primary-blue">
                  {{ difficultyProgress[difficulty.id].bestScore }}分
                </p>
                <p class="text-xs text-text-muted mt-1">
                  已测试 {{ difficultyProgress[difficulty.id].attempts }} 次
                </p>
              </div>
              <div v-else class="text-center">
                <p class="text-sm text-text-muted mb-2">未测试</p>
                <button class="neo-btn btn-primary w-full">
                  开始挑战
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const router = useRouter()

interface JobInfo {
  title: string
  icon: string
  salary: string
  location: string
  experience: string
  description: string
  requirements: string[]
}

interface Difficulty {
  id: string
  label: string
  icon: string
  timeLimit: number
  questionCount: number
}

interface DifficultyProgress {
  bestScore: number
  attempts: number
  lastAttempt: string
}

const jobType = ref<string>('')
const jobInfo = ref<JobInfo>({
  title: '',
  icon: '',
  salary: '',
  location: '',
  experience: '',
  description: '',
  requirements: []
})

const difficulties = ref<Difficulty[]>([])
const difficultyProgress = ref<Record<string, DifficultyProgress>>({})

onMounted(async () => {
  jobType.value = route.params.jobType as string
  
  try {
    // Load job index
    const response = await fetch('/interviews/job-index.json')
    const data = await response.json()
    
    // Get job info
    if (data.jobs[jobType.value]) {
      jobInfo.value = data.jobs[jobType.value]
    }
    
    // Get available difficulties for this job
    const jobQuestionnaires = data.questionnaires.filter(
      (q: any) => q.jobType === jobType.value
    )
    
    difficulties.value = jobQuestionnaires.map((q: any) => ({
      id: q.difficulty,
      label: data.difficulties[q.difficulty].label,
      icon: data.difficulties[q.difficulty].icon,
      timeLimit: data.difficulties[q.difficulty].timeLimit,
      questionCount: q.questionCount
    }))
    
    // Load progress
    loadProgress()
  } catch (error) {
    console.error('Failed to load job details:', error)
  }
})

function loadProgress() {
  const sessions = localStorage.getItem('interview_sessions')
  if (sessions) {
    const sessionData = JSON.parse(sessions)
    
    difficulties.value.forEach(diff => {
      const key = `${jobType.value}_${diff.id}`
      if (sessionData[key]) {
        difficultyProgress.value[diff.id] = {
          bestScore: sessionData[key].bestScore,
          attempts: sessionData[key].attempts,
          lastAttempt: sessionData[key].lastAttempt
        }
      }
    })
  }
}

function startQuiz(difficulty: string) {
  router.push(`/mock-interview/${jobType.value}/${difficulty}/quiz`)
}

function goBack() {
  router.push('/mock-interview')
}
</script>

<style scoped>
.difficulty-card {
  transition: all 0.3s ease;
  border: 3px solid var(--color-border);
  background: var(--color-surface);
}

.difficulty-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 8px 8px 0 var(--color-primary);
}
</style>