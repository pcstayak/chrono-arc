/**
 * Card Panel Component (Left Column)
 * Displays the currently selected or hovered event card
 */

import type { Event } from "@/types";
import Image from "next/image";

interface CardPanelProps {
  event?: Event;
  isPreview?: boolean;
}

export default function CardPanel({ event, isPreview = false }: CardPanelProps) {
  if (!event) {
    return (
      <aside className="w-[35%] bg-gray-100 dark:bg-gray-800 p-6 flex items-center justify-center">
        <p className="text-gray-400 text-center">
          Hover or click an event on the timeline to see details
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-[35%] bg-white dark:bg-gray-800 p-6 flex flex-col shadow-lg">
      {/* Preview indicator */}
      {isPreview && (
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
          Preview
        </div>
      )}

      {/* Event Image */}
      {event.imageUrl && (
        <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Event Title */}
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {event.title}
      </h2>

      {/* Year and Era */}
      <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 bg-arc-primary/10 text-arc-primary rounded-full text-sm font-medium">
          {event.year}
        </span>
        <span className="px-3 py-1 bg-arc-secondary/10 text-arc-secondary rounded-full text-sm font-medium capitalize">
          {event.era}
        </span>
      </div>

      {/* Description */}
      <p className="text-foreground/80 mb-4 flex-1">
        {event.description}
      </p>

      {/* Tags */}
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Trigger Buttons */}
      {!isPreview && (
        <div className="space-y-2">
          <button className="w-full py-2 bg-arc-primary text-white rounded-lg hover:bg-arc-primary/90 transition-colors">
            Story / Context
          </button>
          <button className="w-full py-2 bg-arc-secondary text-white rounded-lg hover:bg-arc-secondary/90 transition-colors">
            Mini-game
          </button>
          <button className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Related Items
          </button>
        </div>
      )}
    </aside>
  );
}
