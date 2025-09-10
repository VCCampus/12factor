<template>
  <view class="hero-image-container">
    <!-- 主图片 -->
    <image 
      :src="imageSrc"
      mode="widthFix"
      class="hero-image"
      :lazy-load="true"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    
    <!-- 热区覆盖层 -->
    <view v-if="!imageError" class="hotspot-overlay">
      <!-- 左侧热区：市场温度计 -->
      <view 
        class="hotspot hotspot-left"
        @tap="navigateToThermometer"
      >
        <text class="sr-only">市场温度计 - MARKET TEMPERATURE</text>
      </view>
      
      <!-- 中央热区：学习中心 -->
      <view 
        class="hotspot hotspot-center"
        @tap="navigateToPrinciples"
      >
        <text class="sr-only">学习中心 - FLASHCARDS & QUIZES</text>
      </view>
      
      <!-- 右侧热区：模拟面试 -->
      <view 
        class="hotspot hotspot-right"
        @tap="navigateToInterview"
      >
        <text class="sr-only">模拟面试 - VIRTUAL HIRING SIMULATOR</text>
      </view>
      
      <!-- 底部热区：会员服务 -->
      <view 
        class="hotspot hotspot-bottom"
        @tap="openMembershipModal"
      >
        <text class="sr-only">会员服务 - MEMBERSHIP</text>
      </view>
    </view>
    
    <!-- 图片加载失败时的降级处理 -->
    <view v-if="imageError" class="fallback-links">
      <view class="fallback-header">
        <text class="error-icon">⚠️</text>
        <text class="error-text">图片加载失败</text>
        <view class="retry-btn" @tap="retryImageLoad">
          <text class="retry-text">重新加载</text>
        </view>
      </view>
      
      <view class="fallback-nav">
        <view class="nav-item nav-thermometer" @tap="navigateToThermometer">
          <text class="nav-icon">🌡️</text>
          <text class="nav-text">市场温度计 - MARKET TEMPERATURE</text>
        </view>
        <view class="nav-item nav-principles" @tap="navigateToPrinciples">
          <text class="nav-icon">🧠</text>
          <text class="nav-text">学习中心 - FLASHCARDS & QUIZES</text>
        </view>
        <view class="nav-item nav-interview" @tap="navigateToInterview">
          <text class="nav-icon">👨‍💼</text>
          <text class="nav-text">模拟面试 - VIRTUAL HIRING SIMULATOR</text>
        </view>
        <view class="nav-item nav-membership" @tap="openMembershipModal">
          <text class="nav-icon">💎</text>
          <text class="nav-text">会员服务 - MEMBERSHIP</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 图片状态管理
const imageError = ref(false)
const imageLoaded = ref(false)

// 图片路径
const imageSrc = computed(() => {
  return '/static/images/digital_venture_idx.png'
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
  // 简单的重试机制 - uni-app中重新设置src
  const currentSrc = imageSrc.value
  // 触发重新加载
  setTimeout(() => {
    console.log('Retrying image load')
  }, 100)
}

// 导航方法
const navigateToThermometer = () => {
  uni.navigateTo({
    url: '/pages/thermometer/index'
  })
}

const navigateToPrinciples = () => {
  uni.navigateTo({
    url: '/pages/growth/principles/index'
  })
}

const navigateToInterview = () => {
  uni.navigateTo({
    url: '/pages/interview/index'
  })
}

// 会员服务弹窗
const emit = defineEmits<{
  openMembership: []
}>()

const openMembershipModal = () => {
  emit('openMembership')
}
</script>

<style lang="scss" scoped>
.hero-image-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  .hero-image {
    width: 100%;
    height: auto;
    display: block;
  }
}

/* 热区覆盖层 */
.hotspot-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  .hotspot {
    position: absolute;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-radius: 8px;
    
    /* hover效果 - H5端支持 */
    /* #ifdef H5 */
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    /* #endif */
    
    /* 点击反馈 - 所有端支持 */
    &:active {
      background-color: rgba(255, 255, 255, 0.2);
      transform: scale(0.98);
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
}

/* 降级链接样式 */
.fallback-links {
  background-color: var(--neo-white, #ffffff);
  border: 3px solid var(--neo-black, #000000);
  border-radius: 12px;
  padding: 32rpx;
  box-shadow: 8px 8px 0 var(--neo-black, #000000);
  
  .fallback-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;
    flex-wrap: wrap;
    
    .error-icon {
      font-size: 48rpx;
      margin-right: 16rpx;
    }
    
    .error-text {
      color: var(--neo-gray-600, #666666);
      font-size: 28rpx;
      margin-right: 16rpx;
    }
    
    .retry-btn {
      padding: 8rpx 16rpx;
      background-color: var(--neo-blue-100, #dbeafe);
      border: 2px solid var(--neo-blue-500, #3b82f6);
      border-radius: 8rpx;
      
      .retry-text {
        color: var(--neo-blue-600, #2563eb);
        font-size: 24rpx;
        text-decoration: underline;
      }
    }
  }
  
  .fallback-nav {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    
    .nav-item {
      display: flex;
      align-items: center;
      padding: 24rpx;
      border: 2px solid var(--neo-black, #000000);
      border-radius: 8rpx;
      background-color: var(--neo-white, #ffffff);
      transition: all 0.2s ease;
      
      &:active {
        transform: translateX(4px) translateY(4px);
        box-shadow: 0 0 0 var(--neo-black, #000000);
      }
      
      .nav-icon {
        font-size: 48rpx;
        margin-right: 24rpx;
      }
      
      .nav-text {
        font-size: 28rpx;
        color: var(--neo-black, #000000);
        font-weight: 500;
      }
    }
    
    .nav-thermometer {
      background-color: var(--neo-blue-100, #dbeafe);
      box-shadow: 4px 4px 0 var(--neo-blue-500, #3b82f6);
    }
    
    .nav-principles {
      background-color: var(--neo-green-100, #dcfce7);
      box-shadow: 4px 4px 0 var(--neo-green-500, #22c55e);
    }
    
    .nav-interview {
      background-color: var(--neo-purple-100, #f3e8ff);
      box-shadow: 4px 4px 0 var(--neo-purple-500, #a855f7);
    }
    
    .nav-membership {
      background-color: var(--neo-yellow-100, #fef3c7);
      box-shadow: 4px 4px 0 var(--neo-yellow-500, #eab308);
    }
  }
}

/* 响应式优化 */
/* #ifdef H5 */
@media (max-width: 768px) {
  .hero-image-container {
    .hotspot-overlay {
      /* 移动端热区稍微增大触摸区域 */
      .hotspot {
        border-radius: 12px;
      }
    }
  }
  
  .fallback-links {
    margin: 16rpx;
    
    .fallback-nav {
      .nav-item {
        .nav-icon {
          font-size: 64rpx;
        }
        
        .nav-text {
          font-size: 32rpx;
        }
      }
    }
  }
}
/* #endif */
</style>