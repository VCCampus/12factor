#!/usr/bin/env node
/**
 * TOML到JSON转换工具
 * 用途：将web3scv8_v4.toml转换为分片JSON文件
 * 作者：Claude Code  
 * 日期：2025-08-28
 */

const fs = require('fs');
const path = require('path');
const { parseTomlForCSS } = require('./simple-toml-parser');

// 改进的TOML解析器，支持多行数组
function parseSimpleTOML(content) {
  const lines = content.split('\n');
  const result = {};
  let currentSection = result;
  let currentPath = [];
  let inMultilineArray = false;
  let currentArrayKey = '';
  let currentArrayValue = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 处理多行数组的结束
    if (inMultilineArray) {
      if (line.endsWith(']')) {
        // 数组结束
        if (line !== ']') {
          currentArrayValue.push(line.slice(0, -1).trim().replace(/"/g, ''));
        }
        // 设置数组值
        if (currentArrayKey.includes('.')) {
          const keys = currentArrayKey.split('.');
          let target = currentSection;
          for (let j = 0; j < keys.length - 1; j++) {
            if (!target[keys[j]]) target[keys[j]] = {};
            target = target[keys[j]];
          }
          target[keys[keys.length - 1]] = currentArrayValue;
        } else {
          currentSection[currentArrayKey] = currentArrayValue;
        }
        inMultilineArray = false;
        currentArrayKey = '';
        currentArrayValue = [];
        continue;
      } else if (line && !line.startsWith('#')) {
        // 添加数组项
        currentArrayValue.push(line.replace(/"/g, '').replace(/,$/, ''));
        continue;
      }
      continue;
    }
    
    if (!line || line.startsWith('#')) continue;
    
    // 处理节标题
    if (line.startsWith('[') && line.endsWith(']')) {
      const sectionName = line.slice(1, -1);
      
      if (line.startsWith('[[') && line.endsWith(']]')) {
        const arrayName = sectionName;
        if (!result[arrayName]) result[arrayName] = [];
        const newObj = {};
        result[arrayName].push(newObj);
        currentSection = newObj;
        currentPath = [arrayName, result[arrayName].length - 1];
      } else {
        const parts = sectionName.split('.');
        let target = result;
        for (let j = 0; j < parts.length; j++) {
          if (!target[parts[j]]) target[parts[j]] = {};
          if (j === parts.length - 1) currentSection = target[parts[j]];
          else target = target[parts[j]];
        }
        currentPath = parts;
      }
      continue;
    }
    
    const equalIndex = line.indexOf('=');
    if (equalIndex > 0) {
      const key = line.substring(0, equalIndex).trim();
      const value = line.substring(equalIndex + 1).trim();
      
      let parsedValue = value;
      
      // 处理多行数组开始
      if (value === '[' || (value.startsWith('[') && !value.endsWith(']'))) {
        inMultilineArray = true;
        currentArrayKey = key;
        currentArrayValue = [];
        if (value !== '[') {
          // 第一行就有内容
          currentArrayValue.push(value.slice(1).trim().replace(/"/g, '').replace(/,$/, ''));
        }
        continue;
      }
      
      // 处理单行值
      if (value.startsWith('"') && value.endsWith('"')) {
        parsedValue = value.slice(1, -1);
      } else if (value.startsWith('[') && value.endsWith(']')) {
        parsedValue = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''));
      } else if (value === 'true') {
        parsedValue = true;
      } else if (value === 'false') {
        parsedValue = false;
      } else if (!isNaN(value)) {
        parsedValue = Number(value);
      }
      
      // 处理嵌套对象键 (如 flashcard.front)
      if (key.includes('.')) {
        const keys = key.split('.');
        let target = currentSection;
        for (let j = 0; j < keys.length - 1; j++) {
          if (!target[keys[j]]) target[keys[j]] = {};
          target = target[keys[j]];
        }
        target[keys[keys.length - 1]] = parsedValue;
      } else {
        currentSection[key] = parsedValue;
      }
    }
  }
  
  return result;
}

// 按阶段过滤原则
function filterByStage(config, stageId) {
  const stage = config.stages?.find(s => s.id === stageId);
  const principles = config.principles?.filter(p => p.stage === stageId) || [];
  
  return {
    module_id: stageId,
    module_name: stage?.title || stageId,
    icon: stage?.icon || '📚',
    description: stage?.description || '',
    principles: principles
  };
}

// 提取测试数据
function extractQuizData(config) {
  if (!config.principles) return { modules: {} };
  
  const modules = {};
  
  // 按阶段组织题目
  config.stages?.forEach(stage => {
    const stagePrinciples = config.principles.filter(p => p.stage === stage.id);
    const questions = [];
    
    stagePrinciples.forEach(principle => {
      if (principle.quiz) {
        questions.push({
          id: `q_${principle.id}`,
          principle_id: principle.id,
          question: principle.quiz.question,
          correct_answer: principle.quiz.correct_answer,
          wrong_answers: principle.quiz.wrong_answers || [],
          difficulty: 'basic',
          explanation: `关于${principle.name}的概念理解`
        });
      }
    });
    
    if (questions.length > 0) {
      modules[stage.id] = {
        name: stage.title,
        icon: stage.icon,
        questions: questions
      };
    }
  });
  
  return { modules };
}

// 提取学习建议
function extractSuggestions(config) {
  return {
    version: config.metadata?.version || '4.0.0',
    score_ranges: config.suggestions?.score_ranges || [],
    stage_guidance: config.suggestions?.stage_guidance || [],
    general: config.suggestions?.general || {},
    resources: config.suggestions?.resources || {}
  };
}

// 主转换函数
function convertTOMLToJSONShards(tomlPath, outputDir) {
  console.log(`📁 读取TOML配置: ${tomlPath}`);
  
  if (!fs.existsSync(tomlPath)) {
    throw new Error(`TOML文件不存在: ${tomlPath}`);
  }
  
  const content = fs.readFileSync(tomlPath, 'utf8');
  const config = parseTomlForCSS(content);
  
  // 调试信息
  console.log(`🔍 解析结果: stages=${config.stages?.length}, principles=${config.principles?.length}`);
  if (config.principles?.length > 0) {
    const firstPrinciple = config.principles[0];
    console.log(`   第一个principle: ${firstPrinciple.id} (stage: ${firstPrinciple.stage})`);
  }
  
  console.log(`🔄 开始转换为分片JSON...`);
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 定义分片映射
  const moduleShards = {
    'w3sc8_principles-core.json': filterByStage(config, 'core-cognition'),
    'w3sc8_principles-3c.json': filterByStage(config, '3c-assets'), 
    'w3sc8_principles-marketing.json': filterByStage(config, 'precise-marketing'),
    'w3sc8_principles-funding.json': filterByStage(config, 'fundraising'),
    'w3sc8_principles-cases.json': filterByStage(config, 'case-studies'),
    'w3sc8_quiz-data.json': extractQuizData(config),
    'w3sc8_suggestions.json': extractSuggestions(config)
  };
  
  // 写入分片文件
  let totalSize = 0;
  Object.entries(moduleShards).forEach(([filename, data]) => {
    const filePath = path.join(outputDir, filename);
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonContent);
    
    const fileSize = jsonContent.length;
    totalSize += fileSize;
    
    console.log(`✅ ${filename} (${Math.round(fileSize/1024*100)/100} KB)`);
  });
  
  console.log(`📊 总计生成: ${Object.keys(moduleShards).length}个文件, ${Math.round(totalSize/1024*100)/100} KB`);
  
  // 验证生成的文件
  const missingFiles = Object.keys(moduleShards).filter(filename => {
    const filePath = path.join(outputDir, filename);
    return !fs.existsSync(filePath);
  });
  
  if (missingFiles.length > 0) {
    throw new Error(`文件生成失败: ${missingFiles.join(', ')}`);
  }
  
  // 生成索引文件（可选）
  const indexData = {
    version: config.metadata?.version || '4.0.0',
    generated_at: new Date().toISOString(),
    files: Object.keys(moduleShards),
    total_size_kb: Math.round(totalSize/1024*100)/100,
    modules: config.stages?.map(stage => ({
      id: stage.id,
      name: stage.title,
      icon: stage.icon,
      file: `w3sc8_principles-${stage.id.replace('core-cognition', 'core').replace('3c-assets', '3c').replace('precise-marketing', 'marketing').replace('case-studies', 'cases')}.json`
    })) || []
  };
  
  const indexPath = path.join(outputDir, 'w3sc8_index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
  console.log(`📑 索引文件: w3sc8_index.json`);
  
  return true;
}

// 命令行调用
if (require.main === module) {
  const tomlPath = process.argv[2];
  const outputDir = process.argv[3];
  
  if (!tomlPath || !outputDir) {
    console.error('用法: node toml-to-json.js <input.toml> <output-dir>');
    process.exit(1);
  }
  
  try {
    convertTOMLToJSONShards(tomlPath, outputDir);
    console.log('🎉 TOML到JSON转换完成！');
  } catch (error) {
    console.error(`❌ 转换失败: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { convertTOMLToJSONShards };