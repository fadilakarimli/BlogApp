import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  const setting = await prisma.siteSetting.findUnique({ where: { key: "about" } });
  return NextResponse.json(setting?.value || null);
}

export async function PUT(request: Request) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  const body = await request.json();
  const locale = body.locale === "en" ? "en" : "az";
  const current = await prisma.siteSetting.findUnique({ where: { key: "about" } });
  const value = typeof current?.value === "object" && current.value !== null ? current.value as Record<string, unknown> : {};
  value[locale] = { greeting: String(body.greeting || "").trim(), lead: String(body.lead || "").trim(), values: Array.isArray(body.values) ? body.values.slice(0, 3).map((item: { title?: string; text?: string }, index: number) => ({ number: index + 1, title: String(item.title || "").trim(), text: String(item.text || "").trim() })) : [] };
  const jsonValue = value as Prisma.InputJsonValue;
  const setting = await prisma.siteSetting.upsert({ where: { key: "about" }, update: { value: jsonValue }, create: { key: "about", value: jsonValue } });
  return NextResponse.json(setting.value);
}

export async function DELETE(request: Request) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  const body = await request.json();
  const current = await prisma.siteSetting.findUnique({ where: { key: "about" } });
  if (!current) return NextResponse.json({ ok: true });
  const value = typeof current.value === "object" && current.value !== null ? { ...(current.value as Record<string, unknown>) } : {};
  delete value[body.locale === "en" ? "en" : "az"];
  if (Object.keys(value).length) await prisma.siteSetting.update({ where: { key: "about" }, data: { value: value as Prisma.InputJsonValue } });
  else await prisma.siteSetting.delete({ where: { key: "about" } });
  return NextResponse.json({ ok: true });
}
