# Prompt Engineering - Part 3: Advanced Course

## Overview

This RDD outlines the implementation of an advanced prompt engineering course building upon the fundamentals course. The course covers advanced techniques for data separation, output formatting, systematic thinking, and example-based prompting.

## Task: Implement the Intermediate Course

### Core Chapters

* Chapter 8: Avoiding Hallucinations
* Chapter 9: Building Complex Prompts (Industry Use Cases)
* Appendix: Beyond Standard Prompting

## Implementation Strategy

### 1. Course Structure Design

Following the established pattern from fundamentals course

### 2. Content Architecture

#### Learning Mode (content)
Each chapter includes:
- **Theory**: Core concepts and principles
- **Examples**: Code demonstrations with explanations
- **Key Techniques**: Practical applications
- **Common Pitfalls**: What to avoid

#### Practice Mode (practice)
Interactive exercises extracted from notebook files:
- Hands-on coding exercises
- Progressive difficulty
- Automated grading patterns
- Multiple hints per exercise
- Variations for different learning styles

#### Playground Mode (playground)
Pre-filled examples for experimentation:
- Template prompts for each technique
- Multiple variations to explore
- Real-world scenarios
- Model-agnostic examples

### 4. Technical Implementation

#### File Structure
```
src/data/courses/
├── index.ts                 # Course registry
├── types.ts                # Shared interfaces
└── advanced/              # New advanced course
    ├── index.ts            # Course export
    ├── content.ts          # Learning mode content
    ├── practice.ts         # Practice exercises
    └── playground.ts       # Playground scenarios
```

#### Data Flow
1. **Content Extraction**: Parse notebook files for exercises
2. **Translation Ready**: All content supports i18n keys
3. **Progressive Complexity**: Exercises build upon each other
4. **Cross-Platform**: Works with Claude, OpenAI, DeepSeek

### 5. Quality Assurance

#### Content Standards
- Clear, concise explanations
- Practical, real-world examples
- Progressive difficulty curve
- Model-agnostic techniques

#### Technical Standards
- TypeScript strict mode compliance
- Internationalization support
- Consistent data structures
- Automated exercise grading

### 6. Integration Points

#### Navigation Updates
- Add advanced course to dropdown menus
- Update routing configuration
- Ensure proper breadcrumbs

#### Translation Support
- Extract all user-facing text to translation files
- Support English and Chinese content
- Maintain consistent terminology

### 7. Success Metrics

#### Learning Effectiveness
- Exercise completion rates
- Concept mastery progression
- User engagement with different modes

#### Technical Performance
- Fast content loading
- Responsive interactions
- Error-free exercise execution

## Resources

### Source Material
- Jupyter notebooks in `rdd/prompt/`
- Existing fundamentals course structure
- Anthropic prompt engineering best practices

### Reference Implementation
- Fundamentals course at `src/data/courses/fundamentals/`
- Translation files in `src/messages/`
- Course layout components

## Requirements

### Functional Requirements
1. **Universal Compatibility**: Course content works across Claude, OpenAI GPTs, and DeepSeek
2. **Three Learning Modes**:
   - Learning Mode: Comprehensive theory and examples
   - Playground Mode: Pre-filled experimental templates
   - Practice Mode: Hands-on exercises with automated feedback
3. **Progressive Learning**: Builds logically on fundamentals course
4. **Bilingual Support**: Full English and Chinese localization

### Technical Requirements
1. **Code Quality**: Follow existing TypeScript patterns
2. **Performance**: Fast loading and responsive interactions
3. **Accessibility**: Support for screen readers and keyboard navigation
4. **Mobile Responsive**: Works across all device sizes

### Content Requirements
1. **Accuracy**: All examples tested and verified
2. **Clarity**: Concepts explained clearly for advanced learners
3. **Practicality**: Real-world applicable techniques
4. **Engagement**: Interactive and varied learning experiences

## Timeline & Milestones

### Phase 1: Content Development
- Extract and organize exercises from notebooks
- Create course content structure
- Design playground scenarios

### Phase 2: Implementation
- Build TypeScript data structures
- Implement course components
- Add navigation and routing

### Phase 3: Integration & Testing
- Integrate with existing course system
- Add translations
- Test across different LLM providers

### Phase 4: Quality Assurance
- User experience testing
- Content accuracy verification
- Performance optimization

This advanced course will provide learners with essential advanced prompt engineering skills, preparing them for complex real-world applications while maintaining the same high-quality, interactive learning experience established by the fundamentals course.
