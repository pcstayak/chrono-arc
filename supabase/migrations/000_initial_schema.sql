-- Chrono Arc - Initial Schema Migration
-- This migration creates the foundational database structure for the game

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Sessions table
-- Represents a game session with a unique room code
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_code VARCHAR(6) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  max_players INTEGER DEFAULT 8
);

-- Players table
-- Represents individual players in a session
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  display_name VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table (catalog of all historical events)
-- Master catalog of all available events/inventions in the game
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  era VARCHAR(50) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  difficulty INTEGER DEFAULT 1,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session events table (events in a specific session)
-- Tracks which events are in which session and their state
CREATE TABLE session_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  state VARCHAR(20) DEFAULT 'new',
  position INTEGER NOT NULL,
  placed_by_player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  placed_at TIMESTAMP WITH TIME ZONE,
  attack_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, event_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Sessions indexes
CREATE INDEX idx_sessions_room_code ON sessions(room_code);
CREATE INDEX idx_sessions_is_active ON sessions(is_active);

-- Players indexes
CREATE INDEX idx_players_session_id ON players(session_id);

-- Session events indexes
CREATE INDEX idx_session_events_session_id ON session_events(session_id);
CREATE INDEX idx_session_events_event_id ON session_events(event_id);
CREATE INDEX idx_session_events_position ON session_events(session_id, position);

-- Events indexes
CREATE INDEX idx_events_era ON events(era);
CREATE INDEX idx_events_year ON events(year);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to shift event positions (used when inserting an event)
-- This allows proper insertion of events in the middle of a timeline
CREATE OR REPLACE FUNCTION shift_event_positions(
  p_session_id UUID,
  p_from_position INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE session_events
  SET position = position + 1
  WHERE session_id = p_session_id
    AND position >= p_from_position;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;

-- Note: For MVP, we're allowing all operations.
-- In production, tighten these based on authentication.

-- Allow all operations for now (MVP)
CREATE POLICY "Allow all on sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Allow all on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all on events" ON events FOR ALL USING (true);
CREATE POLICY "Allow all on session_events" ON session_events FOR ALL USING (true);
