# Plan: #9 Koinori waitlist page (acquisition validation gate)

## What this is

Issue #9 asks this repo (`website`, frazzledproductions.com) to stand up a koinori.com waitlist.
It should not be built here, because it already exists somewhere else.

The koinori.com waitlist was built in the separate `koinori-web` repo on 2026-06-12, two days after
this issue was filed on 2026-06-10. `ops/architecture.md:43` records `koinori-web` as "Koinori's web
presence / The Next.js site (koinori.com)", so that repo, not this one, is the correct home for the
work. Commit `b25da02` there is literally titled "Add Koinori waitlist landing page".

Measured against #9's four requirements, using the code in `koinori-web` (verified by reading it,
not from the commit message):

| # | Requirement | Status |
| --- | --- | --- |
| 1 | Email capture + double opt-in, privacy note, no analytics beyond an aggregate count | **Mostly done.** Form, server action, confirm route and privacy page all exist. No analytics package is installed at all. One gap: `koinori-web#11` (open) shows the consent copy and privacy policy promise an unsubscribe link that is not implemented, which is a live UK GDPR/PECR defect on this exact instrument. |
| 2 | Positions the pitch-accent wedge, not a generic coming-soon page | **Done.** The hero reads "Sound Japanese, not just read it", and the lead feature card is badged "The difference / Hear your own pitch". |
| 3 | Signup count readable by the team | **Not done.** The count exists only as rows in a Supabase table behind the service-role key. There is no readout, no endpoint and no scheduled report, and no issue tracking it in any repo. |
| 4 | Feeds the pitch-accent content experiments (reach to signup conversion) | **Not done.** `source` is hardcoded to `"landing"` on every insert, so nothing can distinguish a TikTok visitor from a direct one. Tracked in `koinori-web#9` (attribution schema) and `koinori-web#2` (analytics vendor, still a `[USER-DECISION]`). |

So the useful output of this issue is not code in this repo. It is: close #9 here, and open one issue
in `koinori-web` for the one requirement (3) that is genuinely untracked anywhere.

## Files to change

Under the recommended option, **no source file in this repository changes**. The only file this plan
creates is itself.

- `docs/plans/9-plan.md` - **new** (this file). The plan and the evidence behind it.

Everything else is conditional on Fraser's answers below.

If Fraser picks option B on question 1 (link Koinori from the studio site):

- `app/page.tsx` - exists. Add a second project card inside the existing Projects section (currently
  one hardcoded card, lines 63-90), using the existing `TrackedLink` so the click-through is counted
  like `pokememory_click` is. The section markup is inline and repeated per card, so this is either
  duplicated JSX or a small extraction of a `ProjectCard` component.
- `README.md` - exists. Line 5 describes the site as introducing "its projects, currently Poké
  Memory"; that sentence goes stale the moment a second card lands.

The residual work for requirements 3 and 4 lands in `koinori-web`, **not in this working copy**, and
is out of scope for this plan. For reference, the files it would touch there:

- `koinori-web/src/app/actions.ts` - exists. `joinWaitlist` writes `source: "landing"` unconditionally
  (line 50); requirement 4 needs the inbound UTM/referrer captured here instead.
- `koinori-web/supabase/migrations/` - a **new** migration if attribution needs more than the existing
  `source` column.
- A **new** count readout in `koinori-web` (route or scheduled report) for requirement 3.
- `koinori-web/src/lib/resend.ts` plus a **new** unsubscribe route, for the `koinori-web#11` defect.

## Approach

**Verify, then redirect. Do not rebuild.**

The decision this plan actually makes is to treat #9 as an issue filed against the wrong repo whose
substance has largely shipped, and to say so with evidence rather than produce a plan for a second
waitlist. The verification behind that:

- `ops/architecture.md:43` assigns koinori.com to `koinori-web`.
- `koinori-web` git history: `b25da02` "Add Koinori waitlist landing page", then `28801d9` revamping
  the questionnaire and `d5e8d77` expanding `/privacy`.
- Double opt-in is real, not claimed: `supabase/migrations/20260612000000_init.sql` has
  `confirm_token` and a nullable `confirmed_at`; `src/app/actions.ts` only sends the email when
  `confirmed_at` is null; `src/app/confirm/route.ts` is what sets it. RLS is enabled with no
  policies, so the browser cannot read the table.
- Privacy posture holds: `koinori-web/package.json` has no analytics dependency, in contrast to this
  repo which does ship `@vercel/analytics`.
- The gate numbers in #9 are accurate: `koinori/research/monetisation/unit-economics-model.md:103-104`
  says >= 2,000 = go, 500-2,000 = strengthen, < 500 = rethink.
- The parent, `koinori#45`, is CLOSED, and its item 3 is the sentence this issue was cut from.

**Rejected: build the waitlist in this repo** (as a `/koinori` route on frazzledproductions.com, or
as a second capture form). It would split the very number the gates measure across two stores, create
a second UK GDPR controller surface and a second sending domain to warm and authenticate, and leave
two privacy notes to keep in step. The gate is only meaningful if there is exactly one count.

**Rejected: mirror or proxy the koinori-web form from this site.** Same split-count problem, plus a
cross-origin form post and a third-party iframe on the studio site for no acquisition gain.

**Rejected: declare #9 under-specified.** It is specified fine. It is simply already answered, and
saying "cannot plan until X is decided" here would be wrong.

## Testing

This repo has no test framework: `package.json` defines only `dev`, `build`, `start`, `lint` and
`typecheck`, and `.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npm run typecheck`,
`npm run build`. There are no unit or E2E tests to name, and this plan does not propose adding a
framework for a change that ships no code.

Under the recommended option there is no code to test. What proves the claim instead is the
verification checklist above, each item of which is a repeatable check:

1. `ops/architecture.md:43` names `koinori-web` as the koinori.com site.
2. `git -C ../koinori-web log --oneline` shows `b25da02`.
3. `koinori-web/src/app/confirm/route.ts` sets `confirmed_at`; the column is nullable in
   `20260612000000_init.sql`.
4. `grep -i analytics koinori-web/package.json` returns nothing.
5. `grep -n 'source:' koinori-web/src/app/actions.ts` shows the hardcoded `"landing"`.

If option B is chosen, the change is presentational and the existing gates cover it: `npm run lint`,
`npm run typecheck` and `npm run build` must pass (CI runs all three on the PR), plus a manual
`npm run dev` check that the new card renders at mobile and desktop widths and that its
`TrackedLink` event name is distinct from `pokememory_click`.

## Risks and unknowns

- **koinori.com's live status is unverified from this session.** DNS and HTTP probes were refused by
  the sandbox, so I can only report that `ops/architecture.md` assigns the domain to `koinori-web`
  and that the repo carries a `.vercel/project.json` linking project `koinori-web`. If the domain is
  not actually attached and serving, then #9's intent is genuinely unmet, but the fix is in
  `koinori-web` and its Vercel project, not here. Worth a 10-second check before closing #9.
- **Requirement 1 is not cleanly signed off** while `koinori-web#11` is open: three user-facing
  strings promise an unsubscribe that does not exist, and one of them is written into
  `survey_response.consent_text` as the consent audit trail. Closing #9 as "done" without noting this
  would overstate the compliance position. `koinori-web#10` (the privacy policy claiming no servers
  and no analytics while the shipped app declares both) touches the same page.
- **No signups data seen.** I have not looked in the Supabase project, so I cannot say whether the
  waitlist has 0 or 400 rows, nor whether the gate clock has effectively been running since June.
- **Closing #9 mutates shared GitHub state**, which your standing rule says to ask about first. This
  plan does not close anything; question 1 is the ask.

## Open questions for Fraser

**1. Where does #9 land?**

- **(A, recommended) Close #9 as delivered in `koinori-web`**, with a comment pointing at commit
  `b25da02`, and open one new `koinori-web` issue for requirement 3 (the count readout), which is the
  only requirement not tracked anywhere. Requirement 4 already sits in `koinori-web#9` and
  `koinori-web#2`.
- **(B) Keep #9 open here, rescoped** to "link Koinori from frazzledproductions.com", and close the
  waitlist part.

Trade-off: (A) keeps issues next to the code that satisfies them and stops this loop re-planning a
built feature every time #9 comes up, but the studio site still does not mention Koinori. (B) keeps a
real task on this repo, at the cost of leaving an issue whose title and body describe work that is
not going to happen here. They are not exclusive: (A) plus question 3 below gets both.

**2. Does the gate count confirmed signups, or all rows?**

- **(A, recommended) Confirmed only** (`confirmed_at is not null`).
- **(B) All rows**, confirmed or not.

Trade-off: confirmed-only is the number double opt-in exists to produce, and is the audience you
could actually email a TestFlight invite to. All-rows will be materially higher because it includes
people who never clicked and any bot that got past the honeypot, which flatters a 2,000 threshold
that is meant to be a hard go/rethink decision. Whichever you pick should be written next to the
thresholds in `unit-economics-model.md:103`, because "waitlist signups >= 2,000" currently does not
say which.

**3. Should frazzledproductions.com list Koinori now, or wait?**

- **(A) Add a Koinori card now**, badged (for example) "In development", linking to koinori.com. It
  slots into the Projects section beside Poké Memory and feeds the waitlist a small trickle of
  traffic.
- **(B, recommended) Wait until beta or launch.** The Projects section currently shows one card
  badged "Live"; a second card with no ship date is the kind of thing that reads as stale within a
  couple of months, and per `AGENTS.md` this page is read by outsiders and by vendors verifying the
  company.

Trade-off: (A) is maybe an hour of work and makes the studio look like it has more than one product,
which is worth something when Apple or a vendor looks you up. (B) protects the page from ageing badly
and costs nothing now, since the content experiments point at koinori.com directly and do not route
through the studio site.

**4. How should the signup count be readable, once you have decided question 2?**

- **(A) A saved SQL query in the Supabase dashboard** that you run when you want the number. Zero
  code, zero new surface, but only a human with dashboard access can read it.
- **(B, recommended) A small token-protected JSON route in `koinori-web`** returning the aggregate
  count (no addresses, nothing personal). Roughly twenty lines, and it makes the gate checkable by
  automation, which matters if the intent is that a loop or a weekly report watches the number rather
  than you remembering to look.

Trade-off: (B) adds an endpoint on a public site, so it needs a shared secret and must return only an
integer, never rows. (A) has no attack surface at all but means the gate is only ever checked when
you happen to check it, which for a metric measured "from now until beta end" is the failure mode
worth avoiding.
