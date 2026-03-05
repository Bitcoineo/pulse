import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { jsonError } from "@/lib/api-utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const site = await db.query.sites.findFirst({
    where: and(eq(sites.id, params.siteId), eq(sites.userId, session.user.id)),
  });

  if (!site) return jsonError("Not found", 404);
  return NextResponse.json(site);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const site = await db.query.sites.findFirst({
    where: and(eq(sites.id, params.siteId), eq(sites.userId, session.user.id)),
  });
  if (!site) return jsonError("Not found", 404);

  const body = await req.json();
  const { name, domain } = body;

  if (!name && !domain) return jsonError("Nothing to update");

  await db
    .update(sites)
    .set({
      ...(name && { name }),
      ...(domain && { domain }),
    })
    .where(eq(sites.id, params.siteId));

  const updated = await db.query.sites.findFirst({
    where: eq(sites.id, params.siteId),
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return jsonError("Unauthorized", 401);

  const site = await db.query.sites.findFirst({
    where: and(eq(sites.id, params.siteId), eq(sites.userId, session.user.id)),
  });
  if (!site) return jsonError("Not found", 404);

  await db.delete(sites).where(eq(sites.id, params.siteId));
  return NextResponse.json({ success: true });
}
