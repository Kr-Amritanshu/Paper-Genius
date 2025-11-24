# AI Research Paper Generator

## Overview

An AI-powered web application that generates complete academic research papers with authentic references. Users input a research topic, and the system produces a comprehensive paper with proper sections (Abstract, Introduction, Methods, Results, Discussion, Conclusion), real citations from academic papers fetched via the Semantic Scholar API, and downloadable PDFs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript and Vite
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system following academic aesthetics
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

**Design Philosophy**: 
- System-based design inspired by Notion, Overleaf, and Google Scholar
- Focus on academic credibility through clean, professional aesthetics
- Typography-first approach using Inter for UI, Crimson Text for paper content, and JetBrains Mono for technical elements
- Progressive disclosure during paper generation workflow
- Optimal reading experience with content-first layout (max-width constraints for readability)

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Development Server**: Vite middleware integration for HMR in development
- **Production**: Static file serving with bundled Express server
- **API Structure**: RESTful endpoint at `/api/generate` for paper generation

**Core Services**:
1. **Gemini AI Service** (`server/services/openaiService.ts`):
   - Uses Google Gemini 2.5 Flash model for research paper generation
   - Structured prompts that incorporate fetched references
   - Supports multiple citation styles (APA, IEEE, MLA)
   - Generates comprehensive 10+ page papers with extensive citations
   - Each section generated with specific word count requirements for academic rigor

2. **Semantic Scholar Integration** (`server/services/semanticScholar.ts`):
   - Fetches 20 real academic papers based on topic search
   - Returns title, authors, year, DOI, and URL for each reference
   - Provides authentic citations for inclusion in generated papers

3. **PDF Generation** (`server/utils/pdfGenerator.ts`):
   - Uses pdf-lib to create formatted PDFs
   - Implements proper typography hierarchy
   - Handles multi-page documents with automatic pagination
   - Formats references and citations appropriately

### Data Storage Solutions

**Current Implementation**: In-memory storage using Map-based repository pattern
- Interface-based design (`IStorage`) allows easy migration to persistent database
- Research papers stored with schema validation via Zod
- All CRUD operations abstracted through storage interface

**Schema Design**:
```typescript
ResearchPaper {
  id: string (UUID)
  topic: string
  title: string
  abstract: string
  introduction: string
  methods: string
  results: string
  discussion: string
  conclusion: string
  references: Reference[]
  citationStyle: 'APA' | 'IEEE' | 'MLA'
  generatedAt: string (ISO timestamp)
}
```

**Future Considerations**: 
- Drizzle ORM configuration present for PostgreSQL migration
- Neon serverless database integration ready
- Database URL expected via environment variable

### Authentication and Authorization

**Current State**: Not implemented
- Application currently operates without user authentication
- All generated papers accessible to anyone with the URL
- No user-specific data segregation

**Future Considerations**:
- Session management infrastructure present (connect-pg-simple)
- Express session middleware can be added for user sessions

### External Dependencies

**AI/ML Services**:
- **Google Gemini API**: Gemini 2.5 Flash model for research paper content generation (requires `GEMINI_API_KEY` environment variable)

**Academic Data**:
- **Semantic Scholar API**: Free academic paper search and metadata retrieval (no API key required)

**Database**:
- **Neon Serverless PostgreSQL**: Configuration ready via `DATABASE_URL` environment variable (optional, currently using in-memory storage)

**Development Tools**:
- **Replit-specific plugins**: Cartographer, dev banner, runtime error overlay for Replit IDE integration
- **Drizzle Kit**: Database schema management and migrations

**UI Libraries**:
- **Radix UI**: Comprehensive set of accessible UI primitives
- **shadcn/ui**: Pre-built component library with Tailwind styling
- **Lucide React**: Icon library

**Utilities**:
- **Axios**: HTTP client for external API requests
- **pdf-lib**: Client-side and server-side PDF generation
- **date-fns**: Date formatting and manipulation
- **Zod**: Runtime schema validation and type safety

### Design Patterns and Principles

**Separation of Concerns**:
- Services layer abstracts external API interactions
- Utils layer handles cross-cutting concerns (PDF generation)
- Storage layer provides data access abstraction
- Routes layer handles HTTP request/response

**Type Safety**:
- Shared schema definitions between client and server
- Zod schemas provide runtime validation and TypeScript types
- Strict TypeScript configuration with no implicit any

**Progressive Enhancement**:
- Paper preview before download
- Collapsible sections for better UX
- Multiple citation style options
- Error handling with user-friendly toast notifications

**Scalability Considerations**:
- Stateless API design allows horizontal scaling
- Storage interface enables migration to distributed database
- Async operations throughout for non-blocking I/O