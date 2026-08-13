import React from 'react';
import { 
  BarChart3, 
  FlaskConical, 
  Boxes, 
  Grid, 
  Scissors, 
  QrCode, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Sparkles,
  Bot,
  FileText,
  FileCheck,
  Heart
} from 'lucide-react';
import { 
  WetProcessingBatch, 
  YarnQualityRecord, 
  LoomProductionRecord, 
  SewingLineRecord, 
  GateAccessLog,
  RedCrescentMember
} from '../types';
import { RedCrescentUnitSection } from './RedCrescentUnitSection';

interface DashboardOverviewProps {
  batches: WetProcessingBatch[];
  yarnRecords: YarnQualityRecord[];
  loomRecords: LoomProductionRecord[];
  sewingRecords: SewingLineRecord[];
  gateLogs: GateAccessLog[];
  redCrescentMembers?: RedCrescentMember[];
  onAddRedCrescentMember?: (member: RedCrescentMember) => void;
  onUpdateRedCrescentMember?: (member: RedCrescentMember) => void;
  onDeleteRedCrescentMember?: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  isMasterAdmin: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  batches,
  yarnRecords,
  loomRecords,
  sewingRecords,
  gateLogs,
  redCrescentMembers = [],
  onAddRedCrescentMember = () => {},
  onUpdateRedCrescentMember = () => {},
  onDeleteRedCrescentMember = () => {},
  onNavigateTab,
  isMasterAdmin
}) => {
  const activeGateCount = gateLogs.filter(l => l.direction === 'IN' && l.status === 'GRANTED').length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Institute Summary Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-2xl p-6 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Central Operations Console
              </span>
              {isMasterAdmin && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Master Admin Active
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-mono mt-2">
              NIOTRON Textile Institute Operating System
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Integrated real-time management for 4 Academic Textile Departments, Chemical Dyeing Labs, Spinning Mills, Weaving Looms, Apparel SAM Efficiency, and Smart QR Gate Turnstiles.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateTab('qr_gate')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Live Gate Monitor</span>
            </button>
          </div>
        </div>

        {/* 4 Core Department Stat Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-indigo-900/60">
          <div 
            onClick={() => onNavigateTab('wet_processing')}
            className="bg-slate-900/80 p-4 rounded-xl border border-sky-800/40 hover:border-sky-500 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center text-sky-400">
              <FlaskConical className="w-5 h-5" />
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">1. Wet Processing</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{batches.length} Active Batches</div>
            <div className="text-[10px] text-sky-300 mt-1">Avg Delta-E: 0.42 ΔE</div>
          </div>

          <div 
            onClick={() => onNavigateTab('yarn_mfg')}
            className="bg-slate-900/80 p-4 rounded-xl border border-purple-800/40 hover:border-purple-500 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center text-purple-400">
              <Boxes className="w-5 h-5" />
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">2. Yarn Manufacturing</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{yarnRecords.length} Quality Logs</div>
            <div className="text-[10px] text-purple-300 mt-1">Spindle Speed: 18,450 RPM</div>
          </div>

          <div 
            onClick={() => onNavigateTab('fabric_mfg')}
            className="bg-slate-900/80 p-4 rounded-xl border border-violet-800/40 hover:border-violet-500 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center text-violet-400">
              <Grid className="w-5 h-5" />
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">3. Fabric Manufacturing</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{loomRecords.length} Active Looms</div>
            <div className="text-[10px] text-violet-300 mt-1">Air-Jet & Rapier Running</div>
          </div>

          <div 
            onClick={() => onNavigateTab('apparel_mfg')}
            className="bg-slate-900/80 p-4 rounded-xl border border-blue-800/40 hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center text-blue-400">
              <Scissors className="w-5 h-5" />
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">4. Apparel Manufacturing</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{sewingRecords.length} Sewing Lines</div>
            <div className="text-[10px] text-blue-300 mt-1">Line Efficiency: 93.2%</div>
          </div>
        </div>
      </div>

      {/* Grid: Gate Activity + Quick Department Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Live Gate Feed Widget */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Turnstile Attendance Stream</span>
            </h3>
            <button
              onClick={() => onNavigateTab('qr_gate')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              View All Gate Logs →
            </button>
          </div>

          <div className="space-y-3">
            {gateLogs.slice(0, 4).map(log => (
              <div key={log.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl text-white font-bold text-xs ${
                    log.status === 'GRANTED' ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    {log.direction}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{log.personName}</div>
                    <div className="text-[10px] text-slate-500">{log.role} • {log.gateLocation}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status === 'GRANTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {log.status.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Shortcuts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Institute Shortcuts & Advanced Tools</span>
          </h3>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => onNavigateTab('ai_assistant')}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 text-white font-bold text-left shadow-md transition-all flex justify-between items-center"
            >
              <span className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>AI Risk & Notice Assistant</span>
              </span>
              <ChevronRight className="w-4 h-4 text-indigo-300" />
            </button>

            <button
              onClick={() => onNavigateTab('guardian_portal')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-800 font-semibold text-left border border-slate-200 transition-all flex justify-between items-center"
            >
              <span className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Guardian Portal & Fee Pay</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('notices_events')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-800 font-semibold text-left border border-slate-200 transition-all flex justify-between items-center"
            >
              <span className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Digital Notice Board & Calendar</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('audit_logs')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left border border-slate-200 transition-all flex justify-between items-center"
            >
              <span className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-slate-600" />
                <span>Immutable Security Audit Logs</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('wet_processing')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-800 font-semibold text-left border border-slate-200 transition-all flex justify-between items-center"
            >
              <span>🧪 Form: New Dyeing Recipe Batch</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('yarn_mfg')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-800 font-semibold text-left border border-slate-200 transition-all flex justify-between items-center"
            >
              <span>🧵 Form: Log Yarn Count Quality Test</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Red Crescent Unit Section on Home Dashboard */}
      <RedCrescentUnitSection
        redCrescentMembers={redCrescentMembers}
        isMasterAdmin={isMasterAdmin}
        onAddRedCrescentMember={onAddRedCrescentMember}
        onUpdateRedCrescentMember={onUpdateRedCrescentMember}
        onDeleteRedCrescentMember={onDeleteRedCrescentMember}
      />
    </div>
  );
};
