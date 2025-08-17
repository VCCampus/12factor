export interface CourseContent {
  id: string;
  title: string;
  summary: string;
  icon: 'book' | 'code' | 'beaker';
  sections: CourseSection[];
}

export interface CourseSection {
  id: string;
  title: string;
  theory: string;
  examples?: string | string[];
  exercises?: ExerciseData[];
  // Chapter specific properties - keeping flexible for different course types
  [key: string]: unknown;
}

export interface ExerciseData {
  id: string;
  instructions: string;
  template?: string;
  expectedPattern?: string;
  hints: string | string[];
}

export interface PracticeExample {
  id: string;
  title: string;
  description: string;
  systemPrompt?: string;
  userPrompt: string;
  expectedOutput: string;
  hints: string[];
  variations: {
    name: string;
    prompt: string;
    systemPrompt?: string;
    explanation: string;
  }[];
}

export interface PlaygroundScenario {
  id: string;
  title: string;
  examples: {
    name: string;
    prompt: string;
    systemPrompt: string;
    description: string;
    variations: {
      name: string;
      prompt: string;
      systemPrompt: string;
      explanation: string;
    }[];
  }[];
  hints: string[];
}

export interface Course {
  content: CourseContent;
  practice: PracticeExample[];
  playground: PlaygroundScenario[];
  prerequisites?: string[];
}