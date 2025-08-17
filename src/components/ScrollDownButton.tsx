'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ScrollDownButtonProps {
  targetId: string;
  label: string;
}

export default function ScrollDownButton({ targetId, label }: ScrollDownButtonProps) {
  const handleScroll = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleScroll}
      className="group flex flex-col items-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
      aria-label="Scroll to lessons"
    >
      <div className="text-xs sm:text-sm font-medium mb-2 opacity-80 group-hover:opacity-100 whitespace-nowrap px-2">
        {label}
      </div>
      <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/50 transition-all duration-300">
        <ChevronDownIcon className="h-5 w-5 animate-bounce" />
      </div>
    </button>
  );
}