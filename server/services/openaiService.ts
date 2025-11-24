import { GoogleGenAI } from "@google/genai";
import type { Reference } from "./semanticScholar";

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

// Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GeneratedPaper {
  title: string;
  abstract: string;
  introduction: string;
  methods: string;
  results: string;
  discussion: string;
  conclusion: string;
}

export async function generateResearchPaper(
  topic: string,
  references: Reference[],
  citationStyle: 'APA' | 'IEEE' | 'MLA' = 'APA'
): Promise<GeneratedPaper> {
  const referencesText = references.map((ref, idx) => {
    return `[${idx + 1}] ${ref.title} by ${ref.authors.join(', ')} (${ref.year})${ref.doi ? ` DOI: ${ref.doi}` : ''}`;
  }).join('\n');

  const prompt = `You are a research paper writing assistant. Generate a comprehensive, well-structured research paper on the following topic: "${topic}".

Use the following REAL references in your paper. You MUST cite these references throughout the paper using in-text citations in ${citationStyle} format:

${referencesText}

Generate a complete research paper with the following sections. Each section should be substantial and well-developed:

1. **Title**: Create a compelling, academic title for this research paper
2. **Abstract**: 150-250 words summarizing the entire paper
3. **Introduction**: Comprehensive introduction with background, context, and research objectives. Include in-text citations.
4. **Methods**: Detailed methodology section explaining research approach, data collection, and analysis methods. Include citations where appropriate.
5. **Results**: Present hypothetical but realistic findings and data relevant to the topic. Reference similar studies.
6. **Discussion**: Interpret the results, compare with existing literature, discuss implications. Use citations extensively.
7. **Conclusion**: Summarize findings, discuss limitations, and suggest future research directions.

IMPORTANT:
- Use in-text citations throughout (e.g., for APA: (Author, Year) or Author (Year))
- Make citations relevant to the content
- The paper should be academically rigorous and coherent
- Each section should be at least 200 words
- Respond in JSON format with keys: title, abstract, introduction, methods, results, discussion, conclusion`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are an expert academic research paper writer. Generate well-structured, professionally written research papers with proper citations.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            abstract: { type: "string" },
            introduction: { type: "string" },
            methods: { type: "string" },
            results: { type: "string" },
            discussion: { type: "string" },
            conclusion: { type: "string" },
          },
          required: ["title", "abstract", "introduction", "methods", "results", "discussion", "conclusion"],
        },
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || '{}');

    return {
      title: result.title || `Research Paper on ${topic}`,
      abstract: result.abstract || '',
      introduction: result.introduction || '',
      methods: result.methods || '',
      results: result.results || '',
      discussion: result.discussion || '',
      conclusion: result.conclusion || '',
    };
  } catch (error) {
    console.error('Error generating research paper with Gemini:', error);
    throw new Error('Failed to generate research paper');
  }
}
