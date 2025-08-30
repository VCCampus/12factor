// @ts-check
import { test, expect } from '@playwright/test';

test.describe('温度计页面导航栏和页脚测试', () => {
  const baseURL = 'http://web3mh.101.so:11181';

  test('温度计页面应该有标准导航栏', async ({ page }) => {
    await page.goto(`${baseURL}/thermometer`);
    
    // 检查页面加载
    await expect(page.locator('h1')).toContainText('加密货币恐慌与贪婪指数');
    
    // 检查导航栏是否存在
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // 检查logo和标题
    await expect(page.locator('h1:has-text("3C数创学习平台")')).toBeVisible();
    
    // 检查导航链接是否存在并正确高亮
    const navLinks = [
      { text: '首页', href: '/' },
      { text: '温度计', href: '/thermometer' },
      { text: '原则', href: '/principles' },
      { text: '闪卡', href: '/flashcards' },
      { text: '测试', href: '/quiz' }
    ];
    
    for (const link of navLinks) {
      const navLink = page.locator(`a:has-text("${link.text}")`);
      await expect(navLink).toBeVisible();
      
      // 检查温度计链接是否高亮（active状态）
      if (link.text === '温度计') {
        await expect(navLink).toHaveClass(/active/);
      }
    }
    
    console.log('✅ 温度计页面导航栏验证通过');
  });

  test('温度计页面应该有标准页脚', async ({ page }) => {
    await page.goto(`${baseURL}/thermometer`);
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 检查页脚是否存在
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // 检查版权信息
    await expect(page.locator('text=© 2024 CSS数创学习平台')).toBeVisible();
    
    // 检查版本信息
    await expect(page.locator('text=版本 v4.0.0')).toBeVisible();
    
    // 检查PWA支持标识
    await expect(page.locator('text=PWA离线支持')).toBeVisible();
    
    console.log('✅ 温度计页面页脚验证通过');
  });

  test('从首页导航到温度计页面', async ({ page }) => {
    await page.goto(baseURL);
    
    // 检查首页导航栏
    await expect(page.locator('h1:has-text("3C数创学习平台")')).toBeVisible();
    
    // 点击温度计导航链接
    await page.click('text=温度计');
    
    // 等待页面跳转
    await page.waitForURL('**/thermometer');
    
    // 验证页面内容
    await expect(page.locator('h1')).toContainText('加密货币恐慌与贪婪指数');
    
    // 验证导航栏仍然存在且温度计高亮
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('a:has-text("温度计")')).toHaveClass(/active/);
    
    // 验证页脚仍然存在
    await expect(page.locator('footer')).toBeVisible();
    
    console.log('✅ 首页到温度计页面导航验证通过');
  });

  test('温度计页面响应式导航测试', async ({ page }) => {
    // 移动端测试
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${baseURL}/thermometer`);
    
    // 检查页面标题显示
    await expect(page.locator('h1')).toContainText('加密货币恐慌与贪婪指数');
    
    // 检查移动端菜单按钮是否存在
    const mobileMenuButton = page.locator('button:has(span)').first();
    await expect(mobileMenuButton).toBeVisible();
    
    // 点击移动端菜单
    await mobileMenuButton.click();
    
    // 检查移动端菜单项
    await expect(page.locator('text=温度计')).toBeVisible();
    await expect(page.locator('text=首页')).toBeVisible();
    
    // 检查页脚在移动端也存在
    await expect(page.locator('footer')).toBeVisible();
    
    console.log('✅ 温度计页面移动端导航验证通过');
  });

  test('温度计页面布局完整性检查', async ({ page }) => {
    await page.goto(`${baseURL}/thermometer`);
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 检查页面结构: Header -> Main -> Footer
    const pageStructure = await page.evaluate(() => {
      const body = document.body;
      const children = Array.from(body.children);
      return children.map(child => child.tagName.toLowerCase());
    });
    
    // 应该包含基本的页面结构元素
    expect(pageStructure).toContain('header');
    // Main content 可能在div中
    expect(pageStructure.some(tag => ['main', 'div'].includes(tag))).toBeTruthy();
    expect(pageStructure).toContain('footer');
    
    // 检查温度计特定内容是否完整显示
    await expect(page.locator('text=指数说明')).toBeVisible();
    await expect(page.locator('text=极度恐慌')).toBeVisible();
    await expect(page.locator('text=极度贪婪')).toBeVisible();
    
    console.log('✅ 温度计页面布局完整性验证通过');
  });
});