import { db } from "@/db";
import { events } from "@/db/schema";
import { and, eq, between, sql, count, avg, sum, desc } from "drizzle-orm";

type DateRange = { siteId: string; startDate: string; endDate: string };

function dateFilter({ siteId, startDate, endDate }: DateRange) {
  return and(
    eq(events.siteId, siteId),
    between(events.timestamp, startDate, endDate)
  );
}

export async function getOverviewMetrics(
  siteId: string,
  startDate: string,
  endDate: string
) {
  const range = { siteId, startDate, endDate };
  const pvFilter = and(dateFilter(range), eq(events.name, "pageview"));

  const [
    [pageviewResult],
    [visitorResult],
    [durationResult],
    [bounceResult],
    [revenueResult],
  ] = await Promise.all([
    db.select({ count: count() }).from(events).where(pvFilter),
    db
      .select({
        count: sql<number>`COUNT(DISTINCT (${events.browser} || ${events.os} || ${events.country}))`,
      })
      .from(events)
      .where(pvFilter),
    db.select({ avg: avg(events.duration) }).from(events).where(pvFilter),
    db
      .select({
        bounceRate: sql<number>`
          CAST(
            SUM(CASE WHEN sub.pvCount = 1 THEN 1 ELSE 0 END) AS REAL
          ) * 100.0 / MAX(COUNT(*), 1)
        `.as("bounceRate"),
      })
      .from(
        db
          .select({
            pvCount: count().as("pvCount"),
          })
          .from(events)
          .where(pvFilter)
          .groupBy(
            sql`(${events.browser} || ${events.os} || ${events.country})`,
            sql`DATE(${events.timestamp})`
          )
          .as("sub")
      ),
    db
      .select({ total: sum(events.revenue) })
      .from(events)
      .where(and(dateFilter(range), eq(events.name, "purchase"))),
  ]);

  return {
    totalPageviews: pageviewResult.count,
    uniqueVisitors: visitorResult.count,
    avgDuration: Math.round(Number(durationResult.avg) || 0),
    bounceRate: Math.round((Number(bounceResult.bounceRate) || 0) * 10) / 10,
    totalRevenue: Number(revenueResult.total) || 0,
  };
}

export async function getPageviewsOverTime(
  siteId: string,
  startDate: string,
  endDate: string,
  granularity: "hour" | "day" | "week" = "day"
) {
  const range = { siteId, startDate, endDate };

  let dateExpr;
  if (granularity === "hour") {
    dateExpr = sql<string>`STRFTIME('%Y-%m-%dT%H:00:00', ${events.timestamp})`;
  } else if (granularity === "week") {
    dateExpr = sql<string>`DATE(${events.timestamp}, 'weekday 0', '-6 days')`;
  } else {
    dateExpr = sql<string>`DATE(${events.timestamp})`;
  }

  return db
    .select({
      date: dateExpr.as("date"),
      count: count().as("count"),
    })
    .from(events)
    .where(and(dateFilter(range), eq(events.name, "pageview")))
    .groupBy(dateExpr)
    .orderBy(dateExpr);
}

export async function getTopPages(
  siteId: string,
  startDate: string,
  endDate: string,
  limit = 10
) {
  const range = { siteId, startDate, endDate };

  return db
    .select({
      path: events.path,
      count: count().as("count"),
    })
    .from(events)
    .where(and(dateFilter(range), eq(events.name, "pageview")))
    .groupBy(events.path)
    .orderBy(desc(count()))
    .limit(limit);
}

export async function getTopReferrers(
  siteId: string,
  startDate: string,
  endDate: string,
  limit = 10
) {
  const range = { siteId, startDate, endDate };

  return db
    .select({
      referrer: sql<string>`COALESCE(${events.referrer}, 'Direct')`.as("referrer"),
      count: count().as("count"),
    })
    .from(events)
    .where(and(dateFilter(range), eq(events.name, "pageview")))
    .groupBy(sql`COALESCE(${events.referrer}, 'Direct')`)
    .orderBy(desc(count()))
    .limit(limit);
}

export async function getBrowserBreakdown(
  siteId: string,
  startDate: string,
  endDate: string
) {
  const range = { siteId, startDate, endDate };

  const rows = await db
    .select({
      browser: events.browser,
      count: count().as("count"),
    })
    .from(events)
    .where(and(dateFilter(range), eq(events.name, "pageview")))
    .groupBy(events.browser)
    .orderBy(desc(count()));

  const total = rows.reduce((s, r) => s + r.count, 0);
  return rows.map((r) => ({
    browser: r.browser || "Unknown",
    count: r.count,
    percentage: total > 0 ? Math.round((r.count / total) * 1000) / 10 : 0,
  }));
}

export async function getOSBreakdown(
  siteId: string,
  startDate: string,
  endDate: string
) {
  const range = { siteId, startDate, endDate };

  const rows = await db
    .select({
      os: events.os,
      count: count().as("count"),
    })
    .from(events)
    .where(and(dateFilter(range), eq(events.name, "pageview")))
    .groupBy(events.os)
    .orderBy(desc(count()));

  const total = rows.reduce((s, r) => s + r.count, 0);
  return rows.map((r) => ({
    os: r.os || "Unknown",
    count: r.count,
    percentage: total > 0 ? Math.round((r.count / total) * 1000) / 10 : 0,
  }));
}

export async function getDeviceBreakdown(
  siteId: string,
  startDate: string,
  endDate: string
) {
  const range = { siteId, startDate, endDate };

  const rows = await db
    .select({
      device: events.device,
      count: count().as("count"),
    })
    .from(events)
    .where(and(dateFilter(range), eq(events.name, "pageview")))
    .groupBy(events.device)
    .orderBy(desc(count()));

  const total = rows.reduce((s, r) => s + r.count, 0);
  return rows.map((r) => ({
    device: r.device || "Unknown",
    count: r.count,
    percentage: total > 0 ? Math.round((r.count / total) * 1000) / 10 : 0,
  }));
}

export async function getCountryBreakdown(
  siteId: string,
  startDate: string,
  endDate: string,
  limit = 10
) {
  const range = { siteId, startDate, endDate };

  const rows = await db
    .select({
      country: events.country,
      count: count().as("count"),
    })
    .from(events)
    .where(and(dateFilter(range), eq(events.name, "pageview")))
    .groupBy(events.country)
    .orderBy(desc(count()))
    .limit(limit);

  const total = rows.reduce((s, r) => s + r.count, 0);
  return rows.map((r) => ({
    country: r.country || "Unknown",
    count: r.count,
    percentage: total > 0 ? Math.round((r.count / total) * 1000) / 10 : 0,
  }));
}

export async function getEventsOverTime(
  siteId: string,
  startDate: string,
  endDate: string,
  eventName?: string
) {
  const range = { siteId, startDate, endDate };
  const dateExpr = sql<string>`DATE(${events.timestamp})`;

  const conditions = [dateFilter(range)];
  if (eventName) {
    conditions.push(eq(events.name, eventName));
  }

  return db
    .select({
      date: dateExpr.as("date"),
      name: events.name,
      count: count().as("count"),
    })
    .from(events)
    .where(and(...conditions))
    .groupBy(dateExpr, events.name)
    .orderBy(dateExpr);
}

export async function getRevenueOverTime(
  siteId: string,
  startDate: string,
  endDate: string
) {
  const range = { siteId, startDate, endDate };
  const dateExpr = sql<string>`DATE(${events.timestamp})`;

  return db
    .select({
      date: dateExpr.as("date"),
      revenue: sum(events.revenue).as("revenue"),
      count: count().as("count"),
    })
    .from(events)
    .where(and(dateFilter(range), eq(events.name, "purchase")))
    .groupBy(dateExpr)
    .orderBy(dateExpr);
}
