/**
 * Game Page - Epic 1: MVP Core Layout
 * Epic 2: Updated with Timeline Arc Navigation
 * Epic 3: Card Trigger System (Stories 3.1-3.3)
 * Stories: 1.1 (Header), 1.2 (Content Area), 1.3 (Footer), 2.1-2.4 (Timeline Arc), 3.1-3.3 (Triggers)
 * Main game interface with three-section fixed layout, interactive timeline, and trigger content
 */

"use client";

import { use, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardPanel from "@/components/CardPanel";
import RightPanel from "@/components/RightPanel";
import { sampleEvents, getSampleEventById } from "@/lib/sampleEvents";
import type { TriggerType } from "@/types";

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

  // TODO: Load session data, events, players from DAL using sessionId
  // For MVP, using sample events from lib/sampleEvents.ts

  /**
   * Handle event hover from timeline
   * Story 2.3: Show preview in CardPanel on hover (desktop only)
   */
  const handleEventHover = (eventId: string | null) => {
    setHoveredEventId(eventId);
  };

  /**
   * Handle event selection from timeline
   * Story 2.4: Lock event card in CardPanel on click/tap
   * Epic 3: Clear active trigger when selecting a new event
   */
  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setActiveTrigger(null); // Clear trigger when selecting a new event
  };

  /**
   * Handle trigger button click
   * Story 3.2: Toggle trigger buttons and update right panel
   */
  const handleTriggerClick = (trigger: TriggerType) => {
    // Toggle: if clicking the same trigger, deactivate it
    setActiveTrigger((current) => (current === trigger ? null : trigger));
  };

  /**
   * Handle related event click from RightPanel
   * Story 3.3: Navigate to related event
   */
  const handleRelatedEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setActiveTrigger(null); // Clear trigger when navigating to related event
  };

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
      {/* Epic 2: Now contains TimelineArc component */}
      <Footer
        events={sampleEvents}
        selectedEventId={selectedEventId}
        onEventHover={handleEventHover}
        onEventSelect={handleEventSelect}
      />
    </div>
  );
}
