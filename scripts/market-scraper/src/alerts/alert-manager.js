import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class AlertManager {
  constructor() {
    this.repoOwner = 'VCCampus';
    this.repoName = '12factor';
  }

  async createGitHubIssue(anomaly) {
    try {
      // Check if gh is available
      this.checkGitHubCLI();

      const title = this.generateIssueTitle(anomaly);
      const body = this.generateIssueBody(anomaly);
      const labels = this.generateLabels(anomaly);

      // Create issue using gh CLI
      const command = `gh issue create \
        --repo ${this.repoOwner}/${this.repoName} \
        --title "${title}" \
        --body "${body}" \
        --label "${labels.join(',')}"`;

      console.log('Creating GitHub issue for anomaly...');
      const output = execSync(command, { encoding: 'utf8' });
      
      // Extract issue URL from output
      const urlMatch = output.match(/https:\/\/github\.com\/[^\s]+/);
      if (urlMatch) {
        console.log(`Issue created: ${urlMatch[0]}`);
        return urlMatch[0];
      }

      return output.trim();
    } catch (error) {
      console.error('Failed to create GitHub issue:', error.message);
      console.error('Make sure you have gh CLI installed and authenticated');
      return null;
    }
  }

  checkGitHubCLI() {
    try {
      execSync('gh --version', { stdio: 'ignore' });
      execSync('gh auth status', { stdio: 'ignore' });
    } catch (error) {
      throw new Error(
        'GitHub CLI (gh) is not installed or not authenticated. ' +
        'Please install gh and run "gh auth login" first.'
      );
    }
  }

  generateIssueTitle(anomaly) {
    const source = anomaly.source === 'youzhiyouxing' ? '有知有行' : 'CoinMarketCap';
    const date = new Date().toISOString().split('T')[0];
    
    return `[Alert] ${source} 数据异常波动 - ${date}`;
  }

  generateIssueBody(anomaly) {
    const source = anomaly.source === 'youzhiyouxing' ? '有知有行' : 'CoinMarketCap';
    const timestamp = new Date().toISOString();
    
    let body = `## 异常详情

- **数据源**: ${source}
- **检测时间**: ${timestamp}
- **异常类型**: ${anomaly.type}
- **严重程度**: ${anomaly.severity}

## 数据对比

| 指标 | 昨日值 | 今日值 | 变化 |
|------|--------|--------|------|
| 数值 | ${anomaly.details.previousValue} | ${anomaly.details.currentValue} | ${anomaly.details.change.toFixed(1)} |
| 变化率 | - | - | ${anomaly.details.changePercent.toFixed(1)}% |

## 异常说明

${anomaly.message}

## 可能原因

`;

    // Add possible reasons based on severity and change
    if (anomaly.severity === 'high') {
      body += `- 市场发生重大事件导致情绪剧烈波动
- 数据源可能存在异常或错误
- 网站更新导致数据采集出现问题`;
    } else if (anomaly.severity === 'medium') {
      body += `- 市场情绪正常波动
- 重要新闻或事件影响
- 数据更新延迟`;
    } else {
      body += `- 正常市场波动
- 轻微的市场情绪变化`;
    }

    body += `

## 建议操作

`;

    if (anomaly.severity === 'high') {
      body += `1. 立即检查数据源网站是否正常
2. 验证采集脚本是否需要更新
3. 手动验证数据准确性
4. 如确认为正常波动，关闭此Issue`;
    } else if (anomaly.severity === 'medium') {
      body += `1. 监控后续数据变化
2. 检查是否有相关市场新闻
3. 如持续异常，进一步调查`;
    } else {
      body += `1. 记录此波动供后续分析
2. 无需立即采取行动`;
    }

    body += `

---
*此Issue由market-scraper-cli自动创建*
*时间戳: ${timestamp}*`;

    return body;
  }

  generateLabels(anomaly) {
    const labels = ['alert', 'data-anomaly'];
    
    // Add severity label
    labels.push(`severity-${anomaly.severity}`);
    
    // Add source label
    labels.push(`source-${anomaly.source}`);
    
    return labels;
  }

  // Load alert template if exists
  loadTemplate(templateName) {
    try {
      const templatePath = join(__dirname, 'templates', `${templateName}.md`);
      return readFileSync(templatePath, 'utf8');
    } catch (error) {
      return null;
    }
  }
}