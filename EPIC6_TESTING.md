# Epic 6: Defense Mini-Game - Testing Guide

## Test Environment
- Development server running at: http://localhost:3001
- Game page: http://localhost:3001/game/test-session

## Attacked Events Available for Testing

1. **The Printing Press** (evt-top-002) - Level 0 event
2. **Black Death** (evt-l1-103) - Level 1 event (drill into "The Printing Press")
3. **World War II Ends** (evt-l1-304) - Level 1 event (drill into "The Airplane")

## Test Cases

### Story 6.1: Conditional Game Loading

**Test 1: Quiz loads when event is attacked**
- Navigate to game page
- Click on "The Printing Press" event (red/attacked)
- Verify: Game tab auto-loads with defense quiz
- Expected: Quiz interface appears with 5 questions

**Test 2: Normal content loads when event is safe**
- Click on "The Wheel" event (green/safe)
- Click "Game" button
- Verify: Regular game placeholder appears
- Expected: "Play Game (Coming Soon)" message

**Test 3: Normal content loads when event is threatened**
- Click on "The Great Pyramid" event (yellow/threatened)
- Click "Game" button
- Verify: Regular game placeholder appears
- Expected: "Play Game (Coming Soon)" message

### Story 6.2: UI Lockdown During Attack

**Test 4: Auto-switch to Game tab**
- Click on "The Printing Press" event (attacked)
- Verify: Game tab automatically becomes active
- Expected: Quiz loads immediately without manual tab click

**Test 5: Story tab is locked**
- While viewing attacked event
- Click "Story" button
- Verify: Button appears disabled/locked with lock icon
- Expected: Warning message appears: "Complete the defense first to access other content!"

**Test 6: Related tab is locked**
- While viewing attacked event with related items
- Click "Related" button
- Verify: Button appears disabled/locked with lock icon
- Expected: Warning message appears

**Test 7: Event content is redacted**
- View attacked event in CardPanel
- Verify: Event details are hidden
- Expected: Red "Under Attack!" warning box
- Expected: Redacted content placeholder (gray bars)
- Expected: Message: "Event details are hidden to ensure a fair defense"

### Story 6.3: Quiz Game Integration

**Test 8: Quiz displays 5 questions**
- Select attacked event
- Verify: Quiz shows "Question 1 of 5"
- Expected: Progress bar shows 20% complete

**Test 9: Question format is correct**
- Verify each question has:
  - Clear question text
  - 2-4 multiple choice answers (labeled A, B, C, D)
  - Answer buttons are clickable
  - Submit button appears

**Test 10: Progress indicator updates**
- Answer first question correctly
- Verify: Progress updates to "Question 2 of 5"
- Expected: Progress bar shows 40% complete

**Test 11: Questions are generated from event content**
- Review all 5 questions
- Verify questions relate to:
  - Event year/date
  - Historical era
  - Story content
  - Fun facts
  - Event title

**Test 12: Kid-friendly design**
- Review quiz UI
- Verify:
  - Large, readable text
  - Clear visual feedback
  - Touch-friendly buttons (min 44px height)
  - Encouraging messages

### Story 6.4: Answer Validation & Outcome

**Test 13: Correct answer proceeds to next question**
- Select correct answer
- Click "Submit Answer"
- Verify: Green feedback appears
- Expected: "Correct! Moving to next question..."
- Expected: Automatically advances after 1.5s

**Test 14: Incorrect answer ends quiz**
- Answer question incorrectly
- Click "Submit Answer"
- Verify: Red feedback appears
- Expected: "Incorrect. The event has been corrupted."
- Expected: Quiz ends after 2s
- Expected: Failure screen appears

**Test 15: All correct answers = success**
- Answer all 5 questions correctly
- Verify: Success screen appears
- Expected: Green checkmark icon
- Expected: "Event Defended!" message
- Expected: "Great work! You successfully defended [Event Title] from corruption."

**Test 16: Event state returns to safe after success**
- Complete quiz successfully
- Wait for outcome screen to clear (3s)
- Verify: Event dot on timeline changes from red to green
- Expected: Event state updates to "safe"
- Expected: Story/Related tabs become unlocked
- Expected: Event details become visible again

**Test 17: Event remains corrupted after failure**
- Answer question incorrectly
- Wait for failure screen
- Verify: Event remains in attacked state
- Expected: Event dot stays red
- Expected: Tabs remain locked
- Expected: Quiz can be retried

**Test 18: Event state persists across selection**
- Successfully defend an event
- Click on another event
- Click back on defended event
- Verify: Event remains in "safe" state
- Expected: No quiz appears
- Expected: Regular content is accessible

### Story 6.2 (continued): Segment Navigation with Attacked Events

**Test 19: Drill-down reveals attacked events**
- Click on "The Printing Press" segment to drill down
- Verify: "Black Death" event appears in red (attacked)
- Click on "Black Death"
- Expected: Defense quiz loads

**Test 20: Navigation preserves attack states**
- Drill into a segment
- Note attacked events
- Navigate back
- Drill in again
- Verify: Attack states remain unchanged

## Edge Cases

**Test 21: Mobile responsiveness**
- Resize browser to mobile width (375px)
- Test quiz on attacked event
- Verify:
  - Quiz is readable and usable
  - Buttons are touch-friendly
  - Progress bar displays correctly
  - Outcome screens fit on screen

**Test 22: Multiple quiz attempts**
- Fail a quiz (incorrect answer)
- Try the same event again
- Verify: Quiz generates new randomized questions
- Expected: Answer order is shuffled

**Test 23: Game tab auto-switches on event change**
- View safe event with Story tab active
- Click on attacked event
- Verify: Automatically switches to Game tab
- Expected: Quiz loads immediately

## Success Criteria

All tests must pass for Epic 6 to be considered fully functional:
- Quiz loads for attacked events only
- UI lockdown prevents cheating
- All 5 questions display correctly
- Answer validation works (correct/incorrect)
- Defense outcomes update event state
- State changes persist and re-render properly
- Navigation doesn't break defense features

## Known Issues (if any)

None identified after restoration.

## Restoration Changes Made

1. **eventStateManager.ts**: Changed from `sampleEvents` to `allHierarchicalEvents` to use correct data source
2. **hierarchicalEvents.ts**: Added game triggers to all events for consistency
3. All Epic 6 components verified working with hierarchical events system
