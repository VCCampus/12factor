<template>
  <AppLayout :show-footer-stats="false">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-text-dark dark:text-text-light mb-4">
          🎯 模拟面试中心
        </h1>
        <p class="text-lg text-text-muted">
          选择你想挑战的岗位，测试你的专业能力
        </p>
      </div>

      <!-- Job Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="job in jobs"
          :key="job.id"
          class="neo-card job-card p-6 cursor-pointer hover-lift"
          @click="selectJob(job.id)"
        >
          <!-- Job Icon and Title -->
          <div class="text-center mb-4">
            <div class="text-5xl mb-3">{{ job.icon }}</div>
            <h3 class="text-xl font-bold text-text-dark dark:text-text-light">
              {{ job.title }}
            </h3>
          </div>
          
          <!-- Job Details -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-text-muted">📍 地点</span>
              <span class="font-medium">{{ job.location }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-text-muted">💰 薪资</span>
              <span class="font-medium">{{ job.salary }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-text-muted">🎓 经验</span>
              <span class="font-medium">{{ job.experience }}</span>
            </div>
          </div>
          
          <!-- Progress Indicator -->
          <div class="border-t pt-4">
            <div v-if="jobProgress[job.id]" class="text-center">
              <p class="text-sm text-text-muted mb-1">最佳成绩</p>
              <p class="text-2xl font-bold text-primary-blue">
                {{ jobProgress[job.id].bestScore }}分
              </p>
            </div>
            <div v-else class="text-center">
              <p class="text-sm text-text-muted">未测试</p>
              <button class="neo-btn btn-primary mt-2">
                进入挑战 →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent History -->
      <div v-if="recentHistory.length > 0" class="neo-card p-6">
        <h2 class="text-xl font-bold text-text-dark dark:text-text-light mb-4">
          📊 最近测试记录
        </h2>
        <div class="space-y-2">
          <div
            v-for="(record, index) in recentHistory"
            :key="index"
            class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ getJobIcon(record.jobType) }}</span>
              <div>
                <p class="font-medium text-text-dark dark:text-text-light">
                  {{ getJobTitle(record.jobType) }} - {{ getDifficultyLabel(record.difficulty) }}
                </p>
                <p class="text-sm text-text-muted">{{ formatTime(record.completedAt) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xl font-bold text-primary-blue">{{ record.totalScore }}分</p>
              <p class="text-sm text-text-muted">{{ record.correctCount }}/{{ record.totalQuestions }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()

interface Job {
  id: string
  title: string
  icon: string
  salary: string
  location: string
  experience: string
  description: string
}

interface JobProgress {
  bestScore: number
  attempts: number
  lastAttempt: string
}

interface TestRecord {
  jobType: string
  difficulty: string
  totalScore: number
  correctCount: number
  totalQuestions: number
  completedAt: string
}

const jobs = ref<Job[]>([])
const jobProgress = ref<Record<string, JobProgress>>({})
const recentHistory = ref<TestRecord[]>([])

// Job metadata cache
const jobMetadata = ref<Record<string, any>>({})

onMounted(async () => {
  // Load job index
  try {
    const response = await fetch('/interviews/job-index.json')
    const data = await response.json()
    
    // Convert jobs object to array
    jobs.value = Object.entries(data.jobs).map(([key, value]: [string, any]) => ({
      id: key,
      ...value
    }))
    
    jobMetadata.value = data.jobs
    
    // Load progress from localStorage
    loadProgressData()
  } catch (error) {
    console.error('Failed to load job index:', error)
  }
})

function loadProgressData() {
  // Load progress for each job
  const sessions = localStorage.getItem('interview_sessions')
  if (sessions) {
    const sessionData = JSON.parse(sessions)
    Object.keys(sessionData).forEach(key => {
      const [jobType] = key.split('_')
      if (!jobProgress.value[jobType]) {
        jobProgress.value[jobType] = {
          bestScore: 0,
          attempts: 0,
          lastAttempt: ''
        }
      }
      if (sessionData[key].bestScore > jobProgress.value[jobType].bestScore) {
        jobProgress.value[jobType].bestScore = sessionData[key].bestScore
        jobProgress.value[jobType].attempts = sessionData[key].attempts
        jobProgress.value[jobType].lastAttempt = sessionData[key].lastAttempt
      }
    })
  }
  
  // Load recent history
  const results = localStorage.getItem('interview_results')
  if (results) {
    const resultsData = JSON.parse(results)
    recentHistory.value = resultsData.slice(0, 5) // Show last 5 records
  }
}

function selectJob(jobId: string) {
  router.push(`/mock-interview/${jobId}`)
}

function getJobIcon(jobType: string): string {
  return jobMetadata.value[jobType]?.icon || '📋'
}

function getJobTitle(jobType: string): string {
  return jobMetadata.value[jobType]?.title || jobType
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    junior: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return labels[difficulty] || difficulty
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    const days = Math.floor(hours / 24)
    return `${days}天前`
  }
}
</script>

<style scoped>
.job-card {
  transition: all 0.3s ease;
  border: 3px solid var(--color-border);
  background: var(--color-surface);
}

.job-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 8px 8px 0 var(--color-primary);
}

.hover-lift {
  position: relative;
}

@media (max-width: 768px) {
  .job-card {
    margin-bottom: 1rem;
  }
}
</style>