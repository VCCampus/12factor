import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import chalk from 'chalk';
import YouzhiyouxingScraper from './scrapers/youzhiyouxing.js';
import CoinMarketCapScraper from './scrapers/coinmarketcap.js';
import DataValidator from './validators/data-validator.js';
import AlertManager from './alerts/alert-manager.js';

export default class MarketScraper {
  constructor(options = {}) {
    this.options = {
      output: options.output || './market-indicators.json',
      verbose: options.verbose || false,
      dryRun: options.dryRun || false
    };
    
    this.validator = new DataValidator();
    this.alertManager = new AlertManager();
  }

  log(message, level = 'info') {
    if (!this.options.verbose && level === 'debug') return;
    
    const prefix = {
      debug: chalk.gray('[DEBUG]'),
      info: chalk.blue('[INFO]'),
      warn: chalk.yellow('[WARN]'),
      error: chalk.red('[ERROR]')
    }[level] || '';
    
    console.log(`${prefix} ${message}`);
  }

  async verifySites() {
    const sites = [
      { name: '有知有行', url: 'https://youzhiyouxing.cn/data' },
      { name: 'CoinMarketCap', url: 'https://coinmarketcap.com/charts/fear-and-greed-index/' }
    ];
    
    const results = [];
    const browser = await chromium.launch({ headless: true });
    
    for (const site of sites) {
      const startTime = Date.now();
      try {
        const page = await browser.newPage();
        const response = await page.goto(site.url, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
        
        results.push({
          site: site.name,
          url: site.url,
          accessible: response.ok(),
          responseTime: Date.now() - startTime,
          error: null
        });
        
        await page.close();
      } catch (error) {
        results.push({
          site: site.name,
          url: site.url,
          accessible: false,
          responseTime: null,
          error: error.message
        });
      }
    }
    
    await browser.close();
    return results;
  }

  async loadPreviousData() {
    if (!existsSync(this.options.output)) {
      this.log('No previous data found', 'debug');
      return null;
    }
    
    try {
      const data = JSON.parse(readFileSync(this.options.output, 'utf8'));
      this.log('Previous data loaded successfully', 'debug');
      return data;
    } catch (error) {
      this.log(`Failed to load previous data: ${error.message}`, 'warn');
      return null;
    }
  }

  async run() {
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const result = {
      success: false,
      data: null,
      warnings: [],
      alerts: [],
      error: null
    };
    
    try {
      // Load previous data for comparison
      const previousData = await this.loadPreviousData();
      
      // Initialize scrapers
      const youzhiyouxingScraper = new YouzhiyouxingScraper(browser);
      const coinmarketcapScraper = new CoinMarketCapScraper(browser);
      
      // Collect data in parallel
      this.log('Scraping data from sources...', 'info');
      const [youzhiyouxingData, coinmarketcapData] = await Promise.allSettled([
        youzhiyouxingScraper.scrape(),
        coinmarketcapScraper.scrape()
      ]);
      
      // Process results
      const now = new Date().toISOString();
      const data = {
        version: '1.0.0',
        lastUpdate: now,
        status: 'success',
        data: {},
        fallback: {}
      };
      
      // Process 有知有行 data
      if (youzhiyouxingData.status === 'fulfilled' && youzhiyouxingData.value) {
        data.data.youzhiyouxing = youzhiyouxingData.value;
        this.log(`有知有行 data collected: ${youzhiyouxingData.value.indicators?.value}`, 'debug');
      } else {
        result.warnings.push('Failed to scrape 有知有行 data');
        if (previousData?.data?.youzhiyouxing) {
          data.fallback.youzhiyouxing = previousData.data.youzhiyouxing;
          data.fallback.youzhiyouxing.stale = true;
          data.fallback.youzhiyouxing.staleTime = now;
        }
      }
      
      // Process CoinMarketCap data
      if (coinmarketcapData.status === 'fulfilled' && coinmarketcapData.value) {
        data.data.coinmarketcap = coinmarketcapData.value;
        this.log(`CoinMarketCap data collected: ${coinmarketcapData.value.indicators?.value}`, 'debug');
      } else {
        result.warnings.push('Failed to scrape CoinMarketCap data');
        if (previousData?.data?.coinmarketcap) {
          data.fallback.coinmarketcap = previousData.data.coinmarketcap;
          data.fallback.coinmarketcap.stale = true;
          data.fallback.coinmarketcap.staleTime = now;
        }
      }
      
      // Validate data
      const validationResults = this.validator.validate(data, previousData);
      
      if (validationResults.anomalies.length > 0) {
        for (const anomaly of validationResults.anomalies) {
          this.log(`Anomaly detected: ${anomaly.message}`, 'warn');
          
          if (anomaly.severity === 'high' && !this.options.dryRun) {
            const issueUrl = await this.alertManager.createGitHubIssue(anomaly);
            if (issueUrl) {
              result.alerts.push(issueUrl);
            }
          }
        }
      }
      
      // Add validation warnings
      result.warnings.push(...validationResults.warnings);
      
      // Save data
      if (!this.options.dryRun) {
        writeFileSync(this.options.output, JSON.stringify(data, null, 2));
        this.log(`Data saved to ${this.options.output}`, 'info');
      } else {
        this.log('Dry run mode - data not saved', 'info');
      }
      
      result.success = true;
      result.data = data.data;
      
    } catch (error) {
      result.error = error.message;
      this.log(`Scraping failed: ${error.message}`, 'error');
      throw error;
    } finally {
      await browser.close();
    }
    
    return result;
  }
}