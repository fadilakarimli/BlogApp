import Link from "next/link";

type Props = {
  locale: "az" | "en";
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  index?: number;
  coverImageUrl?: string | null;
};

export function BlogCard({ locale, category, title, excerpt, date, readTime, slug, index = 0, coverImageUrl }: Props) {
  return (
    <article className={`blog-card card-tone-${index % 3}`}>
      <Link href={`/${locale}/blog/${slug}`} className="card-image" aria-label={title} style={coverImageUrl ? { backgroundImage: `url(${coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
        <span className="image-mark">{String(index + 1).padStart(2, "0")}</span>
        <span className="image-caption">{category}</span>
      </Link>
      <div className="card-meta">
        <span>{category}</span>
        <span>{readTime}</span>
      </div>
      <h3><Link href={`/${locale}/blog/${slug}`}>{title}</Link></h3>
      <p>{excerpt}</p>
      <div className="card-footer">
        <time>{date}</time>
        <Link href={`/${locale}/blog/${slug}`} aria-label={`Read ${title}`} className="arrow-link">↗</Link>
      </div>
    </article>
  );
}
