import React, { useState } from 'react';
import {
  StaffSource,
  SourceType,
  SourceHealthStatus,
  SourcePriority,
  SourceContentType,
  SourceTestResult,
  getDeterministicStatus,
} from '../../../types/aiStaff';
import { CategoryType } from '../../../types';
import { CATEGORIES_CONFIG, ALL_STATES_AND_UTS } from '../../../data/statesAndCategories';
import { testSourceDiagnostic, auditAllSources } from '../../../lib/aiStaffService';
import {
  Globe,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Play,
  Clock,
  Building2,
  X,
  Save,
  ShieldCheck,
  AlertCircle,
  Activity,
  Zap,
  FileCheck,
  Check,
} from 'lucide-react';

interface AISourcesTabProps {
  sources: StaffSource[];
  onAddSource: (sourceData: Omit<StaffSource, 'id' | 'createdAt' | 'lastChecked' | 'lastSuccessfulCheck'>) => void;
  onUpdateSource: (id: string, updates: Partial<StaffSource>) => void;
  onDeleteSource: (id: string) => void;
  onScanSingleSource: (sourceId: string) => void;
  scanningSourceId: string | null;
  onRefreshData?: () => void;
}

const SOURCE_TYPES: SourceType[] = [
  'Central Government',
  'State Government',
  'Recruitment Boards',
  'UPSC',
  'SSC',
  'Railways',
  'Banking',
  'Defence',
  'Police',
  'Teaching',
  'Universities',
  'Exams',
  'Admit Cards',
  'Results',
  'Answer Keys',
  'Government Schemes',
  'Admissions',
  'Government Notifications',
];

export const AISourcesTab: React.FC<AISourcesTabProps> = ({
  sources,
  onAddSource,
  onUpdateSource,
  onDeleteSource,
  onScanSingleSource,
  scanningSourceId,
  onRefreshData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJurisdiction, setFilterJurisdiction] = useState<'ALL' | 'Central' | 'State'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterHealth, setFilterHealth] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<StaffSource | null>(null);

  // Diagnostics state
  const [testingSourceId, setTestingSourceId] = useState<string | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<SourceTestResult | null>(null);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [isAuditingAll, setIsAuditingAll] = useState(false);
  const [auditSummary, setAuditSummary] = useState<{
    totalSources: number;
    healthyCount: number;
    partialCount: number;
    degradedCount: number;
    failedCount: number;
    jsRequiredCount: number;
    blockedCount: number;
    unverifiedCount: number;
  } | null>(null);

  // New source form state
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    url: 'https://',
    sourceType: 'Recruitment Boards' as SourceType,
    contentType: 'HTML_LIST' as SourceContentType,
    priority: 'NORMAL' as SourcePriority,
    jurisdiction: 'Central' as 'Central' | 'State',
    state: 'Central',
    category: 'Sarkari Naukri' as CategoryType,
    active: true,
    notes: '',
    scanSchedule: 'daily' as 'daily' | 'manual',
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      department: '',
      url: 'https://',
      sourceType: 'Recruitment Boards',
      contentType: 'HTML_LIST',
      priority: 'NORMAL',
      jurisdiction: 'Central',
      state: 'Central',
      category: 'Sarkari Naukri',
      active: true,
      notes: '',
      scanSchedule: 'daily',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSource(formData);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSource) return;
    onUpdateSource(editingSource.id, editingSource);
    setEditingSource(null);
  };

  const handleRunDiagnostic = async (source: StaffSource) => {
    setTestingSourceId(source.id);
    const res = await testSourceDiagnostic(source);
    setTestingSourceId(null);
    if (res.success && res.result) {
      setDiagnosticResult(res.result);
      setIsDiagnosticModalOpen(true);
      if (onRefreshData) onRefreshData();
    } else {
      alert(`Diagnostic test failed: ${res.error || 'Unknown error'}`);
    }
  };

  const handleAuditAll = async () => {
    if (isAuditingAll) return;
    setIsAuditingAll(true);
    try {
      const res = await auditAllSources(sources);
      if (res.success && res.result) {
        setAuditSummary({
          totalSources: res.result.totalSources,
          healthyCount: res.result.healthyCount,
          partialCount: res.result.partialCount,
          degradedCount: res.result.degradedCount || 0,
          failedCount: res.result.failedCount,
          jsRequiredCount: res.result.jsRequiredCount,
          blockedCount: res.result.blockedCount,
          unverifiedCount: res.result.unverifiedCount || 0,
        });
        if (onRefreshData) onRefreshData();
      }
    } finally {
      setIsAuditingAll(false);
    }
  };

  const filteredSources = sources.filter(s => {
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJurisdiction =
      filterJurisdiction === 'ALL' || s.jurisdiction === filterJurisdiction;

    const matchesCategory =
      filterCategory === 'ALL' || s.category === filterCategory;

    const deterministicStatus = getDeterministicStatus(s);
    const matchesHealth =
      filterHealth === 'ALL' || deterministicStatus === filterHealth;

    const matchesPriority =
      filterPriority === 'ALL' || (s.priority || 'NORMAL') === filterPriority;

    return matchesSearch && matchesJurisdiction && matchesCategory && matchesHealth && matchesPriority;
  });

  const getHealthBadge = (source: StaffSource) => {
    const status = getDeterministicStatus(source);
    switch (status) {
      case 'HEALTHY':
        return (
          <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1">
            <Check className="h-3 w-3" /> Healthy {source.lastResponseTimeMs ? `(${source.lastResponseTimeMs}ms)` : ''}
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="rounded-md bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Partial Match
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="rounded-md bg-orange-100 text-orange-800 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> Degraded / Slow
          </span>
        );
      case 'JS_REQUIRED':
        return (
          <span className="rounded-md bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1">
            <Zap className="h-3 w-3" /> JS Required (SPA)
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="rounded-md bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Blocked (Firewall)
          </span>
        );
      case 'UNVERIFIED':
        return (
          <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-slate-500" /> Unverified
          </span>
        );
      case 'FAILED':
      default:
        return (
          <span className="rounded-md bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Failed
          </span>
        );
    }
  };

  const getPriorityBadge = (priority?: SourcePriority) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="rounded-md bg-red-900 text-white px-2 py-0.5 text-[10px] font-black">CRITICAL</span>;
      case 'HIGH':
        return <span className="rounded-md bg-amber-700 text-white px-2 py-0.5 text-[10px] font-bold">HIGH</span>;
      case 'LOW':
        return <span className="rounded-md bg-slate-200 text-slate-700 px-2 py-0.5 text-[10px] font-bold">LOW</span>;
      case 'NORMAL':
      default:
        return <span className="rounded-md bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold">NORMAL</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Audit Summary Banner (if tested) */}
      {auditSummary && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-blue-700" /> Source Health Audit Results
                </h4>
                <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-black uppercase">
                  Reconciled 100% ({auditSummary.healthyCount + auditSummary.partialCount + auditSummary.degradedCount + auditSummary.jsRequiredCount + auditSummary.blockedCount + auditSummary.failedCount + auditSummary.unverifiedCount} / {auditSummary.totalSources})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Live connectivity and notification extractor check across all official sources.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                ✓ Healthy: {auditSummary.healthyCount}
              </span>
              <span className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                ⚠️ Partial: {auditSummary.partialCount}
              </span>
              <span className="rounded-lg bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-800">
                ⏳ Degraded: {auditSummary.degradedCount}
              </span>
              <span className="rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-800">
                ⚡ JS Required: {auditSummary.jsRequiredCount}
              </span>
              <span className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-800">
                🛡️ Blocked: {auditSummary.blockedCount}
              </span>
              <span className="rounded-lg bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-800">
                ✕ Failed: {auditSummary.failedCount}
              </span>
              {auditSummary.unverifiedCount > 0 && (
                <span className="rounded-lg bg-slate-100 border border-slate-300 px-3 py-1 text-xs font-bold text-slate-700">
                  🔒 Unverified: {auditSummary.unverifiedCount}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-2xs border border-slate-200">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search official sources..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-700 focus:outline-hidden"
            />
          </div>

          <select
            value={filterJurisdiction}
            onChange={e => setFilterJurisdiction(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Jurisdictions</option>
            <option value="Central">Central Govt / All India</option>
            <option value="State">State Govt Portals</option>
          </select>

          <select
            value={filterHealth}
            onChange={e => setFilterHealth(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Health Statuses</option>
            <option value="HEALTHY">Healthy (200 OK)</option>
            <option value="PARTIAL">Partial Match</option>
            <option value="DEGRADED">Degraded / Slow</option>
            <option value="JS_REQUIRED">JS Required (SPA)</option>
            <option value="BLOCKED">Blocked (Firewall)</option>
            <option value="FAILED">Failed</option>
            <option value="UNVERIFIED">Unverified</option>
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={isAuditingAll}
            onClick={handleAuditAll}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs font-black uppercase text-blue-900 hover:bg-blue-100 disabled:opacity-50 transition-colors"
            title="Audit connectivity and parser diagnostics across all government sources"
          >
            <Activity className={`h-4 w-4 text-blue-700 ${isAuditingAll ? 'animate-spin' : ''}`} />
            {isAuditingAll ? 'Auditing All...' : 'Audit All Sources'}
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-black uppercase text-white shadow-sm hover:bg-blue-800 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Source
          </button>
        </div>
      </div>

      {/* Sources Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSources.map(source => {
          const isScanning = scanningSourceId === source.id;
          const isTesting = testingSourceId === source.id;

          return (
            <div
              key={source.id}
              className={`rounded-2xl border bg-white p-5 shadow-2xs transition-all ${
                source.active ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-800 text-xs font-bold">
                      <Building2 className="h-3.5 w-3.5" />
                    </span>
                    <h3 className="text-sm font-black text-slate-900 leading-tight truncate">
                      {source.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">
                    {source.department}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {getPriorityBadge(source.priority)}
                  <button
                    onClick={() => {
                      if (!source.active && source.verificationStatus === 'UNVERIFIED') {
                        alert('Verification Required: Please click "Test Source" to verify portal connectivity and content before activating an unverified source.');
                        return;
                      }
                      onUpdateSource(source.id, { active: !source.active, enabled: !source.active });
                    }}
                    title={source.active ? 'Click to deactivate' : (source.verificationStatus === 'UNVERIFIED' ? 'Verification required to activate' : 'Click to activate')}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider transition-colors ${
                      source.active
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {source.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* URL & Badges */}
              <div className="space-y-2 mb-4">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-blue-700 hover:underline break-all"
                >
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  {source.url}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {getHealthBadge(source)}
                  <span className="rounded-md bg-blue-50 text-blue-900 px-2 py-0.5 text-[10px] font-bold">
                    {source.sourceType}
                  </span>
                  <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-bold">
                    {source.jurisdiction === 'Central' ? 'Central' : source.state}
                  </span>
                  <span className="rounded-md bg-amber-50 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                    {source.category}
                  </span>
                  <span className="rounded-md bg-emerald-50 text-emerald-900 px-2 py-0.5 text-[10px] font-bold" title="Total notices discovered from this portal">
                    ✨ Discoveries: {source.discoveriesCount || 0}
                  </span>
                  {source.fallbackUrls && source.fallbackUrls.length > 0 && (
                    <span className="rounded-md bg-purple-50 text-purple-900 px-2 py-0.5 text-[10px] font-bold" title="Official fallback URLs configured">
                      🛡️ Fallback Ready ({source.fallbackUrls.length})
                    </span>
                  )}
                </div>

                {source.consecutiveFailures > 0 && (
                  <div className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                    <span>Consecutive Failures: {source.consecutiveFailures}</span>
                    {source.lastError && <span className="font-normal text-slate-500 truncate">({source.lastError})</span>}
                  </div>
                )}

                {source.failureReason && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-2 text-[11px] text-red-700 flex items-start gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span className="truncate"><strong>Diagnostic Note:</strong> {source.failureReason}</span>
                  </div>
                )}
              </div>

              {/* Timestamps & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>
                      Last checked:{' '}
                      {source.lastChecked ? (
                        <strong className="text-slate-700">
                          {new Date(source.lastChecked).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </strong>
                      ) : (
                        'Pending first scan'
                      )}
                    </span>
                  </div>
                  {source.lastSuccessfulCheck && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span>Last success: {new Date(source.lastSuccessfulCheck).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={isTesting}
                    onClick={() => handleRunDiagnostic(source)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                    title="Test connectivity and parse candidate notices"
                  >
                    <Activity className={`h-3 w-3 text-blue-700 ${isTesting ? 'animate-spin' : ''}`} />
                    {isTesting ? 'Testing...' : 'Test Source'}
                  </button>

                  <button
                    disabled={isScanning || !source.active}
                    onClick={() => onScanSingleSource(source.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                  >
                    <Play className={`h-3 w-3 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Scanning...' : 'Scan Now'}
                  </button>

                  <button
                    onClick={() => setEditingSource(source)}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Source"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete official source "${source.name}"?`)) {
                        onDeleteSource(source.id);
                      }
                    }}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Source"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSources.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <Globe className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">No sources found matching filters</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query, health status, or jurisdiction filter.</p>
          </div>
        )}
      </div>

      {/* DIAGNOSTIC RESULT MODAL */}
      {isDiagnosticModalOpen && diagnosticResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-4">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" /> Source Diagnostic Test Report
              </h3>
              <button
                onClick={() => setIsDiagnosticModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">HTTP Status</span>
                  <span className={`text-sm font-bold ${diagnosticResult.httpStatus === 200 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {diagnosticResult.httpStatus ? `${diagnosticResult.httpStatus} OK` : 'No Response'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Response Time</span>
                  <span className="text-sm font-bold text-slate-800">
                    {diagnosticResult.responseTimeMs} ms
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Health Rating</span>
                  <span className="text-sm font-bold text-blue-800">
                    {diagnosticResult.healthStatus}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Parser Engine</span>
                  <span className="text-xs font-mono font-bold text-slate-700 truncate block">
                    {diagnosticResult.parserUsed}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-slate-700">Target Portal URL</span>
                <p className="text-xs font-mono text-blue-700 bg-slate-50 p-2 rounded-lg border border-slate-200 break-all">
                  {diagnosticResult.url}
                </p>
              </div>

              {diagnosticResult.failureReason && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                  <strong>Issue Detected:</strong> {diagnosticResult.failureReason}
                </div>
              )}

              {diagnosticResult.recommendations && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <strong>Recommendation:</strong> {diagnosticResult.recommendations}
                </div>
              )}

              <div>
                <h4 className="text-xs font-black uppercase text-slate-800 mb-2 flex items-center justify-between">
                  <span>Candidate Notices Discovered ({diagnosticResult.sampleItems.length})</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {diagnosticResult.pdfLinksCount} PDF document(s) detected
                  </span>
                </h4>

                {diagnosticResult.sampleItems.length > 0 ? (
                  <div className="space-y-2">
                    {diagnosticResult.sampleItems.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-blue-700">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" /> View Notice Link
                          </a>
                          {item.pdfUrl && (
                            <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                              <FileCheck className="h-3 w-3" /> PDF Available
                            </a>
                          )}
                          {item.dateText && (
                            <span className="text-slate-500 font-medium">Date: {item.dateText}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                    No candidate recruitment links found matching current selectors.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsDiagnosticModalOpen(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900 transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SOURCE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-4">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-amber-400" /> Add Official Government Source
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Source Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staff Selection Commission (SSC)"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Department / Ministry / Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ministry of Personnel, Public Grievances and Pensions"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Official Website URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://ssc.gov.in"
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Source Classification
                  </label>
                  <select
                    value={formData.sourceType}
                    onChange={e => setFormData({ ...formData, sourceType: e.target.value as SourceType })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    {SOURCE_TYPES.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Default Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    {CATEGORIES_CONFIG.map(c => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Jurisdiction
                  </label>
                  <select
                    value={formData.jurisdiction}
                    onChange={e => {
                      const j = e.target.value as 'Central' | 'State';
                      setFormData({
                        ...formData,
                        jurisdiction: j,
                        state: j === 'Central' ? 'Central' : 'Uttar Pradesh',
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Central">Central / All India</option>
                    <option value="State">State Government</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    State / UT
                  </label>
                  <select
                    disabled={formData.jurisdiction === 'Central'}
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 disabled:bg-slate-100"
                  >
                    <option value="Central">Central / All India</option>
                    {ALL_STATES_AND_UTS.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Notes / Verification Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Official recruitment and vacancy notifications section."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-black uppercase text-white hover:bg-blue-800"
                >
                  Add Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SOURCE MODAL */}
      {editingSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-4">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-amber-400" /> Edit Official Source
              </h3>
              <button
                onClick={() => setEditingSource(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Source Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSource.name}
                  onChange={e => setEditingSource({ ...editingSource, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  value={editingSource.department}
                  onChange={e => setEditingSource({ ...editingSource, department: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Official URL *
                </label>
                <input
                  type="url"
                  required
                  value={editingSource.url}
                  onChange={e => setEditingSource({ ...editingSource, url: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingSource.priority || 'NORMAL'}
                    onChange={e => setEditingSource({ ...editingSource, priority: e.target.value as SourcePriority })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="CRITICAL">Critical (Always scan first)</option>
                    <option value="HIGH">High</option>
                    <option value="NORMAL">Normal</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Content Type
                  </label>
                  <select
                    value={editingSource.contentType || 'HTML_LIST'}
                    onChange={e => setEditingSource({ ...editingSource, contentType: e.target.value as SourceContentType })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="HTML_LIST">HTML Notice List</option>
                    <option value="HTML_DETAIL">HTML Single Page</option>
                    <option value="PDF_DIRECTORY">PDF Document Directory</option>
                    <option value="JSON_API">JSON / REST API</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    State / UT
                  </label>
                  <select
                    value={editingSource.state}
                    onChange={e => setEditingSource({ ...editingSource, state: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Central">Central / All India</option>
                    {ALL_STATES_AND_UTS.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Default Category
                  </label>
                  <select
                    value={editingSource.category}
                    onChange={e => setEditingSource({ ...editingSource, category: e.target.value as CategoryType })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    {CATEGORIES_CONFIG.map(c => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingSource(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
