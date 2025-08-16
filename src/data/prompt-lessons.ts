import { PromptLesson } from '@/types';

export const promptLessons: PromptLesson[] = [
  // Integrated Fundamentals Course - Chapter Based on Anthropic ipynb
  {
    id: 'fundamentals',
    chapter: 1,
    type: 'course',
    messageKey: 'promptFundamentals',
    content: {
      theory: "掌握Claude最佳提示工程的全面分步指南。学习API结构、清晰沟通、角色分配三大核心技能。",
      sections: [
        {
          title: "Chapter 1: Basic Prompt Structure",
          theory: "学习Messages API的必需参数：model、max_tokens、messages数组。掌握user/assistant对话格式和system prompt的正确使用。",
          examples: [
            "✅ 正确格式: {role: 'user', content: 'Hi Claude, how are you?'}",
            "❌ 错误格式: {Hi Claude, how are you?} - 缺少role和content字段",
            "✅ System Prompt: '你是一个逻辑推理专家，专门解决复杂逻辑问题'"
          ],
          exercises: [{
            id: "count_to_three",
            instructions: "使用正确的user/assistant格式，让Claude数到三",
            template: "[Replace this text]",
            expectedPattern: ".*1.*2.*3.*",
            hints: ["直接说出你的需求", "使用简单清晰的指令", "避免不必要的复杂性"]
          }, {
            id: "system_prompt_child",
            instructions: "修改SYSTEM_PROMPT让Claude像3岁小孩一样回应", 
            template: "SYSTEM_PROMPT = '[Replace this text]'",
            expectedPattern: ".*(giggles|soo).*",
            hints: ["想想3岁孩子如何说话", "使用简单词汇和表达", "加入孩子气的语言特征"]
          }]
        },
        {
          title: "Chapter 2: Being Clear and Direct",
          theory: "Claude需要明确指令。遵循黄金法则：把你的提示给同事看，如果他们困惑，Claude也会困惑。",
          examples: [
            "❌ 模糊: '写一首关于机器人的俳句'", 
            "✅ 明确: '写一首关于机器人的俳句，跳过前言直接进入诗歌'",
            "❌ 模糊: '谁是史上最佳篮球运动员？'",
            "✅ 强制选择: '谁是史上最佳篮球运动员？虽然有不同观点，但如果你必须选择一个，会是谁？'"
          ],
          exercises: [{
            id: "spanish_response",
            instructions: "修改SYSTEM_PROMPT让Claude用西班牙语回答",
            template: "SYSTEM_PROMPT = '[Replace this text]'",
            expectedPattern: ".*hola.*",
            hints: ["直接告诉Claude使用哪种语言", "可以在系统提示中指定语言要求"]
          }, {
            id: "one_player_only",
            instructions: "让Claude只回答一个球员的名字，没有其他文字或标点",
            template: "[Replace this text]",
            expectedPattern: "^Michael Jordan$",
            hints: ["要非常具体地说明格式要求", "明确说明不要解释或其他内容", "强制Claude做出选择"]
          }, {
            id: "long_story",
            instructions: "写一个800字以上的故事",
            template: "[Replace this text]",
            expectedPattern: ".*",
            hints: ["明确要求故事长度", "可以给出具体的故事题材", "要求详细描述和情节发展"]
          }]
        },
        {
          title: "Chapter 3: Assigning Roles (Role Prompting)",
          theory: "给Claude分配具体角色能显著提升表现。角色设定可以改变回应风格、语调和专业程度。",
          examples: [
            "❌ 无角色: '滑板运动怎么样？'",
            "✅ 猫的角色: system='你是一只猫' → 会从猫的视角回答",
            "❌ 逻辑错误: Jack看Anne，Anne看George，Jack已婚George未婚，已婚者在看未婚者吗？",
            "✅ 逻辑专家: system='你是逻辑推理专家' → 正确分析这个问题"
          ],
          exercises: [{
            id: "math_correction",
            instructions: "让Claude发现这个数学错误：2x-3=9, 2x=6, x=3",
            template: "这个方程解得对吗？\n\n2x - 3 = 9\n2x = 6\nx = 3",
            expectedPattern: ".*(incorrect|not correct).*",
            hints: ["给Claude分配数学老师或逻辑专家角色", "要求仔细检查每一步", "强调找出错误"]
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
    messageKey: 'promptAdvanced',
    content: {
      theory: "Advanced prompt engineering techniques: data separation, output formatting, and chain-of-thought reasoning. These methods unlock Claude's full analytical potential.",
      sections: [
        {
          title: "Data Separation Techniques",
          theory: "Separate your data from instructions using XML tags, markdown sections, or clear delimiters. This prevents confusion and improves processing accuracy.",
          examples: [
            "Mixed: 'Summarize this: AI is transforming industries by automating tasks'",
            "Separated: 'Analyze the following text:\\n\\n<content>\\nAI is transforming industries\\n</content>\\n\\nProvide a 2-sentence summary.'"
          ],
          exercises: [{
            id: "adv_1",
            instructions: "Use XML tags to separate data when analyzing text structure",
            template: "Analyze the grammar of this sentence:\\n\\n<sentence>\\n[Your sentence]\\n</sentence>",
            expectedPattern: ".*(grammar|syntax|structure|analysis).*",
            hints: ["Use clear XML delimiters", "Keep instructions separate from data", "Be specific about analysis type"]
          }]
        },
        {
          title: "Output Formatting Control", 
          theory: "Control Claude's response format with explicit templates, examples, and structural requirements. Consistent formatting enables automation and integration.",
          examples: [
            "Unformatted: 'List programming languages'",
            "Formatted: 'List 3 languages using this format:\\n1. **Language**: Description\\n2. **Language**: Description'"
          ],
          exercises: [{
            id: "adv_2",
            instructions: "Get Claude to provide exactly 3 items in a specific numbered format",
            template: "Give me 3 productivity tips in this exact format:\\n[Define your format]",
            expectedPattern: ".*1\\..*2\\..*3\\.",
            hints: ["Specify exact formatting requirements", "Use templates as examples", "Be explicit about structure"]
          }]
        },
        {
          title: "Chain-of-Thought Reasoning",
          theory: "Unlock Claude's analytical power by requesting step-by-step reasoning. This technique dramatically improves complex problem-solving and ensures transparent logic.",
          examples: [
            "Direct: 'What's 25% of 80?'",
            "Chain-of-thought: 'Calculate 25% of 80. Show each step of your calculation with explanations.'"
          ],
          exercises: [{
            id: "adv_3",
            instructions: "Get Claude to solve a complex problem using explicit step-by-step reasoning",
            template: "Solve this step by step, showing your work: [Your problem]",
            expectedPattern: ".*(step|first|then|therefore|because|so).*",
            hints: ["Ask for explicit reasoning", "Request step-by-step breakdown", "Look for logical connectors"]
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