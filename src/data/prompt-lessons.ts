import { PromptLesson } from '@/types';

export const promptLessons: PromptLesson[] = [
  // Integrated Fundamentals Course
  {
    id: 'fundamentals',
    chapter: 1,
    type: 'course',
    messageKey: 'promptFundamentals',
    content: {
      theory: "Master the essential foundations of prompt engineering: proper API structure, clear communication, and role-based prompting. These three principles form the backbone of effective AI interaction.",
      sections: [
        {
          title: "API Structure & Basic Prompting",
          theory: "Every effective prompt requires proper structure. Learn the Messages API format, understand required parameters, and master the art of clear instruction.",
          examples: [
            "Basic: 'Hi Claude, how are you?'",
            "Structured: Use proper user/assistant message format with clear max_tokens and temperature settings"
          ],
          exercises: [{
            id: "fund_1",
            instructions: "Create a properly formatted prompt that gets Claude to count from 1 to 3",
            template: "Write your prompt with proper API structure",
            expectedPattern: ".*1.*2.*3.*",
            hints: ["Use clear, direct instructions", "Specify the exact task", "Avoid unnecessary complexity"]
          }]
        },
        {
          title: "Clear & Direct Communication",
          theory: "Claude responds best to explicit instructions. Eliminate ambiguity by stating exactly what you want, when you want it, and how you want it formatted.",
          examples: [
            "Vague: 'Help me with my code'",
            "Clear: 'Review this Python function for bugs and suggest specific improvements for readability and performance'"
          ],
          exercises: [{
            id: "fund_2",
            instructions: "Get Claude to write exactly one player's name with no other text",
            template: "Who is the best basketball player? [Add your specific instructions]",
            expectedPattern: "^[A-Za-z\\s]+$",
            hints: ["Be extremely specific about format", "Use explicit constraints", "Ask for exactly what you want"]
          }]
        },
        {
          title: "Role-Based Prompting",
          theory: "Assign Claude specific expertise or perspective to dramatically improve response quality and consistency. Always define the role before giving the task.",
          examples: [
            "Basic: 'Explain machine learning'",
            "Role-based: 'You are a senior data scientist. Explain machine learning trade-offs to a product manager making technical decisions'"
          ],
          exercises: [{
            id: "fund_3",
            instructions: "Get Claude to act as a specific expert and provide detailed feedback",
            template: "You are a [specific role]. [Your detailed task]",
            expectedPattern: ".*(analysis|review|recommendation|assessment).*",
            hints: ["Choose a relevant expert role", "Provide clear context", "Ask for specific deliverables"]
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