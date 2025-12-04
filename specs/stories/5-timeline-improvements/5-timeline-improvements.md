### User Story 5

**Number:** `5`
**ID:** `BA-US-timeline-improvements`
**Role:** `player`
**Story:** `As a player, I want enhanced timeline features including hierarchical navigation, visible event labels, state indicators, and visual feedback so that I can efficiently navigate large timelines and understand the status of historical events at a glance.`

**Context / Background:**
- This epic enhances the basic timeline arc from Epic 2 with advanced features for scalability and gameplay
- As the game expands beyond 5-10 events to potentially hundreds of events, the timeline needs hierarchical organization
- Players need to see event states (safe/threatened/attacked) to understand game progression
- Labels and visual feedback help players understand what they're looking at without needing to hover or click
- These features prepare the timeline for multiplayer and time bandit attack mechanics
- Educational goal: help kids navigate complex historical timelines while maintaining context of what's happening in the game

**Functional Requirements:**
1. Support multi-level hierarchical timeline segments that can be clicked to drill down into sub-periods
2. Display event labels (date and name) directly on the timeline at all times
3. Show event state through color coding (safe, threatened, attacked)
4. Display parent segment colors as proportional stacks representing child event states
5. Show detailed segment information in hover popups
6. Provide navigation controls to return to parent levels after drilling down

**Non-Functional / UX Requirements:**
- All features must work seamlessly on both desktop and mobile devices
- Touch targets for segments must be large enough for kids to tap (minimum 32px)
- Colors must be distinguishable and accessible (consider color-blind friendly palettes)
- Labels must be readable without overlapping or cluttering the timeline
- Hierarchical navigation must be intuitive with clear visual feedback
- Performance must remain smooth even with many events (50-100+ per segment)
- Animations and transitions should be smooth but not slow down navigation

**Data & State:**
- Inputs:
  - Event data including hierarchical segment membership
  - Event states (safe/threatened/attacked)
  - Current drill-down level in the hierarchy
  - Segment definitions and boundaries
- Outputs:
  - Rendered timeline with appropriate events for current level
  - Visual state indicators on events and segments
  - Labels positioned along the arc
  - Hover popups with segment summaries
- State rules:
  - Only one hierarchical level is displayed at a time
  - Current drill-down path is tracked to enable back navigation
  - Event selection persists within a segment but resets when drilling down/up
  - Segment colors dynamically update based on child event states

**Validation & Edge Cases:**
- Empty segments: show message "No events in this period" and disable drill-down
- Single event in segment: segment should still be clickable but may show simplified popup
- All events in same state: segment shows single color (no stacking needed)
- Very long event names: truncate labels with ellipsis, show full name on hover
- Label overlap: implement smart positioning algorithm or abbreviate labels
- Maximum drill-down depth: prevent infinite nesting (e.g., max 3-4 levels)
- Top level back navigation: back button should be disabled or hidden at top level
- Rapid clicking on segments: debounce to prevent multiple rebuilds
- Mobile small screens: labels may need to be abbreviated or rotated

**Assumptions:**
- Events are pre-organized into hierarchical segments in the data model
- Each event belongs to exactly one segment at each hierarchical level
- Segment boundaries are predefined (e.g., centuries, eras, specific date ranges)
- State changes are managed by game logic external to the timeline component
- SVG rendering is used for the arc and supports layered color rendering
- For MVP, 3 hierarchical levels are sufficient (e.g., millennium > century > decade)
- Color palette is defined and consistent with the game's overall design system
- Performance testing will be done with realistic event counts (100-200 events)

**Out of Scope (for this story):**
- Dynamic segment creation based on event clustering
- User-customizable segment definitions
- Animated transitions between drill-down levels (may add later if time permits)
- Mini-map or overview showing position within hierarchy
- Search/filter functionality on the timeline
- Drag-to-rearrange events or segments
- Historical accuracy validation of segment boundaries
- Export or sharing timeline views
- Keyboard navigation shortcuts
- Advanced accessibility features (screen reader optimization, high contrast mode)

**Acceptance Criteria (Gherkin-style):**
- Given I view the timeline at the top level, when I look at the arc, then I see segments and key events with visible labels
- Given I hover over a segment, when my cursor is over the segment, then the segment highlights in orange and shows a popup with state counts
- Given I click on a segment, when the click registers, then the timeline rebuilds to show only events within that segment
- Given I have drilled down into a segment, when I click the back button, then the timeline returns to the parent level
- Given events are in different states, when I view the timeline, then event dots show appropriate colors (safe/threatened/attacked)
- Given a parent segment has child events in mixed states, when I view the segment, then I see proportional color stacking along the segment
- Given I'm on mobile, when I interact with the timeline, then all features (drill-down, back, hover/tap) work smoothly
