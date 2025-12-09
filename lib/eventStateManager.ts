/**
 * Event State Manager
 * Epic 6: Story 6.4 (BA-US-answer-validation-and-outcome)
 * Manages event security state updates based on defense outcomes
 */

import { allHierarchicalEvents } from "./hierarchicalEvents";
import type { TimelineEventState } from "@/types";

/**
 * Update an event's security state
 * This is a temporary in-memory solution for MVP
 * In production, this would update a database or global state store
 */
export function updateEventState(eventId: string, newState: TimelineEventState): boolean {
  const event = allHierarchicalEvents.find((e) => e.id === eventId);

  if (!event) {
    console.error(`Event ${eventId} not found`);
    return false;
  }

  // Update the state
  event.state = newState;
  console.log(`Event ${eventId} (${event.title}) state updated to: ${newState}`);

  return true;
}

/**
 * Handle defense outcome
 * Story 6.14: Updated to use "defended" and "corrupted" states
 * - If successful: update to "defended" state (green indicator)
 * - If failed: update to "corrupted" state
 */
export function handleDefenseOutcome(eventId: string, success: boolean): void {
  if (success) {
    // Defense successful - mark as defended (Story 6.14)
    updateEventState(eventId, "defended");
  } else {
    // Defense failed - mark as corrupted (Story 6.14)
    updateEventState(eventId, "corrupted");
  }
}

/**
 * Check if an event can be defended
 * Returns false if event is not in attacked state
 */
export function canDefendEvent(eventId: string): boolean {
  const event = allHierarchicalEvents.find((e) => e.id === eventId);

  if (!event) {
    return false;
  }

  return event.state === "attacked";
}

/**
 * Get current event state
 */
export function getEventState(eventId: string): TimelineEventState | null {
  const event = allHierarchicalEvents.find((e) => e.id === eventId);
  return event ? event.state : null;
}

/**
 * Simulate an attack on an event (for testing)
 * Changes event state from "safe" to "attacked"
 */
export function simulateAttack(eventId: string): boolean {
  const event = allHierarchicalEvents.find((e) => e.id === eventId);

  if (!event) {
    console.error(`Event ${eventId} not found`);
    return false;
  }

  if (event.state !== "safe") {
    console.warn(`Event ${eventId} is not in safe state, cannot attack`);
    return false;
  }

  event.state = "attacked";
  console.log(`Event ${eventId} (${event.title}) is now under attack!`);

  return true;
}
