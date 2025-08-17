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
          title: 'fundamentals.sections.basicStructure.title',
          theory: 'fundamentals.sections.basicStructure.theory',
          messageRules: 'fundamentals.sections.basicStructure.messageRules',
          systemPrompts: 'fundamentals.sections.basicStructure.systemPrompts',
          messageFormatting: 'fundamentals.sections.basicStructure.messageFormatting',
          multiTurnConversations: 'fundamentals.sections.basicStructure.multiTurnConversations',
          whySystemPrompts: 'fundamentals.sections.basicStructure.whySystemPrompts',
          examples: 'fundamentals.sections.basicStructure.examples',
          exercises: [{
            id: "count_to_three",
            instructions: 'fundamentals.sections.basicStructure.exercises.countToThree.instructions',
            template: 'fundamentals.sections.basicStructure.exercises.countToThree.template',
            expectedPattern: ".*1.*2.*3.*",
            hints: 'fundamentals.sections.basicStructure.exercises.countToThree.hints'
          }, {
            id: "system_prompt_child",
            instructions: 'fundamentals.sections.basicStructure.exercises.systemPromptChild.instructions',
            template: 'fundamentals.sections.basicStructure.exercises.systemPromptChild.template',
            expectedPattern: ".*(giggles|soo).*",
            hints: 'fundamentals.sections.basicStructure.exercises.systemPromptChild.hints'
          }]
        },
        {
          title: 'fundamentals.sections.clearCommunication.title',
          theory: 'fundamentals.sections.clearCommunication.theory',
          directCommunication: 'fundamentals.sections.clearCommunication.directCommunication',
          specificityMatters: 'fundamentals.sections.clearCommunication.specificityMatters',
          goldenRule: 'fundamentals.sections.clearCommunication.goldenRule',
          forcedChoices: 'fundamentals.sections.clearCommunication.forcedChoices',
          examples: 'fundamentals.sections.clearCommunication.examples',
          exercises: [{
            id: "spanish_response",
            instructions: 'fundamentals.sections.clearCommunication.exercises.spanishResponse.instructions',
            template: 'fundamentals.sections.clearCommunication.exercises.spanishResponse.template',
            expectedPattern: ".*hola.*",
            hints: 'fundamentals.sections.clearCommunication.exercises.spanishResponse.hints'
          }, {
            id: "one_player_only",
            instructions: 'fundamentals.sections.clearCommunication.exercises.onePlayerOnly.instructions',
            template: 'fundamentals.sections.clearCommunication.exercises.onePlayerOnly.template',
            expectedPattern: "^Michael Jordan$",
            hints: 'fundamentals.sections.clearCommunication.exercises.onePlayerOnly.hints'
          }, {
            id: "long_story",
            instructions: 'fundamentals.sections.clearCommunication.exercises.longStory.instructions',
            template: 'fundamentals.sections.clearCommunication.exercises.longStory.template',
            expectedPattern: ".*",
            hints: 'fundamentals.sections.clearCommunication.exercises.longStory.hints'
          }]
        },
        {
          title: 'fundamentals.sections.rolePrompting.title',
          theory: 'fundamentals.sections.rolePrompting.theory',
          roleContext: 'fundamentals.sections.rolePrompting.roleContext',
          roleEffects: 'fundamentals.sections.rolePrompting.roleEffects',
          rolePromptLocation: 'fundamentals.sections.rolePrompting.rolePromptLocation',
          detailMatters: 'fundamentals.sections.rolePrompting.detailMatters',
          examples: 'fundamentals.sections.rolePrompting.examples',
          exercises: [{
            id: "math_correction",
            instructions: 'fundamentals.sections.rolePrompting.exercises.mathCorrection.instructions',
            template: 'fundamentals.sections.rolePrompting.exercises.mathCorrection.template',
            expectedPattern: ".*(incorrect|not correct).*",
            hints: 'fundamentals.sections.rolePrompting.exercises.mathCorrection.hints'
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