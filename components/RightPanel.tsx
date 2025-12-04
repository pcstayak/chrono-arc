/**
 * Right Panel Component
 * Epic 3: Story 3.3 (BA-US-right-panel-content)
 * Displays educational content based on selected trigger
 * Shows Story/Context, Mini-game, or Related Items
 * Responsive: 60-65% width on desktop, full width on mobile
 */

"use client";

import type { TimelineEvent } from "@/lib/sampleEvents";
import type { TriggerType } from "@/types";

interface RightPanelProps {
  event: TimelineEvent | null;
  activeTrigger: TriggerType | null;
  onRelatedEventClick?: (eventId: string) => void;
}

export default function RightPanel({
  event,
  activeTrigger,
  onRelatedEventClick,
}: RightPanelProps) {
  // No event selected or no trigger active - show empty state
  if (!event || !activeTrigger) {
    return (
      <main className="w-full lg:w-[62%] lg:min-w-[400px] bg-gray-50 dark:bg-gray-900 p-4 md:p-6 overflow-y-auto">
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
                {event ? "Choose an Activity" : "Select an Event"}
              </h2>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                {event
                  ? "Click a button on the card to explore stories, games, or related events!"
                  : "Select an event from the timeline, then choose an activity to learn more."}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const triggers = event.content.triggers;

  // No trigger content available
  if (!triggers) {
    return (
      <main className="w-full lg:w-[62%] lg:min-w-[400px] bg-gray-50 dark:bg-gray-900 p-4 md:p-6 overflow-y-auto">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No content available for this event yet.
          </p>
        </div>
      </main>
    );
  }

  // Render content based on active trigger
  const renderContent = () => {
    switch (activeTrigger) {
      case "story":
        return renderStoryContent();
      case "game":
        return renderGameContent();
      case "related":
        return renderRelatedContent();
      default:
        return null;
    }
  };

  const renderStoryContent = () => {
    const storyData = triggers?.story;

    if (!storyData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Story content not available for this event.
          </p>
        </div>
      );
    }

    return (
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Story: {event.title}
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
          </p>
        </header>

        {/* Images */}
        {storyData.images && storyData.images.length > 0 && (
          <div className="mb-6 md:mb-8">
            {storyData.images.map((imageUrl, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 mb-4"
              >
                {/* Placeholder for images - using a colored box since images don't exist yet */}
                <div className="w-full aspect-video flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 py-2">
                  Image: {imageUrl}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Story content - split by paragraphs */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {storyData.content.split("\n\n").map((paragraph, index) => (
            <p
              key={index}
              className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    );
  };

  const renderGameContent = () => {
    const gameData = triggers?.game;

    if (!gameData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Game content not available for this event.
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Game: {event.title}
          </h1>
        </header>

        {/* Game placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12 text-center">
          <div className="mb-6">
            <svg
              className="w-24 h-24 md:w-32 md:h-32 mx-auto text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {gameData.placeholder}
          </h2>

          {gameData.previewDescription && (
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6">
              {gameData.previewDescription}
            </p>
          )}

          {/* Sample interactive element */}
          <div className="mt-8">
            <button
              type="button"
              disabled
              className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 rounded-lg font-semibold cursor-not-allowed"
            >
              Play Game (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRelatedContent = () => {
    const relatedData = triggers?.related;

    if (!relatedData || !relatedData.items || relatedData.items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No related events found for this item.
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Related to: {event.title}
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            Explore connections between historical events
          </p>
        </header>

        {/* Related items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {relatedData.items.map((item) => (
            <article
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => onRelatedEventClick?.(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onRelatedEventClick?.(item.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${item.name}`}
            >
              {/* Thumbnail */}
              <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {item.thumbnail ? (
                  <div className="text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {item.name}
                </h3>

                {item.year !== undefined && (
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {item.year < 0 ? `${Math.abs(item.year)} BCE` : `${item.year} CE`}
                  </p>
                )}

                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-3">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="w-full lg:w-[62%] lg:min-w-[400px] bg-gray-50 dark:bg-gray-900 p-4 md:p-6 overflow-y-auto">
      {renderContent()}
    </main>
  );
}
