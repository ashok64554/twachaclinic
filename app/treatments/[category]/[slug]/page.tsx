import type { Metadata } from "next";
import ServiceDetail from "@/app/services/[slug]/page";
import { getSiteData } from "@/lib/data";
import { findTreatmentRoute, treatmentRoutes } from "@/lib/routes";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateStaticParams() {
  return treatmentRoutes.map((route) => ({ category: route.category, slug: route.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const route = findTreatmentRoute(category, slug);
  const data = await getSiteData();
  const service = data.services.find((item) => item.slug === route?.serviceSlug);
  const title = service?.metaTitle || service?.title || route?.label || "Treatment | Twacha Skin Clinic";
  const description = service?.metaDescription || service?.excerpt || "Dermatologist-led treatments at Twacha Skin Clinic.";

  return {
    title,
    description,
    alternates: {
      canonical: `/treatments/${category}/${slug}`
    }
  };
}

export default async function TreatmentDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const route = findTreatmentRoute(category, slug);
  return <ServiceDetail params={Promise.resolve({ slug: route?.serviceSlug || slug })} />;
}
