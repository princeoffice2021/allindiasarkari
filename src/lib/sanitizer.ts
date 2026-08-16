import DOMPurify from 'dompurify';
import { processAndRepairHtmlTables } from './tableUtils';

/**
 * Robust, secure HTML sanitizer for All India Sarkari article content.
 * Strictly preserves all table structures (including columns, rows, thead, tbody, colspan, rowspan)
 * while safely blocking XSS, scripts, event handlers, and dangerous embeds.
 */
export function sanitizeArticleHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  const clean = DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      // Tables
      'table',
      'thead',
      'tbody',
      'tfoot',
      'tr',
      'th',
      'td',
      'caption',
      'colgroup',
      'col',
      // Block Layout & Typography
      'div',
      'p',
      'span',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      // Lists & Quotes
      'ul',
      'ol',
      'li',
      'blockquote',
      'hr',
      'br',
      // Inline Formatting
      'a',
      'b',
      'strong',
      'i',
      'em',
      'u',
      's',
      'strike',
      'sub',
      'sup',
      'mark',
      'small',
      'code',
      'pre',
      // Media
      'img',
    ],
    ALLOWED_ATTR: [
      // Table Structure Attributes (MUST NEVER BE STRIPPED)
      'colspan',
      'rowspan',
      'scope',
      'headers',
      'align',
      'valign',
      'width',
      'height',
      // General Styling & Semantics
      'class',
      'style',
      'id',
      // Links & Media
      'href',
      'target',
      'rel',
      'title',
      'src',
      'alt',
      'loading',
      'decoding',
    ],
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
    ALLOW_DATA_ATTR: true,
  });

  // Ensure all tables are validated, column counts preserved, and wrapped in responsive containers
  return processAndRepairHtmlTables(clean);
}
