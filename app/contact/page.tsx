import { Mail, MapPin, Phone } from "lucide-react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";
import { getPageContent } from "@/lib/pages";

export default async function ContactPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);
  const doctors = data.doctors.filter((doctor) => doctor.active);
  const page = getPageContent(data, "contact", {
    eyebrow: "Contact",
    title: "Book a dermatologist consultation",
    excerpt: "Reach Twacha Skin Clinic in Sector 12A, Dwarka, New Delhi."
  });
  const mapQuery = encodeURIComponent(data.settings.address);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="page-shell">
        <section className="page-hero compact">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p>{page.excerpt}</p>
        </section>
        <section className="contact-grid">
          <div className="contact-card">
            <h2>Clinic details</h2>
            <a href={`tel:${data.settings.phone.replaceAll(" ", "")}`}><Phone size={18} /> {data.settings.phone}</a>
            <a href={`mailto:${data.settings.email}`}><Mail size={18} /> {data.settings.email}</a>
            <a href={data.settings.googleMapsUrl} target="_blank"><MapPin size={18} /> {data.settings.address}</a>
          </div>
          <div id="contact-form" className="contact-card">
            <h2>Contact form</h2>
            <AppointmentForm mode="contact" services={services.map((service) => service.title)} doctors={doctors.map((doctor) => doctor.name)} />
          </div>
        </section>
        <section className="contact-map-section">
          <div className="section-title">
            <div>
              <span className="eyebrow">Location</span>
              <h2>Visit Twacha Skin Clinic</h2>
              <p className="section-lead">{data.settings.address}</p>
            </div>
            <a href={data.settings.googleMapsUrl} target="_blank" rel="noreferrer">Get directions</a>
          </div>
          <iframe
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            title="Twacha Skin Clinic map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
