/**
 * Playwright E2E Test for Mock Interview System Refactoring
 * Tests the new multi-job, multi-difficulty interview system
 */

import { test, expect } from '@playwright/test';

// Target URL
const BASE_URL = 'http://web3mh.101.so:11181';

test.describe('Mock Interview System Refactoring', () => {
  
  test('should display job cards grid on home page', async ({ page }) => {
    await page.goto(`${BASE_URL}/mock-interview`);
    
    // Check page title
    await expect(page.locator('h1')).toContainText('模拟面试中心');
    
    // Check job cards are displayed
    const jobCards = page.locator('.job-card');
    await expect(jobCards).toHaveCount(3); // DeFi, Fullstack, SEO
    
    // Verify first job card content
    const firstCard = jobCards.first();
    await expect(firstCard).toContainText('DeFi增长经理');
    await expect(firstCard).toContainText('远程');
    await expect(firstCard).toContainText('$55K-80K');
  });
  
  test('should navigate to job detail page', async ({ page }) => {
    await page.goto(`${BASE_URL}/mock-interview`);
    
    // Click on DeFi job card
    await page.locator('.job-card').first().click();
    
    // Check URL changed
    await expect(page).toHaveURL(/.*\/mock-interview\/defi_growth/);
    
    // Check job details displayed
    await expect(page.locator('h1')).toContainText('DeFi增长经理');
    await expect(page.locator('.neo-card')).toContainText('岗位要求');
    
    // Check difficulty options
    const difficultyCards = page.locator('.difficulty-card');
    await expect(difficultyCards).toHaveCount(3);
    await expect(difficultyCards.first()).toContainText('初级');
  });
  
  test('should start quiz with random questions', async ({ page }) => {
    await page.goto(`${BASE_URL}/mock-interview/defi_growth`);
    
    // Click junior difficulty
    await page.locator('.difficulty-card').first().click();
    
    // Check URL changed to quiz
    await expect(page).toHaveURL(/.*\/mock-interview\/defi_growth\/junior\/quiz/);
    
    // Check quiz interface
    await expect(page.locator('h1')).toContainText('DeFi增长经理 - 初级测试');
    await expect(page.locator('.neo-card')).toContainText('题目 1/25');
    
    // Check question is displayed
    const questionCard = page.locator('.neo-card').nth(1);
    await expect(questionCard).toBeVisible();
    
    // Check options are displayed
    const options = page.locator('.option-card');
    await expect(options).toHaveCount(4);
    
    // Check answer grid
    const answerGrid = page.locator('.neo-card').last();
    await expect(answerGrid).toContainText('答题进度');
    const answerButtons = answerGrid.locator('button');
    await expect(answerButtons).toHaveCount(25);
  });
  
  test('should validate answer selection', async ({ page }) => {
    await page.goto(`${BASE_URL}/mock-interview/defi_growth/junior/quiz`);
    
    // Try to go next without selecting answer
    await page.locator('button:has-text("下一题")').click();
    
    // Check warning appears
    await expect(page.locator('.bg-yellow-100')).toContainText('请先选择答案再继续');
    
    // Select an option
    await page.locator('.option-card').first().click();
    
    // Warning should disappear
    await expect(page.locator('.bg-yellow-100')).not.toBeVisible();
    
    // Should be able to go next
    await page.locator('button:has-text("下一题")').click();
    await expect(page.locator('.neo-card')).toContainText('题目 2/25');
  });
  
  test('should show result page after submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/mock-interview/defi_growth/junior/quiz`);
    
    // Answer all questions quickly (just select first option)
    for (let i = 0; i < 25; i++) {
      await page.locator('.option-card').first().click();
      
      if (i < 24) {
        await page.locator('button:has-text("下一题")').click();
        await page.waitForTimeout(100); // Small delay
      } else {
        // Last question - submit
        await page.locator('button:has-text("提交答卷")').click();
      }
    }
    
    // Check URL changed to result
    await expect(page).toHaveURL(/.*\/mock-interview\/defi_growth\/junior\/result/);
    
    // Check result display
    await expect(page.locator('h1')).toContainText('测试完成');
    await expect(page.locator('.neo-card')).toContainText('DeFi增长经理 - 初级');
    
    // Check score display
    const scoreDisplay = page.locator('.text-6xl');
    await expect(scoreDisplay).toBeVisible();
    
    // Check ability analysis
    await expect(page.locator('h2')).toContainText('能力分析');
    
    // Check action buttons
    await expect(page.locator('button')).toContainText('查看错题解析');
    await expect(page.locator('button')).toContainText('重新测试');
  });
  
  test('should navigate to review page for wrong answers', async ({ page }) => {
    // First complete a quiz
    await page.goto(`${BASE_URL}/mock-interview/defi_growth/junior/quiz`);
    
    // Answer questions (mix right and wrong)
    for (let i = 0; i < 25; i++) {
      // Select different options to ensure some wrong answers
      const optionIndex = i % 4;
      await page.locator('.option-card').nth(optionIndex).click();
      
      if (i < 24) {
        await page.locator('button:has-text("下一题")').click();
        await page.waitForTimeout(100);
      } else {
        await page.locator('button:has-text("提交答卷")').click();
      }
    }
    
    // Wait for result page
    await expect(page).toHaveURL(/.*\/result/);
    
    // Click review wrong answers
    const reviewButton = page.locator('button:has-text("查看错题解析")');
    if (await reviewButton.isVisible()) {
      await reviewButton.click();
      
      // Check URL changed to review
      await expect(page).toHaveURL(/.*\/review/);
      
      // Check review interface
      await expect(page.locator('h1')).toContainText('错题回顾');
      
      // Check explanation is shown
      await expect(page.locator('.bg-blue-50')).toContainText('解析');
    }
  });
  
  test('should save progress in localStorage', async ({ page }) => {
    await page.goto(`${BASE_URL}/mock-interview/defi_growth/junior/quiz`);
    
    // Answer a few questions
    for (let i = 0; i < 5; i++) {
      await page.locator('.option-card').first().click();
      if (i < 4) {
        await page.locator('button:has-text("下一题")').click();
      }
    }
    
    // Check localStorage has session data
    const localStorage = await page.evaluate(() => {
      const results = window.localStorage.getItem('interview_results');
      const sessions = window.localStorage.getItem('interview_sessions');
      return { results, sessions };
    });
    
    // After completing quiz, localStorage should be updated
    // Complete the quiz
    for (let i = 5; i < 25; i++) {
      await page.locator('.option-card').first().click();
      if (i < 24) {
        await page.locator('button:has-text("下一题")').click();
      } else {
        await page.locator('button:has-text("提交答卷")').click();
      }
    }
    
    // Check localStorage is updated
    const updatedStorage = await page.evaluate(() => {
      const results = window.localStorage.getItem('interview_results');
      return results;
    });
    
    expect(updatedStorage).toBeTruthy();
    const resultsData = JSON.parse(updatedStorage);
    expect(resultsData).toBeInstanceOf(Array);
    expect(resultsData[0]).toHaveProperty('jobType', 'defi_growth');
    expect(resultsData[0]).toHaveProperty('difficulty', 'junior');
  });
  
  test('should handle mobile responsive layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto(`${BASE_URL}/mock-interview`);
    
    // Check job cards stack in single column
    const jobCards = page.locator('.job-card');
    await expect(jobCards).toHaveCount(3);
    
    // Check cards are visible
    for (let i = 0; i < 3; i++) {
      await expect(jobCards.nth(i)).toBeInViewport();
    }
    
    // Navigate to quiz
    await jobCards.first().click();
    await page.locator('.difficulty-card').first().click();
    
    // Check quiz layout on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.option-card')).toHaveCount(4);
    
    // Check answer grid wraps properly
    const answerGrid = page.locator('.grid-cols-10');
    await expect(answerGrid).toBeVisible();
  });
});

test.describe('Data Integrity Tests', () => {
  
  test('should load job index JSON correctly', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/interviews/job-index.json`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('jobs');
    expect(data).toHaveProperty('difficulties');
    expect(data).toHaveProperty('questionnaires');
    
    // Check all 3 jobs exist
    expect(Object.keys(data.jobs)).toContain('defi_growth');
    expect(Object.keys(data.jobs)).toContain('fullstack');
    expect(Object.keys(data.jobs)).toContain('seo');
    
    // Check questionnaires count
    expect(data.questionnaires).toHaveLength(9); // 3 jobs × 3 difficulties
  });
  
  test('should load question bank JSON files', async ({ page }) => {
    const questionFiles = [
      'defi_growth_junior.json',
      'defi_growth_intermediate.json',
      'defi_growth_advanced.json',
      'fullstack_junior.json',
      'seo_junior.json'
    ];
    
    for (const file of questionFiles) {
      const response = await page.goto(`${BASE_URL}/interviews/${file}`);
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('meta');
      expect(data).toHaveProperty('questions');
      expect(data.questions).toBeInstanceOf(Array);
      expect(data.questions.length).toBeGreaterThanOrEqual(25);
      
      // Check question structure
      const firstQuestion = data.questions[0];
      expect(firstQuestion).toHaveProperty('id');
      expect(firstQuestion).toHaveProperty('category');
      expect(firstQuestion).toHaveProperty('type');
      expect(firstQuestion).toHaveProperty('question');
      expect(firstQuestion).toHaveProperty('options');
      expect(firstQuestion).toHaveProperty('answer');
      expect(firstQuestion).toHaveProperty('explanation');
    }
  });
});

console.log('✅ Mock Interview System Refactoring E2E Tests Created');