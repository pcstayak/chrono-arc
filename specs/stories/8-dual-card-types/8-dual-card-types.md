### User Story 8

**Number:** `8`
**ID:** `BA-US-dual-card-types`
**Role:** `player`
**Story:** `As a player, I want to interact with two distinct types of cards - Invention cards and Event cards - that differ visually and functionally, so that I can understand how historical events influenced inventions and vice versa, adding strategic depth and variety to my learning experience.`

**Context / Background:**
- Currently, the game treats all cards uniformly as generic "events"
- This epic introduces a fundamental game mechanic: distinguishing between Event cards (historical occurrences) and Invention cards (technological/scientific breakthroughs)
- Event cards represent things that happened (wars, discoveries, cultural movements, natural phenomena)
- Invention cards represent things that were created (tools, machines, processes, scientific theories)
- The distinction creates deeper educational value by showing cause-and-effect relationships in history
- Examples of relationships: The printing press (invention) enabled the spread of Reformation ideas (event); World War II (event) accelerated computer development (invention)
- This mechanic adds strategic gameplay: players may need specific inventions to unlock epochs or events
- Fun factor: Collecting both types creates variety and completionist goals
- Educational value: Reinforces understanding of how technology and history intertwine

**Functional Requirements:**
1. Distinguish between Event cards and Invention cards at the data model level (card type field)
2. Display visual differences between the two card types (color scheme, icon, border style, etc.)
3. Track and display relationships between events and inventions (e.g., "The Printing Press enabled the Protestant Reformation")
4. Enable progression gates where certain inventions are required to unlock epochs or events
5. Show which inventions influenced which events and vice versa on card details
6. Allow filtering and sorting by card type in the UI (album, timeline, etc.)
7. Integrate dual card types with existing systems (mastery album, mini-games, defense mechanics)
8. Display card type clearly in all contexts (timeline dots, card panels, album, etc.)

**Non-Functional / UX Requirements:**
- Visual distinction must be immediately obvious to kids aged 7-12 (clear color coding, simple icons)
- Card type should be understandable without reading text (visual-first design)
- Must work seamlessly on desktop and mobile devices
- Visual differences must maintain accessibility (color-blind friendly, high contrast)
- Card type labels must use kid-friendly language ("Invention" vs "Event", not "Technology" vs "Occurrence")
- Relationship indicators should be simple and non-cluttered (icons, short text)
- Progression gates should feel rewarding, not frustrating (clear communication of requirements)
- Performance must not degrade with dual card types (no significant load time increase)

**Data & State:**
- Inputs:
  - Card type field added to Event data model (enum: "event" or "invention")
  - Relationship metadata linking events to inventions and vice versa
  - Unlock requirements specifying which inventions gate which epochs/events
  - Visual styling metadata for each card type (colors, icons, borders)
- Outputs:
  - Cards displayed with type-specific visual styling
  - Relationship connections shown on card details and timeline
  - Progression gate status (locked/unlocked) based on invention collection
  - Filtered views by card type in album and other interfaces
- State rules:
  - A card can be either an Event or an Invention, not both
  - Relationships between cards are bidirectional (event influences invention and vice versa)
  - Progression gates check player's collected inventions before allowing access
  - Visual styling is applied automatically based on card type field
  - Card type is immutable once created (cannot change type after creation)

**Validation & Edge Cases:**
- Card with undefined or invalid type: default to "event" type with warning logged
- Event references non-existent invention in relationship: skip relationship display
- Invention required for unlock is not yet available in game: show "coming soon" message
- Player tries to access gated content without required invention: show clear message explaining requirement
- Card has relationships to both events and inventions: display both categories separately
- Timeline displays mixed card types: use visual indicators to distinguish at a glance
- Album view with both card types: provide clear type filtering and grouping
- Mobile view with limited space: ensure type indicators remain visible and clear
- Card type affects mini-game or defense mechanics: ensure game logic handles both types correctly
- Legacy data without card type field: migration strategy to assign default types

**Assumptions:**
- Each card in the existing sample data will be classified as either "event" or "invention" (manual classification for MVP)
- Invention cards represent tangible creations (tools, machines, processes) or scientific theories
- Event cards represent historical occurrences (wars, discoveries, movements, natural phenomena)
- Some cards may be ambiguous (e.g., "The Printing Press" could be invention or event) - use best judgment favoring "invention" for creations
- Relationships between cards are predefined by content authors, not algorithmically generated
- Visual styling for each card type is consistent across the entire application
- Progression gates are optional game mechanic (not all epochs require inventions)
- Current sample events include both types: The Wheel, Printing Press, Steam Engine, Light Bulb, Airplane, Smartphone = inventions; Great Pyramid, Gunpowder, Telescope, Internet = could be either (use judgment)
- The mastery album (Epic 7) will accommodate both card types without major restructuring
- Mini-games and defense mechanics (Epic 6) work the same for both card types (content differs, mechanics same)

**Out of Scope (for this story):**
- Creating new card types beyond Event and Invention (e.g., "Person" cards, "Place" cards)
- Complex relationship types beyond simple influence (e.g., "enabled by", "prevented by", "accelerated by")
- Dynamic relationship discovery during gameplay (player-identified connections)
- Trading or exchanging cards between players
- Card type-specific mini-games (e.g., invention-only puzzle games)
- Different progression systems for events vs inventions (both use same mastery system)
- Combining multiple inventions to unlock a single event (multi-requirement gates)
- Visual timeline showing invention-event relationship arrows or connections
- Detailed analytics on event-invention relationship patterns
- Localization of card type names
- Sound effects specific to card types
- Card type-specific rewards or scoring systems

**Acceptance Criteria (Gherkin-style):**
- Given I view a card, when I look at its visual design, then I can immediately tell if it is an Event or an Invention by color, icon, or border
- Given I view an Invention card, when I open its details, then I see a list of events it influenced (if any)
- Given I view an Event card, when I open its details, then I see a list of inventions it influenced or was influenced by (if any)
- Given I try to access a gated epoch, when I do not have the required invention, then I see a clear message explaining which invention I need
- Given I have collected the required invention, when I try to access the gated epoch, then I am granted access
- Given I filter the album by card type, when I select "Inventions", then I see only Invention cards
- Given I view the timeline, when cards are displayed, then Event and Invention cards are visually distinct (different colors or icons on dots)
- Given I play a mini-game on an Invention card, when the game loads, then it reflects invention-themed content
- Given I view a card on mobile, when the screen is small, then the card type indicator remains visible and clear
- Given I explore the album, when I see both Event and Invention cards, then I can easily distinguish between them without reading labels
