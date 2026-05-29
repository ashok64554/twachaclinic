import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description: "Medical disclaimer for Twacha Skin Clinic website content and appointment enquiries.",
  alternates: { canonical: "/medical-disclaimer" }
};

const sections = [
  {
    heading: "Information only",
    body: "Content on this website is for general information about dermatology, skin, hair, laser and aesthetic services. It should not be treated as a diagnosis, prescription or replacement for an in-person consultation."
  },
  {
    heading: "Consultation is required",
    body: "Treatment suitability, expected improvement, number of sessions, downtime and possible side effects vary from person to person. A dermatologist will advise after reviewing your medical history and skin or hair concern."
  },
  {
    heading: "No emergency support",
    body: "Website forms are not for emergencies. For urgent medical symptoms, contact an appropriate emergency medical service or visit a nearby medical facility."
  },
  {
    heading: "Results may vary",
    body: "Images, testimonials and educational examples are shared only to explain possible treatment journeys. Individual outcomes depend on diagnosis, skin type, compliance with care instructions and other clinical factors."
  }
];

export default async function MedicalDisclaimerPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="terms-page">
        <section className="terms-hero">
          <span className="eyebrow">Patient Information</span>
          <h1>Medical Disclaimer</h1>
          <p>Please read this before using website content or submitting an appointment enquiry.</p>
        </section>
        <section className="terms-layout">
          <aside className="terms-sidebar">
            <div>
              <span className="eyebrow">Need Advice?</span>
              <h2>Book a dermatologist consultation</h2>
              <p>Clinical advice is provided only after consultation and examination.</p>
              <Link className="primary-btn" href="/book-appointment">Book appointment</Link>
            </div>
          </aside>
          <div className="terms-card-list">
            {sections.map((section, index) => (
              <article className="terms-card" key={section.heading}>
                <div className="terms-card-number">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
