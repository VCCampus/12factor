const fs = require('fs');

const content = fs.readFileSync('./docs/plans/web3scv8_v4.toml', 'utf8');

// 简化的解析器用于调试
function debugParse(content) {
  const lines = content.split('\n');
  let principles = [];
  let stages = [];
  let currentPrinciple = null;
  let currentStage = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '[[principles]]') {
      if (currentPrinciple) principles.push(currentPrinciple);
      currentPrinciple = {};
      console.log(`发现新principle在行 ${i+1}`);
    } else if (line === '[[stages]]') {
      if (currentStage) stages.push(currentStage);
      currentStage = {};
      console.log(`发现新stage在行 ${i+1}`);
    } else if (line.includes('=') && (currentPrinciple || currentStage)) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      
      if (currentPrinciple && !line.startsWith('[')) {
        if (key.trim() === 'id') {
          currentPrinciple.id = value.replace(/"/g, '');
          console.log(`  principle.id = ${currentPrinciple.id}`);
        } else if (key.trim() === 'stage') {
          currentPrinciple.stage = value.replace(/"/g, '');
          console.log(`  principle.stage = ${currentPrinciple.stage}`);
        }
      }
      
      if (currentStage && !line.startsWith('[')) {
        if (key.trim() === 'id') {
          currentStage.id = value.replace(/"/g, '');
          console.log(`  stage.id = ${currentStage.id}`);
        }
      }
    }
  }
  
  if (currentPrinciple) principles.push(currentPrinciple);
  if (currentStage) stages.push(currentStage);
  
  return { principles, stages };
}

const result = debugParse(content);
console.log(`\n=== 总结 ===`);
console.log(`stages: ${result.stages.length}`);
console.log(`principles: ${result.principles.length}`);
console.log('前3个principles:', result.principles.slice(0, 3));