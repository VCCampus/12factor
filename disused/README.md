# 归档文件说明

此目录包含了导航栏简化项目中移除的文件。

## 归档时间
2025-09-05

## 归档原因
根据Issue #17的决策，简化导航栏结构，将原有9个导航项精简为4个。

## 归档文件清单

### Views (视图文件)
- `AnalyticsView.vue` - 分析页面
- `GamificationView.vue` - 成就页面  
- `ExportView.vue` - 导出页面
- `FlashcardsView.vue` - 闪卡页面（已整合到原则页面）
- `QuizView.vue` - 测试页面（已整合到原则页面）
- `PrinciplesViewOld.vue` - 原始的原则页面

### Stores (状态管理)
- `gamification.ts` - 成就系统状态管理

## 相关功能迁移
- 数据导出功能已迁移到页脚
- 闪卡和测试功能已整合到原则页面的Tab中
- 用户数据保存在localStorage中

## 恢复方法
如需恢复这些功能，可以从此目录复制文件并重新配置路由。

## 参考
- GitHub Issue: #17
- Git Tag: v4.0.0-before-nav-simplify