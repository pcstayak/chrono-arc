/**
 * Event Data Access Layer
 * Handles all database operations related to historical events
 */

import { getDbClient, executeQuery, parseTimestamp, type Result } from "./base";
import type { Event, Era, EventTag, EventContent } from "@/types";

/**
 * Get all available events (catalog)
 */
export async function getAllEvents(): Promise<Result<Event[]>> {
  const client = getDbClient();

  return executeQuery(async () => {
    const { data: events, error } = await client
      .from("events")
      .select()
      .order("year", { ascending: true });

    return {
      data: events ? events.map(mapDbEventToEvent) : null,
      error,
    };
  });
}

/**
 * Get events by era
 */
export async function getEventsByEra(era: Era): Promise<Result<Event[]>> {
  const client = getDbClient();

  return executeQuery(async () => {
    const { data: events, error } = await client
      .from("events")
      .select()
      .eq("era", era)
      .order("year", { ascending: true });

    return {
      data: events ? events.map(mapDbEventToEvent) : null,
      error,
    };
  });
}

/**
 * Get a single event by ID
 */
export async function getEventById(eventId: string): Promise<Result<Event>> {
  const client = getDbClient();

  return executeQuery(async () => {
    const { data: event, error } = await client
      .from("events")
      .select()
      .eq("id", eventId)
      .single();

    return { data: event ? mapDbEventToEvent(event) : null, error };
  });
}

/**
 * Get events by difficulty level
 */
export async function getEventsByDifficulty(
  difficulty: number
): Promise<Result<Event[]>> {
  const client = getDbClient();

  return executeQuery(async () => {
    const { data: events, error } = await client
      .from("events")
      .select()
      .eq("difficulty", difficulty)
      .order("year", { ascending: true });

    return {
      data: events ? events.map(mapDbEventToEvent) : null,
      error,
    };
  });
}

/**
 * Map database event to domain event
 */
function mapDbEventToEvent(dbEvent: {
  id: string;
  title: string;
  description: string;
  year: number;
  era: string;
  tags: string[];
  image_url: string | null;
  difficulty: number;
  content: unknown;
  created_at: string;
}): Event {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    year: dbEvent.year,
    era: dbEvent.era as Era,
    tags: dbEvent.tags as EventTag[],
    imageUrl: dbEvent.image_url ?? undefined,
    difficulty: dbEvent.difficulty,
    content: (dbEvent.content as EventContent) ?? {},
    createdAt: parseTimestamp(dbEvent.created_at),
  };
}
