import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { isLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const az = raw === "az";
  const setting = await prisma.siteSetting.findUnique({ where: { key: "about" } });
  const allAbout = setting?.value && typeof setting.value === "object" ? setting.value as Record<string, unknown> : {};
  const about = (allAbout[raw] && typeof allAbout[raw] === "object" ? allAbout[raw] : { greeting: "", lead: "", values: [] }) as { greeting: string; lead: string; values: { number?: number; title: string; text: string }[] };
  return (
    <main className="site-shell">
      <SiteHeader locale={raw} />
      <section className="inner-page about-page">
        <span className="eyebrow">{az ? "HAQQIMDA" : "A LITTLE ABOUT ME"}</span>
        <h1>{about.greeting}</h1>
        <p className="about-lead">{about.lead}</p>
        <div className="about-values">{about.values.map((value, index) => <div key={`${value.title}-${index}`}><span>{String(value.number || index + 1).padStart(2, "0")}</span><h3>{value.title}</h3><p>{value.text}</p></div>)}</div>
        <Link className="text-link" href={`/${raw}/blog`}>{az ? "Yazıları oxu" : "Read the journal"} ↗</Link>
      </section>
      <footer className="site-footer"><Link href={`/${raw}`} className="brand">fadila journal<span>.</span></Link><span>© {new Date().getFullYear()} Fadila Karimli</span></footer>
    </main>
  );
}
