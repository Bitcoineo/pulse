import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { sites } from "@/db/schema";

export async function verifySiteOwnership(
  siteId: string,
  userId: string
): Promise<boolean> {
  const site = await db.query.sites.findFirst({
    where: and(eq(sites.id, siteId), eq(sites.userId, userId)),
  });
  return !!site;
}

export async function getSiteForUser(siteId: string, userId: string) {
  return db.query.sites.findFirst({
    where: and(eq(sites.id, siteId), eq(sites.userId, userId)),
  });
}
