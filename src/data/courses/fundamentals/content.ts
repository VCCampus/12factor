import { CourseContent } from '../types';

export const fundamentalsContent: CourseContent = {
  id: 'fundamentals',
  title: 'courses.fundamentals.title',
  summary: 'courses.fundamentals.summary',
  icon: 'book',
  sections: [
    {
      id: 'basicStructure',
      title: 'courses.fundamentals.sections.basicStructure.title',
      theory: 'courses.fundamentals.sections.basicStructure.theory',
      examples: [
        'courses.fundamentals.sections.basicStructure.examples.0',
        'courses.fundamentals.sections.basicStructure.examples.1',
        'courses.fundamentals.sections.basicStructure.examples.2'
      ],
      keyTechniques: [
        'Messages API parameters: model, max_tokens, messages',
        'User/Assistant conversation format',
        'System prompt configuration',
        'Message alternation rules'
      ],
      commonPitfalls: [
        'Not alternating user/assistant messages',
        'Starting with assistant message instead of user',
        'Mixing system prompt with conversation messages'
      ]
    },
    {
      id: 'clearCommunication',
      title: 'courses.fundamentals.sections.clearCommunication.title',
      theory: 'courses.fundamentals.sections.clearCommunication.theory',
      examples: [
        'courses.fundamentals.sections.clearCommunication.examples.0',
        'courses.fundamentals.sections.clearCommunication.examples.1',
        'courses.fundamentals.sections.clearCommunication.examples.2',
        'courses.fundamentals.sections.clearCommunication.examples.3'
      ],
      keyTechniques: [
        'Direct and specific instructions',
        'Format constraints and requirements',
        'Forcing specific choices when needed',
        'The colleague test for clarity'
      ],
      commonPitfalls: [
        'Being too vague or ambiguous',
        'Not specifying output format',
        'Allowing AI to avoid making choices'
      ]
    },
    {
      id: 'rolePrompting',
      title: 'courses.fundamentals.sections.rolePrompting.title',
      theory: 'courses.fundamentals.sections.rolePrompting.theory',
      examples: [
        'courses.fundamentals.sections.rolePrompting.examples.0',
        'courses.fundamentals.sections.rolePrompting.examples.1',
        'courses.fundamentals.sections.rolePrompting.examples.2',
        'courses.fundamentals.sections.rolePrompting.examples.3'
      ],
      keyTechniques: [
        'Assigning specific roles and personas',
        'Providing detailed role context',
        'Using roles to improve domain expertise',
        'Setting roles in system prompts'
      ],
      commonPitfalls: [
        'Using roles without sufficient context',
        'Not being specific about role expertise',
        'Forgetting to set appropriate tone with role'
      ]
    }
  ]
};