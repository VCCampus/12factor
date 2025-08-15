'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { promptLessons, promptStages } from '@/data/prompt-lessons';

export default function PromptEngineeringDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('common');
  const tPE = useTranslations('promptEngineering');
  const locale = useLocale();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center text-sm font-medium text-[#98a971] dark:text-[#98a971] hover:text-[#7a8259] dark:hover:text-[#b4c383] transition-colors group"
      >
        {t('more')}
        <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-[#98a971]/20 dark:border-[#98a971]/30 z-50 overflow-hidden backdrop-blur-sm"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Prompt Engineering Section Header */}
          <div className="px-5 py-3 bg-[#98a971]/5 dark:bg-[#98a971]/10">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#98a971]/20 rounded-md flex items-center justify-center">
                <span className="text-sm">📖</span>
              </div>
              <span className="text-xs font-semibold text-[#98a971] uppercase tracking-wide">
                {t('promptEngineering')}
              </span>
            </div>
          </div>
          
          {/* Overview Link */}
          <div className="py-1">
            <Link
              href="/prompt-engineering"
              locale={locale}
              className="block px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#98a971]/5 dark:hover:bg-[#98a971]/10 hover:text-[#98a971] dark:hover:text-[#98a971] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-[#98a971]/10 border border-[#98a971]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#98a971] text-xs font-bold">📚</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate leading-tight">{tPE('learningPath')}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-tight">
                    {tPE('learningPathDescription')}
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Stage Groups */}
          {promptStages.slice(0, 2).map((stage) => (
            <div key={stage.id} className="border-b border-[#98a971]/10 dark:border-[#98a971]/20 last:border-b-0">
              {/* Stage Header */}
              <div className="px-5 py-3 bg-[#98a971]/5 dark:bg-[#98a971]/10">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#98a971]/20 rounded-md flex items-center justify-center">
                    <span className="text-sm">{stage.id === 1 ? '🎯' : '🚀'}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#98a971] uppercase tracking-wide">
                    {tPE(`stage${stage.id}.name`)}
                  </span>
                </div>
              </div>

              {/* Courses in Stage */}
              <div className="py-1">
                {stage.lessons.map((courseId) => {
                  const course = promptLessons.find(l => l.id === courseId);
                  if (!course) return null;

                  const getCourseTitle = (id: string) => {
                    switch (id) {
                      case 'fundamentals':
                        return tPE('course.fundamentals.title');
                      case 'advanced':
                        return tPE('course.advanced.title');
                      default:
                        return 'Course';
                    }
                  };

                  const getCourseSummary = (id: string) => {
                    switch (id) {
                      case 'fundamentals':
                        return tPE('course.fundamentals.summary');
                      case 'advanced':
                        return tPE('course.advanced.summary');
                      default:
                        return '';
                    }
                  };

                  return (
                    <Link
                      key={course.id}
                      href={{
                        pathname: '/prompt-engineering/[course]',
                        params: { course: course.id.toString() }
                      }}
                      locale={locale}
                      className="block px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#98a971]/5 dark:hover:bg-[#98a971]/10 hover:text-[#98a971] dark:hover:text-[#98a971] transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#98a971]/10 border border-[#98a971]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-[#98a971] text-xs font-bold">
                            {stage.id}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate leading-tight">
                            {getCourseTitle(course.id as string)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-tight">
                            {getCourseSummary(course.id as string).substring(0, 40)}...
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Coming Soon Footer */}
          <div className="px-5 py-4 bg-[#98a971]/5 dark:bg-[#98a971]/10 text-center">
            <div className="text-xs text-[#98a971]/70 dark:text-[#98a971]/80 font-medium">
              高级 & 实践课程即将推出 🚧
            </div>
          </div>
        </div>
      )}
    </div>
  );
}