import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Plus, 
  Search, 
  Download, 
  Printer, 
  AlertTriangle, 
  Sparkles, 
  Tag, 
  Clock, 
  Building2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Bookmark,
  Share2,
  X,
  ShieldCheck
} from 'lucide-react';
import { NoticeRecord, AcademicEvent } from '../types';

interface NoticeAndEventsBoardProps {
  notices: NoticeRecord[];
  events: AcademicEvent[];
  isMasterAdmin: boolean;
  activeRole?: string;
  onAddNotice: (notice: NoticeRecord) => void;
  onAddEvent: (event: AcademicEvent) => void;
  onOpenAiDrafter?: () => void;
}

export const NoticeAndEventsBoard: React.FC<NoticeAndEventsBoardProps> = ({
  notices,
  events,
  isMasterAdmin,
  activeRole = 'Super Admin',
  onAddNotice,
  onAddEvent,
  onOpenAiDrafter
}) => {
  const [activeBoardTab, setActiveBoardTab] = useState<'notices' | 'calendar'>('notices');
  const [noticeCategoryFilter, setNoticeCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoticeForPdf, setSelectedNoticeForPdf] = useState<NoticeRecord | null>(null);
  const [showCreateNoticeModal, setShowCreateNoticeModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  // New Notice Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<NoticeRecord['category']>('Academic & Exams');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState<NoticeRecord['priority']>('Normal');
  const [newNoticeAuthor, setNewNoticeAuthor] = useState('');
  const [newNoticeDept, setNewNoticeDept] = useState('General / Campus-wide');

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<AcademicEvent['eventType']>('Exam');
  const [newEventDept, setNewEventDept] = useState('General Administration');
  const [newEventDate, setNewEventDate] = useState('2026-08-25');
  const [newEventLocation, setNewEventLocation] = useState('Main Auditorium');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Filtered notices
  const filteredNotices = notices.filter(n => {
    const matchesCategory = noticeCategoryFilter === 'All' || n.category === noticeCategoryFilter;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.refNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
      return;
    }
    const notice: NoticeRecord = {
      id: `not-${Date.now()}`,
      title: newNoticeTitle.trim(),
      category: newNoticeCategory,
      author: newNoticeAuthor.trim() || (isMasterAdmin ? 'Office of Director General' : 'Institute Campus Member'),
      department: newNoticeDept.trim() || 'General / Campus-wide',
      date: new Date().toISOString().split('T')[0],
      content: newNoticeContent.trim(),
      priority: newNoticePriority,
      isPublished: true,
      refNo: `RTI/NOTICE/2026/${Math.floor(100 + Math.random() * 900)}`
    };
    onAddNotice(notice);
    setShowCreateNoticeModal(false);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeAuthor('');
    setNewNoticeDept('General / Campus-wide');
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const evt: AcademicEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      eventType: newEventType,
      department: newEventDept,
      startDate: newEventDate,
      location: newEventLocation,
      description: newEventDesc,
      colorHex: newEventType === 'Exam' ? '#DC2626' : newEventType === 'Lab Audit' ? '#9333EA' : '#0284C7'
    };
    onAddEvent(evt);
    setShowCreateEventModal(false);
    setNewEventTitle('');
    setNewEventDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 rounded-2xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Institute Communication Center
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white font-mono">
                Digital Notice Board & Academic Calendar
              </h2>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl">
            Official announcements, exam schedules, lab safety warnings, and academic event calendar with printable PDF letterhead export.
          </p>
        </div>

        {isMasterAdmin && (
          <div className="flex items-center space-x-3">
            {onOpenAiDrafter && (
              <button
                onClick={onOpenAiDrafter}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Draft Notice with AI</span>
              </button>
            )}

            <button
              id="public-create-notice-btn"
              onClick={() => setShowCreateNoticeModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              title="Create and publish a new campus notice publicly"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Create / Add Notice</span>
            </button>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveBoardTab('notices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeBoardTab === 'notices'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            📋 Official Notice Board ({notices.length})
          </button>

          <button
            onClick={() => setActiveBoardTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeBoardTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            📅 Academic Events Calendar ({events.length})
          </button>
        </div>

        {activeBoardTab === 'notices' && (
          <div className="flex items-center space-x-3">
            <select
              value={noticeCategoryFilter}
              onChange={e => setNoticeCategoryFilter(e.target.value)}
              className="p-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
            >
              <option value="All">All Categories</option>
              <option value="Urgent">🚨 Urgent</option>
              <option value="Academic & Exams">Academic & Exams</option>
              <option value="Fees & Dues">Fees & Dues</option>
              <option value="Lab Safety">Lab Safety</option>
              <option value="Events & Workshops">Events & Workshops</option>
              <option value="Hostel & Mess">Hostel & Mess</option>
              <option value="Blood Donation & Health">Blood Donation & Health</option>
              <option value="General Notice">General Campus Notice</option>
            </select>

            <div className="relative w-48">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              <input
                type="text"
                placeholder="Search notice..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: Digital Notice Board */}
      {activeBoardTab === 'notices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map(notice => (
            <div
              key={notice.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    notice.category === 'Lab Safety' ? 'bg-amber-100 text-amber-800' :
                    notice.category === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                    notice.category === 'Fees & Dues' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {notice.category}
                  </span>

                  <span className="font-mono text-[10px] text-slate-400 font-bold">
                    {notice.refNo}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {notice.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                  {notice.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[10px] text-slate-400">
                  <div>{notice.author}</div>
                  <div>{notice.date}</div>
                </div>

                <button
                  onClick={() => setSelectedNoticeForPdf(notice)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition-all flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Academic Events Calendar */}
      {activeBoardTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="font-bold text-sm text-slate-900">
              August 2026 Academic Event Schedule
            </div>
            {isMasterAdmin && (
              <button
                onClick={() => setShowCreateEventModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Academic Event</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map(evt => (
              <div key={evt.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] uppercase font-bold text-indigo-600">AUG</span>
                  <span className="text-xl font-black font-mono text-indigo-900">{evt.startDate.split('-')[2]}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800" style={{ borderLeft: `3px solid ${evt.colorHex}` }}>
                    {evt.eventType}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{evt.title}</h4>
                  <p className="text-slate-600">{evt.description}</p>
                  <div className="text-[10px] text-slate-400 font-semibold pt-1">
                    📍 {evt.location} • {evt.department}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OFFICIAL PDF NOTICE PREVIEW MODAL */}
      {selectedNoticeForPdf && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-300 max-w-2xl w-full p-4 sm:p-8 shadow-2xl space-y-4 sm:space-y-6 text-slate-900 font-sans relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedNoticeForPdf(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>

            {/* Official Letterhead Header */}
            <div className="border-b-2 border-indigo-900 pb-4 text-center relative">
              <div className="font-mono text-xl font-black tracking-widest text-indigo-950">
                RANGPUR TEXTILE INSTITUTE
              </div>
              <div className="text-xs uppercase font-bold text-indigo-700 tracking-wider">
                Office of the Principal & Academic Registrar
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                RTI Campus, Rangpur, Bangladesh • Tel: +880 521 62345 • www.rangpurtextile.edu.bd
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-600">
              <span>REF NO: {selectedNoticeForPdf.refNo}</span>
              <span>DATE: {selectedNoticeForPdf.date}</span>
            </div>

            <div className="text-center py-2">
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 underline underline-offset-4 decoration-indigo-600">
                {selectedNoticeForPdf.title}
              </h2>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-xs leading-relaxed space-y-3 font-serif">
              <p className="whitespace-pre-wrap">{selectedNoticeForPdf.content}</p>
            </div>

            <div className="pt-6 flex justify-between items-end text-xs border-t border-slate-200">
              <div className="text-[10px] text-slate-500">
                <div>Document Status: <strong className="text-emerald-700">VERIFIED OFFICIAL</strong></div>
                <div>Target Audience: {selectedNoticeForPdf.targetRole || 'All Campus'}</div>
              </div>

              <div className="text-center font-mono">
                <div className="w-28 border-b border-slate-800 mx-auto mb-1"></div>
                <div className="font-bold text-xs">{selectedNoticeForPdf.author}</div>
                <div className="text-[10px] text-slate-500">RTI Official Seal & Signature</div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center space-x-1"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NOTICE MODAL */}
      {showCreateNoticeModal && (
        <div 
          className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setShowCreateNoticeModal(false)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Create & Publish Notice</h3>
                  <p className="text-[11px] text-slate-500">Post announcements and updates publicly to the campus board</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateNoticeModal(false)} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 font-bold transition-all"
                title="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNoticeSubmit} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Notice Title / Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newNoticeTitle}
                  onChange={e => setNewNoticeTitle(e.target.value)}
                  required
                  placeholder="e.g., Dyeing Lab Schedule / Semester Final Notice"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newNoticeCategory}
                    onChange={e => setNewNoticeCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Academic & Exams">Academic & Exams</option>
                    <option value="Urgent">🚨 Urgent Announcement</option>
                    <option value="Fees & Dues">Fees & Dues</option>
                    <option value="Lab Safety">Lab Safety</option>
                    <option value="Events & Workshops">Events & Workshops</option>
                    <option value="Hostel & Mess">Hostel & Mess</option>
                    <option value="Blood Donation & Health">Blood Donation & Health</option>
                    <option value="General Notice">General Campus Notice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority Level</label>
                  <select
                    value={newNoticePriority}
                    onChange={e => setNewNoticePriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Normal">Normal Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">⚡ High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Description / Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={newNoticeContent}
                  onChange={e => setNewNoticeContent(e.target.value)}
                  required
                  rows={4}
                  placeholder="Provide the complete notice message, instructions, timings, or directives here..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Author / Posted By (Optional)</label>
                  <input
                    type="text"
                    value={newNoticeAuthor}
                    onChange={e => setNewNoticeAuthor(e.target.value)}
                    placeholder="e.g. Student Council / Dept Office"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Department (Optional)</label>
                  <input
                    type="text"
                    value={newNoticeDept}
                    onChange={e => setNewNoticeDept(e.target.value)}
                    placeholder="e.g. All Departments / Yarn Mfg"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowCreateNoticeModal(false)} 
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showCreateEventModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Schedule Academic Event</h3>
              <button onClick={() => setShowCreateEventModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  required
                  placeholder="e.g. Mid-Term Written Examination"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Event Type</label>
                  <select
                    value={newEventType}
                    onChange={e => setNewEventType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Exam">Exam</option>
                    <option value="Lab Audit">Lab Audit</option>
                    <option value="Industrial Visit">Industrial Visit</option>
                    <option value="Workshop / Conference">Workshop / Conference</option>
                    <option value="Fee Deadline">Fee Deadline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={e => setNewEventDate(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Location Venue</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={e => setNewEventLocation(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  value={newEventDesc}
                  onChange={e => setNewEventDesc(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowCreateEventModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-md">Add to Calendar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
