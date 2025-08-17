'use client';
import { createContext, useContext, ReactNode } from 'react';
import { Course } from '@/data/courses/types';

interface CourseContextType {
  course: Course;
  courseId: string;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
  course: Course;
  courseId: string;
}

export function CourseProvider({ children, course, courseId }: CourseProviderProps) {
  return (
    <CourseContext.Provider value={{ course, courseId }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}