/**
 * Player Data Access Layer
 * Handles all database operations related to players
 */

import { getDbClient, executeQuery, parseTimestamp, type Result } from "./base";
import type { Player, JoinSessionData } from "@/types";

/**
 * Add a player to a session
 */
export async function addPlayerToSession(
  data: JoinSessionData
): Promise<Result<Player>> {
  const client = getDbClient();

  // First, get the session to verify it exists and is active
  const { data: session, error: sessionError } = await client
    .from("sessions")
    .select("id, max_players")
    .eq("room_code", data.roomCode)
    .eq("is_active", true)
    .single();

  if (sessionError || !session) {
    return {
      success: false,
      error: new Error("Session not found or inactive"),
    };
  }

  // Check current player count
  const { count, error: countError } = await client
    .from("players")
    .select("*", { count: "exact", head: true })
    .eq("session_id", session.id);

  if (countError) {
    return {
      success: false,
      error: new Error("Failed to check player count"),
    };
  }

  if (count !== null && count >= session.max_players) {
    return {
      success: false,
      error: new Error("Session is full"),
    };
  }

  return executeQuery(async () => {
    const { data: player, error } = await client
      .from("players")
      .insert({
        session_id: session.id,
        display_name: data.displayName,
        color: data.color,
      })
      .select()
      .single();

    return { data: player ? mapDbPlayerToPlayer(player) : null, error };
  });
}

/**
 * Get all players in a session
 */
export async function getPlayersBySessionId(
  sessionId: string
): Promise<Result<Player[]>> {
  const client = getDbClient();

  return executeQuery(async () => {
    const { data: players, error } = await client
      .from("players")
      .select()
      .eq("session_id", sessionId)
      .order("joined_at", { ascending: true });

    return {
      data: players ? players.map(mapDbPlayerToPlayer) : null,
      error,
    };
  });
}

/**
 * Get a player by ID
 */
export async function getPlayerById(playerId: string): Promise<Result<Player>> {
  const client = getDbClient();

  return executeQuery(async () => {
    const { data: player, error } = await client
      .from("players")
      .select()
      .eq("id", playerId)
      .single();

    return { data: player ? mapDbPlayerToPlayer(player) : null, error };
  });
}

/**
 * Update player's last active timestamp
 */
export async function updatePlayerActivity(
  playerId: string
): Promise<Result<Player>> {
  const client = getDbClient();

  return executeQuery(async () => {
    const { data: player, error } = await client
      .from("players")
      .update({ last_active_at: new Date().toISOString() })
      .eq("id", playerId)
      .select()
      .single();

    return { data: player ? mapDbPlayerToPlayer(player) : null, error };
  });
}

/**
 * Map database player to domain player
 */
function mapDbPlayerToPlayer(dbPlayer: {
  id: string;
  session_id: string;
  display_name: string;
  color: string;
  joined_at: string;
  last_active_at: string;
}): Player {
  return {
    id: dbPlayer.id,
    sessionId: dbPlayer.session_id,
    displayName: dbPlayer.display_name,
    color: dbPlayer.color,
    joinedAt: parseTimestamp(dbPlayer.joined_at),
    lastActiveAt: parseTimestamp(dbPlayer.last_active_at),
  };
}
