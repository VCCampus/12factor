<template>
  <div class="mobile-navigation space-y-4 p-4">
    <!-- 可选：缩小的logo图片 -->
    <div class="text-center mb-6">
      <img 
        src="/images/digital_venture_idx.png" 
        alt="Digital Venture Logo" 
        class="w-32 h-32 mx-auto rounded-lg shadow-md"
        loading="lazy"
      >
    </div>
    
    <!-- 导航卡片 -->
    <div class="space-y-4">
      <RouterLink 
        v-for="card in navigationCards" 
        :key="card.id"
        :to="card.route"
        :class="card.disabled ? 'pointer-events-none' : ''"
        @click="card.disabled ? openMembershipModal() : trackClick(card.id)"
        class="block"
      >
        <div 
          :class="[
            'neo-card p-6 text-center transition-all duration-200',
            card.disabled 
              ? 'opacity-60 bg-gray-100 border-gray-300' 
              : 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
          ]"
        >
          <!-- 图标和标题 -->
          <div class="flex items-center justify-center mb-3">
            <div class="neo-icon text-3xl mr-3">{{ card.icon }}</div>
            <div>
              <h3 class="text-lg font-bold text-text-dark">{{ card.title }}</h3>
              <p class="text-sm text-gray-600">{{ card.subtitle }}</p>
            </div>
          </div>
          
          <!-- 详细描述 -->
          <p class="text-sm text-gray-700 mb-3">{{ card.description }}</p>
          
          <!-- 状态标识 -->
          <div v-if="card.disabled" class="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            <span class="mr-1">⏳</span>
            Coming Soon
          </div>
          
          <!-- neobrutalism装饰元素 -->
          <div class="neo-decoration mt-3" :style="{ backgroundColor: card.accentColor }"></div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface NavigationCard {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  route: string
  disabled: boolean
  accentColor: string
}

// 导航卡片数据 - 基于决策的具体内容
const navigationCards: NavigationCard[] = [
  {
    id: 'market-temperature',
    title: 'MARKET TEMPERATURE',
    subtitle: 'STOCKS & CRYPTO',
    description: '全球创新市场温度计，追踪股票与加密货币市场动态，把握投资时机。',
    icon: '🌡️',
    route: '/thermometer',
    disabled: false,
    accentColor: '#3B82F6' // blue
  },
  {
    id: 'learning-center',
    title: 'AI & CRYPTO INDUSTRY MAP',
    subtitle: 'FLASHCARDS & QUIZES',
    description: '全球创新知识地图，通过闪卡练习和测试掌握AI与加密货币行业核心概念。',
    icon: '🧠',
    route: '/principles',
    disabled: false,
    accentColor: '#10B981' // green
  },
  {
    id: 'mock-interview',
    title: 'VIRTUAL HIRING SIMULATOR',
    subtitle: 'MOCK INTERVIEWS & RESUME BUILDER',
    description: '虚拟招聘模拟器，提供模拟面试训练和简历构建工具，提升求职竞争力。',
    icon: '👨‍💼',
    route: '/mock-interview',
    disabled: false,
    accentColor: '#8B5CF6' // purple
  },
  {
    id: 'membership',
    title: 'MEMBERSHIP',
    subtitle: '¥99/YEAR (TBD)',
    description: 'JOIN US! PRODUCT & MARKETING TEAM - 加入我们的产品和营销团队，获得专属会员权益。',
    icon: '💎',
    route: '#',
    disabled: true,
    accentColor: '#F59E0B' // yellow
  }
]

// 事件处理
const emit = defineEmits<{
  openMembership: []
}>()

const trackClick = (cardId: string) => {
  console.log(`Clicked on ${cardId} card`)
}

const openMembershipModal = () => {
  emit('openMembership')
}
</script>

<style scoped>
/* neobrutalism 风格卡片 */
.neo-card {
  background: white;
  border: 3px solid #000;
  border-radius: 12px;
  box-shadow: 6px 6px 0px 0px #000;
  position: relative;
}

.neo-card:hover:not(.pointer-events-none) {
  box-shadow: 8px 8px 0px 0px #000;
}

.neo-card:active:not(.pointer-events-none) {
  box-shadow: 4px 4px 0px 0px #000;
  transform: translate(2px, 2px);
}

/* neobrutalism 图标样式 */
.neo-icon {
  background: #FFE066;
  border: 2px solid #000;
  border-radius: 8px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 3px 0px 0px #000;
}

/* neobrutalism 装饰元素 */
.neo-decoration {
  height: 4px;
  border-radius: 2px;
  border: 1px solid #000;
  margin: 0 auto;
  width: 60%;
}

/* 禁用状态样式 */
.pointer-events-none .neo-card {
  background: #F3F4F6;
  border-color: #D1D5DB;
  box-shadow: 4px 4px 0px 0px #D1D5DB;
}

.pointer-events-none .neo-icon {
  background: #E5E7EB;
  border-color: #D1D5DB;
  box-shadow: 2px 2px 0px 0px #D1D5DB;
}

.pointer-events-none .neo-decoration {
  border-color: #D1D5DB;
  background-color: #D1D5DB !important;
}

/* 响应式优化 */
@media (max-width: 480px) {
  .mobile-navigation {
    padding: 1rem;
  }
  
  .neo-card {
    padding: 1rem;
  }
  
  .neo-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}

/* 确保文本颜色符合neobrutalism风格 */
.text-text-dark {
  color: #1F2937;
  font-weight: 700;
}

/* 动画效果 */
.neo-card {
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 可访问性增强 */
@media (prefers-reduced-motion: reduce) {
  .neo-card {
    transition: none;
  }
}
</style>