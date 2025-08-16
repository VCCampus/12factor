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
        id: 'chapter1-basic-structure',
        title: 'practiceExercises.fundamentals.chapter1BasicStructure.title',
        description: 'practiceExercises.fundamentals.chapter1BasicStructure.description',
        userPrompt: 'Count to three',
        expectedOutput: 'practiceExercises.fundamentals.chapter1BasicStructure.expectedOutput',
        hints: 'practiceExercises.fundamentals.chapter1BasicStructure.hints',
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
          },
          {
            name: 'practiceExercises.fundamentals.chapter1BasicStructure.variations.chineseInstruction.name',
            prompt: '请从1数到3。',
            explanation: 'practiceExercises.fundamentals.chapter1BasicStructure.variations.chineseInstruction.explanation'
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
        hints: 'practiceExercises.fundamentals.chapter1SystemPrompt.hints',
        variations: [
          {
            name: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.noSystemPrompt.name',
            prompt: 'How big is the sky?',
            explanation: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.noSystemPrompt.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.strictScientist.name',
            prompt: 'How big is the sky?',
            explanation: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.strictScientist.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.friendlyTeacher.name',
            prompt: 'How big is the sky?',
            explanation: 'practiceExercises.fundamentals.chapter1SystemPrompt.variations.friendlyTeacher.explanation'
          }
        ]
      },
      {
        id: 'chapter2-spanish',
        title: 'practiceExercises.fundamentals.chapter2Spanish.title',
        description: 'practiceExercises.fundamentals.chapter2Spanish.description',
        systemPrompt: 'Please respond in Spanish.',
        userPrompt: 'Hello Claude, how are you?',
        expectedOutput: 'practiceExercises.fundamentals.chapter2Spanish.expectedOutput',
        hints: 'practiceExercises.fundamentals.chapter2Spanish.hints',
        variations: [
          {
            name: 'practiceExercises.fundamentals.chapter2Spanish.variations.chineseResponse.name',
            prompt: 'Hello Claude, how are you?',
            explanation: 'practiceExercises.fundamentals.chapter2Spanish.variations.chineseResponse.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter2Spanish.variations.frenchResponse.name',
            prompt: 'Hello Claude, how are you?',
            explanation: 'practiceExercises.fundamentals.chapter2Spanish.variations.frenchResponse.explanation'
          },
          {
            name: 'practiceExercises.fundamentals.chapter2Spanish.variations.bilingualResponse.name',
            prompt: 'Hello Claude, how are you?',
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
        hints: 'practiceExercises.fundamentals.chapter2Basketball.hints',
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
        title: '2章练习：写长故事 (明确要求)',
        description: '学习如何通过明确的长度要求控制输出。这个练习展示了给出具体指标的重要性。',
        userPrompt: 'Write a story that is at least 800 words long about a robot learning to paint.',
        expectedOutput: '一个至少800字的关于机器人学画画的故事，情节丰富，描述详细。',
        hints: [
          '明确要求故事长度：至少800字',
          '给出具体的故事题材和主题',
          '要求详细描述和情节发展',
          '可以要求包含对话和场景描写'
        ],
        variations: [
          {
            name: '无长度要求',
            prompt: 'Write a story about a robot learning to paint.',
            explanation: '不指定长度，看看默认的故事长度'
          },
          {
            name: '明确字数要求',
            prompt: 'Write exactly a 800-word story about a robot learning to paint. Include dialogue and detailed descriptions.',
            explanation: '指定确切字数并要求特定元素'
          },
          {
            name: '更长的故事',
            prompt: 'Write a detailed story of at least 1000 words about a robot learning to paint, including character development and multiple scenes.',
            explanation: '要求更长篇幅和更复杂结构'
          }
        ]
      },
      {
        id: 'chapter3-math-logic',
        title: '3章练习：数学错误检查 (角色分配)',
        description: '体验角色分配对逻辑推理的影响。通过给Claude分配专家角色，提高其在特定领域的表现。',
        systemPrompt: 'You are a strict math teacher. Carefully check each step of mathematical calculations for errors.',
        userPrompt: 'Is this equation solved correctly?\n\n2x - 3 = 9\n2x = 6\nx = 3',
        expectedOutput: '指出这个数学错误：2x = 9 + 3 = 12，不是6。',
        hints: [
          '给Claude分配数学老师或逻辑专家角色',
          '要求仔细检查每一步计算',
          '强调找出错误而不是简单评价'
        ],
        variations: [
          {
            name: '无角色设定',
            prompt: 'Is this equation solved correctly?\n\n2x - 3 = 9\n2x = 6\nx = 3',
            explanation: '不设置专门角色，看看默认表现'
          },
          {
            name: '逻辑专家',
            prompt: 'Is this equation solved correctly?\n\n2x - 3 = 9\n2x = 6\nx = 3',
            explanation: 'System: "You are a logic expert. Analyze step by step."'
          },
          {
            name: '学生角色',
            prompt: 'Is this equation solved correctly?\n\n2x - 3 = 9\n2x = 6\nx = 3',
            explanation: 'System: "You are a student learning math. Show your thinking."'
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