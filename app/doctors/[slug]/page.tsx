import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookOpenText, CheckCircle2, Mail, Phone, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

const doctorSpecialities: Record<string, string> = {
  "dr-richa-sharma": "Cosmetic & General Dermatology",
  "dr-tapesh-sharma": "Cosmetic & General Dermatology",
  "dr-neha-gupta": "Cosmetic & General Dermatology"
};

const doctorCredentials: Record<string, string[]> = {
  "dr-richa-sharma": [
    "MBBS and MD Dermatology from Lady Hardinge Medical College, New Delhi",
    "Former lecturer at SRMS Medical College",
    "Former consultant dermatologist at a leading aesthetic clinic chain",
    "Office bearer of IWDA and PDS",
    "Member of AAD, IADVL, ACSI and CDSI"
  ]
};

export async function generateStaticParams() {
  const data = await getSiteData();
  return data.doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSiteData();
  const doctor = data.doctors.find((item) => item.slug === slug);
  const title = doctor ? `${doctor.name} - ${doctor.title}` : "Doctor";
  const description = doctor?.summary || "Meet the dermatology team at Twacha Skin Clinic.";

  return {
    title,
    description,
    alternates: {
      canonical: `/doctors/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `/doctors/${slug}`,
      type: "profile",
      images: doctor?.image ? [{ url: doctor.image, alt: doctor.name }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: doctor?.image ? [doctor.image] : undefined
    }
  };
}

export default async function DoctorDetail({ params }: Props) {
  const { slug } = await params;
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);
  const doctor = data.doctors.find((item) => item.slug === slug);

  if (!doctor) return <main className="page-shell"><h1>Doctor not found</h1></main>;

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="doctor-detail-page">
        <section className="doctor-detail-hero">
          <div className="doctor-profile-card-large">
            <div className="doctor-profile-image-frame">
              <img src={doctor.image} alt={doctor.name} />
            </div>
            <div className="doctor-contact-card">
              <span>{doctorSpecialities[doctor.slug] || doctor.title}</span>
              <a href={`tel:${data.settings.phone}`}><Phone size={17} /> {data.settings.phone}</a>
              <a href={`mailto:${data.settings.email}`}><Mail size={17} /> {data.settings.email}</a>
            </div>
          </div>
          <div className="doctor-profile-copy">
            <div className="detail-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/doctors">Doctors</Link></div>
            <span className="eyebrow">{doctor.title}</span>
            <h1>{doctor.name}</h1>
            <p>{doctor.summary}</p>
            <div className="doctor-profile-actions">
              <Link className="primary-btn" href="/book-appointment">Book appointment</Link>
              <a className="secondary-btn" href={`tel:${data.settings.phone}`}>Call clinic</a>
            </div>
          </div>
        </section>

        <section className="doctor-detail-content">
          <article className="doctor-bio-panel">
            <span className="eyebrow">Doctor profile</span>
            <h2>About {doctor.name}</h2>
            <p>{doctor.summary}</p>
            <div className="doctor-credential-strip">
              <span><ShieldCheck size={18} /> Dermatologist-led care</span>
              <span><BookOpenText size={18} /> Academic contribution</span>
              <span><Award size={18} /> Aesthetic dermatology</span>
            </div>
          </article>

          <article className="doctor-highlights-panel">
            <div>
              <span className="eyebrow">Experience</span>
              <h2>Professional highlights</h2>
            </div>
            <div className="doctor-highlight-list">
              {doctor.highlights.map((highlight) => <p key={highlight}><CheckCircle2 size={18} /> {highlight}</p>)}
            </div>
          </article>

          {(doctorCredentials[doctor.slug]?.length || 0) > 0 && (
            <article className="doctor-credentials-panel">
              <span className="eyebrow">Education & associations</span>
              <h2>Training, teaching and memberships</h2>
              <div className="doctor-credentials-grid">
                {doctorCredentials[doctor.slug].map((item, index) => (
                  <p key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</p>
                ))}
              </div>
            </article>
          )}
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
