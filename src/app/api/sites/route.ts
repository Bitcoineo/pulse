import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { sites, events } from "@/db/schema";
import { eq, and, count, gte } from "drizzle-orm";
import { nanoid } from "nanoid";
import { jsonError } from "@/lib/api-utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const userSites = await db.query.sites.findMany({
    where: eq(sites.userId, session.user.id),
    orderBy: (sites, { desc }) => [desc(sites.createdAt)],
  });

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const sitesWithStats = await Promise.all(
    userSites.map(async (site) => {
      const [result] = await db
        .select({ count: count() })
        .from(events)
        .where(
          and(
            eq(events.siteId, site.id),
            eq(events.name, "pageview"),
            gte(events.timestamp, oneDayAgo)
          )
        );
      return { ...site, recentPageviews: result.count };
    })
  );

  return NextResponse.json(sitesWithStats);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const body = await req.json();
  const { name, domain } = body;

  if (!name || !domain) return jsonError("Name and domain are required");

  const id = nanoid();
  await db.insert(sites).values({
    id,
    userId: session.user.id,
    name,
    domain,
  });

  const site = await db.query.sites.findFirst({ where: eq(sites.id, id) });
  return NextResponse.json(site, { status: 201 });
}
