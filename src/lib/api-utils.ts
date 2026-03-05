import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifySiteOwnership } from "@/lib/permissions";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function authenticatedSiteHandler(
  req: NextRequest,
  siteId: string,
  handler: (userId: string, siteId: string, searchParams: URLSearchParams) => Promise<NextResponse>
) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("Unauthorized", 401);
  }

  const owns = await verifySiteOwnership(siteId, session.user.id);
  if (!owns) {
    return jsonError("Not found", 404);
  }

  return handler(session.user.id, siteId, req.nextUrl.searchParams);
}

export function parseDateRange(searchParams: URLSearchParams) {
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  if (!start || !end) {
    return null;
  }
  return { startDate: start, endDate: end };
}
