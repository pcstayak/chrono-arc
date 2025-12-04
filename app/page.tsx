"use client";

import Link from "next/link";

/**
 * Landing page for Chrono Arc
 * Provides options to create a new session or join an existing one
 */
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-arc-primary to-arc-secondary text-white py-6 px-8">
        <h1 className="text-4xl font-bold text-center">Chrono Arc</h1>
        <p className="text-center mt-2 text-white/90">
          Rebuild human history together
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Welcome to Chrono Arc
            </h2>
            <p className="text-lg text-foreground/80 max-w-xl mx-auto">
              A family-friendly game where you work together to place inventions
              and events on a timeline. Learn about history while having fun!
            </p>
          </section>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Session Card */}
            <Link
              href="/session/create"
              className="group block p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-arc-primary"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-arc-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-arc-primary/20 transition-colors">
                  <svg
                    className="w-8 h-8 text-arc-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Create New Game
                </h3>
                <p className="text-foreground/70">
                  Start a new timeline and invite friends or family to join
                </p>
              </div>
            </Link>

            {/* Join Session Card */}
            <Link
              href="/session/join"
              className="group block p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-arc-secondary"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-arc-secondary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-arc-secondary/20 transition-colors">
                  <svg
                    className="w-8 h-8 text-arc-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Join Existing Game
                </h3>
                <p className="text-foreground/70">
                  Enter a room code to join a game in progress
                </p>
              </div>
            </Link>
          </div>

          {/* How to Play */}
          <section className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-xl font-bold text-foreground mb-4 text-center">
              How to Play
            </h3>
            <ol className="space-y-3 text-foreground/80">
              <li className="flex gap-3">
                <span className="font-bold text-arc-primary">1.</span>
                <span>Create or join a game session with family or friends</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-arc-primary">2.</span>
                <span>Place historical events in chronological order on the Chrono Arc</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-arc-primary">3.</span>
                <span>Learn fascinating facts about each invention as you place them</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-arc-primary">4.</span>
                <span>Defend your timeline from time bandits who try to steal your cards!</span>
              </li>
            </ol>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-foreground/60">
        <p>&copy; 2025 Chrono Arc. Made for families who love learning together.</p>
      </footer>
    </main>
  );
}
