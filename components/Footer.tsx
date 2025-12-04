/**
 * Footer Component
 * Story 1.3 (BA-US-footer-timeline-container)
 * Epic 2: Updated with TimelineArc component
 * Epic 5: Enhanced with hierarchical navigation and BackButton
 * Contains the Chrono Arc timeline visualization
 * Fixed at bottom, 15-20% viewport height, always visible
 */

"use client";

import TimelineArc from "./TimelineArc";
import BackButton from "./BackButton";
import type { TimelineEvent } from "@/lib/sampleEvents";
import type { TimelineSegment } from "@/types";

interface FooterProps {
  events: TimelineEvent[];
  segments: TimelineSegment[];
  currentSegmentId: string | null;
  parentSegmentName: string | null;
  selectedEventId: string | null;
  onEventHover: (eventId: string | null) => void;
  onEventSelect: (eventId: string) => void;
  onSegmentClick: (segmentId: string) => void;
  onBackClick: () => void;
}

export default function Footer({
  events,
  segments,
  currentSegmentId,
  parentSegmentName,
  selectedEventId,
  onEventHover,
  onEventSelect,
  onSegmentClick,
  onBackClick,
}: FooterProps) {
  const showBackButton = currentSegmentId !== null && parentSegmentName !== null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[18vh] min-h-[100px] max-h-[200px] bg-gray-900 text-white px-4 md:px-6 py-3 md:py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
      <div className="h-full flex flex-col gap-2">
        {/* Epic 5: Back button for hierarchical navigation */}
        {showBackButton && (
          <div className="flex-shrink-0">
            <BackButton
              parentName={parentSegmentName}
              onClick={onBackClick}
              show={showBackButton}
            />
          </div>
        )}

        {/* Timeline Arc Container */}
        <div className="flex-1 relative bg-gray-800 rounded-lg overflow-hidden">
          <TimelineArc
            events={events}
            segments={segments}
            currentSegmentId={currentSegmentId}
            selectedEventId={selectedEventId}
            onEventHover={onEventHover}
            onEventSelect={onEventSelect}
            onSegmentClick={onSegmentClick}
          />
        </div>
      </div>
    </footer>
  );
}
