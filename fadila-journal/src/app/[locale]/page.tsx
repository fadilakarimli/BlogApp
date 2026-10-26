import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { SiteHeader } from "@/components/site-header";
import { isLocale } from "@/lib/i18n";
import { getPublishedPosts } from "@/lib/posts";

export function generateStaticParams() {
  return [{ locale: "az" }, { locale: "en" }];
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const az = locale === "az";
  const databasePosts = await getPublishedPosts(locale);

  const posts = databasePosts.slice(0, 3).map((post) => ({ category: post.category, title: post.translation.title, excerpt: post.translation.excerpt, date: new Intl.DateTimeFormat(az ? "az-AZ" : "en-US", { dateStyle: "medium" }).format(post.publishedAt || post.createdAt), readTime: az ? `${post.translation.readTimeMinutes} dəq oxu` : `${post.translation.readTimeMinutes} min read`, slug: post.translation.slug, coverImageUrl: post.translation.coverImageUrl }));

  return (
    <main className="site-shell">
      <SiteHeader locale={locale} />
      <section className="hero">
        <div className="hero-kicker"><span className="status-dot" /> {az ? "DEVELOPER · AI HƏVƏSKARI · ÖYRƏNMƏYƏ AÇIQ" : "DEVELOPER · AI ENTHUSIAST · LIFELONG LEARNER"}</div>
        <h1>{az ? <>Fikirlər, kod və<br /><em>aralarındakı hər şey.</em></> : <>Ideas, code &<br /><em>everything in between.</em></>}</h1>
        <div className="hero-bottom">
          <p>{az ? "Öyrəndiklərimi, yaratdıqlarımı və yol boyu kəşf etdiyim fikirləri paylaşdığım şəxsi məkan." : "A personal space for the things I learn, the things I build, and the ideas I collect along the way."}</p>
          <Link className="text-link" href={`/${locale}/blog`}>{az ? "Yazıları kəşf et" : "Explore the journal"} <span>↗</span></Link>
        </div>
        <div className="hero-art" aria-label="Abstract editorial artwork">
          <div className="art-sun" />
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-line line-one" />
          <div className="art-line line-two" />
          <span className="art-label">{az ? "FİKİRLƏR ARXİVİ" : "AN ARCHIVE OF IDEAS"}</span>
          <span className="art-index">FK — 001</span>
        </div>
      </section>

      <section className="journal-section" id="latest">
        <div className="section-heading">
          <div><span className="eyebrow">{az ? "SON HEKAYƏLƏR" : "THE LATEST STORIES"}</span><h2>{az ? "Jurnaldan qeydlər." : "Notes from the journal."}</h2></div>
          <Link className="text-link" href={`/${locale}/blog`}>{az ? "Bütün yazılar" : "All stories"} ↗</Link>
        </div>
        {posts.length > 0 ? <div className="blog-grid">{posts.map((post, index) => <BlogCard key={post.slug} {...post} locale={locale} index={index} />)}</div> : <div className="empty-state"><span className="empty-icon">✳</span><h2>{az ? "Hələ yazı yoxdur." : "No stories yet."}</h2><p>{az ? "İlk yazını admin panelindən yayımla." : "Publish the first story from the admin panel."}</p></div>}
      </section>

      <section className="about-strip">
        <span className="eyebrow">{az ? "BU SAYT HAQQINDA" : "A LITTLE ABOUT THIS SPACE"}</span>
        <div className="about-strip-content">
          <h2>{az ? "Öyrəndiklərimi paylaşmaq, fikirlərimi toplamaq və yol boyu inkişaf etmək üçün." : "A place to share what I learn, collect my thoughts, and grow along the way."}</h2>
          <Link className="round-link" href={`/${locale}/about`} aria-label={az ? "Haqqımda" : "About me"}>↗</Link>
        </div>
      </section>

      <section className="newsletter-section">
        <div><span className="eyebrow">{az ? "ƏLAQƏDƏ QAL" : "LETTERS, OCCASIONALLY"}</span><h2>{az ? "Yeni fikirlər gələndə xəbərdar ol." : "A note when there's something new."}</h2><p>{az ? "Yeni yazılar və öyrəndiklərim haqqında yeniliklər." : "New writing, useful discoveries, and things worth sharing."}</p></div>
        <NewsletterForm locale={locale} />
      </section>
      <footer className="site-footer">
        <Link href={`/${locale}`} className="brand">fadila journal<span>.</span></Link>
        <span>© {new Date().getFullYear()} Fadila Karimli</span>
        <span>{az ? "Diqqətlə yaradılıb." : "Made with intention."}</span>
      </footer>
    </main>
  );
}
