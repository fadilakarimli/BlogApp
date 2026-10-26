import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const readTimeMinutes = Math.max(1, Math.min(120, Number(body.readTimeMinutes) || 4));
  const translation = await prisma.postTranslation.findFirst({ where: { postId: id } });
  if (!translation) return NextResponse.json({ error: "Bloq tapılmadı." }, { status: 404 });
  const status = ["DRAFT", "PUBLISHED", "SCHEDULED"].includes(body.status) ? body.status : "DRAFT";
  const categorySlugs = Array.isArray(body.categorySlugs) ? body.categorySlugs.filter((value: unknown): value is string => typeof value === "string") : [];
  if (!categorySlugs.length) return NextResponse.json({ error: "Ən azı bir kateqoriya seçilməlidir." }, { status: 400 });
  const requestedDate = body.publishedAt ? new Date(String(body.publishedAt)) : new Date();
  if (Number.isNaN(requestedDate.getTime())) return NextResponse.json({ error: "Yayımlanma tarixi düzgün deyil." }, { status: 400 });
  const post = await prisma.post.update({ where: { id }, data: { status, publishedAt: status === "DRAFT" ? null : requestedDate, translations: { update: { where: { id: translation.id }, data: { title: String(body.title || "").trim(), slug: String(body.slug || translation.slug).trim(), excerpt: String(body.excerpt || "").trim(), content: String(body.content || "").trim(), readTimeMinutes, coverImageUrl: body.coverImageUrl ? String(body.coverImageUrl) : null } } }, categories: { deleteMany: {}, create: categorySlugs.map((categorySlug: string) => ({ category: { connect: { slug: categorySlug } } })) } }, include: { translations: true, categories: true } });
  return NextResponse.json(post);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
