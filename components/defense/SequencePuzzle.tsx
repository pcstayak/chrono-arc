/**
 * Chronological Sequence Puzzle Mini-Game Component
 * Epic 6: Story 6.8 (BA-US-chronological-sequence-puzzle)
 * Arrange 4-6 shuffled cards/steps in correct chronological order
 */

"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TimelineEvent } from "@/lib/sampleEvents";

interface SequenceStep {
  id: string;
  text: string;
  date?: string; // Optional year or date
  position: number; // Correct position (0-indexed)
}

interface SequencePuzzleProps {
  event: TimelineEvent;
  onComplete: (success: boolean) => void;
}

export default function SequencePuzzle({ event, onComplete }: SequencePuzzleProps) {
  // Generate sequence steps from event content
  const { steps: correctSteps } = generateSequenceData(event);

  // Shuffle initial order
  const [steps, setSteps] = useState<SequenceStep[]>(() => {
    const shuffled = [...correctSteps].sort(() => Math.random() - 0.5);
    return shuffled;
  });

  const [activeStep, setActiveStep] = useState<SequenceStep | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const step = steps.find(s => s.id === event.active.id);
    setActiveStep(step || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveStep(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = steps.findIndex(s => s.id === active.id);
    const newIndex = steps.findIndex(s => s.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      setSteps(arrayMove(steps, oldIndex, newIndex));
    }
  };

  const handleSubmit = () => {
    // Validate sequence: every card must be in correct position
    const correct = steps.every((step, index) => {
      const correctStep = correctSteps.find(s => s.id === step.id);
      return correctStep && correctStep.position === index;
    });

    setIsCorrect(correct);
    setSubmitted(true);

    // Delay outcome to show feedback
    setTimeout(() => {
      onComplete(correct);
    }, 2500);
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
          Arrange these events in the order they happened!
        </p>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Sequence Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 mb-6">
          <SortableContext
            items={steps.map(s => s.id)}
            strategy={verticalListSortingStrategy}
            disabled={submitted}
          >
            <div className="space-y-3">
              {steps.map((step, index) => (
                <SortableCard
                  key={step.id}
                  step={step}
                  index={index}
                  submitted={submitted}
                  isCorrect={
                    submitted
                      ? correctSteps.find(s => s.id === step.id)?.position === index
                      : undefined
                  }
                />
              ))}
            </div>
          </SortableContext>
        </div>

        {/* Submit Button */}
        {!submitted && (
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-4 rounded-lg font-bold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              type="button"
            >
              Submit Order
            </button>
          </div>
        )}

        {/* Feedback */}
        {submitted && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              isCorrect
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            <p className="font-semibold text-center">
              {isCorrect
                ? "Perfect! All events are in correct chronological order!"
                : "The order is incorrect. The event has been corrupted."}
            </p>
          </div>
        )}

        <DragOverlay>
          {activeStep ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 border-2 border-blue-500 opacity-90 max-w-3xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  ?
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {activeStep.text}
                  </p>
                  {activeStep.date && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activeStep.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700">
        <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
          <strong>Remember:</strong> All events must be in the correct order to defend successfully!
        </p>
      </div>
    </div>
  );
}

/**
 * Sortable Card Component
 */
function SortableCard({
  step,
  index,
  submitted,
  isCorrect,
}: {
  step: SequenceStep;
  index: number;
  submitted: boolean;
  isCorrect?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: step.id,
    disabled: submitted,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Determine card styling based on state
  let borderColor = "border-gray-300 dark:border-gray-600";
  let bgColor = "bg-white dark:bg-gray-800";

  if (submitted && isCorrect !== undefined) {
    borderColor = isCorrect
      ? "border-green-500"
      : "border-red-500";
    bgColor = isCorrect
      ? "bg-green-50 dark:bg-green-900/20"
      : "bg-red-50 dark:bg-red-900/20";
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${bgColor} rounded-lg shadow-md p-4 border-2 ${borderColor} ${
        submitted ? "cursor-default" : "cursor-move hover:shadow-lg hover:border-blue-400"
      } transition-all`}
    >
      <div className="flex items-start gap-4">
        {/* Position Number */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            submitted
              ? isCorrect
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
              : "bg-blue-600 text-white"
          }`}
        >
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
            {step.text}
          </p>
          {step.date && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              <strong>Date:</strong> {step.date}
            </p>
          )}
        </div>

        {/* Drag Handle Icon (when not submitted) */}
        {!submitted && (
          <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Generate sequence data from event
 * Creates 4-6 sequential steps from event content
 */
function generateSequenceData(event: TimelineEvent): {
  steps: SequenceStep[];
} {
  const steps: SequenceStep[] = [];

  // For MVP, we'll extract phases from the description and fun facts
  // TODO: In production, use pre-authored content or NLP

  // Try to extract phases from description
  const sentences = event.description
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 15)
    .map(s => s.trim());

  // Add fun facts if available
  const allContent = [...sentences];
  if (event.content?.funFacts) {
    allContent.push(...event.content.funFacts);
  }

  // Select 4-6 distinct steps
  const selectedSteps = allContent.slice(0, Math.min(6, Math.max(4, allContent.length)));

  selectedSteps.forEach((text, index) => {
    steps.push({
      id: `step-${index}`,
      text,
      position: index,
      // Add date if we can infer it
      date: index === 0 && event.year > 0 ? `Around ${event.year}` : undefined,
    });
  });

  // If we don't have enough steps, create generic ones
  while (steps.length < 4) {
    steps.push({
      id: `step-${steps.length}`,
      text: `Phase ${steps.length + 1} of ${event.title}`,
      position: steps.length,
    });
  }

  return { steps };
}
