import { NextRequest, NextResponse } from "next/server";
import { authenticatedSiteHandler } from "@/lib/api-utils";
import { getEvents } from "@/lib/events";

export async function GET(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  return authenticatedSiteHandler(req, params.siteId, async (_userId, siteId, searchParams) => {
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const sort = searchParams.get("sort") || "timestamp";
    const order = (searchParams.get("order") || "desc") as "asc" | "desc";
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined;
    const startDate = searchParams.get("start") || undefined;
    const endDate = searchParams.get("end") || undefined;

    const result = await getEvents(siteId, {
      page,
      limit,
      sort,
      order,
      type,
      search,
      startDate,
      endDate,
    });

    return NextResponse.json(result);
  });
}
