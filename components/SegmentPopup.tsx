/**
 * Segment Popup Component
 * Epic 5: Story 5.5 - Segment Hover Popup
 * Displays event state counts when hovering over a segment
 */

"use client";

import { useEffect, useState, useRef } from "react";
import type { SegmentStateCount } from "@/types";
import type { TimelineEvent } from "@/lib/sampleEvents";

interface SegmentPopupProps {
  segmentName: string;
  events: TimelineEvent[];
  stateCounts: SegmentStateCount;
  mouseX: number;
  mouseY: number;
  containerWidth: number;
  containerHeight: number;
}

export default function SegmentPopup({
  segmentName,
  events,
  stateCounts,
  mouseX,
  mouseY,
  containerWidth,
  containerHeight,
}: SegmentPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: mouseX, y: mouseY });

  // Position popup intelligently within viewport
  useEffect(() => {
    if (!popupRef.current) return;

    const popupRect = popupRef.current.getBoundingClientRect();
    const popupWidth = popupRect.width;
    const popupHeight = popupRect.height;

    let x = mouseX + 15; // Offset from cursor
    let y = mouseY - popupHeight / 2;

    // Keep within horizontal bounds
    if (x + popupWidth > containerWidth) {
      x = mouseX - popupWidth - 15; // Show on left of cursor
    }
    if (x < 0) x = 10;

    // Keep within vertical bounds
    if (y < 0) y = 10;
    if (y + popupHeight > containerHeight) {
      y = containerHeight - popupHeight - 10;
    }

    setPosition({ x, y });
  }, [mouseX, mouseY, containerWidth, containerHeight]);

  // Format the popup message
  const formatMessage = (): string => {
    const parts: string[] = [];

    // Safe events
    if (stateCounts.safe === 1) {
      const safeEvent = events.find((e) => e.state === "safe");
      if (safeEvent) {
        parts.push(`${safeEvent.title} is safe`);
      }
    } else if (stateCounts.safe > 1) {
      parts.push(`${stateCounts.safe} safe events`);
    }

    // Threatened events
    if (stateCounts.threatened === 1) {
      const threatenedEvent = events.find((e) => e.state === "threatened");
      if (threatenedEvent) {
        parts.push(`${threatenedEvent.title} is threatened`);
      }
    } else if (stateCounts.threatened > 1) {
      parts.push(`${stateCounts.threatened} threatened events`);
    }

    // Attacked events
    if (stateCounts.attacked === 1) {
      const attackedEvent = events.find((e) => e.state === "attacked");
      if (attackedEvent) {
        parts.push(`${attackedEvent.title} is attacked`);
      }
    } else if (stateCounts.attacked > 1) {
      parts.push(`${stateCounts.attacked} attacked events`);
    }

    return parts.join(", ");
  };

  const message = formatMessage();

  return (
    <div
      ref={popupRef}
      className="absolute z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl border border-gray-700 max-w-xs">
        <div className="font-semibold text-sm mb-1">{segmentName}</div>
        <div className="text-xs text-gray-300 leading-relaxed">{message}</div>
        <div className="mt-2 flex gap-2 text-xs">
          {stateCounts.safe > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>{stateCounts.safe}</span>
            </div>
          )}
          {stateCounts.threatened > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>{stateCounts.threatened}</span>
            </div>
          )}
          {stateCounts.attacked > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>{stateCounts.attacked}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
