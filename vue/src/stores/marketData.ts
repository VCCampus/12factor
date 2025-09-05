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
      console.log('[marketData] Attempting to read cache...')
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) {
        console.log('[marketData] No cache found')
        return null
      }
      
      const parsed = JSON.parse(cached)
      const age = Date.now() - parsed.timestamp
      
      if (age > CACHE_DURATION) {
        console.log('[marketData] Cache expired, removing...')
        localStorage.removeItem(CACHE_KEY)
        return null
      }
      
      console.log('[marketData] Cache hit, age:', Math.round(age / 1000 / 60), 'minutes')
      return parsed
    } catch (e) {
      console.error('[marketData] Failed to read cache:', e)
      try {
        localStorage.removeItem(CACHE_KEY)
      } catch (removeError) {
        console.error('[marketData] Failed to remove invalid cache:', removeError)
      }
      return null
    }
  }

  const setCachedData = (marketData: MarketDataResponse) => {
    try {
      const cacheData = {
        data: marketData,
        timestamp: Date.now()
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
      console.log('[marketData] Data cached successfully')
    } catch (e) {
      console.error('[marketData] Failed to cache data:', e)
      // Try to clear some space if quota exceeded
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        console.warn('[marketData] LocalStorage quota exceeded, clearing old data...')
        try {
          localStorage.removeItem(CACHE_KEY)
        } catch (clearError) {
          console.error('[marketData] Failed to clear storage:', clearError)
        }
      }
    }
  }

  // 数据加载
  const fetchMarketData = async (forceRefresh = false): Promise<MarketDataResponse> => {
    console.log('[marketData] fetchMarketData called, forceRefresh:', forceRefresh)
    
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
      console.log('[marketData] Fetching from /data/market-indicators.json...')
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
      console.log('[marketData] Data fetched, validating structure...')
      
      // 验证数据结构
      if (!marketData.version || !marketData.lastUpdate) {
        console.error('[marketData] Invalid data structure:', marketData)
        throw new Error('Invalid data format: missing version or lastUpdate')
      }

      // 确保data对象存在
      if (!marketData.data) {
        marketData.data = {}
      }

      // 更新状态
      data.value = marketData
      lastFetchTime.value = marketData.lastUpdate
      
      // 缓存数据
      setCachedData(marketData)
      
      console.log('[marketData] Market data loaded successfully:', {
        version: marketData.version,
        lastUpdate: marketData.lastUpdate,
        hasYouzhiyouxing: !!marketData.data.youzhiyouxing,
        hasCoinmarketcap: !!marketData.data.coinmarketcap,
        performance: marketData.performance
      })

      return marketData

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('[marketData] Fetch failed:', errorMessage)
      error.value = errorMessage
      
      // 尝试使用缓存数据作为后备
      const cached = getCachedData()
      if (cached) {
        console.warn('[marketData] Using cached data as fallback')
        data.value = cached.data
        lastFetchTime.value = cached.data.lastUpdate
        // Don't throw error if we have cached data
        error.value = null // Clear error since we have fallback
        return cached.data
      }
      
      console.error('[marketData] No cache available, operation failed')
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
    console.log('[marketData] Initializing store...')
    
    try {
      // First try to load cached data
      const cached = getCachedData()
      if (cached) {
        console.log('[marketData] Using cached data for initial load')
        data.value = cached.data
        lastFetchTime.value = cached.data.lastUpdate
      }
      
      // Then try to fetch fresh data in background
      console.log('[marketData] Fetching fresh data...')
      await fetchMarketData(false)
      console.log('[marketData] Store initialization completed')
      
    } catch (err) {
      console.error('[marketData] Store initialization error:', err)
      
      // If we already have data (from cache), don't throw error
      if (data.value) {
        console.log('[marketData] Using cached data despite fetch error')
        error.value = 'Using cached data - refresh failed'
      } else {
        // Create fallback empty structure to prevent rendering errors
        console.warn('[marketData] No data available, creating fallback structure')
        data.value = {
          version: '1.0.0',
          lastUpdate: new Date().toISOString(),
          status: 'error',
          data: {},
          fallback: {}
        }
        error.value = err instanceof Error ? err.message : 'Failed to load data'
        // Don't throw - let the UI handle the error state
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