/**
 * Event-Driven Segmentation Logic
 * Epic 5 - Refined Implementation
 *
 * Core Concepts:
 * 1. Visible events are "splitters" that create segments between them
 * 2. Segments contain hidden events between visible boundary events
 * 3. Segment is clickable only if it has hidden events
 * 4. Clicking a segment zooms the arc to show that segment's date range
 * 5. Segment color is based on hidden events (start inclusive, end exclusive)
 */

import type { TimelineEvent } from "./sampleEvents";

export interface DynamicSegment {
  id: string;
  startYear: number;
  endYear: number;
  startEventId: string; // Event that starts this segment
  endEventId: string; // Event that ends this segment
  hiddenEvents: TimelineEvent[]; // Events hidden in this segment
  isClickable: boolean; // True if has hidden events
  color: string; // Dominant color based on hidden events
  stateCounts: {
    safe: number;
    threatened: number;
    attacked: number;
    defended: number; // Story 6.14
    corrupted: number; // Story 6.14
    total: number;
  };
  // Chronological color sections for rendering
  colorSections: Array<{
    startYear: number;
    endYear: number;
    color: string;
    eventId: string;
  }>;
}

export interface ViewState {
  minYear: number;
  maxYear: number;
  visibleEventIds: Set<string>;
}

/**
 * Get color for an event state
 * Story 6.14: Added defended and corrupted states
 */
function getStateColor(state: string): string {
  switch (state) {
    case 'safe': return '#4A90E2'; // blue
    case 'defended': return '#22C55E'; // green (Story 6.14)
    case 'threatened': return '#F5A623'; // orange
    case 'attacked': return '#D0021B'; // red
    case 'corrupted': return '#6B7280'; // gray (Story 6.14)
    default: return '#9ca3af'; // gray
  }
}

/**
 * Calculate segments between visible events
 * Segments are created BETWEEN consecutive visible events
 */
export function calculateSegments(
  allEvents: TimelineEvent[],
  visibleEventIds: Set<string>
): DynamicSegment[] {
  // Get visible events sorted by year
  const visibleEvents = allEvents
    .filter(e => visibleEventIds.has(e.id))
    .sort((a, b) => a.year - b.year);

  if (visibleEvents.length === 0) return [];

  // Determine the hierarchy level of visible events
  const currentLevel = visibleEvents[0].hierarchyLevel;

  const segments: DynamicSegment[] = [];

  // Create segments between consecutive visible events (exclude last segment if no end event)
  for (let i = 0; i < visibleEvents.length - 1; i++) {
    const startEvent = visibleEvents[i];
    const endEvent = visibleEvents[i + 1];

    const segmentStartYear = startEvent.year;
    const segmentEndYear = endEvent.year;

    // Find hidden events in this segment
    // Only include DIRECT CHILDREN of the start event (next hierarchy level)
    const hiddenEvents = allEvents.filter(e => {
      if (visibleEventIds.has(e.id)) return false;
      // Only include events at the next hierarchy level
      if (e.hierarchyLevel !== currentLevel + 1) return false;
      // Only include children of the start event
      if (e.parentEventId !== startEvent.id) return false;
      return e.year > segmentStartYear && e.year < segmentEndYear;
    });

    // Get all events in chronological order (start event + hidden events)
    const allEventsInSegment = [startEvent, ...hiddenEvents].sort((a, b) => a.year - b.year);

    // Calculate state counts (including start event, excluding end event)
    // Story 6.14: Added defended and corrupted states
    const stateCounts = allEventsInSegment.reduce(
      (acc, event) => {
        if (event.state === 'safe' || event.state === 'threatened' ||
            event.state === 'attacked' || event.state === 'defended' ||
            event.state === 'corrupted') {
          acc[event.state]++;
        }
        acc.total++;
        return acc;
      },
      { safe: 0, threatened: 0, attacked: 0, defended: 0, corrupted: 0, total: 0 }
    );

    // Determine segment color based on proportions
    const color = getSegmentColor(stateCounts);

    // Create chronological color sections
    const colorSections = allEventsInSegment.map((event, idx) => {
      const nextEvent = allEventsInSegment[idx + 1];
      return {
        startYear: event.year,
        endYear: nextEvent ? nextEvent.year : segmentEndYear,
        color: getStateColor(event.state),
        eventId: event.id,
      };
    });

    segments.push({
      id: `seg-${startEvent.id}-${endEvent.id}`,
      startYear: segmentStartYear,
      endYear: segmentEndYear,
      startEventId: startEvent.id,
      endEventId: endEvent.id,
      hiddenEvents,
      isClickable: hiddenEvents.length > 0,
      color,
      stateCounts,
      colorSections,
    });
  }

  return segments;
}

/**
 * Get segment color based on state proportions
 * Returns array of color stops for gradient
 * Story 6.14: Added defended and corrupted states
 */
function getSegmentColor(stateCounts: {
  safe: number;
  threatened: number;
  attacked: number;
  defended: number;
  corrupted: number;
  total: number;
}): string {
  if (stateCounts.total === 0) return '#9ca3af'; // gray

  // If all same state, return single color
  if (stateCounts.safe === stateCounts.total) return '#4A90E2'; // blue
  if (stateCounts.defended === stateCounts.total) return '#22C55E'; // green
  if (stateCounts.threatened === stateCounts.total) return '#F5A623'; // orange
  if (stateCounts.attacked === stateCounts.total) return '#D0021B'; // red
  if (stateCounts.corrupted === stateCounts.total) return '#6B7280'; // gray

  // Mixed states - return dominant color
  // Priority: attacked > corrupted > threatened > defended > safe
  if (stateCounts.attacked > 0) return '#D0021B';
  if (stateCounts.corrupted > 0) return '#6B7280';
  if (stateCounts.threatened > 0) return '#F5A623';
  if (stateCounts.defended > 0) return '#22C55E';
  return '#4A90E2';
}

/**
 * Get color stops for gradient rendering
 * Returns proportional color sections
 * Story 6.14: Added defended and corrupted states
 */
export function getSegmentColorStops(stateCounts: {
  safe: number;
  threatened: number;
  attacked: number;
  defended: number;
  corrupted: number;
  total: number;
}): Array<{ color: string; proportion: number }> {
  if (stateCounts.total === 0) {
    return [{ color: '#9ca3af', proportion: 1 }];
  }

  const stops: Array<{ color: string; proportion: number }> = [];

  if (stateCounts.safe > 0) {
    stops.push({
      color: '#4A90E2',
      proportion: stateCounts.safe / stateCounts.total,
    });
  }

  if (stateCounts.defended > 0) {
    stops.push({
      color: '#22C55E',
      proportion: stateCounts.defended / stateCounts.total,
    });
  }

  if (stateCounts.threatened > 0) {
    stops.push({
      color: '#F5A623',
      proportion: stateCounts.threatened / stateCounts.total,
    });
  }

  if (stateCounts.attacked > 0) {
    stops.push({
      color: '#D0021B',
      proportion: stateCounts.attacked / stateCounts.total,
    });
  }

  if (stateCounts.corrupted > 0) {
    stops.push({
      color: '#6B7280',
      proportion: stateCounts.corrupted / stateCounts.total,
    });
  }

  return stops;
}

/**
 * Drill down into a segment
 * Returns new view state showing ONLY the segment's child events
 * The arc zooms to show from first child to last child
 */
export function drillDownSegment(
  segment: DynamicSegment
): ViewState {
  // Show ONLY the hidden events (direct children) - clear parent events
  const newVisibleIds = new Set<string>();
  segment.hiddenEvents.forEach(e => newVisibleIds.add(e.id));

  // If no hidden events, shouldn't happen (segment wouldn't be clickable)
  if (segment.hiddenEvents.length === 0) {
    return {
      minYear: segment.startYear,
      maxYear: segment.endYear,
      visibleEventIds: newVisibleIds,
    };
  }

  // Zoom arc to show from first child to last child
  const sortedChildren = [...segment.hiddenEvents].sort((a, b) => a.year - b.year);
  const minYear = sortedChildren[0].year;
  const maxYear = sortedChildren[sortedChildren.length - 1].year;

  return {
    minYear,
    maxYear,
    visibleEventIds: newVisibleIds,
  };
}

/**
 * Navigate back to parent view
 * Returns previous view state from history
 */
export function navigateBack(
  viewHistory: ViewState[]
): ViewState | null {
  if (viewHistory.length === 0) return null;
  return viewHistory[viewHistory.length - 1];
}

/**
 * Initialize top-level view with only level 0 events visible
 */
export function getInitialViewState(
  allEvents: TimelineEvent[]
): ViewState {
  const sortedEvents = [...allEvents].sort((a, b) => a.year - b.year);
  const minYear = sortedEvents[0].year;
  const maxYear = sortedEvents[sortedEvents.length - 1].year;

  // Show only hierarchy level 0 events at top level
  const visibleEventIds = new Set(
    allEvents.filter(e => e.hierarchyLevel === 0).map(e => e.id)
  );

  return {
    minYear,
    maxYear,
    visibleEventIds,
  };
}

/**
 * Navigate to next sibling segment
 * Returns new view state or null if no next segment
 */
export function navigateToNextSegment(
  allEvents: TimelineEvent[],
  currentView: ViewState
): ViewState | null {
  const visibleEvents = allEvents
    .filter(e => currentView.visibleEventIds.has(e.id))
    .sort((a, b) => a.year - b.year);

  if (visibleEvents.length === 0) return null;

  // Get the parent of current visible events
  const parentId = visibleEvents[0].parentEventId;
  if (!parentId) return null; // At top level

  // Get all siblings (events with same parent)
  const siblings = allEvents
    .filter(e => e.parentEventId === parentId)
    .sort((a, b) => a.year - b.year);

  // Find current segment's position
  const currentStartId = visibleEvents[0].id;
  const currentIndex = siblings.findIndex(e => e.id === currentStartId);

  if (currentIndex === -1 || currentIndex >= siblings.length - 1) {
    return null; // No next sibling
  }

  // Navigate to next sibling
  const nextEvent = siblings[currentIndex + 1];
  const endEvent = siblings[currentIndex + 2] || null;

  const newVisibleIds = new Set<string>();
  newVisibleIds.add(nextEvent.id);
  if (endEvent) newVisibleIds.add(endEvent.id);

  // Find all events between next and end
  const hiddenEvents = allEvents.filter(e => {
    if (newVisibleIds.has(e.id)) return false;
    return e.year > nextEvent.year && e.year < (endEvent?.year || Infinity);
  });

  hiddenEvents.forEach(e => newVisibleIds.add(e.id));

  return {
    minYear: nextEvent.year,
    maxYear: endEvent?.year || nextEvent.year + 100,
    visibleEventIds: newVisibleIds,
  };
}

/**
 * Navigate to previous sibling segment
 * Returns new view state or null if no previous segment
 */
export function navigateToPrevSegment(
  allEvents: TimelineEvent[],
  currentView: ViewState
): ViewState | null {
  const visibleEvents = allEvents
    .filter(e => currentView.visibleEventIds.has(e.id))
    .sort((a, b) => a.year - b.year);

  if (visibleEvents.length === 0) return null;

  // Get the parent of current visible events
  const parentId = visibleEvents[0].parentEventId;
  if (!parentId) return null; // At top level

  // Get all siblings (events with same parent)
  const siblings = allEvents
    .filter(e => e.parentEventId === parentId)
    .sort((a, b) => a.year - b.year);

  // Find current segment's position
  const currentStartId = visibleEvents[0].id;
  const currentIndex = siblings.findIndex(e => e.id === currentStartId);

  if (currentIndex <= 0) {
    return null; // No previous sibling
  }

  // Navigate to previous sibling
  const prevEvent = siblings[currentIndex - 1];
  const endEvent = siblings[currentIndex] || null;

  const newVisibleIds = new Set<string>();
  newVisibleIds.add(prevEvent.id);
  if (endEvent) newVisibleIds.add(endEvent.id);

  // Find all events between prev and end
  const hiddenEvents = allEvents.filter(e => {
    if (newVisibleIds.has(e.id)) return false;
    return e.year > prevEvent.year && e.year < (endEvent?.year || Infinity);
  });

  hiddenEvents.forEach(e => newVisibleIds.add(e.id));

  return {
    minYear: prevEvent.year,
    maxYear: endEvent?.year || prevEvent.year + 100,
    visibleEventIds: newVisibleIds,
  };
}
