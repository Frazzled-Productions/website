# AGENTS.md - website (frazzledproductions.com)

Layer 2 product repo: the public company website, a Next.js app deployed on Vercel. Public-facing
copy: everything shipped here is read by outsiders (and by Apple/vendors verifying the company),
so check copy reads correctly to someone who has never heard of us.

## Where to store information
Defaults per `ops/standards/where-things-live.md` and `ops/KNOWLEDGE.md`. Site copy and assets live
here; company facts it displays (addresses, product descriptions) have their home of record in
`ops` or Drive - reference, never fork.

## Conventions
Company standards: `ops/standards/` (British English in copy, no em dashes, commits in the maker's
name, issue-first process). Repo-local: `npm run dev` to run, `npm run lint` before committing;
auto-push every commit on this repo (no need to ask). External API identifiers (CSS `color` etc.)
stay American per the standard.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
