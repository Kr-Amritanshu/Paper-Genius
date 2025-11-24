# Design Guidelines: AI Research Paper Generator

## Design Approach
**Selected Approach:** Design System - Academic Productivity Focus

Drawing inspiration from professional research tools like Overleaf, Notion, and Google Scholar. The design emphasizes clarity, readability, and trust - essential for academic tools. Focus on content hierarchy and functional efficiency over decorative elements.

## Core Design Principles
- **Academic Professionalism:** Clean, scholarly aesthetic that builds trust
- **Content-First:** Typography and spacing optimized for reading long-form academic text
- **Progressive Disclosure:** Show information as needed during the generation process
- **Minimal Cognitive Load:** Clear affordances, obvious next steps

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts) - UI elements, headings, labels
- Secondary: Georgia or Crimson Text - Generated paper preview content for readability
- Monospace: JetBrains Mono - Technical elements, citations, DOIs

**Type Scale:**
- Headings: text-3xl (main title), text-2xl (section headers), text-xl (subsections)
- Body: text-base (16px) for forms and UI, text-lg for paper preview
- Supporting: text-sm for labels, citations, metadata
- Weight hierarchy: font-semibold for headers, font-medium for emphasis, font-normal for body

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Micro spacing: p-2, gap-2 (8px) - tight groups, inline elements
- Standard spacing: p-4, gap-4 (16px) - form fields, cards
- Section spacing: p-6, py-6 (24px) - component padding
- Major spacing: p-8, py-8 (32px) - page sections, containers

**Container Strategy:**
- Max width: max-w-4xl for main content (academic papers are narrow for readability)
- Form width: max-w-2xl centered
- Full-width preview: max-w-6xl for side-by-side previews

## Page Structure

**Single-Page Application Layout:**
1. **Header:** Simple, centered branding with app name and tagline
2. **Input Section:** Prominent topic input with clear labeling
3. **Generation Controls:** Generate button, citation style selector (APA/IEEE dropdown)
4. **Progress Indicator:** Loading states with descriptive status (Fetching references, Generating content, Creating PDF)
5. **Preview Section:** Expandable/collapsible paper preview with formatted sections
6. **Action Area:** Download PDF button, regenerate option

**Vertical Flow:**
- py-8 for header
- py-12 for input section (hero-like prominence)
- py-6 for controls
- py-8 for preview
- py-6 for actions

## Component Library

**Input Field:**
- Large text area (min-h-24) with placeholder "Enter your research topic..."
- Border styling with focus states
- Helper text below: "Be specific for better results (e.g., 'Machine learning in climate prediction')"

**Buttons:**
- Primary: Generate Paper - prominent, full padding (px-8 py-3)
- Secondary: Download PDF - medium prominence (px-6 py-2.5)
- Ghost: Regenerate, Clear - minimal styling

**Loading States:**
- Spinner with progress text
- Step indicators: "1. Fetching references from Semantic Scholar" → "2. Generating paper sections" → "3. Formatting PDF"
- Estimated time remaining

**Preview Card:**
- Border, subtle shadow
- Organized sections with clear headings
- Collapsible sections using disclosure triangles
- Typography matching final PDF: section headings in text-xl font-semibold, content in text-base
- References list with hanging indent, DOI links

**Citation Style Selector:**
- Simple dropdown: "Citation Style: APA" with options for IEEE
- Placed near generate button

**Status Messages:**
- Success: Subtle background, checkmark icon
- Error: Clear error messaging with retry options
- Info: Helpful tips during idle state

## Academic-Specific Elements

**Paper Preview Structure:**
- Title: text-2xl font-bold, centered
- Author placeholder: text-sm, centered, mb-6
- Sections: Clear visual hierarchy with consistent spacing
- Abstract: Italic styling or subtle background to differentiate
- References: Numbered or formatted per style, hanging indent (ml-6)

**Citation Display:**
- In-text citations: [1], [2] or (Author, Year) depending on style
- Reference list: Clear formatting with all metadata visible
- DOI links: Subtle, not overwhelming

## Accessibility & Usability

**Form Accessibility:**
- Proper label associations
- Focus indicators on all interactive elements
- Keyboard navigation support
- Clear error messages tied to inputs

**Content Readability:**
- Line height: leading-relaxed (1.625) for paper preview
- Optimal line length: max 75 characters (max-w-prose for preview content)
- Sufficient contrast ratios for all text

## Performance Indicators

**Loading Experience:**
- Skeleton screens for preview area during generation
- Progress bar with percentage
- Disable generate button during processing to prevent double-submission
- Keep UI responsive, show status updates every few seconds

## Responsive Behavior

- Desktop (lg): Side-by-side preview option, wider controls
- Tablet (md): Stacked layout, full-width preview
- Mobile: Single column, touch-friendly buttons (min-height: 44px)

## Micro-interactions

**Minimal Animation:** Use sparingly
- Button press: Subtle scale or opacity change
- Section expand/collapse: Smooth height transition (transition-all duration-200)
- Loading spinner: Smooth rotation
- Avoid: Parallax, scroll-triggered animations, unnecessary flourishes

This design creates a professional, trustworthy academic tool that prioritizes content and functionality while maintaining visual clarity and usability.