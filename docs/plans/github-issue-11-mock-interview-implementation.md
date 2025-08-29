# GitHub Issue #11 - 模拟面试功能详细实现计划

## 📋 需求分析摘要

基于 GitHub Issue #11，需要为 12factor.me 平台添加**模拟面试**功能，为区块链记者岗位提供三套不同难度的面试模拟系统。

### 核心需求
1. 在导航栏中追加 `模拟面试` 到测试之后
2. 设计模拟面试功能页面
3. 使用 hr_info_1.md 作为招聘方基本信息
4. 基于三个问卷文件设计模拟问卷系统
5. 通过不同难度的卡片进入
6. 答题时不显示正确答案，完成后自动批卷给出成绩
7. 不允许下载问卷，但可以下载成绩报告和分析建议

### 数据源分析
- **招聘信息**: ChainCatcher 区块链媒体，深圳记者岗位
- **问卷1**: 通用素质导向（100题）
- **问卷2**: 深度研究导向（100题） 
- **问卷3**: 新闻实战导向（100题）

## 🏗️ 系统架构设计

### 整体架构流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                        模拟面试系统架构                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   导航栏     │───▶│  面试首页    │───▶│   难度选择   │          │
│  │ Mock Interview│    │Interview Home│    │Difficulty Card│         │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                     │                │
│                                                     ▼                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   成绩页面   │◀───│   答题界面   │◀───│   题目加载   │          │
│  │ Result Page  │    │Question Page │    │Question Load │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│           │                                                          │
│           ▼                                                          │
│  ┌──────────────┐    ┌──────────────┐                               │
│  │ 分析报告生成 │───▶│ PDF/Excel    │                               │
│  │Analysis Gen  │    │Export        │                               │
│  └──────────────┘    └──────────────┘                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 核心组件设计

#### 1. 页面路由结构
```
/[locale]/mock-interview/
├── index.tsx                 # 面试首页 - 显示招聘信息和难度选择
├── [difficulty]/
│   ├── index.tsx            # 难度介绍页
│   ├── quiz/
│   │   └── page.tsx         # 答题界面
│   └── result/
│       └── [sessionId].tsx  # 成绩页面
└── components/
    ├── InterviewCard.tsx    # 难度选择卡片
    ├── QuestionForm.tsx     # 答题组件
    ├── ProgressBar.tsx      # 进度条
    ├── ResultDashboard.tsx  # 成绩展示
    └── ExportButton.tsx     # 导出功能
```

#### 2. 数据模型设计

```typescript
interface InterviewSession {
  id: string;
  userId?: string;
  difficulty: 'basic' | 'advanced' | 'expert';
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'abandoned';
  answers: UserAnswer[];
  score?: InterviewScore;
}

interface UserAnswer {
  questionId: string;
  selectedOptions: string[];
  isCorrect: boolean;
  timeSpent: number;
}

interface InterviewScore {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  categoryScores: CategoryScore[];
  recommendations: string[];
}

interface CategoryScore {
  category: string;
  score: number;
  total: number;
  percentage: number;
}

interface Question {
  id: string;
  category: string;
  difficulty: 'basic' | 'advanced' | 'expert';
  type: 'single' | 'multiple';
  question: string;
  options: string[];
  correctAnswers: string[];
  explanation?: string;
}
```

## 📱 用户交互流程设计

### 主要用户路径

```
用户进入 → 导航栏点击"模拟面试" → 查看招聘信息 → 选择难度卡片
    ↓
开始答题 → 逐题回答（无正确答案提示）→ 提交完成 → 查看成绩
    ↓
分析报告 → 下载成绩单 → （可选）重新测试
```

### 界面布局设计

#### 面试首页布局
```
┌────────────────────────────────────────────────────────────┐
│                      模拟面试                               │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                招聘方信息卡片                         │  │
│  │  🏢 ChainCatcher                                     │  │
│  │  📍 深圳 | 💼 记者 | 💰 2500-3600/月                 │  │
│  │  📝 要求：区块链行业报道、深度分析、选题策划          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│              选择面试难度                                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  基础级别   │ │  进阶级别   │ │  专家级别   │          │
│  │ 通用素质    │ │ 深度研究    │ │ 新闻实战    │          │
│  │ 100题/60分钟 │ │ 100题/90分钟 │ │ 100题/120分钟│          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└────────────────────────────────────────────────────────────┘
```

#### 答题界面布局
```
┌────────────────────────────────────────────────────────────┐
│ 进度: [███████████████████░░░░░░░] 75/100                  │
│ 剩余时间: 15:23                                            │
│────────────────────────────────────────────────────────────│
│                                                            │
│ Q75. [深度研究] 以下哪一项最能体现区块链行业从业记者的      │
│      核心素质？                                            │
│                                                            │
│ ○ A. 仅仅依赖官方新闻稿                                    │
│ ● B. 能够快速提炼信息并形成逻辑清晰的报道                  │
│ ○ C. 只关注价格波动                                        │
│ ○ D. 主要依靠AI生成内容                                    │
│                                                            │
│────────────────────────────────────────────────────────────│
│                        [上一题] [下一题]                   │
│                    [标记复习] [提交答案]                    │
└────────────────────────────────────────────────────────────┘
```

## 🔧 技术实现方案

### 前端技术栈

#### 核心技术选型
- **框架**: Next.js 15.4.6 (符合现有项目架构)
- **UI组件**: React + Tailwind CSS + Headless UI
- **状态管理**: Zustand (与现有项目一致)
- **表单处理**: React Hook Form + Zod 验证
- **数据持久化**: LocalStorage + IndexedDB
- **导出功能**: jsPDF + ExcelJS
- **国际化**: next-intl (双语支持)

#### 数据处理策略

##### 问卷数据预处理
```typescript
// 数据处理管道
const processQuestionnaires = () => {
  const questionnaires = {
    basic: parseQuestionnaire('questionnaire_1.md'),     // 通用素质
    advanced: parseQuestionnaire('questionnaire_2.md'),  // 深度研究  
    expert: parseQuestionnaire('questionnaire_3.md')     // 新闻实战
  };
  
  return Object.entries(questionnaires).map(([difficulty, questions]) => ({
    difficulty,
    questions: questions.map((q, index) => ({
      ...q,
      id: `${difficulty}_${index + 1}`,
      timeLimit: calculateTimeLimit(difficulty)
    }))
  }));
};
```

##### 答题会话管理
```typescript
// 会话状态管理
const useInterviewSession = () => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  
  const startSession = (difficulty: string) => {
    const newSession: InterviewSession = {
      id: generateUUID(),
      difficulty: difficulty as any,
      startTime: new Date(),
      status: 'in-progress',
      answers: []
    };
    setSession(newSession);
    saveToStorage(newSession);
  };
  
  const submitAnswer = (questionId: string, answer: string[]) => {
    // 答案提交逻辑，不显示正确性
    const updatedSession = {
      ...session,
      answers: [...session.answers, {
        questionId,
        selectedOptions: answer,
        timeSpent: calculateTimeSpent(),
        isCorrect: false // 在此阶段不计算正确性
      }]
    };
    setSession(updatedSession);
    saveToStorage(updatedSession);
  };
};
```

##### 自动批卷算法
```typescript
const calculateScore = (session: InterviewSession): InterviewScore => {
  const questions = getQuestionsByDifficulty(session.difficulty);
  let correctCount = 0;
  const categoryScores: Map<string, {correct: number, total: number}> = new Map();
  
  session.answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;
    
    // 计算答案正确性
    const isCorrect = arraysEqual(
      answer.selectedOptions.sort(),
      question.correctAnswers.sort()
    );
    
    if (isCorrect) correctCount++;
    
    // 分类统计
    const category = question.category;
    const currentScore = categoryScores.get(category) || {correct: 0, total: 0};
    categoryScores.set(category, {
      correct: currentScore.correct + (isCorrect ? 1 : 0),
      total: currentScore.total + 1
    });
  });
  
  // 生成推荐建议
  const recommendations = generateRecommendations(categoryScores, session.difficulty);
  
  return {
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    score: correctCount,
    percentage: Math.round((correctCount / questions.length) * 100),
    categoryScores: Array.from(categoryScores.entries()).map(([category, score]) => ({
      category,
      score: score.correct,
      total: score.total,
      percentage: Math.round((score.correct / score.total) * 100)
    })),
    recommendations
  };
};
```

### 导出功能实现

#### PDF 成绩报告
```typescript
const generatePDFReport = (session: InterviewSession, score: InterviewScore) => {
  const doc = new jsPDF();
  
  // 报告头部
  doc.setFontSize(20);
  doc.text('模拟面试成绩报告', 20, 30);
  
  // 基本信息
  doc.setFontSize(12);
  doc.text(`测试时间: ${session.startTime.toLocaleString()}`, 20, 50);
  doc.text(`难度等级: ${getDifficultyName(session.difficulty)}`, 20, 60);
  doc.text(`总体得分: ${score.percentage}%`, 20, 70);
  
  // 分类成绩图表
  let yPosition = 90;
  score.categoryScores.forEach(category => {
    doc.text(`${category.category}: ${category.percentage}%`, 20, yPosition);
    yPosition += 10;
  });
  
  // 改进建议
  yPosition += 10;
  doc.text('改进建议:', 20, yPosition);
  yPosition += 10;
  score.recommendations.forEach(rec => {
    doc.text(`• ${rec}`, 25, yPosition);
    yPosition += 10;
  });
  
  return doc;
};
```

### 国际化支持

#### 双语内容结构
```json
// messages/zh.json
{
  "mockInterview": {
    "title": "模拟面试",
    "subtitle": "ChainCatcher 区块链记者岗位",
    "difficulty": {
      "basic": "基础级别",
      "advanced": "进阶级别", 
      "expert": "专家级别"
    },
    "questions": {
      "timeRemaining": "剩余时间",
      "progress": "进度",
      "submit": "提交答案"
    },
    "results": {
      "score": "得分",
      "analysis": "分析报告",
      "download": "下载成绩单"
    }
  }
}

// messages/en.json
{
  "mockInterview": {
    "title": "Mock Interview",
    "subtitle": "ChainCatcher Blockchain Journalist Position",
    // ... 对应英文翻译
  }
}
```

## 📋 实施计划

### 第一阶段：基础架构搭建 (2-3天)
1. **路由和页面结构创建**
   - [ ] 创建 `/mock-interview` 路由结构
   - [ ] 设计基础页面模板
   - [ ] 集成双语路由支持

2. **数据模型和类型定义**  
   - [ ] 定义 TypeScript 接口
   - [ ] 创建数据处理工具函数
   - [ ] 问卷数据解析和预处理

3. **导航栏集成**
   - [ ] 修改主导航组件
   - [ ] 添加"模拟面试"链接
   - [ ] 确保移动端适配

### 第二阶段：核心功能实现 (4-5天)
1. **面试首页开发**
   - [ ] 招聘信息展示组件
   - [ ] 难度选择卡片组件
   - [ ] 响应式布局实现

2. **答题界面开发**
   - [ ] 题目渲染组件 
   - [ ] 答案选择逻辑
   - [ ] 进度条和计时器
   - [ ] 答案临时存储

3. **会话管理系统**
   - [ ] 答题会话状态管理
   - [ ] LocalStorage 数据持久化
   - [ ] 页面刷新数据恢复

### 第三阶段：成绩和分析 (3-4天)
1. **自动批卷系统**
   - [ ] 答案对比算法
   - [ ] 分数计算逻辑
   - [ ] 分类统计功能

2. **成绩展示页面**
   - [ ] 成绩仪表盘组件
   - [ ] 分类成绩图表
   - [ ] 错题分析展示

3. **建议生成算法**
   - [ ] 基于成绩的建议逻辑
   - [ ] 针对性改进建议
   - [ ] 学习资源推荐

### 第四阶段：导出和优化 (2-3天)
1. **导出功能实现**
   - [ ] PDF 报告生成
   - [ ] Excel 数据导出
   - [ ] 下载功能集成

2. **用户体验优化**
   - [ ] 加载状态和过渡动画
   - [ ] 错误处理和提示
   - [ ] 性能优化和代码分割

3. **测试和调试**
   - [ ] 功能测试
   - [ ] 兼容性测试  
   - [ ] 用户体验测试

## 🎯 关键决策点

### 需要明确的技术决策

#### 1. 数据存储策略
**选项A**: 纯客户端存储 (LocalStorage + IndexedDB)
- ✅ 实施简单，无需后端改动
- ✅ 用户隐私保护好
- ❌ 无法跨设备同步
- ❌ 数据分析能力有限

**选项B**: 集成后端存储 (数据库 + API)
- ✅ 数据分析和统计
- ✅ 跨设备同步
- ❌ 需要后端开发
- ❌ 隐私和 GDPR 考虑

**推荐**: 选项A，符合当前项目架构简单性

#### 2. 问卷随机化策略
**选项A**: 固定顺序 (按问卷文件顺序)
- ✅ 实施简单
- ✅ 结果可复现
- ❌ 缺乏随机性

**选项B**: 题目随机化
- ✅ 增加测试公平性
- ✅ 防止记忆答案
- ❌ 实施复杂度较高

**推荐**: 选项A，后续可迭代升级

#### 3. 时间限制实施
**选项A**: 严格时间限制 (自动提交)
- ✅ 真实面试体验
- ✅ 增加测试压力
- ❌ 用户体验压力大

**选项B**: 软性时间提醒
- ✅ 用户友好
- ✅ 允许思考时间
- ❌ 缺乏真实性

**推荐**: 选项B，平衡用户体验

#### 4. 移动端适配策略
**当前项目**: 主要面向桌面端，但需要移动端兼容
- 答题界面需要特别优化触摸操作
- 长问卷在移动端的可读性挑战
- 导出功能在移动端的实现方案

#### 5. 性能优化考虑
- 300题数据的加载策略 (懒加载 vs 预加载)
- 大量选项的渲染优化
- 会话数据的内存管理

### 产品功能边界

#### 明确不实施的功能
1. **用户账号系统集成** - 当前保持匿名使用
2. **多轮面试** - 仅单次完整测试
3. **实时排行榜** - 无社交比较功能  
4. **题目收藏** - 不允许保存具体题目
5. **学习模式** - 纯测试模式，无学习功能

#### 未来可扩展功能
1. **AI智能分析** - 集成 LLM 分析面试表现
2. **行业定制** - 支持其他行业岗位
3. **团队测试** - 企业批量面试功能
4. **视频面试** - 集成视频答题功能

## 📊 风险评估和缓解措施

### 技术风险
1. **数据一致性**: LocalStorage 数据可能丢失
   - 缓解: 添加数据导出备份功能
   
2. **性能问题**: 300题数据加载可能缓慢
   - 缓解: 实施数据分片和懒加载

3. **浏览器兼容性**: 导出功能可能在某些浏览器失效
   - 缓解: 提供降级方案和浏览器检测

### 用户体验风险
1. **测试时间过长**: 100题可能造成疲劳
   - 缓解: 提供中途暂停和恢复功能
   
2. **结果准确性质疑**: 自动批卷可能有争议
   - 缓解: 提供详细的答案解释和参考资料

### 业务风险
1. **内容版权**: 使用真实招聘信息的合规性
   - 缓解: 添加免责声明，标明仅供练习使用

## 📈 成功指标

### 功能完整性指标
- [ ] 三套问卷全部可正常运行
- [ ] 自动批卷准确率 100%
- [ ] 导出功能在主流浏览器正常工作
- [ ] 双语界面完整支持

### 用户体验指标
- [ ] 答题界面加载时间 < 2 秒
- [ ] 成绩计算和显示时间 < 3 秒
- [ ] 移动端界面完全适配
- [ ] 无数据丢失情况

### 技术质量指标
- [ ] 代码覆盖率 > 80% (如果有测试)
- [ ] TypeScript 无 any 类型使用
- [ ] 符合现有项目代码规范
- [ ] 无控制台错误和警告

---

## 📝 总结

本实施方案为 GitHub Issue #11 提供了全面的技术实现路径，重点关注：

1. **架构一致性**: 完全集成到现有 Next.js 项目中
2. **用户体验**: 简洁直观的面试流程设计
3. **技术可靠性**: 基于成熟技术栈的稳定实现
4. **扩展性**: 为未来功能升级预留空间

预计开发周期 **10-15天**，可按阶段逐步交付和测试。