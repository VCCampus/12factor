import { Course } from '../types';
import { fundamentalsContent } from './content';
import { fundamentalsPractice } from './practice';
import { fundamentalsPlayground } from './playground';

export const fundamentalsCourse: Course = {
  content: fundamentalsContent,
  practice: fundamentalsPractice,
  playground: fundamentalsPlayground
};

export * from './content';
export * from './practice';
export * from './playground';