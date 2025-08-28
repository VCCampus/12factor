#!/usr/bin/env node
/**
 * TOML配置验证工具
 * 用途：验证web3scv8_v4.toml配置文件的格式和完备性
 * 作者：Claude Code
 * 日期：2025-08-28
 */

const fs = require('fs');
const path = require('path');

// 简单的TOML解析器（避免外部依赖）
function parseSimpleTOML(content) {
  const lines = content.split('\n');
  const result = {};
  let currentSection = result;
  let currentPath = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 跳过空行和注释
    if (!line || line.startsWith('#')) continue;
    
    // 处理section headers
    if (line.startsWith('[') && line.endsWith(']')) {
      const sectionName = line.slice(1, -1);
      
      if (sectionName.startsWith('[') && sectionName.endsWith(']]')) {
        // Array of tables [[section]]
        const arrayName = sectionName.slice(1, -1);
        if (!result[arrayName]) result[arrayName] = [];
        const newObj = {};
        result[arrayName].push(newObj);
        currentSection = newObj;
        currentPath = [arrayName, result[arrayName].length - 1];
      } else {
        // Regular section [section]
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
    
    // 处理key-value pairs
    const equalIndex = line.indexOf('=');
    if (equalIndex > 0) {
      const key = line.substring(0, equalIndex).trim();
      const value = line.substring(equalIndex + 1).trim();
      
      // 简单值解析
      let parsedValue = value;
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
      
      currentSection[key] = parsedValue;
    }
  }
  
  return result;
}

// 验证函数
function validateConfig(configPath) {
  console.log(`🔍 验证配置文件: ${configPath}`);
  
  // 检查文件是否存在
  if (!fs.existsSync(configPath)) {
    console.error(`❌ 配置文件不存在: ${configPath}`);
    return false;
  }
  
  let config;
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    config = parseSimpleTOML(content);
  } catch (error) {
    console.error(`❌ TOML解析失败: ${error.message}`);
    return false;
  }
  
  console.log('✅ TOML语法解析成功');
  
  // 验证必需字段
  const validationRules = [
    {
      name: '元数据',
      check: () => config.metadata && config.metadata.version && config.metadata.supported_locales,
      error: '缺少metadata.version或metadata.supported_locales'
    },
    {
      name: '阶段定义',
      check: () => config.stages && Array.isArray(config.stages) && config.stages.length >= 5,
      error: '缺少stages数组或阶段数量少于5个'
    },
    {
      name: '原则定义', 
      check: () => config.principles && Array.isArray(config.principles) && config.principles.length >= 20,
      error: '缺少principles数组或原则数量少于20个'
    },
    {
      name: 'UI文本',
      check: () => config.ui && config.ui.common && config.ui.navigation,
      error: '缺少ui.common或ui.navigation配置'
    },
    {
      name: '功能配置',
      check: () => config.config && config.config.features,
      error: '缺少config.features配置'
    }
  ];
  
  let allValid = true;
  for (const rule of validationRules) {
    if (rule.check()) {
      console.log(`✅ ${rule.name}: 验证通过`);
    } else {
      console.error(`❌ ${rule.name}: ${rule.error}`);
      allValid = false;
    }
  }
  
  // 验证原则数据完整性
  if (config.principles && Array.isArray(config.principles)) {
    let principleErrors = 0;
    const requiredFields = ['id', 'name', 'concept', 'practices', 'antipatterns'];
    
    config.principles.forEach((principle, index) => {
      for (const field of requiredFields) {
        if (!principle[field]) {
          console.error(`❌ 原则${index + 1}缺少字段: ${field}`);
          principleErrors++;
        }
      }
    });
    
    if (principleErrors === 0) {
      console.log(`✅ 原则完整性: ${config.principles.length}个原则数据完整`);
    } else {
      console.error(`❌ 原则完整性: 发现${principleErrors}个字段缺失`);
      allValid = false;
    }
  }
  
  // 验证阶段与原则的关联性
  if (config.stages && config.principles) {
    const stageIds = config.stages.map(s => s.id);
    const principleStages = config.principles.map(p => p.stage);
    const invalidStages = principleStages.filter(stage => !stageIds.includes(stage));
    
    if (invalidStages.length === 0) {
      console.log('✅ 阶段关联性: 所有原则都关联到有效阶段');
    } else {
      console.error(`❌ 阶段关联性: 发现无效阶段引用: ${[...new Set(invalidStages)].join(', ')}`);
      allValid = false;
    }
  }
  
  // 输出统计信息
  if (config.stages && config.principles) {
    console.log(`📊 配置统计:`);
    console.log(`  • 学习阶段: ${config.stages.length}个`);
    console.log(`  • 核心概念: ${config.principles.length}个`);
    console.log(`  • 支持语言: ${config.metadata?.supported_locales?.join(', ') || '未定义'}`);
    console.log(`  • 配置版本: ${config.metadata?.version || '未定义'}`);
  }
  
  if (allValid) {
    console.log('🎉 配置验证完全通过！');
    return true;
  } else {
    console.log('💥 配置验证失败，请修复上述错误');
    return false;
  }
}

// 命令行调用
if (require.main === module) {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error('用法: node validate-config.js <config.toml>');
    process.exit(1);
  }
  
  const isValid = validateConfig(configPath);
  process.exit(isValid ? 0 : 1);
}

module.exports = { validateConfig };