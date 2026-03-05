import { NextRequest, NextResponse } from "next/server";
import { authenticatedSiteHandler, parseDateRange, jsonError } from "@/lib/api-utils";
import { getOverviewMetrics } from "@/lib/analytics";

export async function GET(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  return authenticatedSiteHandler(req, params.siteId, async (_userId, siteId, searchParams) => {
    const range = parseDateRange(searchParams);
    if (!range) return jsonError("start and end params required");

    const startMs = new Date(range.startDate).getTime();
    const endMs = new Date(range.endDate).getTime();
    const periodLength = endMs - startMs;
    const prevStart = new Date(startMs - periodLength).toISOString();
    const prevEnd = range.startDate;

    const [metrics, prevMetrics] = await Promise.all([
      getOverviewMetrics(siteId, range.startDate, range.endDate),
      getOverviewMetrics(siteId, prevStart, prevEnd),
    ]);

    function pctChange(current: number, previous: number) {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 1000) / 10;
    }

    return NextResponse.json({
      ...metrics,
      changes: {
        totalPageviews: pctChange(metrics.totalPageviews, prevMetrics.totalPageviews),
        uniqueVisitors: pctChange(metrics.uniqueVisitors, prevMetrics.uniqueVisitors),
        avgDuration: pctChange(metrics.avgDuration, prevMetrics.avgDuration),
        bounceRate: pctChange(metrics.bounceRate, prevMetrics.bounceRate),
        totalRevenue: pctChange(metrics.totalRevenue, prevMetrics.totalRevenue),
      },
    });
  });
}
