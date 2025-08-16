import { PromptLesson } from '@/types';

export const promptLessons: PromptLesson[] = [
  // Integrated Fundamentals Course - Chapter Based on Anthropic ipynb
  {
    id: 'fundamentals',
    chapter: 1,
    type: 'course',
    messageKey: 'fundamentals',
    content: {
      theory: 'fundamentals.theory',
      sections: [
        {
          title: 'fundamentals.chapter1.title',
          theory: 'fundamentals.chapter1.theory',
          examples: 'fundamentals.chapter1.examples',
          exercises: [{
            id: "count_to_three",
            instructions: 'fundamentals.chapter1.exercises.countToThree.instructions',
            template: 'fundamentals.chapter1.exercises.countToThree.template',
            expectedPattern: ".*1.*2.*3.*",
            hints: 'fundamentals.chapter1.exercises.countToThree.hints'
          }, {
            id: "system_prompt_child",
            instructions: 'fundamentals.chapter1.exercises.systemPromptChild.instructions',
            template: 'fundamentals.chapter1.exercises.systemPromptChild.template',
            expectedPattern: ".*(giggles|soo).*",
            hints: 'fundamentals.chapter1.exercises.systemPromptChild.hints'
          }]
        },
        {
          title: 'fundamentals.chapter2.title',
          theory: 'fundamentals.chapter2.theory',
          examples: 'fundamentals.chapter2.examples',
          exercises: [{
            id: "spanish_response",
            instructions: 'fundamentals.chapter2.exercises.spanishResponse.instructions',
            template: 'fundamentals.chapter2.exercises.spanishResponse.template',
            expectedPattern: ".*hola.*",
            hints: 'fundamentals.chapter2.exercises.spanishResponse.hints'
          }, {
            id: "one_player_only",
            instructions: 'fundamentals.chapter2.exercises.onePlayerOnly.instructions',
            template: 'fundamentals.chapter2.exercises.onePlayerOnly.template',
            expectedPattern: "^Michael Jordan$",
            hints: 'fundamentals.chapter2.exercises.onePlayerOnly.hints'
          }, {
            id: "long_story",
            instructions: 'fundamentals.chapter2.exercises.longStory.instructions',
            template: 'fundamentals.chapter2.exercises.longStory.template',
            expectedPattern: ".*",
            hints: 'fundamentals.chapter2.exercises.longStory.hints'
          }]
        },
        {
          title: 'fundamentals.chapter3.title',
          theory: 'fundamentals.chapter3.theory',
          examples: 'fundamentals.chapter3.examples',
          exercises: [{
            id: "math_correction",
            instructions: 'fundamentals.chapter3.exercises.mathCorrection.instructions',
            template: 'fundamentals.chapter3.exercises.mathCorrection.template',
            expectedPattern: ".*(incorrect|not correct).*",
            hints: 'fundamentals.chapter3.exercises.mathCorrection.hints'
          }]
        }
      ]
    }
  },

  // Integrated Advanced Course
  {
    id: 'advanced',
    chapter: 2,
    type: 'course',
    messageKey: 'advanced',
    content: {
      theory: 'advanced.theory',
      sections: [
        {
          title: 'advanced.dataSeparation.title',
          theory: 'advanced.dataSeparation.theory',
          examples: 'advanced.dataSeparation.examples',
          exercises: [{
            id: "adv_1",
            instructions: 'advanced.dataSeparation.exercises.adv1.instructions',
            template: 'advanced.dataSeparation.exercises.adv1.template',
            expectedPattern: ".*(grammar|syntax|structure|analysis).*",
            hints: 'advanced.dataSeparation.exercises.adv1.hints'
          }]
        },
        {
          title: 'advanced.outputFormatting.title',
          theory: 'advanced.outputFormatting.theory',
          examples: 'advanced.outputFormatting.examples',
          exercises: [{
            id: "adv_2",
            instructions: 'advanced.outputFormatting.exercises.adv2.instructions',
            template: 'advanced.outputFormatting.exercises.adv2.template',
            expectedPattern: ".*1\\..*2\\..*3\\.",
            hints: 'advanced.outputFormatting.exercises.adv2.hints'
          }]
        },
        {
          title: 'advanced.chainOfThought.title',
          theory: 'advanced.chainOfThought.theory',
          examples: 'advanced.chainOfThought.examples',
          exercises: [{
            id: "adv_3",
            instructions: 'advanced.chainOfThought.exercises.adv3.instructions',
            template: 'advanced.chainOfThought.exercises.adv3.template',
            expectedPattern: ".*(step|first|then|therefore|because|so).*",
            hints: 'advanced.chainOfThought.exercises.adv3.hints'
          }]
        }
      ]
    },
    prerequisites: ['fundamentals']
  }
];

export const promptStages = [
  {
    id: 1,
    messageKey: 'promptStage1',
    lessons: ['fundamentals']
  },
  {
    id: 2,
    messageKey: 'promptStage2', 
    lessons: ['advanced']
  }
];