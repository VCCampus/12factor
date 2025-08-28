const fs = require('fs');

// 导入转换器
const { parseSimpleTOML } = require('./scripts/toml-to-json.js');

const content = fs.readFileSync('./docs/plans/web3scv8_v4.toml', 'utf8');

console.log('开始解析TOML...');
const config = parseSimpleTOML(content);

console.log('\n=== 解析结果 ===');
console.log('config.metadata:', config.metadata?.version);
console.log('config.stages 数量:', config.stages?.length);
console.log('config.principles 数量:', config.principles?.length);

if (config.stages?.length > 0) {
  console.log('\n前两个stages:');
  config.stages.slice(0, 2).forEach(stage => {
    console.log(`  ${stage.id}: ${stage.title} (${stage.icon})`);
  });
}

if (config.principles?.length > 0) {
  console.log('\n前三个principles:');
  config.principles.slice(0, 3).forEach(principle => {
    console.log(`  ${principle.id}: ${principle.name} (stage: ${principle.stage})`);
  });
  
  // 按阶段统计
  const stageStats = {};
  config.principles.forEach(p => {
    stageStats[p.stage] = (stageStats[p.stage] || 0) + 1;
  });
  console.log('\n按阶段统计:');
  Object.entries(stageStats).forEach(([stage, count]) => {
    console.log(`  ${stage}: ${count} principles`);
  });
}

console.log('\n=== 测试filterByStage函数 ===');
// 测试按阶段过滤
function filterByStage(config, stageId) {
  const stage = config.stages?.find(s => s.id === stageId);
  const principles = config.principles?.filter(p => p.stage === stageId) || [];
  
  console.log(`filterByStage('${stageId}'):`);
  console.log(`  找到stage:`, stage ? `${stage.title} (${stage.icon})` : 'None');
  console.log(`  找到principles:`, principles.length);
  
  return {
    module_id: stageId,
    module_name: stage?.title || stageId,
    icon: stage?.icon || '📚',
    description: stage?.description || '',
    principles: principles
  };
}

const coreResult = filterByStage(config, 'core-cognition');
console.log('\ncore-cognition结果:', JSON.stringify(coreResult, null, 2));