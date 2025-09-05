import BaseScraper from './base.js';

export default class YouzhiyouxingScraper extends BaseScraper {
  async scrapeWithPage(page) {
    await page.goto('https://youzhiyouxing.cn/data', {
      waitUntil: 'networkidle',
      timeout: this.options.timeout
    });
    
    // Wait for thermometer element
    await page.waitForSelector('.thermometer', { timeout: 10000 });
    
    // Try multiple selectors for robustness
    const selectors = [
      '#phx-GGFXxSSCRVIn9Hek > div:nth-child(2) > div.view-container.tw-px-4.tw-pt-6.tw-space-y-6 > section:nth-child(1) > div.thermometer.tw-space-y-4 > div:nth-child(1)',
      'div.thermometer',
      '[class*="thermometer"]',
      'section:has(div.thermometer)'
    ];
    
    let data = null;
    
    for (const selector of selectors) {
      try {
        const element = await page.$(selector);
        if (!element) continue;
        
        // Extract text content
        const text = await element.textContent();
        
        // Try to extract value from various possible locations
        const valueMatch = text.match(/(\d+(?:\.\d+)?)/);
        const value = valueMatch ? parseFloat(valueMatch[1]) : null;
        
        if (value !== null && value >= 0 && value <= 100) {
          data = {
            value,
            text,
            selector
          };
          break;
        }
      } catch (error) {
        console.debug(`Selector ${selector} failed:`, error.message);
      }
    }
    
    // If no specific value found, try to get any numeric value from the page
    if (!data) {
      const pageText = await page.textContent('body');
      const matches = pageText.match(/温度[：:]\s*(\d+(?:\.\d+)?)/);
      if (matches) {
        data = {
          value: parseFloat(matches[1]),
          text: matches[0],
          selector: 'body text search'
        };
      }
    }
    
    return data;
  }

  processData(data) {
    if (!data || data.value === null) {
      throw new Error('No valid data extracted from 有知有行');
    }
    
    const value = data.value;
    const level = this.getLevel(value);
    const now = new Date().toISOString();
    
    return {
      source: 'https://youzhiyouxing.cn/data',
      fetchTime: now,
      indicators: {
        value: value,
        level: level.zh,
        levelEn: level.en,
        description: `市场温度：${value}，${level.zh}`,
        trend: null, // Will be calculated when compared with previous data
        changeFromYesterday: null
      },
      visualization: {
        type: 'thermometer',
        color: this.getColor(value),
        percentage: value
      },
      history: [], // Will be populated from previous data
      metadata: {
        selector: data.selector,
        rawText: data.text?.substring(0, 200)
      }
    };
  }
}