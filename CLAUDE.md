# Pulse -- Analytics Dashboard

## Overview
A web analytics dashboard where users track website/app metrics. Import data via CSV or API, visualize with interactive charts, filter by date ranges, and export reports. Think Plausible/Vercel Analytics.

## Tech Stack
- Next.js 14 (App Router), TypeScript strict
- Drizzle ORM + Turso (libSQL)
- Auth.js v5 (Google OAuth + credentials), JWT strategy
- Recharts (charts), Papaparse (CSV parsing)
- Tailwind CSS, pnpm
- SWR for client-side data fetching
- date-fns for date manipulation

## Database Schema

### Auth tables (standard Auth.js)
- user, account, session, verificationToken

### site
- id (nanoid), userId (FK user), name, domain (text), createdAt

### event
- id (nanoid), siteId (FK site)
- name (text -- "pageview", "click", "signup", "purchase", custom)
- path (text -- URL path like "/about", "/pricing")
- referrer (text, nullable)
- browser (text, nullable)
- os (text, nullable)
- country (text, nullable)
- city (text, nullable)
- device (text, nullable -- desktop, mobile, tablet)
- duration (integer, nullable -- seconds on page)
- revenue (integer, nullable -- cents, for purchase events)
- metadata (text, nullable -- JSON string for custom props)
- timestamp (text -- ISO datetime)
- Index on (siteId, timestamp)
- Index on (siteId, name)
- Index on (siteId, path)

### dashboard
- id (nanoid), siteId (FK site), name, layout (text -- JSON string), createdAt, updatedAt

### widget
- id (nanoid), dashboardId (FK dashboard)
- type (text: line_chart, bar_chart, area_chart, pie_chart, metric_card, table)
- title (text)
- config (text -- JSON: { metric, groupBy, dateRange, filters })
- position (integer -- order in dashboard)
- createdAt

## Core Metrics (computed from events)
- Total pageviews: COUNT where name='pageview'
- Unique visitors: COUNT DISTINCT on visitor hash (browser+os+country proxy)
- Avg session duration: AVG of duration
- Bounce rate: % of sessions with only 1 pageview
- Top pages: GROUP BY path, ORDER BY count DESC
- Top referrers: GROUP BY referrer
- Browser/OS/Device/Country breakdowns: GROUP BY respective field
- Events over time: GROUP BY date, COUNT
- Revenue: SUM of revenue where name='purchase'

## API Routes
- Auth: signup, signin
- Sites: CRUD
- Events: list (paginated), aggregate (for charts), import CSV, export CSV
- Dashboards: CRUD, update layout
- Widgets: CRUD within dashboard

## Pages
- /auth/signin, /auth/signup
- /sites -- list user's sites, create new
- /sites/[siteId] -- main dashboard view
- /sites/[siteId]/events -- event log with pagination/filtering/sorting
- /sites/[siteId]/import -- CSV import
- /sites/[siteId]/settings -- site settings, delete

## Key Architecture Decisions
- Events are the core data model -- everything is an event with properties
- All analytics queries aggregate from the events table
- Date range filtering on every query: WHERE timestamp BETWEEN start AND end
- Server-side aggregation with GROUP BY + COUNT/SUM/AVG
- Client-side data fetching with SWR for caching + auto-refresh
- CSV import: parse with Papaparse, validate schema, batch insert
- CSV export: server generates CSV from filtered query results
- Edge-compatible auth config split (auth.ts + auth.config.ts)

## Commands
- `pnpm dev` -- start dev server
- `pnpm build` -- production build
- `pnpm db:generate` -- generate Drizzle migrations
- `pnpm db:migrate` -- run migrations
- `pnpm db:seed` -- seed demo data (10,000+ events)
- `pnpm db:studio` -- open Drizzle Studio

## Project Structure
```
src/
  app/           -- Next.js App Router pages and API routes
  components/    -- React components
  db/
    schema.ts    -- Drizzle schema definitions
    index.ts     -- Database client
    migrate.ts   -- Migration runner
    seed.ts      -- Demo data seeder
  lib/
    permissions.ts -- Site ownership checks
  auth.ts        -- Auth.js config (server)
  auth.config.ts -- Auth.js config (edge-compatible)
  middleware.ts  -- Route protection
```
