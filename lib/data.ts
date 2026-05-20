import { promises as fs } from "fs";
import path from "path";
import type { Appointment, ContactLead, ContentSection, Doctor, GalleryImage, Service, SiteData, SitePage, SiteSettings, Testimonial, VideoItem } from "./types";
import { getDbConnection } from "./db";
import { defaultGalleryImages } from "./gallery";

const dataFile = path.join(process.cwd(), "data", "site-data.json");

type SettingRow = { setting_key: string; setting_value: string };
type PageRow = Omit<SitePage, "sections" | "metaTitle" | "metaDescription" | "active"> & {
  sections: string;
  meta_title: string;
  meta_description: string;
  active: number;
};
type DoctorRow = Omit<Doctor, "highlights" | "active"> & { highlights: string; active: number };
type ServiceRow = Omit<Service, "benefits" | "sections" | "videos" | "metaTitle" | "metaDescription" | "active"> & {
  benefits: string;
  sections: string;
  detail_html: string | null;
  meta_title: string;
  meta_description: string;
  active: number;
};
type VideoRow = {
  id: string;
  platform: "youtube" | "instagram";
  title: string;
  url: string;
  embed_url: string | null;
  thumbnail: string | null;
  service_slug: string | null;
};
type TestimonialRow = Omit<Testimonial, "active"> & { active: number };
type GalleryRow = Omit<GalleryImage, "active"> & { active: number };
type AppointmentRow = Omit<Appointment, "createdAt"> & { created_at: Date | string };
type ContactLeadRow = Omit<ContactLead, "createdAt"> & { created_at: Date | string };

async function getFileSiteData(): Promise<SiteData> {
  const raw = await fs.readFile(dataFile, "utf8");
  const parsed = JSON.parse(raw) as SiteData;
  return { ...parsed, gallery: parsed.gallery || defaultGalleryImages, contactLeads: parsed.contactLeads || [] };
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function getLegacyPayloadData(connection: Awaited<ReturnType<typeof getDbConnection>>) {
  try {
    const [rows] = await connection.query("SELECT payload FROM site_data WHERE id = 1 LIMIT 1");
    const records = rows as { payload: string }[];
    return records[0]?.payload ? JSON.parse(records[0].payload) as SiteData : null;
  } catch {
    return null;
  }
}

async function moduleTablesAreEmpty(connection: Awaited<ReturnType<typeof getDbConnection>>) {
  const [rows] = await connection.query("SELECT COUNT(*) total FROM pages");
  return Number((rows as { total: number }[])[0]?.total || 0) === 0;
}

async function seedModulesIfEmpty(connection: Awaited<ReturnType<typeof getDbConnection>>) {
  if (!(await moduleTablesAreEmpty(connection))) return;
  const seedData = await getLegacyPayloadData(connection) || await getFileSiteData();
  try {
    await saveSiteDataToConnection(connection, seedData);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code !== "ER_DUP_ENTRY") throw error;
  }
}

export async function getSiteData(): Promise<SiteData> {
  try {
    const connection = await getDbConnection();
    try {
      await seedModulesIfEmpty(connection);

      const [settingsRows] = await connection.query("SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key");
      const [pageRows] = await connection.query("SELECT * FROM pages ORDER BY display_order, id");
      const [doctorRows] = await connection.query("SELECT * FROM doctors ORDER BY display_order, id");
      const [serviceRows] = await connection.query("SELECT * FROM services ORDER BY display_order, id");
      const [videoRows] = await connection.query("SELECT * FROM videos ORDER BY display_order, id");
      const [testimonialRows] = await connection.query("SELECT * FROM testimonials ORDER BY display_order, id");
      const [galleryRows] = await connection.query("SELECT * FROM gallery_images ORDER BY display_order, id");
      const [appointmentRows] = await connection.query("SELECT * FROM appointments ORDER BY created_at DESC, id DESC");
      const [contactLeadRows] = await connection.query("SELECT * FROM contact_leads ORDER BY created_at DESC, id DESC");

      const settings = (settingsRows as SettingRow[]).reduce((acc, row) => {
        return { ...acc, [row.setting_key]: row.setting_value };
      }, {} as SiteSettings);

      const pages: SitePage[] = (pageRows as PageRow[]).map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        eyebrow: row.eyebrow,
        excerpt: row.excerpt,
        image: row.image,
        sections: parseJson<ContentSection[]>(row.sections, []),
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        active: Boolean(row.active)
      }));

      const doctors: Doctor[] = (doctorRows as DoctorRow[]).map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        title: row.title,
        image: row.image,
        summary: row.summary,
        highlights: parseJson<string[]>(row.highlights, []),
        active: Boolean(row.active)
      }));

      const videos: VideoItem[] = (videoRows as VideoRow[]).map((row) => ({
        id: row.id,
        platform: row.platform,
        title: row.title,
        url: row.url,
        embedUrl: row.embed_url || undefined,
        thumbnail: row.thumbnail || undefined,
        serviceSlug: row.service_slug || undefined
      }));

      const services: Service[] = (serviceRows as ServiceRow[]).map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        category: row.category,
        image: row.image,
        excerpt: row.excerpt,
        content: row.content,
        benefits: parseJson<string[]>(row.benefits, []),
        sections: parseJson<ContentSection[]>(row.sections, []),
        detailHtml: row.detail_html || undefined,
        videos: videos.filter((video) => video.serviceSlug === row.slug),
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        active: Boolean(row.active)
      }));

      const testimonials: Testimonial[] = (testimonialRows as TestimonialRow[]).map((row) => ({
        id: row.id,
        name: row.name,
        note: row.note,
        rating: row.rating,
        active: Boolean(row.active)
      }));

      const gallery: GalleryImage[] = (galleryRows as GalleryRow[]).map((row) => ({
        id: row.id,
        title: row.title,
        image: row.image,
        active: Boolean(row.active)
      }));

      const allAppointments: Appointment[] = (appointmentRows as AppointmentRow[]).map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email || "",
        service: row.service || "",
        doctor: row.doctor || "",
        message: row.message || "",
        createdAt: new Date(row.created_at).toISOString()
      }));
      const legacyContactLeads: ContactLead[] = allAppointments
        .filter((row) => row.service === "Contact form")
        .map((row) => ({
          id: row.id,
          name: row.name,
          phone: row.phone,
          email: row.email,
          message: row.message,
          createdAt: row.createdAt
        }));
      const appointments = allAppointments.filter((row) => row.service !== "Contact form");
      const contactLeads: ContactLead[] = [
        ...(contactLeadRows as ContactLeadRow[]).map((row) => ({
          id: row.id,
          name: row.name,
          phone: row.phone,
          email: row.email || "",
          message: row.message || "",
          createdAt: new Date(row.created_at).toISOString()
        })),
        ...legacyContactLeads
      ];

      return { settings, pages, doctors, services, videos, gallery: gallery.length > 0 ? gallery : defaultGalleryImages, testimonials, appointments, contactLeads };
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.warn("Database unavailable, reading site data JSON fallback.", error);
    return getFileSiteData();
  }
}

async function saveSiteDataToConnection(connection: Awaited<ReturnType<typeof getDbConnection>>, data: SiteData) {
  await connection.beginTransaction();
  try {
    await connection.query("DELETE FROM site_settings");
    await connection.query("DELETE FROM pages");
    await connection.query("DELETE FROM doctors");
    await connection.query("DELETE FROM services");
    await connection.query("DELETE FROM videos");
    await connection.query("DELETE FROM testimonials");
    await connection.query("DELETE FROM gallery_images");
    await connection.query("DELETE FROM appointments");
    await connection.query("DELETE FROM contact_leads");

    for (const [key, value] of Object.entries(data.settings)) {
      await connection.execute("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)", [key, String(value)]);
    }

    for (const [index, page] of data.pages.entries()) {
      await connection.execute(
        "INSERT INTO pages (id, slug, title, eyebrow, excerpt, image, sections, meta_title, meta_description, active, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [page.id, page.slug, page.title, page.eyebrow, page.excerpt, page.image, JSON.stringify(page.sections || []), page.metaTitle, page.metaDescription, page.active ? 1 : 0, index]
      );
    }

    for (const [index, doctor] of data.doctors.entries()) {
      await connection.execute(
        "INSERT INTO doctors (id, slug, name, title, image, summary, highlights, active, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [doctor.id, doctor.slug, doctor.name, doctor.title, doctor.image, doctor.summary, JSON.stringify(doctor.highlights || []), doctor.active ? 1 : 0, index]
      );
    }

    for (const [index, service] of data.services.entries()) {
      await connection.execute(
        "INSERT INTO services (id, slug, title, category, image, excerpt, content, benefits, sections, detail_html, meta_title, meta_description, active, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [service.id, service.slug, service.title, service.category, service.image, service.excerpt, service.content, JSON.stringify(service.benefits || []), JSON.stringify(service.sections || []), service.detailHtml || null, service.metaTitle, service.metaDescription, service.active ? 1 : 0, index]
      );
    }

    const uniqueVideos = new Map<string, VideoItem>();
    for (const video of [...(data.videos || []), ...data.services.flatMap((service) => service.videos || [])]) {
      uniqueVideos.set(video.id, video);
    }
    for (const [index, video] of [...uniqueVideos.values()].entries()) {
      await connection.execute(
        "INSERT INTO videos (id, platform, title, url, embed_url, thumbnail, service_slug, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [video.id, video.platform, video.title, video.url, video.embedUrl || null, video.thumbnail || null, video.serviceSlug || null, index]
      );
    }

    for (const [index, testimonial] of data.testimonials.entries()) {
      await connection.execute(
        "INSERT INTO testimonials (id, name, note, rating, active, display_order) VALUES (?, ?, ?, ?, ?, ?)",
        [testimonial.id, testimonial.name, testimonial.note, testimonial.rating, testimonial.active ? 1 : 0, index]
      );
    }

    for (const [index, image] of (data.gallery || defaultGalleryImages).entries()) {
      await connection.execute(
        "INSERT INTO gallery_images (id, title, image, active, display_order) VALUES (?, ?, ?, ?, ?)",
        [image.id, image.title, image.image, image.active ? 1 : 0, index]
      );
    }

    for (const appointment of data.appointments.filter((item) => item.service !== "Contact form")) {
      await connection.execute(
        "INSERT INTO appointments (id, name, phone, email, service, doctor, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [appointment.id, appointment.name, appointment.phone, appointment.email, appointment.service, appointment.doctor, appointment.message, new Date(appointment.createdAt)]
      );
    }

    for (const lead of data.contactLeads || []) {
      await connection.execute(
        "INSERT INTO contact_leads (id, name, phone, email, message, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [lead.id, lead.name, lead.phone, lead.email, lead.message, new Date(lead.createdAt)]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

export async function saveSiteData(data: SiteData) {
  try {
    const connection = await getDbConnection();
    try {
      await saveSiteDataToConnection(connection, data);
    } finally {
      await connection.end();
    }
    return;
  } catch (error) {
    console.warn("Database unavailable, saving site data JSON fallback.", error);
    await fs.writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }
}

export async function addAppointment(input: Omit<Appointment, "id" | "createdAt">) {
  try {
    const connection = await getDbConnection();
    try {
      const [result] = await connection.execute(
        "INSERT INTO appointments (name, phone, email, service, doctor, message) VALUES (?, ?, ?, ?, ?, ?)",
        [input.name, input.phone, input.email, input.service, input.doctor, input.message]
      );
      const id = Number((result as { insertId: number }).insertId);
      const [rows] = await connection.query("SELECT * FROM appointments WHERE id = ? LIMIT 1", [id]);
      const row = (rows as AppointmentRow[])[0];
      return {
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email || "",
        service: row.service || "",
        doctor: row.doctor || "",
        message: row.message || "",
        createdAt: new Date(row.created_at).toISOString()
      };
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.warn("Database unavailable, saving appointment JSON fallback.", error);
    const data = await getSiteData();
    const id = Math.max(0, ...data.appointments.map((item) => item.id)) + 1;
    const appointment: Appointment = { id, createdAt: new Date().toISOString(), ...input };
    data.appointments.unshift(appointment);
    await saveSiteData(data);
    return appointment;
  }
}

export async function addContactLead(input: Omit<ContactLead, "id" | "createdAt">) {
  try {
    const connection = await getDbConnection();
    try {
      const [result] = await connection.execute(
        "INSERT INTO contact_leads (name, phone, email, message) VALUES (?, ?, ?, ?)",
        [input.name, input.phone, input.email, input.message]
      );
      const id = Number((result as { insertId: number }).insertId);
      const [rows] = await connection.query("SELECT * FROM contact_leads WHERE id = ? LIMIT 1", [id]);
      const row = (rows as ContactLeadRow[])[0];
      return {
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email || "",
        message: row.message || "",
        createdAt: new Date(row.created_at).toISOString()
      };
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.warn("Database unavailable, saving contact lead JSON fallback.", error);
    const data = await getSiteData();
    const contactLeads = data.contactLeads || [];
    const id = Math.max(0, ...contactLeads.map((item) => item.id)) + 1;
    const lead: ContactLead = { id, createdAt: new Date().toISOString(), ...input };
    await saveSiteData({ ...data, contactLeads: [lead, ...contactLeads] });
    return lead;
  }
}

export function verifyAdminPassword(password: string, data: SiteData) {
  const configured = process.env.ADMIN_PASSWORD || data.settings.adminPassword;
  return password && configured && password === configured;
}
