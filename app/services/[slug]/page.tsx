import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { CalendarCheck, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { OldServiceRuntime } from "@/components/OldServiceRuntime";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VideoEmbed } from "@/components/VideoEmbed";
import { getSiteData } from "@/lib/data";
import { serviceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

const chemicalPeelFaqQuestions = [
  "What are Chemical Peels?",
  "How do Chemical Peels benefit the skin?",
  "Are Chemical Peels safe?",
  "How long does a Chemical Peel session take?",
  "How many sessions will I need?",
  "Are there any side effects?",
  "When will I see the results?",
  "Can anyone undergo Chemical Peels?"
];

const chemicalPeelTestimonialNames = ["Rhea S.", "Karan T.", "Meera P.", "Anjali R."];

function cleanDisplayText(text: string) {
  return text
    .replace(/â€œ|â€|â€�/g, "\"")
    .replace(/â€™/g, "'")
    .replace(/â€“/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function isFaqHeading(heading: string) {
  const normalized = heading.toLowerCase();
  return normalized.includes("frequently asked") || normalized.includes("faq");
}

function isTestimonialHeading(heading: string) {
  const normalized = heading.toLowerCase();
  return normalized.includes("testimonial") || normalized.includes("happy clients");
}

function isContactHeading(heading: string) {
  const normalized = heading.toLowerCase();
  return normalized.includes("contact")
    || normalized.includes("book your appointment")
    || normalized.includes("ready to")
    || normalized.includes("schedule");
}

function isResultImage(image = "", heading = "") {
  return /result|gallery|before|after|ba-|ba_|-ba|treatment|acne|thumbnail/i.test(`${image} ${heading}`);
}

function isIconLikeImage(image = "", heading = "") {
  if (!image) return false;
  const normalized = image.toLowerCase();
  if (normalized.includes("/icon/")) return true;
  if (/\.(webp|jpe?g)$/i.test(image)) return false;
  return !isResultImage(image, heading)
    && !/glycolic|lactic|mandelic|salicylic|dermaclean\.webp|hydrafacial|chemical-peels-treatment/i.test(image);
}

function fallbackFaqQuestion(serviceTitle: string, answer: string, index: number) {
  const questionMatch = answer.match(/([^.!]+?\?)/);
  if (questionMatch?.[1] && questionMatch[1].length < 120) {
    return cleanDisplayText(questionMatch[1]);
  }

  const questions = [
    `What should I know about ${serviceTitle}?`,
    `How can ${serviceTitle} help my concern?`,
    `Is ${serviceTitle} suitable for everyone?`,
    `How many sessions may be needed?`,
    `What happens after the treatment?`,
    `When should I book a consultation?`
  ];

  return questions[index] || `${serviceTitle} question ${String(index + 1).padStart(2, "0")}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSiteData();
  const service = data.services.find((item) => item.slug === slug);
  const title = service?.metaTitle || service?.title || "Service | Twacha Skin Clinic";
  const description = service?.metaDescription || service?.excerpt || "Dermatologist-led skin, hair, laser and aesthetic care at Twacha Skin Clinic.";
  return {
    title,
    description,
    alternates: {
      canonical: `/services/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `/services/${slug}`,
      type: "article",
      images: service?.image ? [{ url: service.image, alt: service.title }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: service?.image ? [service.image] : undefined
    }
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const data = await getSiteData();
  const services = data.services.filter((item) => item.active);
  const doctors = data.doctors.filter((item) => item.active);
  const service = services.find((item) => item.slug === slug);
  const serviceVideos = service?.videos?.filter((video) => video.platform === "youtube") || [];
  const featuredVideo = serviceVideos[0];
  const remainingVideos = serviceVideos.slice(1);
  const introSection = service?.sections?.find((section) => section.heading.toLowerCase().startsWith("what")) || service?.sections?.[0];
  const contentSections = service?.sections?.filter((section) => (
    section.body.length && section.body.join(" ").trim() !== service.content.trim()
  )) || [];
  const faqSections = contentSections.filter((section) => isFaqHeading(section.heading));
  const faqSection = [...faqSections].sort((a, b) => {
    const score = (section: typeof a) => section.body.filter((item) => item.includes("?")).length;
    return score(b) - score(a);
  })[0];
  const testimonialSection = contentSections.find((section) => isTestimonialHeading(section.heading));
  const contactSection = contentSections.find((section) => isContactHeading(section.heading));
  const articleSections = contentSections.filter((section) => {
    return !isFaqHeading(section.heading)
      && !isTestimonialHeading(section.heading)
      && !isContactHeading(section.heading);
  });
  const focusSections = contentSections.filter((section) => {
    const heading = section.heading.toLowerCase();
    return !heading.includes("frequently asked")
      && !heading.includes("testimonial")
      && !heading.includes("contact information")
      && !heading.includes("faqs");
  });
  const serviceTypeSections = articleSections.filter((section) => section.image && !isIconLikeImage(section.image, section.heading) && !isResultImage(section.image, section.heading));
  const iconCardSections = articleSections.filter((section) => section.image && isIconLikeImage(section.image, section.heading));
  const textArticleSections = articleSections.filter((section) => !section.image);
  const isChemicalPeel = slug === "chemical-peels";
  const chemicalPeelTypes = isChemicalPeel ? [
    {
      title: "Superficial Peels",
      text: "Ideal for mild skin concerns and first-time patients, these peels gently exfoliate the outermost layer of skin to enhance texture and tone with minimal downtime.",
      image: "/assets/img/service/chemical-peels/Superficial.webp"
    },
    {
      title: "Medium Peels",
      text: "These penetrate deeper layers of the skin to correct moderate imperfections like deeper wrinkles and acne scars.",
      image: "/assets/img/service/chemical-peels/Medium.webp"
    },
    {
      title: "Deep Peels",
      text: "Offering dramatic results for severe skin issues, these peels reach the deepest layers of the skin to perform intensive rejuvenation.",
      image: "/assets/img/service/chemical-peels/Deep-Peels.webp"
    }
  ] : [];
  const chemicalResults = isChemicalPeel ? [
    "/assets/img/service/chemical-peels/chemical-peels-treatment.webp",
    "/assets/img/service/chemical-peels/chemical-peels-treatment-2.webp",
    "/assets/img/service/chemical-peels/CHEMICAL-PEELS-ba-1.webp",
    "/assets/img/service/chemical-peels/CHEMICAL-PEELS-ba-2.webp"
  ] : [];
  const dynamicFocusSource = serviceTypeSections.length > 0 ? serviceTypeSections : focusSections.filter((section) => !section.image || !isIconLikeImage(section.image, section.heading)).slice(0, 3);
  const serviceFocusCards = (chemicalPeelTypes.length > 0 ? chemicalPeelTypes : dynamicFocusSource.slice(0, 4).map((section) => ({
    title: section.heading,
    text: section.body[0],
    image: section.image && !isIconLikeImage(section.image, section.heading) ? section.image : ""
  }))).filter((card) => card.title && card.text);
  const focusImages = new Set(serviceFocusCards.map((card) => card.image).filter(Boolean));
  const serviceVisualSections = serviceTypeSections.filter((section) => section.image && !focusImages.has(section.image));
  const faqItems = faqSection?.body.map((answer, index) => ({
    question: isChemicalPeel
      ? (chemicalPeelFaqQuestions[index] || fallbackFaqQuestion(service?.title || "this treatment", answer, index))
      : fallbackFaqQuestion(service?.title || "this treatment", answer, index),
    answer: cleanDisplayText(answer)
  })).map((item) => ({
    ...item,
    answer: item.answer.startsWith(item.question) ? item.answer.slice(item.question.length).trim() : item.answer
  })).filter((item) => item.answer) || [];
  const testimonialItems = testimonialSection?.body.map((quote, index) => {
    const cleanQuote = cleanDisplayText(quote).replace(/^"|"$/g, "");
    const [text, name] = cleanQuote.split(/\s+-\s+(.+)$/);
    return {
      quote: text || cleanQuote,
      name: name || (isChemicalPeel ? (chemicalPeelTestimonialNames[index] || "Twacha Patient") : "Twacha Patient")
    };
  }).filter((item) => item.quote) || [];
  const serviceGalleryImages = Array.from(new Set(
    (service?.sections || [])
      .filter((section) => section.image && isResultImage(section.image, section.heading))
      .map((section) => section.image as string)
  ));

  if (!service) {
    return (
      <>
        <SiteHeader settings={data.settings} />
        <main className="page-shell"><h1>Service not found</h1></main>
      </>
    );
  }

  if (service.detailHtml) {
    return (
      <>
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/assets/css/slick.min.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.min.css" />
        <link rel="stylesheet" href="/assets/css/style13.css" />
        <SiteHeader settings={data.settings} />
        <main className="old-service-detail" dangerouslySetInnerHTML={{ __html: service.detailHtml }} />
        <OldServiceRuntime />
        <SiteFooter settings={data.settings} services={services} />
        <Script src="/assets/js/vendor/jquery-3.6.0.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/slick.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/bootstrap.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(service, data.settings)) }} />
      </>
    );
  }

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="detail-page service-detail-page">
        <section className="detail-hero service-detail-hero">
          <div>
            <div className="detail-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/services">Services</Link></div>
            <span className="eyebrow">{service.category}</span>
            <h1>{service.title}</h1>
            <p>{service.excerpt}</p>
            <div className="service-hero-actions">
              <Link className="primary-btn" href="/book-appointment">Book consultation</Link>
              <a className="secondary-btn" href={`tel:${data.settings.phone}`}>Call clinic</a>
            </div>
            <div className="service-hero-points">
              <span><ShieldCheck size={17} /> Dermatologist-led</span>
              <span><CalendarCheck size={17} /> 30-60 min sessions</span>
              <span><Sparkles size={17} /> Personalised plans</span>
            </div>
          </div>
          <div className="service-hero-image">
            <img src={service.image} alt={service.title} />
            <div className="service-hero-card">
              <b>{service.category}</b>
              <span>Planned around diagnosis, safety and visible improvement</span>
            </div>
          </div>
        </section>
        {featuredVideo?.embedUrl && (
          <section className="service-video-intro">
            <div className="service-feature-video">
              <iframe
                src={`${featuredVideo.embedUrl}&autoplay=1&mute=1`}
                title={featuredVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="service-video-copy">
              <span className="eyebrow">Treatment video</span>
              <h2>{introSection?.heading || `About ${service.title}`}</h2>
              <p>{introSection?.body[0] || service.content}</p>
              <div className="service-video-actions">
                <Link className="primary-btn" href="/book-appointment">Book consultation</Link>
                <a className="secondary-btn" href={featuredVideo.url} target="_blank" rel="noreferrer">Open on YouTube</a>
              </div>
            </div>
          </section>
        )}
        {serviceFocusCards.length > 0 && (
          <section className="service-type-showcase">
            <div className="section-title">
              <div>
                <span className="eyebrow">{isChemicalPeel ? "Chemical peel services" : "Treatment focus"}</span>
                <h2>{isChemicalPeel ? "Choose the right peel depth for your skin" : "How this service is planned at Twacha"}</h2>
              </div>
            </div>
            <div className="service-type-grid">
              {serviceFocusCards.map((type) => (
                <article key={type.title} className={type.image ? "" : "text-only"}>
                  {type.image && <img src={type.image} alt={type.title} />}
                  <div>
                    <h3>{type.title}</h3>
                    <p>{type.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        <section className="service-benefit-showcase">
          <div className="section-title">
            <div>
              <span className="eyebrow">Treatment benefits</span>
              <h2>Why patients choose this treatment</h2>
            </div>
          </div>
          <div className="service-benefit-layout">
            <div className="service-benefit-list">
              {service.benefits.slice(0, 2).map((benefit) => (
                <p key={benefit}><CheckCircle2 size={18} /> {benefit}</p>
              ))}
            </div>
            <img src={isChemicalPeel ? "/assets/img/service/chemical-peels/benefits-chemical.webp" : service.image} alt={`${service.title} benefits`} />
            <div className="service-benefit-list">
              {service.benefits.slice(2, 5).map((benefit) => (
                <p key={benefit}><CheckCircle2 size={18} /> {benefit}</p>
              ))}
            </div>
          </div>
        </section>
        <section className="content-grid">
          <article className="service-article">
            <h2>About this treatment</h2>
            <p>{service.content}</p>
            {textArticleSections.length > 0 && (
              <div className="service-detail-sections">
                {textArticleSections.map((section, index) => (
                  <section key={section.heading} className="service-text-block">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h2>{section.heading}</h2>
                    {section.body.map((text) => <p key={text}>{cleanDisplayText(text)}</p>)}
                  </section>
                ))}
              </div>
            )}
            {serviceVisualSections.length > 0 && (
              <section className="service-visual-story service-full-bleed">
                <div className="section-title">
                  <div>
                    <span className="eyebrow">Treatment visuals</span>
                    <h2>More from this treatment</h2>
                  </div>
                </div>
                <div className="service-visual-grid">
                  {serviceVisualSections.map((section) => (
                    <article key={`${section.heading}-${section.image}`}>
                      {section.image && <img src={section.image} alt={section.heading} />}
                      <div>
                        <h3>{section.heading}</h3>
                        {section.body.slice(0, 2).map((text) => <p key={text}>{cleanDisplayText(text)}</p>)}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
            {iconCardSections.length > 0 && (
              <section className="service-icon-card-section service-full-bleed">
                <span className="eyebrow">Why choose Twacha</span>
                <h2>{iconCardSections.find((section) => section.heading.toLowerCase().includes("why"))?.heading || "Treatment strengths"}</h2>
                <div className="service-icon-card-grid">
                  {iconCardSections.filter((section) => !section.heading.toLowerCase().includes("why")).map((section) => (
                    <article key={`${section.heading}-${section.image}`}>
                      {section.image && <img src={section.image} alt={section.heading} />}
                      <h3>{section.heading}</h3>
                      {section.body.map((text) => <p key={text}>{cleanDisplayText(text)}</p>)}
                    </article>
                  ))}
                </div>
              </section>
            )}
            {faqItems.length > 0 && (
              <section className="service-faq-section">
                <span className="eyebrow">Frequently asked questions</span>
                <h2>{faqSection?.heading || `${service.title} FAQs`}</h2>
                <div className="service-faq-grid">
                  {faqItems.map((item, index) => (
                    <details key={`${item.question}-${index}`} open={index === 0}>
                      <summary>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {item.question}
                      </summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
            {testimonialItems.length > 0 && (
              <section className="service-testimonial-section">
                <div>
                  <span className="eyebrow">Patient experiences</span>
                  <h2>{testimonialSection?.heading || `Patients on ${service.title}`}</h2>
                </div>
                <div className="service-testimonial-grid">
                  {testimonialItems.map((item, index) => (
                    <article key={`${item.name}-${index}`}>
                      <span aria-hidden="true">&quot;</span>
                      <p>{item.quote}</p>
                      <b>{item.name}</b>
                    </article>
                  ))}
                </div>
              </section>
            )}
            {contactSection && (
              <section className="service-contact-panel">
                <div>
                  <span className="eyebrow">Book your visit</span>
                  <h2>{contactSection.heading}</h2>
                </div>
                <div>
                  {contactSection.body.map((text) => <p key={text}>{cleanDisplayText(text)}</p>)}
                  <Link className="primary-btn" href="/book-appointment">Book appointment</Link>
                </div>
              </section>
            )}
            {remainingVideos.length > 0 && (
              <section className="service-video-section">
                <span className="eyebrow">More treatment videos</span>
                <h2>Watch more about this service</h2>
                <div className="media-grid service-media-grid">
                  {remainingVideos.map((video) => <VideoEmbed key={video.id} video={video} />)}
                </div>
              </section>
            )}
          </article>
          <aside className="service-sticky-card">
            <h3>Important note</h3>
            <p>Treatment suitability, number of sessions and outcomes vary. Please consult a dermatologist before starting any medical or aesthetic procedure.</p>
            <Link className="primary-btn" href="/book-appointment">Book appointment</Link>
            <a href={`tel:${data.settings.phone}`}>{data.settings.phone}</a>
          </aside>
        </section>
        {(chemicalResults.length > 0 || serviceGalleryImages.length > 0) && (
          <section className="service-results-section">
            <div className="section-title">
              <div>
                <span className="eyebrow">See our results</span>
                <h2>{isChemicalPeel ? "Chemical peel treatment gallery" : `${service.title} gallery`}</h2>
              </div>
            </div>
            <div className="service-results-grid">
              {(chemicalResults.length ? chemicalResults : serviceGalleryImages).map((image) => (
                <img key={image} src={image} alt={`${service.title} result`} />
              ))}
            </div>
          </section>
        )}
        <section className="appointment-band">
          <div><span className="eyebrow">Next step</span><h2>Request an appointment</h2><p>Share your concern and the clinic team will call you back.</p></div>
          <AppointmentForm services={services.map((item) => ({ title: item.title, category: item.category }))} doctors={doctors.map((doctor) => doctor.name)} />
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(service, data.settings)) }} />
    </>
  );
}
