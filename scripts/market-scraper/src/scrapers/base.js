import ExponentialBackoffRetry from '../utils/exponential-backoff-retry.js';

export default class BaseScraper {
  constructor(contextManager, targetSite, options = {}) {
    this.contextManager = contextManager;
    this.targetSite = targetSite;
    this.options = {
      timeout: options.timeout || 30000,
      retries: options.retries || 4,
      verbose: options.verbose || false,
      ...options
    };
    this.retry = new ExponentialBackoffRetry();
  }

  async scrape() {
    const contextId = `scraper_${this.targetSite}_${Date.now()}`;
    let context = null;
    let page = null;
    const startTime = Date.now();
    
    try {
      const result = await this.retry.execute(async (attempt) => {
        const attemptStart = Date.now();
        
        try {
          // Get context (will reuse or create new)
          context = await this.contextManager.getContext(contextId, this.targetSite);
          page = await context.newPage();
          
          this.log(`Attempt ${attempt}: Starting scrape with new page`, 'debug');
          
          const data = await this.scrapeWithPage(page);
          const responseTime = Date.now() - attemptStart;
          
          if (data) {
            // Record success
            this.contextManager.recordContextUsage(contextId, true, responseTime);
            this.log(`Scrape successful in ${responseTime}ms`, 'debug');
            return this.processData(data);
          } else {
            throw new Error('No data extracted');
          }
        } catch (error) {
          const responseTime = Date.now() - attemptStart;
          this.contextManager.recordContextUsage(contextId, false, responseTime, error);
          
          this.log(`Attempt ${attempt} failed after ${responseTime}ms: ${error.message}`, 'debug');
          throw error;
        } finally {
          if (page) {
            await page.close();
            page = null;
          }
        }
      }, this.options.retries);
      
      const totalTime = Date.now() - startTime;
      this.log(`Total scraping time: ${totalTime}ms`, 'info');
      
      return result;
      
    } catch (error) {
      const totalTime = Date.now() - startTime;
      this.log(`Scraping failed after ${totalTime}ms: ${error.message}`, 'error');
      throw error;
    } finally {
      // Clean up resources
      if (page) {
        try {
          await page.close();
        } catch (e) {
          this.log(`Error closing page: ${e.message}`, 'debug');
        }
      }
      
      if (context) {
        await this.contextManager.releaseContext(contextId);
      }
    }
  }

  log(message, level = 'info') {
    if (!this.options.verbose && level === 'debug') return;
    
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.targetSite.toUpperCase()}]`;
    
    switch (level) {
      case 'debug':
        if (this.options.verbose) console.debug(`${prefix} ${message}`);
        break;
      case 'info':
        console.log(`${prefix} ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ⚠️  ${message}`);
        break;
      case 'error':
        console.error(`${prefix} ❌ ${message}`);
        break;
    }
  }

  async scrapeWithPage(page) {
    throw new Error('scrapeWithPage must be implemented by subclass');
  }

  processData(data) {
    return data;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  parseNumber(text) {
    if (!text) return null;
    const num = parseFloat(text.replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? null : num;
  }

  getLevel(value) {
    if (value <= 25) return { zh: '极度恐慌', en: 'Extreme Fear' };
    if (value <= 45) return { zh: '恐慌', en: 'Fear' };
    if (value <= 55) return { zh: '中性', en: 'Neutral' };
    if (value <= 75) return { zh: '贪婪', en: 'Greed' };
    return { zh: '极度贪婪', en: 'Extreme Greed' };
  }

  getColor(value) {
    if (value <= 25) return '#3b82f6'; // Blue - Extreme Fear
    if (value <= 45) return '#60a5fa'; // Light Blue - Fear
    if (value <= 55) return '#6b7280'; // Gray - Neutral
    if (value <= 75) return '#f59e0b'; // Orange - Greed
    return '#ef4444'; // Red - Extreme Greed
  }
}