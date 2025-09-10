<template>
  <view class="home-page">
    <!-- 桌面端：热区图片导航 -->
    <view v-if="!isMobile" class="desktop-hero">
      <HeroImageMap @open-membership="openMembershipModal" />
    </view>
    
    <!-- 移动端：卡片布局导航 -->
    <view v-else class="mobile-hero">
      <MobileNavigationCards @open-membership="openMembershipModal" />
    </view>
    
    <!-- 会员服务模态弹窗 -->
    <MembershipModal 
      :is-open="membershipModalOpen"
      @close="closeMembershipModal"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onLoad, onShow } from 'vue'
import HeroImageMap from '@/components/home/HeroImageMap.vue'
import MobileNavigationCards from '@/components/home/MobileNavigationCards.vue' 
import MembershipModal from '@/components/home/MembershipModal.vue'

// 响应式检测
const isMobile = computed(() => {
  // #ifdef H5
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768
  }
  return false
  // #endif
  
  // #ifdef MP-WEIXIN
  return true // 小程序端始终使用移动布局
  // #endif
  
  // #ifndef H5 || MP-WEIXIN
  return true // 其他端默认移动布局
  // #endif
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

// 页面生命周期
onLoad(() => {
  console.log('首页加载完成 - 热区导航已集成')
})

onShow(() => {
  console.log('首页显示 - 检查响应式布局:', { isMobile: isMobile.value })
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: var(--neo-white);
}

/* 桌面端hero区域 */
.desktop-hero {
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--neo-spacing-2xl);
}

/* 移动端hero区域 */
.mobile-hero {
  padding: var(--neo-spacing-lg);
  background: var(--neo-white);
}

/* 响应式处理 */
/* #ifdef H5 */
@media (max-width: 768px) {
  .desktop-hero {
    display: none;
  }
}

@media (min-width: 769px) {
  .mobile-hero {
    display: none;
  }
}
/* #endif */
</style>