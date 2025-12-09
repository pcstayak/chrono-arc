# Epic 6: Event Defense Mini-Game - Complete User Story Package

## Quick Navigation

### Start Here
- **[EPIC6-COMPREHENSIVE-SUMMARY.md](EPIC6-COMPREHENSIVE-SUMMARY.md)** - Complete overview of Epic 6 expansion

### Epic-Level Story
- **[6-event-defense-minigame-UPDATED.md](6-event-defense-minigame-UPDATED.md)** - Parent story defining expanded scope

---

## Story Organization

### Core Infrastructure Stories (Implement First)

#### 6.13 - Mini-Game Type Selection Logic 🔴 CRITICAL
**File:** `6.13-minigame-type-selection-logic.md`
**Status:** NEW - Not yet implemented
**Priority:** HIGHEST - Required before other mini-games work
**Description:** Intelligent selection algorithm that chooses appropriate mini-game type based on event characteristics, difficulty, and variety tracking
**Dependencies:** None
**Estimated Effort:** Large (core algorithm + suitability scoring)

#### 6.14 - Green Arc Indicator for Defended Events 🟡 QUICK WIN
**File:** `6.14-green-arc-indicator-defended-events.md`
**Status:** NEW - Not yet implemented
**Priority:** HIGH - Visual feedback for player accomplishment
**Description:** Display successfully defended events as bright green on timeline arc
**Dependencies:** 6.4 (Answer Validation)
**Estimated Effort:** Small (visual enhancement)

---

### Existing Stories (Previously Implemented)

#### 6.1 - Conditional Game Loading ✅
**File:** `6.1-conditional-game-loading.md`
**Status:** Implemented
**Description:** Dynamically load defense interface based on event state

#### 6.2 - UI Lockdown During Attack ✅
**File:** `6.2-ui-lockdown-during-attack.md`
**Status:** Implemented
**Description:** Lock exploration tabs when event is under attack

#### 6.3 - Quiz Game Integration ✅ (UPDATED)
**Files:**
- `6.3-quiz-game-integration.md` (original)
- `6.3-quiz-game-integration-UPDATED.md` (updated version)
**Status:** Implemented, needs integration with selection logic
**Description:** Multiple-choice quiz mini-game (now ONE of five types, serves as universal fallback)

#### 6.4 - Answer Validation and Outcome ✅
**File:** `6.4-answer-validation-and-outcome.md`
**Status:** Implemented
**Description:** Validate player performance and update event state

#### 6.5 - Timeline Visual Attack Indicators ✅
**File:** `6.5-timeline-visual-attack-indicators.md`
**Status:** Implemented
**Description:** Display attacked events as red on timeline arc

#### 6.6 - Cascade Effect Failed Defense ✅
**File:** `6.6-cascade-effect-failed-defense.md`
**Status:** Implemented
**Description:** Handle consequences of failed defense

#### 6.7 - Epoch Quiz Return Card ✅
**File:** `6.7-epoch-quiz-return-card.md`
**Status:** Implemented
**Description:** Special handling for event card return after defense

---

### New Mini-Game Type Stories (Implement in Priority Order)

#### 6.9 - Fact Matching Mini-Game 🟢 PRIORITY 1
**File:** `6.9-fact-matching-minigame.md`
**Status:** NEW - Not yet implemented
**Priority:** MEDIUM-HIGH
**Description:** Drag missing words from word bank into blanks in event description
**Why First:** Simpler drag-drop implementation, high educational value
**Dependencies:** 6.13 (Selection Logic), drag-drop library
**Estimated Effort:** Medium

#### 6.11 - Metadata Classification Mini-Game 🟢 PRIORITY 2
**File:** `6.11-metadata-classification-minigame.md`
**Status:** NEW - Not yet implemented
**Priority:** MEDIUM
**Description:** Sort fact cards into categories (related/unrelated, true/false, etc.)
**Why Second:** Moderate complexity, engaging gameplay
**Dependencies:** 6.13 (Selection Logic), drag-drop library
**Estimated Effort:** Medium

#### 6.8 - Chronological Sequence Puzzle 🟡 PRIORITY 3
**File:** `6.8-chronological-sequence-puzzle.md`
**Status:** NEW - Not yet implemented
**Priority:** MEDIUM
**Description:** Arrange shuffled event steps/phases in correct chronological order
**Why Third:** More complex drag-drop with validation
**Dependencies:** 6.13 (Selection Logic), drag-drop library
**Estimated Effort:** Medium-Large

#### 6.12 - Cause-and-Effect Chain Builder 🟡 PRIORITY 4
**File:** `6.12-cause-effect-chain-builder.md`
**Status:** NEW - Not yet implemented
**Priority:** MEDIUM-LOW
**Description:** Connect causes and effects to central attacked event
**Why Fourth:** Graph-like complexity with connection drawing
**Dependencies:** 6.13 (Selection Logic), line-drawing capability
**Estimated Effort:** Large

#### 6.10 - Spot the Anomaly Mini-Game 🔴 PRIORITY 5
**File:** `6.10-spot-the-anomaly-minigame.md`
**Status:** NEW - Not yet implemented
**Priority:** LOW (initially)
**Description:** Find and click historical errors/anachronisms in visual or text scene
**Why Last:** Requires visual assets or rich text generation
**Dependencies:** 6.13 (Selection Logic), visual assets or enhanced text generator
**Estimated Effort:** Large (content creation heavy)

---

## Implementation Roadmap

### Phase 1: Foundation (ALREADY COMPLETE ✅)
- Stories 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7 are implemented
- Current state: Single quiz-based defense working

### Phase 2: Core Expansion (NEXT SPRINT)
1. **Implement 6.13** - Mini-Game Type Selection Logic
   - Build suitability scoring algorithms
   - Implement variety tracking
   - Create content validation system
   - Integrate with existing defense loading

2. **Implement 6.14** - Green Arc Indicator
   - Add "defended" state to event state model
   - Update timeline arc rendering
   - Add visual feedback transitions

3. **Update 6.3** - Integrate Quiz with Selection
   - Modify Quiz to work with selection system
   - Ensure Quiz serves as universal fallback

### Phase 3: Mini-Game Rollout (SUBSEQUENT SPRINTS)
**Sprint 1:** Fact Matching (6.9)
**Sprint 2:** Metadata Classification (6.11)
**Sprint 3:** Chronological Sequence (6.8)
**Sprint 4:** Cause-Effect Chain (6.12)
**Sprint 5:** Spot the Anomaly (6.10) - when visual assets ready

### Phase 4: Polish and Balance
- Tune selection algorithm based on playtesting
- Improve distractor/error generation quality
- Add pre-authored content for complex events
- Gather analytics on mini-game variety and success rates

---

## Technical Requirements

### Dependencies to Install
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
# For drag-and-drop in Fact Matching, Classification, Sequence Puzzle
```

### Data Model Changes Required
```typescript
// types/domain.ts additions:
export type MiniGameType =
  | "sequence"
  | "fact_match"
  | "anomaly"
  | "classification"
  | "cause_effect"
  | "quiz";

export type TimelineEventState =
  | "safe"
  | "threatened"
  | "attacked"
  | "defended"  // NEW
  | "corrupted"; // NEW

export interface PlayerProgress {
  playerId: string;
  recentMiniGameTypes: MiniGameType[]; // Track last 5
  defenseHistory: DefenseRecord[];
}
```

### Component Structure
```
components/defense/
  DefenseContainer.tsx           # Main container
  MiniGameSelector.tsx          # 6.13 - Selection logic
  SequencePuzzle.tsx           # 6.8
  FactMatching.tsx             # 6.9
  SpotTheAnomaly.tsx           # 6.10
  MetadataClassification.tsx   # 6.11
  CauseEffectChain.tsx         # 6.12
  DefenseQuiz.tsx              # 6.3 (existing)
  DefenseOutcome.tsx           # Shared success/failure display
```

---

## Story Files Reference

### Updated Files (Use These)
- `6-event-defense-minigame-UPDATED.md` (not original `6-event-defense-minigame.md`)
- `6.3-quiz-game-integration-UPDATED.md` (not original `6.3-quiz-game-integration.md`)

### New Files
- `6.8-chronological-sequence-puzzle.md`
- `6.9-fact-matching-minigame.md`
- `6.10-spot-the-anomaly-minigame.md`
- `6.11-metadata-classification-minigame.md`
- `6.12-cause-effect-chain-builder.md`
- `6.13-minigame-type-selection-logic.md`
- `6.14-green-arc-indicator-defended-events.md`

### Existing Files (No Changes Needed)
- `6.1-conditional-game-loading.md`
- `6.2-ui-lockdown-during-attack.md`
- `6.4-answer-validation-and-outcome.md`
- `6.5-timeline-visual-attack-indicators.md`
- `6.6-cascade-effect-failed-defense.md`
- `6.7-epoch-quiz-return-card.md`

---

## Key Decisions for Stakeholders

### 1. Content Authoring Strategy
**Question:** Should mini-games use algorithmic generation or pre-authored content?
**Recommendation:** Start with algorithmic generation for MVP, add pre-authored content for high-value events

### 2. Failure Tolerance
**Question:** Should all mini-game types require 100% accuracy (0 mistakes), or vary by type?
**Current Spec:**
- Sequence Puzzle: 0 mistakes (any error = failure)
- Fact Matching: 0 mistakes
- Spot Anomaly: 0 mistakes
- Classification: 0-1 mistakes allowed
- Cause-Effect: 0-1 mistakes allowed
- Quiz: 0 mistakes (any wrong answer = failure)

### 3. Visual Asset Budget
**Question:** Can we create illustrated scenes for Spot the Anomaly, or use text-based version?
**Recommendation:** Start with text-based version, add visuals incrementally

### 4. Multiplayer Synchronization
**Question:** Should defended state sync across all players in a session?
**Recommendation:** Yes - shared timeline should show same defended events for all players

### 5. Retry Mechanics
**Question:** Can players retry failed defenses, or is failure permanent until next attack?
**Current Spec:** Failure is permanent for that attack instance
**Consideration:** May want "cooldown" before allowing retry

---

## Success Metrics to Track

### Variety Metrics
- Distribution of mini-game types per player session
- Average time between seeing the same mini-game type
- Player completion rates per mini-game type

### Educational Metrics
- Knowledge retention after defending events
- Correlation between mini-game type and learning outcomes
- Player engagement time per mini-game type

### Balance Metrics
- Success rate per mini-game type
- Difficulty-to-success-rate correlation
- Selection algorithm accuracy (right type for right event)

---

## Developer Onboarding Checklist

- [ ] Read `EPIC6-COMPREHENSIVE-SUMMARY.md`
- [ ] Review `6.13-minigame-type-selection-logic.md` (core algorithm)
- [ ] Review `6-event-defense-minigame-UPDATED.md` (epic scope)
- [ ] Understand existing defense implementation (stories 6.1-6.7)
- [ ] Review data model changes required
- [ ] Set up drag-and-drop library
- [ ] Implement selection logic (Story 6.13)
- [ ] Implement green arc indicator (Story 6.14)
- [ ] Roll out mini-games in priority order (6.9 → 6.11 → 6.8 → 6.12 → 6.10)

---

## Questions or Issues?

All user stories include:
- ✅ Detailed functional requirements
- ✅ Edge cases and validation rules
- ✅ Data & state specifications
- ✅ Acceptance criteria (Gherkin-style)
- ✅ Assumptions and constraints
- ✅ Out-of-scope items

If anything is unclear or needs refinement, refer to the specific story file or request clarification from the Business Analyst.

---

**Total Stories:** 14 (7 existing/updated, 7 new)
**Status:** Ready for Development
**Last Updated:** 2025-12-08
**Location:** `C:\Users\simon\OneDrive\Документы\AI\Projects\Games\chrono-arc\specs\stories\6-event-defense-minigame\`
