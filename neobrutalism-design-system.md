# Neobrutalism 设计系统 - 3C数字资产学习平台

## 设计理念

基于 neobrutalism-templates/portfolio 风格，结合3C学习平台需求的设计系统。

### 核心设计原则
- **功能优先**: 内容和功能是视觉设计的核心
- **对比强烈**: 使用高对比度创造视觉冲击
- **几何清晰**: 硬朗的边框，明确的分区
- **简约直接**: 去除装饰性元素，保持设计的纯粹性

## 色彩系统

### 主色调（蓝色科技感）
```css
:root {
  /* 主蓝色系 */
  --primary-blue: #2563eb;      /* 主蓝色 */
  --primary-blue-dark: #1d4ed8; /* 深蓝色 */
  --primary-blue-light: #60a5fa; /* 浅蓝色 */
  
  /* 中性色 */
  --neo-black: #000000;         /* 纯黑 */
  --neo-white: #ffffff;         /* 纯白 */
  --neo-gray-dark: #1f2937;     /* 深灰 */
  --neo-gray-medium: #6b7280;   /* 中灰 */
  --neo-gray-light: #f3f4f6;    /* 浅灰 */
  
  /* 功能色 */
  --success-green: #10b981;     /* 成功绿 */
  --warning-yellow: #f59e0b;    /* 警告黄 */
  --error-red: #ef4444;         /* 错误红 */
  
  /* 背景区分色 */
  --question-bg: #eff6ff;       /* 问题背景（浅蓝） */
  --answer-bg: #1e40af;         /* 答案背景（深蓝） */
  --answer-text: #ffffff;       /* 答案文字（白色） */
}
```

### 暗色模式
```css
[data-theme="dark"] {
  --neo-black: #ffffff;
  --neo-white: #000000;
  --neo-gray-dark: #f3f4f6;
  --neo-gray-light: #1f2937;
  --question-bg: #1e3a8a;
  --answer-bg: #60a5fa;
  --answer-text: #000000;
}
```

## 字体系统

### 字体栈
```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Cascadia Code', monospace;
  --font-chinese: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
```

### 字体层级
```css
.text-hero {
  font-size: 2.5rem;   /* 40px */
  line-height: 1.1;
  font-weight: 800;
}

.text-h1 {
  font-size: 2rem;     /* 32px */
  line-height: 1.2;
  font-weight: 700;
}

.text-h2 {
  font-size: 1.5rem;   /* 24px */
  line-height: 1.3;
  font-weight: 600;
}

.text-body {
  font-size: 1rem;     /* 16px */
  line-height: 1.6;
  font-weight: 400;
}

.text-small {
  font-size: 0.875rem; /* 14px */
  line-height: 1.5;
}
```

## 布局系统

### 间距系统
```css
:root {
  --space-xs: 0.25rem;  /* 4px */
  --space-sm: 0.5rem;   /* 8px */
  --space-md: 1rem;     /* 16px */
  --space-lg: 2rem;     /* 32px */
  --space-xl: 4rem;     /* 64px */
  --space-2xl: 6rem;    /* 96px */
}
```

### 容器系统
```css
.container-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.container-narrow {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}
```

## 组件样式

### 按钮系统
```css
.btn-primary {
  background: var(--primary-blue);
  color: var(--neo-white);
  border: 3px solid var(--neo-black);
  padding: 12px 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: none;
}

.btn-primary:hover {
  background: var(--primary-blue-dark);
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px var(--neo-black);
}

.btn-secondary {
  background: var(--neo-white);
  color: var(--neo-black);
  border: 3px solid var(--neo-black);
}
```

### 卡片系统
```css
.card-neo {
  background: var(--neo-white);
  border: 4px solid var(--neo-black);
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
}

.card-question {
  background: var(--question-bg);
  border: 4px solid var(--primary-blue);
  color: var(--neo-black);
}

.card-answer {
  background: var(--answer-bg);
  border: 4px solid var(--primary-blue-dark);
  color: var(--answer-text);
}
```

### 闪卡样式
```css
.flashcard {
  width: 100%;
  max-width: 500px;
  height: 300px;
  perspective: 1000px;
  margin: 0 auto;
}

.flashcard-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: none; /* 无动画，立即翻转 */
}

.flashcard.flipped .flashcard-inner {
  transform: rotateY(180deg);
}

.flashcard-front,
.flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-lg);
  cursor: pointer;
}

.flashcard-front {
  background: var(--question-bg);
  border: 4px solid var(--primary-blue);
  color: var(--neo-black);
}

.flashcard-back {
  background: var(--answer-bg);
  border: 4px solid var(--primary-blue-dark);
  color: var(--answer-text);
  transform: rotateY(180deg);
}
```

## 响应式断点

```css
:root {
  --bp-mobile: 768px;
  --bp-tablet: 1024px;
  --bp-desktop: 1200px;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .container-main {
    padding: 0 var(--space-sm);
  }
  
  .text-hero {
    font-size: 2rem;
  }
  
  .btn-primary {
    padding: 16px 20px;
    font-size: 1.1rem;
  }
  
  .flashcard {
    max-width: 100%;
    height: 250px;
  }
}
```

## Neobrutalism 特色元素

### 硬阴影效果
```css
.shadow-brutal {
  box-shadow: 6px 6px 0px var(--neo-black);
}

.shadow-brutal-hover:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px var(--neo-black);
}
```

### 几何形状
```css
.shape-square {
  width: 40px;
  height: 40px;
  background: var(--primary-blue);
  border: 3px solid var(--neo-black);
}

.shape-circle {
  width: 40px;
  height: 40px;
  background: var(--primary-blue);
  border: 3px solid var(--neo-black);
  border-radius: 50%;
}
```

### 进度条样式
```css
.progress-brutal {
  width: 100%;
  height: 20px;
  background: var(--neo-white);
  border: 3px solid var(--neo-black);
  overflow: hidden;
}

.progress-brutal-fill {
  height: 100%;
  background: var(--primary-blue);
  border-right: 3px solid var(--neo-black);
  transition: width 0.3s ease;
}
```

## 实用工具类

```css
/* 边框工具 */
.border-brutal { border: 4px solid var(--neo-black); }
.border-thin { border: 2px solid var(--neo-black); }
.border-thick { border: 6px solid var(--neo-black); }

/* 间距工具 */
.p-brutal { padding: var(--space-lg); }
.m-brutal { margin: var(--space-lg); }

/* 文字工具 */
.text-brutal { font-weight: 800; text-transform: uppercase; }
.text-center { text-align: center; }

/* 布局工具 */
.flex-center { display: flex; justify-content: center; align-items: center; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }
```