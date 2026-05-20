import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const data = await getSiteData();
  return data.pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSiteData();
  const page = data.pages.find((item) => item.slug === slug && item.active);
  const title = page?.metaTitle || page?.title || "Twacha Skin Clinic";
  const description = page?.metaDescription || page?.excerpt || "Twacha Skin Clinic offers dermatologist-led skin, hair, laser and aesthetic care in Dwarka, New Delhi.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `/${slug}`,
      type: "article",
      images: page?.image ? [{ url: page.image, alt: page.title }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: page?.image ? [page.image] : undefined
    }
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const data = await getSiteData();
  const page = data.pages.find((item) => item.slug === slug && item.active);
  const services = data.services.filter((service) => service.active);

  if (!page) notFound();

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="page-shell">
        <section className="page-hero">
          <div>
            <span className="eyebrow">{page.eyebrow}</span>
            <h1>{page.title}</h1>
            <p>{page.excerpt}</p>
          </div>
          {page.image && <img src={page.image} alt={page.title} />}
        </section>
        {page.sections.length > 0 && (
          <section className="content-grid">
            <article>
              <div className="service-detail-sections">
                {page.sections.map((section) => (
                  <section key={section.heading}>
                    <h2>{section.heading}</h2>
                    {section.body.map((text) => <p key={text}>{text}</p>)}
                  </section>
                ))}
              </div>
            </article>
            <aside>
              <h3>Contact</h3>
              <p>{data.settings.phone}</p>
              <p>{data.settings.email}</p>
            </aside>
          </section>
        )}
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
