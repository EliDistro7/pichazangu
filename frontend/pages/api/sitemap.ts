import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Fetch dynamic event pages
const fetchEvents = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/events`);
    const events = res.data;

    return events.map((event: any) => ({
      url: `https://pichazangu.store/evento/${event._id}`,
      lastmod: event.updatedAt.split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// Generate XML Sitemap
const generateSiteMap = async () => {
  const staticPages = [
    { url: "https://pichazangu.store/", lastmod: new Date().toISOString().split("T")[0] },
  ];

  const eventPages = await fetchEvents();
  const allPages = [...staticPages, ...eventPages];

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allPages
      .map(
        (page) => `
    <url>
      <loc>${page.url}</loc>
      <lastmod>${page.lastmod}</lastmod>
    </url>
    `
      )
      .join("")}
  </urlset>`;
};

// API route to serve the sitemap
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sitemap = await generateSiteMap();
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(sitemap);
}
