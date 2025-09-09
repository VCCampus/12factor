<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="neo-card neo-card--primary">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">CSS数创班8期</h1>
        <p class="text-xl mb-6">uni-app 迁移演示版本</p>
        <div class="flex flex-col gap-4 items-center">
          <div class="status-indicator status-indicator--success">
            ✅ uni-app 架构迁移完成
          </div>
          <div class="status-indicator status-indicator--success">
            🎨 Neobrutalism 设计系统
          </div>
          <div class="status-indicator status-indicator--success">
            📱 跨平台兼容架构
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
import { onMounted } from 'vue'

onMounted(() => {
  console.log('🏠 uni-app H5 演示版本加载完成')
  console.log('✨ 迁移状态: 架构重构完成')
  console.log('🎯 下一步: 完整功能实现和小程序端构建')
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
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