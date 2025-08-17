'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { promptLessons } from '@/data/prompt-lessons';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, BookOpenIcon, CodeBracketIcon, BeakerIcon } from '@heroicons/react/24/outline';
import LearningCard from '@/components/LearningCard';
import { getNotebookLesson } from '@/data/notebook-content';
import { notFound } from 'next/navigation';

export default function CoursePage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState<'learning' | 'practice' | 'playground'>('learning');
  const params = useParams();
  const locale = params.locale as string;
  const courseSlug = params.course as string;
  const t = useTranslations('promptEngineering');

  const course = promptLessons.find(l => l.id === courseSlug);
  const notebookLesson = getNotebookLesson(courseSlug);
  
  if (!course) {
    notFound();
  }

  const courseIndex = promptLessons.findIndex(l => l.id === courseSlug);
  const prevCourse = courseIndex > 0 ? promptLessons[courseIndex - 1] : null;
  const nextCourse = courseIndex < promptLessons.length - 1 ? promptLessons[courseIndex + 1] : null;

  // Prepare learning content - sync with practice content
  const learningContent = course.content.sections?.map((section, index) => {
    // Find matching interactive examples for this section from notebook content
    const sectionPracticeCount = notebookLesson?.interactiveExamples?.filter(example => 
      example.title.includes(`${index + 1}章`)
    ).length || 0;
    
    // Resolve examples from translation key
    let resolvedExamples: string[] = [];
    try {
      // Try to get examples as an array from translations
      const examplesKey = section.examples as string;
      const examplesData = t.raw(examplesKey);
      if (Array.isArray(examplesData)) {
        resolvedExamples = examplesData;
      } else if (typeof examplesData === 'string') {
        resolvedExamples = [examplesData];
      } else {
        // Fallback to the key itself if translation fails
        resolvedExamples = [examplesKey];
      }
    } catch {
      // Fallback to the key itself if translation fails
      resolvedExamples = [section.examples as string];
    }
    
    // Process exercises to resolve hints translation keys
    const processedExercises = section.exercises?.map(exercise => {
      let resolvedHints: string[] = [];
      
      // Check if exercise.hints is an array of translation keys or content
      if (Array.isArray(exercise.hints)) {
        // If it's an array, check if the first item looks like a translation key
        const firstHint = exercise.hints[0];
        if (firstHint && firstHint.includes('.')) {
          // Looks like translation keys, resolve each one
          resolvedHints = exercise.hints.map(hint => {
            try {
              return t(hint);
            } catch {
              return hint; // Fallback to the key itself
            }
          });
        } else {
          // Already translated content, use as is
          resolvedHints = exercise.hints;
        }
      } else if (typeof exercise.hints === 'string') {
        // Single hint (either key or content)
        try {
          // Check if it's a translation key that resolves to an array
          const hintsData = t.raw(exercise.hints);
          if (Array.isArray(hintsData)) {
            resolvedHints = hintsData;
          } else {
            resolvedHints = [t(exercise.hints)];
          }
        } catch {
          resolvedHints = [exercise.hints];
        }
      }
      
      return {
        ...exercise,
        instructions: t(exercise.instructions),
        template: exercise.template ? t(exercise.template) : '',
        hints: resolvedHints
      };
    }) || [];
    
    return {
      id: `section-${index}`,
      title: t(section.title),
      theory: t(section.theory),
      messageRules: section.messageRules ? {
        title: t(`${section.messageRules}.title`),
        content: t(`${section.messageRules}.content`)
      } : undefined,
      systemPrompts: section.systemPrompts ? {
        title: t(`${section.systemPrompts}.title`),
        content: t(`${section.systemPrompts}.content`)
      } : undefined,
      messageFormatting: section.messageFormatting ? {
        title: t(`${section.messageFormatting}.title`),
        content: t(`${section.messageFormatting}.content`)
      } : undefined,
      multiTurnConversations: section.multiTurnConversations ? {
        title: t(`${section.multiTurnConversations}.title`),
        content: t(`${section.multiTurnConversations}.content`)
      } : undefined,
      whySystemPrompts: section.whySystemPrompts ? {
        title: t(`${section.whySystemPrompts}.title`),
        content: t(`${section.whySystemPrompts}.content`)
      } : undefined,
      // Chapter 2 specific core concepts
      directCommunication: section.directCommunication ? {
        title: t(`${section.directCommunication}.title`),
        content: t(`${section.directCommunication}.content`)
      } : undefined,
      specificityMatters: section.specificityMatters ? {
        title: t(`${section.specificityMatters}.title`),
        content: t(`${section.specificityMatters}.content`)
      } : undefined,
      goldenRule: section.goldenRule ? {
        title: t(`${section.goldenRule}.title`),
        content: t(`${section.goldenRule}.content`)
      } : undefined,
      forcedChoices: section.forcedChoices ? {
        title: t(`${section.forcedChoices}.title`),
        content: t(`${section.forcedChoices}.content`)
      } : undefined,
      // Chapter 3 specific core concepts
      roleContext: section.roleContext ? {
        title: t(`${section.roleContext}.title`),
        content: t(`${section.roleContext}.content`)
      } : undefined,
      roleEffects: section.roleEffects ? {
        title: t(`${section.roleEffects}.title`),
        content: t(`${section.roleEffects}.content`)
      } : undefined,
      rolePromptLocation: section.rolePromptLocation ? {
        title: t(`${section.rolePromptLocation}.title`),
        content: t(`${section.rolePromptLocation}.content`)
      } : undefined,
      detailMatters: section.detailMatters ? {
        title: t(`${section.detailMatters}.title`),
        content: t(`${section.detailMatters}.content`)
      } : undefined,
      examples: resolvedExamples,
      exercises: processedExercises,
      practiceCount: sectionPracticeCount
    };
  }) || [];

  // Prepare practice content from notebook lessons
  const practiceContent = notebookLesson?.interactiveExamples?.map(example => {
    // Resolve translation keys for practice content
    const resolveTranslationKey = (key: string): string => {
      try {
        return t(key);
      } catch {
        return key;
      }
    };

    const resolveHintsArray = (hints: string | string[]): string[] => {
      if (Array.isArray(hints)) {
        // If hints is an array of translation keys, resolve each one
        return hints.map(hint => {
          try {
            return t(hint);
          } catch {
            return hint; // Fallback to the key itself if translation fails
          }
        });
      }
      try {
        const hintsData = t.raw(hints);
        if (Array.isArray(hintsData)) {
          return hintsData;
        }
        return [t(hints)]; // Single hint should also be translated
      } catch {
        return [hints];
      }
    };

    const resolvedVariations = example.variations?.map(variation => ({
      name: resolveTranslationKey(variation.name),
      prompt: variation.prompt,
      systemPrompt: variation.systemPrompt,
      explanation: resolveTranslationKey(variation.explanation)
    })) || [];

    return {
      id: example.id,
      title: resolveTranslationKey(example.title),
      description: resolveTranslationKey(example.description) || t('clickToStartPractice'),
      systemPrompt: example.systemPrompt,
      userPrompt: example.userPrompt,
      variants: resolvedVariations,
      expectedOutput: resolveTranslationKey(example.expectedOutput) || '',
      hints: resolveHintsArray(example.hints || [])
    };
  }) || [];

  // Prepare playground content - create unique experimental scenarios based on learning concepts
  const playgroundContent = learningContent.map((section, sectionIndex) => {
    const chapterNum = sectionIndex + 1;
    
    // Define playground scenarios based on chapter concepts
    const getPlaygroundScenarios = (chapterIndex: number) => {
      switch (chapterIndex) {
        case 0: // Chapter 1: Basic Structure & System Prompts
          return [
            {
              name: t('playground.chapter1.creativeCounting.name'),
              prompt: 'Count to five in a creative way',
              systemPrompt: '',
              description: t('playground.chapter1.creativeCounting.description')
            },
            {
              name: t('playground.chapter1.systemPromptExperiment.name'),
              prompt: 'Explain what clouds are made of',
              systemPrompt: '',
              description: t('playground.chapter1.systemPromptExperiment.description')
            }
          ];
        case 1: // Chapter 2: Clear Communication
          return [
            {
              name: t('playground.chapter2.languageExperiment.name'),
              prompt: 'Greet me in the language of your choice and explain why you chose it',
              systemPrompt: '',
              description: t('playground.chapter2.languageExperiment.description')
            },
            {
              name: t('playground.chapter2.formatExperiment.name'),
              prompt: 'List your top 3 favorite activities. Try different formatting styles.',
              systemPrompt: '',
              description: t('playground.chapter2.formatExperiment.description')
            }
          ];
        case 2: // Chapter 3: Role Prompting
          return [
            {
              name: t('playground.chapter3.roleComparison.name'),
              prompt: 'Should I invest in cryptocurrency?',
              systemPrompt: 'You are a conservative financial advisor with 20 years of experience.',
              description: t('playground.chapter3.roleComparison.description')
            },
            {
              name: t('playground.chapter3.expertiseExperiment.name'),
              prompt: 'Explain machine learning to me',
              systemPrompt: 'You are a data science professor who excels at making complex topics accessible.',
              description: t('playground.chapter3.expertiseExperiment.description')
            }
          ];
        default:
          return [];
      }
    };

    // Define real variations for each scenario
    const getScenarioVariations = (chapterIndex: number, scenarioIndex: number) => {
      switch (chapterIndex) {
        case 0: // Chapter 1: Basic Structure & System Prompts
          if (scenarioIndex === 0) { // Creative Counting
            return [
              {
                name: t('playground.chapter1.creativeCounting.variations.basic'),
                prompt: 'Count to five in a creative way',
                systemPrompt: '',
                explanation: t('playground.chapter1.creativeCounting.variations.basicExplanation')
              },
              {
                name: t('playground.chapter1.creativeCounting.variations.storytelling'),
                prompt: 'Count to five by telling a short story where each number appears naturally',
                systemPrompt: '',
                explanation: t('playground.chapter1.creativeCounting.variations.storytellingExplanation')
              },
              {
                name: t('playground.chapter1.creativeCounting.variations.poetic'),
                prompt: 'Count to five using rhymes or poetic language',
                systemPrompt: '',
                explanation: t('playground.chapter1.creativeCounting.variations.poeticExplanation')
              },
              {
                name: t('playground.chapter1.creativeCounting.variations.withContext'),
                prompt: 'Count to five in a creative way, making it educational for children',
                systemPrompt: 'You are a kindergarten teacher who makes learning fun and engaging.',
                explanation: t('playground.chapter1.creativeCounting.variations.withContextExplanation')
              }
            ];
          } else { // System Prompt Experiment
            return [
              {
                name: t('playground.chapter1.systemPromptExperiment.variations.basic'),
                prompt: 'Explain what clouds are made of',
                systemPrompt: '',
                explanation: t('playground.chapter1.systemPromptExperiment.variations.basicExplanation')
              },
              {
                name: t('playground.chapter1.systemPromptExperiment.variations.structured'),
                prompt: 'Explain what clouds are made of',
                systemPrompt: 'Please provide a clear, structured explanation.',
                explanation: t('playground.chapter1.systemPromptExperiment.variations.structuredExplanation')
              },
              {
                name: t('playground.chapter1.systemPromptExperiment.variations.detailed'),
                prompt: 'Explain what clouds are made of',
                systemPrompt: 'Provide a detailed scientific explanation with examples.',
                explanation: t('playground.chapter1.systemPromptExperiment.variations.detailedExplanation')
              },
              {
                name: t('playground.chapter1.systemPromptExperiment.variations.simple'),
                prompt: 'Explain what clouds are made of',
                systemPrompt: 'Explain in simple, easy-to-understand language.',
                explanation: t('playground.chapter1.systemPromptExperiment.variations.simpleExplanation')
              }
            ];
          }
        case 1: // Chapter 2: Clear Communication
          if (scenarioIndex === 0) { // Language Experiment
            return [
              {
                name: t('playground.chapter2.languageExperiment.variations.basic'),
                prompt: 'Greet me in the language of your choice and explain why you chose it',
                systemPrompt: '',
                explanation: t('playground.chapter2.languageExperiment.variations.basicExplanation')
              },
              {
                name: t('playground.chapter2.languageExperiment.variations.specific'),
                prompt: 'Greet me in Spanish and explain the cultural significance of your chosen greeting',
                systemPrompt: '',
                explanation: t('playground.chapter2.languageExperiment.variations.specificExplanation')
              },
              {
                name: t('playground.chapter2.languageExperiment.variations.comparative'),
                prompt: 'Greet me in two different languages and compare how greetings reflect cultural values',
                systemPrompt: '',
                explanation: t('playground.chapter2.languageExperiment.variations.comparativeExplanation')
              },
              {
                name: t('playground.chapter2.languageExperiment.variations.contextual'),
                prompt: 'Greet me appropriately for a business meeting and explain your choice',
                systemPrompt: 'You are a professional business consultant familiar with international etiquette.',
                explanation: t('playground.chapter2.languageExperiment.variations.contextualExplanation')
              }
            ];
          } else { // Format Experiment
            return [
              {
                name: t('playground.chapter2.formatExperiment.variations.basic'),
                prompt: 'List your top 3 favorite activities. Try different formatting styles.',
                systemPrompt: '',
                explanation: t('playground.chapter2.formatExperiment.variations.basicExplanation')
              },
              {
                name: t('playground.chapter2.formatExperiment.variations.numbered'),
                prompt: 'List your top 3 favorite activities in a numbered list with brief explanations for each',
                systemPrompt: '',
                explanation: t('playground.chapter2.formatExperiment.variations.numberedExplanation')
              },
              {
                name: t('playground.chapter2.formatExperiment.variations.detailed'),
                prompt: 'List your top 3 favorite activities with detailed descriptions and reasons why you enjoy them',
                systemPrompt: '',
                explanation: t('playground.chapter2.formatExperiment.variations.detailedExplanation')
              },
              {
                name: t('playground.chapter2.formatExperiment.variations.creative'),
                prompt: 'Present your top 3 favorite activities in a creative format (e.g., as a poem, story, or advertisement)',
                systemPrompt: '',
                explanation: t('playground.chapter2.formatExperiment.variations.creativeExplanation')
              }
            ];
          }
        case 2: // Chapter 3: Role Prompting
          if (scenarioIndex === 0) { // Role Comparison
            return [
              {
                name: t('playground.chapter3.roleComparison.variations.basic'),
                prompt: 'Should I invest in cryptocurrency?',
                systemPrompt: '',
                explanation: t('playground.chapter3.roleComparison.variations.basicExplanation')
              },
              {
                name: t('playground.chapter3.roleComparison.variations.conservative'),
                prompt: 'Should I invest in cryptocurrency?',
                systemPrompt: 'You are a conservative financial advisor with 20 years of experience.',
                explanation: t('playground.chapter3.roleComparison.variations.conservativeExplanation')
              },
              {
                name: t('playground.chapter3.roleComparison.variations.aggressive'),
                prompt: 'Should I invest in cryptocurrency?',
                systemPrompt: 'You are a tech-savvy investment advisor who specializes in emerging digital assets.',
                explanation: t('playground.chapter3.roleComparison.variations.aggressiveExplanation')
              },
              {
                name: t('playground.chapter3.roleComparison.variations.balanced'),
                prompt: 'Should I invest in cryptocurrency? Please provide a balanced analysis.',
                systemPrompt: 'You are a certified financial planner who provides objective, balanced investment advice.',
                explanation: t('playground.chapter3.roleComparison.variations.balancedExplanation')
              }
            ];
          } else { // Expertise Experiment
            return [
              {
                name: t('playground.chapter3.expertiseExperiment.variations.basic'),
                prompt: 'Explain machine learning to me',
                systemPrompt: '',
                explanation: t('playground.chapter3.expertiseExperiment.variations.basicExplanation')
              },
              {
                name: t('playground.chapter3.expertiseExperiment.variations.professor'),
                prompt: 'Explain machine learning to me',
                systemPrompt: 'You are a data science professor who excels at making complex topics accessible.',
                explanation: t('playground.chapter3.expertiseExperiment.variations.professorExplanation')
              },
              {
                name: t('playground.chapter3.expertiseExperiment.variations.beginner'),
                prompt: 'Explain machine learning to a complete beginner',
                systemPrompt: 'You are a friendly tutor who specializes in teaching technical concepts to absolute beginners.',
                explanation: t('playground.chapter3.expertiseExperiment.variations.beginnerExplanation')
              },
              {
                name: t('playground.chapter3.expertiseExperiment.variations.practical'),
                prompt: 'Explain machine learning with real-world examples and applications',
                systemPrompt: 'You are a data scientist working in industry who likes to show practical applications.',
                explanation: t('playground.chapter3.expertiseExperiment.variations.practicalExplanation')
              }
            ];
          }
        default:
          return [];
      }
    };

    return {
      id: `playground-chapter-${chapterNum}`,
      title: t(`playground.chapter${chapterNum}.title`),
      examples: getPlaygroundScenarios(sectionIndex).map((scenario, scenarioIndex) => ({
        ...scenario,
        variations: getScenarioVariations(sectionIndex, scenarioIndex)
      })),
      hints: [
        t(`playground.chapter${chapterNum}.hint1`),
        t(`playground.chapter${chapterNum}.hint2`),
        t(`playground.chapter${chapterNum}.hint3`)
      ],
      variations: getScenarioVariations(sectionIndex, 0) // Keep for backward compatibility
    };
  });

  const handleNext = useCallback(() => {
    const maxIndex = currentMode === 'practice' ? practiceContent.length - 1 : 
                    currentMode === 'playground' ? playgroundContent.length - 1 : 
                    learningContent.length - 1;
    if (currentCardIndex < maxIndex) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  }, [currentCardIndex, currentMode, practiceContent.length, playgroundContent.length, learningContent.length]);

  const handlePrev = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  }, [currentCardIndex]);

  const handleModeChange = (newMode: 'learning' | 'playground' | 'practice') => {
    setCurrentMode(newMode);
    // Reset to first item when switching modes
    setCurrentCardIndex(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev]);

  const getCourseIcon = (courseId: string) => {
    switch (courseId) {
      case 'fundamentals':
        return <BookOpenIcon className="h-6 w-6" />;
      case 'advanced':
        return <CodeBracketIcon className="h-6 w-6" />;
      default:
        return <BeakerIcon className="h-6 w-6" />;
    }
  };

  const getCourseTitle = (courseId: string) => {
    switch (courseId) {
      case 'fundamentals':
        return t('course.fundamentals.title');
      case 'advanced':
        return t('course.advanced.title');
      default:
        return 'Course';
    }
  };

  const getCourseSummary = (courseId: string) => {
    switch (courseId) {
      case 'fundamentals':
        return t('course.fundamentals.summary');
      case 'advanced':
        return t('course.advanced.summary');
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="hero-gradient relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">
          <div className="max-w-5xl">
            <Link
              href="/prompt-engineering"
              locale={locale}
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {t('backToLessons')}
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <div className="text-white">
                  {getCourseIcon(courseSlug)}
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm font-medium uppercase tracking-wide">
                  {t('integratedCourse')}
                </div>
                <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
                  {getCourseTitle(courseSlug)}
                </h1>
              </div>
            </div>
            
            <p className="text-xl text-white/90 max-w-3xl leading-relaxed font-light">
              {getCourseSummary(courseSlug)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">


          {/* Card-based Learning */}
          {learningContent.length > 0 && (
            <LearningCard
              learningContent={learningContent}
              practiceContent={practiceContent}
              playgroundContent={playgroundContent}
              currentIndex={currentCardIndex}
              currentMode={currentMode}
              onNext={handleNext}
              onPrev={handlePrev}
              onModeChange={handleModeChange}
              canGoNext={currentCardIndex < (currentMode === 'practice' ? practiceContent.length - 1 : 
                         currentMode === 'playground' ? playgroundContent.length - 1 : 
                         learningContent.length - 1)}
              canGoPrev={currentCardIndex > 0}
            />
          )}

          {/* Course Navigation */}
          <section className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center">
              <div className="flex items-center gap-8">
                {prevCourse && (
                  <Link
                    href={{
                      pathname: '/prompt-engineering/[course]',
                      params: { course: prevCourse.id.toString() }
                    }}
                    locale={locale}
                    className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#98a971]/30 dark:hover:border-[#98a971]/30 hover:shadow-md transition-all"
                  >
                    <ArrowLeftIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{t('previousCourse')}</span>
                  </Link>
                )}
                
                <div className="flex items-center gap-2 px-4 py-2 bg-[#98a971]/10 rounded-full">
                  <div className="w-2 h-2 bg-[#98a971] rounded-full"></div>
                  <span className="text-sm text-[#98a971] font-medium">
                    {courseIndex + 1} / {promptLessons.length}
                  </span>
                </div>
                
                {nextCourse && (
                  <Link
                    href={{
                      pathname: '/prompt-engineering/[course]',
                      params: { course: nextCourse.id.toString() }
                    }}
                    locale={locale}
                    className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#98a971]/30 dark:hover:border-[#98a971]/30 hover:shadow-md transition-all"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{t('nextCourse')}</span>
                    <ArrowLeftIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 rotate-180" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}