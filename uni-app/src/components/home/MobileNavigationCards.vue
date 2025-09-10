<template>
  <view class="mobile-nav-container">
    <!-- 标题区域 -->
    <view class="header-section">
      <text class="main-title">CSS数创班8期</text>
      <text class="sub-title">Digital Venture Learning Platform</text>
    </view>
    
    <!-- 导航卡片网格 -->
    <view class="nav-grid">
      <!-- 市场温度计卡片 -->
      <view class="nav-card card-thermometer" @tap="navigateToThermometer">
        <view class="card-icon">
          <text class="icon-text">🌡️</text>
        </view>
        <view class="card-content">
          <text class="card-title">市场温度计</text>
          <text class="card-subtitle">MARKET TEMPERATURE</text>
          <text class="card-desc">实时股票与加密货币情绪指标</text>
        </view>
        <view class="card-arrow">
          <text class="arrow-text">→</text>
        </view>
      </view>
      
      <!-- 学习中心卡片 -->
      <view class="nav-card card-principles" @tap="navigateToPrinciples">
        <view class="card-icon">
          <text class="icon-text">🧠</text>
        </view>
        <view class="card-content">
          <text class="card-title">学习中心</text>
          <text class="card-subtitle">FLASHCARDS & QUIZES</text>
          <text class="card-desc">AI与加密货币行业知识闪卡</text>
        </view>
        <view class="card-arrow">
          <text class="arrow-text">→</text>
        </view>
      </view>
      
      <!-- 模拟面试卡片 -->
      <view class="nav-card card-interview" @tap="navigateToInterview">
        <view class="card-icon">
          <text class="icon-text">👨‍💼</text>
        </view>
        <view class="card-content">
          <text class="card-title">模拟面试</text>
          <text class="card-subtitle">VIRTUAL HIRING SIMULATOR</text>
          <text class="card-desc">多岗位模拟面试与简历优化</text>
        </view>
        <view class="card-arrow">
          <text class="arrow-text">→</text>
        </view>
      </view>
      
      <!-- 会员服务卡片 -->
      <view class="nav-card card-membership" @tap="openMembershipModal">
        <view class="card-icon">
          <text class="icon-text">💎</text>
        </view>
        <view class="card-content">
          <text class="card-title">会员服务</text>
          <text class="card-subtitle">PREMIUM MEMBERSHIP</text>
          <text class="card-desc">专属学习资源与定制服务</text>
        </view>
        <view class="card-arrow">
          <text class="arrow-text">→</text>
        </view>
      </view>
    </view>
    
    <!-- 底部信息 -->
    <view class="footer-section">
      <text class="preview-text">PREVIEW LAUNCH: SEPT 1ST (MON)</text>
      <view class="membership-banner">
        <text class="membership-text">MEMBERSHIP: ¥99/YEAR (TBD)</text>
        <text class="join-text">JOIN US! PRODUCT & MARKETING TEAM</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
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
.mobile-nav-container {
  padding: 32rpx;
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
  min-height: 100vh;
}

/* 标题区域 */
.header-section {
  text-align: center;
  margin-bottom: 48rpx;
  
  .main-title {
    display: block;
    font-size: 64rpx;
    font-weight: 900;
    color: var(--neo-primary, #FF006E);
    text-shadow: 4px 4px 0 var(--neo-black, #000000);
    margin-bottom: 16rpx;
    letter-spacing: 2rpx;
  }
  
  .sub-title {
    display: block;
    font-size: 28rpx;
    color: var(--neo-gray-600, #666666);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1rpx;
  }
}

/* 导航卡片网格 */
.nav-grid {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  margin-bottom: 48rpx;
}

.nav-card {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border: 4px solid var(--neo-black, #000000);
  border-radius: 16rpx;
  background-color: var(--neo-white, #ffffff);
  transition: all 0.2s ease;
  position: relative;
  
  /* 点击反馈 */
  &:active {
    transform: translateX(6rpx) translateY(6rpx);
  }
  
  .card-icon {
    flex-shrink: 0;
    width: 96rpx;
    height: 96rpx;
    border-radius: 16rpx;
    border: 3px solid var(--neo-black, #000000);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
    
    .icon-text {
      font-size: 56rpx;
    }
  }
  
  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .card-title {
      font-size: 36rpx;
      font-weight: 700;
      color: var(--neo-black, #000000);
      margin-bottom: 8rpx;
      line-height: 1.2;
    }
    
    .card-subtitle {
      font-size: 24rpx;
      color: var(--neo-gray-600, #666666);
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 12rpx;
      letter-spacing: 1rpx;
    }
    
    .card-desc {
      font-size: 28rpx;
      color: var(--neo-gray-700, #374151);
      line-height: 1.4;
    }
  }
  
  .card-arrow {
    flex-shrink: 0;
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    border: 3px solid var(--neo-black, #000000);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--neo-white, #ffffff);
    
    .arrow-text {
      font-size: 36rpx;
      font-weight: 700;
      color: var(--neo-black, #000000);
    }
  }
}

/* 卡片主题色彩 */
.card-thermometer {
  background-color: var(--neo-blue-50, #eff6ff);
  box-shadow: 8rpx 8rpx 0 var(--neo-blue-500, #3b82f6);
  
  .card-icon {
    background-color: var(--neo-blue-100, #dbeafe);
  }
  
  .card-arrow {
    background-color: var(--neo-blue-100, #dbeafe);
  }
}

.card-principles {
  background-color: var(--neo-green-50, #f0fdf4);
  box-shadow: 8rpx 8rpx 0 var(--neo-green-500, #22c55e);
  
  .card-icon {
    background-color: var(--neo-green-100, #dcfce7);
  }
  
  .card-arrow {
    background-color: var(--neo-green-100, #dcfce7);
  }
}

.card-interview {
  background-color: var(--neo-purple-50, #faf5ff);
  box-shadow: 8rpx 8rpx 0 var(--neo-purple-500, #a855f7);
  
  .card-icon {
    background-color: var(--neo-purple-100, #f3e8ff);
  }
  
  .card-arrow {
    background-color: var(--neo-purple-100, #f3e8ff);
  }
}

.card-membership {
  background-color: var(--neo-yellow-50, #fefce8);
  box-shadow: 8rpx 8rpx 0 var(--neo-yellow-500, #eab308);
  
  .card-icon {
    background-color: var(--neo-yellow-100, #fef3c7);
  }
  
  .card-arrow {
    background-color: var(--neo-yellow-100, #fef3c7);
  }
}

/* 底部信息 */
.footer-section {
  text-align: center;
  
  .preview-text {
    display: block;
    font-size: 24rpx;
    color: var(--neo-gray-500, #6b7280);
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 24rpx;
    letter-spacing: 1rpx;
  }
  
  .membership-banner {
    padding: 24rpx;
    background-color: var(--neo-yellow-100, #fef3c7);
    border: 3px solid var(--neo-yellow-500, #eab308);
    border-radius: 12rpx;
    box-shadow: 4rpx 4rpx 0 var(--neo-yellow-600, #ca8a04);
    
    .membership-text {
      display: block;
      font-size: 28rpx;
      font-weight: 700;
      color: var(--neo-black, #000000);
      margin-bottom: 8rpx;
    }
    
    .join-text {
      display: block;
      font-size: 24rpx;
      color: var(--neo-gray-700, #374151);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1rpx;
    }
  }
}

/* 小程序端特殊优化 */
/* #ifdef MP-WEIXIN */
.nav-card {
  /* 小程序端触摸反馈更明显 */
  &:active {
    transform: translateX(8rpx) translateY(8rpx);
    box-shadow: 0 0 0 transparent;
  }
}

.card-icon {
  /* 小程序端图标稍大 */
  .icon-text {
    font-size: 64rpx;
  }
}
/* #endif */

/* H5端响应式 */
/* #ifdef H5 */
@media (min-width: 640px) {
  .nav-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32rpx;
  }
}

@media (min-width: 1024px) {
  .mobile-nav-container {
    max-width: 1200rpx;
    margin: 0 auto;
    padding: 64rpx;
  }
  
  .nav-grid {
    grid-template-columns: 1fr 1fr;
    gap: 48rpx;
  }
}
/* #endif */
</style>