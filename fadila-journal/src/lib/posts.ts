import { prisma } from "@/lib/prisma";

export async function getPublishedPosts(locale: string) {
  return prisma.post.findMany({
    where: { status: "PUBLISHED", OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] },
    include: { translations: true, categories: { include: { category: { include: { translations: true } } } } },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  }).then((posts) => posts.map((post) => {
    const translation = post.translations.find((item) => item.locale === locale) || post.translations[0];
    if (!translation) return null;
    const category = post.categories[0]?.category.translations.find((item) => item.locale === locale)?.name || post.categories[0]?.category.translations[0]?.name || "Journal";
    return { ...post, translation, category };
  }).filter((post): post is NonNullable<typeof post> => Boolean(post)));
}
