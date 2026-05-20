import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";
import { getPageContent } from "@/lib/pages";

const categoryIntro: Record<string, string> = {
  "Face Treatments": "Peels, MediFacials, HydraFacial, MNRF, microblading and advanced face rejuvenation treatments copied from the old Twacha service library.",
  "Laser Treatments": "Laser hair reduction, Pico laser and Q-switched ND YAG procedures for hair, pigment and skin concerns.",
  "Hair Growth Treatments": "PRP, QR678, GFC, regenerative skin therapy and hair drip options for hair fall and scalp concerns.",
  "Cosmetic Injectables": "Dermal fillers, anti-wrinkle treatment, threads, skin boosters and aesthetic enhancement procedures.",
  "Body Treatments": "Body polish, stretch marks, HIFU and body-focused skin treatment options.",
  "Conditions": "Common dermatology concerns including acne, melasma, ageing, pigmentation and hair-related conditions.",
  "Technology": "Advanced diagnostic and treatment technology used inside Twacha Skin Clinic."
};

const categoryIcons: Record<string, string> = {
  "Face Treatments": "/assets/img/icon/Face-treatment.png",
  "Laser Treatments": "/assets/img/icon/Laser-Tretment.png",
  "Hair Growth Treatments": "/assets/img/icon/Hair-Growth.png",
  "Cosmetic Injectables": "/assets/img/icon/cosmotice-injectiron.png",
  "Body Treatments": "/assets/img/icon/body - treatment.png",
  "Conditions": "/assets/img/icon/Dermatological.png",
  "Technology": "/assets/img/advance-tecnology.png"
};

export default async function ServicesPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);
  const categories = Array.from(new Set(services.map((service) => service.category)));
  const page = getPageContent(data, "services", {
    eyebrow: "Treatments",
    title: "Complete Twacha treatment library",
    excerpt: "Face treatments, laser procedures, hair growth therapies, cosmetic injectables, body treatments and dermatology conditions from the old Twacha website are now fully dynamic."
  });

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="services-page">
        <section className="services-hero">
          <div>
            <span className="eyebrow">Treatments & Conditions</span>
            <h1>{page.title}</h1>
            <p>{page.excerpt}</p>
          </div>
          <div className="services-hero-panel">
            <strong>{services.length}+</strong>
            <span>Copied services and conditions</span>
            <p>All major treatment content is organized by category for easy browsing and SEO-friendly service discovery.</p>
          </div>
        </section>

        <section className="services-category-strip" aria-label="Service categories">
          {categories.map((category) => (
            <a href={`#${category.toLowerCase().replaceAll(" ", "-")}`} key={category}>
              <img src={categoryIcons[category] || "/assets/img/icon/Dermatological.png"} alt="" />
              <b>{category}</b>
              <span>{services.filter((service) => service.category === category).length} services</span>
            </a>
          ))}
        </section>

        <section className="services-library">
          {categories.map((category, index) => {
            const categoryServices = services.filter((service) => service.category === category);
            return (
              <section className="services-category-block" id={category.toLowerCase().replaceAll(" ", "-")} key={category}>
                <div className="services-category-heading">
                  <span className="eyebrow">{String(index + 1).padStart(2, "0")} / {category}</span>
                  <h2>{category}</h2>
                  <p>{categoryIntro[category] || "Explore Twacha Skin Clinic services copied from the old website and redesigned for the new experience."}</p>
                </div>
                <div className="services-list-grid">
                  {categoryServices.map((service) => (
                    <article className="services-list-card" key={service.slug}>
                      <Link className="services-list-image" href={`/services/${service.slug}`}>
                        <img src={service.image} alt={service.title} />
                      </Link>
                      <div>
                        <span>{service.category}</span>
                        <h3><Link href={`/services/${service.slug}`}>{service.title}</Link></h3>
                        <p>{service.excerpt}</p>
                        <Link className="services-list-link" href={`/services/${service.slug}`}>
                          View details <ArrowRight size={16} />
                        </Link>
                      </div>
                    </article>
                  ))}
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
