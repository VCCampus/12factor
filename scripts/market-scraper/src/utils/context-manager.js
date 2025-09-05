/**
 * Context Manager - 统一管理 Playwright 浏览器上下文
 * 解决 setUserAgent API 问题，实现智能 UA 选择和 Context 复用
 */

export default class ContextManager {
  constructor(browser, options = {}) {
    this.browser = browser;
    this.options = {
      maxContextUsage: options.maxContextUsage || 10,
      cooldownTime: options.cooldownTime || 30000, // 30 seconds
      maxFailures: options.maxFailures || 3,
      ...options
    };
    
    this.contexts = new Map();
    this.uaStats = new Map();
    this.initializeUserAgentPool();
  }

  initializeUserAgentPool() {
    this.userAgentPool = {
      'chrome_win_121': {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'chrome_win_120': {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'chrome_mac_121': {
        agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'firefox_win_121': {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'firefox_mac_121': {
        agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'safari_mac_17': {
        agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'edge_win_121': {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'chrome_linux_121': {
        agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'firefox_linux_121': {
        agent: 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/121.0',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'chrome_mac_120': {
        agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'safari_mac_16': {
        agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'edge_mac_121': {
        agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'chrome_win_119': {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'firefox_win_120': {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      },
      'opera_win_105': {
        agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0',
        stats: { attempts: 0, successes: 0, avgResponseTime: 0, lastUsed: null }
      }
    };
  }

  /**
   * 智能选择 User Agent (基于成功率的加权算法)
   */
  selectUserAgent(targetSite) {
    const agents = Object.keys(this.userAgentPool);
    const scores = agents.map(id => {
      const ua = this.userAgentPool[id];
      const siteStats = this.uaStats.get(`${id}_${targetSite}`) || { attempts: 0, successes: 0, avgResponseTime: 5000 };
      
      const successRate = siteStats.attempts > 0 ? siteStats.successes / siteStats.attempts : 0.5;
      const speedScore = Math.max(0, 1 - (siteStats.avgResponseTime - 1000) / 10000); // Normalize response time
      const recentUsageScore = ua.stats.lastUsed ? Math.max(0, 1 - (Date.now() - new Date(ua.stats.lastUsed).getTime()) / (24 * 60 * 60 * 1000)) : 0.5;
      
      // Weighted scoring: SuccessRate(70%) + Speed(20%) + RecentUsage(10%)
      const score = (successRate * 0.7) + (speedScore * 0.2) + (recentUsageScore * 0.1);
      
      return { id, score, successRate, attempts: siteStats.attempts };
    });
    
    // Sort by score
    scores.sort((a, b) => b.score - a.score);
    
    // Selection strategy: 80% top 3, 15% middle, 5% exploration
    const rand = Math.random();
    let selectedId;
    
    if (rand < 0.8) {
      // Top 3 performers
      const top3 = scores.slice(0, 3);
      selectedId = top3[Math.floor(Math.random() * top3.length)].id;
    } else if (rand < 0.95) {
      // Middle performers
      const middle = scores.slice(3, Math.min(scores.length, 8));
      selectedId = middle.length > 0 ? middle[Math.floor(Math.random() * middle.length)].id : scores[0].id;
    } else {
      // Exploration: try underused agents
      const unexplored = scores.filter(s => s.attempts < 5);
      selectedId = unexplored.length > 0 ? unexplored[Math.floor(Math.random() * unexplored.length)].id : scores[0].id;
    }
    
    return { id: selectedId, agent: this.userAgentPool[selectedId].agent };
  }

  /**
   * 创建或复用 Context
   */
  async getContext(contextId, targetSite) {
    // Check if we have a reusable context
    const existingContext = this.contexts.get(contextId);
    if (existingContext && existingContext.state === 'IDLE' && existingContext.usageCount < this.options.maxContextUsage) {
      existingContext.state = 'ACTIVE';
      existingContext.usageCount++;
      return existingContext.context;
    }
    
    // Create new context
    const uaSelection = this.selectUserAgent(targetSite);
    
    const contextOptions = {
      userAgent: uaSelection.agent,
      viewport: { width: 1920, height: 1080 },
      locale: 'zh-CN',
      timezoneId: 'Asia/Shanghai',
      extraHTTPHeaders: {
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    };
    
    const context = await this.browser.newContext(contextOptions);
    
    // Store context info
    this.contexts.set(contextId, {
      context,
      state: 'ACTIVE',
      usageCount: 1,
      userAgentId: uaSelection.id,
      targetSite,
      createdAt: new Date(),
      lastUsed: new Date(),
      failures: 0
    });
    
    return context;
  }

  /**
   * 记录 Context 使用结果
   */
  recordContextUsage(contextId, success, responseTime = 0, error = null) {
    const contextInfo = this.contexts.get(contextId);
    if (!contextInfo) return;
    
    const { userAgentId, targetSite } = contextInfo;
    const statsKey = `${userAgentId}_${targetSite}`;
    
    // Update UA statistics
    const currentStats = this.uaStats.get(statsKey) || { attempts: 0, successes: 0, totalResponseTime: 0, avgResponseTime: 0 };
    currentStats.attempts++;
    
    if (success) {
      currentStats.successes++;
      currentStats.totalResponseTime += responseTime;
      currentStats.avgResponseTime = currentStats.totalResponseTime / currentStats.successes;
      contextInfo.failures = 0; // Reset failure count on success
    } else {
      contextInfo.failures++;
    }
    
    this.uaStats.set(statsKey, currentStats);
    
    // Update global UA stats
    this.userAgentPool[userAgentId].stats.attempts++;
    if (success) {
      this.userAgentPool[userAgentId].stats.successes++;
    }
    this.userAgentPool[userAgentId].stats.lastUsed = new Date().toISOString();
    
    // Update context state
    if (contextInfo.failures >= this.options.maxFailures) {
      contextInfo.state = 'FAILED';
    } else {
      contextInfo.state = 'COOLING';
      // Auto return to IDLE after cooldown
      setTimeout(() => {
        if (this.contexts.has(contextId)) {
          this.contexts.get(contextId).state = 'IDLE';
        }
      }, this.options.cooldownTime);
    }
    
    contextInfo.lastUsed = new Date();
  }

  /**
   * 释放 Context
   */
  async releaseContext(contextId) {
    const contextInfo = this.contexts.get(contextId);
    if (!contextInfo) return;
    
    if (contextInfo.state === 'FAILED' || contextInfo.usageCount >= this.options.maxContextUsage) {
      // Close and remove failed or overused contexts
      await contextInfo.context.close();
      this.contexts.delete(contextId);
    } else {
      // Mark as available for reuse
      contextInfo.state = 'IDLE';
    }
  }

  /**
   * 清理过期的 Context
   */
  async cleanup() {
    const now = new Date();
    const expiredContexts = [];
    
    for (const [contextId, contextInfo] of this.contexts) {
      const ageInHours = (now - contextInfo.createdAt) / (1000 * 60 * 60);
      if (ageInHours > 1 || contextInfo.state === 'FAILED') {
        expiredContexts.push(contextId);
      }
    }
    
    for (const contextId of expiredContexts) {
      const contextInfo = this.contexts.get(contextId);
      await contextInfo.context.close();
      this.contexts.delete(contextId);
    }
    
    return expiredContexts.length;
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const contextStats = {
      active: 0,
      idle: 0,
      cooling: 0,
      failed: 0,
      total: this.contexts.size
    };
    
    for (const contextInfo of this.contexts.values()) {
      contextStats[contextInfo.state.toLowerCase()]++;
    }
    
    const uaStats = {};
    for (const [id, ua] of Object.entries(this.userAgentPool)) {
      uaStats[id] = {
        agent: ua.agent.substring(0, 50) + '...',
        attempts: ua.stats.attempts,
        successes: ua.stats.successes,
        successRate: ua.stats.attempts > 0 ? (ua.stats.successes / ua.stats.attempts * 100).toFixed(1) + '%' : '0%',
        lastUsed: ua.stats.lastUsed
      };
    }
    
    return {
      contexts: contextStats,
      userAgents: uaStats,
      siteSpecificStats: Object.fromEntries(this.uaStats)
    };
  }

  /**
   * 关闭所有 Context
   */
  async closeAll() {
    const promises = [];
    for (const contextInfo of this.contexts.values()) {
      promises.push(contextInfo.context.close());
    }
    await Promise.all(promises);
    this.contexts.clear();
  }
}