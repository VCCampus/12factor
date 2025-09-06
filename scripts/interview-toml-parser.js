/**
 * Simple TOML parser for interview question files
 */

function parseInterviewToml(content) {
  const lines = content.split('\n');
  const result = {
    metadata: {},
    questions: []
  };
  
  let currentQuestion = null;
  let inMetadata = false;
  let inQuestion = false;
  let currentKey = '';
  let multilineArray = [];
  let inMultilineArray = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    
    // Metadata section
    if (trimmed === '[metadata]') {
      inMetadata = true;
      inQuestion = false;
      continue;
    }
    
    // Question section
    if (trimmed === '[[questions]]') {
      if (currentQuestion) {
        result.questions.push(currentQuestion);
      }
      currentQuestion = {};
      inQuestion = true;
      inMetadata = false;
      continue;
    }
    
    // Handle multiline arrays
    if (inMultilineArray) {
      if (trimmed.endsWith(']')) {
        // End of multiline array
        const lastItem = trimmed.slice(0, -1).trim();
        if (lastItem && lastItem !== ']') {
          const cleanItem = lastItem.replace(/^["']|["'],?$/g, '').trim();
          if (cleanItem) multilineArray.push(cleanItem);
        }
        
        if (currentQuestion) {
          currentQuestion[currentKey] = multilineArray;
        }
        multilineArray = [];
        inMultilineArray = false;
        currentKey = '';
      } else {
        // Middle of multiline array
        const cleanItem = trimmed.replace(/^["']|["'],?$/g, '').trim();
        if (cleanItem) multilineArray.push(cleanItem);
      }
      continue;
    }
    
    // Parse key-value pairs
    if (trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const keyTrimmed = key.trim();
      const value = valueParts.join('=').trim();
      
      // Check if this starts a multiline array
      if (value === '[') {
        currentKey = keyTrimmed;
        inMultilineArray = true;
        multilineArray = [];
        continue;
      }
      
      // Parse the value
      let parsedValue = value;
      
      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        parsedValue = arrayContent.split(',').map(item => 
          item.trim().replace(/^["']|["']$/g, '')
        ).filter(item => item);
      }
      // Handle strings
      else if (value.startsWith('"') && value.endsWith('"')) {
        parsedValue = value.slice(1, -1);
      }
      // Handle numbers
      else if (!isNaN(value)) {
        parsedValue = Number(value);
      }
      // Handle booleans
      else if (value === 'true' || value === 'false') {
        parsedValue = value === 'true';
      }
      
      // Add to appropriate section
      if (inMetadata) {
        result.metadata[keyTrimmed] = parsedValue;
      } else if (inQuestion && currentQuestion) {
        currentQuestion[keyTrimmed] = parsedValue;
      }
    }
  }
  
  // Add last question if exists
  if (currentQuestion) {
    result.questions.push(currentQuestion);
  }
  
  return result;
}

module.exports = { parseInterviewToml };