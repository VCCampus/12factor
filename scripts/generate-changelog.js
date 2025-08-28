#!/usr/bin/env node
/**
 * 变更日志生成工具
 * 用途：对比TOML配置文件变化，生成详细变更日志
 * 作者：Claude Code
 * 日期：2025-08-28
 */

const fs = require('fs');
const path = require('path');

// 简单的TOML解析器（复用）
function parseSimpleTOML(content) {
  const lines = content.split('\n');
  const result = {};
  let currentSection = result;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line || line.startsWith('#')) continue;
    
    if (line.startsWith('[') && line.endsWith(']')) {
      const sectionName = line.slice(1, -1);
      
      if (sectionName.startsWith('[') && sectionName.endsWith(']]')) {
        const arrayName = sectionName.slice(1, -1);
        if (!result[arrayName]) result[arrayName] = [];
        const newObj = {};
        result[arrayName].push(newObj);
        currentSection = newObj;
      } else {
        const parts = sectionName.split('.');
        let target = result;
        for (let j = 0; j < parts.length; j++) {
          if (!target[parts[j]]) target[parts[j]] = {};
          if (j === parts.length - 1) currentSection = target[parts[j]];
          else target = target[parts[j]];
        }
      }
      continue;
    }
    
    const equalIndex = line.indexOf('=');
    if (equalIndex > 0) {
      const key = line.substring(0, equalIndex).trim();
      const value = line.substring(equalIndex + 1).trim();
      
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

// 深度对比两个对象
function deepCompare(obj1, obj2, path = '') {
  const changes = [];
  
  // 获取所有唯一的键
  const allKeys = new Set([
    ...Object.keys(obj1 || {}),
    ...Object.keys(obj2 || {})
  ]);
  
  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const val1 = obj1?.[key];
    const val2 = obj2?.[key];
    
    if (val1 === undefined && val2 !== undefined) {
      changes.push({ type: 'added', path: currentPath, value: val2 });
    } else if (val1 !== undefined && val2 === undefined) {
      changes.push({ type: 'removed', path: currentPath, value: val1 });
    } else if (Array.isArray(val1) && Array.isArray(val2)) {
      // 数组对比
      if (val1.length !== val2.length) {
        changes.push({ 
          type: 'modified', 
          path: currentPath, 
          oldValue: `数组长度: ${val1.length}`, 
          newValue: `数组长度: ${val2.length}` 
        });
      }
      
      // 对比数组元素（简化处理）
      const maxLen = Math.max(val1.length, val2.length);
      for (let i = 0; i < maxLen; i++) {
        if (i >= val1.length) {
          changes.push({ type: 'added', path: `${currentPath}[${i}]`, value: val2[i] });
        } else if (i >= val2.length) {
          changes.push({ type: 'removed', path: `${currentPath}[${i}]`, value: val1[i] });
        } else if (typeof val1[i] === 'object' && typeof val2[i] === 'object') {
          changes.push(...deepCompare(val1[i], val2[i], `${currentPath}[${i}]`));
        } else if (val1[i] !== val2[i]) {
          changes.push({ 
            type: 'modified', 
            path: `${currentPath}[${i}]`, 
            oldValue: val1[i], 
            newValue: val2[i] 
          });
        }
      }
    } else if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
      // 对象对比
      changes.push(...deepCompare(val1, val2, currentPath));
    } else if (val1 !== val2) {
      changes.push({ 
        type: 'modified', 
        path: currentPath, 
        oldValue: val1, 
        newValue: val2 
      });
    }
  }
  
  return changes;
}

// 生成变更日志
function generateChangelog(newConfigPath, oldConfigPath = null) {
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  console.log(`📝 CSS数创网站配置变更日志`);
  console.log(`生成时间: ${timestamp}`);
  console.log(`新配置文件: ${newConfigPath}`);
  
  if (!fs.existsSync(newConfigPath)) {
    console.log('❌ 新配置文件不存在');
    return;
  }
  
  const newContent = fs.readFileSync(newConfigPath, 'utf8');
  const newConfig = parseSimpleTOML(newContent);
  
  if (!oldConfigPath || !fs.existsSync(oldConfigPath)) {
    console.log('📄 旧配置文件不存在，生成初始配置摘要：\n');
    
    // 生成初始配置摘要
    console.log(`## 配置摘要`);
    console.log(`- 版本: ${newConfig.metadata?.version || '未定义'}`);
    console.log(`- 支持语言: ${newConfig.metadata?.supported_locales?.join(', ') || '未定义'}`);
    console.log(`- 学习阶段: ${newConfig.stages?.length || 0}个`);
    console.log(`- 核心概念: ${newConfig.principles?.length || 0}个`);
    console.log(`- 内容类型: ${newConfig.metadata?.content_types?.join(', ') || '未定义'}`);
    
    if (newConfig.stages) {
      console.log(`\n## 学习阶段详情`);
      newConfig.stages.forEach((stage, index) => {
        const stageCount = newConfig.principles?.filter(p => p.stage === stage.id).length || 0;
        console.log(`${index + 1}. ${stage.icon} ${stage.title} (${stageCount}个概念)`);
      });
    }
    
    console.log(`\n## 功能特性`);
    if (newConfig.config?.features) {
      Object.entries(newConfig.config.features).forEach(([key, value]) => {
        const status = value ? '✅' : '❌';
        console.log(`- ${key}: ${status}`);
      });
    }
    
    return;
  }
  
  const oldContent = fs.readFileSync(oldConfigPath, 'utf8');
  const oldConfig = parseSimpleTOML(oldContent);
  
  console.log(`旧配置文件: ${oldConfigPath}\n`);
  
  // 对比配置
  const changes = deepCompare(oldConfig, newConfig);
  
  if (changes.length === 0) {
    console.log('✨ 配置无变化');
    return;
  }
  
  console.log(`## 变更摘要`);
  console.log(`总计变更: ${changes.length}项\n`);
  
  // 按类型分组变更
  const changesByType = {
    added: changes.filter(c => c.type === 'added'),
    removed: changes.filter(c => c.type === 'removed'), 
    modified: changes.filter(c => c.type === 'modified')
  };
  
  // 新增项
  if (changesByType.added.length > 0) {
    console.log(`## ➕ 新增项 (${changesByType.added.length})`);
    changesByType.added.forEach(change => {
      console.log(`- ${change.path}: ${JSON.stringify(change.value)}`);
    });
    console.log('');
  }
  
  // 删除项
  if (changesByType.removed.length > 0) {
    console.log(`## ➖ 删除项 (${changesByType.removed.length})`);
    changesByType.removed.forEach(change => {
      console.log(`- ${change.path}: ${JSON.stringify(change.value)}`);
    });
    console.log('');
  }
  
  // 修改项
  if (changesByType.modified.length > 0) {
    console.log(`## 🔄 修改项 (${changesByType.modified.length})`);
    changesByType.modified.forEach(change => {
      console.log(`- ${change.path}:`);
      console.log(`  旧值: ${JSON.stringify(change.oldValue)}`);
      console.log(`  新值: ${JSON.stringify(change.newValue)}`);
    });
    console.log('');
  }
  
  // 影响分析
  console.log(`## 📊 影响分析`);
  
  const versionChanged = changes.some(c => c.path.includes('version'));
  const principlesChanged = changes.some(c => c.path.includes('principles'));
  const stagesChanged = changes.some(c => c.path.includes('stages'));
  const featuresChanged = changes.some(c => c.path.includes('features'));
  
  if (versionChanged) console.log('- 🔢 版本更新：需要更新客户端缓存');
  if (principlesChanged) console.log('- 📚 原则变更：影响学习内容和测试题');
  if (stagesChanged) console.log('- 🎯 阶段调整：影响学习路径和导航');
  if (featuresChanged) console.log('- ⚙️ 功能变更：可能影响用户体验');
  
  console.log(`\n## 🚀 构建建议`);
  console.log('- 建议执行完整构建流程');
  console.log('- 清理旧的缓存和构建产物');  
  console.log('- 测试所有受影响的功能模块');
  console.log('- 验证PWA缓存更新正常');
  
  console.log(`\n---`);
  console.log(`变更日志生成完成 | ${timestamp}`);
}

// 命令行调用
if (require.main === module) {
  const newConfigPath = process.argv[2];
  const oldConfigPath = process.argv[3];
  
  if (!newConfigPath) {
    console.error('用法: node generate-changelog.js <new-config.toml> [old-config.toml]');
    process.exit(1);
  }
  
  generateChangelog(newConfigPath, oldConfigPath);
}

module.exports = { generateChangelog };