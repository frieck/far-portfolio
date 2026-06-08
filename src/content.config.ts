import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const profile = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/profile",
  }),
  schema: z.object({
    bootMessage: z.string(),
    name: z.string(),
    role: z.string(),
    lead: z.string(),
    email: z.string().email(),
    linkedin: z.string().url(),
    location: z.string(),
    phone: z.string().optional(),
  }),
});

const competencies = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/competencies",
  }),
  schema: z.object({
    title: z.string(),
    items: z.array(z.string()),
    "aditional-technologies": z.array(z.string()).optional(),
  }),
});

const experience = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/experience",
  }),
  schema: z.object({
    startDate: z.coerce.date(),
    role: z.string(),
    company: z.string(),
    period: z.string(),
    location: z.string().optional(),
    technologies: z.array(z.string()),
    highlights: z.array(z.string()),
  }),
});

const education = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/education",
  }),
  schema: z.object({
    order: z.number(),
    degree: z.string(),
    institution: z.string(),
    period: z.string(),
    location: z.string(),
  }),
});

export const collections = { profile, competencies, experience, education };
