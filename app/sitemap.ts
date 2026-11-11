import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://agentflow-ai-automation.vercel.app/", changeFrequency: "monthly", priority: 1 }];
}
