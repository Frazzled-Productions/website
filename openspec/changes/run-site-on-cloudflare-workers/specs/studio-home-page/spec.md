## MODIFIED Requirements

### Requirement: Optional Support section

The Support section SHALL render only when the `KOFI_URL` environment variable is non-empty at build, showing the "Support" heading, the self-funded explanation and a `SupportButton` given that URL. The home page is prerendered, so in production the value is the repository variable read by `deploy.yml`.

#### Scenario: Blank value

- **WHEN** `KOFI_URL` is unset or empty
- **THEN** no Support heading, text, button or divider renders

#### Scenario: Value set

- **WHEN** `KOFI_URL` holds a URL
- **THEN** the section renders and the URL is passed to the button

#### Scenario: Value changed after a build

- **WHEN** the repository variable `KOFI_URL` changes with no new deploy from `main`
- **THEN** the live page keeps the value from its last build, because it is served prerendered
