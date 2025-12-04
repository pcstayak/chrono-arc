/**
 * Game Page
 * Main game interface with the three-part layout
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
  // For now, this is a placeholder layout

  return (
    <div className="h-screen flex flex-col">
      {/* Header - 10-12% of viewport */}
      <Header
        roomCode="ABC123"
        playerCount={2}
        mode="browsing"
      />

      {/* Content Area - Remaining space */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Card Panel (35-40%) */}
        <CardPanel />

        {/* Right Column - Interactive Panel (60-65%) */}
        <InteractivePanel />
      </div>

      {/* Footer - 15-20% of viewport */}
      <Footer />
    </div>
  );
}
