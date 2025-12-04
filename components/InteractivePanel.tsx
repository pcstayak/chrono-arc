/**
 * Interactive Panel Component (Right Column)
 * Story 1.2 (BA-US-content-area-columns) - Interactive Panel portion
 * Displays placeholder for dynamic content based on trigger selections
 * Responsive: 60-65% width on desktop, full width on mobile
 */

"use client";

export default function InteractivePanel() {
  return (
    <main className="w-full lg:w-[62%] lg:min-w-[400px] bg-gray-50 dark:bg-gray-900 p-4 md:p-6 overflow-y-auto">
      {/* Placeholder content for Epic 1 */}
      <div className="h-full flex items-center justify-center min-h-[200px] lg:min-h-[400px]">
        <div className="text-center space-y-4 max-w-md px-4">
          <svg
            className="w-20 h-20 md:w-24 md:h-24 mx-auto text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Interactive Panel
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              This panel will show stories, mini-games, and related content when you choose an activity from a card.
            </p>
            <div className="mt-4 text-xs text-gray-400">
              (Content from Epic 3)
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
