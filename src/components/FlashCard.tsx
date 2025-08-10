'use client';

import { motion } from 'framer-motion';
import { useTranslations, useMessages } from 'next-intl';
import { Principle } from '@/types';

interface FlashCardProps {
  principle: Principle;
  onNext: () => void;
  onPrevious: () => void;
  showNavigation?: boolean;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ 
  principle, 
  onNext, 
  onPrevious, 
  showNavigation = true,
  isFlipped,
  onFlip
}: FlashCardProps) {
  const t = useTranslations('principles');
  const tQuiz = useTranslations('quiz');
  const tFlash = useTranslations('flashcards');
  const messages = useMessages() as {
    quiz?: Record<string, {
      name?: string;
      concept?: string;
      practices?: string[];
      antiPatterns?: string[];
    }>;
  };

  const stageColors = {
    1: 'from-[#95a76f]/20 to-[#95a76f]/30',
    2: 'from-[#95a76f]/25 to-[#95a76f]/35', 
    3: 'from-[#95a76f]/30 to-[#95a76f]/40',
    4: 'from-[#95a76f]/35 to-[#95a76f]/45'
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Card */}
      <div className="relative h-96 mb-6">
        <motion.div
          className="absolute inset-0 cursor-pointer preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onClick={onFlip}
        >
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden">
            <div className={`h-full bg-gradient-to-br ${stageColors[principle.stage as keyof typeof stageColors]} backdrop-blur-sm rounded-xl shadow-2xl p-8 text-stone-800 flex flex-col justify-center border border-[#95a76f]/20`}>
              <div className="text-center">
                <div className="text-sm opacity-70 mb-2 font-medium">
                  {tFlash('stage')} {principle.stage}
                </div>
                <h2 className="text-3xl font-bold mb-6 text-stone-900">
                  {tQuiz(`${principle.messageKey}.name`)}
                </h2>
                <div className="text-lg opacity-80 text-stone-700">
                  {tQuiz(`${principle.messageKey}.concept`)}
                </div>
                <div className="mt-8 text-sm opacity-60 text-stone-600">
                  {tFlash('flip')}
                </div>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
            <div className="h-full bg-gradient-to-br from-stone-50 to-[#95a76f]/10 dark:from-stone-800 dark:to-[#95a76f]/20 rounded-xl shadow-2xl p-8 flex flex-col justify-center border border-[#95a76f]/30 dark:border-[#95a76f]/40">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#95a76f] dark:text-[#95a76f]/90 mb-3">
                    {t('practices')}
                  </h3>
                  <ul className="space-y-2">
                    {(messages.quiz?.[principle.messageKey]?.practices || []).map((practice: string, index: number) => (
                      <li key={index} className="flex items-start text-stone-700 dark:text-stone-300">
                        <span className="text-[#95a76f] mr-3 mt-1">✓</span>
                        <span className="text-sm">{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-400 mb-3">
                    {t('antiPatterns')}
                  </h3>
                  <ul className="space-y-2">
                    {(messages.quiz?.[principle.messageKey]?.antiPatterns || []).map((pattern: string, index: number) => (
                      <li key={index} className="flex items-start text-stone-700 dark:text-stone-300">
                        <span className="text-stone-600 mr-3 mt-1">✗</span>
                        <span className="text-sm">{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="text-center mt-6 text-sm text-stone-500 dark:text-stone-400">
                {tFlash('flipBack')}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            className="px-6 py-3 bg-stone-200 hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600 rounded-full text-stone-700 dark:text-stone-300 transition-all duration-200 font-medium"
          >
            {tFlash('previous')}
          </button>
          
          <div className="text-sm text-stone-500 dark:text-stone-400 font-medium">
            {tFlash('principleOf', { current: principle.id, total: 12 })}
          </div>
          
          <button
            onClick={onNext}
            disabled={!isFlipped}
            className={`px-6 py-3 rounded-full transition-all duration-200 font-medium shadow-lg ${
              isFlipped
                ? 'bg-[#95a76f] hover:bg-[#95a76f]/90 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            {tFlash('next')}
          </button>
        </div>
      )}
    </div>
  );
}