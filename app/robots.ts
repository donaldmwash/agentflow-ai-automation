import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/workspace/", "/settings/"] }],
    sitemap: "https://agentflow-ai-automation.vercel.app/sitemap.xml",
  };
}
