/**
 * Fact Matching Mini-Game Component
 * Epic 6: Story 6.9 (BA-US-fact-matching-minigame)
 * Drag missing words from word bank into blanks in event description
 */

"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import type { TimelineEvent } from "@/lib/sampleEvents";

interface Blank {
  id: string;
  correctWord: string;
  position: number; // Position in text
}

interface WordBankItem {
  id: string;
  word: string;
  isCorrect: boolean;
}

interface FactMatchingProps {
  event: TimelineEvent;
  onComplete: (success: boolean) => void;
}

export default function FactMatching({ event, onComplete }: FactMatchingProps) {
  // Generate blanks and word bank from event content
  const {description, blanks, wordBank} = generateFactMatchingData(event);

  const [filledBlanks, setFilledBlanks] = useState<Map<string, string>>(new Map());
  const [availableWords, setAvailableWords] = useState<WordBankItem[]>(wordBank);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Map<string, boolean>>(new Map());

  const handleDragStart = (event: DragStartEvent) => {
    setActiveWord(event.active.data.current?.word || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveWord(null);

    if (!over) return;

    // If dragging from word bank to blank
    if (over.id.toString().startsWith("blank-")) {
      const blankId = over.id.toString();
      const word = active.data.current?.word as string;
      const wordId = active.id.toString();

      // Fill the blank
      const newFilled = new Map(filledBlanks);

      // If blank already has a word, return it to word bank
      const existingWord = newFilled.get(blankId);
      if (existingWord) {
        const existingItem = wordBank.find(w => w.word === existingWord);
        if (existingItem && !availableWords.find(w => w.id === existingItem.id)) {
          setAvailableWords([...availableWords, existingItem]);
        }
      }

      newFilled.set(blankId, word);
      setFilledBlanks(newFilled);

      // Remove word from available
      setAvailableWords(availableWords.filter(w => w.id !== wordId));
    }

    // If dragging from blank back to word bank
    if (over.id === "word-bank" && active.id.toString().startsWith("filled-")) {
      const blankId = active.data.current?.blankId as string;
      const word = filledBlanks.get(blankId);

      if (word) {
        // Remove from filled
        const newFilled = new Map(filledBlanks);
        newFilled.delete(blankId);
        setFilledBlanks(newFilled);

        // Return to word bank
        const wordItem = wordBank.find(w => w.word === word);
        if (wordItem) {
          setAvailableWords([...availableWords, wordItem]);
        }
      }
    }
  };

  const handleSubmit = () => {
    // Validate all blanks
    const newResults = new Map<string, boolean>();
    let allCorrect = true;

    blanks.forEach(blank => {
      const blankId = `blank-${blank.id}`;
      const filledWord = filledBlanks.get(blankId);
      const isCorrect = filledWord === blank.correctWord;
      newResults.set(blankId, isCorrect);

      if (!isCorrect) allCorrect = false;
    });

    setResults(newResults);
    setSubmitted(true);

    // Delay outcome to show feedback
    setTimeout(() => {
      onComplete(allCorrect);
    }, 2000);
  };

  const handleNativeDrop = (blankId: string, word: string, wordId: string) => {
    if (submitted) return;

    // If blank already has a word, return it to word bank
    const existingWord = filledBlanks.get(blankId);
    if (existingWord) {
      const existingItem = wordBank.find(w => w.word === existingWord);
      if (existingItem && !availableWords.find(w => w.id === existingItem.id)) {
        setAvailableWords([...availableWords, existingItem]);
      }
    }

    // Fill the blank
    const newFilled = new Map(filledBlanks);
    newFilled.set(blankId, word);
    setFilledBlanks(newFilled);

    // Remove word from available
    setAvailableWords(availableWords.filter(w => w.id !== wordId));
  };

  const allBlanksFilled = blanks.every(blank =>
    filledBlanks.has(`blank-${blank.id}`)
  );

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
          Fill in the missing words to defend this event!
        </p>
      </header>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Description with blanks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 mb-6">
          <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {renderDescriptionWithBlanks(description, blanks, filledBlanks, submitted, results, handleNativeDrop)}
          </div>
        </div>

        {/* Word Bank */}
        <div
          id="word-bank"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Word Bank
          </h2>
          <div className="flex flex-wrap gap-3">
            {availableWords.map(item => (
              <div
                key={item.id}
                draggable
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-lg font-medium cursor-move hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                onDragStart={(e) => {
                  e.dataTransfer.setData("word", item.word);
                  e.dataTransfer.setData("wordId", item.id);
                }}
              >
                {item.word}
              </div>
            ))}
            {availableWords.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 italic">
                All words have been used
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        {!submitted && (
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!allBlanksFilled}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                !allBlanksFilled
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              }`}
              type="button"
            >
              Submit Answers
            </button>
          </div>
        )}

        {/* Feedback */}
        {submitted && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              Array.from(results.values()).every(v => v)
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            <p className="font-semibold text-center">
              {Array.from(results.values()).every(v => v)
                ? "Perfect! All words are correct!"
                : "Some words are incorrect. The event has been corrupted."}
            </p>
          </div>
        )}

        <DragOverlay>
          {activeWord ? (
            <div className="px-4 py-2 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-lg font-medium opacity-75">
              {activeWord}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700">
        <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
          <strong>Remember:</strong> All words must be correct to defend the event!
        </p>
      </div>
    </div>
  );
}

/**
 * Generate fact matching data from event
 * Creates description with blanks and word bank
 */
function generateFactMatchingData(event: TimelineEvent): {
  description: string;
  blanks: Blank[];
  wordBank: WordBankItem[];
} {
  // For MVP, we'll create a simple fact matching from the description
  const blanks: Blank[] = [];
  const wordBank: WordBankItem[] = [];

  // Extract key information from event
  const description = event.description;

  // Find keywords to blank out (simple implementation)
  // In production, this would be more sophisticated
  const keywords: string[] = [];

  // Extract year if present
  const yearMatch = description.match(/\b\d{4}\b/);
  if (yearMatch && event.year > 0) {
    keywords.push(event.year.toString());
  }

  // Extract proper nouns (simple heuristic - capitalized words)
  const words = description.split(/\s+/);
  words.forEach(word => {
    const cleaned = word.replace(/[^a-zA-Z]/g, '');
    if (cleaned && cleaned.length > 3 && /^[A-Z]/.test(cleaned) && !keywords.includes(cleaned)) {
      keywords.push(cleaned);
    }
  });

  // Limit to 3-5 keywords
  const selectedKeywords = keywords.slice(0, Math.min(5, keywords.length));

  // Create blanks
  selectedKeywords.forEach((keyword, index) => {
    blanks.push({
      id: `blank-${index}`,
      correctWord: keyword,
      position: index,
    });

    // Add correct word to word bank
    wordBank.push({
      id: `word-correct-${index}`,
      word: keyword,
      isCorrect: true,
    });
  });

  // Add distractors (2-3 per blank)
  blanks.forEach((blank, index) => {
    // Generate plausible distractors based on type
    const distractors = generateDistractors(blank.correctWord, event);
    distractors.forEach((distractor, dIndex) => {
      wordBank.push({
        id: `word-distractor-${index}-${dIndex}`,
        word: distractor,
        isCorrect: false,
      });
    });
  });

  // Shuffle word bank
  const shuffled = [...wordBank].sort(() => Math.random() - 0.5);

  return { description, blanks, wordBank: shuffled };
}

/**
 * Generate plausible distractors for a word
 */
function generateDistractors(correctWord: string, _event: TimelineEvent): string[] {
  const distractors: string[] = [];

  // If it's a year, generate nearby years
  if (/^\d+$/.test(correctWord)) {
    const year = parseInt(correctWord);
    distractors.push((year - 50).toString());
    distractors.push((year + 50).toString());
  } else {
    // For names/words, use variations or related terms
    // Simple implementation - in production, use a more sophisticated approach
    distractors.push(correctWord.substring(0, 3) + "XXX");
    distractors.push("Wrong" + correctWord.substring(3));
  }

  return distractors.slice(0, 2);
}

/**
 * Render description with blanks
 */
function renderDescriptionWithBlanks(
  description: string,
  blanks: Blank[],
  filledBlanks: Map<string, string>,
  submitted: boolean,
  results: Map<string, boolean>,
  onDrop: (blankId: string, word: string, wordId: string) => void
) {
  // For MVP, render blanks inline
  // In production, this would parse the description more intelligently
  return (
    <div>
      <p>
        Complete the description with the correct words:
      </p>
      <div className="mt-4 space-y-2">
        {blanks.map((blank, index) => {
          const blankId = `blank-${blank.id}`;
          const filledWord = filledBlanks.get(blankId);
          const isCorrect = results.get(blankId);

          return (
            <div key={blank.id} className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Blank {index + 1}:</span>
              <div
                id={blankId}
                className={`min-w-[120px] px-4 py-2 border-2 border-dashed rounded-lg ${
                  submitted
                    ? isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                      : "border-red-500 bg-red-50 dark:bg-red-900/30"
                    : filledWord
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                }`}
                onDrop={(e) => {
                  e.preventDefault();
                  const word = e.dataTransfer.getData("word");
                  const wordId = e.dataTransfer.getData("wordId");

                  if (word && wordId) {
                    onDrop(blankId, word, wordId);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {filledWord || "_______"}
              </div>
              {submitted && !isCorrect && (
                <span className="text-sm text-red-600 dark:text-red-400">
                  (Correct: {blank.correctWord})
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
