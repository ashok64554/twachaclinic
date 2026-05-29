import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, CalendarDays, CheckCircle2, Quote, ShieldCheck, Sparkles, Youtube } from "lucide-react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { DoctorCard } from "@/components/DoctorCard";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { ServiceCard } from "@/components/ServiceCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VideoTestimonialModal } from "@/components/VideoTestimonialModal";
import { getSiteData } from "@/lib/data";
import { getGalleryImages } from "@/lib/gallery";
import { canonicalTreatmentHref } from "@/lib/routes";
import { clinicJsonLd } from "@/lib/seo";

function displayServiceName(title: string) {
  return title
    .replace(/\s+\|\s*.*$/g, "")
    .replace(/^(Best|Expert)\s+/i, "")
    .replace(/\s+Skin Treatment Clinic in Delhi$/i, "")
    .replace(/\s+Treatment Clinic in Delhi$/i, " Treatment")
    .replace(/\s+Specialist Clinic in Delhi$/i, "")
    .replace(/\s+Clinic in Delhi$/i, "")
    .replace(/\s+For Skin in Delhi$/i, "")
    .replace(/\s+for Skin in Delhi$/i, "")
    .replace(/\s+in Delhi(?:,\s*India)?$/i, "")
    .replace(/\s+Treatment Treatment$/i, " Treatment")
    .trim();
}

export default async function Home() {
  const data = await getSiteData();
  const services = data.services.filter((item) => item.active);
  const doctors = data.doctors.filter((item) => item.active);
  const featuredServices = [
    "chemical-peels",
    "laser-hair-reduction",
    "hydrafacial",
    "prp",
    "dermal-fillers",
    "skin-rejuvenation-treatment"
  ].map((slug) => services.find((service) => service.slug === slug)).filter(Boolean);
  const treatmentGroups = [
    {
      title: "Face Treatments",
      icon: "/assets/img/icon/Face-treatment.png",
      links: [
        ["Chemical Peels", "/treatments/face/chemical-peels"],
        ["Derma Clean", "/treatments/face/derma-clean"],
        ["Melasma", "/treatments/face/melasma"],
        ["Hyper Pigmentation", "/treatments/face/hyper-pigmentation"],
        ["Acne/ Pimple Scars", "/treatments/face/acne-pimple-scars"],
        ["Medifacials", "/treatments/face/medifacials"],
        ["Photofacial", "/treatments/face/photofacial"],
        ["Hydrafacial", "/treatments/face/hydrafacial"],
        ["MNRF", "/treatments/face/mnrf"],
        ["Microblading", "/treatments/face/microblading"],
        ["Double Chin", "/treatments/face/double-chin"],
        ["HIFU", "/treatments/face/hifu"]
      ]
    },
    {
      title: "Laser Treatments",
      icon: "/assets/img/icon/Laser-Tretment.png",
      links: [
        ["Laser Hair Removal", "/treatments/laser/laser-hair-removal"],
        ["Picosecond Laser", "/treatments/laser/pico-laser"],
        ["Q-Switched Nd Yag Laser", "/treatments/laser/q-switched-nd-yag"]
      ]
    },
    {
      title: "Hair Growth",
      icon: "/assets/img/icon/Hair-Growth.png",
      links: [
        ["PRP", "/treatments/hair/prp"],
        ["QR678", "/treatments/hair/qr678"],
        ["Regenerative Skin Therapy", "/treatments/hair/regenerative-skin-therapy"],
        ["GFC", "/treatments/hair/gfc"],
        ["Hair Drip", "/treatments/hair/hair-drip"]
      ]
    },
    {
      title: "Cosmetic Injectables",
      icon: "/assets/img/icon/cosmotice-injectiron.png",
      links: [
        ["Dermal Fillers", "/treatments/injectables/dermal-fillers"],
        ["Anti-Wrinkle Treatment", "/treatments/injectables/anti-wrinkle"],
        ["Threads", "/treatments/injectables/threads"],
        ["SKIN REJUVENATION TREATMENT", "/treatments/injectables/skin-rejuvenation-treatment"],
        ["Brow Lift", "/treatments/injectables/brow-lift"],
        ["Mesotherapy", "/treatments/injectables/mesotherapy"],
        ["Skin Boosters", "/treatments/injectables/skin-boosters"],
        ["Wrinkles", "/treatments/injectables/wrinkles"],
        ["Face Lift", "/treatments/injectables/face-lift"],
        ["Lip Beautification", "/treatments/injectables/lip-beautification"],
        ["Ear Lobe Repair", "/treatments/injectables/ear-lobe-repair"],
        ["Face Slimming", "/treatments/injectables/face-slimming"],
        ["Double Chin", "/treatments/injectables/double-chin"]
      ]
    },
    {
      title: "Body Treatments",
      icon: "/assets/img/icon/body - treatment.png",
      links: [
        ["Body Polish", "/treatments/body/body-polish"],
        ["Chemical Peels", "/treatments/body/chemical-peels-for-body"],
        ["Stretch Marks", "/treatments/body/stretch-marks"],
        ["HIFU", "/treatments/body/hifu"]
      ]
    },
    {
      title: "IV Nutrition",
      icon: "/assets/img/icon/iv-neutration.png",
      links: [["IV Nutrition", "/treatments/body/iv-nutrition"]]
    }
  ];
  const conditionTiles = [
    ["Acne/Pimples", "/conditions/acne", "/assets/img/icon/Acne.png"],
    ["Hyper Pigmentation", "/conditions/hyperpigmentation", "/assets/img/icon/Hyperpigmentation.png"],
    ["Melasma", "/conditions/melasma", "/assets/img/icon/Melasma.png"],
    ["Wrinkles", "/conditions/wrinkles", "/assets/img/icon/Wrinkles.png"],
    ["Ageing", "/conditions/ageing", "/assets/img/icon/agening.png"],
    ["Aesthetic/ Beauty Enhancement", "/conditions/aesthetic-enhancement", "/assets/img/icon/beauty-enhancement.png"],
    ["Dermatological", "/conditions/dermatological", "/assets/img/icon/Dermatological.png"],
    ["Hair Fall/Loss", "/conditions/hairfall", "/assets/img/icon/Hairfall.png"],
    ["Excessive Hair Growth", "/conditions/excessive-hair-growth", "/assets/img/icon/Hair-Growth.png"]
  ];
  const technologyService = services.find((service) => service.slug === "3d-skin-analyzer");
  const popularServices = [
    "anti-wrinkle-treatment",
    "pico-laser",
    "q-switched-nd-yag-laser",
    "microneedling-radiofrequency",
    "skin-booster-injections",
    "iv-nutrition",
    "hifu",
    "thread-lift"
  ].map((slug) => services.find((service) => service.slug === slug)).filter(Boolean);
  const galleryItems = getGalleryImages(data).slice(0, 8);
  const whyChooseItems = [
    [
      "Dedicated Expertise",
      "Meet our founders, Dr. Tapesh Sharma and Dr. Richa Sharma. With their deep expertise in dermatology and aesthetics, they've shaped Twacha into a haven of top-tier care and innovation. Every treatment reflects their commitment to excellence."
    ],
    [
      "State-of-the-Art Facilities",
      "Step into our clinic and experience the cutting-edge. From advanced LASER technology to the latest aesthetic equipment, our facilities are designed to cater to all your skincare needs with precision and safety."
    ],
    [
      "A Spectrum of Services",
      "Whether you need rejuvenating facials, laser treatments, or custom skincare solutions, our comprehensive services cover everything your skin needs to look and feel its best."
    ],
    [
      "Trusted Excellence",
      "At Twacha, we don't just treat skin; we celebrate it. Our track record of proven results speaks for itself. Twacha has been ranked in the Times Health Survey Ranking among the TOP 5 Skin and Hair Clinics in Delhi NCR between 2018-2024 - 6 times in a row."
    ]
  ];
  const apartItems = [
    [
      "/assets/img/Knowledge.png",
      "In-depth Expertise",
      "Get expert skincare advice and treatments from leading dermatologists. We offer insights and solutions that bring out the best in your skin, leaving it healthy and radiant."
    ],
    [
      "/assets/img/Compassion.png",
      "Personal Touch",
      "Every skin is unique, and so is our care. We provide empathetic, personalized skincare tailored to meet your individual needs, ensuring you feel supported every step of the way."
    ],
    [
      "/assets/img/Innovation.png",
      "Innovative Techniques",
      "Experience the future of skincare with our cutting-edge techniques and state-of-the-art technology. We're committed to providing advanced care that enhances and rejuvenates your skin to its fullest potential."
    ]
  ];
  const homeStats = [
    ["/assets/img/icon/Happy Patients.png", "80000", "Happy Patients"],
    ["/assets/img/icon/Services.png", "50", "Our Services"],
    ["/assets/img/icon/Teams.png", "20", "Team Members"],
    ["/assets/img/icon/Experience.png", "17", "Years of Experience"]
  ];
  const testimonials = data.testimonials.filter((item) => item.active).slice(0, 3);
  const videoTestimonials = [
    {
      title: "Happy Patient, Hair Thinning",
      image: "/assets/img/about/testimonial-1.webp",
      url: "https://www.youtube.com/watch?v=wWxYgwk9L-8"
    },
    {
      title: "Twacha patient experience",
      image: "/assets/img/about/testimonial-2.webp",
      url: "https://www.youtube.com/watch?v=DpvdaA-Maxc"
    },
    {
      title: "Skin treatment testimonial",
      image: "/assets/img/about/testimonial-3.webp",
      url: "https://www.youtube.com/watch?v=zpSaJ67X30U"
    },
    {
      title: "Clinic care experience",
      image: "/assets/img/about/testimonial-4.webp",
      url: "https://www.youtube.com/watch?v=4gmcgSSipDw"
    },
    {
      title: "Patient transformation story",
      image: "/assets/img/about/testimonial-6.webp",
      url: "https://www.youtube.com/watch?v=Qpk-6zVW-2Q"
    },
    {
      title: "Aesthetic care testimonial",
      image: "/assets/img/about/testimonial-5.webp",
      url: "https://www.youtube.com/watch?v=VnDQbtDGhU8"
    }
  ];

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main>
        <section className="hero hero-classic">
          <div className="hero-copy">
            <h1>Innovative Treatments,<br /> Beautiful Results</h1>
            <p>Experience the Twacha Difference.</p>
            <div className="hero-actions">
              <Link className="classic-hero-btn" href="/book-appointment">
                <span>Make An Appointment</span>
                <ArrowRight size={28} />
              </Link>
            </div>
          </div>
          <div className="hero-media">
            <div className="hero-image-frame">
              <Image
                src="/assets/img/banner/Banner-2.webp"
                alt="Beautiful skin results at Twacha Skin Clinic"
                width={900}
                height={900}
                sizes="(max-width: 900px) 100vw, 48vw"
                priority
              />
            </div>
          </div>
        </section>

        <section className="home-counter-strip" aria-label="Twacha clinic highlights">
          {homeStats.map(([icon, value, label]) => (
            <article key={label}>
              <span><img src={icon} alt="" /></span>
              <strong>{value}</strong>
              <p>{label}</p>
            </article>
          ))}
        </section>

        <section className="trust-row">
          {[
            {
              title: "Expert Dermatologists",
              text: "Consultations and procedure planning by qualified doctors.",
              icon: <ShieldCheck size={25} />
            },
            {
              title: "Modern Technology",
              text: "Lasers, skin analysis and advanced aesthetic procedures.",
              icon: <Sparkles size={25} />
            },
            {
              title: "Patient-first Care",
              text: "Clear counselling, hygiene, aftercare and follow-up support.",
              icon: <CheckCircle2 size={25} />
            }
          ].map((item) => (
            <article key={item.title}>
              <span className="trust-icon">{item.icon}</span>
              <b>{item.title}</b>
              <span>{item.text}</span>
            </article>
          ))}
        </section>

        <section className="split-section">
          <div>
            <span className="eyebrow">About Twacha</span>
            <h2>{data.settings.aboutTitle}</h2>
            <p>{data.settings.aboutText}</p>
            <div className="feature-list">
              <p><ShieldCheck size={18} /> Consultation-first skin and hair treatment planning.</p>
              <p><Sparkles size={18} /> Lasers, MediFacials, PRP, peels and aesthetic dermatology.</p>
              <p><Award size={18} /> Recognised among leading skin and hair clinics in Delhi NCR.</p>
            </div>
          </div>
          <a
            className="about-youtube-link"
            href="https://youtube.com/@twachaclinics?si=HCBpdIv35sIrPq8q"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Twacha Clinic YouTube channel"
          >
            <Image
              src="/assets/img/banner/about-img.webp"
              alt="Twacha consultation room"
              width={820}
              height={620}
              sizes="(max-width: 900px) 100vw, 45vw"
            />
            <span><Youtube size={18} /> Twacha Clinic YouTube</span>
          </a>
        </section>

        <section className="section service-discovery" id="service-sec">
          <div className="service-discovery-title">
            <span className="eyebrow">Treatments & Conditions</span>
            <h2>Discover Our Services</h2>
          </div>
          <div className="service-discovery-grid">
            <div className="service-discovery-panel treatment-panel">
              <h3>Our <span>Treatments</span></h3>
              <div className="treatment-accordion">
                {treatmentGroups.map((group, index) => (
                  <details key={group.title} name="home-treatment-groups" open={index === 0}>
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

        <section className="section home-story-band">
          <div className="why-clinic-layout">
            <div className="why-clinic-media">
              <Image
                src="/assets/img/about/Why-choose-us.webp"
                alt="Why choose Twacha Skin Clinic"
                width={760}
                height={640}
                sizes="(max-width: 900px) 100vw, 42vw"
              />
            </div>
            <div className="why-clinic-copy">
              <span className="eyebrow">Twacha Skin Clinic</span>
              <h2>Why Choose Twacha Skin Clinic?</h2>
              <div className="why-clinic-list">
                {whyChooseItems.map(([title, text]) => (
                  <article key={title}>
                    <CheckCircle2 size={22} />
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="apart-panel">
            <div className="apart-heading">
              <span className="eyebrow">Discover What Sets Us Apart</span>
              <h2>Care designed around expertise, empathy and technology</h2>
            </div>
            <div className="apart-grid">
              {apartItems.map(([icon, title, text]) => (
              <article key={title}>
                  <img src={icon} alt="" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
            </div>
          </div>
        </section>

        <section className="section featured-services">
          <div className="section-title">
            <div>
              <span className="eyebrow">Treatments</span>
              <h2>Signature treatments</h2>
              <p className="section-lead">Focused skin, laser, hair and aesthetic procedures selected from the services patients ask for most at Twacha.</p>
            </div>
            <Link href="/treatments">View all</Link>
          </div>
          <div className="service-grid">
            {featuredServices.map((service) => service && <ServiceCard key={service.slug} service={service} />)}
          </div>
        </section>

        {technologyService && (
          <section className="technology-band">
            <div className="technology-copy">
              <span className="eyebrow">Technology</span>
              <h2>{technologyService.title}</h2>
              <p>{technologyService.excerpt}</p>
              <div className="technology-points">
                <span>3D skin imaging</span>
                <span>AI-assisted analysis</span>
                <span>Personalised treatment planning</span>
              </div>
              <Link className="primary-btn" href={canonicalTreatmentHref(technologyService)}>
                Learn about skin analysis <ArrowRight size={18} />
              </Link>
            </div>
            <div className="technology-visual">
              <Image
                src="/assets/img/ISEMECO-3D-D9-Skin.webp"
                alt={technologyService.title}
                width={820}
                height={620}
                sizes="(max-width: 900px) 100vw, 45vw"
              />
              <div className="technology-metric top">
                <strong>3D</strong>
                <span>facial skin mapping</span>
              </div>
              <div className="technology-metric bottom">
                <strong>AI</strong>
                <span>guided insights</span>
              </div>
            </div>
          </section>
        )}

        <section className="section popular-treatment-section">
          <div className="section-title">
            <div>
              <span className="eyebrow">Popular procedures</span>
              <h2>More treatments patients ask about</h2>
              <p className="section-lead">Quick access to high-interest procedures patients commonly compare before booking a consultation.</p>
            </div>
            <Link href="/treatments">Full library</Link>
          </div>
          <div className="popular-treatment-grid">
            {popularServices.map((service, index) => service && (
              <Link href={canonicalTreatmentHref(service)} key={service.slug}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <b>{displayServiceName(service.title)}</b>
                <span>{service.category}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section home-gallery-section" id="gallery">
          <div className="section-title">
            <div>
              <span className="eyebrow">Our Gallery</span>
              <h2>Explore Us</h2>
            </div>
            <Link href="/gallery">Know more</Link>
          </div>
          <GalleryLightbox items={galleryItems} />
        </section>

        <section className="section doctors-band">
          <div className="section-title">
            <span className="eyebrow">Meet Our Team</span>
            <h2>Our Experts</h2>
            <Link href="/doctors">View doctors</Link>
          </div>
          <div className="doctor-grid">{doctors.map((doctor) => <DoctorCard key={doctor.slug} doctor={doctor} />)}</div>
        </section>

        <section className="home-cta-strip">
          <div>
            <span className="eyebrow">Next step</span>
            <h2>Not sure which treatment is right?</h2>
            <p>Share your concern with the clinic team. They will help you choose the right consultation path for skin, hair, laser or aesthetic care.</p>
          </div>
          <Link className="primary-btn" href="/book-appointment"><CalendarDays size={20} /> Request appointment</Link>
        </section>

        <section className="section happy-faces-section">
          <div className="happy-faces-heading">
            <div>
              <span className="eyebrow">Patient reviews</span>
              <h2>Our Happy Faces</h2>
              <p>Short video testimonials from patients sharing their Twacha treatment experience.</p>
            </div>
            <Link href="/videos">View all videos <ArrowRight size={18} /></Link>
          </div>
          <VideoTestimonialModal videos={videoTestimonials} />
        </section>

        {testimonials.length > 0 && (
          <section className="section testimonial-band">
            <div className="section-title">
              <div>
                <span className="eyebrow">Patient voices</span>
                <h2>What patients appreciate</h2>
              </div>
            </div>
            <div className="testimonial-grid">
              {testimonials.map((item) => (
                <article key={item.id}>
                  <Quote size={28} />
                  <p>{item.note}</p>
                  <div>
                    <b>{item.name}</b>
                    <span>{item.rating}/5 rating</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section id="appointment" className="appointment-band">
          <div>
            <span className="eyebrow">Book a visit</span>
            <h2>Tell us your skin or hair concern</h2>
            <p>The clinic team will use this information to help schedule the right consultation. This form does not provide emergency medical advice.</p>
          </div>
          <AppointmentForm services={services.map((service) => ({ title: service.title, category: service.category }))} doctors={doctors.map((doctor) => doctor.name)} />
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd(data.settings)) }} />
    </>
  );
}
