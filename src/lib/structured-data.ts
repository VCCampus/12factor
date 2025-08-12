export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '12Factor.me',
    description: 'Vibe Coding methodology for 10x Engineering efficiency. Four-stage twelve-principle programming for the AI collaboration era.',
    url: 'https://12factor.me',
    logo: 'https://12factor.me/favicon.png',
    sameAs: [
      'https://twitter.com/wquguru',
      'https://github.com/wquguru/12factor',
    ],
    founder: {
      '@type': 'Person',
      name: 'wquguru',
      url: 'https://twitter.com/wquguru',
    },
  };
}

export function generateCourseSchema(locale: string = 'en') {
  const isZh = locale === 'zh';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: isZh ? '12Factor Vibe Coding 方法论' : '12Factor Vibe Coding Methodology',
    description: isZh 
      ? '掌握 Vibe Coding 编程方法论，实现 10x Engineering 效率提升。AI协作时代四阶段十二原则编程体系。'
      : 'Master Vibe Coding methodology and achieve 10x Engineering efficiency. Four-stage twelve-principle programming for the AI collaboration era.',
    provider: {
      '@type': 'Organization',
      name: '12Factor.me',
      url: 'https://12factor.me',
    },
    url: `https://12factor.me${locale === 'zh' ? '/zh' : ''}`,
    courseMode: 'online',
    educationalLevel: isZh ? '中级' : 'Intermediate',
    programmingLanguage: 'Multiple',
    teaches: [
      isZh ? 'AI协作编程' : 'AI Collaboration Programming',
      isZh ? '开发效率提升' : 'Developer Productivity',
      isZh ? '编程方法论' : 'Programming Methodology',
      isZh ? '提示词工程' : 'Prompt Engineering',
    ],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT10H',
    },
  };
}

export function generateFAQSchema(locale: string = 'en') {
  const isZh = locale === 'zh';
  
  const faqs = isZh ? [
    {
      question: '什么是 Vibe Coding？',
      answer: 'Vibe Coding 是一种面向AI协作时代的编程方法论，通过四个阶段十二个原则，帮助开发者实现10倍效率提升。',
    },
    {
      question: '12Factor 方法论适合谁？',
      answer: '适合所有希望提升编程效率的开发者，特别是使用AI工具（如ChatGPT、Claude、Copilot）进行编程的工程师。',
    },
    {
      question: '如何开始学习12Factor？',
      answer: '从了解12个核心原则开始，然后通过互动式闪卡和测验来巩固学习，最后在实际项目中应用这些原则。',
    },
  ] : [
    {
      question: 'What is Vibe Coding?',
      answer: 'Vibe Coding is a programming methodology for the AI collaboration era, helping developers achieve 10x efficiency through four stages and twelve principles.',
    },
    {
      question: 'Who is the 12Factor methodology for?',
      answer: 'It\'s for all developers who want to improve their programming efficiency, especially engineers using AI tools like ChatGPT, Claude, or Copilot.',
    },
    {
      question: 'How do I start learning 12Factor?',
      answer: 'Start by understanding the 12 core principles, reinforce learning through interactive flashcards and quizzes, then apply these principles in real projects.',
    },
  ];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(path: string, locale: string = 'en') {
  const isZh = locale === 'zh';
  const baseUrl = 'https://12factor.me';
  const localePrefix = isZh ? '/zh' : '';
  
  const pathMap: Record<string, string> = {
    '/': isZh ? '首页' : 'Home',
    '/principles': isZh ? '原则' : 'Principles',
    '/flashcards': isZh ? '闪卡' : 'Flashcards',
    '/quiz': isZh ? '测验' : 'Quiz',
  };
  
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: pathMap['/'],
      item: `${baseUrl}${localePrefix}`,
    },
  ];
  
  if (path !== '/' && pathMap[path]) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: pathMap[path],
      item: `${baseUrl}${localePrefix}${path}`,
    });
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

export function generateLearningResourceSchema(locale: string = 'en') {
  const isZh = locale === 'zh';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: isZh ? '12Factor Vibe Coding 学习资源' : '12Factor Vibe Coding Learning Resources',
    description: isZh
      ? '交互式学习平台，包含原则讲解、闪卡练习和知识测验'
      : 'Interactive learning platform with principles, flashcards, and quizzes',
    url: `https://12factor.me${isZh ? '/zh' : ''}`,
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'teaches',
      targetName: isZh ? 'AI协作编程' : 'AI Collaboration Programming',
    },
    learningResourceType: ['Interactive Resource', 'Practice Material', 'Quiz'],
    interactivityType: 'active',
    isAccessibleForFree: true,
    license: 'https://opensource.org/license/mit',
  };
}