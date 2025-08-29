<template>
  <div class="data-exporter">
    <div class="neo-card p-6">
      <h3 class="text-xl font-bold mb-4">📊 学习报告导出</h3>
      
      <div class="export-options space-y-4">
        <div class="option-group">
          <h4 class="font-semibold mb-2">导出格式</h4>
          <div class="flex space-x-2">
            <button 
              :class="['neo-btn', selectedFormat === 'markdown' ? 'bg-primary-blue text-white' : '']"
              @click="selectedFormat = 'markdown'"
            >
              📝 Markdown
            </button>
            <button 
              :class="['neo-btn', selectedFormat === 'json' ? 'bg-primary-blue text-white' : '']"
              @click="selectedFormat = 'json'"
            >
              📄 JSON
            </button>
          </div>
        </div>
        
        <div class="option-group">
          <h4 class="font-semibold mb-2">包含内容</h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="checkbox" v-model="includeProgress" class="mr-2">
              学习进度统计
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="includeQuizResults" class="mr-2">
              测试结果详情
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="includeAchievements" class="mr-2">
              成就与徽章
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="includeRecommendations" class="mr-2">
              个性化学习建议
            </label>
          </div>
        </div>
      </div>
      
      <div class="export-actions mt-6 space-x-2">
        <button 
          @click="exportData" 
          :disabled="isExporting"
          class="neo-btn bg-primary-blue text-white"
        >
          <span v-if="!isExporting">⬇️ 导出报告</span>
          <span v-else>🔄 生成中...</span>
        </button>
        
        <button 
          @click="previewReport" 
          class="neo-btn-secondary"
        >
          👁️ 预览报告
        </button>
      </div>
      
      <!-- 预览模态框 -->
      <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-2xl max-h-96 overflow-y-auto p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">报告预览</h3>
            <button @click="showPreview = false" class="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <pre class="text-sm whitespace-pre-wrap">{{ previewContent }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useQuizStore } from '@/stores/quiz'
import { useGamificationStore } from '@/stores/gamification'

const progressStore = useProgressStore()
const quizStore = useQuizStore()
const gamificationStore = useGamificationStore()

// 导出选项
const selectedFormat = ref('markdown')
const includeProgress = ref(true)
const includeQuizResults = ref(true)
const includeAchievements = ref(true)
const includeRecommendations = ref(true)

// 状态
const isExporting = ref(false)
const showPreview = ref(false)
const previewContent = ref('')

// 导出数据
const exportData = async () => {
  isExporting.value = true
  
  try {
    const reportData = generateReportData()
    const content = selectedFormat.value === 'markdown' 
      ? generateMarkdownReport(reportData)
      : JSON.stringify(reportData, null, 2)
    
    downloadFile(content, selectedFormat.value)
  } catch (error) {
    console.error('导出失败:', error)
  } finally {
    isExporting.value = false
  }
}

// 预览报告
const previewReport = () => {
  const reportData = generateReportData()
  previewContent.value = selectedFormat.value === 'markdown' 
    ? generateMarkdownReport(reportData)
    : JSON.stringify(reportData, null, 2)
  showPreview.value = true
}

// 生成报告数据
const generateReportData = () => {
  const data: any = {
    exportTime: new Date().toISOString(),
    format: selectedFormat.value
  }
  
  if (includeProgress.value) {
    data.progress = {
      totalStudied: Object.keys(progressStore.principleProgress).length,
      studyStreak: progressStore.userStats.streak.currentStreak,
      timeSpent: progressStore.userStats.totalStudyTime,
      completionRate: progressStore.userStats.totalStudyTime > 0 ? 0.8 : 0
    }
  }
  
  if (includeQuizResults.value) {
    const allStats = quizStore.getAllStats() || { averageScore: 0, bestScore: 0 }
    data.quizResults = {
      totalQuizzes: quizStore.completedSessions.length,
      averageScore: allStats.averageScore || 0,
      bestScore: allStats.bestScore || 0,
      recentResults: quizStore.completedSessions.slice(-5)
    }
  }
  
  if (includeAchievements.value) {
    data.achievements = {
      totalPoints: gamificationStore.totalPoints,
      currentLevel: gamificationStore.currentLevel,
      unlockedBadges: gamificationStore.unlockedBadges,
      recentAchievements: []
    }
  }
  
  if (includeRecommendations.value) {
    data.recommendations = generatePersonalizedRecommendations()
  }
  
  return data
}

// 生成Markdown报告
const generateMarkdownReport = (data: any) => {
  let markdown = `# CSS数创学习平台 - 个人学习报告\n\n`
  markdown += `**生成时间**: ${new Date().toLocaleString('zh-CN')}\n\n`
  
  if (data.progress) {
    markdown += `## 📊 学习进度统计\n\n`
    markdown += `- **已学习概念**: ${data.progress.totalStudied} 个\n`
    markdown += `- **连续学习天数**: ${data.progress.studyStreak} 天\n`
    markdown += `- **学习时长**: ${Math.round(data.progress.timeSpent / 60)} 分钟\n`
    markdown += `- **完成率**: ${(data.progress.completionRate * 100).toFixed(1)}%\n\n`
  }
  
  if (data.quizResults) {
    markdown += `## 🎯 测试表现\n\n`
    markdown += `- **完成测试数**: ${data.quizResults.totalQuizzes} 次\n`
    markdown += `- **平均分数**: ${data.quizResults.averageScore.toFixed(1)} 分\n`
    markdown += `- **最高分数**: ${data.quizResults.bestScore} 分\n\n`
  }
  
  if (data.achievements) {
    markdown += `## 🏆 成就系统\n\n`
    markdown += `- **当前等级**: ${data.achievements.currentLevel}\n`
    markdown += `- **总积分**: ${data.achievements.totalPoints} 分\n`
    markdown += `- **已获得徽章**: ${data.achievements.unlockedBadges.length} 个\n\n`
  }
  
  if (data.recommendations) {
    markdown += `## 💡 个性化学习建议\n\n`
    data.recommendations.forEach((rec: string, index: number) => {
      markdown += `${index + 1}. ${rec}\n`
    })
    markdown += `\n`
  }
  
  markdown += `---\n*报告由 CSS数创学习平台 自动生成*`
  
  return markdown
}

// 生成个性化建议
const generatePersonalizedRecommendations = (): string[] => {
  const recommendations: string[] = []
  
  // 基于进度给建议
  const completionRate = progressStore.userStats.totalStudyTime > 0 ? 0.8 : 0
  if (completionRate < 0.5) {
    recommendations.push('建议每天花15-20分钟学习新概念，保持学习连续性')
  }
  
  // 基于测试表现给建议
  const allStats = quizStore.getAllStats() || { averageScore: 0 }
  if ((allStats.averageScore || 0) < 80) {
    recommendations.push('可以多做几遍闪卡练习来加强记忆，然后再参加测试')
  }
  
  // 基于成就系统给建议
  if (gamificationStore.totalPoints < 1000) {
    recommendations.push('尝试解锁更多徽章来获得积分奖励，提升学习动力')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('保持现在的学习节奏，你做得很好！')
  }
  
  return recommendations
}

// 下载文件
const downloadFile = (content: string, format: string) => {
  const blob = new Blob([content], { 
    type: format === 'markdown' ? 'text/markdown' : 'application/json' 
  })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `3c-learning-report-${new Date().toISOString().slice(0, 10)}.${format === 'markdown' ? 'md' : 'json'}`
  a.click()
  
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.data-exporter {
  max-width: 600px;
  margin: 0 auto;
}

.option-group h4 {
  color: #1e40af;
}

input[type="checkbox"] {
  accent-color: #2563eb;
}

pre {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 16px;
  font-size: 12px;
  line-height: 1.4;
}
</style>