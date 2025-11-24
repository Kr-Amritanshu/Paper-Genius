import OpenAI from "openai";
import type { Reference } from "./semanticScholar";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert academic research paper writer. Generate well-structured, professionally written research papers with proper citations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

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
    console.error('Error generating research paper with OpenAI:', error);
    throw new Error('Failed to generate research paper');
  }
}
