import type { GalleryImage, SiteData } from "./types";

export const defaultGalleryImages: GalleryImage[] = [
  { id: 1, image: "/assets/img/gallery/403 x 403.jpg", title: "Skin Treatment", active: true },
  { id: 2, image: "/assets/img/gallery/404 x 403.jpg", title: "Skin Treatment", active: true },
  { id: 3, image: "/assets/img/gallery/403 x 836.jpg", title: "Body Treatment", active: true },
  { id: 4, image: "/assets/img/gallery/Image-3.webp", title: "Skin Treatment", active: true },
  { id: 5, image: "/assets/img/gallery/Image-2.webp", title: "Body Treatment", active: true },
  { id: 6, image: "/assets/img/gallery/Image-1.webp", title: "Skin Treatment", active: true },
  { id: 7, image: "/assets/img/gallery/404 x 403.jpg", title: "Skin Treatment", active: true }
];

export function getGalleryImages(data: Pick<SiteData, "gallery">) {
  const gallery = data.gallery && data.gallery.length > 0 ? data.gallery : defaultGalleryImages;
  return gallery.filter((item) => item.active);
}
