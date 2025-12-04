/**
 * Timeline Arc Component
 * Epic 2: Timeline Arc Navigation
 * Stories 2.1-2.4: Arc curve, event dots, hover preview, click selection
 *
 * Visual timeline arc with interactive dots representing historical events.
 * Primary navigation mechanism for the MVP.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TimelineEvent } from "@/lib/sampleEvents";

interface TimelineArcProps {
  events: TimelineEvent[];
  selectedEventId: string | null;
  onEventHover: (eventId: string | null) => void;
  onEventSelect: (eventId: string) => void;
}

interface Point {
  x: number;
  y: number;
}

export default function TimelineArc({
  events,
  selectedEventId,
  onEventHover,
  onEventSelect,
}: TimelineArcProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 150 });
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect if device supports touch
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  /**
   * Calculate point along the Bezier curve
   * Story 2.1: Smooth upward arc from left to right
   * - Starts low on left (ancient history)
   * - Arcs upward in middle
   * - Ends slightly lower on right (modern day)
   */
  const getBezierPoint = useCallback(
    (t: number): Point => {
      const { width, height } = dimensions;
      const padding = 50;
      const arcHeight = height * 0.6; // 60% of container height

      // Control points for quadratic Bezier curve
      const p0 = { x: padding, y: height - 20 }; // Start: low left
      const p1 = { x: width / 2, y: height - arcHeight }; // Control: high middle
      const p2 = { x: width - padding, y: height - 30 }; // End: slightly low right

      // Quadratic Bezier formula: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
      const x =
        Math.pow(1 - t, 2) * p0.x +
        2 * (1 - t) * t * p1.x +
        Math.pow(t, 2) * p2.x;

      const y =
        Math.pow(1 - t, 2) * p0.y +
        2 * (1 - t) * t * p1.y +
        Math.pow(t, 2) * p2.y;

      return { x, y };
    },
    [dimensions]
  );

  /**
   * Generate SVG path for the arc curve
   * Story 2.1: Render smooth Bezier curve
   */
  const getArcPath = useCallback((): string => {
    const { width, height } = dimensions;
    const padding = 50;
    const arcHeight = height * 0.6;

    const startX = padding;
    const startY = height - 20;
    const controlX = width / 2;
    const controlY = height - arcHeight;
    const endX = width - padding;
    const endY = height - 30;

    return `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;
  }, [dimensions]);

  /**
   * Calculate positions for all event dots
   * Story 2.2: Position dots based on arcPosition (0-100%)
   */
  const getEventPositions = useCallback((): Map<string, Point> => {
    const positions = new Map<string, Point>();
    const sortedEvents = [...events].sort(
      (a, b) => a.arcPosition - b.arcPosition
    );

    sortedEvents.forEach((event) => {
      const t = event.arcPosition / 100;
      const point = getBezierPoint(t);
      positions.set(event.id, point);
    });

    return positions;
  }, [events, getBezierPoint]);

  const eventPositions = getEventPositions();

  /**
   * Handle mouse enter on dot
   * Story 2.3: Show preview after delay (desktop only)
   */
  const handleDotMouseEnter = (eventId: string) => {
    if (isTouchDevice) return;

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set hover after 250ms delay to avoid flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredEventId(eventId);
      onEventHover(eventId);
    }, 250);
  };

  /**
   * Handle mouse leave from dot
   * Story 2.3: Clear preview when mouse moves away
   */
  const handleDotMouseLeave = () => {
    if (isTouchDevice) return;

    // Clear timeout if user moves away before delay completes
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setHoveredEventId(null);
    onEventHover(null);
  };

  /**
   * Handle dot click/tap
   * Story 2.4: Select event and load card
   */
  const handleDotClick = (eventId: string) => {
    // Clear hover state on click
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredEventId(null);

    onEventSelect(eventId);
  };

  /**
   * Determine dot size based on device
   * Story 2.2: Responsive sizing
   */
  const dotRadius = dimensions.width < 768 ? 7 : 8; // Smaller on mobile
  const tapTargetRadius = 16; // Minimum 32px tap target diameter

  /**
   * Get dot fill color based on state
   * Story 2.2 & 2.4: Visual feedback for selection
   */
  const getDotColor = (eventId: string): string => {
    if (eventId === selectedEventId) {
      return "#3b82f6"; // Blue for selected (bright)
    }
    if (eventId === hoveredEventId) {
      return "#60a5fa"; // Light blue for hovered
    }
    return "#93c5fd"; // Default: light blue (kid-friendly, all safe state)
  };

  /**
   * Get dot stroke for selected state
   * Story 2.4: Visual highlight for selected dot
   */
  const getDotStroke = (eventId: string): { stroke: string; strokeWidth: number } => {
    if (eventId === selectedEventId) {
      return { stroke: "#1d4ed8", strokeWidth: 2.5 };
    }
    return { stroke: "none", strokeWidth: 0 };
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label="Timeline arc with historical events"
      >
        {/* Story 2.1: Render the arc curve */}
        <path
          d={getArcPath()}
          stroke="#60a5fa"
          strokeWidth={dimensions.width < 768 ? 3 : 4}
          fill="none"
          strokeLinecap="round"
        />

        {/* Story 2.2: Render event dots along the curve */}
        {events.map((event) => {
          const position = eventPositions.get(event.id);
          if (!position) return null;

          const dotColor = getDotColor(event.id);
          const dotStroke = getDotStroke(event.id);

          return (
            <g key={event.id}>
              {/* Invisible larger circle for better tap/click targeting */}
              <circle
                cx={position.x}
                cy={position.y}
                r={tapTargetRadius}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => handleDotMouseEnter(event.id)}
                onMouseLeave={handleDotMouseLeave}
                onClick={() => handleDotClick(event.id)}
                aria-label={`${event.title} - ${event.year}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleDotClick(event.id);
                  }
                }}
              />

              {/* Visible dot */}
              <circle
                cx={position.x}
                cy={position.y}
                r={dotRadius}
                fill={dotColor}
                stroke={dotStroke.stroke}
                strokeWidth={dotStroke.strokeWidth}
                className="pointer-events-none transition-all duration-200"
              />

              {/* Glow effect for selected dot */}
              {event.id === selectedEventId && (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={dotRadius + 4}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  opacity={0.4}
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
