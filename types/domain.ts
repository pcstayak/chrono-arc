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
  // Hierarchical event structure
  hierarchyLevel: number; // 0 = top level, 1+ = drill-down levels
  parentEventId: string | null; // References parent event (NULL for top-level)
  isKeyEvent: boolean; // Whether shown at parent level
  state: TimelineEventState; // Game state: 'safe', 'threatened', or 'attacked'
  weight: number; // Visual weight for segment distribution (0.1-10, default 1)
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
  // Epic 3: Trigger system content
  triggers?: TriggerContent;
}

/**
 * Epic 3: Trigger content for the right panel
 */
export interface TriggerContent {
  story?: StoryTrigger;
  game?: GameTrigger;
  related?: RelatedTrigger;
}

/**
 * Story trigger content - extended text and images
 */
export interface StoryTrigger {
  content: string; // 2-4 paragraphs of extended text
  images?: string[]; // URLs to images
}

/**
 * Game trigger content - placeholder for mini-games
 */
export interface GameTrigger {
  placeholder: string; // Message to display
  previewDescription?: string; // Optional description of future game
}

/**
 * Related items trigger - list of related events
 */
export interface RelatedTrigger {
  items: RelatedItem[];
}

/**
 * Related event item
 */
export interface RelatedItem {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  year?: number;
}

/**
 * Trigger type identifiers
 */
export type TriggerType = "story" | "game" | "related";

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
 * Epic 5: Timeline event display state for UI
 */
export type TimelineEventState = "safe" | "threatened" | "attacked";

/**
 * Epic 5: Timeline segment for hierarchical navigation
 */
export interface TimelineSegment {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  parentSegmentId: string | null;
  level: number;
  children: TimelineSegment[];
  eventIds: string[];
}

/**
 * Epic 5: Event state counts for segment color stacking
 */
export interface SegmentStateCount {
  safe: number;
  threatened: number;
  attacked: number;
  total: number;
}

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
