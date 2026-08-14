import React, { useState, useEffect } from 'react';
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
  Heart,
  Droplet,
  Megaphone,
  Bell,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { 
  WetProcessingBatch, 
  YarnQualityRecord, 
  LoomProductionRecord, 
  SewingLineRecord, 
  GateAccessLog,
  RedCrescentMember,
  NoticeRecord
} from '../types';
import { RedCrescentUnitSection } from './RedCrescentUnitSection';
import { EmergencyHelplineWidget } from './EmergencyHelplineWidget';

interface DashboardOverviewProps {
  batches: WetProcessingBatch[];
  yarnRecords: YarnQualityRecord[];
  loomRecords: LoomProductionRecord[];
  sewingRecords: SewingLineRecord[];
  gateLogs: GateAccessLog[];
  notices?: NoticeRecord[];
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
  notices = [],
  redCrescentMembers = [],
  onAddRedCrescentMember = () => {},
  onUpdateRedCrescentMember = () => {},
  onDeleteRedCrescentMember = () => {},
  onNavigateTab,
  isMasterAdmin
}) => {
  const activeGateCount = gateLogs.filter(l => l.direction === 'IN' && l.status === 'GRANTED').length;

  const urgentNotices = notices.length > 0 ? notices : [
    {
      id: 'urgent-01',
      title: 'Final Semester Examination Routine & Digital Clearance 2026 Published',
      category: 'Urgent' as const,
      author: 'Office of the Controller of Examinations',
      department: 'Academic Office',
      date: '2026-08-14',
      content: 'All departmental students across 4 academic textile disciplines must clear dues and collect smart admit badges before the exam commencement date.',
      priority: 'High' as const,
      refNo: 'RTI/EXAM/2026/N-104',
      isPublished: true
    },
    {
      id: 'urgent-02',
      title: 'Campus Emergency SOS Protocol & Begum Rokeya Hostel Safety Advisory',
      category: 'Hostel & Mess' as const,
      author: 'Proctorial Board & Female Hostel Warden',
      department: 'Campus Security',
      date: '2026-08-14',
      content: 'Direct click-to-call helpline numbers (Warden: 01711-222333, Security: 01711-000111, Govt: 109 & 999) and Anonymous Complaint Box are fully active.',
      priority: 'High' as const,
      refNo: 'RTI/SAFE/2026/N-089',
      isPublished: true
    }
  ];

  const [activeNoticeIdx, setActiveNoticeIdx] = useState(0);

  useEffect(() => {
    if (urgentNotices.length <= 1) return;
    const interval = setInterval(() => {
      setActiveNoticeIdx(prev => (prev + 1) % urgentNotices.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [urgentNotices.length]);

  const currentNotice = urgentNotices[activeNoticeIdx] || urgentNotices[0];

  return (
    <div className="space-y-6 w-full">
      {/* Urgent Campus Notice Ticker & Announcement Banner */}
      <div className="w-full bg-gradient-to-r from-rose-950 via-amber-950/80 to-slate-900 border border-rose-600/50 rounded-2xl p-4 text-white shadow-xl shadow-rose-950/40 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1 w-full">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-rose-600/30">
            <Megaphone className="w-5 h-5 text-white animate-bounce" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span>URGENT ANNOUNCEMENT</span>
              </span>
              <span className="text-[11px] font-mono text-amber-300/90 font-bold">
                Ref: {currentNotice.refNo || 'RTI/ACAD/2026'}
              </span>
              <span className="text-[11px] text-slate-300 font-medium flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{currentNotice.date}</span>
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-black text-white tracking-tight mt-1 truncate">
              {currentNotice.title}
            </h4>
            <p className="text-[11px] text-slate-200 line-clamp-1 mt-0.5">
              {currentNotice.content}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
          <button
            onClick={() => onNavigateTab('notices_attendance')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap active:scale-95 cursor-pointer"
            title="Read complete notices on Notice Board"
          >
            <span>Notice Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

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
              Rangpur Textile Institute Management System
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Official RTI OS v5.0 portal for Student & Faculty Registries, Digital Notice Board, Attendance Gate Logging, and 4 Academic Textile Departments.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateTab('notices_attendance')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Gate & Attendance Logs</span>
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

      {/* Campus Emergency SOS, Women Helpline & Anonymous Safety Complaints Widget */}
      <EmergencyHelplineWidget isMasterAdmin={isMasterAdmin} />

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
            <span>Core Navigation Shortcuts</span>
          </h3>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => onNavigateTab('students_directory')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-800 font-semibold text-left border border-slate-200 transition-all flex justify-between items-center"
            >
              <span className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Students Directory & ID Cards</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('faculty_directory')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-800 font-semibold text-left border border-slate-200 transition-all flex justify-between items-center"
            >
              <span className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Faculty & Teachers Directory</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('notices_attendance')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-800 font-semibold text-left border border-slate-200 transition-all flex justify-between items-center"
            >
              <span className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Digital Notice Board & Calendar</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('blood_donors')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-800 font-semibold text-left border border-slate-200 transition-all flex justify-between items-center"
            >
              <span className="flex items-center space-x-2">
                <Droplet className="w-4 h-4 text-rose-600 fill-rose-600" />
                <span>RTI Blood Donation Club & Donors</span>
              </span>
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
