/**
 * 指数退避重试机制
 * 实现智能重试策略，避免频繁失败时对目标站点造成压力
 */

export default class ExponentialBackoffRetry {
  constructor(options = {}) {
    this.options = {
      baseDelay: options.baseDelay || 2000,        // 基础延迟 2秒
      maxDelay: options.maxDelay || 30000,         // 最大延迟 30秒
      jitterFactor: options.jitterFactor || 0.5,  // 随机化因子
      maxRetries: options.maxRetries || 4,         // 最大重试次数
      ...options
    };
  }

  /**
   * 执行带指数退避的重试
   * @param {Function} fn 要执行的异步函数
   * @param {number} maxRetries 最大重试次数
   * @returns {Promise} 执行结果
   */
  async execute(fn, maxRetries = this.options.maxRetries) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn(attempt);
        return result;
      } catch (error) {
        lastError = error;
        
        // 分析错误类型，决定是否继续重试
        if (!this.shouldRetry(error, attempt, maxRetries)) {
          throw error;
        }
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < maxRetries) {
          const delay = this.calculateDelay(attempt);
          await this.delay(delay);
        }
      }
    }
    
    // 所有重试都失败了
    throw new Error(`Operation failed after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * 判断是否应该继续重试
   * @param {Error} error 发生的错误
   * @param {number} attempt 当前尝试次数
   * @param {number} maxRetries 最大重试次数
   * @returns {boolean} 是否应该重试
   */
  shouldRetry(error, attempt, maxRetries) {
    // 已达到最大重试次数
    if (attempt >= maxRetries) {
      return false;
    }
    
    // 根据错误类型决定是否重试
    const errorMessage = error.message.toLowerCase();
    
    // 网络相关错误 - 应该重试
    if (this.isNetworkError(errorMessage)) {
      return true;
    }
    
    // 超时错误 - 应该重试
    if (this.isTimeoutError(errorMessage)) {
      return true;
    }
    
    // 反爬虫检测相关 - 应该重试（可能需要更换UA）
    if (this.isAntiBot(errorMessage)) {
      return true;
    }
    
    // 服务器错误 (5xx) - 应该重试
    if (this.isServerError(errorMessage)) {
      return true;
    }
    
    // 解析错误或逻辑错误 - 不应该重试
    if (this.isParsingError(errorMessage)) {
      return false;
    }
    
    // 其他错误默认重试
    return true;
  }

  /**
   * 计算延迟时间（指数退避 + 随机抖动）
   * @param {number} attempt 当前尝试次数
   * @returns {number} 延迟毫秒数
   */
  calculateDelay(attempt) {
    // 指数退避：baseDelay * (2 ^ (attempt - 1))
    let delay = this.options.baseDelay * Math.pow(2, attempt - 1);
    
    // 限制最大延迟
    delay = Math.min(delay, this.options.maxDelay);
    
    // 添加随机抖动，避免多个客户端同时重试
    const jitter = delay * this.options.jitterFactor * Math.random();
    
    return Math.floor(delay + jitter);
  }

  /**
   * 延迟执行
   * @param {number} ms 延迟毫秒数
   * @returns {Promise}
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 错误类型判断方法
  isNetworkError(message) {
    return message.includes('network') || 
           message.includes('connection') ||
           message.includes('fetch') ||
           message.includes('econnreset') ||
           message.includes('enotfound') ||
           message.includes('econnrefused');
  }

  isTimeoutError(message) {
    return message.includes('timeout') ||
           message.includes('timed out') ||
           message.includes('deadline exceeded');
  }

  isAntiBot(message) {
    return message.includes('blocked') ||
           message.includes('captcha') ||
           message.includes('access denied') ||
           message.includes('forbidden') ||
           message.includes('bot') ||
           message.includes('detected');
  }

  isServerError(message) {
    return message.includes('500') ||
           message.includes('502') ||
           message.includes('503') ||
           message.includes('504') ||
           message.includes('internal server error') ||
           message.includes('bad gateway') ||
           message.includes('service unavailable');
  }

  isParsingError(message) {
    return message.includes('no data extracted') ||
           message.includes('selector') ||
           message.includes('element not found') ||
           message.includes('parsing') ||
           message.includes('invalid format');
  }

  /**
   * 获取重试统计信息
   * @param {number} totalAttempts 总尝试次数
   * @param {number} totalTime 总耗时
   * @returns {Object} 统计信息
   */
  getRetryStats(totalAttempts, totalTime) {
    return {
      attempts: totalAttempts,
      totalTime: `${totalTime}ms`,
      avgTimePerAttempt: `${Math.round(totalTime / totalAttempts)}ms`,
      strategy: 'exponential_backoff',
      baseDelay: `${this.options.baseDelay}ms`,
      maxDelay: `${this.options.maxDelay}ms`
    };
  }
}