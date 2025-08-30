#!/usr/bin/env node

/**
 * 问卷数据转换脚本
 * 将 docs/research/questionnaire_*.md 转换为 Vue 项目可用的 JSON 格式
 */

const fs = require('fs');
const path = require('path');

// 文件路径配置
const SOURCE_DIR = path.join(__dirname, '../docs/research');
const OUTPUT_DIR = path.join(__dirname, '../vue/public/data');

// 问卷配置映射
const QUESTIONNAIRE_CONFIG = {
  'questionnaire_1.md': {
    outputFile: 'interview-basic.json',
    difficulty: 'basic',
    category: 'general',
    title: '通用素质测评',
    description: '测评基础的文字表达和行业理解能力',
    timeLimit: 60,
    icon: '📝'
  },
  'questionnaire_2.md': {
    outputFile: 'interview-advanced.json', 
    difficulty: 'advanced',
    category: 'research',
    title: '深度研究能力',
    description: '考察深度分析和研究能力',
    timeLimit: 90,
    icon: '🔍'
  },
  'questionnaire_3.md': {
    outputFile: 'interview-expert.json',
    difficulty: 'expert', 
    category: 'practical',
    title: '新闻实战技能',
    description: '实战新闻写作和策划能力',
    timeLimit: 120,
    icon: '⚡'
  }
};

// 招聘方信息（从 hr_info_1.md 提取）
const JOB_INFO = {
  company: 'ChainCatcher',
  position: '区块链记者',
  location: '深圳',
  salary: '2500-3600/月',
  type: '记者·内容',
  description: '专业的区块链研究与资讯平台',
  requirements: [
    '热爱写作，对 Crypto 行业有强烈求知欲',
    '阅读过 100+ 篇商业科技、财经媒体优质文章', 
    '具备成熟的文字写作功底和逻辑清晰表达能力',
    '有强烈责任心和良好团队协作意识'
  ]
};

/**
 * 解析 Markdown 问卷文件
 */
function parseQuestionnaire(filePath) {
  console.log(`📖 解析问卷: ${path.basename(filePath)}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions = [];
  let currentQuestion = null;
  
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 匹配问题行 **Q1. [类别] 问题内容**
    const questionMatch = line.match(/^\*\*Q(\d+)\.\s*\[([^\]]+)\]\s*(.+?)\*\*$/);
    if (questionMatch) {
      // 保存前一个问题
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      const [, questionNum, category, questionText] = questionMatch;
      currentQuestion = {
        id: `q${questionNum}`,
        questionNumber: parseInt(questionNum),
        category: mapCategory(category),
        question: questionText,
        options: [],
        correctAnswers: [],
        type: 'single', // 默认单选，后面检测多选
        explanation: null
      };
      continue;
    }
    
    // 匹配选项行 - A. 选项内容
    const optionMatch = line.match(/^-\s*([A-D])\.\s*(.+)$/);
    if (optionMatch && currentQuestion) {
      const [, optionLetter, optionText] = optionMatch;
      currentQuestion.options.push({
        letter: optionLetter,
        text: optionText
      });
      continue;
    }
    
    // 匹配答案行 **答案:** A, B, C 或 **答案:** B
    const answerMatch = line.match(/^\*\*答案:\*\*\s*(.+)$/);
    if (answerMatch && currentQuestion) {
      const answerText = answerMatch[1].trim();
      const answers = answerText.split(',').map(a => a.trim());
      
      currentQuestion.correctAnswers = answers;
      currentQuestion.type = answers.length > 1 ? 'multiple' : 'single';
      continue;
    }
  }
  
  // 添加最后一个问题
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  
  console.log(`✅ 解析完成: ${questions.length} 道题目`);
  return questions;
}

/**
 * 映射分类名称
 */
function mapCategory(categoryText) {
  const categoryMap = {
    '通用素质': 'general',
    '深度研究': 'research', 
    '新闻实战': 'practical'
  };
  
  return categoryMap[categoryText] || 'general';
}

/**
 * 转换问题格式为 QuizEngine 兼容格式
 */
function convertToQuizFormat(questions, config) {
  return questions.map(q => ({
    id: `${config.difficulty}_${q.id}`,
    principle_id: config.difficulty,
    question: q.question,
    correct_answer: q.type === 'single' ? q.correctAnswers[0] : q.correctAnswers,
    wrong_answers: q.options
      .filter(opt => !q.correctAnswers.includes(opt.letter))
      .map(opt => opt.text),
    all_options: q.options.map(opt => opt.text),
    difficulty: config.difficulty,
    category: q.category,
    type: q.type,
    explanation: `正确答案: ${q.correctAnswers.join(', ')}`,
    questionNumber: q.questionNumber
  }));
}

/**
 * 生成完整的面试问卷数据
 */
function generateInterviewData(questions, config) {
  return {
    meta: {
      title: config.title,
      description: config.description,
      difficulty: config.difficulty,
      category: config.category,
      timeLimit: config.timeLimit,
      icon: config.icon,
      totalQuestions: questions.length,
      generatedAt: new Date().toISOString(),
      version: '1.0.0'
    },
    jobInfo: JOB_INFO,
    questions: questions,
    categories: {
      general: '通用素质',
      research: '深度研究',
      practical: '新闻实战'
    },
    instructions: {
      timeManagement: '建议合理安排答题时间，系统会进行软性提醒',
      answering: '请仔细阅读题目，选择最合适的答案',
      review: '答题完成后可以查看详细解析和个人表现分析'
    }
  };
}

/**
 * 主处理函数
 */
async function processQuestionnaires() {
  console.log('🚀 开始处理模拟面试问卷数据...\n');
  
  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 创建输出目录: ${OUTPUT_DIR}`);
  }
  
  let totalProcessed = 0;
  
  for (const [sourceFile, config] of Object.entries(QUESTIONNAIRE_CONFIG)) {
    const sourcePath = path.join(SOURCE_DIR, sourceFile);
    const outputPath = path.join(OUTPUT_DIR, config.outputFile);
    
    try {
      console.log(`\n🔄 处理 ${sourceFile} -> ${config.outputFile}`);
      
      // 检查源文件是否存在
      if (!fs.existsSync(sourcePath)) {
        console.warn(`⚠️  源文件不存在: ${sourcePath}`);
        continue;
      }
      
      // 解析问卷
      const rawQuestions = parseQuestionnaire(sourcePath);
      if (rawQuestions.length === 0) {
        console.warn(`⚠️  未解析到任何题目: ${sourceFile}`);
        continue;
      }
      
      // 转换为 Quiz 格式
      const convertedQuestions = convertToQuizFormat(rawQuestions, config);
      
      // 生成完整数据
      const interviewData = generateInterviewData(convertedQuestions, config);
      
      // 写入文件
      fs.writeFileSync(outputPath, JSON.stringify(interviewData, null, 2), 'utf-8');
      
      console.log(`✅ 成功生成: ${config.outputFile} (${convertedQuestions.length} 题)`);
      totalProcessed++;
      
    } catch (error) {
      console.error(`❌ 处理失败 ${sourceFile}:`, error.message);
    }
  }
  
  console.log(`\n🎉 处理完成! 总共处理了 ${totalProcessed} 个问卷文件`);
  console.log(`📂 输出目录: ${OUTPUT_DIR}`);
  
  // 生成问卷索引文件
  generateQuestionnaireIndex();
}

/**
 * 生成问卷索引文件
 */
function generateQuestionnaireIndex() {
  const index = {
    meta: {
      title: 'ChainCatcher 模拟面试问卷集',
      description: '区块链记者岗位模拟面试系统',
      version: '1.0.0',
      generatedAt: new Date().toISOString()
    },
    jobInfo: JOB_INFO,
    questionnaires: Object.entries(QUESTIONNAIRE_CONFIG).map(([sourceFile, config]) => ({
      id: config.difficulty,
      file: config.outputFile,
      title: config.title,
      description: config.description,
      difficulty: config.difficulty,
      category: config.category,
      timeLimit: config.timeLimit,
      icon: config.icon,
      estimatedQuestions: 100
    })),
    categories: {
      general: '通用素质',
      research: '深度研究', 
      practical: '新闻实战'
    }
  };
  
  const indexPath = path.join(OUTPUT_DIR, 'interview-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`📋 生成索引文件: interview-index.json`);
}

// 执行主函数
if (require.main === module) {
  processQuestionnaires().catch(error => {
    console.error('💥 处理过程中发生错误:', error);
    process.exit(1);
  });
}

module.exports = { processQuestionnaires };