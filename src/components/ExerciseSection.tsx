'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ExerciseData } from '@/types';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface ExerciseSectionProps {
  exercise: ExerciseData;
  exerciseNumber: number;
}

export default function ExerciseSection({ exercise, exerciseNumber }: ExerciseSectionProps) {
  const t = useTranslations('promptEngineering');
  const [userInput, setUserInput] = useState(exercise.template || '');
  const [showHints, setShowHints] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);
  const [validationMessage, setValidationMessage] = useState('');

  const validateInput = () => {
    if (!exercise.expectedPattern) {
      setValidationResult('success');
      setValidationMessage(t('exerciseCompleted'));
      return;
    }

    try {
      const regex = new RegExp(exercise.expectedPattern, 'i');
      const isValid = regex.test(userInput);
      
      if (isValid) {
        setValidationResult('success');
        setValidationMessage(t('exerciseCorrect'));
      } else {
        setValidationResult('error');
        setValidationMessage(t('exerciseIncorrect'));
      }
    } catch {
      setValidationResult('error');
      setValidationMessage(t('validationError'));
    }
  };

  const resetExercise = () => {
    setUserInput(exercise.template || '');
    setValidationResult(null);
    setValidationMessage('');
    setShowHints(false);
  };

  return (
    <div className="border border-stone-200 dark:border-gray-700 rounded-lg p-6 bg-stone-50 dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <span className="text-blue-700 dark:text-blue-400 text-sm font-semibold">
              {exerciseNumber}
            </span>
          </div>
          <h4 className="text-lg font-medium text-stone-900 dark:text-gray-100">
            {t('exercise')} {exerciseNumber}
          </h4>
        </div>
        <button
          onClick={() => setShowHints(!showHints)}
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <LightBulbIcon className="h-4 w-4" />
          {showHints ? t('hideHints') : t('showHints')}
        </button>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-stone-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          {t('instructions')}
        </h5>
        <p className="text-stone-600 dark:text-gray-400 leading-relaxed">
          {exercise.instructions}
        </p>
      </div>

      {/* Hints */}
      {showHints && exercise.hints.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
            <LightBulbIcon className="h-4 w-4" />
            {t('hints')}
          </h5>
          <ul className="space-y-2">
            {exercise.hints.map((hint, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-600 dark:bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-yellow-700 dark:text-yellow-200 text-sm">{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input Area */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-3">
          {t('yourPrompt')}
        </label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={t('enterPromptHere')}
          className="w-full h-32 px-4 py-3 border border-stone-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-stone-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={validateInput}
          disabled={!userInput.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('checkAnswer')}
        </button>
        <button
          onClick={resetExercise}
          className="btn-secondary"
        >
          {t('reset')}
        </button>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          validationResult === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
        }`}>
          {validationResult === 'success' ? (
            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`text-sm font-medium ${
              validationResult === 'success'
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}>
              {validationMessage}
            </p>
            {validationResult === 'error' && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {t('tryAgainWithHints')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}