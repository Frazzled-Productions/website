## Context

The company site is a Next.js app with ten static routes, no data fetching and no server code of its
own. It is the first app to leave Vercel (ADR 0018, ops #610). What is built here (OpenNext and wrangler
setup, the events table, the CI deploy and per-PR preview versions, the cutover and rollback steps) is
copied to the later stages.

Cloudflare facts below were read on developers.cloudflare.com and opennext.js.org on 19 November 2026;
prices and limits change, so the build re-reads them.

## Baseline (today's hosting, no spec yet)

Recorded for spec on touch, from the repo at `b3c7105` and live requests on 19 November 2026:

- Vercel's Git integration builds every push to `main` to production and every PR to a preview; the
  repo has no `vercel.json` (`docs/plans/14-question.md:58`) and `package.json` `engines` picks Node 24.
- CI (`.github/workflows/ci.yml`) runs lint, typecheck and build on Node 20; no tests exist.
- DNS is on Cloudflare (`meg` and `robert.ns.cloudflare.com`). The apex has an A record to
  `76.76.21.21` and `www` a CNAME to `cname.vercel-dns.com`, both answering from Vercel (`server:
  Vercel`, no `cf-ray`), so neither is proxied. `www` serves the site directly with 200, no redirect.
- Pages are served prerendered (`x-nextjs-prerender: 1`, `x-vercel-cache: HIT` on
  `/roast-conductor/privacy`).
- `KOFI_URL` is a Vercel environment variable read at build.
- Traffic, last 30 days (ops research table): 6,140 requests, 51 function invocations, 19 page views.

## Goals / Non-Goals

Goals: the same ten pages at the same URLs, served by a Cloudflare Worker; click counts with no
personal data; page views from Cloudflare Web Analytics; deploys and per-PR previews from CI; a rollback
that is two DNS records; the Vercel project gone 14 days later.

Non-goals: new pages or copy beyond the privacy wording; Workers Paid; R2 exports; fixing website #65
or #66.

## Decisions

### D1. Next.js 16.4.6
`@opennextjs/cloudflare` 1.20.17 declares the peer range `next >=15.5.29 <16 || >=16.4.5` and
`wrangler ^4.148.0` (`npm view`, 19 November 2026). Bump `next` and `eslint-config-next` to 16.4.6 (the
spike's tested version), exact-pinned as today. Close Dependabot PR #96 as superseded.

### D2. OpenNext and wrangler layout
- Dev dependencies, exact: `@opennextjs/cloudflare@1.20.17`, `wrangler@4.x` (latest 4.165.0 on 19
  November 2026; the build pins what it installs).
- `open-next.config.ts`: `defineCloudflareConfig()` with the static-assets incremental cache, since
  every page is prerendered and nothing revalidates.
- `wrangler.jsonc`:
  - `name: "website"`, `main: ".open-next/worker.js"`, `compatibility_flags: ["nodejs_compat"]`,
    `compatibility_date` set to the build date, `assets: { directory: ".open-next/assets", binding:
    "ASSETS" }`.
  - `d1_databases: [{ binding: "EVENTS_DB", database_name: "website-events", database_id: ...,
    migrations_dir: "migrations" }]`.
  - `ratelimits: [{ name: "EVENT_LIMITER", namespace_id: "...", simple: { limit: 60, period: 60 } }]`
    (periods may only be 10 or 60 seconds; Wrangler 4.36.0 or later).
  - Until cutover: `workers_dev: true`, no routes. The cutover PR adds `routes: [{ pattern:
    "frazzledproductions.com", custom_domain: true }, { pattern: "www.frazzledproductions.com",
    custom_domain: true }]` and sets `workers_dev: false`, `preview_urls: false`.
  - `env.preview`: Worker `website-preview`, `workers_dev: true`, `preview_urls: true`, its own D1
    `website-events-preview` and its own rate-limit namespace.
- npm scripts: `cf:build` (`opennextjs-cloudflare build`), `cf:preview` (build, then run locally under
  workerd), `cf:deploy` (`opennextjs-cloudflare deploy`), `cf:typegen`. `npm run build` stays `next
  build` so CI and local dev are unchanged.
- Size: the spike bundle was 1.0 MiB gzipped. Cloudflare's limits page lists "Worker size
  (uncompressed) 64 MiB" on Free and Paid; opennext.js.org still says "3 MiB on the Workers Free plan"
  (compressed). Either way it fits.

### D3. Click counts: table, endpoint, client
Table (`migrations/0001_event_counts.sql`):

```sql
CREATE TABLE event_counts (
  day   TEXT    NOT NULL CHECK (length(day) = 10),      -- UTC date, YYYY-MM-DD
  name  TEXT    NOT NULL CHECK (length(name) <= 40),
  count INTEGER NOT NULL CHECK (count > 0),
  PRIMARY KEY (day, name)
) STRICT;
```

No column can hold an IP address, user agent, page address, referrer, identifier or time finer than
the day (Clarifications, call 1).

Endpoint (`app/api/event/route.ts`, logic in `app/lib/events.ts` so it is testable without Next):

1. Only `POST`; anything else gets 405.
2. The `Origin` header must equal the request's own origin; otherwise 403. This stops other sites from
   posting; it does not stop scripts, which the rate limit bounds.
3. Body at most 200 bytes, JSON `{"name": "<event>"}`; `name` must be in the allowlist
   `["support_click", "pokememory_click"]` exported from `app/lib/events.ts`; otherwise 400.
4. `EVENT_LIMITER.limit({ key: name })`; when not allowed, 429 and no write (Clarifications, call 2). Cloudflare
   says the limit is approximate, eventually consistent and per location, so the worst case is 60 a
   minute per name per location reaching the table: an inflated count, never a cost.
5. `INSERT INTO event_counts (day, name, count) VALUES (?1, ?2, 1) ON CONFLICT (day, name) DO UPDATE
   SET count = count + 1`, one row written per accepted click.
6. 204 with `Cache-Control: no-store` and no `Set-Cookie`. If D1 errors (including the Free plan's
   daily limit), 503; the client ignores every response.

The handler reads no header other than `Origin` and `Content-Length`, and logs nothing about the
request.

Client: `sendEvent(name)` in `app/lib/events.ts` calls `navigator.sendBeacon("/api/event",
new Blob([JSON.stringify({ name })], { type: "application/json" }))`, and does nothing when
`sendBeacon` is missing. `SupportButton` calls it where `track('support_click')` was; `TrackedLink`
calls it with its `event` prop. Same-origin, so no CORS preflight; the site sets no cookies, so none
travel.

Reading the counts (the real read path, no estimate): `npx wrangler d1 execute website-events --remote
--command "SELECT day, name, count FROM event_counts ORDER BY day DESC LIMIT 60"`, with Cloudflare
access. Written into the README.

### D4. Cloudflare Web Analytics
Manual snippet, not automatic setup: the root layout renders `<Script defer
src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"..."}' />` only
when `NEXT_PUBLIC_CF_BEACON_TOKEN` is set at build, so previews and local builds send nothing. The token
is a public site tag, not a secret; Fraser creates the site in the dashboard and gives it. Manual setup
reports to `cloudflareinsights.com/cdn-cgi/rum`; automatic setup for the zone stays off so nothing is
counted twice.

What Cloudflare says (read 19 November 2026): it "does not collect or use your visitors' personal
data"; "Cloudflare Web Analytics do not log query strings"; "For Single Page Applications, additional
metrics are sent for every route change"; "We retain unsampled beacon data for the past 7 days, after
this point data is aggregated down to around 10%". None of the pages read says whether it sets cookies
or uses local storage, so task 3.4 checks that on the preview before the notice says so.

This is the site's first third-party script, so `site-privacy-and-analytics` "Fonts come from the
site's own origin" changes to allow exactly this one.

### D5. CI deploy and preview versions
New `.github/workflows/deploy.yml` (ubuntu-latest, `node-version-file: .nvmrc`, concurrency per ref):

- `push` to `main`: `npm ci`, `npm test`, `npm run cf:build`, `wrangler d1 migrations apply EVENTS_DB
  --remote`, `npm run cf:deploy`. Build-time settings from repository variables: `KOFI_URL`,
  `NEXT_PUBLIC_CF_BEACON_TOKEN`.
- `pull_request`: `npm ci`, `npm test` and the same build with the beacon token unset, with no GitHub
  environment and no Cloudflare secret. The built `.open-next/` (including `.open-next/.build`, whose
  Durable Object code the Worker bundle imports) is kept for one day as the artefact `preview-bundle`.
- Preview upload (koinori #2925 F3 and F4, 20 November 2026): `.github/workflows/preview-upload.yml`,
  on `workflow_run` of Deploy (`completed`). GitHub runs it from the default branch's file on `main`,
  so a pull request cannot edit it. Its one job runs only when the run was a `pull_request`, passed,
  came from this repository and its PR targets `main`; it uses the `preview` environment on a
  GitHub-hosted runner with `contents: read`, `actions: read`, `pull-requests: write`. With no
  `CLOUDFLARE_PREVIEW_API_TOKEN` it prints a `::notice::` and passes. Otherwise it checks out the PR's
  base branch (`main`), never the PR head, so `wrangler.jsonc`, `package.json`, the lockfile and
  `open-next.config.ts` are `main`'s and a PR cannot bind the production database to the preview
  Worker; runs `npm ci` there; downloads `preview-bundle` from the triggering run into `.open-next/`;
  refuses it if it holds a symlink; copies `.open-next/cache` into
  `.open-next/assets/cdn-cgi/_next_cache`; then runs `wrangler versions upload --env preview
  --preview-alias pr-<n>` from `main`'s dependencies, the token on that step only. It does not call
  `opennextjs-cloudflare upload`, because that imports the compiled config
  `.open-next/.build/open-next.config.edge.mjs` from the artefact; for this site's static-assets
  incremental cache, with skew protection off, the cache copy is the only thing it adds to wrangler
  (`@opennextjs/cloudflare` 1.20.17 `dist/cli/commands/upload.js` and `populate-cache.js`). Checked 20
  November 2026 with `--dry-run --outdir` against one `npm run cf:build` output: the two ways produce an
  identical `worker.js` and identical assets. The PR number and head SHA come from the event, never the
  artefact; the job then posts or edits the one PR comment with
  `https://pr-<n>-website-preview.<subdomain>.workers.dev`. The preview database starts empty: seeding
  it means applying the migrations (Clarifications, call 3), which the `main` job does (`--env
  preview`), because a pull request cannot write D1 (deploy guard below).
- Deploy guard (ops #610, Fraser's ruling of 19 November 2026; tightened for koinori #2925 F3 and F4 on
  20 November 2026): no Cloudflare token is a repository secret. `production` (deployment branches:
  `main` only) holds `CLOUDFLARE_API_TOKEN`, the account token. `Preview` (deployment branches: `main`
  only, set once this change is on `main`) holds `CLOUDFLARE_PREVIEW_API_TOKEN`, a token with
  Individual Workers Editor on `website-preview` only, or nothing until it is created, in which case
  previews skip with a notice. The distinct name means a missing environment secret can never fall
  back to a repository or organisation secret called `CLOUDFLARE_API_TOKEN` (F4). The branch policy is
  the enforcement: a pull request that edits a workflow to read `Preview` is refused the environment.
  Cloudflare tokens can be limited to single Workers but not to single D1 databases (permission
  groups, read 19 November 2026), so the preview token has no D1 access at all, and Workers bindings
  need no permission on the bound resource, which is why the bindings must come from `main`.
- Not fixed here: a `workflow_run` workflow is active only once it is on `main`; the preview token is
  not created until the other app repos carry the same fix on their default branches (koinori #2925).
- Pushes to `main` while the secret is absent: the deploy job prints a `::notice::` and
  passes, so the build PR can merge before Fraser's account steps and Vercel keeps serving the site. A
  token that is present but rejected fails the job (Clarifications, build brief).
- Secrets and variables: `CLOUDFLARE_API_TOKEN` (`production` environment secret) and
  `CLOUDFLARE_PREVIEW_API_TOKEN` (`Preview` environment secret), per the deploy guard;
  `CLOUDFLARE_ACCOUNT_ID`, `KOFI_URL`, `NEXT_PUBLIC_CF_BEACON_TOKEN` (variables).
- Version URLs are public when enabled; the preview Worker only ever holds PR builds of a public repo
  with an empty table, so no Access gate is added.

### D6. Cutover and rollback
1. Before merging the build PR: Fraser pauses Vercel's production deploys for the website project, so
   Vercel keeps serving the last pre-merge deployment (with `@vercel/analytics` working) and stays a
   known-good rollback.
2. Merge. `deploy.yml` deploys the production Worker to `website.<subdomain>.workers.dev`; run the smoke
   script against it.
3. Cutover PR: the routes and `workers_dev: false` from D2. Just before merging, Fraser deletes the
   apex A record (`76.76.21.21`) and the `www` CNAME (`cname.vercel-dns.com`); Cloudflare refuses a
   Custom Domain on a hostname with an existing CNAME. Merging deploys with the Custom Domains, which
   create proxied records and certificates. Expected gap: the minutes between deleting the records and
   the deploy finishing; done between 22:00 and 07:00 UK time.
4. Smoke script against `https://frazzledproductions.com` and `https://www.frazzledproductions.com`;
   check `server: cloudflare` and a `cf-ray` header.
5. Rollback within 14 days: remove the two Custom Domains in the dashboard, recreate the A and CNAME
   records exactly as in the Baseline (DNS only, not proxied); Vercel serves its paused deployment.
   Delete the leftover Advanced Certificates (Cloudflare does not delete them with the domain).

### D7. Workers Free plan fit
Read 19 November 2026 on developers.cloudflare.com: Free has "CPU time per HTTP request | 10 ms", "a
daily request limit of 100,000 requests, resetting at midnight UTC", "Subrequests per invocation | 50";
"Requests to static assets are free and unlimited". D1 on Free: 10 databases, 500 MB each, 5 GB per
account, 5 million rows read and 100,000 rows written a day, 50 queries per invocation; past the daily
limit "you will not be able to run queries against D1".

- Requests: 6,140 in 30 days is about 200 a day, 0.2% of the daily limit. Files under
  `.open-next/assets` (`/_next/static/*`, fonts, the icon) are served as static assets without running
  the Worker.
- Writes: one row written per accepted click; the rate limit caps a name at 86,400 a day per location
  in the worst case, so a flood could reach the 100,000 daily writes, and then only the counts fail
  (503); pages are unaffected.
- CPU: HTML for each route still runs the OpenNext Worker, which reads the prerendered page from the
  asset cache; the endpoint does one D1 call (I/O, not CPU). Not measured: the research lists "Real CPU
  per request on Cloudflare (needs a deploy)" as unanswered. Gate (task 3.5): CPU time per request from
  the preview Worker's metrics for each route and the endpoint, p99 at most 5 ms (half the limit). Over
  it, Fraser subscribes to Workers Paid before the cutover; the build is not reworked into a static
  export (Clarifications, call 5).
- Not stated on the pages read: whether D1 jurisdiction, the Rate Limiting binding and version URLs are
  available on Free. Task 3.1 creates them on the real account; a refusal stops the build and comes back
  to Fraser.

### D8. Privacy wording (draft for Fraser's sign-off)
Summary: "In short: this website has no accounts, no sign-up forms, no adverts and no cookies. We count
page visits with Cloudflare Web Analytics, which does not collect personal data, and keep a daily total
of clicks on two links. If you choose to support us through Ko-fi, Ko-fi handles that, not us."

"Hosting and visit statistics": "The site is hosted by Cloudflare, Inc. Like any web host, Cloudflare
processes your IP address briefly to deliver pages to you and to protect the site from abuse, using its
network of data centres around the world. We use Cloudflare Web Analytics to see how many people visit
and which pages they read. Cloudflare says it does not collect or use visitors' personal data and does
not log the part of an address after a question mark. Cloudflare keeps the full measurements for 7 days
and a sample after that. We only ever see totals." (Plus a cookie or device-storage sentence only if
task 3.4 confirms it.)

"Link clicks": "When you click the link to Poké Memory or the "Support the studio" button, the site adds
one to that day's total for that link. The total is kept by us in a Cloudflare database stored in the
European Union. It holds the date, the link's name and the number, nothing else: no IP address, no
device details, no page address and no time of day. We keep the totals for as long as they help us see
how the site is used. It counts clicks, not visitors."

Legal basis stays legitimate interest. App policies, "This website": "The Frazzled Productions website
counts page visits with Cloudflare Web Analytics, which does not collect personal data."

## Risks / Trade-offs

- [Preview writes into production] Version URLs share the Worker's bindings. Mitigation: a separate
  preview Worker and database (D2, Clarifications call 3), whose bindings the upload always takes from
  `main`, never from the pull request (D5, koinori #2925 F3).
- [Support section vanishes] `KOFI_URL` missing in CI. Mitigation: the smoke script fails without the
  "Support the studio" button on production.
- [Counts inflated by scripts] Mitigation: Origin check, allowlist, rate limit; the counts are a rough
  signal, as Vercel's were.
- [Free plan CPU] Unmeasured. Mitigation: task 3.5 gate before cutover; over it, Workers Paid early.
- [Free plan can end] Cloudflare may end free services at its discretion (ops research). Mitigation:
  Workers Paid arrives at stage 2 anyway.
- [Vercel page-view history] Lost when the project is deleted. Mitigation: totals saved to ops first
  (task 6.1).
- [Downtime at cutover] Minutes between deleting records and the deploy. Accepted; rollback is the same
  two records.

## Migration Plan

Build PR (tasks 1 to 4), then the cutover (task 5), then retirement after 14 days (task 6). Rollback is
D6 step 5 until the Vercel project is deleted.

## Open Questions

None. Fraser answered the six calls on 19 November 2026 (proposal Clarifications).
