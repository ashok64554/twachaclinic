import type { Service, SiteSettings } from "./types";

export function clinicJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": "https://twachaclinic.com/#clinic",
    name: settings.clinicName,
    description: settings.tagline,
    url: "https://twachaclinic.com",
    logo: "https://twachaclinic.com/assets/img/twacha-logo.png",
    image: "https://twachaclinic.com/assets/img/banner/Banner-2.webp",
    telephone: settings.phone,
    email: settings.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      addressCountry: "IN"
    },
    areaServed: ["Dwarka", "New Delhi", "Delhi NCR"],
    medicalSpecialty: ["Dermatology", "Aesthetic Dermatology", "Laser Treatment"],
    sameAs: [
      "https://www.facebook.com/twachaclinic",
      "https://www.instagram.com/twachaclinics/",
      "https://youtube.com/@twachaclinics"
    ],
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://twachaclinic.com/book-appointment",
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform"
        ]
      },
      result: {
        "@type": "Reservation",
        name: "Dermatology appointment request"
      }
    }
  };
}

export function serviceJsonLd(service: Service, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.metaDescription || service.excerpt,
    image: `https://twachaclinic.com${service.image}`,
    url: `https://twachaclinic.com/services/${service.slug}`,
    provider: {
      "@type": "MedicalClinic",
      "@id": "https://twachaclinic.com/#clinic",
      name: settings.clinicName,
      telephone: settings.phone
    }
  };
}
