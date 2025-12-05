/**
 * Card Panel Component (Left Column)
 * Story 1.2 (BA-US-content-area-columns) - Card Panel portion
 * Epic 2: Updated to display event cards from timeline selection
 * Epic 3: Enhanced with trigger buttons (Stories 3.1, 3.2)
 * Epic 6: Story 6.2 - UI Lockdown during attack
 * Displays historical event cards (preview or selected)
 * Shows trigger buttons on right edge for Story, Game, Related content
 * Locks non-game tabs and hides sensitive info when event is attacked
 * Responsive: 35-40% width on desktop, full width on mobile
 */

"use client";

import { useState } from "react";
import type { TimelineEvent } from "@/lib/sampleEvents";
import type { TriggerType } from "@/types";

interface CardPanelProps {
  event: TimelineEvent | null;
  isPreview?: boolean;
  activeTrigger?: TriggerType | null;
  onTriggerClick?: (trigger: TriggerType) => void;
}

export default function CardPanel({
  event,
  isPreview = false,
  activeTrigger = null,
  onTriggerClick,
}: CardPanelProps) {
  // Epic 6 Story 6.2: Track lockdown message display
  const [showLockdownMessage, setShowLockdownMessage] = useState(false);

  // Epic 6 Story 6.2: Check if event is under attack
  const isUnderAttack = event?.state === "attacked";

  // Epic 6 Story 6.2: Handle locked trigger click
  const handleLockedTriggerClick = (trigger: TriggerType) => {
    if (isUnderAttack && trigger !== "game") {
      // Show lockdown message
      setShowLockdownMessage(true);
      setTimeout(() => setShowLockdownMessage(false), 3000);
      return;
    }

    // Normal trigger click
    if (onTriggerClick) {
      onTriggerClick(trigger);
    }
  };

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

  // Determine which triggers are available
  const hasStory = event?.content.triggers?.story !== undefined;
  const hasGame = event?.content.triggers?.game !== undefined;
  const hasRelated =
    event?.content.triggers?.related !== undefined &&
    event?.content.triggers?.related.items.length > 0;

  const triggerButtons: Array<{
    type: TriggerType;
    label: string;
    available: boolean;
    colors: {
      active: string;
      inactive: string;
      hover: string;
    };
  }> = [
    {
      type: "story",
      label: "Story",
      available: hasStory,
      colors: {
        active: "bg-purple-600 text-white",
        inactive: "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600",
        hover: "hover:bg-purple-50 dark:hover:bg-purple-950",
      },
    },
    {
      type: "game",
      label: "Game",
      available: hasGame,
      colors: {
        active: "bg-green-600 text-white",
        inactive: "bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-2 border-green-600",
        hover: "hover:bg-green-50 dark:hover:bg-green-950",
      },
    },
    {
      type: "related",
      label: "Related",
      available: hasRelated,
      colors: {
        active: "bg-orange-600 text-white",
        inactive: "bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 border-2 border-orange-600",
        hover: "hover:bg-orange-50 dark:hover:bg-orange-950",
      },
    },
  ];

  return (
    <aside className="w-full lg:w-[38%] lg:min-w-[300px] bg-gray-100 dark:bg-gray-800 p-4 md:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-gray-700">
      {/* Event card */}
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-all duration-200 relative ${
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
        <div className="p-4 md:p-6 relative">
          {/* Epic 3: Trigger buttons - positioned on right edge of body */}
          {!isPreview && onTriggerClick && (
            <div className="absolute top-2 right-2 md:right-3 flex flex-col gap-2 z-10">
              {triggerButtons.map(
                (trigger) =>
                  trigger.available && (
                    <button
                      key={trigger.type}
                      onClick={() => handleLockedTriggerClick(trigger.type)}
                      disabled={isUnderAttack && trigger.type !== "game"}
                      className={`
                        min-h-[44px] min-w-[40px] px-3 py-2 rounded-lg font-semibold text-sm
                        transition-all duration-200 shadow-md hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${
                          isUnderAttack && trigger.type !== "game"
                            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50"
                            : activeTrigger === trigger.type
                              ? `${trigger.colors.active} scale-105 focus:ring-${trigger.type === "story" ? "purple" : trigger.type === "game" ? "green" : "orange"}-500`
                              : `${trigger.colors.inactive} ${trigger.colors.hover}`
                        }
                      `}
                      aria-label={`View ${trigger.label} content`}
                      aria-pressed={activeTrigger === trigger.type}
                      title={
                        isUnderAttack && trigger.type !== "game"
                          ? "Complete the defense first"
                          : undefined
                      }
                    >
                      {trigger.label}
                      {isUnderAttack && trigger.type !== "game" && (
                        <svg
                          className="inline-block w-3 h-3 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  )
              )}
            </div>
          )}

          {/* Epic 6 Story 6.2: Hide sensitive content during attack */}
          {isUnderAttack ? (
            <div className="pr-14 md:pr-16">
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="font-bold text-red-800 dark:text-red-200 mb-1">
                      Under Attack!
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      This event is under attack by time bandits. Event details are hidden to
                      ensure a fair defense. Click the Game button to defend this event!
                    </p>
                  </div>
                </div>
              </div>

              {/* Show lockdown message when trying to access locked tabs */}
              {showLockdownMessage && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-3 mb-4 animate-pulse">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 text-center">
                    Complete the defense first to access other content!
                  </p>
                </div>
              )}

              {/* Redacted content placeholder */}
              <div className="space-y-3 opacity-30">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-4 pr-14 md:pr-16">
                {event.description}
              </p>

              {/* Story section */}
              {event.content.story && (
                <div className="mb-4 pr-14 md:pr-16">
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
                <div className="mb-4 pr-14 md:pr-16">
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
            </>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pr-14 md:pr-16">
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
