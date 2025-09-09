<template>
  <div id="app" class="min-h-screen bg-neo-white">
    <!-- 导航栏 -->
    <nav class="neo-navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          <span class="brand-text">CSS数创班8期</span>
          <span class="brand-subtitle">uni-app H5版</span>
        </router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/principles" class="nav-link">成长原则</router-link>
          <router-link to="/flashcards" class="nav-link">闪卡练习</router-link>
          <router-link to="/quiz" class="nav-link">知识测试</router-link>
          <router-link to="/interview" class="nav-link">模拟面试</router-link>
          <router-link to="/thermometer" class="nav-link">市场情绪</router-link>
        </div>
        
        <!-- 移动端菜单按钮 -->
        <button 
          class="mobile-menu-btn md:hidden"
          @click="toggleMobileMenu"
        >
          <span class="hamburger"></span>
          <span class="hamburger"></span>
          <span class="hamburger"></span>
        </button>
      </div>
      
      <!-- 移动端菜单 -->
      <div 
        class="mobile-menu md:hidden"
        :class="{ 'active': mobileMenuOpen }"
      >
        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
        <router-link to="/principles" class="mobile-nav-link" @click="closeMobileMenu">成长原则</router-link>
        <router-link to="/flashcards" class="mobile-nav-link" @click="closeMobileMenu">闪卡练习</router-link>
        <router-link to="/quiz" class="mobile-nav-link" @click="closeMobileMenu">知识测试</router-link>
        <router-link to="/interview" class="mobile-nav-link" @click="closeMobileMenu">模拟面试</router-link>
        <router-link to="/thermometer" class="mobile-nav-link" @click="closeMobileMenu">市场情绪</router-link>
      </div>
    </nav>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 底部信息 -->
    <footer class="neo-footer">
      <div class="footer-content">
        <p class="footer-text">
          🚀 uni-app 迁移演示版本 | 
          ⚡ Vue 3 + TypeScript + Pinia |
          🎨 Neobrutalism 设计系统
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<style scoped>
/* Neobrutalism 导航栏样式 */
.neo-navbar {
  background: var(--neo-primary);
  border-bottom: 3px solid var(--neo-black);
  box-shadow: 0 4px 0 var(--neo-black);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
}

.nav-brand {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--neo-black);
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.brand-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--neo-gray-700);
}

.nav-links {
  display: none;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  padding: 0.5rem 1rem;
  background: var(--neo-white);
  border: 2px solid var(--neo-black);
  box-shadow: 2px 2px 0 var(--neo-black);
  text-decoration: none;
  color: var(--neo-black);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.nav-link:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--neo-black);
}

.nav-link.router-link-active {
  background: var(--neo-accent);
  color: var(--neo-white);
}

.mobile-menu-btn {
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: var(--neo-white);
  border: 2px solid var(--neo-black);
  box-shadow: 2px 2px 0 var(--neo-black);
  padding: 0.5rem;
  cursor: pointer;
}

.hamburger {
  width: 20px;
  height: 2px;
  background: var(--neo-black);
}

.mobile-menu {
  display: none;
  background: var(--neo-white);
  border-top: 2px solid var(--neo-black);
  padding: 1rem;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-menu.active {
  display: flex;
}

.mobile-nav-link {
  padding: 0.75rem;
  background: var(--neo-gray-100);
  border: 2px solid var(--neo-black);
  text-decoration: none;
  color: var(--neo-black);
  font-weight: 600;
  text-align: center;
  transition: all 0.2s;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: var(--neo-accent);
  color: var(--neo-white);
}

.main-content {
  min-height: calc(100vh - 120px);
  padding: 1rem;
}

.neo-footer {
  background: var(--neo-gray-100);
  border-top: 3px solid var(--neo-black);
  padding: 1rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-text {
  font-size: 0.875rem;
  color: var(--neo-gray-700);
  font-weight: 500;
}
</style>