import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  MapPin, 
  Building2, 
  Briefcase, 
  Mail, 
  Phone, 
  Linkedin, 
  Plus, 
  UserCheck, 
  Award, 
  Filter,
  CheckCircle2,
  Sparkles,
  Send,
  Clock,
  FileText
} from 'lucide-react';
import { AlumniRecord } from '../types';

interface AlumniNetworkProps {
  alumniList: AlumniRecord[];
  isMasterAdmin: boolean;
  onAddAlumni: (alumni: AlumniRecord) => void;
}

export const AlumniNetwork: React.FC<AlumniNetworkProps> = ({
  alumniList,
  isMasterAdmin,
  onAddAlumni
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'alumni' | 'careers'>('alumni');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [mentorshipOnly, setMentorshipOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Job Application Modal State
  const [selectedJob, setSelectedJob] = useState<{
    id: string;
    company: string;
    role: string;
    dept: string;
    stipend: string;
    location: string;
    type: string;
    deadline: string;
  } | null>(null);
  const [applicantName, setApplicantName] = useState('Siam Chowdhury');
  const [applicantRoll, setApplicantRoll] = useState('RTI-AP-S50088');
  const [applicantCgpa, setApplicantCgpa] = useState('3.82');
  const [coverLetter, setCoverLetter] = useState('I am eager to apply my laboratory training in textile process optimization and quality control at your esteemed organization.');
  const [applySuccessToast, setApplySuccessToast] = useState<string | null>(null);

  // Initial Industry Openings Data
  const [jobPostings] = useState([
    {
      id: 'job-101',
      company: 'Square Textiles Ltd.',
      role: 'Management Trainee Officer (Spinning QC & Cotton Fiber Testing)',
      dept: 'Yarn Manufacturing',
      stipend: '৳28,000 / month BDT',
      location: 'Gazipur, Dhaka',
      type: 'Full-Time Internship',
      deadline: '2026-08-30',
      description: 'Supervise Uster tester sliver testing, AFIS fiber length measurement, and ring frame yarn count variation audits.'
    },
    {
      id: 'job-102',
      company: 'Beximco Industrial Park',
      role: 'Dyeing & Finishing Process Engineer Intern',
      dept: 'Wet Processing',
      stipend: '৳25,000 / month BDT',
      location: 'Savar, Dhaka',
      type: 'Industrial Attachment (6 Months)',
      deadline: '2026-09-05',
      description: 'Hands-on training in continuous dyeing range (CDR), stenter heat-setting, and reactive dye recipe formulation.'
    },
    {
      id: 'job-103',
      company: 'Envoy Textiles Ltd. (Denim Division)',
      role: 'Air-Jet Loom Weaving Assistant',
      dept: 'Fabric Manufacturing',
      stipend: '৳30,000 / month BDT',
      location: 'Bhaluka, Mymensingh',
      type: 'Graduate Placement',
      deadline: '2026-08-28',
      description: 'Monitor warp tension, automatic shed adjustment, and zero-defect indigo rope dyeing line efficiency.'
    },
    {
      id: 'job-104',
      company: 'Ha-Meem Group (Apparel Division)',
      role: 'Industrial Engineering & Garment CAD Specialist',
      dept: 'Apparel Manufacturing',
      stipend: '৳32,000 / month BDT',
      location: 'Tongi, Gazipur',
      type: 'Full-Time Career Opportunity',
      deadline: '2026-09-12',
      description: 'Perform SMV time-studies, 3D CLO Garment pattern simulation, and sewing line balancing for export orders.'
    }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    passingBatch: 'Batch 44 (2024)',
    department: 'Wet Processing',
    graduationYear: 2024,
    currentCompany: '',
    currentRole: '',
    jobLocation: '',
    phone: '',
    email: '',
    linkedinUrl: '',
    mentorshipAvailable: true,
    achievements: ''
  });

  const filteredAlumni = alumniList.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.currentCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.passingBatch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'All' || item.department === selectedDept;
    const matchesYear = selectedYear === 'All' || item.graduationYear.toString() === selectedYear;
    const matchesMentor = !mentorshipOnly || item.mentorshipAvailable;

    return matchesSearch && matchesDept && matchesYear && matchesMentor;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.currentCompany || !formData.currentRole) {
      alert('Please complete all required fields.');
      return;
    }

    const newAlumni: AlumniRecord = {
      id: `alm-${Date.now()}`,
      studentId: formData.studentId || `RTI-ALM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      passingBatch: formData.passingBatch,
      department: formData.department,
      graduationYear: Number(formData.graduationYear),
      currentCompany: formData.currentCompany,
      currentRole: formData.currentRole,
      jobLocation: formData.jobLocation || 'Dhaka, Bangladesh',
      phone: formData.phone || '+880 1700-000000',
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@textile.org`,
      linkedinUrl: formData.linkedinUrl,
      mentorshipAvailable: formData.mentorshipAvailable,
      achievements: formData.achievements
    };

    onAddAlumni(newAlumni);
    setShowAddModal(false);
    setFormData({
      studentId: '',
      name: '',
      passingBatch: 'Batch 44 (2024)',
      department: 'Wet Processing',
      graduationYear: 2024,
      currentCompany: '',
      currentRole: '',
      jobLocation: '',
      phone: '',
      email: '',
      linkedinUrl: '',
      mentorshipAvailable: true,
      achievements: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-semibold text-purple-200 mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-purple-300" />
              <span>Rangpur Textile Institute Alumni Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              RTI Ex-Students & Global Professional Network
            </h1>
            <p className="text-purple-200 text-sm mt-1 max-w-2xl">
              Connect with alumni leading spinning, wet processing, denim weaving, and apparel manufacturing plants across Bangladesh and internationally.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Register Alumni Profile</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-800/60 text-xs">
          <div>
            <span className="text-purple-300 block">Total Registered Alumni</span>
            <span className="text-xl font-bold text-white">{alumniList.length} Leaders</span>
          </div>
          <div>
            <span className="text-purple-300 block">Available Mentors</span>
            <span className="text-xl font-bold text-amber-300">
              {alumniList.filter(a => a.mentorshipAvailable).length} Active
            </span>
          </div>
          <div>
            <span className="text-purple-300 block">Partner Textile Mills</span>
            <span className="text-xl font-bold text-emerald-300">24+ Companies</span>
          </div>
          <div>
            <span className="text-purple-300 block">Graduation Batches</span>
            <span className="text-xl font-bold text-sky-300">Batch 38 - 44</span>
          </div>
        </div>
      </div>

      {/* SUCCESS TOAST NOTIFICATION */}
      {applySuccessToast && (
        <div className="bg-emerald-950 text-emerald-200 border border-emerald-500/50 p-4 rounded-2xl shadow-xl flex items-center justify-between font-bold text-xs animate-bounce">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{applySuccessToast}</span>
          </div>
          <button onClick={() => setApplySuccessToast(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center space-x-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveMainTab('alumni')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            activeMainTab === 'alumni'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Alumni Directory & Mentors</span>
        </button>
        <button
          onClick={() => setActiveMainTab('careers')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            activeMainTab === 'careers'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Textile Industry Career & Internship Portal</span>
        </button>
      </div>

      {/* CAREER & INTERNSHIP PORTAL VIEW */}
      {activeMainTab === 'careers' ? (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold flex items-center space-x-2 text-emerald-400">
                <Building2 className="w-5 h-5" />
                <span>Active Industry Placement & Internship Openings</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct industrial placements with Bangladesh's top spinning, weaving, dyeing, and export apparel conglomerates.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold">
              {jobPostings.length} Active Listings
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobPostings.map((job) => (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg space-y-4 text-white flex flex-col justify-between transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        {job.dept}
                      </span>
                      <h4 className="font-extrabold text-base text-white mt-0.5">{job.company}</h4>
                      <p className="text-xs font-bold text-indigo-300">{job.role}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg whitespace-nowrap">
                      {job.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Deadline: {job.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Stipend / Salary:</span>
                    <span className="font-mono font-extrabold text-emerald-400 text-xs">{job.stipend}</span>
                  </div>

                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ALUMNI DIRECTORY VIEW */
        <>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, company, role, city..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Dept Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Wet Processing">Wet Processing</option>
            <option value="Yarn Manufacturing">Yarn Manufacturing</option>
            <option value="Fabric Manufacturing">Fabric Manufacturing</option>
            <option value="Apparel Manufacturing">Apparel Manufacturing</option>
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="All">All Graduation Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>

          {/* Mentor Toggle */}
          <label className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={mentorshipOnly}
              onChange={(e) => setMentorshipOnly(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Mentors Only</span>
          </label>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredAlumni.map((alumni) => (
          <div
            key={alumni.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{alumni.name}</h3>
                    {alumni.mentorshipAvailable && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Mentor</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-700 font-semibold mt-0.5">
                    {alumni.department} &bull; {alumni.passingBatch}
                  </p>
                </div>

                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                  Class of {alumni.graduationYear}
                </span>
              </div>

              {/* Role & Company */}
              <div className="mt-4 bg-purple-50/60 rounded-xl p-3 border border-purple-100 space-y-1.5 text-xs">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                  <span>{alumni.currentRole}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{alumni.currentCompany}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{alumni.jobLocation}</span>
                </div>
              </div>

              {/* Achievements */}
              {alumni.achievements && (
                <div className="mt-3 text-xs text-slate-600 flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{alumni.achievements}</span>
                </div>
              )}
            </div>

            {/* Contacts & Social */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3 text-slate-600">
                <a
                  href={`mailto:${alumni.email}`}
                  className="hover:text-purple-600 flex items-center space-x-1 transition-colors"
                  title={alumni.email}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Email</span>
                </a>
                <a
                  href={`tel:${alumni.phone}`}
                  className="hover:text-purple-600 flex items-center space-x-1 transition-colors"
                  title={alumni.phone}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Call</span>
                </a>
                {alumni.linkedinUrl && (
                  <a
                    href={alumni.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-600 flex items-center space-x-1 transition-colors text-blue-600 font-semibold"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                ID: {alumni.studentId}
              </span>
            </div>
          </div>
        ))}

        {filteredAlumni.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700">No Alumni Found</h3>
            <p className="text-slate-500 text-xs mt-1">Try adjusting your search criteria or register a new ex-student profile.</p>
          </div>
        )}
      </div>

      {/* Add Alumni Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Register Ex-Student Profile</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Engr. Farhan Tanvir"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Roll / ID</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="RTI-WP-B4205"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Wet Processing">Wet Processing</option>
                    <option value="Yarn Manufacturing">Yarn Manufacturing</option>
                    <option value="Fabric Manufacturing">Fabric Manufacturing</option>
                    <option value="Apparel Manufacturing">Apparel Manufacturing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Passing Batch</label>
                  <input
                    type="text"
                    value={formData.passingBatch}
                    onChange={e => setFormData({ ...formData, passingBatch: e.target.value })}
                    placeholder="Batch 42 (2022)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={e => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.currentCompany}
                    onChange={e => setFormData({ ...formData, currentCompany: e.target.value })}
                    placeholder="Square Textiles Ltd."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.currentRole}
                    onChange={e => setFormData({ ...formData, currentRole: e.target.value })}
                    placeholder="Spinning Quality Manager"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Job Location</label>
                  <input
                    type="text"
                    value={formData.jobLocation}
                    onChange={e => setFormData({ ...formData, jobLocation: e.target.value })}
                    placeholder="Gazipur, Dhaka"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1712-000000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notable Achievement / Note</label>
                <textarea
                  rows={2}
                  value={formData.achievements}
                  onChange={e => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="Key accomplishments, publications, or plant scale-up experience..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <label className="flex items-center space-x-2 bg-amber-50 border border-amber-200 p-3 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.mentorshipAvailable}
                  onChange={e => setFormData({ ...formData, mentorshipAvailable: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-bold text-amber-900">Available to Mentor Current RTI Students</span>
              </label>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Register Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOB / INTERNSHIP APPLICATION MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Apply for Industry Opportunity</h3>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase">{selectedJob.company}</span>
              <div className="font-extrabold text-sm text-white">{selectedJob.role}</div>
              <div className="text-xs text-slate-400">Department Target: {selectedJob.dept} • Stipend: {selectedJob.stipend}</div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setApplySuccessToast(`Application for "${selectedJob.role}" at ${selectedJob.company} submitted successfully! Our Placement Office will notify you.`);
                setSelectedJob(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Applicant Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-bold text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Student Roll ID *</label>
                  <input
                    type="text"
                    required
                    value={applicantRoll}
                    onChange={(e) => setApplicantRoll(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Current Cumulative CGPA</label>
                <input
                  type="text"
                  value={applicantCgpa}
                  onChange={(e) => setApplicantCgpa(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Cover Letter & Technical Background *</label>
                <textarea
                  rows={3}
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-[11px] text-indigo-300 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Your official RTI academic transcript and lab clearance records will be automatically attached to this application.</span>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Industry Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};
