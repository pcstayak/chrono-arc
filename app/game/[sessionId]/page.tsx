/**
 * Game Page - Epic 1: MVP Core Layout
 * Epic 2: Updated with Timeline Arc Navigation
 * Epic 3: Card Trigger System (Stories 3.1-3.3)
 * Epic 5: Hierarchical Timeline Navigation (Stories 5.1-5.5)
 * Stories: 1.1 (Header), 1.2 (Content Area), 1.3 (Footer), 2.1-2.4 (Timeline Arc),
 *          3.1-3.3 (Triggers), 5.1-5.5 (Timeline Improvements)
 * Main game interface with three-section fixed layout, interactive timeline, and hierarchical navigation
 */

"use client";

import { use, useState, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardPanel from "@/components/CardPanel";
import RightPanel from "@/components/RightPanel";
import {
  sampleEvents,
  getSampleEventById,
  getTopLevelSegments,
  getChildSegments,
  getSegmentById,
  getEventsForSegment,
  getParentSegment,
  type TimelineEvent,
} from "@/lib/sampleEvents";
import type { TriggerType, TimelineSegment } from "@/types";

interface GamePageProps {
  params: Promise<{ sessionId: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sessionId } = use(params);

  // Epic 2: State management for timeline arc navigation
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Epic 3: State management for trigger system
  const [activeTrigger, setActiveTrigger] = useState<TriggerType | null>(null);

  // Epic 5: State management for hierarchical navigation
  const [currentSegmentId, setCurrentSegmentId] = useState<string | null>(null);
  const [segmentPath, setSegmentPath] = useState<string[]>([]); // Drill-down stack

  /**
   * Epic 5: Get current segments to display
   * If no segment is selected, show top-level segments
   * If a segment is selected, show its children or the segment itself (leaf level)
   */
  const currentSegments = useMemo((): TimelineSegment[] => {
    if (currentSegmentId === null) {
      // Top level: show main segments
      return getTopLevelSegments();
    }

    // Check if current segment has children
    const children = getChildSegments(currentSegmentId);
    if (children.length > 0) {
      // Show child segments
      return children;
    }

    // Leaf level: show current segment
    const currentSegment = getSegmentById(currentSegmentId);
    return currentSegment ? [currentSegment] : [];
  }, [currentSegmentId]);

  /**
   * Epic 5: Get events to display
   * At top level or when viewing segments: show only key events
   * At leaf level: show all events in the segment
   */
  const displayEvents = useMemo((): TimelineEvent[] => {
    if (currentSegmentId === null) {
      // Top level: show only key events
      return sampleEvents.filter((event) => event.isKeyEvent);
    }

    const currentSegment = getSegmentById(currentSegmentId);
    if (!currentSegment) return [];

    // Check if we're at a leaf level (no children)
    const children = getChildSegments(currentSegmentId);
    if (children.length === 0) {
      // Leaf level: show all events in this segment
      return getEventsForSegment(currentSegmentId);
    }

    // Mid-level: show key events from all child segments
    const allChildEvents = children.flatMap((child) =>
      getEventsForSegment(child.id)
    );
    return allChildEvents.filter((event) => event.isKeyEvent);
  }, [currentSegmentId]);

  /**
   * Epic 5: Get parent segment name for back button
   */
  const parentSegmentName = useMemo((): string | null => {
    if (currentSegmentId === null) return null;

    const parentSegment = getParentSegment(currentSegmentId);
    return parentSegment ? parentSegment.name : "Top Level";
  }, [currentSegmentId]);

  /**
   * Handle event hover from timeline
   * Story 2.3: Show preview in CardPanel on hover (desktop only)
   */
  const handleEventHover = useCallback((eventId: string | null) => {
    setHoveredEventId(eventId);
  }, []);

  /**
   * Handle event selection from timeline
   * Story 2.4: Lock event card in CardPanel on click/tap
   * Epic 3: Clear active trigger when selecting a new event
   */
  const handleEventSelect = useCallback((eventId: string) => {
    setSelectedEventId(eventId);
    setActiveTrigger(null); // Clear trigger when selecting a new event
  }, []);

  /**
   * Handle trigger button click
   * Story 3.2: Toggle trigger buttons and update right panel
   */
  const handleTriggerClick = useCallback((trigger: TriggerType) => {
    // Toggle: if clicking the same trigger, deactivate it
    setActiveTrigger((current) => (current === trigger ? null : trigger));
  }, []);

  /**
   * Handle related event click from RightPanel
   * Story 3.3: Navigate to related event
   */
  const handleRelatedEventClick = useCallback((eventId: string) => {
    setSelectedEventId(eventId);
    setActiveTrigger(null); // Clear trigger when navigating to related event
  }, []);

  /**
   * Epic 5 Story 5.1: Handle segment click (drill-down)
   */
  const handleSegmentClick = useCallback(
    (segmentId: string) => {
      // Clear selected event when drilling down
      setSelectedEventId(null);
      setActiveTrigger(null);

      // Update drill-down path
      if (currentSegmentId !== null) {
        setSegmentPath((prev) => [...prev, currentSegmentId]);
      }

      // Set new current segment
      setCurrentSegmentId(segmentId);
    },
    [currentSegmentId]
  );

  /**
   * Epic 5 Story 5.1: Handle back button click (navigate up)
   */
  const handleBackClick = useCallback(() => {
    if (segmentPath.length > 0) {
      // Pop from stack
      const newPath = [...segmentPath];
      const parentId = newPath.pop();
      setSegmentPath(newPath);
      setCurrentSegmentId(parentId || null);
    } else {
      // Return to top level
      setCurrentSegmentId(null);
    }

    // Clear selection when navigating back
    setSelectedEventId(null);
    setActiveTrigger(null);
  }, [segmentPath]);

  // Determine which event to display in CardPanel
  // Selected event takes priority over hovered event
  const displayEventId = selectedEventId || hoveredEventId;
  const displayEvent = displayEventId ? getSampleEventById(displayEventId) : null;
  const isPreview = hoveredEventId !== null && selectedEventId === null;

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      {/* Header - Story 1.1 - Fixed at top, 10vh height */}
      <Header />

      {/* Content Area - Story 1.2 - Two columns on desktop, stacked on mobile */}
      {/* Account for fixed header (10vh) and footer (18vh) - leaves ~72vh for content */}
      <div className="fixed top-[10vh] left-0 right-0 bottom-[18vh] flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column - Card Panel (35-40% on desktop, full width on mobile) */}
        {/* Epic 2: Displays selected/hovered event from timeline */}
        {/* Epic 3: Shows trigger buttons when event is selected (not preview) */}
        <CardPanel
          event={displayEvent || null}
          isPreview={isPreview}
          activeTrigger={activeTrigger}
          onTriggerClick={handleTriggerClick}
        />

        {/* Right Column - Right Panel (60-65% on desktop, full width on mobile) */}
        {/* Epic 3: Displays trigger content (story/game/related) */}
        <RightPanel
          event={displayEvent || null}
          activeTrigger={activeTrigger}
          onRelatedEventClick={handleRelatedEventClick}
        />
      </div>

      {/* Footer - Story 1.3 - Fixed at bottom, 18vh height */}
      {/* Epic 2: Contains TimelineArc component */}
      {/* Epic 5: Enhanced with hierarchical navigation and back button */}
      <Footer
        events={displayEvents}
        segments={currentSegments}
        currentSegmentId={currentSegmentId}
        parentSegmentName={parentSegmentName}
        selectedEventId={selectedEventId}
        onEventHover={handleEventHover}
        onEventSelect={handleEventSelect}
        onSegmentClick={handleSegmentClick}
        onBackClick={handleBackClick}
      />
    </div>
  );
}
