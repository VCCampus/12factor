'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  PlayIcon, 
  ArrowPathIcon, 
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface PromptExample {
  id: string;
  title: string;
  description: string;
  systemPrompt?: string;
  userPrompt: string;
  expectedOutput: string;
  hints: string[];
  variations: {
    name: string;
    prompt: string;
    explanation: string;
  }[];
}

interface InteractivePromptEditorProps {
  example: PromptExample;
  mode?: 'playground' | 'practice';
}

export default function InteractivePromptEditor({ example, mode = 'practice' }: InteractivePromptEditorProps) {
  const t = useTranslations('promptEngineering');
  const [systemPrompt, setSystemPrompt] = useState(example.systemPrompt || '');
  const [userPrompt, setUserPrompt] = useState(example.userPrompt);
  const [currentOutput, setCurrentOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<'good' | 'needs-improvement' | null>(null);
  const [error, setError] = useState<string | null>(null);


  // Analyze prompt quality
  const analyzePrompt = (system: string, user: string): 'good' | 'needs-improvement' => {
    const totalLength = system.length + user.length;
    const hasSpecificInstructions = user.includes('specific') || user.includes('详细') || user.includes('列出');
    const hasRole = system.includes('you are') || system.includes('作为') || system.includes('角色');
    const hasContext = system.length > 20 || user.includes('context') || user.includes('背景');
    
    if (totalLength > 50 && (hasSpecificInstructions || hasRole || hasContext)) {
      return 'good';
    }
    return 'needs-improvement';
  };

  const runPrompt = async () => {
    setIsRunning(true);
    setCurrentOutput('');
    setError(null);
    
    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt: systemPrompt || undefined,
          userPrompt: userPrompt.trim(),
          mode: mode
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from AI');
      }
      
      setCurrentOutput(data.response);
      setAnalysisResult(analyzePrompt(systemPrompt, userPrompt));
      
    } catch (error) {
      console.error('Error calling LLM API:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          setError(t('rateLimitError'));
        } else if (error.message.includes('Service temporarily unavailable')) {
          setError(t('serviceUnavailableError'));
        } else {
          setError(t('generalError'));
        }
      } else {
        setError(t('generalError'));
      }
      
      // No fallback - just show the error
      setCurrentOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const resetToExample = () => {
    setSystemPrompt(example.systemPrompt || '');
    setUserPrompt(example.userPrompt);
    setCurrentOutput('');
    setAnalysisResult(null);
    setSelectedVariation(null);
    setError(null);
  };

  const applyVariation = (index: number) => {
    // Don't auto-fill user prompt - let user manually copy if needed
    setSelectedVariation(index);
    setCurrentOutput('');
    setAnalysisResult(null);
  };

  return (
    <div className="border border-stone-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#98a971]/10 to-[#98a971]/5 border-b border-stone-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {example.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {example.description}
            </p>
          </div>
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#98a971] hover:bg-[#98a971]/10 rounded-lg transition-colors"
          >
            <LightBulbIcon className="h-4 w-4" />
            {showHints ? t('hideHints') : t('showHints')}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Hints */}
        {showHints && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-3">
              💡 {t('learningTips')}
            </h4>
            <ul className="space-y-2">
              {example.hints.map((hint, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-200">
                  <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prompt Variations */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            📝 {t('tryDifferentVariations')}
          </h4>
          <div className="grid gap-2 md:grid-cols-2">
            {example.variations.map((variation, index) => (
              <button
                key={index}
                onClick={() => applyVariation(index)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedVariation === index
                    ? 'border-[#98a971] bg-[#98a971]/5 text-gray-900 dark:text-gray-100'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#98a971]/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="font-medium text-sm mb-1">{variation.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{variation.explanation}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Input */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              🎯 {t('editPrompt')}
            </h4>
            
            {/* System Prompt - only show if the exercise needs it */}
            {(example.systemPrompt !== undefined) && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('systemPrompt')}
                </label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder={t('systemPromptPlaceholder')}
                  className="w-full h-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#98a971] focus:border-transparent resize-none"
                />
              </div>
            )}

            {/* User Prompt */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('userPrompt')}
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder={t('userPromptPlaceholder')}
                className="w-full h-24 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#98a971] focus:border-transparent resize-none"
              />
            </div>

            {/* Controls */}
            <div className="space-y-3">
              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={runPrompt}
                  disabled={isRunning || !userPrompt.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#98a971] text-white rounded-lg hover:bg-[#7a8259] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {isRunning ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                  {isRunning ? t('running') : t('runPrompt')}
                </button>
                
                <button
                  onClick={resetToExample}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  {t('reset')}
                </button>
              </div>
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                🤖 {t('aiResponse')}
              </h4>
              {analysisResult && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  analysisResult === 'good'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {analysisResult === 'good' ? (
                    <CheckCircleIcon className="h-3 w-3" />
                  ) : (
                    <ExclamationTriangleIcon className="h-3 w-3" />
                  )}
                  {analysisResult === 'good' ? t('goodPromptQuality') : t('canImprove')}
                </div>
              )}
            </div>
            
            <div className="h-48 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto">
              {isRunning ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    <span className="text-sm">{t('aiThinking')}</span>
                  </div>
                </div>
              ) : currentOutput ? (
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {currentOutput}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                  {t('clickRunPrompt')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expected Output */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            🎯 {t('expectedOutput')}
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            {example.expectedOutput}
          </p>
        </div>
      </div>
    </div>
  );
}