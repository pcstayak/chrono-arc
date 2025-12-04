/**
 * Card Panel Component (Left Column)
 * Story 1.2 (BA-US-content-area-columns) - Card Panel portion
 * Displays placeholder for historical event card
 * Responsive: 35-40% width on desktop, full width on mobile
 */

"use client";

export default function CardPanel() {
  return (
    <aside className="w-full lg:w-[38%] lg:min-w-[300px] bg-gray-100 dark:bg-gray-800 p-4 md:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-gray-700">
      {/* Placeholder content for Epic 1 */}
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
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        </div>
        <h2 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Card Panel
        </h2>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xs">
          This panel will display historical event cards when you select a dot on the timeline below.
        </p>
        <div className="mt-4 text-xs text-gray-400">
          (Content from Epic 3)
        </div>
      </div>
    </aside>
  );
}
