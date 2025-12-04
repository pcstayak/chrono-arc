/**
 * Card Panel Component (Left Column)
 * Story 1.2 (BA-US-content-area-columns) - Card Panel portion
 * Epic 2: Updated to display event cards from timeline selection
 * Displays historical event cards (preview or selected)
 * Responsive: 35-40% width on desktop, full width on mobile
 */

"use client";

import type { TimelineEvent } from "@/lib/sampleEvents";

interface CardPanelProps {
  event: TimelineEvent | null;
  isPreview?: boolean;
}

export default function CardPanel({ event, isPreview = false }: CardPanelProps) {
  if (!event) {
    return (
      <aside className="w-full lg:w-[38%] lg:min-w-[300px] bg-gray-100 dark:bg-gray-800 p-4 md:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-gray-700">
        {/* Empty state - no event selected */}
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] lg:min-h-[400px] text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 md:w-20 md:h-20 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select an Event
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xs">
            Click on a dot in the timeline below to learn about a historical event or invention!
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-[38%] lg:min-w-[300px] bg-gray-100 dark:bg-gray-800 p-4 md:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-gray-700">
      {/* Event card */}
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
          isPreview ? "opacity-70 border-2 border-blue-300" : "border-2 border-blue-500"
        }`}
      >
        {/* Preview indicator */}
        {isPreview && (
          <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-200 text-center">
            Preview - Click to select
          </div>
        )}

        {/* Event header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 md:px-6 py-4 md:py-5 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{event.title}</h2>
          <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
            <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
              {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full capitalize">
              {event.era}
            </span>
          </div>
        </div>

        {/* Event description */}
        <div className="p-4 md:p-6">
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Story section */}
          {event.content.story && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                The Story
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                {event.content.story}
              </p>
            </div>
          )}

          {/* Fun facts */}
          {event.content.funFacts && event.content.funFacts.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Fun Facts
              </h3>
              <ul className="space-y-2">
                {event.content.funFacts.map((fact, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm md:text-base text-gray-600 dark:text-gray-400"
                  >
                    <span className="text-blue-500 mr-2 mt-1 flex-shrink-0">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs md:text-sm rounded-full capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
