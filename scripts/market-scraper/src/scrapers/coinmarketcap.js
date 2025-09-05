import BaseScraper from './base.js';

export default class CoinMarketCapScraper extends BaseScraper {
  async scrapeWithPage(page) {
    await page.goto('https://coinmarketcap.com/charts/fear-and-greed-index/', {
      waitUntil: 'networkidle',
      timeout: this.options.timeout
    });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Try multiple selectors for the fear and greed index
    const selectors = [
      '#__next > div.sc-c304a813-1.etSVIy.global-layout-v2 > div > div.cmc-body-wrapper > div > div > div.sc-65e7f566-0.jpCqhh > div > div > div.sc-65e7f566-0.izPDqH > div.sc-65e7f566-0.kijrGb > div.sc-4c05d6ef-0.sc-7589ba5-0.jpNfiB.iwXIFg.sc-4faaf331-1.eBcJCx > div > div > div:nth-child(2)',
      '[class*="fear-greed"]',
      '[class*="fearGreed"]',
      'div:has-text("Fear & Greed")',
      '[data-testid="fear-greed-index"]'
    ];
    
    let data = null;
    
    for (const selector of selectors) {
      try {
        const element = await page.$(selector);
        if (!element) continue;
        
        const text = await element.textContent();
        
        // Look for the index value (usually displayed prominently)
        const valueMatch = text.match(/(\d+)(?:\s*\/\s*100)?/);
        const value = valueMatch ? parseInt(valueMatch[1]) : null;
        
        if (value !== null && value >= 0 && value <= 100) {
          // Try to extract level text (Greed, Fear, etc.)
          const levelMatch = text.match(/(Extreme Fear|Fear|Neutral|Greed|Extreme Greed)/i);
          const level = levelMatch ? levelMatch[1] : null;
          
          data = {
            value,
            level,
            text,
            selector
          };
          break;
        }
      } catch (error) {
        console.debug(`Selector ${selector} failed:`, error.message);
      }
    }
    
    // Alternative: Try to find the value in the page's structured data
    if (!data) {
      try {
        const scriptContent = await page.evaluate(() => {
          const scripts = Array.from(document.querySelectorAll('script'));
          for (const script of scripts) {
            if (script.textContent.includes('fearGreed') || script.textContent.includes('fear_greed')) {
              return script.textContent;
            }
          }
          return null;
        });
        
        if (scriptContent) {
          const match = scriptContent.match(/"value":\s*(\d+)/);
          if (match) {
            data = {
              value: parseInt(match[1]),
              level: null,
              text: 'Extracted from script',
              selector: 'script tag'
            };
          }
        }
      } catch (error) {
        console.debug('Failed to extract from script tags:', error.message);
      }
    }
    
    // Last resort: Look for any number between 0-100 near "Fear" or "Greed" text
    if (!data) {
      const pageText = await page.textContent('body');
      const patterns = [
        /Fear.*?(\d+)/i,
        /Greed.*?(\d+)/i,
        /Index.*?(\d+)/i,
        /(\d+).*?(Fear|Greed)/i
      ];
      
      for (const pattern of patterns) {
        const match = pageText.match(pattern);
        if (match) {
          const value = parseInt(match[1]);
          if (value >= 0 && value <= 100) {
            data = {
              value,
              level: match[2] || null,
              text: match[0],
              selector: 'body text search'
            };
            break;
          }
        }
      }
    }
    
    return data;
  }

  processData(data) {
    if (!data || data.value === null) {
      throw new Error('No valid data extracted from CoinMarketCap');
    }
    
    const value = data.value;
    const level = this.getLevel(value);
    const now = new Date().toISOString();
    
    return {
      source: 'https://coinmarketcap.com/charts/fear-and-greed-index/',
      fetchTime: now,
      indicators: {
        value: value,
        level: data.level || level.en,
        levelZh: level.zh,
        description: `Fear & Greed Index: ${value} - ${data.level || level.en}`,
        components: {
          // These would need additional scraping or API access
          volatility: null,
          momentum: null,
          socialMedia: null,
          surveys: null,
          dominance: null,
          trends: null
        }
      },
      visualization: {
        type: 'gauge',
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