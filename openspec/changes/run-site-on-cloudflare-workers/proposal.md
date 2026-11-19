## Why

Stage 1 of the company move to Cloudflare (programme tracker ops #610; decision ADR 0018 in ops PR #609;
research `ops/research/hosting-cost-cut-2026-11-19.md`). The company site is the easiest app to move and
the first one, so the shared pieces (the OpenNext and wrangler setup, the events table, the CI deploy
with per-PR preview versions, the DNS cutover runbook) are built here first and copied to Koinori, Plan
Bee and Poké Memory later (ADR 0018, "Shared code").

The build spike of 19 November 2026 showed the site builds with `@opennextjs/cloudflare` 1.20.17 once
`next` is at 16.4.5 or later (tested on 16.4.6), with a bundle of 4.9 MiB raw and 1.0 MiB gzipped, and
every page answered 200 under `wrangler dev`. The only blocker it found was `@vercel/analytics`
`track()`, which has no Cloudflare equivalent: Cloudflare Web Analytics has no custom events.

Today `next build` at 16.4.3 also warns that this version "is affected by a known security
vulnerability", and `npm audit --omit=dev` reports two moderate Next.js advisories (GHSA-mfr8-8qww-v76h,
GHSA-vc7v-qv4w-wrv8) fixed in 16.4.5 and later (run in this change's worktree, 19 November 2026).

Normal path: this proposal PR, Fraser's approval, then the build PR, then the cutover.

Fixes: none

Refs ops #610 (the programme; stage 1 is ticked there when the cutover is done, and the Vercel project
retired 14 days later).

## What Changes

- **Next.js 16.4.3 to 16.4.6**, with `eslint-config-next` to match. This supersedes Dependabot PR #96
  (next only) and does the alignment website #57 asks for.
- **OpenNext and wrangler.** `@opennextjs/cloudflare` 1.20.17 and `wrangler` 4.x as exact-pinned dev
  dependencies, `open-next.config.ts`, `wrangler.jsonc` (production Worker `website`, preview Worker
  `website-preview`), and npm scripts to build, preview locally, upload a preview version and deploy.
  Every page stays prerendered.
- **Our own click counts replace `@vercel/analytics` custom events.** A `POST /api/event` route
  handler accepts only the two known names (`support_click`, `pokememory_click`), adds one to a daily
  total in a D1 table created with the EU jurisdiction, sets no cookie, stores no personal data
  (no IP address, user agent, page address, referrer or time finer than the day) and is rate-limited.
  `SupportButton` and `TrackedLink` send the name with `navigator.sendBeacon`.
- **`@vercel/analytics` removed** from `package.json`, the root layout and both components.
- **Cloudflare Web Analytics for page views**: the beacon snippet in the root layout, rendered only when
  its site token is set at build.
- **Privacy wording.** The website notice at `/privacy` describes Cloudflare as host, Cloudflare Web
  Analytics, our click counts, where they are kept and for how long, with a new effective date. The
  "This website" line in the Roast Conductor and Loop Year policies changes from Vercel to Cloudflare.
  Fraser signs off the wording before the cutover.
- **CI deploys with wrangler.** A new `deploy.yml` workflow: on push to `main`, apply D1 migrations then
  deploy the production Worker; on each pull request from this repo, upload a preview version to the
  preview Worker (its own D1 database, starting empty with the migrations applied) with the alias
  `pr-<number>` and comment its URL on the PR. Pull requests without secrets (Dependabot, forks) skip the
  upload with a notice. Until the `CLOUDFLARE_API_TOKEN` secret exists, the `main` deploy also skips
  with a notice and passes, so the build PR can merge while Vercel still serves the site.
- **Cutover by DNS.** frazzledproductions.com and www move from Vercel's records to Worker Custom
  Domains. The last Vercel production deployment stays untouched for 14 days as the rollback (put the
  two DNS records back).
- **Retire the Vercel project for this site** after 14 days with no rollback, once its page-view totals
  are saved to ops.
- **Docs.** README (deployment, scripts, structure, the `KOFI_URL` row, how to read the counts),
  `AGENTS.md` (deployed on Cloudflare), and the code comment in `app/page.tsx:10`.

## Capabilities

### New Capabilities
- `site-hosting`: how the site is built, deployed, previewed, cut over and rolled back on Cloudflare
  Workers. Today's Vercel hosting has no spec; design.md "Baseline" records it from the repo and live
  headers (spec on touch).

### Modified Capabilities
- `site-privacy-and-analytics`: page views through Cloudflare Web Analytics, clicks through our own
  endpoint and D1 table, the notice rewritten to match, and the third-party script rule allowing the
  one beacon. Adds the endpoint requirements.
- `support-the-studio`: the click records `support_click` through the site's endpoint; `KOFI_URL` is
  set in CI, not Vercel.
- `studio-home-page`: the Support section scenario names the CI variable, not Vercel.
- `roast-conductor-pages`: site-wide additions name Cloudflare Web Analytics; static pages no longer
  cite a Vercel header.
- `app-legal-and-support-pages`: the wrapper and the "This website" lines name Cloudflare Web Analytics.

## Impact

- Code: `package.json`, `package-lock.json`, `app/layout.tsx`, `app/components/SupportButton.tsx`,
  `app/components/TrackedLink.tsx`, new `app/api/event/route.ts`, new `app/lib/events.ts`,
  `app/privacy/page.tsx`, `app/roast-conductor/privacy/page.tsx`, `app/loop-year/privacy/page.tsx`,
  `app/page.tsx` (one comment), new `open-next.config.ts`, `wrangler.jsonc`,
  `migrations/0001_event_counts.sql`, `tests/events.test.ts`, `scripts/smoke.mjs`,
  `.github/workflows/deploy.yml`, `.github/workflows/ci.yml` (adds `npm test`), `.gitignore`
  (`.open-next`, `.wrangler`), README, AGENTS.md.
- Hosting: Cloudflare account (Workers Free plan; see design D7), two D1 databases (EU), DNS records on
  the existing Cloudflare zone.
- Vercel: the website project stops serving at cutover and is deleted 14 days later. Vercel Pro stays
  until stage 5 for the other apps, so this stage saves no money by itself.

## Also touches

Each surface from the house rules (ops `openspec/config.yaml`), plus the website's own:

- **App Store privacy and support URLs** (`/roast-conductor/privacy`, `/roast-conductor/support`,
  `/loop-year/privacy`, `/loop-year/support`): same paths, now served by the Worker. Evidence: all ten
  routes are static (`○`) in `next build` at `b3c7105` (run 19 November 2026), and the spike served all
  pages 200 under workerd. The smoke script (task 3.3) requests all four on the preview and after the
  cutover.
- **The Roast Conductor and Loop Year privacy policies**: one sentence each changes ("This website",
  `app/roast-conductor/privacy/page.tsx:270-273`, `app/loop-year/privacy/page.tsx:246-249`). Website
  #90 (support email lines) edits the same files: whichever lands second rebases.
- **Ko-fi panel**: no change to the panel; only the event call in `SupportButton.tsx:40` changes.
  `KOFI_URL` must be set as a GitHub Actions variable before the first production deploy, or the
  Support section silently disappears (the home page reads it at build: `support-the-studio`,
  "KOFI_URL takes effect when the home page is rendered at build"). Task 3.3's smoke check fails if the
  "Support the studio" button is missing.
- **CI**: `ci.yml` gains `npm test`; new `deploy.yml`. The website repo is public, so Actions minutes
  are free (ops research, "Public repos ... are free"). No self-hosted Mac runner is used (ubuntu-latest).
- **Shared Frazzled-Productions/.github workflows** (em-dash, test-integrity): no change, because the
  new workflow is repo-local; the test-integrity check sees an added test file only.
- **Dependabot**: PR #96 (next 16.4.6) is superseded and closed after the build merges; Dependabot PRs
  get no preview version (no secrets), stated in the PR comment step.
- **Node version check** (`scripts/check-node-version-drift.mjs`): the new workflow uses
  `node-version-file: .nvmrc`, so it adds no literal (AGENTS.md rule). `ci.yml`'s `node-version: '20'`
  stays as website #12 and #78 track.
- **README structure check** (`scripts/check-readme-structure.mjs`): every new file under `app/`
  (`api/event/route.ts`, `lib/events.ts`) is added to the README block, or `npm run lint` fails.
- **Open privacy issues**: website #76 (no retention or transfer statement) is fixed by the rewritten
  notice, which states both for the new processing (Clarifications, call 4). Website #65 (complaints route,
  effective date before the page) and #66 (notice linked only from the home page) are not fixed here.
- **Website #30** (protect the App Store URLs, uptime monitor): not done here; the smoke script is a
  start it can reuse.
- **status, start and wrap-up skills; Claude Code hooks; claude-home; skill folders**: no change,
  because they do not read hosting or analytics.
- **ops/now.md, ops/workspace.md**: no change, because they read repos and PRs, not hosts.
- **deadlines.md and roadmap.md**: ops #610's checklist is the tracker; roadmap gains "stage 1 done"
  when the cutover is done (task 5.4).
- **Orca and the phone; email and notifications**: no change. The PR comment with the preview URL is a
  GitHub notification like any bot comment.
- **Credentials and owner-only steps**: a Cloudflare API token as the GitHub secret
  `CLOUDFLARE_API_TOKEN`, the account id as a variable, the Web Analytics site token, the DNS cutover,
  pausing Vercel deploys and deleting the Vercel project. All are Fraser's (tasks.md "Owner steps").
- **ops runbooks**: `runbooks/service-routes.md` gains the website Worker row; ADR 0018 is unchanged.
- **The app repos' AGENTS.md; LaunchAgents; KNOWLEDGE.md**: no change, because nothing there names the
  website's host. The website's own `AGENTS.md` changes ("deployed on Vercel").

## Out of scope

- Koinori, Plan Bee and Poké Memory (stages 2 to 4).
- Subscribing to Workers Paid (stage 2, Fraser), unless the CPU check in design D7 fails, in which case
  Fraser subscribes before the cutover (Clarifications, call 5).
- Nightly D1 export to R2: the click table holds only daily totals with no personal data, and D1 Time
  Travel (30 days) covers mistakes; the export is built in stage 2 where user data first lands.
- A scope helper and its CI rule: the site has no users.
- Fixing website #65 and #66, the uptime monitor (#30), CI on Node 20 (#12, #78).
- Moving the domain's registrar or email routing (DNS is already on Cloudflare: `dig NS
  frazzledproductions.com` gives `meg.ns.cloudflare.com` and `robert.ns.cloudflare.com`, 19 November 2026).

## Owner decisions this relies on

- 19 November 2026 (grilling, ADR 0018): order easy first, website is stage 1; our own events table in
  D1 replaces Vercel custom events; Cloudflare Web Analytics for page views; a Workers preview version
  per PR with a seeded test database; each D1 database created with the EU jurisdiction; cutover by DNS
  switch, the old Vercel deploy kept 14 days; shared code built in the first app and copied; Workers
  Paid subscribed by Fraser when the Koinori stage starts.
- 21 October 2026: OpenSpec for every change in every repo. 23 October 2026: root cause and blast
  radius for every proposal.

## Removes

- `@vercel/analytics` (dependency, `<Analytics />` in `app/layout.tsx:3,41`, both `track` imports).
- Vercel Web Analytics custom events and page views for this site, from cutover.
- The Vercel project for this site, 14 days after cutover (task 6.3).
- The README's "Deployed on Vercel" lines and the Vercel wording in `AGENTS.md`, `app/page.tsx:10` and
  `scripts/check-node-version-drift.mjs:8,21` comments.
- Requirements: none removed; eleven are rewritten (RENAMED and MODIFIED) where they named Vercel.
- Deletion count: workflow and script lines added about 120 (`deploy.yml` about 80, `scripts/smoke.mjs`
  about 40), removed 0; requirements added 15 (8 in `site-hosting`, 7 in `site-privacy-and-analytics`),
  removed 0.
- Why it adds more: the deploy, preview and smoke steps Vercel did for us now live in the repo.

## Clarifications

- 19 November 2026, decided (grilling for ADR 0018, ops #607): the settled decisions listed under
  "Owner decisions this relies on". No grilling round was held for this proposal itself; its six calls
  went to Fraser with this PR.
- 19 November 2026, Fraser approved the proposal and answered its six calls:
  1. Click table: daily totals per event name only, no row per click, so nothing in it can be personal
     data (design D3).
  2. Rate limit: keyed per event name, 60 a minute per Cloudflare location; the endpoint never reads the
     IP address (design D3, `site-privacy-and-analytics` "The event endpoint is rate-limited").
  3. Previews: a separate `website-preview` Worker with its own EU D1 database, which starts empty with
     the migrations applied, because Cloudflare version URLs share the production Worker's bindings
     (design D2, D5). This is how this site meets ADR 0018's "seeded test database": it has no seed data.
  4. App policies: only the "This website" sentence changes in the Roast Conductor and Loop Year
     policies, and their effective dates stay. Website #76 is closed by the new website notice, which
     states retention and where data is kept (design D8).
  5. If the real deploy measures over 5 ms p99 CPU time per request on the Free plan, Fraser subscribes
     to Workers Paid early, before the cutover. No static export (design D7, `site-hosting` "Page
     requests fit the Workers Free plan").
  6. After the 14-day rollback window, the Vercel project's page-view and event totals are saved to ops,
     then the project is deleted (task 6.1, owner step A7).
- 19 November 2026, build brief (stage 1 orchestration, ops #610): while the `CLOUDFLARE_API_TOKEN`
  secret is absent, the `main` deploy job skips with a notice and passes instead of failing, so merging
  the build PR does not turn CI red and Vercel keeps serving the site until the DNS switch. A token
  that is present but rejected still fails the job (`site-hosting` "Main deploys through CI").
