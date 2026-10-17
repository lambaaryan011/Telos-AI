/**
 * Client-side PDF & document text extractor using PDF.js
 */

declare global {
  interface Window {
    pdfjsLib?: any;
    'pdfjs-dist/build/pdf'?: any;
  }
}

// Ensure PDF.js is loaded and worker configured
async function getPdfJsLib(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction is only supported in browser environments.');
  }

  if (window.pdfjsLib) {
    if (!window.pdfjsLib.GlobalWorkerOptions?.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions = window.pdfjsLib.GlobalWorkerOptions || {};
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    return window.pdfjsLib;
  }

  if (window['pdfjs-dist/build/pdf']) {
    window.pdfjsLib = window['pdfjs-dist/build/pdf'];
    window.pdfjsLib.GlobalWorkerOptions = window.pdfjsLib.GlobalWorkerOptions || {};
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    return window.pdfjsLib;
  }

  // Dynamically load if not present yet
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="pdf.min.js"]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const lib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
        if (lib) {
          lib.GlobalWorkerOptions = lib.GlobalWorkerOptions || {};
          lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(lib);
        } else {
          reject(new Error('Failed to initialize PDF.js'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js from CDN'));
      document.head.appendChild(script);
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const lib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
        if (lib) {
          clearInterval(interval);
          lib.GlobalWorkerOptions = lib.GlobalWorkerOptions || {};
          lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(lib);
        } else if (attempts > 30) {
          clearInterval(interval);
          reject(new Error('Timeout waiting for PDF.js to load'));
        }
      }, 100);
    }
  });
}

/**
 * Extracts 100% of the textual content from an uploaded PDF file
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjs = await getPdfJsLib();
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
    cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pagesText: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items as Array<{ str: string; transform: number[]; hasEOL?: boolean }>;

    if (!items || items.length === 0) continue;

    // Group items by line based on their vertical coordinate (transform[5])
    let lastY: number | null = null;
    let lineStr = '';
    const pageLines: string[] = [];

    for (const item of items) {
      const text = item.str;
      if (!text && !item.hasEOL) continue;

      const currentY = item.transform ? Math.round(item.transform[5]) : null;

      if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) {
        // New line detected
        if (lineStr.trim()) {
          pageLines.push(lineStr.trim());
        }
        lineStr = text;
      } else {
        // Same line: add space if needed
        if (lineStr && !lineStr.endsWith(' ') && !text.startsWith(' ') && text) {
          lineStr += ' ' + text;
        } else {
          lineStr += text;
        }
      }

      if (currentY !== null) {
        lastY = currentY;
      }

      if (item.hasEOL && lineStr.trim()) {
        pageLines.push(lineStr.trim());
        lineStr = '';
      }
    }

    if (lineStr.trim()) {
      pageLines.push(lineStr.trim());
    }

    pagesText.push(pageLines.join('\n'));
  }

  const fullText = pagesText.join('\n\n').trim();
  return fullText;
}

/**
 * Reads simple text from DOCX (extracting text nodes) or plain TXT files
 */
export async function extractTextFromDocxOrText(file: File): Promise<string> {
  if (file.name.endsWith('.txt') || file.type.startsWith('text/')) {
    return await file.text();
  }

  // For DOCX files, if in browser, attempt quick raw string decoding of text blocks
  try {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const content = decoder.decode(buffer);

    // Extract text between <w:t> tags commonly found in Word documents
    const matches = content.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
    if (matches && matches.length > 0) {
      const extractedWords = matches
        .map(m => m.replace(/<[^>]+>/g, ''))
        .filter(w => w.trim().length > 0);
      
      return extractedWords.join(' ').replace(/\s{2,}/g, '\n');
    }
  } catch (err) {
    console.warn('DOCX text extraction fallback:', err);
  }

  return '';
}
