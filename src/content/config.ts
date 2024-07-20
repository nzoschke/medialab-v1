import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
    draft: z.boolean().optional(),
    section: z.string(),
    title: z.string(),
    order: z.number(),
  }),
});

export const collections = {
  docs,
};
