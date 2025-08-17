export interface Principle {
  id: number;
  stage: 1 | 2 | 3 | 4;
  messageKey: string;
}

export interface UserProgress {
  principleId: number;
  status: 'not_started' | 'learning' | 'mastered' | 'needs_review';
  lastReviewed: Date;
  correctAnswers: number;
  totalAttempts: number;
}

export interface Stage {
  id: 1 | 2 | 3 | 4;
  messageKey: string;
  principles: number[];
}

// Legacy types - keeping for backward compatibility
export interface ExerciseData {
  id: string;
  instructions: string;
  template?: string;
  expectedPattern?: string;
  hints: string | string[];
}

export interface CourseSection {
  title: string;
  theory: string;
  examples?: string | string[];
  exercises?: ExerciseData[];
  // Chapter 1 specific properties
  messageRules?: string;
  systemPrompts?: string;
  messageFormatting?: string;
  multiTurnConversations?: string;
  whySystemPrompts?: string;
  // Chapter 2 specific properties
  directCommunication?: string;
  specificityMatters?: string;
  goldenRule?: string;
  forcedChoices?: string;
  // Chapter 3 specific properties
  roleContext?: string;
  roleEffects?: string;
  rolePromptLocation?: string;
  detailMatters?: string;
}

export interface PromptLesson {
  id: string | number;
  chapter: number;
  type: 'lesson' | 'exercise' | 'course';
  messageKey: string;
  content: {
    theory: string;
    examples?: string | string[];
    exercises?: ExerciseData[];
    sections?: CourseSection[];
  };
  prerequisites?: (string | number)[];
}

// Re-export new course types for convenience
export type {
  Course,
  CourseContent,
  CourseSection as NewCourseSection,
  ExerciseData as NewExerciseData,
  PracticeExample,
  PlaygroundScenario
} from '@/data/courses/types';