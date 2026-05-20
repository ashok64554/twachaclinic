import { NextRequest, NextResponse } from "next/server";
import { changeAdminPassword, getAdminFromRequest } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const user = await getAdminFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as { currentPassword?: string; newPassword?: string };
  const result = await changeAdminPassword(user.id, body.currentPassword || "", body.newPassword || "");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, user: result.user });
}
