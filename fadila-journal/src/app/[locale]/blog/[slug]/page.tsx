import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { isLocale } from "@/lib/i18n";
import { getPublishedPosts } from "@/lib/posts";

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const az = raw === "az";
  const databasePost = (await getPublishedPosts(raw)).find((item) => item.translation.slug === slug);
  const titles: Record<string, { en: string; az: string }> = {
    "ai-learning-notes": { en: "What I'm Learning About Building with AI", az: "Süni intellektlə öyrənmək haqqında qeydlərim" },
    "building-personal-projects": { en: "Notes from Building a Personal Project", az: "Şəxsi layihə qurarkən öyrəndiklərim" },
    "small-steps": { en: "Small Steps, Consistent Growth", az: "Kiçik addımlar, davamlı inkişaf" },
  };
  const post = titles[slug] || (databasePost ? { en: databasePost.translation.title, az: databasePost.translation.title } : undefined);
  if (!post) notFound();
  return (
    <main className="site-shell">
      <SiteHeader locale={raw} />
      <article className="article-page">
        <Link className="back-link" href={`/${raw}/blog`}>← {az ? "Bütün yazılar" : "All stories"}</Link>
        <span className="eyebrow">{az ? "ÖYRƏNMƏ QEYDLƏRİ" : "NOTES ON LEARNING"}</span>
        <h1>{az ? post.az : post.en}</h1>
        <div className="article-meta"><span>Fadila Karimli</span><span>·</span><time>{new Intl.DateTimeFormat(az ? "az-AZ" : "en-US", { dateStyle: "medium" }).format(databasePost?.publishedAt || databasePost?.createdAt || new Date())}</time><span>·</span><span>{az ? "4 dəq oxu" : "4 min read"}</span></div>
        <div className="article-art"><span>FK — JOURNAL ENTRY</span><div className="art-sun" /><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /></div>
        <div className="article-content">
          <p className="article-lead">{databasePost ? databasePost.translation.excerpt : az ? "Bu səhifə blog məqaləsi üçün dizayn nümunəsidir. Real məzmun admin panelindən yaradılacaq və verilənlər bazasında saxlanacaq." : "This page is a design sample for a journal entry. Real content will be created in the admin panel and stored in the database."}</p>
          <h2>{az ? "Marağı praktikaya çevirmək" : "Turning curiosity into practice"}</h2>
          <p>{az ? "Yeni texnologiyanı öyrənməyin ən yaxşı yollarından biri onu kiçik bir layihədə sınamaqdır. Prosesdə qeydlər aparmaq isə öyrəndiklərini daha yaxşı anlamağa kömək edir." : "One of the most useful ways to learn a new technology is to try it in a small project. Keeping notes along the way helps turn experiments into understanding."}</p>
          <blockquote>{az ? "Əsas məqsəd hər şeyi bilmək deyil, öyrənməyə davam etməkdir." : "The goal isn't to know everything. It's to keep learning."}</blockquote>
          <h2>{az ? "Kiçik addımların dəyəri" : "The value of small steps"}</h2>
          <p>{az ? "Davamlı inkişaf böyük sıçrayışlardan çox, müntəzəm təcrübə və düşünülmüş qərarlarla yaranır." : "Consistent progress often comes less from big leaps and more from regular practice and thoughtful decisions."}</p>
          <div className="article-end">{az ? "Oxuduğun üçün təşəkkürlər." : "Thanks for reading."} <span>✳</span></div>
        </div>
      </article>
      <footer className="site-footer"><Link href={`/${raw}`} className="brand">fadila journal<span>.</span></Link><span>© {new Date().getFullYear()} Fadila Karimli</span></footer>
    </main>
  );
}
