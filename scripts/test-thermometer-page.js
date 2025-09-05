const { chromium } = require('playwright');

async function testThermometerPage() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    const url = 'http://web3mh.101.so:11181/thermometer';
    
    console.log(`🚀 访问页面: ${url}`);
    
    // 设置较长的超时时间
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log(`✅ 页面加载成功: ${await page.title()}`);
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    // 检查页面标题
    try {
      const title = await page.textContent('h1', { timeout: 5000 });
      console.log(`📋 页面标题: ${title}`);
    } catch (e) {
      console.log(`📋 页面标题: 获取失败，可能页面结构不同`);
      // 尝试其他标题选择器
      const titles = await page.locator('h1, h2, .title').allTextContents();
      if (titles.length > 0) {
        console.log(`📋 找到标题: ${titles[0]}`);
      }
    }
    
    // 检查是否有数据卡片
    const hasDataCards = await page.locator('.data-cards-grid').count() > 0;
    console.log(`📊 数据卡片网格: ${hasDataCards ? '✅ 存在' : '❌ 不存在'}`);
    
    if (hasDataCards) {
      // 检查有知有行卡片
      const youzhiyouxingCard = await page.locator('text=有知有行市场温度').count();
      console.log(`🌡️ 有知有行卡片: ${youzhiyouxingCard > 0 ? '✅ 存在' : '❌ 不存在'}`);
      
      // 检查CoinMarketCap卡片
      const cmcCard = await page.locator('text=CoinMarketCap恐慌贪婪指数').count();
      console.log(`📈 CoinMarketCap卡片: ${cmcCard > 0 ? '✅ 存在' : '❌ 不存在'}`);
      
      // 检查是否有数据加载
      const loadingIndicator = await page.locator('.loading-state').count();
      const errorState = await page.locator('.error-state').count();
      const dataDisplay = await page.locator('.data-display').count();
      
      console.log(`🔄 加载状态: ${loadingIndicator} 个`);
      console.log(`❌ 错误状态: ${errorState} 个`);
      console.log(`📊 数据展示: ${dataDisplay} 个`);
      
      // 检查是否有可视化组件
      const thermometer = await page.locator('.thermometer-widget').count();
      const gauge = await page.locator('.gauge-widget').count();
      
      console.log(`🌡️ 温度计组件: ${thermometer} 个`);
      console.log(`⚡ 仪表盘组件: ${gauge} 个`);
      
      // 检查数据值
      try {
        const values = await page.locator('.main-value').allTextContents();
        console.log(`🔢 数据值: ${values.join(', ')}`);
      } catch (e) {
        console.log(`🔢 数据值: 未找到`);
      }
      
      // 检查刷新按钮
      const refreshButton = await page.locator('text=刷新数据').count();
      console.log(`🔄 刷新按钮: ${refreshButton > 0 ? '✅ 存在' : '❌ 不存在'}`);
    }
    
    // 检查是否还有旧的静态图片
    const oldImage = await page.locator('img[alt="Crypto Fear & Greed Index"]').count();
    console.log(`🖼️ 旧静态图片: ${oldImage > 0 ? '❌ 仍存在' : '✅ 已移除'}`);
    
    // 检查网络请求
    const requests = [];
    page.on('request', req => {
      if (req.url().includes('market-indicators.json')) {
        requests.push(req.url());
      }
    });
    
    // 尝试触发数据加载
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    if (requests.length > 0) {
      console.log(`📡 API请求: ${requests[0]}`);
    } else {
      console.log(`📡 API请求: 未检测到market-indicators.json请求`);
    }
    
    // 截图保存
    await page.screenshot({ 
      path: '/opt/src/12factor/logs/thermometer-page-screenshot.png',
      fullPage: true 
    });
    console.log(`📸 页面截图已保存: /opt/src/12factor/logs/thermometer-page-screenshot.png`);
    
    // 检查响应式布局
    console.log(`\n📱 测试响应式布局:`);
    
    // 移动端
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    const mobileLayout = await page.locator('.data-cards-grid').getAttribute('class');
    console.log(`📱 移动端布局: ${mobileLayout?.includes('grid-cols-1') ? '✅ 单列' : '❓ 需检查'}`);
    
    // 桌面端
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    const desktopLayout = await page.locator('.data-cards-grid').getAttribute('class');
    console.log(`🖥️ 桌面端布局: ${desktopLayout?.includes('lg:grid-cols-2') ? '✅ 双列' : '❓ 需检查'}`);
    
    console.log(`\n✅ 测试完成`);
    
  } catch (error) {
    console.error(`❌ 测试失败:`, error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
  
  return { success: true };
}

// 运行测试
testThermometerPage()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 页面验证完成');
    } else {
      console.log(`\n💥 页面验证失败: ${result.error}`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 脚本执行失败:', error);
    process.exit(1);
  });