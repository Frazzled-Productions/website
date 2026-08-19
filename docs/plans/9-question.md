# Question: #9 Koinori waitlist page (acquisition validation gate)

Written by the implementer lane for issue #9. No source file in this repository changed, because
building a second koinori.com waitlist here would be wrong, and every remaining option is a scope
decision that is yours to make rather than mine to guess.

## Why nothing was built

Issue #9 asks `website` (frazzledproductions.com) to stand up a koinori.com waitlist. That waitlist
already exists, in the `koinori-web` repo, which is the repo that serves koinori.com. The issue was
filed on 2026-06-10; the waitlist landed two days later.

I re-verified this from source rather than taking the plan in PR #10 on trust:

| Check | Result |
| --- | --- |
| `ops/architecture.md:43` | `koinori-web` = "Koinori's web presence / The Next.js site (koinori.com)" |
| `git -C ../koinori-web log` | `b25da02` "Add Koinori waitlist landing page", then `28801d9` (questionnaire revamp), `d5e8d77` (privacy page) |
| Double opt-in is real | `koinori-web/src/app/actions.ts:61` only sends the confirmation when `confirmed_at` is null; `src/app/confirm/route.ts:38` is what sets it |
| Privacy posture | `koinori-web/package.json` has no analytics dependency at all (this repo, by contrast, ships `@vercel/analytics`) |
| Gate numbers in #9 are accurate | `koinori/research/monetisation/unit-economics-model.md:103-104`: >= 2,000 = go, 500-2,000 = strengthen, < 500 = rethink |
| Parent issue | `koinori#45` is CLOSED |
| Requirement 3 (count readable) | Genuinely untracked: no issue in `koinori-web` covers it (issues open there are #1, #2, #4, #5, #6, #8, #9, #10, #11) |
| Requirement 4 (attribution) | `koinori-web/src/app/actions.ts:50` hardcodes `source: "landing"`, so a TikTok visitor is indistinguishable from a direct one. Tracked in `koinori-web#9` and `koinori-web#2` |

Building the capture form here instead would split the very number the gates measure across two
stores, create a second UK GDPR controller surface and a second sending domain to authenticate, and
leave two privacy notes to keep in step. The gate is only meaningful if there is exactly one count.
Mirroring or iframing the `koinori-web` form has the same split-count problem for no acquisition
gain, since the content experiments link to koinori.com directly and do not route through the studio
site.

That leaves nothing in this repository that is unambiguously in scope, so nothing was committed
beyond this file. There is no code change to test; `npm run lint && npm run typecheck && npm run
build` still passes.

## What I could not verify

- **koinori.com's live status.** Outbound network calls were refused in this unattended session, so
  I can only report that `ops/architecture.md` assigns the domain to `koinori-web`, that
  `koinori-web/.vercel/project.json` links the `koinori-web` Vercel project, and that
  `src/app/layout.tsx:16` defaults `siteUrl` to `https://koinori.com`. Worth a ten-second check
  before closing #9: if the domain is not actually attached and serving, #9's intent is unmet, but
  the fix is in `koinori-web` and its Vercel project, not here.
- **How many signups exist.** I have not looked in Supabase, so I cannot say whether the gate clock
  has been running with 0 rows or 400 since June.

## Question 1 (blocking): where does #9 land?

**(A, recommended) Close #9 as delivered in `koinori-web`**, with a comment pointing at `b25da02`,
and open one new `koinori-web` issue for requirement 3, the signup count readout, which is the only
requirement of the four that is tracked nowhere. Requirements 1, 2 and 4 are respectively shipped
(with the caveat below), shipped, and already tracked in `koinori-web#9` and `koinori-web#2`.

**(B) Keep #9 open here, rescoped** to "link Koinori from frazzledproductions.com", and close the
waitlist part of it as delivered elsewhere.

**Trade-off.** (A) puts the remaining work next to the code that has to satisfy it and stops this
loop re-planning a built feature every time #9 is picked up, but the studio site still does not
mention Koinori. (B) keeps a real task on this repo, at the cost of an issue whose title and body
describe work that is not going to happen here, which is how issues quietly go stale. They are not
exclusive: (A) plus a "yes" to question 2 gets both, with the second task filed as its own issue
that says what it actually is.

Note that (A) closes an issue and opens another, both mutations of shared GitHub state, which your
standing rule says to ask about first. That is why this file exists rather than a closed issue.

**Caveat on calling requirement 1 done.** `koinori-web#11` is open: the consent copy and the privacy
policy both promise an unsubscribe link that does not exist, and one of those strings is written
into `survey_response.consent_text` as the consent audit trail. That is a live UK GDPR/PECR defect
on this exact instrument. Closing #9 as "delivered" without naming it would overstate the compliance
position, so if you pick (A), the closing comment should link `koinori-web#11`.

## Question 2: should frazzledproductions.com list Koinori now, or wait?

**(A, recommended) Add a Koinori card now**, badged "In development", linking to koinori.com. It
slots into the Projects section beside Poké Memory (`app/page.tsx:63-90`) and uses the existing
`TrackedLink` so the click-through is counted the way `pokememory_click` is, with a distinct event
name. Roughly an hour of work.

**(B) Wait until beta or launch**, so the Projects section keeps showing only shipped products.

**Trade-off.** (A) makes the studio look like it has more than one product, which is worth something
given that per `AGENTS.md` this page is read by outsiders and by vendors verifying the company, and
it gives koinori.com an inbound link from an established domain. The About copy already says
"Currently shipping Poké Memory, with more in the works" (`app/page.tsx:49`), so a second card is
consistent with what the page already claims. (B) protects the page from ageing badly, since a card
with no ship date reads as stale within a couple of months, and costs nothing in acquisition terms
because the content experiments point at koinori.com directly.

This is where I differ from the plan in PR #10, which recommended waiting. I think the staleness
risk is real but cheap to reverse, whereas looking like a one-product studio to a vendor doing
diligence is not something you get a second chance at. It is a close call either way, and the badge
wording carries most of the risk: "In development" ages far better than a date.

## Carried forward to `koinori-web` (not this repo's call, but unresolved)

- **Does the gate count confirmed signups or all rows?** Confirmed only (`confirmed_at is not null`)
  is the number double opt-in exists to produce and the audience you could actually send a TestFlight
  invite to. All rows will be materially higher, which flatters a 2,000 threshold that is meant to be
  a hard go/rethink decision. Whichever you pick belongs written next to the thresholds in
  `unit-economics-model.md:103`, which currently does not say which.
- **How should the count be readable?** A saved Supabase dashboard query has no attack surface but
  means the gate is only checked when you remember to look, which is the failure mode worth avoiding
  for a metric measured from now until beta end. A small token-protected JSON route in `koinori-web`
  returning only an integer, never rows, makes it checkable by automation.
