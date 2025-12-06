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
import type { TimelineEvent } from "@/lib/sampleEvents";
import { allHierarchicalEvents } from "@/lib/hierarchicalEvents";
import { convertAllEvents } from "@/lib/eventAdapter";
import type { TriggerType } from "@/types";
import {
  calculateSegments,
  drillDownSegment,
  getInitialViewState,
  navigateToNextSegment,
  navigateToPrevSegment,
  type DynamicSegment,
  type ViewState,
} from "@/lib/eventSegmentation";

// Convert hierarchical events to timeline events
const allEvents = convertAllEvents(allHierarchicalEvents);

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

  // Epic 5: State management for event-driven segmentation
  const [viewHistory, setViewHistory] = useState<ViewState[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>(() =>
    getInitialViewState(allEvents)
  );

  /**
   * Epic 5: Calculate dynamic segments based on visible events
   * Segments are created between visible events and contain hidden events
   */
  const currentSegments = useMemo((): DynamicSegment[] => {
    return calculateSegments(allEvents, currentView.visibleEventIds);
  }, [currentView.visibleEventIds]);

  /**
   * Epic 5: Get visible events to display on the arc
   */
  const displayEvents = useMemo((): TimelineEvent[] => {
    return allEvents.filter((event) =>
      currentView.visibleEventIds.has(event.id)
    );
  }, [currentView.visibleEventIds]);

  /**
   * Epic 5: Check if we can navigate back
   */
  const canNavigateBack = viewHistory.length > 0;

  /**
   * Calculate parent context information for display
   * Shows where the current view sits within the overall timeline
   */
  const parentContext = useMemo(() => {
    if (viewHistory.length === 0) {
      // At top level - no parent
      return null;
    }

    const currentEvent = displayEvents[0];

    if (!currentEvent || !currentEvent.parentEventId) {
      return null;
    }

    // Find the parent event (the segment start)
    const parentEvent = allEvents.find(e => e.id === currentEvent.parentEventId);
    if (!parentEvent) return null;

    // Find all siblings of the parent event (to determine segment end)
    const parentSiblings = allEvents
      .filter(e => e.parentEventId === parentEvent.parentEventId && e.hierarchyLevel === parentEvent.hierarchyLevel)
      .sort((a, b) => a.year - b.year);

    // Find next sibling after parent (this is the segment end boundary)
    const parentIndex = parentSiblings.findIndex(e => e.id === parentEvent.id);
    const nextParentSibling = parentIndex < parentSiblings.length - 1 ? parentSiblings[parentIndex + 1] : null;

    // Segment boundaries: from parent event to next parent sibling
    const parentStartYear = parentEvent.year;
    const parentEndYear = nextParentSibling ? nextParentSibling.year : parentEvent.year + 1000;

    // Find all siblings (children of the same parent)
    const siblings = allEvents
      .filter(e => e.parentEventId === currentEvent.parentEventId)
      .sort((a, b) => a.year - b.year);

    // Find current position among siblings
    const currentIndex = siblings.findIndex(e => e.id === currentEvent.id);

    return {
      parentEvent,
      parentStartYear,
      parentEndYear,
      currentSegmentIndex: currentIndex + 1,
      totalSegments: siblings.length,
      hierarchyLevel: currentEvent.hierarchyLevel,
    };
  }, [viewHistory, displayEvents, allEvents]);

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
   * Zooms the arc to show the segment's date range and reveals hidden events
   */
  const handleSegmentClick = useCallback(
    (segmentId: string) => {
      // Find the segment
      const segment = currentSegments.find((s) => s.id === segmentId);
      if (!segment || !segment.isClickable) return;

      // Clear selected event when drilling down
      setSelectedEventId(null);
      setActiveTrigger(null);

      // Save current view to history
      setViewHistory((prev) => [...prev, currentView]);

      // Drill down into segment - shows only child events
      const newView = drillDownSegment(segment);
      setCurrentView(newView);
    },
    [currentSegments, currentView]
  );

  /**
   * Epic 5 Story 5.1: Handle back button click (navigate up)
   * Restores previous view from history
   */
  const handleBackClick = useCallback(() => {
    if (viewHistory.length === 0) return;

    // Pop last view from history
    const newHistory = [...viewHistory];
    const previousView = newHistory.pop()!;
    setViewHistory(newHistory);
    setCurrentView(previousView);

    // Clear selection when navigating back
    setSelectedEventId(null);
    setActiveTrigger(null);
  }, [viewHistory]);

  /**
   * Handle next segment navigation
   * Navigate to next sibling segment at same hierarchy level
   */
  const handleNextSegment = useCallback(() => {
    const nextView = navigateToNextSegment(allEvents, currentView);
    if (nextView) {
      setCurrentView(nextView);
      setSelectedEventId(null);
      setActiveTrigger(null);
    }
  }, [currentView]);

  /**
   * Handle previous segment navigation
   * Navigate to previous sibling segment at same hierarchy level
   */
  const handlePrevSegment = useCallback(() => {
    const prevView = navigateToPrevSegment(allEvents, currentView);
    if (prevView) {
      setCurrentView(prevView);
      setSelectedEventId(null);
      setActiveTrigger(null);
    }
  }, [currentView]);

  /**
   * Check if we can navigate to next/prev segments
   */
  const canNavigateNext = useMemo(
    () => navigateToNextSegment(allEvents, currentView) !== null,
    [currentView]
  );

  const canNavigatePrev = useMemo(
    () => navigateToPrevSegment(allEvents, currentView) !== null,
    [currentView]
  );

  // Determine which event to display in CardPanel
  // Selected event takes priority over hovered event
  const displayEventId = selectedEventId || hoveredEventId;
  const displayEvent = displayEventId
    ? allEvents.find(e => e.id === displayEventId) || null
    : null;
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
      {/* Epic 5: Enhanced with event-driven segmentation and navigation */}
      <Footer
        events={displayEvents}
        segments={currentSegments}
        viewState={currentView}
        parentContext={parentContext}
        canNavigateBack={canNavigateBack}
        canNavigatePrev={canNavigatePrev}
        canNavigateNext={canNavigateNext}
        selectedEventId={selectedEventId}
        onEventHover={handleEventHover}
        onEventSelect={handleEventSelect}
        onSegmentClick={handleSegmentClick}
        onBackClick={handleBackClick}
        onPrevSegment={handlePrevSegment}
        onNextSegment={handleNextSegment}
      />
    </div>
  );
}
