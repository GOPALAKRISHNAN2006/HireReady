/**
 * High-Precision Resume PDF Exporter Utility
 * Provides both:
 * 1. Direct one-click .pdf file generation & download via html2pdf.js
 * 2. High-fidelity browser print & save-as-PDF with strict A4 styling
 */

import toast from 'react-hot-toast';

/**
 * Sanitizes a string for use as a file name
 */
export function sanitizeFilename(name = 'Resume') {
  return (name || 'Resume')
    .toString()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 60);
}

/**
 * Direct PDF File Download using html2pdf.js
 * @param {HTMLElement} element - The DOM element containing the resume preview (e.g. #printable-resume)
 * @param {string} filename - Target file name without extension
 * @param {Object} options - Custom overrides for pdf formatting
 * @returns {Promise<boolean>}
 */
export async function downloadResumeAsPdf(element, filename = 'Resume', options = {}) {
  if (!element) {
    toast.error('Resume preview element not found');
    throw new Error('Resume element not found');
  }

  const cleanName = sanitizeFilename(filename);
  const loadingToast = toast.loading('Generating high-resolution A4 PDF...');

  try {
    // Dynamic import to prevent SSR issues and keep initial bundle light
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    // Clone element to sanitize layout and dimensions specifically for A4 PDF rendering
    const clone = element.cloneNode(true);
    clone.id = 'temp-pdf-export-container';

    // Enforce standard A4 width and clean styling
    clone.style.width = '794px'; // Exactly A4 width at 96 DPI
    clone.style.maxWidth = '794px';
    clone.style.minHeight = '1120px';
    clone.style.transform = 'none'; // Clear any interactive zoom preview transforms
    clone.style.boxShadow = 'none';
    clone.style.borderRadius = '0';
    clone.style.margin = '0 auto';
    clone.style.padding = clone.style.padding || '0';
    clone.style.position = 'absolute';
    clone.style.left = '-99999px';
    clone.style.top = '0';
    clone.style.zIndex = '-99999';
    clone.style.backgroundColor = '#ffffff';
    clone.style.color = '#0f172a';

    // Remove any interactive UI elements or controls that might be nested inside
    const interactiveElements = clone.querySelectorAll('button, input, select, .no-print');
    interactiveElements.forEach(el => el.remove());

    // Ensure all section items avoid awkward page breaks
    const items = clone.querySelectorAll(
      '.space-y-3 > div, .space-y-4 > div, .space-y-2 > div, li'
    );
    items.forEach(item => {
      item.style.breakInside = 'avoid';
      item.style.pageBreakInside = 'avoid';
    });

    document.body.appendChild(clone);

    // Wait a brief tick for fonts & SVG icons to settle
    await new Promise(resolve => setTimeout(resolve, 150));

    const pdfConfig = {
      margin: options.margin || [8, 8, 8, 8], // mm
      filename: `${cleanName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2, // 2x scale for 300 DPI retina text sharpness
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 800,
        ...options.html2canvas,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
        ...options.jsPDF,
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
      },
    };

    await html2pdf().set(pdfConfig).from(clone).save();

    toast.success('Resume PDF downloaded successfully!', { id: loadingToast });
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    toast.error('Direct PDF export encountered an issue. Opening print dialog...', {
      id: loadingToast,
    });
    // Automatic fallback to system print dialog
    printResumeDocument();
    return false;
  } finally {
    // Always clean up the temporary clone element
    const tempClone = document.getElementById('temp-pdf-export-container');
    if (tempClone && tempClone.parentNode) {
      tempClone.parentNode.removeChild(tempClone);
    }
  }
}

/**
 * Triggers the browser's native Print / Save as PDF dialog
 */
export function printResumeDocument() {
  // Ensure preview panel is forced visible if user was on a small screen
  const previewPanel = document.getElementById('resume-preview-panel');
  if (previewPanel) {
    previewPanel.classList.remove('hidden');
  }

  window.print();
}
