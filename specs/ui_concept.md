# Chrono Arc – UI/UX Specification (MVP)

This document defines the UI structure and interaction model for **Chrono Arc**, covering layout, modes, and core behaviors.  
It is intended for both UX design and frontend implementation.

---

## 1. Overall UI Structure

**Main layout:**
- **Header** (top, full width)
- **Content area** (two columns)
  - **Left Column:** Current card panel  
  - **Right Column:** Interactive content panel
- **Footer** (bottom, full width)
  - Contains the **Chrono Arc timeline** (curved log-like arc)

Viewport: desktop-first; responsive behaviors for tablet/mobile.

---

## 2. Layout Details

### 2.1 Header
**Height:** ~10–12% of viewport.

**Content:**
- Game title / logo (“Chrono Arc”)
- Session info (room code, player count)
- Current mode display (Browsing / Insert / TBD)
- Basic navigation / settings icon

---

### 2.2 Footer + Chrono Arc Timeline

**Footer height:** ~15–20% of viewport.

**Arc design:**
- Soft upward arc (Bezier or pseudo-logarithmic curve)
- Era markers placed along the arc (Prehistory → Digital)

**Event dots:**
- Represent individual events/inventions
- Dot states via color:
  - **New**
  - **Safe**
  - **In danger**
  - **Under attack**
- Hover → preview card in left panel  
- Click → select card (locks into left panel)

**Zooming:**
- Click on an era label or drag-select on the arc to zoom into that period
- Zooming:
  - Focuses and expands the era
  - Reveals more granular events inside the zoomed region
  - Other eras fade or compress
- Provide "Back to full arc" control

---

## 3. Content Area (Two Columns)

### 3.1 Left Column – Card Panel

**Width:** ~35–40% of content area  
**Behavior:** Fixed; always displays one focused card.

**Content:**
- Event/invention name
- Illustration or media thumbnail
- Short context text
- Metadata (era, tags such as “war”, “innovation”, “disease”)
- **Vertical trigger buttons** on the right edge of the card:
  - “Story / Context”
  - “Mini-game”
  - “Related items”
  - “Prepare defense” (if applicable)

**Interactions:**
- Hover on arc dot → load preview card
- Click arc dot → lock selected card in panel
- Insert mode → card panel shows the new card to place

---

### 3.2 Right Column – Interactive Panel

**Width:** ~60–65% of content area  
**Purpose:** Displays dynamic content tied to the selected card.

**Content types:**
- Mini-games (placement puzzle, context challenges)
- Extra materials (extended text, images, videos)
- Defense/quiz UI (when a card is under attack)
- Related inventions / sub-timelines

**Interaction model:**
- Clicking a trigger button on the left panel loads the corresponding view
- Highlight the active trigger
- Right panel switches views dynamically

---

## 4. Chrono Arc Interactions

### 4.1 Browsing Mode Interactions
- Hovering on dot → temporary preview in left panel  
- Clicking dot → select card, triggers appear on left card, right panel content available  
- Dot states visualized by color and animation (pulse/shake for “danger” and “attack”)  
- Zoom by clicking era or dragging over arc segment

### 4.2 Event States (Dot Colors)
- **New** – e.g., blue glow or pulse  
- **Safe** – neutral/green  
- **In danger** – yellow/orange pulse  
- **Under attack** – red pulse + bandit icon

### 4.3 Card Selection and Animation
- Selecting a dot causes:
  - Card slide-in or fade-in on the left  
  - Optional small halo/highlight on the selected dot  
- Arc zoom smoothly transitions when focusing a period

---

## 5. Modes of Operation

### 5.1 Mode 1 – Browsing Mode (Default)
- Timeline is fully interactive
- Left panel shows hovered/selected card
- Right panel displays supplemental content (story, extra materials, mini-games)
- If a card is in danger or under attack:
  - Warning visuals on the dot
  - “Prepare defense” option shown on the card
  - Defense mini-game launched in right column

---

### 5.2 Mode 2 – Insert Mode (Placing a New Card)
Triggered when new invention is unlocked.

**Left panel:**
- Shows the *new card* with title, art, and minimal description
- Card is clearly labeled “Place this event on the arc”

**Right panel:**
- Shows hints, context clues, or a context mini-game

**Arc behavior:**
- Player drags new card from left panel to a position on the arc  
- Snapping points appear along the arc  
- After placement:
  - Validation feedback appears (correct/incorrect)
  - Explanation unlocked
  - Event enters normal browsing state

---

### 5.3 Mode 3 – TBD (Future Expansion)
Potential uses:
- Full-screen defense/quiz mode
- Group game events
- Timeline comparison mode

UI structure must allow the **right column** to expand toward full-screen while keeping:
- A small minimized view of the left card
- A minimal arc reference

---

## 6. UX Guidelines for Designers & Developers

- Left card panel is always visible and acts as UI anchor  
- Right panel is context-sensitive and switches views via triggers on the left card  
- Arc is always visible in the footer (except in optional full-screen modes)  
- Hover = temporary preview; click = selection  
- All timeline zoom transitions should animate smoothly  
- Color and animation are primary channels for indicating “danger” and “attack”  
- On small screens:
  - Left card panel becomes collapsible  
  - Right panel becomes tab-based  
  - Arc remains visible but slightly simplified

---

## 7. Summary of Core Components

1. **Header** – Title, session info, mode indicator  
2. **Left Card Panel** – Selected or new event card  
3. **Right Interactive Panel** – Mini-games, extra content, defense  
4. **Footer with Chrono Arc** – Interactive log-like timeline, zoomable, stateful dots  
5. **Modes:** Browsing, Inserting, (future) Defense/Expanded modes

---

This specification provides a clear foundation for wireframes and initial frontend implementation.
