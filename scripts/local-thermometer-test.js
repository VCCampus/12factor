#!/usr/bin/env node

/**
 * 本地Playwright测试脚本 - 验证温度计链接
 * 遵循CLAUDE.md项目守则，输出至scripts目录
 */

const { chromium } = require('playwright');
const { spawn } = require('child_process');

async function startLocalServer() {
  console.log('🚀 启动本地开发服务器...');
  
  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'dev'], { 
      stdio: 'pipe',
      env: { ...process.env, PORT: '3005' }
    });
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Ready in') || output.includes('Local:')) {
        console.log('✅ 开发服务器已启动');
        setTimeout(() => resolve(server), 3000); // 等待3秒确保完全启动
      }
    });
    
    server.stderr.on('data', (data) => {
      console.log(`服务器错误: ${data}`);
    });
    
    server.on('error', (error) => {
      reject(error);
    });
    
    // 10秒超时
    setTimeout(() => {
      reject(new Error('服务器启动超时'));
    }, 15000);
  });
}

async function testLocalThermometerLink() {
  console.log('🎭 启动Playwright本地测试...');
  
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
    page.setDefaultTimeout(10000);
    
    console.log('📍 正在访问本地网站...');
    
    // 访问本地服务器
    const targetUrl = 'http://localhost:3005/';
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    
    results.findings.push(`✅ 成功访问本地服务器: ${targetUrl}`);
    
    // 等待页面加载
    await page.waitForTimeout(2000);
    
    // 检查页面标题
    const title = await page.title();
    results.findings.push(`📄 页面标题: ${title}`);
    
    // 检查导航栏
    const nav = await page.locator('nav').first();
    const navExists = await nav.count() > 0;
    results.findings.push(`🧭 导航栏存在: ${navExists ? '✅ 是' : '❌ 否'}`);
    
    if (navExists) {
      // 获取所有导航链接
      const navLinks = await page.locator('nav a').allTextContents();
      results.findings.push(`🔗 所有导航链接: [${navLinks.join(', ')}]`);
      
      // 检查温度计链接
      const thermometerLink = page.locator('nav a:has-text("温度计")');
      const thermometerExists = await thermometerLink.count() > 0;
      
      if (thermometerExists) {
        results.findings.push('🌡️ 温度计链接: ✅ 找到');
        
        const href = await thermometerLink.getAttribute('href');
        results.findings.push(`🔗 温度计链接地址: ${href}`);
        
        // 点击测试
        try {
          await thermometerLink.click();
          await page.waitForTimeout(3000);
          
          const currentUrl = page.url();
          results.findings.push(`🎯 点击测试: ✅ 跳转到 ${currentUrl}`);
          
          // 检查温度计页面内容
          const h1 = await page.locator('h1').first().textContent();
          results.findings.push(`📝 页面标题: ${h1}`);
          
          // 检查图片
          const img = page.locator('img[alt*="恐惧"], img[src*="fear"]');
          const imgExists = await img.count() > 0;
          results.findings.push(`📊 恐惧贪婪指数图片: ${imgExists ? '✅ 存在' : '❌ 未找到'}`);
          
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
    
    // 截图
    await page.screenshot({ 
      path: '/opt/src/12factor/scripts/local-thermometer-test.png',
      fullPage: true 
    });
    results.findings.push('📸 已保存本地测试截图: scripts/local-thermometer-test.png');
    
  } catch (error) {
    results.errors.push(`❌ 本地测试出错: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return results;
}

// 主函数
async function runLocalTest() {
  console.log('🧪 开始本地温度计链接测试\n');
  
  let server = null;
  
  try {
    // 启动本地服务器
    server = await startLocalServer();
    
    // 运行测试
    const results = await testLocalThermometerLink();
    
    console.log('\n📋 本地测试结果:\n');
    
    // 输出发现
    if (results.findings.length > 0) {
      console.log('🔍 测试发现:');
      results.findings.forEach(finding => console.log(`   ${finding}`));
      console.log('');
    }
    
    // 输出错误
    if (results.errors.length > 0) {
      console.log('❌ 错误信息:');
      results.errors.forEach(error => console.log(`   ${error}`));
      console.log('');
    }
    
    console.log(`🎯 本地测试结论: ${results.success ? '✅ 成功' : '❌ 失败'}`);
    
    return results;
    
  } catch (error) {
    console.log(`❌ 测试过程出错: ${error.message}`);
    return { success: false, errors: [error.message], findings: [] };
  } finally {
    // 关闭服务器
    if (server) {
      console.log('🛑 关闭本地服务器...');
      server.kill();
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runLocalTest().catch(console.error);
}

module.exports = { runLocalTest };