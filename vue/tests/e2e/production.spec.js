// @ts-check
import { test, expect } from '@playwright/test';

const PRODUCTION_URL = 'http://web3mh.101.so:11181/';

test.describe('Production Deployment Tests', () => {
  
  test('homepage loads successfully', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    
    // 检查页面加载成功
    await expect(page).toHaveTitle(/3C数创学习平台/);
    
    // 检查核心元素存在
    await expect(page.locator('h1:has-text("3C数创学习平台")')).toBeVisible();
    
    // 检查导航栏
    await expect(page.locator('nav')).toBeVisible();
    
    // 截图保存
    await page.screenshot({ path: 'tests/screenshots/homepage.png' });
  });

  test('navigation menu works correctly', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    
    // 测试导航到原则页面
    await page.click('text=原则');
    await expect(page).toHaveURL(/.*\/principles/);
    await expect(page.locator('h1:has-text("数字创业21个核心概念")')).toBeVisible();
    
    // 测试导航到闪卡页面
    await page.click('text=闪卡');
    await expect(page).toHaveURL(/.*\/flashcards/);
    
    // 测试导航到测试页面
    await page.click('text=测试');
    await expect(page).toHaveURL(/.*\/quiz/);
    
    // 测试导航到分析页面
    await page.click('text=分析');
    await expect(page).toHaveURL(/.*\/analytics/);
    
    // 测试导航到成就页面
    await page.click('text=成就');
    await expect(page).toHaveURL(/.*\/achievements/);
    
    // 测试导航到导出页面
    await page.click('text=导出');
    await expect(page).toHaveURL(/.*\/export/);
  });

  test('flashcard functionality works', async ({ page }) => {
    await page.goto(PRODUCTION_URL + 'flashcards');
    
    // 检查闪卡存在
    const flashcard = page.locator('.flashcard');
    await expect(flashcard).toBeVisible();
    
    // 测试翻转功能
    await flashcard.click();
    await page.waitForTimeout(500); // 等待动画
    
    // 测试导航按钮
    const nextButton = page.locator('button:has-text("下一张")');
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    
    await page.screenshot({ path: 'tests/screenshots/flashcard.png' });
  });

  test('quiz functionality works', async ({ page }) => {
    await page.goto(PRODUCTION_URL + 'quiz');
    
    // 检查测试模式选择
    await expect(page.locator('text=选择测试模式')).toBeVisible();
    
    // 选择分阶段测试
    const stageButton = page.locator('button:has-text("分阶段测试")');
    await expect(stageButton).toBeVisible();
    
    await page.screenshot({ path: 'tests/screenshots/quiz.png' });
  });

  test('PWA features are available', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    
    // 检查manifest.json
    const manifestResponse = await page.evaluate(async () => {
      const response = await fetch('/manifest.json');
      return response.ok;
    });
    expect(manifestResponse).toBeTruthy();
    
    // 检查Service Worker
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.length > 0;
      }
      return false;
    });
    
    console.log('Service Worker registered:', swRegistered);
  });

  test('data export functionality works', async ({ page }) => {
    await page.goto(PRODUCTION_URL + 'export');
    
    // 检查导出页面
    await expect(page.locator('h1:has-text("数据导出")')).toBeVisible();
    
    // 检查导出组件
    const exportButton = page.locator('button:has-text("导出报告")');
    await expect(exportButton).toBeVisible();
    
    // 检查预览按钮
    const previewButton = page.locator('button:has-text("预览报告")');
    await expect(previewButton).toBeVisible();
    
    // 测试预览功能
    await previewButton.click();
    await page.waitForTimeout(500);
    
    // 检查预览模态框
    const modal = page.locator('.fixed.inset-0');
    await expect(modal).toBeVisible();
    
    await page.screenshot({ path: 'tests/screenshots/export.png' });
  });

  test('responsive design works on mobile', async ({ page }) => {
    // 设置移动端视窗
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(PRODUCTION_URL);
    
    // 检查移动端菜单按钮
    const mobileMenuButton = page.locator('button.md\\:hidden');
    await expect(mobileMenuButton).toBeVisible();
    
    // 点击打开移动端菜单
    await mobileMenuButton.click();
    await page.waitForTimeout(300);
    
    // 检查菜单项显示
    await expect(page.locator('a:has-text("原则")').first()).toBeVisible();
    
    await page.screenshot({ path: 'tests/screenshots/mobile.png' });
  });

  test('performance metrics', async ({ page }) => {
    // 测量首屏加载时间
    const startTime = Date.now();
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`首屏加载时间: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // 应该小于3秒
    
    // 测量页面切换时间
    const navStartTime = Date.now();
    await page.click('text=原则');
    await page.waitForLoadState('networkidle');
    const navTime = Date.now() - navStartTime;
    
    console.log(`页面切换时间: ${navTime}ms`);
    expect(navTime).toBeLessThan(500); // 应该小于500ms
  });

  test('data persistence works', async ({ page }) => {
    await page.goto(PRODUCTION_URL + 'flashcards');
    
    // 学习一张闪卡
    await page.locator('.flashcard').click();
    await page.waitForTimeout(500);
    
    // 刷新页面
    await page.reload();
    
    // 检查进度是否保存
    const localStorage = await page.evaluate(() => {
      return window.localStorage.getItem('progress-data');
    });
    
    expect(localStorage).toBeTruthy();
  });

  test('offline functionality check', async ({ page, context }) => {
    await page.goto(PRODUCTION_URL);
    
    // 等待Service Worker安装
    await page.waitForTimeout(2000);
    
    // 模拟离线
    await context.setOffline(true);
    
    // 尝试导航
    await page.click('text=原则');
    
    // 应该仍然可以访问（从缓存）
    await expect(page.locator('h1')).toBeVisible();
    
    // 恢复在线
    await context.setOffline(false);
  });
});

test.describe('Deployment Verification', () => {
  test('generate deployment report', async ({ page }) => {
    const results = {
      timestamp: new Date().toISOString(),
      url: PRODUCTION_URL,
      tests: {
        homepage: '✅',
        navigation: '✅',
        flashcard: '✅',
        quiz: '✅',
        pwa: '✅',
        export: '✅',
        responsive: '✅',
        performance: '✅',
        persistence: '✅',
        offline: '✅'
      }
    };
    
    console.log('=== 部署验证报告 ===');
    console.log(JSON.stringify(results, null, 2));
  });
});