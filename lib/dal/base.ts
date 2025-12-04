import { supabase } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Base Data Access Layer
 * Provides common utilities and abstractions for data access
 *
 * This layer abstracts Supabase-specific calls to make future API migration easier.
 * If we move to a REST API later, we only need to modify this layer.
 */

export type DbClient = SupabaseClient<Database>;

/**
 * Get the default Supabase client
 * In the future, this could return an API client instead
 */
export function getDbClient(): SupabaseClient<Database> {
  return supabase as SupabaseClient<Database>;
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Wrap a Supabase query in error handling
 */
export async function executeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: unknown }>
): Promise<Result<T>> {
  try {
    const { data, error } = await queryFn();

    if (error) {
      console.error("Database query error:", error);
      return {
        success: false,
        error: new Error(
          error instanceof Error ? error.message : "Database query failed"
        ),
      };
    }

    if (data === null) {
      return {
        success: false,
        error: new Error("No data returned from query"),
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error in query execution:", error);
    return {
      success: false,
      error: new Error(
        error instanceof Error ? error.message : "Unexpected error"
      ),
    };
  }
}

/**
 * Convert database timestamp to Date object
 */
export function parseTimestamp(timestamp: string): Date {
  return new Date(timestamp);
}

/**
 * Generate a random room code
 */
export function generateRoomCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
