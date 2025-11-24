import { z } from "zod";

export const researchPaperSchema = z.object({
  id: z.string(),
  topic: z.string(),
  title: z.string(),
  abstract: z.string(),
  introduction: z.string(),
  methods: z.string(),
  results: z.string(),
  discussion: z.string(),
  conclusion: z.string(),
  references: z.array(z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    doi: z.string().optional(),
    url: z.string().optional(),
  })),
  citationStyle: z.enum(['APA', 'IEEE', 'MLA']).default('APA'),
  generatedAt: z.string(),
});

export const insertResearchPaperSchema = researchPaperSchema.omit({ id: true, generatedAt: true });

export type ResearchPaper = z.infer<typeof researchPaperSchema>;
export type InsertResearchPaper = z.infer<typeof insertResearchPaperSchema>;
