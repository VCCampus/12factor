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

export interface ExerciseData {
  id: string;
  instructions: string;
  template?: string;
  expectedPattern?: string;
  hints: string[];
}

export interface CourseSection {
  title: string;
  theory: string;
  examples: string[];
  exercises?: ExerciseData[];
}

export interface PromptLesson {
  id: string | number;
  chapter: number;
  type: 'lesson' | 'exercise' | 'course';
  messageKey: string;
  content: {
    theory: string;
    examples?: string[];
    exercises?: ExerciseData[];
    sections?: CourseSection[];
  };
  prerequisites?: (string | number)[];
}