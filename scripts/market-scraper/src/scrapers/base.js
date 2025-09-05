export default class BaseScraper {
  constructor(browser, options = {}) {
    this.browser = browser;
    this.options = {
      timeout: options.timeout || 30000,
      retries: options.retries || 1,
      ...options
    };
  }

  async scrape() {
    let lastError = null;
    
    for (let i = 0; i < this.options.retries; i++) {
      try {
        const page = await this.browser.newPage();
        
        // Set viewport and user agent to avoid detection
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        
        const data = await this.scrapeWithPage(page);
        await page.close();
        
        if (data) {
          return this.processData(data);
        }
      } catch (error) {
        lastError = error;
        console.error(`Scraping attempt ${i + 1} failed:`, error.message);
        
        if (i < this.options.retries - 1) {
          await this.delay(2000 * (i + 1)); // Progressive delay
        }
      }
    }
    
    throw lastError || new Error('Scraping failed after all retries');
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