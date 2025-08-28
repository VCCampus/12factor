# React到Vue组件映射表

## 核心组件映射

### 需要保留的组件

| React组件 | 文件路径 | Vue等价组件 | Vue文件路径 | 说明 |
|-----------|----------|-------------|------------|------|
| `Navigation.tsx` | `/src/components/Navigation.tsx` | `AppHeader.vue` | `/vue/src/components/layout/AppHeader.vue` | 顶部导航栏，简化为中文单语言 |
| `FlashCard.tsx` | `/src/components/FlashCard.tsx` | `FlashCard.vue` | `/vue/src/components/cards/FlashCard.vue` | 闪卡组件，保留翻转功能 |
| `LearningCard.tsx` | `/src/components/LearningCard.tsx` | `ConceptCard.vue` | `/vue/src/components/cards/ConceptCard.vue` | 学习概念卡片 |
| `ThemeToggle.tsx` | `/src/components/ThemeToggle.tsx` | `ThemeToggle.vue` | `/vue/src/components/common/ThemeToggle.vue` | 暗色模式切换 |
| `DynamicTitle.tsx` | `/src/components/DynamicTitle.tsx` | `DynamicTitle.vue` | `/vue/src/components/common/DynamicTitle.vue` | 动态标题展示 |

### 需要移除的组件

| React组件 | 文件路径 | 移除原因 |
|-----------|----------|----------|
| `InteractivePromptEditor.tsx` | `/src/components/InteractivePromptEditor.tsx` | 移除LLM功能，不需要提示编辑器 |
| `PromptEngineeringDropdown.tsx` | `/src/components/PromptEngineeringDropdown.tsx` | 移除提示工程相关功能 |
| `MobilePromptEngineeringMenu.tsx` | `/src/components/MobilePromptEngineeringMenu.tsx` | 移除提示工程相关功能 |
| `ExerciseSection.tsx` | `/src/components/ExerciseSection.tsx` | 移除练习功能，简化为单选测试 |
| `LessonCard.tsx` | `/src/components/LessonCard.tsx` | 移除课程功能 |
| `CodeExample.tsx` | `/src/components/CodeExample.tsx` | 移除代码示例功能 |
| `CourseProvider.tsx` | `/src/components/courses/CourseProvider.tsx` | 移除课程系统 |
| `CourseLayout.tsx` | `/src/components/courses/CourseLayout.tsx` | 移除课程系统 |
| `SocialShare.tsx` | `/src/components/SocialShare.tsx` | 移除社交分享功能 |
| `GitHubCorner.tsx` | `/src/components/GitHubCorner.tsx` | 简化设计，移除GitHub角标 |
| `ScrollDownButton.tsx` | `/src/components/ScrollDownButton.tsx` | 简化交互，移除滚动按钮 |
| `UptimeDisplay.tsx` | `/src/components/UptimeDisplay.tsx` | 移除运行时间显示 |
| `WebViewCompat.tsx` | `/src/components/WebViewCompat.tsx` | 移除WebView兼容性处理 |

### 需要新增的Vue组件

| Vue组件 | 文件路径 | 功能说明 |
|---------|----------|----------|
| `AppLayout.vue` | `/vue/src/components/layout/AppLayout.vue` | 主布局组件 |
| `AppFooter.vue` | `/vue/src/components/layout/AppFooter.vue` | 页脚组件 |
| `MobileNav.vue` | `/vue/src/components/layout/MobileNav.vue` | 移动端导航 |
| `ProgressBar.vue` | `/vue/src/components/common/ProgressBar.vue` | 学习进度条 |
| `Button.vue` | `/vue/src/components/common/Button.vue` | 通用按钮组件 |
| `Modal.vue` | `/vue/src/components/common/Modal.vue` | 模态框组件 |
| `QuizCard.vue` | `/vue/src/components/quiz/QuizCard.vue` | 测试题卡片 |
| `QuizResult.vue` | `/vue/src/components/quiz/QuizResult.vue` | 测试结果展示 |
| `QuizSelection.vue` | `/vue/src/components/quiz/QuizSelection.vue` | 测试模式选择 |
| `ResultCard.vue` | `/vue/src/components/cards/ResultCard.vue` | 结果展示卡片 |
| `DataExporter.vue` | `/vue/src/components/common/DataExporter.vue` | 数据导出功能 |
| `PWAInstaller.vue` | `/vue/src/components/common/PWAInstaller.vue` | PWA安装提示 |

## 详细组件分析

### 1. Navigation.tsx → AppHeader.vue

**原React组件功能：**
- 多语言导航菜单
- 提示工程下拉菜单
- 响应式设计
- 主题切换

**Vue组件简化：**
```vue
<!-- /vue/src/components/layout/AppHeader.vue -->
<template>
  <header class="neo-header">
    <div class="container-main">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">3C数字资产学习平台</span>
        </div>
        
        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <router-link to="/">首页</router-link>
          <router-link to="/principles">原则</router-link>
          <router-link to="/flashcards">闪卡</router-link>
          <router-link to="/quiz">测试</router-link>
        </nav>
        
        <!-- Right Side -->
        <div class="header-right">
          <ThemeToggle />
          <MobileNavButton @click="toggleMobileNav" class="mobile-only" />
        </div>
      </div>
    </div>
    
    <!-- Mobile Navigation -->
    <MobileNav v-show="showMobileNav" @close="closeMobileNav" />
  </header>
</template>
```

### 2. FlashCard.tsx → FlashCard.vue

**原React组件功能：**
- 卡片翻转动画
- 键盘导航支持
- 进度跟踪
- 多语言支持

**Vue组件改造：**
```vue
<!-- /vue/src/components/cards/FlashCard.vue -->
<template>
  <div class="flashcard-container">
    <div 
      class="flashcard neo-card" 
      :class="{ 'is-flipped': isFlipped }"
      @click="flip"
    >
      <!-- Question Side -->
      <div class="flashcard-side flashcard-front">
        <div class="content-header question-header">❓ 问题</div>
        <div class="content-body">
          {{ card.question }}
        </div>
        <div class="flip-hint">点击翻转</div>
      </div>
      
      <!-- Answer Side -->
      <div class="flashcard-side flashcard-back">
        <div class="content-header answer-header">✅ 答案</div>
        <div class="content-body">
          {{ card.answer }}
        </div>
      </div>
    </div>
    
    <!-- Controls -->
    <div class="flashcard-controls">
      <Button @click="previousCard">⬅️ 上一个</Button>
      <Button @click="flip" variant="primary">翻转</Button>
      <Button @click="nextCard">下一个 ➡️</Button>
    </div>
    
    <!-- Mastery Rating (only shown when flipped) -->
    <div v-if="isFlipped" class="mastery-controls">
      <p>掌握程度评估：</p>
      <Button @click="rateMastery('hard')" variant="outline">😔 不会</Button>
      <Button @click="rateMastery('medium')" variant="outline">🤔 模糊</Button>
      <Button @click="rateMastery('easy')" variant="outline">😊 熟悉</Button>
      <Button @click="rateMastery('perfect')" variant="outline">🤩 精通</Button>
    </div>
  </div>
</template>
```

### 3. 新增Quiz组件系列

**QuizCard.vue - 测试题卡片：**
```vue
<!-- /vue/src/components/quiz/QuizCard.vue -->
<template>
  <div class="quiz-card neo-card">
    <div class="quiz-header">
      <span class="question-indicator">❓ 问题 {{ questionNumber }}</span>
      <span class="quiz-progress">第 {{ current }}/{{ total }} 题</span>
    </div>
    
    <div class="question-content">
      <h3>{{ question.text }}</h3>
    </div>
    
    <div class="options-list">
      <div 
        v-for="(option, index) in question.options" 
        :key="index"
        class="option-item"
        :class="{ 'selected': selectedOption === index }"
        @click="selectOption(index)"
      >
        <span class="option-label">{{ ['A', 'B', 'C', 'D'][index] }}.</span>
        <span class="option-text">{{ option }}</span>
        <span class="option-radio">⚪</span>
      </div>
    </div>
    
    <div class="quiz-controls">
      <Button @click="submitAnswer" variant="primary">提交答案</Button>
      <Button @click="skipQuestion" variant="outline">跳过此题</Button>
    </div>
  </div>
</template>
```

## 状态管理映射

### React (Zustand) → Vue (Pinia)

**原React状态：**
```typescript
// React Zustand store
interface LearningState {
  completedPrinciples: string[];
  currentProgress: number;
  flashcardProgress: Record<string, number>;
}
```

**Vue Pinia状态：**
```javascript
// /vue/src/stores/learning.js
export const useLearningStore = defineStore('learning', {
  state: () => ({
    completedPrinciples: [],
    currentProgress: 0,
    flashcardProgress: {},
    quizResults: []
  }),
  
  getters: {
    progressPercentage: (state) => 
      Math.round((state.completedPrinciples.length / 15) * 100),
    
    completedStages: (state) => 
      // 计算已完成的阶段
  },
  
  actions: {
    markPrincipleCompleted(principleId) {
      if (!this.completedPrinciples.includes(principleId)) {
        this.completedPrinciples.push(principleId);
        this.saveToStorage();
      }
    },
    
    updateFlashcardProgress(cardId, mastery) {
      this.flashcardProgress[cardId] = mastery;
      this.saveToStorage();
    }
  }
});
```

## 工具函数映射

### React工具 → Vue工具

| React工具 | Vue等价工具 | 文件路径 |
|-----------|-------------|----------|
| `principleHelpers.ts` | `principleHelpers.js` | `/vue/src/utils/principleHelpers.js` |
| `localStorage` usage | `storage.js` | `/vue/src/utils/storage.js` |
| `metadata.ts` | 移除 | - (简化SEO处理) |
| `theme.ts` | `theme.js` | `/vue/src/utils/theme.js` |

### 新增工具函数

```javascript
// /vue/src/utils/tomlParser.js
export class TOMLParser {
  static parseConfig(tomlContent) {
    // 解析TOML配置文件
  }
  
  static generateFlashcards(principles) {
    // 从原则数据生成闪卡
  }
  
  static generateQuizQuestions(principles) {
    // 从原则数据生成测试题
  }
}

// /vue/src/utils/dataExporter.js
export class DataExporter {
  static exportProgress(data) {
    // 导出学习进度为Markdown
  }
  
  static exportResults(results) {
    // 导出测试结果
  }
}

// /vue/src/utils/pwaHelper.js
export class PWAHelper {
  static checkInstallable() {
    // 检查PWA安装条件
  }
  
  static promptInstall() {
    // 提示用户安装PWA
  }
}
```

## 路由映射

### React Router → Vue Router

**原React路由结构：**
```
/[locale]/                 # 多语言路由
├── /                      # 首页
├── /principles            # 原则页面
├── /flashcards           # 闪卡页面
├── /quiz                 # 测试页面
└── /prompt-engineering   # 提示工程 (移除)
```

**Vue路由结构：**
```javascript
// /vue/src/router/index.js
export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/principles',
    name: 'Principles',
    component: () => import('@/views/PrinciplesView.vue'),
    children: [
      {
        path: '',
        component: () => import('@/components/PrinciplesOverview.vue')
      },
      {
        path: ':stage',
        component: () => import('@/components/StageDetail.vue')
      },
      {
        path: ':stage/:principle',
        component: () => import('@/components/PrincipleDetail.vue')
      }
    ]
  },
  {
    path: '/flashcards',
    name: 'FlashCards',
    component: () => import('@/views/FlashCardsView.vue')
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: () => import('@/views/QuizView.vue'),
    children: [
      {
        path: '',
        component: () => import('@/components/quiz/QuizSelection.vue')
      },
      {
        path: 'test/:mode',
        component: () => import('@/components/quiz/QuizTest.vue')
      },
      {
        path: 'result',
        component: () => import('@/components/quiz/QuizResult.vue')
      }
    ]
  }
];
```

## 样式迁移

### Tailwind配置保持
- 保留现有Tailwind CSS配置
- 新增Neobrutalism风格的自定义类
- 删除多语言相关的样式变量

### CSS架构
```
/vue/src/assets/styles/
├── main.css           # 主样式文件
├── neobrutalism.css   # Neobrutalism风格
├── components.css     # 组件样式
├── utilities.css      # 工具类
└── responsive.css     # 响应式样式
```

## 开发优先级

### Phase 1: 基础架构组件
1. `AppLayout.vue` - 主布局
2. `AppHeader.vue` - 导航栏
3. `AppFooter.vue` - 页脚
4. `Button.vue` - 通用按钮
5. `ThemeToggle.vue` - 主题切换

### Phase 2: 核心功能组件
1. `ConceptCard.vue` - 概念卡片
2. `FlashCard.vue` - 闪卡组件
3. `ProgressBar.vue` - 进度条
4. `MobileNav.vue` - 移动导航

### Phase 3: 测试系统组件
1. `QuizSelection.vue` - 测试选择
2. `QuizCard.vue` - 测试题卡片
3. `QuizResult.vue` - 结果展示
4. `DataExporter.vue` - 数据导出

### Phase 4: 增强功能组件
1. `PWAInstaller.vue` - PWA安装
2. `Modal.vue` - 模态框
3. `ResultCard.vue` - 结果卡片

此映射表确保了从React到Vue的完整迁移路径，移除了不需要的功能，保留了核心学习功能，并增加了新的需求功能。