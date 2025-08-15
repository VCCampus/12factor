'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { promptLessons, promptStages } from '@/data/prompt-lessons';

interface MobilePromptEngineeringMenuProps {
  onLinkClick?: () => void;
}

export default function MobilePromptEngineeringMenu({ onLinkClick }: MobilePromptEngineeringMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations('common');
  const tPE = useTranslations('promptEngineering');
  const locale = useLocale();

  const handleLinkClick = () => {
    setIsExpanded(false);
    onLinkClick?.();
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      {/* Main Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 text-base font-medium text-[#98a971] dark:text-[#98a971] hover:bg-[#98a971]/5 dark:hover:bg-[#98a971]/10 transition-colors"
      >
        <div className="flex items-center">
          <span>{t('more')}</span>
        </div>
        <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-[#98a971]/5 dark:bg-[#98a971]/10">
          {/* Overview */}
          <Link
            href="/prompt-engineering"
            locale={locale}
            className="flex items-center gap-3 px-8 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#98a971]/10 dark:hover:bg-[#98a971]/15 transition-colors"
            onClick={handleLinkClick}
          >
            <span className="text-blue-500">📖</span>
            <div>
              <div className="font-medium">{tPE('learningPath')}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {tPE('learningPathDescription')}
              </div>
            </div>
          </Link>

          {/* Stages */}
          {promptStages.slice(0, 2).map((stage) => (
            <div key={stage.id}>
              {/* Stage Header */}
              <div className="px-8 py-2 bg-[#98a971]/10 dark:bg-[#98a971]/15">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{stage.id === 1 ? '🎯' : '🚀'}</span>
                  <span className="text-xs font-semibold text-[#98a971] dark:text-[#98a971] uppercase tracking-wide">
                    {tPE(`stage${stage.id}.name`)}
                  </span>
                </div>
              </div>

              {/* Courses */}
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
                    className="flex items-center gap-3 px-10 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#98a971]/10 dark:hover:bg-[#98a971]/15 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <div className="w-6 h-6 bg-[#98a971]/10 border border-[#98a971]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[#98a971] text-xs font-semibold">
                        {stage.id}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{getCourseTitle(course.id as string)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {getCourseSummary(course.id as string)}
                      </div>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Coming Soon */}
          <div className="px-8 py-3 text-center border-t border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              高级 & 实践课程即将推出 🚧
            </div>
          </div>
        </div>
      )}
    </div>
  );
}