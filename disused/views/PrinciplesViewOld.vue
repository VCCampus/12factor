<template>
  <AppLayout>
    <div class="py-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-text-dark mb-4">原则学习</h1>
        <p class="text-gray-600 mb-4">系统学习CSS数字创业核心知识体系</p>
        
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
                {{ loadingModules.has(module.id) ? '加载中...' : '开始学习' }}
              </button>
            </div>
          </div>
          
          <!-- 模块原则列表 -->
          <div v-if="moduleDetails[module.id]" class="mt-4 space-y-2">
            <div 
              v-for="principle in moduleDetails[module.id].principles" 
              :key="principle.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded"
            >
              <div class="flex-1">
                <div class="font-medium">{{ principle.name }}</div>
                <div class="text-sm text-gray-600 mt-1">{{ principle.concept.substring(0, 100) }}...</div>
              </div>
              
              <!-- 原则状态 -->
              <div class="flex items-center space-x-2 ml-4">
                <div class="text-sm">
                  <span 
                    :class="getPrincipleStatusClass(principle.id)"
                    class="px-2 py-1 rounded text-xs font-medium"
                  >
                    {{ getPrincipleStatusText(principle.id) }}
                  </span>
                </div>
                <button 
                  @click="studyPrinciple(principle.id)"
                  class="neo-btn-secondary text-xs px-2 py-1"
                >
                  学习
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-else-if="isLoading" class="text-center py-12">
        <div class="neo-icon mx-auto mb-4 text-2xl animate-pulse">
          ⏳
        </div>
        <h2 class="text-xl font-bold mb-2">加载学习内容...</h2>
        <p class="text-gray-600">正在从服务器获取最新的学习资料</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="hasError" class="text-center py-12">
        <div class="neo-card p-8">
          <div class="neo-icon mx-auto mb-4 text-2xl">
            ❌
          </div>
          <h2 class="text-xl font-bold mb-4 text-red-600">加载失败</h2>
          <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
          <button @click="retryLoad" class="neo-btn">
            重试
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useConfigStore } from '@/stores/config'
import { useProgressStore } from '@/stores/progress'
import { useDataLoader } from '@/composables/useDataLoader'
import type { ModuleData } from '@/stores/config'

// Store 实例
const configStore = useConfigStore()
const progressStore = useProgressStore()
const { loadModule, hasError, errorMessage } = useDataLoader()

// 响应式状态
const isLoading = ref(false)
const moduleDetails = ref<Record<string, ModuleData>>({})
const loadingModules = ref(new Set<string>())

// 计算属性
const availableModules = computed(() => {
  return configStore.availableModules.map((module: any) => ({
    id: module.id,
    name: module.name,
    icon: module.icon,
    description: moduleDetails.value[module.id]?.description || ''
  }))
})

// 方法
async function loadModuleDetails(moduleId: string) {
  if (moduleDetails.value[moduleId] || loadingModules.value.has(moduleId)) {
    return
  }
  
  try {
    loadingModules.value.add(moduleId)
    const data = await loadModule(moduleId)
    moduleDetails.value[moduleId] = data
  } catch (error) {
    console.error(`加载模块 ${moduleId} 失败:`, error)
  } finally {
    loadingModules.value.delete(moduleId)
  }
}

function getModuleProgress(moduleId: string) {
  const moduleData = moduleDetails.value[moduleId]
  if (!moduleData) return null
  
  const totalPrinciples = moduleData.principles.length
  const completedPrinciples = moduleData.principles.filter(p => {
    const progress = progressStore.getPrincipleProgress(p.id)
    return progress?.status === 'completed' || progress?.status === 'mastered'
  }).length
  
  return {
    totalPrinciples,
    completedPrinciples
  }
}

function getPrincipleStatusText(principleId: string) {
  const progress = progressStore.getPrincipleProgress(principleId)
  if (!progress) return '未开始'
  
  switch (progress.status) {
    case 'in-progress': return '学习中'
    case 'completed': return '已完成'
    case 'mastered': return '已掌握'
    default: return '未开始'
  }
}

function getPrincipleStatusClass(principleId: string) {
  const progress = progressStore.getPrincipleProgress(principleId)
  if (!progress) return 'bg-gray-200 text-gray-600'
  
  switch (progress.status) {
    case 'in-progress': return 'bg-yellow-200 text-yellow-800'
    case 'completed': return 'bg-green-200 text-green-800'
    case 'mastered': return 'bg-blue-200 text-blue-800'
    default: return 'bg-gray-200 text-gray-600'
  }
}

function studyPrinciple(principleId: string) {
  // 记录学习会话
  progressStore.recordStudySession(principleId, 5) // 假设每次学习5分钟
  
  // TODO: 在Phase 3实现跳转到具体学习页面
  console.log(`开始学习原则: ${principleId}`)
  
  // 临时演示：随机更新状态
  const statuses: Array<'in-progress' | 'completed'> = ['in-progress', 'completed']
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
  
  progressStore.updatePrincipleProgress(principleId, {
    status: randomStatus,
    studyTime: (progressStore.getPrincipleProgress(principleId)?.studyTime || 0) + 5
  })
}

async function retryLoad() {
  window.location.reload()
}

// 生命周期
onMounted(async () => {
  // 预加载第一个模块的详情
  if (configStore.availableModules.length > 0) {
    await loadModuleDetails(configStore.availableModules[0].id)
  }
})
</script>