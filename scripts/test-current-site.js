const { chromium } = require('playwright');

async function testCurrentSite() {
  console.log('🔍 测试当前部署站点功能...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  const baseURL = 'http://web3mh.101.so:11181';
  const results = {
    pages: [],
    errors: [],
    features: []
  };
  
  try {
    // 测试首页
    console.log('🏠 测试首页...');
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    const homeTitle = await page.title();
    const homeLoaded = homeTitle.includes('CSS') || homeTitle.includes('数创');
    results.pages.push({
      name: '首页',
      url: baseURL,
      status: homeLoaded ? '✅' : '❌',
      title: homeTitle
    });
    
    // 检查导航元素
    const navElements = await page.$$eval('nav, [data-nav], .nav, .navigation', els => els.length);
    results.features.push({
      name: '导航栏',
      status: navElements > 0 ? '✅' : '❌',
      details: `发现 ${navElements} 个导航元素`
    });
    
    // 测试个人成长页面
    console.log('🌱 测试个人成长页面...');
    const growthLinks = await page.$$eval('a[href*="growth"], a[href*="principles"]', 
      links => links.map(l => l.href)
    );
    
    if (growthLinks.length > 0) {
      await page.goto(growthLinks[0]);
      await page.waitForLoadState('networkidle');
      
      const growthTitle = await page.title();
      results.pages.push({
        name: '个人成长',
        url: growthLinks[0],
        status: '✅',
        title: growthTitle
      });
      
      // 检查闪卡功能
      const flashcardElements = await page.$$eval('[class*="flashcard"], [data-flashcard]', els => els.length);
      results.features.push({
        name: '闪卡功能',
        status: flashcardElements > 0 ? '✅' : '❌',
        details: `发现 ${flashcardElements} 个闪卡元素`
      });
    }
    
    // 测试面试页面
    console.log('🎯 测试面试页面...');
    await page.goto(baseURL);
    const interviewLinks = await page.$$eval('a[href*="interview"], a[href*="mock"]', 
      links => links.map(l => l.href)
    );
    
    if (interviewLinks.length > 0) {
      await page.goto(interviewLinks[0]);
      await page.waitForLoadState('networkidle');
      
      const interviewTitle = await page.title();
      results.pages.push({
        name: '模拟面试',
        url: interviewLinks[0],
        status: '✅',
        title: interviewTitle
      });
    }
    
    // 检查数据加载
    console.log('📊 测试数据加载...');
    const dataRequests = [];
    page.on('response', response => {
      if (response.url().includes('.json')) {
        dataRequests.push({
          url: response.url(),
          status: response.status()
        });
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    results.features.push({
      name: 'JSON数据加载',
      status: dataRequests.length > 0 ? '✅' : '❌',
      details: `加载了 ${dataRequests.length} 个数据文件`
    });
    
    // 检查响应式设计
    console.log('📱 测试响应式设计...');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.waitForLoadState('networkidle');
    
    const mobileElements = await page.$$eval('[class*="mobile"], [data-mobile]', els => els.length);
    results.features.push({
      name: '移动端适配',
      status: mobileElements > 0 ? '✅' : '❌',
      details: `发现 ${mobileElements} 个移动端元素`
    });
    
    // 检查 Neobrutalism 样式
    console.log('🎨 测试 Neobrutalism 样式...');
    const neoElements = await page.$$eval('[class*="neo"], [style*="shadow"]', els => els.length);
    results.features.push({
      name: 'Neobrutalism 设计',
      status: neoElements > 0 ? '✅' : '❌',
      details: `发现 ${neoElements} 个neo样式元素`
    });
    
  } catch (error) {
    results.errors.push({
      message: error.message,
      stack: error.stack
    });
  } finally {
    await browser.close();
  }
  
  // 生成测试报告
  console.log('\n📊 测试报告');
  console.log('==================');
  
  console.log('\n📄 页面测试结果:');
  results.pages.forEach(page => {
    console.log(`${page.status} ${page.name}: ${page.title}`);
    console.log(`    URL: ${page.url}`);
  });
  
  console.log('\n⚡ 功能测试结果:');
  results.features.forEach(feature => {
    console.log(`${feature.status} ${feature.name}: ${feature.details}`);
  });
  
  if (results.errors.length > 0) {
    console.log('\n❌ 错误信息:');
    results.errors.forEach(error => {
      console.log(`   ${error.message}`);
    });
  }
  
  const successCount = [
    ...results.pages.filter(p => p.status === '✅'),
    ...results.features.filter(f => f.status === '✅')
  ].length;
  
  const totalCount = results.pages.length + results.features.length;
  const successRate = Math.round((successCount / totalCount) * 100);
  
  console.log(`\n🎯 总体成功率: ${successRate}% (${successCount}/${totalCount})`);
  
  return {
    success: results.errors.length === 0 && successRate >= 70,
    results,
    successRate
  };
}

// 如果直接运行此脚本
if (require.main === module) {
  testCurrentSite().then(result => {
    console.log('\n✨ 测试完成!');
    process.exit(result.success ? 0 : 1);
  }).catch(error => {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  });
}

module.exports = { testCurrentSite };