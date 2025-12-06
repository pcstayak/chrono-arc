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
import type { TimelineEvent } from "@/lib/sampleEvents";
import type { DynamicSegment, ViewState } from "@/lib/eventSegmentation";

interface ParentContext {
  parentEvent: TimelineEvent;
  parentStartYear: number;
  parentEndYear: number;
  currentSegmentIndex: number;
  totalSegments: number;
  hierarchyLevel: number;
}

interface FooterProps {
  events: TimelineEvent[];
  segments: DynamicSegment[];
  viewState: ViewState;
  parentContext: ParentContext | null;
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
  parentContext,
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
        {/* Context Info Row - Shows hierarchy and parent info */}
        {parentContext && (
          <div className="flex-shrink-0 flex items-center justify-between text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Level {parentContext.hierarchyLevel}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-300">{parentContext.parentEvent.title}</span>
              <span className="text-gray-600">•</span>
              <span className="text-blue-400">
                Segment {parentContext.currentSegmentIndex} of {parentContext.totalSegments}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Controls Row - Redesigned layout */}
        {(canNavigateBack || canNavigatePrev || canNavigateNext) && (
          <div className="flex-shrink-0 flex items-center justify-between gap-2">
            {/* Left: Previous Segment Button */}
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

            {/* Center: Zoom Out Button */}
            {canNavigateBack && (
              <button
                onClick={onBackClick}
                className="px-4 py-1 rounded text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-all"
                title="Zoom out to parent view"
              >
                ⬆ Zoom Out
              </button>
            )}

            {/* Right: Next Segment Button */}
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

        {/* Timeline Arc Container with Parent Date Context */}
        <div className="flex-1 relative bg-gray-800 rounded-lg overflow-hidden">
          {/* Parent date labels - shown when zoomed in */}
          {parentContext && (
            <>
              <div className="absolute left-2 top-2 text-xs text-amber-400 font-semibold z-10">
                {parentContext.parentStartYear}
              </div>
              <div className="absolute right-2 top-2 text-xs text-cyan-400 font-semibold z-10">
                {parentContext.parentEndYear}
              </div>
            </>
          )}

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
