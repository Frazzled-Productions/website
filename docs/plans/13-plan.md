# Plan: #13 Framework deps are pinned exactly with no Dependabot, so Next.js security patches can never reach the site

## What this is

Add `.github/dependabot.yml` so the `npm` and `github-actions` ecosystems get a weekly update check,
with the framework packages grouped so lockstep versions move together. One new file, no change to
`package.json`, no change to CI.

I verified the issue's claims against the tree at `68ffffc` before planning:

| Claim | Check |
| --- | --- |
| No update automation | `ls -a .github` returns only `workflows`; `.github/workflows/ci.yml` is the only file in it |
| Exact pins | `package.json:14-16` (`next`, `react`, `react-dom`) and `package.json:24` (`eslint-config-next`) carry no range |
| The rest carry ranges | `package.json:19-26` are all carets (`^4`, `^20`, `^19`, `^9`, `^5`), so those already move on a fresh `npm install` |
| Sibling repos have it | `koinori/.github/dependabot.yml` (swift + github-actions), `poke-memory/.github/dependabot.yml` (npm + github-actions, grouped) |
| No `qa` branch here | `git branch -a`: this repo has `main` only, so unlike the siblings there is no `target-branch` to set |

One correction to the issue: the `github-actions` entry keeps `uses:` refs current
(`actions/checkout@v4`, `actions/setup-node@v4` at `ci.yml:18-19`), but it does **not** touch
`node-version: '20'` at `ci.yml:21`. That is a workflow input string, not an action version, and
Dependabot has no view of it. So this change covers less of the CI Node issue than #13 suggests: the
Node pin stays stale until that issue is worked on its own.

## Files to change

- **`.github/dependabot.yml` (NEW)** - the whole change. Two `updates` entries (`npm` and
  `github-actions`), both `directory: "/"` (the only `package.json` and the only workflow are at the
  root), both weekly on Monday, both `open-pull-requests-limit: 5`. Groups on the npm entry so
  packages that must move together arrive in one PR. `target-branch` deliberately omitted: this repo
  has no `qa` branch, so Dependabot's default of the default branch (`main`) is what we want, and
  spelling it out would just be a thing to get wrong later.

Nothing else changes. `package.json` keeps its exact pins, `ci.yml` is untouched.

Proposed contents:

```yaml
# Dependabot version updates. Security *alerts* are a repo setting, not this file;
# see docs/plans/13-plan.md.
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    groups:
      # next and eslint-config-next are pinned to the same version on purpose
      # (both 16.2.7); splitting them across two PRs would land a mismatch.
      next:
        patterns: ["next", "eslint-config-next"]
      # react and react-dom must match exactly (both 19.2.4); the types track them.
      react:
        patterns: ["react", "react-dom", "@types/react", "@types/react-dom"]
      tailwind:
        patterns: ["tailwindcss", "@tailwindcss/*"]
      vercel:
        patterns: ["@vercel/*"]
      tooling:
        patterns: ["typescript", "eslint", "@types/node"]
      # Named groups above apply to version updates only (applies-to defaults to
      # version-updates). This one bundles security updates into a single PR.
      npm-security-other:
        applies-to: security-updates
        patterns: ["*"]
    ignore:
      - dependency-name: "eslint"
        update-types: ["version-update:semver-major"]
      - dependency-name: "typescript"
        update-types: ["version-update:semver-major"]

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
```

The two `ignore` entries are question 1 below. If you answer differently, drop or extend that block;
nothing else in the file changes.

## Approach

**Dependabot, not Renovate.** Both siblings already use Dependabot, it needs no app install or
token, and it reads config from the repo. Renovate is the more configurable of the two but would
make this the only repo in the group with a different tool, for a 12-dependency site. Rejected.

**Grouped PRs, not one per package.** `eslint-config-next` is pinned to the same version as `next`
and `react-dom` to the same version as `react`. Ungrouped, Dependabot opens those as separate PRs
and whichever merges first leaves the tree mismatched until the second lands. Grouping is also what
`poke-memory` does, so the two Next.js repos read the same way. The group names here are a subset of
`poke-memory`'s, minus the ones with no matching dependency (`vitest`, `supabase`), plus `eslint`
folded into `tooling` alongside `typescript` so the two majors-ignored packages sit together.

**Exact pins stay exact.** Dependabot rewrites an exact pin in place, so it is not an obstacle, and
Vercel and CI both build from `package-lock.json` anyway, which makes the caret-versus-exact
distinction cosmetic for reproducibility. Relaxing `next`/`react` to carets was considered and
rejected: it would change what a hand-run `npm install` does without changing what actually ships,
which is a semantic change for no delivered benefit, and it is outside what #13 asks for.

**This file alone does not deliver the issue's headline.** #13's title is about *security* patches.
`.github/dependabot.yml` configures **version updates**: a weekly sweep that would pick up a Next.js
security release within seven days as an ordinary bump. **Dependabot security updates** (immediate
PRs against known advisories) and **Dependabot alerts** are a repository setting under Settings ->
Advanced Security, not something any file in this repo can turn on. I could not check whether they
are already enabled: `gh api` is refused in this sandbox. Treat that toggle as part two of the fix,
and see question 3.

**Sequencing note.** Dependabot reads `dependabot.yml` from the **default branch**. It will do
nothing at all while the file sits on a PR branch, so there is no way to observe real behaviour
before merging to `main`. Plan for the verification to happen after the merge, not before it.

## Testing

There is no code change, so the meaningful proof is all post-merge observation. In order:

1. **Pre-merge, local.** `npm run lint && npm run typecheck && npm run build` should still pass, on
   the same output as before: this file is not compiled or linted by anything in the toolchain, so a
   change here means one of those was already broken. CI (`.github/workflows/ci.yml`) runs exactly
   these three on the PR.
2. **Pre-merge, YAML validity.** Nothing in the repo validates this file, and a syntax error fails
   silently until you go looking. Cheapest real check is GitHub's own: after merging, Insights ->
   Dependency graph -> Dependabot shows a parse error banner if the file is malformed. If you want
   it caught earlier, `npx --yes yaml-lint .github/dependabot.yml` proves it is valid YAML (though
   not that the schema is right).
3. **Post-merge, the actual proof.** Insights -> Dependency graph -> Dependabot should list two
   entries, `npm` and `GitHub Actions`, each with a "Last checked" timestamp. Use **Check for
   updates** on each rather than waiting for Monday.
4. **Expected first run,** against the `npm outdated` in the issue (recorded 2026-08-19, so probably
   drifted): a `next` group PR (16.2.7 -> 16.3.1, both packages), a `react` group PR (19.2.4 ->
   19.2.8 plus types), a `tailwind` group PR (4.3.0 -> 4.3.3), a `tooling` PR for `@types/node` and
   `eslint` patch level, and a `github-actions` PR if newer `checkout`/`setup-node` tags exist. If
   `eslint` 10 or `typescript` 7 appears in that list, the `ignore` block is not working.
5. **The merge test.** Merge one PR (the `react` group is the low-risk one) and confirm CI goes green
   and the Vercel preview builds. That proves the whole loop, config to shipped dependency, works
   end to end.

There is no test suite in this repo to run: `package.json:5-11` has `dev`, `build`, `start`, `lint`
and `typecheck`, and no `test`. Green CI here means "it compiles and lints", not "the page is
correct". That is the substance of question 2.

## Risks and unknowns

- **Merging a `next` minor is not a rubber stamp.** `AGENTS.md` in this repo says in as many words
  that this Next.js has breaking changes versus training data and that the guide in
  `node_modules/next/dist/docs/` should be read before writing code. 16.2.7 -> 16.3.1 is a minor on
  the framework that renders the public company site, and CI only proves it builds. Read the release
  notes on that one PR specifically; the others are patch-level and much duller.
- **PR volume and preview builds.** Expect four to six PRs on the first run, then near-silence.
  Every PR triggers a Vercel preview deployment, so this has a small ongoing usage cost.
- **Grouping security updates into one PR is a trade.** One PR is tidier, but if two advisories land
  a week apart the second waits for the first to be dealt with. With 12 dependencies this should be
  rare enough not to matter; if it becomes annoying, delete the `npm-security-other` group and they
  go back to one PR each.
- **I could not re-run `npm outdated`.** The figures above are the issue's, from 2026-08-19, and
  today is 2026-09-12. The real first run may show more. I also cannot confirm whether 16.3.x
  contains a security fix or is routine.
- **The alerts toggle is unverified.** See question 3. If it is already on, part two is already done
  and this plan is the whole remaining fix.
- **Dependabot does not update `node-version: '20'`** in `ci.yml:21`, as noted above.

## Open questions for Fraser

**1. Should `eslint` 9 -> 10 and `typescript` 5 -> 7 be ignored, or just left to pile up?**

- **(A, recommended) Ignore `version-update:semver-major` for those two only**, as written above.
  They are deliberate upgrades with their own breaking changes, and a standing PR for each is noise
  that will sit open for months. Majors for `next`, `react` and the actions still come through,
  which is what you would actually want to see.
- **(B) Ignore majors for everything**, so the bot is strictly a patch-and-minor tool and every major
  is a decision you make on your own schedule.
- **(C) Ignore nothing**, and close the two PRs when they appear.

Trade-off: (A) keeps the bot's output meaningful and preserves visibility of framework majors, at the
cost of the ignore block needing revisiting when you *do* want eslint 10. (B) is the quietest, but it
also means a Next.js 17 would never announce itself here. (C) is the most informative and the
noisiest. Note that #13 itself suggests (A) "or a separate decision", which is why this is a question
rather than a silent choice.

**2. Auto-merge on green, or review every PR?**

- **(A, recommended) No auto-merge.** Every Dependabot PR gets a human merge.
- **(B) Auto-merge patch-level PRs after CI passes**, review minors and majors.

Trade-off: (B) is the usual answer for a repo with a test suite, because green CI means something.
Here CI is lint, typecheck and build only, so green means the site compiles, not that it renders
correctly, and this is the page outsiders and vendors read to verify the company. Four to six PRs on
the first Monday and then roughly one a week is not a review burden worth trading that for. If you
want (B) later, it needs a small extra workflow (`gh pr merge --auto` on Dependabot patch PRs), which
is a separate change, not a line in this file.

**3. The Dependabot alerts and security updates toggle: check it yourself, or file an issue?**

- **(A, recommended) You check Settings -> Advanced Security when you merge this.** It is a
  thirty-second look, and if alerts and security updates are already on, the headline of #13 is
  already half-solved and this file is the remaining half.
- **(B) I file a follow-up issue** so it is tracked and the loop can pick it up.

Trade-off: (A) closes the question immediately but leaves no record if you forget. (B) is the
issue-first default in `ops/standards`, but it books a ticket for what may well already be done. I
cannot resolve this from here: the sandbox refuses `gh api`, so the repo's current setting is
genuinely unknown to me, and I have not guessed at it anywhere above. Either way, the PR description
for this change should mention it, so whoever merges knows the file is not the whole fix.
