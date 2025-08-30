<template>
  <div 
    class="neo-card difficulty-card cursor-pointer transform transition-all duration-300 hover:neo-hover-lift hover:shadow-lg"
    :class="[`difficulty-${difficulty.color}`, { 'hover-ready': !isSelected }]"
    @click="handleSelect"
  >
    <div class="card-content text-center">
      <!-- 图标和标题 -->
      <div class="icon-section mb-6">
        <div class="icon text-6xl mb-4">{{ difficulty.icon }}</div>
        <h3 class="text-2xl font-bold mb-2 text-text-dark">{{ difficulty.title }}</h3>
        <p class="text-text-muted text-lg">{{ difficulty.description }}</p>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-section space-y-3 mb-6">
        <div class="stat-item bg-surface-light p-3 rounded-lg">
          <div class="stat-label text-sm text-text-muted">题目数量</div>
          <div class="stat-value text-xl font-bold text-text-dark">{{ difficulty.questionCount }}道</div>
        </div>
        <div class="stat-item bg-surface-light p-3 rounded-lg">
          <div class="stat-label text-sm text-text-muted">建议时长</div>
          <div class="stat-value text-lg font-semibold text-text-dark">{{ difficulty.timeLimit }}</div>
        </div>
      </div>
      
      <!-- 能力说明 -->
      <div class="category-section mb-6">
        <div class="category-badge p-4 rounded-lg text-sm font-medium"
             :class="getCategoryBadgeClass(difficulty.color)">
          {{ difficulty.category }}
        </div>
      </div>
      
      <!-- 开始按钮 -->
      <button 
        class="start-button w-full py-4 px-6 font-bold text-white rounded-lg transition-all duration-200 transform hover:scale-105"
        :class="getButtonClass(difficulty.color)"
      >
        开始{{ difficulty.title }} →
      </button>
      
      <!-- 难度指示器 -->
      <div class="difficulty-indicator mt-4">
        <div class="flex justify-center space-x-1">
          <div 
            v-for="i in 3" 
            :key="i"
            class="indicator-dot w-3 h-3 rounded-full"
            :class="i <= getDifficultyLevel(difficulty.id) ? getActiveDotClass(difficulty.color) : 'bg-gray-300'"
          />
        </div>
        <div class="text-xs text-text-muted mt-2">
          难度等级: {{ getDifficultyLevel(difficulty.id) }}/3
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

const props = defineProps<{
  difficulty: Difficulty
}>()

const emit = defineEmits<{
  select: [difficulty: Difficulty]
}>()

const isSelected = ref(false)

const handleSelect = () => {
  isSelected.value = true
  setTimeout(() => {
    emit('select', props.difficulty)
  }, 200)
}

const getCategoryBadgeClass = (color: string) => {
  const classes = {
    green: 'bg-green-100 text-green-800 border-green-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    red: 'bg-red-100 text-red-800 border-red-300'
  }
  return `border-2 ${classes[color as keyof typeof classes] || classes.green}`
}

const getButtonClass = (color: string) => {
  const classes = {
    green: 'bg-green-600 hover:bg-green-700',
    blue: 'bg-blue-600 hover:bg-blue-700', 
    red: 'bg-red-600 hover:bg-red-700'
  }
  return classes[color as keyof typeof classes] || classes.green
}

const getActiveDotClass = (color: string) => {
  const classes = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500'
  }
  return classes[color as keyof typeof classes] || classes.green
}

const getDifficultyLevel = (id: string) => {
  const levels = {
    basic: 1,
    advanced: 2,
    expert: 3
  }
  return levels[id as keyof typeof levels] || 1
}

</script>

<style scoped>
.difficulty-card {
  padding: 2rem;
  background: white;
  border: 3px solid #e2e8f0;
  min-height: 500px;
  display: flex;
  align-items: center;
}

.difficulty-card.hover-ready:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.difficulty-green {
  border-color: #22c55e;
}

.difficulty-blue {
  border-color: #3b82f6;
}

.difficulty-red {
  border-color: #ef4444;
}

.card-content {
  width: 100%;
}

.icon-section .icon {
  line-height: 1;
}

.stat-item {
  transition: all 0.2s ease;
}

.stat-item:hover {
  transform: scale(1.02);
  background: #f1f5f9;
}

.category-badge {
  transition: all 0.2s ease;
}

.start-button {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.start-button:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.difficulty-indicator {
  opacity: 0.8;
}

.indicator-dot {
  transition: all 0.2s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .difficulty-card {
    padding: 1.5rem;
    min-height: 400px;
  }
  
  .icon-section .icon {
    font-size: 3rem;
  }
  
  .stats-section {
    margin-bottom: 1rem;
  }
  
  .start-button {
    padding: 1rem 1.5rem;
  }
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.difficulty-card:hover .icon {
  animation: pulse 2s infinite;
}
</style>