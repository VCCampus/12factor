#!/usr/bin/env node
/**
 * TOML配置验证工具 - 使用新解析器
 * 用途：验证web3scv8_v4.toml配置文件的格式和完备性
 * 作者：Claude Code
 * 日期：2025-08-28
 */

const fs = require('fs');
const path = require('path');
const { parseTomlForCSS } = require('./simple-toml-parser');

// 验证配置完整性
function validateConfig(configPath) {
  console.log(`🔍 验证配置文件: ${configPath}`);
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`配置文件不存在: ${configPath}`);
  }
  
  const content = fs.readFileSync(configPath, 'utf8');
  
  // 解析TOML
  let config;
  try {
    config = parseTomlForCSS(content);
    console.log('✅ TOML语法解析成功');
  } catch (error) {
    console.error('❌ TOML语法错误:', error.message);
    return false;
  }
  
  // 验证规则
  const validationRules = [
    {
      name: '元数据',
      check: () => config.metadata && config.metadata.version && config.metadata.total_principles >= 20
    },
    {
      name: '阶段定义', 
      check: () => config.stages && Array.isArray(config.stages) && config.stages.length >= 5
    },
    {
      name: '原则定义',
      check: () => config.principles && Array.isArray(config.principles) && config.principles.length >= 20
    },
    {
      name: 'UI文本',
      check: () => config.ui && config.ui.common && config.ui.navigation
    },
    {
      name: '功能配置',
      check: () => {
        // 检查是否存在任何配置相关数据
        return config.deployment || config.assessment || config.metrics || Object.keys(config).length >= 4
      }
    }
  ];
  
  let allValid = true;
  for (const rule of validationRules) {
    try {
      if (rule.check()) {
        console.log(`✅ ${rule.name}: 验证通过`);
      } else {
        console.error(`❌ ${rule.name}: 验证失败`);
        allValid = false;
      }
    } catch (err) {
      console.error(`❌ ${rule.name}: ${err.message}`);
      allValid = false;
    }
  }
  
  // 统计信息
  if (config.stages && config.principles) {
    console.log('\n📊 配置统计:');
    console.log(`   阶段数量: ${config.stages.length}`);
    console.log(`   原则数量: ${config.principles.length}`);
    
    // 按阶段统计原则
    const stageStats = {};
    config.principles.forEach(p => {
      stageStats[p.stage] = (stageStats[p.stage] || 0) + 1;
    });
    
    console.log('   各阶段原则分布:');
    Object.entries(stageStats).forEach(([stage, count]) => {
      console.log(`     ${stage}: ${count}个`);
    });
  }
  
  if (!allValid) {
    console.error('\n💥 配置验证失败，请修复上述错误');
    return false;
  }
  
  console.log('\n🎉 配置验证全部通过！');
  return true;
}

// 命令行调用
if (require.main === module) {
  const configPath = process.argv[2] || 'docs/plans/web3scv8_v4.toml';
  
  try {
    const isValid = validateConfig(configPath);
    process.exit(isValid ? 0 : 1);
  } catch (error) {
    console.error(`💥 验证异常: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { validateConfig };