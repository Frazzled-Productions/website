# support-the-studio Specification

## Purpose
The optional "Support the studio" donation mechanism on the company website: a Support section on
the home page and a Ko-fi panel in an on-page modal. This is the baseline of current behaviour,
written from the code on `main` at commit `3c6ba06` on 2 November 2026 and rechecked against `main` at
`b063fed` later the same day (no capability file changed in between). It records what is true
today, not what should be. No automated test covers this capability: the repo has no test files, and
CI runs lint, typecheck and build only (`.github/workflows/ci.yml:24-26`). The CI build of PR #84
lists `/` as static (`○`) under Next.js 16.4.3, and on 2 November 2026 the live home page answered
with `x-nextjs-prerender: 1` and `x-vercel-cache: HIT`.

## Requirements

### Requirement: Baseline - the Support section only renders when KOFI_URL is set
The home page SHALL read `KOFI_URL` from the server environment and SHALL render the Support section,
including its divider, only when the value is non-empty. The value is not validated, so any non-empty
string, including one of only spaces, counts as set. `KOFI_URL` is blank in `.env.example`.
Sources: `app/page.tsx:11`, `app/page.tsx:123-146`, `.env.example:3-5`, `README.md:38`.

#### Scenario: KOFI_URL unset or empty (baseline)
- **WHEN** the home page is rendered with `KOFI_URL` unset or empty
- **THEN** no Support heading, divider or "Support the studio" button appears on the page

#### Scenario: KOFI_URL set (baseline)
- **WHEN** the home page is rendered with `KOFI_URL=https://ko-fi.com/frazzledproductions`
- **THEN** the Support section appears, and the value is passed to `SupportButton` as `kofiUrl`

### Requirement: Baseline - the KOFI_URL value reaches the browser
`KOFI_URL` has no `NEXT_PUBLIC_` prefix, but the home page SHALL pass it to a client component, so the
value SHALL appear in the page payload sent to the browser.
Sources: `app/page.tsx:143`, `app/components/SupportButton.tsx:1`.

#### Scenario: Reading the page source (baseline)
- **WHEN** the home page is served with `KOFI_URL` set
- **THEN** the value is readable in the page's HTML source

### Requirement: Baseline - KOFI_URL takes effect when the home page is rendered at build
The home page SHALL NOT use any dynamic rendering API or dynamic route setting, so it is statically
rendered and SHALL take the `KOFI_URL` value present at build time. Setting the variable therefore needs
a new deployment, which the comment at `app/page.tsx:10` and `README.md:38` leave unsaid.
Sources: `app/page.tsx:7-11`, `app/layout.tsx:28-45`, `next.config.ts:3-5`.

#### Scenario: KOFI_URL changes on a deployed site (baseline)
- **WHEN** `KOFI_URL` is changed in Vercel and no new deployment is built
- **THEN** the live home page keeps showing or hiding the Support section as it did when last built

### Requirement: Baseline - Support section content and position
When rendered, the Support section SHALL sit between the Projects section and the Contact section,
after a divider. It SHALL contain the heading "Support", a paragraph that calls the studio independent
and self-funded and the contribution "Entirely optional, with no perks or strings", and the
`SupportButton`.
Sources: `app/page.tsx:121-123`, `app/page.tsx:125`, `app/page.tsx:128-144`, `app/page.tsx:150`.

#### Scenario: Reading the section (baseline)
- **WHEN** a visitor scrolls the home page with `KOFI_URL` set
- **THEN** they see "Support", the optional, no-perks paragraph and a "Support the studio" pill, then Contact

### Requirement: Baseline - the section offers no route to Ko-fi without JavaScript
The pill SHALL be in the prerendered HTML, but it is a button and the only link to Ko-fi is inside the
modal, so without JavaScript the section SHALL offer no route to Ko-fi.
Sources: `app/components/SupportButton.tsx:46-56`, `app/components/SupportButton.tsx:79-86`.

#### Scenario: JavaScript is off (baseline)
- **WHEN** a visitor with JavaScript off clicks "Support the studio"
- **THEN** nothing happens

### Requirement: Baseline - a click records support_click and opens the modal
`SupportButton` SHALL render a button labelled "Support the studio". Clicking it SHALL call Vercel
Analytics `track('support_click')` with no properties, and SHALL then open the modal. This is the
only analytics event in the capability: closing the modal and clicking the fallback link record
nothing.
Sources: `app/components/SupportButton.tsx:39-42`, `app/components/SupportButton.tsx:46-54`,
`app/components/SupportButton.tsx:79-86`, `app/layout.tsx:41`, `app/globals.css:110-127`.

#### Scenario: Visitor clicks the pill (baseline)
- **WHEN** a visitor clicks "Support the studio"
- **THEN** one `support_click` event is sent and the modal opens

#### Scenario: Visitor uses the fallback link (baseline)
- **WHEN** a visitor clicks the fallback link in the open modal
- **THEN** no further analytics event is sent

### Requirement: Baseline - nothing loads from Ko-fi until the modal opens
The Ko-fi iframe SHALL only be mounted while the modal is open, so the page SHALL make no Ko-fi request
before the click. The privacy notice makes the same statement.
Sources: `app/components/SupportButton.tsx:17`, `app/components/SupportButton.tsx:56`,
`app/components/SupportButton.tsx:74-78`, `app/privacy/page.tsx:106-107`.

#### Scenario: Page load without a click (baseline)
- **WHEN** the home page loads with `KOFI_URL` set and the visitor does not click the pill
- **THEN** no iframe exists in the page and nothing is requested from Ko-fi

### Requirement: Baseline - the embed URL is derived from KOFI_URL
The iframe `src` SHALL be `KOFI_URL` with one trailing slash removed, followed by
`/?hidefeed=true&widget=true&embed=true&preview=true`. The iframe SHALL have the title "Support
Frazzled Productions on Ko-fi" and SHALL set no `sandbox` or `allow` attribute.
Sources: `app/components/SupportButton.tsx:21`, `app/components/SupportButton.tsx:74-78`.

#### Scenario: Trailing slash in KOFI_URL (baseline)
- **WHEN** `KOFI_URL` is `https://ko-fi.com/frazzledproductions/`
- **THEN** the iframe `src` is `https://ko-fi.com/frazzledproductions/?hidefeed=true&widget=true&embed=true&preview=true`

### Requirement: Baseline - the modal is an on-page dialog over a blurred backdrop
The open modal SHALL be a full-viewport fixed backdrop with `role="dialog"`, `aria-modal="true"` and the
label "Support Frazzled Productions". Its stacking order SHALL be 10000, above the CRT scanline overlay at 9999.
It SHALL hold a panel of at most 420px wide and an iframe 580px high, and the backdrop SHALL scroll
vertically when the panel does not fit.
Sources: `app/components/SupportButton.tsx:57-64`, `app/globals.css:34`, `app/globals.css:130-164`.

#### Scenario: Panel taller than the viewport (baseline)
- **WHEN** the modal opens on a viewport shorter than the panel
- **THEN** the backdrop scrolls vertically and the visitor stays on the page

### Requirement: Baseline - a fallback link opens Ko-fi in a new tab
The panel SHALL show the link "Trouble loading? Open Ko-fi in a new tab" under the iframe. Its `href`
SHALL be `KOFI_URL` unchanged, opened in a new tab with `rel="noopener noreferrer"`.
Sources: `app/components/SupportButton.tsx:79-86`, `app/globals.css:182-193`.

#### Scenario: The iframe is blocked (baseline)
- **WHEN** the Ko-fi panel does not load inside the iframe and the visitor clicks the fallback link
- **THEN** the Ko-fi page opens in a new tab and the modal stays open on the site

### Requirement: Baseline - three ways to close the modal
The modal SHALL close from the Close button (a "×" with the label "Close"), from a click on the backdrop,
and from the Escape key while a keydown reaches the document. A click inside the panel SHALL NOT close
it.
Sources: `app/components/SupportButton.tsx:26-29`, `app/components/SupportButton.tsx:62`,
`app/components/SupportButton.tsx:64-73`.

#### Scenario: Backdrop click (baseline)
- **WHEN** a visitor clicks the backdrop outside the panel
- **THEN** the modal closes

#### Scenario: Click inside the panel (baseline)
- **WHEN** a visitor clicks the panel around the iframe
- **THEN** the modal stays open

#### Scenario: Escape with focus on the page (baseline)
- **WHEN** focus is on the Close button and the visitor presses Escape
- **THEN** the modal closes

### Requirement: Baseline - closing discards the Ko-fi panel
Closing the modal SHALL unmount the iframe with no confirmation, so anything entered in the Ko-fi panel
and not yet submitted is discarded. Closing SHALL NOT undo anything already submitted to Ko-fi.
Reopening SHALL load the panel afresh and record another `support_click`.
Sources: `app/components/SupportButton.tsx:39-42`, `app/components/SupportButton.tsx:56`,
`app/components/SupportButton.tsx:74-78`.

#### Scenario: Reopening after a backdrop click (baseline)
- **WHEN** a visitor part-fills the Ko-fi panel, clicks the backdrop, then clicks the pill again
- **THEN** a fresh panel loads without their entries and a second `support_click` is sent

### Requirement: Baseline - page scroll is locked and focus moves to Close while open
On opening, the modal SHALL set `overflow: hidden` on the document body, add its keydown listener and
move focus to the Close button. On closing, it SHALL clear the body overflow and remove the listener.
Sources: `app/components/SupportButton.tsx:23-37`, `app/components/SupportButton.tsx:66`.

#### Scenario: Open then close (baseline)
- **WHEN** a visitor opens the modal and then closes it
- **THEN** focus went to Close on opening, and the page scrolls again after closing

### Requirement: Baseline - keyboard focus is neither contained nor returned
The modal SHALL NOT contain Tab focus within the dialog, SHALL NOT mark the page behind it inert, and
SHALL NOT return focus to the "Support the studio" button on closing. The Escape listener is on the
parent document only, so a keypress inside the cross-origin Ko-fi iframe does not reach it.
Reported as issue #60.
Sources: `app/components/SupportButton.tsx:18`, `app/components/SupportButton.tsx:23-37`,
`app/components/SupportButton.tsx:44-89`.

#### Scenario: Tabbing past the dialog (baseline)
- **WHEN** a keyboard user keeps pressing Tab in the open modal
- **THEN** focus can leave the dialog for the page behind it

#### Scenario: Escape with focus in the iframe (baseline)
- **WHEN** focus is inside the Ko-fi iframe and the visitor presses Escape
- **THEN** the modal stays open

#### Scenario: Closing with the keyboard (baseline)
- **WHEN** a keyboard user closes the modal with the Close button or Escape
- **THEN** focus is not moved back to the "Support the studio" button

### Requirement: Baseline - the pill stays active behind the open modal
The "Support the studio" button SHALL stay focusable and active while the modal is open, directly before
the dialog in tab order, and pressing it SHALL record another `support_click` without reloading the panel.
Sources: `app/components/SupportButton.tsx:39-42`, `app/components/SupportButton.tsx:46-56`.

#### Scenario: Pressing the pill behind the open modal (baseline)
- **WHEN** a keyboard user presses Shift+Tab from Close, then Enter on "Support the studio"
- **THEN** a second `support_click` is sent, and the modal stays open with its panel unchanged

### Requirement: Baseline - the privacy notice describes the mechanism unconditionally
The `/privacy` page SHALL describe the "Support the studio" button, its link-click event and the Ko-fi
panel whether or not `KOFI_URL` is set, because it does not read the variable. Only the Ko-fi section
is conditional ("If the site shows"); "Link clicks" names the button without a condition.
Sources: `app/privacy/page.tsx:7`, `app/privacy/page.tsx:45-46`, `app/privacy/page.tsx:89-97`,
`app/privacy/page.tsx:99-121`.

#### Scenario: Privacy notice with KOFI_URL unset (baseline)
- **WHEN** a visitor reads `/privacy` on a site built with `KOFI_URL` unset
- **THEN** the Ko-fi sections are still present

## Clarifications

### 2 November 2026
- Is the Ko-fi launch gate still open? Issue #7 closed with its solicitor sign-off box unticked, and
  PR #8 made setting `KOFI_URL` the deliberate go-live step. That step has been taken: on 2 November 2026
  the live home page served the Support section with `kofiUrl` set to
  `https://ko-fi.com/frazzledproductions`. Recommendation: Fraser records whether the mechanism stays live
  and on what basis, and this spec's requirements stay silent on production state.
- Should the capability have tests? It has none. Recommendation: add them when a change first touches
  it, under spec on touch.
- This file lands ahead of OpenSpec adoption (issue #50, open, no adoption PR yet), so the repo has no
  `openspec/config.yaml` yet. Recommendation: keep the file as it is, because adoption can pick it up
  unchanged.

### 2 November 2026 (rebase recheck)
- Rebased onto `main` at `b063fed` (Next.js 16.2.7 to 16.4.3, React 19.3.1, CI action bumps). Of the files
  this spec cites, only `.github/workflows/ci.yml` changed (`actions/checkout` and `setup-node` v4 to
  v7 on lines 18-19); the cited lines 24-26 did not, and every file:line citation was rechecked and
  holds. The static-rendering
  evidence now names the 16.4.3 build.
- Review of the 2 November calls, per Fraser's ruling of 2 November 2026 (land on one review; #50
  adopts the file as it stands): the tests and adoption calls need no decision and stand as
  recommended. The launch-gate call stays open for Fraser: only he can record whether the live
  Support section stays live and on what basis (issue #7's unticked solicitor sign-off). It does not
  block this baseline, which describes code, not production state.
