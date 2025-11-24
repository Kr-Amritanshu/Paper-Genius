import axios from 'axios';

export interface Reference {
  title: string;
  authors: string[];
  year: number;
  doi?: string;
  url?: string;
}

export async function fetchReferences(topic: string, limit: number = 10): Promise<Reference[]> {
  try {
    const response = await axios.get('https://api.semanticscholar.org/graph/v1/paper/search', {
      params: {
        query: topic,
        limit,
        fields: 'title,authors,year,externalIds,url',
      },
      timeout: 10000,
    });

    if (!response.data || !response.data.data) {
      return [];
    }

    const papers = response.data.data;
    return papers.map((paper: any) => ({
      title: paper.title || 'Untitled',
      authors: paper.authors ? paper.authors.map((a: any) => a.name) : ['Unknown Author'],
      year: paper.year || new Date().getFullYear(),
      doi: paper.externalIds?.DOI,
      url: paper.url,
    }));
  } catch (error) {
    console.error('Error fetching references from Semantic Scholar:', error);
    return [];
  }
}
