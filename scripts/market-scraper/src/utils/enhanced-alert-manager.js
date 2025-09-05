/**
 * 增强告警管理系统 - 三级告警机制
 * INFO → WARNING → CRITICAL
 */

import { execSync } from 'child_process';
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import chalk from 'chalk';

export default class EnhancedAlertManager {
  constructor(options = {}) {
    this.options = {
      logFile: options.logFile || './logs/market-scraper.log',
      githubRepo: options.githubRepo || 'VCCampus/12factor',
      enableGithubIssues: options.enableGithubIssues !== false,
      verbose: options.verbose || false,
      ...options
    };
    
    this.alertCounts = {
      INFO: 0,
      WARNING: 0,
      CRITICAL: 0
    };
    
    this.recentAlerts = [];
    this.setupLogDirectory();
  }

  setupLogDirectory() {
    const logDir = dirname(this.options.logFile);
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * 处理告警
   * @param {string} level 告警级别: INFO, WARNING, CRITICAL
   * @param {string} message 告警消息
   * @param {Object} context 上下文信息
   * @returns {Promise<Object>} 处理结果
   */
  async processAlert(level, message, context = {}) {
    const alert = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      id: this.generateAlertId()
    };

    this.alertCounts[level]++;
    this.recentAlerts.unshift(alert);
    
    // 保持最近100条告警记录
    if (this.recentAlerts.length > 100) {
      this.recentAlerts = this.recentAlerts.slice(0, 100);
    }

    const result = {
      alertId: alert.id,
      processed: false,
      actions: [],
      githubIssue: null,
      error: null
    };

    try {
      switch (level) {
        case 'INFO':
          await this.handleInfoAlert(alert, result);
          break;
        case 'WARNING':
          await this.handleWarningAlert(alert, result);
          break;
        case 'CRITICAL':
          await this.handleCriticalAlert(alert, result);
          break;
        default:
          throw new Error(`Unknown alert level: ${level}`);
      }
      
      result.processed = true;
    } catch (error) {
      result.error = error.message;
      this.logToConsole(`Failed to process ${level} alert: ${error.message}`, 'error');
    }

    return result;
  }

  /**
   * 处理 INFO 级别告警
   */
  async handleInfoAlert(alert, result) {
    // INFO: 控制台日志 + 文件日志
    this.logToConsole(alert.message, 'info');
    this.logToFile(alert);
    result.actions.push('console_log', 'file_log');
  }

  /**
   * 处理 WARNING 级别告警
   */
  async handleWarningAlert(alert, result) {
    // WARNING: 控制台警告 + 文件日志 + GitHub Issue
    this.logToConsole(`⚠️  WARNING: ${alert.message}`, 'warn');
    this.logToFile(alert);
    result.actions.push('console_warn', 'file_log');

    if (this.options.enableGithubIssues) {
      try {
        const issueUrl = await this.createGitHubIssue({
          title: `⚠️ Market Scraper Warning: ${alert.context.source || 'System'}`,
          labels: ['warning', 'auto-generated'],
          body: this.formatWarningIssue(alert),
          priority: 'normal'
        });
        
        result.githubIssue = issueUrl;
        result.actions.push('github_issue');
        this.logToConsole(`GitHub issue created: ${issueUrl}`, 'info');
      } catch (error) {
        result.error = `Failed to create GitHub issue: ${error.message}`;
      }
    }
  }

  /**
   * 处理 CRITICAL 级别告警
   */
  async handleCriticalAlert(alert, result) {
    // CRITICAL: 控制台错误 + 文件日志 + GitHub Issue + 系统退出码
    this.logToConsole(`🚨 CRITICAL: ${alert.message}`, 'error');
    this.logToFile(alert);
    result.actions.push('console_error', 'file_log', 'exit_code');

    // 设置非零退出码
    process.exitCode = 1;

    if (this.options.enableGithubIssues) {
      try {
        const issueUrl = await this.createGitHubIssue({
          title: `🚨 CRITICAL: Market Scraper Failure`,
          labels: ['critical', 'urgent', 'bug'],
          body: this.formatCriticalIssue(alert),
          priority: 'high'
        });
        
        result.githubIssue = issueUrl;
        result.actions.push('github_issue');
        this.logToConsole(`GitHub issue created: ${issueUrl}`, 'info');
      } catch (error) {
        result.error = `Failed to create GitHub issue: ${error.message}`;
      }
    }
  }

  /**
   * 控制台日志输出
   */
  logToConsole(message, level = 'info') {
    const timestamp = new Date().toLocaleString('zh-CN');
    const prefix = `[${timestamp}]`;
    
    switch (level) {
      case 'info':
        console.log(chalk.blue(prefix), message);
        break;
      case 'warn':
        console.warn(chalk.yellow(prefix), message);
        break;
      case 'error':
        console.error(chalk.red(prefix), message);
        break;
      case 'debug':
        if (this.options.verbose) {
          console.debug(chalk.gray(prefix), message);
        }
        break;
    }
  }

  /**
   * 文件日志记录
   */
  logToFile(alert) {
    const logEntry = {
      timestamp: alert.timestamp,
      level: alert.level,
      id: alert.id,
      message: alert.message,
      context: alert.context
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    
    try {
      appendFileSync(this.options.logFile, logLine, 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  /**
   * 创建 GitHub Issue
   */
  async createGitHubIssue({ title, body, labels = [], priority = 'normal' }) {
    if (!this.options.enableGithubIssues) {
      return null;
    }

    try {
      // 检查是否有相似的未关闭 issue
      const existingIssue = await this.findSimilarIssue(title);
      if (existingIssue) {
        await this.addCommentToIssue(existingIssue, body);
        return `${existingIssue} (updated)`;
      }

      // 构建 gh 命令
      const labelStr = labels.map(l => `"${l}"`).join(',');
      const command = `gh issue create --repo "${this.options.githubRepo}" --title "${title}" --body "${body}" --label "${labelStr}"`;
      
      const issueUrl = execSync(command, { encoding: 'utf8' }).trim();
      return issueUrl;
    } catch (error) {
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }

  /**
   * 查找相似的 issue
   */
  async findSimilarIssue(title) {
    try {
      const searchTerm = title.includes('WARNING') ? 'Market Scraper Warning' : 'Market Scraper';
      const command = `gh issue list --repo "${this.options.githubRepo}" --search "${searchTerm}" --state open --limit 5 --json number,title`;
      
      const result = execSync(command, { encoding: 'utf8' }).trim();
      const issues = JSON.parse(result);
      
      // 查找最近24小时内的相似issue
      for (const issue of issues) {
        if (issue.title.includes('Market Scraper')) {
          return `https://github.com/${this.options.githubRepo}/issues/${issue.number}`;
        }
      }
      
      return null;
    } catch (error) {
      // 如果查找失败，继续创建新issue
      return null;
    }
  }

  /**
   * 向现有 issue 添加评论
   */
  async addCommentToIssue(issueUrl, body) {
    try {
      const issueNumber = issueUrl.split('/').pop();
      const command = `gh issue comment ${issueNumber} --repo "${this.options.githubRepo}" --body "${body}"`;
      execSync(command, { encoding: 'utf8' });
    } catch (error) {
      // 如果添加评论失败，不影响主流程
      console.warn('Failed to add comment to existing issue:', error.message);
    }
  }

  /**
   * 格式化 WARNING 级别 Issue 内容
   */
  formatWarningIssue(alert) {
    const { message, context, timestamp } = alert;
    
    return `
## ⚠️ Market Scraper Warning

**时间**: ${new Date(timestamp).toLocaleString('zh-CN')}
**级别**: WARNING
**来源**: ${context.source || 'Unknown'}

### 问题描述
${message}

### 上下文信息
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

### 建议操作
- 检查网络连接状况
- 验证目标网站是否可访问
- 查看详细日志: \`${this.options.logFile}\`

---
🤖 此 issue 由 Market Scraper 自动创建
`.trim();
  }

  /**
   * 格式化 CRITICAL 级别 Issue 内容
   */
  formatCriticalIssue(alert) {
    const { message, context, timestamp } = alert;
    
    return `
## 🚨 CRITICAL: Market Scraper 系统故障

**时间**: ${new Date(timestamp).toLocaleString('zh-CN')}
**级别**: CRITICAL
**状态**: 系统无法正常工作

### 🔴 关键问题
${message}

### 📊 系统状态
- **告警统计**: INFO(${this.alertCounts.INFO}) WARNING(${this.alertCounts.WARNING}) CRITICAL(${this.alertCounts.CRITICAL})
- **最近运行**: ${timestamp}
- **退出代码**: 非零 (表示失败)

### 🔍 详细上下文
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

### 🛠 紧急处理步骤
1. **立即检查**: 运行 \`npx market-scraper --check-only\` 验证站点可访问性
2. **查看日志**: 检查 \`${this.options.logFile}\` 获取详细错误信息
3. **手动验证**: 访问数据源网站确认是否正常
4. **系统恢复**: 根据错误类型采取相应修复措施

### 📋 调试信息
- **Node.js**: \`node --version\`
- **Playwright**: \`playwright --version\` 
- **系统**: ${process.platform} ${process.arch}

### 🆘 如果问题持续
请联系系统管理员或查看项目文档进行故障排除。

---
🚨 **此为系统关键故障，需要立即处理** 🚨

🤖 此 issue 由 Market Scraper 自动创建于 ${new Date(timestamp).toLocaleString('zh-CN')}
`.trim();
  }

  /**
   * 生成告警ID
   */
  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 批量处理告警
   */
  async processMultipleAlerts(alerts) {
    const results = [];
    
    for (const { level, message, context } of alerts) {
      try {
        const result = await this.processAlert(level, message, context);
        results.push(result);
      } catch (error) {
        results.push({
          error: error.message,
          level,
          message,
          processed: false
        });
      }
    }
    
    return results;
  }

  /**
   * 获取告警统计
   */
  getAlertStats() {
    return {
      counts: { ...this.alertCounts },
      total: Object.values(this.alertCounts).reduce((sum, count) => sum + count, 0),
      recentAlerts: this.recentAlerts.slice(0, 10).map(alert => ({
        level: alert.level,
        message: alert.message.substring(0, 100) + (alert.message.length > 100 ? '...' : ''),
        timestamp: alert.timestamp,
        id: alert.id
      })),
      logFile: this.options.logFile
    };
  }

  /**
   * 清理过期的告警记录
   */
  cleanup() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.recentAlerts = this.recentAlerts.filter(alert => 
      new Date(alert.timestamp) > oneDayAgo
    );
  }
}