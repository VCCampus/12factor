<template>
  <div class="flashcard-container">
    <div 
      :class="[
        'flashcard neo-card',
        { 'flipped': isFlipped },
        { 'correct': showResult && isCorrect },
        { 'incorrect': showResult && !isCorrect }
      ]"
      @click="flipCard"
    >
      <!-- 正面 (问题) -->
      <div class="flashcard-face flashcard-front">
        <div class="flashcard-header">
          <div class="principle-info">
            <span class="stage-badge" :class="`stage-${principle.stage.toLowerCase()}`">
              {{ principle.stage }}
            </span>
            <span class="principle-name">{{ principle.name }}</span>
          </div>
          <div class="card-number">
            {{ currentIndex + 1 }} / {{ totalCards }}
          </div>
        </div>
        
        <div class="flashcard-content">
          <div class="question-icon">❓</div>
          <h3 class="question-text">{{ flashcard.front }}</h3>
          <p class="hint-text">点击查看答案</p>
        </div>
        
        <div class="progress-indicator">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${((currentIndex + 1) / totalCards) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 背面 (答案) -->
      <div class="flashcard-face flashcard-back">
        <div class="flashcard-header">
          <div class="principle-info">
            <span class="stage-badge" :class="`stage-${principle.stage.toLowerCase()}`">
              {{ principle.stage }}
            </span>
            <span class="principle-name">{{ principle.name }}</span>
          </div>
          <div class="card-number">
            {{ currentIndex + 1 }} / {{ totalCards }}
          </div>
        </div>
        
        <div class="flashcard-content">
          <div class="answer-icon">💡</div>
          <h3 class="answer-text">{{ flashcard.back }}</h3>
          
          <div class="action-buttons" v-if="isFlipped && !showResult">
            <button 
              @click.stop="markDifficulty('hard')" 
              class="difficulty-btn btn-hard"
            >
              😰 困难
            </button>
            <button 
              @click.stop="markDifficulty('medium')" 
              class="difficulty-btn btn-medium"
            >
              🤔 一般
            </button>
            <button 
              @click.stop="markDifficulty('easy')" 
              class="difficulty-btn btn-easy"
            >
              😊 简单
            </button>
          </div>
        </div>
        
        <div class="progress-indicator">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${((currentIndex + 1) / totalCards) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="flashcard-stats">
      <div class="stat-item">
        <div class="stat-value">{{ reviewCount }}</div>
        <div class="stat-label">已复习</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ masteryLevel }}%</div>
        <div class="stat-label">掌握度</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ nextReviewIn }}</div>
        <div class="stat-label">下次复习</div>
      </div>
    </div>

    <!-- 导航控制 -->
    <div class="flashcard-controls">
      <button 
        @click="$emit('previous')" 
        :disabled="currentIndex === 0"
        class="control-btn"
      >
        ⬅️ 上一张
      </button>
      <button 
        @click="resetCard" 
        class="control-btn"
      >
        🔄 重置
      </button>
      <button 
        @click="$emit('next')" 
        :disabled="currentIndex === totalCards - 1"
        class="control-btn"
      >
        下一张 ➡️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Principle } from '@/stores/config'

interface Props {
  principle: Principle
  currentIndex: number
  totalCards: number
}

interface Emits {
  (e: 'difficulty', difficulty: 'easy' | 'medium' | 'hard'): void
  (e: 'next'): void
  (e: 'previous'): void
  (e: 'flip'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isFlipped = ref(false)
const showResult = ref(false)
const isCorrect = ref(false)

const flashcard = computed(() => props.principle.flashcard)

// 简化的间隔重复算法统计
const reviewCount = ref(Math.floor(Math.random() * 5) + 1) // 模拟数据
const masteryLevel = ref(Math.floor(Math.random() * 100)) // 模拟掌握度
const nextReviewIn = ref(calculateNextReview())

function calculateNextReview(): string {
  const days = Math.floor(Math.random() * 7) + 1
  if (days === 1) return '1天后'
  return `${days}天后`
}

function flipCard() {
  if (!showResult) {
    isFlipped.value = !isFlipped.value
    emit('flip')
  }
}

function markDifficulty(difficulty: 'easy' | 'medium' | 'hard') {
  showResult.value = true
  
  // 根据难度调整掌握度 (简化算法)
  if (difficulty === 'easy') {
    masteryLevel.value = Math.min(100, masteryLevel.value + 15)
    isCorrect.value = true
  } else if (difficulty === 'medium') {
    masteryLevel.value = Math.min(100, masteryLevel.value + 8)
    isCorrect.value = true
  } else {
    masteryLevel.value = Math.max(0, masteryLevel.value - 5)
    isCorrect.value = false
  }
  
  reviewCount.value++
  nextReviewIn.value = calculateNextReview()
  
  emit('difficulty', difficulty)
  
  // 2秒后自动进入下一张
  setTimeout(() => {
    if (props.currentIndex < props.totalCards - 1) {
      emit('next')
    }
  }, 2000)
}

function resetCard() {
  isFlipped.value = false
  showResult.value = false
  isCorrect.value = false
}

// 监听卡片变化，重置状态
watch(() => props.currentIndex, () => {
  resetCard()
})
</script>

<style scoped>
.flashcard-container {
  max-width: 600px;
  margin: 0 auto;
  perspective: 1000px;
}

.flashcard {
  position: relative;
  width: 100%;
  height: 400px;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  cursor: pointer;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.flashcard.flipped {
  transform: rotateY(180deg);
}

.flashcard.correct {
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3);
  border: 2px solid #22c55e;
}

.flashcard.incorrect {
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
  border: 2px solid #ef4444;
}

.flashcard-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
}

.flashcard-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.flashcard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.principle-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stage-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.stage-prepare { background: #dbeafe; color: #1e40af; }
.stage-execute { background: #dcfce7; color: #166534; }
.stage-collaborate { background: #fef3c7; color: #92400e; }
.stage-iterate { background: #fce7f3; color: #be185d; }

.principle-name {
  font-weight: 600;
  color: #334155;
  font-size: 14px;
}

.card-number {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.flashcard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.question-icon, .answer-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.question-text, .answer-text {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.6;
  margin-bottom: 16px;
}

.hint-text {
  font-size: 14px;
  color: #64748b;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.difficulty-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.btn-hard { background: #fee2e2; color: #dc2626; }
.btn-hard:hover { background: #fecaca; transform: translateY(-1px); }

.btn-medium { background: #fef3c7; color: #d97706; }
.btn-medium:hover { background: #fde68a; transform: translateY(-1px); }

.btn-easy { background: #dcfce7; color: #16a34a; }
.btn-easy:hover { background: #bbf7d0; transform: translateY(-1px); }

.progress-indicator {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  transition: width 0.3s ease;
}

.flashcard-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 20px 0;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.flashcard-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.control-btn {
  padding: 10px 20px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-1px);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .flashcard-container {
    margin: 0 16px;
  }
  
  .flashcard {
    height: 350px;
  }
  
  .flashcard-face {
    padding: 20px;
  }
  
  .question-text, .answer-text {
    font-size: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .difficulty-btn {
    width: 100%;
  }
  
  .flashcard-stats {
    gap: 20px;
  }
}
</style>