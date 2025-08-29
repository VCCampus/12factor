#!/usr/bin/env node

const { chromium } = require('playwright');

async function testTemperatureNav() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🌐 访问网站: http://web3mh.101.so:11181/');
    await page.goto('http://web3mh.101.so:11181/', { waitUntil: 'networkidle' });
    
    console.log('🔍 查找温度计导航链接...');
    
    // 查找所有可能包含"温度计"文字的元素
    const temperatureLinks = await page.$$eval('a, button, nav *', elements => 
      elements
        .filter(el => el.textContent?.includes('温度计') || el.textContent?.includes('thermometer'))
        .map(el => ({
          text: el.textContent.trim(),
          tag: el.tagName,
          href: el.href || el.getAttribute('href'),
          classes: el.className
        }))
    );
    
    if (temperatureLinks.length > 0) {
      console.log('✅ 找到温度计相关导航元素:');
      temperatureLinks.forEach(link => {
        console.log(`   - ${link.tag}: "${link.text}" ${link.href ? `(${link.href})` : ''}`);
      });
    } else {
      console.log('❌ 未找到温度计导航链接');
      
      // 获取页面标题和导航内容以供分析
      const title = await page.title();
      console.log(`\n📄 页面标题: ${title}`);
      
      // 获取所有导航链接
      const navLinks = await page.$$eval('nav a, header a', elements => 
        elements.map(el => ({
          text: el.textContent.trim(),
          href: el.href
        }))
      );
      
      if (navLinks.length > 0) {
        console.log('\n📋 当前导航链接:');
        navLinks.forEach(link => {
          console.log(`   - ${link.text} (${link.href})`);
        });
      }
      
      // 截图以供后续分析
      await page.screenshot({ path: '/opt/src/12factor/logs/temperature-nav-test.png' });
      console.log('\n📸 已保存页面截图: logs/temperature-nav-test.png');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    await browser.close();
  }
}

// 运行测试
testTemperatureNav().catch(console.error);