import { NextRequest, NextResponse } from "next/server";
import { authenticatedSiteHandler, parseDateRange, jsonError } from "@/lib/api-utils";
import { getRevenueOverTime } from "@/lib/analytics";

export async function GET(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  return authenticatedSiteHandler(req, params.siteId, async (_userId, siteId, searchParams) => {
    const range = parseDateRange(searchParams);
    if (!range) return jsonError("start and end params required");

    const data = await getRevenueOverTime(siteId, range.startDate, range.endDate);
    return NextResponse.json(data);
  });
}
