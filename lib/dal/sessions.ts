/**
 * Session Data Access Layer
 * Handles all database operations related to game sessions
 */

import { executeQuery, generateRoomCode, parseTimestamp, type Result } from "./base";
import { supabase } from "@/lib/supabase/client";
import type { Session, CreateSessionData } from "@/types";

/**
 * Create a new game session with a unique room code
 */
export async function createSession(
  data: CreateSessionData = {}
): Promise<Result<Session>> {
  const roomCode = generateRoomCode();

  return executeQuery(async () => {
    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        room_code: roomCode,
        max_players: data.maxPlayers ?? 8,
        is_active: true,
      })
      .select()
      .single();

    return { data: session ? mapDbSessionToSession(session) : null, error };
  });
}

/**
 * Get a session by room code
 */
export async function getSessionByRoomCode(
  roomCode: string
): Promise<Result<Session>> {
  return executeQuery(async () => {
    const { data: session, error } = await supabase
      .from("sessions")
      .select()
      .eq("room_code", roomCode)
      .eq("is_active", true)
      .single();

    return { data: session ? mapDbSessionToSession(session) : null, error };
  });
}

/**
 * Get a session by ID
 */
export async function getSessionById(id: string): Promise<Result<Session>> {
  return executeQuery(async () => {
    const { data: session, error } = await supabase
      .from("sessions")
      .select()
      .eq("id", id)
      .single();

    return { data: session ? mapDbSessionToSession(session) : null, error };
  });
}

/**
 * Update session's last activity timestamp
 */
export async function updateSessionActivity(
  sessionId: string
): Promise<Result<Session>> {
  return executeQuery(async () => {
    const { data: session, error } = await supabase
      .from("sessions")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .select()
      .single();

    return { data: session ? mapDbSessionToSession(session) : null, error };
  });
}

/**
 * Deactivate a session (soft delete)
 */
export async function deactivateSession(
  sessionId: string
): Promise<Result<Session>> {
  return executeQuery(async () => {
    const { data: session, error } = await supabase
      .from("sessions")
      .update({
        is_active: false,
      })
      .eq("id", sessionId)
      .select()
      .single();

    return { data: session ? mapDbSessionToSession(session) : null, error };
  });
}

/**
 * Map database session to domain session
 */
function mapDbSessionToSession(dbSession: {
  id: string;
  room_code: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  max_players: number;
}): Session {
  return {
    id: dbSession.id,
    roomCode: dbSession.room_code,
    isActive: dbSession.is_active,
    maxPlayers: dbSession.max_players,
    createdAt: parseTimestamp(dbSession.created_at),
    updatedAt: parseTimestamp(dbSession.updated_at),
  };
}
