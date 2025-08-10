'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { principles } from '@/data/principles';
import FlashCard from '@/components/FlashCard';
import { UserProgress } from '@/types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function FlashcardsPage() {
  const t = useTranslations('flashcards');
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStates, setCardStates] = useState<{ [key: number]: boolean }>({});

  const currentPrinciple = principles[currentIndex];

  // Load progress and card states from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('flashcard-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    } else {
      // Initialize progress for all principles
      const initialProgress: UserProgress[] = principles.map(p => ({
        principleId: p.id,
        status: 'not_started',
        lastReviewed: new Date(),
        correctAnswers: 0,
        totalAttempts: 0
      }));
      setProgress(initialProgress);
      localStorage.setItem('flashcard-progress', JSON.stringify(initialProgress));
    }

    // Load card states
    const savedCardStates = localStorage.getItem('flashcard-states');
    if (savedCardStates) {
      setCardStates(JSON.parse(savedCardStates));
    }

    // Load current index
    const savedCurrentIndex = localStorage.getItem('flashcard-current-index');
    if (savedCurrentIndex) {
      setCurrentIndex(parseInt(savedCurrentIndex));
    }
  }, []);

  // Update current card flip state and save to localStorage
  useEffect(() => {
    setIsFlipped(cardStates[currentIndex] || false);
  }, [currentIndex, cardStates]);

  // Save current index to localStorage
  useEffect(() => {
    localStorage.setItem('flashcard-current-index', currentIndex.toString());
  }, [currentIndex]);

  // Update progress when viewing a card
  useEffect(() => {
    if (progress.length > 0) {
      const currentPrincipleProgress = progress.find(p => p.principleId === currentPrinciple.id);
      if (currentPrincipleProgress?.status !== 'learning') {
        const updatedProgress = progress.map(p => 
          p.principleId === currentPrinciple.id
            ? { ...p, status: 'learning' as const, lastReviewed: new Date() }
            : p
        );
        setProgress(updatedProgress);
        localStorage.setItem('flashcard-progress', JSON.stringify(updatedProgress));
      }
    }
  }, [currentIndex, currentPrinciple, progress]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % principles.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + principles.length) % principles.length);
  };

  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    
    // Save card state to localStorage
    const newCardStates = { ...cardStates, [currentIndex]: newFlipped };
    setCardStates(newCardStates);
    localStorage.setItem('flashcard-states', JSON.stringify(newCardStates));
  };

  const handleMarkMastered = () => {
    if (!isFlipped) return; // Can only mark as mastered after seeing the back
    
    const updatedProgress = progress.map(p => 
      p.principleId === currentPrinciple.id
        ? { ...p, status: 'mastered' as const, lastReviewed: new Date() }
        : p
    );
    setProgress(updatedProgress);
    localStorage.setItem('flashcard-progress', JSON.stringify(updatedProgress));
    
    // Auto advance to next card after marking as mastered
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const handleMarkNeedsReview = () => {
    if (!isFlipped) return; // Can only mark as needs review after seeing the back
    
    const updatedProgress = progress.map(p => 
      p.principleId === currentPrinciple.id
        ? { ...p, status: 'needs_review' as const, lastReviewed: new Date() }
        : p
    );
    setProgress(updatedProgress);
    localStorage.setItem('flashcard-progress', JSON.stringify(updatedProgress));
    
    // Auto advance to next card after marking as needs review  
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const currentProgress = progress.find(p => p.principleId === currentPrinciple.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="hero-gradient relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-32 sm:pb-24">
          <div className="max-w-5xl">
            <h1 className="hero-text text-white mb-8">
              {t('title')}
            </h1>
            
            <p className="text-xl text-white/90 mb-12 max-w-3xl leading-relaxed font-light">
              {t('subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href="/principles"
                locale={locale}
                className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
              >
                {t('studyPrinciples')}
              </Link>
              
              <Link
                href="/quiz"
                locale={locale}
                className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
              >
                {t('takeQuiz')}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Down Arrow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => {
              document.getElementById('practice-content')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex flex-col items-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
            aria-label="Scroll to practice content"
          >
            <div className="text-xs sm:text-sm font-medium mb-2 opacity-80 group-hover:opacity-100 whitespace-nowrap px-2">
              {t('startPracticing')}
            </div>
            <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/50 transition-all duration-300">
              <ChevronDownIcon className="h-5 w-5 animate-bounce" />
            </div>
          </button>
        </div>
        
        {/* Stats Overlay */}
        <div className="absolute top-24 right-12 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <div className="stat-number text-white">{Math.round(((currentIndex + 1) / principles.length) * 100)}</div>
            <div className="text-white/80 font-medium">{t('progress')}</div>
            <div className="text-xs text-white/60 mt-1">{currentIndex + 1} {t('of')} {principles.length}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="practice-content" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          {/* Progress Section */}
          <div className="mb-16">
            <h2 className="text-6xl md:text-7xl font-light text-stone-900 mb-8 leading-tight">
              {t('practiceSession')}
            </h2>
            <p className="text-lg text-stone-600 max-w-3xl font-light leading-relaxed mb-8">
              {t('practiceDescription')}
            </p>
            
            {/* Enhanced Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-stone-600 mb-4">
                <span className="font-medium">{t('learningProgress')}</span>
                <span className="font-medium">{currentIndex + 1} / {principles.length}</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-[#95a76f] to-[#95a76f]/80 h-3 rounded-full transition-all duration-300 shadow-lg"
                  style={{ width: `${((currentIndex + 1) / principles.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

        {/* FlashCard */}
        <FlashCard 
          principle={currentPrinciple}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />

          {/* Action buttons */}
          <div className="flex justify-center space-x-6 mt-12">
            <button
              onClick={handleMarkNeedsReview}
              disabled={!isFlipped}
              className={`px-8 py-4 rounded-full font-medium transition-all duration-200 ${
                !isFlipped
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  : currentProgress?.status === 'needs_review'
                  ? 'bg-stone-600 text-white shadow-lg transform scale-105'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 hover:shadow-md cursor-pointer'
              }`}
            >
              {t('needsReview')}
            </button>
            <button
              onClick={handleMarkMastered}
              disabled={!isFlipped}
              className={`px-8 py-4 rounded-full font-medium transition-all duration-200 ${
                !isFlipped
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  : currentProgress?.status === 'mastered'
                  ? 'bg-[#95a76f] text-white shadow-lg transform scale-105'
                  : 'bg-[#95a76f]/20 hover:bg-[#95a76f]/30 text-[#95a76f] hover:shadow-md cursor-pointer'
              }`}
            >
              {t('mastered')}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}