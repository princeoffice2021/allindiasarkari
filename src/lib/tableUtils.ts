/**
 * Utility functions for robust HTML table parsing, sanitization, validation,
 * column repair, and conversion for All India Sarkari Rich Text Editor.
 */

/**
 * Checks if a string contains HTML table markup
 */
export function containsTableMarkup(html: string): boolean {
  if (!html) return false;
  return /<\s*table[^>]*>|<\s*tr[^>]*>|<\s*td[^>]*>|<\s*th[^>]*>/i.test(html);
}

/**
 * Checks if plain text is tabular (TSV or Markdown pipe table)
 */
export function isTabularText(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (!trimmed) return false;

  const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return false;

  // 1. Check for TSV (tab-separated values with at least 2 lines and tabs)
  const tabLines = lines.filter((line) => line.includes('\t'));
  if (tabLines.length >= 1 && (tabLines.length / lines.length >= 0.5 || tabLines.length >= 2)) {
    return true;
  }

  // 2. Check for Markdown pipe table (e.g. | col 1 | col 2 | ...)
  const pipeLines = lines.filter((line) => {
    const pipeCount = (line.match(/\|/g) || []).length;
    return pipeCount >= 2;
  });

  if (pipeLines.length >= 2) {
    return true;
  }

  return false;
}

/**
 * Converts TSV or Markdown pipe tabular text into a structured, responsive HTML table
 */
export function convertTabularTextToHtmlTable(text: string): string {
  if (!text) return '';

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return '';

  let isMarkdown = false;
  const pipeLines = lines.filter((line) => (line.match(/\|/g) || []).length >= 2);
  if (pipeLines.length >= 2) {
    isMarkdown = true;
  }

  const rawRows: string[][] = [];

  if (isMarkdown) {
    for (const line of lines) {
      // Skip Markdown divider lines like |---|---|
      if (/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line)) {
        continue;
      }
      // Split by pipe
      let parts = line.split('|').map((c) => c.trim());
      // If line started with '|', first part is empty
      if (line.startsWith('|') && parts.length > 0 && parts[0] === '') {
        parts.shift();
      }
      // If line ended with '|', last part is empty
      if (line.endsWith('|') && parts.length > 0 && parts[parts.length - 1] === '') {
        parts.pop();
      }

      if (parts.length > 0) {
        rawRows.push(parts);
      }
    }
  } else {
    // TSV or comma separated
    for (const line of lines) {
      if (line.includes('\t')) {
        const parts = line.split('\t').map((c) => c.trim());
        rawRows.push(parts);
      } else {
        // Fallback line split
        rawRows.push([line]);
      }
    }
  }

  if (rawRows.length === 0) return '';

  // Calculate maximum columns across all rows
  const maxCols = Math.max(...rawRows.map((r) => r.length), 1);

  // Normalize every row to have exactly maxCols
  const normalizedRows = rawRows.map((row) => {
    const padded = [...row];
    while (padded.length < maxCols) {
      padded.push('');
    }
    return padded;
  });

  // Construct table HTML
  const headerRow = normalizedRows[0];
  const bodyRows = normalizedRows.slice(1);

  const theadHtml = `
    <thead>
      <tr class="bg-blue-900 text-white font-bold">
        ${headerRow
          .map(
            (cell) =>
              `<th class="p-3 bg-blue-900 text-white font-bold border border-blue-800 text-left">${
                cell || '&nbsp;'
              }</th>`
          )
          .join('')}
      </tr>
    </thead>`;

  const tbodyHtml = `
    <tbody>
      ${bodyRows
        .map(
          (row, rIdx) => `
        <tr class="${rIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200">
          ${row
            .map(
              (cell) =>
                `<td class="p-3 border border-slate-200 text-slate-800">${
                  cell || '&nbsp;'
                }</td>`
            )
            .join('')}
        </tr>`
        )
        .join('')}
    </tbody>`;

  return `
<div class="table-responsive my-4 overflow-x-auto">
  <table class="w-full text-left border-collapse border border-slate-300">
    ${theadHtml}
    ${tbodyHtml}
  </table>
</div>
<p><br></p>`;
}

/**
 * Validates, cleans, and repairs an HTML Table element.
 * - Respects and preserves exact column count
 * - Preserves colspan and rowspan attributes
 * - Never deletes rows or columns
 * - Ensures empty cells are preserved so columns are never shifted or merged
 * - Normalizes missing trailing cells in incomplete rows
 */
export function cleanAndRepairTable(table: HTMLTableElement): HTMLTableElement {
  // Collect all tr elements in order
  const allRows = Array.from(table.querySelectorAll('tr'));
  if (allRows.length === 0) {
    return table;
  }

  // Phase 1: Compute matrix to find the true max logical column count
  // We simulate the table grid taking into account rowspan and colspan
  const activeRowspans: number[] = [];
  let maxLogicalCols = 0;

  for (let r = 0; r < allRows.length; r++) {
    const tr = allRows[r];
    const cells = Array.from(tr.children).filter(
      (child): child is HTMLTableCellElement =>
        child.tagName.toLowerCase() === 'td' || child.tagName.toLowerCase() === 'th'
    );

    let colIndex = 0;

    // Check cells in this row
    for (const cell of cells) {
      // Advance over columns occupied by previous rows' rowspans
      while (activeRowspans[colIndex] && activeRowspans[colIndex] > 0) {
        activeRowspans[colIndex]--;
        colIndex++;
      }

      const colspan = Math.max(1, parseInt(cell.getAttribute('colspan') || '1', 10) || 1);
      const rowspan = Math.max(1, parseInt(cell.getAttribute('rowspan') || '1', 10) || 1);

      if (rowspan > 1) {
        for (let c = 0; c < colspan; c++) {
          activeRowspans[colIndex + c] = rowspan - 1;
        }
      }

      colIndex += colspan;
    }

    // Check any remaining columns with active rowspans in this row
    while (activeRowspans[colIndex] && activeRowspans[colIndex] > 0) {
      activeRowspans[colIndex]--;
      colIndex++;
    }

    if (colIndex > maxLogicalCols) {
      maxLogicalCols = colIndex;
    }
  }

  if (maxLogicalCols === 0) {
    maxLogicalCols = 1;
  }

  // Phase 2: Repair rows to ensure all rows match maxLogicalCols without deleting existing data
  activeRowspans.length = 0;

  for (let r = 0; r < allRows.length; r++) {
    const tr = allRows[r];
    const cells = Array.from(tr.children).filter(
      (child): child is HTMLTableCellElement =>
        child.tagName.toLowerCase() === 'td' || child.tagName.toLowerCase() === 'th'
    );

    let colIndex = 0;

    for (const cell of cells) {
      // Skip columns occupied by rowspan from previous rows
      while (activeRowspans[colIndex] && activeRowspans[colIndex] > 0) {
        activeRowspans[colIndex]--;
        colIndex++;
      }

      let colspan = Math.max(1, parseInt(cell.getAttribute('colspan') || '1', 10) || 1);
      const rowspan = Math.max(1, parseInt(cell.getAttribute('rowspan') || '1', 10) || 1);

      // Guard: do not let colspan exceed remaining columns in row
      if (colIndex + colspan > maxLogicalCols) {
        colspan = Math.max(1, maxLogicalCols - colIndex);
        if (colspan === 1) {
          cell.removeAttribute('colspan');
        } else {
          cell.setAttribute('colspan', colspan.toString());
        }
      }

      if (rowspan > 1) {
        for (let c = 0; c < colspan; c++) {
          activeRowspans[colIndex + c] = rowspan - 1;
        }
      }

      // Ensure empty cell content has at least a non-breaking space or clean HTML so browser doesn't collapse it
      if (!cell.innerHTML || cell.innerHTML.trim() === '') {
        cell.innerHTML = '&nbsp;';
      }

      colIndex += colspan;
    }

    // Skip any remaining rowspans
    while (colIndex < maxLogicalCols && activeRowspans[colIndex] && activeRowspans[colIndex] > 0) {
      activeRowspans[colIndex]--;
      colIndex++;
    }

    // Pad missing trailing cells if row has fewer columns than maxLogicalCols
    while (colIndex < maxLogicalCols) {
      const isHeaderRow = r === 0 && table.querySelector('thead') !== null;
      const newCell = document.createElement(isHeaderRow ? 'th' : 'td');
      newCell.innerHTML = '&nbsp;';
      tr.appendChild(newCell);
      colIndex++;
    }
  }

  // Phase 3: Normalize Table Class & Structure
  if (!table.classList.contains('w-full')) {
    table.classList.add('w-full', 'text-left', 'border-collapse', 'border', 'border-slate-300');
  }

  return table;
}

/**
 * Parses raw HTML string, cleans & validates all <table> elements,
 * wraps each table in <div class="table-responsive"> if not already wrapped,
 * and returns the repaired HTML.
 */
export function processAndRepairHtmlTables(rawHtml: string): string {
  if (!rawHtml) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  const tables = Array.from(doc.querySelectorAll('table'));
  if (tables.length === 0) {
    return rawHtml;
  }

  for (const table of tables) {
    cleanAndRepairTable(table);

    // Check if table is already inside a .table-responsive container
    const parent = table.parentElement;
    if (!parent || !parent.classList.contains('table-responsive')) {
      const wrapper = doc.createElement('div');
      wrapper.className = 'table-responsive my-4 overflow-x-auto';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  }

  return doc.body.innerHTML;
}

/**
 * Escapes plain text for safe HTML embedding
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
