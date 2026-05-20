"use client";

import { useEffect } from "react";
import type { VideoItem } from "@/lib/types";

type Props = {
  reels: VideoItem[];
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

export function InstagramReels({ reels }: Props) {
  useEffect(() => {
    if (reels.length === 0) return;

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
  }, [reels.length]);

  return (
    <div className="about-instagram-embed-grid">
      {reels.map((reel) => (
        <div className="about-instagram-embed" key={reel.id}>
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={instagramPermalink(reel.url)}
            data-instgrm-version="14"
          >
            <a href={reel.url} target="_blank" rel="noreferrer">
              View this post on Instagram
            </a>
          </blockquote>
        </div>
      ))}
    </div>
  );
}
