import { NextRequest, NextResponse } from "next/server";
import { adminCookieName, adminSessionAgeSeconds, createAdminSession, defaultAdminCredentials, verifyAdminLogin } from "@/lib/admin-auth";

export async function GET() {
  return NextResponse.json({ defaultCredentials: defaultAdminCredentials });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { login?: string; password?: string };
  const user = await verifyAdminLogin(body.login || "", body.password || "");
  if (!user) {
    return NextResponse.json({ error: "Invalid admin login." }, { status: 401 });
  }

  const response = NextResponse.json({ user });
  response.cookies.set(adminCookieName, createAdminSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: adminSessionAgeSeconds,
    path: "/"
  });
  return response;
}
