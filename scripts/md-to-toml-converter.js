#!/usr/bin/env node
/**
 * Markdown到TOML转换器 - 专用于8原则数据转换
 * 用途：将250905-8原则.md转换为结构化TOML格式
 * 作者：Claude Code  
 * 日期：2025-01-09
 * 项目：12factor Issue #29
 */

const fs = require('fs');
const path = require('path');

/**
 * 解析8原则Markdown结构
 */
function parsePrinciplesMarkdown(content) {
  const lines = content.split('\n');
  const principles = [];
  let currentPrinciple = null;
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 检测原则标题 ## 原则 N：标题
    const principleMatch = line.match(/^## 原则 (\d+)：(.+)$/);
    if (principleMatch) {
      if (currentPrinciple) {
        principles.push(currentPrinciple);
      }

      currentPrinciple = {
        id: `principle_${principleMatch[1]}`,
        order: parseInt(principleMatch[1]),
        name: principleMatch[2].trim(),
        assertion: '',
        concept: '',
        practices: [],
        antipatterns: []
      };
      currentSection = null;
      continue;
    }

    if (!currentPrinciple || !line) continue;

    // 解析各个小节
    if (line.startsWith('- 断言：')) {
      currentPrinciple.assertion = line.replace('- 断言：', '').trim();
      currentSection = 'assertion';
    }
    else if (line.startsWith('- 概念：')) {
      currentPrinciple.concept = line.replace('- 概念：', '').trim();
      currentSection = 'concept';
    }
    else if (line.startsWith('- 推荐：')) {
      currentSection = 'practices';
    }
    else if (line.startsWith('- 反面：')) {
      const antipattern = line.replace('- 反面：', '').trim();
      if (antipattern) {
        currentPrinciple.antipatterns.push(antipattern);
      }
      currentSection = 'antipatterns';
    }
    // 解析推荐项目 (格式: "1. 内容")
    else if (currentSection === 'practices' && line.match(/^\d+\.\s+(.+)$/)) {
      const practice = line.replace(/^\d+\.\s+/, '').trim();
      currentPrinciple.practices.push(practice);
    }
    // 解析反面教训（直接跟在"- 反面："后面）
    else if (currentSection === 'antipatterns' && line && !line.startsWith('-') && !line.startsWith('  ')) {
      currentPrinciple.antipatterns.push(line);
      currentSection = null; // 反面通常是单行，处理完就结束
    }
  }

  // 添加最后一个原则
  if (currentPrinciple) {
    principles.push(currentPrinciple);
  }

  return principles;
}

/**
 * 生成TOML格式内容
 */
function generateTOML(principles) {
  let tomlContent = `# 新时代个人成长与创业8原则 - 主要原则数据
# 转换时间: ${new Date().toISOString()}
# 来源: docs/research/250905-8原则.md
# 用途: Growth系统原则数据源

[metadata]
title = "新时代个人成长与创业8原则"
version = "1.0"
total_principles = ${principles.length}
generated_at = "${new Date().toISOString()}"
source_file = "250905-8原则.md"

`;

  // 生成原则数据
  principles.forEach(principle => {
    tomlContent += `
[[principles]]
id = "${principle.id}"
order = ${principle.order}
name = "${principle.name}"
assertion = "${principle.assertion}"
concept = "${principle.concept}"
practices = [
`;
    
    principle.practices.forEach(practice => {
      tomlContent += `    "${practice.replace(/"/g, '\\"')}",\n`;
    });
    
    tomlContent += `]
antipatterns = [
`;
    
    principle.antipatterns.forEach(antipattern => {
      tomlContent += `    "${antipattern.replace(/"/g, '\\"')}",\n`;
    });
    
    tomlContent += `]
`;
  });

  return tomlContent;
}

/**
 * 主转换函数
 */
function convertMDToTOML(mdPath, outputPath) {
  console.log(`🚀 开始转换MD到TOML: ${mdPath}`);

  if (!fs.existsSync(mdPath)) {
    throw new Error(`Markdown文件不存在: ${mdPath}`);
  }

  // 读取并解析Markdown
  const content = fs.readFileSync(mdPath, 'utf8');
  const principles = parsePrinciplesMarkdown(content);

  console.log(`📖 解析到 ${principles.length} 个原则:`);
  principles.forEach(p => {
    console.log(`   - 原则${p.order}: ${p.name}`);
    console.log(`     推荐项目: ${p.practices.length}个`);
    console.log(`     反面教训: ${p.antipatterns.length}个`);
  });

  // 生成TOML内容
  const tomlContent = generateTOML(principles);

  // 确保输出目录存在
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 写入TOML文件
  fs.writeFileSync(outputPath, tomlContent, 'utf8');
  
  const fileSize = tomlContent.length;
  console.log(`✅ TOML文件已生成: ${outputPath}`);
  console.log(`📊 文件大小: ${Math.round(fileSize / 1024 * 100) / 100} KB`);

  return {
    principles_count: principles.length,
    file_size: fileSize,
    output_path: outputPath
  };
}

// 命令行调用
if (require.main === module) {
  const mdPath = process.argv[2];
  const outputPath = process.argv[3];

  if (!mdPath || !outputPath) {
    console.error('用法: node md-to-toml-converter.js <input.md> <output.toml>');
    console.error('例子: node md-to-toml-converter.js docs/research/250905-8原则.md docs/plans/8principles-main.toml');
    process.exit(1);
  }

  try {
    const result = convertMDToTOML(mdPath, outputPath);
    console.log('🎉 MD到TOML转换成功完成！');
  } catch (error) {
    console.error(`❌ 转换失败: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { convertMDToTOML };