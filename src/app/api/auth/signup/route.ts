import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const rl = rateLimit(`signup:${ip}`, 5, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a moment." },
      { status: 429 }
    );
  }

  const { name, email, password } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and password (8+ chars) required" },
      { status: 400 }
    );
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name: name || null,
    email,
    password: hashedPassword,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
