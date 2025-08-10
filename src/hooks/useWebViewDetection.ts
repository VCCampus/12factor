'use client';

import { useEffect, useState } from 'react';

// Extend Navigator interface for iOS standalone property
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

export function useWebViewDetection() {
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    const webViewPatterns = [
      'twitter',
      'fbav',
      'fban',
      'instagram',
      'linkedin',
      'micromessenger',
      'wechat',
      'weibo',
      'line',
      'telegram',
      'snapchat',
      'pinterest',
      'reddit',
      'discord',
      'whatsapp'
    ];
    
    const isInWebView = webViewPatterns.some(pattern => userAgent.includes(pattern)) ||
                        (window.navigator.standalone === false) ||
                        (document.referrer && document.referrer.includes('//t.co/')) ||
                        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches === false);
    
    setIsWebView(isInWebView);
  }, []);

  return isWebView;
}