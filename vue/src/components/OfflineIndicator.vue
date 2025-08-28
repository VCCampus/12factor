<template>
  <Transition name="slide-down">
    <div v-if="!isOnline" class="offline-indicator">
      <div class="offline-content">
        <div class="offline-icon">📱</div>
        <div class="offline-text">
          <strong>离线模式</strong>
          <span>正在使用缓存内容</span>
        </div>
        <button @click="checkConnection" class="retry-btn">
          <span class="retry-icon">🔄</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

function updateOnlineStatus() {
  isOnline.value = navigator.onLine
  
  if (!isOnline.value) {
    console.log('📱 应用进入离线模式')
  } else {
    console.log('🌐 应用恢复在线模式')
  }
}

function checkConnection() {
  // 尝试发送一个轻量级请求来检查连接
  fetch('/manifest.json', { 
    method: 'HEAD',
    cache: 'no-cache'
  }).then(() => {
    isOnline.value = true
  }).catch(() => {
    isOnline.value = false
  })
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.offline-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.offline-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.offline-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  text-align: center;
}

.offline-text strong {
  font-weight: 700;
  font-size: 14px;
}

.offline-text span {
  font-size: 12px;
  opacity: 0.9;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  flex-shrink: 0;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.retry-icon {
  font-size: 14px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 过渡动画 */
.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.3s ease-in;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .offline-content {
    padding: 10px 16px;
    gap: 12px;
  }
  
  .offline-icon {
    font-size: 20px;
  }
  
  .offline-text {
    text-align: left;
  }
  
  .offline-text strong {
    font-size: 13px;
  }
  
  .offline-text span {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .offline-content {
    padding: 8px 12px;
    gap: 8px;
  }
  
  .retry-btn {
    padding: 4px 8px;
    font-size: 11px;
  }
  
  .retry-icon {
    font-size: 12px;
  }
}
</style>