# Plan: #16 README project structure is out of date and public/ holds only unused create-next-app scaffolding

## What this is

Two small, behaviour-free corrections to the repo's front door, both verifiable by inspection:

1. `README.md:44-53` describes a site that no longer exists. It misses the Support section, lists
   three of the five components, mis-describes two of them as "visual effects", and omits
   `app/icon.svg`.
2. `public/` contains nothing but the five SVGs create-next-app ships, none of which is referenced
   anywhere. Two of them are Next's and Vercel's logos, served from the company site's static root.

I re-checked every claim in the issue against the working tree at `68ffffc` and all of them hold:

| Claim | Check | Result |
| --- | --- | --- |
| Support section is missing from the README | `app/page.tsx:93-116` renders it (landed in `c655c0c`) | confirmed |
| Five components, not three | `app/components/` holds `CursorGlow.tsx`, `HorizonGrid.tsx`, `SupportButton.tsx`, `TrackedLink.tsx`, `Typewriter.tsx` | confirmed |
| `app/icon.svg` is omitted | file exists; `31546b6` deleted `app/favicon.ico` and added `app/icon.svg` in the same commit, so it is the only favicon source in the repo | confirmed |
| The five SVGs are unreferenced | recursive grep for all five filenames across `app/`, `README.md`, `next.config.ts`, `package.json`, `.github/`, `docs/` returns nothing; the only hit for `public/` at all is `README.md:52` | confirmed |

The rest of the README is accurate and is not in scope: the Scripts table matches `package.json`,
the Tech stack versions match the dependency block (`next` 16.2.7, `react` 19.2.4, Tailwind v4), and
`KOFI_URL` is read at `app/page.tsx:10` exactly as the Configuration table describes.

## Files to change

| Path | Change | Why |
| --- | --- | --- |
| `README.md` | Rewrite the fenced block at lines 46-53 (the tree only, leave the `## Project structure` heading and every other section alone) | It is the inaccurate part, and the only inaccurate part |
| `public/file.svg` | Delete (`git rm`) | Unreferenced create-next-app scaffolding |
| `public/globe.svg` | Delete (`git rm`) | Unreferenced create-next-app scaffolding |
| `public/next.svg` | Delete (`git rm`) | Unreferenced, and it is Next's logo on the company's static root |
| `public/vercel.svg` | Delete (`git rm`) | Unreferenced, and it is Vercel's logo on the company's static root |
| `public/window.svg` | Delete (`git rm`) | Unreferenced create-next-app scaffolding |

No new source files. `docs/plans/16-plan.md` (this file) is new and is the only other addition.
Deleting all five files removes `public/` from the repository, because git does not track empty
directories, so the `public/` line goes out of the README tree with them.

## Approach

**The README block becomes a per-file component list.** Proposed replacement for lines 46-53, every
line of which is checked against the source cited beside it:

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
```

Evidence for each line: `layout.tsx:23-26` (metadata), `:39` (`CursorGlow`), `:41` (`Analytics`);
`page.tsx:16-135` for the five sections in order, with Support at `:93-116`; `page.tsx:29`
(`HorizonGrid` in the hero); `SupportButton.tsx:11-23` (pill plus Ko-fi iframe modal);
`TrackedLink.tsx:19-28` (`track(event)` on click); `Typewriter.tsx:4-22`.

**What I rejected.** Keeping `components/` as a single line with a widened description ("visual
effects and interactive elements") is one line shorter and would technically fix the issue. I
rejected it because that shape is what failed here: a grouped label has to be re-judged every time a
file is added, it silently tolerates omissions, and it tells a reader nothing about what
`TrackedLink` or `SupportButton` actually do. Five files is small enough to name, and a named list
goes visibly wrong when it drifts rather than quietly wrong.

**The SVGs go, rather than being kept behind a placeholder.** I considered leaving `public/` alive
with a `.gitkeep` so the directory survives for a future `robots.txt` or social image. Rejected: the
`public/` directory is optional in Next, nothing here needs it today, and a placeholder file is
itself scaffolding. Whoever adds the first real static asset recreates the directory and restores
the README line in the same change, which is cheaper than carrying an empty one.

**Commit shape.** One commit on a branch off `main`, message ending `(#16)` to match the repo's
history (`c655c0c`, `8d51c41`, `21bf903`). Both halves are the same five-minute cleanup and there is
no reason to review them apart. Push and open a PR to `main` so CI runs; `AGENTS.md` permits
auto-push on this repo, and `npm run lint` before committing is a repo-local convention.

## Testing

There is no test suite in this repo. What CI runs (`.github/workflows/ci.yml:20-25`) is the whole
check set, and the implementer should run the same four commands locally. Note that `node_modules`
is absent from this worktree, so `npm ci` is genuinely needed first, not a formality.

1. `npm ci`
2. `npm run lint` - must pass unchanged, no source file is touched.
3. `npm run typecheck` - same.
4. `npm run build` - **this is the load-bearing one.** It is what proves Next 16 does not require a
   `public/` directory to exist and that no import resolved to one of the deleted SVGs. If the
   build survives the deletion, the deletion is safe.

Then three checks by inspection, which is what the issue is asking for:

5. Re-run the reference grep on the branch, after deletion, over `app README.md next.config.ts
   package.json .github docs`, searching for `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`,
   `window.svg` and `public/`. Expected: no hits at all, including no surviving `public/` line in
   the README.
6. `ls -R app` and read the new README block beside it. Every entry in the block must exist and
   every file in `app/` must appear in the block.
7. `npm run dev`, load `http://localhost:3000`, and confirm the browser tab still shows the monogram
   favicon. That favicon comes from `app/icon.svg`, so it must be unaffected; it is the one
   user-visible thing the deletion could plausibly have touched. `http://localhost:3000/next.svg`
   returning 404 afterwards is the expected, intended outcome.

The PR's own diff is the rest of the evidence: it should contain exactly one modified file and five
deletions.

## Risks and unknowns

- **I could not read the bundled Next docs.** `AGENTS.md` says to read
  `node_modules/next/dist/docs/` before writing code, and `node_modules` is not installed in this
  worktree, so I could not confirm from the shipped docs that `public/` is optional in 16.2.7 or
  that `app/icon.svg` is still the current icon convention. Neither claim is load-bearing on my
  memory: step 4 settles the first empirically, and the second is settled by `31546b6` removing
  `app/favicon.ico` in favour of `app/icon.svg` with the live site still showing a favicon. The
  implementer will have `node_modules` after step 1 and can read the docs if anything surprises them.
- **Deleted URLs start returning 404.** `frazzledproductions.com/next.svg` and the other four will
  404 after deploy. Nothing in this repo ever linked them and they are stock create-next-app files,
  so an inbound external link is close to inconceivable, but it is the only externally visible effect
  of this change.
- **`public/` vanishes from the repo entirely**, rather than becoming empty. That is intended, but
  it means a later "add an og:image" change has to recreate the directory. Worth knowing rather than
  discovering.
- **This block has now gone stale twice** (analytics in `8d51c41`, then donations in `c655c0c`, and
  the favicon in `31546b6` before both). Fixing the text does nothing about the cause. A follow-up
  worth considering separately: either stop enumerating files in the README at all, or add a CI step
  that diffs the block against `ls app`. Out of scope here, and I would not bolt it onto a
  five-minute cleanup.

## Open questions for Fraser

**1. Should the structure block stay app-only, or cover the repo?** The current block documents
`app/` plus `public/`, and `public/` is about to disappear, which leaves it documenting `app/` alone.
The repo also has `.github/workflows/` and `docs/plans/`.

- **(A, recommended) Keep it app-only.** The README already covers CI in its own section
  (`README.md:55-57`), so `.github/` is not undocumented, just documented elsewhere. Fewer lines
  means fewer lines to go stale, which is the exact failure this issue is about.
- **(B) Add `.github/workflows/` and `docs/plans/` lines.** A newcomer sees the whole repo shape in
  one place, including where the loop's plan and question artefacts land.

**Trade-off.** (B) is more honest about what is in the repo, and `docs/plans/` is genuinely
non-obvious to anyone who has not met the Porter loop. Against it: `AGENTS.md` notes this repo is
read by outsiders and by vendors verifying the company, and (B) puts a pointer to the agent loop's
working notes on the front door rather than leaving it a directory you find if you look. I could not
check whether the GitHub repo is public in this session (the `gh` CLI is not in my permission
profile), which is the only fact that changes how much (B) actually exposes. If the repo is private,
(B) is harmless and the choice is purely about README length.

**2. Anything to put in `public/` while we are here?** The obvious candidates are a `robots.txt` and
an og:image social card, both of which the site currently lacks.

- **(A, recommended) No. Delete only, and file a separate issue** for social preview and robots if
  you want them. It keeps this change five minutes long and verifiable by inspection, which is what
  the issue promised.
- **(B) Fold them in now**, so `public/` never goes empty and the README line survives.

**Trade-off.** (B) saves a round trip and a link shared on Slack or iMessage would stop rendering as
a bare URL, which for a company site is worth something. But an og:image needs artwork and a design
call, so (B) turns a change that needs no eyes into one that does, and it buries a real product
decision inside a tidy-up PR. I would rather the social card got its own issue and its own review.
