import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import chalk from 'chalk';
import YouzhiyouxingScraper from './scrapers/youzhiyouxing.js';
import CoinMarketCapScraper from './scrapers/coinmarketcap.js';
import DataValidator from './validators/data-validator.js';
import ContextManager from './utils/context-manager.js';
import StatisticalAnomalyDetector from './utils/statistical-anomaly-detector.js';
import EnhancedAlertManager from './utils/enhanced-alert-manager.js';

export default class MarketScraper {
  constructor(options = {}) {
    this.options = {
      output: options.output || './market-indicators.json',
      verbose: options.verbose || false,
      dryRun: options.dryRun || false,
      logFile: options.logFile || './logs/market-scraper.log'
    };
    
    this.validator = new DataValidator();
    this.alertManager = new EnhancedAlertManager({
      logFile: this.options.logFile,
      verbose: this.options.verbose
    });
    this.anomalyDetector = new StatisticalAnomalyDetector();
    this.contextManager = null; // Will be initialized in run()
    this.startTime = null;
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
    this.startTime = Date.now();
    
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Initialize context manager
    this.contextManager = new ContextManager(browser, {
      maxContextUsage: 10,
      cooldownTime: 30000,
      maxFailures: 3
    });
    
    const result = {
      success: false,
      data: null,
      warnings: [],
      alerts: [],
      error: null,
      performance: {},
      stats: {}
    };
    
    try {
      await this.alertManager.processAlert('INFO', 'Market scraper starting', { 
        version: '2.0.0',
        timestamp: new Date().toISOString() 
      });
      
      // Load previous data for comparison and anomaly detection
      const previousData = await this.loadPreviousData();
      
      // Initialize scrapers with context manager
      const youzhiyouxingScraper = new YouzhiyouxingScraper(
        this.contextManager, 
        'youzhiyouxing', 
        { verbose: this.options.verbose }
      );
      const coinmarketcapScraper = new CoinMarketCapScraper(
        this.contextManager, 
        'coinmarketcap', 
        { verbose: this.options.verbose }
      );
      
      // Collect data in parallel
      this.log('开始并行抓取数据...', 'info');
      const scrapeStart = Date.now();
      
      const [youzhiyouxingData, coinmarketcapData] = await Promise.allSettled([
        youzhiyouxingScraper.scrape(),
        coinmarketcapScraper.scrape()
      ]);
      
      const scrapeTime = Date.now() - scrapeStart;
      result.performance.scrapeTime = scrapeTime;
      
      // Process results
      const now = new Date().toISOString();
      const data = {
        version: '2.0.0',
        lastUpdate: now,
        status: 'success',
        data: {},
        fallback: {},
        performance: {
          scrapeTime: `${scrapeTime}ms`,
          timestamp: now
        }
      };
      
      let successCount = 0;
      const anomalies = [];
      
      // Process 有知有行 data
      if (youzhiyouxingData.status === 'fulfilled' && youzhiyouxingData.value) {
        data.data.youzhiyouxing = youzhiyouxingData.value;
        successCount++;
        
        // Anomaly detection for 有知有行
        if (previousData?.data?.youzhiyouxing) {
          const historicalData = this.extractHistoricalData(previousData, 'youzhiyouxing');
          const newValue = youzhiyouxingData.value.indicators?.value;
          
          if (typeof newValue === 'number') {
            const anomalyResult = this.anomalyDetector.detectAnomaly(newValue, historicalData, 'youzhiyouxing');
            if (anomalyResult.isAnomaly) {
              anomalies.push(anomalyResult);
              await this.alertManager.processAlert('WARNING', 
                `有知有行数据异常: ${anomalyResult.message}`, 
                { source: 'youzhiyouxing', ...anomalyResult }
              );
            } else {
              await this.alertManager.processAlert('INFO', 
                `有知有行数据正常: ${anomalyResult.message}`, 
                { source: 'youzhiyouxing', value: newValue }
              );
            }
          }
        }
        
        this.log(`✅ 有知有行数据收集成功: ${youzhiyouxingData.value.indicators?.value}`, 'info');
      } else {
        const errorMsg = youzhiyouxingData.reason?.message || 'Unknown error';
        await this.alertManager.processAlert('WARNING', 
          `有知有行数据抓取失败: ${errorMsg}`, 
          { source: 'youzhiyouxing', error: errorMsg }
        );
        result.warnings.push('Failed to scrape 有知有行 data');
        
        // Use fallback data if available
        if (previousData?.data?.youzhiyouxing) {
          data.fallback.youzhiyouxing = previousData.data.youzhiyouxing;
          data.fallback.youzhiyouxing.stale = true;
          data.fallback.youzhiyouxing.staleTime = now;
          this.log('使用有知有行缓存数据', 'warn');
        }
      }
      
      // Process CoinMarketCap data
      if (coinmarketcapData.status === 'fulfilled' && coinmarketcapData.value) {
        data.data.coinmarketcap = coinmarketcapData.value;
        successCount++;
        
        // Anomaly detection for CoinMarketCap
        if (previousData?.data?.coinmarketcap) {
          const historicalData = this.extractHistoricalData(previousData, 'coinmarketcap');
          const newValue = coinmarketcapData.value.indicators?.value;
          
          if (typeof newValue === 'number') {
            const anomalyResult = this.anomalyDetector.detectAnomaly(newValue, historicalData, 'coinmarketcap');
            if (anomalyResult.isAnomaly) {
              anomalies.push(anomalyResult);
              await this.alertManager.processAlert('WARNING', 
                `CoinMarketCap数据异常: ${anomalyResult.message}`, 
                { source: 'coinmarketcap', ...anomalyResult }
              );
            } else {
              await this.alertManager.processAlert('INFO', 
                `CoinMarketCap数据正常: ${anomalyResult.message}`, 
                { source: 'coinmarketcap', value: newValue }
              );
            }
          }
        }
        
        this.log(`✅ CoinMarketCap数据收集成功: ${coinmarketcapData.value.indicators?.value}`, 'info');
      } else {
        const errorMsg = coinmarketcapData.reason?.message || 'Unknown error';
        await this.alertManager.processAlert('WARNING', 
          `CoinMarketCap数据抓取失败: ${errorMsg}`, 
          { source: 'coinmarketcap', error: errorMsg }
        );
        result.warnings.push('Failed to scrape CoinMarketCap data');
        
        // Use fallback data if available
        if (previousData?.data?.coinmarketcap) {
          data.fallback.coinmarketcap = previousData.data.coinmarketcap;
          data.fallback.coinmarketcap.stale = true;
          data.fallback.coinmarketcap.staleTime = now;
          this.log('使用CoinMarketCap缓存数据', 'warn');
        }
      }
      
      // Check if all sources failed (critical condition based on your requirements)
      if (successCount === 0) {
        const criticalMsg = '所有数据源抓取失败，无法生成数据文件';
        await this.alertManager.processAlert('CRITICAL', criticalMsg, {
          youzhiyouxing: youzhiyouxingData.reason?.message,
          coinmarketcap: coinmarketcapData.reason?.message,
          totalSources: 2,
          successCount: 0
        });
        
        // According to your decision: return error, don't generate file
        throw new Error(criticalMsg);
      }
      
      // Add context manager stats
      result.stats.contextManager = this.contextManager.getStats();
      result.stats.alertManager = this.alertManager.getAlertStats();
      
      // Legacy validation (keep existing validation logic)
      const validationResults = this.validator.validate(data, previousData);
      result.warnings.push(...validationResults.warnings);
      
      // Save data (only if not dry run and we have successful data)
      if (!this.options.dryRun) {
        // Add historical data for anomaly detection
        data.history = this.updateHistoricalData(previousData, data);
        
        writeFileSync(this.options.output, JSON.stringify(data, null, 2));
        this.log(`📁 数据已保存到 ${this.options.output}`, 'info');
        
        await this.alertManager.processAlert('INFO', 
          `数据收集完成，成功率: ${successCount}/2`, 
          { successCount, totalSources: 2, outputFile: this.options.output }
        );
      } else {
        this.log('🔄 干运行模式 - 数据未保存', 'info');
      }
      
      result.success = true;
      result.data = data.data;
      result.performance.totalTime = Date.now() - this.startTime;
      
    } catch (error) {
      result.error = error.message;
      result.performance.totalTime = Date.now() - this.startTime;
      
      this.log(`❌ 抓取失败: ${error.message}`, 'error');
      
      await this.alertManager.processAlert('CRITICAL', 
        `系统运行失败: ${error.message}`, 
        { 
          error: error.message, 
          stack: error.stack,
          totalTime: result.performance.totalTime
        }
      );
      
      throw error;
    } finally {
      // Cleanup resources
      if (this.contextManager) {
        const cleanedContexts = await this.contextManager.cleanup();
        if (cleanedContexts > 0) {
          this.log(`🧹 清理了 ${cleanedContexts} 个过期Context`, 'debug');
        }
        await this.contextManager.closeAll();
      }
      
      await browser.close();
      
      const totalTime = Date.now() - this.startTime;
      this.log(`⏱️ 总运行时间: ${totalTime}ms`, 'info');
    }
    
    return result;
  }

  /**
   * Extract historical data for anomaly detection
   */
  extractHistoricalData(previousData, source) {
    if (!previousData?.history?.[source]) {
      return [];
    }
    
    return previousData.history[source].map(entry => ({
      value: entry.value,
      timestamp: entry.timestamp
    }));
  }

  /**
   * Update historical data with new values
   */
  updateHistoricalData(previousData, newData) {
    const history = previousData?.history || {};
    const maxHistoryDays = 30;
    const cutoffDate = new Date(Date.now() - maxHistoryDays * 24 * 60 * 60 * 1000);
    
    // Update 有知有行 history
    if (newData.data.youzhiyouxing?.indicators?.value !== undefined) {
      const currentHistory = history.youzhiyouxing || [];
      const newEntry = {
        value: newData.data.youzhiyouxing.indicators.value,
        timestamp: newData.lastUpdate,
        level: newData.data.youzhiyouxing.indicators.level
      };
      
      // Add new entry and filter old ones
      const updatedHistory = [newEntry, ...currentHistory]
        .filter(entry => new Date(entry.timestamp) > cutoffDate)
        .slice(0, maxHistoryDays);
      
      history.youzhiyouxing = updatedHistory;
    }
    
    // Update CoinMarketCap history
    if (newData.data.coinmarketcap?.indicators?.value !== undefined) {
      const currentHistory = history.coinmarketcap || [];
      const newEntry = {
        value: newData.data.coinmarketcap.indicators.value,
        timestamp: newData.lastUpdate,
        level: newData.data.coinmarketcap.indicators.level
      };
      
      // Add new entry and filter old ones
      const updatedHistory = [newEntry, ...currentHistory]
        .filter(entry => new Date(entry.timestamp) > cutoffDate)
        .slice(0, maxHistoryDays);
      
      history.coinmarketcap = updatedHistory;
    }
    
    return history;
  }
}