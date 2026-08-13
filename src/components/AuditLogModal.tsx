import React from 'react';
import { History, ShieldCheck, Download, X } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogModalProps {
  logs: AuditLog[];
  onClose: () => void;
  onExport: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  logs,
  onClose,
  onExport
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-600" />
            <span>Master Admin Security & System Audit Log</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
          {logs.map(log => (
            <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{log.action}</span>
                <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
              </div>
              <p className="text-slate-600">{log.details}</p>
              <div className="text-[10px] text-indigo-600 font-semibold">User: {log.user}</div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-4">
          <button
            onClick={onExport}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Trail (JSON)</span>
          </button>
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
