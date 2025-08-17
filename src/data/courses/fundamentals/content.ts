import { CourseContent } from '../types';

export const fundamentalsContent: CourseContent = {
  id: 'fundamentals',
  title: 'fundamentals.title',
  summary: 'fundamentals.summary',
  icon: 'book',
  sections: [
    {
      id: 'chapter1',
      title: 'fundamentals.chapter1.title',
      theory: 'fundamentals.chapter1.theory',
      messageRules: 'fundamentals.chapter1.messageRules',
      systemPrompts: 'fundamentals.chapter1.systemPrompts',
      messageFormatting: 'fundamentals.chapter1.messageFormatting',
      multiTurnConversations: 'fundamentals.chapter1.multiTurnConversations',
      whySystemPrompts: 'fundamentals.chapter1.whySystemPrompts',
      examples: 'fundamentals.chapter1.examples',
      exercises: [
        {
          id: "count_to_three",
          instructions: 'fundamentals.chapter1.exercises.countToThree.instructions',
          template: 'fundamentals.chapter1.exercises.countToThree.template',
          expectedPattern: ".*1.*2.*3.*",
          hints: 'fundamentals.chapter1.exercises.countToThree.hints'
        },
        {
          id: "system_prompt_child",
          instructions: 'fundamentals.chapter1.exercises.systemPromptChild.instructions',
          template: 'fundamentals.chapter1.exercises.systemPromptChild.template',
          expectedPattern: ".*(giggles|soo).*",
          hints: 'fundamentals.chapter1.exercises.systemPromptChild.hints'
        }
      ]
    },
    {
      id: 'chapter2',
      title: 'fundamentals.chapter2.title',
      theory: 'fundamentals.chapter2.theory',
      directCommunication: 'fundamentals.chapter2.directCommunication',
      specificityMatters: 'fundamentals.chapter2.specificityMatters',
      goldenRule: 'fundamentals.chapter2.goldenRule',
      forcedChoices: 'fundamentals.chapter2.forcedChoices',
      examples: 'fundamentals.chapter2.examples',
      exercises: [
        {
          id: "spanish_response",
          instructions: 'fundamentals.chapter2.exercises.spanishResponse.instructions',
          template: 'fundamentals.chapter2.exercises.spanishResponse.template',
          expectedPattern: ".*hola.*",
          hints: 'fundamentals.chapter2.exercises.spanishResponse.hints'
        },
        {
          id: "one_player_only",
          instructions: 'fundamentals.chapter2.exercises.onePlayerOnly.instructions',
          template: 'fundamentals.chapter2.exercises.onePlayerOnly.template',
          expectedPattern: "^Michael Jordan$",
          hints: 'fundamentals.chapter2.exercises.onePlayerOnly.hints'
        },
        {
          id: "long_story",
          instructions: 'fundamentals.chapter2.exercises.longStory.instructions',
          template: 'fundamentals.chapter2.exercises.longStory.template',
          expectedPattern: ".*",
          hints: 'fundamentals.chapter2.exercises.longStory.hints'
        }
      ]
    },
    {
      id: 'chapter3',
      title: 'fundamentals.chapter3.title',
      theory: 'fundamentals.chapter3.theory',
      roleContext: 'fundamentals.chapter3.roleContext',
      roleEffects: 'fundamentals.chapter3.roleEffects',
      rolePromptLocation: 'fundamentals.chapter3.rolePromptLocation',
      detailMatters: 'fundamentals.chapter3.detailMatters',
      examples: 'fundamentals.chapter3.examples',
      exercises: [
        {
          id: "math_correction",
          instructions: 'fundamentals.chapter3.exercises.mathCorrection.instructions',
          template: 'fundamentals.chapter3.exercises.mathCorrection.template',
          expectedPattern: ".*(incorrect|not correct).*",
          hints: 'fundamentals.chapter3.exercises.mathCorrection.hints'
        }
      ]
    }
  ]
};