import { CourseContent } from '../types';

export const intermediateContent: CourseContent = {
  id: 'intermediate',
  title: 'courses.intermediate.title',
  summary: 'courses.intermediate.summary',
  icon: 'code',
  sections: [
    {
      id: 'separating-data-instructions',
      title: 'courses.intermediate.sections.dataInstructions.title',
      theory: `courses.intermediate.sections.dataInstructions.theory`,
      examples: [
        `courses.intermediate.sections.dataInstructions.examples.0`,
        `courses.intermediate.sections.dataInstructions.examples.1`,
        `courses.intermediate.sections.dataInstructions.examples.2`
      ],
      keyTechniques: [
        'F-string templating with variables',
        'XML tag wrapping for data boundaries', 
        'Clear instruction-data separation',
        'Input validation patterns'
      ],
      commonPitfalls: [
        'Not clearly separating instructions from data',
        'Forgetting to wrap variable content in XML tags',
        'Using unclear variable names in templates'
      ]
    },
    {
      id: 'formatting-output',
      title: 'courses.intermediate.sections.formatting.title',
      theory: `courses.intermediate.sections.formatting.theory`,
      examples: [
        `courses.intermediate.sections.formatting.examples.0`,
        `courses.intermediate.sections.formatting.examples.1`,
        `courses.intermediate.sections.formatting.examples.2`
      ],
      keyTechniques: [
        'XML tag output formatting',
        'Assistant turn prefilling',
        'JSON output enforcement',
        'Multi-variable template formatting'
      ],
      commonPitfalls: [
        'Not using consistent output format tags',
        'Forgetting to prefill the opening tag',
        'Not enforcing format requirements'
      ]
    },
    {
      id: 'thinking-step-by-step',
      title: 'courses.intermediate.sections.thinking.title',
      theory: `courses.intermediate.sections.thinking.theory`,
      examples: [
        `courses.intermediate.sections.thinking.examples.0`,
        `courses.intermediate.sections.thinking.examples.1`,
        `courses.intermediate.sections.thinking.examples.2`
      ],
      keyTechniques: [
        'Explicit reasoning steps',
        'XML-tagged thinking sections',
        'Multi-perspective analysis',
        'Brainstorming before answering'
      ],
      commonPitfalls: [
        'Asking for thinking without showing the work',
        'Not structuring the thinking process',
        'Skipping reasoning for complex problems'
      ]
    },
    {
      id: 'using-examples',
      title: 'courses.intermediate.sections.examples.title',
      theory: `courses.intermediate.sections.examples.theory`,
      examples: [
        `courses.intermediate.sections.examples.examples.0`,
        `courses.intermediate.sections.examples.examples.1`,
        `courses.intermediate.sections.examples.examples.2`
      ],
      keyTechniques: [
        'Few-shot example selection',
        'Example formatting patterns',
        'Context-appropriate examples',
        'Output format consistency'
      ],
      commonPitfalls: [
        'Using poor quality or irrelevant examples',
        'Not maintaining consistent format across examples',
        'Too few or too many examples'
      ]
    }
  ]
};