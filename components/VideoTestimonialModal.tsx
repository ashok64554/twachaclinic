"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, X } from "lucide-react";

type VideoTestimonial = {
  title: string;
  image: string;
  url: string;
};

function getYoutubeEmbedUrl(url: string) {
  const parsedUrl = new URL(url);
  const videoId = parsedUrl.searchParams.get("v") || parsedUrl.pathname.split("/").filter(Boolean).pop();
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
}

export function VideoTestimonialModal({ videos }: { videos: VideoTestimonial[] }) {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);
  const embedUrl = useMemo(() => (activeVideo ? getYoutubeEmbedUrl(activeVideo.url) : ""), [activeVideo]);

  useEffect(() => {
    if (!activeVideo) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveVideo(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo]);

  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="happy-faces-layout">
        <button className="happy-face-feature" type="button" onClick={() => setActiveVideo(videos[0])}>
          <img src={videos[0].image} alt={videos[0].title} />
          <span className="happy-play"><Play size={28} fill="currentColor" /></span>
          <b>{videos[0].title}</b>
        </button>
        <div className="happy-face-list">
          {videos.slice(1, 5).map((item) => (
            <button type="button" key={item.url} onClick={() => setActiveVideo(item)}>
              <img src={item.image} alt={item.title} />
              <span><Play size={16} fill="currentColor" /></span>
              <b>{item.title}</b>
            </button>
          ))}
        </div>
      </div>

      {activeVideo && (
        <div className="video-lightbox" role="dialog" aria-modal="true" aria-label={`${activeVideo.title} video`}>
          <button className="video-lightbox-backdrop" type="button" onClick={() => setActiveVideo(null)} aria-label="Close video" />
          <div className="video-lightbox-frame">
            <button className="video-lightbox-close" type="button" onClick={() => setActiveVideo(null)} aria-label="Close video">
              <X size={22} />
            </button>
            <iframe
              src={embedUrl}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
