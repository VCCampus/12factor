/**
 * 统一存储接口 - 支持 H5 和小程序
 */

export class UnifiedStorage {
  /**
   * 设置存储项
   */
  static async setItem(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(value)
      
      // #ifdef H5
      try {
        localStorage.setItem(key, data)
        resolve()
      } catch (error) {
        reject(error)
      }
      // #endif
      
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      uni.setStorage({
        key,
        data,
        success: () => resolve(),
        fail: (error) => reject(error)
      })
      // #endif
    })
  }
  
  /**
   * 获取存储项
   */
  static async getItem<T = any>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      // #ifdef H5
      try {
        const data = localStorage.getItem(key)
        if (data === null) {
          resolve(null)
        } else {
          resolve(JSON.parse(data))
        }
      } catch (error) {
        resolve(null)
      }
      // #endif
      
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      uni.getStorage({
        key,
        success: (res) => {
          try {
            resolve(JSON.parse(res.data))
          } catch (error) {
            resolve(res.data)
          }
        },
        fail: () => resolve(null)
      })
      // #endif
    })
  }
  
  /**
   * 删除存储项
   */
  static async removeItem(key: string): Promise<void> {
    return new Promise((resolve) => {
      // #ifdef H5
      localStorage.removeItem(key)
      resolve()
      // #endif
      
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      uni.removeStorage({
        key,
        complete: () => resolve()
      })
      // #endif
    })
  }
  
  /**
   * 清空所有存储
   */
  static async clear(): Promise<void> {
    return new Promise((resolve) => {
      // #ifdef H5
      localStorage.clear()
      resolve()
      // #endif
      
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      uni.clearStorage({
        complete: () => resolve()
      })
      // #endif
    })
  }
  
  /**
   * 获取所有存储键名
   */
  static async getAllKeys(): Promise<string[]> {
    return new Promise((resolve) => {
      // #ifdef H5
      const keys = Object.keys(localStorage)
      resolve(keys)
      // #endif
      
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      uni.getStorageInfo({
        success: (res) => resolve(res.keys),
        fail: () => resolve([])
      })
      // #endif
    })
  }
  
  /**
   * 获取存储信息
   */
  static async getStorageInfo(): Promise<{
    keys: string[]
    currentSize: number
    limitSize: number
  }> {
    return new Promise((resolve) => {
      // #ifdef H5
      const keys = Object.keys(localStorage)
      let currentSize = 0
      keys.forEach(key => {
        const item = localStorage.getItem(key)
        if (item) {
          currentSize += item.length
        }
      })
      resolve({
        keys,
        currentSize,
        limitSize: 5 * 1024 * 1024 // H5 通常限制为 5MB
      })
      // #endif
      
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      uni.getStorageInfo({
        success: (res) => resolve({
          keys: res.keys,
          currentSize: res.currentSize,
          limitSize: res.limitSize
        }),
        fail: () => resolve({
          keys: [],
          currentSize: 0,
          limitSize: 0
        })
      })
      // #endif
    })
  }
}

/**
 * 存储键名常量
 */
export const StorageKeys = {
  // 个人成长相关
  GROWTH_PROGRESS: 'growth_progress',
  GROWTH_FLASHCARD_HISTORY: 'growth_flashcard_history',
  GROWTH_QUIZ_HISTORY: 'growth_quiz_history',
  
  // 面试相关
  INTERVIEW_PROGRESS: 'interview_progress',
  INTERVIEW_RESULTS: 'interview_results',
  
  // 用户设置
  USER_SETTINGS: 'user_settings',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
  
  // 应用状态
  APP_CONFIG: 'app_config',
  LAST_VISIT: 'last_visit'
} as const

/**
 * 存储工具函数
 */
export const StorageUtils = {
  /**
   * 安全的JSON解析
   */
  safeParse<T = any>(jsonString: string, defaultValue: T): T {
    try {
      return JSON.parse(jsonString)
    } catch {
      return defaultValue
    }
  },
  
  /**
   * 安全的JSON序列化
   */
  safeStringify(obj: any): string {
    try {
      return JSON.stringify(obj)
    } catch {
      return '{}'
    }
  },
  
  /**
   * 检查存储空间使用情况
   */
  async checkStorageUsage(): Promise<{
    used: number
    total: number
    percentage: number
  }> {
    const info = await UnifiedStorage.getStorageInfo()
    const percentage = info.limitSize > 0 ? (info.currentSize / info.limitSize) * 100 : 0
    
    return {
      used: info.currentSize,
      total: info.limitSize,
      percentage
    }
  },
  
  /**
   * 清理过期数据
   */
  async cleanupExpiredData(): Promise<void> {
    const keys = await UnifiedStorage.getAllKeys()
    const now = Date.now()
    
    for (const key of keys) {
      if (key.endsWith('_expires')) {
        const expiresTime = await UnifiedStorage.getItem<number>(key)
        if (expiresTime && now > expiresTime) {
          const dataKey = key.replace('_expires', '')
          await UnifiedStorage.removeItem(dataKey)
          await UnifiedStorage.removeItem(key)
        }
      }
    }
  },
  
  /**
   * 设置带过期时间的数据
   */
  async setItemWithExpiry(key: string, value: any, expiryMinutes: number): Promise<void> {
    const expiryTime = Date.now() + (expiryMinutes * 60 * 1000)
    await Promise.all([
      UnifiedStorage.setItem(key, value),
      UnifiedStorage.setItem(`${key}_expires`, expiryTime)
    ])
  },
  
  /**
   * 获取带过期检查的数据
   */
  async getItemWithExpiry<T = any>(key: string): Promise<T | null> {
    const [data, expiryTime] = await Promise.all([
      UnifiedStorage.getItem<T>(key),
      UnifiedStorage.getItem<number>(`${key}_expires`)
    ])
    
    if (expiryTime && Date.now() > expiryTime) {
      // 数据已过期，清除
      await Promise.all([
        UnifiedStorage.removeItem(key),
        UnifiedStorage.removeItem(`${key}_expires`)
      ])
      return null
    }
    
    return data
  }
}