## MODIFIED Requirements

### Requirement: Shared styling and site-wide wrapper

All four pages SHALL render inside the root layout, in English, with an `article.rc-prose`. The `rc-prose` and `rc-nav-link` styles are shared by both apps and the root layout adds the cursor effect and, in production, the Cloudflare Web Analytics beacon to every page.

#### Scenario: Visiting a legal page

- **WHEN** a visitor opens any of the four pages in production
- **THEN** the page is counted by Cloudflare Web Analytics like any other page on the site, which each policy discloses in its "This website" section

### Requirement: Children and the website

Each policy SHALL call the app a general cooking or crafting app that does not knowingly collect personal data from anyone, including children, and SHALL state that the policy covers the app while the website counts visits with Cloudflare Web Analytics, which does not collect personal data. Its effective date does not change for this sentence.

#### Scenario: Website data

- **WHEN** a reader reads "This website"
- **THEN** it names Cloudflare Web Analytics and page counts, no longer names Vercel, and does not link the website's `/privacy` notice (open issue #66)
