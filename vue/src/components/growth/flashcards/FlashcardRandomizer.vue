<template>
  <view class="flashcard-randomizer">
    <!-- 进度指示器 -->
    <view class="progress-indicator">
      <view class="progress-dots">
        <view 
          v-for="(_, index) in sessionCards" 
          :key="index"
          class="dot"
          :class="{ active: index === currentIndex, completed: index < currentIndex }"
        ></view>
      </view>
      <text class="progress-text">{{ currentIndex + 1 }}/{{ sessionCards.length }}</text>
    </view>

    <!-- 闪卡主体 -->
    <view class="flashcard-container" v-if="currentCard">
      <view 
        class="flashcard"
        :class="{ flipped: isFlipped }"
        @tap="handleCardFlip"
      >
        <!-- 正面（问题） -->
        <view class="card-face card-front" v-show="!isFlipped">
          <view class="card-header">
            <text class="principle-tag">【{{ currentCard.principle }}】</text>
            <text class="difficulty-tag">{{ currentCard.difficulty }}</text>
          </view>
          <view class="card-content">
            <text class="question-text">{{ currentCard.question }}</text>
          </view>
          <view class="card-footer">
            <text class="flip-hint">点击翻转查看答案</text>
          </view>
        </view>

        <!-- 背面（答案） -->
        <view class="card-face card-back" v-show="isFlipped">
          <view class="card-header">
            <text class="principle-tag">【{{ currentCard.principle }}】</text>
            <text class="type-tag">{{ currentCard.type }}</text>
          </view>
          <view class="card-content">
            <text class="answer-text">{{ currentCard.answer }}</text>
          </view>
          <view class="card-footer">
            <text class="flip-hint">点击翻转回到问题</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 控制按钮 -->
    <view class="card-controls">
      <view class="control-btn" @tap="previousCard" :class="{ disabled: currentIndex === 0 }">
        <text class="btn-text">上一张</text>
      </view>
      <view class="control-btn primary" @tap="nextCard" :class="{ disabled: currentIndex >= sessionCards.length - 1 }">
        <text class="btn-text">下一张</text>
      </view>
    </view>

    <!-- 重新开始按钮 -->
    <view class="restart-section" v-if="currentIndex >= sessionCards.length - 1">
      <view class="control-btn restart" @tap="restartSession">
        <text class="btn-text">重新开始</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGrowthStore } from '@/stores/growthStore'

interface FlashCard {
  id: string
  principle: string
  difficulty: string
  type: string
  question: string
  answer: string
  tags: string[]
}

const growthStore = useGrowthStore()

const currentIndex = ref(0)
const isFlipped = ref(false)
const sessionCards = ref<FlashCard[]>([])

const currentCard = computed(() => sessionCards.value[currentIndex.value] || null)

// 从120张卡片中随机抽取12张（每个原则1张）
const generateRandomSession = () => {
  const allCards = growthStore.flashcards.allCards
  if (!allCards.length) return []

  // 按原则分组
  const principleGroups: Record<string, FlashCard[]> = {}
  allCards.forEach(card => {
    if (!principleGroups[card.principle]) {
      principleGroups[card.principle] = []
    }
    principleGroups[card.principle].push(card)
  })

  // 每个原则随机选1张
  const randomCards: FlashCard[] = []
  Object.values(principleGroups).forEach(cards => {
    if (cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * cards.length)
      randomCards.push(cards[randomIndex])
    }
  })

  // 打乱顺序
  return shuffleArray(randomCards)
}

// 数组打乱算法
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const handleCardFlip = () => {
  isFlipped.value = !isFlipped.value
}

const nextCard = () => {
  if (currentIndex.value < sessionCards.value.length - 1) {
    currentIndex.value++
    isFlipped.value = false
  }
}

const previousCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    isFlipped.value = false
  }
}

const restartSession = () => {
  currentIndex.value = 0
  isFlipped.value = false
  sessionCards.value = generateRandomSession()
  
  // 保存练习记录
  saveSessionRecord()
}

const saveSessionRecord = () => {
  const sessionData = {
    timestamp: new Date().toISOString(),
    totalCards: sessionCards.value.length,
    cards: sessionCards.value.map(card => ({
      id: card.id,
      principle: card.principle,
      difficulty: card.difficulty
    }))
  }
  
  // 使用store保存到localStorage
  growthStore.saveFlashcardSession(sessionData)
}

onMounted(async () => {
  await growthStore.loadFlashcards()
  sessionCards.value = generateRandomSession()
})
</script>

<style scoped>
.flashcard-randomizer {
  @apply flex flex-col min-h-screen bg-gray-50 p-4;
  @apply dark:bg-gray-900;
}

.progress-indicator {
  @apply flex flex-col items-center mb-6;
}

.progress-dots {
  @apply flex gap-2 mb-2;
}

.dot {
  @apply w-3 h-3 rounded-full bg-gray-300;
  @apply dark:bg-gray-600;
}

.dot.active {
  @apply bg-blue-500 scale-125;
}

.dot.completed {
  @apply bg-green-500;
}

.progress-text {
  @apply text-sm text-gray-600;
  @apply dark:text-gray-400;
}

.flashcard-container {
  @apply flex-1 flex items-center justify-center mb-6;
}

.flashcard {
  @apply w-full max-w-sm bg-white rounded-xl shadow-lg;
  @apply min-h-[300px] cursor-pointer;
  @apply dark:bg-gray-800;
  @apply md:max-w-md md:min-h-[350px];
}

.card-face {
  @apply p-6 h-full flex flex-col;
}

.card-header {
  @apply flex justify-between items-center mb-4;
}

.principle-tag {
  @apply text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded;
  @apply dark:text-blue-400 dark:bg-blue-900;
}

.difficulty-tag, .type-tag {
  @apply text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded;
  @apply dark:text-gray-400 dark:bg-gray-700;
}

.card-content {
  @apply flex-1 flex items-center justify-center;
}

.question-text, .answer-text {
  @apply text-center text-gray-900 leading-relaxed;
  @apply dark:text-white;
}

.question-text {
  @apply text-lg font-medium;
  @apply md:text-xl;
}

.answer-text {
  @apply text-base;
  @apply md:text-lg;
}

.card-footer {
  @apply text-center;
}

.flip-hint {
  @apply text-xs text-gray-500;
  @apply dark:text-gray-400;
}

.card-controls {
  @apply flex gap-4 justify-center mb-4;
}

.control-btn {
  @apply px-6 py-3 bg-gray-200 rounded-lg font-medium;
  @apply min-h-[44px] flex items-center justify-center;
  @apply transition-colors duration-200;
  @apply dark:bg-gray-700;
}

.control-btn:not(.disabled) {
  @apply cursor-pointer hover:bg-gray-300 active:bg-gray-400;
  @apply dark:hover:bg-gray-600 dark:active:bg-gray-500;
}

.control-btn.primary {
  @apply bg-blue-500 text-white;
  @apply hover:bg-blue-600 active:bg-blue-700;
}

.control-btn.restart {
  @apply bg-green-500 text-white;
  @apply hover:bg-green-600 active:bg-green-700;
}

.control-btn.disabled {
  @apply opacity-50 cursor-not-allowed;
}

.btn-text {
  @apply text-sm;
  @apply md:text-base;
}

.restart-section {
  @apply flex justify-center;
}
</style>