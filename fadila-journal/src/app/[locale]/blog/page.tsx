import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { isLocale } from "@/lib/i18n";
import { getPublishedPosts } from "@/lib/posts";
import { BlogArchive } from "@/components/blog-archive";

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const az = raw === "az";
  const posts = await getPublishedPosts(raw);
  const archivePosts = posts.map((post) => ({ id: post.id, category: post.category, title: post.translation.title, excerpt: post.translation.excerpt, slug: post.translation.slug, coverImageUrl: post.translation.coverImageUrl, date: new Intl.DateTimeFormat(az ? "az-AZ" : "en-US", { dateStyle: "medium" }).format(post.publishedAt || post.createdAt), readTime: az ? `${post.translation.readTimeMinutes} dəq oxu` : `${post.translation.readTimeMinutes} min read` }));
  return (
    <main className="site-shell">
      <SiteHeader locale={raw} />
      <section className="inner-page">
        <span className="eyebrow">{az ? "ARXİV" : "THE JOURNAL"}</span>
        <h1>{az ? <>Bütün yazılar,<br /><em>bir yerdə.</em></> : <>All stories,<br /><em>in one place.</em></>}</h1>
        <p className="inner-intro">{az ? "Mövzulara göz at, yeni fikirlər kəşf et və maraqlandığın yazını tap." : "Browse topics, find a new idea, and follow whatever catches your curiosity."}</p>
        {posts.length > 0 ? <BlogArchive posts={archivePosts} locale={raw} az={az} /> : <div className="empty-state"><span className="empty-icon">✳</span><h2>{az ? "Yazılar burada toplanacaq." : "The stories will live here."}</h2><p>{az ? "İlk real yazını admin panelindən yayımla." : "Publish your first story from the admin panel."}</p><Link className="text-link" href={`/${raw}`}>{az ? "Ana səhifəyə qayıt" : "Back to home"} ↗</Link></div>}
      </section>
      <footer className="site-footer"><Link href={`/${raw}`} className="brand">fadila journal<span>.</span></Link><span>© {new Date().getFullYear()} Fadila Karimli</span></footer>
    </main>
  );
}
