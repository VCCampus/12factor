<template>
  <AppLayout>
    <!-- 桌面端：热区图片导航 -->
    <div v-if="!isMobile" class="desktop-hero py-8">
      <HeroImageMap @open-membership="openMembershipModal" />
    </div>
    
    <!-- 移动端：卡片布局导航 -->
    <div v-else class="mobile-hero">
      <MobileNavigationCards @open-membership="openMembershipModal" />
    </div>
    
    <!-- 会员服务模态弹窗 -->
    <MembershipModal 
      :is-open="membershipModalOpen"
      @close="closeMembershipModal"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import HeroImageMap from '@/components/home/HeroImageMap.vue'
import MobileNavigationCards from '@/components/home/MobileNavigationCards.vue'
import MembershipModal from '@/components/home/MembershipModal.vue'
import { useResponsive } from '@/composables/useResponsive'

// 响应式状态
const { isMobile } = useResponsive()

// 模态弹窗状态
const membershipModalOpen = ref(false)

// 事件处理
const openMembershipModal = () => {
  membershipModalOpen.value = true
}

const closeMembershipModal = () => {
  membershipModalOpen.value = false
}
</script>

<style scoped>
/* 桌面端hero区域 */
.desktop-hero {
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 移动端hero区域 */
.mobile-hero {
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
  min-height: 100vh;
  padding: 1rem 0;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .desktop-hero {
    display: none;
  }
}

@media (min-width: 768px) {
  .mobile-hero {
    display: none;
  }
}

/* 确保模态弹窗在最顶层 */
:deep(.modal) {
  z-index: 1000;
}
</style>