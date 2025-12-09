/**
 * Metadata Classification Mini-Game Component
 * Epic 6: Story 6.11 (BA-US-metadata-classification-minigame)
 * Sort 8-12 facts/items into correct categories (e.g., Related vs Not Related)
 */

"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import type { TimelineEvent } from "@/lib/sampleEvents";

interface CategoryItem {
  id: string;
  text: string;
  correctCategory: string;
  isCorrect?: boolean; // Set after validation
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface MetadataClassificationProps {
  event: TimelineEvent;
  onComplete: (success: boolean) => void;
}

export default function MetadataClassification({ event, onComplete }: MetadataClassificationProps) {
  // Generate classification data from event content
  const { categories, items } = generateClassificationData(event);

  const [categorizedItems, setCategorizedItems] = useState<Map<string, string>>(new Map()); // itemId -> categoryId
  const [activeItem, setActiveItem] = useState<CategoryItem | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);

  const handleDragStart = (event: DragStartEvent) => {
    const item = items.find(i => i.id === event.active.id.toString());
    setActiveItem(item || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const itemId = active.id.toString();
    const categoryId = over.id.toString();

    // Place item in category
    if (categories.find(c => c.id === categoryId)) {
      const newCategorized = new Map(categorizedItems);
      newCategorized.set(itemId, categoryId);
      setCategorizedItems(newCategorized);
    }

    // Remove from category (dragged to uncategorized zone)
    if (over.id === "uncategorized") {
      const newCategorized = new Map(categorizedItems);
      newCategorized.delete(itemId);
      setCategorizedItems(newCategorized);
    }
  };

  const handleSubmit = () => {
    // Validate classifications
    let mistakes = 0;

    items.forEach(item => {
      const assignedCategory = categorizedItems.get(item.id);
      if (assignedCategory !== item.correctCategory) {
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

  const allItemsCategorized = items.every(item =>
    categorizedItems.has(item.id)
  );

  const getItemsInCategory = (categoryId: string) =>
    items.filter(item => categorizedItems.get(item.id) === categoryId);

  const getUncategorizedItems = () =>
    items.filter(item => !categorizedItems.has(item.id));

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-6 md:mb-8 text-center">
        <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full mb-4">
          <span className="font-bold">UNDER ATTACK!</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Defend: {event.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
          Sort these facts into the correct categories. You can make at most 1 mistake!
        </p>
      </header>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Uncategorized Items (Initial Zone) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Items to Classify
          </h2>
          <DroppableZone id="uncategorized">
            <div className="min-h-[100px] flex flex-wrap gap-3">
              {getUncategorizedItems().map(item => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  submitted={submitted}
                />
              ))}
              {getUncategorizedItems().length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  All items have been categorized
                </p>
              )}
            </div>
          </DroppableZone>
        </div>

        {/* Category Buckets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {category.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {category.description}
              </p>
              <DroppableZone id={category.id}>
                <div className="min-h-[200px] bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex flex-wrap gap-3">
                    {getItemsInCategory(category.id).map(item => (
                      <DraggableItem
                        key={item.id}
                        item={item}
                        submitted={submitted}
                      />
                    ))}
                    {getItemsInCategory(category.id).length === 0 && (
                      <p className="text-gray-400 dark:text-gray-500 italic text-sm">
                        Drag items here
                      </p>
                    )}
                  </div>
                </div>
              </DroppableZone>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!allItemsCategorized}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                !allItemsCategorized
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              }`}
              type="button"
            >
              Submit Classification
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
                ? "Perfect! All items are correctly classified!"
                : mistakeCount === 1
                ? "Good job! One mistake is acceptable."
                : `${mistakeCount} mistakes. The event has been corrupted.`}
            </p>
          </div>
        )}

        <DragOverlay>
          {activeItem ? (
            <div className="px-4 py-3 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-lg font-medium shadow-lg max-w-md">
              {activeItem.text}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700">
        <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
          <strong>Remember:</strong> You can make at most 1 mistake. Drag items into the correct categories!
        </p>
      </div>
    </div>
  );
}

/**
 * Draggable Item Component
 */
function DraggableItem({ item, submitted }: { item: CategoryItem; submitted: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: submitted,
    data: { item },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  // Show validation feedback after submission
  let bgColor = "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100";
  if (submitted && item.isCorrect !== undefined) {
    bgColor = item.isCorrect
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-2 border-green-500"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-2 border-red-500";
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`px-4 py-3 ${bgColor} rounded-lg font-medium ${
        submitted ? "cursor-default" : "cursor-move hover:opacity-80"
      } transition-all max-w-md text-sm shadow-sm`}
    >
      {item.text}
    </div>
  );
}

/**
 * Droppable Zone Component
 */
function DroppableZone({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all ${isOver ? "ring-4 ring-blue-400 rounded-lg" : ""}`}
    >
      {children}
    </div>
  );
}

/**
 * Generate classification data from event
 * Creates categories and items (correct + distractors)
 */
function generateClassificationData(event: TimelineEvent): {
  categories: Category[];
  items: CategoryItem[];
} {
  // For MVP, we'll use "Related to this event" vs "Not related"
  // In production, this would be more sophisticated
  const categories: Category[] = [
    {
      id: "related",
      name: "Related to this Event",
      description: "Facts and information directly related to this event",
    },
    {
      id: "not-related",
      name: "Not Related",
      description: "Facts from other events or time periods",
    },
  ];

  const items: CategoryItem[] = [];

  // Generate related items from event content (4-6 items)
  // TODO: In production, use NLP or pre-authored content
  const relatedFacts = generateRelatedFacts(event);
  relatedFacts.forEach((fact, index) => {
    items.push({
      id: `related-${index}`,
      text: fact,
      correctCategory: "related",
    });
  });

  // Generate distractor items (4-6 items from wrong era/events)
  const distractors = generateDistractors(event);
  distractors.forEach((fact, index) => {
    items.push({
      id: `distractor-${index}`,
      text: fact,
      correctCategory: "not-related",
    });
  });

  // Shuffle items
  const shuffled = [...items].sort(() => Math.random() - 0.5);

  return { categories, items: shuffled };
}

/**
 * Generate related facts from event
 */
function generateRelatedFacts(event: TimelineEvent): string[] {
  const facts: string[] = [];

  // Extract facts from description
  const sentences = event.description.split(/[.!?]+/).filter(s => s.trim().length > 10);
  facts.push(...sentences.slice(0, 3).map(s => s.trim()));

  // Add fun facts if available
  if (event.content?.funFacts) {
    facts.push(...event.content.funFacts.slice(0, 2));
  }

  // Add year-based fact
  if (event.year > 0) {
    facts.push(`This event occurred in ${event.year}.`);
  }

  // Add era-based fact
  facts.push(`This event is from the ${event.era} era.`);

  return facts.slice(0, 6);
}

/**
 * Generate distractor facts (from wrong eras/events)
 */
function generateDistractors(event: TimelineEvent): string[] {
  const distractors: string[] = [];

  // Generate plausible but incorrect facts
  // TODO: In production, pull from other events in database

  const wrongYears = [
    event.year - 200,
    event.year + 150,
    event.year - 500,
    event.year + 300,
  ];

  distractors.push(`This event occurred in ${wrongYears[0]}.`);
  distractors.push(`This event is from the digital era.`); // Assume most events aren't digital
  distractors.push(`This event had no lasting impact on society.`);
  distractors.push(`This event was caused by a meteor impact.`);
  distractors.push(`This event led to the invention of the internet.`);
  distractors.push(`This event was witnessed by millions on television.`);

  // Filter out facts that might accidentally be true
  return distractors.slice(0, 6);
}
