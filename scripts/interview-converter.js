#!/usr/bin/env node

/**
 * Interview TOML to JSON Converter
 * Converts interview question TOML files to JSON format for web consumption
 */

const fs = require('fs');
const path = require('path');
const { parseInterviewToml } = require('./interview-toml-parser');

const SOURCE_DIR = path.join(__dirname, '../docs/research/q4interview');
const OUTPUT_DIR = path.join(__dirname, '../vue/public/interviews');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Job type mapping
const JOB_CONFIGS = {
  'defi_growth': {
    title: 'DeFi增长经理',
    icon: '💼',
    salary: '$55K-80K',
    location: '远程',
    experience: '2年+',
    description: '快速发展的DeFi固定利率借贷平台增长经理',
    requirements: [
      '深度理解DeFi借贷协议和流动性挖矿',
      '具备强大的数据分析能力',
      '熟练使用Dune Analytics等链上分析工具',
      '优秀的英语沟通技能'
    ]
  },
  'fullstack': {
    title: '全栈开发工程师',
    icon: '💻',
    salary: '¥25-40K',
    location: '深圳',
    experience: '3年+',
    description: '区块链技术全栈开发工程师',
    requirements: [
      '熟悉React/Vue等前端框架',
      '掌握Node.js/Python后端开发',
      '了解智能合约开发',
      '具备Web3集成经验'
    ]
  },
  'seo': {
    title: 'SEO营销专家',
    icon: '📈',
    salary: '¥20-35K',
    location: '北京',
    experience: '2年+',
    description: '区块链项目SEO和内容营销专家',
    requirements: [
      '熟悉SEO和内容营销策略',
      '了解区块链行业特点',
      '具备数据分析能力',
      '优秀的内容创作能力'
    ]
  }
};

// Difficulty mapping
const DIFFICULTY_MAP = {
  'junior': { label: '初级', icon: '🥉', timeLimit: 30 },
  'intermediate': { label: '中级', icon: '🥈', timeLimit: 45 },
  'advanced': { label: '高级', icon: '🥇', timeLimit: 60 }
};

// Category mapping - normalize to match TOML categories
const CATEGORY_MAP = {
  'DeFi基础': 'defi_basics',
  '数据分析': 'data_analysis',
  '增长策略': 'growth_strategy',
  'Web3知识': 'web3_knowledge',
  '实践应用': 'practical_app'
};

/**
 * Convert TOML file to JSON
 */
function convertTomlToJson(tomlFile, jobType, difficulty) {
  const tomlContent = fs.readFileSync(tomlFile, 'utf8');
  const data = parseInterviewToml(tomlContent);
  
  // Generate new composite IDs for questions
  const questions = data.questions.map(q => {
    const categoryKey = CATEGORY_MAP[q.category] || q.category.toLowerCase().replace(/\s+/g, '_');
    const newId = `${jobType}_${difficulty}_${categoryKey}_${String(q.id).padStart(3, '0')}`;
    
    return {
      id: newId,
      originalId: q.id,
      category: q.category,
      categoryKey: categoryKey,
      type: q.type,
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation
    };
  });
  
  return {
    meta: {
      jobType: jobType,
      jobTypeLabel: JOB_CONFIGS[jobType]?.title || jobType,
      difficulty: difficulty,
      difficultyLabel: DIFFICULTY_MAP[difficulty]?.label || difficulty,
      title: data.metadata.title,
      version: data.metadata.version,
      description: data.metadata.description,
      totalQuestions: questions.length,
      categories: [...new Set(questions.map(q => q.category))],
      generatedAt: new Date().toISOString()
    },
    questions: questions
  };
}

/**
 * Generate job index file
 */
function generateJobIndex() {
  const index = {
    meta: {
      title: '模拟面试系统',
      description: '多岗位、多难度的区块链行业面试题库',
      version: '2.0.0',
      generatedAt: new Date().toISOString()
    },
    jobs: {},
    difficulties: DIFFICULTY_MAP,
    questionnaires: []
  };
  
  // Process all TOML files
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(file => file.endsWith('.toml'));
  
  files.forEach(file => {
    const match = file.match(/^(.+?)_interview_(junior|intermediate|advanced)\.toml$/);
    if (match) {
      const [_, jobType, difficulty] = match;
      
      // Add job info if not exists
      if (!index.jobs[jobType]) {
        index.jobs[jobType] = JOB_CONFIGS[jobType] || {
          title: jobType,
          icon: '📋',
          salary: 'N/A',
          location: 'N/A',
          experience: 'N/A'
        };
      }
      
      // Convert TOML to JSON
      const inputFile = path.join(SOURCE_DIR, file);
      const outputFile = `${jobType}_${difficulty}.json`;
      const outputPath = path.join(OUTPUT_DIR, outputFile);
      
      try {
        const jsonData = convertTomlToJson(inputFile, jobType, difficulty);
        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
        
        // Add to questionnaires list
        index.questionnaires.push({
          id: `${jobType}_${difficulty}`,
          jobType: jobType,
          difficulty: difficulty,
          file: outputFile,
          title: `${JOB_CONFIGS[jobType]?.title || jobType} - ${DIFFICULTY_MAP[difficulty]?.label}`,
          icon: DIFFICULTY_MAP[difficulty]?.icon,
          questionCount: jsonData.questions.length,
          categories: jsonData.meta.categories
        });
        
        console.log(`✅ Converted: ${file} → ${outputFile}`);
      } catch (error) {
        console.error(`❌ Error converting ${file}:`, error.message);
      }
    }
  });
  
  // Write index file
  const indexPath = path.join(OUTPUT_DIR, 'job-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`\n📄 Generated index: job-index.json`);
  console.log(`📊 Total questionnaires: ${index.questionnaires.length}`);
}

// Main execution
console.log('🔄 Starting interview data conversion...\n');
generateJobIndex();
console.log('\n✅ Interview data conversion completed!');