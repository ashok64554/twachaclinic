import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Post-care Instructions | Twacha Skin Clinic",
  description: "General post-care guidance after dermatology, laser and aesthetic treatments at Twacha Skin Clinic.",
  alternates: { canonical: "/resources/post-care" }
};

const points = [
  "Follow the medicine, skincare and sunscreen instructions given by your dermatologist.",
  "Avoid picking, rubbing or exfoliating treated skin unless the clinic advises otherwise.",
  "Protect treated areas from harsh sun exposure and heat as instructed.",
  "Contact the clinic if you notice unusual pain, swelling, allergy, infection signs or any concern after treatment.",
  "Attend follow-up visits when advised so the doctor can monitor progress and adjust the plan."
];

export default async function PostCarePage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="terms-page">
        <section className="terms-hero">
          <span className="eyebrow">Patient Resources</span>
          <h1>Post-care Instructions</h1>
          <p>General after-care guidance. Your dermatologist may give treatment-specific instructions.</p>
        </section>
        <section className="terms-card-list standalone">
          {points.map((point, index) => (
            <article className="terms-card" key={point}>
              <div className="terms-card-number">{String(index + 1).padStart(2, "0")}</div>
              <div><p>{point}</p></div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
