import Link from "next/link";
import { CalendarDays, Mail, Phone } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";
import { getPageContent } from "@/lib/pages";

function cleanText(text: string) {
  return text.replaceAll("â€™", "'").replaceAll("â€“", "-");
}

export default async function TermsPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);
  const page = getPageContent(data, "terms-and-conditions", {
    eyebrow: "Terms",
    title: "Terms & Conditions",
    excerpt: "Welcome to Twacha Skin Clinic. We appreciate your decision to consider us as your skin, hair, and aesthetic solution providers."
  });

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="terms-page">
        <section className="terms-hero">
          <span className="eyebrow">Terms and Conditions</span>
          <h1>{page.title}</h1>
          <p>Welcome to Twacha Skin Clinic. We appreciate your decision to consider us as your skin, hair, and aesthetic solution providers. As a courtesy to us, by accessing this website or making an appointment with us, you are bound by the following Terms & Conditions. They are designed to allow us to maintain a healthy relationship with you.</p>
        </section>

        <section className="terms-layout">
          <aside className="terms-sidebar">
            <div>
              <span className="eyebrow">Quick Contact</span>
              <h2>Questions about terms?</h2>
              <p>There may be questions about our Terms and Conditions, appointments, and services that you may have, and we are here to assist you.</p>
              <a href={`tel:${data.settings.phone.replaceAll("-", "")}`}><Phone size={18} /> {data.settings.phone}</a>
              <a href="mailto:contact@twacha.in"><Mail size={18} /> contact@twacha.in</a>
              <Link className="primary-btn" href="/book-appointment"><CalendarDays size={18} /> Book appointment</Link>
            </div>
          </aside>

          <div className="terms-card-list">
            {page.sections.map((section, index) => (
              <article className="terms-card" key={section.heading}>
                <div className="terms-card-number">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <h2>{section.heading}</h2>
                  {section.body.length > 1 ? (
                    <>
                      <p>{cleanText(section.body[0])}</p>
                      <ul>
                        {section.body.slice(1).map((text) => <li key={text}>{cleanText(text)}</li>)}
                      </ul>
                    </>
                  ) : (
                    section.body.map((text) => <p key={text}>{cleanText(text)}</p>)
                  )}
                </div>
              </article>
            ))}

            <article className="terms-card terms-contact-card">
              <div className="terms-card-number">10</div>
              <div>
                <h2>Contact Us</h2>
                <p>There may be questions about our Terms and Conditions, appointments, and services that you may have, and we are here to assist you. You can contact us at <a href="mailto:contact@twacha.in">contact@twacha.in</a> or <a href={`tel:${data.settings.phone.replaceAll("-", "")}`}>{data.settings.phone}</a>.</p>
              </div>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
