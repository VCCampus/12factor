'use client';
import { useTranslations } from 'next-intl';
import { promptLessons } from '@/data/prompt-lessons';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function PromptEngineeringPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('promptEngineering');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="hero-gradient relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-32 sm:pb-24">
          <div className="max-w-5xl">
            <h1 className="hero-text text-white mb-8">
              {t('title')}
            </h1>
            
            <p className="text-xl text-white/90 mb-12 max-w-3xl leading-relaxed font-light">
              {t('description')}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href={{
                  pathname: '/prompt-engineering/[course]',
                  params: { course: 'fundamentals' }
                }}
                locale={locale}
                className="btn-primary"
              >
                {t('startLearning')}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Down Arrow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => {
              document.getElementById('lessons-content')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex flex-col items-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
            aria-label="Scroll to lessons"
          >
            <div className="text-xs sm:text-sm font-medium mb-2 opacity-80 group-hover:opacity-100 whitespace-nowrap px-2">
              {t('viewLessons')}
            </div>
            <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/50 transition-all duration-300">
              <ChevronDownIcon className="h-5 w-5 animate-bounce" />
            </div>
          </button>
        </div>
        
        {/* Stats Overlay */}
        <div className="absolute top-24 right-12 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <div className="stat-number text-white">{promptLessons.length}</div>
            <div className="text-white/80 font-medium">
              {t('lessonsLabel')}
            </div>
            <div className="text-xs text-white/60 mt-1">{t('interactiveLearning')}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="lessons-content" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 dark:text-gray-100 mb-6 leading-tight">
              课程列表
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {promptLessons.map((course, index) => {
              const getCourseTitle = (id: string) => {
                switch (id) {
                  case 'fundamentals':
                    return t('course.fundamentals.title');
                  case 'advanced':
                    return t('course.advanced.title');
                  default:
                    return 'Course';
                }
              };

              const getCourseSummary = (id: string) => {
                switch (id) {
                  case 'fundamentals':
                    return t('course.fundamentals.summary');
                  case 'advanced':
                    return t('course.advanced.summary');
                  default:
                    return '';
                }
              };

              const getSectionCount = () => {
                return course.content.sections?.length || 0;
              };
              
              return (
                <Link
                  key={course.id}
                  href={{
                    pathname: '/prompt-engineering/[course]',
                    params: { course: course.id.toString() }
                  }}
                  locale={locale}
                  className="modern-card group hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-[#98a971]/10 border border-[#98a971]/20 rounded-2xl flex items-center justify-center">
                        <span className="text-[#98a971] font-bold text-lg">{index + 1}</span>
                      </div>
                      <div className="text-sm text-[#98a971] font-medium uppercase tracking-wide">
                        {t('integratedCourse')}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xl font-medium text-stone-900 dark:text-gray-100 mb-4 leading-tight">
                    {getCourseTitle(course.id as string)}
                  </h4>

                  <p className="text-stone-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {getCourseSummary(course.id as string)}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-[#98a971]">
                    <div className="w-2 h-2 bg-[#98a971] rounded-full"></div>
                    {getSectionCount()} {t('sections')}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}