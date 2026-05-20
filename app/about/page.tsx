import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { DoctorCard } from "@/components/DoctorCard";
import { InstagramReels } from "@/components/InstagramReels";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";

const treatmentGroups = [
  {
    title: "Face Treatments",
    icon: "/assets/img/icon/Face-treatment.png",
    links: [
      ["Chemical Peels", "/services/chemical-peels"],
      ["Derma Clean", "/services/derma-clean"],
      ["Melasma", "/services/melasma-condition"],
      ["Hyper Pigmentation", "/services/hyperpigmentation-condition"],
      ["Acne/ Pimple Scars", "/services/acne-pimple-conditions"],
      ["Medifacials", "/services/medifacial"],
      ["Photofacial", "/services/intense-pulsed-light"],
      ["Hydrafacial", "/services/hydrafacial"],
      ["MNRF", "/services/microneedling-radiofrequency"],
      ["Microblading", "/services/microblading"],
      ["Double Chin", "/services/double-chin"],
      ["HIFU", "/services/hifu"]
    ]
  },
  {
    title: "Laser Treatments",
    icon: "/assets/img/icon/Laser-Tretment.png",
    links: [
      ["Laser Hair Removal", "/services/laser-hair-reduction"],
      ["Picosecond Laser", "/services/pico-laser"],
      ["Q-Switched Nd Yag Laser", "/services/q-switched-nd-yag-laser"]
    ]
  },
  {
    title: "Hair Growth",
    icon: "/assets/img/icon/Hair-Growth.png",
    links: [
      ["PRP", "/services/prp"],
      ["QR678", "/services/qr-678"],
      ["Regenerative Skin Therapy", "/services/regenerative-skin-therapy"],
      ["GFC", "/services/gfc"],
      ["Hair Drip", "/services/hair-drip"]
    ]
  },
  {
    title: "Cosmetic Injectables",
    icon: "/assets/img/icon/cosmotice-injectiron.png",
    links: [
      ["Dermal Fillers", "/services/dermal-fillers"],
      ["Anti-Wrinkle Treatment", "/services/anti-wrinkle-treatment"],
      ["Threads", "/services/thread-lift"],
      ["SKIN REJUVENATION TREATMENT", "/services/skin-rejuvenation-treatment"],
      ["Brow Lift", "/services/eyebrow-lift"],
      ["Mesotherapy", "/services/mesotherapy"],
      ["Skin Boosters", "/services/skin-booster-injections"],
      ["Wrinkles", "/services/wrinkle"],
      ["Face Lift", "/services/face-lift"],
      ["Lip Beautification", "/services/lip-beautification"],
      ["Ear Lobe Repair", "/services/ear-lobe-repair"],
      ["Face Slimming", "/services/face-slimming"],
      ["Double Chin", "/services/double-chin"]
    ]
  },
  {
    title: "Body Treatments",
    icon: "/assets/img/icon/body - treatment.png",
    links: [
      ["Body Polish", "/services/body-polish"],
      ["Chemical Peels", "/services/chemical-peels"],
      ["Stretch Marks", "/services/stretch-marks-treatment"],
      ["HIFU", "/services/hifu"]
    ]
  },
  {
    title: "IV Nutrition",
    icon: "/assets/img/icon/iv-neutration.png",
    links: [["IV Nutrition", "/services/iv-nutrition"]]
  }
];

const conditionTiles = [
  ["Acne/Pimples", "/services/acne-pimple-conditions", "/assets/img/icon/Acne.png"],
  ["Hyper Pigmentation", "/services/hyperpigmentation-condition", "/assets/img/icon/Hyperpigmentation.png"],
  ["Melasma", "/services/melasma-condition", "/assets/img/icon/Melasma.png"],
  ["Wrinkles", "/services/wrinkle", "/assets/img/icon/Wrinkles.png"],
  ["Ageing", "/services/aging", "/assets/img/icon/agening.png"],
  ["Aesthetic/ Beauty Enhancement", "/services/aesthetic-and-beauty-enhancement", "/assets/img/icon/beauty-enhancement.png"],
  ["Dermatological", "/services/dermatologic-conditions", "/assets/img/icon/Dermatological.png"],
  ["Hair Fall/Loss", "/services/hairfall", "/assets/img/icon/Hairfall.png"],
  ["Excessive Hair Growth", "/services/excessive-hair-growth", "/assets/img/icon/Hair-Growth.png"]
];

const values = [
  ["Service", "We are dedicated to serving our patients, guiding them to optimal skin health with every treatment and consultation."],
  ["Quality", "We maintain the highest standards in dermatology, consistently pursuing excellence in all aspects of patient care."],
  ["Innovation", "Our commitment to innovation drives us to discover and implement advanced, effective skin treatments."],
  ["Teamwork", "Our team collaborates closely, ensuring that each member contributes to delivering the best possible care."],
  ["Compassion", "We treat every patient with kindness and empathy, recognizing the importance of supportive, personalized care."]
];

export default async function AboutPage() {
  const data = await getSiteData();
  const services = data.services.filter((service) => service.active);
  const doctors = data.doctors.filter((doctor) => doctor.active);
  const instagramReels = (data.videos || [])
    .filter((video) => video.platform === "instagram")
    .slice(0, 6);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="about-page">
        <section className="about-hero-new">
          <div>
            <span className="eyebrow">About Us</span>
            <h1>Twacha Skin Clinic: Excellence in Dermatology Since 2007</h1>
            <p>Established by Dr. Tapesh Sharma and Dr. Richa Sharma, Twacha Skin Clinic is a premier centre of excellence in dermatology and aesthetics.</p>
          </div>
          <img src="/assets/img/IMG_9834.webp" alt="Twacha Skin Clinic team" />
        </section>

        <section className="about-story-section">
          <a className="about-video-card" href="https://www.youtube.com/watch?v=dP13ZyaQZf8" target="_blank" rel="noreferrer">
            <img src="/assets/img/banner/about-img.webp" alt="Twacha Skin Clinic consultation area" />
            <span><PlayCircle size={24} /> Watch clinic video</span>
          </a>
          <div className="about-story-copy">
            <span className="eyebrow">About Twacha Skin Clinic</span>
            <h2>Advanced dermatology care in Dwarka, New Delhi</h2>
            <p>Established by Dr. Tapesh Sharma and Dr. Richa Sharma, Twacha Skin Clinic is a premier centre of excellence in dermatology and aesthetics. Nestled in the upscale suburb of Dwarka, New Delhi, our clinic spans 3000 sq. ft., offering specialized consultation chambers, a photography room for progress tracking, and a pharmacy for trusted skincare products designed to enhance your care experience.</p>
            <p>Our facility features advanced treatment areas where we perform various procedures from LASERS and MediFacials to PRP and RadioFrequency Surgery. <b>Consistently ranked among the top three Dermatology Clinics in Delhi NCR by the Times Health Survey,</b> Twacha is dedicated to providing innovative and effective skincare solutions, guided by our deep commitment to our clients' health and beauty.</p>
          </div>
        </section>

        <section className="about-mission-vision">
          <article>
            <img src="/assets/img/about/Mission.webp" alt="Mission at Twacha Skin Clinic" />
            <div>
              <span className="eyebrow">Mission</span>
              <h2>Mission</h2>
              <p>We are committed to providing top-tier dermatology care with a blend of integrity and mastery. At Twacha Skin Clinic, we prioritize delivering comprehensive, high-quality treatments with a personal touch, ensuring every patient feels valued and cared for. Our team combines expertise with empathy, striving for excellence in every consultation and procedure.</p>
            </div>
          </article>
          <article>
            <img src="/assets/img/about/Vision.webp" alt="Vision at Twacha Skin Clinic" />
            <div>
              <span className="eyebrow">Vision</span>
              <h2>Vision</h2>
              <p>We aim to set the standard in Clinical and Aesthetic Dermatology as pioneers of cutting-edge, high-quality services. Twacha aims to be recognized as a clinic and as a centre of excellence where every treatment advances the field and enhances patient wellbeing. We aspire to lead with innovation, shaping the future of skincare with every breakthrough and success.</p>
            </div>
          </article>
        </section>

        <section className="about-values-section">
          <div className="section-title">
            <div>
              <span className="eyebrow">Our Values</span>
              <h2>What shapes every consultation</h2>
            </div>
          </div>
          <div className="about-values-list">
            {values.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section service-discovery about-service-discovery" id="service-sec">
          <div className="service-discovery-title">
            <span className="eyebrow">Treatments & Conditions</span>
            <h2>Discover Our Services</h2>
          </div>
          <div className="service-discovery-grid">
            <div className="service-discovery-panel treatment-panel">
              <h3>Our <span>Treatments</span></h3>
              <div className="treatment-accordion">
                {treatmentGroups.map((group, index) => (
                  <details key={group.title} name="about-treatment-groups" open={index === 0}>
                    <summary>
                      <span><img src={group.icon} alt="" /> {group.title}</span>
                      <ArrowRight size={20} />
                    </summary>
                    <div className="treatment-link-grid">
                      {group.links.map(([label, href]) => (
                        <Link key={`${group.title}-${label}`} href={href}>{label}</Link>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
            <div className="service-discovery-panel condition-panel">
              <h3><span>Conditions</span> We Treat</h3>
              <div className="condition-tile-grid">
                {conditionTiles.map(([label, href, icon]) => (
                  <Link href={href} key={label}>
                    <img src={icon} alt="" />
                    <strong>{label}</strong>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-specialists-section">
          <div className="section-title">
            <div>
              <span className="eyebrow">Meet Our Team</span>
              <h2>Our Specialists</h2>
            </div>
            <Link href="/doctors">View all doctors</Link>
          </div>
          <div className="doctor-grid">
            {doctors.map((doctor) => <DoctorCard key={doctor.slug} doctor={doctor} />)}
          </div>
        </section>

        <section className="about-instagram-section">
          <div>
            <span className="eyebrow">#instagram</span>
            <h2>@twachaclinics</h2>
            <p>Follow clinic updates, dermatology education and treatment moments from Twacha Skin Clinic.</p>
          </div>
          <InstagramReels reels={instagramReels} />
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
