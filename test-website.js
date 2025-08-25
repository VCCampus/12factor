const { chromium } = require('playwright');

async function testWebsite() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: 'zh-CN',
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  const baseUrl = 'https://www.12factor.me';
  
  // Test pages to analyze
  const pages = [
    { path: '/zh', name: '主页' },
    { path: '/zh/principles', name: '原则页面' },
    { path: '/zh/flashcards', name: '闪卡页面' },
    { path: '/zh/quiz', name: '测试页面' },
    { path: '/zh/prompt-engineering', name: '提示工程页面' },
    { path: '/zh/prompt-engineering/fundamentals', name: '基础课程' }
  ];
  
  console.log('开始分析 12factor.me 网站结构...\n');
  
  for (const testPage of pages) {
    console.log(`\n=== 分析 ${testPage.name} (${testPage.path}) ===`);
    
    try {
      await page.goto(`${baseUrl}${testPage.path}`, { waitUntil: 'networkidle' });
      
      // Get page title
      const title = await page.title();
      console.log(`页面标题: ${title}`);
      
      // Analyze main content structure
      const mainContent = await page.evaluate(() => {
        const main = document.querySelector('main');
        if (!main) return '未找到主要内容';
        
        const structure = {
          headings: Array.from(main.querySelectorAll('h1, h2, h3')).map(h => ({
            level: h.tagName,
            text: h.textContent.trim()
          })),
          sections: Array.from(main.querySelectorAll('section')).length,
          buttons: Array.from(main.querySelectorAll('button')).length,
          forms: Array.from(main.querySelectorAll('form')).length,
          cards: Array.from(main.querySelectorAll('[class*="card"], [class*="Card"]')).length
        };
        
        return structure;
      });
      
      console.log('内容结构:');
      console.log(`  - 标题数量: ${mainContent.headings?.length || 0}`);
      console.log(`  - 区块数量: ${mainContent.sections}`);
      console.log(`  - 按钮数量: ${mainContent.buttons}`);
      console.log(`  - 表单数量: ${mainContent.forms}`);
      console.log(`  - 卡片数量: ${mainContent.cards}`);
      
      // Check for interactive elements
      if (testPage.path.includes('flashcards')) {
        const flashcardElements = await page.evaluate(() => {
          return {
            flipButtons: document.querySelectorAll('[aria-label*="flip"], [aria-label*="翻转"]').length,
            navigationButtons: document.querySelectorAll('[aria-label*="Previous"], [aria-label*="Next"], [aria-label*="上一张"], [aria-label*="下一张"]').length,
            progressElements: document.querySelectorAll('[class*="progress"], [class*="Progress"]').length
          };
        });
        console.log('\n闪卡交互元素:');
        console.log(`  - 翻转按钮: ${flashcardElements.flipButtons}`);
        console.log(`  - 导航按钮: ${flashcardElements.navigationButtons}`);
        console.log(`  - 进度元素: ${flashcardElements.progressElements}`);
      }
      
      if (testPage.path.includes('quiz')) {
        const quizElements = await page.evaluate(() => {
          return {
            questions: document.querySelectorAll('[class*="question"], [class*="Question"]').length,
            choices: document.querySelectorAll('input[type="radio"], input[type="checkbox"]').length,
            submitButtons: document.querySelectorAll('button[type="submit"]').length
          };
        });
        console.log('\n测试交互元素:');
        console.log(`  - 问题数量: ${quizElements.questions}`);
        console.log(`  - 选项数量: ${quizElements.choices}`);
        console.log(`  - 提交按钮: ${quizElements.submitButtons}`);
      }
      
      if (testPage.path.includes('prompt-engineering')) {
        const promptElements = await page.evaluate(() => {
          return {
            editors: document.querySelectorAll('textarea, [contenteditable="true"]').length,
            codeBlocks: document.querySelectorAll('pre, code').length,
            tabs: document.querySelectorAll('[role="tab"]').length,
            panels: document.querySelectorAll('[role="tabpanel"]').length
          };
        });
        console.log('\n提示工程交互元素:');
        console.log(`  - 编辑器: ${promptElements.editors}`);
        console.log(`  - 代码块: ${promptElements.codeBlocks}`);
        console.log(`  - 标签页: ${promptElements.tabs}`);
        console.log(`  - 面板: ${promptElements.panels}`);
      }
      
      // Get navigation structure
      const navigation = await page.evaluate(() => {
        const nav = document.querySelector('nav');
        if (!nav) return null;
        
        const links = Array.from(nav.querySelectorAll('a')).map(a => ({
          text: a.textContent.trim(),
          href: a.getAttribute('href')
        }));
        
        return links;
      });
      
      if (navigation && navigation.length > 0) {
        console.log('\n导航链接:');
        navigation.forEach(link => {
          console.log(`  - ${link.text}: ${link.href}`);
        });
      }
      
    } catch (error) {
      console.error(`错误访问 ${testPage.path}: ${error.message}`);
    }
  }
  
  await browser.close();
  console.log('\n\n=== 网站分析完成 ===');
}

testWebsite().catch(console.error);