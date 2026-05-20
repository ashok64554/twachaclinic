import type { SiteData, SitePage } from "./types";

export function getPageContent(data: SiteData, slug: string, fallback: Partial<SitePage> = {}): SitePage {
  const page = data.pages?.find((item) => item.slug === slug && item.active !== false);
  return {
    id: page?.id || 0,
    slug,
    title: page?.title || fallback.title || slug,
    eyebrow: page?.eyebrow || fallback.eyebrow || "",
    excerpt: page?.excerpt || fallback.excerpt || "",
    image: page?.image || fallback.image || "",
    sections: page?.sections || fallback.sections || [],
    metaTitle: page?.metaTitle || fallback.metaTitle || "",
    metaDescription: page?.metaDescription || fallback.metaDescription || "",
    active: page?.active ?? fallback.active ?? true
  };
}
