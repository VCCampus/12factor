'use client';

import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SocialShareProps {
  className?: string;
}

export default function SocialShare({ className = '' }: SocialShareProps) {
  const locale = useLocale();
  const [isMobile, setIsMobile] = useState(false);
  const [supportsWebShare, setSupportsWebShare] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://12factor.me';
  const shareText = locale === 'zh' 
    ? '发现了一个很棒的AI协作时代编程方法论学习平台！12Factor.me - 四阶段十二原则编程方法论'
    : 'Discover the Four-Stage Twelve-Principle programming methodology for the AI collaboration era! 12Factor.me';

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
        title: locale === 'zh' ? '12Factor.me - 四阶段十二原则编程方法论' : '12Factor.me - Four-Stage Twelve-Principle Programming Methodology',
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
      case 'instagram':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert(locale === 'zh' ? '链接已复制到剪贴板，请在Instagram中粘贴分享' : 'Link copied to clipboard, please paste in Instagram');
        return;
      case 'xiaohongshu':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert('链接已复制到剪贴板，请在小红书中粘贴分享');
        return;
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

  // 社交平台配置
  const getSocialPlatforms = () => {
    const basePlatforms = locale === 'zh' 
      ? [
          { 
            name: 'Twitter', 
            iconType: 'svg' as const,
            iconPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
            handle: () => handleShare('twitter')
          },
          { 
            name: '小红书', 
            iconType: 'image' as const,
            iconSrc: '/red.svg',
            handle: () => handleShare('xiaohongshu')
          },
          { 
            name: '微信', 
            iconType: 'image' as const,
            iconSrc: '/wechat.svg',
            handle: () => handleShare('wechat')
          }
        ]
      : [
          { 
            name: 'Twitter', 
            iconType: 'svg' as const,
            iconPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
            handle: () => handleShare('twitter')
          },
          { 
            name: 'Facebook', 
            iconType: 'svg' as const,
            iconPath: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
            handle: () => handleShare('facebook')
          },
          { 
            name: 'Instagram', 
            iconType: 'image' as const,
            iconSrc: '/instagram.svg',
            handle: () => handleShare('instagram')
          }
        ];

    // 如果是移动端且支持原生分享，在前面添加通用分享按钮
    if (isMobile && supportsWebShare) {
      return [
        {
          name: locale === 'zh' ? '分享' : 'Share',
          iconType: 'svg' as const,
          iconPath: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z',
          handle: () => handleShare('native')
        },
        ...basePlatforms
      ];
    }

    return basePlatforms;
  };

  const socialPlatforms = getSocialPlatforms();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {socialPlatforms.map((platform, index) => (
        <button
          key={platform.name}
          onClick={platform.handle}
          className={`p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all duration-200 ${
            // Hide individual social platform icons on mobile, but show the native share button (first item)
            isMobile && index > 0 ? 'hidden' : ''
          }`}
          title={`Share on ${platform.name}`}
        >
          {platform.iconType === 'svg' ? (
            <svg 
              className="w-5 h-5" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d={platform.iconPath} />
            </svg>
          ) : (
            <Image
              src={platform.iconSrc}
              alt={platform.name}
              width={20}
              height={20}
              className="w-5 h-5"
            />
          )}
        </button>
      ))}
    </div>
  );
}