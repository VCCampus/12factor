<template>
  <div class="home-page">
    <!-- 桌面端：热区图片导航 -->
    <div v-if="!isMobile" class="desktop-hero">
      <HeroImageMap @open-membership="openMembershipModal" />
    </div>
    
    <!-- 移动端：卡片布局导航 -->
    <div v-else class="mobile-hero">
      <MobileNavigationCards @open-membership="openMembershipModal" />
    </div>
    
    <!-- 会员服务模态弹窗 -->
    <MembershipModal 
      :is-open="membershipModalOpen"
      @close="closeMembershipModal"
    />
    
    <!-- Hero Section - 迁移状态展示 -->
    <div class="neo-card neo-card--primary">
      <div class="text-center">
        <h2 class="text-3xl font-bold mb-4">🎉 Issue #25 完成！</h2>
        <p class="text-xl mb-6">digital_venture_idx.png 热区导航已集成</p>
        <div class="flex flex-col gap-4 items-center">
          <div class="status-indicator status-indicator--success">
            ✅ HeroImageMap 热区导航组件
          </div>
          <div class="status-indicator status-indicator--success">
            📱 MobileNavigationCards 移动端适配
          </div>
          <div class="status-indicator status-indicator--success">
            🎯 响应式设计 + 降级处理
          </div>
        </div>
      </div>
    </div>

    <!-- 功能模块展示 -->
    <div class="modules-section">
      <h2 class="text-2xl font-bold mb-6 text-center">核心功能模块</h2>
      
      <div class="neo-grid neo-grid--2">
        <!-- 个人成长模块 -->
        <div class="neo-card neo-card--accent">
          <div class="text-center">
            <div class="text-4xl mb-4">🌱</div>
            <h3 class="text-xl font-bold mb-2 text-white">个人成长12原则</h3>
            <p class="mb-4 text-white">系统化学习个人成长核心理念</p>
            <router-link to="/principles" class="neo-button neo-button--primary">
              开始学习
            </router-link>
          </div>
        </div>

        <!-- 闪卡练习 -->
        <div class="neo-card neo-card--secondary">
          <div class="text-center">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-bold mb-2 text-white">闪卡练习</h3>
            <p class="mb-4 text-white">通过闪卡深化知识理解</p>
            <router-link to="/flashcards" class="neo-button neo-button--primary">
              开始练习
            </router-link>
          </div>
        </div>

        <!-- 知识测试 -->
        <div class="neo-card neo-card--success">
          <div class="text-center">
            <div class="text-4xl mb-4">🏆</div>
            <h3 class="text-xl font-bold mb-2 text-white">知识测试</h3>
            <p class="mb-4 text-white">验证学习成果和掌握程度</p>
            <router-link to="/quiz" class="neo-button neo-button--primary">
              开始测试
            </router-link>
          </div>
        </div>

        <!-- 模拟面试 -->
        <div class="neo-card">
          <div class="text-center">
            <div class="text-4xl mb-4">💼</div>
            <h3 class="text-xl font-bold mb-2">模拟面试</h3>
            <p class="mb-4">多难度面试题库练习</p>
            <router-link to="/interview" class="neo-button neo-button--accent">
              开始面试
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术特性展示 -->
    <div class="features-section">
      <h2 class="text-2xl font-bold mb-6 text-center">uni-app 迁移特性</h2>
      
      <div class="neo-grid neo-grid--3">
        <div class="neo-card">
          <div class="text-center">
            <div class="text-3xl mb-3">📱</div>
            <h4 class="font-bold mb-2">跨平台兼容</h4>
            <p class="text-sm">一套代码，H5 + 小程序双端运行</p>
          </div>
        </div>

        <div class="neo-card">
          <div class="text-center">
            <div class="text-3xl mb-3">🎨</div>
            <h4 class="font-bold mb-2">设计系统</h4>
            <p class="text-sm">Neobrutalism 风格统一视觉</p>
          </div>
        </div>

        <div class="neo-card">
          <div class="text-center">
            <div class="text-3xl mb-3">⚡</div>
            <h4 class="font-bold mb-2">现代技术</h4>
            <p class="text-sm">Vue 3 + TypeScript + Pinia</p>
          </div>
        </div>

        <div class="neo-card">
          <div class="text-center">
            <div class="text-3xl mb-3">🔧</div>
            <h4 class="font-bold mb-2">开发效率</h4>
            <p class="text-sm">统一代码库，维护成本降低</p>
          </div>
        </div>

        <div class="neo-card">
          <div class="text-center">
            <div class="text-3xl mb-3">📦</div>
            <h4 class="font-bold mb-2">构建优化</h4>
            <p class="text-sm">自动化构建，资源压缩优化</p>
          </div>
        </div>

        <div class="neo-card">
          <div class="text-center">
            <div class="text-3xl mb-3">🚀</div>
            <h4 class="font-bold mb-2">性能提升</h4>
            <p class="text-sm">更快的加载速度和响应</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 迁移状态指示 -->
    <div class="neo-card neo-card--primary">
      <h3 class="text-xl font-bold mb-4 text-center">迁移完成状态</h3>
      <div class="neo-grid neo-grid--2">
        <div class="migration-status">
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>项目架构重构</span>
          </div>
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>设计系统实现</span>
          </div>
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>路由系统迁移</span>
          </div>
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>状态管理保持</span>
          </div>
        </div>
        <div class="migration-status">
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>跨端存储统一</span>
          </div>
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>构建流程配置</span>
          </div>
          <div class="status-item">
            <span class="status-icon">✅</span>
            <span>TypeScript支持</span>
          </div>
          <div class="status-item">
            <span class="status-icon">🚀</span>
            <span>H5 演示版本</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import HeroImageMap from '@/components/home/HeroImageMap.vue'
import MobileNavigationCards from '@/components/home/MobileNavigationCards.vue'
import MembershipModal from '@/components/home/MembershipModal.vue'

// 响应式检测
const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768
  }
  return false
})

// 模态弹窗状态
const membershipModalOpen = ref(false)

// 事件处理
const openMembershipModal = () => {
  membershipModalOpen.value = true
}

const closeMembershipModal = () => {
  membershipModalOpen.value = false
}

onMounted(() => {
  console.log('🏠 Issue #25 热区导航完成！')
  console.log('✨ HeroImageMap + MobileNavigationCards 已集成')
  console.log('🎯 响应式布局:', { isMobile: isMobile.value })
  console.log('📱 支持桌面端热区 + 移动端卡片导航')
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* 桌面端hero区域 */
.desktop-hero {
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* 移动端hero区域 */
.mobile-hero {
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
  min-height: 100vh;
  padding: 0;
}

/* 下方内容区域 */
.home-page > .neo-card {
  max-width: 1200px;
  margin: 2rem auto;
  margin-top: 0;
}

.home-page {
  max-width: none;
  margin: 0;
  padding: 0;
}

.modules-section,
.features-section {
  margin-top: 3rem;
}

.migration-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.status-icon {
  font-size: 1.25rem;
  min-width: 1.5rem;
}

@media (max-width: 768px) {
  .home-page {
    padding: 1rem 0.5rem;
  }
  
  .modules-section,
  .features-section {
    margin-top: 2rem;
  }
}
</style>