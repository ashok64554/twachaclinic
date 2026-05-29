import type { Metadata } from "next";
import ServiceDetail from "@/app/services/[slug]/page";

export const metadata: Metadata = {
  title: "ISEMECO 3D D9 Skin Image Analyzer | Twacha Skin Clinic",
  description: "Learn about ISEMECO 3D D9 skin imaging and analysis at Twacha Skin Clinic.",
  alternates: {
    canonical: "/treatments/3d-skin-analyzer"
  }
};

export default function SkinAnalyzerPage() {
  return <ServiceDetail params={Promise.resolve({ slug: "3d-skin-analyzer" })} />;
}
