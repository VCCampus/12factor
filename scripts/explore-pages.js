const { chromium } = require('playwright');

async function explorePages() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const pages = [
    { url: 'https://www.12factor.me/zh', name: '首页' },
    { url: 'https://www.12factor.me/zh/principles', name: '原则' },
    { url: 'https://www.12factor.me/zh/flashcards', name: '闪卡' },
    { url: 'https://www.12factor.me/zh/quiz', name: '测试' }
  ];

  console.log('=== 12factor.me 页面结构分析 ===\n');

  for (const pageInfo of pages) {
    console.log(`\n--- ${pageInfo.name} (${pageInfo.url}) ---`);
    
    try {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
      
      // 获取页面标题
      const title = await page.title();
      console.log(`标题: ${title}`);
      
      // 分析主要结构
      const mainStructure = await page.evaluate(() => {
        const result = {
          navigation: [],
          mainSections: [],
          interactiveElements: []
        };
        
        // 导航元素
        const navLinks = document.querySelectorAll('nav a, header a');
        navLinks.forEach(link => {
          const text = link.textContent.trim();
          if (text) result.navigation.push(text);
        });
        
        // 主要区块
        const sections = document.querySelectorAll('main > div, section, [class*="section"], [class*="container"]');
        sections.forEach(section => {
          const heading = section.querySelector('h1, h2, h3');
          if (heading) {
            result.mainSections.push(heading.textContent.trim());
          }
        });
        
        // 交互元素
        const buttons = document.querySelectorAll('button, [role="button"]');
        const forms = document.querySelectorAll('form');
        result.interactiveElements.push(`按钮: ${buttons.length}个`);
        result.interactiveElements.push(`表单: ${forms.length}个`);
        
        return result;
      });
      
      console.log('\n导航元素:', mainStructure.navigation.slice(0, 10).join(', '));
      console.log('主要区块:', mainStructure.mainSections.slice(0, 10).join(', '));
      console.log('交互元素:', mainStructure.interactiveElements.join(', '));
      
      // 获取页面主要内容结构
      const contentStructure = await page.evaluate(() => {
        const body = document.body;
        function getStructure(element, depth = 0, maxDepth = 3) {
          if (depth > maxDepth) return '';
          
          const tagName = element.tagName.toLowerCase();
          const classList = element.classList.length > 0 ? `.${Array.from(element.classList).join('.')}` : '';
          const id = element.id ? `#${element.id}` : '';
          
          // 只显示重要的结构元素
          const importantTags = ['header', 'nav', 'main', 'section', 'article', 'footer', 'div'];
          if (!importantTags.includes(tagName)) return '';
          
          const children = Array.from(element.children)
            .map(child => getStructure(child, depth + 1, maxDepth))
            .filter(s => s)
            .join('\n');
          
          const indent = '  '.repeat(depth);
          const structure = `${indent}${tagName}${id}${classList}`;
          
          return children ? `${structure}\n${children}` : structure;
        }
        
        return getStructure(body, 0, 2);
      });
      
      console.log('\n简化DOM结构预览:');
      console.log(contentStructure.split('\n').slice(0, 20).join('\n'));
      
    } catch (error) {
      console.log(`错误: ${error.message}`);
    }
  }

  await browser.close();
}

explorePages().catch(console.error);