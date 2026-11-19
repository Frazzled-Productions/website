## RENAMED Requirements

- FROM: `### Requirement: Web Analytics runs on every route (baseline, current behaviour)`
- TO: `### Requirement: Page view statistics run on every route`
- FROM: `### Requirement: Exactly two custom click events (baseline, current behaviour)`
- TO: `### Requirement: Exactly two click events, counted by the site`
- FROM: `### Requirement: TrackedLink is a new-tab external anchor (baseline, current behaviour)`
- TO: `### Requirement: TrackedLink is a new-tab external anchor`
- FROM: `### Requirement: Support section appears only when KOFI_URL is set (baseline, current behaviour)`
- TO: `### Requirement: Support section appears only when KOFI_URL is set at build`
- FROM: `### Requirement: Nothing loads from Ko-fi until the button is clicked (baseline, current behaviour)`
- TO: `### Requirement: Nothing loads from Ko-fi until the button is clicked`
- FROM: `### Requirement: No site code stores or collects visitor data (baseline, current behaviour)`
- TO: `### Requirement: Site code stores nothing on the device and sends only click names`
- FROM: `### Requirement: Fonts come from the site's own origin (baseline, current behaviour)`
- TO: `### Requirement: Fonts come from the site's own origin and one analytics script is third-party`
- FROM: `### Requirement: The notice page at /privacy (baseline, current behaviour)`
- TO: `### Requirement: The notice page at /privacy`
- FROM: `### Requirement: Notice describes visit statistics (baseline, current behaviour)`
- TO: `### Requirement: Notice describes hosting and visit statistics`
- FROM: `### Requirement: Notice describes link clicks (baseline, current behaviour)`
- TO: `### Requirement: Notice describes link clicks`
- FROM: `### Requirement: Notice carries a fixed effective date (baseline, current behaviour)`
- TO: `### Requirement: Notice carries a fixed effective date`

## MODIFIED Requirements

### Requirement: Page view statistics run on every route
When `NEXT_PUBLIC_CF_BEACON_TOKEN` is set at build, the root layout SHALL render the Cloudflare Web
Analytics beacon (`https://static.cloudflareinsights.com/beacon.min.js` with that token) on every route.
With the token unset (local and preview builds) it SHALL render no beacon. No consent step. No
`@vercel/analytics` code remains.

#### Scenario: A visitor opens any page
- **WHEN** any route renders on the production Worker
- **THEN** no consent prompt comes first, and the beacon script loads, deferred, and reports to
  `cloudflareinsights.com`

#### Scenario: A visitor moves between pages inside the site
- **WHEN** a visitor follows an in-site link to another route
- **THEN** the beacon sends metrics for the route change, with no page reload

#### Scenario: An address with a query string
- **WHEN** a page is opened at an address with a query string
- **THEN** nothing in this repo strips it; Cloudflare states that Web Analytics does not log query
  strings

#### Scenario: Production and development builds
- **WHEN** the site is built for production with the token set
- **THEN** every page includes the beacon
- **AND WHEN** it is built locally or for a preview without the token, no page includes the beacon and
  nothing is sent to Cloudflare Web Analytics

#### Scenario: Searching for the old library
- **WHEN** the repo is searched for `@vercel/analytics` or `_vercel/insights`
- **THEN** nothing matches outside `openspec/` and `package-lock.json` history

### Requirement: Exactly two click events, counted by the site
The site SHALL send exactly two click events, each a fixed name with no properties: `pokememory_click`
from the Poké Memory card and `support_click` from the "Support the studio" button. Each SHALL be sent
with `sendEvent(name)`, which posts the name to the site's own `/api/event`. No other code sends events.

#### Scenario: Poké Memory card clicked
- **WHEN** a visitor clicks the Poké Memory card on the home page
- **THEN** one beacon posts `{"name":"pokememory_click"}` to `/api/event` on the same origin

#### Scenario: A link with no event
- **WHEN** a visitor clicks the App Store link on `/roast-conductor` or the Roast Conductor card
- **THEN** no event is sent

#### Scenario: A browser without sendBeacon
- **WHEN** `navigator.sendBeacon` is missing
- **THEN** the click works as normal and no event is sent

### Requirement: TrackedLink is a new-tab external anchor
`TrackedLink` SHALL render an anchor with `target="_blank"` and `rel="noopener noreferrer"`, passing
through `href` and `className`, and SHALL call `sendEvent` with its `event` prop from `onClick`. Its
only use is the Poké Memory card.

#### Scenario: Clicking a TrackedLink
- **WHEN** a visitor clicks a `TrackedLink`
- **THEN** the event is sent and the unchanged `href` opens in a new tab without an opener or referrer

#### Scenario: Opening a TrackedLink without a click event
- **WHEN** a visitor opens the link with the middle mouse button, or from the context menu
- **THEN** the link opens but no event is sent, because only `onClick` is handled

### Requirement: Support section appears only when KOFI_URL is set at build
The home page SHALL render the Support section and `SupportButton` only when `KOFI_URL` is non-empty at
build. In production it comes from the repository variable `KOFI_URL` in `deploy.yml`.

#### Scenario: KOFI_URL unset or empty
- **WHEN** `KOFI_URL` is unset or empty at build
- **THEN** the home page has no Support section, so no `support_click` event and no Ko-fi panel

#### Scenario: KOFI_URL changes
- **WHEN** the repository variable changes
- **THEN** the home page keeps its old state until the next deploy from `main`

### Requirement: Nothing loads from Ko-fi until the button is clicked
`SupportButton` SHALL mount the Ko-fi iframe only while its panel is open, and a click SHALL call
`sendEvent("support_click")` before opening it. The panel's new-tab fallback link sends no event.

#### Scenario: Before the click
- **WHEN** the home page has loaded and the button has not been clicked
- **THEN** no iframe exists and no request goes to Ko-fi from site code

#### Scenario: The panel is opened twice
- **WHEN** a visitor opens the panel, closes it and opens it again
- **THEN** `support_click` is sent once for each opening

#### Scenario: Panel closed
- **WHEN** the visitor clicks the backdrop or Close, or presses Escape with focus outside the iframe
- **THEN** the panel and its iframe are removed from the page

### Requirement: Site code stores nothing on the device and sends only click names
Code under `app/` SHALL contain no `document.cookie`, `localStorage`, `sessionStorage`, `<form>`,
`<input>`, `<textarea>` or `<img>`, and no network call except the one `sendBeacon` in `sendEvent`.
Responses from the site SHALL set no cookie.

#### Scenario: Searching the app code
- **WHEN** `app/` is searched for those storage, network and form terms
- **THEN** the only network match is `sendBeacon` in `app/lib/events.ts`, the only `<iframe>` is the
  Ko-fi panel and the only `<script>` elements are the JSON-LD and the beacon

#### Scenario: Reading response headers
- **WHEN** any page or `/api/event` is requested on the deployed Worker
- **THEN** no response carries `Set-Cookie`

### Requirement: Fonts come from the site's own origin and one analytics script is third-party
The root layout SHALL load its three fonts through `next/font/google`, served from the site itself. In
production, apart from the Ko-fi panel after a click, the only third-party resource SHALL be the
Cloudflare Web Analytics beacon from `static.cloudflareinsights.com`.

#### Scenario: Loading the home page in production
- **WHEN** the home page's HTML is read
- **THEN** fonts are under `/_next/static/media/`, no Google font host appears, and the only other
  hosts named are the Poké Memory link, the Ko-fi address and `static.cloudflareinsights.com`

### Requirement: The notice page at /privacy
`/privacy` SHALL be a server-rendered page titled "Privacy | Frazzled Productions" with a header link
to `/` and a company footer. Its summary SHALL say the site has no accounts, sign-up forms, adverts or
cookies, counts visits with Cloudflare Web Analytics and counts clicks on two links itself, and leaves
Ko-fi support to Ko-fi.

#### Scenario: Opening the notice
- **WHEN** a visitor opens `/privacy`
- **THEN** they see the summary, then Who we are, Hosting and visit statistics, Link clicks,
  Supporting us on Ko-fi, Our legal basis, Emailing us, Your rights and Changes to this notice

#### Scenario: How the page describes the analytics
- **WHEN** a reader reads the meta description
- **THEN** it names Cloudflare Web Analytics and daily click totals, and no longer names Vercel

### Requirement: Notice describes hosting and visit statistics
The notice SHALL say Cloudflare hosts the site and briefly processes IP addresses to deliver and protect
it; that Cloudflare Web Analytics measures page views without collecting personal data or query
strings, keeping full data 7 days then a sample; and where and how long our click totals are kept.

#### Scenario: Reading the analytics section
- **WHEN** a reader opens "Hosting and visit statistics"
- **THEN** those statements appear, with links to Cloudflare's privacy pages, and no statement about
  cookies or device storage is made unless task 3.4 confirmed it

#### Scenario: Looking for how long records are kept
- **WHEN** a reader looks for how long records are kept and where
- **THEN** the notice gives 7 days for Cloudflare's full beacon data, says click totals are stored in
  the EU and kept while useful, and says Cloudflare's network serves pages worldwide (website #76)

### Requirement: Notice describes link clicks
The notice SHALL say that clicks on the Poké Memory link and the "Support the studio" button each add
one to a daily total for that link, kept by us on Cloudflare in the EU, and that the total holds no IP
address, device details, page address or time finer than the day.

#### Scenario: Comparing notice and code
- **WHEN** the notice is compared with the allowlist in `app/lib/events.ts`
- **THEN** it names both events and no event exists that it does not cover

#### Scenario: What the count measures
- **WHEN** a visitor clicks twice
- **THEN** the total goes up by two, and the notice says it counts clicks, not visitors

### Requirement: Notice carries a fixed effective date
The page SHALL show its effective date as literal text, set to the cutover date by the cutover PR, and
say the page and date change together if data handling changes.

#### Scenario: Reading the date
- **WHEN** a reader opens the notice after cutover
- **THEN** it shows the cutover date, not 17 October 2026

## ADDED Requirements

### Requirement: The event endpoint accepts only known names from the site
`POST /api/event` SHALL accept a JSON body of at most 200 bytes, `{"name": ...}`, whose name is
`support_click` or `pokememory_click`, and whose `Origin` equals the site's own origin. Other methods get
405, other origins 403, other bodies 400.

#### Scenario: A valid click
- **WHEN** the site posts `{"name":"support_click"}` from its own origin
- **THEN** the endpoint answers 204 with `Cache-Control: no-store`

#### Scenario: Unknown name, wrong origin or wrong method
- **WHEN** the body names `foo`, or `Origin` is another site, or the method is GET
- **THEN** the endpoint answers 400, 403 or 405 and writes nothing

#### Scenario: A body over 200 bytes
- **WHEN** a request body is 201 bytes or more
- **THEN** the endpoint answers 400 and writes nothing

### Requirement: Click totals hold no personal data
The `event_counts` table SHALL hold only the UTC day, the event name and a count. The endpoint SHALL
read no header but `Origin` and `Content-Length`, store nothing else and log nothing about the request.

#### Scenario: Reading the table
- **WHEN** Fraser runs the README's `wrangler d1 execute` query
- **THEN** each row is a day, a name and a number

#### Scenario: Two clicks on the same day
- **WHEN** two accepted `support_click` posts arrive on the same UTC day
- **THEN** that day's `support_click` row reads 2, and no other row changes

### Requirement: The event endpoint is rate-limited
Before writing, the endpoint SHALL check the `EVENT_LIMITER` binding keyed by event name, 60 a minute,
and answer 429 without writing when the limit is reached. Cloudflare applies this per location and
approximately.

#### Scenario: A burst of posts
- **WHEN** more than 60 posts for one name arrive within a minute at one location
- **THEN** the posts over the limit get 429 and are not counted

### Requirement: Click totals live in an EU D1 database
The production and preview databases SHALL be created with `--jurisdiction=eu`, which Cloudflare allows
only at creation.

#### Scenario: Checking the database
- **WHEN** `wrangler d1 info website-events` is run
- **THEN** it shows the EU jurisdiction

#### Scenario: A database created without it
- **WHEN** a database turns out to have no jurisdiction
- **THEN** it is deleted and created again with `--jurisdiction=eu` before cutover, since it cannot be
  changed

### Requirement: A failing database never breaks a page
When D1 fails, including the Free plan's daily limits, the endpoint SHALL answer 503, and `sendEvent`
SHALL ignore every response, so clicks and pages behave as normal.

#### Scenario: D1 over its daily write limit
- **WHEN** D1 refuses the write
- **THEN** the endpoint answers 503, the Ko-fi panel still opens and the Poké Memory link still opens

### Requirement: Events tested without Next
The endpoint logic SHALL live in `app/lib/events.ts` and be covered by `node --test` tests run by
`npm test` in CI, using a fake D1 and rate limiter.

#### Scenario: CI on a pull request
- **WHEN** CI runs
- **THEN** `npm test` runs `tests/events.test.ts` and fails the job on any failing case

### Requirement: The notice changes with the cutover
The rewritten `/privacy` text and the two app policies' "This website" sentences SHALL go live with the
cutover, after Fraser signs off the wording, and never before the Worker serves the domain.

#### Scenario: Rolled back to Vercel
- **WHEN** the site is rolled back
- **THEN** visitors see Vercel's paused deployment with its old notice, which matches what that
  deployment does
