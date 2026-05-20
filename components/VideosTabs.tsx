"use client";

import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
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

export function VideosTabs({ youtubeVideos, instagramVideos }: Props) {
  const [activeTab, setActiveTab] = useState<"youtube" | "instagram">("youtube");

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
            <a className="old-youtube-tile" href={video.url} key={video.id} target="_blank" rel="noreferrer">
              <img src={video.thumbnail || "/assets/img/youtube/Acne.webp"} alt={video.title} />
              <span><PlayCircle size={54} /></span>
            </a>
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
    </section>
  );
}
