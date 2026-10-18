import React, { useState } from 'react';
import { StaffActivityLog } from '../../../types/aiStaff';
import {
  ListFilter,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Trash2,
  Download,
} from 'lucide-react';

interface AILogsTabProps {
  logs: StaffActivityLog[];
  onClearLogs: () => void;
}

export const AILogsTab: React.FC<AILogsTabProps> = ({ logs, onClearLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter(l => {
    const matchesSearch =
      !searchQuery ||
      l.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.result.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.error && l.error.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;

    return matchesSearch && matchesStatus && matchesAction;
  });

  const getStatusIcon = (status: StaffActivityLog['status']) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'ERROR':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'INFO':
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-2xs border border-slate-200">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search activity logs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-700 focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Log Levels</option>
            <option value="SUCCESS">Success Only</option>
            <option value="WARNING">Warnings</option>
            <option value="ERROR">Errors</option>
            <option value="INFO">Info</option>
          </select>

          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Actions</option>
            <option value="SCAN">Scans</option>
            <option value="DETECTION">Detection</option>
            <option value="DUPLICATE_CHECK">Duplicate Checks</option>
            <option value="DRAFT">Draft Creations</option>
            <option value="PUBLISH">Publish Events</option>
            <option value="REJECT">Rejections</option>
            <option value="ERROR">Errors</option>
          </select>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Clear all AI Staff activity audit logs?')) {
              onClearLogs();
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Clear Logs
        </button>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-wider">
                <th className="p-3.5 w-12 text-center">Status</th>
                <th className="p-3.5 w-32">Timestamp</th>
                <th className="p-3.5 w-28">Action</th>
                <th className="p-3.5 w-48">Source / Module</th>
                <th className="p-3.5">Result & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-center">{getStatusIcon(log.status)}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}{' '}
                    <span className="text-slate-400">
                      {new Date(log.timestamp).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-700 px-2 py-0.5">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">{log.source}</td>
                  <td className="p-3.5 text-slate-700 leading-relaxed">
                    {log.result}
                    {log.error && (
                      <p className="mt-1 text-[11px] font-mono text-red-600 bg-red-50 p-1.5 rounded-md">
                        {log.error}
                      </p>
                    )}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No activity logs match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
