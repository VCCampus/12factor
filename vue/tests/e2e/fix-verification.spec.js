import { test, expect } from '@playwright/test';

test.describe('融资致胜法则内容验证', () => {
  test('应该显示融资致胜法则模块和所有4个原则', async ({ page }) => {
    console.log('🚀 开始测试融资致胜法则内容修复...');
    
    // 访问原则页面
    await page.goto('http://web3mh.101.so:11181/principles');
    console.log('✅ 页面加载完成');
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    // 1. 验证融资致胜法则模块存在
    const fundraisingModule = page.locator('.neo-card:has-text("融资致胜法则")').first();
    await expect(fundraisingModule).toBeVisible();
    console.log('✅ 找到融资致胜法则模块');
    
    // 2. 点击开始学习按钮展开内容
    const startLearningBtn = fundraisingModule.locator('button:has-text("开始学习")');
    await startLearningBtn.click();
    console.log('✅ 点击开始学习按钮');
    
    // 等待内容加载
    await page.waitForTimeout(2000);
    
    // 3. 验证4个核心原则都显示出来
    const expectedPrinciples = [
      '风险投资本质',
      '融资阶段管理',
      '路演演讲技巧', 
      '财务三表基础'
    ];
    
    console.log('🔍 验证4个核心原则...');
    
    for (const principle of expectedPrinciples) {
      const principleElement = page.locator(`.neo-card:has-text("融资致胜法则") .font-medium:has-text("${principle}")`);
      await expect(principleElement).toBeVisible();
      console.log(`✅ 找到原则: ${principle}`);
    }
    
    // 4. 验证每个原则都有概念描述
    const principleDescriptions = page.locator('.neo-card:has-text("融资致胜法则") .text-gray-600');
    const descriptionCount = await principleDescriptions.count();
    expect(descriptionCount).toBeGreaterThanOrEqual(4);
    console.log(`✅ 找到 ${descriptionCount} 个原则描述`);
    
    // 5. 验证原则状态和学习按钮
    const learnButtons = page.locator('.neo-card:has-text("融资致胜法则") .neo-btn-secondary:has-text("学习")');
    const buttonCount = await learnButtons.count();
    expect(buttonCount).toBe(4);
    console.log(`✅ 找到 ${buttonCount} 个学习按钮`);
    
    // 6. 测试点击学习按钮的功能
    const firstLearnBtn = learnButtons.first();
    await firstLearnBtn.click();
    console.log('✅ 测试学习按钮点击功能');
    
    console.log('🎉 所有测试通过！融资致胜法则内容已完全修复');
  });
  
  test('验证修复前的问题不再存在', async ({ page }) => {
    console.log('🔍 验证修复前的问题不再存在...');
    
    await page.goto('http://web3mh.101.so:11181/principles');
    await page.waitForTimeout(3000);
    
    // 检查是否还有"无内容"或"加载失败"的情况
    const noContentText = page.locator(':has-text("无内容")');
    const loadFailText = page.locator(':has-text("加载失败")');
    const errorText = page.locator(':has-text("❌")');
    
    await expect(noContentText).toHaveCount(0);
    await expect(loadFailText).toHaveCount(0);
    console.log('✅ 未发现"无内容"或"加载失败"错误');
    
    // 验证融资致胜法则模块能正常展开
    const fundraisingModule = page.locator('.neo-card:has-text("融资致胜法则")').first();
    await fundraisingModule.locator('button:has-text("开始学习")').click();
    await page.waitForTimeout(1500);
    
    // 确认内容已展开，不是空的
    const principlesList = page.locator('.neo-card:has-text("融资致胜法则") .border-gray-200');
    const principleCount = await principlesList.count();
    expect(principleCount).toBe(4);
    console.log(`✅ 确认融资致胜法则包含 ${principleCount} 个原则，问题已完全修复`);
  });
});