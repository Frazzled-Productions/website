# Open questions for Fraser: issue #15 (Koinori and the #9 record)

**Status: written 2026-09-13 by the implementer lane for issue #15, which is open. Two questions
below, both awaiting your answer. Delete this file once they are answered.**

Issue #15 is that `docs/plans/9-question.md` read as a live decision while #9 had been closed as
completed since one second after that file landed. The repository half of that is fixed in this
change: `docs/plans/9-question.md` is now a short dated record that points at commit `68ffffc` for
the analysis and says plainly that #9 is closed.

What is left needs you, and is deliberately not guessed here.

## What was verified today, not taken on trust

| Check | Result |
| --- | --- |
| `gh issue view 9` | `CLOSED`, `COMPLETED`, `closedAt 2026-08-19T00:07:50Z`, `comments: []` |
| `git log -1 68ffffc` | authored 2026-08-19 01:07:49 +0100, i.e. 00:07:49Z, one second before the close |
| `app/page.tsx:63-90` | still only the Poké Memory card, so the card question was neither taken nor declined |
| open `website` issues | #12, #13, #14, #15, #16; none tracks a Koinori card |
| `git grep -n "docs/plans"` | no hit, so nothing in the repository links to these files |
| `koinori-web#22` | OPEN: "Verify the waitlist actually writes: zero rows and a broken form are currently indistinguishable" |
| `koinori-web#11` | now CLOSED/COMPLETED, so the unsubscribe caveat in the old doc is spent |

The plan in PR #20 assumed `koinori-web#11` was still live and asked for it to be named in the #9
comment. It is closed, so the draft below names `koinori-web#22` instead.

## Q1. May a lane write to GitHub to finish this, using the drafts below?

- **(A, recommended)** Yes: post the closing note on #9, and open the Koinori card issue if Q2 is
  answered "yes".
- **(B)** Repository change only; you post the comment yourself when you get to it.

**Trade-off.** The defect in #15 is that the repository and the tracker disagree. This change stops
the repository lying, but only a tracker write makes them agree: #9 still carries no comment at all,
so the reasoning is reachable only by knowing that commit `68ffffc` exists. (A) actually closes #15.
Against it, closing notes and new issues are mutations of shared GitHub state, which your standing
rule says to ask about first, which is exactly why nothing was posted unattended. Both writes are
cheap to undo: a comment can be edited or deleted, an issue closed.

**Draft comment for #9**, to approve or edit:

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

The old doc cited `koinori-web` commit `b25da02`. That could not be re-verified from this working
copy, so the draft names the files instead; those paths were verified when the original doc was
written.

## Q2. Does frazzledproductions.com list Koinori?

- **(A, recommended)** Yes, gated: file an issue for the card now, blocked on `koinori-web#22`,
  badged "In development", and build it once the waitlist is confirmed to write.
- **(B)** No, not until Koinori is in beta or launched. Say so in the #9 comment, so the question is
  closed rather than left hanging a second time.

**Trade-off.** The site currently reads as a one-product studio to anyone doing diligence, and the
About copy at `app/page.tsx:49` already claims "more in the works", so a second card is consistent
with what the page says. Against that, a card with no ship date ages badly, and there is a sharper
risk than when the old doc recommended adding one outright: with `koinori-web#22` open, a card would
send real visitors, possibly a vendor, to a form that may silently drop them. Gating on #22 keeps the
upside and removes that risk, and "In development" ages far better than a date.

**Draft issue, only if Q2 is "yes":**

- Title: `Add a Koinori project card to the home page`
- Body: cites this file and Question 2 of `docs/plans/9-question.md` at commit `68ffffc`; the card
  slots beside the Poké Memory card at `app/page.tsx:63-90` and uses the existing `TrackedLink`
  (`app/components/TrackedLink.tsx`) with a distinct event name alongside `pokememory_click`; badged
  "In development" rather than a date; blocked on `koinori-web#22`, and koinori.com should be
  confirmed to be serving before the link goes live.

## Housekeeping that outlives this file

PR #20 is open and adds `docs/plans/15-plan.md`. That file is not on this branch, so this change
cannot remove it. If #20 is merged, delete `docs/plans/15-plan.md` at the same time, or #15 recurs
with a different filename: a plan doc for a closed issue is the same defect as a question doc for a
closed issue.
