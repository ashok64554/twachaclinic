"use client";

import { useEffect, useState } from "react";
import { PlayCircle, X } from "lucide-react";
import type { VideoItem } from "@/lib/types";

type Props = {
  youtubeVideos: VideoItem[];
  instagramVideos: VideoItem[];
};

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

function instagramPermalink(url: string) {
  const cleanUrl = url.endsWith("/") ? url : `${url}/`;
  return `${cleanUrl}?utm_source=ig_embed&utm_campaign=loading`;
}

function youtubeEmbedUrl(video: VideoItem) {
  if (video.embedUrl) return video.embedUrl;
  const parsedUrl = new URL(video.url);
  const videoId = parsedUrl.searchParams.get("v") || parsedUrl.pathname.split("/").filter(Boolean).pop();
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : video.url;
}

export function VideosTabs({ youtubeVideos, instagramVideos }: Props) {
  const [activeTab, setActiveTab] = useState<"youtube" | "instagram">("youtube");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    if (instagramVideos.length === 0) return;

    const existingScript = document.querySelector<HTMLScriptElement>("script[src='https://www.instagram.com/embed.js']");
    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      script.onload = () => window.instgrm?.Embeds?.process();
      document.body.appendChild(script);
      return;
    }

    window.instgrm?.Embeds?.process();
  }, [activeTab, instagramVideos.length]);

  useEffect(() => {
    if (!activeVideo) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVideo(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo]);

  return (
    <section className="old-video-section">
      <div className="old-video-tabs" role="tablist" aria-label="Video sources">
        <button className={activeTab === "youtube" ? "active" : ""} type="button" onClick={() => setActiveTab("youtube")}>
          Youtube
        </button>
        <button className={activeTab === "instagram" ? "active" : ""} type="button" onClick={() => setActiveTab("instagram")}>
          Instagram
        </button>
      </div>

      <div className={`old-tab-panel ${activeTab === "youtube" ? "active" : ""}`}>
        <div className="old-youtube-grid">
          {youtubeVideos.map((video) => (
            <button className="old-youtube-tile" key={video.id} type="button" onClick={() => setActiveVideo(video)} aria-label={`Play ${video.title}`}>
              <img src={video.thumbnail || "/assets/img/youtube/Acne.webp"} alt={video.title} />
              <span><PlayCircle size={54} /></span>
            </button>
          ))}
        </div>
      </div>

      <div className={`old-tab-panel ${activeTab === "instagram" ? "active" : ""}`}>
        <div className="old-instagram-grid">
          {instagramVideos.map((video) => (
            <div className="old-instagram-cell" key={video.id}>
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={instagramPermalink(video.url)}
                data-instgrm-version="14"
              >
                <a href={video.url} target="_blank" rel="noreferrer">
                  View this post on Instagram
                </a>
              </blockquote>
            </div>
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
              src={youtubeEmbedUrl(activeVideo)}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
