<template>
  <header class="neo-nav w-full">
    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-between py-4">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-3">
          <div class="neo-icon">
            📚
          </div>
          <h1 class="text-xl font-bold text-text-dark">3C数创学习平台</h1>
        </div>
        
        <!-- Navigation Links -->
        <div class="hidden md:flex items-center">
          <RouterLink 
            to="/" 
            class="neo-nav-item"
            :class="{ active: $route.name === 'home' }"
          >
            首页
          </RouterLink>
          <RouterLink 
            to="/thermometer" 
            class="neo-nav-item"
            :class="{ active: $route.name === 'thermometer' }"
          >
            温度计
          </RouterLink>
          <RouterLink 
            to="/principles" 
            class="neo-nav-item"
            :class="{ active: $route.path.startsWith('/principles') }"
          >
            原则
          </RouterLink>
          <RouterLink 
            to="/mock-interview" 
            class="neo-nav-item"
            :class="{ active: $route.path.includes('mock-interview') }"
          >
            模拟面试
          </RouterLink>
        </div>
        
        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden neo-btn-secondary p-2"
        >
          <span class="block w-6 h-0.5 bg-text-dark mb-1"></span>
          <span class="block w-6 h-0.5 bg-text-dark mb-1"></span>
          <span class="block w-6 h-0.5 bg-text-dark"></span>
        </button>
      </nav>
      
      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t-4 border-border-black pt-4 pb-4">
        <div class="flex flex-col space-y-2">
          <RouterLink 
            to="/" 
            class="neo-nav-item block"
            :class="{ active: $route.name === 'home' }"
            @click="closeMobileMenu"
          >
            首页
          </RouterLink>
          <RouterLink 
            to="/thermometer" 
            class="neo-nav-item block"
            :class="{ active: $route.name === 'thermometer' }"
            @click="closeMobileMenu"
          >
            温度计
          </RouterLink>
          <RouterLink 
            to="/principles" 
            class="neo-nav-item block"
            :class="{ active: $route.path.startsWith('/principles') }"
            @click="closeMobileMenu"
          >
            原则
          </RouterLink>
          <RouterLink 
            to="/mock-interview" 
            class="neo-nav-item block"
            :class="{ active: $route.path.includes('mock-interview') }"
            @click="closeMobileMenu"
          >
            模拟面试
          </RouterLink>
        </div>
      </div>
    </div>
    
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Mobile menu state
const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>

<style scoped>
/* 确保导航项边框正确显示 */
.neo-nav-item:last-child {
  border-right: none;
}

/* 移动端导航项样式调整 */
@media (max-width: 768px) {
  .neo-nav-item {
    border-right: none;
    border-bottom: 2px solid theme('colors.border-black');
  }
  
  .neo-nav-item:last-child {
    border-bottom: none;
  }
}
</style>