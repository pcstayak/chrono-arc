/**
 * Game Page - Epic 1: MVP Core Layout
 * Stories: 1.1 (Header), 1.2 (Content Area), 1.3 (Footer)
 * Main game interface with three-section fixed layout
 */

"use client";

import { use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardPanel from "@/components/CardPanel";
import InteractivePanel from "@/components/InteractivePanel";

interface GamePageProps {
  params: Promise<{ sessionId: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sessionId } = use(params);

  // TODO: Load session data, events, players from DAL using sessionId
  // For now, this is a placeholder layout implementing Epic 1

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      {/* Header - Story 1.1 - Fixed at top, 10vh height */}
      <Header />

      {/* Content Area - Story 1.2 - Two columns on desktop, stacked on mobile */}
      {/* Account for fixed header (10vh) and footer (18vh) - leaves ~72vh for content */}
      <div className="fixed top-[10vh] left-0 right-0 bottom-[18vh] flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column - Card Panel (35-40% on desktop, full width on mobile) */}
        <CardPanel />

        {/* Right Column - Interactive Panel (60-65% on desktop, full width on mobile) */}
        <InteractivePanel />
      </div>

      {/* Footer - Story 1.3 - Fixed at bottom, 18vh height */}
      <Footer />
    </div>
  );
}
