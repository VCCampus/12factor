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