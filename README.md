# Frazzled Productions

The company website for [Frazzled Productions](https://frazzledproductions.com), an independent software studio based in London.

It is a single-page synthwave-styled site introducing the studio and its projects, currently [Poké Memory](https://pokememory.com).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- Deployed on [Vercel](https://vercel.com)

## Getting started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. The page auto-updates as you edit files under `app/`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check with `tsc --noEmit` |

## Project structure

```
app/
  layout.tsx          Root layout, fonts, and metadata
  page.tsx            Single-page content (hero, about, projects, contact)
  globals.css         Global styles and synthwave theme
  components/         Visual effects (HorizonGrid, CursorGlow, Typewriter)
public/               Static assets
```

## CI

Pull requests and pushes to `main` run lint, type-check, and build via GitHub Actions (see `.github/workflows/ci.yml`).

## Deployment

The site is deployed automatically to Vercel on every push to `main`, and is served at [frazzledproductions.com](https://frazzledproductions.com).

---

FRAZZLED PRODUCTIONS LTD &nbsp;|&nbsp; Company No. 17258540 &nbsp;|&nbsp; 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
