import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref, computed, readonly } from 'vue'

// 数据类型定义
export interface Principle {
  id: string
  order: number
  stage: string
  name: string
  concept: string
  practices: string[]
  antipatterns: string[]
  flashcard: {
    front: string
    back: string
  }
  quiz: {
    question: string
    correct_answer: string
    wrong_answers: string[]
  }
}

export interface Stage {
  id: string
  order: number
  icon: string
  title: string
  description: string
  extended_title?: string
  principles: string[]
}

export interface ModuleData {
  module_id: string
  module_name: string
  icon: string
  description: string
  principles: Principle[]
}

export interface QuizModule {
  name: string
  icon: string
  questions: Array<{
    id: string
    principle_id: string
    question: string
    correct_answer: string
    wrong_answers: string[]
    difficulty: string
    explanation: string
  }>
}

export interface ConfigData {
  version: string
  generated_at: string
  files: string[]
  total_size_kb: number
  modules: Array<{
    id: string
    name: string
    icon: string
    file: string
  }>
}

export const useConfigStore = defineStore('config', () => {
  // 状态变量
  const isLoading: Ref<boolean> = ref(false)
  const isInitialized: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  
  // 数据状态
  const configData: Ref<ConfigData | null> = ref(null)
  const moduleData: Ref<Record<string, ModuleData>> = ref({})
  const quizData: Ref<Record<string, QuizModule>> = ref({})
  
  // 计算属性
  const availableModules = computed(() => {
    if (!configData.value) return []
    return configData.value.modules.map(module => ({
      ...module,
      data: moduleData.value[module.id] || null
    }))
  })
  
  const totalPrinciples = computed(() => {
    return Object.values(moduleData.value).reduce(
      (total, module) => total + (module.principles?.length || 0), 
      0
    )
  })
  
  const totalQuestions = computed(() => {
    return Object.values(quizData.value).reduce(
      (total, module) => total + (module.questions?.length || 0), 
      0
    )
  })
  
  // 数据加载函数
  async function loadIndexData() {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await fetch('/data/w3sc8_index.json')
      if (!response.ok) {
        throw new Error(`加载索引失败: ${response.status}`)
      }
      
      const data = await response.json()
      configData.value = data
      console.log('📊 配置索引加载成功:', data.version)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      console.error('❌ 配置索引加载失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  async function loadModuleData(moduleId: string) {
    try {
      if (!configData.value) {
        throw new Error('配置数据未加载')
      }
      
      const module = configData.value.modules.find(m => m.id === moduleId)
      if (!module) {
        throw new Error(`未找到模块: ${moduleId}`)
      }
      
      // 避免重复加载
      if (moduleData.value[moduleId]) {
        return moduleData.value[moduleId]
      }
      
      const response = await fetch(`/data/${module.file}`)
      if (!response.ok) {
        throw new Error(`加载模块失败: ${response.status}`)
      }
      
      const data: ModuleData = await response.json()
      moduleData.value[moduleId] = data
      
      console.log(`📦 模块 ${moduleId} 加载成功:`, data.principles.length, '个原则')
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      console.error(`❌ 模块 ${moduleId} 加载失败:`, err)
      throw err
    }
  }
  
  async function loadQuizData() {
    try {
      // 避免重复加载
      if (Object.keys(quizData.value).length > 0) {
        return quizData.value
      }
      
      const response = await fetch('/data/w3sc8_quiz-data.json')
      if (!response.ok) {
        throw new Error(`加载测试数据失败: ${response.status}`)
      }
      
      const data = await response.json()
      quizData.value = data.modules || {}
      
      const totalQuests = Object.values(quizData.value).reduce(
        (total, module) => total + (module.questions?.length || 0), 0
      )
      console.log('🧪 测试数据加载成功:', totalQuests, '道题目')
      return quizData.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
      console.error('❌ 测试数据加载失败:', err)
      throw err
    }
  }
  
  // 初始化函数
  async function initialize() {
    if (isInitialized.value) return
    
    try {
      await loadIndexData()
      await loadQuizData()
      isInitialized.value = true
      console.log('🚀 配置系统初始化完成')
    } catch (err) {
      console.error('❌ 配置系统初始化失败:', err)
      throw err
    }
  }
  
  // 获取函数
  function getPrincipleById(principleId: string): Principle | null {
    for (const module of Object.values(moduleData.value)) {
      const principle = module.principles?.find(p => p.id === principleId)
      if (principle) return principle
    }
    return null
  }
  
  function getPrinciplesByStage(stageId: string): Principle[] {
    const module = moduleData.value[stageId]
    return module?.principles || []
  }
  
  function getQuizByModule(moduleId: string): QuizModule | null {
    return quizData.value[moduleId] || null
  }
  
  function getAllPrinciples(): Principle[] {
    const allPrinciples: Principle[] = []
    for (const module of Object.values(moduleData.value)) {
      if (module.principles) {
        allPrinciples.push(...module.principles)
      }
    }
    return allPrinciples.sort((a, b) => a.order - b.order)
  }
  
  // 重置函数
  function resetError() {
    error.value = null
  }
  
  return {
    // 状态
    isLoading: readonly(isLoading),
    isInitialized: readonly(isInitialized),
    error: readonly(error),
    configData: readonly(configData),
    moduleData: readonly(moduleData),
    quizData: readonly(quizData),
    
    // 计算属性
    availableModules,
    totalPrinciples,
    totalQuestions,
    
    // 方法
    initialize,
    loadModuleData,
    getPrincipleById,
    getPrinciplesByStage,
    getAllPrinciples,
    getQuizByModule,
    resetError
  }
})