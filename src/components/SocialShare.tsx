'use client';

import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

interface SocialShareProps {
  className?: string;
}

export default function SocialShare({ className = '' }: SocialShareProps) {
  const locale = useLocale();
  const [isMobile, setIsMobile] = useState(false);
  const [supportsWebShare, setSupportsWebShare] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://12factor.me';
  const shareText = locale === 'zh' 
    ? '发现了一个很棒的AI协作时代Vibe Coding10倍工程效率方法论学习平台！12Factor.me - 四阶段十二原则编程方法论'
    : 'Discover the Four-Stage Twelve-Principle Vibe Coding programming methodology for 10x engineering efficiency! 12Factor.me';

  useEffect(() => {
    // 检测是否为移动端
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    // 检测是否支持Web Share API
    setSupportsWebShare(typeof navigator !== 'undefined' && 'share' in navigator);

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 使用原生Web Share API分享
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: locale === 'zh' ? '12Factor.me - 四阶段十二原则 Vibe Coding 10 倍工程效率方法论' : '12Factor.me - Four-Stage Twelve-Principle Vibe Coding Methodology for 10x Engineering Efficiency',
        text: shareText,
        url: shareUrl,
      });
    } catch {
      // 用户取消分享或其他错误，回退到复制链接
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert(locale === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
    }
  };

  const handleShare = (platform: string) => {
    // 移动端优先使用原生分享
    if (isMobile && supportsWebShare && platform === 'native') {
      handleNativeShare();
      return;
    }

    let url = '';
    
    switch (platform) {
      case 'twitter':
        if (isMobile) {
          // 移动端尝试唤起Twitter App，如果没有安装则回退到网页
          url = `twitter://post?message=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
          setTimeout(() => {
            window.location.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          }, 1000);
        } else {
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        }
        break;
      case 'facebook':
        if (isMobile) {
          // 移动端尝试唤起Facebook App
          url = `fb://share?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
          setTimeout(() => {
            window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          }, 1000);
        } else {
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        }
        break;
      case 'wechat':
        if (isMobile) {
          // 移动端尝试唤起微信
          const wechatUrl = `weixin://dl/share?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
          window.location.href = wechatUrl;
          // 如果微信没有安装，提示复制链接
          setTimeout(() => {
            navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
            alert('链接已复制到剪贴板，请在微信中粘贴分享');
          }, 1000);
        } else {
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          alert('链接已复制到剪贴板，请在微信中粘贴分享');
        }
        return;
    }
    
    if (url && !isMobile) {
      window.open(url, '_blank', 'width=550,height=420');
    } else if (url && isMobile) {
      window.location.href = url;
    }
  };

  // 社交平台配置 - 只显示 X (Twitter)
  const getSocialPlatforms = () => {
    return [
      { 
        name: 'X', 
        iconType: 'svg' as const,
        iconPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
        handle: () => handleShare('twitter')
      }
    ];
  };

  const socialPlatforms = getSocialPlatforms();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {socialPlatforms.map((platform) => (
        <button
          key={platform.name}
          onClick={platform.handle}
          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all duration-200"
          title={`Share on ${platform.name}`}
        >
          <svg 
            className="w-5 h-5" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d={platform.iconPath} />
          </svg>
        </button>
      ))}
    </div>
  );
}
