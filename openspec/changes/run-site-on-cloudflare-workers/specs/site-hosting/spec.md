## Purpose

How frazzledproductions.com is built, deployed, previewed, cut over and rolled back on Cloudflare
Workers, replacing Vercel (ADR 0018, ops #610). Today's Vercel hosting had no spec; the change's
design.md "Baseline" records it.

## ADDED Requirements

### Requirement: The site runs on a Cloudflare Worker built with OpenNext
The site SHALL be built with `@opennextjs/cloudflare` 1.20.17 on `next` 16.4.6 and served by the
Worker `website`, with every route still prerendered at build. The same ten URLs SHALL answer 200.

#### Scenario: All routes on the Worker
- **WHEN** the smoke script requests `/`, `/privacy`, `/roast-conductor`, `/roast-conductor/privacy`,
  `/roast-conductor/support`, `/roast-conductor/sample-recipe`, `/loop-year/privacy` and
  `/loop-year/support` on a deployed Worker
- **THEN** each answers 200, and `/loop-year` still answers 404

#### Scenario: A dynamic route sneaks in
- **WHEN** a change makes any page dynamic
- **THEN** the build's route table shows it as `ƒ` and task 3.5's CPU check is repeated for it

### Requirement: Page requests fit the Workers Free plan
Until Workers Paid is subscribed, the p99 CPU time per request for each page and for `/api/event` SHALL
be at most 5 ms, half the Free plan's 10 ms limit, measured on a deployed Worker before cutover.

#### Scenario: Measured within budget
- **WHEN** the preview Worker's metrics show p99 CPU time of 5 ms or less for every route
- **THEN** the cutover may go ahead on the Free plan

#### Scenario: Measured over budget
- **WHEN** any route's p99 CPU time is over 5 ms
- **THEN** Fraser subscribes to Workers Paid before the cutover, and the build is not reworked into a
  static export

### Requirement: Main deploys through CI with wrangler
Each push to `main` SHALL run tests, build with OpenNext, apply pending D1 migrations to the production
database and to the preview database, then deploy the production Worker, using the
`CLOUDFLARE_API_TOKEN` secret of the `production` GitHub environment, which admits only `main`. While
that secret is absent, the job SHALL skip the Cloudflare steps with a notice and pass.

#### Scenario: A normal merge
- **WHEN** a PR merges to `main`
- **THEN** `deploy.yml` applies migrations before `opennextjs-cloudflare deploy`, and a failed migration
  stops the deploy

#### Scenario: Token not yet added
- **WHEN** a PR merges to `main` and the secret is empty
- **THEN** the deploy job prints a notice, skips the Cloudflare steps and passes, and nothing is deployed

#### Scenario: Token revoked
- **WHEN** the secret is set but Cloudflare rejects it
- **THEN** the deploy job fails red and the live site keeps its previous version

### Requirement: Each pull request gets a preview version on a separate Worker
A pull request from a branch of this repo into `main` SHALL get a preview version on the
`website-preview` Worker, whose D1 database is separate from production and starts empty with the
migrations applied, aliased `pr-<n>`, with its URL commented on the PR. Without the
`CLOUDFLARE_PREVIEW_API_TOKEN` secret of the `Preview` GitHub environment, the upload SHALL be skipped
with a notice and pass.

#### Scenario: A PR from a branch in this repo
- **WHEN** a branch PR into `main` is opened or pushed and its Deploy run passes
- **THEN** one comment on the PR shows `pr-<n>-website-preview.<subdomain>.workers.dev`, updated on
  later pushes, and clicks there land in the preview database only

#### Scenario: No preview token
- **WHEN** a pull request's Deploy run passes and `CLOUDFLARE_PREVIEW_API_TOKEN` is not set in `Preview`
- **THEN** the upload workflow prints a notice, uploads nothing and passes; the PR's own run still
  built and tested it

#### Scenario: A fork PR
- **WHEN** the PR comes from a fork
- **THEN** its own run builds and tests it, and the upload workflow skips it

### Requirement: Preview versions are uploaded only from main
The pull request's own workflow SHALL build the preview without any GitHub environment or Cloudflare
secret and keep the build as an artefact. Only a `workflow_run` workflow, which GitHub runs from
`main`, SHALL upload it, using the `Preview` environment (deployment branches: `main` only), the
config and dependencies from `main`, and nothing run from the artefact.

#### Scenario: A pull request cannot reach production
- **WHEN** any pull request workflow runs
- **THEN** it has no token that can write `website-events` or deploy the `website` Worker, because
  that token is only in the `production` environment, whose deployment branch policy admits `main`
  alone

#### Scenario: A pull request changes the preview bindings
- **WHEN** a pull request edits `env.preview` in `wrangler.jsonc` to bind the production database, or
  edits a workflow to read the `Preview` environment
- **THEN** its preview version is still uploaded with `main`'s bindings, and its own workflow is refused
  the `Preview` environment, so it gets no Cloudflare token

### Requirement: Build-time settings come from CI variables
`KOFI_URL` and `NEXT_PUBLIC_CF_BEACON_TOKEN` SHALL be read from repository variables at build in
`deploy.yml`; preview builds SHALL leave the beacon token unset.

#### Scenario: KOFI_URL missing on a production build
- **WHEN** the production build runs without `KOFI_URL`
- **THEN** the home page has no Support section, and the smoke script fails on the missing "Support
  the studio" button

### Requirement: Cutover by DNS with Vercel kept as the rollback for 14 days
The apex and `www` SHALL move to Worker Custom Domains, replacing the Vercel A and CNAME records. For 14
days the last Vercel production deployment SHALL stay unchanged, with production deploys paused, and
rollback SHALL be putting the two records back.

#### Scenario: Cutover day
- **WHEN** Fraser deletes the two records and the cutover PR deploys the Custom Domains
- **THEN** both hostnames answer 200 with `server: cloudflare` and a `cf-ray` header

#### Scenario: Rollback inside 14 days
- **WHEN** a fault on the Worker cannot be fixed forward
- **THEN** the Custom Domains are removed and the A record to `76.76.21.21` and the `www` CNAME to
  `cname.vercel-dns.com` are recreated, DNS only, and Vercel serves its paused deployment

### Requirement: The production Worker serves only the company domains after cutover
After cutover the production Worker SHALL have `workers_dev` and `preview_urls` off, so the site is
reachable only at frazzledproductions.com and www.

#### Scenario: The workers.dev address after cutover
- **WHEN** someone opens `website.<subdomain>.workers.dev` after cutover
- **THEN** Cloudflare does not serve the site there

### Requirement: The Vercel project is retired after 14 days
Fourteen days after cutover with no rollback, the site's Vercel page-view totals SHALL be saved to ops
and the Vercel project for this site SHALL be deleted by Fraser.

#### Scenario: Day 14 with no rollback
- **WHEN** 14 days pass after cutover and no rollback happened
- **THEN** the totals file is in ops, the project is deleted, and ops #610 ticks stage 1

#### Scenario: A rollback happened
- **WHEN** the site was rolled back to Vercel
- **THEN** the project is not deleted, and a new cutover restarts the 14 days
