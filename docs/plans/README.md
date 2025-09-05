# 项目规划文档

此目录包含项目的规划文档、配置文件和技术方案。

## 🎯 目录用途

存放项目实施前的分析、规划和配置文件，为开发提供指导和依据。

## 📂 主要文件

### 核心配置文件
- **`web3scv8_v4.toml`** - 主配置文件（当前版本）
  - CSS数创班8期知识体系配置
  - 学习模块和原则定义
  - 题库和面试问题配置

### 历史规划文档
- `vue-migration-plan.md` - Vue迁移计划
- `toml-implementation-plan.md` - TOML配置实施方案
- `github-issue-*-analysis.md` - GitHub问题分析文档
- 各阶段实施检查清单和技术路线图

## 📋 TOML配置说明

### 版本演进
```
v1.0 → v2.0 → v3.0 → v4.0 (当前)
```

### 主要配置结构
```toml
[metadata]
version = "4.0.0"
title = "CSS数创班8期核心知识体系"

[learning_modules.core]
# 核心概念模块

[learning_modules.funding]  
# 融资策略模块

[learning_modules.marketing]
# 营销推广模块

[quiz_config]
# 测验配置

[interview_levels]
# 面试难度配置
```

## 🔄 数据流程

```
TOML配置文件 
    ↓
scripts/toml-to-json.js 转换
    ↓  
生成JSON文件到 vue/public/data/
    ↓
Vue组件加载并显示
```

## 📝 文档规范

### 命名约定
- 技术方案：`{功能名}-plan.md`
- 问题分析：`github-issue-{编号}-{描述}.md`  
- 实施清单：`{日期}_{阶段}_implementation_checklist.md`

### 内容要求
1. **明确的目标**：为什么要做这个改动
2. **技术方案**：如何实现，有哪些选择
3. **实施步骤**：具体的执行计划
4. **验收标准**：如何验证完成度
5. **风险评估**：可能的问题和应对方案

## 🔧 配置管理

### 修改配置文件
1. 编辑 `web3scv8_v4.toml`
2. 运行验证脚本：`node scripts/validate-config.js`
3. 重新生成JSON：`node scripts/toml-to-json.js`
4. 测试前端加载：`npm run dev`

### 版本管理
- 配置变更需要更新版本号
- 重大变更需要创建新的版本文件
- 保持向后兼容性

## 📊 当前配置状态

### 学习模块（5个）
- **核心概念** (core): 基础理论和方法论
- **3C分析** (3c): 竞争分析框架  
- **融资策略** (funding): 资本运作
- **营销推广** (marketing): 用户获取
- **案例分析** (cases): 实战案例

### 原则总数：20个
涵盖数字创业的核心概念和实践方法

### 面试题库
- 基础级：适合入门学员
- 中级：有一定经验
- 高级：资深从业者  
- 专家级：行业专家水平

## 🚀 后续规划

### 短期优化
- 题库内容扩充
- 配置验证增强
- 国际化支持准备

### 中期发展  
- 学习路径个性化
- 适应性题目难度
- 多媒体内容支持

### 长期愿景
- AI驱动的学习建议
- 协作学习功能
- 行业数据集成

## 🔗 相关资源

- 配置验证：`/scripts/validate-config.js`
- JSON转换：`/scripts/toml-to-json.js`
- 前端应用：`/vue/README.md`
- 实施报告：`/docs/reports/`