<template>
  <div class="mobile-nav-container">
    <!-- 标题区域 -->
    <div class="header-section">
      <h1 class="main-title">CSS数创班8期</h1>
      <p class="sub-title">Digital Venture Learning Platform</p>
    </div>
    
    <!-- 导航卡片网格 -->
    <div class="nav-grid">
      <!-- 市场温度计卡片 -->
      <router-link to="/thermometer" class="nav-card card-thermometer">
        <div class="card-icon">
          <span class="icon-text">🌡️</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">市场温度计</h3>
          <p class="card-subtitle">MARKET TEMPERATURE</p>
          <p class="card-desc">实时股票与加密货币情绪指标</p>
        </div>
        <div class="card-arrow">
          <span class="arrow-text">→</span>
        </div>
      </router-link>
      
      <!-- 学习中心卡片 -->
      <router-link to="/principles" class="nav-card card-principles">
        <div class="card-icon">
          <span class="icon-text">🧠</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">学习中心</h3>
          <p class="card-subtitle">FLASHCARDS & QUIZES</p>
          <p class="card-desc">AI与加密货币行业知识闪卡</p>
        </div>
        <div class="card-arrow">
          <span class="arrow-text">→</span>
        </div>
      </router-link>
      
      <!-- 模拟面试卡片 -->
      <router-link to="/interview" class="nav-card card-interview">
        <div class="card-icon">
          <span class="icon-text">👨‍💼</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">模拟面试</h3>
          <p class="card-subtitle">VIRTUAL HIRING SIMULATOR</p>
          <p class="card-desc">多岗位模拟面试与简历优化</p>
        </div>
        <div class="card-arrow">
          <span class="arrow-text">→</span>
        </div>
      </router-link>
      
      <!-- 会员服务卡片 -->
      <button class="nav-card card-membership" @click="openMembershipModal">
        <div class="card-icon">
          <span class="icon-text">💎</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">会员服务</h3>
          <p class="card-subtitle">PREMIUM MEMBERSHIP</p>
          <p class="card-desc">专属学习资源与定制服务</p>
        </div>
        <div class="card-arrow">
          <span class="arrow-text">→</span>
        </div>
      </button>
    </div>
    
    <!-- 底部信息 -->
    <div class="footer-section">
      <p class="preview-text">PREVIEW LAUNCH: SEPT 1ST (MON)</p>
      <div class="membership-banner">
        <p class="membership-text">MEMBERSHIP: ¥99/YEAR (TBD)</p>
        <p class="join-text">JOIN US! PRODUCT & MARKETING TEAM</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 会员服务弹窗
const emit = defineEmits<{
  openMembership: []
}>()

const openMembershipModal = () => {
  emit('openMembership')
}
</script>

<style scoped>
.mobile-nav-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
  min-height: 100vh;
}

/* 标题区域 */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.main-title {
  font-size: 4rem;
  font-weight: 900;
  color: #FF006E;
  text-shadow: 4px 4px 0 black;
  margin-bottom: 1rem;
  letter-spacing: 0.1rem;
}

.sub-title {
  font-size: 1.4rem;
  color: #666666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
}

/* 导航卡片网格 */
.nav-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.nav-card {
  display: flex;
  align-items: center;
  padding: 2rem;
  border: 4px solid black;
  border-radius: 1rem;
  background-color: white;
  transition: all 0.2s ease;
  position: relative;
  text-decoration: none;
  color: inherit;
  
  &:active {
    transform: translateX(6px) translateY(6px);
  }
}

.card-icon {
  flex-shrink: 0;
  width: 6rem;
  height: 6rem;
  border-radius: 1rem;
  border: 3px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
}

.icon-text {
  font-size: 3.5rem;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.card-subtitle {
  font-size: 1.2rem;
  color: #666666;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  letter-spacing: 0.05rem;
}

.card-desc {
  font-size: 1.4rem;
  color: #374151;
  line-height: 1.4;
}

.card-arrow {
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 3px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.arrow-text {
  font-size: 2.25rem;
  font-weight: 700;
  color: black;
}

/* 卡片主题色彩 */
.card-thermometer {
  background-color: #eff6ff;
  box-shadow: 8px 8px 0 #3b82f6;
}

.card-thermometer .card-icon {
  background-color: #dbeafe;
}

.card-thermometer .card-arrow {
  background-color: #dbeafe;
}

.card-principles {
  background-color: #f0fdf4;
  box-shadow: 8px 8px 0 #22c55e;
}

.card-principles .card-icon {
  background-color: #dcfce7;
}

.card-principles .card-arrow {
  background-color: #dcfce7;
}

.card-interview {
  background-color: #faf5ff;
  box-shadow: 8px 8px 0 #a855f7;
}

.card-interview .card-icon {
  background-color: #f3e8ff;
}

.card-interview .card-arrow {
  background-color: #f3e8ff;
}

.card-membership {
  background-color: #fefce8;
  box-shadow: 8px 8px 0 #eab308;
}

.card-membership .card-icon {
  background-color: #fef3c7;
}

.card-membership .card-arrow {
  background-color: #fef3c7;
}

/* 底部信息 */
.footer-section {
  text-align: center;
}

.preview-text {
  font-size: 1.2rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  letter-spacing: 0.05rem;
}

.membership-banner {
  padding: 1.5rem;
  background-color: #fef3c7;
  border: 3px solid #eab308;
  border-radius: 0.75rem;
  box-shadow: 4px 4px 0 #ca8a04;
}

.membership-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: black;
  margin-bottom: 0.5rem;
}

.join-text {
  font-size: 1.2rem;
  color: #374151;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
}

/* 响应式设计 */
@media (min-width: 640px) {
  .nav-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .mobile-nav-container {
    max-width: 75rem;
    margin: 0 auto;
    padding: 4rem;
  }
  
  .nav-grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}
</style>