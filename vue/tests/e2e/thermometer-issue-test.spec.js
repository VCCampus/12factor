import { test, expect } from '@playwright/test';

test.describe('Issue #23 - 温度计页面空白问题验证', () => {
  test('生产环境温度计页面加载测试', async ({ page }) => {
    // 直接访问生产环境的温度计页面
    await page.goto('http://web3mh.101.so:11181/thermometer');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 截图保存当前状态
    await page.screenshot({ path: 'production-thermometer.png', fullPage: true });
    
    // 验证页面不是空白的 - 检查基本元素
    const bodyContent = await page.textContent('body');
    console.log('Page body text length:', bodyContent?.length || 0);
    
    // 验证是否包含预期的温度计内容
    const hasTitle = await page.locator('text=市场情绪指数').isVisible({ timeout: 10000 });
    console.log('Has title "市场情绪指数":', hasTitle);
    
    const hasDataCards = await page.locator('.data-card').count();
    console.log('Data cards found:', hasDataCards);
    
    const hasErrorState = await page.locator('text=系统错误').isVisible({ timeout: 1000 }).catch(() => false);
    console.log('Has error state:', hasErrorState);
    
    const hasLoadingState = await page.locator('text=初始化市场数据').isVisible({ timeout: 1000 }).catch(() => false);
    console.log('Has loading state:', hasLoadingState);
    
    // 验证数据源链接是否存在
    const sourceLinks = await page.locator('a[href*="youzhiyouxing"]').count();
    console.log('Source links count:', sourceLinks);
    
    // 检查是否有JavaScript错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    // 基本验证 - 页面应该有内容
    expect(bodyContent?.length).toBeGreaterThan(100);
  });
  
  test('本地开发环境温度计页面对比测试', async ({ page }) => {
    // 访问本地开发环境
    await page.goto('http://localhost:5174/thermometer');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 截图保存本地环境状态
    await page.screenshot({ path: 'local-thermometer.png', fullPage: true });
    
    // 验证本地环境是否正常工作
    const hasTitle = await page.locator('text=市场情绪指数').isVisible({ timeout: 10000 });
    console.log('Local - Has title:', hasTitle);
    
    const hasDataCards = await page.locator('.data-card').count();
    console.log('Local - Data cards found:', hasDataCards);
    
    // 验证数据是否加载
    const hasData = await page.locator('.thermometer-widget, .gauge-widget').count();
    console.log('Local - Visualization widgets:', hasData);
    
    expect(hasTitle).toBeTruthy();
  });
});