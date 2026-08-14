import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  CreditCard, 
  GraduationCap, 
  Award, 
  Calendar, 
  Clock, 
  Building2, 
  Bell, 
  Printer, 
  Send,
  ChevronRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { 
  RegisteredMember, 
  GateAccessLog, 
  StudentFeeStatus, 
  StudentGradeRecord, 
  GuardianAlert 
} from '../types';

interface GuardianPortalProps {
  members: RegisteredMember[];
  gateLogs: GateAccessLog[];
  studentFees: StudentFeeStatus[];
  studentGrades: StudentGradeRecord[];
  guardianAlerts: GuardianAlert[];
  onPayFeeDues: (studentId: string, amount: number) => void;
}

export const GuardianPortal: React.FC<GuardianPortalProps> = ({
  members,
  gateLogs,
  studentFees,
  studentGrades,
  guardianAlerts,
  onPayFeeDues
}) => {
  const students = members.filter(m => m.role === 'Student');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.rollOrEmpId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Credit Card' | 'Bank Transfer'>('bKash');
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<any | null>(null);

  // Selected student resolution
  const selectedMember = members.find(m => m.rollOrEmpId === selectedStudentId) || students[0];
  const feeStatus = studentFees.find(f => f.studentId === selectedStudentId) || {
    studentId: selectedStudentId,
    studentName: selectedMember?.name || 'Student',
    tuitionFeeUSD: 1200,
    labFeeUSD: 350,
    libraryFeeUSD: 100,
    hostelFeeUSD: 0,
    paidAmountUSD: 1650,
    status: 'PAID',
    dueDate: '2026-08-20',
    invoiceNo: 'INV-2026-9000'
  };

  const gradeRecord = studentGrades.find(g => g.studentId === selectedStudentId) || {
    studentId: selectedStudentId,
    semester: 'Current Term',
    cgpa: 3.75,
    attendancePercent: 91.0,
    subjects: [
      { code: 'TEX-301', name: 'Textile Operations & Quality Control', credits: 3, grade: 'A', labPerformanceScore: 92, attendancePercent: 92 }
    ]
  };

  const studentLogs = gateLogs.filter(l => l.personId === selectedStudentId);
  const alertsForStudent = guardianAlerts.filter(a => a.studentId === selectedStudentId);

  const totalFeeUSD = feeStatus.tuitionFeeUSD + feeStatus.labFeeUSD + feeStatus.libraryFeeUSD + feeStatus.hostelFeeUSD;
  const dueAmountUSD = Math.max(0, totalFeeUSD - feeStatus.paidAmountUSD);

  // Filter students dropdown
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollOrEmpId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    onPayFeeDues(selectedStudentId, dueAmountUSD);
    setPaymentSuccessReceipt({
      receiptNo: `RCT-NIO-${Math.floor(100000 + Math.random() * 900000)}`,
      amountPaid: dueAmountUSD,
      studentName: selectedMember.name,
      studentId: selectedMember.rollOrEmpId,
      date: new Date().toLocaleString(),
      paymentMethod
    });
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Guardian Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Parent & Guardian Digital Access
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-mono flex items-center space-x-2">
                  <span>Rangpur Textile Institute Guardian Portal</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl">
              Track your ward's real-time turnstile gate attendance, academic CGPA, textile lab practical scores, and clear tuition dues via secure online payment.
            </p>
          </div>

          {/* Student Selector Dropdown */}
          <div className="w-full sm:w-72 bg-slate-900/90 p-3 rounded-xl border border-indigo-500/40 space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              Select Ward / Student
            </label>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold text-white focus:ring-2 focus:ring-indigo-500"
            >
              {students.map(s => (
                <option key={s.id} value={s.rollOrEmpId}>
                  {s.name} ({s.rollOrEmpId})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Student Profile Summary Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black font-mono text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            {selectedMember.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-900">{selectedMember.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800">
                {selectedMember.rollOrEmpId}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 space-x-3">
              <span>Dept: <strong className="text-slate-800 uppercase">{selectedMember.department.replace('_', ' ')}</strong></span>
              <span>•</span>
              <span>Batch: <strong className="text-slate-800">{selectedMember.batchOrDesignation}</strong></span>
              <span>•</span>
              <span>Status: <strong className="text-emerald-600">{selectedMember.accessStatus}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right border-r border-slate-200 pr-4">
            <div className="text-xs text-slate-500">Overall Attendance</div>
            <div className={`text-xl font-black font-mono ${
              gradeRecord.attendancePercent >= 80 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {gradeRecord.attendancePercent}%
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">Current CGPA</div>
            <div className="text-xl font-black font-mono text-indigo-600">
              {gradeRecord.cgpa.toFixed(2)} / 4.00
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Columns: Attendance, Grades, and Fees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: Live Gate Attendance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Turnstile Gate Attendance Stream</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">LIVE</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
            <div>
              <span className="text-slate-500">Last Scanned Gate:</span>
              <div className="font-bold text-slate-800">{selectedMember.lastSeen || 'Main Gate Turnstile 1'}</div>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Gate Pass:</span>
              <div className="font-bold text-emerald-600">VALID QR</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Today & Recent Gate Scans</label>
            {studentLogs.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs text-center">
                No turnstile scans recorded for this student today.
              </div>
            ) : (
              studentLogs.map(log => (
                <div key={log.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${log.direction === 'IN' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      <span>{log.gateLocation} ({log.direction})</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      log.status === 'GRANTED' ? 'bg-emerald-100 text-emerald-800' :
                      log.status === 'FLAGGED_LATE' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {log.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>{log.timestamp}</span>
                    <span>Temp: {log.temperatureC}°C</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: Academic Progress & Textile Lab Grades */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Academic Grades & Lab Scores</span>
            </h4>
            <span className="text-xs font-bold text-indigo-600 font-mono">{gradeRecord.semester}</span>
          </div>

          <div className="space-y-3">
            {gradeRecord.subjects.map((sub, i) => (
              <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold font-mono text-indigo-600 text-[10px]">{sub.code}</span>
                    <h5 className="font-bold text-slate-900">{sub.name}</h5>
                  </div>
                  <span className="px-2 py-1 rounded bg-indigo-600 text-white font-mono font-bold text-xs">
                    {sub.grade}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-500">Lab Score:</span>
                    <span className="font-bold text-emerald-600 ml-1">{sub.labPerformanceScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Class Att:</span>
                    <span className="font-bold text-indigo-600 ml-1">{sub.attendancePercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: Fee Status & Online Payment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Tuition & Lab Fee Clearance</span>
            </h4>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              feeStatus.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
              feeStatus.status === 'PARTIAL' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {feeStatus.status}
            </span>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Outstanding Dues</div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              ৳{dueAmountUSD.toLocaleString()} BDT
            </div>
            <div className="text-[10px] text-slate-300">
              Invoice #{feeStatus.invoiceNo} • Due Date: {feeStatus.dueDate}
            </div>
          </div>

          {/* Itemized Dues */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Tuition Fee</span>
              <span className="font-mono font-bold">৳{feeStatus.tuitionFeeUSD.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Lab & Machinery Usage</span>
              <span className="font-mono font-bold">৳{feeStatus.labFeeUSD.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Library & e-Resources</span>
              <span className="font-mono font-bold">৳{feeStatus.libraryFeeUSD.toLocaleString()}</span>
            </div>
            {feeStatus.hostelFeeUSD > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Hostel Accommodation</span>
                <span className="font-mono font-bold">৳{feeStatus.hostelFeeUSD.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between py-1 font-bold text-slate-900">
              <span>Already Paid</span>
              <span className="font-mono text-emerald-600">-৳{feeStatus.paidAmountUSD.toLocaleString()}</span>
            </div>
          </div>

          {dueAmountUSD > 0 ? (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Dues Online (৳{dueAmountUSD.toLocaleString()} BDT)</span>
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-bold flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All tuition and laboratory fees fully cleared!</span>
            </div>
          )}
        </div>
      </div>

      {/* Guardian Alert Log Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <span>Guardian SMS & Notification Feed ({alertsForStudent.length})</span>
        </h4>

        {alertsForStudent.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No warnings or SMS alerts dispatched to parent phone number.</p>
        ) : (
          <div className="space-y-2">
            {alertsForStudent.map(alt => (
              <div key={alt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">{alt.message}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Sent to {alt.guardianPhone} • {alt.timestamp}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {alt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ONLINE FEE PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>RTI Online Fee Payment Gateway</span>
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-center space-y-1">
              <div className="text-[10px] text-slate-400">Total Payable Dues</div>
              <div className="text-2xl font-bold text-emerald-400">৳{dueAmountUSD.toLocaleString()} BDT</div>
              <div className="text-[10px] text-slate-300">{selectedMember.name} ({selectedMember.rollOrEmpId})</div>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Credit Card', 'Bank Transfer'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`p-2 rounded-xl font-bold border transition-all ${
                        paymentMethod === m ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Card / Mobile Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. +880 1711-XXXXXX or Card Number"
                  defaultValue="+880 1711-889900"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-[10px] text-amber-800 border border-amber-200">
                ⚡ Instant clearance: Upon payment confirmation, the student turnstile restriction flag is immediately removed.
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-md">Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS RECEIPT MODAL */}
      {paymentSuccessReceipt && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4 text-center max-h-[90vh] overflow-y-auto">
            <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 font-mono">PAYMENT SUCCESSFUL</h3>
              <p className="text-xs text-slate-500 mt-1">Receipt #{paymentSuccessReceipt.receiptNo}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-2 font-mono">
              <div className="flex justify-between">
                <span>Student:</span>
                <span className="font-bold">{paymentSuccessReceipt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-bold text-emerald-600">৳{paymentSuccessReceipt.amountPaid.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold">{paymentSuccessReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{paymentSuccessReceipt.date}</span>
              </div>
            </div>

            <button
              onClick={() => setPaymentSuccessReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
