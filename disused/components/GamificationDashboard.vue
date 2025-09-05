<template>
  <div class="gamification-dashboard">
    <!-- 用户等级卡片 -->
    <div class="level-card">
      <div class="level-header">
        <div class="level-badge">{{ currentLevelInfo.badge }}</div>
        <div class="level-info">
          <h3 class="level-title">{{ currentLevelInfo.title }}</h3>
          <div class="level-number">等级 {{ currentLevel }}</div>
        </div>
      </div>
      
      <div class="level-progress-container">
        <div class="progress-info">
          <span class="current-points">{{ totalPoints }} 积分</span>
          <span class="next-level" v-if="nextLevelInfo">
            距离 {{ nextLevelInfo.title }} 还需 {{ nextLevelInfo.minPoints - totalPoints }} 积分
          </span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill level-progress"
            :style="{ width: `${levelProgress}%` }"
          ></div>
        </div>
      </div>
      
      <div class="level-benefits" v-if="currentLevelInfo.benefits.length > 0">
        <h4>当前等级特权：</h4>
        <ul>
          <li v-for="benefit in currentLevelInfo.benefits" :key="benefit">
            ✅ {{ benefit }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 快速统计 -->
    <div class="quick-stats-grid">
      <div class="stat-item">
        <div class="stat-icon">🔥</div>
        <div class="stat-content">
          <div class="stat-value">{{ streaks.daily?.current || 0 }}</div>
          <div class="stat-label">连续学习天数</div>
          <div class="stat-multiplier" v-if="getCurrentMultiplier() > 1">
            {{ getCurrentMultiplier().toFixed(1) }}x 积分加成
          </div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">🏆</div>
        <div class="stat-content">
          <div class="stat-value">{{ unlockedAchievements.length }}</div>
          <div class="stat-label">解锁成就</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-value">{{ unlockedBadges.length }}</div>
          <div class="stat-label">获得徽章</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <div class="stat-value">{{ weeklyPoints }}</div>
          <div class="stat-label">本周积分</div>
        </div>
      </div>
    </div>

    <!-- 最近成就和徽章 -->
    <div class="recent-rewards">
      <h3 class="section-title">🎉 最近获得</h3>
      
      <div class="rewards-grid">
        <!-- 最近解锁的成就 -->
        <div class="reward-section">
          <h4 class="reward-title">成就</h4>
          <div class="reward-list">
            <div 
              v-for="achievement in recentAchievements" 
              :key="achievement.id"
              class="reward-item achievement"
              :class="`tier-${achievement.tier}`"
            >
              <div class="reward-icon">{{ achievement.icon }}</div>
              <div class="reward-info">
                <div class="reward-name">{{ achievement.name }}</div>
                <div class="reward-description">{{ achievement.description }}</div>
                <div class="reward-date">{{ formatRewardDate(achievement.unlockedDate) }}</div>
              </div>
              <div class="reward-points">+{{ achievement.points }}</div>
            </div>
          </div>
        </div>

        <!-- 最近解锁的徽章 -->
        <div class="reward-section">
          <h4 class="reward-title">徽章</h4>
          <div class="reward-list">
            <div 
              v-for="badge in recentBadges" 
              :key="badge.id"
              class="reward-item badge"
              :class="`rarity-${badge.rarity}`"
            >
              <div class="reward-icon">{{ badge.icon }}</div>
              <div class="reward-info">
                <div class="reward-name">{{ badge.name }}</div>
                <div class="reward-description">{{ badge.description }}</div>
                <div class="reward-date">{{ formatRewardDate(badge.unlockedDate) }}</div>
              </div>
              <div class="rarity-badge">{{ getRarityText(badge.rarity) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 进行中的挑战 -->
    <div class="active-challenges">
      <h3 class="section-title">🎯 进行中的挑战</h3>
      
      <div class="challenges-grid">
        <!-- 接近完成的徽章 -->
        <div 
          v-for="badge in nearCompletionBadges" 
          :key="badge.id"
          class="challenge-item"
        >
          <div class="challenge-header">
            <div class="challenge-icon">{{ badge.icon }}</div>
            <div class="challenge-info">
              <h4 class="challenge-name">{{ badge.name }}</h4>
              <p class="challenge-description">{{ badge.description }}</p>
            </div>
          </div>
          
          <div class="challenge-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill challenge-fill"
                :style="{ width: `${badge.progress}%` }"
              ></div>
            </div>
            <div class="progress-text">{{ badge.progress }}% 完成</div>
          </div>
          
          <div class="challenge-requirements">
            <div 
              v-for="req in badge.requirements" 
              :key="req.type"
              class="requirement-item"
            >
              <span class="req-description">{{ req.description }}</span>
              <span class="req-progress">{{ req.current }} / {{ req.target }}</span>
            </div>
          </div>
        </div>

        <!-- 接近完成的成就 -->
        <div 
          v-for="achievement in nearCompletionAchievements" 
          :key="achievement.id"
          class="challenge-item"
        >
          <div class="challenge-header">
            <div class="challenge-icon">{{ achievement.icon }}</div>
            <div class="challenge-info">
              <h4 class="challenge-name">{{ achievement.name }}</h4>
              <p class="challenge-description">{{ achievement.description }}</p>
            </div>
          </div>
          
          <div class="challenge-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill achievement-fill"
                :style="{ width: `${achievement.progress}%` }"
              ></div>
            </div>
            <div class="progress-text">{{ achievement.progress }}% 完成</div>
          </div>
          
          <div class="achievement-reward">
            <span class="reward-points">+{{ achievement.points }} 积分</span>
            <span class="tier-badge" :class="`tier-${achievement.tier}`">
              {{ getTierText(achievement.tier) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 积分历史 -->
    <div class="points-history" v-if="recentPointsHistory.length > 0">
      <h3 class="section-title">📊 积分记录</h3>
      
      <div class="history-list">
        <div 
          v-for="history in recentPointsHistory" 
          :key="history.id"
          class="history-item"
        >
          <div class="history-time">{{ formatHistoryTime(history.timestamp) }}</div>
          <div class="history-action">{{ history.description }}</div>
          <div class="history-points" :class="{ positive: history.points > 0, negative: history.points < 0 }">
            {{ history.points > 0 ? '+' : '' }}{{ history.points }}
          </div>
        </div>
      </div>
    </div>

    <!-- 等级奖励预览 -->
    <div class="level-preview" v-if="nextLevelInfo">
      <h3 class="section-title">🎁 下级奖励预览</h3>
      
      <div class="next-level-card">
        <div class="next-level-header">
          <div class="next-level-badge">{{ nextLevelInfo.badge }}</div>
          <div class="next-level-info">
            <h4>{{ nextLevelInfo.title }}</h4>
            <p>等级 {{ nextLevelInfo.level }}</p>
          </div>
        </div>
        
        <div class="next-level-benefits">
          <h5>解锁特权：</h5>
          <ul>
            <li v-for="benefit in nextLevelInfo.benefits" :key="benefit">
              🔓 {{ benefit }}
            </li>
          </ul>
        </div>
        
        <div class="next-level-progress">
          <p>还需 <strong>{{ nextLevelInfo.minPoints - totalPoints }}</strong> 积分升级</p>
          <button class="earn-points-btn" @click="$emit('show-earning-tips')">
            💡 查看获取积分方法
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGamificationStore } from '@/stores/gamification'

const gamificationStore = useGamificationStore()

// 计算属性
const {
  totalPoints,
  currentLevel,
  currentLevelInfo,
  nextLevelInfo,
  levelProgress,
  unlockedBadges,
  unlockedAchievements,
  weeklyPoints,
  streaks,
  badges,
  achievements,
  pointsHistory,
  getCurrentMultiplier
} = gamificationStore

const recentAchievements = computed(() => {
  return unlockedAchievements
    .filter((a: any) => a.unlockedDate)
    .sort((a: any, b: any) => new Date(b.unlockedDate!).getTime() - new Date(a.unlockedDate!).getTime())
    .slice(0, 3)
})

const recentBadges = computed(() => {
  return unlockedBadges
    .filter((b: any) => b.unlockedDate)
    .sort((a: any, b: any) => new Date(b.unlockedDate!).getTime() - new Date(a.unlockedDate!).getTime())
    .slice(0, 3)
})

const nearCompletionBadges = computed(() => {
  return badges
    .filter((b: any) => !b.unlocked && b.progress > 0)
    .sort((a: any, b: any) => b.progress - a.progress)
    .slice(0, 3)
})

const nearCompletionAchievements = computed(() => {
  return achievements
    .filter((a: any) => !a.unlocked && a.progress > 0)
    .sort((a: any, b: any) => b.progress - a.progress)
    .slice(0, 3)
})

const recentPointsHistory = computed(() => {
  return pointsHistory.slice(0, 10)
})

// 方法
function formatRewardDate(dateStr?: string): string {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天获得'
  if (diffDays === 1) return '昨天获得'
  if (diffDays < 7) return `${diffDays}天前获得`
  return date.toLocaleDateString('zh-CN')
}

function formatHistoryTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffMinutes < 1) return '刚刚'
  if (diffMinutes < 60) return `${diffMinutes}分钟前`
  if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)}小时前`
  return date.toLocaleDateString('zh-CN')
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

// 定义 emits
defineEmits<{
  'show-earning-tips': []
}>()
</script>

<style scoped>
.gamification-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 等级卡片 */
.level-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.level-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.level-badge {
  font-size: 64px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.level-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.level-number {
  font-size: 16px;
  opacity: 0.9;
}

.level-progress-container {
  margin-bottom: 24px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.current-points {
  font-size: 18px;
  font-weight: 600;
}

.next-level {
  font-size: 14px;
  opacity: 0.8;
}

.progress-bar {
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
}

.level-progress {
  background: linear-gradient(90deg, #ffd700, #ffed4a);
}

.level-benefits ul {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}

.level-benefits li {
  padding: 4px 0;
  font-size: 14px;
}

/* 快速统计 */
.quick-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.stat-multiplier {
  font-size: 10px;
  color: #f59e0b;
  font-weight: 600;
  margin-top: 2px;
}

/* 区块标题 */
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 最近奖励 */
.recent-rewards {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.reward-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 16px;
}

.reward-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  background: #fefefe;
  transition: all 0.2s ease;
}

.reward-item:hover {
  border-color: #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.reward-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.reward-info {
  flex: 1;
}

.reward-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  margin-bottom: 2px;
}

.reward-description {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.reward-date {
  font-size: 10px;
  color: #10b981;
  font-weight: 500;
}

.reward-points {
  font-size: 12px;
  font-weight: 600;
  color: #f59e0b;
  padding: 2px 6px;
  background: #fef3c7;
  border-radius: 8px;
}

.rarity-badge,
.tier-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  text-transform: uppercase;
}

/* 稀有度颜色 */
.rarity-common { background: #f1f5f9; color: #64748b; }
.rarity-uncommon { background: #dcfce7; color: #166534; }
.rarity-rare { background: #dbeafe; color: #1e40af; }
.rarity-epic { background: #fce7f3; color: #be185d; }
.rarity-legendary { background: #fbbf24; color: #92400e; }

/* 等级颜色 */
.tier-bronze { background: #fed7aa; color: #c2410c; }
.tier-silver { background: #e2e8f0; color: #475569; }
.tier-gold { background: #fef3c7; color: #92400e; }
.tier-platinum { background: #e0e7ff; color: #3730a3; }

/* 进行中的挑战 */
.active-challenges {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
}

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.challenge-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.challenge-item:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.challenge-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.challenge-icon {
  font-size: 24px;
}

.challenge-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px;
}

.challenge-description {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.challenge-progress {
  margin-bottom: 16px;
}

.progress-fill.challenge-fill {
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
}

.progress-fill.achievement-fill {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.progress-text {
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
  text-align: center;
  font-weight: 600;
}

.challenge-requirements {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.requirement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.req-description {
  color: #475569;
}

.req-progress {
  color: #1e293b;
  font-weight: 600;
}

.achievement-reward {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

/* 积分历史 */
.points-history {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 14px;
}

.history-time {
  color: #64748b;
  font-size: 12px;
  min-width: 80px;
}

.history-action {
  flex: 1;
  color: #374151;
}

.history-points {
  font-weight: 600;
  font-size: 16px;
}

.history-points.positive {
  color: #10b981;
}

.history-points.negative {
  color: #ef4444;
}

/* 等级预览 */
.level-preview {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
}

.next-level-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 24px;
}

.next-level-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.next-level-badge {
  font-size: 48px;
}

.next-level-info h4 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px;
}

.next-level-info p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.next-level-benefits {
  margin-bottom: 20px;
}

.next-level-benefits h5 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px;
}

.next-level-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-level-benefits li {
  font-size: 13px;
  color: #475569;
  padding: 4px 0;
}

.next-level-progress {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.next-level-progress p {
  margin: 0 0 16px;
  color: #374151;
}

.earn-points-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.earn-points-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gamification-dashboard {
    padding: 16px;
    gap: 24px;
  }
  
  .level-card {
    padding: 24px;
  }
  
  .level-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .level-badge {
    font-size: 48px;
  }
  
  .quick-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .stat-item {
    padding: 16px;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .rewards-grid,
  .challenges-grid {
    grid-template-columns: 1fr;
  }
  
  .reward-item,
  .challenge-item {
    padding: 16px;
  }
  
  .progress-info {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .quick-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .history-item {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .history-time {
    min-width: auto;
  }
}
</style>