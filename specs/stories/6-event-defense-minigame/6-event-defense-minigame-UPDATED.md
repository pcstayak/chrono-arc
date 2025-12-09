### User Story 6 (UPDATED)

**Number:** `6`
**ID:** `BA-US-event-defense-minigame`
**Role:** `player`
**Story:** `As a player, I want to defend historical events from time bandit attacks by playing various educational mini-games related to the event so that I can prevent the event from being corrupted and progress in the game.`

**Context / Background:**
- This epic introduces the core defense gameplay mechanic where events can be attacked by "time bandits"
- When an event is attacked, the player must prove their knowledge through one of five different mini-game types
- Each mini-game type tests different cognitive skills: sequencing, recall, pattern recognition, categorization, and reasoning
- The mini-game type is selected based on event characteristics and difficulty progression
- Success in defending an event requires completion of the mini-game challenge
- This mechanic creates tension and stakes, motivating players to thoroughly explore events before attacks occur
- Educational goal: Reinforce science and history learning through varied retrieval and reasoning exercises
- Game design goal: Create engagement through diverse challenges and consequence (lose the event if defense fails)
- **UPDATED:** Expanded from single quiz format to five distinct mini-game types for variety and educational depth

**Functional Requirements:**
1. Dynamically select and load appropriate mini-game type based on event and game state
2. Lock the UI to focus player attention on defense when an event is under attack
3. Integrate five distinct mini-game types:
   - Chronological Sequence Puzzle
   - Fact Matching / Fill-in-the-Blanks
   - Restoration / Spot the Anomaly
   - Metadata Classification Challenge
   - Cause-and-Effect Chain Builder
4. Validate player performance and determine if the event is successfully defended
5. Return final outcome (defended or not defended) after mini-game completion
6. Hide sensitive event information during attack to prevent looking up answers
7. Provide visual feedback when event is successfully defended (green arc point)

**Non-Functional / UX Requirements:**
- All mini-game interfaces must be simple and readable for kids aged 7-12
- Content and instructions must use age-appropriate language
- Mini-games must work smoothly on desktop and mobile devices (touch-friendly interactions)
- Transition from exploration mode to defense mode should be clear and understandable
- The stakes (losing the event) should be communicated clearly but not in a scary way
- Response time for interaction validation should be immediate (under 200ms)
- Mini-game loading should not cause noticeable delay (under 1 second)
- Variety in mini-game types prevents repetition fatigue

**Data & State:**
- Inputs:
  - Event security status (safe/threatened/attacked)
  - Event content and facts for mini-game generation
  - Event characteristics (era, tags, difficulty, hierarchy level)
  - Player's exploration history for this event (what they've already seen)
  - Current game state (progress, previously encountered mini-game types)
- Outputs:
  - Selected mini-game type for this defense
  - Defense outcome (event defended or not defended)
  - Updated event security status after defense attempt
  - Player feedback on performance
  - Score or progress updates based on defense performance
- State rules:
  - An event can only be attacked if it has been unlocked/explored by the player
  - Once defense begins, the player cannot leave until mini-game is complete or failed
  - Defense outcome is permanent (cannot retry immediately after failure)
  - Successfully defended events display as green on timeline arc
  - Successfully defended events may have a "cooldown" before they can be attacked again

**Validation & Edge Cases:**
- Event attacked before player has explored it: should not happen (prevent in game logic)
- Player refreshes browser during defense: should resume defense or treat as abandonment
- Network failure during mini-game: should save progress locally and allow resume
- Multiple events attacked simultaneously: only one defense at a time (queue others or prevent scenario)
- Player tries to switch tabs/navigate away during defense: prevent or show warning
- Event content is too sparse to generate mini-game: fallback to simpler mini-game type or generic questions
- Mini-game type selection yields same type repeatedly: implement variety tracking to ensure diversity

**Assumptions:**
- Events contain structured content (facts, dates, people, concepts) suitable for mini-game generation
- Mini-games can be generated algorithmically or use pre-authored content tagged to events
- The game has a mechanism to trigger "attacks" on events (separate from this epic)
- Event security status is managed by game state logic (not part of this epic)
- Player has explored the event sufficiently before it can be attacked (enforced elsewhere)
- Mini-game components exist or will be built as part of this epic
- A "right-side column" layout is established in the UI for housing the mini-game interface
- Failure in a mini-game results in event loss (no "lives" or retry system within a single defense)
- Different mini-game types have different difficulty levels and suit different event types

**Out of Scope (for this story):**
- Triggering/scheduling attacks (when and why events get attacked)
- Detailed score calculation or rewards beyond successful defense
- Animation or visual effects for attacks/defense beyond basic transitions
- Sound effects or music for defense mode
- Leaderboards or defense statistics
- Hints or help systems during mini-games
- Content authoring tools for mini-game questions
- Localization of mini-game content
- Accessibility features beyond basic readability
- Multiplayer attack/defense coordination

**Acceptance Criteria (Gherkin-style):**
- Given an event is marked as "attacked", when I view the event card, then I see one of five mini-game types instead of normal event details
- Given an event is marked as "safe", when I view the event card, then I see normal event exploration interface with no mini-game
- Given an event is under attack, when I view the UI, then all tabs except the game interface are locked/disabled
- Given I am in defense mode, when I successfully complete the mini-game, then the event is marked as "defended" and returns to safe status
- Given I am in defense mode, when I fail the mini-game challenge, then the event is marked as "not defended"
- Given I am in defense mode, when I try to view sensitive event information, then that information is hidden/unavailable
- Given I successfully defend an event, when I view the timeline arc, then the event's point is displayed in green
- Given I encounter multiple attacked events, when I defend them, then I experience variety in mini-game types (not always the same type)

**Child Stories:**
- 6.1: Conditional Game Loading (existing)
- 6.2: UI Lockdown During Attack (existing)
- 6.3: Quiz Game Integration (existing - represents one of five mini-game types)
- 6.4: Answer Validation and Outcome (existing)
- 6.5: Timeline Visual Attack Indicators (existing)
- 6.6: Cascade Effect Failed Defense (existing)
- 6.7: Epoch Quiz Return Card (existing)
- 6.8: Chronological Sequence Puzzle Mini-Game (NEW)
- 6.9: Fact Matching Mini-Game (NEW)
- 6.10: Spot the Anomaly Mini-Game (NEW)
- 6.11: Metadata Classification Mini-Game (NEW)
- 6.12: Cause-and-Effect Chain Builder Mini-Game (NEW)
- 6.13: Mini-Game Type Selection Logic (NEW)
- 6.14: Green Arc Indicator for Defended Events (NEW)
