import type { Service, SiteSettings } from "./types";

export function clinicJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: settings.clinicName,
    description: settings.tagline,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      addressCountry: "IN"
    },
    medicalSpecialty: ["Dermatology", "Aesthetic Dermatology", "Laser Treatment"],
    url: "https://twachaclinic.com"
  };
}

export function serviceJsonLd(service: Service, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.metaDescription || service.excerpt,
    provider: {
      "@type": "MedicalClinic",
      name: settings.clinicName,
      telephone: settings.phone
    }
  };
}
