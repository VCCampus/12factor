// @ts-check
const { test, expect } = require('@playwright/test');

test('homepage has correct title', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // 检查页面标题
  await expect(page).toHaveTitle(/3C数创学习平台/);
  
  // 检查核心元素
  await expect(page.locator('h1')).toContainText('3C数创学习平台');
});

test('navigation works correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // 测试导航到原则页面
  await page.click('text=原则');
  await expect(page).toHaveURL(/.*\/principles/);
  
  // 测试导航到闪卡页面
  await page.click('text=闪卡');
  await expect(page).toHaveURL(/.*\/flashcards/);
  
  // 测试导航到测试页面
  await page.click('text=测试');
  await expect(page).toHaveURL(/.*\/quiz/);
});

test('PWA features are present', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // 检查manifest.json
  const manifest = await page.evaluate(() => {
    const link = document.querySelector('link[rel="manifest"]');
    return link ? link.href : null;
  });
  expect(manifest).toBeTruthy();
  
  // 检查Service Worker
  const hasServiceWorker = await page.evaluate(() => {
    return 'serviceWorker' in navigator;
  });
  expect(hasServiceWorker).toBeTruthy();
});

test('export page is accessible', async ({ page }) => {
  await page.goto('http://localhost:5173/export');
  
  // 检查导出页面元素
  await expect(page.locator('h1')).toContainText('数据导出');
  await expect(page.locator('button:has-text("导出报告")')).toBeVisible();
});

test('responsive design works on mobile', async ({ page }) => {
  // 设置移动端视窗
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:5173/');
  
  // 检查移动端菜单按钮
  const mobileMenuButton = page.locator('button.md\\:hidden');
  await expect(mobileMenuButton).toBeVisible();
  
  // 点击移动端菜单
  await mobileMenuButton.click();
  
  // 检查菜单项是否显示
  await expect(page.locator('text=原则').first()).toBeVisible();
});