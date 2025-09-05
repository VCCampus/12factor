# Vue 前端应用

CSS数字创业学习平台的主要前端应用，基于Vue 3 + Vite构建。

## 🎯 项目简介

这是一个面向CSS数字创业班8期学员的综合学习平台，提供：
- 📚 原则学习系统
- 🎯 闪卡练习功能  
- 🏆 挑战测试模块
- 🎤 模拟面试系统
- 📊 学习进度跟踪

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 9+

### 安装依赖
```bash
npm install
```

### 开发服务器
```bash
npm run dev
# 访问 http://localhost:5173
```

### 生产构建
```bash
npm run build
# 输出到 /dist 目录
```

### 代码检查
```bash
npm run lint        # ESLint检查
npm run type-check  # TypeScript类型检查
```

## 📁 目录结构

```
vue/
├── src/
│   ├── components/          # 组件库
│   │   ├── principles/      # 原则学习相关组件
│   │   ├── interview/       # 面试系统组件
│   │   ├── layout/          # 布局组件
│   │   └── common/          # 通用组件
│   ├── views/              # 页面组件
│   ├── stores/             # Pinia状态管理
│   ├── router/             # Vue Router配置
│   ├── utils/              # 工具函数
│   └── styles/             # 样式文件
├── public/                 # 静态资源
│   └── data/              # JSON数据文件
├── tests/                 # E2E测试
└── dist/                  # 构建输出（自动生成）
```

## 🏗️ 技术架构

### 核心技术栈
- **框架**: Vue 3.4 + Composition API
- **构建工具**: Vite 5.0
- **路由**: Vue Router 4.2
- **状态管理**: Pinia 2.1
- **样式**: Tailwind CSS 3.4 + Neobrutalism设计系统
- **类型检查**: TypeScript 5.3
- **测试**: Playwright E2E

### 设计系统
- **主题**: Neobrutalism - 粗线条、高对比度、几何形状
- **响应式**: Mobile-first设计，支持桌面端
- **暗色模式**: 完整支持，使用Tailwind dark:前缀
- **国际化**: 中英双语支持（主要为中文）

## 🧩 主要功能模块

### 1. 原则学习中心 (`/principles`)
整合了三个学习模式：
- **📚 原则学习**: 系统学习20个核心概念
- **🎯 闪卡练习**: 间隔重复记忆训练
- **🏆 挑战测试**: 多模式测验系统

### 2. 模拟面试系统 (`/mock-interview`)
- 4个难度级别（基础/中级/高级/专家）
- 实时计分和进度跟踪
- 详细的答题分析

### 3. 市场情绪指标 (`/thermometer`)
- 实时市场数据可视化
- 恐贪指数展示
- 市场趋势分析

## 💾 数据管理

### 数据流
```
TOML配置 → JSON生成 → Pinia Store → Vue组件
```

### 本地存储
- **localStorage**: 用户学习进度和偏好
- **自动清理**: 超过5MB时清理旧数据
- **导出功能**: 页脚提供数据导出

### 状态管理
- `configStore`: 配置数据和原则内容
- `progressStore`: 学习进度跟踪  
- `quizStore`: 测验状态管理
- `interviewStore`: 面试系统状态

## 🧪 测试

### E2E测试
```bash
npm run test:e2e
# 使用Playwright进行端到端测试
```

### 测试配置
- 基础URL: `http://web3mh.101.so:11181/`
- 覆盖主要用户流程
- 支持中文界面测试

## 🚀 部署

### 生产构建
```bash
# 完整构建流程
./scripts/build.sh

# 仅Vue构建
npm run build
```

### PWA支持
- 离线缓存
- 安装提示
- Service Worker自动更新

## 🔧 开发指南

### 组件开发
1. 使用Composition API
2. 遵循Neobrutalism设计规范
3. 支持响应式和暗色模式
4. 添加适当的TypeScript类型

### 路由配置
- 嵌套路由用于复杂页面
- 自动重定向旧URL
- 控制台警告过时路径

### 状态管理
- 使用Pinia进行状态管理
- 持久化重要数据到localStorage
- 避免过度使用全局状态

## 📋 开发规范

### 代码规范  
- ESLint + TypeScript严格模式
- Prettier格式化
- 提交前运行lint检查

### 文件命名
- 组件：PascalCase.vue
- 工具：camelCase.ts
- 样式：kebab-case.css

### Git工作流
- 从main分支创建特性分支
- 提交前通过所有检查
- 合并请求需要代码审查

## 🔗 相关资源

- 项目配置：`/docs/plans/web3scv8_v4.toml`
- 构建脚本：`/scripts/build.sh`
- 开发指引：`/CLAUDE.md`
- 最新报告：`/docs/reports/250905_nav_simplification.md`