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

Generate a complete research paper with the following sections. Each section should be EXTENSIVE and DETAILED to ensure the final paper is 10+ pages when converted to PDF:

1. **Title**: Create a compelling, academic title for this research paper
2. **Abstract**: 200-300 words summarizing the entire paper with key findings
3. **Introduction**: Comprehensive introduction (800-1200 words) with extensive background, historical context, literature review, research gap identification, research questions, and objectives. Include multiple in-text citations from the provided references.
4. **Methods**: Detailed methodology section (700-1000 words) explaining research design, theoretical framework, data collection methods, sampling strategies, analysis techniques, and validation procedures. Include citations where appropriate.
5. **Results**: Extensive presentation of findings (900-1200 words) with detailed analysis, patterns, trends, statistical insights, and comparisons with existing literature. Reference multiple studies from the provided references.
6. **Discussion**: In-depth interpretation (900-1200 words) of results, theoretical implications, practical applications, comparison with existing literature, limitations of the study, and alternative explanations. Use citations extensively throughout.
7. **Conclusion**: Comprehensive summary (500-700 words) of key findings, theoretical contributions, practical implications, study limitations, recommendations for future research, and final thoughts.

CRITICAL REQUIREMENTS:
- Each section MUST be substantial and detailed to achieve 10+ page length
- Use in-text citations extensively throughout ALL sections (e.g., for APA: (Author, Year) or Author (Year))
- Cite at least 15-20 different references throughout the paper
- Include specific details, examples, and thorough explanations in every section
- The paper should be academically rigorous, coherent, and publication-quality
- Write in formal academic language with varied sentence structure
- Each paragraph should be 4-6 sentences minimum
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
