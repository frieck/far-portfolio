import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const profile = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/profile",
  }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    lead: z.string(),
    yearsOfExperience: z.number(),
    pillars: z.array(z.string()).length(3),
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
    current: z.boolean().default(false),
    role: z.string(),
    company: z.string(),
    period: z.string(),
    location: z.string().optional(),
    technologies: z.array(z.string()),
    highlights: z.array(z.string()),
    caseStudy: reference("cases").optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
  }),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    tagline: z.string(),
    repoUrl: z.string().url(),
    status: z.string().optional(),
    stack: z.array(z.string()),
    highlights: z.array(z.string()),
  }),
});

const cases = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/cases",
  }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    summary: z.string(),
    // Longer opening for the case page; the card uses `summary`.
    intro: z.string().optional(),
    company: z.string(),
    // Contracting company, e.g. "e-Core" renders as "Atlassian via e-Core".
    via: z.string().optional(),
    role: z.string(),
    period: z.string().optional(),
    metric: z
      .object({
        label: z.string(),
        // Scope of the measurement, shown with the metric on card and page.
        caption: z.string().optional(),
        before: z.string(),
        after: z.string(),
      })
      .optional(),
    stack: z.array(z.string()).optional(),
    // Used instead of `stack` when the technologies are not confirmed.
    focus: z.array(z.string()).optional(),
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

export const collections = {
  profile,
  competencies,
  experience,
  projects,
  cases,
  education,
};
