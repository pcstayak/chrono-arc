/**
 * Create Session Page
 * Allows users to create a new game session
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/dal";

export default function CreateSessionPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateSession = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const result = await createSession({ maxPlayers: 8 });

      if (result.success) {
        // Redirect to game page
        router.push(`/game/${result.data.id}`);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-arc-primary/10 to-arc-secondary/10">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create New Game
          </h1>
          <p className="text-foreground/70">
            Start a new timeline adventure
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Max Players
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-foreground"
              defaultValue="8"
            >
              <option value="2">2 players</option>
              <option value="4">4 players</option>
              <option value="6">6 players</option>
              <option value="8">8 players</option>
            </select>
          </div>

          <button
            onClick={handleCreateSession}
            disabled={isCreating}
            className="w-full py-3 bg-arc-primary text-white rounded-lg font-medium hover:bg-arc-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Create Game"}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-foreground rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
