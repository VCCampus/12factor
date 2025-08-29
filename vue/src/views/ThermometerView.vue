<template>
  <div class="thermometer-container">
    <h1 class="page-title">学习温度计</h1>
    
    <div class="thermometer-wrapper">
      <div class="thermometer">
        <div class="thermometer-tube">
          <div 
            class="thermometer-mercury"
            :style="{ height: temperature + '%' }"
            :class="temperatureClass"
          ></div>
        </div>
        <div class="thermometer-bulb" :class="temperatureClass"></div>
        
        <!-- 刻度标记 -->
        <div class="thermometer-scale">
          <div class="scale-mark" v-for="i in 11" :key="i" :style="{ bottom: (i - 1) * 10 + '%' }">
            <span class="scale-value">{{ (i - 1) * 10 }}</span>
          </div>
        </div>
      </div>
      
      <div class="temperature-info">
        <h2 class="temperature-value">{{ temperature }}°</h2>
        <p class="temperature-label">{{ temperatureLabel }}</p>
        <p class="temperature-desc">{{ temperatureDescription }}</p>
      </div>
    </div>
    
    <div class="metrics-grid">
      <div class="metric-card" v-for="metric in metrics" :key="metric.name">
        <div class="metric-header">
          <span class="metric-icon">{{ metric.icon }}</span>
          <h3 class="metric-title">{{ metric.name }}</h3>
        </div>
        <div class="metric-value">{{ metric.value }}{{ metric.unit }}</div>
        <div class="metric-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: metric.progress + '%' }"
              :class="getProgressClass(metric.progress)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <button @click="refreshMetrics" class="btn btn-primary">
        刷新数据
      </button>
      <button @click="showDetails" class="btn btn-secondary">
        查看详情
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/progress'

const progressStore = useProgressStore()

const temperature = ref(0)
const metrics = ref([
  { name: '完成度', value: 0, unit: '%', progress: 0, icon: '✅' },
  { name: '活跃度', value: 0, unit: '天', progress: 0, icon: '🔥' },
  { name: '正确率', value: 0, unit: '%', progress: 0, icon: '🎯' },
  { name: '学习时长', value: 0, unit: '小时', progress: 0, icon: '⏰' }
])

const temperatureClass = computed(() => {
  if (temperature.value < 30) return 'cold'
  if (temperature.value < 60) return 'warm'
  if (temperature.value < 80) return 'hot'
  return 'very-hot'
})

const temperatureLabel = computed(() => {
  if (temperature.value < 30) return '需要加油'
  if (temperature.value < 60) return '稳步前进'
  if (temperature.value < 80) return '表现优秀'
  return '学霸模式'
})

const temperatureDescription = computed(() => {
  if (temperature.value < 30) return '建议增加学习频率，保持学习热情'
  if (temperature.value < 60) return '学习进度良好，继续保持'
  if (temperature.value < 80) return '学习效果显著，离目标更近了'
  return '恭喜！您的学习状态非常出色'
})

const getProgressClass = (progress: number) => {
  if (progress < 30) return 'progress-low'
  if (progress < 60) return 'progress-medium'
  if (progress < 80) return 'progress-high'
  return 'progress-excellent'
}

const calculateTemperature = () => {
  const stats = progressStore.userStats
  
  // 计算各项指标
  const completedPrinciples = stats.completedPrinciples
  const totalPrinciples = stats.totalPrinciples
  const completionRate = (completedPrinciples / totalPrinciples) * 100
  
  const averageScore = stats.averageQuizScore
  
  const lastActive = stats.streak.lastStudyDate 
    ? new Date(stats.streak.lastStudyDate) 
    : new Date()
  const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
  const activityScore = Math.max(0, 100 - daysSinceActive * 10)
  
  const totalTime = stats.totalStudyTime || 0
  const timeScore = Math.min(100, (totalTime / 60) * 10) // 每6分钟10分
  
  // 更新指标
  metrics.value = [
    { name: '完成度', value: Math.round(completionRate), unit: '%', progress: completionRate, icon: '✅' },
    { name: '连续天数', value: stats.streak.currentStreak, unit: '天', progress: Math.min(100, stats.streak.currentStreak * 10), icon: '🔥' },
    { name: '平均分', value: Math.round(averageScore), unit: '%', progress: averageScore, icon: '🎯' },
    { name: '学习时长', value: Math.round(totalTime / 60), unit: '小时', progress: timeScore, icon: '⏰' }
  ]
  
  // 计算综合温度
  temperature.value = Math.round(
    (completionRate * 0.3 + activityScore * 0.2 + averageScore * 0.3 + timeScore * 0.2)
  )
}

const refreshMetrics = () => {
  calculateTemperature()
}

const showDetails = () => {
  // 跳转到分析页面
  window.location.href = '/analytics'
}

onMounted(() => {
  calculateTemperature()
})
</script>

<style scoped>
.thermometer-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.thermometer-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  margin-bottom: 3rem;
}

.thermometer {
  position: relative;
  width: 80px;
  height: 300px;
}

.thermometer-tube {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 250px;
  background: #f0f0f0;
  border: 3px solid #333;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
}

.thermometer-mercury {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, #ff4444, #ff6666);
  transition: height 0.5s ease, background 0.5s ease;
}

.thermometer-mercury.cold {
  background: linear-gradient(to top, #4444ff, #6666ff);
}

.thermometer-mercury.warm {
  background: linear-gradient(to top, #44ff44, #66ff66);
}

.thermometer-mercury.hot {
  background: linear-gradient(to top, #ffaa44, #ffcc66);
}

.thermometer-mercury.very-hot {
  background: linear-gradient(to top, #ff4444, #ff6666);
}

.thermometer-bulb {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  background: #ff4444;
  border: 3px solid #333;
  border-radius: 50%;
  transition: background 0.5s ease;
}

.thermometer-bulb.cold {
  background: #4444ff;
}

.thermometer-bulb.warm {
  background: #44ff44;
}

.thermometer-bulb.hot {
  background: #ffaa44;
}

.thermometer-bulb.very-hot {
  background: #ff4444;
}

.thermometer-scale {
  position: absolute;
  right: -50px;
  top: 0;
  height: 250px;
  width: 40px;
}

.scale-mark {
  position: absolute;
  width: 100%;
  height: 1px;
  background: #999;
}

.scale-value {
  position: absolute;
  right: 0;
  top: -10px;
  font-size: 0.8rem;
  color: #666;
}

.temperature-info {
  text-align: center;
}

.temperature-value {
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.temperature-label {
  font-size: 1.5rem;
  color: #666;
  margin: 0.5rem 0;
}

.temperature-desc {
  color: #999;
  max-width: 300px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.metric-icon {
  font-size: 1.5rem;
}

.metric-title {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.metric-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease, background 0.5s ease;
}

.progress-low {
  background: #ff4444;
}

.progress-medium {
  background: #ffaa44;
}

.progress-high {
  background: #44ff44;
}

.progress-excellent {
  background: #44ff44;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .thermometer-container {
    color: #e0e0e0;
  }
  
  .metric-card {
    background: #2a2a2a;
    color: #e0e0e0;
  }
  
  .metric-title {
    color: #aaa;
  }
  
  .metric-value {
    color: #fff;
  }
  
  .thermometer-tube {
    background: #333;
    border-color: #666;
  }
  
  .thermometer-bulb {
    border-color: #666;
  }
  
  .progress-bar {
    background: #333;
  }
  
  .btn-secondary {
    background: #333;
    color: #e0e0e0;
  }
  
  .btn-secondary:hover {
    background: #444;
  }
}
</style>