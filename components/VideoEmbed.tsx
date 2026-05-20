import { ExternalLink, Instagram, PlayCircle } from "lucide-react";
import type { VideoItem } from "@/lib/types";

type Props = {
  video: VideoItem;
};

export function VideoEmbed({ video }: Props) {
  if (video.platform === "youtube" && video.embedUrl) {
    return (
      <article className="media-card youtube-card">
        <div className="video-frame">
          <iframe
            src={video.embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="media-card-body">
          <span><PlayCircle size={16} /> YouTube</span>
          <h3>{video.title}</h3>
        </div>
      </article>
    );
  }

  return (
    <article className="media-card instagram-card">
      <a href={video.url} target="_blank" rel="noreferrer">
        <span><Instagram size={18} /> Instagram Reel</span>
        <h3>{video.title}</h3>
        <small>Open reel <ExternalLink size={14} /></small>
      </a>
    </article>
  );
}
