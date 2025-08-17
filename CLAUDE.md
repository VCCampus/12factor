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

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

#### Required for Prompt Engineering Features
- `OPENAI_API_KEY` - OpenAI API key for LLM functionality
- `LLM_MODEL` - Model to use (default: 'gpt-3.5-turbo')

#### Optional LLM Configuration
- `LLM_API_URL` - Custom API endpoint URL (for DeepSeek, Azure OpenAI, etc.)

Example `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4
LLM_API_URL=https://api.deepseek.com/v1
```

## Project Architecture

### Overview
This is a Next.js 15 application for **12Factor.me**, an interactive learning platform teaching the Four-Stage Twelve-Principle programming methodology for AI collaboration era. The app features:
- **Gamified learning** with bilingual support (English/Chinese)
- **Prompt Engineering courses** with interactive exercises and live LLM integration
- **Multiple learning modes**: theory, practice, and playground environments
- **Real-time AI evaluation** of prompt quality using LLM APIs

### Key Architecture Patterns

#### Internationalization (i18n)
- Uses `next-intl` for bilingual support (English/Chinese)
- Locale routing: `/[locale]/page` structure
- Route configuration in `src/i18n/routing.ts`
- Translation files in `src/messages/` (en.json, zh.json)
- Navigation component handles locale switching at `src/components/Navigation.tsx:50-78`

#### LLM API Integration
- **API Route**: `/api/llm` - Handles LLM requests with rate limiting and security
- **Health Check**: `/api/llm/health` - Configuration status endpoint  
- **Security Features**: Request source validation, IP-based rate limiting, prompt length validation
- **Multi-Provider Support**: OpenAI (default), DeepSeek, Azure OpenAI via custom endpoints
- **Rate Limits**: 10 requests/minute, 50 requests/hour per IP
- **Allowed Contexts**: Restricted to prompt engineering course paths for security

Configuration in `src/app/api/llm/route.ts`:
- Supports both OpenAI SDK and custom API endpoints
- Automatic fallback from custom APIs to OpenAI
- Different parameters for 'playground', 'practice', and 'evaluation' modes

#### Data Structure
Core entities defined in `src/types/index.ts`:
- **Principle**: Individual 12-factor principles with multilingual content
- **Stage**: Four stages containing grouped principles (Prepare, Execute, Collaborate, Iterate)
- **UserProgress**: Tracks learning progress and performance
- **Course**: Prompt engineering course structure with content, practice, and playground
- **PracticeExample**: Interactive exercises with variations and hints
- **PlaygroundScenario**: Free-form exploration environments

Data sources:
- `src/data/principles.ts` - 12 principles organized into 4 stages
- `src/data/courses/` - Prompt engineering course content and exercises
- `src/data/notebook-content.ts` - Interactive lesson examples with LLM integration

#### Component Architecture
- **Navigation**: Responsive nav with locale switching and prompt engineering dropdown
- **FlashCard**: Interactive learning cards
- **FourQuadrantDiagram**: Visual methodology representation
- **InteractivePromptEditor**: Live prompt testing with LLM integration and quality evaluation
- **LearningCard**: Enhanced cards supporting different learning modes
- **CourseLayout/CourseProvider**: Structured course content delivery system
- **MobilePromptEngineeringMenu**: Mobile-optimized course navigation

Pages: Home, Principles, Flashcards, Quiz, Prompt Engineering courses

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
│   ├── prompt-engineering/ # Prompt engineering courses
│   │   └── [course]/       # Dynamic course routing
│   └── api/                # API routes
│       └── llm/            # LLM integration endpoints
├── components/             # Reusable UI components
│   └── courses/            # Course-specific components
├── data/                   # Static data
│   └── courses/            # Course content and structure
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

### LLM Integration Development
1. **API Testing**: Use `/api/llm/health` to verify configuration
2. **Course Development**: Add new courses in `src/data/courses/[course-name]/`
3. **Interactive Examples**: Define in `content.ts`, `practice.ts`, `playground.ts`
4. **Translation Keys**: Add to both `src/messages/en.json` and `zh.json`
5. **Security**: Test rate limiting and source validation in development
6. **Error Handling**: LLM API includes specific error responses for rate limits, quotas, and network issues

### Prompt Engineering Features
- **Course Structure**: Each course has theory content, practice exercises, and playground scenarios
- **Live Evaluation**: User prompts are evaluated by LLM for quality assessment
- **Multiple Modes**: 'playground' (exploratory), 'practice' (guided), 'evaluation' (assessment)
- **Bilingual Support**: All course content supports English/Chinese translations

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

**Prompt Engineering Courses:**
- **Fundamentals**: Basic prompt structure, system prompts, role assignment
- **Intermediate**: Advanced techniques, few-shot prompting, chain-of-thought
- **Practice Mode**: Guided exercises with hints and variations
- **Playground Mode**: Free exploration with live LLM feedback

### Debugging & Troubleshooting

#### LLM API Issues
- Check `/api/llm/health` for configuration status
- Verify environment variables in `.env.local`
- Monitor browser network tab for rate limiting (429 errors)
- Check server logs for API quota or authentication errors

#### Course Content Issues
- Ensure translation keys exist in both `en.json` and `zh.json`
- Verify course registration in `src/data/courses/index.ts`
- Check course content structure matches `CourseContent` interface

#### Common Error Patterns
- **"Method not allowed"**: LLM API only accepts POST requests
- **"Invalid request source"**: Requests must come from allowed domains/paths
- **"Rate limit exceeded"**: IP-based limiting active (10/min, 50/hour)
- **Missing translations**: Course content requires bilingual support