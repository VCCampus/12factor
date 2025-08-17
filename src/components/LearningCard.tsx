'use client';

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, BookOpenIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import InteractivePromptEditor from './InteractivePromptEditor';

interface LearningContent {
  id: string;
  title: string;
  theory: string;
  examples: string[];
  exercises?: Array<{
    id: string;
    instructions: string;
    template?: string;
    hints: string[];
  }>;
  practiceCount?: number;
}

interface PracticeContent {
  id: string;
  title: string;
  description: string;
  systemPrompt?: string;
  userPrompt?: string;
  variants: Array<{
    name: string;
    prompt: string;
    explanation: string;
  }>;
  expectedOutput: string;
  hints?: string[];
}

interface LearningCardProps {
  learningContent: LearningContent[];
  practiceContent: PracticeContent[];
  currentIndex: number;
  currentMode?: 'learning' | 'practice';
  onNext: () => void;
  onPrev: () => void;
  onModeChange?: (mode: 'learning' | 'practice') => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}


export default function LearningCard({
  learningContent,
  practiceContent,
  currentIndex,
  currentMode = 'learning',
  onNext,
  onPrev,
  onModeChange,
  canGoNext,
  canGoPrev
}: LearningCardProps) {
  const t = useTranslations('promptEngineering');
  const mode = currentMode;

  const currentLearningItem = learningContent[currentIndex];
  const currentPracticeItem = practiceContent[currentIndex];
  
  // Use practice content length for practice mode navigation
  const totalItems = mode === 'practice' ? practiceContent.length : learningContent.length;


  return (
    <div className="max-w-4xl mx-auto">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-2 flex gap-2">
          <button
            onClick={() => onModeChange?.('learning')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              mode === 'learning'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-[#98a971]'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <BookOpenIcon className="h-4 w-4" />
            {t('learningMode')}
          </button>
          <button
            onClick={() => onModeChange?.('practice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              mode === 'practice'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-[#98a971]'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <BeakerIcon className="h-4 w-4" />
            {t('practiceMode')}
          </button>
        </div>
      </div>

      {/* Card Container */}
      <div 
        id="learning-card"
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {mode === 'learning' && currentLearningItem && (
          <div className="p-8">
            {/* Learning Content Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[#98a971]/20 rounded-xl flex items-center justify-center">
                <BookOpenIcon className="h-6 w-6 text-[#98a971]" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {currentLearningItem.title}
                </h2>
                <p className="text-sm text-[#98a971] font-medium">{t('learningContent')}</p>
              </div>
            </div>

            {/* Theory Section */}
            <div className="mb-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {currentLearningItem.theory}
                </p>
              </div>
            </div>

            {/* Examples Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                {t('promptExamples')}
              </h3>
              <div className="space-y-3">
                {currentLearningItem.examples.map((example, exIndex) => (
                  <div key={exIndex} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
                    <code className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed block">
                      {example}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercises Section */}
            {!!(currentLearningItem.practiceCount && currentLearningItem.practiceCount > 0) && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  {t('practicalExercises')} ({currentLearningItem.practiceCount} {t('exercises')})
                </h3>
                <div className="space-y-4">
                  {currentLearningItem.exercises?.map((exercise) => (
                    <div key={exercise.id} className="bg-[#98a971]/5 dark:bg-[#98a971]/10 rounded-xl p-6 border border-[#98a971]/20">
                      <div className="flex items-center gap-2 mb-4">
                        <h5 className="font-medium text-[#98a971] text-lg">
                          {exercise.instructions}
                        </h5>
                        {exercise.hints && exercise.hints.length > 0 && (
                          <div className="relative group">
                            <button className="text-[#98a971] hover:text-[#98a971]/80 transition-colors">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-80 max-w-xs">
                              <div className="space-y-2">
                                {exercise.hints.map((hint, hintIndex) => (
                                  <div key={hintIndex} className="flex items-start gap-2">
                                    <span className="text-[#98a971] mt-1 text-xs flex-shrink-0">▶</span>
                                    <span className="leading-relaxed text-xs">{hint}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      {exercise.template && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <code className="text-sm text-gray-600 dark:text-gray-400 block">
                            {exercise.template}
                          </code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'practice' && currentPracticeItem && (
          <div className="p-8">
            {/* Practice Content Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[#98a971]/20 rounded-xl flex items-center justify-center">
                <BeakerIcon className="h-6 w-6 text-[#98a971]" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {currentPracticeItem.title}
                </h2>
                <p className="text-sm text-[#98a971] font-medium">{t('interactiveExercise')}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {currentPracticeItem.description}
              </p>
            </div>

            {/* Interactive Editor */}
            <InteractivePromptEditor 
              example={{
                id: currentPracticeItem.id,
                title: currentPracticeItem.title,
                description: currentPracticeItem.description,
                systemPrompt: currentPracticeItem.systemPrompt || '',
                userPrompt: currentPracticeItem.userPrompt || 'Enter your prompt here...',
                expectedOutput: currentPracticeItem.expectedOutput,
                hints: currentPracticeItem.hints || [],
                variations: currentPracticeItem.variants?.map(variant => ({
                  name: variant.name,
                  prompt: variant.prompt || '',
                  explanation: variant.explanation
                })) || []
              }} 
            />
          </div>
        )}

        {/* Navigation */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-6">
          <div className="flex justify-between items-center">
            <button
              onClick={onPrev}
              disabled={!canGoPrev}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                canGoPrev
                  ? 'text-[#98a971] hover:bg-[#98a971]/10'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              {t('previous')}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentIndex + 1} / {totalItems}
              </span>
            </div>

            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                canGoNext
                  ? 'text-[#98a971] hover:bg-[#98a971]/10'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {t('next')}
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}