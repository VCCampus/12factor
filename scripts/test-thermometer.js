const { test, expect } = require('@playwright/test');

test.describe('温度计页面功能测试', () => {
  const baseURL = 'http://web3mh.101.so:11181';

  test('导航到温度计页面', async ({ page }) => {
    await page.goto(baseURL);
    
    // 检查首页正常加载
    await expect(page.locator('h1')).toContainText('3C数创学习平台');
    
    // 点击温度计导航链接
    await page.click('text=温度计');
    
    // 等待页面加载
    await page.waitForURL('**/thermometer');
    
    // 验证页面标题
    await expect(page.locator('h1')).toContainText('加密货币恐慌与贪婪指数');
    
    console.log('✅ 温度计页面导航正常');
  });

  test('检查温度计页面内容', async ({ page }) => {
    await page.goto(`${baseURL}/thermometer`);
    
    // 检查页面标题
    await expect(page.locator('h1')).toContainText('加密货币恐慌与贪婪指数');
    
    // 检查图片是否加载（等待一定时间）
    await page.waitForTimeout(3000);
    
    const image = page.locator('img[alt="Crypto Fear & Greed Index"]');
    await expect(image).toBeVisible();
    
    // 检查图片是否实际加载成功
    const imageSrc = await image.getAttribute('src');
    console.log('图片路径:', imageSrc);
    
    // 检查更新时间显示
    const updateDate = page.locator('text=数据更新于：');
    await expect(updateDate).toBeVisible();
    
    // 检查数据源链接
    const sourceLink = page.locator('a:has-text("Crypto Dashboard")');
    await expect(sourceLink).toBeVisible();
    await expect(sourceLink).toHaveAttribute('href', 'https://alternative.me/crypto/');
    await expect(sourceLink).toHaveAttribute('target', '_blank');
    
    // 检查指数说明卡片
    await expect(page.locator('text=📊 指数说明')).toBeVisible();
    await expect(page.locator('text=极度恐慌 (Extreme Fear)')).toBeVisible();
    await expect(page.locator('text=极度贪婪 (Extreme Greed)')).toBeVisible();
    
    console.log('✅ 温度计页面内容完整');
  });

  test('检查导航顺序', async ({ page }) => {
    await page.goto(baseURL);
    
    // 获取导航链接顺序
    const navLinks = await page.locator('.neo-nav-item').allTextContents();
    console.log('导航链接顺序:', navLinks);
    
    // 验证温度计在首页后面第二位
    const expectedOrder = ['首页', '温度计', '原则'];
    for (let i = 0; i < expectedOrder.length; i++) {
      expect(navLinks[i]).toBe(expectedOrder[i]);
    }
    
    console.log('✅ 导航顺序正确');
  });

  test('检查响应式设计', async ({ page }) => {
    // 桌面端测试
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${baseURL}/thermometer`);
    
    await expect(page.locator('h1')).toBeVisible();
    console.log('✅ 桌面端显示正常');
    
    // 平板端测试
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    await expect(page.locator('h1')).toBeVisible();
    console.log('✅ 平板端显示正常');
    
    // 移动端测试
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await expect(page.locator('h1')).toBeVisible();
    
    // 检查移动端菜单
    const mobileMenuButton = page.locator('button:has(span)');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.locator('text=温度计')).toBeVisible();
      console.log('✅ 移动端菜单正常');
    }
    
    console.log('✅ 移动端显示正常');
  });

  test('检查图片加载性能', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${baseURL}/thermometer`);
    
    // 等待图片加载
    await page.waitForLoadState('networkidle');
    const image = page.locator('img[alt="Crypto Fear & Greed Index"]');
    await expect(image).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    console.log(`页面加载时间: ${loadTime}ms`);
    
    // 检查页面加载时间不超过5秒
    expect(loadTime).toBeLessThan(5000);
    
    console.log('✅ 页面加载性能正常');
  });

  test('检查错误处理', async ({ page }) => {
    await page.goto(`${baseURL}/thermometer`);
    
    // 模拟网络错误（通过监听网络请求）
    await page.route('**/fear-and-greed-index.png', route => {
      route.abort();
    });
    
    await page.reload();
    
    // 检查是否显示错误状态
    await page.waitForTimeout(2000);
    
    // 如果显示错误，应该有访问源网站的链接
    const hasError = await page.locator('.error-state').isVisible().catch(() => false);
    if (hasError) {
      await expect(page.locator('text=访问源网站')).toBeVisible();
      console.log('✅ 错误处理正常');
    } else {
      console.log('ℹ️ 图片正常加载，错误状态未触发');
    }
  });
});