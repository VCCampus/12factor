# Vue + Tailwind 迁移计划

## 一、技术栈对比

### 当前技术栈 (Next.js + React)
- **框架**: Next.js 15 + React 18
- **样式**: Tailwind CSS
- **国际化**: next-intl
- **状态管理**: Zustand
- **路由**: App Router (基于文件系统)

### 目标技术栈 (Vue 3)
- **框架**: Vue 3 + Vite
- **样式**: Tailwind CSS (保持)
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **构建工具**: Vite

## 二、迁移策略

### 阶段1：项目初始化
```bash
# 创建新的 Vue 项目
npm create vite@latest 3c-learning --template vue
cd 3c-learning
npm install

# 安装核心依赖
npm install vue-router@4 pinia
npm install -D tailwindcss postcss autoprefixer
npm install @headlessui/vue @heroicons/vue
```

### 阶段2：目录结构规划

```
3c-learning/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   │   ├── layout/     # 布局组件
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── AppLayout.vue
│   │   ├── cards/      # 卡片组件
│   │   │   ├── ConceptCard.vue
│   │   │   ├── FlashCard.vue
│   │   │   └── LearningCard.vue
│   │   └── common/     # 通用组件
│   │       ├── ProgressBar.vue
│   │       ├── Button.vue
│   │       └── Modal.vue
│   ├── views/          # 页面视图
│   │   ├── Home.vue
│   │   ├── Principles.vue
│   │   ├── FlashCards.vue
│   │   └── Quiz.vue
│   ├── stores/         # Pinia 状态管理
│   │   ├── learning.js
│   │   └── quiz.js
│   ├── data/           # 静态数据
│   │   └── concepts.js
│   ├── router/         # 路由配置
│   │   └── index.js
│   ├── styles/         # 全局样式
│   │   └── main.css
│   ├── App.vue
│   └── main.js
├── public/             # 公共资源
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### 阶段3：组件迁移映射

| React 组件 | Vue 组件 | 说明 |
|-----------|---------|------|
| Navigation.tsx | AppHeader.vue | 顶部导航栏 |
| FlashCard.tsx | FlashCard.vue | 闪卡组件 |
| LearningCard.tsx | LearningCard.vue | 学习卡片 |
| InteractivePromptEditor.tsx | 移除 | 不需要 LLM 功能 |
| FourQuadrantDiagram.tsx | ConceptDiagram.vue | 概念图表 |

### 阶段4：数据结构简化

```javascript
// src/data/concepts.js
export const concepts = {
  // 创业三要素
  entrepreneurship: {
    title: '创业三要素',
    items: [
      {
        id: 'subject-thinking',
        name: '主体思维',
        description: '我命由我不由天',
        content: '强调创业者掌握自己命运的主动性...'
      },
      {
        id: 'effectual-logic',
        name: '效果逻辑',
        description: '先行动后反思',
        content: '从已有资源出发，通过与人互动来创造机会...'
      },
      {
        id: 'lean-startup',
        name: '精益创业',
        description: '行动-学习-建设',
        content: '通过快速试错和迭代来验证商业模式...'
      }
    ]
  },
  
  // 效果逻辑五原则
  effectuation: {
    title: '效果逻辑五大原则',
    items: [
      { id: 'bird-in-hand', name: '手中鸟原则', description: '从你已有的资源出发' },
      { id: 'affordable-loss', name: '可承担损失原则', description: '看能否承受最坏的损失' },
      { id: 'crazy-quilt', name: '疯狂被子原则', description: '与任何人合作创造价值' },
      { id: 'lemonade', name: '柠檬水原则', description: '将意外转化为机遇' },
      { id: 'pilot', name: '飞行员原则', description: '未来是创造出来的' }
    ]
  },
  
  // 其他概念...
}
```

### 阶段5：路由配置

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/principles',
    name: 'Principles',
    component: () => import('../views/Principles.vue')
  },
  {
    path: '/flashcards',
    name: 'FlashCards',
    component: () => import('../views/FlashCards.vue')
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: () => import('../views/Quiz.vue')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
```

## 三、功能简化清单

### 保留功能
- ✅ 首页展示
- ✅ 原则学习页面
- ✅ 闪卡练习
- ✅ 知识测试
- ✅ 学习进度跟踪
- ✅ 深色模式

### 移除功能
- ❌ 多语言支持（只保留中文）
- ❌ Prompt Engineering 课程
- ❌ LLM API 集成
- ❌ 国际化路由
- ❌ 社交分享功能
- ❌ SEO 优化（SSR/SSG）

## 四、数据迁移

将现有的12Factor内容替换为3C数字资产学习内容：

1. **创业三要素** 替代 Prepare 阶段
2. **效果逻辑五原则** 替代 Execute 阶段  
3. **精益创业五阶段** 替代 Collaborate 阶段
4. **K型经济与去中心化** 替代 Iterate 阶段

## 五、实施步骤

### 第一周：基础架构
1. 创建 Vue 项目
2. 配置 Tailwind CSS
3. 搭建基本路由
4. 创建布局组件

### 第二周：核心功能
1. 实现原则展示页面
2. 开发闪卡功能
3. 创建测试模块
4. 添加进度跟踪

### 第三周：优化与完善
1. 响应式设计
2. 动画效果
3. 性能优化
4. 用户体验改进

## 六、风险评估

### 技术风险
- Vue 3 Composition API 学习曲线
- 状态管理迁移复杂度
- 组件生命周期差异

### 缓解措施
- 使用 Options API 过渡
- 逐步迁移，先实现核心功能
- 保持 Tailwind CSS 减少样式重写

## 七、性能对比

| 指标 | Next.js (当前) | Vue + Vite (目标) |
|-----|---------------|------------------|
| 首次加载 | ~200KB | ~100KB |
| 构建时间 | ~30s | ~10s |
| HMR 速度 | 中等 | 极快 |
| SEO | 优秀 | 一般 |

## 八、关键决策点

1. **是否需要 SSR？** 
   - 建议：不需要，纯 SPA 即可

2. **状态管理方案？**
   - 建议：Pinia（Vue 官方推荐）

3. **UI 组件库？**
   - 建议：Headless UI + 自定义组件

4. **构建工具？**
   - 建议：Vite（更快的开发体验）

5. **部署方案？**
   - 建议：静态托管（Vercel/Netlify）