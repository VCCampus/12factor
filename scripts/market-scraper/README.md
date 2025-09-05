# Market Scraper CLI Tool

市场指标数据采集工具，用于从有知有行和CoinMarketCap采集恐慌贪婪指数数据。

## 功能特性

- 📊 采集有知有行温度计数据
- 📈 采集CoinMarketCap恐慌贪婪指数
- 🔍 数据验证和异常检测
- 🚨 自动创建GitHub Issue告警
- 📁 JSON格式数据输出
- 🔄 支持历史数据对比

## 安装

### 方式1：直接使用npx（推荐）

无需安装，直接运行：
```bash
npx /opt/src/12factor/scripts/market-scraper
```

注意事先完成基础配置:

```bash
zoomq @ rag4eecn /opt/src/12factor
$ npx playwright install
Need to install the following packages:
playwright@1.55.0
Ok to proceed? (y)

╔═══════════════════════════════════════════════════════════════════════════════╗
║ WARNING: It looks like you are running 'npx playwright install' without first ║
║ installing your project's dependencies.                                       ║
║                                                                               ║
║ To avoid unexpected behavior, please install your dependencies first, and     ║
║ then run Playwright's install command:                                        ║
║                                                                               ║
║     npm install                                                               ║
║     npx playwright install                                                    ║
║                                                                               ║
║ If your project does not yet depend on Playwright, first install the          ║
║ applicable npm package (most commonly @playwright/test), and                  ║
║ then run Playwright's install command to download the browsers:               ║
║                                                                               ║
║     npm install @playwright/test                                              ║
║     npx playwright install                                                    ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
Downloading Chromium 140.0.7339.16 (playwright build v1187)...
```


### 方式2：本地安装

```bash
cd /opt/src/12factor/scripts/market-scraper
npm install
```

## 使用方法

### 基础用法

```bash
# 使用默认配置采集数据
npx /opt/src/12factor/scripts/market-scraper

# 指定输出文件路径
npx /opt/src/12factor/scripts/market-scraper -o /opt/src/12factor/vue/public/data/market-indicators.json

# 开启详细日志
npx /opt/src/12factor/scripts/market-scraper -v

# 测试模式（不保存数据）
npx /opt/src/12factor/scripts/market-scraper --dry-run

# 仅检查网站可访问性
npx /opt/src/12factor/scripts/market-scraper --check-only
```

### 命令行参数

- `-o, --output <path>`: 输出JSON文件路径（默认：`./market-indicators.json`）
- `-v, --verbose`: 开启详细日志输出
- `--dry-run`: 测试模式，不保存数据
- `--check-only`: 仅检查网站可访问性
- `-h, --help`: 显示帮助信息
- `-V, --version`: 显示版本号

## 人工运行检验

### 1. 首次运行测试

```bash
# 进入工具目录
cd /opt/src/12factor/scripts/market-scraper

# 安装依赖
npm install

# 检查网站可访问性
npm start -- --check-only

# 如果网站可访问，执行数据采集（测试模式）
npm start -- --dry-run -v

# 执行实际数据采集
npm start -- -o ../../vue/public/data/market-indicators.json -v
```

### 2. 验证数据采集结果

成功采集后，检查输出文件：
```bash
# 查看生成的JSON文件
cat ../../vue/public/data/market-indicators.json | jq '.'

# 检查关键字段
cat ../../vue/public/data/market-indicators.json | jq '.data.youzhiyouxing.indicators.value'
cat ../../vue/public/data/market-indicators.json | jq '.data.coinmarketcap.indicators.value'
```

### 3. 查看日志输出

正常输出示例：
```
🚀 Market Scraper v1.0.0
──────────────────────────────────────────────────
📊 Starting data collection...
[INFO] Scraping data from sources...
[DEBUG] 有知有行 data collected: 65
[DEBUG] CoinMarketCap data collected: 72
✅ Data collection completed successfully!
──────────────────────────────────────────────────
📁 Output file: ../../vue/public/data/market-indicators.json
📈 有知有行: 65
📉 CMC: 72
```

异常告警示例：
```
⚠️  Warnings:
  - 有知有行 value changed by 35.0 points (53.8%)

🚨 Alerts created:
  - https://github.com/VCCampus/12factor/issues/123
```

## 配置到Crontab

### 1. 准备脚本

创建执行脚本 `/opt/src/12factor/scripts/run-market-scraper.sh`：

```bash
#!/bin/bash
# Market Scraper Cron Script

# 设置环境变量
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
export NODE_PATH="/usr/local/lib/node_modules"

# 记录执行时间
echo "========================================" >> /opt/src/12factor/logs/market-scraper.log
echo "Execution time: $(date '+%Y-%m-%d %H:%M:%S')" >> /opt/src/12factor/logs/market-scraper.log

# 切换到项目目录
cd /opt/src/12factor/scripts/market-scraper

# 确保npx可用
if ! command -v npx &> /dev/null; then
    echo "Error: npx not found" >> /opt/src/12factor/logs/market-scraper.log
    exit 1
fi

# 执行数据采集
npx . -o ../../vue/public/data/market-indicators.json >> /opt/src/12factor/logs/market-scraper.log 2>&1

# 记录执行结果
if [ $? -eq 0 ]; then
    echo "Success: Data collection completed" >> /opt/src/12factor/logs/market-scraper.log
else
    echo "Error: Data collection failed" >> /opt/src/12factor/logs/market-scraper.log
fi
```

赋予执行权限：
```bash
chmod +x /opt/src/12factor/scripts/run-market-scraper.sh
```

### 2. 配置Crontab

编辑crontab：
```bash
crontab -e
```

添加定时任务（每天9:00执行）：
```cron
# Market Scraper - 每天9:00执行
0 9 * * * /opt/src/12factor/scripts/run-market-scraper.sh

# 如需更频繁执行（每6小时）
0 */6 * * * /opt/src/12factor/scripts/run-market-scraper.sh

# 测试用：每5分钟执行一次
*/5 * * * * /opt/src/12factor/scripts/run-market-scraper.sh
```

### 3. 验证Crontab配置

```bash
# 查看当前crontab配置
crontab -l

# 查看cron服务状态
systemctl status cron

# 查看执行日志
tail -f /opt/src/12factor/logs/market-scraper.log

# 查看cron系统日志
grep CRON /var/log/syslog
```

## 故障排查

### 问题1：npx命令找不到

解决方案：
```bash
# 查找npx路径
which npx

# 在cron脚本中使用完整路径
/usr/local/bin/npx /opt/src/12factor/scripts/market-scraper
```

### 问题2：Playwright无法启动浏览器

解决方案：
```bash
# 安装系统依赖
npx playwright install-deps

# 或手动安装
sudo apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1
```

### 问题3：GitHub CLI认证失败

解决方案：
```bash
# 配置GitHub CLI
gh auth login

# 验证认证状态
gh auth status
```

### 问题4：数据采集失败

检查步骤：
1. 运行网站可访问性检查：`npx . --check-only`
2. 查看详细日志：`npx . -v --dry-run`
3. 检查网络代理设置
4. 验证CSS选择器是否仍然有效

## 输出数据格式

生成的JSON文件结构：

```json
{
  "version": "1.0.0",
  "lastUpdate": "2025-09-04T09:00:00Z",
  "status": "success",
  "data": {
    "youzhiyouxing": {
      "source": "https://youzhiyouxing.cn/data",
      "fetchTime": "2025-09-04T09:00:05Z",
      "indicators": {
        "value": 65,
        "level": "贪婪",
        "levelEn": "Greed",
        "description": "市场温度：65，贪婪",
        "trend": "up",
        "changeFromYesterday": 5
      },
      "visualization": {
        "type": "thermometer",
        "color": "#f59e0b",
        "percentage": 65
      },
      "history": [
        {"date": "2025-09-03", "value": 60},
        {"date": "2025-09-02", "value": 58}
      ]
    },
    "coinmarketcap": {
      "source": "https://coinmarketcap.com/charts/fear-and-greed-index/",
      "fetchTime": "2025-09-04T09:00:08Z",
      "indicators": {
        "value": 72,
        "level": "Greed",
        "levelZh": "贪婪",
        "description": "Fear & Greed Index: 72 - Greed"
      },
      "visualization": {
        "type": "gauge",
        "color": "#f59e0b",
        "percentage": 72
      },
      "history": []
    }
  },
  "fallback": {}
}
```

## 异常告警规则

| 波动幅度 | 严重程度 | 处理方式 |
|---------|---------|----------|
| > 30点 | 高 | 立即创建GitHub Issue |
| > 20点 | 中 | 创建标记为medium的Issue |
| > 15点 | 低 | 仅记录日志 |

## 开发和贡献

### 本地开发

```bash
# 克隆项目
git clone https://github.com/VCCampus/12factor.git

# 进入工具目录
cd 12factor/scripts/market-scraper

# 安装依赖
npm install

# 运行测试
npm test
```

### 项目结构

```
market-scraper/
├── bin/
│   └── market-scraper.js    # CLI入口
├── src/
│   ├── index.js             # 主程序
│   ├── scrapers/            # 数据采集器
│   │   ├── base.js          # 基础类
│   │   ├── youzhiyouxing.js # 有知有行
│   │   └── coinmarketcap.js # CMC
│   ├── validators/          # 数据验证
│   └── alerts/              # 告警机制
├── package.json
└── README.md
```

## License

MIT