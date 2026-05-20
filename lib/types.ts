export type Doctor = {
  id: number;
  slug: string;
  name: string;
  title: string;
  image: string;
  summary: string;
  highlights: string[];
  active: boolean;
};

export type Service = {
  id: number;
  slug: string;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  benefits: string[];
  sections?: ContentSection[];
  detailHtml?: string;
  videos?: VideoItem[];
  metaTitle: string;
  metaDescription: string;
  active: boolean;
};

export type Testimonial = {
  id: number;
  name: string;
  note: string;
  rating: number;
  active: boolean;
};

export type ContentSection = {
  heading: string;
  body: string[];
  image?: string;
};

export type SitePage = {
  id: number;
  slug: string;
  title: string;
  eyebrow: string;
  excerpt: string;
  image: string;
  sections: ContentSection[];
  metaTitle: string;
  metaDescription: string;
  active: boolean;
};

export type VideoItem = {
  id: string;
  platform: "youtube" | "instagram";
  title: string;
  url: string;
  embedUrl?: string;
  thumbnail?: string;
  serviceSlug?: string;
};

export type Appointment = {
  id: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  doctor: string;
  message: string;
  createdAt: string;
};

export type ContactLead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
};

export type SiteSettings = {
  clinicName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  adminPassword: string;
};

export type SiteData = {
  settings: SiteSettings;
  doctors: Doctor[];
  services: Service[];
  pages: SitePage[];
  videos?: VideoItem[];
  testimonials: Testimonial[];
  appointments: Appointment[];
  contactLeads: ContactLead[];
};
