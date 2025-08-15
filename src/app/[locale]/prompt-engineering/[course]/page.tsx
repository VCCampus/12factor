'use client';
import { useTranslations } from 'next-intl';
import { promptLessons } from '@/data/prompt-lessons';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, BookOpenIcon, CodeBracketIcon, BeakerIcon } from '@heroicons/react/24/outline';
import CodeExample from '@/components/CodeExample';
import InteractivePromptEditor from '@/components/InteractivePromptEditor';
import { getNotebookLesson } from '@/data/notebook-content';
import { notFound } from 'next/navigation';

export default function CoursePage() {
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
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Course Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-6">
              {t('courseOverview')}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {course.content.theory}
              </p>
            </div>
          </div>

          {/* Interactive Prompt Exercises */}
          {notebookLesson?.interactiveExamples && (
            <div className="mb-12">
              <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-6">
                🚀 交互式练习
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                通过真实的AI交互来学习提示工程。编辑提示词，观察不同表达方式如何影响AI的回应质量。
              </p>
              <div className="space-y-8">
                {notebookLesson.interactiveExamples.map((example) => (
                  <InteractivePromptEditor
                    key={example.id}
                    example={example}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Code Examples */}
          {notebookLesson?.examples && (
            <div className="mb-12">
              <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-6">
                {t('practicalExamples')}
              </h2>
              <div className="space-y-6">
                {notebookLesson.examples.map((example) => (
                  <CodeExample
                    key={example.id}
                    title={example.title}
                    code={example.code}
                    explanation={example.explanation}
                    language={example.language}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Course Sections */}
          {course.content.sections && (
            <div className="space-y-12">
              {course.content.sections.map((section, index) => (
                <div key={index} className="modern-card">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#98a971]/10 rounded-xl flex items-center justify-center border border-[#98a971]/20">
                      <span className="text-[#98a971] font-bold text-lg">{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                      {section.title}
                    </h3>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                      {t('theory')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {section.theory}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                      {t('examples')}
                    </h4>
                    <div className="space-y-3">
                      {section.examples.map((example, exIndex) => (
                        <div key={exIndex} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <code className="text-sm text-gray-700 dark:text-gray-300">
                            {example}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>

                  {section.exercises && section.exercises.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                        {t('practiceExercise')}
                      </h4>
                      {section.exercises.map((exercise) => (
                        <div key={exercise.id} className="bg-[#98a971]/5 dark:bg-[#98a971]/10 rounded-lg p-6 border border-[#98a971]/20">
                          <h5 className="font-medium text-[#98a971] mb-3">
                            {t('exercise')}: {exercise.instructions}
                          </h5>
                          {exercise.template && (
                            <div className="bg-white dark:bg-gray-800 rounded-md p-4 mb-4 border border-gray-200 dark:border-gray-700">
                              <code className="text-sm text-gray-600 dark:text-gray-400">
                                {exercise.template}
                              </code>
                            </div>
                          )}
                          <details className="text-sm">
                            <summary className="cursor-pointer text-[#98a971] hover:text-[#7a8259] font-medium">
                              {t('hints')} ({exercise.hints.length})
                            </summary>
                            <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                              {exercise.hints.map((hint, hintIndex) => (
                                <li key={hintIndex} className="flex items-start gap-2">
                                  <span className="text-[#98a971] mt-1">•</span>
                                  {hint}
                                </li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Navigation */}
          <div className="mt-16 flex justify-between items-center gap-4">
            {prevCourse ? (
              <Link
                href={{
                  pathname: '/prompt-engineering/[course]',
                  params: { course: prevCourse.id.toString() }
                }}
                locale={locale}
                className="inline-flex items-center px-6 py-3 text-base rounded-full border bg-white dark:bg-gray-800 border-[#98a971]/30 dark:border-[#98a971]/30 text-[#98a971] dark:text-[#98a971] hover:bg-[#98a971]/5 dark:hover:bg-[#98a971]/10 hover:border-[#98a971]/50 dark:hover:border-[#98a971]/50 transition-all duration-200"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-2" />
                {t('previousCourse')}
              </Link>
            ) : (
              <div />
            )}
            
            {nextCourse ? (
              <Link
                href={{
                  pathname: '/prompt-engineering/[course]',
                  params: { course: nextCourse.id.toString() }
                }}
                locale={locale}
                className="inline-flex items-center px-6 py-3 text-base rounded-full border bg-white dark:bg-gray-800 border-[#98a971]/30 dark:border-[#98a971]/30 text-[#98a971] dark:text-[#98a971] hover:bg-[#98a971]/5 dark:hover:bg-[#98a971]/10 hover:border-[#98a971]/50 dark:hover:border-[#98a971]/50 transition-all duration-200"
              >
                {t('nextCourse')}
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}