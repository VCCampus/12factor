# CSS数创网站构建工具使用文档

**版本**: v1.0  
**创建时间**: 2025-08-28  
**适用于**: CSS数字创业知识体系网站构建

## 🎯 工具概述

本目录包含CSS数创网站的完整构建工具链，实现从TOML配置到静态网站的自动化构建流程。

### 核心工具

| 文件 | 用途 | 说明 |
|------|------|------|
| `build.sh` | 主构建脚本 | 完整的构建流程控制 |
| `validate-config.js` | 配置验证 | 验证TOML格式和数据完整性 |
| `toml-to-json.js` | 数据转换 | TOML→JSON分片转换 |
| `generate-changelog.js` | 变更日志 | 配置变化对比和日志生成 |

## 🚀 快速开始

### 环境要求

- **Node.js**: 18.0.0+ 
- **npm**: 8.0.0+
- **操作系统**: Linux/macOS (推荐) 或 Windows WSL
- **权限**: 脚本执行权限

### 一键构建

```bash
# 最简单的使用方式
cd /opt/src/12factor
./scripts/build.sh

# 构建完成后访问
cd dist && python -m http.server 8080
```

## 📋 详细使用指南

### 1. build.sh - 主构建脚本

#### 功能说明
主构建脚本实现完整的自动化构建流程：

1. ✅ 验证TOML配置格式和完整性
2. 📝 检测配置变化并生成变更日志
3. ⚙️ 转换TOML为分片JSON数据
4. 🧹 清理旧的构建产物
5. 🏗️ 执行Vue项目构建
6. 📊 生成构建报告和统计信息

#### 使用方法

```bash
# 基本使用
./scripts/build.sh

# 查看构建过程详情
./scripts/build.sh 2>&1 | tee build.log

# 后台构建
nohup ./scripts/build.sh > build.log 2>&1 &
```

#### 输出结果

**成功构建后的目录结构：**
```
/opt/src/12factor/
├── dist/                 # 静态网站输出
│   ├── index.html
│   ├── assets/
│   └── ...
├── logs/                 # 构建日志
│   ├── YYMMDD_HHMM_changed.log
│   └── YYMMDD_HHMM_build_report.txt
└── vue/public/          # 生成的JSON数据
    ├── w3sc8_principles-core.json
    ├── w3sc8_principles-3c.json
    ├── ...
    └── w3sc8_index.json
```

### 2. validate-config.js - 配置验证工具

#### 功能说明
验证TOML配置文件的语法和数据完整性：

- 🔍 TOML语法检查
- 📋 必需字段验证
- 🔗 数据关联性检查
- 📊 统计信息输出

#### 使用方法

```bash
# 验证默认配置文件
node scripts/validate-config.js docs/plans/web3scv8_v4.toml

# 验证其他配置文件
node scripts/validate-config.js path/to/config.toml

# 集成到CI/CD
if node scripts/validate-config.js config.toml; then
    echo "配置验证通过"
else
    echo "配置验证失败"
    exit 1
fi
```

#### 验证规则

- ✅ **元数据完整性**: version, supported_locales等
- ✅ **阶段定义**: 至少5个学习阶段
- ✅ **原则完整性**: 至少20个核心概念
- ✅ **UI配置**: 界面文本和导航配置
- ✅ **功能开关**: 特性配置完整性
- ✅ **数据关联**: 原则与阶段的正确关联

### 3. toml-to-json.js - 数据转换工具

#### 功能说明
将TOML配置转换为Vue应用所需的分片JSON文件：

- 📊 按模块分片数据（5个模块 + 测试 + 建议）
- 🏷️ 统一`w3sc8_`前缀命名
- 📑 生成索引文件便于管理
- 🔍 文件生成验证

#### 使用方法

```bash
# 基本转换
node scripts/toml-to-json.js docs/plans/web3scv8_v4.toml vue/public/

# 转换到自定义目录
node scripts/toml-to-json.js input.toml output-directory/

# 检查生成的文件
ls -la vue/public/w3sc8_*.json
```

#### 输出文件

| 文件名 | 内容 | 大小 |
|--------|------|------|
| `w3sc8_principles-core.json` | 创业核心认知 | ~25KB |
| `w3sc8_principles-3c.json` | 3C数字资产 | ~25KB |
| `w3sc8_principles-marketing.json` | 精准营销实战 | ~25KB |
| `w3sc8_principles-funding.json` | 融资致胜法则 | ~20KB |
| `w3sc8_principles-cases.json` | 案例与实践 | ~15KB |
| `w3sc8_quiz-data.json` | 测试题库 | ~40KB |
| `w3sc8_suggestions.json` | 学习建议 | ~15KB |
| `w3sc8_index.json` | 文件索引 | ~5KB |

### 4. generate-changelog.js - 变更日志工具

#### 功能说明
对比配置文件变化，生成详细的变更日志：

- 🔄 深度对比配置差异
- 📝 分类展示新增、删除、修改项
- 📊 影响分析和构建建议
- ⏰ 时间戳和版本追踪

#### 使用方法

```bash
# 对比两个配置版本
node scripts/generate-changelog.js new-config.toml old-config.toml

# 生成初始配置摘要（无旧版本）
node scripts/generate-changelog.js config.toml

# 保存日志到文件
node scripts/generate-changelog.js new.toml old.toml > changelog.txt
```

## 🔧 高级使用

### 自定义配置

#### 修改数据源
```bash
# 使用不同的TOML配置文件
TOML_CONFIG="/path/to/custom.toml" ./scripts/build.sh
```

#### 修改输出目录
```bash
# 修改build.sh中的变量
DIST_DIR="/custom/output" ./scripts/build.sh
```

### 集成到开发工作流

#### Git Hooks集成
```bash
# .git/hooks/pre-commit
#!/bin/bash
if ! node scripts/validate-config.js docs/plans/web3scv8_v4.toml; then
    echo "❌ 配置验证失败，提交被阻止"
    exit 1
fi
```

#### CI/CD集成
```yaml
# GitHub Actions示例
- name: 验证配置
  run: node scripts/validate-config.js docs/plans/web3scv8_v4.toml

- name: 构建网站
  run: ./scripts/build.sh

- name: 部署到服务器
  run: rsync -av dist/ server:/var/www/html/
```

### 性能优化

#### 增量构建
```bash
# 只有TOML变化时才重新构建JSON
if [[ docs/plans/web3scv8_v4.toml -nt vue/public/w3sc8_index.json ]]; then
    echo "配置已更新，执行增量构建"
    node scripts/toml-to-json.js docs/plans/web3scv8_v4.toml vue/public/
fi
```

#### 并行处理
```bash
# 并行执行验证和清理
validate-config.js config.toml &
rm -rf dist/* &
wait  # 等待所有后台任务完成
```

## 🛠️ 故障排除

### 常见问题

#### 1. 权限错误
```bash
# 错误：Permission denied
chmod +x scripts/build.sh
chmod +x scripts/*.js
```

#### 2. Node.js模块错误
```bash
# 错误：Cannot find module
cd vue && npm install
```

#### 3. TOML解析失败
```bash
# 检查TOML语法
node -e "console.log('TOML检查：', require('fs').readFileSync('config.toml', 'utf8').split('\\n').length, '行')"
```

#### 4. Vue构建失败
```bash
# 检查Vue项目依赖
cd vue
npm run type-check  # TypeScript检查
npm run lint        # 代码检查
```

### 调试模式

#### 启用详细输出
```bash
# 显示详细的构建过程
set -x  # 启用bash调试模式
./scripts/build.sh
```

#### 分步执行
```bash
# 单独执行每个步骤
node scripts/validate-config.js docs/plans/web3scv8_v4.toml
node scripts/toml-to-json.js docs/plans/web3scv8_v4.toml vue/public/
cd vue && npm run build
```

### 日志分析

#### 构建日志位置
- 📁 `/opt/src/12factor/logs/` - 所有构建日志
- 📄 `YYMMDD_HHMM_build_report.txt` - 构建报告
- 📄 `YYMMDD_HHMM_changed.log` - 配置变更日志

#### 错误码说明
- `0` - 成功
- `1` - 配置验证失败
- `2` - 文件操作失败
- `3` - Vue构建失败

## 📋 维护指南

### 定期维护

#### 清理旧日志
```bash
# 清理30天前的日志
find logs/ -name "*.log" -mtime +30 -delete
```

#### 更新依赖
```bash
cd vue && npm audit fix  # 修复安全漏洞
cd vue && npm update     # 更新依赖版本
```

### 备份重要文件
```bash
# 备份配置和构建脚本
tar -czf backup_$(date +%Y%m%d).tar.gz \
    docs/plans/web3scv8_v4.toml \
    scripts/ \
    vue/package.json \
    vue/vite.config.ts
```

## 📞 技术支持

### 问题报告
如遇到技术问题，请提供以下信息：

1. 📋 **错误信息**: 完整的错误输出
2. 🖥️ **环境信息**: Node.js版本、操作系统
3. 📁 **文件状态**: 相关文件的存在性和权限
4. 🔄 **重现步骤**: 详细的操作步骤

### 联系方式
- 📧 技术支持：通过GitHub Issue报告
- 📖 文档更新：PR贡献欢迎
- 🤝 社区讨论：项目讨论区

---

**最后更新**: 2025-08-28  
**文档版本**: v1.0  
**适用工具**: CSS数创网站构建工具链