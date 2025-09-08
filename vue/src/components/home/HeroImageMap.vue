<template>
  <div class="hero-image-container relative w-full max-w-4xl mx-auto">
    <!-- 主图片，支持多倍率和fallback -->
    <picture>
      <!-- WebP versions (future optimization) -->
      <!-- <source 
        srcset="/images/digital_venture_idx.webp, 
                /images/digital_venture_idx@2x.webp 2x,
                /images/digital_venture_idx@3x.webp 3x"
        type="image/webp"> -->
      
      <!-- PNG/JPG fallback -->
      <img 
        :src="imageSrc"
        :srcset="imageSrcSet"
        alt="Digital Venture - 数字创业学习平台"
        class="w-full h-auto"
        loading="lazy"
        @error="handleImageError"
        @load="handleImageLoad"
      >
    </picture>
    
    <!-- 热区覆盖层 - 最大化坐标 -->
    <div class="absolute inset-0">
      <!-- 左侧热区：市场温度计 -->
      <RouterLink 
        to="/thermometer"
        class="absolute cursor-pointer transition-colors duration-200 hover:bg-blue-100/20 rounded-lg"
        style="left: 0%; top: 15%; width: 33.33%; height: 60%;"
        @click="trackClick('thermometer')"
      >
        <span class="sr-only">市场温度计 - STOCKS & CRYPTO</span>
      </RouterLink>
      
      <!-- 中央热区：学习中心 -->
      <RouterLink 
        to="/principles"
        class="absolute cursor-pointer transition-colors duration-200 hover:bg-green-100/20 rounded-lg"
        style="left: 33.33%; top: 15%; width: 33.33%; height: 60%;"
        @click="trackClick('principles')"
      >
        <span class="sr-only">学习中心 - FLASHCARDS & QUIZES</span>
      </RouterLink>
      
      <!-- 右侧热区：模拟面试 -->
      <RouterLink 
        to="/mock-interview"
        class="absolute cursor-pointer transition-colors duration-200 hover:bg-purple-100/20 rounded-lg"
        style="left: 66.66%; top: 15%; width: 33.33%; height: 60%;"
        @click="trackClick('mock-interview')"
      >
        <span class="sr-only">模拟面试 - MOCK INTERVIEWS & RESUME BUILDER</span>
      </RouterLink>
      
      <!-- 底部热区：会员服务 -->
      <button
        class="absolute cursor-pointer transition-colors duration-200 hover:bg-yellow-100/20 rounded-lg"
        style="left: 25%; top: 75%; width: 50%; height: 20%;"
        @click="openMembershipModal"
      >
        <span class="sr-only">会员服务 - MEMBERSHIP</span>
      </button>
    </div>
    
    <!-- 图片加载失败时的降级处理 -->
    <div v-if="imageError" class="fallback-links bg-white border-2 border-gray-300 p-6 rounded-lg">
      <div class="text-center mb-4">
        <span class="text-gray-600">⚠️ 图片加载失败</span>
        <button 
          @click="retryImageLoad"
          class="ml-2 text-blue-600 hover:text-blue-800 underline"
        >
          重新加载
        </button>
      </div>
      
      <div class="space-y-2">
        <RouterLink to="/thermometer" class="block p-2 bg-blue-100 hover:bg-blue-200 rounded text-center">
          🌡️ 市场温度计 - STOCKS & CRYPTO
        </RouterLink>
        <RouterLink to="/principles" class="block p-2 bg-green-100 hover:bg-green-200 rounded text-center">
          🧠 学习中心 - FLASHCARDS & QUIZES
        </RouterLink>
        <RouterLink to="/mock-interview" class="block p-2 bg-purple-100 hover:bg-purple-200 rounded text-center">
          👨‍💼 模拟面试 - MOCK INTERVIEWS & RESUME BUILDER
        </RouterLink>
        <button @click="openMembershipModal" class="block w-full p-2 bg-yellow-100 hover:bg-yellow-200 rounded text-center">
          💎 会员服务 - COMING SOON
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// 图片状态管理
const imageError = ref(false)
const imageLoaded = ref(false)

// 根据屏幕像素密度选择合适的图片
const imageSrc = computed(() => {
  return '/images/digital_venture_idx.png'
})

const imageSrcSet = computed(() => {
  return '/images/digital_venture_idx.png 1x, /images/digital_venture_idx@2x.png 2x, /images/digital_venture_idx@3x.png 3x'
})

// 事件处理
const handleImageError = () => {
  imageError.value = true
  console.warn('Hero image failed to load, showing fallback links')
}

const handleImageLoad = () => {
  imageLoaded.value = true
  imageError.value = false
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
  // 简单的控制台日志，未来可以集成分析工具
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
/* 确保热区在所有设备上正确显示 */
.hero-image-container {
  position: relative;
  display: block;
}

/* 热区hover效果优化 */
.hero-image-container a,
.hero-image-container button {
  border-radius: 8px;
}

/* 图片优化 */
.hero-image-container img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* 降级链接样式 */
.fallback-links {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>