/**
 * Footer Component
 * Story 1.3 (BA-US-footer-timeline-container)
 * Contains the Chrono Arc timeline visualization container
 * Fixed at bottom, 15-20% viewport height, always visible
 */

"use client";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[18vh] min-h-[100px] max-h-[200px] bg-gray-900 text-white px-4 md:px-6 py-3 md:py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
      <div className="h-full flex flex-col">
        {/* Timeline Arc Container */}
        <div className="flex-1 relative bg-gray-800 rounded-lg overflow-hidden">
          {/* Placeholder content - will be replaced in Epic 2 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-xs md:text-sm mb-2 px-2 text-center">
              Timeline Arc (To be implemented in Epic 2)
            </p>

            {/* Visual placeholder showing arc concept */}
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 150"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Timeline arc placeholder"
            >
              {/* Arc curve placeholder */}
              <path
                d="M 50 120 Q 250 20, 500 40 T 950 120"
                stroke="rgba(37, 99, 235, 0.5)"
                strokeWidth="3"
                fill="none"
              />
              {/* Event dots placeholder */}
              <circle cx="100" cy="110" r="5" fill="rgba(37, 99, 235, 0.7)" />
              <circle cx="300" cy="45" r="5" fill="rgba(37, 99, 235, 0.7)" />
              <circle cx="500" cy="40" r="5" fill="rgba(37, 99, 235, 0.7)" />
              <circle cx="700" cy="55" r="5" fill="rgba(37, 99, 235, 0.7)" />
              <circle cx="900" cy="110" r="5" fill="rgba(37, 99, 235, 0.7)" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
