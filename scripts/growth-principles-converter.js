#!/usr/bin/env node
/**
 * 个人成长12原则数据转换器
 * 用途：将growth-principles TOML文件转换为Vue组件所需的JSON格式
 * 支持：闪卡数据、测试题库、原则体系
 * 作者：Claude Code
 * 日期：2025-09-06
 */

const fs = require('fs');
const path = require('path');

/**
 * 简单TOML解析器 - 专为12原则数据格式优化
 */
function parseTOML(content) {
  const lines = content.split('\n');
  const result = {};
  let currentSection = result;
  let currentArray = null;
  let currentArrayName = '';
  let inMultilineString = false;
  let multilineKey = '';
  let multilineValue = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // 处理多行字符串
    if (inMultilineString) {
      if (line.trim() === '"""') {
        // 多行字符串结束
        currentSection[multilineKey] = multilineValue.trim();
        inMultilineString = false;
        multilineKey = '';
        multilineValue = '';
        continue;
      } else {
        multilineValue += line + '\n';
        continue;
      }
    }
    
    line = line.trim();
    
    // 跳过空行和注释
    if (!line || line.startsWith('#')) continue;

    // 处理节标题 [section] 或 [[array]]
    if (line.startsWith('[')) {
      if (line.startsWith('[[') && line.endsWith(']]')) {
        // 数组节 [[cards]]
        currentArrayName = line.slice(2, -2);
        if (!result[currentArrayName]) {
          result[currentArrayName] = [];
        }
        const newItem = {};
        result[currentArrayName].push(newItem);
        currentSection = newItem;
        currentArray = result[currentArrayName];
      } else if (line.endsWith(']')) {
        // 普通节 [metadata]
        const sectionName = line.slice(1, -1);
        const parts = sectionName.split('.');
        
        let target = result;
        for (let j = 0; j < parts.length; j++) {
          if (!target[parts[j]]) target[parts[j]] = {};
          if (j === parts.length - 1) {
            currentSection = target[parts[j]];
          } else {
            target = target[parts[j]];
          }
        }
        currentArray = null;
      }
      continue;
    }

    // 处理键值对
    const equalIndex = line.indexOf('=');
    if (equalIndex > 0) {
      const key = line.substring(0, equalIndex).trim();
      let value = line.substring(equalIndex + 1).trim();

      // 处理多行字符串开始
      if (value === '"""') {
        inMultilineString = true;
        multilineKey = key;
        multilineValue = '';
        continue;
      }

      // 解析不同类型的值
      let parsedValue = parseValue(value);
      currentSection[key] = parsedValue;
    }
  }

  return result;
}

/**
 * 解析TOML值
 */
function parseValue(value) {
  // 字符串
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  
  // 数组
  if (value.startsWith('[') && value.endsWith(']')) {
    const arrayContent = value.slice(1, -1).trim();
    if (!arrayContent) return [];
    
    return arrayContent.split(',')
      .map(item => item.trim())
      .map(item => item.startsWith('"') && item.endsWith('"') ? item.slice(1, -1) : item);
  }

  // 布尔值
  if (value === 'true') return true;
  if (value === 'false') return false;

  // 数字
  if (!isNaN(value) && !isNaN(parseFloat(value))) {
    return Number(value);
  }

  // 字符串（无引号）
  return value;
}

/**
 * 转换闪卡数据
 */
function convertFlashcards(flashcardData) {
  if (!flashcardData.cards) {
    throw new Error('闪卡数据中未找到cards数组');
  }

  // 按原则分组
  const principleGroups = {};
  flashcardData.cards.forEach(card => {
    const principle = card.principle || '未知原则';
    if (!principleGroups[principle]) {
      principleGroups[principle] = [];
    }
    principleGroups[principle].push(card);
  });

  // 生成阶段映射（基于difficulty字段）
  const stageMapping = {
    '基础': { id: 'foundation', name: '基础认知', icon: '🧠', order: 1 },
    '进阶': { id: 'advanced', name: '进阶应用', icon: '🚀', order: 2 },
    '应用': { id: 'application', name: '实践应用', icon: '⚡', order: 3 },
    '反思': { id: 'reflection', name: '深度反思', icon: '💡', order: 4 }
  };

  // 生成原则索引
  const principles = flashcardData.metadata?.categories || Object.keys(principleGroups);
  const principlesWithStages = principles.map((principle, index) => {
    const cards = principleGroups[principle] || [];
    
    // 统计各难度的卡片数量
    const difficultyStats = {};
    cards.forEach(card => {
      const diff = card.difficulty || '基础';
      difficultyStats[diff] = (difficultyStats[diff] || 0) + 1;
    });

    return {
      id: `principle_${index + 1}`,
      name: principle,
      description: `关于${principle}的核心概念和实践方法`,
      total_cards: cards.length,
      difficulty_distribution: difficultyStats,
      cards: cards.map(card => ({
        ...card,
        stage: stageMapping[card.difficulty] ? stageMapping[card.difficulty].id : 'foundation'
      }))
    };
  });

  return {
    metadata: {
      title: flashcardData.metadata?.title || '个人成长12原则闪卡系统',
      version: flashcardData.metadata?.version || '2.0',
      total_cards: flashcardData.metadata?.total_cards || flashcardData.cards.length,
      total_principles: principles.length,
      generated_at: new Date().toISOString()
    },
    stages: Object.values(stageMapping).sort((a, b) => a.order - b.order),
    principles: principlesWithStages,
    flashcards_by_principle: principleGroups
  };
}

/**
 * 转换测试题数据
 */
function convertQuiz(quizData) {
  if (!quizData.questions) {
    throw new Error('测试数据中未找到questions数组');
  }

  // 按原则分组题目
  const questionsByPrinciple = {};
  const questionsByDifficulty = {};
  const questionsByType = {};

  quizData.questions.forEach(question => {
    const principle = question.principle || '综合应用';
    const difficulty = question.difficulty || '基础';
    const type = question.type || 'single';

    // 按原则分组
    if (!questionsByPrinciple[principle]) {
      questionsByPrinciple[principle] = [];
    }
    questionsByPrinciple[principle].push(question);

    // 按难度分组
    if (!questionsByDifficulty[difficulty]) {
      questionsByDifficulty[difficulty] = [];
    }
    questionsByDifficulty[difficulty].push(question);

    // 按类型分组
    if (!questionsByType[type]) {
      questionsByType[type] = [];
    }
    questionsByType[type].push(question);
  });

  // 生成测试模式配置
  const testModes = [
    {
      id: 'practice',
      name: '练习模式',
      description: '无时间限制，适合初学',
      time_limit: null,
      question_count: 25,
      shuffle: true,
      immediate_feedback: true
    },
    {
      id: 'timed', 
      name: '限时模式',
      description: '每题30秒，模拟考试',
      time_limit: 30,
      question_count: 25,
      shuffle: true,
      immediate_feedback: false
    },
    {
      id: 'challenge',
      name: '挑战模式', 
      description: '高难度题目，连对奖励',
      time_limit: 45,
      question_count: 20,
      shuffle: true,
      difficulty_filter: ['进阶', '应用'],
      bonus_system: true
    },
    {
      id: 'review',
      name: '复习模式',
      description: '查看所有题目和答案',
      time_limit: null,
      question_count: null,
      shuffle: false,
      show_answers: true
    }
  ];

  return {
    metadata: {
      title: quizData.metadata?.title || '个人成长12原则测试题库',
      version: quizData.metadata?.version || '1.0',
      total_questions: quizData.questions.length,
      single_choice: quizData.metadata?.single_choice || 0,
      multiple_choice: quizData.metadata?.multiple_choice || 0,
      passing_score: quizData.metadata?.passing_score || 80,
      generated_at: new Date().toISOString()
    },
    test_modes: testModes,
    questions: quizData.questions,
    questions_by_principle: questionsByPrinciple,
    questions_by_difficulty: questionsByDifficulty,
    questions_by_type: questionsByType,
    scoring: quizData.scoring || {
      single_choice_points: 1,
      multiple_choice_points: 2,
      passing_percentage: 80
    }
  };
}

/**
 * 生成整合数据
 */
function generateIntegratedData(flashcardData, quizData) {
  // 提取原则列表
  const principlesList = flashcardData.metadata?.categories || [];
  
  return {
    metadata: {
      title: '个人成长12原则学习系统',
      version: '1.0.0', 
      modules: ['principles', 'flashcards', 'quiz'],
      total_principles: principlesList.length,
      generated_at: new Date().toISOString()
    },
    principles_overview: principlesList.map((principle, index) => ({
      id: `principle_${index + 1}`,
      name: principle,
      order: index + 1,
      flashcard_count: flashcardData.cards?.filter(c => c.principle === principle).length || 0,
      quiz_count: quizData.questions?.filter(q => q.principle === principle).length || 0
    })),
    navigation: [
      { id: 'home', name: '首页', path: '/', icon: '🏠' },
      { id: 'principles', name: '原则学习', path: '/growth-principles', icon: '📚' },
      { id: 'flashcards', name: '闪卡练习', path: '/growth-flashcards', icon: '🎯' },
      { id: 'quiz', name: '测试评估', path: '/growth-quiz', icon: '📝' }
    ]
  };
}

/**
 * 主转换函数
 */
function convertGrowthPrinciplesData(flashcardTomlPath, quizTomlPath, outputDir) {
  console.log('🚀 开始转换个人成长12原则数据...');

  // 检查文件存在性
  if (!fs.existsSync(flashcardTomlPath)) {
    throw new Error(`闪卡TOML文件不存在: ${flashcardTomlPath}`);
  }
  if (!fs.existsSync(quizTomlPath)) {
    throw new Error(`测试TOML文件不存在: ${quizTomlPath}`);
  }

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 解析TOML文件
  console.log('📖 解析闪卡数据...');
  const flashcardContent = fs.readFileSync(flashcardTomlPath, 'utf8');
  const flashcardData = parseTOML(flashcardContent);

  console.log('📖 解析测试数据...');
  const quizContent = fs.readFileSync(quizTomlPath, 'utf8');
  const quizData = parseTOML(quizContent);

  // 转换数据
  console.log('🔄 转换闪卡数据...');
  const convertedFlashcards = convertFlashcards(flashcardData);

  console.log('🔄 转换测试数据...');
  const convertedQuiz = convertQuiz(quizData);

  console.log('🔄 生成整合数据...');
  const integratedData = generateIntegratedData(flashcardData, quizData);

  // 输出JSON文件
  const outputs = [
    { filename: 'growth-principles-flashcards.json', data: convertedFlashcards },
    { filename: 'growth-principles-quiz.json', data: convertedQuiz },
    { filename: 'growth-principles-index.json', data: integratedData }
  ];

  let totalSize = 0;
  outputs.forEach(({ filename, data }) => {
    const filePath = path.join(outputDir, filename);
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonContent, 'utf8');
    
    const fileSize = jsonContent.length;
    totalSize += fileSize;
    console.log(`✅ ${filename} (${Math.round(fileSize / 1024 * 100) / 100} KB)`);
  });

  console.log(`📊 总计生成: ${outputs.length}个文件, ${Math.round(totalSize / 1024 * 100) / 100} KB`);
  console.log('🎉 个人成长12原则数据转换完成！');
  
  return true;
}

// 命令行调用
if (require.main === module) {
  const flashcardToml = process.argv[2];
  const quizToml = process.argv[3];
  const outputDir = process.argv[4];

  if (!flashcardToml || !quizToml || !outputDir) {
    console.error('用法: node growth-principles-converter.js <flashcard.toml> <quiz.toml> <output-dir>');
    console.error('例子: node growth-principles-converter.js docs/research/250906-growth_principles_flashcards.toml docs/research/250906-growth_principles_quiz.toml vue/public/');
    process.exit(1);
  }

  try {
    convertGrowthPrinciplesData(flashcardToml, quizToml, outputDir);
  } catch (error) {
    console.error(`❌ 转换失败: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { convertGrowthPrinciplesData };