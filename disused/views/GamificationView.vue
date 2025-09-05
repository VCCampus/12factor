<template>
  <AppLayout>
    <div class="gamification-view">
      <!-- 页面头部 -->
      <div class="header-section">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-text-dark mb-4">🎮 成就中心</h1>
          <p class="text-gray-600 mb-6">追踪你的学习成就，解锁专属徽章和等级特权</p>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-section" v-if="gamificationStore.isLoading">
        <div class="neo-card p-8 text-center">
          <div class="loading-icon mb-4">🎯</div>
          <h2 class="text-xl font-bold mb-2">加载成就数据...</h2>
          <p class="text-gray-600">正在获取你的学习成果</p>
        </div>
      </div>

      <!-- 主要内容 -->
      <div class="main-content" v-else-if="gamificationStore.isInitialized">
        <!-- 游戏化仪表板 -->
        <GamificationDashboard @show-earning-tips="showEarningTips = true" />

        <!-- 全部徽章和成就 -->
        <div class="full-collections">
          <!-- 所有徽章 -->
          <div class="badges-section">
            <div class="section-header">
              <h3 class="section-title">🎯 徽章收集</h3>
              <div class="section-stats">
                {{ gamificationStore.unlockedBadges.length }} / {{ gamificationStore.badges.length }} 已解锁
              </div>
            </div>
            
            <div class="badges-grid">
              <div 
                v-for="badge in gamificationStore.badges" 
                :key="badge.id"
                class="badge-card"
                :class="{ 
                  unlocked: badge.unlocked,
                  [`rarity-${badge.rarity}`]: true
                }"
              >
                <div class="badge-icon" :class="{ dimmed: !badge.unlocked }">
                  {{ badge.icon }}
                </div>
                <div class="badge-info">
                  <h4 class="badge-name">{{ badge.name }}</h4>
                  <p class="badge-description">{{ badge.description }}</p>
                  <div class="badge-meta">
                    <span class="badge-rarity">{{ getRarityText(badge.rarity) }}</span>
                    <span class="badge-category">{{ getCategoryText(badge.category) }}</span>
                  </div>
                </div>
                
                <div class="badge-status">
                  <div v-if="badge.unlocked" class="badge-unlocked">
                    <div class="unlock-date">{{ formatUnlockDate(badge.unlockedDate) }}</div>
                    <div class="unlock-badge">✅</div>
                  </div>
                  <div v-else class="badge-progress">
                    <div class="progress-circle" :style="{ '--progress': badge.progress }">
                      <span class="progress-text">{{ badge.progress }}%</span>
                    </div>
                    <div class="requirements-hint">
                      <div v-for="req in badge.requirements" :key="req.type" class="requirement">
                        {{ req.current }} / {{ req.target }} {{ req.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 所有成就 -->
          <div class="achievements-section">
            <div class="section-header">
              <h3 class="section-title">🏆 成就解锁</h3>
              <div class="section-stats">
                {{ gamificationStore.unlockedAchievements.length }} / {{ gamificationStore.achievements.length }} 已解锁
              </div>
            </div>
            
            <div class="achievements-grid">
              <div 
                v-for="achievement in gamificationStore.achievements" 
                :key="achievement.id"
                class="achievement-card"
                :class="{ 
                  unlocked: achievement.unlocked,
                  [`tier-${achievement.tier}`]: true
                }"
              >
                <div class="achievement-header">
                  <div class="achievement-icon" :class="{ dimmed: !achievement.unlocked }">
                    {{ achievement.icon }}
                  </div>
                  <div class="achievement-tier">
                    <span class="tier-badge" :class="`tier-${achievement.tier}`">
                      {{ getTierText(achievement.tier) }}
                    </span>
                  </div>
                </div>
                
                <div class="achievement-content">
                  <h4 class="achievement-name">{{ achievement.name }}</h4>
                  <p class="achievement-description">{{ achievement.description }}</p>
                  
                  <div class="achievement-reward">
                    <span class="points-reward">+{{ achievement.points }} 积分</span>
                  </div>
                </div>
                
                <div class="achievement-status">
                  <div v-if="achievement.unlocked" class="achievement-unlocked">
                    <div class="unlock-date">{{ formatUnlockDate(achievement.unlockedDate) }}</div>
                    <div class="unlock-icon">🎉</div>
                  </div>
                  <div v-else class="achievement-progress">
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: `${achievement.progress}%` }"
                        :class="`fill-${achievement.tier}`"
                      ></div>
                    </div>
                    <div class="progress-text">{{ achievement.progress }}% 完成</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div class="error-section" v-else-if="gamificationStore.error">
        <div class="neo-card p-8 text-center">
          <div class="error-icon mb-4">❌</div>
          <h2 class="text-xl font-bold mb-2 text-red-600">加载失败</h2>
          <p class="text-gray-600 mb-6">{{ gamificationStore.error }}</p>
          <button @click="retryInit" class="neo-btn">重试</button>
        </div>
      </div>
    </div>

    <!-- 积分获取技巧对话框 -->
    <EarningTipsModal 
      v-if="showEarningTips" 
      @close="showEarningTips = false" 
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import GamificationDashboard from '@/components/GamificationDashboard.vue'
import EarningTipsModal from '@/components/EarningTipsModal.vue'
import { useGamificationStore } from '@/stores/gamification'

const gamificationStore = useGamificationStore()
const showEarningTips = ref(false)

// 方法
async function initializeGamification() {
  try {
    await gamificationStore.initialize()
  } catch (error) {
    console.error('游戏化系统初始化失败:', error)
  }
}

async function retryInit() {
  await initializeGamification()
}

function getRarityText(rarity: string): string {
  const rarityMap = {
    common: '普通',
    uncommon: '优秀',
    rare: '稀有',
    epic: '史诗',
    legendary: '传奇'
  }
  return rarityMap[rarity as keyof typeof rarityMap] || '未知'
}

function getTierText(tier: string): string {
  const tierMap = {
    bronze: '青铜',
    silver: '白银',
    gold: '黄金',
    platinum: '铂金'
  }
  return tierMap[tier as keyof typeof tierMap] || '未知'
}

function getCategoryText(category: string): string {
  const categoryMap = {
    learning: '学习',
    consistency: '坚持',
    mastery: '精通',
    social: '社交',
    special: '特殊'
  }
  return categoryMap[category as keyof typeof categoryMap] || '其他'
}

function formatUnlockDate(dateStr?: string): string {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 生命周期
onMounted(async () => {
  await initializeGamification()
})
</script>

<style scoped>
.gamification-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  margin-bottom: 32px;
}

.loading-section,
.error-section {
  margin: 60px 0;
  text-align: center;
}

.loading-icon,
.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.loading-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* 完整收集区域 */
.full-collections {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.section-stats {
  font-size: 14px;
  color: #64748b;
  background: #f1f5f9;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}

/* 徽章网格 */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.badge-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.badge-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.badge-card.unlocked {
  border-color: #10b981;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1);
}

.badge-card.unlocked::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.badge-card:not(.unlocked) {
  opacity: 0.7;
}

.badge-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 稀有度边框色彩 */
.rarity-common::before { background: #94a3b8; }
.rarity-uncommon::before { background: linear-gradient(90deg, #10b981, #059669); }
.rarity-rare::before { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
.rarity-epic::before { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
.rarity-legendary::before { background: linear-gradient(90deg, #f59e0b, #d97706); }

.badge-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.badge-icon {
  font-size: 48px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.badge-icon.dimmed {
  opacity: 0.4;
  filter: grayscale(100%);
}

.badge-info {
  flex: 1;
}

.badge-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}

.badge-description {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px;
  line-height: 1.4;
}

.badge-meta {
  display: flex;
  gap: 12px;
}

.badge-rarity,
.badge-category {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-rarity {
  background: #f1f5f9;
  color: #475569;
}

.badge-category {
  background: #e0e7ff;
  color: #3730a3;
}

.badge-status {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.badge-unlocked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.unlock-date {
  font-size: 11px;
  color: #10b981;
  font-weight: 600;
}

.unlock-badge {
  font-size: 24px;
}

.badge-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.progress-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: conic-gradient(#3b82f6 calc(var(--progress) * 1%), #e2e8f0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: '';
  position: absolute;
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
}

.progress-text {
  font-size: 11px;
  font-weight: 700;
  color: #1e293b;
  position: relative;
  z-index: 1;
}

.requirements-hint {
  font-size: 10px;
  color: #64748b;
  text-align: center;
  max-width: 120px;
}

.requirement {
  margin-bottom: 4px;
}

/* 成就网格 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.achievement-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.achievement-card.unlocked {
  border-color: #f59e0b;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.1);
}

.achievement-card:not(.unlocked) {
  opacity: 0.7;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 等级边框色彩 */
.tier-bronze::before { background: linear-gradient(90deg, #92400e, #b45309); }
.tier-silver::before { background: linear-gradient(90deg, #64748b, #475569); }
.tier-gold::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
.tier-platinum::before { background: linear-gradient(90deg, #6366f1, #4f46e5); }

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.achievement-icon {
  font-size: 40px;
  transition: all 0.3s ease;
}

.achievement-icon.dimmed {
  opacity: 0.4;
  filter: grayscale(100%);
}

.tier-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tier-badge.tier-bronze { background: #fed7aa; color: #92400e; }
.tier-badge.tier-silver { background: #e2e8f0; color: #475569; }
.tier-badge.tier-gold { background: #fef3c7; color: #92400e; }
.tier-badge.tier-platinum { background: #e0e7ff; color: #3730a3; }

.achievement-content {
  margin-bottom: 16px;
}

.achievement-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}

.achievement-description {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px;
  line-height: 1.4;
}

.achievement-reward {
  display: flex;
  align-items: center;
}

.points-reward {
  font-size: 12px;
  font-weight: 600;
  color: #f59e0b;
  background: #fef3c7;
  padding: 4px 8px;
  border-radius: 12px;
}

.achievement-status {
  text-align: center;
}

.achievement-unlocked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.unlock-icon {
  font-size: 20px;
}

.achievement-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.6s ease;
}

.fill-bronze { background: linear-gradient(90deg, #92400e, #b45309); }
.fill-silver { background: linear-gradient(90deg, #64748b, #475569); }
.fill-gold { background: linear-gradient(90deg, #f59e0b, #d97706); }
.fill-platinum { background: linear-gradient(90deg, #6366f1, #4f46e5); }

.progress-text {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gamification-view {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    text-align: center;
  }
  
  .badges-grid,
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .badge-card {
    padding: 20px;
  }
  
  .badge-icon {
    font-size: 40px;
  }
  
  .achievement-card {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .badge-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .badge-status {
    align-items: center;
  }
  
  .progress-circle {
    width: 50px;
    height: 50px;
  }
  
  .progress-circle::before {
    width: 36px;
    height: 36px;
  }
}
</style>