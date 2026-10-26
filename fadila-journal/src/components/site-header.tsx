import Link from "next/link";

type Props = { locale: "az" | "en" };

export function SiteHeader({ locale }: Props) {
  const az = locale === "az";

  return (
    <header className="site-header">
      <Link href={`/${locale}`} className="brand" aria-label="Fadila Journal home">
        fadila journal<span>.</span>
      </Link>
      <nav className="main-nav" aria-label={az ? "Əsas naviqasiya" : "Main navigation"}>
        <Link href={`/${locale}/blog`}>{az ? "Bloqlar" : "Journal"}</Link>
        <Link href={`/${locale}/about`}>{az ? "Haqqımda" : "About"}</Link>
      </nav>
      <div className="header-actions">
        <Link className="language-link" href={`/${az ? "en" : "az"}`} aria-label={az ? "Switch to English" : "Azərbaycan dilinə keç"}>
          {az ? "EN" : "AZ"}
        </Link>
      </div>
    </header>
  );
}
