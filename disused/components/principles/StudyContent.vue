<template>
  <div class="study-content">
    <!-- 进度统计 -->
    <div v-if="progressStore.isInitialized" class="flex justify-center space-x-4 mb-8">
      <div class="neo-card p-4 text-center">
        <div class="text-2xl font-bold text-primary-blue">{{ progressStore.completionPercentage }}%</div>
        <div class="text-sm text-gray-600">完成进度</div>
      </div>
      <div class="neo-card p-4 text-center">
        <div class="text-2xl font-bold text-primary-blue">{{ progressStore.userStats.completedPrinciples }}</div>
        <div class="text-sm text-gray-600">已掌握概念</div>
      </div>
      <div class="neo-card p-4 text-center">
        <div class="text-2xl font-bold text-primary-blue">{{ Math.floor(progressStore.userStats.totalStudyTime / 60) }}</div>
        <div class="text-sm text-gray-600">学习时长(小时)</div>
      </div>
    </div>
    
    <!-- 学习模块 -->
    <div v-if="!isLoading && configStore.isInitialized" class="space-y-6">
      <div 
        v-for="module in availableModules" 
        :key="module.id"
        class="neo-card p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="neo-icon text-2xl">{{ module.icon }}</div>
            <div>
              <h2 class="text-xl font-bold">{{ module.name }}</h2>
              <p class="text-gray-600 text-sm">{{ module.description || '暂无描述' }}</p>
            </div>
          </div>
          
          <!-- 模块状态 -->
          <div class="flex items-center space-x-2">
            <div v-if="getModuleProgress(module.id)" class="text-sm">
              {{ getModuleProgress(module.id)?.completedPrinciples || 0 }} / {{ getModuleProgress(module.id)?.totalPrinciples || 0 }}
            </div>
            <button 
              @click="loadModuleDetails(module.id)"
              class="neo-btn text-sm"
              :disabled="loadingModules.has(module.id)"
            >
              {{ expandedModules.has(module.id) ? '收起' : '查看原则' }}
            </button>
          </div>
        </div>
        
        <!-- 展开的原则列表 -->
        <div v-if="expandedModules.has(module.id)" class="mt-6 space-y-3">
          <div 
            v-for="principle in modulePrinciples.get(module.id)" 
            :key="principle.id"
            class="principle-card"
          >
            <div class="flex items-start space-x-3">
              <div class="principle-number">{{ principle.number }}</div>
              <div class="flex-1">
                <h3 class="font-bold text-lg mb-2">{{ principle.title }}</h3>
                <p class="text-gray-600 text-sm mb-3">{{ principle.description }}</p>
                
                <!-- 原则详情 -->
                <div v-if="principle.details" class="mb-3">
                  <div class="text-sm text-gray-700 space-y-1">
                    <div v-for="(detail, idx) in principle.details" :key="idx">
                      • {{ detail }}
                    </div>
                  </div>
                </div>
                
                <!-- 学习按钮 -->
                <div class="flex items-center justify-between">
                  <div class="flex gap-2">
                    <span v-if="principle.learned" class="text-xs text-success-green">✅ 已掌握</span>
                    <span v-else class="text-xs text-gray-500">未学习</span>
                  </div>
                  <button 
                    @click="togglePrincipleLearned(principle.id)"
                    :class="['neo-btn-sm', principle.learned ? 'neo-btn-secondary' : 'neo-btn-primary']"
                  >
                    {{ principle.learned ? '重新学习' : '标记为已学' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-lg text-gray-600">加载中...</div>
    </div>
    
    <!-- 引导到其他学习方式 -->
    <div class="mt-8 text-center">
      <p class="text-gray-600 mb-4">学完了原则？试试其他学习方式：</p>
      <div class="flex justify-center gap-4">
        <button @click="$emit('goToFlashcards')" class="neo-btn">
          🎯 闪卡练习
        </button>
        <button @click="$emit('goToQuiz')" class="neo-btn">
          🏆 挑战测试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useProgressStore } from '@/stores/progress'

const configStore = useConfigStore()
const progressStore = useProgressStore()

const isLoading = ref(false)
const expandedModules = ref(new Set<string>())
const loadingModules = ref(new Set<string>())
const modulePrinciples = ref(new Map())

defineEmits<{
  goToFlashcards: []
  goToQuiz: []
}>()

// 获取可用模块
const availableModules = computed(() => {
  return configStore.modules || []
})

// 获取模块进度
const getModuleProgress = (moduleId: string) => {
  return progressStore.getModuleProgress(moduleId)
}

// 加载模块详情
const loadModuleDetails = async (moduleId: string) => {
  if (expandedModules.value.has(moduleId)) {
    expandedModules.value.delete(moduleId)
    return
  }
  
  loadingModules.value.add(moduleId)
  
  try {
    const principles = configStore.getPrinciplesByModule(moduleId)
    modulePrinciples.value.set(moduleId, principles)
    expandedModules.value.add(moduleId)
  } catch (error) {
    console.error('加载模块详情失败:', error)
  } finally {
    loadingModules.value.delete(moduleId)
  }
}

// 切换原则学习状态
const togglePrincipleLearned = (principleId: string) => {
  const principle = Array.from(modulePrinciples.value.values())
    .flat()
    .find(p => p.id === principleId)
  
  if (principle) {
    principle.learned = !principle.learned
    progressStore.updatePrincipleProgress(principleId, principle.learned)
  }
}

// 初始化
onMounted(async () => {
  isLoading.value = true
  await configStore.init()
  await progressStore.init()
  isLoading.value = false
})
</script>

<style scoped>
.principle-card {
  @apply p-4 bg-gray-50 border-2 border-black;
  box-shadow: 2px 2px 0px theme('colors.border-black');
}

.principle-number {
  @apply w-10 h-10 bg-primary-blue text-white font-bold flex items-center justify-center;
  @apply border-2 border-black;
  box-shadow: 2px 2px 0px theme('colors.border-black');
}

.neo-btn-sm {
  @apply px-3 py-1 text-sm font-bold border-2 border-black;
  box-shadow: 1px 1px 0px theme('colors.border-black');
}

.neo-btn-primary {
  @apply bg-primary-blue text-white;
}

.neo-btn-secondary {
  @apply bg-gray-200;
}
</style>