'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { promptLessons } from '@/data/prompt-lessons';

export default function PromptEngineeringDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('common');
  const tPE = useTranslations('promptEngineering');
  const tNav = useTranslations('common.navigation');
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
          className="absolute left-0 mt-2 w-[720px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 overflow-hidden backdrop-blur-sm"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Multi-column layout similar to reference image */}
          <div className="grid grid-cols-3 divide-x divide-gray-200/50 dark:divide-gray-700/50">
            
            {/* First Column - Prompt Engineering */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">
                  {t('promptEngineering')}
                </h3>
              </div>
              
              {/* Overview Link */}
              <Link
                href="/prompt-engineering"
                locale={locale}
                className="block mb-3 group"
                onClick={() => setIsOpen(false)}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#98a971] transition-colors">
                  {tPE('learningPath')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {tPE('learningPathDescription')}
                </div>
              </Link>

              {/* Course Links */}
              {promptLessons.map((course) => {
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
                    className="block mb-3 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#98a971] transition-colors">
                      {getCourseTitle(course.id as string)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {getCourseSummary(course.id as string).substring(0, 60)}...
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Second Column - 12Factor Principles */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">
                  {tNav('methodology')}
                </h3>
              </div>
              
              <Link
                href="/principles"
                locale={locale}
                className="block mb-3 group"
                onClick={() => setIsOpen(false)}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#98a971] transition-colors">
                  {t('principles')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {tNav('principlesDescription')}
                </div>
              </Link>

              <Link
                href="/flashcards"
                locale={locale}
                className="block mb-3 group"
                onClick={() => setIsOpen(false)}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#98a971] transition-colors">
                  {t('flashcards')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {tNav('flashcardsDescription')}
                </div>
              </Link>

              <Link
                href="/quiz"
                locale={locale}
                className="block mb-3 group"
                onClick={() => setIsOpen(false)}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#98a971] transition-colors">
                  {t('quiz')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {tNav('quizDescription')}
                </div>
              </Link>
            </div>

            {/* Third Column - Resources */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">
                  {tNav('resources')}
                </h3>
              </div>
              
              <a
                href="https://github.com/wquguru/12factor"
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-3 group"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#98a971] transition-colors">
                  {tNav('githubRepo')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {tNav('githubRepoDescription')}
                </div>
              </a>

              <div className="block mb-3 group">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {tNav('apiDocs')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {tNav('comingSoon')}
                </div>
              </div>

              <div className="block mb-3 group">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {tNav('communityForum')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {tNav('comingSoon')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}