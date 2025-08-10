'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MetaTags {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export default function TestSocialPage() {
  const [metaTags, setMetaTags] = useState<MetaTags>({});

  useEffect(() => {
    // Extract meta tags from document
    const extractMetaTags = () => {
      const tags: MetaTags = {};
      
      // Basic meta tags
      const titleEl = document.querySelector('title');
      const descriptionEl = document.querySelector('meta[name="description"]');
      
      if (titleEl) tags.title = titleEl.textContent || '';
      if (descriptionEl) tags.description = descriptionEl.getAttribute('content') || '';
      
      // Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      
      if (ogTitle) tags.ogTitle = ogTitle.getAttribute('content') || '';
      if (ogDescription) tags.ogDescription = ogDescription.getAttribute('content') || '';
      if (ogImage) tags.ogImage = ogImage.getAttribute('content') || '';
      if (ogUrl) tags.ogUrl = ogUrl.getAttribute('content') || '';
      
      // Twitter tags
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      
      if (twitterCard) tags.twitterCard = twitterCard.getAttribute('content') || '';
      if (twitterTitle) tags.twitterTitle = twitterTitle.getAttribute('content') || '';
      if (twitterDescription) tags.twitterDescription = twitterDescription.getAttribute('content') || '';
      if (twitterImage) tags.twitterImage = twitterImage.getAttribute('content') || '';
      
      return tags;
    };
    
    setMetaTags(extractMetaTags());
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">社交卡片元数据测试页面</h1>
        
        <div className="space-y-8">
          {/* Basic Meta Tags */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">基础元数据</h2>
            <div className="space-y-2">
              <div><strong>Title:</strong> {metaTags.title}</div>
              <div><strong>Description:</strong> {metaTags.description}</div>
            </div>
          </div>

          {/* Open Graph */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Open Graph (Facebook, LinkedIn等)</h2>
            <div className="space-y-2">
              <div><strong>og:title:</strong> {metaTags.ogTitle}</div>
              <div><strong>og:description:</strong> {metaTags.ogDescription}</div>
              <div><strong>og:image:</strong> {metaTags.ogImage}</div>
              <div><strong>og:url:</strong> {metaTags.ogUrl}</div>
            </div>
          </div>

          {/* Twitter Card */}
          <div className="bg-cyan-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Twitter Card</h2>
            <div className="space-y-2">
              <div><strong>twitter:card:</strong> {metaTags.twitterCard}</div>
              <div><strong>twitter:title:</strong> {metaTags.twitterTitle}</div>
              <div><strong>twitter:description:</strong> {metaTags.twitterDescription}</div>
              <div><strong>twitter:image:</strong> {metaTags.twitterImage}</div>
            </div>
          </div>

          {/* Social Preview Simulation */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">社交分享预览效果</h2>
            <div className="border rounded-lg p-4 bg-white max-w-md">
              {metaTags.ogImage && (
                <div className="mb-3">
                  <Image 
                    src={metaTags.ogImage} 
                    alt="Social preview" 
                    width={400}
                    height={128}
                    className="w-full h-32 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="font-semibold text-sm mb-1">{metaTags.ogTitle}</div>
              <div className="text-gray-600 text-xs mb-2">{metaTags.ogDescription}</div>
              <div className="text-gray-400 text-xs">{metaTags.ogUrl}</div>
            </div>
          </div>

          {/* Test Links */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">测试不同页面</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="text-blue-600 hover:underline">首页</Link>
              <Link href="/principles" className="text-blue-600 hover:underline">原则页面</Link>
              <Link href="/flashcards" className="text-blue-600 hover:underline">抽认卡页面</Link>
              <Link href="/quiz" className="text-blue-600 hover:underline">测验页面</Link>
              <Link href="/zh" className="text-blue-600 hover:underline">中文首页</Link>
              <Link href="/zh/principles" className="text-blue-600 hover:underline">中文原则页面</Link>
            </div>
          </div>

          {/* External Validation Tools */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">外部验证工具</h2>
            <p className="mb-4">使用以下工具验证社交卡片：</p>
            <div className="space-y-2">
              <div>
                <strong>Facebook 分享调试器:</strong> 
                <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                  https://developers.facebook.com/tools/debug/
                </a>
              </div>
              <div>
                <strong>Twitter Card 验证器:</strong> 
                <a href="https://cards-dev.twitter.com/validator" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                  https://cards-dev.twitter.com/validator
                </a>
              </div>
              <div>
                <strong>LinkedIn Post Inspector:</strong> 
                <a href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                  https://www.linkedin.com/post-inspector/
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}