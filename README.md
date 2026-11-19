# Frazzled Productions

The company website for [Frazzled Productions](https://frazzledproductions.com), an independent software studio based in London.

It is a single-page synthwave-styled site introducing the studio and its projects, currently [Poké Memory](https://pokememory.com), plus pages for the Roast Conductor iPhone app
(product, support, privacy policy and a sample recipe) under `/roast-conductor`, and the website's own privacy notice at `/privacy`.

## Tech stack

- [Node.js 24](https://nodejs.org) (pinned in `.nvmrc`)
- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- Deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/) with [OpenNext](https://opennext.js.org/cloudflare)

## Getting started

This repo runs on Node.js 24. The major lives in [`.nvmrc`](.nvmrc), so `nvm use` (or `fnm use`)
picks it up, and `engines` in `package.json` restates it for npm (and for Vercel until the cutover).
Nothing else should restate it: `npm run check:node-version` fails if anything does and disagrees.

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. The page auto-updates as you edit files under `app/`.

## Configuration

Environment variables (see `.env.example`):

| Variable | Description |
| --- | --- |
| `KOFI_URL` | Full URL of the studio's Ko-fi page (e.g. `https://ko-fi.com/frazzledproductions`). The home page's **Support** section only renders when this is set at build, so the donation mechanism stays off the live site until it is set as the `KOFI_URL` repository variable, which `deploy.yml` passes to the production build. |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | Cloudflare Web Analytics site token (a public site tag, not a secret). When set at build, every page loads the Cloudflare Web Analytics beacon; unset (local and preview builds) means no beacon. Set as a repository variable for production only. |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint, then the project structure check below |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm test` | Run the tests in `tests/` with Node's built-in test runner |
| `npm run cf:build` | Build the site as a Cloudflare Worker with OpenNext (output in `.open-next/`) |
| `npm run cf:preview` | Build, then serve the Worker locally under `wrangler dev` at http://localhost:8787 |
| `npm run cf:upload-preview` | Upload a preview version to the `website-preview` Worker, aliased `pr-$PR_NUMBER` (CI only) |
| `npm run cf:deploy` | Deploy the production Worker `website` (CI only) |
| `npm run check:node-version` | Check that nothing contradicts the Node major in `.nvmrc` |
| `npm run check:structure` | Check the **Project structure** block below against the contents of `app/` |

## Project structure

```
app/
  layout.tsx          Root layout, fonts, metadata, cursor glow, and the Cloudflare Web Analytics beacon
  page.tsx            Single-page content (hero, about, projects, support, contact)
  globals.css         Global styles and synthwave theme
  icon.svg            Monogram favicon (Next.js app icon convention)
  api/
    event/
      route.ts        POST /api/event, the click-count endpoint (logic in lib/events.ts)
  components/
    CursorGlow.tsx    Cursor-following glow, mounted site-wide in the layout
    HorizonGrid.tsx   Animated horizon and light cycles behind the hero
    SupportButton.tsx Ko-fi donation button and its on-page modal
    TrackedLink.tsx   External link that sends a click event to /api/event
    Typewriter.tsx    Types out the hero tagline
  lib/
    events.ts         Click counts: the two event names, the endpoint handler and sendEvent
  loop-year/
    layout.tsx        Shared header, navigation and footer for the Loop Year pages
    privacy/
      page.tsx        Loop Year privacy policy (linked from App Store Connect and the app)
    support/
      page.tsx        Loop Year support page and FAQ (the App Store support URL)
  privacy/
    page.tsx          Website privacy notice (analytics, tracked link events, Ko-fi), linked from the footer
  roast-conductor/
    layout.tsx        Shared header, navigation and footer for the Roast Conductor pages
    page.tsx          Roast Conductor product page
    privacy/
      page.tsx        Roast Conductor privacy policy (linked from App Store Connect and the app)
    sample-recipe/
      page.tsx        Sample recipe with schema.org JSON-LD, for trying the app's recipe link import
    support/
      page.tsx        Roast Conductor support page and FAQ (the App Store support URL)
```

`npm run check:structure` fails if this block and the contents of `app/` disagree, so it cannot
quietly go stale again.

## CI

Pull requests and pushes to `main` run lint, type-check, build and tests via GitHub Actions (see `.github/workflows/ci.yml`).

## Deployment

The site is served at [frazzledproductions.com](https://frazzledproductions.com) and www by the
Cloudflare Worker `website` (OpenSpec change `run-site-on-cloudflare-workers`, ops #610; cutover 19
November 2026). The two hostnames are Worker Custom Domains attached in Cloudflare, not routes in
`wrangler.jsonc`, so a deploy never changes DNS.

`.github/workflows/deploy.yml` deploys with wrangler:

- **Push to `main`:** tests, `npm run cf:build`, D1 migrations applied to `website-events` and to
  `website-events-preview`, then `npm run cf:deploy` to the Worker `website`.
- **Pull request from this repo:** the same build without the analytics token, and a preview version
  uploaded to the separate `website-preview` Worker with the alias `pr-<number>`; a comment on the PR
  gives its URL. Previews never touch production data, because version URLs share their Worker's
  bindings. A migration the PR adds reaches the preview database only after it merges.
- **No `CLOUDFLARE_API_TOKEN` in the job's environment** (Dependabot, forks, or the preview token not
  created yet): the Cloudflare steps are skipped with a notice and the job passes.

**Deploy guard** (ops #610, 19 November 2026). The token is not a repository secret. Each job reads
`CLOUDFLARE_API_TOKEN` from its GitHub environment: `production` admits only `main` and holds the
account token (D1, R2 and Workers write); `preview` holds a token limited to the preview Workers (no
D1 or R2: Cloudflare cannot limit a token to one D1 database), or nothing, so a pull request cannot
write a live database or deploy the live Worker. The repository variables are `CLOUDFLARE_ACCOUNT_ID`,
`KOFI_URL` and `NEXT_PUBLIC_CF_BEACON_TOKEN`. `wrangler.jsonc` holds the two D1 database ids, both
created with `--jurisdiction=eu`.

### Click counts

Clicks on the Poké Memory card and the "Support the studio" button are counted by `POST /api/event`
as daily totals per link in the `event_counts` table: the date, the link's name and a number, nothing
else. To read them (needs Cloudflare access):

```bash
npx wrangler d1 execute website-events --remote --command "SELECT day, name, count FROM event_counts ORDER BY day DESC LIMIT 60"
```

Page views are in the Cloudflare dashboard under Web Analytics.

### Rollback

For 14 days after the cutover, Vercel is the rollback. Vercel still builds every push to `main`, so
first use Vercel's Instant Rollback to the pre-merge production deployment
(`dpl_42iin6ig53fsi99GxQVTZcq6GxQf`, commit `3fff1e5`), then remove the two Worker Custom Domains and
recreate the apex A record (`76.76.21.21`) and the `www` CNAME (`cname.vercel-dns.com`), DNS only.

---

FRAZZLED PRODUCTIONS LTD &nbsp;|&nbsp; Company No. 17258540 &nbsp;|&nbsp; 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
