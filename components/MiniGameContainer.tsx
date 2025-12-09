/**
 * Mini-Game Container Component
 * Epic 6: Stories 6.13 & 6.3 (UPDATED)
 * Selects and renders the appropriate mini-game type for event defense
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { TimelineEvent } from "@/lib/sampleEvents";
import type { MiniGameType, PlayerProgress } from "@/types";
import { selectMiniGameType, updatePlayerProgress } from "@/lib/miniGameSelector";
import DefenseQuiz, { type QuizQuestion } from "./DefenseQuiz";
import { generateQuizQuestions } from "@/lib/quizGenerator";
import FactMatching from "./defense/FactMatching";
import SequencePuzzle from "./defense/SequencePuzzle";
import MetadataClassification from "./defense/MetadataClassification";
import CauseEffectChain from "./defense/CauseEffectChain";

interface MiniGameContainerProps {
  event: TimelineEvent;
  onDefenseComplete: (eventId: string, success: boolean) => void;
}

export default function MiniGameContainer({
  event,
  onDefenseComplete,
}: MiniGameContainerProps) {
  const [selectedType, setSelectedType] = useState<MiniGameType | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [outcome, setOutcome] = useState<"success" | "failure" | null>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress | undefined>(undefined);

  // Story 6.13: Select mini-game type when event is attacked
  useEffect(() => {
    if (event.state === "attacked" && !selectedType) {
      // In production, playerProgress would come from game state/database
      // For now, we'll use a simple in-memory solution
      const selection = selectMiniGameType(event, playerProgress);
      setSelectedType(selection.selectedType);

      console.log(`[MiniGameContainer] Selected ${selection.selectedType} for ${event.title}`);
      console.log(`[MiniGameContainer] Rationale: ${selection.rationale}`);

      // Generate content based on selected type
      if (selection.selectedType === "quiz") {
        const questions = generateQuizQuestions(event);
        setQuizQuestions(questions);
      }
      // Other mini-game types generate their content internally
    }
  }, [event, selectedType, playerProgress]);

  // Handle answer submission
  const handleAnswerSubmit = useCallback(
    (questionIndex: number, selectedIndex: number, isCorrect: boolean) => {
      console.log(`Question ${questionIndex}: ${isCorrect ? "Correct" : "Incorrect"}`);
    },
    []
  );

  // Handle mini-game completion
  const handleComplete = useCallback(
    (success: boolean) => {
      setOutcome(success ? "success" : "failure");

      // Update player progress (Story 6.13)
      if (selectedType) {
        const updated = updatePlayerProgress(
          playerProgress,
          event.id,
          selectedType,
          success
        );
        setPlayerProgress(updated);
      }

      // Notify parent component
      onDefenseComplete(event.id, success);

      // Clear state after showing outcome
      setTimeout(() => {
        setSelectedType(null);
        setQuizQuestions([]);
        setOutcome(null);
      }, 3000);
    },
    [event.id, selectedType, playerProgress, onDefenseComplete]
  );

  // Loading state
  if (!selectedType || (selectedType === "quiz" && quizQuestions.length === 0)) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing defense challenge...
          </p>
        </div>
      </div>
    );
  }

  // Outcome screen
  if (outcome !== null) {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12 text-center ${
            outcome === "success"
              ? "border-4 border-green-500"
              : "border-4 border-red-500"
          }`}
        >
          <div className="mb-6">
            {outcome === "success" ? (
              <svg
                className="w-24 h-24 md:w-32 md:h-32 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-24 h-24 md:w-32 md:h-32 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>

          <h2
            className={`text-2xl md:text-3xl font-bold mb-4 ${
              outcome === "success"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {outcome === "success" ? "Event Defended!" : "Event Lost"}
          </h2>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            {outcome === "success"
              ? `Great work! You successfully defended ${event.title} from corruption.`
              : `The time bandits corrupted ${event.title}. Better luck next time!`}
          </p>
        </div>
      </div>
    );
  }

  // Render the appropriate mini-game
  switch (selectedType) {
    case "quiz":
      return (
        <DefenseQuiz
          event={event}
          questions={quizQuestions}
          onAnswerSubmit={handleAnswerSubmit}
          onQuizComplete={handleComplete}
        />
      );

    case "sequence":
      // Story 6.8 - Chronological Sequence Puzzle component
      return (
        <SequencePuzzle
          event={event}
          onComplete={handleComplete}
        />
      );

    case "fact_match":
      // Story 6.9 - Fact Matching component
      return (
        <FactMatching
          event={event}
          onComplete={handleComplete}
        />
      );

    case "anomaly":
      // TODO: Story 6.10 - Implement SpotTheAnomaly component
      return (
        <div className="max-w-2xl mx-auto text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Spot the Anomaly</h2>
          <p className="text-gray-600 dark:text-gray-400">Coming soon!</p>
        </div>
      );

    case "classification":
      // Story 6.11 - Metadata Classification component
      return (
        <MetadataClassification
          event={event}
          onComplete={handleComplete}
        />
      );

    case "cause_effect":
      // Story 6.12 - Cause-Effect Chain Builder component
      return (
        <CauseEffectChain
          event={event}
          onComplete={handleComplete}
        />
      );

    default:
      return (
        <div className="max-w-2xl mx-auto text-center p-8">
          <p className="text-red-600">Unknown mini-game type: {selectedType}</p>
        </div>
      );
  }
}
