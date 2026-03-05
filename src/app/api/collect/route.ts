import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, sites } from "@/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { siteId, name, path, referrer, browser, os, device, country, city, duration, revenue, metadata } = body;

  if (!siteId || !name || !path) {
    return NextResponse.json({ error: "siteId, name, and path are required." }, { status: 400 });
  }

  const rl = rateLimit(`collect:${siteId}`, 100, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Slow down. Try again in a moment." }, { status: 429 });
  }

  const site = await db.query.sites.findFirst({
    where: eq(sites.id, siteId),
  });
  if (!site) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await db.insert(events).values({
    siteId,
    name,
    path,
    referrer: referrer || null,
    browser: browser || null,
    os: os || null,
    device: device || null,
    country: country || null,
    city: city || null,
    duration: duration != null ? Number(duration) || null : null,
    revenue: revenue != null ? Math.round(Number(revenue) * 100) || null : null,
    metadata: metadata ? JSON.stringify(metadata) : null,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
