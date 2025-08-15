'use client';

import { useState } from 'react';
import { 
  PlayIcon, 
  ArrowPathIcon, 
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface PromptExample {
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

interface InteractivePromptEditorProps {
  example: PromptExample;
}

export default function InteractivePromptEditor({ example }: InteractivePromptEditorProps) {
  const [systemPrompt, setSystemPrompt] = useState(example.systemPrompt || '');
  const [userPrompt, setUserPrompt] = useState(example.userPrompt);
  const [currentOutput, setCurrentOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<'good' | 'needs-improvement' | null>(null);

  // 模拟AI响应生成器
  const generateMockResponse = (system: string, user: string): string => {
    const prompt = (system + ' ' + user).toLowerCase();
    
    // 基础问候响应
    if (prompt.includes('hello') || prompt.includes('hi') || prompt.includes('how are you') || prompt.includes('你好')) {
      if (prompt.includes('formal') || prompt.includes('good morning')) {
        return "Good morning! I'm functioning optimally today, thank you for asking. I'm Claude, an AI assistant, and I'm ready to help you with any questions or tasks you may have. How may I assist you today?";
      } else if (prompt.includes('hey') || prompt.includes('what\'s up')) {
        return "Hey there! I'm doing well, thanks for asking! I'm Claude, and I'm here to help out with whatever you need. What can I help you with today?";
      } else if (prompt.includes('中文') || prompt.includes('你好')) {
        return "你好！很高兴认识你！我是Claude，一个由Anthropic开发的AI助手。我可以用中文和英文与你交流，有什么可以帮助你的吗？";
      } else {
        return "Hello! I'm Claude, an AI assistant created by Anthropic. I'm here to help you with any questions or tasks you might have. How can I assist you today?";
      }
    }
    
    // 编程变量相关
    if (prompt.includes('variable') && prompt.includes('programming')) {
      if (prompt.includes('mentor') || prompt.includes('friendly')) {
        return "Great question! Think of a variable like a labeled box 📦. Just like you might have a box labeled 'toys' where you store your toys, in programming, a variable is a named container that stores data.\n\nFor example, you might create a variable called 'age' and store the number 25 in it. Later, you can look in that box (use the variable) or put something new in it (change the value).\n\nVariables are super helpful because instead of remembering numbers or text throughout your code, you just remember the easy name you gave to the box!";
      } else if (prompt.includes('expert') || prompt.includes('engineer')) {
        return "A variable in programming is a symbolic name for a memory location that stores data values. Variables provide an abstraction layer over memory addresses, allowing developers to reference and manipulate data using meaningful identifiers rather than hexadecimal memory addresses.\n\nKey characteristics include:\n- Type (determines data format and operations)\n- Scope (visibility and lifetime within program)\n- Mutability (whether the value can be changed)\n- Memory allocation (stack vs heap storage)";
      } else if (prompt.includes('5岁') || prompt.includes('child')) {
        return "哇！变量就像你的玩具盒子！🎁\n\n你知道吗？当你有很多玩具的时候，妈妈会让你把它们放在不同的盒子里对吧？比如一个盒子放积木，一个盒子放小汽车。\n\n在电脑的世界里，变量就是这样的盒子！程序员叔叔给每个盒子起个名字，比如叫'我的年龄'，然后在里面放一个数字，比如5！\n\n这样，电脑就记住了你5岁啦！很神奇对不对？";
      } else {
        return "A variable is a named storage location in a program that holds data. It's called a 'variable' because the value it contains can vary or change during program execution.\n\nFor example:\n- `name = 'Alice'` creates a variable called 'name' that stores the text 'Alice'\n- `age = 25` creates a variable called 'age' that stores the number 25\n\nVariables allow us to store, retrieve, and manipulate data throughout our programs in a readable and organized way.";
      }
    }
    
    // 狗相关的总结
    if (prompt.includes('dogs') || prompt.includes('dog')) {
      if (prompt.includes('golden retriever') && prompt.includes('150')) {
        return "Golden Retrievers are among the most beloved family dogs, known for their gentle, friendly temperament and exceptional patience with children. These medium to large-sized dogs are highly intelligent, making them easy to train and eager to please their families. Originally bred as hunting companions, they retain high energy levels and require regular exercise - daily walks and active play sessions keep them healthy and happy. Their calm, loyal nature combined with natural protective instincts makes them excellent family pets, though their friendly disposition means they're more likely to welcome intruders with wagging tails than guard against them.";
      } else if (prompt.includes('labrador') && prompt.includes('structured')) {
        return "## Labrador Retriever Overview\n\n**1) Physical Characteristics:**\nLabradors are medium to large dogs weighing 55-80 pounds with short, water-resistant double coats. They come in three standard colors: yellow, black, and chocolate, with broad heads and expressive eyes.\n\n**2) Personality Traits:**\nKnown for their friendly, outgoing nature and high intelligence, Labs are eager to please and excellent with children. They're naturally social dogs that thrive on human interaction and rarely show aggression.\n\n**3) Exercise Needs:**\nAs high-energy working dogs, Labs require 1-2 hours of daily exercise including walks, swimming, or fetch. Mental stimulation through training and puzzle toys is equally important for their well-being.\n\n**4) Grooming Requirements:**\nTheir short coat needs weekly brushing, increasing to daily during shedding seasons. Regular nail trims, ear cleaning, and dental care complete their basic grooming needs.";
      } else {
        return "Dogs are domesticated mammals that have been human companions for thousands of years. They come in hundreds of breeds with diverse sizes, temperaments, and characteristics. Most dogs are loyal, social animals that form strong bonds with their families. They require regular exercise, proper nutrition, veterinary care, and social interaction to thrive. Dogs serve many roles including companions, working animals, therapy animals, and service animals.";
      }
    }
    
    // 默认响应
    return "I understand you'd like me to help with that. Could you provide a bit more specific information about what you're looking for? I'm here to assist with a wide range of topics and tasks.";
  };

  // 分析提示词质量
  const analyzePrompt = (system: string, user: string): 'good' | 'needs-improvement' => {
    const totalLength = system.length + user.length;
    const hasSpecificInstructions = user.includes('specific') || user.includes('详细') || user.includes('列出');
    const hasRole = system.includes('you are') || system.includes('作为') || system.includes('角色');
    const hasContext = system.length > 20 || user.includes('context') || user.includes('背景');
    
    if (totalLength > 50 && (hasSpecificInstructions || hasRole || hasContext)) {
      return 'good';
    }
    return 'needs-improvement';
  };

  const runPrompt = async () => {
    setIsRunning(true);
    setCurrentOutput('');
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const response = generateMockResponse(systemPrompt, userPrompt);
    setCurrentOutput(response);
    setAnalysisResult(analyzePrompt(systemPrompt, userPrompt));
    setIsRunning(false);
  };

  const resetToExample = () => {
    setSystemPrompt(example.systemPrompt || '');
    setUserPrompt(example.userPrompt);
    setCurrentOutput('');
    setAnalysisResult(null);
    setSelectedVariation(null);
  };

  const applyVariation = (index: number) => {
    const variation = example.variations[index];
    setUserPrompt(variation.prompt);
    setSelectedVariation(index);
    setCurrentOutput('');
    setAnalysisResult(null);
  };

  return (
    <div className="border border-stone-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#98a971]/10 to-[#98a971]/5 border-b border-stone-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {example.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {example.description}
            </p>
          </div>
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#98a971] hover:bg-[#98a971]/10 rounded-lg transition-colors"
          >
            <LightBulbIcon className="h-4 w-4" />
            {showHints ? '隐藏提示' : '显示提示'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Hints */}
        {showHints && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-3">
              💡 学习提示
            </h4>
            <ul className="space-y-2">
              {example.hints.map((hint, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-200">
                  <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prompt Variations */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            📝 尝试不同的提示词变体
          </h4>
          <div className="grid gap-2 md:grid-cols-2">
            {example.variations.map((variation, index) => (
              <button
                key={index}
                onClick={() => applyVariation(index)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedVariation === index
                    ? 'border-[#98a971] bg-[#98a971]/5 text-gray-900 dark:text-gray-100'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#98a971]/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="font-medium text-sm mb-1">{variation.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{variation.explanation}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Input */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              🎯 编辑提示词
            </h4>
            
            {/* System Prompt */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                系统提示 (System Prompt)
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="设定AI的角色和行为规则..."
                className="w-full h-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#98a971] focus:border-transparent resize-none"
              />
            </div>

            {/* User Prompt */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                用户提示 (User Prompt)
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="输入你的问题或指令..."
                className="w-full h-24 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#98a971] focus:border-transparent resize-none"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={runPrompt}
                disabled={isRunning || !userPrompt.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-[#98a971] text-white rounded-lg hover:bg-[#7a8259] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isRunning ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
                {isRunning ? '运行中...' : '运行提示'}
              </button>
              
              <button
                onClick={resetToExample}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                重置
              </button>
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                🤖 AI 响应
              </h4>
              {analysisResult && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  analysisResult === 'good'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {analysisResult === 'good' ? (
                    <CheckCircleIcon className="h-3 w-3" />
                  ) : (
                    <ExclamationTriangleIcon className="h-3 w-3" />
                  )}
                  {analysisResult === 'good' ? '提示词质量好' : '可以改进'}
                </div>
              )}
            </div>
            
            <div className="h-48 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto">
              {isRunning ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    <span className="text-sm">AI 正在思考...</span>
                  </div>
                </div>
              ) : currentOutput ? (
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {currentOutput}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
                  点击&ldquo;运行提示&rdquo;查看AI响应
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expected Output */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            🎯 期望输出示例
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            {example.expectedOutput}
          </p>
        </div>
      </div>
    </div>
  );
}