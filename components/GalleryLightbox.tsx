"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryLightboxItem = {
  image: string;
  title: string;
};

export function GalleryLightbox({ items }: { items: GalleryLightboxItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current === null ? current : (current + 1) % items.length));
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current === null ? current : (current - 1 + items.length) % items.length));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, items.length]);

  const showPrevious = () => {
    setActiveIndex((current) => (current === null ? current : (current - 1 + items.length) % items.length));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === null ? current : (current + 1) % items.length));
  };

  return (
    <>
      <div className="home-gallery-grid">
        {items.map(({ image, title }, index) => (
          <button
            className="home-gallery-card"
            key={`${image}-${title}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Open ${title} gallery image`}
          >
            <img src={image} alt={`${title} gallery image`} />
          </button>
        ))}
      </div>

      {activeItem && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image viewer">
          <button className="gallery-lightbox-backdrop" type="button" onClick={() => setActiveIndex(null)} aria-label="Close gallery" />
          <div className="gallery-lightbox-frame">
            <button className="gallery-lightbox-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Close gallery">
              <X size={22} />
            </button>
            <button className="gallery-lightbox-nav prev" type="button" onClick={showPrevious} aria-label="Previous image">
              <ChevronLeft size={28} />
            </button>
            <img src={activeItem.image} alt={`${activeItem.title} gallery preview`} />
            <button className="gallery-lightbox-nav next" type="button" onClick={showNext} aria-label="Next image">
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
