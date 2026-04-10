import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const research = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/research" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    status: z.enum(["draft", "published"]),
    ogImage: z.string().optional(),
    format: z.enum(["article", "research", "guide"]).default("article"),
  }),
});

export const collections = { research };
