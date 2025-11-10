// app/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // optional: run basic internal checks
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();

  // you could also ping a DB or service here if needed
  return NextResponse.json(
    { status: "ok", uptime, timestamp },
    { status: 200 }
  );
}
