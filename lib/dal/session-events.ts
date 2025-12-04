/**
 * Session Events Data Access Layer
 * Handles all database operations related to events in a specific session
 */

import { executeQuery, parseTimestamp, type Result } from "./base";
import { supabase } from "@/lib/supabase/client";
import type { SessionEvent, EventState, PlaceEventData } from "@/types";

/**
 * Get all events for a session
 */
export async function getSessionEvents(
  sessionId: string
): Promise<Result<SessionEvent[]>> {
  return executeQuery(async () => {
    const { data: sessionEvents, error } = await supabase
      .from("session_events")
      .select(`
        *,
        events (*)
      `)
      .eq("session_id", sessionId)
      .order("position", { ascending: true });

    return {
      data: sessionEvents ? sessionEvents.map(mapDbSessionEventToSessionEvent) : null,
      error,
    };
  });
}

/**
 * Add an event to a session (initially unplaced)
 */
export async function addEventToSession(
  sessionId: string,
  eventId: string
): Promise<Result<SessionEvent>> {
  return executeQuery(async () => {
    const { data: sessionEvent, error } = await supabase
      .from("session_events")
      .insert({
        session_id: sessionId,
        event_id: eventId,
        state: "new",
        position: -1, // -1 indicates unplaced
        attack_count: 0,
      })
      .select(`
        *,
        events (*)
      `)
      .single();

    return {
      data: sessionEvent ? mapDbSessionEventToSessionEvent(sessionEvent) : null,
      error,
    };
  });
}

/**
 * Place an event on the timeline
 */
export async function placeEvent(
  data: PlaceEventData
): Promise<Result<SessionEvent>> {
  // First, shift positions of existing events if needed
  const { error: shiftError } = await supabase.rpc("shift_event_positions", {
    p_session_id: data.sessionId,
    p_from_position: data.position,
  });

  if (shiftError) {
    return {
      success: false,
      error: new Error("Failed to adjust event positions"),
    };
  }

  return executeQuery(async () => {
    const { data: sessionEvent, error } = await supabase
      .from("session_events")
      .update({
        state: "safe",
        position: data.position,
        placed_by_player_id: data.playerId,
        placed_at: new Date().toISOString(),
      })
      .eq("session_id", data.sessionId)
      .eq("event_id", data.eventId)
      .select(`
        *,
        events (*)
      `)
      .single();

    return {
      data: sessionEvent ? mapDbSessionEventToSessionEvent(sessionEvent) : null,
      error,
    };
  });
}

/**
 * Update event state (e.g., when under attack)
 */
export async function updateEventState(
  sessionId: string,
  eventId: string,
  state: EventState
): Promise<Result<SessionEvent>> {
  return executeQuery(async () => {
    const { data: sessionEvent, error } = await supabase
      .from("session_events")
      .update({
        state,
        updated_at: new Date().toISOString(),
      })
      .eq("session_id", sessionId)
      .eq("event_id", eventId)
      .select(`
        *,
        events (*)
      `)
      .single();

    return {
      data: sessionEvent ? mapDbSessionEventToSessionEvent(sessionEvent) : null,
      error,
    };
  });
}

/**
 * Increment attack count for an event
 */
export async function incrementAttackCount(
  sessionId: string,
  eventId: string
): Promise<Result<SessionEvent>> {
  return executeQuery(async () => {
    const { data: current, error: fetchError } = await supabase
      .from("session_events")
      .select("attack_count")
      .eq("session_id", sessionId)
      .eq("event_id", eventId)
      .single();

    if (fetchError || !current) {
      return { data: null, error: fetchError };
    }

    const { data: sessionEvent, error } = await supabase
      .from("session_events")
      .update({
        attack_count: current.attack_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("session_id", sessionId)
      .eq("event_id", eventId)
      .select(`
        *,
        events (*)
      `)
      .single();

    return {
      data: sessionEvent ? mapDbSessionEventToSessionEvent(sessionEvent) : null,
      error,
    };
  });
}

/**
 * Map database session event to domain session event
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbSessionEventToSessionEvent(dbSessionEvent: any): SessionEvent {
  return {
    id: dbSessionEvent.id,
    sessionId: dbSessionEvent.session_id,
    eventId: dbSessionEvent.event_id,
    state: dbSessionEvent.state as EventState,
    position: dbSessionEvent.position,
    placedByPlayerId: dbSessionEvent.placed_by_player_id ?? undefined,
    placedAt: dbSessionEvent.placed_at
      ? parseTimestamp(dbSessionEvent.placed_at)
      : undefined,
    attackCount: dbSessionEvent.attack_count,
    createdAt: parseTimestamp(dbSessionEvent.created_at),
    updatedAt: parseTimestamp(dbSessionEvent.updated_at),
    event: dbSessionEvent.events
      ? {
          id: dbSessionEvent.events.id,
          title: dbSessionEvent.events.title,
          description: dbSessionEvent.events.description,
          year: dbSessionEvent.events.year,
          era: dbSessionEvent.events.era,
          tags: dbSessionEvent.events.tags,
          imageUrl: dbSessionEvent.events.image_url ?? undefined,
          difficulty: dbSessionEvent.events.difficulty,
          content: dbSessionEvent.events.content ?? {},
          createdAt: parseTimestamp(dbSessionEvent.events.created_at),
        }
      : undefined,
  };
}
