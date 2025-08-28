<template>
  <div class="pwa-prompt fixed bottom-4 right-4 z-50">
    <div class="neo-card p-4 bg-primary-blue text-white max-w-sm">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center space-x-2">
          <div class="neo-icon bg-white text-primary-blue">
            📱
          </div>
          <h3 class="font-bold">安装应用</h3>
        </div>
        <button @click="emit('close')" class="text-white hover:text-gray-200">
          ✕
        </button>
      </div>
      
      <p class="text-sm mb-4">
        安装CSS数创学习平台到你的设备，享受离线学习体验！
      </p>
      
      <div class="flex space-x-2">
        <button 
          @click="installPWA"
          class="neo-btn bg-white text-primary-blue flex-1 text-sm py-2"
        >
          立即安装
        </button>
        <button 
          @click="emit('close')"
          class="neo-btn-secondary bg-transparent border-white text-white flex-1 text-sm py-2"
        >
          稍后
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Events
const emit = defineEmits<{
  close: []
}>()

// PWA install event
let deferredPrompt: any = null

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
})

const installPWA = async () => {
  if (deferredPrompt) {
    // Show install prompt
    deferredPrompt.prompt()
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted PWA install')
    } else {
      console.log('User dismissed PWA install')
    }
    
    // Clear the deferred prompt
    deferredPrompt = null
  } else {
    // Fallback: Show manual install instructions
    alert('请在浏览器菜单中选择"添加到主屏幕"或"安装应用"')
  }
  
  // Close prompt
  emit('close')
}
</script>

<style scoped>
/* PWA提示框特殊样式 */
.pwa-prompt .neo-card {
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
}

/* 确保在小屏幕上正确显示 */
@media (max-width: 480px) {
  .pwa-prompt {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
  
  .neo-card {
    max-width: none;
  }
}

/* 动画效果（轻微的滑入） */
.pwa-prompt {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>