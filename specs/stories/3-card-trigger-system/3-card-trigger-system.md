### User Story 3

**Number:** `3`
**ID:** `BA-US-card-trigger-system`
**Role:** `player`
**Story:** `As a player, I want to view detailed information about a selected historical event on a card and click trigger buttons to access additional content so that I can explore the event in depth and engage with educational materials.`

**Context / Background:**
- This epic covers the card display in the left column and the trigger button system
- Once a player selects a dot on the arc, the card appears in the left column
- The card shows the event/invention name, image, short description, and metadata
- Trigger buttons on the right edge of the card allow the player to load related content in the right column
- For MVP, we'll implement 2-3 trigger buttons (e.g., "Story/Context", "Related Items", "Mini-game")
- This is the core of the educational content delivery

**Functional Requirements:**
1. Display a card in the left column when an event is selected or previewed
2. Show event name, image, short description, and metadata on the card
3. Display 2-3 trigger buttons vertically aligned on the right edge of the card
4. Clicking a trigger button loads corresponding content in the right column
5. Highlight the active trigger button to indicate which content is currently showing

**Non-Functional / UX Requirements:**
- Card must be readable and visually appealing for kids
- Images should be appropriately sized and load quickly
- Trigger buttons must be clearly labeled and kid-friendly
- Buttons must be large enough for touch interaction (minimum 44px height)
- Card layout should be responsive and work on mobile (stacked or tabbed layout)

**Data & State:**
- Inputs: Event data (name, description, image URL, metadata), available triggers for this event
- Outputs: Rendered card in left column, active trigger highlighted
- State rules: One card is displayed at a time; one trigger can be active at a time

**Validation & Edge Cases:**
- Missing image: show placeholder image
- Missing description: show "No description available"
- No triggers available: show message or hide trigger section
- Very long description: truncate or provide "read more" link
- Mobile: ensure card and triggers are fully accessible on small screens

**Assumptions:**
- MVP will have 5-10 sample events with card data pre-populated
- Each event has at least 2 triggers available
- Card data includes text and at least one image
- Trigger content is pre-defined for each event (not dynamically generated)

**Out of Scope (for this story):**
- Dynamic content generation based on player progress or AI
- Editing or customizing card content
- User-generated content or comments
- Social sharing or collaboration features
- Time bandit attack UI on cards (future iteration)

**Acceptance Criteria (Gherkin-style):**
- Given I select a dot on the arc, when the card loads in the left column, then I see the event name, image, description, and metadata clearly displayed
- Given the card is displayed, when I look at the right edge of the card, then I see 2-3 trigger buttons vertically aligned
- Given I click a trigger button, when the click registers, then the corresponding content loads in the right column and the trigger button is highlighted
- Given I'm on mobile, when the card loads, then the card content and trigger buttons are fully visible and tappable
