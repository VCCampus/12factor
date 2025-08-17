# Prompt Engineering - Part 2: Intermediate Course

## Overview

This RDD outlines the implementation of an intermediate prompt engineering course building upon the fundamentals course. The course covers advanced techniques for data separation, output formatting, systematic thinking, and example-based prompting.

## Task: Implement the Intermediate Course

### Core Chapters
* **Chapter 4**: Separating Data from Instructions
* **Chapter 5**: Formatting Output & Speaking for Claude
* **Chapter 6**: Precognition (Thinking Step by Step)
* **Chapter 7**: Using Examples (Few-Shot Prompting)

## Implementation Strategy

### 1. Course Structure Design

Following the established pattern from fundamentals course:

```typescript
interface IntermediateCourse {
  content: CourseContent;     // Learning Mode - theory and examples
  practice: PracticeExample[]; // Practice Mode - extracted from notebooks
  playground: PlaygroundScenario[]; // Playground Mode - pre-filled examples
}
```

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

### 3. Chapter Breakdown

#### Chapter 4: Separating Data from Instructions
**Focus**: Template-based prompting and XML tag usage

**Learning Objectives**:
- Create reusable prompt templates with variables
- Use XML tags to clearly separate instructions from data
- Handle user input safely and effectively
- Build scalable prompt systems

**Key Techniques**:
- F-string templating with variables
- XML tag wrapping for data boundaries
- Clear instruction-data separation
- Input validation patterns

**Practice Exercises** (extracted from notebook):
- Haiku topic templating
- Dog question with typos (XML tag fixing)
- Email formatting with proper separation

#### Chapter 5: Formatting Output & Speaking for Claude
**Focus**: Output control and response prefilling

**Learning Objectives**:
- Format LLM output in structured ways (XML, JSON)
- Use prefilling to guide response generation
- Control output format reliably
- Extract specific content programmatically

**Key Techniques**:
- XML tag output formatting
- Assistant turn prefilling
- JSON output enforcement
- Multi-variable template formatting

**Practice Exercises** (extracted from notebook):
- Steph Curry basketball argument (prefilling)
- Two haikus output formatting
- Two animals, two haikus challenge

#### Chapter 6: Precognition (Thinking Step by Step)
**Focus**: Chain-of-thought prompting and reasoning

**Learning Objectives**:
- Implement step-by-step reasoning patterns
- Improve accuracy through explicit thinking
- Handle complex analytical tasks
- Use role prompting with reasoning

**Key Techniques**:
- Explicit reasoning steps
- XML-tagged thinking sections
- Multi-perspective analysis
- Brainstorming before answering

**Practice Exercises** (extracted from notebook):
- Email classification with reasoning
- Email classification with formatted output
- Complex reasoning with multiple steps

#### Chapter 7: Using Examples (Few-Shot Prompting)
**Focus**: Example-driven prompt engineering

**Learning Objectives**:
- Design effective few-shot prompts
- Choose optimal examples for guidance
- Format examples for maximum impact
- Apply examples across different domains

**Key Techniques**:
- Few-shot example selection
- Example formatting patterns
- Context-appropriate examples
- Output format consistency

**Practice Exercises** (extracted from notebook):
- Email formatting via examples
- Pattern recognition through examples
- Complex task completion with guidance

### 4. Technical Implementation

#### File Structure
```
src/data/courses/
├── index.ts                 # Course registry
├── types.ts                # Shared interfaces
└── intermediate/            # New intermediate course
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
- Add intermediate course to dropdown menus
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
- Jupyter notebooks in `rdd/prompt/04-07_*.ipynb`
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
2. **Clarity**: Concepts explained clearly for intermediate learners
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

This intermediate course will provide learners with essential advanced prompt engineering skills, preparing them for complex real-world applications while maintaining the same high-quality, interactive learning experience established by the fundamentals course.
