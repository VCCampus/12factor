<template>
  <div class="interview-home container mx-auto px-4 py-8">
    <!-- 招聘信息卡片 -->
    <div class="neo-card recruitment-card mb-8 p-8">
      <div class="card-header mb-6">
        <h2 class="text-3xl font-bold text-text-dark mb-2">🏢 ChainCatcher 区块链记者岗位</h2>
        <p class="text-text-muted text-lg">专业的区块链研究与资讯平台招聘</p>
      </div>
      
      <div class="job-details grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="detail-item text-center">
          <span class="neo-tag text-lg px-4 py-2">📍 深圳</span>
          <p class="detail-label mt-2 text-text-muted">工作地点</p>
        </div>
        <div class="detail-item text-center">
          <span class="neo-tag text-lg px-4 py-2">💰 2500-3600/月</span>
          <p class="detail-label mt-2 text-text-muted">薪酬范围</p>
        </div>
        <div class="detail-item text-center">
          <span class="neo-tag text-lg px-4 py-2">💼 记者·内容</span>
          <p class="detail-label mt-2 text-text-muted">岗位类型</p>
        </div>
      </div>
      
      <div class="job-requirements bg-surface-light p-6 rounded-lg">
        <h3 class="font-bold text-xl mb-4 text-text-dark">📋 岗位要求</h3>
        <ul class="space-y-3 text-text-muted">
          <li class="flex items-start">
            <span class="text-primary-blue mr-2">•</span>
            <span>热爱写作，对 Crypto 行业有强烈求知欲，保持对新鲜事物的敏感度</span>
          </li>
          <li class="flex items-start">
            <span class="text-primary-blue mr-2">•</span>
            <span>阅读过 100+ 篇商业科技、财经媒体优质文章，有独到理解</span>
          </li>
          <li class="flex items-start">
            <span class="text-primary-blue mr-2">•</span>
            <span>具备成熟的文字写作功底，能驾驭不同风格文章</span>
          </li>
          <li class="flex items-start">
            <span class="text-primary-blue mr-2">•</span>
            <span>有强烈责任心和良好团队协作意识，能高效沟通配合</span>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 难度选择 -->
    <div class="difficulty-selection">
      <h2 class="text-2xl font-bold mb-8 text-center text-text-dark">选择面试难度等级</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DifficultyCard
          v-for="difficulty in difficulties"
          :key="difficulty.id"
          :difficulty="difficulty"
          @select="startInterview"
        />
      </div>
    </div>
    
    <!-- 使用说明 -->
    <div class="neo-card instructions-card mt-8 p-6 bg-blue-50 border-blue-200">
      <h3 class="font-bold text-lg mb-4 text-blue-900">💡 面试说明</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
        <div>
          <strong>时间管理:</strong> 系统会进行软性时间提醒，不会强制结束
        </div>
        <div>
          <strong>答题方式:</strong> 仔细阅读题目，选择最合适的答案
        </div>
        <div>
          <strong>题目随机:</strong> 每次进入题目顺序都会随机排列
        </div>
        <div>
          <strong>结果分析:</strong> 完成后可查看详细分析和改进建议
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DifficultyCard from './DifficultyCard.vue'

const router = useRouter()

interface Difficulty {
  id: string
  icon: string
  title: string
  description: string
  questionCount: number
  timeLimit: string
  category: string
  color: string
}

const difficulties = ref<Difficulty[]>([])

onMounted(async () => {
  await loadDifficulties()
})

const loadDifficulties = async () => {
  try {
    const response = await fetch('/data/interview-index.json')
    const indexData = await response.json()
    
    difficulties.value = indexData.questionnaires.map((q: any) => ({
      id: q.id,
      icon: q.icon,
      title: q.title,
      description: q.description,
      questionCount: q.estimatedQuestions,
      timeLimit: `${q.timeLimit}分钟建议`,
      category: getCategoryDescription(q.category),
      color: getDifficultyColor(q.difficulty)
    }))
  } catch (error) {
    console.error('加载面试配置失败:', error)
    // 使用默认配置
    difficulties.value = [
      {
        id: 'basic',
        icon: '📝',
        title: '基础级别',
        description: '通用素质测评',
        questionCount: 100,
        timeLimit: '60分钟建议',
        category: '测评基础的文字表达和行业理解能力',
        color: 'green'
      },
      {
        id: 'advanced',
        icon: '🔍',
        title: '进阶级别',
        description: '深度研究能力',
        questionCount: 100,
        timeLimit: '90分钟建议',
        category: '考察深度分析和研究能力',
        color: 'blue'
      },
      {
        id: 'expert',
        icon: '⚡',
        title: '专家级别',
        description: '新闻实战技能',
        questionCount: 100,
        timeLimit: '120分钟建议',
        category: '实战新闻写作和策划能力',
        color: 'red'
      }
    ]
  }
}

const getCategoryDescription = (category: string) => {
  const descriptions = {
    general: '测评基础的文字表达和行业理解能力',
    research: '考察深度分析和研究能力',
    practical: '实战新闻写作和策划能力'
  }
  return descriptions[category as keyof typeof descriptions] || category
}

const getDifficultyColor = (difficulty: string) => {
  const colors = {
    basic: 'green',
    advanced: 'blue',
    expert: 'red'
  }
  return colors[difficulty as keyof typeof colors] || 'gray'
}

const startInterview = (difficulty: Difficulty) => {
  router.push(`/mock-interview/${difficulty.id}`)
}
</script>

<style scoped>
.recruitment-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 3px solid #1e293b;
}

.job-details .detail-item {
  transition: transform 0.2s ease;
}

.job-details .detail-item:hover {
  transform: translateY(-2px);
}

.instructions-card {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 2px solid #3b82f6;
}

.difficulty-selection {
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .interview-home {
    padding: 1rem;
  }
  
  .recruitment-card {
    padding: 1.5rem;
  }
  
  .job-details {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>