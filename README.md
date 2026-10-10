# Frazzled Productions

The company website for [Frazzled Productions](https://frazzledproductions.com), an independent software studio based in London.

It is a single-page synthwave-styled site introducing the studio and its projects, currently [Poké Memory](https://pokememory.com), plus pages for the Roast Conductor iPhone app
(product, support and privacy policy) under `/roast-conductor`.

## Tech stack

- [Node.js 24](https://nodejs.org) (pinned in `.nvmrc`)
- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- Deployed on [Vercel](https://vercel.com)

## Getting started

This repo runs on Node.js 24. The major lives in [`.nvmrc`](.nvmrc), so `nvm use` (or `fnm use`)
picks it up, and `engines` in `package.json` is what Vercel reads when it chooses a build runtime.
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
| `KOFI_URL` | Full URL of the studio's Ko-fi page (e.g. `https://ko-fi.com/frazzledproductions`). The home page's **Support** section only renders when this is set, so the donation mechanism stays off the live site until it is configured in Vercel. |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint, then the project structure check below |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run check:node-version` | Check that nothing contradicts the Node major in `.nvmrc` |
| `npm run check:structure` | Check the **Project structure** block below against the contents of `app/` |

## Project structure

```
app/
  layout.tsx          Root layout, fonts, metadata, cursor glow, and analytics
  page.tsx            Single-page content (hero, about, projects, support, contact)
  globals.css         Global styles and synthwave theme
  icon.svg            Monogram favicon (Next.js app icon convention)
  components/
    CursorGlow.tsx    Cursor-following glow, mounted site-wide in the layout
    HorizonGrid.tsx   Animated horizon and light cycles behind the hero
    SupportButton.tsx Ko-fi donation button and its on-page modal
    TrackedLink.tsx   External link that fires a Vercel Analytics event on click
    Typewriter.tsx    Types out the hero tagline
  roast-conductor/
    layout.tsx        Shared header, navigation and footer for the Roast Conductor pages
    page.tsx          Roast Conductor product page
    privacy/
      page.tsx        Roast Conductor privacy policy (linked from App Store Connect and the app)
    support/
      page.tsx        Roast Conductor support page and FAQ (the App Store support URL)
```

`npm run check:structure` fails if this block and the contents of `app/` disagree, so it cannot
quietly go stale again.

## CI

Pull requests and pushes to `main` run lint, type-check, and build via GitHub Actions (see `.github/workflows/ci.yml`).

## Deployment

The site is deployed automatically to Vercel on every push to `main`, and is served at [frazzledproductions.com](https://frazzledproductions.com).

---

FRAZZLED PRODUCTIONS LTD &nbsp;|&nbsp; Company No. 17258540 &nbsp;|&nbsp; 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
