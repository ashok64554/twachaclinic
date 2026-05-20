import type { Metadata } from "next";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteData } from "@/lib/data";
import { getGalleryImages } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery | Twacha Skin Clinic Dwarka",
  description: "Explore Twacha Skin Clinic gallery images from clinic spaces, skin treatments, laser care and aesthetic dermatology."
};

export default async function GalleryPage() {
  const data = await getSiteData();
  const services = data.services.filter((item) => item.active);
  const galleryItems = getGalleryImages(data);

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="page-shell gallery-page">
        <section className="page-hero compact">
          <span className="eyebrow">Our Gallery</span>
          <h1>Explore Us</h1>
          <p>Browse clinic spaces, treatment moments and aesthetic care visuals from Twacha Skin Clinic.</p>
        </section>
        <section className="section home-gallery-section gallery-page-section">
          <GalleryLightbox items={galleryItems} />
        </section>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
