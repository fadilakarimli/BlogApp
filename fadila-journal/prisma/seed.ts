import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

async function main() {
  const categories = [
    {
      slug: "development",
      az: { name: "Proqramlaşdırma", description: "Kod, arxitektura və proqram mühəndisliyi." },
      en: { name: "Development", description: "Code, architecture and software engineering." },
    },
    {
      slug: "ai-technology",
      az: { name: "AI və Texnologiya", description: "Süni intellekt və praktik texnologiyalar." },
      en: { name: "AI & Technology", description: "Artificial intelligence and practical technology." },
    },
    {
      slug: "learning",
      az: { name: "Öyrənmə", description: "Yeni bacarıqlar və öyrənmə qeydləri." },
      en: { name: "Learning", description: "New skills and learning notes." },
    },
    {
      slug: "personal-thoughts",
      az: { name: "Şəxsi düşüncələr", description: "Gündəlik fikirlər və müşahidələr." },
      en: { name: "Personal Thoughts", description: "Daily thoughts and observations." },
    },
  ];

  for (const item of categories) {
    await prisma.category.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        slug: item.slug,
        translations: {
          create: [
            { locale: "az", ...item.az },
            { locale: "en", ...item.en },
          ],
        },
      },
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "about" },
    update: {},
    create: {
      key: "about",
      value: {
        az: { greeting: "Salam, mən Fadilayam.", lead: "Mən Full-Stack Developer və təhsil sahəsində çalışan biriyəm. Proqramlaşdırma, süni intellekt və öyrənmə prosesi mənim əsas maraq sahələrimdir.", values: [{ number: 1, title: "Yaratmaq", text: "Fikirləri işlək layihələrə çevirmək." }, { number: 2, title: "Öyrənmək", text: "Yeni yanaşmaları sınamaq və inkişaf etmək." }, { number: 3, title: "Paylaşmaq", text: "Öyrəndiklərimi başqaları üçün faydalı etmək." }] },
        en: { greeting: "Hello, I'm Fadila.", lead: "I'm a Full-Stack Developer and teaching assistant interested in software engineering, practical AI, and the art of learning.", values: [{ number: 1, title: "Building", text: "Turning ideas into useful projects." }, { number: 2, title: "Learning", text: "Exploring new approaches and growing." }, { number: 3, title: "Sharing", text: "Making what I learn useful to others." }] },
      },
    },
  });

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password && password.length >= 10) {
    await prisma.user.upsert({
      where: { email },
      update: { name: "Fadila", role: "ADMIN" },
      create: { name: "Fadila", email, passwordHash: hashPassword(password), role: "ADMIN" },
    });
    console.log(`Admin user seeded: ${email}`);
  } else {
    console.log("Admin user skipped: set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 10 characters) before seeding.");
  }

  console.log("Seed completed: categories created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
