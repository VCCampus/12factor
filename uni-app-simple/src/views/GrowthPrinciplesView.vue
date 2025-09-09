<template>
  <div class="principles-page">
    <div class="neo-card neo-card--primary">
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2">个人成长12原则</h1>
        <p class="text-lg mb-4">Personal Growth 12 Principles</p>
        <div class="status-indicator status-indicator--success">
          ✅ uni-app 架构下的成长学习系统
        </div>
      </div>
    </div>

    <div class="principles-grid">
      <div 
        v-for="principle in mockPrinciples" 
        :key="principle.id"
        class="neo-card"
        :class="getPrincipleCardClass(principle.progress)"
      >
        <div class="principle-content">
          <div class="principle-icon">{{ principle.icon }}</div>
          <h3 class="principle-title">{{ principle.title }}</h3>
          <p class="principle-description">{{ principle.description }}</p>
          
          <div class="progress-section">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: principle.progress + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ principle.progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="actions-section">
      <div class="neo-grid neo-grid--2">
        <router-link to="/flashcards" class="neo-button neo-button--accent neo-button--large neo-button--block">
          🎯 开始闪卡练习
        </router-link>
        <router-link to="/quiz" class="neo-button neo-button--success neo-button--large neo-button--block">
          🏆 参加知识测试
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const mockPrinciples = ref([
  {
    id: '1',
    title: '自我认知',
    description: '深入了解自己的优势和不足',
    icon: '🧠',
    progress: 85
  },
  {
    id: '2', 
    title: '目标设定',
    description: '设置明确可行的成长目标',
    icon: '🎯',
    progress: 70
  },
  {
    id: '3',
    title: '持续学习',
    description: '保持学习热情和求知欲',
    icon: '📚',
    progress: 90
  },
  {
    id: '4',
    title: '时间管理',
    description: '有效规划和利用时间资源',
    icon: '⏰',
    progress: 60
  },
  {
    id: '5',
    title: '情绪管理',
    description: '掌控情绪，保持内心平衡',
    icon: '😌',
    progress: 45
  },
  {
    id: '6',
    title: '人际关系',
    description: '建立和维护良好的人际网络',
    icon: '🤝',
    progress: 75
  }
])

const getPrincipleCardClass = (progress: number) => {
  if (progress >= 80) return 'neo-card--success'
  if (progress >= 60) return 'neo-card--accent'
  if (progress >= 40) return 'neo-card--secondary'
  return ''
}
</script>

<style scoped>
.principles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.principle-content {
  text-align: center;
}

.principle-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.principle-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: inherit;
}

.principle-description {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 1rem;
  color: inherit;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid var(--neo-black);
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--neo-white);
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  min-width: 40px;
  font-size: 0.875rem;
}

.actions-section {
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .principles-page {
    padding: 1rem 0.5rem;
  }
  
  .principles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>