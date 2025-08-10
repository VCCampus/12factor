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
    1: 'from-green-100 to-green-200',
    2: 'from-green-100 to-green-200', 
    3: 'from-green-100 to-green-200',
    4: 'from-green-100 to-green-200'
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
            <div className={`h-full bg-gradient-to-br ${stageColors[principle.stage as keyof typeof stageColors]} rounded-xl shadow-2xl p-8 text-stone-800 flex flex-col justify-center`}>
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
            <div className="h-full bg-stone-50 dark:bg-stone-800 rounded-xl shadow-2xl p-8 flex flex-col justify-center border border-stone-200 dark:border-stone-700">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-3">
                    {t('practices')}
                  </h3>
                  <ul className="space-y-2">
                    {(messages.quiz?.[principle.messageKey]?.practices || []).map((practice: string, index: number) => (
                      <li key={index} className="flex items-start text-stone-700 dark:text-stone-300">
                        <span className="text-green-600 mr-3 mt-1">✓</span>
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
                ? 'bg-green-700 hover:bg-stone-900 text-white cursor-pointer'
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