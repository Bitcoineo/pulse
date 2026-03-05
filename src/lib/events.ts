import { db } from "@/db";
import { events } from "@/db/schema";
import { and, eq, between, like, or, count, desc, asc } from "drizzle-orm";

type EventQueryParams = {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  type?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortColumns: Record<string, any> = {
  timestamp: events.timestamp,
  name: events.name,
  path: events.path,
  referrer: events.referrer,
  browser: events.browser,
  os: events.os,
  device: events.device,
  country: events.country,
  duration: events.duration,
  revenue: events.revenue,
};

export async function getEvents(siteId: string, params: EventQueryParams) {
  const { page, limit, sort, order, type, search, startDate, endDate } = params;

  const conditions = [eq(events.siteId, siteId)];

  if (type) {
    conditions.push(eq(events.name, type));
  }

  if (startDate && endDate) {
    conditions.push(between(events.timestamp, startDate, endDate));
  }

  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      or(like(events.path, pattern), like(events.referrer, pattern))!
    );
  }

  const where = and(...conditions);
  const sortCol = sortColumns[sort] || events.timestamp;
  const orderFn = order === "asc" ? asc(sortCol) : desc(sortCol);

  const [totalResult] = await db
    .select({ count: count() })
    .from(events)
    .where(where);

  const total = totalResult.count;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  const rows = await db
    .select()
    .from(events)
    .where(where)
    .orderBy(orderFn)
    .limit(limit)
    .offset(offset);

  return { events: rows, total, page, totalPages };
}

export async function getAllFilteredEvents(
  siteId: string,
  params: Omit<EventQueryParams, "page" | "limit" | "sort" | "order">
) {
  const { type, search, startDate, endDate } = params;

  const conditions = [eq(events.siteId, siteId)];

  if (type) conditions.push(eq(events.name, type));
  if (startDate && endDate) conditions.push(between(events.timestamp, startDate, endDate));
  if (search) {
    const pattern = `%${search}%`;
    conditions.push(or(like(events.path, pattern), like(events.referrer, pattern))!);
  }

  return db
    .select()
    .from(events)
    .where(and(...conditions))
    .orderBy(desc(events.timestamp));
}

export async function batchInsertEvents(
  siteId: string,
  rows: {
    name: string;
    path: string;
    timestamp: string;
    referrer?: string | null;
    browser?: string | null;
    os?: string | null;
    country?: string | null;
    city?: string | null;
    device?: string | null;
    duration?: number | null;
    revenue?: number | null;
    metadata?: string | null;
  }[]
) {
  const BATCH_SIZE = 500;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE).map((row) => ({
      siteId,
      ...row,
      referrer: row.referrer ?? null,
      browser: row.browser ?? null,
      os: row.os ?? null,
      country: row.country ?? null,
      city: row.city ?? null,
      device: row.device ?? null,
      duration: row.duration ?? null,
      revenue: row.revenue ?? null,
      metadata: row.metadata ?? null,
    }));
    await db.insert(events).values(chunk);
    inserted += chunk.length;
  }

  return inserted;
}
