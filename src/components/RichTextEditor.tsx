import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  Table as TableIcon,
  Minus,
  RotateCcw,
  RotateCw,
  Code,
  Eye,
  Eraser,
  Plus,
  Trash2,
  Columns,
  Rows,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your detailed article content here...',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(value);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [selectedTableCoords, setSelectedTableCoords] = useState<{ rows: number; cols: number }>({
    rows: 3,
    cols: 2,
  });

  const isUpdatingFromProp = useRef(false);

  // Sync prop value into contentEditable when not user-typing
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (editorRef.current.innerHTML !== value) {
        isUpdatingFromProp.current = true;
        editorRef.current.innerHTML = value || '';
        isUpdatingFromProp.current = false;
      }
    }
    setSourceCode(value || '');
  }, [value, isSourceMode]);

  const handleInput = useCallback(() => {
    if (isUpdatingFromProp.current) return;
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setSourceCode(html);
    }
  }, [onChange]);

  // Execute standard formatting commands
  const execCmd = (command: string, arg: string | undefined = undefined) => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleFormatBlock = (tag: string) => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    if (tag === 'p') {
      document.execCommand('formatBlock', false, '<p>');
    } else {
      document.execCommand('formatBlock', false, `<${tag}>`);
    }
    handleInput();
  };

  const handleOpenLinkModal = () => {
    const selection = window.getSelection();
    const selected = selection ? selection.toString() : '';
    setLinkText(selected);
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    let validUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(validUrl) && !validUrl.startsWith('/') && !validUrl.startsWith('#')) {
      validUrl = `https://${validUrl}`;
    }

    if (editorRef.current) {
      editorRef.current.focus();
    }

    if (linkText.trim()) {
      const linkHtml = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer">${linkText.trim()}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
    } else {
      document.execCommand('createLink', false, validUrl);
    }

    handleInput();
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleRemoveLink = () => {
    execCmd('unlink');
  };

  // Table operations
  const insertTable = (rows: number, cols: number) => {
    if (isSourceMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }

    let headerCells = '';
    for (let c = 1; c <= cols; c++) {
      headerCells += `<th>Heading ${c}</th>`;
    }

    let bodyRows = '';
    for (let r = 1; r <= rows; r++) {
      let cells = '';
      for (let c = 1; c <= cols; c++) {
        cells += `<td>Sample Data ${r}.${c}</td>`;
      }
      bodyRows += `<tr>${cells}</tr>`;
    }

    const tableHtml = `
<div class="table-responsive my-4 overflow-x-auto">
  <table class="w-full text-left border-collapse border border-slate-300">
    <thead>
      <tr class="bg-blue-900 text-white font-bold">${headerCells}</tr>
    </thead>
    <tbody>${bodyRows}</tbody>
  </table>
</div>
<p><br></p>`;

    document.execCommand('insertHTML', false, tableHtml);
    handleInput();
    setShowTableMenu(false);
  };

  const findParentTag = (element: Node | null, tagName: string): HTMLElement | null => {
    let curr = element;
    while (curr && curr !== editorRef.current) {
      if (curr.nodeType === 1 && (curr as HTMLElement).tagName.toLowerCase() === tagName.toLowerCase()) {
        return curr as HTMLElement;
      }
      curr = curr.parentNode;
    }
    return null;
  };

  const handleAddTableRow = () => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return;
    const tr = findParentTag(sel.anchorNode, 'tr') as HTMLTableRowElement | null;
    const table = findParentTag(sel.anchorNode, 'table') as HTMLTableElement | null;
    if (!table) {
      alert('Please place your cursor inside a table row first.');
      return;
    }

    const colsCount = tr ? tr.cells.length : (table.rows[0]?.cells.length || 2);
    const newRow = document.createElement('tr');
    for (let i = 0; i < colsCount; i++) {
      const td = document.createElement('td');
      td.innerHTML = 'New cell';
      newRow.appendChild(td);
    }

    if (tr && tr.parentNode) {
      tr.parentNode.insertBefore(newRow, tr.nextSibling);
    } else {
      const tbody = table.querySelector('tbody') || table;
      tbody.appendChild(newRow);
    }
    handleInput();
  };

  const handleDeleteTableRow = () => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return;
    const tr = findParentTag(sel.anchorNode, 'tr');
    if (tr && tr.parentNode) {
      tr.parentNode.removeChild(tr);
      handleInput();
    } else {
      alert('Please place your cursor inside a table row to delete.');
    }
  };

  const handleAddTableCol = () => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return;
    const table = findParentTag(sel.anchorNode, 'table') as HTMLTableElement | null;
    if (!table) {
      alert('Please place your cursor inside a table first.');
      return;
    }

    // Add th to thead
    const thead = table.querySelector('thead');
    if (thead) {
      const tr = thead.querySelector('tr');
      if (tr) {
        const th = document.createElement('th');
        th.innerHTML = 'New Header';
        tr.appendChild(th);
      }
    }

    // Add td to each body tr
    const tbody = table.querySelector('tbody') || table;
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((r, idx) => {
      // If no thead, first row might be headers
      if (!thead && idx === 0) {
        const th = document.createElement('th');
        th.innerHTML = 'New Header';
        r.appendChild(th);
      } else {
        const td = document.createElement('td');
        td.innerHTML = 'New cell';
        r.appendChild(td);
      }
    });

    handleInput();
  };

  const handleDeleteTableCol = () => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return;
    const tdOrTh = (findParentTag(sel.anchorNode, 'td') || findParentTag(sel.anchorNode, 'th')) as HTMLTableCellElement | null;
    const table = findParentTag(sel.anchorNode, 'table') as HTMLTableElement | null;
    if (!tdOrTh || !table) {
      alert('Please place your cursor inside a table column to delete.');
      return;
    }

    const colIndex = tdOrTh.cellIndex;
    const allRows = table.querySelectorAll('tr');
    allRows.forEach((r) => {
      if (r.cells.length > colIndex) {
        r.deleteCell(colIndex);
      }
    });
    handleInput();
  };

  const handleToggleSource = () => {
    if (isSourceMode) {
      // Switching from code to visual
      if (editorRef.current) {
        editorRef.current.innerHTML = sourceCode;
      }
      onChange(sourceCode);
      setIsSourceMode(false);
    } else {
      // Switching from visual to code
      if (editorRef.current) {
        setSourceCode(editorRef.current.innerHTML);
      }
      setIsSourceMode(true);
    }
  };

  const handleSourceChange = (newCode: string) => {
    setSourceCode(newCode);
    onChange(newCode);
  };

  const clearFormatting = () => {
    execCmd('removeFormat');
  };

  return (
    <div className="rounded-2xl border border-slate-300 bg-white shadow-2xs overflow-hidden">
      {/* Editor Toolbar */}
      <div className="border-b border-slate-200 bg-slate-50 p-2.5 flex flex-wrap items-center gap-1.5 select-none text-slate-700 sticky top-0 z-10">
        {/* Headings Dropdown */}
        <select
          onChange={(e) => {
            handleFormatBlock(e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          disabled={isSourceMode}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-400 focus:outline-hidden disabled:opacity-50"
          title="Format Block / Heading"
        >
          <option value="" disabled>
            Paragraph / Heading...
          </option>
          <option value="p">Normal Paragraph (&lt;p&gt;)</option>
          <option value="h2">Heading 2 (&lt;h2&gt; - Major Section)</option>
          <option value="h3">Heading 3 (&lt;h3&gt; - Sub Section)</option>
          <option value="h4">Heading 4 (&lt;h4&gt; - Minor Section)</option>
        </select>

        <div className="h-5 w-px bg-slate-300 mx-0.5" />

        {/* Text Style Controls */}
        <button
          type="button"
          onClick={() => execCmd('bold')}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCmd('italic')}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCmd('underline')}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </button>

        <div className="h-5 w-px bg-slate-300 mx-0.5" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCmd('insertUnorderedList')}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCmd('insertOrderedList')}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => handleFormatBlock('blockquote')}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Callout Quote / Notice"
        >
          <Quote className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCmd('insertHorizontalRule')}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Horizontal Divider"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="h-5 w-px bg-slate-300 mx-0.5" />

        {/* Link controls */}
        <button
          type="button"
          onClick={handleOpenLinkModal}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-blue-800 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleRemoveLink}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-red-700 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Remove Link"
        >
          <Unlink className="h-4 w-4" />
        </button>

        <div className="h-5 w-px bg-slate-300 mx-0.5" />

        {/* Table Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTableMenu(!showTableMenu)}
            disabled={isSourceMode}
            className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-200 hover:text-blue-900 active:bg-slate-300 transition-colors text-xs font-bold disabled:opacity-40"
            title="Table Tools"
          >
            <TableIcon className="h-4 w-4 text-blue-800" />
            <span>Table</span>
          </button>

          {showTableMenu && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-20 space-y-2.5">
              <span className="text-[11px] font-black uppercase text-slate-600 block border-b border-slate-100 pb-1">
                Insert Responsive Table
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => insertTable(3, 2)}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-left hover:bg-blue-50 hover:border-blue-300 font-semibold"
                >
                  2 Columns × 3 Rows
                </button>
                <button
                  type="button"
                  onClick={() => insertTable(4, 3)}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-left hover:bg-blue-50 hover:border-blue-300 font-semibold"
                >
                  3 Columns × 4 Rows
                </button>
                <button
                  type="button"
                  onClick={() => insertTable(5, 4)}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-left hover:bg-blue-50 hover:border-blue-300 font-semibold"
                >
                  4 Columns × 5 Rows
                </button>
                <button
                  type="button"
                  onClick={() => insertTable(6, 2)}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-left hover:bg-blue-50 hover:border-blue-300 font-semibold"
                >
                  2 Columns × 6 Rows
                </button>
              </div>

              <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Table Editing</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={handleAddTableRow}
                    className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-bold hover:bg-slate-200"
                  >
                    <Plus className="h-3 w-3" /> Add Row
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteTableRow}
                    className="flex items-center gap-1 rounded bg-red-50 text-red-700 px-2 py-1 text-[11px] font-bold hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" /> Delete Row
                  </button>
                  <button
                    type="button"
                    onClick={handleAddTableCol}
                    className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-bold hover:bg-slate-200"
                  >
                    <Plus className="h-3 w-3" /> Add Column
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteTableCol}
                    className="flex items-center gap-1 rounded bg-red-50 text-red-700 px-2 py-1 text-[11px] font-bold hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" /> Delete Column
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-300 mx-0.5" />

        {/* Clear Format */}
        <button
          type="button"
          onClick={clearFormatting}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Clear Formatting"
        >
          <Eraser className="h-4 w-4" />
        </button>

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => execCmd('undo')}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCmd('redo')}
          disabled={isSourceMode}
          className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300 transition-colors disabled:opacity-40"
          title="Redo (Ctrl+Y)"
        >
          <RotateCw className="h-4 w-4" />
        </button>

        {/* Right side Toggle: Visual vs HTML Source */}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleSource}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
              isSourceMode
                ? 'bg-blue-800 text-white shadow-2xs'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900'
            }`}
            title="Toggle HTML Source Code View"
          >
            <Code className="h-3.5 w-3.5" />
            <span>{isSourceMode ? 'Switch to Visual Editor' : 'HTML Source'}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative min-h-[380px] bg-white">
        {isSourceMode ? (
          <textarea
            value={sourceCode}
            onChange={(e) => handleSourceChange(e.target.value)}
            rows={18}
            className="w-full h-full min-h-[380px] p-4 text-xs font-mono text-slate-800 bg-slate-900 text-emerald-300 focus:outline-hidden leading-relaxed"
            placeholder="Edit raw HTML content here..."
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            className="article-content p-5 sm:p-6 min-h-[380px] focus:outline-hidden text-slate-800 text-sm leading-relaxed"
            style={{ minHeight: '380px' }}
          />
        )}
      </div>

      {/* Link Insertion Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-blue-800" /> Insert Hyperlink
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInsertLink} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Anchor Text (Display Text)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Official Notification PDF / Apply Online"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold text-slate-800 focus:border-blue-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Destination URL <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://ssc.gov.in or https://..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono text-slate-800 focus:border-blue-800 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-800 px-5 py-2 text-xs font-black uppercase text-white hover:bg-blue-900 shadow-xs"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
