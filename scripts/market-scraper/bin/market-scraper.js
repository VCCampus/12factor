#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import MarketScraper from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const program = new Command();

program
  .name('market-scraper')
  .description('Scrape market indicators from youzhiyouxing.cn and coinmarketcap.com')
  .version(packageJson.version)
  .option('-o, --output <path>', 'Output JSON file path', './market-indicators.json')
  .option('-v, --verbose', 'Enable detailed logging with timing information', false)
  .option('--dry-run', 'Run without saving data', false)
  .option('--check-only', 'Only check if sites are accessible', false)
  .option('--log-file <path>', 'Custom log file path', './logs/market-scraper.log')
  .action(async (options) => {
    const scraper = new MarketScraper(options);
    
    try {
      console.log(chalk.blue.bold('🚀 Market Scraper v' + packageJson.version));
      console.log(chalk.gray('─'.repeat(50)));
      
      if (options.checkOnly) {
        console.log(chalk.yellow('📋 Running accessibility check...'));
        const results = await scraper.verifySites();
        
        console.log(chalk.gray('─'.repeat(50)));
        for (const result of results) {
          const status = result.accessible 
            ? chalk.green('✓ Accessible') 
            : chalk.red('✗ Not accessible');
          console.log(`${status} - ${result.site}`);
          if (result.error) {
            console.log(chalk.red(`  Error: ${result.error}`));
          } else if (result.responseTime) {
            console.log(chalk.gray(`  Response time: ${result.responseTime}ms`));
          }
        }
        process.exit(results.every(r => r.accessible) ? 0 : 1);
      }
      
      console.log(chalk.yellow('📊 Starting data collection...'));
      const result = await scraper.run();
      
      if (result.success) {
        console.log(chalk.green('✅ Data collection completed successfully!'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(chalk.cyan('📁 Output file:'), options.output);
        console.log(chalk.cyan('📈 有知有行:'), result.data.youzhiyouxing?.indicators?.value || 'N/A');
        console.log(chalk.cyan('📉 CMC:'), result.data.coinmarketcap?.indicators?.value || 'N/A');
        
        if (options.verbose && result.performance) {
          console.log(chalk.gray('─'.repeat(50)));
          console.log(chalk.magenta('📊 Performance Stats:'));
          console.log(chalk.gray(`⏱️  Total time: ${result.performance.totalTime}ms`));
          console.log(chalk.gray(`🌐 Scrape time: ${result.performance.scrapeTime}ms`));
          
          if (result.stats?.contextManager) {
            console.log(chalk.magenta('🔄 Context Manager:'));
            const ctx = result.stats.contextManager.contexts;
            console.log(chalk.gray(`   Active: ${ctx.active}, Idle: ${ctx.idle}, Total: ${ctx.total}`));
          }
          
          if (result.stats?.alertManager) {
            console.log(chalk.magenta('🚨 Alert Summary:'));
            const alerts = result.stats.alertManager.counts;
            console.log(chalk.gray(`   INFO: ${alerts.INFO}, WARNING: ${alerts.WARNING}, CRITICAL: ${alerts.CRITICAL}`));
          }
        }
        
        if (result.warnings && result.warnings.length > 0) {
          console.log(chalk.yellow('\n⚠️  Warnings:'));
          result.warnings.forEach(w => console.log(chalk.yellow(`  - ${w}`)));
        }
        
        if (result.alerts && result.alerts.length > 0) {
          console.log(chalk.red('\n🚨 Alerts created:'));
          result.alerts.forEach(a => console.log(chalk.red(`  - ${a}`)));
        }
      } else {
        console.log(chalk.red('❌ Data collection failed!'));
        if (result.error) {
          console.log(chalk.red(`Error: ${result.error}`));
        }
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('❌ Fatal error:'), error.message);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program.parse();