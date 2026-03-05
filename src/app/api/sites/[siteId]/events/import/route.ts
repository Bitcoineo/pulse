import { NextRequest, NextResponse } from "next/server";
import { authenticatedSiteHandler, jsonError } from "@/lib/api-utils";
import { batchInsertEvents } from "@/lib/events";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  return authenticatedSiteHandler(req, params.siteId, async (userId, siteId) => {
    const rl = rateLimit(`import:${userId}`, 10, 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Slow down. Try again in a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { events: rows } = body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return jsonError("Events array is required");
    }

    if (rows.length > 50_000) {
      return NextResponse.json(
        { error: "Too many rows. Max 50,000." },
        { status: 413 }
      );
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

      let revenue: number | null = null;
      if (row.revenue) {
        const parsed = Math.round(parseFloat(row.revenue) * 100);
        revenue = isNaN(parsed) ? null : parsed;
      }

      valid.push({
        ...row,
        timestamp: d.toISOString(),
        duration: row.duration ? parseInt(row.duration, 10) || null : null,
        revenue,
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
