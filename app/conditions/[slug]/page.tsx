import type { Metadata } from "next";
import ServiceDetail from "@/app/services/[slug]/page";
import { getSiteData } from "@/lib/data";
import { conditionRoutes, findConditionRoute } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return conditionRoutes.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = findConditionRoute(slug);
  const data = await getSiteData();
  const service = data.services.find((item) => item.slug === route?.serviceSlug);
  const title = service?.metaTitle || `${route?.label || "Condition"} Treatment in Delhi | Twacha Skin Clinic`;
  const description = service?.metaDescription || service?.excerpt || "Learn about dermatologist-led care for skin and hair concerns at Twacha Skin Clinic.";

  return {
    title,
    description,
    alternates: {
      canonical: `/conditions/${slug}`
    }
  };
}

export default async function ConditionDetailPage({ params }: Props) {
  const { slug } = await params;
  const route = findConditionRoute(slug);
  return <ServiceDetail params={Promise.resolve({ slug: route?.serviceSlug || slug })} />;
}
