import { PlaygroundScenario } from '../types';

export const fundamentalsPlayground: PlaygroundScenario[] = [
  {
    id: 'playground-chapter-1',
    title: 'playground.chapter1.title',
    examples: [
      {
        name: 'playground.chapter1.creativeCounting.name',
        prompt: 'Count to five in a creative way',
        systemPrompt: '',
        description: 'playground.chapter1.creativeCounting.description',
        variations: [
          {
            name: 'playground.chapter1.creativeCounting.variations.basic',
            prompt: 'Count to five in a creative way',
            systemPrompt: '',
            explanation: 'playground.chapter1.creativeCounting.variations.basicExplanation'
          },
          {
            name: 'playground.chapter1.creativeCounting.variations.storytelling',
            prompt: 'Count to five by telling a short story where each number appears naturally',
            systemPrompt: '',
            explanation: 'playground.chapter1.creativeCounting.variations.storytellingExplanation'
          },
          {
            name: 'playground.chapter1.creativeCounting.variations.poetic',
            prompt: 'Count to five using rhymes or poetic language',
            systemPrompt: '',
            explanation: 'playground.chapter1.creativeCounting.variations.poeticExplanation'
          },
          {
            name: 'playground.chapter1.creativeCounting.variations.withContext',
            prompt: 'Count to five in a creative way, making it educational for children',
            systemPrompt: 'You are a kindergarten teacher who makes learning fun and engaging.',
            explanation: 'playground.chapter1.creativeCounting.variations.withContextExplanation'
          }
        ]
      },
      {
        name: 'playground.chapter1.systemPromptExperiment.name',
        prompt: 'Explain what clouds are made of',
        systemPrompt: '',
        description: 'playground.chapter1.systemPromptExperiment.description',
        variations: [
          {
            name: 'playground.chapter1.systemPromptExperiment.variations.basic',
            prompt: 'Explain what clouds are made of',
            systemPrompt: '',
            explanation: 'playground.chapter1.systemPromptExperiment.variations.basicExplanation'
          },
          {
            name: 'playground.chapter1.systemPromptExperiment.variations.structured',
            prompt: 'Explain what clouds are made of',
            systemPrompt: 'Please provide a clear, structured explanation.',
            explanation: 'playground.chapter1.systemPromptExperiment.variations.structuredExplanation'
          },
          {
            name: 'playground.chapter1.systemPromptExperiment.variations.detailed',
            prompt: 'Explain what clouds are made of',
            systemPrompt: 'Provide a detailed scientific explanation with examples.',
            explanation: 'playground.chapter1.systemPromptExperiment.variations.detailedExplanation'
          },
          {
            name: 'playground.chapter1.systemPromptExperiment.variations.simple',
            prompt: 'Explain what clouds are made of',
            systemPrompt: 'Explain in simple, easy-to-understand language.',
            explanation: 'playground.chapter1.systemPromptExperiment.variations.simpleExplanation'
          }
        ]
      }
    ],
    hints: [
      'playground.chapter1.hint1',
      'playground.chapter1.hint2',
      'playground.chapter1.hint3'
    ]
  },
  {
    id: 'playground-chapter-2',
    title: 'playground.chapter2.title',
    examples: [
      {
        name: 'playground.chapter2.languageExperiment.name',
        prompt: 'Greet me in the language of your choice and explain why you chose it',
        systemPrompt: '',
        description: 'playground.chapter2.languageExperiment.description',
        variations: [
          {
            name: 'playground.chapter2.languageExperiment.variations.basic',
            prompt: 'Greet me in the language of your choice and explain why you chose it',
            systemPrompt: '',
            explanation: 'playground.chapter2.languageExperiment.variations.basicExplanation'
          },
          {
            name: 'playground.chapter2.languageExperiment.variations.specific',
            prompt: 'Greet me in Spanish and explain the cultural significance of your chosen greeting',
            systemPrompt: '',
            explanation: 'playground.chapter2.languageExperiment.variations.specificExplanation'
          },
          {
            name: 'playground.chapter2.languageExperiment.variations.comparative',
            prompt: 'Greet me in two different languages and compare how greetings reflect cultural values',
            systemPrompt: '',
            explanation: 'playground.chapter2.languageExperiment.variations.comparativeExplanation'
          },
          {
            name: 'playground.chapter2.languageExperiment.variations.contextual',
            prompt: 'Greet me appropriately for a business meeting and explain your choice',
            systemPrompt: 'You are a professional business consultant familiar with international etiquette.',
            explanation: 'playground.chapter2.languageExperiment.variations.contextualExplanation'
          }
        ]
      },
      {
        name: 'playground.chapter2.formatExperiment.name',
        prompt: 'List your top 3 favorite activities. Try different formatting styles.',
        systemPrompt: '',
        description: 'playground.chapter2.formatExperiment.description',
        variations: [
          {
            name: 'playground.chapter2.formatExperiment.variations.basic',
            prompt: 'List your top 3 favorite activities. Try different formatting styles.',
            systemPrompt: '',
            explanation: 'playground.chapter2.formatExperiment.variations.basicExplanation'
          },
          {
            name: 'playground.chapter2.formatExperiment.variations.numbered',
            prompt: 'List your top 3 favorite activities in a numbered list with brief explanations for each',
            systemPrompt: '',
            explanation: 'playground.chapter2.formatExperiment.variations.numberedExplanation'
          },
          {
            name: 'playground.chapter2.formatExperiment.variations.detailed',
            prompt: 'List your top 3 favorite activities with detailed descriptions and reasons why you enjoy them',
            systemPrompt: '',
            explanation: 'playground.chapter2.formatExperiment.variations.detailedExplanation'
          },
          {
            name: 'playground.chapter2.formatExperiment.variations.creative',
            prompt: 'Present your top 3 favorite activities in a creative format (e.g., as a poem, story, or advertisement)',
            systemPrompt: '',
            explanation: 'playground.chapter2.formatExperiment.variations.creativeExplanation'
          }
        ]
      }
    ],
    hints: [
      'playground.chapter2.hint1',
      'playground.chapter2.hint2',
      'playground.chapter2.hint3'
    ]
  },
  {
    id: 'playground-chapter-3',
    title: 'playground.chapter3.title',
    examples: [
      {
        name: 'playground.chapter3.roleComparison.name',
        prompt: 'Should I invest in cryptocurrency?',
        systemPrompt: 'You are a conservative financial advisor with 20 years of experience.',
        description: 'playground.chapter3.roleComparison.description',
        variations: [
          {
            name: 'playground.chapter3.roleComparison.variations.basic',
            prompt: 'Should I invest in cryptocurrency?',
            systemPrompt: '',
            explanation: 'playground.chapter3.roleComparison.variations.basicExplanation'
          },
          {
            name: 'playground.chapter3.roleComparison.variations.conservative',
            prompt: 'Should I invest in cryptocurrency?',
            systemPrompt: 'You are a conservative financial advisor with 20 years of experience.',
            explanation: 'playground.chapter3.roleComparison.variations.conservativeExplanation'
          },
          {
            name: 'playground.chapter3.roleComparison.variations.aggressive',
            prompt: 'Should I invest in cryptocurrency?',
            systemPrompt: 'You are a tech-savvy investment advisor who specializes in emerging digital assets.',
            explanation: 'playground.chapter3.roleComparison.variations.aggressiveExplanation'
          },
          {
            name: 'playground.chapter3.roleComparison.variations.balanced',
            prompt: 'Should I invest in cryptocurrency? Please provide a balanced analysis.',
            systemPrompt: 'You are a certified financial planner who provides objective, balanced investment advice.',
            explanation: 'playground.chapter3.roleComparison.variations.balancedExplanation'
          }
        ]
      },
      {
        name: 'playground.chapter3.expertiseExperiment.name',
        prompt: 'Explain machine learning to me',
        systemPrompt: 'You are a data science professor who excels at making complex topics accessible.',
        description: 'playground.chapter3.expertiseExperiment.description',
        variations: [
          {
            name: 'playground.chapter3.expertiseExperiment.variations.basic',
            prompt: 'Explain machine learning to me',
            systemPrompt: '',
            explanation: 'playground.chapter3.expertiseExperiment.variations.basicExplanation'
          },
          {
            name: 'playground.chapter3.expertiseExperiment.variations.professor',
            prompt: 'Explain machine learning to me',
            systemPrompt: 'You are a data science professor who excels at making complex topics accessible.',
            explanation: 'playground.chapter3.expertiseExperiment.variations.professorExplanation'
          },
          {
            name: 'playground.chapter3.expertiseExperiment.variations.beginner',
            prompt: 'Explain machine learning to a complete beginner',
            systemPrompt: 'You are a friendly tutor who specializes in teaching technical concepts to absolute beginners.',
            explanation: 'playground.chapter3.expertiseExperiment.variations.beginnerExplanation'
          },
          {
            name: 'playground.chapter3.expertiseExperiment.variations.practical',
            prompt: 'Explain machine learning with real-world examples and applications',
            systemPrompt: 'You are a data scientist working in industry who likes to show practical applications.',
            explanation: 'playground.chapter3.expertiseExperiment.variations.practicalExplanation'
          }
        ]
      }
    ],
    hints: [
      'playground.chapter3.hint1',
      'playground.chapter3.hint2',
      'playground.chapter3.hint3'
    ]
  }
];