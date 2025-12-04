/**
 * Game Page - Epic 1: MVP Core Layout
 * Epic 2: Updated with Timeline Arc Navigation
 * Stories: 1.1 (Header), 1.2 (Content Area), 1.3 (Footer), 2.1-2.4 (Timeline Arc)
 * Main game interface with three-section fixed layout and interactive timeline
 */

"use client";

import { use, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardPanel from "@/components/CardPanel";
import InteractivePanel from "@/components/InteractivePanel";
import { sampleEvents, getSampleEventById } from "@/lib/sampleEvents";

interface GamePageProps {
  params: Promise<{ sessionId: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sessionId } = use(params);

  // Epic 2: State management for timeline arc navigation
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

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
   */
  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
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
        {/* Epic 2: Now displays selected/hovered event from timeline */}
        <CardPanel event={displayEvent || null} isPreview={isPreview} />

        {/* Right Column - Interactive Panel (60-65% on desktop, full width on mobile) */}
        <InteractivePanel />
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
