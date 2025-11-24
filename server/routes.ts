import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResearchPaperSchema } from "@shared/schema";
import { fetchReferences } from "./services/semanticScholar";
import { generateResearchPaper } from "./services/openaiService";
import { generatePDF } from "./utils/pdfGenerator";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate", async (req, res) => {
    try {
      const { topic, citationStyle = 'APA' } = req.body;

      if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
        return res.status(400).json({ error: 'Topic is required' });
      }

      const references = await fetchReferences(topic, 20);

      if (references.length === 0) {
        return res.status(404).json({ 
          error: 'No references found for this topic. Please try a different topic.' 
        });
      }

      const generatedContent = await generateResearchPaper(topic, references, citationStyle);

      const paperData = {
        topic,
        title: generatedContent.title,
        abstract: generatedContent.abstract,
        introduction: generatedContent.introduction,
        methods: generatedContent.methods,
        results: generatedContent.results,
        discussion: generatedContent.discussion,
        conclusion: generatedContent.conclusion,
        references,
        citationStyle,
      };

      const validatedPaper = insertResearchPaperSchema.parse(paperData);
      const savedPaper = await storage.createPaper(validatedPaper);

      res.json(savedPaper);
    } catch (error) {
      console.error('Error generating paper:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to generate research paper' 
      });
    }
  });

  app.get("/api/papers/:id/pdf", async (req, res) => {
    try {
      const { id } = req.params;
      const paper = await storage.getPaper(id);

      if (!paper) {
        return res.status(404).json({ error: 'Paper not found' });
      }

      const pdfBuffer = await generatePDF(paper);

      const safeFilename = paper.title
        .replace(/[^a-z0-9\s-]/gi, '')
        .replace(/\s+/g, '_')
        .toLowerCase()
        .substring(0, 100);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename || 'research_paper'}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to generate PDF' 
      });
    }
  });

  app.get("/api/papers", async (req, res) => {
    try {
      const papers = await storage.getAllPapers();
      res.json(papers);
    } catch (error) {
      console.error('Error fetching papers:', error);
      res.status(500).json({ error: 'Failed to fetch papers' });
    }
  });

  app.get("/api/papers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const paper = await storage.getPaper(id);

      if (!paper) {
        return res.status(404).json({ error: 'Paper not found' });
      }

      res.json(paper);
    } catch (error) {
      console.error('Error fetching paper:', error);
      res.status(500).json({ error: 'Failed to fetch paper' });
    }
  });

  app.delete("/api/papers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePaper(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Paper not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting paper:', error);
      res.status(500).json({ error: 'Failed to delete paper' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
