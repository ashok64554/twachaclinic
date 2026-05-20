import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Mail, Phone, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Twacha Skin Clinic website visitors, enquiries and appointment requests.",
  alternates: {
    canonical: "/privacy-policy"
  }
};

const privacySections = [
  {
    heading: "Information we collect",
    body: [
      "When you submit a contact or appointment form, we may collect details such as your name, phone number, email address, selected service, preferred appointment date and message.",
      "This information helps our clinic team respond to enquiries, arrange consultations and understand the concern you have shared."
    ]
  },
  {
    heading: "How we use your information",
    body: [
      "We use submitted information to contact you, schedule appointments, answer questions, follow up on enquiries and improve the website experience.",
      "We do not sell your personal information."
    ]
  },
  {
    heading: "Cookies, analytics and advertising",
    body: [
      "This website may use cookies, analytics tools and advertising technologies to understand traffic, measure campaigns and show relevant ads.",
      "You can manage or disable cookies from your browser settings."
    ]
  },
  {
    heading: "Third-party services",
    body: [
      "Embedded maps, videos, analytics tools and advertising platforms may process data according to their own privacy policies.",
      "These services help us show clinic location, treatment videos, campaign performance and website usage insights."
    ]
  },
  {
    heading: "Data sharing and protection",
    body: [
      "Information submitted through the website is used by Twacha Skin Clinic and authorised team members for clinic communication and service support.",
      "We take reasonable steps to keep submitted information protected from unauthorised access, misuse or disclosure."
    ]
  },
  {
    heading: "Medical information note",
    body: [
      "Website forms are intended for appointment and enquiry support only.",
      "Please do not use website forms for emergency medical needs. For urgent medical concerns, contact an appropriate medical service directly."
    ]
  },
  {
    heading: "Your choices",
    body: [
      "You may contact us to update, correct or request deletion of information submitted through the website, subject to reasonable clinic, legal and operational requirements.",
      "You may also choose not to submit forms and contact the clinic by phone instead."
    ]
  }
];

export default async function PrivacyPolicyPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="terms-page privacy-page">
        <section className="terms-hero">
          <span className="eyebrow">Privacy Policy</span>
          <h1>Privacy Policy</h1>
          <p>How Twacha Skin Clinic handles website enquiries, appointment requests, cookies and visitor information. This page explains what we collect, why we use it and how you can contact us.</p>
        </section>

        <section className="terms-layout">
          <aside className="terms-sidebar">
            <div>
              <span className="eyebrow">Your Privacy</span>
              <h2>Need help with privacy?</h2>
              <p>For questions about website data, appointment enquiries or privacy requests, contact the clinic team directly.</p>
              <a href={`tel:${data.settings.phone.replaceAll("-", "")}`}><Phone size={18} /> {data.settings.phone}</a>
              <a href={`mailto:${data.settings.email}`}><Mail size={18} /> {data.settings.email}</a>
              <Link className="primary-btn" href="/book-appointment"><CalendarDays size={18} /> Book appointment</Link>
            </div>
          </aside>

          <div className="terms-card-list">
            {privacySections.map((section, index) => (
              <article className="terms-card" key={section.heading}>
                <div className="terms-card-number">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <h2>{section.heading}</h2>
                  {section.body.map((text) => <p key={text}>{text}</p>)}
                </div>
              </article>
            ))}

            <article className="terms-card terms-contact-card">
              <div className="terms-card-number"><ShieldCheck size={24} /></div>
              <div>
                <h2>Contact Twacha Skin Clinic</h2>
                <p>For privacy questions, contact us at <a href={`mailto:${data.settings.email}`}>{data.settings.email}</a> or call <a href={`tel:${data.settings.phone.replaceAll("-", "")}`}>{data.settings.phone}</a>.</p>
              </div>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
