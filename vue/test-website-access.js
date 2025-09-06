const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 启动浏览器...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🌐 访问目标网站: http://web3mh.101.so:11181/');
    
    const response = await page.goto('http://web3mh.101.so:11181/', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    console.log('✅ 网站访问成功!');
    console.log('📊 HTTP状态码:', response.status());
    console.log('🔗 最终URL:', page.url());
    
    const title = await page.title();
    console.log('📄 页面标题:', title);
    
    // 检查关键元素
    const h1Text = await page.locator('h1').first().textContent().catch(() => '未找到h1标签');
    console.log('🏷️  主标题:', h1Text);
    
    // 检查导航栏
    const navItems = await page.locator('nav a').count().catch(() => 0);
    console.log('🧭 导航项数量:', navItems);
    
    // 检查页面响应时间
    const performanceEntries = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart)
      };
    });
    console.log('⚡ 页面加载时间:', performanceEntries.loadTime + 'ms');
    console.log('📋 DOM内容加载:', performanceEntries.domContentLoaded + 'ms');
    
    // 截图验证
    await page.screenshot({ 
      path: 'website-accessibility-test.png',
      fullPage: true 
    });
    console.log('📸 完整页面截图已保存: website-accessibility-test.png');
    
  } catch (error) {
    console.error('❌ 网站访问失败:');
    console.error('错误类型:', error.name);
    console.error('错误信息:', error.message);
    
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.log('🔍 可能原因: 服务器未运行或端口不可达');
    } else if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
      console.log('🔍 可能原因: DNS解析失败');
    } else if (error.message.includes('timeout')) {
      console.log('🔍 可能原因: 网站响应超时');
    }
    
  } finally {
    await browser.close();
    console.log('🔚 浏览器已关闭');
  }
})();
