import crypto from "crypto";
import type { NextRequest } from "next/server";
import { getSiteData, verifyAdminPassword } from "@/lib/data";
import { getDbConnection } from "@/lib/db";

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: string;
};

const COOKIE_NAME = "twacha_admin_session";
const SESSION_AGE_SECONDS = 60 * 60 * 8;
const DEFAULT_USERNAME = process.env.ADMIN_DEFAULT_USERNAME || "admin";
const DEFAULT_EMAIL = process.env.ADMIN_DEFAULT_EMAIL || "admin@twachaclinic.com";
const DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || "admin@12345678";

type AdminUserRow = AdminUser & {
  password_hash: string;
  active: number;
};

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "twacha-admin-session-secret";
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const existing = Buffer.from(hash, "hex");
  return existing.length === candidate.length && crypto.timingSafeEqual(existing, candidate);
}

async function ensureDefaultAdmin() {
  const connection = await getDbConnection();
  try {
    const [rows] = await connection.query("SELECT id FROM admin_users LIMIT 1");
    if ((rows as { id: number }[]).length === 0) {
      await connection.execute(
        "INSERT INTO admin_users (username, email, password_hash, role, active) VALUES (?, ?, ?, 'admin', 1)",
        [DEFAULT_USERNAME, DEFAULT_EMAIL, hashPassword(DEFAULT_PASSWORD)]
      );
    }
  } finally {
    await connection.end();
  }
}

async function findAdmin(login: string) {
  await ensureDefaultAdmin();
  const connection = await getDbConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username, email, password_hash, role, active FROM admin_users WHERE (email = ? OR username = ?) AND active = 1 LIMIT 1",
      [login, login]
    );
    return ((rows as AdminUserRow[])[0] || null);
  } finally {
    await connection.end();
  }
}

export async function verifyAdminLogin(login: string, password: string) {
  const user = await findAdmin(login.trim());
  if (!user || !verifyPassword(password, user.password_hash)) return null;
  return publicUser(user);
}

function publicUser(user: AdminUserRow | AdminUser): AdminUser {
  return { id: user.id, username: user.username, email: user.email, role: user.role };
}

export function createAdminSession(user: AdminUser) {
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_AGE_SECONDS
  })).toString("base64url");
  const signature = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export async function getAdminFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminUser & { exp: number };
    if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return publicUser(parsed);
  } catch {
    return null;
  }
}

export async function isAdminRequest(request: NextRequest) {
  const sessionUser = await getAdminFromRequest(request);
  if (sessionUser) return true;

  const legacyPassword = request.headers.get("x-admin-password") || "";
  if (!legacyPassword) return false;
  const data = await getSiteData();
  return verifyAdminPassword(legacyPassword, data);
}

export async function changeAdminPassword(userId: number, currentPassword: string, nextPassword: string) {
  if (nextPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }
  await ensureDefaultAdmin();
  const connection = await getDbConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id, username, email, password_hash, role, active FROM admin_users WHERE id = ? AND active = 1 LIMIT 1",
      [userId]
    );
    const user = (rows as AdminUserRow[])[0];
    if (!user || !verifyPassword(currentPassword, user.password_hash)) {
      return { ok: false, error: "Current password is incorrect." };
    }
    await connection.execute("UPDATE admin_users SET password_hash = ? WHERE id = ?", [hashPassword(nextPassword), userId]);
    return { ok: true, user: publicUser(user) };
  } finally {
    await connection.end();
  }
}

export const adminCookieName = COOKIE_NAME;
export const adminSessionAgeSeconds = SESSION_AGE_SECONDS;
export const defaultAdminCredentials = {
  username: DEFAULT_USERNAME,
  email: DEFAULT_EMAIL,
  password: DEFAULT_PASSWORD
};
