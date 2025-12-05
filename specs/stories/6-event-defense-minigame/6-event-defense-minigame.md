### User Story 6

**Number:** `6`
**ID:** `BA-US-event-defense-minigame`
**Role:** `player`
**Story:** `As a player, I want to defend historical events from time bandit attacks by answering quiz questions about the event so that I can prevent the event from being corrupted and progress in the game.`

**Context / Background:**
- This epic introduces the core defense gameplay mechanic where events can be attacked by "time bandits"
- When an event is attacked, the player must prove their knowledge by answering quiz questions
- The quiz content is based on information the player learned while exploring the event before the attack
- Success in defending an event requires correct answers, reinforcing learning objectives
- This mechanic creates tension and stakes, motivating players to thoroughly explore events before attacks occur
- Educational goal: Reinforce science and history learning through retrieval practice (quiz questions)
- Game design goal: Create engagement through time-pressure and consequence (lose the event if defense fails)

**Functional Requirements:**
1. Dynamically load different game interfaces based on event security status (safe vs attacked)
2. Lock the UI to focus player attention on defense when an event is under attack
3. Integrate a quiz game that generates questions related to the attacked event
4. Validate player answers and determine if the event is successfully defended
5. Return final outcome (defended or not defended) after quiz completion
6. Hide sensitive event information during attack to prevent "cheating" by looking up answers

**Non-Functional / UX Requirements:**
- The quiz interface must be simple and readable for kids aged 7-12
- Questions and answers must use age-appropriate language
- Quiz must work smoothly on desktop and mobile devices (touch-friendly buttons)
- Transition from exploration mode to defense mode should be clear and understandable
- The stakes (losing the event) should be communicated clearly but not in a scary way
- Response time for answer validation should be immediate (under 200ms)
- Quiz loading should not cause noticeable delay (under 1 second)

**Data & State:**
- Inputs:
  - Event security status (safe/threatened/attacked)
  - Event content and facts for quiz generation
  - Player's exploration history for this event (what they've already seen)
  - Current game state (progress, score, unlocks)
- Outputs:
  - Defense outcome (event defended or not defended)
  - Updated event security status after defense attempt
  - Player feedback on correctness of each answer
  - Score or progress updates based on defense performance
- State rules:
  - An event can only be attacked if it has been unlocked/explored by the player
  - Once defense begins, the player cannot leave until quiz is complete or failed
  - Defense outcome is permanent (cannot retry immediately after failure)
  - Successfully defended events may have a "cooldown" before they can be attacked again

**Validation & Edge Cases:**
- Event attacked before player has explored it: should not happen (prevent in game logic)
- Player refreshes browser during defense: should resume defense or treat as abandonment (to be defined)
- Network failure during quiz: should save progress locally and allow resume
- Multiple events attacked simultaneously: only one defense at a time (queue others or prevent scenario)
- Player tries to switch tabs/navigate away during defense: prevent or show warning
- Quiz has insufficient questions for the event: should generate at least 3-5 questions minimum
- Event content is too sparse to generate good questions: fallback to generic history/science questions related to the era

**Assumptions:**
- Events contain structured content (facts, dates, people, concepts) suitable for quiz generation
- Quiz questions can be generated algorithmically or are pre-authored and tagged to events
- The game has a mechanism to trigger "attacks" on events (separate from this epic)
- Event security status is managed by game state logic (not part of this epic)
- Player has explored the event sufficiently before it can be attacked (enforced elsewhere)
- The quiz game component/library exists or will be built as part of this epic
- A "right-side column" layout is already established in the UI for housing the game interface
- Incorrect answers result in immediate failure (no "lives" or retry system within a single defense)

**Out of Scope (for this story):**
- Triggering/scheduling attacks (when and why events get attacked)
- Difficulty progression or adaptive question difficulty
- Multiplayer attack/defense mechanics
- Detailed score calculation or rewards for successful defense
- Animation or visual effects for attacks/defense
- Sound effects or music for quiz mode
- Leaderboards or defense statistics
- Hints or help systems during quiz
- Question pool management or content authoring tools
- Localization of quiz questions
- Accessibility features beyond basic readability (screen reader support, etc.)

**Acceptance Criteria (Gherkin-style):**
- Given an event is marked as "attacked", when I view the event card, then I see the quiz game interface instead of normal event details
- Given an event is marked as "safe", when I view the event card, then I see normal event exploration interface with no quiz
- Given an event is under attack, when I view the UI, then all tabs except the game interface are locked/disabled
- Given I am in defense mode, when I answer a quiz question correctly, then I see the next question
- Given I am in defense mode, when I answer a quiz question incorrectly, then the quiz ends and the event is marked as "not defended"
- Given I complete the quiz with all correct answers, when the quiz ends, then the event is marked as "defended" and returns to safe status
- Given I am in defense mode, when I try to view sensitive event information, then that information is hidden/unavailable
