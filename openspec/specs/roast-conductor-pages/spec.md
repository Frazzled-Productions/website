# roast-conductor-pages Specification

## Purpose
The Roast Conductor product page, the sample recipe page and the shared frame around every page under
`/roast-conductor`, as they behave on `main` at 3c6ba06. Written from code on 2 November 2026 and
describes what is true today, not what should be. Rechecked on 3 November 2026 against `main` at
b063fed: the commits since 3c6ba06 change only dependencies and CI, so every citation still holds.
The repo has no automated tests for these pages: CI runs lint, type-check and build only. The support
and privacy page bodies are outside this capability. Rendered output was checked against the live
site on 2 November 2026, whose deployment is the one GitHub records for 3c6ba06
(`dpl_FEkfk6twnkZUB7mVREvth1896hw9`), and the 404 and prerender claims were rechecked live on
3 November 2026 against the deployment of b063fed.

## Requirements

### Requirement: Shared frame (baseline, current behaviour)
Every page under `/roast-conductor` SHALL render inside one frame: a header, a divider, a `main`
holding the page and a footer (`app/roast-conductor/layout.tsx:6-12`, `:13`, `:32`, `:34`, `:36`).
This includes the sample recipe, although the layout's comment names only product, support and
privacy (`app/roast-conductor/layout.tsx:3`).

#### Scenario: Sample recipe gets the frame
- **WHEN** a visitor opens `/roast-conductor/sample-recipe`
- **THEN** the recipe appears inside the same header, `main` and footer as the product page

### Requirement: Unknown paths get no frame (baseline, current behaviour)
A path under `/roast-conductor` with no page SHALL return HTTP 404 with the framework's default
not-found screen, without the Roast Conductor header, navigation or footer and with no link anywhere,
because the repo has no `not-found` file. It SHALL carry the root layout's description and a
`noindex` robots tag (live `/roast-conductor/does-not-exist`, 2 and 3 November 2026).

#### Scenario: Mistyped address
- **WHEN** a visitor opens `/roast-conductor/does-not-exist`
- **THEN** the response is 404 and the page offers no header, navigation, footer or way back

### Requirement: Two titles on the bare 404 (baseline, current behaviour)
The served `head` of that 404 SHALL hold two `title` elements in this order: the root layout's
"Frazzled Productions", then "404: This page could not be found." (live
`/roast-conductor/does-not-exist`, 3 November 2026). What the tab shows after hydration has not been
checked in a browser.

#### Scenario: Title in the served 404
- **WHEN** a client reads the document title from the served 404 HTML
- **THEN** it is "Frazzled Productions", the first `title` element

### Requirement: Link back to the studio (baseline, current behaviour)
The header SHALL show "Frazzled Productions" as a link to `/` (`app/roast-conductor/layout.tsx:14-20`).

#### Scenario: Leaving for the studio home page
- **WHEN** a visitor selects "Frazzled Productions" in the header
- **THEN** they go to the home page at `/`

### Requirement: Section navigation (baseline, current behaviour)
The header SHALL hold a navigation landmark labelled "Roast Conductor" with exactly three links, in
order: "Roast Conductor" to `/roast-conductor`, "Support" to `/roast-conductor/support` and "Privacy
policy" to `/roast-conductor/privacy` (`app/roast-conductor/layout.tsx:21-29`). The sample recipe
SHALL NOT be in it, and no link marks the current page.

#### Scenario: Support reached directly
- **WHEN** a visitor arrives on `/roast-conductor/support` from App Store Connect
- **THEN** the navigation offers the product page and the privacy policy

#### Scenario: Sample recipe not offered
- **WHEN** a visitor reads the navigation on any Roast Conductor page
- **THEN** no navigation link goes to `/roast-conductor/sample-recipe`

### Requirement: Company footer (baseline, current behaviour)
The footer SHALL state "FRAZZLED PRODUCTIONS LTD", "Company No. 17258540" and "71-75 Shelton Street,
Covent Garden, London, WC2H 9JQ" as plain text, with no links (`app/roast-conductor/layout.tsx:36-43`).

#### Scenario: Footer on every page
- **WHEN** any page under `/roast-conductor` renders
- **THEN** its footer shows the company name, number and address

### Requirement: Site-wide additions from the root layout (baseline, current behaviour)
These pages SHALL inherit the root layout: `lang="en"`, the cursor glow and Vercel Analytics
(`app/layout.tsx:35`, `:39`, `:41`), plus the grid background and CRT scanlines from the site
stylesheet (`app/layout.tsx:5`, `app/globals.css:12-36`). The frame SHALL set Inter as the base font
(`app/roast-conductor/layout.tsx:12`).

#### Scenario: Visit counted
- **WHEN** a visitor loads the product page
- **THEN** the root layout's Analytics component is on the page

### Requirement: Static pages (baseline, current behaviour)
The three page and layout files SHALL fetch no data, take no input and contain no client component of
their own (`app/roast-conductor/layout.tsx:1`, `app/roast-conductor/page.tsx:1-2`,
`app/roast-conductor/sample-recipe/page.tsx:1-2`), so the pages SHALL be prerendered.

#### Scenario: Same page for everyone
- **WHEN** a visitor requests `/roast-conductor/sample-recipe`
- **THEN** the response is the prerendered page, marked `x-nextjs-prerender: 1` on the live site

### Requirement: Product page metadata (baseline, current behaviour)
The product page SHALL set the title "Roast Conductor | Frazzled Productions" and a description
naming the Sunday roast, Christmas dinner, Thanksgiving, one-oven clash fixes, alarms through silent
mode, widgets, Siri and an Apple Watch app (`app/roast-conductor/page.tsx:4-8`). It SHALL set no
other metadata.

#### Scenario: Browser tab
- **WHEN** `/roast-conductor` is open
- **THEN** the document title is "Roast Conductor | Frazzled Productions"

### Requirement: Product page heading and App Store link (baseline, current behaviour)
The product page SHALL open with the heading "Roast Conductor" and a pill reading "On the App Store"
that is a plain link to `https://apps.apple.com/app/id6821368790`, opening in the same tab and firing
no analytics event (`app/roast-conductor/page.tsx:72-90`). An introduction SHALL follow, describing
an iPhone and iPad app that plans backwards from the time you want to eat
(`app/roast-conductor/page.tsx:91-98`).

#### Scenario: Going to the App Store
- **WHEN** a visitor selects "On the App Store"
- **THEN** the same tab goes to the App Store listing for id 6821368790, and no custom event is recorded

### Requirement: Feature cards (baseline, current behaviour)
The product page SHALL show eight cards in this order, from one list: "Planned backwards from serving
time", "One oven, no clashes", "Alarms that ring on silent", "Running late? Not done yet?",
"Christmas, Easter and Thanksgiving", "A hand in the kitchen", "Share the plan" and "Widgets, Siri,
iPad and Apple Watch" (`app/roast-conductor/page.tsx:10-43`), in one column on narrow screens and two
from the `sm` breakpoint (`app/roast-conductor/page.tsx:100-114`).

#### Scenario: Cards render from the list
- **WHEN** the product page renders
- **THEN** each of the eight features appears as a card with its title as a level 2 heading and its
  body below

### Requirement: What the feature cards promise (baseline, current behaviour)
The card bodies SHALL make the app promises in the scenarios below
(`app/roast-conductor/page.tsx:11-42`). Neither the cards nor the metadata description SHALL say which
features need the unlock: only the pricing section does.

#### Scenario: Planning promises
- **WHEN** a visitor reads the first two cards
- **THEN** they promise steps from preheating to dishing up, jobs the day before, defrosting a frozen
  turkey, a warning and a suggested fix for oven clashes, and a dial setting for an oven that runs hot
  or cool

#### Scenario: Cooking promises
- **WHEN** a visitor reads the next two cards
- **THEN** they promise alarms through silent mode and Focus, a Live Activity on the Lock Screen and in
  the Dynamic Island, one tap to move every step not yet started, and extra minutes at a check

#### Scenario: Seasonal promises
- **WHEN** a visitor reads the fifth card
- **THEN** it promises Christmas and Easter themes, a Christmas app icon, ready-made Christmas dinner,
  Easter lunch and Burns Night supper menus, and in the US a Thanksgiving menu with °F, pounds and US
  cuts

#### Scenario: Helper promises
- **WHEN** a visitor reads the last three cards
- **THEN** they promise tips, a Day before list, fridge and leftovers reminders, sharing as a picture,
  printable PDF or plain text, Home Screen and Lock Screen widgets, asking Siri what is next, an iPad
  layout and an Apple Watch app

#### Scenario: Apple Watch before the pricing section
- **WHEN** a visitor reads the "Widgets, Siri, iPad and Apple Watch" card
- **THEN** it describes the Apple Watch app with no mention of the unlock, which the pricing section
  requires for it

### Requirement: What the page says is free (baseline, current behaviour)
Under "Free, with a one-time unlock", the product page SHALL list as free, with every built-in dish
and cut of meat: any number of menus of up to four dishes each, the planner with oven clash fixes and
running late, cook mode alarms and the Live Activity, widgets with Siri, Shortcuts and the iPad
layout, starters and puddings, tips with the Day before list and reminders, sharing as a picture,
PDF or text, and the Christmas and Easter themes (`app/roast-conductor/page.tsx:45-54`, `:117-123`).

#### Scenario: Free list
- **WHEN** a visitor reads the pricing section
- **THEN** eight items appear under "Free, with every built-in dish and cut of meat:"

### Requirement: Unlock price (baseline, current behaviour)
The product page SHALL state "A single £2.99 purchase adds:" with no country qualifier
(`app/roast-conductor/page.tsx:124`). The price is hard-coded and does not vary by visitor. Issue #62
records the difference from the support page.

#### Scenario: Price shown to every visitor
- **WHEN** a visitor anywhere opens the product page
- **THEN** the price reads £2.99

### Requirement: What the page says the unlock adds (baseline, current behaviour)
The product page SHALL list ten items after the price: unlimited dishes, recipes from links (a pasted
link or method, read on the device, with the cook checking every step), custom dishes, up to three
ovens, the air fryer and microwave, reverse sear and slow roast, make-ahead sides, course timing
with moving dishes and sharing jobs among helpers, any number of guests with a shopping list, and
the Apple Watch app (`app/roast-conductor/page.tsx:56-67`, `:125-129`).

#### Scenario: Unlock list
- **WHEN** a visitor reads the pricing section
- **THEN** ten items appear under the price, ending with the Apple Watch app

### Requirement: Business model statement (baseline, current behaviour)
The product page SHALL state "No subscription, no account and no adverts."
(`app/roast-conductor/page.tsx:130`).

#### Scenario: Reading the pricing section
- **WHEN** a visitor reads to the end of the unlock list
- **THEN** that sentence follows it

### Requirement: Timing guidance statement (baseline, current behaviour)
The product page SHALL state that timings come from published UK guidance, USDA guidance in the US
edition, that they are a guide, and that every meat dish ends with a reminder to check it is cooked
through (`app/roast-conductor/page.tsx:131-135`).

#### Scenario: Food safety wording
- **WHEN** a visitor reads the pricing section
- **THEN** the page says timings are a guide and names the reminder to check meat is cooked through

### Requirement: Device requirements and onward links (baseline, current behaviour)
The product page SHALL state that the app needs an iPhone or iPad with iOS or iPadOS 26.1 or later
and that the Apple Watch app works alongside an iPhone, and SHALL link to `/roast-conductor/support`
and `/roast-conductor/privacy` from the closing paragraph (`app/roast-conductor/page.tsx:136-141`).

#### Scenario: Looking for help
- **WHEN** a visitor reaches the end of the product page
- **THEN** inline links lead to support and to the privacy policy

### Requirement: How the sample recipe is reached (baseline, current behaviour)
The only link to `/roast-conductor/sample-recipe` in the site SHALL be on the support page
(`app/roast-conductor/support/page.tsx:136`). The page SHALL exist as a stable recipe the studio
controls, for App Review and testers to try the app's recipe import
(`app/roast-conductor/sample-recipe/page.tsx:4-6`). The product page links to it nowhere.

#### Scenario: Finding the sample recipe
- **WHEN** a visitor reads the support page's "Can I try recipe links?" answer
- **THEN** it links to the sample recipe

### Requirement: Sample recipe metadata (baseline, current behaviour)
The sample recipe SHALL set the title "Sample recipe: crisp roast potatoes | Roast Conductor" and a
description naming trying recipe links, crisp roast potatoes and serves 4
(`app/roast-conductor/sample-recipe/page.tsx:51-55`). It SHALL set no other metadata, so nothing asks
search engines to leave it out.

#### Scenario: Browser tab on the sample recipe
- **WHEN** `/roast-conductor/sample-recipe` is open
- **THEN** the document title is "Sample recipe: crisp roast potatoes | Roast Conductor"

### Requirement: Sample recipe instructions (baseline, current behaviour)
Below a "Sample recipe" label and the heading "Crisp roast potatoes", the page SHALL link to
`/roast-conductor` and tell the reader to copy the page's address, add a dish in the app and choose
"From a recipe link", and SHALL say the app reads the method, turns it into timed steps to check and
fits them into the plan (`app/roast-conductor/sample-recipe/page.tsx:66-84`). That is not the app's
label (issue #61).

#### Scenario: Reading the instruction
- **WHEN** a tester opens the sample recipe
- **THEN** the page names "From a recipe link" in bold as the control to choose

### Requirement: Sample recipe is silent on the unlock (baseline, current behaviour)
The sample recipe SHALL NOT say recipe links need the unlock, although the product and support pages
do (`app/roast-conductor/page.tsx:58`, `app/roast-conductor/support/page.tsx:140-141`).

#### Scenario: Free tester
- **WHEN** a visitor without the unlock reads the sample recipe
- **THEN** nothing on the page tells them the import is a paid feature

### Requirement: Sample recipe content (baseline, current behaviour)
The page SHALL show "Serves 4. Preparation 15 minutes, cooking about 1 hour."
(`app/roast-conductor/sample-recipe/page.tsx:85-87`), four ingredients as a bulleted list (`:12-17`,
`:89-94`) under the heading "Ingredients", seven steps as a numbered list (`:19-27`, `:96-101`) under
the heading "Method", and a closing note that ovens vary, so check the potatoes towards the end
(`:103-106`).

#### Scenario: Numbered method
- **WHEN** the page renders
- **THEN** seven method steps appear in order, from heating the oven to serving hot

### Requirement: Sample recipe structured data (baseline, current behaviour)
The page SHALL embed one `application/ld+json` script of schema.org type `Recipe` in the `article`, not
the document head, with `<` escaped as `\u003c` (`app/roast-conductor/sample-recipe/page.tsx:59-65`).
It SHALL carry the name, a description, the page URL, the Organization author "Frazzled Productions",
the yield, `prepTime` PT15M, `cookTime` PT1H, `totalTime` PT1H15M, category "Side dish" and cuisine
"British" (`app/roast-conductor/sample-recipe/page.tsx:8-10`, `:29-42`).

#### Scenario: Yield shared between page and data
- **WHEN** the page renders
- **THEN** "Serves 4" comes from the one `recipeYield` constant in both the visible text and the JSON-LD

### Requirement: Structured data outside this page (baseline, current behaviour)
The JSON-LD URL SHALL be `https://frazzledproductions.com/roast-conductor/sample-recipe` on every
deployment, previews included
(`app/roast-conductor/sample-recipe/page.tsx:8`). The app's importer tests SHALL use their own copy of
this JSON-LD as a fixture (roast-conductor
`RoastEngine/Tests/RoastEngineTests/Fixtures/plain-object-howto-steps.html`).

#### Scenario: Page changes, app tests do not
- **WHEN** the sample recipe's JSON-LD changes on the website
- **THEN** the app's importer tests still run against the old copy and do not fail

### Requirement: Structured data shares the visible lists (baseline, current behaviour)
`recipeIngredient` and `recipeInstructions` (as numbered `HowToStep`s) SHALL come from the same lists
as the visible page (`app/roast-conductor/sample-recipe/page.tsx:43-48`, `:91`, `:98`). The times and
the visible heading are separate literals, so those can differ from the data
(`app/roast-conductor/sample-recipe/page.tsx:38-40`, `:76`, `:86`).

#### Scenario: Importer reads the method
- **WHEN** a tool parses the page's JSON-LD
- **THEN** it finds a Recipe with seven HowToStep entries matching the visible method, positions 1 to 7

## Clarifications

### 2 November 2026
- **Landing before adoption.** The website has not adopted OpenSpec (website #50), so this file has no
  `config.yaml` beside it. Ruled by Fraser on 2 November 2026: land now on one review after a rebase,
  and #50 adopts it as it stands.
- **Shared frame ownership.** `layout.tsx` also frames the support and privacy pages, and the
  `app-legal-and-support-pages` baseline (website #64, replaced by #85) has its own "Roast Conductor
  frame" requirement describing the same header, navigation, `main` and footer. The two agree today.
  Recommendation: this capability owns the frame and that one owns the page bodies; whichever of the
  two lands second, or #50's adoption, drops the duplicate. Open for Fraser.

### 3 November 2026
- **Rebase and review.** Rebased onto `main` at b063fed with no conflicts. One review checked every
  file:line citation against the rebased code and the fixture path in roast-conductor; all hold, so
  no requirement changed.
- **`mb-3` on the sample recipe label.** The label's `mb-3` has no effect
  (`app/roast-conductor/sample-recipe/page.tsx:67`): in the live stylesheet `.mb-3` sits inside
  `@layer utilities` and `.rc-prose p` is unlayered (`app/globals.css:228-232`), and unlayered rules win,
  so the margin is 1rem, not 0.75rem. Read from the CSS, not measured in a browser. Recommendation: no
  issue for a 4px difference; drop the class when the page is next edited.
- **Bare 404 under `/roast-conductor`.** A mistyped address, including one from an old link, gets the
  framework's default screen with no way back to the site. Recommendation: treat it as a site-wide
  gap, not a Roast Conductor one, and add a root `not-found` only if a visitor report or a broken
  inbound link shows it matters; no issue filed.
- **Two titles on the bare 404.** A second review found the served 404 has the root title
  "Frazzled Productions" before "404: This page could not be found." (bytes 892 and 1124 of the live
  HTML), so the requirement now records both. Whether the tab reads the 404 title after hydration
  was not checked in a browser; open for Fraser only if it matters, and a root `not-found` would
  settle it either way.
