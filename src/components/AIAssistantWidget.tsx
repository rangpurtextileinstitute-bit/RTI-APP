import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  AlertTriangle, 
  DollarSign, 
  FileText, 
  Send, 
  CheckCircle2, 
  Users, 
  TrendingDown, 
  Zap, 
  Copy, 
  Download,
  Share2,
  X,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { 
  RegisteredMember, 
  GateAccessLog, 
  StudentFeeStatus, 
  NoticeRecord, 
  StudentGradeRecord 
} from '../types';

interface AIAssistantWidgetProps {
  members: RegisteredMember[];
  gateLogs: GateAccessLog[];
  studentFees: StudentFeeStatus[];
  studentGrades: StudentGradeRecord[];
  onPublishNotice: (notice: NoticeRecord) => void;
  onSendGuardianAlert?: (studentId: string, alertType: 'LATE_ARRIVAL' | 'FEE_REMINDER' | 'ATTENDANCE_WARNING' | 'EXAM_NOTICE' | 'CONSECUTIVE_ABSENCE', msg: string) => void;
  onClose?: () => void;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  members,
  gateLogs,
  studentFees,
  studentGrades,
  onPublishNotice,
  onSendGuardianAlert,
  onClose
}) => {
  const [activeAiTab, setActiveAiTab] = useState<'attendance' | 'fees' | 'notice_drafter' | 'chat'>('attendance');
  
  // Interactive SMS Modal state
  const [smsModal, setSmsModal] = useState<{
    isOpen: boolean;
    studentId: string;
    studentName: string;
    phone: string;
    alertType: 'ATTENDANCE_WARNING' | 'FEE_REMINDER';
    preformattedMessage: string;
  } | null>(null);
  const [smsToast, setSmsToast] = useState<string | null>(null);

  // Notice drafter state
  const [noticeTopic, setNoticeTopic] = useState('Dyeing Lab High-Pressure Steam Boiler Maintenance');
  const [noticeCategory, setNoticeCategory] = useState<NoticeRecord['category']>('Lab Safety');
  const [noticeRole, setNoticeRole] = useState<'All' | 'Students' | 'Faculty' | 'Guardians'>('All');
  const [draftedNoticeText, setDraftedNoticeText] = useState('');
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState('');

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am the RTI Operations Intelligence Assistant. Ask me about attendance risk detection, fee due analysis, textile formulations, or drafting campus notices.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Attendance risk computation
  const students = members.filter(m => m.role === 'Student');
  const atRiskStudents = students.map(s => {
    const grade = studentGrades.find(g => g.studentId === s.rollOrEmpId);
    const logs = gateLogs.filter(l => l.personId === s.rollOrEmpId);
    const lateCount = logs.filter(l => l.status === 'FLAGGED_LATE').length;
    const attPct = grade ? grade.attendancePercent : 85;
    const isAtRisk = attPct < 80 || lateCount > 0;
    return {
      student: s,
      attendancePercent: attPct,
      lateCount,
      isAtRisk,
      riskLevel: attPct < 75 ? 'CRITICAL' : attPct < 80 ? 'HIGH' : lateCount > 0 ? 'MODERATE' : 'LOW'
    };
  }).filter(s => s.isAtRisk);

  // Fee dues computation
  const feeDuesList = studentFees.map(f => {
    const member = members.find(m => m.rollOrEmpId === f.studentId);
    const totalDue = (f.tuitionFeeUSD + f.labFeeUSD + f.libraryFeeUSD + f.hostelFeeUSD) - f.paidAmountUSD;
    return {
      feeRecord: f,
      member,
      totalDue: Math.max(0, totalDue),
      isOverdue: f.status === 'DUE_OVERDUE' || (f.status === 'PARTIAL' && new Date(f.dueDate) < new Date('2026-08-11'))
    };
  }).filter(f => f.totalDue > 0);

  const totalOutstandingBDT = feeDuesList.reduce((acc, curr) => acc + curr.totalDue, 0);

  // Draft notice action
  const handleGenerateNoticeDraft = () => {
    setIsGeneratingNotice(true);
    setTimeout(() => {
      const generated = `OFFICIAL INSTITUTIONAL NOTICE\nRef: RTI/NOTICE/2026/${Math.floor(100 + Math.random() * 900)}\nDate: ${new Date().toISOString().split('T')[0]}\n\nSUBJECT: ${noticeTopic.toUpperCase()}\n\nThis is an official announcement from the Rangpur Textile Institute Administration regarding ${noticeTopic}.\n\nKEY DIRECTIVES & GUIDELINES:\n1. All concern parties (${noticeRole}) must strictly observe safety protocols and scheduling rules.\n2. Lab Technicians & Faculty Members are requested to log equipment state into the Departmental OS.\n3. Turnstile gate access rules remain active; please scan valid QR ID Badges at turnstiles.\n\nIssued by: Office of the Director General & Master Admin\nRangpur Textile Institute (RTI)`;
      setDraftedNoticeText(generated);
      setIsGeneratingNotice(false);
    }, 600);
  };

  const handlePublishDraftedNotice = () => {
    if (!draftedNoticeText) return;
    const newNotice: NoticeRecord = {
      id: `not-${Date.now()}`,
      title: noticeTopic,
      category: noticeCategory,
      author: 'RTI AI Notice Assistant (Master Admin Approved)',
      department: 'General Administration',
      date: new Date().toISOString().split('T')[0],
      content: draftedNoticeText,
      priority: noticeCategory === 'Lab Safety' || noticeCategory === 'Urgent' ? 'High' : 'Medium',
      isPublished: true,
      targetRole: noticeRole,
      refNo: `RTI/AI/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`
    };

    onPublishNotice(newNotice);
    setPublishSuccessMsg('Notice successfully published directly to Digital Notice Board!');
    setTimeout(() => setPublishSuccessMsg(''), 4000);
  };

  // AI Chat send
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: userTime }]);
    setChatInput('');

    // Generate intelligent AI reply based on context
    setTimeout(() => {
      let aiText = '';
      const q = userMsg.toLowerCase();
      
      if (q.includes('attendance') || q.includes('risk') || q.includes('absent')) {
        aiText = `📊 Attendance Risk Analysis:\nFound ${atRiskStudents.length} student(s) requiring academic attention. For example, Siam Chowdhury (Roll: RTI-AP-S50088) currently stands at 74.5% attendance and was flagged late at Main Gate today. Would you like me to dispatch an SMS alert to his guardian?`;
      } else if (q.includes('fee') || q.includes('due') || q.includes('tuition') || q.includes('paid')) {
        aiText = `💰 Fee Due Analysis:\nTotal outstanding student balance across all departments is ৳${totalOutstandingBDT.toLocaleString()} BDT. High-priority overdue account: Siam Chowdhury (৳1,900 BDT overdue). Mahia Zaman has ৳650 BDT partial balance due on Aug 20.`;
      } else if (q.includes('dye') || q.includes('delta') || q.includes('wet') || q.includes('recipe')) {
        aiText = `🧪 Wet Processing Advisor:\nTarget Delta-E tolerance for Reactive Royal Blue 3G is ≤ 0.50 ΔE. Current batch WP-2026-089 achieved 0.32 ΔE (EXCELLENT). Ensure liquor ratio 1:8 is maintained at 60°C for optimal fixation.`;
      } else if (q.includes('yarn') || q.includes('csp') || q.includes('count')) {
        aiText = `🧵 Yarn Quality Insight:\nCompact Spun 40s Ne Lot YRN-40S-COMP achieved CSP 2,940 (Target ≥ 2,800) with spindle speed 18,500 RPM. Hairiness index H = 4.1. Waste percentage is well within 15% tolerance.`;
      } else {
        aiText = `🤖 RTI AI Assistant: I can help analyze live attendance risk scores, fee due collection targets, draft campus notices, or verify textile engineering parameters (CSP, SAM, Delta-E). Feel free to select any quick analysis tab above!`;
      }

      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: aiText, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    }, 500);
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Title Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-indigo-900/60 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                AI Operations Intelligence Engine
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white font-mono mt-0.5 flex items-center space-x-2">
              <span>RTI Smart AI Assistant</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Feature Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 relative z-10">
        <button
          onClick={() => setActiveAiTab('attendance')}
          className={`flex items-center justify-center space-x-2 p-3 rounded-xl font-bold text-xs transition-all ${
            activeAiTab === 'attendance'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Attendance Risk ({atRiskStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveAiTab('fees')}
          className={`flex items-center justify-center space-x-2 p-3 rounded-xl font-bold text-xs transition-all ${
            activeAiTab === 'fees'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Fee Due Analysis (৳{(totalOutstandingBDT/1000).toFixed(1)}k BDT)</span>
        </button>

        <button
          onClick={() => setActiveAiTab('notice_drafter')}
          className={`flex items-center justify-center space-x-2 p-3 rounded-xl font-bold text-xs transition-all ${
            activeAiTab === 'notice_drafter'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-400" />
          <span>Notice Drafter AI</span>
        </button>

        <button
          onClick={() => setActiveAiTab('chat')}
          className={`flex items-center justify-center space-x-2 p-3 rounded-xl font-bold text-xs transition-all ${
            activeAiTab === 'chat'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span>AI Textile Chat Assistant</span>
        </button>
      </div>

      {/* TAB CONTENT 1: Attendance Risk Detection */}
      {activeAiTab === 'attendance' && (
        <div className="mt-5 space-y-4 relative z-10">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-300">Automated Attendance Risk Scan</h4>
              <p className="text-xs text-slate-300 mt-1">
                AI algorithm scanned live turnstile gate logs and academic rosters. Detected <span className="font-bold text-amber-400">{atRiskStudents.length} student(s)</span> under 80% attendance threshold or flagged late today.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {atRiskStudents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2 opacity-50" />
                <span>All registered students currently maintain high attendance compliance (&gt;80%).</span>
              </div>
            ) : (
              atRiskStudents.map(({ student, attendancePercent, lateCount, riskLevel }) => (
                <div key={student.id} className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{student.name}</span>
                      <span className="font-mono text-xs text-sky-300">({student.rollOrEmpId})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                        riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {riskLevel} RISK
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center space-x-4">
                      <span>Batch: {student.batchOrDesignation}</span>
                      <span>•</span>
                      <span>Attendance: <strong className={attendancePercent < 80 ? 'text-amber-400' : 'text-emerald-400'}>{attendancePercent}%</strong></span>
                      <span>•</span>
                      <span>Gate Flags: <strong className="text-rose-400">{lateCount} Late Today</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {onSendGuardianAlert && (
                      <button
                        onClick={() => {
                          setSmsModal({
                            isOpen: true,
                            studentId: student.rollOrEmpId,
                            studentName: student.name,
                            phone: student.phone || '+880 1700-000000',
                            alertType: 'ATTENDANCE_WARNING',
                            preformattedMessage: `URGENT ATTENDANCE ALERT: Dear Guardian, student ${student.name} (${student.rollOrEmpId}) has an attendance rate of ${attendancePercent}% (below 80% limit). Late turnstile flags today: ${lateCount}. Please contact the Academic Office.`
                          });
                        }}
                        className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Guardian SMS</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Fee Due Analysis */}
      {activeAiTab === 'fees' && (
        <div className="mt-5 space-y-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/30">
              <div className="text-xs text-indigo-300 font-medium">Total Outstanding Balance</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">৳{totalOutstandingBDT.toLocaleString()} BDT</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/30">
              <div className="text-xs text-indigo-300 font-medium">Accounts Overdue</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{feeDuesList.filter(f => f.isOverdue).length} Students</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/30">
              <div className="text-xs text-indigo-300 font-medium">Recommended Action</div>
              <div className="text-xs font-bold text-sky-300 mt-1">Issue Fee Clearance Notice</div>
            </div>
          </div>

          <div className="space-y-3">
            {feeDuesList.map(({ feeRecord, member, totalDue, isOverdue }) => (
              <div key={feeRecord.studentId} className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{feeRecord.studentName}</span>
                    <span className="font-mono text-xs text-sky-300">({feeRecord.studentId})</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isOverdue ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {isOverdue ? 'OVERDUE' : 'PARTIAL DUE'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center space-x-4">
                    <span>Due Date: {feeRecord.dueDate}</span>
                    <span>•</span>
                    <span>Invoice: <strong className="font-mono text-slate-300">{feeRecord.invoiceNo}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Outstanding</div>
                    <div className="text-base font-bold font-mono text-rose-400">৳{totalDue.toLocaleString()} BDT</div>
                  </div>

                  {onSendGuardianAlert && (
                    <button
                      onClick={() => {
                        setSmsModal({
                          isOpen: true,
                          studentId: feeRecord.studentId,
                          studentName: feeRecord.studentName,
                          phone: member?.phone || '+880 1711-223344',
                          alertType: 'FEE_REMINDER',
                          preformattedMessage: `ACADEMIC FEE NOTICE: Dear Guardian, student ${feeRecord.studentName} (${feeRecord.studentId}) has an outstanding balance of ৳${totalDue.toLocaleString()} BDT under invoice #${feeRecord.invoiceNo}. Payment due date: ${feeRecord.dueDate}. Please clear dues via Guardian Portal.`
                        });
                      }}
                      className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Remind Parent</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Notice Drafter AI */}
      {activeAiTab === 'notice_drafter' && (
        <div className="mt-5 space-y-4 relative z-10">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>AI Notice Parameter Configurator</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Notice Topic / Subject</label>
                <input
                  type="text"
                  value={noticeTopic}
                  onChange={e => setNoticeTopic(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Category</label>
                <select
                  value={noticeCategory}
                  onChange={e => setNoticeCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                >
                  <option value="Lab Safety">Lab Safety</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Academic & Exams">Academic & Exams</option>
                  <option value="Fees & Dues">Fees & Dues</option>
                  <option value="Events & Workshops">Events & Workshops</option>
                  <option value="Hostel & Mess">Hostel & Mess</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Audience</label>
                <select
                  value={noticeRole}
                  onChange={e => setNoticeRole(e.target.value as any)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                >
                  <option value="All">All Campus Members</option>
                  <option value="Students">Students Only</option>
                  <option value="Faculty">Faculty & Lab Technicians</option>
                  <option value="Guardians">Guardians & Parents</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateNoticeDraft}
              disabled={isGeneratingNotice}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>{isGeneratingNotice ? 'Synthesizing Official Notice...' : 'Generate AI Notice Draft'}</span>
            </button>
          </div>

          {draftedNoticeText && (
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-indigo-300 font-mono">Generated Draft Preview</span>
                <button
                  onClick={() => navigator.clipboard.writeText(draftedNoticeText)}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>
              </div>

              <textarea
                value={draftedNoticeText}
                onChange={e => setDraftedNoticeText(e.target.value)}
                rows={7}
                className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs font-mono text-slate-200 leading-relaxed focus:ring-1 focus:ring-indigo-500"
              />

              {publishSuccessMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{publishSuccessMsg}</span>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handlePublishDraftedNotice}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Directly to Digital Notice Board</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: Freeform AI Textile Chat Assistant */}
      {activeAiTab === 'chat' && (
        <div className="mt-5 space-y-3 relative z-10">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xl p-3 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="font-bold text-[10px] opacity-75 mb-1 flex justify-between">
                    <span>{msg.sender === 'user' ? 'You (Master Admin)' : 'RTI AI'}</span>
                    <span>{msg.time}</span>
                  </div>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex space-x-2">
            <input
              type="text"
              placeholder="Ask AI about attendance, dye formulas, yarn count, or fees..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="flex-1 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SUCCESS TOAST NOTIFICATION */}
      {smsToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{smsToast}</span>
        </div>
      )}

      {/* GUARDIAN SMS PREVIEW MODAL */}
      {smsModal?.isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">
                  {smsModal.alertType === 'ATTENDANCE_WARNING' ? 'Send Guardian Attendance SMS' : 'Send Guardian Fee Reminder'}
                </h3>
              </div>
              <button 
                onClick={() => setSmsModal(null)} 
                className="text-slate-400 hover:text-white font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Student / Ward:</div>
                <div className="font-bold text-indigo-300">{smsModal.studentName} ({smsModal.studentId})</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">Guardian Phone Number:</div>
                <div className="font-mono text-emerald-400 font-bold">{smsModal.phone}</div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Pre-formatted SMS Message Preview</label>
                <textarea
                  rows={4}
                  value={smsModal.preformattedMessage}
                  onChange={e => setSmsModal({ ...smsModal, preformattedMessage: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="bg-indigo-950/50 p-2.5 rounded-xl border border-indigo-500/30 text-[10px] text-indigo-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>SMS will be routed through RTI Campus Telecom Gateway & logged into Guardian Portal.</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSmsModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSendGuardianAlert) {
                    onSendGuardianAlert(smsModal.studentId, smsModal.alertType, smsModal.preformattedMessage);
                  }
                  const messageTypeTitle = smsModal.alertType === 'ATTENDANCE_WARNING' ? 'Attendance SMS' : 'Fee Reminder SMS';
                  setSmsToast(`Success! ${messageTypeTitle} dispatched to ${smsModal.phone} for ${smsModal.studentName}`);
                  setSmsModal(null);
                  setTimeout(() => setSmsToast(null), 4000);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send SMS Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
