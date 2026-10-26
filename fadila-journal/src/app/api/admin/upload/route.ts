import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getCurrentAdmin } from "@/lib/auth";

const allowedTypes: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Şəkil seçilməyib." }, { status: 400 });
  const extension = allowedTypes[file.type];
  if (!extension) return NextResponse.json({ error: "Yalnız JPG, PNG, WEBP və GIF formatları qəbul olunur." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Şəkil maksimum 5MB ola bilər." }, { status: 400 });
  const directory = path.join(process.cwd(), "public", "uploads");
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${extension}`;
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${filename}` });
}
