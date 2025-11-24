import { type ResearchPaper, type InsertResearchPaper } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getPaper(id: string): Promise<ResearchPaper | undefined>;
  getAllPapers(): Promise<ResearchPaper[]>;
  createPaper(paper: InsertResearchPaper): Promise<ResearchPaper>;
  deletePaper(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private papers: Map<string, ResearchPaper>;

  constructor() {
    this.papers = new Map();
  }

  async getPaper(id: string): Promise<ResearchPaper | undefined> {
    return this.papers.get(id);
  }

  async getAllPapers(): Promise<ResearchPaper[]> {
    return Array.from(this.papers.values()).sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }

  async createPaper(insertPaper: InsertResearchPaper): Promise<ResearchPaper> {
    const id = randomUUID();
    const paper: ResearchPaper = {
      ...insertPaper,
      id,
      generatedAt: new Date().toISOString(),
    };
    this.papers.set(id, paper);
    return paper;
  }

  async deletePaper(id: string): Promise<boolean> {
    return this.papers.delete(id);
  }
}

export const storage = new MemStorage();
