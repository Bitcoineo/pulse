# Pulse - Analytics Dashboard

A web analytics dashboard for tracking website metrics. Import data via CSV or API, visualize with interactive charts, filter by date ranges, and export reports.

## Tech Stack

- **Framework**: Next.js 14 (App Router), TypeScript
- **Database**: Drizzle ORM + Turso (libSQL)
- **Auth**: Auth.js v5 (Google OAuth + email/password)
- **Charts**: Recharts
- **CSV**: Papaparse (import/export)
- **Styling**: Tailwind CSS, Plus Jakarta Sans
- **Data fetching**: SWR with auto-refresh

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Turso URL, auth secret, Google OAuth credentials

# Run migrations
pnpm db:migrate

# Seed demo data (12,000+ events)
pnpm db:seed

# Start dev server
pnpm dev
```

Demo credentials: `demo@example.com` / `password123`

## Features

### Dashboard
- Metric cards: pageviews, visitors, avg duration, bounce rate
- Pageviews over time (area chart)
- Top pages and referrers (ranking tables with proportional bars)
- Browser, device, and country breakdowns (donut charts + tables)
- Revenue tracking (bar chart, conditional on purchase events)
- Date range picker with presets (today, 7d, 30d, 90d, month, year)
- Auto-refresh every 60 seconds

### Events Log
- Paginated table with all raw events (50 per page)
- Server-side sorting (click column headers)
- Filter by event type (pageview, click, signup, purchase)
- Search across paths and referrers
- Date range filtering
- Export filtered results as CSV

### CSV Import
- Drag-and-drop file upload
- Auto-detect column mapping from headers
- Preview first 10 rows before importing
- Validation with per-row error reporting
- Batch import with progress indicator

### CSV Export
- Export all events matching current filters
- Downloads as CSV with all event fields

### Site Management
- Create multiple sites
- Edit site name and domain
- Delete site with name confirmation

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:seed` | Seed demo data |
| `pnpm db:studio` | Open Drizzle Studio |

## Database Schema

- **user** - Auth users with optional password
- **account** - OAuth accounts (Google)
- **session** / **verificationToken** - Auth.js internals
- **site** - User's tracked websites
- **event** - Core data: pageviews, clicks, signups, purchases with properties
- **dashboard** - Named dashboard layouts
- **widget** - Chart/metric configurations

Events are indexed on `(siteId, timestamp)`, `(siteId, name)`, and `(siteId, path)` for fast aggregation queries.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/signup` | POST | Create account |
| `/api/sites` | GET, POST | List/create sites |
| `/api/sites/[id]` | GET, PATCH, DELETE | Site CRUD |
| `/api/sites/[id]/events` | GET | Paginated event list |
| `/api/sites/[id]/events/import` | POST | Batch import events |
| `/api/sites/[id]/events/export` | GET | Export filtered CSV |
| `/api/sites/[id]/analytics/overview` | GET | Metric totals + changes |
| `/api/sites/[id]/analytics/pageviews` | GET | Pageviews over time |
| `/api/sites/[id]/analytics/pages` | GET | Top pages |
| `/api/sites/[id]/analytics/referrers` | GET | Top referrers |
| `/api/sites/[id]/analytics/browsers` | GET | Browser breakdown |
| `/api/sites/[id]/analytics/devices` | GET | Device breakdown |
| `/api/sites/[id]/analytics/countries` | GET | Country breakdown |
| `/api/sites/[id]/analytics/revenue` | GET | Revenue over time |

All site routes verify ownership. Analytics routes accept `start` and `end` date params.

## Project Structure

```
src/
  app/
    page.tsx                    Landing page
    auth/signin, signup/        Auth pages
    sites/page.tsx              Sites list
    sites/[siteId]/
      page.tsx                  Dashboard
      events/page.tsx           Events log
      import/page.tsx           CSV import
      settings/page.tsx         Site settings
      layout.tsx                Site navigation
    api/
      auth/signup/              Registration
      sites/                    Sites CRUD
      sites/[siteId]/           Site CRUD
      sites/[siteId]/events/    Events list + import + export
      sites/[siteId]/analytics/ 8 analytics endpoints
  components/
    DateRangePicker.tsx         Date range selector
    MetricCard.tsx              Metric display card
    Navbar.tsx                  Top navigation
    SiteNav.tsx                 Site tab navigation
    RankingTable.tsx            Ranked list with bars
    CountryTable.tsx            Country breakdown table
    Skeleton.tsx                Loading skeletons
    charts/
      AreaChartCard.tsx         Time series area chart
      BarChartCard.tsx          Revenue bar chart
      DonutChartCard.tsx        Pie/donut breakdown
  db/
    schema.ts                   Drizzle schema (8 tables)
    index.ts                    Database client
    migrate.ts                  Migration runner
    seed.ts                     Demo data seeder
  lib/
    analytics.ts                Analytics query functions
    events.ts                   Event list/import/export queries
    hooks.ts                    SWR hooks
    api-utils.ts                API auth helpers
    permissions.ts              Site ownership checks
  auth.ts                       Auth.js configuration
  auth.config.ts                Edge-compatible auth config
  middleware.ts                 Route protection
```

Built by Bitcoineo.
