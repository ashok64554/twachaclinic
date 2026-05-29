import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Patient FAQs | Twacha Skin Clinic",
  description: "Common patient questions about appointments, consultations and dermatology treatments at Twacha Skin Clinic.",
  alternates: { canonical: "/resources/faqs" }
};

const faqs = [
  ["Do I need a consultation before treatment?", "Yes. Treatment suitability is decided after a dermatologist reviews your concern, history and skin or hair condition."],
  ["Can I book online?", "Yes. Submit the appointment form and the clinic team will call you to confirm the slot."],
  ["Are treatment results the same for everyone?", "No. Results vary by diagnosis, skin type, treatment plan, session count and post-care compliance."],
  ["Where is the clinic located?", "Twacha Skin Clinic is located in Sector 12A, Dwarka, New Delhi."],
  ["How are prices shared?", "Consultation fees and treatment estimates are shared during clinic communication or in-person visit after assessment."],
  ["Can I call directly?", "Yes. You can call +91-93503-03663 for appointment and clinic enquiries."]
];

export default async function PatientFaqsPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="page-shell">
        <section className="page-hero compact">
          <span className="eyebrow">Patient Resources</span>
          <h1>Patient FAQs</h1>
          <p>Short answers to common questions before booking a consultation.</p>
        </section>
        <section className="faq-list">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
        <section className="cta-strip">
          <h2>Still have a question?</h2>
          <Link className="primary-btn" href="/contact">Contact Twacha</Link>
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
