import { Course } from './types';
import { fundamentalsCourse } from './fundamentals';

export const courses: Record<string, Course> = {
  fundamentals: fundamentalsCourse
};

export const getCourse = (id: string): Course | undefined => {
  return courses[id];
};

export const getAllCourses = (): Course[] => {
  return Object.values(courses);
};

export const getCourseIds = (): string[] => {
  return Object.keys(courses);
};

export * from './types';
export * from './fundamentals';