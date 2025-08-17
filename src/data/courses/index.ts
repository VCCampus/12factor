import { Course } from './types';
import { fundamentalsCourse } from './fundamentals';
import { intermediateCourse } from './intermediate';

export const courses: Record<string, Course> = {
  fundamentals: fundamentalsCourse,
  intermediate: intermediateCourse
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
export * from './intermediate';