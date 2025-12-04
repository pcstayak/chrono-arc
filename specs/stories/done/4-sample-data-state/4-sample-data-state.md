### User Story 4

**Number:** `4`
**ID:** `BA-US-sample-data-state`
**Role:** `player`
**Story:** `As a player, I want the game to load with pre-populated sample historical events and maintain state as I interact with the timeline so that I can experience the core gameplay loop without needing to set up data or accounts.`

**Context / Background:**
- This epic covers the data layer and state management for the MVP
- MVP has no backend, no user accounts, no persistence across sessions
- All data is hardcoded or loaded from local JSON files
- State is managed in-memory (e.g., which event is selected, which trigger is active)
- Sample data includes 5-10 historical events with cards and trigger content
- Educational goal: provide historically accurate, kid-friendly content

**Functional Requirements:**
1. Load 5-10 sample historical events when the game initializes
2. Each event includes: name, date, description, image, metadata, arc position, and trigger content
3. Maintain in-memory state for: selected event, active trigger, arc interactions
4. Provide sample content for all trigger types (story, game placeholder, related items)
5. Ensure data is historically accurate and age-appropriate

**Non-Functional / UX Requirements:**
- Data should load quickly on page load (no noticeable delay)
- Events should span a range of historical eras (ancient to modern)
- Content should be kid-friendly (no violence, sensitive topics handled carefully)
- Images should be appropriate and safe for kids
- Text should be at an appropriate reading level (roughly grades 3-5)

**Data & State:**
- Inputs: Hardcoded or JSON file with event data
- Outputs: Loaded events available for rendering
- State rules: State is ephemeral (lost on page refresh); no persistence needed for MVP

**Validation & Edge Cases:**
- Data fails to load: show error message and fallback content
- Invalid data format: log error and skip invalid events
- No events in data: show empty state message
- Duplicate event IDs: de-duplicate or log warning

**Assumptions:**
- Sample data is curated manually (not user-generated)
- Data is stored in a JSON file or hardcoded in JavaScript
- No need for a backend API or database for MVP
- No need for data editing or admin interface
- Historical accuracy is verified before data is added

**Out of Scope (for this story):**
- Backend API or database integration
- User accounts or authentication
- Data persistence across sessions (no localStorage or cookies)
- Dynamic data loading based on player progress
- Content moderation or filtering (all content is pre-approved)

**Acceptance Criteria (Gherkin-style):**
- Given I open the game, when the page loads, then 5-10 sample events are loaded and available for display on the arc
- Given the game is running, when I select an event and click triggers, then the state is maintained in-memory and the UI reflects the current state
- Given I refresh the page, when the game reloads, then the state resets to the initial state (no persistence)
- Given the sample data includes events from different eras, when I view the arc, then I see dots representing events from ancient to modern times
