'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PromptLesson } from '@/types';
import ExerciseSection from './ExerciseSection';

interface LessonCardProps {
  lesson: PromptLesson;
}

export default function LessonCard({ lesson }: LessonCardProps) {
  const t = useTranslations('promptEngineering');
  const [activeTab, setActiveTab] = useState<'theory' | 'examples' | 'exercises'>('theory');

  const tabs = [
    { id: 'theory', label: t('theory') },
    { id: 'examples', label: t('examples') },
    ...(lesson.content.exercises && lesson.content.exercises.length > 0 
      ? [{ id: 'exercises', label: t('exercises') }] 
      : [])
  ];

  return (
    <div className="modern-card">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
          <span className="text-blue-700 dark:text-blue-400 font-bold text-xl">{lesson.id}</span>
        </div>
        <div>
          <div className="text-stone-500 dark:text-gray-500 text-sm font-medium">
            {t('lesson')} {lesson.id} • {t('chapter')} {lesson.chapter}
          </div>
          <h2 className="text-3xl font-medium text-stone-900 dark:text-gray-100">
            {t(`lesson${lesson.id}.title`)}
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 dark:border-gray-700 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'theory' | 'examples' | 'exercises')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-stone-600 dark:text-gray-400 hover:text-stone-800 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {activeTab === 'theory' && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-stone-700 dark:text-gray-300 leading-relaxed">
              {lesson.content.theory}
            </p>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-stone-900 dark:text-gray-100 mb-4">
              {t('practicalExamples')}
            </h3>
            <div className="space-y-4">
              {(Array.isArray(lesson.content.examples) ? lesson.content.examples : lesson.content.examples ? [lesson.content.examples] : [])?.map((example, index) => (
                <div
                  key={index}
                  className="bg-stone-50 dark:bg-gray-800 rounded-lg p-4 border border-stone-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-700 dark:text-blue-400 text-xs font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-stone-700 dark:text-gray-300 text-sm font-mono leading-relaxed">
                      {example}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exercises' && lesson.content.exercises && (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-stone-900 dark:text-gray-100 mb-4">
              {t('practiceExercises')}
            </h3>
            {lesson.content.exercises.map((exercise, index) => (
              <ExerciseSection
                key={exercise.id}
                exercise={exercise}
                exerciseNumber={index + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Prerequisites */}
      {lesson.prerequisites && lesson.prerequisites.length > 0 && (
        <div className="mt-8 pt-6 border-t border-stone-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-stone-700 dark:text-gray-300 mb-3">
            {t('prerequisites')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {lesson.prerequisites.map((prereqId) => (
              <span
                key={prereqId}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-gray-800 text-stone-700 dark:text-gray-300"
              >
                {t('lesson')} {prereqId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}