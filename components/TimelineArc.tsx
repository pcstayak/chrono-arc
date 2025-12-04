/**
 * Timeline Arc Component
 * Epic 2: Timeline Arc Navigation (Stories 2.1-2.4)
 * Epic 5: Timeline Improvements (Stories 5.1-5.5)
 *
 * Features:
 * - Arc curve with event dots (Epic 2)
 * - Hover preview and click selection (Epic 2)
 * - Hierarchical drill-down navigation (Story 5.1)
 * - Always-visible event labels (Story 5.2)
 * - Event state indicators (Story 5.3)
 * - Parent segment color stacking (Story 5.4)
 * - Segment hover popup (Story 5.5)
 */

"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { TimelineEvent } from "@/lib/sampleEvents";
import type { TimelineSegment, SegmentStateCount } from "@/types";
import SegmentPopup from "./SegmentPopup";

interface TimelineArcProps {
  events: TimelineEvent[];
  segments: TimelineSegment[];
  currentSegmentId: string | null;
  selectedEventId: string | null;
  onEventHover: (eventId: string | null) => void;
  onEventSelect: (eventId: string) => void;
  onSegmentClick: (segmentId: string) => void;
}

interface Point {
  x: number;
  y: number;
}

interface SegmentPosition {
  segment: TimelineSegment;
  startX: number;
  endX: number;
  path: string;
  stateCounts: SegmentStateCount;
}

export default function TimelineArc({
  events,
  segments,
  currentSegmentId,
  selectedEventId,
  onEventHover,
  onEventSelect,
  onSegmentClick,
}: TimelineArcProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 150 });
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [hoveredSegmentId, setHoveredSegmentId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const segmentClickDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
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
   */
  const getBezierPoint = useCallback(
    (t: number): Point => {
      const { width, height } = dimensions;
      const padding = 50;
      const arcHeight = height * 0.6;

      const p0 = { x: padding, y: height - 20 };
      const p1 = { x: width / 2, y: height - arcHeight };
      const p2 = { x: width - padding, y: height - 30 };

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
   * Epic 5: Calculate segment positions and state counts
   * Story 5.1 & 5.4: Segment rendering with color stacking
   */
  const segmentPositions = useMemo((): SegmentPosition[] => {
    if (segments.length === 0) return [];

    const positions: SegmentPosition[] = [];
    const padding = 50;
    const usableWidth = dimensions.width - 2 * padding;

    // Find year range
    const minYear = Math.min(...segments.map((s) => s.startYear));
    const maxYear = Math.max(...segments.map((s) => s.endYear));
    const yearRange = maxYear - minYear;

    segments.forEach((segment) => {
      // Calculate position based on year range
      const startT = (segment.startYear - minYear) / yearRange;
      const endT = (segment.endYear - minYear) / yearRange;

      const startPoint = getBezierPoint(startT);
      const endPoint = getBezierPoint(endT);

      // Create path for this segment
      const segmentPath = `M ${startPoint.x} ${startPoint.y}`;

      // Calculate state counts for events in this segment
      const segmentEvents = events.filter((e) =>
        segment.eventIds.includes(e.id)
      );

      const stateCounts: SegmentStateCount = segmentEvents.reduce(
        (acc, event) => {
          acc[event.state]++;
          acc.total++;
          return acc;
        },
        { safe: 0, threatened: 0, attacked: 0, total: 0 }
      );

      positions.push({
        segment,
        startX: startPoint.x,
        endX: endPoint.x,
        path: segmentPath,
        stateCounts,
      });
    });

    return positions;
  }, [segments, dimensions, getBezierPoint, events]);

  /**
   * Calculate event positions
   * Story 2.2: Position dots based on arcPosition
   */
  const eventPositions = useMemo((): Map<string, Point> => {
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

  /**
   * Epic 5 Story 5.3: Get dot color based on event state
   */
  const getDotColor = (event: TimelineEvent, isSelected: boolean, isHovered: boolean): string => {
    if (isSelected) {
      // Selected - use bright version of state color
      switch (event.state) {
        case "safe":
          return "#3b82f6"; // Bright blue
        case "threatened":
          return "#f97316"; // Bright orange
        case "attacked":
          return "#ef4444"; // Bright red
      }
    }

    if (isHovered) {
      // Hovered - use medium version
      switch (event.state) {
        case "safe":
          return "#60a5fa"; // Medium blue
        case "threatened":
          return "#fb923c"; // Medium orange
        case "attacked":
          return "#f87171"; // Medium red
      }
    }

    // Default state colors
    switch (event.state) {
      case "safe":
        return "#93c5fd"; // Light blue
      case "threatened":
        return "#fdba74"; // Light orange
      case "attacked":
        return "#fca5a5"; // Light red
    }
  };

  /**
   * Get dot stroke for selected state
   */
  const getDotStroke = (eventId: string): { stroke: string; strokeWidth: number } => {
    if (eventId === selectedEventId) {
      return { stroke: "#1e40af", strokeWidth: 2.5 };
    }
    return { stroke: "none", strokeWidth: 0 };
  };

  /**
   * Epic 5 Story 5.4: Render segment with color stacking
   */
  const renderSegment = (segPos: SegmentPosition) => {
    const { segment, startX, endX, stateCounts } = segPos;
    const isHovered = hoveredSegmentId === segment.id;
    const segmentWidth = endX - startX;

    // Calculate proportions for color stacking
    const total = stateCounts.total || 1;
    const safeWidth = (stateCounts.safe / total) * segmentWidth;
    const threatenedWidth = (stateCounts.threatened / total) * segmentWidth;
    const attackedWidth = (stateCounts.attacked / total) * segmentWidth;

    // Colors ordered: safe > threatened > attacked
    let currentX = startX;
    const segments: React.JSX.Element[] = [];
    const strokeWidth = dimensions.width < 768 ? 8 : 10;
    const y = getBezierPoint((segment.startYear + segment.endYear) / 2 / 5500 + 0.5).y;

    // Safe section (blue)
    if (stateCounts.safe > 0) {
      segments.push(
        <line
          key={`${segment.id}-safe`}
          x1={currentX}
          y1={y}
          x2={currentX + safeWidth}
          y2={y}
          stroke={isHovered ? "#f97316" : "#4A90E2"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-colors duration-200"
        />
      );
      currentX += safeWidth;
    }

    // Threatened section (orange)
    if (stateCounts.threatened > 0) {
      segments.push(
        <line
          key={`${segment.id}-threatened`}
          x1={currentX}
          y1={y}
          x2={currentX + threatenedWidth}
          y2={y}
          stroke={isHovered ? "#f97316" : "#F5A623"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-colors duration-200"
        />
      );
      currentX += threatenedWidth;
    }

    // Attacked section (red)
    if (stateCounts.attacked > 0) {
      segments.push(
        <line
          key={`${segment.id}-attacked`}
          x1={currentX}
          y1={y}
          x2={currentX + attackedWidth}
          y2={y}
          stroke={isHovered ? "#f97316" : "#D0021B"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-colors duration-200"
        />
      );
    }

    // If no events, show neutral gray
    if (stateCounts.total === 0) {
      segments.push(
        <line
          key={`${segment.id}-empty`}
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke={isHovered ? "#f97316" : "#9ca3af"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-colors duration-200"
        />
      );
    }

    return segments;
  };

  /**
   * Handle segment hover
   * Story 5.5: Show popup with state counts
   */
  const handleSegmentMouseEnter = (segmentId: string, event: React.MouseEvent) => {
    if (isTouchDevice) return;

    setHoveredSegmentId(segmentId);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setPopupPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleSegmentMouseMove = (event: React.MouseEvent) => {
    if (isTouchDevice || !hoveredSegmentId) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setPopupPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleSegmentMouseLeave = () => {
    setHoveredSegmentId(null);
    setPopupPosition(null);
  };

  /**
   * Handle segment click with debounce
   * Story 5.1: Drill down into segment
   */
  const handleSegmentClick = (segmentId: string) => {
    // Debounce rapid clicks
    if (segmentClickDebounceRef.current) {
      clearTimeout(segmentClickDebounceRef.current);
    }

    segmentClickDebounceRef.current = setTimeout(() => {
      onSegmentClick(segmentId);
    }, 200);
  };

  /**
   * Handle event hover
   * Story 2.3: Show preview after delay
   */
  const handleDotMouseEnter = (eventId: string) => {
    if (isTouchDevice) return;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredEventId(eventId);
      onEventHover(eventId);
    }, 250);
  };

  const handleDotMouseLeave = () => {
    if (isTouchDevice) return;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setHoveredEventId(null);
    onEventHover(null);
  };

  /**
   * Handle event click
   * Story 2.4: Select event
   */
  const handleDotClick = (eventId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredEventId(null);

    onEventSelect(eventId);
  };

  const dotRadius = dimensions.width < 768 ? 7 : 8;
  const tapTargetRadius = 16;

  // Get hovered segment info for popup
  const hoveredSegment = hoveredSegmentId
    ? segmentPositions.find((sp) => sp.segment.id === hoveredSegmentId)
    : null;

  const hoveredSegmentEvents = hoveredSegment
    ? events.filter((e) => hoveredSegment.segment.eventIds.includes(e.id))
    : [];

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label="Timeline arc with historical events and segments"
      >
        {/* Render base arc curve */}
        <path
          d={getArcPath()}
          stroke="#4b5563"
          strokeWidth={dimensions.width < 768 ? 2 : 3}
          fill="none"
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Epic 5 Story 5.1 & 5.4: Render segments with color stacking */}
        {segmentPositions.map((segPos) => (
          <g key={segPos.segment.id}>
            {renderSegment(segPos)}

            {/* Invisible clickable area for segment */}
            <rect
              x={segPos.startX}
              y={getBezierPoint(0.5).y - 20}
              width={segPos.endX - segPos.startX}
              height={40}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={(e) => handleSegmentMouseEnter(segPos.segment.id, e)}
              onMouseMove={handleSegmentMouseMove}
              onMouseLeave={handleSegmentMouseLeave}
              onClick={() => handleSegmentClick(segPos.segment.id)}
              aria-label={`${segPos.segment.name} segment`}
              role="button"
              tabIndex={0}
            />
          </g>
        ))}

        {/* Epic 5 Story 5.2 & 5.3: Render event dots with always-visible labels */}
        {events.map((event) => {
          const position = eventPositions.get(event.id);
          if (!position) return null;

          const isSelected = event.id === selectedEventId;
          const isHovered = event.id === hoveredEventId;
          const dotColor = getDotColor(event, isSelected, isHovered);
          const dotStroke = getDotStroke(event.id);

          // Label positioning (Story 5.2)
          const labelY = position.y < dimensions.height / 2 ? position.y + 25 : position.y - 15;
          const fontSize = dimensions.width < 768 ? 10 : 12;

          return (
            <g key={event.id}>
              {/* Invisible larger circle for tap targeting */}
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

              {/* Visible dot with state color (Story 5.3) */}
              <circle
                cx={position.x}
                cy={position.y}
                r={dotRadius}
                fill={dotColor}
                stroke={dotStroke.stroke}
                strokeWidth={dotStroke.strokeWidth}
                className="pointer-events-none transition-all duration-200"
              />

              {/* Glow effect for selected or threatened/attacked dots */}
              {(isSelected || event.state === "threatened" || event.state === "attacked") && (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={dotRadius + 4}
                  fill="none"
                  stroke={dotColor}
                  strokeWidth={1.5}
                  opacity={isSelected ? 0.4 : 0.3}
                  className={`pointer-events-none ${
                    event.state === "threatened" || event.state === "attacked"
                      ? "animate-pulse"
                      : ""
                  }`}
                />
              )}

              {/* Story 5.2: Always-visible label */}
              <text
                x={position.x}
                y={labelY}
                fontSize={fontSize}
                fill="#e5e7eb"
                textAnchor="middle"
                className="pointer-events-none select-none font-medium"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
              >
                {event.year < 0
                  ? `${Math.abs(event.year)} BCE`
                  : `${event.year} CE`}
              </text>

              {/* Event name on hover or selection */}
              {(isHovered || isSelected) && (
                <text
                  x={position.x}
                  y={labelY + (fontSize + 2)}
                  fontSize={fontSize - 1}
                  fill="#e5e7eb"
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                >
                  {event.title.length > 20
                    ? event.title.substring(0, 20) + "..."
                    : event.title}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Story 5.5: Segment hover popup */}
      {hoveredSegment && popupPosition && hoveredSegmentEvents.length > 0 && (
        <SegmentPopup
          segmentName={hoveredSegment.segment.name}
          events={hoveredSegmentEvents}
          mouseX={popupPosition.x}
          mouseY={popupPosition.y}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />
      )}
    </div>
  );
}
