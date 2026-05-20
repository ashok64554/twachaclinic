import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

const teamDepartments = [
  ["Our Specialists", "Dr Tapesh Sharma - Cosmetic & General Dermatology, Dr Richa Sharma - Cosmetic & General Dermatology, Dr Neha Gupta - Cosmetic & General Dermatology."],
  ["Our Senior Aesthetic Advisor", "Dr Laxmi Kaushik with 10 years of experience, specializes in holistic skincare management. She expertly supervises and conducts aesthetic treatments, ensuring personalized care for each patient."],
  ["Our Aesthetic Advisor", "Dr. Anshika Grover brings over 6 years of experience to the clinic. Dr. Anshika is adept at analyzing skin types and designing tailored treatment schedules that yield the best results."],
  ["Our Floor Managers", "Tejaswini, Sushma, Meenu are pivotal in ensuring that patient care is seamless and responsive. They manage the daily operations smoothly and oversee patient follow-ups with great attention to detail."],
  ["Our Therapists", "Pooja, Neha, Mahima, Sangeeta, Aanchal, and Riya, are highly skilled in operating advanced dermatological equipment. They assist in performing laser treatments, PRP, chemical peels, and medifacials, adhering to the highest hygiene and safety standards."],
  ["Our Front Office Staff", "Pooja, Ishika, Uma ensure that every visit to TWACHA is efficient and welcoming. Their attentiveness and efficiency make each patient's experience smooth and hassle-free."],
  ["Our Calling Staff", "Neelu and Rabeka maintain the flow of clients through effective appointment management. Their diligent work keeps our clinic running smoothly and handles patient scheduling professionally."],
  ["Our Pharmacy Team", "Akhilesh, Jitender, Naman are quick and meticulous in managing medicine dispensation, sourcing only the highest quality products directly from trusted suppliers."],
  ["Our Janitors Team", "Surender, Ajay, Sandeep, Sunny are the unsung heroes who maintain impeccable cleanliness throughout the clinic. They ensure that treatment chambers are sanitized before and after each session, contributing significantly to our clinic's reputation for cleanliness."]
];

const doctorListingText: Record<string, { title?: string; summary: string; highlights: string[] }> = {
  "dr-tapesh-sharma": {
    title: "Cosmetic & General Dermatology",
    summary: "Co-founder and Medical Director of TWACHA Skin Clinic, known for face aesthetics, Anti-Wrinkle Treatment, dermal fillers and advanced dermatology.",
    highlights: [
      "Comprehensive skin, hair and aesthetic treatments.",
      "Member of IACD, IADVL, ACSI and CDSI.",
      "Trainer and speaker for dermatologists nationwide."
    ]
  },
  "dr-richa-sharma": {
    title: "Cosmetic & General Dermatology",
    summary: "Co-founder and Medical Director of TWACHA Skin Clinics with deep expertise in hair disorders, aesthetic dermatology and academic-led patient care.",
    highlights: [
      "MBBS and MD Dermatology from Lady Hardinge Medical College.",
      "Former lecturer and consultant dermatologist.",
      "AAD, IADVL, ACSI, CDSI, IWDA and PDS member."
    ]
  },
  "dr-neha-gupta": {
    title: "Consultant Dermatologist",
    summary: "Consultant Dermatologist, Aesthetic Dermatologist and Cosmetologist experienced in lasers, skin surgeries, peels and advanced procedures.",
    highlights: [
      "MBBS, MD and DNB in Dermatology.",
      "Skilled in skin surgeries, lasers, PRP and peels.",
      "Active presenter and author in dermatology."
    ]
  },
  "dr-prachi-gupta": {
    title: "Consultant Dermatologist",
    summary: "Consultant Dermatologist, Aesthetic Physician and Hair Transplant Surgeon with over 12 years of clinical experience in skin, hair and aesthetics.",
    highlights: [
      "M.B.B.S and D.D.V.L qualified.",
      "Expertise in advanced skin and hair treatments.",
      "Experienced hair transplant surgeon."
    ]
  }
};

export default async function DoctorsPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);
  const doctors = data.doctors.filter((doctor) => doctor.active);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="doctors-page">
        <section className="doctors-hero">
          <div>
            <span className="eyebrow">Meet Our Team</span>
            <h1>Our Specialists</h1>
            <p>Meet the expert dermatologists at Twacha Skin Clinic. Our team delivers advanced skincare, personalized treatments and trusted care for healthy, radiant skin.</p>
          </div>
          <img src="/assets/img/IMG_98341.webp" alt="Twacha Skin Clinic team" />
        </section>

        <section className="doctors-specialist-section">
          <div className="section-title">
            <div>
              <span className="eyebrow">Meet Our Team</span>
              <h2>Our Specialists</h2>
            </div>
          </div>
          <div className="doctors-profile-grid">
            {doctors.map((doctor) => (
              <article className="doctors-profile-card" key={doctor.slug}>
                <Link className="doctors-profile-image" href={`/doctors/${doctor.slug}`}>
                  <img src={doctor.image} alt={doctor.name} />
                </Link>
                <div>
                  <span>{doctorListingText[doctor.slug]?.title || doctor.title}</span>
                  <h3><Link href={`/doctors/${doctor.slug}`}>{doctor.name}</Link></h3>
                  <p>{doctorListingText[doctor.slug]?.summary || doctor.summary}</p>
                  <ul>
                    {(doctorListingText[doctor.slug]?.highlights || doctor.highlights).slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <Link className="doctors-profile-link" href={`/doctors/${doctor.slug}`}>
                    View Profile <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="team-depth-section">
          <div className="team-depth-intro">
            <span className="eyebrow">Complete Team</span>
            <h2>Meet Our Team at TWACHA Skin Clinic</h2>
            <p>At TWACHA, our team is a passionate and dedicated group of professionals united by the mission to provide world-class dermatological care. Here's a glimpse of the key members who make it all happen.</p>
          </div>
          <div className="team-department-grid">
            {teamDepartments.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="team-depth-note">Each member of the TWACHA team is crucial to our success. They help us uphold our commitment to delivering excellent dermatologic care in a welcoming environment.</p>
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
