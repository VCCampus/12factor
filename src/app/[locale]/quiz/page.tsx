'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { principles } from '@/data/principles';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface Question {
  id: number;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'scenario' | 'drag-drop' | 'fill-blank';
  options?: string[];
  correct: number | string | string[];
  principleId: number;
  stage?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  scenario?: string;
  blanks?: string[];
  dragItems?: string[];
  dropZones?: string[];
}

interface FillBlankQuestionProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
}

function FillBlankQuestion({ question, onAnswer }: FillBlankQuestionProps) {
  const [blanks, setBlanks] = useState<string[]>(['', '']);
  
  useEffect(() => {
    onAnswer(blanks);
  }, [blanks, onAnswer]);
  
  const updateBlank = (index: number, value: string) => {
    const newBlanks = [...blanks];
    newBlanks[index] = value;
    setBlanks(newBlanks);
  };
  
  return (
    <div className="space-y-4">
      <div className="text-lg text-gray-700 dark:text-gray-300">
        {question.text.split('___').map((part, index) => (
          <span key={index}>
            {part}
            {index < question.text.split('___').length - 1 && (
              <input
                type="text"
                value={blanks[index] || ''}
                onChange={(e) => updateBlank(index, e.target.value)}
                className="inline-block mx-2 px-3 py-1 border-b-2 border-[#95a76f] bg-transparent focus:outline-none focus:border-[#95a76f]/80 min-w-[100px] text-center"
                placeholder="..."
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function QuizPage() {
  const t = useTranslations();
  const tQuiz = useTranslations('quiz');
  const locale = useLocale() as 'en' | 'zh';
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | string | string[])[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | string[] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizMode, setQuizMode] = useState<'normal' | 'timed' | 'challenge' | 'adaptive'>('normal');
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [showQuizModeSelect, setShowQuizModeSelect] = useState(true);
  
  // Always declare all hooks at the top level
  const [questions] = useState<Question[]>(() => {
    const generateQuestions = (): Question[] => {
      const questionTypes: Question[] = [];
      
      // Multiple choice questions
      principles.slice(0, 3).forEach((principle, index) => {
        const wrongAnswers = [
          tQuiz('wrongAnswers.0'),
          tQuiz('wrongAnswers.1'), 
          tQuiz('wrongAnswers.2')
        ];
        const principleTranslation = {
          name: tQuiz(`principle${principle.id}.name`),
          concept: tQuiz(`principle${principle.id}.concept`)
        };
        const options = [
          principleTranslation.concept,
          ...wrongAnswers
        ].sort(() => Math.random() - 0.5);
        
        const correctIndex = options.findIndex(opt => opt === principleTranslation.concept);
        
        questionTypes.push({
          id: index,
          text: locale === 'zh' 
            ? `什么是"${principleTranslation.name}"的核心理念？`
            : `What is the core concept of "${principleTranslation.name}"?`,
          type: 'multiple-choice',
          options,
          correct: correctIndex,
          principleId: principle.id,
          stage: principle.stage,
          difficulty: 'medium'
        });
      });
      
      // True/False questions
      principles.slice(3, 5).forEach((principle, index) => {
        const principleTranslation = {
          name: tQuiz(`principle${principle.id}.name`),
          concept: tQuiz(`principle${principle.id}.concept`)
        };
        questionTypes.push({
          id: index + 3,
          text: locale === 'zh'
            ? `"${principleTranslation.name}"强调${principleTranslation.concept.slice(0, 20)}...`
            : `"${principleTranslation.name}" emphasizes ${principleTranslation.concept.slice(0, 20)}...`,
          type: 'true-false',
          options: [locale === 'zh' ? '正确' : 'True', locale === 'zh' ? '错误' : 'False'],
          correct: 0,
          principleId: principle.id,
          stage: principle.stage,
          difficulty: 'easy'
        });
      });
      
      // Scenario-based questions
      questionTypes.push({
        id: 5,
        text: locale === 'zh'
          ? '在AI协作过程中遇到以下场景时，应该采用哪个原则？'
          : 'When facing the following scenario in AI collaboration, which principle should you apply?',
        type: 'scenario',
        scenario: locale === 'zh'
          ? '你正在与AI合作开发一个复杂功能，但发现AI生成的代码有很多问题需要修复。'
          : 'You are collaborating with AI to develop a complex feature, but find many issues in the AI-generated code that need fixing.',
        options: [
          tQuiz('principleOptions.chunkedWork'),
          tQuiz('principleOptions.humanInLoop'),
          tQuiz('principleOptions.contextHygiene'),
          tQuiz('principleOptions.singleSource')
        ],
        correct: 0,
        principleId: 5,
        stage: 2,
        difficulty: 'hard'
      });
      
      // Fill in the blank questions
      questionTypes.push({
        id: 6,
        text: locale === 'zh'
          ? '完成以下句子：AI 协作时代的编程方法论包含 ___ 个阶段和 ___ 个原则。'
          : 'Complete the sentence: The AI collaboration era programming methodology includes ___ stages and ___ principles.',
        type: 'fill-blank',
        blanks: locale === 'zh' ? ['四', '十二'] : ['four', 'twelve'],
        correct: locale === 'zh' ? ['四', '十二'] : ['four', 'twelve'],
        principleId: 1,
        difficulty: 'easy'
      });
      
      return questionTypes;
    };
    return generateQuestions();
  });

  // Timer effect for timed mode - moved to top level
  useEffect(() => {
    if (quizMode === 'timed' && timeLeft > 0 && !showResults && !showQuizModeSelect) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      if (timeLeft === 1) {
        // Auto-submit when time runs out
        setTimeout(() => {
          if (selectedAnswer !== null) {
            const newAnswers = [...answers, selectedAnswer];
            setAnswers(newAnswers);
            
            // Check if answer is correct for streak tracking
            const question = questions[currentQuestion];
            const isCorrect = checkAnswer(selectedAnswer, question.correct, question.type);
            setStreak(isCorrect ? streak + 1 : 0);

            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
              setSelectedAnswer(null);
              setTimeLeft(30); // Reset timer for next question
            } else {
              setShowResults(true);
            }
          }
        }, 100);
      }
      
      return () => clearTimeout(timer);
    }
  }, [timeLeft, quizMode, showResults, showQuizModeSelect, selectedAnswer, answers, currentQuestion, questions, streak]);

  const handleAnswerSelect = (answer: number | string | string[]) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      // Check if answer is correct for streak tracking
      const question = questions[currentQuestion];
      const isCorrect = checkAnswer(selectedAnswer, question.correct, question.type);
      setStreak(isCorrect ? streak + 1 : 0);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        if (quizMode === 'timed') {
          setTimeLeft(30); // Reset timer for next question
        }
      } else {
        setShowResults(true);
      }
    }
  };
  
  const checkAnswer = (userAnswer: number | string | string[], correctAnswer: number | string | string[], type: string): boolean => {
    if (type === 'fill-blank') {
      if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
        return userAnswer.every((answer, index) => 
          answer.toLowerCase().trim() === correctAnswer[index].toLowerCase().trim()
        );
      }
    }
    return userAnswer === correctAnswer;
  };

  const calculateScore = () => {
    return answers.reduce((score: number, answer, index) => {
      const question = questions[index];
      const isCorrect = checkAnswer(answer, question.correct, question.type);
      return score + (isCorrect ? 1 : 0);
    }, 0);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setStreak(0);
    setShowQuizModeSelect(true);
    setTimeLeft(30);
  };
  
  const startQuiz = (mode: 'normal' | 'timed' | 'challenge' | 'adaptive') => {
    setQuizMode(mode);
    setShowQuizModeSelect(false);
    if (mode === 'timed') {
      setTimeLeft(30);
    }
  };

  // Quiz mode selection screen
  if (showQuizModeSelect) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="hero-gradient relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-32">
            <div className="max-w-5xl">
              <h1 className="hero-text text-white mb-8">
                {tQuiz('chooseChallenge')}
              </h1>
              
              <p className="text-xl text-white/90 mb-12 max-w-3xl leading-relaxed font-light">
                {tQuiz('selectModeDescription')}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/principles"
                  locale={locale}
                  className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
                >
                  {t('flashcards.studyPrinciples')}
                </Link>
                
                <Link
                  href="/flashcards"
                  locale={locale}
                  className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
                >
                  {t('principles.practiceWithFlashcards')}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Scroll Down Arrow */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => {
                document.getElementById('quiz-modes')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex flex-col items-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Scroll to quiz modes"
            >
              <div className="text-sm font-medium mb-2 opacity-80 group-hover:opacity-100">
                {tQuiz('chooseMode')}
              </div>
              <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/50 transition-all duration-300">
                <ChevronDownIcon className="h-5 w-5 animate-bounce" />
              </div>
            </button>
          </div>
        </div>

        {/* Quiz Modes Section */}
        <div id="quiz-modes" className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-6xl md:text-7xl font-light text-stone-900 mb-8 leading-tight">
                {tQuiz('quizModes')}
              </h2>
              <p className="text-lg text-stone-600 max-w-3xl font-light leading-relaxed">
                {tQuiz('chooseChallengeLevel')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="modern-card cursor-pointer group hover:shadow-2xl transition-all duration-300"
                onClick={() => startQuiz('normal')}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#95a76f]/20 rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-[#95a76f] rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-sm opacity-80"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-stone-900 mb-1">{tQuiz('normalMode')}</h3>
                    <div className="text-sm text-[#95a76f] font-medium">{tQuiz('normalModeSubtitle')}</div>
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {tQuiz('normalModeDescription')}
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="modern-card cursor-pointer group hover:shadow-2xl transition-all duration-300"
                onClick={() => startQuiz('timed')}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-stone-900 mb-1">{tQuiz('timedMode')}</h3>
                    <div className="text-sm text-amber-600 font-medium">{tQuiz('timedModeSubtitle')}</div>
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {tQuiz('timedModeDescription')}
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="modern-card cursor-pointer group hover:shadow-2xl transition-all duration-300"
                onClick={() => startQuiz('challenge')}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-4 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-stone-900 mb-1">{tQuiz('challengeMode')}</h3>
                    <div className="text-sm text-rose-600 font-medium">{tQuiz('challengeModeSubtitle')}</div>
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {tQuiz('challengeModeDescription')}
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="modern-card cursor-pointer group hover:shadow-2xl transition-all duration-300"
                onClick={() => startQuiz('adaptive')}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-stone-900 mb-1">{tQuiz('adaptiveMode')}</h3>
                    <div className="text-sm text-teal-600 font-medium">{tQuiz('adaptiveModeSubtitle')}</div>
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {tQuiz('adaptiveModeDescription')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section for Results */}
        <div className="hero-gradient relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-32">
            <div className="max-w-5xl text-center">
              <h1 className="hero-text text-white mb-8">
                {tQuiz('quizComplete')}
              </h1>
              
              <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                {tQuiz('modeResults', { mode: quizMode.charAt(0).toUpperCase() + quizMode.slice(1) })}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/principles"
                  locale={locale}
                  className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
                >
                  {t('flashcards.studyPrinciples')}
                </Link>
                
                <Link
                  href="/flashcards"
                  locale={locale}
                  className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
                >
                  {t('principles.practiceWithFlashcards')}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Scroll Down Arrow */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => {
                document.getElementById('results-content')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex flex-col items-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Scroll to results"
            >
              <div className="text-sm font-medium mb-2 opacity-80 group-hover:opacity-100">
                {tQuiz('viewResults')}
              </div>
              <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/50 transition-all duration-300">
                <ChevronDownIcon className="h-5 w-5 animate-bounce" />
              </div>
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div id="results-content" className="py-32 bg-white">
          <div className="max-w-2xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="modern-card text-center"
            >
            <div className="mb-8">
              <div className="text-lg text-stone-600 mb-6">
                {tQuiz('performanceSummary')}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-6xl font-bold text-[#95a76f] mb-2">
                {percentage}%
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300">
                {t('quiz.score')}: {score} / {questions.length}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {percentage >= 80 && (
                <div className="text-[#95a76f] font-semibold text-lg">{tQuiz('excellent')}</div>
              )}
              {percentage >= 60 && percentage < 80 && (
                <div className="text-amber-600 font-semibold text-lg">{tQuiz('goodJob')}</div>
              )}
              {percentage < 60 && (
                <div className="text-rose-600 font-semibold text-lg">{tQuiz('keepLearning')}</div>
              )}
              
              {streak > 0 && (
                <div className="bg-[#95a76f]/10 dark:bg-[#95a76f]/20 rounded-lg p-4">
                  <div className="text-[#95a76f] dark:text-[#95a76f]/80 font-semibold">
                    {tQuiz('maxStreak', { streak })}
                  </div>
                </div>
              )}
              
              {quizMode === 'challenge' && (
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4">
                  <div className="text-rose-600 dark:text-rose-400 font-semibold">
                    {tQuiz('challengeBonus', { points: Math.floor(percentage * 0.1) })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={resetQuiz}
              className="btn-primary"
            >
              {t('quiz.retry')}
            </button>
          </motion.div>
            </div>
          </div>
        </div>
    );
  }

  const question = questions[currentQuestion];

  // Render different question types
  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'border-[#95a76f] bg-[#95a76f]/10 dark:bg-[#95a76f]/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-[#95a76f]/50 dark:hover:border-[#95a76f]/60'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedAnswer === index
                      ? 'border-[#95a76f] bg-[#95a76f]'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );
      
      case 'true-false':
        return (
          <div className="grid grid-cols-2 gap-4">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-6 text-center rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'border-[#95a76f] bg-[#95a76f]/10 dark:bg-[#95a76f]/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-[#95a76f]/50 dark:hover:border-[#95a76f]/60'
                }`}
              >
                <div className="text-2xl mb-2">{index === 0 ? '✓' : '✗'}</div>
                <div className="font-semibold text-gray-700 dark:text-gray-300">{option}</div>
              </button>
            ))}
          </div>
        );
      
      case 'scenario':
        return (
          <div>
            {question.scenario && (
              <div className="bg-[#95a76f]/10 dark:bg-[#95a76f]/20 rounded-lg p-4 mb-6">
                <div className="text-[#95a76f] dark:text-[#95a76f]/90 font-medium mb-2">{tQuiz('scenario')}:</div>
                <div className="text-[#95a76f]/80 dark:text-[#95a76f]/70">{question.scenario}</div>
              </div>
            )}
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'border-[#95a76f] bg-[#95a76f]/10 dark:bg-[#95a76f]/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-[#95a76f]/50 dark:hover:border-[#95a76f]/60'
                  }`}
                >
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'fill-blank':
        return (
          <FillBlankQuestion question={question} onAnswer={handleAnswerSelect} />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Quiz Header */}
      <div className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={resetQuiz}
                className="inline-flex items-center text-stone-600 hover:text-stone-900 text-sm font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
{tQuiz('backToModes')}
              </button>
              <div className="text-sm font-medium text-stone-500">
{tQuiz('modeLabel', { mode: quizMode.charAt(0).toUpperCase() + quizMode.slice(1) })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {quizMode === 'timed' && (
                <div className={`text-lg font-bold px-4 py-2 rounded-full ${
                  timeLeft <= 5 
                    ? 'text-rose-600 bg-rose-100' 
                    : 'text-amber-600 bg-amber-100'
                }`}>
                  {timeLeft}s
                </div>
              )}
              {streak > 1 && (
                <div className="text-lg font-bold text-[#95a76f] bg-[#95a76f]/20 px-4 py-2 rounded-full">
                  {streak} streak
                </div>
              )}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 leading-tight">
{tQuiz('interactiveQuiz')}
          </h1>
          <div className="text-lg text-stone-600">
{tQuiz('questionCount', { current: currentQuestion + 1, total: questions.length })}
          </div>
        </div>
      </div>

      {/* Main Quiz Content */}
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">

          {/* Progress bar */}
          <div className="mb-12">
            <div className="w-full bg-stone-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 shadow-sm ${
                  quizMode === 'timed' ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 
                  quizMode === 'challenge' ? 'bg-gradient-to-r from-rose-500 to-rose-600' :
                  'bg-gradient-to-r from-[#95a76f] to-[#95a76f]/80'
                }`}
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
            {quizMode === 'timed' && timeLeft <= 10 && (
              <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Question */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="modern-card"
          >
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-xl font-medium text-stone-900 leading-relaxed">
                {question.text}
              </h2>
              {question.difficulty && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ml-4 flex-shrink-0 ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {tQuiz(`difficulty.${question.difficulty}`)}
                </div>
              )}
            </div>

          {renderQuestion()}

            <div className="flex justify-between items-center mt-12">
              <div className="text-sm text-stone-500">
                {tQuiz('questionType', { type: question.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) })}
              </div>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedAnswer !== null
                    ? `${quizMode === 'timed' ? 'bg-amber-600 hover:bg-amber-700' : 
                        quizMode === 'challenge' ? 'bg-rose-600 hover:bg-rose-700' :
                        'bg-[#95a76f] hover:bg-[#95a76f]/90'} text-white shadow-lg hover:shadow-xl hover:scale-105`
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
{currentQuestion < questions.length - 1 ? tQuiz('nextQuestion') : tQuiz('submitQuiz')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}