import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";
import { treatmentRoutes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Treatments | Twacha Skin Clinic Dwarka",
  description: "Explore all Twacha Skin Clinic treatments including face, hair, laser, injectable and body procedures.",
  alternates: {
    canonical: "/treatments"
  }
};

const categoryTitles: Record<string, string> = {
  face: "Face Treatments",
  hair: "Hair Treatments",
  laser: "Laser Treatments",
  injectables: "Cosmetic Injectables",
  body: "Body Treatments"
};

const categoryIntro: Record<string, string> = {
  face: "Peels, HydraFacial, MNRF, HIFU, medifacials, photofacial and facial rejuvenation treatments.",
  hair: "PRP, QR678, GFC, hair drip and regenerative therapies for hair and scalp concerns.",
  laser: "Laser hair removal, Pico laser and Q-Switched Nd:YAG treatments.",
  injectables: "Dermal fillers, anti-wrinkle treatments, threads, skin boosters and aesthetic injectables.",
  body: "Body polish, stretch marks, body peels, HIFU and IV nutrition treatments."
};

const categoryIcons: Record<string, string> = {
  face: "/assets/img/icon/Face-treatment.png",
  hair: "/assets/img/icon/Hair-Growth.png",
  laser: "/assets/img/icon/Laser-Tretment.png",
  injectables: "/assets/img/icon/cosmotice-injectiron.png",
  body: "/assets/img/icon/body - treatment.png"
};

export default async function TreatmentsPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);
  const categories = Array.from(new Set(treatmentRoutes.map((route) => route.category)));

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="services-page treatments-page">
        <section className="services-hero">
          <div>
            <span className="eyebrow">Treatments</span>
            <h1>Explore all Twacha treatments</h1>
            <p>Browse the full treatment library in one place, grouped by Face, Hair, Laser, Injectables and Body care.</p>
          </div>
          <div className="services-hero-panel">
            <strong>{treatmentRoutes.length}+</strong>
            <span>Treatments</span>
            <p>Each treatment links to its complete detail page with patient-friendly information, images and care notes.</p>
          </div>
        </section>

        <section className="services-category-strip" aria-label="Treatment categories">
          {categories.map((category) => {
            const count = treatmentRoutes.filter((route) => route.category === category).length;
            return (
              <a href={`#${category}`} key={category}>
                <img src={categoryIcons[category] || "/assets/img/icon/Dermatological.png"} alt="" />
                <b>{categoryTitles[category] || category}</b>
                <span>{count} treatments</span>
              </a>
            );
          })}
        </section>

        <section className="services-library">
          {categories.map((category, index) => {
            const routes = treatmentRoutes.filter((route) => route.category === category);
            const title = categoryTitles[category] || category;

            return (
              <section className="services-category-block" id={category} key={category}>
                <div className="services-category-heading">
                  <span className="eyebrow">{String(index + 1).padStart(2, "0")} / {title}</span>
                  <h2>{title}</h2>
                  <p>{categoryIntro[category] || "Explore Twacha treatments copied from the old website and organized for the new treatment menu."}</p>
                </div>
                <div className="services-list-grid">
                  {routes.map((route) => {
                    const service = services.find((item) => item.slug === route.serviceSlug);
                    return (
                      <article className="services-list-card" key={`${route.category}-${route.slug}`}>
                        <Link className="services-list-image" href={`/treatments/${route.category}/${route.slug}`}>
                          {service?.image && <img src={service.image} alt={service.title} />}
                        </Link>
                        <div>
                          <span>{title}</span>
                          <h3><Link href={`/treatments/${route.category}/${route.slug}`}>{service?.title || route.label}</Link></h3>
                          <p>{service?.excerpt || "Learn about suitability, process, expected results and care instructions."}</p>
                          <Link className="services-list-link" href={`/treatments/${route.category}/${route.slug}`}>
                            View treatment <ArrowRight size={16} />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
