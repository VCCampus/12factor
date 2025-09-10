<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleOverlayTap">
    <div class="modal-container" @click.stop>
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="closeModal">
        <span class="close-icon">✕</span>
      </button>
      
      <!-- 模态内容 -->
      <div class="modal-content">
        <!-- 标题 -->
        <div class="modal-header">
          <h2 class="modal-title">💎 会员服务</h2>
          <p class="modal-subtitle">PREMIUM MEMBERSHIP</p>
        </div>
        
        <!-- 内容区域 -->
        <div class="modal-body">
          <div class="coming-soon">
            <p class="coming-text">🚀 即将推出</p>
            <p class="launch-date">预计上线时间：9月1日</p>
          </div>
          
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">📚</span>
              <span class="feature-text">专属学习资源与课程</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎯</span>
              <span class="feature-text">个性化学习路径定制</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">👥</span>
              <span class="feature-text">产品与营销团队直接指导</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">💬</span>
              <span class="feature-text">专业导师一对一答疑</span>
            </div>
          </div>
          
          <div class="pricing-info">
            <p class="price-text">预计定价：¥99/年</p>
            <p class="price-note">* 最终价格以正式发布为准</p>
          </div>
        </div>
        
        <!-- 底部按钮 -->
        <div class="modal-footer">
          <button class="interest-btn" @click="showInterest">
            <span class="btn-text">我感兴趣</span>
          </button>
          <button class="close-btn-secondary" @click="closeModal">
            <span class="btn-text-secondary">稍后再说</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  alert('感谢您的关注！我们会及时通知您最新进展')
  
  // 关闭模态框
  setTimeout(() => {
    closeModal()
  }, 1000)
}
</script>

<style scoped>
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
  padding: 2rem;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  background-color: white;
  border: 4px solid black;
  border-radius: 1rem;
  box-shadow: 12px 12px 0 black;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 4rem;
  height: 4rem;
  background-color: #fee2e2;
  border: 3px solid black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  
  &:active {
    transform: scale(0.9);
  }
}

.close-icon {
  font-size: 2rem;
  font-weight: 700;
  color: black;
}

.modal-content {
  padding: 3rem 2rem 2rem;
}

/* 标题区域 */
.modal-header {
  text-align: center;
  margin-bottom: 3rem;
}

.modal-title {
  font-size: 3rem;
  font-weight: 900;
  color: #FF006E;
  text-shadow: 3px 3px 0 black;
  margin-bottom: 0.75rem;
}

.modal-subtitle {
  font-size: 1.2rem;
  color: #666666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

/* 内容区域 */
.modal-body {
}

.coming-soon {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 2rem;
  background-color: #fefce8;
  border: 3px solid #eab308;
  border-radius: 0.75rem;
}

.coming-text {
  font-size: 2.25rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.75rem;
}

.launch-date {
  font-size: 1.4rem;
  color: #374151;
}

.feature-list {
  margin-bottom: 2.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background-color: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
}

.feature-icon {
  font-size: 2.5rem;
  margin-right: 1.25rem;
}

.feature-text {
  font-size: 1.4rem;
  color: black;
  line-height: 1.4;
}

.pricing-info {
  text-align: center;
  padding: 1.5rem;
  background-color: #eff6ff;
  border: 2px solid #bfdbfe;
  border-radius: 0.5rem;
}

.price-text {
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.price-note {
  font-size: 1.2rem;
  color: #6b7280;
}

/* 底部按钮 */
.modal-footer {
  display: flex;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.interest-btn {
  flex: 1;
  padding: 1.5rem;
  background-color: #FF006E;
  border: 3px solid black;
  border-radius: 0.5rem;
  box-shadow: 4px 4px 0 black;
  cursor: pointer;
  
  &:active {
    transform: translateX(2px) translateY(2px);
    box-shadow: 2px 2px 0 black;
  }
}

.btn-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
}

.close-btn-secondary {
  flex: 1;
  padding: 1.5rem;
  background-color: white;
  border: 3px solid black;
  border-radius: 0.5rem;
  box-shadow: 4px 4px 0 black;
  cursor: pointer;
  
  &:active {
    transform: translateX(2px) translateY(2px);
    box-shadow: 2px 2px 0 black;
  }
}

.btn-text-secondary {
  font-size: 1.4rem;
  font-weight: 700;
  color: black;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .modal-container {
    max-width: 800px;
  }
  
  .modal-content {
    padding: 4rem 3rem 3rem;
  }
  
  .modal-footer {
    flex-direction: row;
    gap: 2rem;
  }
}
</style>