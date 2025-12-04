/**
 * Data Access Layer (DAL) - Main Export
 *
 * This module provides a clean abstraction over Supabase database operations.
 * All database access should go through this layer.
 *
 * Benefits:
 * 1. Centralized data access logic
 * 2. Easier testing (can mock this layer)
 * 3. Future API migration: Replace implementations here without touching business logic
 * 4. Type safety with domain models
 * 5. Consistent error handling
 *
 * Migration Path:
 * When moving to a separate API backend:
 * 1. Keep this same DAL interface
 * 2. Replace Supabase client calls with fetch/axios calls to your API
 * 3. Business logic remains unchanged
 */

// Base utilities
export { executeQuery, generateRoomCode, type Result } from "./base";

// Session operations
export {
  createSession,
  getSessionByRoomCode,
  getSessionById,
  updateSessionActivity,
  deactivateSession,
} from "./sessions";

// Player operations
export {
  addPlayerToSession,
  getPlayersBySessionId,
  getPlayerById,
  updatePlayerActivity,
} from "./players";

// Event catalog operations
export {
  getAllEvents,
  getEventsByEra,
  getEventById,
  getEventsByDifficulty,
} from "./events";

// Session event operations
export {
  getSessionEvents,
  addEventToSession,
  placeEvent,
  updateEventState,
  incrementAttackCount,
} from "./session-events";
