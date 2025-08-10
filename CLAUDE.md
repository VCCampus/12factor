# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### TypeScript and Linting
The project uses TypeScript with strict mode enabled. Run `npm run lint` after making changes to ensure code quality.

## Project Architecture

### Overview
This is a Next.js 15 application for **12Factor.me**, an interactive learning platform teaching the Four-Stage Twelve-Principle programming methodology for AI collaboration era. The app features gamified learning with bilingual support (English/Chinese).

### Key Architecture Patterns

#### Internationalization (i18n)
- Uses `next-intl` for bilingual support (English/Chinese)
- Locale routing: `/[locale]/page` structure
- Route configuration in `src/i18n/routing.ts`
- Translation files in `src/messages/` (en.json, zh.json)
- Navigation component handles locale switching at `src/components/Navigation.tsx:50-78`

#### Data Structure
Core entities defined in `src/types/index.ts`:
- **Principle**: Individual 12-factor principles with multilingual content
- **Stage**: Four stages containing grouped principles (Prepare, Execute, Collaborate, Iterate)
- **UserProgress**: Tracks learning progress and performance

Data source: `src/data/principles.ts` contains all 12 principles organized into 4 stages

#### Component Architecture
- **Navigation**: Responsive nav with locale switching
- **FlashCard**: Interactive learning cards
- **FourQuadrantDiagram**: Visual methodology representation
- Pages: Home, Principles, Flashcards, Quiz

#### Styling & UI
- Tailwind CSS for styling with dark mode support
- Headless UI components for accessibility
- Heroicons for iconography
- Framer Motion for animations
- Inter font for English, Noto Sans SC for Chinese

#### State Management
- Zustand for lightweight state management
- LocalStorage for user progress persistence

### File Structure Patterns
```
src/
├── app/[locale]/           # Locale-based routing
├── components/             # Reusable UI components
├── data/                   # Static data (principles)
├── i18n/                   # Internationalization setup
├── messages/               # Translation files
└── types/                  # TypeScript type definitions
```

### Development Workflow
1. Data changes go in `src/data/principles.ts`
2. UI components follow the bilingual pattern using `useTranslations()`
3. All user-facing routes must support both locales
4. New pages require entries in `src/i18n/routing.ts` pathnames
5. Components should support dark mode with Tailwind's `dark:` prefix

### Testing & Quality
- No test framework currently configured
- ESLint with Next.js TypeScript rules
- TypeScript strict mode for type safety

### Content Strategy
The platform teaches 12 principles across 4 stages:
1. **Prepare** (1-3): Single Source of Truth, Prompt First, Context Hygiene
2. **Execute** (4-6): Human-in-the-Loop, Chunked Work, Parallel Flow  
3. **Collaborate** (7-9): Cognitive Load Budget, Flow Protection, Reproducible Sessions
4. **Iterate** (10-12): Rest & Reflection, Skill Parity, Culture of Curiosity

Each principle contains concept, practices, and anti-patterns in both languages.