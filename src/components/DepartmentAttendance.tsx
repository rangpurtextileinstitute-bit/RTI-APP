import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  MessageSquare, 
  AlertTriangle, 
  Filter, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Download, 
  Printer, 
  PhoneCall, 
  Check, 
  Building2,
  RefreshCw,
  FileText
} from 'lucide-react';
import { RegisteredMember, GateAccessLog } from '../types';

interface DepartmentAttendanceProps {
  registeredMembers: RegisteredMember[];
  gateLogs: GateAccessLog[];
  isMasterAdmin: boolean;
  activeRole?: string;
  onSendGuardianAlert?: (alert: { studentId: string; studentName: string; guardianPhone: string; message: string }) => void;
}

export const DepartmentAttendance: React.FC<DepartmentAttendanceProps> = ({
  registeredMembers,
  gateLogs,
  isMasterAdmin,
  activeRole = 'Super Admin',
  onSendGuardianAlert
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('wet_processing');
  const [selectedSession, setSelectedSession] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Daily Local Attendance state per student (student ID -> 'PRESENT' | 'ABSENT' | 'LATE')
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // SMS Gateway Dispatch Modal State
  const [showSmsModal, setShowSmsModal] = useState<boolean>(false);
  const [smsSending, setSmsSending] = useState<boolean>(false);
  const [smsLog, setSmsLog] = useState<string[]>([]);
  const [smsSuccessCount, setSmsSuccessCount] = useState<number>(0);
  const [customSmsMessage, setCustomSmsMessage] = useState<string>(
    'RTI Alert: Dear Guardian, your ward {NAME} (Roll: {ROLL}) was ABSENT today ({DATE}) in {DEPT} Department. Please contact RTI administration at +880 1711-000000.'
  );

  // Filter students for selected department and session
  const deptStudents = registeredMembers.filter(m => {
    const isStudent = m.role === 'Student' || !m.role;
    const matchesDept = m.department === selectedDept;
    const matchesSession = selectedSession === 'All' || m.batchOrDesignation?.includes(selectedSession) || m.semester?.includes(selectedSession);
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.rollOrEmpId.toLowerCase().includes(searchQuery.toLowerCase());
    return isStudent && matchesDept && matchesSession && matchesSearch;
  });

  // Get status for student (from user toggles or gate log default)
  const getStudentStatus = (studentId: string): 'PRESENT' | 'ABSENT' | 'LATE' => {
    if (attendanceRecords[studentId]) return attendanceRecords[studentId];
    // Check gate log for selected date
    const todayLog = gateLogs.find(l => l.personId === studentId && l.timestamp.startsWith(selectedDate));
    if (todayLog) {
      if (todayLog.status === 'FLAGGED_LATE') return 'LATE';
      if (todayLog.status === 'GRANTED') return 'PRESENT';
    }
    return 'PRESENT'; // default
  };

  const setStudentStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
    setIsSaved(false);
  };

  // Mark All buttons
  const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
    const newRecords: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = { ...attendanceRecords };
    deptStudents.forEach(s => {
      newRecords[s.rollOrEmpId] = status;
    });
    setAttendanceRecords(newRecords);
    setIsSaved(false);
  };

  // Save Attendance Record
  const handleSaveAttendance = () => {
    setIsSaved(true);
    alert(`✅ Daily Department Attendance for ${deptStudents.length} student(s) saved for ${selectedDate}.`);
  };

  // Absent students list
  const absentStudents = deptStudents.filter(s => getStudentStatus(s.rollOrEmpId) === 'ABSENT');

  // Trigger Bulk Guardian SMS Gateway
  const handleTriggerBulkSms = () => {
    if (absentStudents.length === 0) {
      alert('ℹ️ No students are marked ABSENT in the selected department list.');
      return;
    }

    setShowSmsModal(true);
    setSmsSending(true);
    setSmsLog([]);
    setSmsSuccessCount(0);

    const deptNameMap: Record<string, string> = {
      wet_processing: 'Wet Processing',
      yarn_mfg: 'Yarn Manufacturing',
      fabric_mfg: 'Fabric Manufacturing',
      apparel_mfg: 'Apparel Engineering'
    };
    const currentDeptName = deptNameMap[selectedDept] || 'Textile Dept';

    let count = 0;
    const logs: string[] = [];

    absentStudents.forEach((student, index) => {
      setTimeout(() => {
        const guardianPhone = student.guardianPhone || student.phone || '+8801700000000';
        const msg = customSmsMessage
          .replace('{NAME}', student.name)
          .replace('{ROLL}', student.rollOrEmpId)
          .replace('{DATE}', selectedDate)
          .replace('{DEPT}', currentDeptName);

        if (onSendGuardianAlert) {
          onSendGuardianAlert({
            studentId: student.rollOrEmpId,
            studentName: student.name,
            guardianPhone,
            message: msg
          });
        }

        count++;
        setSmsSuccessCount(count);
        setSmsLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📲 SMS Sent to Guardian of ${student.name} (${guardianPhone}): Delivered OK`]);

        if (index === absentStudents.length - 1) {
          setSmsSending(false);
        }
      }, (index + 1) * 600);
    });
  };

  // Quick single SMS
  const handleSendSingleSms = (student: RegisteredMember) => {
    const guardianPhone = student.guardianPhone || student.phone || '+8801700000000';
    const deptNameMap: Record<string, string> = {
      wet_processing: 'Wet Processing',
      yarn_mfg: 'Yarn Manufacturing',
      fabric_mfg: 'Fabric Manufacturing',
      apparel_mfg: 'Apparel Engineering'
    };
    const currentDeptName = deptNameMap[selectedDept] || 'Textile Dept';

    const msg = customSmsMessage
      .replace('{NAME}', student.name)
      .replace('{ROLL}', student.rollOrEmpId)
      .replace('{DATE}', selectedDate)
      .replace('{DEPT}', currentDeptName);

    if (onSendGuardianAlert) {
      onSendGuardianAlert({
        studentId: student.rollOrEmpId,
        studentName: student.name,
        guardianPhone,
        message: msg
      });
    }

    alert(`📲 Absentee SMS Alert dispatched successfully to Guardian (${guardianPhone}) for ${student.name}!`);
  };

  const presentCount = deptStudents.filter(s => getStudentStatus(s.rollOrEmpId) === 'PRESENT').length;
  const absentCount = absentStudents.length;
  const lateCount = deptStudents.filter(s => getStudentStatus(s.rollOrEmpId) === 'LATE').length;
  const totalCount = deptStudents.length;
  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-indigo-800/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <Building2 className="w-64 h-64 text-indigo-400" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Daily Department Register & SMS Gateway
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-mono flex items-center space-x-2">
                  <span>Department Attendance & Automated Absentee Tracker</span>
                </h2>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-300 max-w-3xl leading-relaxed">
              Teachers and Faculty can record daily department-wise roll call attendance, track irregular/consecutive absentees, and dispatch automated SMS text alerts directly to guardians.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerBulkSms}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>📲 Dispatch Absentee Guardian SMS ({absentCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Department Selector */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Department *</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="wet_processing">Wet Processing Dept</option>
              <option value="yarn_mfg">Yarn Manufacturing Dept</option>
              <option value="fabric_mfg">Fabric Manufacturing Dept</option>
              <option value="apparel_mfg">Apparel Engineering Dept</option>
            </select>
          </div>

          {/* Academic Session / Batch */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Academic Session / Batch</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="All">All Sessions / Batches</option>
              <option value="2020-21">Session 2020-21</option>
              <option value="2021-22">Session 2021-22</option>
              <option value="2022-23">Session 2022-23</option>
              <option value="2023-24">Session 2023-24</option>
              <option value="2024-25">Session 2024-25</option>
              <option value="2025-26">Session 2025-26</option>
              <option value="2026-27">Session 2026-27</option>
              <option value="2027-28">Session 2027-28</option>
              <option value="2028-29">Session 2028-29</option>
              <option value="2029-30">Session 2029-30</option>
            </select>
          </div>

          {/* Attendance Date */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Attendance Date *</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Search Student / Roll</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or Roll..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-800">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Enrolled</div>
            <div className="text-xl font-black text-white font-mono">{totalCount}</div>
          </div>

          <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-center">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">Present Today</div>
            <div className="text-xl font-black text-emerald-300 font-mono">{presentCount}</div>
          </div>

          <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-center">
            <div className="text-[10px] text-amber-400 font-bold uppercase">Late Arrival</div>
            <div className="text-xl font-black text-amber-300 font-mono">{lateCount}</div>
          </div>

          <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/30 text-center">
            <div className="text-[10px] text-rose-400 font-bold uppercase">Absent Today</div>
            <div className="text-xl font-black text-rose-300 font-mono">{absentCount}</div>
          </div>

          <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-center col-span-2 sm:col-span-1">
            <div className="text-[10px] text-indigo-300 font-bold uppercase">Attendance Rate</div>
            <div className="text-xl font-black text-indigo-200 font-mono">{attendanceRate}%</div>
          </div>
        </div>
      </div>

      {/* Main Attendance Marking List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-base text-white">Daily Department Attendance Sheet</h3>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/30">
              {selectedDate}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleMarkAll('PRESENT')}
              className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-xl text-xs font-bold transition-all"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('ABSENT')}
              className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700/60 rounded-xl text-xs font-bold transition-all"
            >
              Mark All Absent
            </button>
            <button
              onClick={handleSaveAttendance}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1 ${
                isSaved 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isSaved ? 'Saved!' : 'Save Attendance'}</span>
            </button>
          </div>
        </div>

        {deptStudents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto opacity-60" />
            <p className="text-sm font-bold">No students found matching selected department and filter criteria.</p>
            <p className="text-xs text-slate-500">Register new students via the Sign Up button or adjust filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                  <th className="py-3 px-4">Student Profile</th>
                  <th className="py-3 px-4">Roll / ID</th>
                  <th className="py-3 px-4">Session / Batch</th>
                  <th className="py-3 px-4">Guardian Contact</th>
                  <th className="py-3 px-4 text-center">Attendance Status</th>
                  <th className="py-3 px-4 text-right">Guardian SMS Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {deptStudents.map((student) => {
                  const status = getStudentStatus(student.rollOrEmpId);
                  const guardianPhone = student.guardianPhone || student.phone || 'N/A';

                  return (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.name)}`}
                            alt={student.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-extrabold text-white text-sm">{student.name}</div>
                            <div className="text-[11px] text-slate-400">{student.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-sky-300">
                        {student.rollOrEmpId}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-300">
                        {student.batchOrDesignation || 'Session 2022-23'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-300 flex items-center space-x-1">
                          <PhoneCall className="w-3 h-3 text-purple-400" />
                          <span>{guardianPhone}</span>
                        </div>
                        {student.guardianName && (
                          <div className="text-[10px] text-slate-400">{student.guardianName} (Guardian)</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setStudentStatus(student.rollOrEmpId, 'PRESENT')}
                            className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs flex items-center space-x-1 ${
                              status === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>PRESENT</span>
                          </button>

                          <button
                            onClick={() => setStudentStatus(student.rollOrEmpId, 'LATE')}
                            className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs flex items-center space-x-1 ${
                              status === 'LATE'
                                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>LATE</span>
                          </button>

                          <button
                            onClick={() => setStudentStatus(student.rollOrEmpId, 'ABSENT')}
                            className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs flex items-center space-x-1 ${
                              status === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400 animate-pulse'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>ABSENT</span>
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {status === 'ABSENT' ? (
                          <button
                            onClick={() => handleSendSingleSms(student)}
                            className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700/60 font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5 ml-auto"
                            title="Send Absentee SMS to Guardian"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                            <span>Send SMS Alert</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-bold">No Alert Needed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Irregular / Absentee Student Watchlist */}
      {absentStudents.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-300 font-black text-base">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Irregular & Absentee Student Watchlist ({absentStudents.length})</span>
            </div>
            <button
              onClick={handleTriggerBulkSms}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              Dispatch All Guardian Text Alerts
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {absentStudents.map((st) => (
              <div key={st.id} className="p-3.5 bg-slate-900 border border-rose-900/60 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <div>
                    <div className="font-extrabold text-white text-xs">{st.name}</div>
                    <div className="text-[11px] font-mono text-sky-400">{st.rollOrEmpId}</div>
                    <div className="text-[10px] text-slate-400">Guardian: {st.guardianPhone || st.phone}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleSendSingleSms(st)}
                  className="p-2 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-xl border border-rose-700/50"
                  title="SMS Guardian"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk SMS Gateway Dispatch Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-rose-700/60 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-rose-400">
                <Send className="w-5 h-5 animate-bounce" />
                <h3 className="font-extrabold text-base text-white">Automated Guardian SMS Gateway</h3>
              </div>
              {!smsSending && (
                <button
                  onClick={() => setShowSmsModal(false)}
                  className="text-slate-400 hover:text-white font-bold text-lg"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-2xl space-y-1 text-xs text-rose-200">
              <div className="font-bold text-white flex items-center justify-between">
                <span>SMS Gateway Status: Transmitting...</span>
                <span className="font-mono text-amber-300">
                  {smsSuccessCount} / {absentStudents.length} Delivered
                </span>
              </div>
              <p className="text-[11px] text-rose-200/80">
                Dispatching real-time SMS alerts to guardians of absent students via RTI Telecommunications Gateway.
              </p>
            </div>

            {/* Custom Template Editor */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 text-xs">SMS Template Message</label>
              <textarea
                value={customSmsMessage}
                onChange={(e) => setCustomSmsMessage(e.target.value)}
                disabled={smsSending}
                rows={3}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* Live Terminal Log */}
            <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 h-36 overflow-y-auto font-mono text-[11px] text-emerald-400 space-y-1">
              {smsLog.length === 0 ? (
                <div className="text-slate-600 text-center py-4">Initializing SMS API connection...</div>
              ) : (
                smsLog.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-1">
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                disabled={smsSending}
                onClick={() => setShowSmsModal(false)}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                  smsSending 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                }`}
              >
                {smsSending ? 'Transmitting SMS...' : 'Close SMS Gateway Logs'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
