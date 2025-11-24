import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { ResearchPaper } from '@shared/schema';

export async function generatePDF(paper: ResearchPaper): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanItalicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const pageWidth = 612; // 8.5 inches * 72
  const pageHeight = 792; // 11 inches * 72
  const margin = 72; // 1 inch margins
  const contentWidth = pageWidth - 2 * margin;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;

  const lineHeight = 14;
  const titleSize = 18;
  const headingSize = 14;
  const bodySize = 11;

  function addNewPageIfNeeded(spaceNeeded: number) {
    if (yPosition - spaceNeeded < margin) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;
      return true;
    }
    return false;
  }

  function drawText(text: string, fontSize: number, font: any, options: { bold?: boolean, italic?: boolean, centered?: boolean } = {}) {
    const lines = splitTextIntoLines(text, contentWidth, fontSize, font);
    
    lines.forEach(line => {
      addNewPageIfNeeded(lineHeight + 5);
      
      const textWidth = font.widthOfTextAtSize(line, fontSize);
      const xPosition = options.centered ? (pageWidth - textWidth) / 2 : margin;
      
      currentPage.drawText(line, {
        x: xPosition,
        y: yPosition,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= lineHeight;
    });
  }

  function splitTextIntoLines(text: string, maxWidth: number, fontSize: number, font: any): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  function addSection(title: string, content: string) {
    yPosition -= 10;
    addNewPageIfNeeded(headingSize + 20);
    
    drawText(title, headingSize, timesRomanBoldFont);
    yPosition -= 5;
    
    if (content) {
      drawText(content, bodySize, timesRomanFont);
    }
    
    yPosition -= 10;
  }

  // Title
  drawText(paper.title, titleSize, timesRomanBoldFont, { centered: true });
  yPosition -= 20;

  // Abstract
  addSection('Abstract', paper.abstract);

  // Introduction
  addSection('Introduction', paper.introduction);

  // Methods
  addSection('Methods', paper.methods);

  // Results
  addSection('Results', paper.results);

  // Discussion
  addSection('Discussion', paper.discussion);

  // Conclusion
  addSection('Conclusion', paper.conclusion);

  // References
  yPosition -= 20;
  addNewPageIfNeeded(headingSize + 40);
  drawText('References', headingSize, timesRomanBoldFont);
  yPosition -= 10;

  paper.references.forEach((ref, idx) => {
    let refText = '';
    
    if (paper.citationStyle === 'APA') {
      refText = `${ref.authors.join(', ')} (${ref.year}). ${ref.title}.`;
      if (ref.doi) refText += ` https://doi.org/${ref.doi}`;
    } else if (paper.citationStyle === 'IEEE') {
      refText = `[${idx + 1}] ${ref.authors.join(', ')}, "${ref.title}," ${ref.year}.`;
      if (ref.doi) refText += ` DOI: ${ref.doi}`;
    } else { // MLA
      refText = `${ref.authors.join(', ')}. "${ref.title}." ${ref.year}.`;
      if (ref.url) refText += ` ${ref.url}`;
    }
    
    const lines = splitTextIntoLines(refText, contentWidth - 20, bodySize, timesRomanFont);
    addNewPageIfNeeded((lines.length * lineHeight) + 5);
    
    currentPage.drawText(`[${idx + 1}]`, {
      x: margin,
      y: yPosition,
      size: bodySize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    
    lines.forEach((line, lineIdx) => {
      currentPage.drawText(line, {
        x: margin + 30,
        y: yPosition,
        size: bodySize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    });
    
    yPosition -= 5;
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
