import { ref, computed, readonly } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useProgressStore } from '@/stores/progress'
import { useQuizStore } from '@/stores/quiz'

export interface LoadingState {
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  progress: number
}

export function useDataLoader() {
  const configStore = useConfigStore()
  const progressStore = useProgressStore()
  const quizStore = useQuizStore()
  
  const loadingState = ref<LoadingState>({
    isLoading: false,
    isInitialized: false,
    error: null,
    progress: 0
  })
  
  // 计算属性
  const isReady = computed(() => {
    return configStore.isInitialized && progressStore.isInitialized && !loadingState.value.isLoading
  })
  
  const hasError = computed(() => {
    return !!(loadingState.value.error || configStore.error)
  })
  
  const errorMessage = computed(() => {
    return loadingState.value.error || configStore.error
  })
  
  // 初始化应用数据
  async function initializeApp() {
    if (loadingState.value.isInitialized) {
      console.log('⚠️ 应用已初始化，跳过')
      return
    }
    
    try {
      loadingState.value.isLoading = true
      loadingState.value.error = null
      loadingState.value.progress = 0
      
      console.log('🚀 开始初始化应用数据...')
      
      // 步骤1: 初始化配置系统 (40%)
      await configStore.initialize()
      loadingState.value.progress = 40
      
      // 步骤2: 初始化进度系统 (20%)
      await progressStore.initialize()
      loadingState.value.progress = 60
      
      // 步骤3: 初始化测试系统 (20%)
      quizStore.initialize()
      loadingState.value.progress = 80
      
      // 步骤4: 预加载核心模块 (20%)
      await preloadCoreModules()
      loadingState.value.progress = 100
      
      loadingState.value.isInitialized = true
      console.log('✅ 应用数据初始化完成')
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '初始化失败'
      loadingState.value.error = errorMsg
      console.error('❌ 应用初始化失败:', error)
      throw error
    } finally {
      loadingState.value.isLoading = false
    }
  }
  
  // 预加载核心模块
  async function preloadCoreModules() {
    const coreModules = ['core-cognition'] // 可以配置哪些模块需要预加载
    
    for (const moduleId of coreModules) {
      try {
        await configStore.loadModuleData(moduleId)
      } catch (error) {
        console.warn(`⚠️ 预加载模块 ${moduleId} 失败:`, error)
        // 预加载失败不阻断整个初始化过程
      }
    }
  }
  
  // 按需加载模块数据
  async function loadModule(moduleId: string) {
    try {
      const data = await configStore.loadModuleData(moduleId)
      console.log(`📦 模块 ${moduleId} 加载完成`)
      return data
    } catch (error) {
      console.error(`❌ 模块 ${moduleId} 加载失败:`, error)
      throw error
    }
  }
  
  // 重新初始化
  async function reinitialize() {
    loadingState.value.isInitialized = false
    await initializeApp()
  }
  
  // 清除错误
  function clearError() {
    loadingState.value.error = null
    configStore.resetError()
  }
  
  // 获取应用状态摘要
  function getAppStatus() {
    return {
      isReady: isReady.value,
      hasError: hasError.value,
      errorMessage: errorMessage.value,
      loading: loadingState.value.isLoading,
      progress: loadingState.value.progress,
      stores: {
        config: {
          initialized: configStore.isInitialized,
          error: configStore.error,
          modules: configStore.availableModules.length,
          totalPrinciples: configStore.totalPrinciples,
          totalQuestions: configStore.totalQuestions
        },
        progress: {
          initialized: progressStore.isInitialized,
          completionPercentage: progressStore.completionPercentage,
          currentLevel: progressStore.currentLevel
        }
      }
    }
  }
  
  return {
    // 状态
    loadingState: readonly(loadingState),
    isReady,
    hasError,
    errorMessage,
    
    // 方法
    initializeApp,
    loadModule,
    reinitialize,
    clearError,
    getAppStatus
  }
}