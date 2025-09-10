<template>
  <div class="hero-image-container">
    <!-- 主图片 -->
    <img 
      :src="imageSrc"
      alt="Digital Venture - CSS数创班8期学习平台"
      class="hero-image"
      loading="lazy"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    
    <!-- 热区覆盖层 -->
    <div v-if="!imageError" class="hotspot-overlay">
      <!-- 左侧热区：市场温度计 -->
      <router-link
        to="/thermometer"
        class="hotspot hotspot-left"
        @click="trackClick('thermometer')"
      >
        <span class="sr-only">市场温度计 - MARKET TEMPERATURE</span>
      </router-link>
      
      <!-- 中央热区：学习中心 -->
      <router-link
        to="/principles"
        class="hotspot hotspot-center"
        @click="trackClick('principles')"
      >
        <span class="sr-only">学习中心 - FLASHCARDS & QUIZES</span>
      </router-link>
      
      <!-- 右侧热区：模拟面试 -->
      <router-link
        to="/interview"
        class="hotspot hotspot-right"
        @click="trackClick('interview')"
      >
        <span class="sr-only">模拟面试 - VIRTUAL HIRING SIMULATOR</span>
      </router-link>
      
      <!-- 底部热区：会员服务 -->
      <button
        class="hotspot hotspot-bottom"
        @click="openMembershipModal"
      >
        <span class="sr-only">会员服务 - MEMBERSHIP</span>
      </button>
    </div>
    
    <!-- 图片加载失败时的降级处理 -->
    <div v-if="imageError" class="fallback-links">
      <div class="fallback-header">
        <span class="error-icon">⚠️</span>
        <span class="error-text">图片加载失败</span>
        <button class="retry-btn" @click="retryImageLoad">
          <span class="retry-text">重新加载</span>
        </button>
      </div>
      
      <div class="fallback-nav">
        <router-link to="/thermometer" class="nav-item nav-thermometer">
          <span class="nav-icon">🌡️</span>
          <span class="nav-text">市场温度计 - MARKET TEMPERATURE</span>
        </router-link>
        <router-link to="/principles" class="nav-item nav-principles">
          <span class="nav-icon">🧠</span>
          <span class="nav-text">学习中心 - FLASHCARDS & QUIZES</span>
        </router-link>
        <router-link to="/interview" class="nav-item nav-interview">
          <span class="nav-icon">👨‍💼</span>
          <span class="nav-text">模拟面试 - VIRTUAL HIRING SIMULATOR</span>
        </router-link>
        <button @click="openMembershipModal" class="nav-item nav-membership">
          <span class="nav-icon">💎</span>
          <span class="nav-text">会员服务 - MEMBERSHIP</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 图片状态管理
const imageError = ref(false)
const imageLoaded = ref(false)

// 图片路径
const imageSrc = computed(() => {
  return '/images/digital_venture_idx.png'
})

// 事件处理
const handleImageError = () => {
  imageError.value = true
  console.warn('Hero image failed to load, showing fallback links')
}

const handleImageLoad = () => {
  imageLoaded.value = true
  imageError.value = false
  console.log('Hero image loaded successfully')
}

const retryImageLoad = () => {
  imageError.value = false
  // 强制重新加载图片
  const img = document.querySelector('.hero-image-container img') as HTMLImageElement
  if (img) {
    const currentSrc = img.src
    img.src = ''
    img.src = currentSrc
  }
}

const trackClick = (area: string) => {
  console.log(`Clicked on ${area} hotspot`)
}

// 会员服务弹窗
const emit = defineEmits<{
  openMembership: []
}>()

const openMembershipModal = () => {
  emit('openMembership')
}
</script>

<style scoped>
.hero-image-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
}

/* 热区覆盖层 */
.hotspot-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hotspot {
  position: absolute;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  text-decoration: none;
  border: none;
  background: transparent;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:active {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(0.98);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 左侧热区：市场温度计 */
.hotspot-left {
  left: 0%;
  top: 15%;
  width: 33.33%;
  height: 60%;
}

/* 中央热区：学习中心 */
.hotspot-center {
  left: 33.33%;
  top: 15%;
  width: 33.33%;
  height: 60%;
}

/* 右侧热区：模拟面试 */
.hotspot-right {
  left: 66.66%;
  top: 15%;
  width: 33.34%;
  height: 60%;
}

/* 底部热区：会员服务 */
.hotspot-bottom {
  left: 25%;
  top: 75%;
  width: 50%;
  height: 20%;
}

/* 降级链接样式 */
.fallback-links {
  background-color: white;
  border: 3px solid black;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 8px 8px 0 black;
}

.fallback-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.error-icon {
  font-size: 3rem;
}

.error-text {
  color: #666666;
  font-size: 1.2rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background-color: #dbeafe;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  cursor: pointer;
}

.retry-text {
  color: #2563eb;
  font-size: 1rem;
  text-decoration: underline;
}

.fallback-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid black;
  border-radius: 8px;
  background-color: white;
  transition: all 0.2s ease;
  text-decoration: none;
  color: black;
  
  &:active {
    transform: translateX(4px) translateY(4px);
    box-shadow: 0 0 0 transparent;
  }
}

.nav-icon {
  font-size: 3rem;
  margin-right: 1.5rem;
}

.nav-text {
  font-size: 1.2rem;
  color: black;
  font-weight: 500;
}

.nav-thermometer {
  background-color: #dbeafe;
  box-shadow: 4px 4px 0 #3b82f6;
}

.nav-principles {
  background-color: #dcfce7;
  box-shadow: 4px 4px 0 #22c55e;
}

.nav-interview {
  background-color: #f3e8ff;
  box-shadow: 4px 4px 0 #a855f7;
}

.nav-membership {
  background-color: #fef3c7;
  box-shadow: 4px 4px 0 #eab308;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .hero-image-container {
    .hotspot {
      border-radius: 12px;
    }
  }
  
  .fallback-links {
    margin: 1rem;
  }
  
  .nav-item {
    .nav-icon {
      font-size: 4rem;
    }
    
    .nav-text {
      font-size: 1.4rem;
    }
  }
}
</style>