import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface MarketIndicators {
  value: number
  level: string
  levelEn?: string
  levelZh?: string
  description: string
  trend?: 'up' | 'down' | 'stable'
  changeFromYesterday?: number
  components?: Record<string, number>
}

interface VisualizationConfig {
  type: 'thermometer' | 'gauge'
  color: string
  percentage: number
}

interface HistoryEntry {
  date: string
  value: number
}

interface SourceData {
  source: string
  fetchTime: string
  indicators: MarketIndicators
  visualization: VisualizationConfig
  history: HistoryEntry[]
  metadata?: {
    selector?: string
    rawText?: string
  }
  stale?: boolean
  staleTime?: string
}

interface MarketDataResponse {
  version: string
  lastUpdate: string
  status: string
  data: {
    youzhiyouxing?: SourceData
    coinmarketcap?: SourceData
  }
  fallback: {
    youzhiyouxing?: SourceData
    coinmarketcap?: SourceData
  }
  performance?: {
    scrapeTime?: string
    timestamp?: string
  }
}

export const useMarketDataStore = defineStore('marketData', () => {
  // 状态
  const data = ref<MarketDataResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetchTime = ref<string | null>(null)
  
  // 缓存配置
  const CACHE_KEY = 'market-data-cache'
  const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24小时

  // 计算属性
  const hasData = computed(() => !!data.value)
  
  const youzhiyouxingData = computed(() => {
    if (!data.value) return null
    return data.value.data.youzhiyouxing || data.value.fallback.youzhiyouxing || null
  })
  
  const coinmarketcapData = computed(() => {
    if (!data.value) return null
    return data.value.data.coinmarketcap || data.value.fallback.coinmarketcap || null
  })
  
  const isDataStale = computed(() => {
    if (!data.value?.lastUpdate) return false
    const lastUpdate = new Date(data.value.lastUpdate)
    const now = new Date()
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)
    return hoursSinceUpdate > 24 // 超过24小时认为过期
  })

  const dataStatus = computed(() => {
    if (loading.value) return 'loading'
    if (error.value) return 'error' 
    if (!hasData.value) return 'no-data'
    if (isDataStale.value) return 'stale'
    return 'fresh'
  })

  // 缓存操作
  const getCachedData = (): { data: MarketDataResponse, timestamp: number } | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null
      
      const parsed = JSON.parse(cached)
      const age = Date.now() - parsed.timestamp
      
      if (age > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY)
        return null
      }
      
      return parsed
    } catch (e) {
      console.error('Failed to read cache:', e)
      localStorage.removeItem(CACHE_KEY)
      return null
    }
  }

  const setCachedData = (marketData: MarketDataResponse) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: marketData,
        timestamp: Date.now()
      }))
    } catch (e) {
      console.error('Failed to cache data:', e)
    }
  }

  // 数据加载
  const fetchMarketData = async (forceRefresh = false): Promise<MarketDataResponse> => {
    // 如果不强制刷新且不是首次加载，先尝试使用缓存
    if (!forceRefresh && !loading.value) {
      const cached = getCachedData()
      if (cached) {
        data.value = cached.data
        lastFetchTime.value = cached.data.lastUpdate
        return cached.data
      }
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch('/data/market-indicators.json', {
        cache: forceRefresh ? 'no-cache' : 'default',
        headers: {
          'Cache-Control': forceRefresh ? 'no-cache' : 'max-age=300' // 5分钟缓存
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const marketData: MarketDataResponse = await response.json()
      
      // 验证数据结构
      if (!marketData.version || !marketData.lastUpdate) {
        throw new Error('Invalid data format')
      }

      // 更新状态
      data.value = marketData
      lastFetchTime.value = marketData.lastUpdate
      
      // 缓存数据
      setCachedData(marketData)
      
      console.log('Market data loaded successfully:', {
        version: marketData.version,
        lastUpdate: marketData.lastUpdate,
        hasYouzhiyouxing: !!marketData.data.youzhiyouxing,
        hasCoinmarketcap: !!marketData.data.coinmarketcap,
        performance: marketData.performance
      })

      return marketData

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      error.value = errorMessage
      
      // 尝试使用缓存数据作为后备
      const cached = getCachedData()
      if (cached) {
        console.warn('Failed to fetch fresh data, using cached data:', errorMessage)
        data.value = cached.data
        lastFetchTime.value = cached.data.lastUpdate
        return cached.data
      }
      
      console.error('Failed to fetch market data and no cache available:', errorMessage)
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refreshData = async () => {
    try {
      await fetchMarketData(true)
    } catch (err) {
      console.error('Failed to refresh market data:', err)
      // 错误已经被 fetchMarketData 处理了，这里不需要重复抛出
    }
  }

  // 清除缓存
  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY)
      console.log('Market data cache cleared')
    } catch (e) {
      console.error('Failed to clear cache:', e)
    }
  }

  // 获取数据源状态
  const getSourceStatus = (source: 'youzhiyouxing' | 'coinmarketcap') => {
    if (!data.value) return 'no-data'
    
    const sourceData = source === 'youzhiyouxing' 
      ? youzhiyouxingData.value 
      : coinmarketcapData.value
      
    if (!sourceData) return 'no-data'
    if (sourceData.stale) return 'stale'
    
    // 检查数据是否过期（超过6小时）
    const fetchTime = new Date(sourceData.fetchTime)
    const now = new Date()
    const hoursSinceFetch = (now.getTime() - fetchTime.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceFetch > 6) return 'stale'
    return 'fresh'
  }

  // 格式化更新时间
  const formatUpdateTime = (timestamp?: string) => {
    if (!timestamp) return '未知'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`
    
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 初始化时尝试加载缓存数据
  const initializeStore = async () => {
    const cached = getCachedData()
    if (cached) {
      data.value = cached.data
      lastFetchTime.value = cached.data.lastUpdate
    }
    
    // 异步获取最新数据
    try {
      await fetchMarketData(false)
    } catch (err) {
      // 如果有缓存数据，不要因为网络错误而清空数据
      if (!cached) {
        console.error('Initial data fetch failed:', err)
      }
    }
  }

  return {
    // 状态
    data,
    loading,
    error,
    lastFetchTime,
    
    // 计算属性
    hasData,
    youzhiyouxingData,
    coinmarketcapData,
    isDataStale,
    dataStatus,
    
    // 方法
    fetchMarketData,
    refreshData,
    clearCache,
    getSourceStatus,
    formatUpdateTime,
    initializeStore
  }
})