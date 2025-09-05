<template>
  <div class="flashcards-content">
    <!-- 学习模式选择 -->
    <div class="mode-selector mb-8">
      <div class="flex justify-center gap-4">
        <button 
          @click="setMode('review')" 
          :class="['mode-btn', { active: currentMode === 'review' }]"
        >
          📚 复习模式
        </button>
        <button 
          @click="setMode('learn')" 
          :class="['mode-btn', { active: currentMode === 'learn' }]"
        >
          🎯 学习模式
        </button>
        <button 
          @click="setMode('challenge')" 
          :class="['mode-btn', { active: currentMode === 'challenge' }]"
        >
          🏆 挑战模式
        </button>
      </div>
    </div>

    <!-- 学习统计 -->
    <div class="stats-overview mb-8" v-if="configStore.isInitialized">
      <div class="flex justify-center gap-8">
        <div class="stat-card">
          <div class="stat-number">{{ filteredPrinciples.length }}</div>
          <div class="stat-label">待学习卡片</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ sessionStats.completed }}</div>
          <div class="stat-label">本次完成</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ Math.round(sessionStats.averageScore) }}%</div>
          <div class="stat-label">平均得分</div>
        </div>
      </div>
    </div>

    <!-- 闪卡区域 -->
    <div v-if="currentPrinciple" class="flashcard-container">
      <div class="flashcard" :class="{ flipped: isFlipped }" @click="flipCard">
        <div class="card-face card-front">
          <div class="card-content">
            <div class="card-header">
              <span class="card-module">{{ currentPrinciple.module }}</span>
              <span class="card-index">{{ currentIndex + 1 }}/{{ filteredPrinciples.length }}</span>
            </div>
            <h3 class="card-title">{{ currentPrinciple.title }}</h3>
            <p class="card-hint">点击查看详情</p>
          </div>
        </div>
        
        <div class="card-face card-back">
          <div class="card-content">
            <h4 class="text-lg font-bold mb-3">{{ currentPrinciple.title }}</h4>
            <p class="text-gray-700 mb-4">{{ currentPrinciple.description }}</p>
            
            <div v-if="currentPrinciple.details" class="space-y-2">
              <div v-for="(detail, idx) in currentPrinciple.details" :key="idx" class="text-sm">
                • {{ detail }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="control-buttons mt-6">
        <button @click="previousCard" :disabled="currentIndex === 0" class="neo-btn">
          ⬅️ 上一张
        </button>
        
        <div class="difficulty-buttons">
          <button @click="markDifficulty('easy')" class="diff-btn easy">
            😊 简单
          </button>
          <button @click="markDifficulty('medium')" class="diff-btn medium">
            🤔 中等
          </button>
          <button @click="markDifficulty('hard')" class="diff-btn hard">
            😰 困难
          </button>
        </div>
        
        <button @click="nextCard" :disabled="currentIndex >= filteredPrinciples.length - 1" class="neo-btn">
          下一张 ➡️
        </button>
      </div>
    </div>

    <!-- 完成提示 -->
    <div v-else-if="sessionStats.completed > 0" class="completion-message">
      <div class="neo-card p-8 text-center">
        <h3 class="text-2xl font-bold mb-4">🎉 练习完成！</h3>
        <p class="text-gray-600 mb-6">
          你已完成 {{ sessionStats.completed }} 张闪卡的学习
        </p>
        <div class="flex justify-center gap-4">
          <button @click="resetSession" class="neo-btn">
            重新开始
          </button>
          <button @click="$emit('goToQuiz')" class="neo-btn neo-btn-primary">
            挑战测试
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="neo-card p-8 text-center">
        <p class="text-gray-600">暂无可用的闪卡</p>
        <button @click="$emit('goToStudy')" class="neo-btn mt-4">
          返回原则学习
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

const currentMode = ref('review')
const currentIndex = ref(0)
const isFlipped = ref(false)
const sessionStats = ref({
  completed: 0,
  averageScore: 0,
  scores: [] as number[]
})

defineEmits<{
  goToStudy: []
  goToQuiz: []
}>()

// 过滤后的原则列表
const filteredPrinciples = computed(() => {
  // 获取所有模块的原则
  const allPrinciples: any[] = []
  const modules = configStore.modules || []
  
  modules.forEach((module: any) => {
    const principles = configStore.getPrinciplesByModule(module.id) || []
    allPrinciples.push(...principles)
  })
  
  // 根据模式过滤
  if (currentMode.value === 'review') {
    return allPrinciples.filter((p: any) => p.reviewNeeded)
  }
  if (currentMode.value === 'challenge') {
    return allPrinciples.filter((p: any) => p.difficulty === 'hard')
  }
  return allPrinciples
})

// 当前原则
const currentPrinciple = computed(() => {
  return filteredPrinciples.value[currentIndex.value]
})

// 设置模式
const setMode = (mode: string) => {
  currentMode.value = mode
  currentIndex.value = 0
  isFlipped.value = false
}

// 翻转卡片
const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

// 上一张卡片
const previousCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    isFlipped.value = false
  }
}

// 下一张卡片
const nextCard = () => {
  if (currentIndex.value < filteredPrinciples.value.length - 1) {
    currentIndex.value++
    isFlipped.value = false
    sessionStats.value.completed++
  }
}

// 标记难度
const markDifficulty = (difficulty: string) => {
  const score = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 70 : 40
  sessionStats.value.scores.push(score)
  sessionStats.value.averageScore = 
    sessionStats.value.scores.reduce((a, b) => a + b, 0) / sessionStats.value.scores.length
  
  nextCard()
}

// 重置会话
const resetSession = () => {
  currentIndex.value = 0
  isFlipped.value = false
  sessionStats.value = {
    completed: 0,
    averageScore: 0,
    scores: []
  }
}

// 初始化
onMounted(async () => {
  if (!configStore.isInitialized) {
    await configStore.loadConfig()
  }
})
</script>

<style scoped>
/* 模式选择按钮 */
.mode-btn {
  @apply px-4 py-2 font-bold bg-white border-2 border-black;
  box-shadow: 2px 2px 0px theme('colors.border-black');
}

.mode-btn.active {
  @apply bg-primary-blue text-white;
}

/* 统计卡片 */
.stat-card {
  @apply neo-card p-4 text-center;
}

.stat-number {
  @apply text-2xl font-bold text-primary-blue;
}

.stat-label {
  @apply text-sm text-gray-600;
}

/* 闪卡容器 */
.flashcard-container {
  @apply max-w-2xl mx-auto;
}

.flashcard {
  @apply relative w-full h-96 cursor-pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flashcard.flipped {
  transform: rotateY(180deg);
}

.card-face {
  @apply absolute w-full h-full bg-white border-4 border-black;
  box-shadow: 4px 4px 0px theme('colors.border-black');
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.card-content {
  @apply p-8 h-full flex flex-col justify-center;
}

.card-header {
  @apply flex justify-between mb-4 text-sm text-gray-600;
}

.card-title {
  @apply text-2xl font-bold text-center mb-4;
}

.card-hint {
  @apply text-center text-gray-500 text-sm mt-4;
}

/* 控制按钮 */
.control-buttons {
  @apply flex justify-between items-center;
}

.difficulty-buttons {
  @apply flex gap-2;
}

.diff-btn {
  @apply px-3 py-2 text-sm font-bold border-2 border-black;
  box-shadow: 2px 2px 0px theme('colors.border-black');
}

.diff-btn.easy {
  @apply bg-green-100 hover:bg-green-200;
}

.diff-btn.medium {
  @apply bg-yellow-100 hover:bg-yellow-200;
}

.diff-btn.hard {
  @apply bg-red-100 hover:bg-red-200;
}
</style>