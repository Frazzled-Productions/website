# site-privacy-and-analytics Specification

## Purpose
What frazzledproductions.com measures, what it loads from third parties, and what its own privacy
notice at `/privacy` tells visitors. Baseline read from the code at `main` commit `3c6ba06`
(`file:line` citations are to that commit); it describes what is true today, not what should be.
Rechecked at `main` `b063fed` on 2 November 2026: the commits since are dependency bumps, nothing
under `app/` changed, and `@vercel/analytics` is still 2.0.1.
The repo has no automated tests for this capability (no test files and no `test` script in
`package.json`), so every requirement comes from code. CI runs lint, typecheck and build only
(`.github/workflows/ci.yml:23-26`). The notice's statements about how Vercel and Ko-fi behave are
recorded here as what the page says: they cannot be checked from this repo. Where a statement cites
"live, 2 November 2026", it comes from read-only requests to the production site that day. The app
privacy policies (`/roast-conductor/privacy`, `/loop-year/privacy`) are covered only where they mention
the website.

## Requirements

### Requirement: Web Analytics runs on every route (baseline, current behaviour)
The root layout SHALL render the Vercel `<Analytics />` component, with no props, after the page
content, so it is present on every route of the site, including `/privacy` and everything under
`/roast-conductor` and `/loop-year`. It uses `@vercel/analytics` 2.0.1, with no consent step and no
`beforeSend` filter.

Source: `app/layout.tsx:3`, `app/layout.tsx:38-42`, `package-lock.json:2312-2313` (`:2425-2426` at `b063fed`).

#### Scenario: A visitor opens any page
- **WHEN** any route on the site renders
- **THEN** no consent prompt comes first, and once the page hydrates `<Analytics />` adds a deferred
  script to `document.head`; the component renders nothing itself, so the script is not in the
  server-rendered HTML (`node_modules/@vercel/analytics/dist/next/index.mjs:147-170`)

#### Scenario: A visitor moves between pages inside the site
- **WHEN** a visitor follows an in-site link to another route
- **THEN** another page view is sent for the new path, with no page reload
  (`node_modules/@vercel/analytics/dist/next/index.mjs:213-217`)

#### Scenario: An address with a query string
- **WHEN** a page is opened at an address with a query string
- **THEN** nothing in this repo removes the query string before the address reaches Vercel, because
  there is no `beforeSend` filter

#### Scenario: Production and development builds
- **WHEN** the site runs in production
- **THEN** the library loads the same-origin script `/_vercel/insights/script.js`
- **AND WHEN** it runs in development, it loads `https://va.vercel-scripts.com/v1/script.debug.js`
  instead (`node_modules/@vercel/analytics/dist/next/index.mjs:88-94`, version 2.0.1)

### Requirement: Exactly two custom click events (baseline, current behaviour)
The site SHALL send exactly two custom analytics events, each with a fixed name and no properties:
`pokememory_click` from the Poké Memory card on the home page and `support_click` from the "Support
the studio" button. No other code calls `track`.

Source: `app/page.tsx:65-67`, `app/components/TrackedLink.tsx:26`,
`app/components/SupportButton.tsx:40`.

#### Scenario: Poké Memory card clicked
- **WHEN** a visitor clicks the Poké Memory card on the home page
- **THEN** `track("pokememory_click")` is called with no properties

#### Scenario: A link with no event
- **WHEN** a visitor clicks the App Store link on `/roast-conductor`
  (`app/roast-conductor/page.tsx:80`) or the Roast Conductor card on the home page
  (`app/page.tsx:93-94`)
- **THEN** no custom event is sent

### Requirement: TrackedLink is a new-tab external anchor (baseline, current behaviour)
`TrackedLink` SHALL render an anchor with `target="_blank"` and `rel="noopener noreferrer"`, passing
through `href` and `className`, and SHALL call `track` with its `event` prop from the anchor's
`onClick` handler. It adds no URL parameters and has no behaviour other than the event. Its only use
is the Poké Memory card.

Source: `app/components/TrackedLink.tsx:19-30`, `app/page.tsx:3`, `app/page.tsx:65-69`.

#### Scenario: Clicking a TrackedLink
- **WHEN** a visitor clicks a `TrackedLink`
- **THEN** the event fires and the unchanged `href` opens in a new tab without an opener or referrer

#### Scenario: Opening a TrackedLink without a click event
- **WHEN** a visitor opens the link with the middle mouse button, or from the browser's context menu
- **THEN** the link opens but no event is sent, because only `onClick` is handled

### Requirement: Support section appears only when KOFI_URL is set (baseline, current behaviour)
The home page SHALL render the Support section and `SupportButton` only when the `KOFI_URL`
environment variable is non-empty. The page is prerendered, so the value is read at build time. The
variable is set in production: the live home page shows the button (live, 2 November 2026, with
`x-nextjs-prerender: 1` on the response).

Source: `app/page.tsx:11`, `app/page.tsx:123-146`, `.env.example:3-5`.

#### Scenario: KOFI_URL unset or empty
- **WHEN** `KOFI_URL` is unset or empty
- **THEN** the home page has no Support section, so no `support_click` event and no Ko-fi panel

#### Scenario: KOFI_URL changes
- **WHEN** `KOFI_URL` is changed in Vercel
- **THEN** the home page keeps its old state until the next deployment, although the comment at
  `app/page.tsx:8-10` says setting the variable is what makes the section go live

### Requirement: Nothing loads from Ko-fi until the button is clicked (baseline, current behaviour)
`SupportButton` SHALL mount the Ko-fi iframe only while its panel is open, and a click SHALL call
`track("support_click")` before opening it. The panel's new-tab fallback link sends no event. The rest
of the panel is the `support-the-studio` capability (baseline in website #63).

Source: `app/components/SupportButton.tsx:39-42`, `app/components/SupportButton.tsx:56`,
`app/components/SupportButton.tsx:74-86`.

#### Scenario: Before the click
- **WHEN** the home page has loaded and the button has not been clicked
- **THEN** no iframe exists and no request goes to Ko-fi from site code

#### Scenario: The panel is opened twice
- **WHEN** a visitor opens the panel, closes it and opens it again
- **THEN** `support_click` is sent once for each opening

#### Scenario: Panel closed
- **WHEN** the visitor clicks the backdrop or Close, or presses Escape with focus outside the iframe
- **THEN** the panel and its iframe are removed from the page
  (`app/components/SupportButton.tsx:27`, `app/components/SupportButton.tsx:62`,
  `app/components/SupportButton.tsx:70`)

### Requirement: No site code stores or collects visitor data (baseline, current behaviour)
Code under `app/` SHALL contain no `document.cookie`, `localStorage`, `sessionStorage`, `fetch()` call,
`sendBeacon`, `<form>`, `<input>`, `<textarea>` or `<img>`. Its only `<iframe>` is the Ko-fi panel and
its only `<script>` is inline JSON-LD on the sample recipe page. `next.config.ts` sets no headers.

Source: `app/components/SupportButton.tsx:74`, `app/roast-conductor/sample-recipe/page.tsx:60-65`,
`next.config.ts:3-5`.

#### Scenario: Searching the app code
- **WHEN** `app/` is searched for those storage, network and form terms
- **THEN** there are no matches in code, and the only `<iframe>` or `<script>` matches are the two
  cited above; the word "fetch" appears only as prose, in the Roast Conductor policy
  (`app/roast-conductor/privacy/page.tsx:29`, `:39`, `:188`), the Roast Conductor support page
  (`app/roast-conductor/support/page.tsx:210`) and the Loop Year support page
  (`app/loop-year/support/page.tsx:46`)

### Requirement: Fonts come from the site's own origin (baseline, current behaviour)
The root layout SHALL load its three fonts through `next/font/google`, which serves them from the site
itself, so a visitor's browser makes no request to Google for fonts. In production, apart from the
Ko-fi panel after a click, pages SHALL load no third-party script, style, font or image.

Source: `app/layout.tsx:2`, `app/layout.tsx:7-21`, `app/globals.css:1`.

#### Scenario: Loading the home page in production
- **WHEN** the home page's HTML is read
- **THEN** its fonts are under `/_next/static/media/`, there is no `fonts.googleapis.com` or
  `fonts.gstatic.com` address, and the only other hosts named are the Poké Memory link and the Ko-fi
  address held for the panel (live, 2 November 2026)

### Requirement: The notice page at /privacy (baseline, current behaviour)
`/privacy` SHALL be a server-rendered page titled "Privacy | Frazzled Productions" with a header link
to `/` and a company footer. Its summary SHALL say the site has no accounts, sign-up forms, adverts or
cookies, counts visits and clicks on a few links, and leaves Ko-fi support to Ko-fi.

Source: `app/privacy/page.tsx:4-8`, `app/privacy/page.tsx:20-26`, `app/privacy/page.tsx:37`,
`app/privacy/page.tsx:41-47`, `app/privacy/page.tsx:159-166`.

#### Scenario: Opening the notice
- **WHEN** a visitor opens `/privacy`
- **THEN** they see the summary first, then the sections Who we are, Visit statistics, Link clicks,
  Supporting us on Ko-fi, Our legal basis, Emailing us, Your rights and Changes to this notice

#### Scenario: How the page describes the analytics
- **WHEN** a reader reads the summary, or a search result shows the meta description
- **THEN** the summary says the analytics "does not identify you", and the description calls it
  cookie-free and the click counts anonymous

### Requirement: Notice names the controller and its scope (baseline, current behaviour)
The notice SHALL name Frazzled Productions Ltd (company number 17258540, 71-75 Shelton Street) as
data controller, give `hello@frazzledproductions.com` as the contact, say it covers
frazzledproductions.com only, and say each app's own policy is linked from that app's page.

Source: `app/privacy/page.tsx:10`, `app/privacy/page.tsx:49-60`.

#### Scenario: A Loop Year reader follows that statement
- **WHEN** a reader looks for a Loop Year page to find its policy
- **THEN** there is no `app/loop-year/page.tsx` and `/loop-year` returns 404 (live, 2 November 2026);
  the policy is reached from the navigation on `/loop-year/support` and `/loop-year/privacy`
  (`app/loop-year/layout.tsx:27-32`), and no page outside `/loop-year` links to either

#### Scenario: A Koinori or Poké Memory reader follows that statement
- **WHEN** a reader looks on this site for the page of the company's other apps
- **THEN** the Poké Memory card links out to `pokememory.com`, and nothing on the site links to
  Koinori; the only mention is a code comment (`app/page.tsx:65-69`, `app/privacy/page.tsx:13`)

### Requirement: Notice describes visit statistics (baseline, current behaviour)
The notice SHALL say that Vercel Web Analytics records, per page view, the time, page address,
referring site, rough location (country, region, city), device type, operating system and browser;
that it uses no cookies and stores nothing on the device; that Vercel distinguishes visits by a
request hash discarded after 24 hours; that only totals are visible; and that Vercel briefly processes
IP addresses to deliver and protect the site.

Source: `app/privacy/page.tsx:62-87`.

#### Scenario: Reading the analytics section
- **WHEN** a reader opens "Visit statistics (Vercel Web Analytics)"
- **THEN** those statements appear, with a link to Vercel's analytics privacy page

#### Scenario: Looking for how long records are kept
- **WHEN** a reader looks for how long analytics records are kept or where they are processed
- **THEN** the only period given is 24 hours for the hash, and no location is given; this looks like
  a bug: see Frazzled-Productions/website#76

### Requirement: Notice describes link clicks (baseline, current behaviour)
The notice SHALL say that clicks on "a few specific links", such as the Poké Memory link or the
"Support the studio" button, send an event with a fixed name, gives `pokememory_click` as the example,
and says the event carries nothing beyond the page-view details. This matches the two events in the
code.

Source: `app/privacy/page.tsx:89-97`, `app/page.tsx:67`, `app/components/SupportButton.tsx:40`.

#### Scenario: Comparing notice and code
- **WHEN** the notice's examples are compared with the `track` calls
- **THEN** both events it describes exist, and no event exists that it does not cover

#### Scenario: What the count measures
- **WHEN** the notice's "count how many visitors follow each link" is compared with the code
- **THEN** the code counts clicks, not visitors: a visitor who clicks twice sends two events

### Requirement: Notice describes Ko-fi (baseline, current behaviour)
The notice SHALL say the Ko-fi panel opens only on a click, that nothing loads from Ko-fi before it,
that what a supporter enters goes to Ko-fi and its payment providers under Ko-fi's own policy, that
Ko-fi may set its own cookies inside the panel, and that the company sees what Ko-fi passes on and uses
it only for thanks and financial records.

Source: `app/privacy/page.tsx:99-121`.

#### Scenario: The support button is not shown
- **WHEN** `KOFI_URL` is unset
- **THEN** the Ko-fi section is still on the page, worded "If the site shows" the button

### Requirement: Notice gives legal basis and email handling (baseline, current behaviour)
The notice SHALL give legitimate interest as the basis for visit statistics and link counts,
performing the request and legal duty for donations, and SHALL say emails are used to reply, kept as
long as the conversation needs, and provided through Google Workspace.

Source: `app/privacy/page.tsx:123-136`.

#### Scenario: Reading the legal basis
- **WHEN** a reader opens "Our legal basis"
- **THEN** statistics and link counts rest on legitimate interest, and donations on the request and
  on the duty to keep financial records

### Requirement: Notice gives rights with no complaint to the company (baseline, current behaviour)
The notice SHALL offer copy, correction, deletion and stopping use by email to
`hello@frazzledproductions.com`, replied to within one month, and complaint to the ICO. It has no
complaints sentence like the app policies'. This looks like a bug: see
Frazzled-Productions/website#65.

Source: `app/privacy/page.tsx:138-149`, compare `app/roast-conductor/privacy/page.tsx:228-231` and
`app/loop-year/privacy/page.tsx:209-212`.

#### Scenario: A visitor unhappy with data use
- **WHEN** a visitor reads "Your rights" to find how to complain
- **THEN** the only complaint route given is the ICO

### Requirement: Notice carries a fixed effective date (baseline, current behaviour)
The page SHALL show "Effective 17 October 2026" as literal text and say the page and date change
together if data handling changes. A code comment asks that any new third party updates the page in
the same PR; nothing enforces this. The page's only commit is dated 23 October 2026, after the date
shown (see Frazzled-Productions/website#65).

Source: `app/privacy/page.tsx:14-15`, `app/privacy/page.tsx:39`, `app/privacy/page.tsx:151-155`.

#### Scenario: Reading the date
- **WHEN** a reader opens the notice
- **THEN** it reads "Effective 17 October 2026", whatever the deploy date

### Requirement: Only the home footer links to the notice (baseline, current behaviour)
The home page footer SHALL be the only link to `/privacy`, although the app pages run the same
analytics. This looks like a bug: see Frazzled-Productions/website#66.

Source: `app/page.tsx:175-177`, `app/roast-conductor/layout.tsx:36-43`,
`app/loop-year/layout.tsx:40-47`.

#### Scenario: A visitor arrives on an app support page
- **WHEN** a visitor opens `/roast-conductor/support` or `/loop-year/support`
- **THEN** analytics runs and the page has no direct link to `/privacy`; the route is the header link to
  the home page, then the home page footer

#### Scenario: A reader of an app policy looks for the website notice
- **WHEN** a reader reaches "This website" in the Roast Conductor or Loop Year policy
  (`app/roast-conductor/privacy/page.tsx:250-254`, `app/loop-year/privacy/page.tsx:231-236`)
- **THEN** it mentions counted page visits, with no link to `/privacy` and no mention of click events

## Clarifications
- 2 November 2026, decided (Fraser's ruling on PR #74): this spec lands now, before website #50
  (adopt OpenSpec), after a rebase and one review; #50 adopts it as it stands.
- 2 November 2026, open call: should the notice's claims about Vercel ("does not use cookies or store
  anything on your device") be treated as checked? Recommended: no, repeat the check in the fix for
  website #65, because Vercel can change the script without a change here. The script served that day
  (version 0.1.3, last modified 30 October) supports them for this site but cannot prove them: it writes
  `localStorage` only after an `identify` or `group` call, and asks for a session only after
  `enableCookie`, and code under `app/` makes none of these; no live response set a cookie. The 24-hour
  hash and Vercel's retention happen on the server, so this baseline still records them only as what
  the page says.
- 2 November 2026, open call: should website #76 (no analytics retention or transfers statement) be
  fixed together with website #65? Recommended: yes, as #76 says, so the effective date changes once.
