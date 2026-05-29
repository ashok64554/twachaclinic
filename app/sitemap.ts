import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";
import { conditionRoutes, treatmentRoutes } from "@/lib/routes";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://twachaclinic.com";

function url(path = "") {
  return `${siteUrl}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSiteData();
  const now = new Date();
  const fixedPages = [
    "",
    "/about",
    "/treatments",
    "/services",
    "/doctors",
    "/videos",
    "/gallery",
    "/contact",
    "/book-appointment",
    "/terms-and-conditions",
    "/privacy-policy",
    "/medical-disclaimer",
    "/refund-policy",
    "/cookie-policy",
    "/resources/faqs",
    "/resources/pre-care",
    "/resources/post-care"
  ];
  const cmsPages = data.pages
    .filter((page) => page.active)
    .map((page) => `/${page.slug}`)
    .filter((path) => !fixedPages.includes(path));
  const servicePages = data.services
    .filter((service) => service.active)
    .map((service) => `/services/${service.slug}`);
  const treatmentPages = treatmentRoutes.map((route) => `/treatments/${route.category}/${route.slug}`);
  const conditionPages = conditionRoutes.map((route) => `/conditions/${route.slug}`);
  const doctorPages = data.doctors
    .filter((doctor) => doctor.active)
    .map((doctor) => `/doctors/${doctor.slug}`);

  return [...fixedPages, ...cmsPages, ...treatmentPages, ...conditionPages, ...servicePages, ...doctorPages].map((path) => ({
    url: url(path),
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/treatments/") || path.startsWith("/conditions/") ? 0.85 : 0.7
  }));
}
