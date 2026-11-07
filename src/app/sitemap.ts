import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

const pages = ["", "/community", "/events", "/gallery", "/partners"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({ url: `${SITE_URL}${path}` }));
}
