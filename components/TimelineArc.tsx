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
import type { DynamicSegment, ViewState } from "@/lib/eventSegmentation";
import SegmentPopup from "./SegmentPopup";

interface TimelineArcProps {
  events: TimelineEvent[];
  segments: DynamicSegment[];
  viewState: ViewState;
  selectedEventId: string | null;
  onEventHover: (eventId: string | null) => void;
  onEventSelect: (eventId: string) => void;
  onSegmentClick: (segmentId: string) => void;
}

interface Point {
  x: number;
  y: number;
}

export default function TimelineArc({
  events,
  segments,
  viewState,
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
   * Calculate weighted t values for events
   * Uses event weights to distribute visual space
   * Weight represents the space AFTER each event
   */
  const eventToWeightedT = useMemo((): Map<string, number> => {
    const tMap = new Map<string, number>();

    if (events.length === 0) return tMap;

    // Sort events by year
    const sortedEvents = [...events].sort((a, b) => a.year - b.year);

    // Single event: place at t=0 (will span full arc)
    if (sortedEvents.length === 1) {
      tMap.set(sortedEvents[0].id, 0);
      return tMap;
    }

    // Calculate total weight (sum of all weights EXCEPT the last event)
    // The last event has no segment after it, so its weight doesn't affect positioning
    const totalWeight = sortedEvents.slice(0, -1).reduce((sum, e) => sum + e.weight, 0);

    let cumulativeWeight = 0;
    sortedEvents.forEach((event, index) => {
      if (index === sortedEvents.length - 1) {
        // Last event: always at t=1 (end of arc)
        tMap.set(event.id, 1);
      } else {
        // Other events: positioned by cumulative weight
        const t = totalWeight > 0 ? cumulativeWeight / totalWeight : 0;
        tMap.set(event.id, t);
        cumulativeWeight += event.weight;
      }
    });

    return tMap;
  }, [events]);

  /**
   * Calculate t value for a year (used for segments)
   * Interpolates between weighted event positions
   */
  const yearToT = useCallback(
    (year: number): number => {
      if (events.length === 0) return 0;

      // Sort events by year
      const sortedEvents = [...events].sort((a, b) => a.year - b.year);

      // Find surrounding events
      let beforeEvent = sortedEvents[0];
      let afterEvent = sortedEvents[sortedEvents.length - 1];

      for (let i = 0; i < sortedEvents.length - 1; i++) {
        if (sortedEvents[i].year <= year && sortedEvents[i + 1].year >= year) {
          beforeEvent = sortedEvents[i];
          afterEvent = sortedEvents[i + 1];
          break;
        }
      }

      // Interpolate between weighted positions
      const beforeT = eventToWeightedT.get(beforeEvent.id) || 0;
      const afterT = eventToWeightedT.get(afterEvent.id) || 1;

      const yearRange = afterEvent.year - beforeEvent.year;
      if (yearRange === 0) return beforeT;

      const yearProgress = (year - beforeEvent.year) / yearRange;
      return beforeT + (afterT - beforeT) * yearProgress;
    },
    [events, eventToWeightedT]
  );

  /**
   * Calculate event positions based on weighted distribution
   * Events are positioned along the arc using their weight
   */
  const eventPositions = useMemo((): Map<string, Point> => {
    const positions = new Map<string, Point>();

    events.forEach((event) => {
      const t = eventToWeightedT.get(event.id) || 0;
      const point = getBezierPoint(t);
      positions.set(event.id, point);
    });

    return positions;
  }, [events, getBezierPoint, eventToWeightedT]);

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
   * Generate path along the Bezier curve from t1 to t2
   */
  const getArcSegmentPath = useCallback((t1: number, t2: number, numSteps: number = 50): string => {
    const points: string[] = [];

    for (let i = 0; i <= numSteps; i++) {
      const t = t1 + (t2 - t1) * (i / numSteps);
      const point = getBezierPoint(t);

      if (i === 0) {
        points.push(`M ${point.x} ${point.y}`);
      } else {
        points.push(`L ${point.x} ${point.y}`);
      }
    }

    return points.join(' ');
  }, [getBezierPoint]);

  /**
   * Epic 5 Story 5.4: Render segment with chronological color sections along the arc curve
   */
  const renderSegment = (segment: DynamicSegment) => {
    const isHovered = hoveredSegmentId === segment.id;
    const paths: React.JSX.Element[] = [];
    const strokeWidth = dimensions.width < 768 ? 8 : 10;

    // Render each chronological color section
    segment.colorSections.forEach((section, index) => {
      const sectionStartT = yearToT(section.startYear);
      const sectionEndT = yearToT(section.endYear);
      const path = getArcSegmentPath(sectionStartT, sectionEndT);

      paths.push(
        <path
          key={`${segment.id}-${index}-${section.eventId}`}
          d={path}
          stroke={isHovered ? "#f97316" : section.color}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          fill="none"
          className="transition-colors duration-200"
          style={{
            cursor: segment.isClickable ? "pointer" : "default",
            opacity: segment.isClickable ? 1 : 0.6,
          }}
        />
      );
    });

    return paths;
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
   * Story 5.1: Drill down into segment (only if clickable)
   */
  const handleSegmentClick = (segment: DynamicSegment) => {
    if (!segment.isClickable) return;

    // Debounce rapid clicks
    if (segmentClickDebounceRef.current) {
      clearTimeout(segmentClickDebounceRef.current);
    }

    segmentClickDebounceRef.current = setTimeout(() => {
      onSegmentClick(segment.id);
      handleSegmentMouseLeave(); // Clear hover state after clicking
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
    ? segments.find((s) => s.id === hoveredSegmentId)
    : null;

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
          strokeLinecap="butt"
          opacity={0.3}
        />

        {/* Epic 5 Story 5.1 & 5.4: Render segments with color stacking */}
        {segments.map((segment) => {
          const startT = yearToT(segment.startYear);
          const endT = yearToT(segment.endYear);
          const startPoint = getBezierPoint(startT);
          const endPoint = getBezierPoint(endT);

          return (
            <g key={segment.id}>
              {renderSegment(segment)}

              {/* Invisible clickable area for segment */}
              <rect
                x={startPoint.x}
                y={getBezierPoint(0.5).y - 20}
                width={endPoint.x - startPoint.x}
                height={40}
                fill="transparent"
                style={{ cursor: segment.isClickable ? "pointer" : "default" }}
                onMouseEnter={(e) => handleSegmentMouseEnter(segment.id, e)}
                onMouseMove={handleSegmentMouseMove}
                onMouseLeave={handleSegmentMouseLeave}
                onClick={() => handleSegmentClick(segment)}
                aria-label={`Segment from ${segment.startYear} to ${segment.endYear}`}
                role={segment.isClickable ? "button" : "presentation"}
                tabIndex={segment.isClickable ? 0 : -1}
              />
            </g>
          );
        })}

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
      {hoveredSegment && popupPosition && (
        <SegmentPopup
          segmentName={`${hoveredSegment.startYear} - ${hoveredSegment.endYear}`}
          events={hoveredSegment.hiddenEvents}
          stateCounts={hoveredSegment.stateCounts}
          mouseX={popupPosition.x}
          mouseY={popupPosition.y}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />
      )}
    </div>
  );
}
