import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// `photo` is a plain string path under /photos, not astro:assets `image()`.
// All three editing surfaces write a string; image() would resolve relative to the
// content file and tie the stored format to Astro, which the Eleventy fallback
// named in ADR 0002 could not read.
const photoPath = z.string().min(1, 'a Service or Project must have a photo');

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/services' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    photo: photoPath,
    summary: z.string(),
    published: z.boolean().default(true),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    roomType: z.string(),
    location: z.string(),
    order: z.number(),
    photo: photoPath,
    gallery: z.array(z.string()).default([]),
    published: z.boolean().default(true),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    heading: z.string().optional(),
    heroHeadline: z.string().optional(),
    heroSubhead: z.string().optional(),
    heroCta: z.string().optional(),
  }),
});

export const collections = { services, projects, pages };
