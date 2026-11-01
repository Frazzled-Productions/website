# studio-home-page Specification

## Purpose

The public home page of frazzledproductions.com: the studio's hero, About, Projects, optional Support, Contact and footer, plus the shared document shell, theme and animated effects they sit on. This is a baseline: it records what the code does today, not what it should do, and it includes behaviour already filed as a bug (linked where it applies). Written from the code at commit 3c6ba06, and every `file:line` refers to that commit. The repo has no automated tests for this capability; CI runs lint, typecheck and build only (`.github/workflows/ci.yml:24-26`). The Ko-fi modal behind the Support button and the analytics behind the click events are other capabilities (`support-the-studio`, `site-privacy-and-analytics`) and are named here only where the home page touches them.

## Requirements

### Requirement: Document shell

The root layout SHALL wrap every page in an English-language document with the Orbitron, Space Grotesk and Inter font variables, render the cursor glow before the page content and the analytics component after it, and give the site the default title "Frazzled Productions" and description "Software for the fun of it."

Source: `app/layout.tsx:7-21`, `app/layout.tsx:23-26`, `app/layout.tsx:33-43`

#### Scenario: Home page metadata

- **WHEN** a visitor or crawler loads `/`
- **THEN** the title is "Frazzled Productions", the meta description is "Software for the fun of it." and the `html` element has `lang="en"`

#### Scenario: No social preview tags

- **WHEN** the home page metadata is read
- **THEN** it defines only a title and description, with no Open Graph or Twitter fields of its own

### Requirement: Synthwave theme and backdrop

The global stylesheet SHALL define the site palette as CSS variables, paint the body in the dark background with a 60px faint purple grid, and overlay fixed CRT scanlines that do not intercept pointer input.

Source: `app/globals.css:3-10`, `app/globals.css:12-19`, `app/globals.css:22-35`

#### Scenario: Backdrop on load

- **WHEN** any page renders
- **THEN** the body background is `#12001f` with 60px grid lines, and scanlines cover the viewport at z-index 9999 with `pointer-events: none`

### Requirement: Cursor glow

The site SHALL show a 120px purple radial glow, centred on the mouse pointer and following every `mousemove`, which starts off-screen and never intercepts pointer input.

Source: `app/components/CursorGlow.tsx:7-16`, `app/components/CursorGlow.tsx:18-29`

#### Scenario: Before the mouse moves

- **WHEN** the page has loaded and no `mousemove` has fired
- **THEN** the glow sits at top and left -120px, off-screen

#### Scenario: Mouse moves

- **WHEN** the mouse moves to (x, y)
- **THEN** the glow's left and top are set to x - 60 and y - 60 pixels

### Requirement: Section order

The home page SHALL render, in order: hero, About, Projects, Support when configured, Contact and footer, with a gradient divider rule before each of About, Projects, Support and Contact.

Source: `app/page.tsx:16-17`, `app/page.tsx:34-37`, `app/page.tsx:55-58`, `app/page.tsx:123-128`, `app/page.tsx:148-151`, `app/page.tsx:167-168`, `app/globals.css:102-107`

#### Scenario: Ko-fi not configured

- **WHEN** the page renders without `KOFI_URL`
- **THEN** the order is hero, About, Projects, Contact, footer, with three dividers

#### Scenario: Ko-fi configured

- **WHEN** the page renders with `KOFI_URL` set
- **THEN** Support appears between Projects and Contact, with four dividers

### Requirement: Hero

The hero SHALL fill at least the viewport height and show a centred `h1` reading "Frazzled" and "Productions" on two lines, in uppercase Orbitron, sized up across breakpoints, with a looping 9 second neon flicker.

Source: `app/page.tsx:17-25`, `app/globals.css:38-53`

#### Scenario: Flicker cycle

- **WHEN** the home page is open
- **THEN** the heading's purple glow drops out and its opacity falls to 0.75 at 20%, 24% and 55% of each 9 second cycle, for as long as the page is open

### Requirement: Typed tagline

The hero SHALL type the tagline "Software for the fun of it." in the browser, one character every 55ms after a 600ms delay, in animated gradient text, showing a pulsing `|` cursor until typing ends. The server-rendered HTML SHALL contain the cursor and none of the tagline (#70). Once typing has started, the interval is not cleared by unmount or a text change (#71).

Source: `app/page.tsx:26-28`, `app/components/Typewriter.tsx:4-22`, `app/components/Typewriter.tsx:24-34`, `app/globals.css:56-69`

#### Scenario: Typing completes

- **WHEN** the page has hydrated and about 2 seconds have passed (600ms plus 27 characters at 55ms)
- **THEN** the full tagline is shown and the cursor is gone

#### Scenario: No JavaScript

- **WHEN** the page is viewed without JavaScript running
- **THEN** the tagline area shows only the `|` character

#### Scenario: Cursor colour

- **WHEN** the cursor is showing
- **THEN** it shows the inherited gradient rather than its own cyan, because `-webkit-text-fill-color: transparent` is inherited (`app/globals.css:66`, #71)

### Requirement: Horizon grid

The hero SHALL show, over its bottom 40%, a canvas grid of 40px cells tilted by CSS perspective and faded in from the top by a mask, with horizontal lines scrolling down one cell every 1500ms. It SHALL stop its animation frame, timer and resize listener on unmount.

Source: `app/page.tsx:29-31`, `app/globals.css:91-99`, `app/components/HorizonGrid.tsx:4-6`, `app/components/HorizonGrid.tsx:34-40`, `app/components/HorizonGrid.tsx:59-85`, `app/components/HorizonGrid.tsx:154-158`, `app/components/HorizonGrid.tsx:161-172`

#### Scenario: Grid scrolls

- **WHEN** the page is open
- **THEN** every animation frame redraws purple horizontal lines at alpha 0.7, offset by elapsed time, and fixed vertical lines at alpha 0.4

#### Scenario: Window resized

- **WHEN** the window is resized
- **THEN** the canvas drawing size is reset to its rendered size

### Requirement: Light cycle

On devices where `(hover: none)` does not match, the grid SHALL spawn a cyan light cycle 3000ms after load, and schedule the next spawn 8000 to 14000ms after each one ends. In practice only the first cycle is ever seen, because later spawns start past the canvas bottom and are discarded on their first frame (#67).

Source: `app/components/HorizonGrid.tsx:7`, `app/components/HorizonGrid.tsx:12-23`, `app/components/HorizonGrid.tsx:46-57`, `app/components/HorizonGrid.tsx:87-117`, `app/components/HorizonGrid.tsx:119-147`

#### Scenario: Touch device

- **WHEN** `(hover: none)` matches
- **THEN** no cycle is ever scheduled, and only the grid shows

#### Scenario: First cycle

- **WHEN** the page has been open 3 seconds on a pointer device
- **THEN** a cycle enters 20px beyond a random side at a grid-aligned height between 30% and 70% of the canvas, moves 2.5 canvas pixels per animation frame to a random column between 25% and 75% of the width, then turns up by 800px, drawing a glowing trail of at most 500 points and a white head while its path scrolls with the grid

#### Scenario: Cycle ends

- **WHEN** a cycle passes its last waypoint, or its drawn height leaves the canvas by more than 20px
- **THEN** it is removed

#### Scenario: Later spawns

- **WHEN** the page stays open for 10 minutes on a pointer device (simulated with the real effect at 60 fps and canvas sizes 1440x360, 1920x432 and 2560x576)
- **THEN** 52 to 57 spawns occur and only the first is ever drawn, ending between 6.4 and 16.3 seconds after load

### Requirement: About section

The home page SHALL show an About section describing Frazzled Productions as an independent software studio based in London, currently shipping Poké Memory and Roast Conductor on iPhone and iPad. It SHALL NOT mention Loop Year (#31).

Source: `app/page.tsx:37-53`

#### Scenario: About copy

- **WHEN** a visitor reads the About section
- **THEN** it names Poké Memory and Roast Conductor as shipping, and does not name Loop Year

### Requirement: Project cards

The Projects section SHALL list exactly two cards, each with a name, a "Live" badge and a short description: Poké Memory, linking to `https://pokememory.com` in a new tab with `noopener noreferrer` and firing the `pokememory_click` event; and Roast Conductor, an internal link to `/roast-conductor` with no click event. The Roast Conductor card calls it "An iPhone app" (#72).

Source: `app/page.tsx:58-121`, `app/components/TrackedLink.tsx:19-30`

#### Scenario: Poké Memory card clicked

- **WHEN** a visitor clicks the Poké Memory card
- **THEN** `pokememory_click` is tracked and `https://pokememory.com` opens in a new tab

#### Scenario: Roast Conductor card clicked

- **WHEN** a visitor clicks the Roast Conductor card
- **THEN** the site navigates to `/roast-conductor` in the same tab and no custom event is tracked

### Requirement: Project card effects

Project cards SHALL have a purple border and a box shadow pulsing on a 3 second loop. On hover, the border SHALL turn cyan, the shadow SHALL become a fixed cyan glow and the pulse SHALL pause.

Source: `app/globals.css:72-88`

#### Scenario: Card hovered

- **WHEN** the pointer is over a project card
- **THEN** the border is cyan, the shadow is the cyan glow, and the pulse animation is paused

### Requirement: Optional Support section

The Support section SHALL render only when the server-side `KOFI_URL` environment variable is non-empty, showing the "Support" heading, the self-funded explanation and a `SupportButton` given that URL.

Source: `app/page.tsx:8-11`, `app/page.tsx:123-146`, `.env.example:1-5`

#### Scenario: Blank value

- **WHEN** `KOFI_URL` is unset or empty
- **THEN** no Support heading, text, button or divider renders

#### Scenario: Value set

- **WHEN** `KOFI_URL` holds a URL
- **THEN** the section renders and the URL is passed to the button

### Requirement: Contact section

The Contact section SHALL show `hello@frazzledproductions.com` as a `mailto:` link in animated gradient text, dimming on hover.

Source: `app/page.tsx:151-165`

#### Scenario: Email clicked

- **WHEN** a visitor activates the address
- **THEN** the browser opens a `mailto:hello@frazzledproductions.com` link

### Requirement: Company footer

The footer SHALL show FRAZZLED PRODUCTIONS LTD, Company No. 17258540, the address 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ and an underlined internal link to `/privacy`, in extra-small text coloured `rgba(123, 47, 255, 0.5)`, which measures about 1.7:1 against the page background (#69).

Source: `app/page.tsx:168-179`, `app/globals.css:4`

#### Scenario: Footer shown

- **WHEN** a visitor reaches the bottom of the page
- **THEN** the company name, number, address and Privacy link are present in the low-contrast footer colour

#### Scenario: Privacy link

- **WHEN** a visitor activates Privacy
- **THEN** the site navigates to `/privacy`

### Requirement: Motion runs regardless of preference

All home page animation SHALL run whatever the visitor's motion preference: nothing in `app/` reads `prefers-reduced-motion` (#68).

Source: `app/globals.css:52`, `app/globals.css:68`, `app/globals.css:80`, `app/components/Typewriter.tsx:8-22`, `app/components/HorizonGrid.tsx:152`

#### Scenario: Reduced motion requested

- **WHEN** a visitor's system asks for reduced motion
- **THEN** the flicker, gradient shift, card pulse, typing, grid and light cycle all still run

## Clarifications

- 2026-11-02, open call: `app/components/CursorGlow.tsx` listens to `mousemove` with no touch guard, unlike HorizonGrid's `(hover: none)` check. Touch browsers normally send a compatibility `mousemove` on tap, so the glow may stick where a phone visitor tapped. This cannot be proven from code alone, so no requirement states it and no issue is filed. Recommendation: check on a phone when #68 is built, and file it if it shows.
- 2026-11-02, open call: `KOFI_URL` is read in a server component with no dynamic data, so Next.js probably fixes the value at build. A production build was not run here. If so, the code comment's "by setting KOFI_URL in Vercel" (`app/page.tsx:10`) also needs a redeploy. Recommendation: confirm when the Support section is next changed.
- 2026-11-02, open call: #31 still describes the old "coming soon" wording, which #52 fixed; only its Loop Year half is live. Recommendation: Fraser trims #31 to the Loop Year question.
- 2026-11-02, open call: the repo has not adopted OpenSpec (#50), so this PR holds only this spec file, with no `openspec/config.yaml` or change folder. Recommendation: land it with or after #50.
