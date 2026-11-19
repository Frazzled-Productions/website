## RENAMED Requirements

- FROM: `### Requirement: Baseline - a click records support_click and opens the modal`
- TO: `### Requirement: A click records support_click and opens the modal`
- FROM: `### Requirement: Baseline - KOFI_URL takes effect when the home page is rendered at build`
- TO: `### Requirement: KOFI_URL takes effect when the home page is rendered at build`

## MODIFIED Requirements

### Requirement: A click records support_click and opens the modal
`SupportButton` SHALL render a button labelled "Support the studio". Clicking it SHALL call
`sendEvent('support_click')`, which posts the name to the site's own `/api/event`, and SHALL then open
the modal. Closing the modal and clicking the fallback link record nothing.

#### Scenario: Visitor clicks the pill (baseline)
- **WHEN** a visitor clicks "Support the studio"
- **THEN** one `support_click` beacon goes to `/api/event` and the modal opens

#### Scenario: Visitor uses the fallback link (baseline)
- **WHEN** a visitor clicks the fallback link in the open modal
- **THEN** no further event is sent

#### Scenario: The event endpoint fails
- **WHEN** `/api/event` answers 429 or 503
- **THEN** the modal still opens, because `sendEvent` ignores the response

### Requirement: KOFI_URL takes effect when the home page is rendered at build
The home page SHALL NOT use any dynamic rendering API or dynamic route setting, so it is statically
rendered and SHALL take the `KOFI_URL` value present at build, which in production is the repository
variable read by `deploy.yml`. Changing it needs a new deploy.

#### Scenario: KOFI_URL changes on a deployed site (baseline)
- **WHEN** the repository variable `KOFI_URL` changes and nothing is deployed from `main`
- **THEN** the live home page keeps showing or hiding the Support section as it did when last built
