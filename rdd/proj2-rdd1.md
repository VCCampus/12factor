# Prompt Engineering Learning Module - Phase 1 Implementation

## Requirements

- Type definitions and data structure
- Basic routing and navigation
- Convert first 6 lessons

## Success Metrics

- [ ] All 12 lessons converted and accessible
- [ ] Basic exercise validation working
- [ ] Consistent UI with existing platform
- [ ] Mobile responsive design
- [ ] Bilingual support (EN/ZH)

## Task: Static Learning Content

**Goal**: Deliver functional learning experience without API dependencies

#### 1.1 Type Extensions
```typescript
// src/types/index.ts
// Add PromptLesson and ExerciseData interfaces
```

#### 1.2 Data Conversion
```typescript
// src/data/prompt-lessons.ts
export const promptLessons: PromptLesson[] = [
  {
    id: 1,
    chapter: 1,
    type: 'lesson',
    messageKey: 'promptLesson1',
    content: {
      theory: "Basic prompt structure focuses on clear communication...",
      examples: [
        "Simple: 'Write a haiku about robots'",
        "Better: 'Write a haiku about robots. Skip the preamble.'"
      ],
      exercises: [{
        id: "1_1",
        instructions: "Get Claude to count to three",
        template: "[Replace this text]",
        expectedPattern: ".*1.*2.*3.*",
        hints: ["Just ask directly", "Use proper formatting"]
      }]
    }
  }
  // Convert all 12 lessons from Jupyter notebooks
];
```

#### 1.3 Routing Extensions
```typescript
// src/i18n/routing.ts
pathnames: {
  // ... existing paths
  '/prompt-engineering': {
    en: '/prompt-engineering',
    zh: '/prompt-engineering'
  },
  '/prompt-engineering/[lesson]': {
    en: '/prompt-engineering/[lesson]',
    zh: '/prompt-engineering/[lesson]'
  }
}
```

#### 1.4 Component Development
```typescript
// src/components/LessonCard.tsx
// Extend FlashCard pattern for lesson content
// Support theory, examples, and exercises sections

// src/components/ExerciseSection.tsx  
// Simple text-based exercise interface
// Local validation using regex patterns
```

#### 1.5 File Structure
```
src/
├── data/
│   ├── principles.ts          # Existing 12factor data
│   └── prompt-lessons.ts      # New: Prompt engineering lessons
├── app/[locale]/
│   └── prompt-engineering/    # New: Prompt engineering routes
│       ├── layout.tsx
│       ├── page.tsx
│       └── [lesson]/
│           └── page.tsx
├── components/
│   ├── LessonCard.tsx        # New: Lesson display component
│   └── ExerciseSection.tsx   # New: Exercise interface
└── messages/
    ├── en.json              # Extended: PE translations
    └── zh.json              # Extended: PE translations
```

## Overview

This document outlines the implementation plan for integrating a Prompt Engineering learning module into the existing 12Factor.me platform. The plan follows a phased approach to minimize risk and ensure compatibility with the current architecture.

## Source Analysis

### Original Material Structure
- **Source**: `rdd/anthropic-prompt-engineering`
- **Format**: 12 Jupyter notebooks covering fundamental to advanced prompt engineering
- **Content**: Interactive exercises with Python/Anthropic API integration
- **Structure**: Sequential learning path with hands-on coding exercises

### Current 12Factor.me Architecture
- **Framework**: Next.js 15 with TypeScript
- **I18n**: next-intl with English/Chinese support
- **State**: Zustand for lightweight state management
- **Styling**: Tailwind CSS with dark mode
- **Data Pattern**: Stage/Principle hierarchical structure
- **Components**: Reusable FlashCard, Quiz, Navigation components

## Technical Strategy

### Core Principle
"Extend existing patterns, don't reinvent them" - Reuse proven architecture while adding new capabilities.

### Data Structure Extensions

```typescript
// Extend existing types in src/types/index.ts
export interface PromptLesson {
  id: number;
  chapter: number;                    // Maps to original tutorial chapters
  type: 'lesson' | 'exercise';
  messageKey: string;                 // Reuse i18n mechanism
  content: {
    theory: string;
    examples: string[];
    exercises?: ExerciseData[];
  };
  prerequisites?: number[];           // Dependency on previous lessons
}

export interface ExerciseData {
  id: string;
  instructions: string;
  template?: string;                  // Code template for exercises
  expectedPattern?: string;           // Expected result pattern (regex)
  hints: string[];
}
```

### Learning Path Organization

```
Prompt Engineering - 4 Stages × 12 Lessons:
├── Stage 1: Fundamentals (Lessons 1-3)
│   ├── Basic Prompt Structure
│   ├── Being Clear and Direct  
│   └── Role Prompting
├── Stage 2: Intermediate (Lessons 4-6)
│   ├── Data/Instruction Separation
│   ├── Output Formatting
│   └── Step-by-Step Thinking
├── Stage 3: Advanced (Lessons 7-9)
│   ├── Few-Shot Prompting
│   ├── Avoiding Hallucinations
│   └── Complex Prompts
└── Stage 4: Practical (Lessons 10-12)
    ├── Chaining Prompts
    ├── Tool Use
    └── Search & Retrieval
```

## Technical Decisions Rationale

### Why Extend Rather Than Rebuild?
"Never break userspace" - The existing architecture works well. Extension is safer than rewriting.

### Why Phased Implementation?
"Solve real problems, not imaginary ones" - Prove value exists before adding complexity.

### Why Component Reuse?
"Good taste means eliminating special cases" - Unified learning experience is better than fragmented approaches.
