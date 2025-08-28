<template>
  <AppLayout>
    <!-- Hero Section -->
    <section class="text-center py-12">
      <div class="neo-card p-8 mb-8">
        <div class="flex justify-center mb-6">
          <div class="neo-icon w-16 h-16 text-3xl">
            🎯
          </div>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-bold text-text-dark mb-4">
          掌握3C数字资产思维
        </h1>
        
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          学习CSS数字创业核心知识体系，培养面向AI与Web3时代的创业思维模式
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <RouterLink to="/principles" class="neo-btn text-lg px-8 py-4">
            开始学习
          </RouterLink>
          <RouterLink to="/quiz" class="neo-btn-secondary text-lg px-8 py-4">
            立即测试
          </RouterLink>
        </div>
      </div>
    </section>
    
    <!-- Learning Path Overview -->
    <section class="mb-12">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-text-dark mb-4">学习路径</h2>
        <p class="text-gray-600">系统性掌握数字创业全流程知识</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Stage 1: 创业认知 -->
        <div class="neo-card p-6 text-center">
          <div class="neo-icon mx-auto mb-4 text-2xl">
            🧠
          </div>
          <h3 class="text-xl font-bold mb-3 text-text-dark">创业核心认知</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• 数字创业定义</li>
            <li>• 百森创业七法</li>
            <li>• 主体思维模式</li>
            <li>• 效果逻辑原则</li>
            <li>• 精益创业流程</li>
          </ul>
          <div class="mt-4">
            <div class="neo-progress">
              <div class="neo-progress-bar" style="width: 0%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-2">0/5 已完成</p>
          </div>
        </div>
        
        <!-- Stage 2: 3C资产 -->
        <div class="neo-card p-6 text-center">
          <div class="neo-icon mx-auto mb-4 text-2xl">
            💎
          </div>
          <h3 class="text-xl font-bold mb-3 text-text-dark">3C数字资产</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• Content内容资产</li>
            <li>• Code软件代码</li>
            <li>• Crypto加密货币</li>
            <li>• AI大模型应用</li>
            <li>• 比特币基础知识</li>
          </ul>
          <div class="mt-4">
            <div class="neo-progress">
              <div class="neo-progress-bar" style="width: 0%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-2">0/5 已完成</p>
          </div>
        </div>
        
        <!-- Stage 3: 精准营销 -->
        <div class="neo-card p-6 text-center">
          <div class="neo-icon mx-auto mb-4 text-2xl">
            🎯
          </div>
          <h3 class="text-xl font-bold mb-3 text-text-dark">精准营销实战</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• 商业模式画布</li>
            <li>• PMF验证方法</li>
            <li>• STP营销策略</li>
            <li>• 内容营销法则</li>
            <li>• 千粉理论实践</li>
          </ul>
          <div class="mt-4">
            <div class="neo-progress">
              <div class="neo-progress-bar" style="width: 0%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-2">0/5 已完成</p>
          </div>
        </div>
        
        <!-- Stage 4: 融资法则 -->
        <div class="neo-card p-6 text-center">
          <div class="neo-icon mx-auto mb-4 text-2xl">
            💰
          </div>
          <h3 class="text-xl font-bold mb-3 text-text-dark">融资致胜法则</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• 风险投资本质</li>
            <li>• 融资阶段管理</li>
            <li>• 路演演讲技巧</li>
            <li>• 财务基础知识</li>
          </ul>
          <div class="mt-4">
            <div class="neo-progress">
              <div class="neo-progress-bar" style="width: 0%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-2">0/4 已完成</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Quick Actions -->
    <section class="text-center">
      <div class="neo-card p-8">
        <h2 class="text-2xl font-bold text-text-dark mb-6">快速开始</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RouterLink to="/principles" class="neo-btn-secondary p-4">
            <div class="neo-icon mx-auto mb-2">📖</div>
            <div class="font-medium">学习概念</div>
            <div class="text-sm text-gray-600">系统学习21个核心概念</div>
          </RouterLink>
          
          <RouterLink to="/flashcards" class="neo-btn-secondary p-4">
            <div class="neo-icon mx-auto mb-2">🃏</div>
            <div class="font-medium">练习闪卡</div>
            <div class="text-sm text-gray-600">通过闪卡快速记忆</div>
          </RouterLink>
          
          <RouterLink to="/quiz" class="neo-btn-secondary p-4">
            <div class="neo-icon mx-auto mb-2">✅</div>
            <div class="font-medium">知识测试</div>
            <div class="text-sm text-gray-600">检验学习成果</div>
          </RouterLink>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

// TODO: 从store获取真实的学习进度数据
// 目前显示静态数据，等Phase 2实现状态管理后会更新
</script>

<style scoped>
/* 首页特定样式 */
.hero-section {
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
}

/* 确保grid在小屏幕上正确显示 */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* 进度条动画（虽然当前为0%） */
.neo-progress-bar {
  transition: width 0.3s ease-in-out;
}
</style>