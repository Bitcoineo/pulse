import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { verifySiteOwnership } from "@/lib/permissions";
import { getAllFilteredEvents } from "@/lib/events";
import Papa from "papaparse";

export async function GET(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const owns = await verifySiteOwnership(params.siteId, session.user.id);
  if (!owns) {
    return new Response("Not found", { status: 404 });
  }

  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type") || undefined;
  const search = searchParams.get("search") || undefined;
  const startDate = searchParams.get("start") || undefined;
  const endDate = searchParams.get("end") || undefined;

  const rows = await getAllFilteredEvents(params.siteId, {
    type,
    search,
    startDate,
    endDate,
  });

  const csvData = rows.map((r) => ({
    timestamp: r.timestamp,
    name: r.name,
    path: r.path,
    referrer: r.referrer || "",
    browser: r.browser || "",
    os: r.os || "",
    device: r.device || "",
    country: r.country || "",
    duration: r.duration ?? "",
    revenue: r.revenue ?? "",
  }));

  const csv = Papa.unparse(csvData);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="events-${params.siteId}.csv"`,
    },
  });
}
