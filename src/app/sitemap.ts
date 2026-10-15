import type { MetadataRoute } from "next";
import { getContent } from "@/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const content = getContent("en");
  return [
    { url: SITE_URL, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/ringkas`, lastModified: now, priority: 0.9 },
    ...content.projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, lastModified: now, priority: 0.8 })),
    ...content.templates.map((t) => ({ url: `${SITE_URL}${t.link}`, lastModified: now, priority: 0.4 })),
  ];
}
