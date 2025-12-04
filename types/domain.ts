/**
 * Domain model types
 * These represent the business entities in the application
 */

/**
 * Game session representing a room where players collaborate
 */
export interface Session {
  id: string;
  roomCode: string;
  isActive: boolean;
  maxPlayers: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Player in a game session
 */
export interface Player {
  id: string;
  sessionId: string;
  displayName: string;
  color: string;
  joinedAt: Date;
  lastActiveAt: Date;
}

/**
 * Historical event/invention that can be placed on the timeline
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  year: number;
  era: Era;
  tags: EventTag[];
  imageUrl?: string;
  difficulty: number;
  content: EventContent;
  createdAt: Date;
}

/**
 * Event content (stories, games, related items)
 */
export interface EventContent {
  story?: string;
  funFacts?: string[];
  relatedEventIds?: string[];
  miniGameData?: MiniGameData;
  defenseQuestions?: DefenseQuestion[];
}

/**
 * Mini-game configuration for an event
 */
export interface MiniGameData {
  type: "placement" | "quiz" | "sequence";
  config: Record<string, unknown>;
}

/**
 * Defense question when an event is under attack
 */
export interface DefenseQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

/**
 * Event state in a specific session
 */
export interface SessionEvent {
  id: string;
  sessionId: string;
  eventId: string;
  state: EventState;
  position: number;
  placedByPlayerId?: string;
  placedAt?: Date;
  attackCount: number;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  event?: Event;
}

/**
 * Historical eras for organizing events
 */
export type Era =
  | "prehistory"
  | "ancient"
  | "medieval"
  | "renaissance"
  | "industrial"
  | "modern"
  | "digital";

/**
 * Tags for categorizing events
 */
export type EventTag =
  | "invention"
  | "discovery"
  | "war"
  | "innovation"
  | "disease"
  | "exploration"
  | "science"
  | "technology"
  | "art"
  | "culture";

/**
 * State of an event in a session
 */
export type EventState = "new" | "safe" | "danger" | "attack";

/**
 * UI mode for the application
 */
export type GameMode = "browsing" | "inserting" | "defense";

/**
 * Data for creating a new session
 */
export interface CreateSessionData {
  maxPlayers?: number;
}

/**
 * Data for joining a session
 */
export interface JoinSessionData {
  roomCode: string;
  displayName: string;
  color: string;
}

/**
 * Data for placing an event on the timeline
 */
export interface PlaceEventData {
  sessionId: string;
  eventId: string;
  position: number;
  playerId: string;
}
