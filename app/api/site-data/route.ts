import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSiteData, saveSiteData } from "@/lib/data";
import type { SiteData } from "@/lib/types";

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const next = await request.json() as SiteData;
  if (!next.settings || !Array.isArray(next.services) || !Array.isArray(next.doctors) || !Array.isArray(next.pages) || (next.videos && !Array.isArray(next.videos))) {
    return NextResponse.json({ error: "Invalid site data" }, { status: 400 });
  }

  await saveSiteData(next);
  return NextResponse.json({ ok: true });
}
