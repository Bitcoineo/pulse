# Pulse

Web analytics dashboard. Track pageviews, visitors, referrers, devices, countries, and revenue across multiple sites. Import events via CSV or API, export filtered reports, visualize everything with interactive charts.

**Stack:** `Next.js 14 · TypeScript · Auth.js v5 · Drizzle ORM · Turso (SQLite) · Recharts · SWR · Papaparse · Tailwind CSS`

**Live:** https://pulse-bitcoineo.vercel.app

---

## Why I built this

I wanted to understand how analytics platforms aggregate data at query time rather than storing pre-computed results. Every chart in Pulse runs a live SQL aggregation against the events table filtered by date range and site ID. The schema indexes on (siteId, timestamp), (siteId, name), and (siteId, path) so those queries stay fast even with 12,000+ events in the seed data.

## Features

- **Dashboard** Pageviews, visitors, avg duration, bounce rate with period-over-period change
- **Charts** Area chart for pageviews over time, bar chart for revenue, donut charts for browser/device/country breakdowns
- **Top pages and referrers** Ranking tables with proportional bars
- **Date range picker** Presets (today, 7d, 30d, 90d, month, year) plus custom range
- **Events log** Paginated table with server-side sorting, type filter, path/referrer search, and date range filter
- **CSV import** Drag-and-drop upload, auto column mapping, 10-row preview, per-row validation
- **CSV export** Download all events matching current filters
- **Multi-site** Create and manage multiple tracked sites
- **Auto-refresh** Dashboard refreshes every 60 seconds via SWR

## Setup

    pnpm install
    cp .env.example .env.local

Fill in your .env.local:

    DATABASE_URL=           # Turso database URL
    DATABASE_AUTH_TOKEN=    # Turso auth token
    AUTH_SECRET=            # openssl rand -base64 32
    GOOGLE_CLIENT_ID=       # Google OAuth client ID
    GOOGLE_CLIENT_SECRET=   # Google OAuth client secret
    NEXT_PUBLIC_BASE_URL=   # http://localhost:3000 for dev

Run migrations, seed demo data, and start:

    pnpm db:migrate
    pnpm db:seed
    pnpm dev

Open http://localhost:3000

Demo credentials: demo@example.com / password123

## API Routes

| Route | Description |
|-------|-------------|
| GET /api/sites | List sites |
| POST /api/sites | Create site |
| GET /api/sites/[id]/analytics/overview | Metric totals with period-over-period change |
| GET /api/sites/[id]/analytics/pageviews | Pageviews over time |
| GET /api/sites/[id]/analytics/pages | Top pages |
| GET /api/sites/[id]/analytics/referrers | Top referrers |
| GET /api/sites/[id]/analytics/browsers | Browser breakdown |
| GET /api/sites/[id]/analytics/devices | Device breakdown |
| GET /api/sites/[id]/analytics/countries | Country breakdown |
| GET /api/sites/[id]/analytics/revenue | Revenue over time |
| GET /api/sites/[id]/events | Paginated event list |
| POST /api/sites/[id]/events/import | Batch CSV import |
| GET /api/sites/[id]/events/export | Export filtered CSV |
| POST /api/collect | Ingest a new event |

All site routes verify ownership. Analytics routes accept start and end date params.

## GitHub Topics

`nextjs` `typescript` `analytics` `dashboard` `recharts` `drizzle-orm` `turso` `sqlite` `authjs` `swr` `csv` `tailwind`
