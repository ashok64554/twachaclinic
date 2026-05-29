import { Mail, MapPin, Phone } from "lucide-react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";
import { getPageContent } from "@/lib/pages";

export default async function ContactPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);
  const page = getPageContent(data, "contact", {
    eyebrow: "Contact",
    title: "Contact Twacha Skin Clinic",
    excerpt: "Send us your enquiry or reach our clinic team in Sector 12A, Dwarka, New Delhi."
  });
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224373.48742672353!2d77.01086404428206!3d28.514589312974216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03cce1261ab7%3A0xba873ba8bfdeb311!2sTwacha%20Skin%20%26%20Hair%20Clinic!5e0!3m2!1sen!2sin!4v1718190653652!5m2!1sen!2sin";

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
            <h2>Send us a message</h2>
            <AppointmentForm mode="contact" services={[]} />
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
            src={mapEmbedUrl}
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
