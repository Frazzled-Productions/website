## RENAMED Requirements

- FROM: `### Requirement: Site-wide additions from the root layout (baseline, current behaviour)`
- TO: `### Requirement: Site-wide additions from the root layout`
- FROM: `### Requirement: Static pages (baseline, current behaviour)`
- TO: `### Requirement: Static pages`

## MODIFIED Requirements

### Requirement: Site-wide additions from the root layout
These pages SHALL inherit the root layout: `lang="en"`, the cursor glow and, in production, the
Cloudflare Web Analytics beacon, plus the grid background and CRT scanlines from the site stylesheet.
The frame SHALL set Inter as the base font (`app/roast-conductor/layout.tsx:12`).

#### Scenario: Visit counted
- **WHEN** a visitor loads the product page in production
- **THEN** the root layout's beacon script is on the page

### Requirement: Static pages
The three page and layout files SHALL fetch no data, take no input and contain no client component of
their own (`app/roast-conductor/layout.tsx:1`, `app/roast-conductor/page.tsx:1-2`,
`app/roast-conductor/sample-recipe/page.tsx:1-2`), so the pages SHALL be prerendered at build.

#### Scenario: Same page for everyone
- **WHEN** a visitor requests `/roast-conductor/sample-recipe`
- **THEN** the response is the page prerendered at build, listed as static (`○`) in the build's route
  table
