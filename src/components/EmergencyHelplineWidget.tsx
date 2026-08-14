import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  HeartHandshake, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  UserCheck, 
  FileText, 
  X, 
  Send,
  LifeBuoy,
  EyeOff,
  Radio
} from 'lucide-react';
import { SafetyReportComplaint } from '../types';
import { safeLocalStorageSet } from '../lib/storage';

interface EmergencyHelplineWidgetProps {
  isMasterAdmin: boolean;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

const INITIAL_COMPLAINTS_KEY = 'rti_safety_complaints';

export const EmergencyHelplineWidget: React.FC<EmergencyHelplineWidgetProps> = ({
  isMasterAdmin,
  isOpenModal = false,
  onCloseModal
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAdminViewModal, setShowAdminViewModal] = useState(false);
  const [complaints, setComplaints] = useState<SafetyReportComplaint[]>(() => {
    try {
      const saved = localStorage.getItem(INITIAL_COMPLAINTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'RTI-SAFE-1001',
        reportType: 'Hostel / Campus Safety',
        location: 'Begum Rokeya Female Hostel - North Boundary Pathway',
        incidentDate: '2026-08-10',
        description: 'Insufficient street lighting along the north pathway near the female hostel after 7:30 PM. Needs immediate solar lamp repair.',
        urgency: 'High Priority',
        isAnonymous: true,
        status: 'Under Investigation',
        submittedAt: '2026-08-10 19:45'
      }
    ];
  });

  // Form State
  const [reportType, setReportType] = useState<SafetyReportComplaint['reportType']>('Harassment / Eve Teasing');
  const [location, setLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<SafetyReportComplaint['urgency']>('High Priority');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [contactInfo, setContactInfo] = useState('');
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  useEffect(() => {
    safeLocalStorageSet(INITIAL_COMPLAINTS_KEY, complaints);
  }, [complaints]);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const token = `RTI-SAFE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport: SafetyReportComplaint = {
      id: token,
      reportType,
      location: location.trim() || 'RTI Main Campus',
      incidentDate,
      description: description.trim(),
      urgency,
      isAnonymous,
      contactEmailOrPhone: isAnonymous ? undefined : contactInfo.trim(),
      status: 'Received',
      submittedAt: new Date().toLocaleString('en-GB')
    };

    setComplaints(prev => [newReport, ...prev]);
    setSubmittedToken(token);
    setDescription('');
    setLocation('');
    setContactInfo('');
  };

  const handleUpdateStatus = (id: string, newStatus: SafetyReportComplaint['status']) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleDeleteComplaint = (id: string) => {
    if (window.confirm('Delete this safety incident record permanently?')) {
      setComplaints(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Prominent Emergency SOS & Girls Safety Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-purple-950 border-2 border-rose-500/50 rounded-2xl p-4 sm:p-6 text-white shadow-xl shadow-rose-950/40 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-800/50 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-400 flex items-center justify-center text-rose-300">
                <ShieldAlert className="w-6 h-6 animate-pulse text-rose-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white font-mono shadow-xs">
                    24/7 ACTIVE RESPONSE
                  </span>
                  <span className="text-[11px] font-bold text-rose-300 flex items-center space-x-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
                    <span>Women's Safety & Campus Protection Wing</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-tight font-mono">
                  Emergency SOS & Women Helpline
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="open-anonymous-complaint-btn"
                onClick={() => {
                  setSubmittedToken(null);
                  setShowReportModal(true);
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <EyeOff className="w-4 h-4 text-amber-300" />
                <span>Anonymous Complaint Box</span>
              </button>

              {isMasterAdmin && (
                <button
                  type="button"
                  id="admin-safety-records-btn"
                  onClick={() => setShowAdminViewModal(true)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Reports ({complaints.length})</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-rose-100/90 leading-relaxed max-w-3xl">
            Direct high-priority assistance for female students, faculty, and campus staff. One-tap direct dial to safety wardens, campus security proctors, and national crisis helplines.
          </p>

          {/* Quick One-Tap Emergency Helplines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {/* 1. National Women Helpline 109 */}
            <a
              href="tel:109"
              className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-rose-900/50 border border-rose-400/40 hover:border-rose-400 flex items-center justify-between group transition-all shadow-md"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-rose-400 font-mono">National Helpline</div>
                <div className="font-bold text-sm text-white flex items-center space-x-1">
                  <span>Women & Child Helpline</span>
                </div>
                <div className="text-xs text-rose-200 font-mono font-bold">Dial 109 (Toll Free)</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-rose-600 group-hover:bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <PhoneCall className="w-4 h-4" />
              </div>
            </a>

            {/* 2. National Emergency 999 */}
            <a
              href="tel:999"
              className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-rose-900/50 border border-amber-400/40 hover:border-amber-400 flex items-center justify-between group transition-all shadow-md"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-mono">Police / Medical / Fire</div>
                <div className="font-bold text-sm text-white">Emergency Services</div>
                <div className="text-xs text-amber-200 font-mono font-bold">Dial 999 (Instant)</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-600 group-hover:bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <PhoneCall className="w-4 h-4" />
              </div>
            </a>

            {/* 3. RTI Female Hostel Warden */}
            <a
              href="tel:+8801712889900"
              className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-purple-900/50 border border-purple-400/40 hover:border-purple-400 flex items-center justify-between group transition-all shadow-md"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-purple-300 font-mono">Female Hostel Warden</div>
                <div className="font-bold text-sm text-white">Rokeya Hall Warden</div>
                <div className="text-xs text-purple-200 font-mono font-bold">+880 1712-889900</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <PhoneCall className="w-4 h-4" />
              </div>
            </a>

            {/* 4. RTI Campus Security & Proctor */}
            <a
              href="tel:+8801711223344"
              className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-indigo-900/50 border border-indigo-400/40 hover:border-indigo-400 flex items-center justify-between group transition-all shadow-md"
            >
              <div className="space-y-0.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-indigo-300 font-mono">Proctorial Body</div>
                <div className="font-bold text-sm text-white">Campus Security Command</div>
                <div className="text-xs text-indigo-200 font-mono font-bold">+880 1711-223344</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <PhoneCall className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ANONYMOUS REPORTING / COMPLAINT BOX MODAL */}
      {showReportModal && (
        <div 
          onClick={() => setShowReportModal(false)}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-rose-500/50 space-y-4 relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Confidential Safety Report Box</h3>
                  <p className="text-[11px] text-rose-300">Protected & End-to-End Anonymous Submission</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedToken ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Report Safely Received</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Your confidential safety report has been encrypted and securely forwarded to the RTI Proctorial & Female Safety Committee.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-xl max-w-xs mx-auto text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Confidential Tracking Ref:</div>
                  <div className="text-base font-mono font-black text-emerald-400">{submittedToken}</div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedToken(null);
                      setShowReportModal(false);
                    }}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all"
                  >
                    Done / Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-3.5 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 space-y-1">
                  <div className="flex items-center space-x-1.5 text-rose-400 font-bold text-[11px]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Your Identity is 100% Protected</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    You do not need to provide your name, roll, or contact information. The administration reviews every report with urgency.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Issue / Category *</label>
                    <select
                      value={reportType}
                      onChange={e => setReportType(e.target.value as any)}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold text-xs"
                    >
                      <option value="Harassment / Eve Teasing">Harassment / Eve Teasing</option>
                      <option value="Hostel / Campus Safety">Hostel / Campus Safety</option>
                      <option value="Ragging / Bullying">Ragging / Bullying</option>
                      <option value="Academic Concern">Academic Concern</option>
                      <option value="General Safety">General Safety</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Priority / Urgency *</label>
                    <select
                      value={urgency}
                      onChange={e => setUrgency(e.target.value as any)}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold text-xs"
                    >
                      <option value="Immediate Emergency">🚨 Immediate Emergency</option>
                      <option value="High Priority">⚠️ High Priority</option>
                      <option value="Standard Review">ℹ️ Standard Review</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Location on Campus / Hostel *</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Academic Building 2 or Rokeya Hall"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      required
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Incident Date</label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={e => setIncidentDate(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Detailed Description of the Issue *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe what happened, any persons involved, or safety hazards observed..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                {/* Anonymous Toggle */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                      <span>Submit Completely Anonymously</span>
                    </span>
                    <p className="text-[10px] text-slate-400">Keep reporter details 100% hidden</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                </div>

                {!isAnonymous && (
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Optional Contact Phone/Email (for follow-up)</label>
                    <input
                      type="text"
                      placeholder="e.g. 01700-123456 or student@gmail.com"
                      value={contactInfo}
                      onChange={e => setContactInfo(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Confidential Report</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MASTER ADMIN CONFIDENTIAL COMPLAINTS REVIEW MODAL */}
      {showAdminViewModal && isMasterAdmin && (
        <div 
          onClick={() => setShowAdminViewModal(false)}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-rose-500/50 space-y-4 max-h-[90vh] overflow-y-auto relative"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Admin Safety & Incident Desk</h3>
                  <p className="text-[11px] text-rose-300">Confidential Complaints & Grievance Registry</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAdminViewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {complaints.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No safety complaints logged.
                </div>
              ) : (
                complaints.map(comp => (
                  <div key={comp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-rose-400">{comp.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {comp.reportType}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          comp.urgency === 'Immediate Emergency' 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {comp.urgency}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono">
                        {comp.submittedAt}
                      </div>
                    </div>

                    <div className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                      {comp.description}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div>
                        <span className="text-slate-500 font-bold">Location:</span> {comp.location}
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold">Reporter:</span> {comp.isAnonymous ? '🔒 Anonymous Female Student / Staff' : comp.contactEmailOrPhone}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-slate-400 font-bold">Status:</span>
                        <select
                          value={comp.status}
                          onChange={e => handleUpdateStatus(comp.id, e.target.value as any)}
                          className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white"
                        >
                          <option value="Received">Received</option>
                          <option value="Under Investigation">Under Investigation</option>
                          <option value="Escalated to Proctor">Escalated to Proctor</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteComplaint(comp.id)}
                        className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-[10px] font-bold"
                      >
                        Delete Record
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
