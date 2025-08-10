# 12factor.me Website Requirements Design Document (RDD)

## Task

* Build a website for 12factor.md

## Requirements

* use playwright mcp to understand the ui and ux of https://ctrl.xyz/
* you can learn from the ui and ux of https://ctrl.xyz/ and customized it for 12factor.me
* the draft text content of 12factor.md is in DRAFT.md

## Project Overview

**Project Name**: 12factor.me - Vibe Coding 10x Engineer Methodology Website  
**Core Objective**: Create a modern, gamified interactive learning platform showcasing the Four-Stage Twelve-Principle programming methodology for the AI collaboration era  
**Target Users**: AI-era developers, engineering teams, technical managers

## Content Architecture Analysis

### Core Methodology Structure
```
Four-Stage Cycle:
├── Stage 1: Prepare
│   ├── 1. Single Source of Truth
│   ├── 2. Prompt First  
│   └── 3. Context Hygiene
├── Stage 2: Execute
│   ├── 4. Human-in-the-Loop
│   ├── 5. Chunked Work
│   └── 6. Parallel Flow
├── Stage 3: Collaborate
│   ├── 7. Cognitive Load Budget
│   ├── 8. Flow Protection
│   └── 9. Reproducible Sessions
└── Stage 4: Iterate
    ├── 10. Rest & Reflection
    ├── 11. Skill Parity
    └── 12. Culture of Curiosity
```

### Content Structure Data
Each principle contains:
- **Concept**: Core philosophy and reasoning
- **Practices**: Specific actionable guidelines
- **Anti-patterns**: Common mistakes to avoid

## Functional Requirements

### 1. Core Display Features
- **Four-Quadrant Cycle Diagram**: Interactive circular flow chart with clickable stages for deep learning
- **Bilingual Toggle**: Seamless Chinese-English switching with consistent user experience
- **Responsive Design**: Multi-device support (desktop, tablet, mobile)
- **Modern UI**: Inspired by 12factor.net, Stripe Docs, Vercel minimalist design style

### 2. Gamification Learning Features

#### 2.1 Flashcards System
- **Card Display**: Front shows principle name and concept, back shows practices and anti-patterns
- **Interactions**: Click to flip, swipe left/right to navigate
- **Progress Tracking**: Record learning progress with "Mastered"/"Needs Review" states
- **Review Algorithm**: Smart review reminders based on forgetting curve

#### 2.2 Quiz System
- **Stage Testing**: Auto-trigger 3-5 questions after completing each stage
- **Question Types**: Multiple choice, true/false, fill-in-blank, matching
- **Anti-pattern Recognition**: Include anti-pattern distractors to improve identification skills
- **Bilingual Practice**: Randomly switch between Chinese/English questions

#### 2.3 Progress & Achievement System
- **Progress Circles**: Show completion percentage for each stage (25%/50%/75%/100%)
- **Digital Badges**: Earn "Vibe Coding 10x Engineer" certification after full completion
- **Daily Challenges**: Random 3-card daily review sessions
- **Team Sharing**: Share achievements to Slack, WeChat and other team tools

### 3. Interactive Experience Features
- **Learning Path**: Guide users through the four-stage sequential learning
- **Bookmark Collections**: Save specific principles for quick access
- **Search Function**: Support Chinese/English keyword search across principle content
- **Export Function**: Generate PDF posters and personal learning reports

## Technical Requirements

### Frontend Tech Stack
- **Framework**: Next.js 14+ (App Router support)
- **Styling**: Tailwind CSS + Headless UI
- **Animations**: Framer Motion (card flips, page transitions)
- **Internationalization**: next-intl or react-i18next
- **State Management**: Zustand (lightweight state management)
- **Local Storage**: localStorage (user progress persistence)

### Performance Requirements
- **First Paint**: < 2 seconds
- **Interaction Response**: < 100ms
- **Mobile Adaptation**: Fully responsive
- **SEO Optimization**: Search engine friendly
- **PWA Support**: Offline access and installation

### Data Structure Design
```typescript
interface Principle {
  id: number;
  stage: 1 | 2 | 3 | 4;
  name: {
    zh: string;
    en: string;
  };
  concept: {
    zh: string;
    en: string;
  };
  practices: {
    zh: string[];
    en: string[];
  };
  antiPatterns: {
    zh: string[];
    en: string[];
  };
}

interface UserProgress {
  principleId: number;
  status: 'not_started' | 'learning' | 'mastered' | 'needs_review';
  lastReviewed: Date;
  correctAnswers: number;
  totalAttempts: number;
}
```

## UI/UX Design Requirements

### Visual Design
- **Color Scheme**: Black-white-gray minimalist + accent color (#3B82F6 blue)
- **Typography**: 
  - English: Inter
  - Chinese: Source Han Sans
- **Icon System**: Heroicons or Lucide React

### Interaction Design
- **Navigation**: Fixed top nav + sidebar table of contents
- **Card Interactions**: Hover effects, click feedback, swipe gestures
- **Loading States**: Skeleton screens, progress indicators
- **Error Handling**: Friendly error messages and retry mechanisms

### Responsive Layout
- **Desktop (>1024px)**: Left nav + main content + right progress panel
- **Tablet (768-1024px)**: Top nav + main content area
- **Mobile (<768px)**: Single column layout + bottom navigation

## Optimized Execution Plan

### Phase 1: Project Setup (Week 1)
- [x] Requirements analysis and tech stack selection
- [ ] Project initialization and basic configuration
- [ ] Internationalization system setup
- [ ] Basic UI component library
- [ ] Responsive layout framework

### Phase 2: Core Feature Development (Week 2-3)
- [ ] Data structure design and content input
- [ ] Four-quadrant flow diagram component
- [ ] Principle detail pages
- [ ] Bilingual toggle functionality
- [ ] Basic navigation and routing

### Phase 3: Gamification Features (Week 4-5)
- [ ] Flashcards component development
- [ ] Quiz system development
- [ ] Progress tracking system
- [ ] Achievement badge system
- [ ] Local storage functionality

### Phase 4: Interaction Optimization (Week 6)
- [ ] Animation effects and micro-interactions
- [ ] Performance optimization and testing
- [ ] SEO and PWA configuration
- [ ] Mobile adaptation optimization
- [ ] User experience testing

### Phase 5: Launch Deployment (Week 7)
- [ ] Production environment configuration
- [ ] Domain resolution and SSL certificates
- [ ] Monitoring and analytics integration
- [ ] User feedback collection mechanism
- [ ] Documentation and maintenance plan

## Sub-Goals Breakdown

### Priority P0 (Must Have)
1. **Basic Content Display**: Complete four-stage twelve-principle presentation
2. **Bilingual Support**: Seamless Chinese-English switching
3. **Responsive Design**: Perfect multi-device adaptation
4. **Basic Flashcards**: Card flipping and progress recording

### Priority P1 (Should Have)  
1. **Quiz System**: Stage testing and achievement system
2. **Four-Quadrant Flow Chart**: Interactive cycle diagram
3. **Search Function**: Quick content retrieval
4. **Export Function**: PDF poster generation

### Priority P2 (Could Have)
1. **Daily Challenges**: Smart review reminders
2. **Team Sharing**: Social media integration
3. **Learning Analytics**: Detailed progress reports
4. **Offline Support**: PWA functionality

## Success Metrics

### User Experience Metrics
- **Learning Completion Rate**: Users completing all 12 principles > 60%
- **Quiz Pass Rate**: Overall quiz system pass rate > 80%
- **Review Frequency**: User active review frequency > 2 times per week
- **Session Duration**: Average visit duration > 10 minutes

### Technical Performance Metrics
- **First Paint Time**: < 2 seconds
- **Interaction Response Time**: < 100ms
- **Mobile Adaptation Score**: Perfect score
- **SEO Score**: > 90 points

### Business Objectives
- **Monthly Active Users**: Target 1000+
- **Content Sharing Rate**: 20%+ users share content
- **Team Adoption Rate**: 50+ teams use as training material
- **Community Feedback**: Collect 100+ user feedback and improvement suggestions

## Risk Assessment & Mitigation Strategies

### Technical Risks
- **Performance Risk**: Too many animations causing performance issues → Progressive enhancement strategy
- **Compatibility Risk**: Legacy browser compatibility → Graceful degradation approach
- **Internationalization Risk**: Translation quality and sync updates → Professional translation and version control

### User Experience Risks
- **Learning Curve Too Steep**: Over-complex gamification → Simplify operation flow
- **Content Overload**: Large information volume causing cognitive load → Progressive content disclosure
- **Mobile Experience**: Inconvenient touch operations → Targeted mobile optimization

## Future Iteration Plan

### V1.1 Enhanced Version (1 month after launch)
- UI/UX optimization based on user feedback
- Additional question types and challenge modes
- Personalized learning path recommendations

### V1.2 Community Version (3 months after launch)
- User-generated content features
- Team collaborative learning mode
- Learning data visualization analytics

### V2.0 Platform Version (6 months after launch)  
- Multi-methodology support (beyond 12 factor)
- Enterprise customization solutions
- API opening and third-party integrations

---

**Document Version**: v1.0  
**Created**: 2025-08-09  
**Last Updated**: 2025-08-09  
**Owner**: AI Assistant  
**Status**: Draft → Review → Approved
