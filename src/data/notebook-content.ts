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
        title: '1章练习：数到三 (API结构)',
        description: '学习正确的Messages API格式。这是最基础的练习，确保你理解如何构建有效的提示。',
        userPrompt: 'Count to three',
        expectedOutput: '包含1、2、3的回应，格式清晰。',
        hints: [
          '直接说出你的需求："数到三"',
          '使用简单清晰的指令',
          '避免不必要的复杂性'
        ],
        variations: [
          {
            name: '直接指令',
            prompt: 'Count to three',
            explanation: '最简单直接的方式'
          },
          {
            name: '明确格式',
            prompt: 'Please count from 1 to 3, one number per line.',
            explanation: '指定了输出格式'
          },
          {
            name: '中文指令',
            prompt: '请从1数到3。',
            explanation: '测试中文指令'
          }
        ]
      },
      {
        id: 'chapter1-system-prompt',
        title: '1章练习：3岁小孩角色 (System Prompt)',
        description: '体验 system prompt 的威力。通过角色设定，让Claude的回应风格彻底改变。',
        systemPrompt: 'You are a 3 year old child. Respond with the excitement, curiosity, and simple language that a 3-year-old would use.',
        userPrompt: 'How big is the sky?',
        expectedOutput: '像3岁孩子一样的兴奋回应，可能包含笑声、简单词汇和天真的表达。',
        hints: [
          '想想3岁孩子如何说话：兴奋、好奇、词汇简单',
          '可以加入一些孩子气的表达如 "soo big" 或 "giggles"',
          'System prompt 定义了AI的整个"人格"'
        ],
        variations: [
          {
            name: '无System Prompt',
            prompt: 'How big is the sky?',
            explanation: '不设置System Prompt，看看默认回应'
          },
          {
            name: '严格科学家',
            prompt: 'How big is the sky?',
            explanation: 'System: "You are a strict physicist. Give precise scientific answers."'
          },
          {
            name: '友好老师',
            prompt: 'How big is the sky?',
            explanation: 'System: "You are a friendly teacher explaining to children."'
          }
        ]
      },
      {
        id: 'chapter2-spanish',
        title: '2章练习：西班牙语回应 (清晰指令)',
        description: '学习如何给出明确指令控制输出语言。这个练习显示API能够精确按照你的要求执行。',
        systemPrompt: 'Please respond in Spanish.',
        userPrompt: 'Hello Claude, how are you?',
        expectedOutput: '用西班牙语回应，包含 "Hola" 等西班牙语问候词。',
        hints: [
          '直接在System Prompt中说明语言要求',
          '可以说 "Please respond in Spanish" 或 "Responde en español"',
          '观察 Claude 如何完全切换语言'
        ],
        variations: [
          {
            name: '中文回应',
            prompt: 'Hello Claude, how are you?',
            explanation: 'System: "请用中文回应"'
          },
          {
            name: '法语回应',
            prompt: 'Hello Claude, how are you?',
            explanation: 'System: "Répondez en français, s\'il vous plaît"'
          },
          {
            name: '双语回应',
            prompt: 'Hello Claude, how are you?',
            explanation: 'System: "Respond in both English and Spanish"'
          }
        ]
      },
      {
        id: 'chapter2-basketball',
        title: '2章练习：只要一个名字 (精确格式)',
        description: '学习如何给出极具体的格式要求。这个练习教你如何获得精确控制的输出。',
        userPrompt: 'Who is the best basketball player of all time? Give me only the name, no other text.',
        expectedOutput: '只有一个球员的名字，没有其他任何文字或解释。',
        hints: [
          '要非常具体地说明格式要求',
          '明确说明不要解释或其他内容',
          '强制Claude做出选择，不允许说"这很难选择"'
        ],
        variations: [
          {
            name: '允许解释',
            prompt: 'Who is the best basketball player of all time?',
            explanation: '不限制格式，看看默认回应'
          },
          {
            name: '要求理由',
            prompt: 'Who is the best basketball player of all time? Give only the name and one reason.',
            explanation: '允许一个理由但仍然控制格式'
          },
          {
            name: '列表格式',
            prompt: 'List the top 3 basketball players of all time. Format: 1. Name 2. Name 3. Name',
            explanation: '指定精确的列表格式'
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