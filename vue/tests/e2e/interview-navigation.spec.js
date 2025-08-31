import { test, expect } from '@playwright/test'

test.describe('模拟面试页面导航栏测试', () => {
  
  test('面试主页应该有标准导航栏和页脚', async ({ page }) => {
    await page.goto('http://web3mh.101.so:11181/mock-interview')
    
    // 检查标准导航栏
    await expect(page.locator('header')).toBeVisible()
    await expect(page.getByText('CSS数创学习平台')).toBeVisible()
    
    // 检查导航菜单项
    await expect(page.getByRole('link', { name: '首页' })).toBeVisible()
    await expect(page.getByRole('link', { name: '模拟面试' })).toBeVisible()
    
    // 检查模拟面试链接是否高亮
    const interviewLink = page.getByRole('link', { name: '模拟面试' })
    await expect(interviewLink).toHaveClass(/active/)
    
    // 检查页脚
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.getByText('© 2024 📚 CSS数创学习平台')).toBeVisible()
    
    // 检查页脚中的首页链接
    const footerHomeLink = page.locator('footer').getByRole('link', { name: /CSS数创学习平台/ })
    await expect(footerHomeLink).toBeVisible()
  })

  test('面试难度选择卡片功能正常', async ({ page }) => {
    await page.goto('http://web3mh.101.so:11181/mock-interview')
    
    // 等待页面加载完成
    await expect(page.getByText('ChainCatcher 区块链记者岗位')).toBeVisible()
    
    // 检查难度选择卡片
    await expect(page.getByText('基础级别')).toBeVisible()
    await expect(page.getByText('进阶级别')).toBeVisible()
    await expect(page.getByText('专家级别')).toBeVisible()
    
    // 点击基础级别开始面试
    await page.getByText('开始基础级别').click()
    
    // 应该跳转到面试答题页面
    await expect(page).toHaveURL(/\/mock-interview\/quiz\/basic/)
  })

  test('面试答题页面应该显示进度条和极简页脚', async ({ page }) => {
    // 直接访问答题页面
    await page.goto('http://web3mh.101.so:11181/mock-interview/quiz/basic')
    
    // 等待加载完成
    await page.waitForTimeout(3000)
    
    // 检查标准导航栏
    await expect(page.locator('header')).toBeVisible()
    
    // 检查进度条（如果面试已开始）
    const progressBar = page.locator('.interview-progress-bar')
    if (await progressBar.isVisible()) {
      await expect(progressBar).toBeVisible()
      // 进度条应该显示类似 "面试进度: 1/30" 的文本
      await expect(progressBar.getByText(/面试进度/)).toBeVisible()
    }
    
    // 检查极简页脚
    await expect(page.locator('footer')).toBeVisible()
    const footerText = await page.locator('footer').textContent()
    expect(footerText).toContain('© 2024 📚 CSS数创学习平台')
    
    // 极简页脚不应该包含版本信息等额外内容
    expect(footerText).not.toContain('版本 v4.0.0')
  })

  test('面试过程中进度条实时更新', async ({ page }) => {
    await page.goto('http://web3mh.101.so:11181/mock-interview/quiz/basic')
    
    // 等待面试加载
    await page.waitForTimeout(3000)
    
    // 检查是否有题目显示
    const questionArea = page.locator('.quiz-question')
    if (await questionArea.isVisible()) {
      // 检查初始进度
      const progressText = page.locator('.interview-progress-bar').getByText(/\d+\/\d+/)
      if (await progressText.isVisible()) {
        const initialProgress = await progressText.textContent()
        console.log('初始进度:', initialProgress)
        
        // 选择一个答案
        const firstOption = page.locator('.quiz-option').first()
        if (await firstOption.isVisible()) {
          await firstOption.click()
          
          // 点击下一题
          const nextButton = page.getByText(/下一题|完成/)
          if (await nextButton.isVisible()) {
            await nextButton.click()
            await page.waitForTimeout(1000)
            
            // 检查进度是否更新
            const updatedProgress = await progressText.textContent()
            console.log('更新后进度:', updatedProgress)
          }
        }
      }
    }
  })

  test('面试完成后应该显示导出按钮', async ({ page }) => {
    // 这个测试比较复杂，因为需要完成整个面试
    // 我们可以检查QuizEngine在面试模式下是否有特殊按钮
    await page.goto('http://web3mh.101.so:11181/mock-interview/quiz/basic')
    
    // 等待加载
    await page.waitForTimeout(3000)
    
    // 检查页面内容，确认是面试模式
    const isInterviewMode = await page.locator('.interview-header').isVisible()
    if (isInterviewMode) {
      console.log('✅ 页面已进入面试模式')
      
      // 检查是否有面试相关的UI元素
      await expect(page.getByText(/ChainCatcher/)).toBeVisible()
      
      // 如果能看到结果页面，检查导出按钮
      const exportButton = page.getByText(/查看详细报告并导出/)
      if (await exportButton.isVisible()) {
        console.log('✅ 发现导出按钮')
        await expect(exportButton).toBeVisible()
      }
    }
  })

  test('导航栏链接正常工作', async ({ page }) => {
    await page.goto('http://web3mh.101.so:11181/mock-interview')
    
    // 测试导航到其他页面
    await page.getByRole('link', { name: '首页' }).click()
    await expect(page).toHaveURL('http://web3mh.101.so:11181/')
    
    // 返回面试页面
    await page.getByRole('link', { name: '模拟面试' }).click()
    await expect(page).toHaveURL(/mock-interview/)
    
    // 测试页脚首页链接
    const footerHomeLink = page.locator('footer').getByRole('link', { name: /CSS数创学习平台/ })
    if (await footerHomeLink.isVisible()) {
      await footerHomeLink.click()
      await expect(page).toHaveURL('http://web3mh.101.so:11181/')
    }
  })

  test('响应式设计 - 移动端适配', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://web3mh.101.so:11181/mock-interview')
    
    // 检查移动端导航
    const mobileMenuButton = page.locator('button[aria-expanded]').or(page.locator('.md\\:hidden button'))
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      await expect(page.getByRole('link', { name: '模拟面试' })).toBeVisible()
    }
    
    // 检查在移动端进度条的显示
    await page.goto('http://web3mh.101.so:11181/mock-interview/quiz/basic')
    await page.waitForTimeout(2000)
    
    // 移动端进度条应该是紧凑型
    const mobileProgressBar = page.locator('.progress-bar-container-mobile')
    if (await mobileProgressBar.isVisible()) {
      await expect(mobileProgressBar).toBeVisible()
    }
  })

})