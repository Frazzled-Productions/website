# app-legal-and-support-pages Specification

## Purpose

Baseline of the privacy and support pages for Roast Conductor and Loop Year on the company website, which App Store Connect and the apps link to directly. It describes what the code does today (`origin/main` at `3c6ba06`, 2 November 2026; rechecked at `b063fed` on 3 November 2026, where main had changed only dependency versions and the CI action versions, and every cited line still matched), not what it should do. Production ran `3c6ba06` (deployed 28 October 2026) on 2 November and `b063fed` (deployed 2 November 2026) on 3 November, and the live site was spot-checked on both dates: the four URLs returned 200 with no redirect and `/loop-year` returned 404. The text of each page was not compared in full. The repo has no tests, so no scenario here is covered by a test. Behaviour that looks like a bug is stated as it is, with its issue number. The website's own notice at `/privacy`, the Roast Conductor product page and the sample recipe page are not part of this capability.

## Requirements

### Requirement: Four fixed public URLs

The site SHALL serve the four pages at `/roast-conductor/privacy`, `/roast-conductor/support`, `/loop-year/privacy` and `/loop-year/support`, each from a file route, with no redirects, rewrites or aliases configured.

Source: `app/roast-conductor/privacy/page.tsx:12`, `app/roast-conductor/support/page.tsx:12`, `app/loop-year/privacy/page.tsx:12`, `app/loop-year/support/page.tsx:12`, `next.config.ts:3-5`.

#### Scenario: Requesting a page

- **WHEN** a visitor opens any of the four URLs
- **THEN** that page's route renders it inside its app's layout

#### Scenario: The Loop Year parent path

- **WHEN** a visitor opens `/loop-year`
- **THEN** no route exists for it, because `app/loop-year/` has a layout but no `page.tsx`, so the site returns 404

#### Scenario: The home page does not link Loop Year

- **WHEN** a visitor looks for Loop Year from the home page
- **THEN** `app/page.tsx` has no link to it, so its pages are reached only by direct link (open issue #31)

### Requirement: What guards the URLs

The only automated guards on these URLs SHALL be the CI steps lint (which runs `check:structure`, comparing the README's structure block with `app/`), typecheck and build. No test requests the four URLs, and no route list or uptime monitor exists for them.

Source: `.github/workflows/ci.yml:24-26`, `package.json:12-15`, `scripts/check-readme-structure.mjs:7-10`, `README.md:66-71`, `README.md:77-82`.

#### Scenario: A page file is deleted or moved

- **WHEN** a change removes one of the page files and leaves the README as it is
- **THEN** `npm run lint` fails, because the README names a path that no longer exists

#### Scenario: The URL strings in the apps

- **WHEN** a Loop Year URL string changes in the app
- **THEN** a Loop Year test fails (loop-year `LoopYearTests/BlanketsAndSettingsTests.swift:141-142`), but that test does not request the page, and Roast Conductor's strings (`RoastConductor/Model/AppLinks.swift`) have no such test

#### Scenario: A page and its README line change together

- **WHEN** a change renames or removes a route and updates the README in the same PR
- **THEN** nothing fails, although App Store Connect and the apps still point at the old URL, and an in-site link to the old path is not caught either (open issue #30)

### Requirement: Page titles and descriptions

Each page SHALL export its own metadata, with a title ending "| Frazzled Productions" and a description of what the page covers. No page sets a canonical URL, Open Graph data or robots rules.

Source: `app/roast-conductor/privacy/page.tsx:3-7`, `app/roast-conductor/support/page.tsx:4-8`, `app/loop-year/privacy/page.tsx:3-7`, `app/loop-year/support/page.tsx:4-8`.

#### Scenario: Title of each page

- **WHEN** a page is rendered
- **THEN** the title is "Roast Conductor privacy policy", "Roast Conductor support", "Loop Year privacy policy" or "Loop Year support", followed by " | Frazzled Productions"

### Requirement: Roast Conductor frame

Every page under `/roast-conductor` SHALL share a layout with a "Frazzled Productions" link to `/`, a navigation labelled "Roast Conductor" with three links (Roast Conductor, Support, Privacy policy), a main column and a company footer.

Source: `app/roast-conductor/layout.tsx:3-5`, `app/roast-conductor/layout.tsx:14-29`, `app/roast-conductor/layout.tsx:34`, `app/roast-conductor/layout.tsx:36-43`.

#### Scenario: Arriving directly from the App Store

- **WHEN** a visitor lands on the support or privacy page
- **THEN** the header offers links to the product page, support, privacy and the studio home page

#### Scenario: Footer

- **WHEN** any Roast Conductor page is rendered
- **THEN** the footer shows FRAZZLED PRODUCTIONS LTD, company number 17258540 and 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, as literal text in the layout, with no link to the website's `/privacy` notice (open issue #66)

### Requirement: Loop Year frame

Every page under `/loop-year` SHALL share a layout with a "Frazzled Productions" link to `/`, a navigation labelled "Loop Year" with two links ("Loop Year support", "Loop Year privacy policy"), a main column and the same company footer as Roast Conductor.

Source: `app/loop-year/layout.tsx:3-6`, `app/loop-year/layout.tsx:15-33`, `app/loop-year/layout.tsx:38`, `app/loop-year/layout.tsx:40-47`.

#### Scenario: Arriving directly from the App Store

- **WHEN** a visitor lands on either Loop Year page
- **THEN** the header offers links to both Loop Year pages and the studio home page, and there is no product page to link to

#### Scenario: Footer

- **WHEN** a Loop Year page is rendered
- **THEN** the footer repeats the same company details as literal text, in a separate file from the Roast Conductor footer, with no link to `/privacy` (open issue #66)

### Requirement: Shared styling and site-wide wrapper

All four pages SHALL render inside the root layout, in English, with an `article.rc-prose`. The `rc-prose` and `rc-nav-link` styles are shared by both apps and the root layout adds the cursor effect and Vercel Web Analytics to every page.

Source: `app/layout.tsx:34-42`, `app/globals.css:196-260`, `app/roast-conductor/privacy/page.tsx:14`, `app/roast-conductor/support/page.tsx:14`, `app/loop-year/privacy/page.tsx:14`, `app/loop-year/support/page.tsx:14`.

#### Scenario: Visiting a legal page

- **WHEN** a visitor opens any of the four pages
- **THEN** the page is counted by Vercel Web Analytics like any other page on the site, which each policy discloses in its "This website" section

### Requirement: Contact addresses

Each page SHALL define its contact address as a constant in the page file: `hello@frazzledproductions.com` for all four, and `privacy@frazzledproductions.com` as well on the two privacy policies, shown as `mailto:` links.

Source: `app/roast-conductor/privacy/page.tsx:9-10`, `app/roast-conductor/support/page.tsx:10`, `app/loop-year/privacy/page.tsx:9-10`, `app/loop-year/support/page.tsx:10`.

#### Scenario: General contact on a support page

- **WHEN** a reader cannot find an answer on a support page
- **THEN** the page offers the hello address near the top and again under "Contact", and asks for the device model and iOS version (`app/roast-conductor/support/page.tsx:27-31`, `app/roast-conductor/support/page.tsx:266-270`, `app/loop-year/support/page.tsx:26-30`, `app/loop-year/support/page.tsx:85-89`)

### Requirement: Who runs the app

Each privacy policy SHALL name Frazzled Productions Ltd as data controller, with its registration in England and Wales, company number, registered office and the hello address.

Source: `app/roast-conductor/privacy/page.tsx:47-54`, `app/loop-year/privacy/page.tsx:34-41`.

#### Scenario: Reading who we are

- **WHEN** a reader opens "Who we are" on either policy
- **THEN** it states company number 17258540 and the Shelton Street registered office

### Requirement: Effective dates and change notes

The Roast Conductor policy SHALL show "Effective 23 October 2026" and a "Changes" paragraph, and the Loop Year policy SHALL show "Effective 17 October 2026" with no change notes. Both promise to update the page and its effective date before a data change reaches the App Store.

Source: `app/roast-conductor/privacy/page.tsx:21-32`, `app/roast-conductor/privacy/page.tsx:244-248`, `app/loop-year/privacy/page.tsx:21`, `app/loop-year/privacy/page.tsx:225-229`.

#### Scenario: Reading Roast Conductor's history

- **WHEN** a reader reads the "Changes" paragraph
- **THEN** it lists changes on 11 October, 17 October (two) and 23 October 2026

#### Scenario: Changes the paragraph leaves out

- **WHEN** the file's history is compared with the paragraph
- **THEN** the 18 October 2026 edit to the "Your region" text (commit `04262f9`) is not listed

### Requirement: Roast Conductor data on the device

The Roast Conductor policy SHALL state that the app has no accounts, adverts, analytics tools, tracking or servers, that what the user makes stays on their devices apart from Cook together, and that nothing is sent to the company. It covers notifications, widgets, the Apple Watch link, the region setting, what survives deleting the app and backups.

Source: `app/roast-conductor/privacy/page.tsx:34-45`, `app/roast-conductor/privacy/page.tsx:56-100`.

#### Scenario: Deleting the app

- **WHEN** a reader reads what deleting the app does
- **THEN** the policy says app data goes, apart from a small keychain copy of the next dinner and any cook in progress, which iOS does not remove

#### Scenario: Apple Watch

- **WHEN** a reader uses the Apple Watch app
- **THEN** the policy says the iPhone sends the current cook and upcoming dinners to the paired watch, which keeps a copy, the watch sends back the steps marked done, and nothing is sent to the company

#### Scenario: Backups

- **WHEN** a reader reads about backups
- **THEN** the policy says iCloud or computer backups include app data under Apple's terms

#### Scenario: Region

- **WHEN** a reader reads "Your region"
- **THEN** the policy says the edition comes from the region setting, read on the device, that the US and Canada get the US edition, and that Canada follows Health Canada's guidance

### Requirement: Roast Conductor Cook together disclosure

The Roast Conductor policy SHALL describe Cook together: what is stored in the user's iCloud with CloudKit, who can read and change it, which fields are encrypted, and how sharing ends.

Source: `app/roast-conductor/privacy/page.tsx:102-130`.

#### Scenario: What invited people get

- **WHEN** a reader reads who can see a shared menu
- **THEN** the policy says anyone invited can read and change the plan, and can see the owner's name and contact as iCloud shows it on the invite

#### Scenario: What stays unencrypted

- **WHEN** a reader reads how a plan is stored
- **THEN** the policy says the plan is in encrypted fields, and that the menu's name and technical details such as record IDs and change times are held unencrypted

#### Scenario: Ending a share

- **WHEN** a reader reads how to remove a plan
- **THEN** the policy says stopping sharing or deleting the menu removes it for everyone, deleting the app does not, a copy someone saved stays with them, leaving removes only that person's access while their ticks stay in the owner's copy, and signing out of iCloud removes plans shared with that person from the device

### Requirement: Roast Conductor recipe import disclosure

The Roast Conductor policy SHALL state that importing a recipe, from a link or a pasted method, needs the unlock, that the device fetches a linked page directly, that the text is read on the device, using on-device Apple Intelligence where available, and that only the dish details and link are saved.

Source: `app/roast-conductor/privacy/page.tsx:181-201`.

#### Scenario: Pasting a link

- **WHEN** a reader reads what happens to a pasted link
- **THEN** the policy says the request names Roast Conductor as the app asking, and nothing about the page goes to the company or any AI service

### Requirement: RevenueCat purchase disclosure

Both policies SHALL state that Apple takes payment, that RevenueCat processes the anonymous app user ID, purchase history and technical details on the company's behalf, the purposes, the legal bases, the retention and that the data may be processed in the United States.

Source: `app/roast-conductor/privacy/page.tsx:132-179`, `app/loop-year/privacy/page.tsx:134-184`.

#### Scenario: Device identifier

- **WHEN** the two technical-details lists are compared
- **THEN** only Roast Conductor's lists the identifier iOS gives the app (`app/roast-conductor/privacy/page.tsx:152-154`, `app/loop-year/privacy/page.tsx:158-160`), and Loop Year's omission is open issue #77

#### Scenario: Reader who never buys

- **WHEN** a reader looks for what happens if they never buy
- **THEN** both policies describe RevenueCat only in terms of the purchase and give no legal basis or retention for non-buyers (open issue #54 for Roast Conductor, draft PR #55; loop-year #91 for Loop Year)

### Requirement: Loop Year data on the iPhone

The Loop Year policy SHALL state that the app has no accounts, adverts, analytics tools, tracking or servers, that blankets, planner measurements, settings and cached Meteostat records stay on the iPhone, and that deleting the app deletes them.

Source: `app/loop-year/privacy/page.tsx:23-32`, `app/loop-year/privacy/page.tsx:43-69`.

#### Scenario: Backups

- **WHEN** a reader reads about backups
- **THEN** the policy says iCloud or computer backups include app data under Apple's terms

### Requirement: Loop Year place search and weather disclosure

The Loop Year policy SHALL state that typed place names go to Apple Maps, that the chosen place's map position and dates go to Apple Weather for days from 1 August 2021, and that a station number and year go to data.meteostat.net for earlier days. It states that the app does not use the device's location.

Source: `app/loop-year/privacy/page.tsx:71-124`.

#### Scenario: A birth-year blanket

- **WHEN** a blanket has days before 1 August 2021
- **THEN** the policy says the app picks stations from a built-in list, and the request carries the station's number, the year and the device's IP address, which Meteostat logs in anonymised form (loop-year #92, website draft PR #56)

#### Scenario: What is kept from Apple Weather

- **WHEN** a reader reads what is stored for days from Apple Weather
- **THEN** the policy says the app keeps each day's colour, not the temperature

### Requirement: Loop Year reminder disclosure

The Loop Year policy SHALL state that the evening reminder is off until turned on, that permission is asked at that point and that iOS schedules it with no server.

Source: `app/loop-year/privacy/page.tsx:126-132`.

#### Scenario: Turning on the reminder

- **WHEN** a reader turns on the reminder
- **THEN** the policy says notification permission is asked only then and nothing is sent to the company

### Requirement: What the apps do not do

Each policy SHALL list what the app does not do and state that Apple may send anonymous crash and usage statistics if the user has chosen that in iOS Settings.

Source: `app/roast-conductor/privacy/page.tsx:203-219`, `app/loop-year/privacy/page.tsx:186-200`.

#### Scenario: Photos

- **WHEN** the two lists are compared
- **THEN** Roast Conductor says it only saves a plan picture to Photos on Save Image, and Loop Year says it has no access to photos

#### Scenario: Sharing

- **WHEN** the two lists are compared
- **THEN** Roast Conductor says data is shared only with the people the user chooses, and Loop Year says no selling or sharing

### Requirement: Rights and complaints

Each policy SHALL state the reader's rights, a response within one month through the hello address, complaints through the privacy address acknowledged within 30 days, and the UK Information Commissioner's Office as a further route.

Source: `app/roast-conductor/privacy/page.tsx:221-236`, `app/loop-year/privacy/page.tsx:202-217`.

#### Scenario: Making a complaint

- **WHEN** a reader is unhappy with how their data is used
- **THEN** the policy gives the privacy address first, then ico.org.uk

### Requirement: Children and the website

Each policy SHALL call the app a general cooking or crafting app that does not knowingly collect personal data from anyone, including children, and SHALL state that the policy covers the app while the website counts visits with Vercel Web Analytics without cookies.

Source: `app/roast-conductor/privacy/page.tsx:238-242`, `app/roast-conductor/privacy/page.tsx:250-254`, `app/loop-year/privacy/page.tsx:219-223`, `app/loop-year/privacy/page.tsx:231-236`.

#### Scenario: Website data

- **WHEN** a reader reads "This website"
- **THEN** it names page counts only and does not link the website's `/privacy` notice (open issue #66)

### Requirement: External links

Links from the policies to other sites SHALL open in a new tab with `rel="noopener noreferrer"`.

Source: `app/roast-conductor/privacy/page.tsx:139`, `app/roast-conductor/privacy/page.tsx:162-166`, `app/roast-conductor/privacy/page.tsx:232`, `app/loop-year/privacy/page.tsx:77-81`, `app/loop-year/privacy/page.tsx:111-115`, `app/loop-year/privacy/page.tsx:142`, `app/loop-year/privacy/page.tsx:167-171`, `app/loop-year/privacy/page.tsx:213`.

#### Scenario: Following a third-party policy

- **WHEN** a reader follows a link to RevenueCat, Apple, Meteostat or the ICO
- **THEN** the site stays open in the original tab

### Requirement: Support pages link their privacy policy

Each support page SHALL answer the account and data question and link its own app's privacy policy with an internal link.

Source: `app/roast-conductor/support/page.tsx:205-214`, `app/loop-year/support/page.tsx:75-80`.

#### Scenario: Asking where the data lives

- **WHEN** a reader opens the account question on either support page
- **THEN** it says no account is needed and links to that app's `/privacy` route

#### Scenario: What leaves the device

- **WHEN** a reader reads the data answer on the Roast Conductor page
- **THEN** it says that, apart from fetching a pasted recipe link and Cook together, the only data leaving the device is about the purchase

#### Scenario: Deleting Loop Year

- **WHEN** a reader reads the data answer on the Loop Year page
- **THEN** it says deleting the app deletes the blankets and does not mention backups (open issue #79)

### Requirement: Roast Conductor support answers

The Roast Conductor support page SHALL open with what the app does and answer questions on alarms, restoring purchases, cooking times, editing steps, oven offset, air fryers and microwaves, recipe links, running late, "Not done yet", make-ahead dishes, courses and helpers, reminders, data, devices, the Apple Watch, iPad, units and missing menus.

Source: `app/roast-conductor/support/page.tsx:21-26`, `app/roast-conductor/support/page.tsx:33-264`.

#### Scenario: Alarms on silent

- **WHEN** a reader asks if alarms ring on silent or in a Focus
- **THEN** the page says yes if alarms are allowed, and that without permission the app falls back to notifications that follow silent and Focus

#### Scenario: Restoring

- **WHEN** a reader asks how to restore on a new iPhone
- **THEN** the page says to tap More on the home screen, then Restore purchases, with the same Apple Account, and that Family Sharing is supported

#### Scenario: Stopping reminders

- **WHEN** a reader wants to stop reminders
- **THEN** the page says the Leftovers reminder turns off in Your kitchen, all of them turn off in the Settings app, and cook mode alarms are separate and keep working

#### Scenario: iPad

- **WHEN** a reader asks about iPad
- **THEN** the page says there are no Live Activities on iPad, the purchase works on both devices with the same Apple Account, and menus are not synced between devices

#### Scenario: Timing safety

- **WHEN** a reader reads where cooking times come from
- **THEN** the page says they come from UK guidance, or USDA for US turkey and ham, that they are a guide and not a promise, and that food must be checked before serving (`app/roast-conductor/support/page.tsx:92-106`)

#### Scenario: Trying recipe links

- **WHEN** a reader asks how to try recipe links
- **THEN** the page links to `/roast-conductor/sample-recipe`, tells them to choose "From a recipe link", though the app's button says "From a link" (`app/roast-conductor/support/page.tsx:138`, open issue #61), and says recipe links are part of the unlock

#### Scenario: Lost menus

- **WHEN** a reader's menus have gone
- **THEN** the page says menus live only on the device they were made on and reach a new device only through an iCloud or computer backup, and asks the reader to update the app and email before deleting it. It does not cover plans under "Shared with you" (open issue #79)

### Requirement: Roast Conductor free and unlock lists

The support page SHALL list what is free and what the one-time unlock adds, at £2.99 in the UK, and state that later paid features join the same unlock. Cook together is in neither list (open issue #59).

Source: `app/roast-conductor/support/page.tsx:56-90`.

#### Scenario: Free limit

- **WHEN** a reader reads the free list
- **THEN** it says unlimited saved menus, each with up to four dishes

#### Scenario: Looking up Cook together

- **WHEN** a reader looks in the lists for Cook together
- **THEN** neither list names it, and the page's only mention is in the data answer (`app/roast-conductor/support/page.tsx:207-212`)

### Requirement: Roast Conductor edition answer

The support page SHALL state that a device with its region set to the United States gets the US edition and that everywhere else gets the UK edition. This disagrees with the privacy policy, which puts Canada in the US edition (open issue #58).

Source: `app/roast-conductor/support/page.tsx:245-254`, `app/roast-conductor/privacy/page.tsx:86-90`.

#### Scenario: A reader in Canada

- **WHEN** a reader in Canada reads the support answer
- **THEN** it tells them they get °C and kilograms, while the privacy policy tells them they get the US edition

#### Scenario: Changing units

- **WHEN** a reader wants different units
- **THEN** the page says °C or °F and oven type change from the More button, and weights follow the region in the Settings app

#### Scenario: Oven types in the US edition

- **WHEN** a US edition reader reads "Can I change a time or temperature?"
- **THEN** the page offers fan, conventional or gas (`app/roast-conductor/support/page.tsx:111-113`), though the app's US edition offers no gas (roast-conductor `RoastEngine/Sources/RoastEngine/CookRegion.swift:30-35`, noted in open issue #79)

### Requirement: Stated device support

The support pages SHALL state iPhone and iPad with iOS or iPadOS 26.1 or later, plus watchOS 26 and a paired iPhone for the Apple Watch app, for Roast Conductor, and iPhone with iOS 26 or later for Loop Year.

Source: `app/roast-conductor/support/page.tsx:216-221`, `app/loop-year/support/page.tsx:82-83`.

#### Scenario: Checking compatibility

- **WHEN** a reader opens "Which devices does it work on?"
- **THEN** the page gives the versions above as literal text, not read from either app

### Requirement: Loop Year support answers

The Loop Year support page SHALL open with what the app does and answer where the weather comes from, why a day has no record, how to colour a row by hand, how to restore a purchase and how to set the reminder.

Source: `app/loop-year/support/page.tsx:21-25`, `app/loop-year/support/page.tsx:34-73`.

#### Scenario: A day with no record

- **WHEN** a reader asks why a day says "No record for this day"
- **THEN** the page says the records had nothing or could not be fetched yet, that the app never makes up a temperature and asks again each time it opens, and that the row can be coloured by hand

#### Scenario: Restoring

- **WHEN** a reader asks how to restore on a new iPhone
- **THEN** the page says to tap the gear on Tonight, then Restore purchases in Blanket settings, with the same Apple Account, and that the unlock is a single purchase

## Clarifications

- 2 November 2026: the repo has no tests. The scenarios come from reading the code. Recommendation: use the route check in #30 as the first automated guard.
- 2 November 2026: the Loop Year policy says "evening reminder" (`app/loop-year/privacy/page.tsx:126`) and its support page says "daily reminder" (`app/loop-year/support/page.tsx:69`). Loop Year's own label is "Daily reminder". Copy only, so no issue was filed. Recommendation: use "daily reminder" in the next change here.
- 2 November 2026: the policy text for the 18 October 2026 region edit is in the page but not in its "Changes" paragraph. It corrected how the region is read, so no issue was filed. Recommendation: decide whether "Changes" lists every edit or only material ones, and say so in the next policy change.
- 2 November 2026: both policies say "no analytics tools" while saying RevenueCat data is used to see how many unlocks are sold, "(analytics)" (`app/roast-conductor/privacy/page.tsx:35-36`, `app/roast-conductor/privacy/page.tsx:158-159`, `app/loop-year/privacy/page.tsx:24-25`, `app/loop-year/privacy/page.tsx:163-164`). The two sit awkwardly together, though neither is false: RevenueCat is a payment partner, not an analytics tool in the app. Wording only, so no issue was filed. Recommendation: reword the summaries in the next policy change.
- 2 November 2026: "This website" on both policies names page counts only, while the website's notice also covers link click counts and Ko-fi (`app/privacy/page.tsx:7`), and neither policy nor frame links it. Open issue #66 now covers the link. Recommendation: take this with #66, including the frames.
- 2 November 2026: the company details and footer are repeated in two layouts and two policies, though AGENTS.md says company facts are referenced from ops or Drive, not forked (`AGENTS.md:8-10`). Recommendation: leave as it is until a change touches the footer.
- 2 November 2026: `/loop-year` has no page. Recommendation: take this with #31, which asks whether Loop Year can be public yet.
- 2 November 2026: the repo has not adopted OpenSpec (#50), so this PR adds only this file, with no `config.yaml` or change folder. Ruled 2 November 2026 (Fraser): land it now on one review after a rebase, and #50 adopts it as it stands.
- 2 November 2026: the Roast Conductor support page says "Every built-in timing comes from published UK guidance", with USDA named only for US turkey and ham (`app/roast-conductor/support/page.tsx:94-97`), while the privacy policy says Canada follows Health Canada's guidance. #58 asks for line 96 to be checked. Recommendation: settle the sources sentence in the #58 change.
- 2 November 2026: #79 also lists "only data" and "anonymous" wording against a persistent ID (cited in that audit, not repeated here; see loop-year #91). Recommendation: decide the wording with #54 and loop-year #91, as these requirements quote the policies as they stand.
- 3 November 2026: draft PRs #55 (Roast Conductor policy and RevenueCat) and #56 (Loop Year policy, Meteostat and Cloudflare) change policy text quoted here, and neither has merged. Ruled 2 November 2026 (Fraser): this spec is reconciled with whichever of the two lands later, in that PR.
