'use client';
import { useState } from 'react';
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

  // Prepare learning content
  const learningContent = course.content.sections?.map((section, index) => ({
    id: `section-${index}`,
    title: section.title,
    theory: section.theory,
    examples: section.examples,
    exercises: section.exercises
  })) || [];

  // Prepare practice content from notebook lessons
  const practiceContent = notebookLesson?.interactiveExamples?.map(example => ({
    id: example.id,
    title: example.title,
    description: example.description || '点击下方编辑器开始练习',
    variants: example.variations || [],
    expectedOutput: example.expectedOutput || ''
  })) || [];

  const handleNext = () => {
    if (currentCardIndex < learningContent.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

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
              onNext={handleNext}
              onPrev={handlePrev}
              canGoNext={currentCardIndex < learningContent.length - 1}
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
                    <span className="text-gray-700 dark:text-gray-300">上一课程</span>
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
                    <span className="text-gray-700 dark:text-gray-300">下一课程</span>
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