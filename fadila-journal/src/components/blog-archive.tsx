"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/blog-card";

type ArchivePost = { id: string; category: string; title: string; excerpt: string; slug: string; date: string; readTime: string; coverImageUrl?: string | null };

export function BlogArchive({ posts, locale, az }: { posts: ArchivePost[]; locale: "az" | "en"; az: boolean }) {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const filtered = useMemo(() => posts.filter((post) => (active === "all" || post.category === active) && `${post.title} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase())), [posts, active, query]);
  return <>
    <div className="search-placeholder"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={az ? "Bloqlarda axtar" : "Search stories"} placeholder={az ? "Yazılarda axtar..." : "Search the journal..."} /><span className="search-shortcut">⌘ K</span></div>
    <div className="category-pills" role="tablist" aria-label={az ? "Kateqoriyalar" : "Categories"}><button role="tab" aria-selected={active === "all"} className={active === "all" ? "category-pill active" : "category-pill"} onClick={() => setActive("all")}>{az ? "Hamısı" : "All stories"}</button>{categories.map((category) => <button role="tab" aria-selected={active === category} className={active === category ? "category-pill active" : "category-pill"} key={category} onClick={() => setActive(category)}>{category}</button>)}</div>
    {filtered.length > 0 ? <div className="blog-grid archive-grid">{filtered.map((post, index) => <BlogCard key={post.id} {...post} locale={locale} index={index} />)}</div> : <div className="empty-state"><span className="empty-icon">⌕</span><h2>{az ? "Yazı tapılmadı." : "No stories found."}</h2><p>{az ? "Başqa axtarış və ya kateqoriya yoxla." : "Try another search or category."}</p></div>}
  </>;
}
