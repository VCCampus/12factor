import { Course } from '../types';
import { intermediateContent } from './content';
import { intermediatePractice } from './practice';
import { intermediatePlayground } from './playground';

export const intermediateCourse: Course = {
  content: intermediateContent,
  practice: intermediatePractice,
  playground: intermediatePlayground,
  prerequisites: ['fundamentals']
};

export * from './content';
export * from './practice';
export * from './playground';