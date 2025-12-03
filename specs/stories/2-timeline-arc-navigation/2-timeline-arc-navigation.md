### User Story 2

**Number:** `2`
**ID:** `BA-US-timeline-arc-navigation`
**Role:** `player`
**Story:** `As a player, I want to see a visual timeline arc with interactive dots representing historical events so that I can explore history in chronological order and select events to learn more about them.`

**Context / Background:**
- This epic covers the core timeline visualization and navigation
- The arc is a soft upward Bezier curve representing time from ancient history to modern day
- Dots on the arc represent individual events/inventions
- Clicking a dot loads the corresponding card in the left column
- This is the primary navigation mechanism for the MVP
- Educational goal: help kids understand chronological relationships between events

**Functional Requirements:**
1. Render a curved timeline arc in the footer stretching horizontally across the viewport
2. Display event dots at appropriate positions along the arc representing historical events
3. Support clicking a dot to select an event (load card in left column)
4. Provide visual feedback for dot states (new, safe, in danger, under attack - MVP may only implement "safe" state)
5. Provide hover preview functionality (hover on dot shows preview in left column)

**Non-Functional / UX Requirements:**
- Arc curve must be smooth and visually appealing
- Dots must be large enough for kids to tap on mobile (minimum 32px tap target)
- Arc must scale appropriately on different screen sizes
- Hover interactions should be smooth with minimal delay
- Visual states should use color and simple animations (e.g., pulse) to indicate status

**Data & State:**
- Inputs: Timeline event data (event ID, name, date, position on arc)
- Outputs: Rendered arc with interactive dots
- State rules: One dot can be "selected" at a time; selected dot has visual highlight

**Validation & Edge Cases:**
- No events to display: show empty arc with message
- Very close events (dots overlap): ensure dots remain distinguishable and clickable
- Mobile small screen: dots may need to be slightly smaller but still tappable
- Selected dot is clicked again: no change (card remains loaded)

**Assumptions:**
- MVP will have 5-10 sample events to display on the arc
- Events are pre-positioned along the arc (no dynamic positioning based on complex date logic for MVP)
- For MVP, all dots are in "safe" state (danger/attack states deferred to future iteration)
- Arc curve is rendered using SVG or Canvas (implementation choice)

**Out of Scope (for this story):**
- Era markers and labels (deferred to future iteration)
- Zooming into specific time periods (deferred to future iteration)
- Drag-to-pan or scroll the arc (MVP shows full arc at once)
- Time bandit attacks or danger states (deferred)
- Animations for placing new events (Insert mode, future iteration)

**Acceptance Criteria (Gherkin-style):**
- Given I open the game, when the footer loads, then I see a curved timeline arc stretching horizontally across the footer
- Given the arc has event dots, when I look at the arc, then I see dots positioned along the curve representing historical events
- Given I click on a dot, when the click registers, then the corresponding card loads in the left column and the dot is visually highlighted
- Given I hover over a dot on desktop, when the hover is detected, then a preview of the card appears in the left column
- Given I'm on mobile and tap a dot, when the tap registers, then the card loads in the left column without requiring a hover preview
