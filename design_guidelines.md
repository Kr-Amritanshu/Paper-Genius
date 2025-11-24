# Design Guidelines: AI Research Paper Generator

## Design Approach
**System-Based:** Drawing from Notion's clarity, Overleaf's academic professionalism, and Google Scholar's trust signals. Prioritizes content hierarchy, readability, and scholarly aesthetics over decorative elements.

**Core Principles:**
- Academic credibility through clean, professional design
- Progressive disclosure during generation workflow
- Content-first with optimal reading experience
- Minimal cognitive load with clear affordances

## Typography System

**Font Families (Google Fonts CDN):**
- UI/Headings: Inter (weights: 400, 500, 600, 700)
- Paper Content: Crimson Text (weights: 400, 600) - superior readability for long-form
- Technical: JetBrains Mono (weight: 400) - citations, DOIs, code blocks

**Type Scale:**
- Hero title: text-4xl md:text-5xl font-bold
- Section headers: text-2xl font-semibold
- Subsections: text-xl font-semibold
- Body UI: text-base
- Paper preview: text-lg leading-relaxed
- Metadata/labels: text-sm
- Captions: text-xs

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12
- Tight groups: gap-2, p-2
- Standard: gap-4, p-4 (forms, cards)
- Sections: py-6, px-6
- Major sections: py-12, px-8
- Hero area: py-16

**Container Strategy:**
- Main app: max-w-7xl mx-auto px-4
- Input form: max-w-2xl centered
- Paper preview: max-w-4xl (optimal academic reading width)
- Two-column preview mode: max-w-6xl with grid-cols-2 gap-8

## Page Structure

**Hero Section:**
Clean, typography-focused header with subtle academic texture (no large hero image - inappropriate for productivity tool)
- App name: text-4xl md:text-5xl font-bold, centered
- Tagline: text-xl text-muted, centered, max-w-2xl
- Subtle background: Very faint grid pattern or abstract geometric shapes suggesting academic structure
- Height: py-16 (not full viewport)

**Main Application Flow:**

1. **Input Section** (py-12, bg-subtle):
   - Large textarea (min-h-32, rounded-lg, border-2)
   - Placeholder: "Enter your research topic... (e.g., 'Impact of quantum computing on cryptographic security')"
   - Character counter (text-sm, text-right)
   - Helper text below with tips icon
   - Settings row: Citation style dropdown (APA/IEEE/MLA) + Paper length selector (Short/Medium/Comprehensive)

2. **Generation Controls** (py-6):
   - Large primary button: "Generate Research Paper" (px-12 py-4, text-lg, rounded-lg)
   - Advanced options disclosure: Parameters, tone, depth controls

3. **Progress Indicator** (py-8, appears during generation):
   - Multi-step progress bar with icons
   - Steps: "Analyzing Topic" → "Fetching References" → "Generating Sections" → "Formatting Citations" → "Creating PDF"
   - Estimated time remaining with animated spinner
   - Current step description in text-base

4. **Preview Section** (py-8, border-t):
   - Tab navigation: "Preview" | "References" | "Outline"
   - Paper preview card with shadow-lg, rounded-lg, p-8
   - Section toggles: Collapsible Abstract, Introduction, Methods, Results, Discussion, Conclusion
   - Each section: Clear heading (text-xl font-semibold mb-4), content with proper paragraph spacing (space-y-4)
   - In-line citation highlighting on hover
   - Word count badge per section

5. **Action Bar** (py-6, sticky bottom):
   - Primary: "Download PDF" button (px-8 py-3, with download icon)
   - Secondary: "Regenerate" button, "Edit & Customize" button
   - Share options: Copy link, export to LaTeX

## Component Library

**Input Components:**
- Textarea: rounded-lg, border-2, focus:ring-2, p-4, font-medium
- Dropdowns: Custom styled with chevron icon, rounded-md, border
- Toggle switches: For abstract inclusion, reference count, etc.

**Buttons:**
- Primary: Full padding (px-8 py-3), rounded-lg, font-semibold, text-base, shadow-md
- Secondary: Border variant, px-6 py-2.5, rounded-md
- Tertiary: Ghost style, px-4 py-2, hover:bg-subtle

**Cards:**
- Paper preview: border, shadow-lg, rounded-lg, p-8, bg-white
- Section cards: border-l-4 (accent border), p-6, mb-4, rounded-r-lg
- Reference cards: p-4, border-b, hover:bg-subtle, cursor-pointer

**Status Indicators:**
- Success toast: Checkmark icon, green accent, auto-dismiss
- Error state: Red accent, retry button, helpful message
- Warning: Yellow accent for suggestions/tips
- Loading skeleton: Animated pulse for preview sections

**Citation Display:**
- In-text: Superscript numbers [1] or (Author, Year), clickable links
- Reference list: Numbered, hanging indent (pl-6, -indent-6), DOI as link with external icon
- Hover preview: Small popover showing full citation on hover

## Academic-Specific Elements

**Paper Preview Formatting:**
- Title: text-3xl font-bold, text-center, mb-2
- Authors: text-sm, text-center, mb-6, italic
- Abstract: Bordered box (border-l-4), p-6, bg-subtle, mb-8, italic
- Section headings: text-xl font-semibold, border-b-2, pb-2, mb-4
- Figures/Tables placeholders: Border-dashed, p-8, text-center, bg-subtle
- Footnotes: text-xs, border-t, pt-4, mt-8

**Reference Management:**
- Search references: Input with magnifying glass icon
- Filter by: Author, Year, Source type
- Citation count badge
- "Add custom reference" button

## Responsive Behavior

- Desktop (lg+): Two-column preview option, side-by-side settings
- Tablet (md): Full-width preview, stacked controls
- Mobile: Single column, touch-optimized buttons (min-h-12), collapsible sections default closed

## Micro-interactions (Minimal)

- Button press: Subtle scale transform (scale-95)
- Section expand: Smooth height transition (transition-all duration-300)
- Citation hover: Gentle background highlight
- Progress bar: Smooth width animation
- No scroll animations, parallax, or unnecessary effects

## Images

**No large hero image.** Instead:
- Subtle background texture in header: Abstract academic patterns (light grid, geometric shapes)
- Icon library: Heroicons for UI elements (download, expand, settings, checkmark)
- Placeholder images for future features: "Sample paper preview" thumbnails in empty states

This creates a professional, scholarly tool prioritizing content clarity and functional efficiency while maintaining visual polish appropriate for academic work.