/**
 * Event Adapter
 * Converts HierarchicalEvents to TimelineEvents with calculated arc positions
 */

import type { HierarchicalEvent } from "./hierarchicalEvents";
import type { TimelineEvent } from "./sampleEvents";
import type { Era, EventTag } from "@/types";

/**
 * Convert HierarchicalEvent to TimelineEvent
 * Calculates arcPosition based on year range
 */
export function hierarchicalToTimelineEvent(
  event: HierarchicalEvent,
  allEvents: HierarchicalEvent[]
): TimelineEvent {
  // Find min and max years
  const years = allEvents.map(e => e.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const yearRange = maxYear - minYear;

  // Calculate arc position (0-100)
  const arcPosition = yearRange > 0
    ? ((event.year - minYear) / yearRange) * 100
    : 50;

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    year: event.year,
    era: event.era as Era,
    tags: event.tags as EventTag[],
    difficulty: event.difficulty,
    state: event.state,
    hierarchyLevel: event.hierarchyLevel,
    parentEventId: event.parentEventId,
    isKeyEvent: event.isKeyEvent,
    weight: event.weight,
    content: {
      story: event.content.story,
      funFacts: event.content.funFacts,
      triggers: event.content.triggers,
    },
    createdAt: new Date(),
    arcPosition,
    segmentId: event.parentEventId || "seg-root", // Use parentEventId as segmentId
  };
}

/**
 * Convert all hierarchical events to timeline events
 */
export function convertAllEvents(
  hierarchicalEvents: HierarchicalEvent[]
): TimelineEvent[] {
  return hierarchicalEvents.map(event =>
    hierarchicalToTimelineEvent(event, hierarchicalEvents)
  );
}

/**
 * Get events by hierarchy level
 */
export function getEventsByLevel(
  allEvents: TimelineEvent[],
  level: number
): TimelineEvent[] {
  return allEvents.filter(e => e.hierarchyLevel === level);
}

/**
 * Get child events of a parent
 */
export function getChildEvents(
  allEvents: TimelineEvent[],
  parentId: string
): TimelineEvent[] {
  return allEvents.filter(e => e.parentEventId === parentId);
}

/**
 * Get top-level events (level 0)
 */
export function getTopLevelEvents(
  allEvents: TimelineEvent[]
): TimelineEvent[] {
  return getEventsByLevel(allEvents, 0);
}
