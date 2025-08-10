'use client';

import React, { createContext, useContext } from 'react';
import { useWebViewDetection } from '@/hooks/useWebViewDetection';

interface WebViewContextType {
  isWebView: boolean;
  shouldReduceMotion: boolean;
  shouldSimplifyEffects: boolean;
}

const WebViewContext = createContext<WebViewContextType>({
  isWebView: false,
  shouldReduceMotion: false,
  shouldSimplifyEffects: false,
});

export function WebViewProvider({ children }: { children: React.ReactNode }) {
  const isWebView = useWebViewDetection();
  
  const contextValue: WebViewContextType = {
    isWebView,
    shouldReduceMotion: isWebView,
    shouldSimplifyEffects: isWebView,
  };

  return (
    <WebViewContext.Provider value={contextValue}>
      {children}
    </WebViewContext.Provider>
  );
}

export function useWebView() {
  return useContext(WebViewContext);
}