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
  "dr-neha-gupta": "Consultant Dermatologist",
  "dr-prachi-gupta": "Consultant Dermatologist"
};

const oldDoctorProfiles: Record<string, { summary: string; highlights: string[] }> = {
  "dr-tapesh-sharma": {
    summary: "Dr. Tapesh Sharma, co-founder and Medical Director of TWACHA Skin Clinic, is a renowned Dermatologist and Aesthetic Physician. With a rich background in dermatology, he earned his MBBS from SNMC, Agra, and later specialized with a postgraduate DVD from LLRM, Meerut, in 2002. Since founding TWACHA in 2007, Dr. Sharma has become a prominent figure in dermatology, known for his dedication to face aesthetics and advanced treatments like Anti-Wrinkle Treatment and Dermal Fillers.",
    highlights: [
      "Specializes in comprehensive skin, hair, and aesthetic treatments.",
      "Graduated from SNMC, Agra, and has a postgraduate Dermatology specialization from LLRM, Meerut.",
      "Active member of IACD, IADVL, ACSI, and CDSI.",
      "Regularly conducts lectures and training for aspiring dermatologists nationwide.",
      "Known for his compassionate, respectful, and patient-centric approach.",
      "Enthusiastically integrates cutting-edge technology to enhance patient experience and clinic operations."
    ]
  },
  "dr-neha-gupta": {
    summary: "Dr. Neha Gupta is a highly skilled Consultant Dermatologist, Aesthetic Dermatologist and Cosmetologist with six years of experience. Having completed her post-graduation at SMS Medical College, Jaipur, Dr. Neha has mastered a broad range of dermatological skills by handling over 200 patient consultations daily in outpatient and inpatient settings. Known for her compassionate and patient-centred approach, she excels in advanced dermatological procedures, including skin surgeries, laser treatments, and more. Her dedication to continuous education is evident in her active participation in conferences and publications in top-tier journals.",
    highlights: [
      "Holds MBBS and MD, DNB in Dermatology.",
      "Consultant dermatologist with extensive experience in patient handling.",
      "Skilled in skin surgeries, lasers, microneedling, vitiligo surgeries, PRP therapy, chemical peels, and radiofrequency surgery.",
      "Active participant and presenter at state, national, and international dermatology conferences.",
      "A prolific author in national and international journals.",
      "Renowned for her warm, patient-centric approach and commitment to continuous learning."
    ]
  },
  "dr-prachi-gupta": {
    summary: "Dr. Prachi Gupta is a highly trained Consultant Dermatologist, Aesthetic Physician, and Hair Transplant Surgeon with over 12 years of clinical experience. A postgraduate from the prestigious Sri Ramachandra Medical College, Chennai, she combines scientific precision with an artistic approach to skin and hair restoration. Her expertise lies in Anti-Wrinkle Treatment, skin boosters, lasers, and advanced aesthetic transformations, making her a trusted name for those seeking results-driven, personalized care.",
    highlights: [
      "M.B.B.S and D.D.V.L qualified, specializing in clinical and aesthetic dermatology.",
      "Skilled Consultant Dermatologist with expertise in advanced skin and hair treatments.",
      "Experienced Hair Transplant Surgeon delivering natural and long-lasting results.",
      "Regular attendee of national dermatology workshops and aesthetic training programs.",
      "Passionate about combining medical science with cosmetic excellence.",
      "Committed to providing personalized care using latest techniques and technologies."
    ]
  },
  "dr-richa-sharma": {
    summary: "Dr. Richa Sharma, the co-founder and Medical Director of TWACHA Skin Clinics, is a distinguished dermatologist with an accomplished educational background, having completed her MBBS and MD in Dermatology at the prestigious Lady Hardinge Medical College, New Delhi. Before launching TWACHA in Delhi, she enriched her career as a lecturer in dermatology at SRMS Medical College and as a consultant dermatologist at a leading aesthetic clinic chain. Dr. Sharma is celebrated for her extensive hair disorders and aesthetic dermatology expertise, bringing a profound academic foundation to her patient care, which is marked by compassion and personalized attention.",
    highlights: [
      "She completed MBBS and MD Dermatology at Lady Hardinge Medical College, New Delhi.",
      "A former lecturer at SRMS Medical College and consultant dermatologist.",
      "Numerous publications and invited lectures at both national and international dermatology conferences.",
      "Authored chapters on Anti-Wrinkle Treatment and Fillers in aesthetic dermatology books.",
      "An office bearer of IWDA and PDS; AAD, IADVL, ACSI, and CDSI member.",
      "Renowned across India, key opinion leader for multinational pharmaceutical companies."
    ]
  }
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
  const profile = oldDoctorProfiles[doctor.slug] || { summary: doctor.summary, highlights: doctor.highlights };
  const speciality = doctorSpecialities[doctor.slug] || doctor.title;

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
              <span>{speciality}</span>
              <a href={`tel:${data.settings.phone}`}><Phone size={17} /> {data.settings.phone}</a>
              <a href={`mailto:${data.settings.email}`}><Mail size={17} /> {data.settings.email}</a>
            </div>
          </div>
          <div className="doctor-profile-copy">
            <div className="detail-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/doctors">Doctors</Link></div>
            <span className="eyebrow">{speciality}</span>
            <h1>{doctor.name}</h1>
            <p>{profile.summary}</p>
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
            <p>{profile.summary}</p>
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
              {profile.highlights.map((highlight) => <p key={highlight}><CheckCircle2 size={18} /> {highlight}</p>)}
            </div>
          </article>

          {profile.highlights.length > 0 && (
            <article className="doctor-credentials-panel">
              <span className="eyebrow">Education & associations</span>
              <h2>Profile notes from Twacha</h2>
              <div className="doctor-credentials-grid">
                {profile.highlights.map((item, index) => (
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
