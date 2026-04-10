import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const research = await getCollection("research", ({ data }) => data.status === "published");

  return rss({
    title: "Kinetic Forms Research",
    description: "Deep technical research on AI-native development, agent architecture, and building with AI.",
    site: context.site!,
    items: research
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((entry) => ({
        title: entry.data.title,
        description: entry.data.description,
        pubDate: entry.data.date,
        link: `/research/${entry.id}`,
      })),
  });
}
