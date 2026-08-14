import React, { useState } from 'react';
import { 
  Heart, 
  BookOpen, 
  Calendar, 
  Droplet, 
  Plus, 
  Search, 
  Award, 
  FileText, 
  Download, 
  Eye, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Building,
  Sparkles,
  Printer
} from 'lucide-react';
import { RedCrescentMember, InstituteMagazine, AcademicEvent } from '../types';
import { RedCrescentUnitSection } from './RedCrescentUnitSection';

interface InstituteHubProps {
  redCrescentMembers: RedCrescentMember[];
  magazines: InstituteMagazine[];
  events: AcademicEvent[];
  isMasterAdmin: boolean;
  onAddRedCrescentMember: (member: RedCrescentMember) => void;
  onUpdateRedCrescentMember?: (member: RedCrescentMember) => void;
  onDeleteRedCrescentMember?: (id: string) => void;
  onAddMagazine: (magazine: InstituteMagazine) => void;
  onAddEvent: (event: AcademicEvent) => void;
}

export const InstituteHub: React.FC<InstituteHubProps> = ({
  redCrescentMembers,
  magazines,
  events,
  isMasterAdmin,
  onAddRedCrescentMember,
  onUpdateRedCrescentMember,
  onDeleteRedCrescentMember,
  onAddMagazine,
  onAddEvent
}) => {
  const [activeTab, setActiveTab] = useState<'red_crescent' | 'magazine' | 'events'>('red_crescent');

  // Red Crescent Search & Filters
  const [rcSearch, setRcSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [showRcModal, setShowRcModal] = useState(false);

  // Magazine Preview State
  const [selectedMagazine, setSelectedMagazine] = useState<InstituteMagazine | null>(null);
  const [showMagModal, setShowMagModal] = useState(false);

  // Event Modal State
  const [showEvtModal, setShowEvtModal] = useState(false);

  // Red Crescent Form
  const [rcFormData, setRcFormData] = useState({
    studentId: '',
    name: '',
    bloodGroup: 'O+' as RedCrescentMember['bloodGroup'],
    department: 'Wet Processing',
    phone: '',
    roleInUnit: 'Volunteer' as RedCrescentMember['roleInUnit']
  });

  // Magazine Form
  const [magFormData, setMagFormData] = useState({
    title: 'Rangpur Textile Canvas 2027',
    issueNo: 'Issue #15 (2027 Special)',
    year: 2027,
    editorInChief: 'Dr. Sharmin Akter',
    theme: 'AI-Driven Smart Textiles & Zero-Waste Dyeing',
    summary: 'Focus on automated loom fault detection, bio-based pigment extraction, and industrial IoT in Bangladesh.',
    totalPages: 92,
    featuredArticle: 'Deep Neural Networks for Online Defect Classification in High-Speed Air-Jet Looms'
  });

  // Event Form
  const [evtFormData, setEvtFormData] = useState({
    title: '',
    eventType: 'Industrial Visit' as AcademicEvent['eventType'],
    department: 'General Studies',
    startDate: new Date().toISOString().split('T')[0],
    location: '',
    description: ''
  });

  // Filter Red Crescent
  const filteredRcMembers = redCrescentMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(rcSearch.toLowerCase()) || m.studentId.toLowerCase().includes(rcSearch.toLowerCase());
    const matchesBlood = bloodGroupFilter === 'All' || m.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesBlood;
  });

  const handleRcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rcFormData.name || !rcFormData.phone) {
      alert('Please fill in name and contact phone.');
      return;
    }
    const newMember: RedCrescentMember = {
      id: `rc-${Date.now()}`,
      studentId: rcFormData.studentId || `RTI-RC-${Math.floor(100 + Math.random() * 900)}`,
      name: rcFormData.name,
      bloodGroup: rcFormData.bloodGroup,
      department: rcFormData.department,
      phone: rcFormData.phone,
      roleInUnit: rcFormData.roleInUnit,
      lastDonationDate: new Date().toISOString().split('T')[0],
      totalDonations: 1,
      status: 'Active Volunteer'
    };
    onAddRedCrescentMember(newMember);
    setShowRcModal(false);
  };

  const handleMagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMag: InstituteMagazine = {
      id: `mag-${Date.now()}`,
      title: magFormData.title,
      issueNo: magFormData.issueNo,
      year: Number(magFormData.year),
      editorInChief: magFormData.editorInChief,
      theme: magFormData.theme,
      summary: magFormData.summary,
      totalPages: Number(magFormData.totalPages),
      featuredArticle: magFormData.featuredArticle,
      coverBadgeColor: 'bg-purple-600'
    };
    onAddMagazine(newMag);
    setShowMagModal(false);
  };

  const handleEvtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtFormData.title || !evtFormData.location) {
      alert('Please fill in title and location.');
      return;
    }
    const newEvt: AcademicEvent = {
      id: `evt-${Date.now()}`,
      title: evtFormData.title,
      eventType: evtFormData.eventType,
      department: evtFormData.department,
      startDate: evtFormData.startDate,
      location: evtFormData.location,
      description: evtFormData.description || 'Institute official scheduled event.',
      colorHex: '#8B5CF6'
    };
    onAddEvent(newEvt);
    setShowEvtModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200 mb-3">
              <Building className="w-3.5 h-3.5 text-blue-300" />
              <span>Rangpur Textile Institute Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Community Services, Magazine & Events Hub
            </h1>
            <p className="text-blue-200 text-sm mt-1 max-w-2xl">
              Centralized platform for Red Crescent Youth Unit volunteers, emergency blood bank dispatch, digital magazine publications ("Rangpur Textile Canvas"), and campus event schedules.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('red_crescent')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'red_crescent'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Red Crescent Unit</span>
            </button>

            <button
              onClick={() => setActiveTab('magazine')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'magazine'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Magazine Archive</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'events'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Event Scheduler</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: RED CRESCENT UNIT & BLOOD DONORS */}
      {activeTab === 'red_crescent' && (
        <RedCrescentUnitSection
          redCrescentMembers={redCrescentMembers}
          isMasterAdmin={isMasterAdmin}
          onAddRedCrescentMember={onAddRedCrescentMember}
          onUpdateRedCrescentMember={onUpdateRedCrescentMember}
          onDeleteRedCrescentMember={onDeleteRedCrescentMember}
        />
      )}

      {/* TAB 2: MAGAZINE ARCHIVE */}
      {activeTab === 'magazine' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">Digital Magazine Archive & Research Journal</h2>
              <p className="text-slate-500 text-xs">Official publication: "Rangpur Textile Canvas" featuring student innovations & technical papers.</p>
            </div>

            <button
              onClick={() => setShowMagModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Edition</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {magazines.map((mag) => (
              <div
                key={mag.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                        {mag.issueNo}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-lg mt-2">{mag.title}</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                      Year {mag.year}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{mag.summary}</p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <span className="font-bold text-purple-900 block">Featured Research Paper:</span>
                    <span className="text-slate-700 italic">"{mag.featuredArticle}"</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Editor: {mag.editorInChief}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedMagazine(mag)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-purple-50 text-purple-700 rounded-lg font-bold flex items-center space-x-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Preview</span>
                    </button>
                    <button
                      onClick={() => alert(`Downloading official PDF copy of "${mag.title}" (84 Pages)...`)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex items-center space-x-1 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS SCHEDULER */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">Academic & Industrial Events Calendar</h2>
              <p className="text-slate-500 text-xs">Scheduled workshops, industrial field visits, spinning audits, and semester mid-term exams.</p>
            </div>

            <button
              onClick={() => setShowEvtModal(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((evt) => (
              <div key={evt.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200">
                    {evt.eventType}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{evt.startDate}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{evt.title}</h3>
                <p className="text-xs text-slate-600">{evt.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>📍 {evt.location}</span>
                  <span className="font-semibold text-purple-700">{evt.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Crescent Modal */}
      {showRcModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-slate-900 text-base">Register Red Crescent Volunteer</h3>
            <form onSubmit={handleRcSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={rcFormData.name}
                  onChange={e => setRcFormData({ ...rcFormData, name: e.target.value })}
                  placeholder="Student Volunteer Name"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Blood Group *</label>
                <select
                  value={rcFormData.bloodGroup}
                  onChange={e => setRcFormData({ ...rcFormData, bloodGroup: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-red-600"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department</label>
                <select
                  value={rcFormData.department}
                  onChange={e => setRcFormData({ ...rcFormData, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Wet Processing">Wet Processing</option>
                  <option value="Yarn Manufacturing">Yarn Manufacturing</option>
                  <option value="Fabric Manufacturing">Fabric Manufacturing</option>
                  <option value="Apparel Manufacturing">Apparel Manufacturing</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={rcFormData.phone}
                  onChange={e => setRcFormData({ ...rcFormData, phone: e.target.value })}
                  placeholder="+880 1700-000000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRcModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold"
                >
                  Save Donor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Magazine Modal */}
      {showMagModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-slate-900 text-base">Publish Magazine Edition</h3>
            <form onSubmit={handleMagSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Magazine Title *</label>
                <input
                  type="text"
                  required
                  value={magFormData.title}
                  onChange={e => setMagFormData({ ...magFormData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Theme / Focus Area</label>
                <input
                  type="text"
                  value={magFormData.theme}
                  onChange={e => setMagFormData({ ...magFormData, theme: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Editor In Chief</label>
                <input
                  type="text"
                  value={magFormData.editorInChief}
                  onChange={e => setMagFormData({ ...magFormData, editorInChief: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Summary Overview</label>
                <textarea
                  rows={2}
                  value={magFormData.summary}
                  onChange={e => setMagFormData({ ...magFormData, summary: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMagModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold"
                >
                  Publish Edition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEvtModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-slate-900 text-base">Schedule New Academic / Industrial Event</h3>
            <form onSubmit={handleEvtSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={evtFormData.title}
                  onChange={e => setEvtFormData({ ...evtFormData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Location / Venue *</label>
                <input
                  type="text"
                  required
                  value={evtFormData.location}
                  onChange={e => setEvtFormData({ ...evtFormData, location: e.target.value })}
                  placeholder="e.g. Spinning Pilot Mill 1"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEvtModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Magazine Preview Modal */}
      {selectedMagazine && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-slate-900 text-base">{selectedMagazine.title}</h3>
              </div>
              <button
                onClick={() => setSelectedMagazine(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="bg-purple-900 text-white rounded-xl p-6 space-y-3">
              <span className="text-xs uppercase tracking-wider font-extrabold text-purple-300 bg-purple-800/80 px-2.5 py-1 rounded">
                {selectedMagazine.issueNo}
              </span>
              <h2 className="text-xl font-bold">{selectedMagazine.theme}</h2>
              <p className="text-xs text-purple-200">Editor in Chief: {selectedMagazine.editorInChief}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Featured Technical Research Paper:</h4>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium italic">
                "{selectedMagazine.featuredArticle}"
              </p>
              <p className="text-slate-600 leading-relaxed mt-2">{selectedMagazine.summary}</p>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedMagazine(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
              >
                Close Reader
              </button>
              <button
                onClick={() => alert('Printing magazine summary...')}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-xs flex items-center space-x-1"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
