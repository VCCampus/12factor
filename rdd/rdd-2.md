# 12factor.me i18n优化

##

  准备阶段（30分钟）

  阶段1：简单UI文本迁移 ⚡（1-2小时，风险：低）

  目标文件：
  - src/components/Navigation.tsx:67
  - src/app/[locale]/page.tsx:347-353
  - src/app/[locale]/principles/page.tsx:40,46,73

  JSON扩展：
  {
    "common": {
      "languageLabels": {
        "chinese": "中文",
        "english": "English"
      },
      "footer": {
        "copyright": "12Factor",
        "author": "@wquguru",
        "license": "MIT License"
      }
    },
    "principles": {
      "fallbackTitle": "Master the Principles",
      "fallbackDescription": "Explore the complete Four-Stage Twelve-Principle methodology for effective AI-human collaboration.",
      "stageLabel": "Stage Principles",
      "coreLabel": "Core Principles"
    }
  }

  阶段2：测验内容迁移 🎯（2-3小时，风险：中）

  目标文件： src/app/[locale]/quiz/page.tsx

  策略： 提取动态生成的错误答案和硬编码的原则名称

  {
    "quiz": {
      "wrongAnswers": [
        "这是一个错误的答案",
        "这也是错误的",
        "另一个错误选项"
      ],
      "principleOptions": {
        "contextHygiene": "上下文洁净（Context Hygiene）",
        "singleSource": "单一真源（Single Source of Truth）",
        "chunkedWork": "任务块化（Chunked Work）",
        "humanInLoop": "人类在环（Human-in-the-Loop）"
      }
    }
  }

  阶段3：核心数据结构迁移 🏗️（4-6小时，风险：高）

  关键创新：混合架构方案

  1. 保持数据结构完整性，创建翻译键映射：
  // src/data/principles.ts (重构后)
  export const principlesStructure = [
    {
      id: 1,
      stage: 1,
      // 原有数据作为备用
      legacy: {
        name: { zh: '单一真源', en: 'Single Source of Truth' }
      },
      // 新的翻译键
      keys: {
        name: 'principles.principle1.name',
        concept: 'principles.principle1.concept',
        practices: 'principles.principle1.practices',
        antiPatterns: 'principles.principle1.antiPatterns'
      }
    }
  ];

  2. 创建数据访问层：
  // src/utils/principleHelpers.ts  
  export function getLocalizedPrinciple(id: number, t: any) {
    const principle = principlesStructure.find(p => p.id === id);
    return {
      name: t(principle.keys.name),
      concept: t(principle.keys.concept),
      practices: t(principle.keys.practices, { returnObjects: true }),
      antiPatterns: t(principle.keys.antiPatterns, { returnObjects: true })
    };
  }

  3. 批量数据提取脚本：
  // scripts/extractI18nData.ts
  function extractPrincipleData() {
    // 自动提取现有数据并生成JSON结构
  }

  🛡️ 风险控制策略

  向后兼容性保证

  // 渐进式替换模式
  const displayName = principle.keys?.name
    ? t(principle.keys.name)
    : principle.legacy.name[locale];

  测试检查点

  - ✅ 阶段1完成：所有UI文本正确显示
  - ✅ 阶段2完成：测验功能无异常
  - ✅ 阶段3完成：所有原则内容完整展示

  自动化验证

  npm run lint && npm run build && npm run start
  # 手动测试两种语言下的所有页面

  📊 预估时间线

  | 阶段  | 时间    | 风险  | 主要任务    |
  |-----|-------|-----|---------|
  | 准备  | 30分钟  | 无   | 分支创建、备份 |
  | 阶段1 | 1-2小时 | 低   | UI文本提取  |
  | 阶段2 | 2-3小时 | 中   | 测验逻辑重构  |
  | 阶段3 | 4-6小时 | 高   | 核心数据迁移  |
  | 测试  | 1-2小时 | -   | 全面回归测试  |

  总计：8-13小时

  这个方案确保了迁移过程的安全性和可控性，同时为未来的国际化扩展打下坚实基础。

上述完整的i18n迁移计划，包括了：

  1. 三个明确的迁移阶段（简单UI文本、测验内容、核心数据结构）
  2. 每个阶段的具体实施策略和代码示例
  3. 风险控制措施（混合架构、向后兼容、测试检查点）
  4. 时间估算和任务分解

  这个计划特别考虑了src/data/principles.ts这个复杂数据文件的迁移，提出了创新的混合架构方案来保持数据完整性的同时实现i18n。


