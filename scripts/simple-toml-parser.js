// 超简单但可靠的TOML解析器
function parseTomlForCSS(content) {
  const lines = content.split('\n');
  const result = {
    metadata: {},
    stages: [],
    principles: [],
    ui: {}
  };
  
  let currentSection = null;
  let currentObject = null;
  let currentArrayName = null;
  let inMultilineArray = false;
  let arrayBuffer = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // 跳过空行和注释
    if (!line || line.startsWith('#')) continue;
    
    // 处理多行数组
    if (inMultilineArray) {
      if (line.endsWith(']')) {
        if (line !== ']') {
          arrayBuffer.push(line.slice(0, -1).trim().replace(/^"/, '').replace(/"$/, ''));
        }
        // 结束多行数组
        if (currentObject && currentArrayName) {
          if (currentArrayName.includes('.')) {
            const keys = currentArrayName.split('.');
            let target = currentObject;
            for (let j = 0; j < keys.length - 1; j++) {
              if (!target[keys[j]]) target[keys[j]] = {};
              target = target[keys[j]];
            }
            target[keys[keys.length - 1]] = arrayBuffer;
          } else {
            currentObject[currentArrayName] = arrayBuffer;
          }
        }
        inMultilineArray = false;
        currentArrayName = null;
        arrayBuffer = [];
      } else {
        // 继续收集数组内容
        arrayBuffer.push(line.replace(/^"/, '').replace(/"$/, '').replace(/,$/, ''));
      }
      continue;
    }
    
    // 处理section headers
    if (line.startsWith('[') && line.endsWith(']')) {
      let sectionName = line.slice(1, -1);
      
      if (line.startsWith('[[') && line.endsWith(']]')) {
        // Array of tables like [[principles]]
        // 对于[[stages]]，sectionName是[stages]，需要再次处理
        sectionName = sectionName.slice(1, -1); // 去掉内层的[]
        if (sectionName === 'principles') {
          currentObject = {};
          result.principles.push(currentObject);
          currentSection = 'principles';
        } else if (sectionName === 'stages') {
          currentObject = {};
          result.stages.push(currentObject);
          currentSection = 'stages';
        } else {
          // Other arrays, we'll skip for now
          currentSection = null;
          currentObject = null;
        }
      } else {
        // Regular sections like [metadata]
        if (sectionName === 'metadata') {
          currentSection = 'metadata';
          currentObject = result.metadata;
        } else if (sectionName.startsWith('ui.')) {
          const uiParts = sectionName.split('.');
          let target = result.ui;
          for (let j = 1; j < uiParts.length; j++) {
            if (!target[uiParts[j]]) target[uiParts[j]] = {};
            if (j === uiParts.length - 1) {
              currentObject = target[uiParts[j]];
            } else {
              target = target[uiParts[j]];
            }
          }
          currentSection = 'ui';
        } else {
          currentSection = null;
          currentObject = null;
        }
      }
      continue;
    }
    
    // 处理key=value pairs
    const equalIndex = line.indexOf('=');
    if (equalIndex > 0 && currentObject) {
      const key = line.substring(0, equalIndex).trim();
      const value = line.substring(equalIndex + 1).trim();
      
      let parsedValue;
      
      // 检查是否是多行数组开始
      if (value === '[') {
        inMultilineArray = true;
        currentArrayName = key;
        arrayBuffer = [];
        continue;
      }
      
      // 解析不同类型的值
      if (value.startsWith('"') && value.endsWith('"')) {
        parsedValue = value.slice(1, -1);
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // 单行数组
        const arrayContent = value.slice(1, -1);
        if (arrayContent.trim()) {
          parsedValue = arrayContent.split(',').map(v => v.trim().replace(/^"/, '').replace(/"$/, ''));
        } else {
          parsedValue = [];
        }
      } else if (value === 'true') {
        parsedValue = true;
      } else if (value === 'false') {
        parsedValue = false;
      } else if (!isNaN(value) && value !== '') {
        parsedValue = Number(value);
      } else {
        parsedValue = value;
      }
      
      // 处理嵌套键 (如 flashcard.front)
      if (key.includes('.')) {
        const keys = key.split('.');
        let target = currentObject;
        for (let j = 0; j < keys.length - 1; j++) {
          if (!target[keys[j]]) target[keys[j]] = {};
          target = target[keys[j]];
        }
        target[keys[keys.length - 1]] = parsedValue;
      } else {
        currentObject[key] = parsedValue;
      }
    }
  }
  
  return result;
}

module.exports = { parseTomlForCSS };