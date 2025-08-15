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
    title: '基本提示结构',
    description: '学习有效提示设计的基本要素和与AI系统的清晰交流。',
    examples: [
      {
        id: 'simple-greeting',
        title: '简单问候示例',
        code: `# Prompt
PROMPT = "Hi Claude, how are you?"

# Print Claude's response
print(get_completion(PROMPT))`,
        explanation: '这是最基本的提示格式，直接向Claude提出简单问题。',
        language: 'python'
      },
      {
        id: 'factual-question',
        title: '事实性问题',
        code: `# Prompt
PROMPT = "What year was Celine Dion born in?"

# Print Claude's response
print(get_completion(PROMPT))`,
        explanation: '向Claude询问具体的事实信息，这类问题通常能获得准确的回答。',
        language: 'python'
      },
      {
        id: 'system-prompt-example',
        title: '系统提示示例',
        code: `# System prompt
SYSTEM_PROMPT = "Your answer should always be a series of critical thinking questions that further the conversation (do not provide answers to your questions). Do not actually answer the user question."

# Prompt
PROMPT = "Why is the sky blue?"

# Print Claude's response
print(get_completion(PROMPT, SYSTEM_PROMPT))`,
        explanation: '系统提示用于为Claude提供上下文、指令和指导原则，可以显著改善Claude的表现。',
        language: 'python'
      }
    ],
    interactiveExamples: [
      {
        id: 'basic-greeting',
        title: '基础对话练习',
        description: '学习如何与AI进行简单有效的对话。尝试不同的问候方式，观察AI的响应变化。',
        userPrompt: 'Hi Claude, how are you?',
        expectedOutput: '友好、专业的问候回复，可能包含自我介绍和询问如何帮助用户。',
        hints: [
          '简单直接的问候通常能获得友好的回应',
          '观察AI如何保持专业性的同时展现友善',
          '尝试不同语言的问候看看效果'
        ],
        variations: [
          {
            name: '正式问候',
            prompt: 'Good morning, Claude. I hope you are functioning well today.',
            explanation: '使用更正式的语言风格'
          },
          {
            name: '随意问候', 
            prompt: 'Hey there! What\'s up?',
            explanation: '使用更随意、轻松的语调'
          },
          {
            name: '中文问候',
            prompt: '你好，Claude！很高兴认识你。',
            explanation: '测试中文对话能力'
          }
        ]
      },
      {
        id: 'role-assignment',
        title: '角色分配练习',
        description: '通过系统提示为AI分配特定角色，观察这如何影响其回应风格和内容。',
        systemPrompt: 'You are a friendly and knowledgeable coding mentor who explains concepts in simple terms.',
        userPrompt: 'What is a variable in programming?',
        expectedOutput: '以导师身份解释编程变量概念，使用简单易懂的语言，可能包含类比和例子。',
        hints: [
          '系统提示定义了AI的"人格"和专业背景',
          '观察有无系统提示时回答的差异',
          '尝试不同的角色设定看效果'
        ],
        variations: [
          {
            name: '移除角色',
            prompt: 'What is a variable in programming?',
            explanation: '移除系统提示，看看回答如何变化'
          },
          {
            name: '专家角色',
            prompt: 'What is a variable in programming?',
            explanation: '设置系统提示为"高级软件工程师"'
          },
          {
            name: '初学者角色',
            prompt: 'What is a variable in programming?',
            explanation: '设置系统提示为"给5岁小孩解释的老师"'
          }
        ]
      },
      {
        id: 'clear-instructions',
        title: '清晰指令练习',
        description: '比较模糊指令和明确指令的效果差异，学习如何写出更精确的提示词。',
        userPrompt: 'Write a summary about dogs.',
        expectedOutput: '关于狗的简单总结，但可能内容比较宽泛，缺乏针对性。',
        hints: [
          '模糊的指令往往得到模糊的回答',
          '明确指定长度、重点、目标受众能获得更好的结果',
          '提供具体的结构要求会让输出更有条理'
        ],
        variations: [
          {
            name: '模糊指令',
            prompt: 'Tell me about dogs.',
            explanation: '非常宽泛的请求'
          },
          {
            name: '具体指令',
            prompt: 'Write a 150-word summary about Golden Retrievers, focusing on their temperament and suitability as family pets.',
            explanation: '明确了犬种、字数、重点内容'
          },
          {
            name: '结构化指令',
            prompt: 'Create a structured overview of Labrador Retrievers including: 1) Physical characteristics 2) Personality traits 3) Exercise needs 4) Grooming requirements. Keep each section to 2-3 sentences.',
            explanation: '提供了清晰的结构和长度要求'
          }
        ]
      }
    ],
    exercises: [
      {
        title: '数到三',
        instruction: '使用正确的用户/助手格式，编辑提示让Claude数到三。',
        template: '[Replace this text]',
        hints: ['使用简单直接的指令', '确保语言清晰明确']
      },
      {
        title: '系统提示练习',
        instruction: '修改系统提示让Claude像3岁小孩一样回应。',
        template: '[Replace this text]',
        hints: ['考虑3岁孩子的语言特点', '使用简单的词汇和表达方式']
      }
    ]
  },
  {
    id: 'clear-and-direct',
    title: '清晰直接',
    description: '通过明确需求消除歧义，获得精确的回复。',
    examples: [
      {
        id: 'vague-vs-specific',
        title: '模糊vs具体的提示对比',
        code: `# 模糊的提示
PROMPT_VAGUE = "Tell me about dogs"

# 具体的提示
PROMPT_SPECIFIC = "Write a 200-word summary about Golden Retrievers, focusing on their temperament, exercise needs, and suitability as family pets"

print("模糊提示结果:")
print(get_completion(PROMPT_VAGUE))
print("\\n具体提示结果:")
print(get_completion(PROMPT_SPECIFIC))`,
        explanation: '具体的提示能够获得更精准和有用的回答，而模糊的提示往往导致不够聚焦的回复。',
        language: 'python'
      }
    ]
  },
  {
    id: 'role-prompting',
    title: '角色提示',
    description: '分配特定角色和视角来改善回复质量和一致性。',
    examples: [
      {
        id: 'expert-role',
        title: '专家角色示例',
        code: `# System prompt with role assignment
SYSTEM_PROMPT = "You are a senior software engineer with 10 years of experience in Python development. Provide technical advice in a professional yet approachable manner."

# Prompt
PROMPT = "What are the best practices for handling exceptions in Python?"

# Print Claude's response
print(get_completion(PROMPT, SYSTEM_PROMPT))`,
        explanation: '通过分配专家角色，Claude能够提供更专业和有针对性的建议。',
        language: 'python'
      }
    ]
  }
];

export const getNotebookLesson = (id: string): NotebookLesson | undefined => {
  return notebookLessons.find(lesson => lesson.id === id);
};

export const getAllNotebookLessons = (): NotebookLesson[] => {
  return notebookLessons;
};