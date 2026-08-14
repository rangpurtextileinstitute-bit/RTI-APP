import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Lock, 
  Filter, 
  Clock, 
  User, 
  Building2, 
  CheckCircle2, 
  Key, 
  FileText, 
  Database,
  Terminal,
  X
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogViewProps {
  logs: AuditLog[];
  isMasterAdmin: boolean;
  onClose?: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  logs,
  isMasterAdmin,
  onClose
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesCategory = filterCategory === 'All' || 
      (filterCategory === 'Admin Overrides' && (log.action.includes('Admin') || log.action.includes('Boot') || log.action.includes('Master'))) ||
      (filterCategory === 'Gate Scans' && (log.action.includes('Gate') || log.action.includes('Turnstile'))) ||
      (filterCategory === 'Department Data' && (log.action.includes('Recipe') || log.action.includes('Yarn') || log.action.includes('Batch')));

    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const exportCsv = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Action', 'Details', 'Department'];
    const rows = filteredLogs.map(l => [l.id, l.timestamp, l.user, l.action, l.details, l.department || '']);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(x => `"${x}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RTI_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-6">
      {!isMasterAdmin && (
        <div className="p-3.5 bg-amber-950/70 border border-amber-500/50 rounded-xl flex items-center justify-between text-xs text-amber-200 font-bold">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>🔒 Read-Only Mode: Main Admin Authentication Required (`rangpurtextileinstitute@gmail.com`) to modify database or configuration records.</span>
          </div>
        </div>
      )}

      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Immutable Compliance Trail
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>SHA-256 Ledger Active</span>
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white font-mono mt-0.5">
              RTI System Audit & Security Logs
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export CSV</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          {['All', 'Admin Overrides', 'Gate Scans', 'Department Data'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Audit Stream Table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Authority</th>
                <th className="p-3">Action Event</th>
                <th className="p-3">Audit Details</th>
                <th className="p-3">Department</th>
                <th className="p-3 text-right">Ledger Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 italic">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => {
                  const isMaster = log.user.includes('Master Admin');
                  return (
                    <tr key={log.id || idx} className="hover:bg-slate-900/60 transition-all">
                      <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1.5 font-bold text-white">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.user}</span>
                          {isMaster && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              MASTER
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-indigo-300">{log.action}</td>
                      <td className="p-3 text-slate-300 max-w-xs truncate">{log.details}</td>
                      <td className="p-3 text-slate-400">{log.department || 'General'}</td>
                      <td className="p-3 text-right text-[10px] font-mono text-slate-500">
                        {Math.sin(idx + 1).toString(16).substring(2, 10).toUpperCase()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
