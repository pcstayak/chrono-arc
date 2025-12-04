-- Chrono Arc - Sample Data Migration
-- This migration adds sample historical events for testing the game

-- ============================================================================
-- SAMPLE EVENTS
-- ============================================================================

INSERT INTO events (title, description, year, era, tags, difficulty, content) VALUES
  (
    'Invention of the Wheel',
    'The wheel revolutionized transportation and trade in ancient civilizations.',
    -3500,
    'prehistory',
    ARRAY['invention', 'innovation'],
    1,
    '{"story": "Around 3500 BCE, Mesopotamians invented the wheel, changing human history forever."}'::jsonb
  ),
  (
    'Printing Press',
    'Johannes Gutenberg invented the printing press, making books accessible to the masses.',
    1440,
    'renaissance',
    ARRAY['invention', 'innovation', 'culture'],
    2,
    '{"story": "Gutenberg''s press sparked the Renaissance by democratizing knowledge."}'::jsonb
  ),
  (
    'First Flight',
    'The Wright Brothers achieved the first powered flight at Kitty Hawk.',
    1903,
    'modern',
    ARRAY['invention', 'technology', 'innovation'],
    2,
    '{"story": "On December 17, 1903, Orville and Wilbur Wright flew for 12 seconds, 120 feet."}'::jsonb
  ),
  (
    'Moon Landing',
    'Apollo 11 astronauts became the first humans to walk on the Moon.',
    1969,
    'modern',
    ARRAY['exploration', 'technology', 'science'],
    2,
    '{"story": "Neil Armstrong and Buzz Aldrin took humanity''s first steps on another world."}'::jsonb
  ),
  (
    'Internet Invention',
    'The invention of the Internet connected the world through information networks.',
    1983,
    'digital',
    ARRAY['technology', 'innovation'],
    3,
    '{"story": "The TCP/IP protocol suite became standard, launching the modern Internet."}'::jsonb
  );
