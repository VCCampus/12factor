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
  const [currentMode, setCurrentMode] = useState<'learning' | 'practice'>('learning');
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
          resolvedHints = [t(exercise.hints)];
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
      explanation: resolveTranslationKey(variation.explanation)
    })) || [];

    return {
      id: example.id,
      title: resolveTranslationKey(example.title),
      description: resolveTranslationKey(example.description) || t('clickToStartPractice'),
      variants: resolvedVariations,
      expectedOutput: resolveTranslationKey(example.expectedOutput) || '',
      hints: resolveHintsArray(example.hints || [])
    };
  }) || [];

  const handleNext = useCallback(() => {
    const maxIndex = currentMode === 'practice' ? practiceContent.length - 1 : learningContent.length - 1;
    if (currentCardIndex < maxIndex) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  }, [currentCardIndex, currentMode, practiceContent.length, learningContent.length]);

  const handlePrev = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  }, [currentCardIndex]);

  const handleModeChange = (newMode: 'learning' | 'practice') => {
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
              currentIndex={currentCardIndex}
              currentMode={currentMode}
              onNext={handleNext}
              onPrev={handlePrev}
              onModeChange={handleModeChange}
              canGoNext={currentCardIndex < (currentMode === 'practice' ? practiceContent.length - 1 : learningContent.length - 1)}
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