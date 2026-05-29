import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pre-care Instructions | Twacha Skin Clinic",
  description: "General pre-care guidance before dermatology, laser and aesthetic consultations at Twacha Skin Clinic.",
  alternates: { canonical: "/resources/pre-care" }
};

const points = [
  "Share your medical history, allergies, pregnancy status, current medicines and previous procedures with the doctor.",
  "Avoid starting strong active skincare products before procedures unless advised by the clinic.",
  "For laser or device-based treatments, follow shaving, sun exposure and skincare instructions shared by the clinic team.",
  "Arrive with clean skin when possible and carry relevant prescriptions or reports.",
  "Final instructions may differ by treatment. Follow the plan shared after consultation."
];

export default async function PreCarePage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="terms-page">
        <section className="terms-hero">
          <span className="eyebrow">Patient Resources</span>
          <h1>Pre-care Instructions</h1>
          <p>General preparation guidance before your consultation or treatment visit.</p>
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
