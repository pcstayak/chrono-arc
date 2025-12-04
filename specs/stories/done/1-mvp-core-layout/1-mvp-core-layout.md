### User Story 1

**Number:** `1`
**ID:** `BA-US-mvp-core-layout`
**Role:** `player`
**Story:** `As a player, I want to see a clean three-section layout (header, content area, footer with timeline arc) when I open the game so that I can immediately understand the game structure and begin interacting with historical content.`

**Context / Background:**
- This is the foundational layout for the entire MVP
- Must work on both desktop and mobile devices
- No authentication or landing page - player goes directly to the game
- The layout establishes the visual structure that all other features build upon
- Desktop-first design with responsive behavior for tablets and phones

**Functional Requirements:**
1. Display a persistent header at the top showing the game title "Chrono Arc"
2. Display a two-column content area in the middle (left column ~35-40%, right column ~60-65%)
3. Display a persistent footer at the bottom containing the timeline arc visualization
4. All three sections must be visible simultaneously on desktop screens
5. On mobile devices, provide a collapsible/tab-based approach for the two-column area while keeping the arc visible

**Non-Functional / UX Requirements:**
- Must be responsive and work on desktop (1920x1080+), tablet (768x1024), and mobile (375x667+) viewports
- Header should occupy approximately 10-12% of viewport height
- Footer should occupy approximately 15-20% of viewport height
- Content area fills the remaining space between header and footer
- Layout must be clean, uncluttered, and kid-friendly with clear visual hierarchy
- Text must be readable (minimum 14px font size for body text, larger for headings)

**Data & State:**
- Inputs: Browser viewport dimensions
- Outputs: Rendered layout with correct proportions
- State rules: Layout proportions adjust based on viewport size

**Validation & Edge Cases:**
- Very small screens (< 375px width): ensure layout doesn't break, content remains accessible
- Very wide screens (> 2560px): layout should remain centered or use max-width constraints
- Portrait vs landscape orientation on mobile: adapt column layout appropriately
- Window resize: layout should respond smoothly without content jump

**Assumptions:**
- Modern web browsers with CSS Grid or Flexbox support
- JavaScript is enabled for interactive features (though basic layout should work without it)
- Players will primarily use Chrome, Firefox, Safari, or Edge browsers
- No need for IE11 support

**Out of Scope (for this story):**
- Specific content within header, footer, or content columns (covered in child stories)
- Interactive behaviors (covered in subsequent epics)
- Loading states or error handling
- User preferences for layout customization
- Accessibility features beyond basic semantic HTML

**Acceptance Criteria (Gherkin-style):**
- Given I open the game URL in a desktop browser, when the page loads, then I see a header, two-column content area, and footer with timeline arc all visible simultaneously
- Given I open the game on a mobile device in portrait mode, when the page loads, then I see the header, a single-column content area (or tabbed), and the timeline arc footer
- Given I resize my browser window from desktop to mobile width, when the resize completes, then the layout adapts smoothly without breaking
- Given I view the page on a tablet in landscape mode, when the page loads, then the two-column layout is preserved with appropriate spacing
