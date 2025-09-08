<template>
  <!-- Modal背景层 -->
  <Teleport to="body">
    <Transition name="modal" appear>
      <div 
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Modal容器 -->
        <div class="flex min-h-full items-center justify-center p-4">
          <!-- Modal内容 -->
          <div 
            class="neo-modal relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all"
            @click.stop
          >
            <!-- 关闭按钮 -->
            <button
              @click="closeModal"
              class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="关闭"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <!-- Modal头部 -->
            <div class="text-center mb-6">
              <div class="neo-icon mx-auto mb-4 text-4xl">💎</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                会员服务即将推出
              </h3>
              <p class="text-gray-600">Coming Soon</p>
            </div>
            
            <!-- Modal内容 -->
            <div class="space-y-4 mb-6">
              <!-- 简化版本 - 根据决策只显示Coming Soon -->
              <div class="text-center">
                <div class="bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-300 rounded-lg p-6 mb-4">
                  <h4 class="text-lg font-semibold text-yellow-800 mb-2">
                    🚀 敬请期待
                  </h4>
                  <p class="text-yellow-700">
                    我们正在精心准备会员服务功能，将为您提供更丰富的学习资源和专属权益。
                  </p>
                </div>
                
                <!-- 预期功能预览（可选，简化版本） -->
                <div class="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p class="font-medium mb-2">即将推出的功能：</p>
                  <ul class="space-y-1 text-left">
                    <li>• 高级学习资料访问</li>
                    <li>• 专属模拟面试题库</li>
                    <li>• 个性化学习建议</li>
                    <li>• 优先技术支持</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <!-- Modal底部按钮 -->
            <div class="flex gap-3 justify-center">
              <button
                @click="closeModal"
                class="neo-btn-secondary px-6 py-2 text-sm font-medium"
              >
                关闭
              </button>
              
              <!-- 可选：关注更新按钮 -->
              <!-- <button
                @click="subscribeUpdates"
                class="neo-btn px-6 py-2 text-sm font-medium"
              >
                关注更新
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false
})

const emit = defineEmits<{
  close: []
}>()

// 本地响应式状态
const isOpen = ref(props.isOpen)

// 监听props变化
watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue
})

// 关闭模态框
const closeModal = () => {
  isOpen.value = false
  emit('close')
}

// 背景点击处理
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// 可选：订阅更新功能（当前未使用）
// const subscribeUpdates = () => {
//   console.log('Subscribe to membership updates')
//   emit('subscribe')
//   closeModal()
// }

// ESC键关闭
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

// 监听键盘事件
watch(isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleEscapeKey)
    document.body.style.overflow = 'hidden' // 防止背景滚动
  } else {
    document.removeEventListener('keydown', handleEscapeKey)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* neobrutalism modal样式 */
.neo-modal {
  border: 3px solid #000;
  box-shadow: 8px 8px 0px 0px #000;
  background: white;
}

/* neobrutalism按钮样式 */
.neo-btn {
  background: #FFE066;
  border: 2px solid #000;
  border-radius: 6px;
  color: #000;
  font-weight: 600;
  box-shadow: 3px 3px 0px 0px #000;
  transition: all 0.2s;
}

.neo-btn:hover {
  box-shadow: 4px 4px 0px 0px #000;
  transform: translate(-1px, -1px);
}

.neo-btn:active {
  box-shadow: 1px 1px 0px 0px #000;
  transform: translate(2px, 2px);
}

.neo-btn-secondary {
  background: #F3F4F6;
  border: 2px solid #000;
  border-radius: 6px;
  color: #000;
  font-weight: 600;
  box-shadow: 3px 3px 0px 0px #000;
  transition: all 0.2s;
}

.neo-btn-secondary:hover {
  background: #E5E7EB;
  box-shadow: 4px 4px 0px 0px #000;
  transform: translate(-1px, -1px);
}

.neo-btn-secondary:active {
  box-shadow: 1px 1px 0px 0px #000;
  transform: translate(2px, 2px);
}

/* neobrutalism图标样式 */
.neo-icon {
  background: #FFE066;
  border: 2px solid #000;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 0px 0px #000;
}

/* Modal动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-active .neo-modal,
.modal-leave-active .neo-modal {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .neo-modal,
.modal-leave-to .neo-modal {
  opacity: 0;
  transform: scale(0.9) translate(-10px, -10px);
}

/* 响应式适配 */
@media (max-width: 480px) {
  .neo-modal {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
}

/* 可访问性 */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .neo-btn,
  .neo-btn-secondary {
    transition: none;
  }
}

/* 确保高对比度模式兼容 */
@media (prefers-contrast: high) {
  .neo-modal {
    border-width: 4px;
  }
  
  .neo-btn,
  .neo-btn-secondary {
    border-width: 3px;
  }
}
</style>