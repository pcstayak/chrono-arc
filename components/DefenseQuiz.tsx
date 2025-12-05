/**
 * Defense Quiz Component
 * Epic 6: Story 6.3 (BA-US-quiz-game-integration)
 * Displays quiz questions when an event is under attack
 * Players must answer 5 questions correctly to defend the event
 */

"use client";

import { useState, useEffect } from "react";
import type { TimelineEvent } from "@/lib/sampleEvents";

export interface QuizQuestion {
  question: string;
  answers: string[];
  correctIndex: number;
}

interface DefenseQuizProps {
  event: TimelineEvent;
  questions: QuizQuestion[];
  onAnswerSubmit: (questionIndex: number, selectedIndex: number, isCorrect: boolean) => void;
  onQuizComplete: (success: boolean) => void;
}

export default function DefenseQuiz({
  event,
  questions,
  onAnswerSubmit,
  onQuizComplete,
}: DefenseQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    setIsCorrect(null);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (index: number) => {
    if (!hasAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || hasAnswered) return;

    const correct = selectedAnswer === currentQuestion.correctIndex;
    setIsCorrect(correct);
    setHasAnswered(true);

    // Notify parent about the answer
    onAnswerSubmit(currentQuestionIndex, selectedAnswer, correct);

    if (!correct) {
      // Incorrect answer - quiz ends immediately (Story 6.4)
      setTimeout(() => {
        onQuizComplete(false);
      }, 2000);
    } else if (currentQuestionIndex === totalQuestions - 1) {
      // Last question and correct - quiz complete with success
      setTimeout(() => {
        onQuizComplete(true);
      }, 2000);
    } else {
      // Correct answer - move to next question after brief delay
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1500);
    }
  };

  const getAnswerButtonClass = (index: number) => {
    const baseClass =
      "w-full min-h-[60px] px-6 py-4 rounded-lg font-semibold text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

    if (!hasAnswered) {
      // Before answering
      if (selectedAnswer === index) {
        return `${baseClass} bg-blue-600 text-white shadow-lg scale-[1.02]`;
      }
      return `${baseClass} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:shadow-md`;
    }

    // After answering
    if (index === currentQuestion.correctIndex) {
      return `${baseClass} bg-green-600 text-white shadow-lg`;
    }
    if (index === selectedAnswer && !isCorrect) {
      return `${baseClass} bg-red-600 text-white shadow-lg`;
    }
    return `${baseClass} bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-50`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-6 md:mb-8 text-center">
        <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full mb-4">
          <span className="font-bold">UNDER ATTACK!</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Defend: {event.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
          Answer these questions correctly to defend this event from being corrupted!
        </p>
      </header>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {currentQuestion.question}
        </h2>

        {/* Answer choices */}
        <div className="space-y-3">
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={hasAnswered}
              className={getAnswerButtonClass(index)}
              type="button"
            >
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 font-bold mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-base md:text-lg">{answer}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback message */}
        {hasAnswered && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              isCorrect
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            <p className="font-semibold text-center">
              {isCorrect
                ? currentQuestionIndex === totalQuestions - 1
                  ? "Correct! Event defended successfully!"
                  : "Correct! Moving to next question..."
                : "Incorrect. The event has been corrupted."}
            </p>
          </div>
        )}
      </div>

      {/* Submit button */}
      {!hasAnswered && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
              selectedAnswer === null
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
            type="button"
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* Instructions (only show on first question) */}
      {currentQuestionIndex === 0 && !hasAnswered && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
            <strong>Remember:</strong> One wrong answer and the event is lost. Think carefully before
            submitting!
          </p>
        </div>
      )}
    </div>
  );
}
