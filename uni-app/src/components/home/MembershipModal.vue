<template>
  <view v-if="isOpen" class="modal-overlay" @tap="handleOverlayTap">
    <view class="modal-container" @tap.stop>
      <!-- 关闭按钮 -->
      <view class="close-btn" @tap="closeModal">
        <text class="close-icon">✕</text>
      </view>
      
      <!-- 模态内容 -->
      <view class="modal-content">
        <!-- 标题 -->
        <view class="modal-header">
          <text class="modal-title">💎 会员服务</text>
          <text class="modal-subtitle">PREMIUM MEMBERSHIP</text>
        </view>
        
        <!-- 内容区域 -->
        <view class="modal-body">
          <view class="coming-soon">
            <text class="coming-text">🚀 即将推出</text>
            <text class="launch-date">预计上线时间：9月1日</text>
          </view>
          
          <view class="feature-list">
            <view class="feature-item">
              <text class="feature-icon">📚</text>
              <text class="feature-text">专属学习资源与课程</text>
            </view>
            <view class="feature-item">
              <text class="feature-icon">🎯</text>
              <text class="feature-text">个性化学习路径定制</text>
            </view>
            <view class="feature-item">
              <text class="feature-icon">👥</text>
              <text class="feature-text">产品与营销团队直接指导</text>
            </view>
            <view class="feature-item">
              <text class="feature-icon">💬</text>
              <text class="feature-text">专业导师一对一答疑</text>
            </view>
          </view>
          
          <view class="pricing-info">
            <text class="price-text">预计定价：¥99/年</text>
            <text class="price-note">* 最终价格以正式发布为准</text>
          </view>
        </view>
        
        <!-- 底部按钮 -->
        <view class="modal-footer">
          <view class="interest-btn" @tap="showInterest">
            <text class="btn-text">我感兴趣</text>
          </view>
          <view class="close-btn-secondary" @tap="closeModal">
            <text class="btn-text-secondary">稍后再说</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const closeModal = () => {
  emit('close')
}

const handleOverlayTap = () => {
  closeModal()
}

const showInterest = () => {
  // 简单的反馈
  uni.showToast({
    title: '感谢您的关注！我们会及时通知您最新进展',
    icon: 'none',
    duration: 3000
  })
  
  // 关闭模态框
  setTimeout(() => {
    closeModal()
  }, 1000)
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 32rpx;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 600rpx;
  background-color: var(--neo-white, #ffffff);
  border: 4px solid var(--neo-black, #000000);
  border-radius: 16rpx;
  box-shadow: 12rpx 12rpx 0 var(--neo-black, #000000);
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 64rpx;
  height: 64rpx;
  background-color: var(--neo-red-100, #fee2e2);
  border: 3px solid var(--neo-black, #000000);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  
  &:active {
    transform: scale(0.9);
  }
  
  .close-icon {
    font-size: 32rpx;
    font-weight: 700;
    color: var(--neo-black, #000000);
  }
}

.modal-content {
  padding: 48rpx 32rpx 32rpx;
}

/* 标题区域 */
.modal-header {
  text-align: center;
  margin-bottom: 48rpx;
  
  .modal-title {
    display: block;
    font-size: 48rpx;
    font-weight: 900;
    color: var(--neo-primary, #FF006E);
    text-shadow: 3px 3px 0 var(--neo-black, #000000);
    margin-bottom: 12rpx;
  }
  
  .modal-subtitle {
    display: block;
    font-size: 24rpx;
    color: var(--neo-gray-600, #666666);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2rpx;
  }
}

/* 内容区域 */
.modal-body {
  .coming-soon {
    text-align: center;
    margin-bottom: 40rpx;
    padding: 32rpx;
    background-color: var(--neo-yellow-50, #fefce8);
    border: 3px solid var(--neo-yellow-500, #eab308);
    border-radius: 12rpx;
    
    .coming-text {
      display: block;
      font-size: 36rpx;
      font-weight: 700;
      color: var(--neo-black, #000000);
      margin-bottom: 12rpx;
    }
    
    .launch-date {
      display: block;
      font-size: 28rpx;
      color: var(--neo-gray-700, #374151);
    }
  }
  
  .feature-list {
    margin-bottom: 40rpx;
    
    .feature-item {
      display: flex;
      align-items: center;
      margin-bottom: 24rpx;
      padding: 20rpx;
      background-color: var(--neo-gray-50, #f9fafb);
      border: 2px solid var(--neo-gray-200, #e5e7eb);
      border-radius: 8rpx;
      
      .feature-icon {
        font-size: 40rpx;
        margin-right: 20rpx;
      }
      
      .feature-text {
        font-size: 28rpx;
        color: var(--neo-black, #000000);
        line-height: 1.4;
      }
    }
  }
  
  .pricing-info {
    text-align: center;
    padding: 24rpx;
    background-color: var(--neo-blue-50, #eff6ff);
    border: 2px solid var(--neo-blue-200, #bfdbfe);
    border-radius: 8rpx;
    
    .price-text {
      display: block;
      font-size: 32rpx;
      font-weight: 700;
      color: var(--neo-blue-600, #2563eb);
      margin-bottom: 8rpx;
    }
    
    .price-note {
      display: block;
      font-size: 24rpx;
      color: var(--neo-gray-500, #6b7280);
    }
  }
}

/* 底部按钮 */
.modal-footer {
  display: flex;
  gap: 24rpx;
  margin-top: 40rpx;
  
  .interest-btn {
    flex: 1;
    padding: 24rpx;
    background-color: var(--neo-primary, #FF006E);
    border: 3px solid var(--neo-black, #000000);
    border-radius: 8rpx;
    box-shadow: 4rpx 4rpx 0 var(--neo-black, #000000);
    
    &:active {
      transform: translateX(2rpx) translateY(2rpx);
      box-shadow: 2rpx 2rpx 0 var(--neo-black, #000000);
    }
    
    .btn-text {
      display: block;
      text-align: center;
      font-size: 28rpx;
      font-weight: 700;
      color: var(--neo-white, #ffffff);
    }
  }
  
  .close-btn-secondary {
    flex: 1;
    padding: 24rpx;
    background-color: var(--neo-white, #ffffff);
    border: 3px solid var(--neo-black, #000000);
    border-radius: 8rpx;
    box-shadow: 4rpx 4rpx 0 var(--neo-black, #000000);
    
    &:active {
      transform: translateX(2rpx) translateY(2rpx);
      box-shadow: 2rpx 2rpx 0 var(--neo-black, #000000);
    }
    
    .btn-text-secondary {
      display: block;
      text-align: center;
      font-size: 28rpx;
      font-weight: 700;
      color: var(--neo-black, #000000);
    }
  }
}

/* 小程序端特殊处理 */
/* #ifdef MP-WEIXIN */
.modal-overlay {
  /* 小程序端需要处理安全区域 */
  padding-bottom: env(safe-area-inset-bottom);
}
/* #endif */

/* H5端响应式 */
/* #ifdef H5 */
@media (min-width: 768px) {
  .modal-container {
    max-width: 800rpx;
  }
  
  .modal-content {
    padding: 64rpx 48rpx 48rpx;
  }
  
  .modal-footer {
    flex-direction: row;
    gap: 32rpx;
  }
}
/* #endif */
</style>