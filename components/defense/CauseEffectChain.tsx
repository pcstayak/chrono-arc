/**
 * Cause-and-Effect Chain Builder Mini-Game Component
 * Epic 6: Story 6.12 (BA-US-cause-effect-chain-builder)
 * Connect causes and effects to the central attacked event
 */

"use client";

import { useState, useCallback, useRef } from "react";
import type { TimelineEvent } from "@/lib/sampleEvents";

interface CauseEffectItem {
  id: string;
  text: string;
  type: "cause" | "effect" | "incorrect";
  isCorrect: boolean; // Whether it should be connected
  position: { x: number; y: number }; // Position for layout
}

interface CauseEffectChainProps {
  event: TimelineEvent;
  onComplete: (success: boolean) => void;
}

export default function CauseEffectChain({ event, onComplete }: CauseEffectChainProps) {
  // Generate cause-effect data
  const { items } = generateCauseEffectData(event);

  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const toggleConnection = useCallback((itemId: string) => {
    if (submitted) return;

    setConnections(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, [submitted]);

  const handleSubmit = () => {
    // Validate connections
    let mistakes = 0;

    items.forEach(item => {
      const isConnected = connections.has(item.id);
      const shouldBeConnected = item.isCorrect;

      // Count incorrect connections (false positives) and missed connections (false negatives)
      if (isConnected !== shouldBeConnected) {
        mistakes++;
      }
    });

    setMistakeCount(mistakes);
    setSubmitted(true);

    // Allow 0-1 mistakes for success (per acceptance criteria)
    const success = mistakes <= 1;

    // Delay outcome to show feedback
    setTimeout(() => {
      onComplete(success);
    }, 2500);
  };

  // Get validation state for an item
  const getItemState = (item: CauseEffectItem): "correct" | "incorrect" | "missed" | "none" => {
    if (!submitted) return "none";

    const isConnected = connections.has(item.id);
    const shouldBeConnected = item.isCorrect;

    if (isConnected && shouldBeConnected) return "correct";
    if (isConnected && !shouldBeConnected) return "incorrect";
    if (!isConnected && shouldBeConnected) return "missed";
    return "none";
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-6 md:mb-8 text-center">
        <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full mb-4">
          <span className="font-bold">UNDER ATTACK!</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Defend: {event.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
          Connect the causes and effects that relate to this event. You can make at most 1 mistake!
        </p>
      </header>

      {/* Main Canvas */}
      <div
        ref={containerRef}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12 mb-6 min-h-[600px]"
      >
        {/* SVG for connection lines */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {Array.from(connections).map(itemId => {
            const item = items.find(i => i.id === itemId);
            if (!item) return null;

            // Draw line from central event to connected item
            const centerX = 50; // Center of container (percentage)
            const centerY = 50;

            const state = getItemState(item);
            let strokeColor = "#3B82F6"; // blue
            if (state === "correct") strokeColor = "#10B981"; // green
            if (state === "incorrect") strokeColor = "#EF4444"; // red

            return (
              <line
                key={itemId}
                x1={`${centerX}%`}
                y1={`${centerY}%`}
                x2={`${item.position.x}%`}
                y2={`${item.position.y}%`}
                stroke={strokeColor}
                strokeWidth="3"
                strokeDasharray={state === "missed" ? "5,5" : "none"}
                opacity="0.6"
              />
            );
          })}
        </svg>

        {/* Central Event Node */}
        <div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="bg-blue-600 text-white rounded-xl shadow-2xl p-6 max-w-xs text-center border-4 border-blue-700">
            <h3 className="font-bold text-lg mb-2">{event.title}</h3>
            <p className="text-sm opacity-90">Central Event</p>
          </div>
        </div>

        {/* Surrounding Items */}
        {items.map(item => {
          const isConnected = connections.has(item.id);
          const state = getItemState(item);

          let bgColor = "bg-gray-100 dark:bg-gray-700";
          let borderColor = "border-gray-300 dark:border-gray-600";
          let textColor = "text-gray-900 dark:text-gray-100";

          if (isConnected && !submitted) {
            bgColor = "bg-blue-100 dark:bg-blue-900";
            borderColor = "border-blue-500";
            textColor = "text-blue-900 dark:text-blue-100";
          }

          if (state === "correct") {
            bgColor = "bg-green-100 dark:bg-green-900";
            borderColor = "border-green-500";
            textColor = "text-green-900 dark:text-green-100";
          } else if (state === "incorrect") {
            bgColor = "bg-red-100 dark:bg-red-900";
            borderColor = "border-red-500";
            textColor = "text-red-900 dark:text-red-100";
          } else if (state === "missed") {
            bgColor = "bg-yellow-100 dark:bg-yellow-900";
            borderColor = "border-yellow-500";
            textColor = "text-yellow-900 dark:text-yellow-100";
          }

          return (
            <div
              key={item.id}
              className="absolute z-10"
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <button
                onClick={() => toggleConnection(item.id)}
                disabled={submitted}
                className={`${bgColor} ${textColor} rounded-lg shadow-lg p-4 border-2 ${borderColor} max-w-[200px] text-sm ${
                  submitted
                    ? "cursor-default"
                    : "cursor-pointer hover:shadow-xl hover:scale-105"
                } transition-all`}
              >
                {item.text}
                {submitted && state === "missed" && (
                  <div className="mt-2 text-xs font-semibold">
                    (Should be connected)
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-4 rounded-lg font-bold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            type="button"
          >
            Submit Connections
          </button>
        </div>
      )}

      {/* Feedback */}
      {submitted && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            mistakeCount <= 1
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          }`}
        >
          <p className="font-semibold text-center">
            {mistakeCount === 0
              ? "Perfect! All connections are correct!"
              : mistakeCount === 1
              ? "Good job! One mistake is acceptable."
              : `${mistakeCount} mistakes. The event has been corrupted.`}
          </p>
          <p className="text-sm text-center mt-2">
            <strong>Legend:</strong> Green = Correct, Red = Incorrect Connection, Yellow = Missed Connection
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700">
        <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
          <strong>Instructions:</strong> Click on statements to connect them to the central event. Click again to disconnect. You can make at most 1 mistake!
        </p>
      </div>
    </div>
  );
}

/**
 * Generate cause-effect data from event
 * Creates causes, effects, and incorrect statements
 */
function generateCauseEffectData(event: TimelineEvent): {
  items: CauseEffectItem[];
} {
  const items: CauseEffectItem[] = [];

  // Generate causes (3-4 correct)
  const causes = generateCauses(event);
  causes.forEach((text, index) => {
    items.push({
      id: `cause-${index}`,
      text,
      type: "cause",
      isCorrect: true,
      position: calculatePosition(index, causes.length, "cause"),
    });
  });

  // Generate effects (3-4 correct)
  const effects = generateEffects(event);
  effects.forEach((text, index) => {
    items.push({
      id: `effect-${index}`,
      text,
      type: "effect",
      isCorrect: true,
      position: calculatePosition(index, effects.length, "effect"),
    });
  });

  // Generate incorrect statements (2-3)
  const incorrect = generateIncorrectStatements(event);
  incorrect.forEach((text, index) => {
    items.push({
      id: `incorrect-${index}`,
      text,
      type: "incorrect",
      isCorrect: false,
      position: calculatePosition(index, incorrect.length, "incorrect"),
    });
  });

  return { items };
}

/**
 * Calculate position for item in radial layout
 */
function calculatePosition(
  index: number,
  total: number,
  type: "cause" | "effect" | "incorrect"
): { x: number; y: number } {
  // Radial layout around center (50%, 50%)
  const radius = 35; // Distance from center (percentage)

  // Divide circle into sections
  let startAngle = 0;
  let angleSpan = 0;

  if (type === "cause") {
    startAngle = 180; // Left side
    angleSpan = 120;
  } else if (type === "effect") {
    startAngle = 0; // Right side
    angleSpan = 120;
  } else {
    startAngle = 240; // Bottom
    angleSpan = 120;
  }

  const angle = startAngle + (angleSpan * index) / Math.max(1, total - 1);
  const radians = (angle * Math.PI) / 180;

  const x = 50 + radius * Math.cos(radians);
  const y = 50 + radius * Math.sin(radians);

  return { x, y };
}

/**
 * Generate causes (what led to this event)
 */
function generateCauses(event: TimelineEvent): string[] {
  const causes: string[] = [];

  // TODO: In production, use pre-authored content or NLP
  // For MVP, generate generic causes

  causes.push(`Social conditions before ${event.year}`);
  causes.push(`Earlier technological developments`);
  causes.push(`Political climate of the era`);

  if (event.era === "industrial") {
    causes.push(`Industrial Revolution innovations`);
  } else if (event.era === "modern") {
    causes.push(`Post-war economic conditions`);
  } else {
    causes.push(`Cultural factors of the ${event.era} period`);
  }

  return causes.slice(0, 4);
}

/**
 * Generate effects (what resulted from this event)
 */
function generateEffects(event: TimelineEvent): string[] {
  const effects: string[] = [];

  // TODO: In production, use pre-authored content or NLP
  // For MVP, generate generic effects

  effects.push(`Changed society after ${event.year}`);
  effects.push(`Influenced future innovations`);
  effects.push(`Shaped modern understanding`);
  effects.push(`Led to further developments`);

  return effects.slice(0, 4);
}

/**
 * Generate incorrect statements (unrelated causes/effects)
 */
function generateIncorrectStatements(_event: TimelineEvent): string[] {
  const incorrect: string[] = [];

  // Generate plausible but incorrect statements
  incorrect.push(`Caused by alien intervention`);
  incorrect.push(`Led to the moon landing`);
  incorrect.push(`Result of dinosaur extinction`);
  incorrect.push(`Predicted by ancient prophecies`);
  incorrect.push(`Caused the invention of smartphones`);

  return incorrect.slice(0, 3);
}
