import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
  description: "Refund, cancellation and appointment rescheduling policy for Twacha Skin Clinic.",
  alternates: { canonical: "/refund-policy" }
};

const sections = [
  {
    heading: "Consultation and treatment pricing",
    body: "Consultation fees, treatment estimates and package options are shared during clinic communication or in-person visit after assessment. Prices may vary according to diagnosis, treatment plan, sessions and products advised."
  },
  {
    heading: "Appointment rescheduling",
    body: "If you need to change your appointment, please call the clinic as early as possible. The team will help you find the next suitable slot based on doctor and treatment availability."
  },
  {
    heading: "Payments",
    body: "Any advance or treatment payment terms will be explained by the clinic before collection. Please confirm the service, doctor, date and amount before making any payment."
  },
  {
    heading: "Refund review",
    body: "Refund requests, where applicable, are reviewed by the clinic team based on the nature of the booking, services already provided, consumables, package terms and applicable clinic policy."
  }
];

export default async function RefundPolicyPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="terms-page">
        <section className="terms-hero">
          <span className="eyebrow">Clinic Policy</span>
          <h1>Refund and Cancellation Policy</h1>
          <p>Clear guidance for appointment changes, payments and refund review at Twacha Skin Clinic.</p>
        </section>
        <section className="terms-layout">
          <aside className="terms-sidebar">
            <div>
              <span className="eyebrow">Need Help?</span>
              <h2>Speak with the clinic team</h2>
              <p>For appointment changes or payment questions, contact us directly.</p>
              <a href={`tel:${data.settings.phone.replaceAll(" ", "")}`}>{data.settings.phone}</a>
              <Link className="primary-btn" href="/contact">Contact clinic</Link>
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
