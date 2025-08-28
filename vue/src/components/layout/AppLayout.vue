<template>
  <div class="app-layout min-h-screen flex flex-col bg-white">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <slot />
    </main>
    
    <!-- Footer -->
    <AppFooter :show-stats="showFooterStats" />
    
    <!-- PWA Install Prompt -->
    <PWAInstallPrompt v-if="showPWAPrompt" @close="closePWAPrompt" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import PWAInstallPrompt from '@/components/common/PWAInstallPrompt.vue'

// Props
defineProps<{
  showFooterStats?: boolean
}>()

// PWA Install Prompt
const showPWAPrompt = ref(false)

// Check if should show PWA install prompt
onMounted(() => {
  // Show PWA prompt on first visit
  const hasShownPWA = localStorage.getItem('pwa-prompt-shown')
  if (!hasShownPWA && 'serviceWorker' in navigator) {
    setTimeout(() => {
      showPWAPrompt.value = true
    }, 3000) // Show after 3 seconds
  }
})

const closePWAPrompt = () => {
  showPWAPrompt.value = false
  localStorage.setItem('pwa-prompt-shown', 'true')
}
</script>

<style scoped>
/* Layout样式 */
.app-layout {
  background: white;
  min-height: 100vh;
}

/* 确保内容区域正确间距 */
main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 容器最大宽度 */
.container {
  max-width: 1200px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  main {
    padding: 1rem;
  }
}
</style>