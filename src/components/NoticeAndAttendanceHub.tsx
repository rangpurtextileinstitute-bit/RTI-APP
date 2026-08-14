import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  QrCode, 
  Users, 
  Filter, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { NoticeAndEventsBoard } from './NoticeAndEventsBoard';
import { DepartmentAttendance } from './DepartmentAttendance';
import { QRAttendanceGate } from './QRAttendanceGate';
import { 
  NoticeRecord, 
  AcademicEvent, 
  RegisteredMember, 
  GateAccessLog, 
  TeacherLateAlert, 
  ConsecutiveAbsenceRecord 
} from '../types';

interface NoticeAndAttendanceHubProps {
  notices: NoticeRecord[];
  events: AcademicEvent[];
  registeredMembers: RegisteredMember[];
  gateLogs: GateAccessLog[];
  isMasterAdmin: boolean;
  activeRole: string;
  onAddNotice: (notice: NoticeRecord) => void;
  onAddEvent: (event: AcademicEvent) => void;
  onScanGatePass: (log: GateAccessLog) => void;
  onOverrideAccess: (logId: string) => void;
  teacherLateAlerts?: TeacherLateAlert[];
  consecutiveAbsences?: ConsecutiveAbsenceRecord[];
  onTriggerAbsenceSms?: (studentId: string) => void;
  onSendGuardianAlert?: (alert: { studentId: string; studentName: string; guardianPhone: string; message: string }) => void;
}

export const NoticeAndAttendanceHub: React.FC<NoticeAndAttendanceHubProps> = ({
  notices,
  events,
  registeredMembers,
  gateLogs,
  isMasterAdmin,
  activeRole,
  onAddNotice,
  onAddEvent,
  onScanGatePass,
  onOverrideAccess,
  teacherLateAlerts = [],
  consecutiveAbsences = [],
  onTriggerAbsenceSms,
  onSendGuardianAlert
}) => {
  const [activeSection, setActiveSection] = useState<'notices' | 'deptAttendance' | 'gateLogs'>('notices');

  return (
    <div className="space-y-6">
      {/* Section Switcher Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSection('notices')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'notices'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-300" />
            <span>Digital Notice Board & Events ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('deptAttendance')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'deptAttendance'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Department Attendance Register</span>
          </button>

          <button
            onClick={() => setActiveSection('gateLogs')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'gateLogs'
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <QrCode className="w-4 h-4 text-sky-300" />
            <span>Campus Gate & Turnstile Logs ({gateLogs.length})</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400 px-3 py-1 bg-slate-950/60 rounded-xl border border-slate-800 hidden md:flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>RTI Real-Time Attendance Active</span>
        </div>
      </div>

      {/* Content Rendering based on Section */}
      {activeSection === 'notices' && (
        <NoticeAndEventsBoard
          notices={notices}
          events={events}
          isMasterAdmin={isMasterAdmin}
          activeRole={activeRole}
          onAddNotice={onAddNotice}
          onAddEvent={onAddEvent}
        />
      )}

      {activeSection === 'deptAttendance' && (
        <DepartmentAttendance
          registeredMembers={registeredMembers}
          gateLogs={gateLogs}
          isMasterAdmin={isMasterAdmin}
          activeRole={activeRole}
          consecutiveAbsences={consecutiveAbsences}
          onTriggerAbsenceSms={onTriggerAbsenceSms}
          onSendGuardianAlert={onSendGuardianAlert}
        />
      )}

      {activeSection === 'gateLogs' && (
        <QRAttendanceGate
          gateLogs={gateLogs}
          registeredMembers={registeredMembers}
          isMasterAdmin={isMasterAdmin}
          onScanGatePass={onScanGatePass}
          onOverrideAccess={onOverrideAccess}
          teacherLateAlerts={teacherLateAlerts}
          consecutiveAbsences={consecutiveAbsences}
          onTriggerAbsenceSms={onTriggerAbsenceSms}
        />
      )}
    </div>
  );
};
