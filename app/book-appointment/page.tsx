import type { Metadata } from "next";
import { CalendarDays, CheckCircle2, Clock, Phone } from "lucide-react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";
import { getPageContent } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Book Appointment | Twacha Skin Clinic Dwarka",
  description: "Book a dermatologist appointment at Twacha Skin Clinic in Dwarka, New Delhi."
};

export default async function BookAppointmentPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);
  const doctors = data.doctors.filter((doctor) => doctor.active);
  const page = getPageContent(data, "book-appointment", {
    eyebrow: "Book appointment",
    title: "Schedule your dermatologist consultation",
    excerpt: "Select a service and preferred doctor. The clinic team will call you to confirm timing and guide you on any preparation."
  });

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="page-shell">
        <section className="booking-hero">
          <div>
            <span className="eyebrow">{page.eyebrow}</span>
            <h1>{page.title}</h1>
            <p>{page.excerpt}</p>
            <div className="booking-points">
              <p><CheckCircle2 size={18} /> Dermatologist-led skin, hair, laser and aesthetic care.</p>
              <p><Clock size={18} /> Share preferred date or time in the form.</p>
              <p><Phone size={18} /> For urgent booking, call {data.settings.phone}.</p>
            </div>
          </div>
          <div className="booking-form-panel">
            <h2><CalendarDays size={26} /> Appointment details</h2>
            <AppointmentForm services={services.map((service) => service.title)} doctors={doctors.map((doctor) => doctor.name)} />
          </div>
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
