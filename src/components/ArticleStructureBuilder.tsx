import React, { useState } from 'react';
import {
  POST_TYPE_TEMPLATES,
  ARTICLE_SECTIONS,
  PostTypeTemplate,
  getRecommendedTemplateHtml,
} from '../data/articleTemplates';
import {
  Sparkles,
  Layers,
  FileText,
  Calendar,
  IndianRupee,
  Briefcase,
  GraduationCap,
  ListOrdered,
  Activity,
  DollarSign,
  Send,
  FileCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Info,
} from 'lucide-react';

interface ArticleStructureBuilderProps {
  onInsertStructure: (htmlToInsert: string, mode: 'append' | 'replace') => void;
}

export const ArticleStructureBuilder: React.FC<ArticleStructureBuilderProps> = ({
  onInsertStructure,
}) => {
  const [selectedPostType, setSelectedPostType] = useState<PostTypeTemplate>('recruitment');
  const [activeGuidance, setActiveGuidance] = useState<string | null>(
    'Select a section button below to insert pre-formatted, responsive Sarkari layout modules into your article.'
  );

  const handleInsertRecommended = () => {
    const templateHtml = getRecommendedTemplateHtml(selectedPostType);
    onInsertStructure(templateHtml, 'append');
  };

  const handleInsertSection = (sectionKey: string) => {
    const section = ARTICLE_SECTIONS[sectionKey];
    if (section) {
      setActiveGuidance(section.guidance);
      onInsertStructure(section.generateHtml(), 'append');
    }
  };

  const currentTemplate = POST_TYPE_TEMPLATES.find((t) => t.id === selectedPostType);

  const getSectionIcon = (key: string) => {
    switch (key) {
      case 'overview':
        return <FileText className="h-3.5 w-3.5 text-blue-700" />;
      case 'notification_details':
        return <Info className="h-3.5 w-3.5 text-indigo-700" />;
      case 'important_dates':
        return <Calendar className="h-3.5 w-3.5 text-emerald-700" />;
      case 'application_fee':
        return <IndianRupee className="h-3.5 w-3.5 text-amber-600" />;
      case 'age_limit':
        return <Activity className="h-3.5 w-3.5 text-rose-600" />;
      case 'vacancy_details':
        return <Layers className="h-3.5 w-3.5 text-blue-800" />;
      case 'eligibility':
        return <CheckCircle2 className="h-3.5 w-3.5 text-teal-700" />;
      case 'educational_qualification':
        return <GraduationCap className="h-3.5 w-3.5 text-purple-700" />;
      case 'selection_process':
        return <ListOrdered className="h-3.5 w-3.5 text-sky-700" />;
      case 'physical_eligibility':
        return <Activity className="h-3.5 w-3.5 text-orange-700" />;
      case 'salary':
        return <DollarSign className="h-3.5 w-3.5 text-emerald-800" />;
      case 'how_to_apply':
        return <Send className="h-3.5 w-3.5 text-blue-900" />;
      case 'required_documents':
        return <FileCheck className="h-3.5 w-3.5 text-cyan-700" />;
      case 'important_instructions':
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />;
      case 'official_source':
        return <ExternalLink className="h-3.5 w-3.5 text-blue-800" />;
      case 'conclusion':
      default:
        return <Sparkles className="h-3.5 w-3.5 text-violet-700" />;
    }
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-slate-50 p-5 shadow-2xs space-y-4">
      {/* Top Header & Smart Template Selector */}
      <div className="space-y-3 border-b border-blue-100 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-900 text-amber-300 shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-950">
                Article Structure Assistant & Templates
              </h3>
              <p className="text-[11px] text-slate-600">
                Build professional, structured government articles with standardized formatting
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200">
            One-Click Outline
          </span>
        </div>

        {/* Post Type Selector Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
              Choose Post Type:
            </label>
            <select
              value={selectedPostType}
              onChange={(e) => setSelectedPostType(e.target.value as PostTypeTemplate)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs font-bold text-slate-800 focus:border-blue-800 focus:outline-hidden"
            >
              {POST_TYPE_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleInsertRecommended}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-black uppercase text-amber-300 shadow-xs hover:bg-blue-950 active:scale-98 transition-all shrink-0 sm:self-end"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Insert Recommended Article Structure</span>
          </button>
        </div>

        {currentTemplate && (
          <p className="text-[11px] text-slate-500 italic">
            <strong>Target:</strong> {currentTemplate.description}
          </p>
        )}
      </div>

      {/* 16 One-Click Section Structure Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
            + Insert Individual Formatted Sections:
          </span>
          <span className="text-[10px] text-slate-500 font-semibold">
            Click any block to insert at end of article
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Object.entries(ARTICLE_SECTIONS).map(([key, section]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleInsertSection(key)}
              onMouseEnter={() => setActiveGuidance(section.guidance)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 text-left text-xs font-bold text-slate-800 shadow-2xs hover:border-blue-700 hover:bg-blue-50/70 active:bg-blue-100 transition-colors"
            >
              {getSectionIcon(key)}
              <span className="truncate">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Writing Guidance Note */}
      {activeGuidance && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-950 flex items-start gap-2 shadow-2xs">
          <HelpCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="font-extrabold uppercase text-amber-900 block text-[11px] mb-0.5">
              💡 Editorial Writing Guidance:
            </strong>
            <span className="text-[11px] font-medium">{activeGuidance}</span>
          </div>
        </div>
      )}
    </div>
  );
};
