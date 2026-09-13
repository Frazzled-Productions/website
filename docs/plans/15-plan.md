# Plan: #15 docs/plans/9-question.md still asks a blocking question about #9, which was closed as completed one second after the doc was committed

## What this is

`docs/plans/9-question.md` presents a live, "blocking" decision. Issue #9 has been closed as
completed since one second after that file landed, with no closing comment. The repository and the
tracker say opposite things, and the next lane to read `docs/plans/` will re-plan a decision the
tracker already calls done.

Re-verified in this session (2026-09-13), not taken from the issue on trust:

| Check | Result |
| --- | --- |
| `docs/plans/9-question.md:48` | heading reads "Question 1 (blocking): where does #9 land?" |
| `docs/plans/9-question.md:65-66` | states the file exists rather than a closed issue, because closing is a shared-state mutation needing your approval |
| `git log -1 68ffffc` | authored 2026-08-19 01:07:49 +0100, i.e. 00:07:49Z |
| `gh issue view 9` | `CLOSED`, `COMPLETED`, `closedAt 2026-08-19T00:07:50Z`, `comments: []` |
| `app/page.tsx:63-90` | still only the Poké Memory card, so Question 2 was neither taken nor declined |
| `koinori-web#11` | `CLOSED`/`COMPLETED` 2026-08-20, so the doc's caveat at lines 68-72 is spent, as #15 says |
| open `website` issues | #12, #13, #14, #15, #16; none tracks a Koinori card, so Question 2 is tracked nowhere |
| `docs/` contents | `docs/plans/9-question.md` is the only file; `README.md` never references `docs/plans/`, so nothing links to it |
| `koinori-web/src/app/actions.ts:50,61` | exists as the doc describes (`source: "landing"` hardcoded; confirmation gated on `confirmed_at`) |

New since the doc was written, and material: **`koinori-web#22` is open**, "Verify the waitlist
actually writes: zero rows and a broken form are currently indistinguishable". So "delivered in
`koinori-web`" is true of the code but not yet confirmed of the running system.

The tidy-up half of this is mechanical and is specified below in full. The substantive half is one
product answer only you can give (Question 2 of the old doc: does the studio site list Koinori?),
because that answer is the entire remainder of #9. **#15 cannot be fully closed until that is
answered**, and the plan does not guess it.

## Files to change

- `docs/plans/9-question.md` - replace its 107 lines with a short dated record that says #9 is closed
  and points at commit `68ffffc` for the analysis. Why: the failure mode is the file reading as an
  open decision, not the file existing; a pointer fixes that without deleting the evidence trail
  while #9 still carries no comment.
- `docs/plans/15-plan.md` (this file) - delete in the same change. Why: it has the same shelf life as
  the doc it replaces, and leaving a second plan doc behind in `docs/plans/` recreates #15 exactly.

No other file in the repository changes. Nothing under `app/`, no dependency, no CI change. If
Question 2 is answered "yes", the card itself is that new issue's work, not this one's.

## Approach

**Split the fix by who owns the write.** The repository change lands unilaterally; every GitHub
mutation (a comment on #9, a new issue) is listed for your approval with the text pre-drafted, per
the standing rule that shared GitHub state is asked about first. That way the repository stops
contradicting the tracker even if the GitHub half waits for you, which is the failure the original
doc fell into: it had no landing place that did not need permission, so it sat.

Proposed replacement for `docs/plans/9-question.md`, in full:

```markdown
# #9 Koinori waitlist: closed, nothing outstanding in this repository

**Status: closed 2026-08-19. Record written 2026-09-13 (issue #15). Not an open decision.**

Issue #9 asked this repository to stand up a koinori.com waitlist. That waitlist already existed in
`koinori-web`, the repository that serves koinori.com, so nothing was built here and nothing here is
outstanding. #9 is closed as completed.

The analysis behind that, including the verification table, is the original version of this file in
commit `68ffffc`. Read it as history. Do not re-plan from it.

Whether frazzledproductions.com carries a Koinori project card was the one question that analysis
left open. <one line, written per the answer to Question 2 below>
```

The implementer writes exactly one of these as that last line:

- if the card is wanted: `It is now tracked in #NN.`
- if it is not: `It was declined on 2026-09-13; see the closing comment on #9.`

**Rejected alternatives.**

1. *Delete the file outright* (the issue's first option). Rejected because #9 has no comments at all,
   so deletion would leave the reasoning reachable only by knowing that commit `68ffffc` exists. If
   you would rather have it gone, that is `git rm docs/plans/9-question.md` and the rest of this plan
   is unchanged.
2. *Keep the 107-line body under a dated header* (the issue's second option). Rejected because the
   header only fixes the top of the file: a reader who skims to line 48 still meets a heading that
   says "(blocking)" and two lettered options presented as live.
3. *Move it to a new `docs/decisions/`*. Rejected: one file does not justify a new convention, and
   per `ops/standards/where-things-live.md` company decisions belong in `ops` while product plans
   belong in the product repository. A closed record in place is the smaller change.
4. *Reopen #9*. Rejected: the waitlist genuinely exists, and reopening puts the work back in the one
   repository that cannot do it. The leftover is Question 2, which deserves its own issue with an
   accurate title, not #9's.

**Draft comment for #9**, for you to approve or edit (this is the piece that makes the tracker agree
with the repository):

```
Closing note, recorded late: this was closed 2026-08-19 with no comment. See #15.

The waitlist this issue asked for lives in koinori-web, which serves koinori.com, with double
opt-in (src/app/actions.ts, src/app/confirm/route.ts). Nothing was built in `website`: a second
capture form here would split the signup count that the go/strengthen/rethink gates measure.

Two caveats so "completed" is not read as more than it is:
- koinori-web#22 is open, so it is not yet confirmed that the form writes at all.
- Requirement 3, the signup count being readable by the team, has no dedicated issue;
  koinori-web#22 overlaps it only partly.

Whether frazzledproductions.com lists Koinori: <tracked in #NN | not for now>.

Full analysis: docs/plans/9-question.md as of commit 68ffffc in Frazzled-Productions/website.
```

(The commit `b25da02` cited by the old doc could not be re-verified in this session, so the draft
names the files rather than the SHA. The file paths were verified.)

**Draft issue, only if Question 2 is answered "yes":**

- Title: `Add a Koinori project card to the home page`
- Body: cites Question 2 of `docs/plans/9-question.md` at commit `68ffffc`; card slots beside the
  Poké Memory card at `app/page.tsx:63-90`, uses the existing `TrackedLink`
  (`app/components/TrackedLink.tsx`) with a distinct event name alongside `pokememory_click`, badged
  "In development" rather than a date; blocked on `koinori-web#22` so the site does not point traffic
  at a form that is not confirmed to write.

## Testing

There is no test runner in this repository (`package.json` has no `test` script), and this change is
markdown only, so the proof is the CI set plus two content assertions:

1. `npm run lint`, `npm run typecheck`, `npm run build` all pass. These are exactly the three steps
   CI runs (`.github/workflows/ci.yml:24-26`), so a green CI run on the PR is the same evidence.
2. `git grep -n "blocking" -- docs/` returns nothing, and `git grep -n "^## Question" -- docs/`
   returns nothing. That is the specific defect #15 names, asserted directly.
3. `ls docs/plans/` lists `9-question.md` only, confirming this plan file was removed with it.
4. Read the rendered `docs/plans/9-question.md` on the PR: the status line must be visible in the
   first three lines, and the file must fit on one screen.
5. If the GitHub half is approved: `gh issue view 9 --json comments` returns a non-empty array, and
   the placeholder line in the record file names either a real issue number or the declining comment.
   A record file still containing `<one line, written per...>` means the change is not finished.

## Risks and unknowns

- **The GitHub writes need your approval**, which is why the repository change is designed to stand
  on its own. If the answers do not come, the merged state is a repository that no longer lies and a
  tracker that is still silent, which is an improvement but not the whole fix.
- **koinori.com's live status is still unverified.** Outbound network calls were refused in this
  session, exactly as in the session that wrote the original doc. If the domain is not serving, a
  Koinori card would link to nothing, so whoever implements the card checks first.
- **`koinori-web#22` is open**, so the waitlist's write path is unconfirmed. This is why the draft
  comment says "delivered" only with that caveat attached, and why the card issue would be blocked
  on it.
- **Requirement 3 of #9 (a readable signup count) is still tracked nowhere specific.** Filing that is
  a `koinori-web` action and out of scope here; it is named in the draft comment so it stops
  disappearing.
- **Recursion risk.** If this is implemented by writing yet another `docs/plans/*.md` containing an
  unanswered question, #15 simply recurs. Hence this plan deletes itself as part of the change and
  routes the open question to you rather than to a file.
- `koinori-web#35` is the sibling instance of this defect class (five issues closed while the PRs
  say the work stopped on a question). Fixing `website` does not touch it.

## Open questions for Fraser

**Q1. May the implementer write to GitHub as part of this, using the drafts above?**

- **(A, recommended)** Yes: post the comment on #9, and open the Koinori card issue if Q2 is "yes".
- **(B)** Repository change only; you post the comment yourself when you get to it.

Trade-off: the defect is that the repository and tracker disagree, and only a tracker write makes
them agree, so (A) actually closes #15. The drafts are written out above so approving is reading, not
trusting. (B) keeps every shared-state write in your hands, at the cost of the tracker staying silent
for as long as it takes, which is how the original doc ended up stranded in the first place. Both
writes are cheap to undo: a comment can be edited or deleted, an issue can be closed.

**Q2. Does frazzledproductions.com list Koinori?**

- **(A, recommended, with a gate)** Yes: file the card issue now, blocked on `koinori-web#22`, badged
  "In development", and implement once the waitlist is confirmed to write.
- **(B)** No, not until Koinori is in beta or launched. Say so in the #9 comment, so the question is
  closed rather than left hanging again.

Trade-off: the site currently reads as a one-product studio to anyone doing diligence, and the About
copy at `app/page.tsx:49` already claims "more in the works", so a second card is consistent with
what the page says. Against that, a card with no ship date ages badly, and the pointed risk is new
since the old doc: with `koinori-web#22` open, a card would send real visitors, possibly a vendor, to
a form that may silently drop them. Gating on #22 keeps the upside and removes that risk. The old doc
recommended (A) outright; the plan in PR #10 recommended waiting. The gate is the honest middle, and
the badge wording carries most of the remaining risk ("In development" ages far better than a date).
