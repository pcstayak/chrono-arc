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
import type { DynamicSegment, ViewState } from "@/lib/eventSegmentation";

interface FooterProps {
  events: TimelineEvent[];
  segments: DynamicSegment[];
  viewState: ViewState;
  canNavigateBack: boolean;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
  selectedEventId: string | null;
  onEventHover: (eventId: string | null) => void;
  onEventSelect: (eventId: string) => void;
  onSegmentClick: (segmentId: string) => void;
  onBackClick: () => void;
  onPrevSegment: () => void;
  onNextSegment: () => void;
}

export default function Footer({
  events,
  segments,
  viewState,
  canNavigateBack,
  canNavigatePrev,
  canNavigateNext,
  selectedEventId,
  onEventHover,
  onEventSelect,
  onSegmentClick,
  onBackClick,
  onPrevSegment,
  onNextSegment,
}: FooterProps) {

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[18vh] min-h-[100px] max-h-[200px] bg-gray-900 text-white px-4 md:px-6 py-3 md:py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
      <div className="h-full flex flex-col gap-2">
        {/* Navigation Controls Row */}
        {(canNavigateBack || canNavigatePrev || canNavigateNext) && (
          <div className="flex-shrink-0 flex items-center justify-between gap-2">
            {/* Back Button */}
            {canNavigateBack && (
              <BackButton
                parentName="Previous View"
                onClick={onBackClick}
                show={canNavigateBack}
              />
            )}

            {/* Prev/Next Segment Navigation */}
            {(canNavigatePrev || canNavigateNext) && (
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={onPrevSegment}
                  disabled={!canNavigatePrev}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    canNavigatePrev
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                  title="Previous segment"
                >
                  ← Prev
                </button>
                <button
                  onClick={onNextSegment}
                  disabled={!canNavigateNext}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    canNavigateNext
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                  title="Next segment"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Timeline Arc Container */}
        <div className="flex-1 relative bg-gray-800 rounded-lg overflow-hidden">
          <TimelineArc
            events={events}
            segments={segments}
            viewState={viewState}
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
