import "server-only";

export const ADMIN_SESSION_COOKIE = "fadila_admin_session";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const secret = process.env.AUTH_SECRET || "development-only-secret";

function sign(value: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function createSession(userId: string) {
  const expires = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = `${userId}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export async function getCurrentAdmin() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const [userId, expiresText, signature] = token.split(".");
  const payload = `${userId}.${expiresText}`;
  if (!userId || !expiresText || !signature || Number(expiresText) < Date.now()) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return prisma.user.findFirst({ where: { id: userId, role: "ADMIN" } });
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}
