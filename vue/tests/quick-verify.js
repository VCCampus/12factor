#!/usr/bin/env node

// 快速验证脚本 - 测试生产环境部署
const PRODUCTION_URL = 'http://web3mh.101.so:11181/';

async function verifyDeployment() {
  console.log('🔍 开始验证部署...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    url: PRODUCTION_URL,
    tests: []
  };
  
  try {
    // 测试首页访问
    console.log('✓ 测试首页访问...');
    const response = await fetch(PRODUCTION_URL);
    results.tests.push({
      name: '首页加载',
      status: response.ok ? '✅ 成功' : '❌ 失败',
      code: response.status
    });
    
    // 测试静态资源
    console.log('✓ 测试静态资源...');
    const manifestRes = await fetch(PRODUCTION_URL + 'manifest.json');
    results.tests.push({
      name: 'Manifest.json',
      status: manifestRes.ok ? '✅ 成功' : '❌ 失败',
      code: manifestRes.status
    });
    
    const swRes = await fetch(PRODUCTION_URL + 'sw.js');
    results.tests.push({
      name: 'Service Worker',
      status: swRes.ok ? '✅ 成功' : '❌ 失败',
      code: swRes.status
    });
    
    // 测试数据文件
    console.log('✓ 测试数据文件...');
    const dataRes = await fetch(PRODUCTION_URL + 'data/w3sc8_index.json');
    results.tests.push({
      name: '数据文件',
      status: dataRes.ok ? '✅ 成功' : '❌ 失败',
      code: dataRes.status
    });
    
    // 生成报告
    console.log('\n' + '='.repeat(50));
    console.log('📊 部署验证报告');
    console.log('='.repeat(50));
    console.log(`🔗 URL: ${PRODUCTION_URL}`);
    console.log(`📅 时间: ${new Date().toLocaleString('zh-CN')}`);
    console.log('\n测试结果:');
    
    let allPassed = true;
    results.tests.forEach(test => {
      console.log(`  ${test.status} ${test.name} (HTTP ${test.code})`);
      if (!test.status.includes('✅')) allPassed = false;
    });
    
    console.log('\n总体状态:', allPassed ? '✅ 部署成功！' : '❌ 部署存在问题');
    console.log('='.repeat(50));
    
    return results;
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
    results.error = error.message;
    return results;
  }
}

// 运行验证
verifyDeployment().then(results => {
  // 保存结果到文件
  const fs = require('fs');
  fs.writeFileSync(
    'tests/deployment-report.json', 
    JSON.stringify(results, null, 2)
  );
  console.log('\n📁 报告已保存到 tests/deployment-report.json');
}).catch(console.error);