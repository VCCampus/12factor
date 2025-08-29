#!/usr/bin/env node

/**
 * Playwright测试脚本 - 验证温度计链接
 * 遵循CLAUDE.md项目守则，输出至scripts目录
 */

const { chromium } = require('playwright');

async function testThermometerLink() {
  console.log('🎭 启动Playwright测试...');
  
  let browser;
  let results = {
    success: false,
    findings: [],
    errors: []
  };
  
  try {
    // 启动浏览器
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    
    const page = await context.newPage();
    
    // 设置超时
    page.setDefaultTimeout(30000);
    
    console.log('📍 正在访问网站...');
    
    // 访问目标网站
    const targetUrl = 'http://web3mh.101.so:11181/';
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    
    results.findings.push(`✅ 成功访问: ${targetUrl}`);
    
    // 等待页面加载完成
    await page.waitForTimeout(2000);
    
    // 检查页面标题
    const title = await page.title();
    results.findings.push(`📄 页面标题: ${title}`);
    
    // 检查导航栏是否存在
    const nav = await page.locator('nav').first();
    const navExists = await nav.count() > 0;
    results.findings.push(`🧭 导航栏存在: ${navExists ? '✅ 是' : '❌ 否'}`);
    
    if (navExists) {
      // 获取所有导航链接
      const navLinks = await page.locator('nav a').allTextContents();
      results.findings.push(`🔗 导航链接: [${navLinks.join(', ')}]`);
      
      // 专门检查温度计链接
      const thermometerLink = page.locator('nav a:has-text("温度计")');
      const thermometerExists = await thermometerLink.count() > 0;
      
      if (thermometerExists) {
        results.findings.push('🌡️ 温度计链接: ✅ 找到');
        
        // 检查链接的href属性
        const href = await thermometerLink.getAttribute('href');
        results.findings.push(`🔗 温度计链接地址: ${href}`);
        
        // 检查链接的位置（应该在首页之后）
        const allLinks = await page.locator('nav a').all();
        let thermometerPosition = -1;
        let homePosition = -1;
        
        for (let i = 0; i < allLinks.length; i++) {
          const linkText = await allLinks[i].textContent();
          if (linkText?.includes('首页') || linkText?.includes('12Factor')) {
            homePosition = i;
          }
          if (linkText?.includes('温度计')) {
            thermometerPosition = i;
          }
        }
        
        if (homePosition >= 0 && thermometerPosition >= 0) {
          const positionCorrect = thermometerPosition > homePosition;
          results.findings.push(`📍 温度计位置: ${positionCorrect ? '✅ 正确(在首页后)' : '❌ 错误'}`);
        }
        
        // 尝试点击温度计链接
        try {
          await thermometerLink.click();
          await page.waitForURL('**/thermometer**', { timeout: 10000 });
          
          const currentUrl = page.url();
          results.findings.push(`🎯 点击测试: ✅ 成功跳转到 ${currentUrl}`);
          
          // 检查温度计页面内容
          const pageTitle = await page.locator('h1').first().textContent();
          results.findings.push(`📝 温度计页面标题: ${pageTitle}`);
          
          // 检查恐惧贪婪指数图片
          const fearGreedImage = page.locator('img[src*="fear-and-greed-index"]');
          const imageExists = await fearGreedImage.count() > 0;
          results.findings.push(`📊 恐惧贪婪指数图片: ${imageExists ? '✅ 存在' : '❌ 未找到'}`);
          
          // 检查来源链接
          const sourceLink = page.locator('a[href*="alternative.me"]');
          const sourceLinkExists = await sourceLink.count() > 0;
          results.findings.push(`🔗 来源链接: ${sourceLinkExists ? '✅ 存在' : '❌ 未找到'}`);
          
          results.success = true;
          
        } catch (clickError) {
          results.errors.push(`❌ 点击温度计链接失败: ${clickError.message}`);
        }
        
      } else {
        results.findings.push('🌡️ 温度计链接: ❌ 未找到');
        results.errors.push('温度计链接在导航栏中不存在');
      }
    }
    
    // 截图作为证据
    await page.screenshot({ 
      path: '/opt/src/12factor/scripts/thermometer-test-screenshot.png',
      fullPage: true 
    });
    results.findings.push('📸 已保存截图: scripts/thermometer-test-screenshot.png');
    
  } catch (error) {
    results.errors.push(`❌ 测试过程出错: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return results;
}

// 执行测试
async function runTest() {
  console.log('🚀 开始Playwright温度计链接测试\n');
  
  const results = await testThermometerLink();
  
  console.log('📋 测试结果:\n');
  
  // 输出测试发现
  if (results.findings.length > 0) {
    console.log('🔍 测试发现:');
    results.findings.forEach(finding => console.log(`   ${finding}`));
    console.log('');
  }
  
  // 输出错误信息
  if (results.errors.length > 0) {
    console.log('❌ 错误信息:');
    results.errors.forEach(error => console.log(`   ${error}`));
    console.log('');
  }
  
  // 总结
  console.log(`🎯 测试结论: ${results.success ? '✅ 成功' : '❌ 失败'}`);
  
  if (results.success) {
    console.log('🎉 温度计功能在生产环境中正常工作！');
  } else {
    console.log('⚠️  温度计功能存在问题，需要进一步检查。');
  }
  
  // 返回结果用于进一步处理
  return results;
}

// 如果直接运行此脚本
if (require.main === module) {
  runTest().catch(console.error);
}

module.exports = { testThermometerLink, runTest };