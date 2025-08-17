export interface NotebookExample {
  id: string;
  title: string;
  code: string;
  explanation?: string;
  language: string;
}

export interface InteractivePromptExample {
  id: string;
  title: string;
  description: string;
  systemPrompt?: string;
  userPrompt: string;
  expectedOutput: string;
  hints: string[];
  variations: {
    name: string;
    prompt: string;
    systemPrompt?: string;
    explanation: string;
  }[];
}

export interface NotebookLesson {
  id: string;
  title: string;
  description: string;
  examples: NotebookExample[];
  interactiveExamples?: InteractivePromptExample[];
  exercises?: {
    title: string;
    instruction: string;
    template: string;
    hints: string[];
  }[];
}

export const notebookLessons: NotebookLesson[] = [
  {
    id: 'fundamentals',
    title: 'Prompt Engineering Fundamentals',
    description: '基于Anthropic官方教程的完整提示工程基础课程。从API结构到角色分配，每个概念都有实际练习。',
    examples: [],
    interactiveExamples: [
      {
        // No system prompt needed - direct user instruction works better
        id: 'chapter1-basic-structure',
        title: 'practiceExercises.fundamentals.chapter1BasicStructure.title',
        description: 'practiceExercises.fundamentals.chapter1BasicStructure.description',
        userPrompt: 'Count to three',
        expectedOutput: 'practiceExercises.fundamentals.chapter1BasicStructure.expectedOutput',
        hints: [
          'practiceExercises.fundamentals.chapter1BasicStructure.hints.0',
          'practiceExercises.fundamentals.chapter1BasicStructure.hints.1',
          'practiceExercises.fundamentals.chapter1BasicStructure.hints.2'
        ],
        variations: [
          {
            name: 'practiceExercises.fundamentals.chapter1BasicStructure.variations.directInstruction.name',
            prompt: 'Count to three',
            explanation: 'practiceExercises.fundamentals.chapter1BasicStructure.variations.directInstruction.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter1BasicStructure.variations.clearFormat.name',
            prompt: 'Please count from 1 to 3, one number per line.',
            explanation: 'practiceExercises.fundamentals.chapter1BasicStructure.variations.clearFormat.explanation'
          }
        ]
      },
      {
        id: 'chapter1-system-prompt',
        title: 'practiceExercises.fundamentals.chapter1SystemPrompt.title',
        description: 'practiceExercises.fundamentals.chapter1SystemPrompt.description',
        systemPrompt: 'You are a 3 year old child. Respond with the excitement, curiosity, and simple language that a 3-year-old would use.',
        userPrompt: 'How big is the sky?',
        expectedOutput: 'practiceExercises.fundamentals.chapter1SystemPrompt.expectedOutput',
        hints: [
          'practiceExercises.fundamentals.chapter1SystemPrompt.hints.0',
          'practiceExercises.fundamentals.chapter1SystemPrompt.hints.1',
          'practiceExercises.fundamentals.chapter1SystemPrompt.hints.2'
        ],
        variations: [
          {
            name: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.noSystemPrompt.name',
            prompt: 'How big is the sky?',
            systemPrompt: '',
            explanation: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.noSystemPrompt.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.strictScientist.name',
            prompt: 'How big is the sky?',
            systemPrompt: '你是一个严格的物理学家。给出精确的科学答案。',
            explanation: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.strictScientist.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.friendlyTeacher.name',
            prompt: 'How big is the sky?',
            systemPrompt: 'You are a friendly elementary school teacher. Explain things in a warm, encouraging way that children can understand.',
            explanation: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.friendlyTeacher.explanation'
          }
        ]
      },
      {
        id: 'chapter2-spanish',
        title: 'practiceExercises.fundamentals.chapter2Spanish.title',
        description: 'practiceExercises.fundamentals.chapter2Spanish.description',
        userPrompt: 'Hello Claude, how are you? Please respond in Spanish.',
        expectedOutput: 'practiceExercises.fundamentals.chapter2Spanish.expectedOutput',
        hints: [
          'practiceExercises.fundamentals.chapter2Spanish.hints.0',
          'practiceExercises.fundamentals.chapter2Spanish.hints.1',
          'practiceExercises.fundamentals.chapter2Spanish.hints.2'
        ],
        variations: [
          {
            name: 'practiceExercises.fundamentals.chapter2Spanish.variations.frenchResponse.name',
            prompt: 'Hello Claude, how are you? Please respond in French.',
            explanation: 'practiceExercises.fundamentals.chapter2Spanish.variations.frenchResponse.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter2Spanish.variations.bilingualResponse.name',
            prompt: 'Hello Claude, how are you? Please respond in both English and Spanish.',
            explanation: 'practiceExercises.fundamentals.chapter2Spanish.variations.bilingualResponse.explanation'
          }
        ]
      },
      {
        id: 'chapter2-basketball',
        title: 'practiceExercises.fundamentals.chapter2Basketball.title',
        description: 'practiceExercises.fundamentals.chapter2Basketball.description',
        userPrompt: 'Who is the best basketball player of all time? Give me only the name, no other text.',
        expectedOutput: 'practiceExercises.fundamentals.chapter2Basketball.expectedOutput',
        hints: [
          'practiceExercises.fundamentals.chapter2Basketball.hints.0',
          'practiceExercises.fundamentals.chapter2Basketball.hints.1',
          'practiceExercises.fundamentals.chapter2Basketball.hints.2'
        ],
        variations: [
          {
            name: 'practiceExercises.fundamentals.chapter2Basketball.variations.withExplanation.name',
            prompt: 'Who is the best basketball player of all time?',
            explanation: 'practiceExercises.fundamentals.chapter2Basketball.variations.withExplanation.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter2Basketball.variations.top3List.name',
            prompt: 'List the top 3 basketball players of all time. Format: 1. Name 2. Name 3. Name',
            explanation: 'practiceExercises.fundamentals.chapter2Basketball.variations.top3List.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter2Basketball.variations.specificFormat.name',
            prompt: 'Who is the best basketball player of all time? Give only the name and one reason.',
            explanation: 'practiceExercises.fundamentals.chapter2Basketball.variations.specificFormat.explanation'
          }
        ]
      },
      {
        id: 'chapter2-long-story',
        title: 'practiceExercises.fundamentals.chapter2LongStory.title',
        description: 'practiceExercises.fundamentals.chapter2LongStory.description',
        userPrompt: 'Write a story that is at least 800 words long about a robot learning to paint.',
        expectedOutput: 'practiceExercises.fundamentals.chapter2LongStory.expectedOutput',
        hints: [
          'practiceExercises.fundamentals.chapter2LongStory.hints.0',
          'practiceExercises.fundamentals.chapter2LongStory.hints.1',
          'practiceExercises.fundamentals.chapter2LongStory.hints.2',
          'practiceExercises.fundamentals.chapter2LongStory.hints.3'
        ],
        variations: [
          {
            name: 'practiceExercises.fundamentals.chapter2LongStory.variations.noLength.name',
            prompt: 'Write a story about a robot learning to paint.',
            explanation: 'practiceExercises.fundamentals.chapter2LongStory.variations.noLength.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter2LongStory.variations.exactWordCount.name',
            prompt: 'Write exactly a 800-word story about a robot learning to paint. Include dialogue and detailed descriptions.',
            explanation: 'practiceExercises.fundamentals.chapter2LongStory.variations.exactWordCount.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter2LongStory.variations.longerStory.name',
            prompt: 'Write a detailed story of at least 1000 words about a robot learning to paint, including character development and multiple scenes.',
            explanation: 'practiceExercises.fundamentals.chapter2LongStory.variations.longerStory.explanation'
          }
        ]
      },
      {
        id: 'chapter3-math-logic',
        title: 'practiceExercises.fundamentals.chapter3MathLogic.title',
        description: 'practiceExercises.fundamentals.chapter3MathLogic.description',
        systemPrompt: 'You are a strict math teacher. Carefully check each step of mathematical calculations for errors.',
        userPrompt: 'Is this equation solved correctly?\n\n2x - 3 = 9\n2x = 6\nx = 3',
        expectedOutput: 'practiceExercises.fundamentals.chapter3MathLogic.expectedOutput',
        hints: [
          'practiceExercises.fundamentals.chapter3MathLogic.hints.0',
          'practiceExercises.fundamentals.chapter3MathLogic.hints.1',
          'practiceExercises.fundamentals.chapter3MathLogic.hints.2'
        ],
        variations: [
          {
            name: 'practiceExercises.fundamentals.chapter3MathLogic.variations.noRole.name',
            prompt: 'Is this equation solved correctly?\n\n2x - 3 = 9\n2x = 6\nx = 3',
            systemPrompt: '',
            explanation: 'practiceExercises.fundamentals.chapter3MathLogic.variations.noRole.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter3MathLogic.variations.logicExpert.name',
            prompt: 'Is this equation solved correctly?\n\n2x - 3 = 9\n2x = 6\nx = 3',
            systemPrompt: 'You are a logic and mathematics expert. Analyze each step carefully and identify any errors in mathematical reasoning.',
            explanation: 'practiceExercises.fundamentals.chapter3MathLogic.variations.logicExpert.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter3MathLogic.variations.studentRole.name',
            prompt: 'Is this equation solved correctly?\n\n2x - 3 = 9\n2x = 6\nx = 3',
            systemPrompt: 'You are a student learning algebra. Approach this problem with curiosity and explain your thinking process step by step.',
            explanation: 'practiceExercises.fundamentals.chapter3MathLogic.variations.studentRole.explanation'
          }
        ]
      }
    ],
    exercises: [
      {
        title: 'Chapter 1.1: 数到三 (Counting to Three)',
        instruction: '使用正确的user/assistant格式，编辑PROMPT让Claude数到三。输出必须包吧1、2、3。',
        template: 'PROMPT = "[Replace this text]"\n\nresponse = get_completion(PROMPT)\nprint(response)',
        hints: ['直接说“数到三”或“Count to three”', '使用简单直接的指令', '避免不必要的复杂性']
      },
      {
        title: 'Chapter 1.2: 3岁小孩角色 (3-Year-Old Child)',
        instruction: '修改SYSTEM_PROMPT让Claude像3岁小孩一样回应。正确的回应应包含"giggles"或"soo"等孩子气的表达。',
        template: 'SYSTEM_PROMPT = "[Replace this text]"\n\nPROMPT = "How big is the sky?"\n\nresponse = get_completion(PROMPT, SYSTEM_PROMPT)\nprint(response)',
        hints: ['说明你是一个3岁小孩', '要求使用兴奋、好奇和简单的语言', '加入孩子气的表达方式']
      },
      {
        title: 'Chapter 2.1: 西班牙语回应 (Spanish Response)',
        instruction: '修改SYSTEM_PROMPT让Claude用西班牙语回答。正确的回应应包含"hola"。',
        template: 'SYSTEM_PROMPT = "[Replace this text]"\n\nPROMPT = "Hello Claude, how are you?"\n\nresponse = get_completion(PROMPT, SYSTEM_PROMPT)\nprint(response)',
        hints: ['直接说明语言要求', '可以说"Please respond in Spanish"', '简单直接的指令最有效']
      },
      {
        title: 'Chapter 2.2: 只要一个名字 (One Player Only)',
        instruction: '修改PROMPT让Claude不要犹豫，只回答一个球员的名字，没有其他文字或标点。正确答案应该是"Michael Jordan"。',
        template: 'PROMPT = "[Replace this text]"\n\nresponse = get_completion(PROMPT)\nprint(response)',
        hints: ['要非常具体地说明格式要求', '明确说明不要解释或其他内容', '强制要求做出选择']
      },
      {
        title: 'Chapter 2.3: 长故事 (Write a Long Story)',
        instruction: '修改PROMPT让Claude写一个800字以上的故事。如果回应超过800字，练习就算正确。',
        template: 'PROMPT = "[Replace this text]"\n\nresponse = get_completion(PROMPT)\nprint(response)\nprint(f"\nWord count: {len(response.split())}")\nprint(f"Exercise correct: {len(response.split()) >= 800}")',
        hints: ['明确要求故事长度', '可以给出具体的故事题材', '要求详细描述和情节发展']
      },
      {
        title: 'Chapter 3.1: 数学错误检查 (Math Correction)',
        instruction: '修改PROMPT和/或SYSTEM_PROMPT让Claude将解题过程评价为“incorrect”而不是正确。这个方程的第二步有明显错误。',
        template: 'SYSTEM_PROMPT = ""  # 你可以修改这个\n\nPROMPT = """Is this equation solved correctly below?\n\n2x - 3 = 9\n2x = 6\nx = 3"""\n\nresponse = get_completion(PROMPT, SYSTEM_PROMPT)\nprint(response)',
        hints: ['给Claude分配数学老师或逻辑专家角色', '要求仔细检查每一步', '强调找出错误的重要性']
      }
    ]
  },
  {
    id: 'clear-and-direct',
    title: '清晰直接',
    description: '通过明确需求消除歧义，获得精确的回复。',
    examples: []
  },
  {
    id: 'role-prompting',
    title: '角色提示',
    description: '分配特定角色和视角来改善回复质量和一致性。',
    examples: []
  }
];

export const getNotebookLesson = (id: string): NotebookLesson | undefined => {
  return notebookLessons.find(lesson => lesson.id === id);
};

export const getAllNotebookLessons = (): NotebookLesson[] => {
  return notebookLessons;
};