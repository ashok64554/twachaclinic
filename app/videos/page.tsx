import { Instagram, PlayCircle, Youtube } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VideosTabs } from "@/components/VideosTabs";
import { getSiteData } from "@/lib/data";
import { getPageContent } from "@/lib/pages";

export default async function VideosPage() {
  const data = await getSiteData();
  const services = data.services.filter((item) => item.active);
  const page = getPageContent(data, "videos", {
    eyebrow: "Resources",
    title: "Videos",
    excerpt: "Explore clinic and treatment videos from Twacha Skin Clinic."
  });
  const videos = data.videos || [];
  const youtubeVideos = videos.filter((video) => video.platform === "youtube");
  const instagramVideos = videos.filter((video) => video.platform === "instagram");

  return (
    <>
      <SiteHeader settings={data.settings} />
      <main className="page-shell">
        <section className="videos-hero">
          <div className="videos-hero-copy">
            <span className="eyebrow">{page.eyebrow}</span>
            <h1>{page.title}</h1>
            <p>{page.excerpt}</p>
            <div className="videos-hero-actions">
              <a className="primary-btn" href="#video-library"><Youtube size={18} /> Watch videos</a>
              <a className="secondary-btn" href="#instagram-reels"><Instagram size={18} /> View reels</a>
            </div>
            <div className="videos-hero-stats">
              <span><b>{youtubeVideos.length}</b> YouTube videos</span>
              <span><b>{instagramVideos.length}</b> Instagram reels</span>
            </div>
          </div>
          <div className="videos-hero-media" aria-label="Twacha treatment video preview">
            <img className="videos-hero-main" src="/assets/img/service/chemical-peels/chemical-peels-treatment.webp" alt="Twacha Skin Clinic treatment result preview" />
            <img className="videos-hero-side" src="/assets/img/service/Laser-Hair-Reduction-treatment-1.webp" alt="Twacha treatment video preview" />
            <div className="videos-hero-play"><PlayCircle size={58} /><span>Treatment library</span></div>
          </div>
        </section>
        <div id="video-library">
          <VideosTabs youtubeVideos={youtubeVideos} instagramVideos={instagramVideos} />
        </div>
      </main>
      <SiteFooter settings={data.settings} services={services} />
    </>
  );
}
