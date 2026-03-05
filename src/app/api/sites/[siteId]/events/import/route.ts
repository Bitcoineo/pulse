import { NextRequest, NextResponse } from "next/server";
import { authenticatedSiteHandler, jsonError } from "@/lib/api-utils";
import { batchInsertEvents } from "@/lib/events";

export async function POST(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  return authenticatedSiteHandler(req, params.siteId, async (_userId, siteId) => {
    const body = await req.json();
    const { events: rows } = body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return jsonError("Events array is required");
    }

    const valid: typeof rows = [];
    const errors: { row: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.name || !row.path || !row.timestamp) {
        errors.push({ row: i + 1, error: "Missing required field (name, path, or timestamp)" });
        continue;
      }
      const d = new Date(row.timestamp);
      if (isNaN(d.getTime())) {
        errors.push({ row: i + 1, error: "Invalid timestamp" });
        continue;
      }
      valid.push({
        ...row,
        timestamp: d.toISOString(),
        duration: row.duration ? parseInt(row.duration, 10) || null : null,
        revenue: row.revenue ? parseInt(row.revenue, 10) || null : null,
      });
    }

    let inserted = 0;
    if (valid.length > 0) {
      inserted = await batchInsertEvents(siteId, valid);
    }

    return NextResponse.json({
      imported: inserted,
      skipped: errors.length,
      errors: errors.slice(0, 50),
    });
  });
}
