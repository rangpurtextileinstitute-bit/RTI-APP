import React from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  FileSpreadsheet, 
  History, 
  RotateCcw, 
  Unlock,
  Key
} from 'lucide-react';

interface MasterAdminBannerProps {
  onOpenRegisterModal: () => void;
  onOpenAuditModal: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onQuickGateOverride: () => void;
}

export const MasterAdminBanner: React.FC<MasterAdminBannerProps> = ({
  onOpenRegisterModal,
  onOpenAuditModal,
  onResetData,
  onExportData,
  onQuickGateOverride
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border-b border-indigo-700/50 text-indigo-100 px-4 py-2.5 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Status */}
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-indigo-500/20 text-indigo-300">
            <ShieldCheck className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Master Admin Control Bar:
            </span>
            <span className="text-indigo-200 ml-1.5 font-normal hidden sm:inline">
              Elevated credentials granted. Unlocked all department forms, recipe overrides, & gate controls.
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onQuickGateOverride}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-all text-[11px]"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Gate Force Override</span>
          </button>

          <button
            onClick={onOpenRegisterModal}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition-all text-[11px]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register ID Badge</span>
          </button>

          <button
            onClick={onOpenAuditModal}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-indigo-700/50 transition-all text-[11px]"
          >
            <History className="w-3.5 h-3.5 text-indigo-300" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={onExportData}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-indigo-700/50 transition-all text-[11px]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-300" />
            <span>Export Institute Data</span>
          </button>

          <button
            onClick={onResetData}
            className="flex items-center space-x-1 px-2 py-1 rounded-md bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 font-medium transition-all text-[11px]"
            title="Reset Institute Data to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
