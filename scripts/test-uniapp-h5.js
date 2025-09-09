const { chromium } = require('playwright');

async function testUniAppH5() {
  console.log('🧪 测试uni-app H5版本功能...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (compatible; UnittestUA)'
  });
  const page = await context.newPage();
  
  const baseURL = 'http://web3mh.101.so:11181';
  const results = {
    pages: [],
    features: [],
    errors: [],
    neobrutalism: [],
    navigation: []
  };
  
  try {
    // 测试首页
    console.log('🏠 测试首页加载...');
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    const homeTitle = await page.title();
    const homeContent = await page.textContent('body');
    const hasTitle = homeContent.includes('CSS数创班8期') || homeTitle.includes('CSS');
    
    results.pages.push({
      name: '首页',
      url: baseURL,
      status: hasTitle ? '✅' : '❌',
      title: homeTitle,
      hasContent: hasTitle
    });
    
    // 检测uni-app迁移特征
    console.log('🔍 检测uni-app迁移特征...');
    const uniAppIndicators = await page.evaluate(() => {
      return {
        hasUniAppText: document.body.textContent.includes('uni-app'),
        hasMigrationText: document.body.textContent.includes('迁移'),
        hasNeoBrutalism: document.body.textContent.includes('Neobrutalism'),
        hasModules: document.body.textContent.includes('功能模块')
      };
    });
    
    results.features.push({
      name: 'uni-app迁移标识',
      status: uniAppIndicators.hasUniAppText ? '✅' : '❌',
      details: `包含uni-app文本: ${uniAppIndicators.hasUniAppText}`
    });
    
    results.features.push({
      name: 'Neobrutalism设计系统',
      status: uniAppIndicators.hasNeoBrutalism ? '✅' : '❌',
      details: `包含设计系统说明: ${uniAppIndicators.hasNeoBrutalism}`
    });
    
    // 检查导航功能
    console.log('🧭 测试导航功能...');
    const navLinks = await page.$$eval('nav a, .nav-link', links => 
      links.map(link => ({
        text: link.textContent,
        href: link.href,
        visible: link.offsetWidth > 0 && link.offsetHeight > 0
      }))
    );
    
    results.navigation.push({
      name: '导航链接',
      status: navLinks.length > 0 ? '✅' : '❌',
      details: `发现 ${navLinks.length} 个导航链接`,
      links: navLinks
    });
    
    // 测试路由跳转 
    if (navLinks.length > 1) {
      console.log('🔗 测试路由跳转...');
      const principlesLink = navLinks.find(link => 
        link.text.includes('成长') || link.text.includes('principles')
      );
      
      if (principlesLink) {
        await page.click(`a[href*="principles"]`);
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        
        const principlesContent = await page.textContent('body');
        const hasPrinciplesContent = principlesContent.includes('个人成长') || 
                                   principlesContent.includes('原则');
        
        results.pages.push({
          name: '个人成长原则',
          url: principlesLink.href,
          status: hasPrinciplesContent ? '✅' : '❌',
          hasContent: hasPrinciplesContent
        });
      }
    }
    
    // 检查Neobrutalism样式
    console.log('🎨 检查Neobrutalism样式...');
    const neoStyles = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="neo"], .neo-card, .neo-button');
      const computedStyles = [];
      
      elements.forEach((el, index) => {
        if (index < 5) { // 只检查前5个元素
          const style = window.getComputedStyle(el);
          computedStyles.push({
            className: el.className,
            hasBorder: style.border.includes('3px') || style.borderWidth === '3px',
            hasBoxShadow: style.boxShadow && style.boxShadow !== 'none',
            borderRadius: style.borderRadius
          });
        }
      });
      
      return {
        count: elements.length,
        styles: computedStyles
      };
    });
    
    results.neobrutalism.push({
      name: 'Neo样式元素',
      status: neoStyles.count > 0 ? '✅' : '❌',
      details: `发现 ${neoStyles.count} 个neo样式元素`
    });
    
    const hardBorders = neoStyles.styles.filter(s => s.hasBorder).length;
    const hardShadows = neoStyles.styles.filter(s => s.hasBoxShadow).length;
    
    results.neobrutalism.push({
      name: 'Neobrutalism特征',
      status: (hardBorders > 0 && hardShadows > 0) ? '✅' : '❌',
      details: `硬边框: ${hardBorders}, 硬阴影: ${hardShadows}`
    });
    
    // 测试响应式设计
    console.log('📱 测试响应式设计...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    const mobileNav = await page.$('.mobile-menu, .mobile-menu-btn, [class*="mobile"]');
    results.features.push({
      name: '移动端适配',
      status: mobileNav ? '✅' : '❌',
      details: `移动端导航元素: ${mobileNav ? '存在' : '不存在'}`
    });
    
    // 检查Vue 3特征
    console.log('⚡ 检查Vue 3特征...');
    const vueFeatures = await page.evaluate(() => {
      return {
        hasVueApp: !!document.querySelector('#app'),
        hasVueRouterLinks: document.querySelectorAll('a[href^="/"]').length > 0,
        hasModernJS: document.querySelectorAll('script[type="module"]').length > 0
      };
    });
    
    results.features.push({
      name: 'Vue 3架构',
      status: vueFeatures.hasVueApp ? '✅' : '❌',
      details: `Vue App容器: ${vueFeatures.hasVueApp}`
    });
    
    results.features.push({
      name: '现代JavaScript',
      status: vueFeatures.hasModernJS ? '✅' : '❌',
      details: `ES模块: ${vueFeatures.hasModernJS}`
    });
    
  } catch (error) {
    results.errors.push({
      message: error.message,
      stack: error.stack?.substring(0, 200)
    });
  } finally {
    await browser.close();
  }
  
  // 生成测试报告
  console.log('\n📊 uni-app H5版本测试报告');
  console.log('============================');
  
  console.log('\n📄 页面测试结果:');
  results.pages.forEach(page => {
    console.log(`${page.status} ${page.name}: ${page.title || '无标题'}`);
    console.log(`    URL: ${page.url}`);
    console.log(`    内容验证: ${page.hasContent ? '✅ 通过' : '❌ 失败'}`);
  });
  
  console.log('\n🧭 导航测试结果:');
  results.navigation.forEach(nav => {
    console.log(`${nav.status} ${nav.name}: ${nav.details}`);
  });
  
  console.log('\n🎨 Neobrutalism测试结果:');
  results.neobrutalism.forEach(neo => {
    console.log(`${neo.status} ${neo.name}: ${neo.details}`);
  });
  
  console.log('\n⚡ 功能特性测试结果:');
  results.features.forEach(feature => {
    console.log(`${feature.status} ${feature.name}: ${feature.details}`);
  });
  
  if (results.errors.length > 0) {
    console.log('\n❌ 测试错误:');
    results.errors.forEach(error => {
      console.log(`   错误: ${error.message}`);
    });
  }
  
  const allTests = [
    ...results.pages,
    ...results.navigation,
    ...results.neobrutalism,
    ...results.features
  ];
  
  const successCount = allTests.filter(test => test.status === '✅').length;
  const totalCount = allTests.length;
  const successRate = Math.round((successCount / totalCount) * 100);
  
  console.log(`\n🎯 uni-app H5测试总结:`);
  console.log(`   总体成功率: ${successRate}% (${successCount}/${totalCount})`);
  console.log(`   页面功能: ${results.pages.filter(p => p.status === '✅').length}/${results.pages.length}`);
  console.log(`   导航功能: ${results.navigation.filter(n => n.status === '✅').length}/${results.navigation.length}`);
  console.log(`   设计系统: ${results.neobrutalism.filter(n => n.status === '✅').length}/${results.neobrutalism.length}`);
  console.log(`   技术特性: ${results.features.filter(f => f.status === '✅').length}/${results.features.length}`);
  console.log(`   错误数量: ${results.errors.length}`);
  
  // 迁移验证
  const migrationSuccess = results.features.some(f => 
    f.name.includes('uni-app') && f.status === '✅'
  );
  const designSystemSuccess = results.neobrutalism.some(n => 
    n.name.includes('特征') && n.status === '✅'
  );
  
  console.log(`\n✨ uni-app迁移验证:`);
  console.log(`   架构迁移: ${migrationSuccess ? '✅ 成功' : '❌ 失败'}`);
  console.log(`   设计系统: ${designSystemSuccess ? '✅ 成功' : '❌ 失败'}`);
  console.log(`   整体评估: ${(successRate >= 70 && results.errors.length === 0) ? '🎉 迁移成功' : '⚠️ 需要优化'}`);
  
  return {
    success: results.errors.length === 0 && successRate >= 70,
    results,
    successRate,
    migrationVerified: migrationSuccess && designSystemSuccess
  };
}

// 如果直接运行此脚本
if (require.main === module) {
  testUniAppH5().then(result => {
    console.log('\n🏁 测试完成!');
    console.log(`迁移验证: ${result.migrationVerified ? '✅ 确认成功' : '❌ 需要检查'}`);
    process.exit(result.success ? 0 : 1);
  }).catch(error => {
    console.error('❌ 测试执行失败:', error);
    process.exit(1);
  });
}

module.exports = { testUniAppH5 };