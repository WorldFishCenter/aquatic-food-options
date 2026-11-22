# Aquatic food adaptation options

This is a Next.js website that presents adaptation options for fish farmers,
fishers, and coastal communities. The catalogue data is read from Airtable on
the server and displayed as searchable, filterable cards.

The public interface includes:

- A WorldFish photo banner.
- Five sector metric cards:
  - All options
  - Aquaculture
  - Mariculture
  - Fisheries
  - Across all sectors
- Search across option titles, descriptions, sub-categories, hazards, and
  value-chain stages.
- Tick-box filters for climate hazard, sub-category, value-chain stage, and
  ecosystem type.
- Removable active-filter chips.
- Inline card expansion. Multiple cards can stay open at the same time for
  comparison.
- Local photos stored in `public/photos`.

The current Airtable table contains approximately 47 records. The code fetches
all records, including records beyond the first Airtable page.

## Important security information

The Airtable token is a server-side secret.

- Never put `AIRTABLE_TOKEN` in a component, browser-side environment variable,
  URL, commit, issue, pull request, screenshot, or README.
- Never add `.env.local` to version control.
- The repository ignores `.env*` files through `.gitignore`.
- The Airtable token should have only the `data.records:read` permission and
  should be limited to the required base.
- If the token is exposed, revoke it in Airtable immediately and create a
  replacement.

`src/lib/options.ts` runs as part of the server-side page request. Only the
cleaned option data is passed to the browser; the Airtable token is not.

## Technology

- [Next.js](https://nextjs.org/) 16 with the App Router
- React 19
- TypeScript
- Plain CSS
- Airtable REST API
- `next/image` for local image rendering
- ESLint for linting

The project intentionally does not use a database, UI component library, CSS
framework, or client-side Airtable SDK.

## Requirements

Install the following before working on the project:

- Node.js 20.6 or newer
- npm
- Git
- Access to the Airtable base and table

Check the installed versions:

```bash
node --version
npm --version
git --version
```

## Initial setup

### 1. Get the project

Clone the repository and enter its folder:

```bash
git clone <repository-url>
cd aquatic-food-options
```

If the repository was provided as a folder rather than cloned, open a terminal
in the project root. The project root is the folder containing `package.json`.

### 2. Install dependencies

Run:

```bash
npm install
```

This installs the exact versions recorded in `package-lock.json`.

### 3. Create `.env.local`

Create a file named `.env.local` in the project root. Do not commit this file.

Add these three variables:

```text
AIRTABLE_TOKEN=your_airtable_personal_access_token
AIRTABLE_BASE_ID=appxxxxxxxxxxxxxx
AIRTABLE_TABLE=tblxxxxxxxxxxxxxx
```

The value of `AIRTABLE_TABLE` can also be the exact table name, but using the
table ID is less fragile if the table is renamed.

The three variables mean:

| Variable | Meaning |
|---|---|
| `AIRTABLE_TOKEN` | Airtable Personal Access Token with read-only record access |
| `AIRTABLE_BASE_ID` | ID of the Airtable base, normally beginning with `app` |
| `AIRTABLE_TABLE` | Airtable table ID, normally beginning with `tbl`, or exact table name |

Do not add quotes unless the value itself requires them. Do not add spaces
around the equals sign.

### 4. Check the Airtable connection

Run this from the project root:

```bash
node --env-file=.env.local scripts/test-airtable.mjs
```

The script prints:

- The base ID.
- The table name.
- The token length, not the token.
- The number of records found.
- The Airtable field names that contain data.

It does not print the token. The expected current result is approximately 47
records and fields similar to the ones listed in the Airtable section below.

### 5. Start the development server

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The page updates automatically when source files change. Stop the server with
`Ctrl+C`.

## Available npm commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Run the TypeScript type check without emitting files |
| `npm run build` | Create a production build and validate the application |
| `npm run start` | Serve the previously built production application |
| `node --env-file=.env.local scripts/test-airtable.mjs` | Test Airtable access and list populated field names |

Before deploying, run at least:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Airtable schema

The mapper is designed for the current table. These are the current field names
and how the website uses them.

### Main fields

| Airtable field | Website use |
|---|---|
| `Adaptation Option` | Card and page title |
| `Short Description (draft)` | Short card summary; this is still marked draft |
| `Long Description` | Expanded card description, when populated |
| `Adaptation Sub-category` | Card label, filter, and photo fallback |
| `Climate Hazard` | Hazard tags and filter |
| `Sector [add]` | Sector metric cards, sector matching, and card label |
| `Value Chain Stage [add]` | Card footer and filter |
| `Ecosystem Type` | Filter |

### Optional expanded-card fields

These are displayed only when they contain text:

- `Examples & Tools (from current list)`
- `Gender & Social Inclusion Considerations`
- `Maladaptation Risks & Trade-offs`
- `Key Sources`
- `Tools & guides for implementation`
- `Synergies`
- `Trade-offs & risks`
- `Intervention in practice`
- `References`

The current inline card design specifically displays the long description and
the first three optional sections during expansion. The mapper also preserves
the other optional fields so the display can be extended later without
changing the Airtable fetch.

### Fields intentionally not displayed

The site does not display:

- `Option Type`
- `Scale`
- `Beneficiary`
- `Region`
- `Change vs Current List`
- `Evidence of Adaptation Effect (draft - verify)`

If these fields are present in Airtable, they are ignored.

## Airtable data rules

The mapper in `src/lib/options.ts` is deliberately defensive:

- Missing fields become empty strings or empty lists.
- A multi-select can be an Airtable array.
- A multi-select can also be a semicolon-separated string.
- Individual values are trimmed.
- Blank values are removed.
- Airtable pagination is followed until there is no `offset`.
- Airtable HTTP errors stop the request with an explicit error.

### Sector normalization

Airtable sector values can include detail after a colon, for example:

```text
Aquaculture: Pond/Freshwater culture
```

The site reduces these to:

- `Aquaculture`
- `Mariculture`
- `Fisheries`

Marine fisheries are treated as `Fisheries`. If an option covers all three main
sectors, it is shown as `All sectors`. An explicit Airtable value of `All
sectors` is also preserved.

The metric-card counts are calculated from the complete Airtable dataset, not
from the current search or sidebar filter state.

## How filtering works

### Sector cards

The five cards below the hero banner are the only sector switcher:

- `All options` shows every record.
- `Aquaculture` includes Aquaculture and All sectors records.
- `Mariculture` includes Mariculture and All sectors records.
- `Fisheries` includes Fisheries and All sectors records.
- `Across all sectors` includes only records normalized to All sectors.

Clicking the currently active non-default sector card turns the sector filter
off and returns to All options.

### Sidebar filters

The sidebar is generated from the current data. It contains:

- Climate hazard
- Sub-category
- Value Chain Stage
- Ecosystem Type

There is intentionally no Sector group in the sidebar because the metric cards
are the primary sector filter.

Within one filter group, selecting multiple values uses OR logic. Across
different filter groups, the selected groups use AND logic.

For example:

- Hazard `Flood` or `Storm` means either hazard can match.
- Hazard `Flood` plus Ecosystem `Wetlands` requires both conditions.

### Search

Search is case-insensitive and checks:

- Adaptation Option
- Short Description
- Long Description
- Adaptation Sub-category
- Climate Hazard
- Value Chain Stage

## Photos

Photos are local files in `public/photos`. This avoids depending on expiring
Airtable attachment URLs or requiring Flickr to be available when visitors
load the website.

### Photo selection order

For each option, the code tries:

1. A title-specific photo in `src/lib/photo-map.ts`.
2. A default photo for the option's sub-category.
3. A neutral empty photo block if neither exists.

Current options use title-specific mappings chosen for subject relevance.
Some photos are intentionally reused when the same image is the strongest
available representation of related infrastructure, management, finance, or
food-system work. This is preferable to showing a unique but unrelated image.
The sub-category defaults are kept for future Airtable records or records
whose titles have not yet been assigned an individual photo.

Sub-category matching is loose: it lowercases the value and removes
punctuation, so small differences in spelling and punctuation do not break a
fallback match.

The fallback images selected from the WorldFish Flickr collection are:

| Sub-category | Local file |
|---|---|
| Genetic & Species Resources | `flickr-genetic-species-resources.jpg` |
| On-farm Management | `flickr-on-farm-management.jpg` |
| Production Systems | `flickr-production-systems.jpg` |
| Infrastructure & Energy | `flickr-infrastructure-energy.jpg` |
| Value Chain & Markets | `flickr-value-chain-markets.jpg` |
| Ecosystem-based Adaptation | `flickr-ecosystem-based-adaptation.jpg` |
| Fisheries Management | `flickr-fisheries-management.jpg` |
| Information, Monitoring & Decision Support | `flickr-information-monitoring-decision-support.jpg` |
| Planning, Governance & Policy | `flickr-planning-governance-policy.jpg` |
| Social & Financial Resilience | `flickr-social-financial-resilience.jpg` |

Current option-specific assignments are kept in
`src/lib/photo-map.ts`. The map is keyed by a normalized option title, so it
remains stable if Airtable records are reordered. When choosing a new image,
prefer a genuine subject match over uniqueness; reuse a suitable image or use
the neutral block rather than misleading visitors.

The source collection is:

<https://www.flickr.com/photos/theworldfishcenter/with/55592775474>

The site currently displays `Photo: WorldFish`. Confirm that this attribution
and the intended use of the images remain acceptable before making a public
deployment.

### Adding a title-specific photo

1. Add the image file to `public/photos`.
2. Convert the option title to lowercase.
3. Remove punctuation and spaces.
4. Keep the first 22 letters.
5. Add the resulting key and filename to `PHOTOS` in
   `src/lib/photo-map.ts`.
6. Pass the option title to `photoFor` as usual; the existing card code already
   does this.

Use a wide image where possible. The cards use a roughly 2:1 crop, so very
vertical images may lose important content.

### Checking for missing photos

When the page is built or run in development, `src/app/page.tsx` logs any
option that has no resolved photo. A correctly configured current dataset
should not produce missing-photo warnings because every current sub-category
has a fallback.

## Project structure

The project uses a `src` directory.

| Path | Responsibility |
|---|---|
| `src/app/page.tsx` | Server page; loads Airtable data and renders the catalogue |
| `src/app/layout.tsx` | Global page shell and font setup |
| `src/app/globals.css` | Colours, layout, cards, filters, chips, and responsive styles |
| `src/lib/options.ts` | Airtable request, pagination, field normalization, and sector mapping |
| `src/lib/filters.ts` | Sector matching, sidebar groups, filter matching, and search matching |
| `src/lib/display.ts` | Sector colours and hazard tag classes |
| `src/lib/photo-map.ts` | Title-specific and sub-category photo resolution |
| `src/components/Catalog.tsx` | Client-side search, filters, metric cards, chips, and expansion state |
| `src/components/OptionCard.tsx` | Individual card and inline expanded content |
| `public/photos/` | Local banner and option images |
| `scripts/test-airtable.mjs` | Airtable connection and field inventory check |
| `.env.local` | Local secrets; never commit this file |

## Data flow

1. A visitor requests the home page.
2. `src/app/page.tsx` calls `getOptions()`.
3. `src/lib/options.ts` reads `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, and
   `AIRTABLE_TABLE` from the server environment.
4. Airtable records are fetched page by page.
5. The mapper converts the raw records to the `AdaptationOption` type.
6. The cleaned options are passed to the client-side `Catalog` component.
7. `Catalog` calculates visible records from the sector, search, and sidebar
   state.
8. `OptionCard` renders each visible record and manages its expanded display
   through state held by `Catalog`.
9. `photoFor` resolves a local image for each card.

## Troubleshooting

### `Missing Airtable settings in .env.local`

Check that `.env.local` exists in the project root and contains all three
variables. Restart `npm run dev` after changing environment variables.

### Airtable returns 401

The token is invalid or expired. Create a new Airtable Personal Access Token
with `data.records:read` access and update the local or Vercel environment
variable.

### Airtable returns 403

The token does not have permission to read the base, or the token's access is
restricted to a different base.

### Airtable returns 404

Check `AIRTABLE_BASE_ID` and `AIRTABLE_TABLE`. If the table name contains
spaces or punctuation, use the table ID instead.

### The page shows no options

Run:

```bash
node --env-file=.env.local scripts/test-airtable.mjs
```

Confirm that records are returned and that the Airtable token can read the
configured table.

### A field is empty on the site

Check all of the following:

- The Airtable field name matches the exact name documented above.
- The field has data in the affected record.
- A multi-select is either an Airtable array or a semicolon-separated string.
- The field is one of the fields intentionally displayed by the site.

The mapper intentionally ignores Region, Beneficiary, Evidence of Adaptation
Effect, and other fields not listed as active website fields.

### A photo does not appear

Check:

1. The file is inside `public/photos`.
2. The filename matches the value in `src/lib/photo-map.ts`.
3. The file extension and capitalization match.
4. The option sub-category matches one of the fallback keys after punctuation
   is removed.
5. The browser has been refreshed after adding the file.

### The build fails after changing Airtable data

Run the checks separately:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Read the first error rather than only the final summary. Airtable data
problems normally appear during page-data collection, while TypeScript and CSS
problems usually appear earlier.

## Making future changes

### Changing displayed Airtable fields

1. Add or update the property in the `AdaptationOption` type in
   `src/lib/options.ts`.
2. Map the Airtable field in the returned object.
3. Render it in `OptionCard.tsx` or update the filtering logic in
   `src/lib/filters.ts`.
4. Update the Airtable schema section in this README.
5. Run lint, type-check, and build.

### Changing filter groups

Filter groups are defined in `GROUPS` in `src/lib/filters.ts`. The group key
must also exist on `AdaptationOption` and be initialized by `emptySelected()`.
Do not add Sector back to this list unless the metric-card design is changed;
the metric cards are intentionally the single sector filter.

### Changing card expansion content

The expanded content is rendered in `src/components/OptionCard.tsx`. Keep
optional sections conditional so missing Airtable text does not produce empty
headings or blank separators.

### Changing the visual design

Most visual changes belong in `src/app/globals.css`. Keep the existing class
names where possible because the card, filter, and responsive layouts share
them.

### Changing the Airtable table

If the site is moved to another base or table:

1. Update only the environment variables.
2. Do not change the token in source code.
3. Run the Airtable test script.
4. Confirm the exact field names.
5. Check the page and filters locally.

## Recommended handoff checklist

Before handing this project to another developer or deployer:

- [ ] They have access to the repository.
- [ ] They have access to the correct Airtable base and table.
- [ ] They have a read-only Airtable token.
- [ ] `.env.local` exists locally but is not committed.
- [ ] `node --env-file=.env.local scripts/test-airtable.mjs` succeeds.
- [ ] `npm run lint` succeeds.
- [ ] `npx tsc --noEmit` succeeds.
- [ ] `npm run build` succeeds.
- [ ] All ten local Flickr-derived fallback images are present.
- [ ] WorldFish image attribution has been confirmed.
- [ ] Vercel environment variables are configured.
- [ ] The deployed page has been tested with the checklist above.

## Current known limitations

- The Short Description field is still marked draft in Airtable.
- The site uses generic photo alt text (`alt=""`) because the Airtable data does
  not currently provide approved image descriptions.
- Several options share a sub-category fallback photo by design.
- The app currently reports Airtable fetch failures as page errors rather than
  showing a custom visitor-facing error page.
- There is no automated unit-test runner configured. The current validation is
  linting, TypeScript checking, production building, and manual Airtable/UI
  verification.

## Working conventions

Use a feature branch for changes:

```bash
git checkout -b feature/describe-your-change
```

After making changes:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Review the changed files, confirm that no secrets are included, and open a
pull request for review.
