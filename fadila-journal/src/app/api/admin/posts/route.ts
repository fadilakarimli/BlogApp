import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/ə/g, "e").replace(/ı/g, "i").replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ö/g, "o").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  const posts = await prisma.post.findMany({ include: { translations: true }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim();
    const readTimeMinutes = Math.max(1, Math.min(120, Number(body.readTimeMinutes) || 4));
    const locale = body.locale === "en" ? "en" : "az";
    if (!title || !excerpt || !content) return NextResponse.json({ error: "Başlıq, xülasə və məzmun vacibdir." }, { status: 400 });
    const slug = slugify(String(body.slug || title));
    const status = ["DRAFT", "PUBLISHED", "SCHEDULED"].includes(body.status) ? body.status : "DRAFT";
    const categorySlugs = Array.isArray(body.categorySlugs) ? body.categorySlugs.filter((value: unknown): value is string => typeof value === "string") : [];
    if (!categorySlugs.length) return NextResponse.json({ error: "Ən azı bir kateqoriya seçilməlidir." }, { status: 400 });
    const requestedDate = body.publishedAt ? new Date(String(body.publishedAt)) : new Date();
    if (Number.isNaN(requestedDate.getTime())) return NextResponse.json({ error: "Yayımlanma tarixi düzgün deyil." }, { status: 400 });
    const post = await prisma.post.create({ data: { authorId: admin.id, status, publishedAt: status === "DRAFT" ? null : requestedDate, translations: { create: { locale, slug, title, excerpt, content, readTimeMinutes, coverImageUrl: body.coverImageUrl ? String(body.coverImageUrl) : null } }, categories: { create: categorySlugs.map((categorySlug: string) => ({ category: { connect: { slug: categorySlug } } })) } }, include: { translations: true, categories: true } });
    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error && error.message.includes("Unique") ? "Bu dil və slug artıq istifadə olunur." : "Bloq yaratmaq mümkün olmadı.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
