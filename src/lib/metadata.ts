import type { Metadata } from 'next';

export interface MetadataConfig {
  title: string;
  description: string;
  path?: string;
  locale?: string;
  image?: string;
}

export function generateMetadata({
  title,
  description,
  path = '',
  locale = 'en',
  image,
}: MetadataConfig): Metadata {
  const siteName = '12Factor.me';
  const baseUrl = 'https://12factor.me';
  const fullUrl = `${baseUrl}${path}`;
  
  // Locale-specific configurations
  const isZh = locale === 'zh';
  const ogLocale = isZh ? 'zh_CN' : 'en_US';
  
  // Choose image based on locale if not explicitly provided
  const defaultImage = isZh ? '/og-image-zh.png' : '/og-image.png';
  const selectedImage = image || defaultImage;
  
  // Convert relative image path to absolute URL
  const absoluteImageUrl = selectedImage.startsWith('http') ? selectedImage : `https://12factor.me${selectedImage}`;
  
  // Enhanced titles and descriptions for social sharing
  const enhancedTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const socialDescription = isZh 
    ? `${description} | Vibe Coding 编程方法论，10x Engineering 效率提升，AI协作时代的交互式学习平台。`
    : `${description} | Vibe Coding methodology for 10x Engineering efficiency. Interactive AI collaboration platform with gamified learning.`;

  return {
    title: enhancedTitle,
    description: socialDescription,
    // Open Graph metadata for Facebook, LinkedIn, etc.
    openGraph: {
      title: enhancedTitle,
      description: socialDescription,
      url: fullUrl,
      siteName,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: enhancedTitle,
        },
      ],
      locale: ogLocale,
      type: 'website',
    },
    // Twitter Card metadata - ensure all required fields
    twitter: {
      card: 'summary_large_image',
      title: enhancedTitle,
      description: socialDescription,
      images: [absoluteImageUrl],
      site: '@wquguru',
      creator: '@wquguru',
    },
    // Additional metadata
    alternates: {
      canonical: fullUrl,
      languages: {
        'en': `${baseUrl}/en${path}`,
        'zh': `${baseUrl}/zh${path}`,
      },
    },
  };
}

// Default metadata configurations for different page types
export const defaultMetadata = {
  home: {
    en: {
      title: "12Factor.me - Vibe Coding for 10x Engineering",
      description: "Master Vibe Coding methodology and achieve 10x Engineering efficiency. Four-stage twelve-principle programming for the AI collaboration era.",
    },
    zh: {
      title: "12Factor.me - Vibe Coding 实现 10x Engineering",
      description: "掌握 Vibe Coding 编程方法论，实现 10x Engineering 效率提升。AI协作时代四阶段十二原则编程体系。",
    },
  },
  principles: {
    en: {
      title: "Vibe Coding Principles - 10x Engineering Guide",
      description: "Discover 12 core Vibe Coding principles for 10x Engineering productivity. Strategic programming methodology for AI collaboration era.",
    },
    zh: {
      title: "Vibe Coding 原则 - 10x Engineering 指南", 
      description: "探索 12 个核心 Vibe Coding 原则，实现 10x Engineering 生产力。AI协作时代的战略编程方法论。",
    },
  },
  flashcards: {
    en: {
      title: "Vibe Coding Flashcards - 10x Engineering Training",
      description: "Master Vibe Coding principles through interactive flashcards. Build your 10x Engineering skills with gamified learning.",
    },
    zh: {
      title: "Vibe Coding 抽认卡 - 10x Engineering 训练",
      description: "通过交互式抽认卡掌握 Vibe Coding 原则。用游戏化学习构建你的 10x Engineering 技能。",
    },
  },
  quiz: {
    en: {
      title: "Vibe Coding Quiz - Test Your 10x Engineering Skills",
      description: "Challenge your Vibe Coding knowledge and validate your 10x Engineering capabilities with comprehensive programming methodology quiz.",
    },
    zh: {
      title: "Vibe Coding 测验 - 测试你的 10x Engineering 技能", 
      description: "挑战你的 Vibe Coding 知识，通过全面的编程方法论测验验证你的 10x Engineering 能力。",
    },
  },
} as const;