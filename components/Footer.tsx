/**
 * Footer Component
 * Story 1.3 (BA-US-footer-timeline-container)
 * Epic 2: Updated with TimelineArc component
 * Contains the Chrono Arc timeline visualization
 * Fixed at bottom, 15-20% viewport height, always visible
 */

"use client";

import TimelineArc from "./TimelineArc";
import type { TimelineEvent } from "@/lib/sampleEvents";

interface FooterProps {
  events: TimelineEvent[];
  selectedEventId: string | null;
  onEventHover: (eventId: string | null) => void;
  onEventSelect: (eventId: string) => void;
}

export default function Footer({
  events,
  selectedEventId,
  onEventHover,
  onEventSelect,
}: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[18vh] min-h-[100px] max-h-[200px] bg-gray-900 text-white px-4 md:px-6 py-3 md:py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
      <div className="h-full flex flex-col">
        {/* Timeline Arc Container */}
        <div className="flex-1 relative bg-gray-800 rounded-lg overflow-hidden">
          <TimelineArc
            events={events}
            selectedEventId={selectedEventId}
            onEventHover={onEventHover}
            onEventSelect={onEventSelect}
          />
        </div>
      </div>
    </footer>
  );
}
