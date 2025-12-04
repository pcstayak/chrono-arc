/**
 * Join Session Page
 * Allows users to join an existing game session with a room code
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionByRoomCode, addPlayerToSession } from "@/lib/dal";

const PLAYER_COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

export default function JoinSessionPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0]);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    setError(null);

    try {
      // Verify session exists
      const sessionResult = await getSessionByRoomCode(roomCode.toUpperCase());
      if (!sessionResult.success) {
        setError("Session not found. Please check the room code.");
        setIsJoining(false);
        return;
      }

      // Add player to session
      const playerResult = await addPlayerToSession({
        roomCode: roomCode.toUpperCase(),
        displayName,
        color: selectedColor,
      });

      if (playerResult.success) {
        // Redirect to game page
        router.push(`/game/${sessionResult.data.id}`);
      } else {
        setError(playerResult.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join session");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-arc-primary/10 to-arc-secondary/10">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Join Game
          </h1>
          <p className="text-foreground/70">
            Enter the room code to join
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleJoinSession} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-foreground font-mono text-lg text-center uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Choose Your Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PLAYER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-full aspect-square rounded-lg transition-all ${
                    selectedColor === color
                      ? "ring-4 ring-arc-primary scale-110"
                      : "ring-2 ring-gray-300 dark:ring-gray-600 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color}`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isJoining || !roomCode || !displayName}
            className="w-full py-3 bg-arc-primary text-white rounded-lg font-medium hover:bg-arc-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? "Joining..." : "Join Game"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-foreground rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}
