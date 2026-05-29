import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie policy for Twacha Skin Clinic website visitors.",
  alternates: { canonical: "/cookie-policy" }
};

const sections = [
  {
    heading: "What cookies do",
    body: "Cookies help the website remember basic preferences, measure page performance and understand how visitors use the site."
  },
  {
    heading: "Analytics and advertising",
    body: "We may use analytics and advertising tools to measure campaign performance, improve pages and understand enquiries. These tools may use cookies or similar technologies."
  },
  {
    heading: "Embedded services",
    body: "Maps, YouTube videos, Instagram embeds and other third-party tools may place cookies according to their own policies."
  },
  {
    heading: "Your control",
    body: "You can disable or delete cookies in your browser settings. Some embedded features may not work fully if cookies are blocked."
  }
];

export default async function CookiePolicyPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="terms-page">
        <section className="terms-hero">
          <span className="eyebrow">Website Policy</span>
          <h1>Cookie Policy</h1>
          <p>How cookies and similar technologies may be used on the Twacha Skin Clinic website.</p>
        </section>
        <section className="terms-layout">
          <aside className="terms-sidebar">
            <div>
              <span className="eyebrow">Related Policy</span>
              <h2>Privacy and website use</h2>
              <p>Read our privacy policy for more details on form data and website enquiries.</p>
              <Link className="primary-btn" href="/privacy-policy">Privacy Policy</Link>
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
