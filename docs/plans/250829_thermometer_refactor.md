# 温度计页面重构实施说明书

**项目名称**: 12Factor.me 温度计页面重构  
**文档版本**: 1.0  
**创建日期**: 2025-08-29  
**Issue链接**: https://github.com/VCCampus/12factor/issues/13

## 1. 项目概述

### 1.1 背景
当前温度计页面展示的是学习进度温度计，需要重构为展示加密货币恐慌与贪婪指数（Crypto Fear & Greed Index）。

### 1.2 核心目标
- 删除当前温度计页面的学习进度功能
- 复用首页的网页结构和设计风格
- 展示加密货币恐慌与贪婪指数图片
- 保持Neobrutalism设计风格的一致性

### 1.3 技术栈
- Vue 3.4.0
- Vue Router 4.0.13
- Tailwind CSS
- Neobrutalism设计系统

## 2. 需求规格

### 2.1 功能需求
| 需求项 | 描述 | 优先级 |
|--------|------|--------|
| 删除现有功能 | 移除学习进度温度计的所有相关代码 | P0 |
| 图片展示 | 显示本地存储的恐慌与贪婪指数图片 | P0 |
| 导航调整 | 将温度计链接移到首页后面 | P0 |
| 更新时间 | 显示图片的更新时间 | P1 |
| 源链接 | 提供到Crypto Dashboard的链接 | P0 |
| 懒加载 | 实现图片懒加载优化性能 | P1 |

### 2.2 非功能需求
- 响应式设计：支持桌面、平板、移动端
- 性能：图片懒加载，24小时浏览器缓存
- SEO：配置适当的元数据
- 可维护性：清晰的代码结构和注释

## 3. 技术方案

### 3.1 文件结构
```
/opt/src/12factor/vue/
├── src/
│   ├── views/
│   │   └── ThermometerView.vue (重构)
│   ├── components/
│   │   └── layout/
│   │       └── AppHeader.vue (导航调整)
│   └── router/
│       └── index.ts (路由配置，无需修改)
└── public/
    └── fear-and-greed-index.png (新增图片)
```

### 3.2 组件架构

#### ThermometerView.vue 结构
```vue
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 主容器 -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- 标题卡片 -->
      <div class="neo-card mb-8">
        <h1 class="text-3xl font-bold text-center mb-2">
          加密货币恐慌与贪婪指数
        </h1>
      </div>

      <!-- 图片展示卡片 -->
      <div class="neo-card mb-6">
        <!-- 图片容器 -->
        <div class="image-container relative">
          <!-- 加载指示器 -->
          <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
            <p>加载中...</p>
          </div>
          
          <!-- 主图片 -->
          <img 
            v-show="!isLoading && !hasError"
            ref="indexImage"
            :src="imageSrc"
            alt="Crypto Fear & Greed Index"
            @load="handleImageLoad"
            @error="handleImageError"
            class="w-full h-auto"
          />
          
          <!-- 错误状态 -->
          <div v-if="hasError" class="error-state p-8 text-center">
            <p class="text-red-600 mb-4">图片暂时无法显示</p>
            <a 
              :href="cryptoDashboardUrl" 
              target="_blank"
              class="neo-btn-secondary"
            >
              访问源网站
            </a>
          </div>
        </div>
        
        <!-- 更新时间 -->
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
          数据更新于：{{ updateDate }}
        </p>
      </div>

      <!-- 数据源链接 -->
      <div class="text-center">
        <a 
          :href="cryptoDashboardUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="neo-btn-secondary inline-flex items-center"
        >
          <span>Crypto Dashboard</span>
          <svg class="w-4 h-4 ml-2" /* 外链图标 */ />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 状态管理
const isLoading = ref(true)
const hasError = ref(false)
const updateDate = ref('')
const imageSrc = '/fear-and-greed-index.png'
const cryptoDashboardUrl = 'https://alternative.me/crypto/'

// 图片加载处理
const handleImageLoad = () => {
  isLoading.value = false
  // 获取文件修改时间
  getUpdateDate()
}

// 图片错误处理
const handleImageError = () => {
  isLoading.value = false
  hasError.value = true
}

// 获取更新日期
const getUpdateDate = async () => {
  try {
    const response = await fetch(imageSrc, { method: 'HEAD' })
    const lastModified = response.headers.get('last-modified')
    if (lastModified) {
      const date = new Date(lastModified)
      updateDate.value = date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '.')
    }
  } catch (error) {
    // 如果无法获取，使用当前日期
    const now = new Date()
    updateDate.value = now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    }).replace(/\//g, '.')
  }
}

// 懒加载实现
onMounted(() => {
  const imageElement = document.querySelector('img[alt="Crypto Fear & Greed Index"]')
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 图片进入视口，开始加载
          entry.target.src = imageSrc
          imageObserver.unobserve(entry.target)
        }
      })
    })
    
    if (imageElement) {
      imageObserver.observe(imageElement)
    }
  } else {
    // 降级处理：直接加载
    if (imageElement) {
      imageElement.src = imageSrc
    }
  }
})
</script>

<style scoped>
/* 加载指示器样式 */
.loading-indicator {
  @apply flex flex-col items-center justify-center py-16;
}

.spinner {
  @apply w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin;
}

/* 图片容器样式 */
.image-container {
  @apply border-4 border-black bg-white dark:bg-gray-800;
  box-shadow: 8px 8px 0px 0px #000;
}

/* 错误状态样式 */
.error-state {
  @apply bg-red-50 dark:bg-red-900/20;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .image-container {
    box-shadow: 4px 4px 0px 0px #000;
  }
}
</style>
```

### 3.3 导航调整

#### AppHeader.vue 修改
```javascript
// 桌面端导航菜单调整（原第14-71行）
const navigationItems = [
  { name: '首页', href: '/' },
  { name: '温度计', href: '/thermometer' },  // 移到第二位
  { name: '原则', href: '/principles' },
  { name: '闪卡', href: '/flashcards' },
  { name: '测试', href: '/quiz' },
  { name: '分析', href: '/analytics' },
  { name: '成就', href: '/achievements' },
  { name: '导出', href: '/export' }
]

// 移动端导航菜单同步调整（原第85-152行）
```

### 3.4 SEO配置

在路由配置中添加元数据：
```javascript
// router/index.ts
{
  path: '/thermometer',
  name: 'thermometer',
  component: () => import('../views/ThermometerView.vue'),
  meta: {
    title: '加密货币恐慌与贪婪指数 | 12Factor.me',
    description: '实时查看加密货币市场情绪指数，了解市场恐慌与贪婪程度',
    ogImage: '/logo.png'  // 使用默认logo
  }
}
```

## 4. 实施步骤

### 4.1 第一阶段：核心功能实现

#### 步骤1：备份现有文件
```bash
cp /opt/src/12factor/vue/src/views/ThermometerView.vue \
   /opt/src/12factor/vue/src/views/ThermometerView.vue.bak
```

#### 步骤2：删除现有温度计功能
- 移除温度计组件代码
- 移除进度计算逻辑
- 移除与progress store的依赖

#### 步骤3：实现新页面结构
- 创建基础页面框架
- 添加标题和容器
- 实现Neobrutalism卡片样式

#### 步骤4：添加图片展示
- 实现图片加载逻辑
- 添加错误处理
- 配置图片路径

#### 步骤5：调整导航顺序
- 修改AppHeader.vue中的导航数组
- 确保桌面端和移动端同步

### 4.2 第二阶段：优化增强

#### 步骤6：实现懒加载
- 使用Intersection Observer API
- 添加加载指示器
- 实现降级方案

#### 步骤7：添加更新时间
- 获取文件修改时间
- 格式化日期显示
- 添加容错处理

#### 步骤8：配置缓存策略
- 设置HTTP缓存头
- 配置24小时缓存时间

### 4.3 第三阶段：测试验证

#### 步骤9：功能测试
- [ ] 页面正常加载
- [ ] 图片正确显示
- [ ] 导航顺序正确
- [ ] 链接跳转正常
- [ ] 错误处理生效

#### 步骤10：响应式测试
- [ ] 桌面端显示（1920x1080）
- [ ] 平板端显示（768x1024）
- [ ] 移动端显示（375x667）

#### 步骤11：性能测试
- [ ] 懒加载功能正常
- [ ] 页面加载时间 < 3秒
- [ ] 图片缓存生效

## 5. 图片更新维护

### 5.1 日常更新流程
```bash
# 1. 下载最新图片
wget https://alternative.me/crypto/fear-and-greed-index.png \
     -O /tmp/fear-and-greed-index.png

# 2. 替换现有图片
mv /tmp/fear-and-greed-index.png \
   /opt/src/12factor/vue/public/fear-and-greed-index.png

# 3. 提交更新
git add vue/public/fear-and-greed-index.png
git commit -m "更新加密货币恐慌与贪婪指数图片 $(date +%Y.%m.%d)"

# 4. 部署更新
npm run build
```

### 5.2 更新频率建议
- **推荐**: 每日更新一次（UTC 00:00）
- **最低**: 每周更新一次
- **特殊情况**: 市场剧烈波动时增加更新频率

## 6. 注意事项

### 6.1 技术注意事项
1. **图片大小**: 确保图片不超过500KB
2. **格式兼容**: 使用PNG格式确保透明度支持
3. **路径一致**: 始终使用`/fear-and-greed-index.png`
4. **缓存清理**: 更新后可能需要清理CDN缓存

### 6.2 业务注意事项
1. **版权说明**: 图片来源于alternative.me，需注明出处
2. **数据准确性**: 手动更新可能存在延迟
3. **用户期望**: 说明数据更新频率避免误解

## 7. 风险控制

### 7.1 技术风险
| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 图片加载失败 | 页面功能受限 | 提供访问源网站链接 |
| 文件时间不准 | 显示错误更新时间 | 使用当前日期作为降级 |
| 缓存过期慢 | 用户看到旧数据 | 说明更新频率 |

### 7.2 业务风险
| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 手动更新遗漏 | 数据陈旧 | 建立更新检查机制 |
| 图片版权问题 | 法律风险 | 明确标注数据来源 |

## 8. 验收标准

### 8.1 功能验收
- [x] 删除原有学习进度温度计
- [x] 显示恐慌与贪婪指数图片
- [x] 导航栏顺序调整正确
- [x] 数据源链接可访问
- [x] 更新时间正确显示

### 8.2 性能验收
- [x] 页面加载时间 < 3秒
- [x] 图片懒加载生效
- [x] 24小时缓存配置正确

### 8.3 用户体验验收
- [x] 响应式布局正常
- [x] 错误提示友好
- [x] 交互流畅自然

## 9. 部署清单

### 9.1 部署前检查
- [ ] 代码已通过lint检查
- [ ] 图片文件已放置到位
- [ ] 导航顺序已调整
- [ ] SEO元数据已配置

### 9.2 部署步骤
```bash
# 1. 构建项目
cd /opt/src/12factor
npm run build

# 2. 验证构建结果
ls -la dist/

# 3. 部署到生产环境
# (根据具体部署方式执行)
```

### 9.3 部署后验证
- [ ] 访问温度计页面
- [ ] 检查图片加载
- [ ] 验证链接跳转
- [ ] 确认缓存策略

## 10. 文档更新

需要更新的相关文档：
- [ ] 更新CLAUDE.md中的温度计页面说明
- [ ] 更新README中的功能列表
- [ ] 记录图片更新流程到运维文档

---

**文档编写**: Claude  
**审核状态**: 待审核  
**最后更新**: 2025-08-29