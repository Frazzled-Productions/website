# Plan: #12 CI builds on Node 20 (end of life) and on Actions three majors behind the org

## What this is

`.github/workflows/ci.yml` is the only automated gate before this site deploys, and it pins
`node-version: '20'` (`ci.yml:21`) plus `actions/checkout@v4` / `actions/setup-node@v4`
(`ci.yml:18-19`). Node 20 "Iron" went end of life on 2026-04-30, which is four and a half months
ago. Nothing turns red, so this will not fix itself.

The change is small and mechanical. The only real decision is how far to take it: a two line
version bump, or a bump plus a single source of truth for the Node major shared by local dev, CI
and Vercel. That is question 1 below, and the plan is written for the fuller option.

Everything I claim about the current state was read, not recalled:

| Claim | Verified at |
| --- | --- |
| CI pins Node 20 and `@v4` actions | `.github/workflows/ci.yml:18-21` |
| Node 20 ended 2026-04-30; Node 24 "Krypton" ends 2028-04-30 | `poke-memory/node_modules/node-releases/data/release-schedule/release-schedule.json` (absent here: this worktree has no `node_modules`) |
| Next supports Node 24 | `package-lock.json:5209-5211`, `next@16.2.7` engines `>=20.9.0` |
| `@types/node` pinned to the 20 line | `package.json:20`, resolving to `20.19.41` at `package-lock.json:1642` |
| No `.nvmrc`, no `engines`, no `vercel.json` | repo root listing, `package.json:1-28` |
| Org uses `24` and `@v7` | `poke-memory/.nvmrc` = `24`, `poke-memory/package.json:5-7` = `"node": "24.x"`, `poke-memory/.github/workflows/node-version-drift.yml:32-35` uses `@v7` with `node-version-file` |
| Org reusable workflow still defaults to 20 and pins `@v4` | `frazzled-dotgithub/.github/workflows/ci.yml:25` and `:52-53` |
| This repo has no test suite | `package.json:5-11`, no `test` script |

One correction to the issue body, which changes nothing: it quotes `npm view next@16.3.1 engines`,
but this branch pins `next` at `16.2.7` (`package.json:14`). The engines constraint is the same
`>=20.9.0` either way.

## Files to change

- `.github/workflows/ci.yml` (exists). Replace `node-version: '20'` with
  `node-version-file: .nvmrc` so the workflow stops carrying a second copy of the version, and bump
  `actions/checkout` and `actions/setup-node` from `@v4` to `@v7` to match the org. Leave `cache:
  'npm'`, the `concurrency` block (`:7-9`), `timeout-minutes` (`:14`) and `permissions` (`:15-16`)
  exactly as they are.
- `.nvmrc` (NEW, repo root). One line: `24`. Matches `poke-memory/.nvmrc` byte for byte, and is what
  both `nvm use` locally and `setup-node`'s `node-version-file` read.
- `package.json` (exists). Bump `@types/node` from `^20` to `^24` (`:20`) so `npm run typecheck`
  asserts the runtime the build actually uses, and add `"engines": { "node": "24.x" }` after
  `"private": true` (`:4`), mirroring `poke-memory/package.json:5-7`. The `engines` field is also
  what Vercel reads to select a build Node major, so it is doing real work here and not just
  documentation.
- `package-lock.json` (exists, generated). Regenerate by running `npm install` under Node 24, so
  `@types/node` resolves to a 24.x release instead of `20.19.41`. Do not hand edit.
- `README.md` (exists). Add the required Node major to "Getting started" (`:15-24`), next to `npm
  install`, pointing at `.nvmrc` as the source. One line. Nothing enforces this here, unlike
  poke-memory where `node-version-drift.yml:17` watches the README, so keep the wording pointing at
  `.nvmrc` rather than restating `24` as a second authority.

Not a file, but part of the same change: the Vercel project's Node.js version setting. See question
1 and the risks section.

## Approach

Make the Node major derivable from exactly one file, then bump.

`.nvmrc` becomes the source of truth. CI reads it through `node-version-file`, a developer reads it
through `nvm use`, and Vercel is aligned through `engines.node` in `package.json` (plus a dashboard
check, since that setting lives outside the repo). This is the shape the org already settled on in
poke-memory, so it needs no new invention here, and it is the only version of the fix that stops
this issue recurring. A literal `node-version: '24'` fixes today's symptom and rebuilds the exact
structure that produced it: three places holding the number, none of them checking the others.

Node 24, not 26. Node 24 is Active LTS and supported to 2028-04-30. Node 26 was released 2026-04-22
but does not become Active LTS until 2026-10-28, and Node 24 enters maintenance on 2026-10-20,
about five weeks from now. Matching the rest of the org is worth more than being newest, and a
later org wide move to 26 should be one deliberate decision, not this repo drifting ahead alone.

Rejected: adopting the org's reusable workflow in this change. The issue raises it and is right
that it is the tidier end state, but it does not currently deliver the fix. `frazzled-dotgithub`'s
`ci.yml` defaults to `node-version: '20'` (`:25`) and pins `actions/checkout@v4` /
`actions/setup-node@v4` itself (`:52-53`), so switching to it would leave both action pins exactly
as stale as they are now, while moving this site's only gate behind a shared file that encodes the
drift being fixed. It also drops three things this workflow has and the reusable one lacks: the
`concurrency` cancel-in-progress group, `timeout-minutes`, and the explicit `permissions: contents:
read`. The right order is to fix the org workflow first, then adopt it. That is question 2.

Rejected: porting poke-memory's `scripts/check-node-version.mjs` preinstall guard and
`node-version-drift.yml`. Both earn their keep there, across 47 `checkout` references and a repo
several people and several agents touch. Here there is one workflow with one `setup-node` step, and
`node-version-file` already removes the only literal a drift check would look for. Adding a
workflow to guard a single line is more moving parts than the problem justifies. Worth revisiting
if this repo grows a second workflow.

Sequencing: one commit, one PR. The lockfile regeneration and the workflow change belong together,
because a green CI run on the new Node is the evidence the bump is safe, and splitting them means
the first PR proves nothing.

## Testing

This repo has no test suite (`package.json:5-11` defines `dev`, `build`, `start`, `lint`,
`typecheck` and no `test`), so "what proves it works" is the three existing gates re-run on the new
runtime, plus two checks that the change is not a silent no-op.

1. **Local, under Node 24** (`nvm use` after adding `.nvmrc`, or Homebrew `node@24` on PATH). Run
   `npm install` to regenerate the lockfile, then `npm run lint`, `npm run typecheck` and `npm run
   build` in that order. All three must pass. `npm run typecheck` is the one that can genuinely
   break: `@types/node` `^20` to `^24` swaps the ambient Node types under `"strict": true`
   (`tsconfig.json:7`). Expected blast radius is small, since `app/` is React and Next code and the
   only Node facing files are `next.config.ts`, `postcss.config.mjs` and `eslint.config.mjs`.
2. **Confirm the runtime actually changed.** Green is not sufficient: `setup-node` would happily
   install 20.19.x and pass. In the PR's Actions run, open the `setup-node` step and check the
   resolved version line reads 24.x, and that the npm cache step still reports a restore or a save
   (proving `cache: 'npm'` survives the move to `node-version-file`).
3. **Confirm the `@v7` tags resolve.** A run that gets past `checkout` and `setup-node` at all is
   the proof; a bad tag fails the step immediately with an unresolvable action error.
4. **Vercel preview deployment on the PR branch.** Open its build log and check the Node version
   line matches 24. This is the only pre-merge evidence that CI and production build the same way,
   and it is what makes the whole change worth doing rather than just green-washing CI.
5. **No stale copies left.** `git grep "node-version: '20'"` returns nothing, and the `@types/node`
   entry in `package-lock.json` (currently line 1642) resolves to 24.x.

## Risks and unknowns

- **The Vercel setting is outside this repo and I could not read it.** `.vercel` is gitignored
  (`.gitignore:38`) and this lane has no network access, so I cannot say what Node major the project
  is currently set to. If it is pinned to 20 in the dashboard, this PR aligns local and CI but
  leaves the deploy diverged, which is two thirds of the fix at best. Someone needs to look, via the
  project's Settings or `vercel project inspect`. Adding `engines.node` should make the repo
  authoritative, but "should" is doing work in that sentence and the preview build log (test 4) is
  what settles it.
- **`engines` warns, it does not enforce.** Under default npm settings a wrong Node major produces
  an `EBADENGINE` warning and carries on, unless `engine-strict=true` is set in an `.npmrc`. That is
  why poke-memory also has the `preinstall` guard script. The single source of truth claim here is
  therefore "one place to read the number", not "impossible to build on the wrong major".
- **`@v4` to `@v7` skips two majors of release notes I have not read.** No network from this lane,
  and no `node_modules` in this worktree. The mitigation is that the exact combination being
  proposed, `@v7` with `node-version-file` and npm caching, is already running across poke-memory's
  workflows, so it is proven inside the org. Worth a skim of both actions' release notes before
  merging anyway, particularly for any changed default around caching or the checkout token.
- **Node 24 goes into maintenance on 2026-10-20**, five weeks out, when Node 26 becomes Active LTS
  on 2026-10-28. This change is not wrong because of that, but it does mean the next bump is a
  visible, near term, org wide decision rather than a surprise in 2028.
- **TypeScript target is ES2017** (`tsconfig.json:3`) with `skipLibCheck: true` (`:6`). The
  skipLibCheck setting makes an `@types/node` 24 regression unlikely to surface as a wall of errors
  in third party types, which is good for this change and slightly bad in general, since it also
  hides real incompatibilities. Not worth touching here.

## Open questions for Fraser

### 1. Two line bump, or the single source of truth?

**(A, recommended) The full version**: `.nvmrc`, `node-version-file`, `engines.node`, `@v7`,
`@types/node ^24`, plus a check that the Vercel project's Node version matches. This is the plan
written above. It costs one extra file, one extra `package.json` field, one README line, and one
look at the Vercel dashboard that only you can do.

**(B) The minimal version**: `node-version: '24'` literal, `@v7`, `@types/node ^24`. Three files
touched, no Vercel involvement, done in ten minutes.

**Trade-off.** (B) clears the end of life runtime, which is the security relevant part, and nothing
else in the issue is urgent. But it leaves the number in three places with nothing comparing them,
which is precisely how CI ended up four months behind without anyone noticing, and it means a green
CI run still is not evidence the Vercel build behaves the same way. (A) costs perhaps twenty extra
minutes and one dashboard visit. I recommend (A) because the repeat is the expensive part: this is
the second time the org has had to notice this class of drift, and poke-memory already paid for the
pattern that prevents it.

If you pick (B), drop `.nvmrc`, the `engines` field and the README line from "Files to change", and
tests 4 and 5 lose most of their point.

### 2. What happens to the org's reusable workflow?

**(A, recommended) File an issue against `Frazzled-Productions/.github`** to bump its `node-version`
default to `24` and its own action pins to `@v7`, and separately note that this repo should adopt it
afterwards. Fix this repo now as planned above, unblocked.

**(B) Leave the reusable workflow alone** and accept that this repo stays hand rolled. Revisit when
a third repo needs the same CI.

**Trade-off.** (A) is the only route that ends with the Node major in one place org wide, and the
org workflow's stale defaults are a live trap: the next repo that adopts it in good faith inherits
Node 20 and `@v4` pins, which is this issue again with extra steps. (B) is honest about there being
two consumers and no urgency, and avoids spending effort on shared infrastructure before the second
real consumer exists. I recommend (A), but only the issue, not the adoption: swapping this site's
only deploy gate for a shared workflow that currently lacks `concurrency`, `timeout-minutes` and an
explicit `permissions` block is its own change with its own risks, and it should not ride along with
a version bump.

Both options mutate shared GitHub state, which is why it is a question rather than something I
filed. Your standing rule is to ask first.
