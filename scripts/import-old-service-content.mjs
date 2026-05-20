import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const root = process.cwd();
const oldRoot = "C:\\wamp64\\www\\twacha";
const dataPath = path.join(root, "data", "site-data.json");
const publicRoot = path.join(root, "public");

const fileOverrides = {
  "3d-skin-analyzer": "3d-skin-analyzer.php"
};

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, "\"")
    .replace(/&ndash;|&mdash;/gi, "-")
    .replace(/â€œ|â€|â€�/g, "\"")
    .replace(/â€™/g, "'")
    .replace(/â€“/g, "-");
}

function cleanText(value) {
  return decodeHtml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleFromAsset(src) {
  const file = decodeHtml(src).split(/[\\/]/).pop() || "";
  return file
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+\d+$/g, "")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

async function assetPath(src) {
  if (!src || src.startsWith("http") || src.startsWith("//")) return "";
  const cleaned = decodeHtml(src).replace(/^\.?\//, "");
  if (!cleaned.startsWith("assets/")) return "";
  const parts = cleaned.split(/[\\/]+/);
  let current = publicRoot;
  const resolved = [];
  for (const part of parts) {
    try {
      const entries = await fs.readdir(current);
      const actual = entries.find((entry) => entry.toLowerCase() === part.toLowerCase());
      if (!actual) return "";
      resolved.push(actual);
      current = path.join(current, actual);
    } catch {
      return "";
    }
  }
  return `/${resolved.join("/")}`;
}

function getAttr(attrs, name) {
  const match = attrs.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match?.[1] || "";
}

function youtubeFromEmbed(src) {
  const match = src.match(/youtube\.com\/embed\/([^?&"']+)/i);
  if (!match) return null;
  const id = match[1];
  return {
    id,
    url: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube.com/embed/${id}?rel=0`
  };
}

function extractOldDetailHtml(raw) {
  const start = raw.search(/<(div|section)\s+class=["'][^"']*\bbreadcumb-wrapper\b/i);
  const footer = raw.search(/<\?php\s+include\(['"]footer\.php['"]\)\s*\?>/i);
  const end = footer > start ? footer : raw.search(/<\/body>/i);
  if (start < 0) return "";
  return raw
    .slice(start, end > start ? end : undefined)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\?php[\s\S]*?\?>/g, " ")
    .replace(/\s(src|href)=["']assets\//gi, ' $1="/assets/')
    .replace(/\s(href)=["']book-an-appointment["']/gi, ' $1="/book-appointment"')
    .replace(/\s(href)=["']contact-us["']/gi, ' $1="/contact"')
    .replace(/\s(href)=["']service["']/gi, ' $1="/services"')
    .replace(/\saction=["'][^"']*formester\.com[^"']*["']/gi, ' action="/book-appointment"')
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

function isSkipText(text) {
  const lower = text.toLowerCase();
  return !text
    || text.length < 3
    || lower === "get a call back"
    || lower === "book an appointment"
    || lower === "about"
    || lower === "thumbnail"
    || lower.includes("google tag manager")
    || lower.includes("formester.com");
}

async function parseOldService(fileName) {
  const raw = await fs.readFile(path.join(oldRoot, fileName), "utf8");
  const detailHtml = extractOldDetailHtml(raw);
  const heroImageMatch = raw.slice(0, 9000).match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  const heroImage = heroImageMatch ? await assetPath(heroImageMatch[1]) : "";
  const withoutComments = raw.replace(/<!--[\s\S]*?-->/g, " ");
  const html = withoutComments
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");

  const title = cleanText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  const titleIndex = html.search(/<h1/i);
  const introArea = titleIndex >= 0 ? html.slice(titleIndex, titleIndex + 2500) : html.slice(0, 3000);
  const excerpt = cleanText(introArea.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");

  const sections = [];
  let current = null;
  let pendingImage = "";
  const images = [];
  const videos = [];

  const tokenRegex = /<(h[2-4]|p|li|iframe|img)\b([^>]*)>([\s\S]*?<\/\1>)?/gi;
  let match;
  while ((match = tokenRegex.exec(html))) {
    const tag = match[1].toLowerCase();
    const attrs = match[2] || "";
    const token = match[0];
    if (/testi-text|testi-name/i.test(attrs)) continue;

    if (tag === "iframe") {
      const video = youtubeFromEmbed(getAttr(attrs, "src"));
      if (video && !videos.some((item) => item.id === video.id)) videos.push(video);
      continue;
    }

    if (tag === "img") {
      const nextImage = await assetPath(getAttr(attrs, "src"));
      if (nextImage && !nextImage.includes("/icon/") && !nextImage.includes("twacha-logo")) {
        const altText = cleanText(getAttr(attrs, "alt"));
        const imageTitle = altText && !/thumbnail|icon|blog thumbnail/i.test(altText) ? altText : titleFromAsset(getAttr(attrs, "src"));
        if (current && imageTitle && !current.image && current.body.length === 0) {
          current.image = nextImage;
          current.body.push(imageTitle === current.heading ? `Visual reference for ${current.heading}.` : imageTitle);
        } else if (current && imageTitle && current.heading && /service|result|gallery|before|after|benefit|choose|candidate/i.test(current.heading)) {
          sections.push({
            heading: imageTitle,
            body: [current.heading],
            image: nextImage
          });
        }
        pendingImage = nextImage;
        if (!images.includes(nextImage)) images.push(nextImage);
      }
      continue;
    }

    const text = cleanText(token);
    if (isSkipText(text)) continue;

    if (tag.startsWith("h")) {
      if (text === title) continue;
      current = { heading: text, body: [], ...(pendingImage ? { image: pendingImage } : {}) };
      pendingImage = "";
      sections.push(current);
      continue;
    }

    if (!current) {
      current = { heading: "About this treatment", body: [] };
      sections.push(current);
    }
    if (!current.body.includes(text)) current.body.push(text);
  }

  const faqPairs = [];
  const faqRegex = /<button[^>]*class=["'][^"']*accordion-button[^"']*["'][^>]*>([\s\S]*?)<\/button>[\s\S]*?<div[^>]*class=["'][^"']*accordion-body[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
  while ((match = faqRegex.exec(html))) {
    const question = cleanText(match[1]);
    const answer = cleanText(match[2]);
    if (question && answer) faqPairs.push(`${question} ${answer}`);
  }
  if (faqPairs.length) {
    sections.push({ heading: "Frequently Asked Questions (FAQs)", body: faqPairs });
  }

  const testimonialLines = [];
  const testimonialRegex = /<p[^>]*class=["'][^"']*testi-text[^"']*["'][^>]*>([\s\S]*?)<\/p>[\s\S]*?<h3[^>]*class=["'][^"']*testi-name[^"']*["'][^>]*>([\s\S]*?)<\/h3>/gi;
  while ((match = testimonialRegex.exec(html))) {
    const quote = cleanText(match[1]).replace(/^"|"$/g, "");
    const name = cleanText(match[2]);
    if (quote) testimonialLines.push(name ? `${quote} - ${name}` : quote);
  }
  if (testimonialLines.length) {
    sections.push({ heading: "Testimonials: Real Stories from Satisfied Patients", body: testimonialLines });
  }

  const compactSections = sections
    .map((section) => ({
      ...section,
      body: section.body.filter((text, index, all) => text && all.indexOf(text) === index).slice(0, 12)
    }))
    .filter((section, index, all) => {
      const lastIndex = all.map((item) => item.heading).lastIndexOf(section.heading);
      return section.heading && section.body.length && lastIndex === index;
    })
    .slice(0, 28);

  const usedImages = new Set(compactSections.map((section) => section.image).filter(Boolean));
  const missingImageSections = images
    .filter((image) => !usedImages.has(image))
    .map((image) => ({
      heading: titleFromAsset(image),
      body: [`Visual reference for ${title || "this treatment"}.`],
      image
    }));

  const completeSections = [...compactSections, ...missingImageSections].slice(0, 40);

  return {
    title,
    excerpt,
    content: completeSections[0]?.body.join(" ") || excerpt,
    image: heroImage || images[0] || "",
    sections: completeSections,
    detailHtml,
    videos
  };
}

function serviceFileFor(slug) {
  return fileOverrides[slug] || `${slug}.php`;
}

async function updateDatabase(data, updatedServices, updatedVideos) {
  const serverUrl = `mysql://${process.env.DB_USER || "root"}:${process.env.DB_PASSWORD || ""}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "3306"}`;
  const database = process.env.DB_NAME || "twachaclinic";
  const server = await mysql.createConnection(serverUrl);
  await server.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await server.end();

  const connection = await mysql.createConnection(`${serverUrl}/${database}`);
  try {
    try {
      await connection.query("ALTER TABLE services ADD COLUMN detail_html LONGTEXT");
    } catch (error) {
      if (error.code !== "ER_DUP_FIELDNAME") throw error;
    }
    for (const service of updatedServices) {
      await connection.execute(
        "UPDATE services SET title = ?, image = ?, excerpt = ?, content = ?, sections = ?, detail_html = ?, meta_title = ?, meta_description = ? WHERE slug = ?",
        [service.title, service.image, service.excerpt, service.content, JSON.stringify(service.sections || []), service.detailHtml || null, service.metaTitle, service.metaDescription, service.slug]
      );
    }
    for (const [index, video] of updatedVideos.entries()) {
      await connection.execute(
        "INSERT INTO videos (id, platform, title, url, embed_url, thumbnail, service_slug, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), url = VALUES(url), embed_url = VALUES(embed_url), thumbnail = VALUES(thumbnail), service_slug = VALUES(service_slug)",
        [video.id, video.platform, video.title, video.url, video.embedUrl || null, video.thumbnail || null, video.serviceSlug || null, index]
      );
    }
  } finally {
    await connection.end();
  }
}

const data = JSON.parse(await fs.readFile(dataPath, "utf8"));
const updatedServices = [];
const mergedVideos = new Map((data.videos || []).map((video) => [video.id, video]));
const report = [];

for (const service of data.services) {
  const fileName = serviceFileFor(service.slug);
  try {
    await fs.access(path.join(oldRoot, fileName));
  } catch {
    report.push(`missing old file for ${service.slug}`);
    continue;
  }

  const old = await parseOldService(fileName);
  const nextService = {
    ...service,
    title: old.title || service.title,
    image: old.image || service.image,
    excerpt: old.excerpt || service.excerpt,
    content: old.content || service.content,
    sections: old.sections.length ? old.sections : service.sections,
    detailHtml: old.detailHtml || service.detailHtml,
    metaTitle: old.title ? `${old.title} | Twacha Skin Clinic` : service.metaTitle,
    metaDescription: old.excerpt || service.metaDescription
  };

  const serviceVideos = old.videos.map((video) => ({
    id: `${service.slug}-youtube-${video.id}`,
    platform: "youtube",
    title: `${nextService.title} video`,
    url: video.url,
    embedUrl: video.embedUrl,
    thumbnail: service.image,
    serviceSlug: service.slug
  }));

  nextService.videos = serviceVideos;
  data.services[data.services.findIndex((item) => item.slug === service.slug)] = nextService;
  updatedServices.push(nextService);
  for (const video of serviceVideos) mergedVideos.set(video.id, video);
  report.push(`${service.slug}: ${old.sections.length} sections, ${old.videos.length} video(s), image ${old.image ? "yes" : "no"}`);
}

data.videos = [...mergedVideos.values()];
await fs.writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

try {
  await updateDatabase(data, updatedServices, data.videos);
  report.push("database updated");
} catch (error) {
  report.push(`database update skipped/failed: ${error.message}`);
}

console.log(report.join("\n"));
