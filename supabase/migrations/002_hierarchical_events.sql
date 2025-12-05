-- Migration: Hierarchical Events Structure
-- Solves timeline density problem through curated multi-level event hierarchy
-- Created: 2025-01-04
-- Updated: Clean slate version - removes all existing data

-- Step 0: CLEAN SLATE - Drop existing objects and clear data
-- Drop views and functions first (they depend on columns)
DROP VIEW IF EXISTS top_level_events;
DROP FUNCTION IF EXISTS get_events_by_hierarchy_level(INTEGER);
DROP FUNCTION IF EXISTS get_child_events(TEXT);
DROP FUNCTION IF EXISTS get_child_events(UUID);

-- Delete ALL existing events (fresh start)
DELETE FROM events;

-- Drop old indexes if they exist
DROP INDEX IF EXISTS idx_events_hierarchy_level;
DROP INDEX IF EXISTS idx_events_parent_event_id;
DROP INDEX IF EXISTS idx_events_is_key_event;
DROP INDEX IF EXISTS idx_events_state;
DROP INDEX IF EXISTS idx_events_year;

-- Drop columns if they exist (to recreate with correct constraints)
ALTER TABLE events DROP COLUMN IF EXISTS hierarchy_level CASCADE;
ALTER TABLE events DROP COLUMN IF EXISTS parent_event_id CASCADE;
ALTER TABLE events DROP COLUMN IF EXISTS is_key_event CASCADE;
ALTER TABLE events DROP COLUMN IF EXISTS state CASCADE;

-- Step 1: Change ID column from UUID to TEXT (for human-readable IDs)
-- First, drop foreign key constraints that reference events(id)
ALTER TABLE session_events DROP CONSTRAINT IF EXISTS session_events_event_id_fkey;

-- Change the ID column type
ALTER TABLE events ALTER COLUMN id DROP DEFAULT;
ALTER TABLE events ALTER COLUMN id TYPE TEXT USING id::TEXT;

-- Recreate foreign key with TEXT type
ALTER TABLE session_events ALTER COLUMN event_id TYPE TEXT USING event_id::TEXT;
ALTER TABLE session_events ADD CONSTRAINT session_events_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

-- Step 2: Add new columns to events table
ALTER TABLE events
ADD COLUMN hierarchy_level INTEGER NOT NULL DEFAULT 0,
ADD COLUMN parent_event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
ADD COLUMN is_key_event BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN state VARCHAR(20) NOT NULL DEFAULT 'safe' CHECK (state IN ('safe', 'threatened', 'attacked'));

-- Step 3: Create indexes for hierarchy queries
CREATE INDEX idx_events_hierarchy_level ON events(hierarchy_level);
CREATE INDEX idx_events_parent_event_id ON events(parent_event_id);
CREATE INDEX idx_events_is_key_event ON events(is_key_event);
CREATE INDEX idx_events_state ON events(state);

-- Step 4: Create index for year-based queries (for timeline positioning)
CREATE INDEX idx_events_year ON events(year);

-- Step 5: Insert LEVEL 0 events (Top-level milestones)
INSERT INTO events (id, title, description, year, era, tags, difficulty, state, hierarchy_level, parent_event_id, is_key_event, content)
VALUES
-- The Wheel
('evt-top-001', 'The Wheel', 'Revolutionary invention that transformed transportation and mechanics.', -3500, 'ancient', ARRAY['invention', 'innovation'], 1, 'safe', 0, NULL, true,
'{"story": "The wheel changed everything - from moving heavy stones to creating pottery.", "funFacts": ["Invented around 3500 BCE in Mesopotamia", "Early wheels were solid wood slices", "Took 300 years to put wheels on chariots"], "triggers": {"story": {"content": "Around 3500 BCE in Mesopotamia, someone realized a rolling log could become something more...", "images": ["/images/ancient-wheel.jpg"]}, "related": {"items": [{"id": "evt-l1-002", "name": "Great Pyramids", "description": "Built mostly without wheels", "year": -2560}]}}}'::jsonb),

-- The Printing Press
('evt-top-002', 'The Printing Press', 'Gutenberg''s invention democratized knowledge and sparked the Renaissance.', 1450, 'renaissance', ARRAY['innovation', 'culture'], 2, 'attacked', 0, NULL, true,
'{"story": "The printing press made books affordable and spread ideas faster than ever before.", "funFacts": ["First major book printed: the Gutenberg Bible (1455)", "Before printing, books were hand-copied by monks", "Sparked the Protestant Reformation and Scientific Revolution"], "triggers": {"story": {"content": "Johannes Gutenberg combined existing technologies in a new way: movable type, oil-based ink, and a modified wine press..."}}}'::jsonb),

-- The Steam Engine
('evt-top-003', 'The Steam Engine', 'Powered the Industrial Revolution and transformed society.', 1776, 'industrial', ARRAY['innovation', 'science'], 2, 'threatened', 0, NULL, true,
'{"story": "James Watt''s improvements to the steam engine powered factories, trains, and ships.", "funFacts": ["The first steam engines were used to pump water out of mines", "Steam trains could travel 30 mph - faster than any horse", "Steam power freed factories from needing to be near rivers"], "triggers": {}}'::jsonb),

-- The Airplane
('evt-top-004', 'The Airplane', 'Wright Brothers achieved powered flight, shrinking the world.', 1903, 'modern', ARRAY['innovation', 'science'], 2, 'safe', 0, NULL, true,
'{"story": "On December 17, 1903, Orville Wright flew 120 feet in 12 seconds - humanity''s first powered flight.", "funFacts": ["The first flight was shorter than a Boeing 747 wingspan", "Many experts said powered flight was impossible", "Within 66 years, humans walked on the moon"], "triggers": {}}'::jsonb),

-- Moon Landing
('evt-top-005', 'Moon Landing', 'Humanity''s first steps on another celestial body.', 1969, 'modern', ARRAY['science', 'exploration'], 3, 'safe', 0, NULL, true,
'{"story": "Neil Armstrong and Buzz Aldrin walked on the moon while Michael Collins orbited above.", "funFacts": ["Over 600 million people watched on TV", "The computer that got them there had less power than a modern calculator", "Footprints on the moon will last millions of years (no wind to erase them)"], "triggers": {}}'::jsonb),

-- World Wide Web
('evt-top-006', 'World Wide Web', 'Tim Berners-Lee created the system that connected the world.', 1991, 'digital', ARRAY['innovation', 'communication'], 2, 'safe', 0, NULL, true,
'{"story": "The Web made the internet accessible to everyone, transforming communication, commerce, and culture.", "funFacts": ["Tim Berners-Lee gave it away for free instead of patenting it", "The first website explained what the World Wide Web was", "By 2000, there were 17 million websites; now there are over 1 billion"], "triggers": {}}'::jsonb);

-- Step 6: Insert LEVEL 1 Ancient Era events
INSERT INTO events (id, title, description, year, era, tags, difficulty, state, hierarchy_level, parent_event_id, is_key_event, content)
VALUES
('evt-l1-001', 'Writing Systems', 'Cuneiform in Mesopotamia allowed humans to record history.', -3200, 'ancient', ARRAY['culture', 'innovation'], 1, 'safe', 1, 'evt-top-001', true,
'{"story": "Writing let people keep records, tell stories, and preserve knowledge across generations.", "funFacts": ["Earliest writing was used for accounting - counting sheep and grain", "Cuneiform used a reed stylus pressed into wet clay", "Egyptian hieroglyphics developed independently around the same time"], "triggers": {}}'::jsonb),

('evt-l1-002', 'The Great Pyramids', 'Monumental tombs that showcased ancient engineering brilliance.', -2560, 'ancient', ARRAY['culture', 'innovation'], 2, 'threatened', 1, 'evt-top-001', true,
'{"story": "The Great Pyramid of Giza was the world''s tallest building for 3,800 years.", "funFacts": ["Made of over 2 million stone blocks", "Aligned precisely with cardinal directions", "Built by paid workers, not slaves"], "triggers": {}}'::jsonb),

('evt-l1-003', 'Code of Hammurabi', 'One of the first written law codes, establishing justice principles.', -1754, 'ancient', ARRAY['culture', 'politics'], 2, 'safe', 1, 'evt-top-001', true,
'{"story": "282 laws carved in stone, covering everything from trade to family disputes.", "funFacts": ["Famous for ''eye for an eye'' principle", "Different punishments for different social classes", "Carved on an 8-foot tall stone pillar"], "triggers": {}}'::jsonb),

('evt-l1-004', 'Birth of Democracy', 'Athens introduced citizen voting and direct democracy.', -508, 'ancient', ARRAY['politics', 'culture'], 2, 'safe', 1, 'evt-top-001', true,
'{"story": "Citizens could vote directly on laws and policies - a revolutionary idea.", "funFacts": ["Only free male citizens could vote (about 10-20% of population)", "Used colored stones to cast votes", "Inspired modern democratic governments"], "triggers": {}}'::jsonb),

('evt-l1-005', 'Roman Empire Peak', 'Rome controlled the Mediterranean and brought unprecedented unity.', 117, 'ancient', ARRAY['politics', 'culture'], 2, 'safe', 1, 'evt-top-001', true,
'{"story": "At its height under Emperor Trajan, Rome ruled 5 million square kilometers.", "funFacts": ["Built 250,000 miles of roads", "Introduced aqueducts, concrete, and arches", "Latin became the basis for Romance languages"], "triggers": {}}'::jsonb);

-- Step 7: Insert LEVEL 1 Medieval/Renaissance events
INSERT INTO events (id, title, description, year, era, tags, difficulty, state, hierarchy_level, parent_event_id, is_key_event, content)
VALUES
('evt-l1-101', 'Gunpowder', 'Chinese invention that changed warfare forever.', 1000, 'medieval', ARRAY['innovation', 'war'], 2, 'safe', 1, 'evt-top-002', true,
'{"story": "Originally used for fireworks, gunpowder revolutionized military tactics.", "funFacts": ["Chinese alchemists discovered it while seeking immortality elixir", "First guns appeared in China around 1200", "Ended the age of castles and knights in armor"], "triggers": {}}'::jsonb),

('evt-l1-102', 'Magna Carta', 'Limited royal power and established rule of law.', 1215, 'medieval', ARRAY['politics', 'culture'], 2, 'safe', 1, 'evt-top-002', true,
'{"story": "English nobles forced King John to sign, limiting his power and protecting their rights.", "funFacts": ["Inspired the US Constitution centuries later", "Most clauses were quickly repealed", "Established the principle: even kings must follow the law"], "triggers": {}}'::jsonb),

('evt-l1-103', 'Black Death', 'Pandemic that killed 1/3 of Europe''s population.', 1347, 'medieval', ARRAY['health', 'crisis'], 3, 'attacked', 1, 'evt-top-002', true,
'{"story": "Bubonic plague spread via trade routes, devastating cities and reshaping society.", "funFacts": ["Killed an estimated 75-200 million people", "Led to labor shortages that improved conditions for peasants", "Took 200 years for Europe''s population to recover"], "triggers": {}}'::jsonb),

('evt-l1-104', 'Columbus Reaches Americas', 'European contact with the Americas began.', 1492, 'renaissance', ARRAY['exploration'], 2, 'safe', 1, 'evt-top-002', true,
'{"story": "Columbus''s voyage connected two worlds, with profound consequences for both.", "funFacts": ["Columbus thought he''d reached Asia", "Indigenous peoples had lived in the Americas for 15,000+ years", "Columbian Exchange transformed cuisines worldwide"], "triggers": {}}'::jsonb),

('evt-l1-105', 'The Telescope', 'Galileo''s observations challenged Earth-centered cosmology.', 1609, 'renaissance', ARRAY['science', 'innovation'], 2, 'safe', 1, 'evt-top-002', true,
'{"story": "Galileo saw Jupiter''s moons, proving not everything orbits Earth.", "funFacts": ["His first telescope magnified 3x; he improved it to 30x", "Church put him under house arrest for his discoveries", "Opened the door to modern astronomy"], "triggers": {}}'::jsonb);

-- Step 8: Insert LEVEL 1 Industrial Era events
INSERT INTO events (id, title, description, year, era, tags, difficulty, state, hierarchy_level, parent_event_id, is_key_event, content)
VALUES
('evt-l1-201', 'American Revolution', 'Colonies declared independence, inspiring democratic movements worldwide.', 1776, 'industrial', ARRAY['politics', 'war'], 2, 'safe', 1, 'evt-top-003', true,
'{"story": "Declaration of Independence proclaimed that ''all men are created equal.''", "funFacts": ["Started with protests over tea taxes", "France helped the colonies win", "Created the first modern constitutional democracy"], "triggers": {}}'::jsonb),

('evt-l1-202', 'Photography Invented', 'First permanent photograph captured by Joseph Niépce.', 1826, 'industrial', ARRAY['innovation', 'culture'], 2, 'safe', 1, 'evt-top-003', true,
'{"story": "The first photo required 8 hours of exposure time to capture an image.", "funFacts": ["The earliest surviving photo shows rooftops from a window", "Revolutionized how we remember history", "Led to movies, television, and digital cameras"], "triggers": {}}'::jsonb),

('evt-l1-203', 'Telegraph', 'Samuel Morse''s invention enabled instant long-distance communication.', 1844, 'industrial', ARRAY['innovation', 'communication'], 2, 'safe', 1, 'evt-top-003', true,
'{"story": "Messages that once took weeks by horse could now arrive in minutes.", "funFacts": ["First message: ''What hath God wrought''", "Used Morse code: dots and dashes", "Connected continents via undersea cables"], "triggers": {}}'::jsonb),

('evt-l1-204', 'Telephone', 'Alexander Graham Bell''s device let people talk across distances.', 1876, 'industrial', ARRAY['innovation', 'communication'], 2, 'safe', 1, 'evt-top-003', true,
'{"story": "First words spoken: ''Mr. Watson, come here, I want to see you.''", "funFacts": ["Bell was actually trying to improve the telegraph", "By 1900, there were 600,000 phones in the US", "Led to smartphones 130 years later"], "triggers": {}}'::jsonb),

('evt-l1-205', 'Light Bulb', 'Edison''s practical incandescent bulb illuminated the world.', 1879, 'industrial', ARRAY['innovation', 'science'], 2, 'safe', 1, 'evt-top-003', true,
'{"story": "Edison didn''t invent the light bulb, but he made it practical and affordable.", "funFacts": ["Tested over 3,000 materials for the filament", "First bulbs lasted only 13.5 hours", "Transformed cities - no more gaslights or candles"], "triggers": {}}'::jsonb);

-- Step 9: Insert LEVEL 1 Early Modern Era events
INSERT INTO events (id, title, description, year, era, tags, difficulty, state, hierarchy_level, parent_event_id, is_key_event, content)
VALUES
('evt-l1-301', 'Radio Broadcasting', 'Wireless communication brought news and entertainment to millions.', 1920, 'modern', ARRAY['innovation', 'communication'], 2, 'safe', 1, 'evt-top-004', true,
'{"story": "For the first time, people could hear voices from around the world in their homes.", "funFacts": ["First commercial radio station: KDKA in Pittsburgh", "By 1930, 40% of US homes had radios", "United nations during World War II through broadcasts"], "triggers": {}}'::jsonb),

('evt-l1-302', 'Penicillin Discovery', 'Alexander Fleming''s accidental discovery saved millions of lives.', 1928, 'modern', ARRAY['science', 'health'], 2, 'safe', 1, 'evt-top-004', true,
'{"story": "A moldy petri dish led to the first antibiotic, revolutionizing medicine.", "funFacts": ["Fleming noticed mold killed bacteria in a forgotten dish", "Mass production started during WWII", "Reduced death from infections by over 90%"], "triggers": {}}'::jsonb),

('evt-l1-303', 'Television', 'Moving pictures broadcast into homes transformed entertainment.', 1927, 'modern', ARRAY['innovation', 'culture'], 2, 'safe', 1, 'evt-top-004', true,
'{"story": "Philo Farnsworth demonstrated electronic television at age 21.", "funFacts": ["First image transmitted: a dollar sign", "By 1960, 90% of US homes had TVs", "Changed politics, advertising, and culture"], "triggers": {}}'::jsonb),

('evt-l1-304', 'World War II Ends', 'The deadliest conflict in human history concluded.', 1945, 'modern', ARRAY['war', 'politics'], 3, 'attacked', 1, 'evt-top-004', true,
'{"story": "The war killed 70-85 million people and reshaped the global order.", "funFacts": ["First and only use of nuclear weapons in war", "Led to creation of United Nations", "Sparked the Cold War between US and USSR"], "triggers": {}}'::jsonb),

('evt-l1-305', 'DNA Structure Discovered', 'Watson and Crick revealed the double helix, unlocking genetics.', 1953, 'modern', ARRAY['science'], 3, 'safe', 1, 'evt-top-004', false,
'{"story": "Understanding DNA''s structure enabled genetic medicine and biotechnology.", "funFacts": ["Rosalind Franklin''s X-ray images were crucial", "Led to genome sequencing and genetic engineering", "Explained how life passes traits to offspring"], "triggers": {}}'::jsonb);

-- Step 10: Insert LEVEL 1 Space Age events
INSERT INTO events (id, title, description, year, era, tags, difficulty, state, hierarchy_level, parent_event_id, is_key_event, content)
VALUES
('evt-l1-401', 'Sputnik Launch', 'USSR''s satellite started the Space Race.', 1957, 'modern', ARRAY['science', 'exploration'], 2, 'safe', 1, 'evt-top-005', true,
'{"story": "The world''s first artificial satellite shocked Americans and accelerated space exploration.", "funFacts": ["Size of a beach ball, weighed 184 pounds", "Orbited Earth every 96 minutes", "Led to NASA''s creation in 1958"], "triggers": {}}'::jsonb),

('evt-l1-402', 'Microprocessor Invented', 'Intel''s 4004 chip put a computer on a single piece of silicon.', 1971, 'modern', ARRAY['innovation', 'science'], 2, 'safe', 1, 'evt-top-005', true,
'{"story": "The computer CPU shrank from room-sized to fingernail-sized.", "funFacts": ["Originally designed for a calculator", "Had 2,300 transistors (modern chips have billions)", "Made personal computers possible"], "triggers": {}}'::jsonb),

('evt-l1-403', 'Personal Computer', 'Apple II and IBM PC brought computers to homes and offices.', 1977, 'modern', ARRAY['innovation'], 2, 'safe', 1, 'evt-top-005', true,
'{"story": "Computers were no longer just for big companies and universities.", "funFacts": ["Apple II cost $1,298 (about $6,000 today)", "Had 4KB of RAM (modern phones have millions of times more)", "Introduced color graphics and sound"], "triggers": {}}'::jsonb),

('evt-l1-404', 'IBM PC Released', 'Standardized personal computing and launched the PC era.', 1981, 'modern', ARRAY['innovation'], 2, 'safe', 1, 'evt-top-005', true,
'{"story": "IBM''s open architecture let anyone build compatible computers.", "funFacts": ["Cost $1,565 (about $5,000 today)", "Ran MS-DOS (Microsoft''s first big success)", "Sparked the ''PC clone'' industry"], "triggers": {}}'::jsonb),

('evt-l1-405', 'Berlin Wall Falls', 'Cold War symbol crumbled, reuniting Germany.', 1989, 'modern', ARRAY['politics'], 2, 'safe', 1, 'evt-top-005', true,
'{"story": "Germans celebrated as the wall that divided them for 28 years came down.", "funFacts": ["Built in 1961 to stop East Germans from fleeing", "Separated families for nearly 3 decades", "Symbolized the end of Soviet domination in Eastern Europe"], "triggers": {}}'::jsonb);

-- Step 11: Insert LEVEL 1 Digital Age events
INSERT INTO events (id, title, description, year, era, tags, difficulty, state, hierarchy_level, parent_event_id, is_key_event, content)
VALUES
('evt-l1-501', 'Linux Released', 'Open-source operating system democratized software development.', 1991, 'digital', ARRAY['innovation'], 2, 'safe', 1, 'evt-top-006', true,
'{"story": "Linus Torvalds shared his OS code freely, spawning a global collaboration movement.", "funFacts": ["Started as a hobby project by a 21-year-old student", "Now powers most web servers and Android phones", "Thousands of developers contribute for free"], "triggers": {}}'::jsonb),

('evt-l1-502', 'Google Founded', 'Search engine organized the world''s information.', 1998, 'digital', ARRAY['innovation', 'communication'], 2, 'safe', 1, 'evt-top-006', true,
'{"story": "Larry Page and Sergey Brin created a better way to find information online.", "funFacts": ["Name comes from ''googol'' (10^100)", "Started in a garage", "Processes 8.5 billion searches per day"], "triggers": {}}'::jsonb),

('evt-l1-503', 'Wikipedia Launched', 'Free encyclopedia anyone can edit.', 2001, 'digital', ARRAY['culture', 'communication'], 2, 'safe', 1, 'evt-top-006', true,
'{"story": "Collaborative knowledge base with 60+ million articles in 300+ languages.", "funFacts": ["5th most-visited website globally", "Written by volunteers, no ads", "Has articles on topics no traditional encyclopedia would cover"], "triggers": {}}'::jsonb),

('evt-l1-504', 'Social Media Era Begins', 'Facebook launched, transforming how people connect.', 2004, 'digital', ARRAY['culture', 'communication'], 2, 'threatened', 1, 'evt-top-006', true,
'{"story": "Started in a Harvard dorm room, now connects 3 billion people.", "funFacts": ["Originally only for college students", "Sparked the social media revolution", "Changed politics, journalism, and relationships"], "triggers": {}}'::jsonb),

('evt-l1-505', 'iPhone Released', 'Smartphone revolutionized mobile computing.', 2007, 'digital', ARRAY['innovation'], 2, 'safe', 1, 'evt-top-006', true,
'{"story": "Apple combined phone, internet, and iPod into one device with a touchscreen.", "funFacts": ["Cost $499-$599 at launch", "First iPhone had no App Store", "Sparked the smartphone revolution (billions now own one)"], "triggers": {}}'::jsonb),

('evt-l1-506', 'AI Revolution', 'ChatGPT democratized artificial intelligence.', 2022, 'digital', ARRAY['innovation', 'science'], 3, 'threatened', 1, 'evt-top-006', true,
'{"story": "AI that can write, code, and reason reached mainstream users.", "funFacts": ["Reached 100 million users in 2 months (fastest ever)", "Built on decades of AI research", "Raising questions about jobs, creativity, and society"], "triggers": {}}'::jsonb);

-- Step 12: Create helper function to get events by hierarchy level
CREATE OR REPLACE FUNCTION get_events_by_hierarchy_level(level INTEGER)
RETURNS SETOF events AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM events
  WHERE hierarchy_level = level
  ORDER BY year ASC;
END;
$$ LANGUAGE plpgsql;

-- Step 13: Create helper function to get child events
CREATE OR REPLACE FUNCTION get_child_events(p_parent_id TEXT)
RETURNS SETOF events AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM events
  WHERE parent_event_id = p_parent_id
  ORDER BY year ASC;
END;
$$ LANGUAGE plpgsql;

-- Step 14: Create view for top-level events (convenience)
CREATE OR REPLACE VIEW top_level_events AS
SELECT * FROM events
WHERE hierarchy_level = 0
ORDER BY year ASC;

-- Step 15: Add comments for documentation
COMMENT ON COLUMN events.hierarchy_level IS 'Event hierarchy level: 0 = top-level milestone, 1+ = drill-down levels';
COMMENT ON COLUMN events.parent_event_id IS 'Parent event in hierarchy - NULL for top-level events';
COMMENT ON COLUMN events.is_key_event IS 'Whether this event is shown at parent hierarchy level';
COMMENT ON COLUMN events.state IS 'Game state: safe (blue), threatened (orange), attacked (red)';

-- Migration complete!
-- Total events inserted: 6 (level 0) + 36 (level 1) = 42 events
-- Hierarchy structure ensures max 5-10 events visible at any level
