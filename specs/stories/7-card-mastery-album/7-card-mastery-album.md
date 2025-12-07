### User Story 7

**Number:** `7`
**ID:** `BA-US-card-mastery-album`
**Role:** `player`
**Story:** `As a player, I want to interact with event cards in multiple ways beyond just playing mini-games, including exploring a beautiful album page with collectible elements that unlock as I master the card, so that I am motivated to deeply engage with historical events and have a sense of progression and achievement.`

**Context / Background:**
- Currently, event cards have a single "Game" button that launches different mini-games based on card status
- This epic expands card interaction to create a richer, more engaging experience
- The album page concept is inspired by collectible card games and sticker albums, familiar to kids
- Players unlock album elements (stickers, animations, fun facts) by completing mini-games and defending cards
- The goal is to "master the card" by unlocking all its elements, creating a completionist goal
- Educational value: Encourages repeated engagement with historical content, reinforcing learning through multiple exposures
- Fun factor: Collecting and unlocking elements taps into intrinsic motivation for kids

**Functional Requirements:**
1. Replace single "Game" button with multiple interaction buttons on event cards
2. Add an "Album" button that opens a dedicated album page for each card
3. Display locked and unlocked elements on the album page (stickers, animations, fun facts)
4. Track unlock progress for each card based on player actions (completing mini-games, defending card)
5. Show mastery status for each card (e.g., "3/10 elements unlocked")
6. Provide visual feedback when new elements are unlocked
7. Allow players to view and interact with unlocked elements

**Non-Functional / UX Requirements:**
- Album page must be visually appealing and kid-friendly (bright colors, large images, playful design)
- Locked elements should be clearly distinguishable but not frustrating (show silhouettes or locked icons)
- Must work smoothly on desktop and mobile devices (touch-friendly, responsive layout)
- Page should load quickly (under 1 second) even with many elements
- Unlocking animations should be satisfying but brief (1-2 seconds max)
- Navigation between card view and album view should be seamless
- Text content must be age-appropriate and engaging for kids 7-12

**Data & State:**
- Inputs:
  - Event/card ID
  - Player's progress data for this card (which elements are unlocked)
  - Available elements for this card (stickers, animations, facts)
  - Trigger actions (mini-game completion, successful defense)
- Outputs:
  - Updated unlock progress for the card
  - Mastery status (percentage or count of unlocked elements)
  - Visual display of locked and unlocked elements
- State rules:
  - Elements remain unlocked permanently once earned
  - Unlock progress is saved per player per card
  - Mastery requires unlocking all elements for a card
  - Unlocks are triggered by specific achievements (game completion, defense success)

**Validation & Edge Cases:**
- Card has no album elements defined: show message "Album coming soon" or hide album button
- Player unlocks the same element twice: ignore duplicate unlock, show already-unlocked state
- Player views album before unlocking any elements: show all elements as locked with clear instructions
- Network failure during unlock: save unlock locally, sync when connection restored
- Player refreshes page while viewing album: album state persists correctly
- Multiple unlocks happen simultaneously (e.g., completing game unlocks 3 elements): show all unlocks in sequence
- Album page accessed on very small screen: layout adapts to show elements in scrollable grid

**Assumptions:**
- Each event card has predefined album elements (stickers, animations, facts)
- Elements are tagged with unlock conditions (e.g., "unlock after first mini-game win")
- Album elements are stored in the database or event data structure
- Player progress is tracked in a persistent store (database, local storage, or both)
- Unlocks are triggered by events in the game logic (not manually by players)
- Album elements include metadata (images, text, animation files, etc.)
- Stickers are static images, animations are GIFs or lightweight animated SVGs
- Fun facts are short text snippets (1-3 sentences, kid-friendly)

**Out of Scope (for this story):**
- Trading or sharing unlocked elements with other players
- Customizing the album layout or design
- Creating new album elements (content authoring tools)
- Album-wide achievements or rewards spanning multiple cards
- Sound effects for unlocking elements
- Detailed statistics on unlock rates or time to mastery
- Social features (showing off albums, comparing with friends)
- Printing or exporting the album
- Localization of album content

**Acceptance Criteria (Gherkin-style):**
- Given I view an event card, when I look at the interaction options, then I see multiple buttons including "Album"
- Given I click the "Album" button on a card, when the album page loads, then I see a grid or layout of locked and unlocked elements
- Given I have unlocked some elements for a card, when I view the album, then unlocked elements are clearly visible and distinct from locked ones
- Given I complete a mini-game for the first time, when the game ends, then at least one album element is unlocked and I see a notification
- Given I successfully defend a card from attack, when the defense ends, then at least one album element is unlocked
- Given I unlock all elements for a card, when I view the card or album, then the card is marked as "Mastered"
- Given I view the album on mobile, when I interact with elements, then the page is responsive and touch-friendly
