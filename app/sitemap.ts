import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";

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
    "/services",
    "/doctors",
    "/videos",
    "/contact",
    "/book-appointment",
    "/terms-and-conditions",
    "/privacy-policy"
  ];
  const cmsPages = data.pages
    .filter((page) => page.active)
    .map((page) => `/${page.slug}`)
    .filter((path) => !fixedPages.includes(path));
  const servicePages = data.services
    .filter((service) => service.active)
    .map((service) => `/services/${service.slug}`);
  const doctorPages = data.doctors
    .filter((doctor) => doctor.active)
    .map((doctor) => `/doctors/${doctor.slug}`);

  return [...fixedPages, ...cmsPages, ...servicePages, ...doctorPages].map((path) => ({
    url: url(path),
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/services/") ? 0.85 : 0.7
  }));
}
