'use client';

import { useWebView } from '@/providers/WebViewProvider';
import { cn } from '@/lib/utils';

interface BackdropBlurProps {
  children: React.ReactNode;
  className?: string;
  fallbackClassName?: string;
}

export function BackdropBlur({ children, className, fallbackClassName }: BackdropBlurProps) {
  const { isWebView } = useWebView();
  
  return (
    <div className={cn(
      isWebView ? fallbackClassName : className
    )}>
      {children}
    </div>
  );
}

interface Motion3DProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Motion3D({ children, onClick, className }: Motion3DProps) {
  const { isWebView } = useWebView();
  
  if (isWebView) {
    return (
      <div 
        className={cn("relative cursor-pointer", className)}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
  
  return (
    <div 
      className={cn("preserve-3d cursor-pointer", className)}
      style={{ transformStyle: 'preserve-3d' }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}