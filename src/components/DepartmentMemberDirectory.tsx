import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  GraduationCap, 
  Briefcase, 
  Phone, 
  Mail, 
  Building2, 
  Clock, 
  Award, 
  ShieldCheck, 
  FileText, 
  X, 
  Send,
  Calendar,
  BookOpen,
  MapPin,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Printer,
  Sparkles,
  Edit3,
  Trash2,
  Lock,
  EyeOff,
  HeartHandshake,
  ShieldAlert,
  Download
} from 'lucide-react';
import { RegisteredMember, StudentGradeRecord, StudentFeeStatus, DepartmentType } from '../types';
import { CreditCard, DollarSign } from 'lucide-react';

interface DepartmentMemberDirectoryProps {
  departmentKey: DepartmentType;
  departmentTitle: string;
  registeredMembers: RegisteredMember[];
  studentGrades: StudentGradeRecord[];
  studentFees: StudentFeeStatus[];
  onRegisterMember: (member: RegisteredMember) => void;
  onUpdateMember?: (member: RegisteredMember) => void;
  onDeleteMember?: (id: string) => void;
  onPayFeeDues?: (studentId: string, amount: number) => void;
  isMasterAdmin: boolean;
  activeRole?: string;
  initialRoleFilter?: 'ALL' | 'Student' | 'Faculty';
}

export const DepartmentMemberDirectory: React.FC<DepartmentMemberDirectoryProps> = ({
  departmentKey,
  departmentTitle,
  registeredMembers,
  studentGrades,
  studentFees,
  onRegisterMember,
  onUpdateMember,
  onDeleteMember,
  onPayFeeDues,
  isMasterAdmin,
  activeRole = 'Super Admin',
  initialRoleFilter = 'ALL'
}) => {
  const [filterRole, setFilterRole] = useState<'ALL' | 'Student' | 'Faculty'>(initialRoleFilter);
  const [filterSession, setFilterSession] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Active' | 'Graduated'>('ALL');
  const [filterStudentStatus, setFilterStudentStatus] = useState<'ALL' | 'Running Student' | 'Ex-Student (Alumni)'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Profile Modal State
  const [selectedMember, setSelectedMember] = useState<RegisteredMember | null>(null);
  const [showDigitalIdCard, setShowDigitalIdCard] = useState(false);
  const [showOfficialCertificate, setShowOfficialCertificate] = useState(false);
  const [certType, setCertType] = useState<'TESTIMONIAL' | 'BONAFIDE' | 'CLEARANCE'>('TESTIMONIAL');

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState<RegisteredMember | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!editingMember) {
      setShowDeleteConfirm(false);
    }
  }, [editingMember]);

  // Add Member Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'Student' | 'Faculty'>('Student');

  // Bulk Import Modal State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkDefaultRole, setBulkDefaultRole] = useState<'Student' | 'Faculty'>('Student');

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formRollId, setFormRollId] = useState('');
  const [formDeptKey, setFormDeptKey] = useState<DepartmentType>(departmentKey);
  const [formBatchOrDesignation, setFormBatchOrDesignation] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formGender, setFormGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [formBloodGroup, setFormBloodGroup] = useState('B+');

  // Female Student Safety & Protected Contact Detection
  const isFemaleStudent = (member: RegisteredMember): boolean => {
    if (member.gender === 'Female') return true;
    if (member.gender === 'Male') return false;
    const femalePattern = /\b(mst|miss|mrs|begum|khatun|akter|fatema|nusrat|tanjina|jannat|sultana|afrin|sabiha|mim|sadia|lamia|maria|rupa|farhana|sharmin|sumaiya|shirin|nargis|rokeya|tania|tahmina|asma|salma|naznin|marufa|shampa|munira|fahmida|aysha|ayesha|rabeya|jannatul|umme|nasrin|anika|suraiya|tanzina|mitu|bithi|laboni|swapna|shila|poly|munni|sonia|shanta)\b/i;
    return femalePattern.test(member.name);
  };

  // Mask female student phone number for public privacy (017******12) unless Master Admin
  const getDisplayPhone = (member: RegisteredMember): string => {
    const isFemale = isFemaleStudent(member);
    if (member.role === 'Student' && isFemale && !isMasterAdmin) {
      const raw = (member.phone || '').trim();
      if (!raw) return '017******12';
      const digits = raw.replace(/\D/g, '');
      const prefix = raw.startsWith('+880') ? '+880 17' : (digits.startsWith('01') ? digits.slice(0, 3) : '017');
      const suffix = digits.slice(-2) || (raw.length >= 2 ? raw.slice(-2) : '12');
      return `${prefix}******${suffix}`;
    }
    return member.phone;
  };
  const [formGuardianName, setFormGuardianName] = useState('Mohammad Rahman');
  const [formGuardianPhone, setFormGuardianPhone] = useState('+880 1711-223344');
  const [formSemester, setFormSemester] = useState('5th Semester');
  const [formOfficeHours, setFormOfficeHours] = useState('Sun - Wed (10:00 AM - 12:30 PM)');
  const [formAssignedClasses, setFormAssignedClasses] = useState('Tex-301: Advanced Dyeing, Tex-302: Lab Practice');
  const [formCurrentPlacement, setFormCurrentPlacement] = useState('In Academic Studies');
  const [formJobDesignation, setFormJobDesignation] = useState('');
  const [formJobLocation, setFormJobLocation] = useState('');
  const [formInternshipStatus, setFormInternshipStatus] = useState('Not Started');
  const [formInternshipCompany, setFormInternshipCompany] = useState('');
  const [formInternshipDuration, setFormInternshipDuration] = useState('');

  const handleAddPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingMember) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditingMember({ ...editingMember, photoUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddForm = (role: 'Student' | 'Faculty') => {
    setAddType(role);
    setFormDeptKey(departmentKey);
    const prefix = role === 'Student' ? 'RTI-STU' : 'RTI-FAC';
    setFormRollId(`${prefix}-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormName('');
    setFormBatchOrDesignation(role === 'Student' ? 'Batch 52 (Textile Engineering)' : 'Assistant Professor');
    setFormEmail('');
    setFormPhone('+880 1700-123456');
    setFormPhotoUrl('');
    setFormCurrentPlacement('In Academic Studies');
    setFormJobDesignation('');
    setFormJobLocation('');
    setFormInternshipStatus('Not Started');
    setFormInternshipCompany('');
    setFormInternshipDuration('');
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPhotoUrl) {
      alert('⚠️ Mandatory Field Required: Profile photo upload is compulsory for all registrations (Student, Teacher, Staff, Lab Users). Please upload a picture before completing registration.');
      return;
    }
    const newMember: RegisteredMember = {
      id: `mem-${Date.now()}`,
      rollOrEmpId: formRollId,
      name: formName,
      role: addType,
      gender: formGender,
      staffCategory: addType === 'Student' ? 'Student' : 'Teacher',
      department: formDeptKey || departmentKey,
      batchOrDesignation: formBatchOrDesignation,
      email: formEmail || `${formRollId.toLowerCase()}@rangpurtextile.edu.bd`,
      phone: formPhone,
      photoUrl: formPhotoUrl,
      qrCodeData: `RTI:MEMBER:${formRollId}:${formName.replace(/\s+/g, '')}:${addType}`,
      accessStatus: 'Active',
      lastSeen: 'Just Registered',
      bloodGroup: formBloodGroup,
      guardianName: formGuardianName,
      guardianPhone: formGuardianPhone,
      semester: formSemester,
      officeHours: formOfficeHours,
      assignedClasses: formAssignedClasses.split(',').map(s => s.trim()),
      currentPlacement: formCurrentPlacement,
      jobDesignation: formJobDesignation,
      jobLocation: formJobLocation,
      internshipStatus: formInternshipStatus,
      internshipCompany: formInternshipCompany,
      internshipDuration: formInternshipDuration
    };

    onRegisterMember(newMember);
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!editingMember.photoUrl) {
      alert('⚠️ Mandatory Field Required: Profile photo upload is compulsory for all members.');
      return;
    }
    if (onUpdateMember) {
      onUpdateMember(editingMember);
    }
    if (selectedMember && selectedMember.id === editingMember.id) {
      setSelectedMember(editingMember);
    }
    setEditingMember(null);
  };

  const handleBulkImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkCsvText.trim()) return;

    const lines = bulkCsvText.trim().split('\n');
    let importedCount = 0;

    lines.forEach((line, idx) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 2) return;

      const name = parts[0];
      const rollOrEmpId = parts[1] || `${bulkDefaultRole === 'Student' ? 'RTI-STU' : 'RTI-FAC'}-${Math.floor(1000 + Math.random() * 9000)}`;
      const roleStr = parts[2] ? (parts[2].toLowerCase().includes('fac') || parts[2].toLowerCase().includes('teach') ? 'Faculty' : 'Student') : bulkDefaultRole;
      const deptStr = (parts[3] as DepartmentType) || departmentKey || 'wet_processing';
      const batchOrDesig = parts[4] || (roleStr === 'Student' ? 'Batch 52 (Textile Eng)' : 'Assistant Professor');
      const email = parts[5] || `${rollOrEmpId.toLowerCase().replace(/[^a-z0-9]/g, '')}@rti.edu.bd`;
      const phone = parts[6] || '+880 1700-000000';
      const bloodGroup = parts[7] || 'B+';

      const member: RegisteredMember = {
        id: `mem-bulk-${Date.now()}-${idx}`,
        rollOrEmpId,
        name,
        role: roleStr as 'Student' | 'Faculty',
        department: deptStr,
        batchOrDesignation: batchOrDesig,
        email,
        phone,
        qrCodeData: `RTI:MEMBER:${rollOrEmpId}:${name.replace(/\s+/g, '')}:${roleStr}`,
        accessStatus: 'Active',
        lastSeen: 'Just Imported',
        bloodGroup,
        guardianName: 'Guardian',
        guardianPhone: '+880 1711-000000',
        semester: '1st Semester'
      };

      onRegisterMember(member);
      importedCount++;
    });

    alert(`Successfully imported ${importedCount} member(s) into the institute directory.`);
    setBulkCsvText('');
    setShowBulkModal(false);
  };

  // Filter members for this department or all departments
  const deptMembers = registeredMembers.filter(m => 
    (departmentKey as string) === 'ALL' || !departmentKey || m.department === departmentKey || departmentTitle.toLowerCase().includes('complete')
  );

  const filteredMembers = deptMembers.filter(m => {
    const matchesRole = filterRole === 'ALL' || m.role === filterRole;
    
    // Session filter
    const matchesSession = filterSession === 'ALL' || 
      m.batchOrDesignation.toLowerCase().includes(filterSession.toLowerCase()) ||
      (m.semester && m.semester.toLowerCase().includes(filterSession.toLowerCase()));

    // Status filter (Active vs Graduated)
    const isGraduated = m.batchOrDesignation.toLowerCase().includes('graduated') || 
                        m.batchOrDesignation.toLowerCase().includes('alumni') || 
                        m.semester === 'Graduated' || 
                        m.semester === 'Alumni';
    const matchesStatus = filterStatus === 'ALL' || 
      (filterStatus === 'Active' && !isGraduated) || 
      (filterStatus === 'Graduated' && isGraduated);

    const matchesStudentStatus = filterStudentStatus === 'ALL' || (m.studentStatus || 'Running Student') === filterStudentStatus;

    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      m.name.toLowerCase().includes(q) || 
      m.rollOrEmpId.toLowerCase().includes(q) || 
      m.batchOrDesignation.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      (m.bloodGroup && m.bloodGroup.toLowerCase().includes(q)) ||
      (m.guardianName && m.guardianName.toLowerCase().includes(q));

    return matchesRole && matchesSession && matchesStatus && matchesStudentStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = [
      'Roll/Employee ID',
      'Name',
      'Role',
      'Gender',
      'Department',
      'Batch/Designation',
      'Semester',
      'Access Status',
      'Contact Phone',
      'Email',
      'Blood Group',
      'Guardian Name',
      'Guardian Phone'
    ];
    const rows = filteredMembers.map(m => [
      `"${(m.rollOrEmpId || '').replace(/"/g, '""')}"`,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.role || '').replace(/"/g, '""')}"`,
      `"${m.gender || (isFemaleStudent(m) ? 'Female' : 'Male')}"`,
      `"${(m.department || '').replace(/"/g, '""')}"`,
      `"${(m.batchOrDesignation || '').replace(/"/g, '""')}"`,
      `"${(m.semester || '').replace(/"/g, '""')}"`,
      `"${(m.accessStatus || 'Active').replace(/"/g, '""')}"`,
      `"${getDisplayPhone(m).replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.bloodGroup || '').replace(/"/g, '""')}"`,
      `"${(m.guardianName || '').replace(/"/g, '""')}"`,
      `"${(m.guardianPhone || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RTI_${departmentKey}_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const studentMembers = deptMembers.filter(m => m.role === 'Student');
  const activeStudentsCount = studentMembers.filter(m => 
    !m.batchOrDesignation.toLowerCase().includes('graduated') && 
    !m.batchOrDesignation.toLowerCase().includes('alumni') && 
    m.semester !== 'Graduated' && 
    m.semester !== 'Alumni'
  ).length;

  const graduatedStudentsCount = studentMembers.filter(m => 
    m.batchOrDesignation.toLowerCase().includes('graduated') || 
    m.batchOrDesignation.toLowerCase().includes('alumni') || 
    m.semester === 'Graduated' || 
    m.semester === 'Alumni'
  ).length;

  const facultyCount = deptMembers.filter(m => m.role === 'Faculty').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>{departmentTitle} — Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student profiles, faculty members, ID badges, course assignments, and guardian contacts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(isMasterAdmin || activeRole === 'Teacher' || activeRole === 'Dept Admin' || activeRole === 'Faculty') && (
            <button
              onClick={() => openAddForm('Student')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Student</span>
            </button>
          )}

          {(isMasterAdmin || activeRole === 'Dept Admin') && (
            <button
              onClick={() => openAddForm('Faculty')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>+ Add Teacher</span>
            </button>
          )}

          {isMasterAdmin && (
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>📥 Bulk Import CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Active Running Students</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">{activeStudentsCount}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">🟢 Enrolled & Attending</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Graduated / Alumni</div>
          <div className="text-2xl font-bold text-indigo-700 font-mono mt-1">{graduatedStudentsCount}</div>
          <div className="text-[10px] text-indigo-600 font-bold mt-0.5">🎓 Ex-Students Registered</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Faculty & Lecturers</div>
          <div className="text-2xl font-bold text-purple-700 font-mono mt-1">{facultyCount}</div>
          <div className="text-[10px] text-purple-600 font-medium mt-0.5">Assigned Courses & Labs</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Total Directory Members</div>
          <div className="text-2xl font-bold text-slate-800 font-mono mt-1">{deptMembers.length}</div>
          <div className="text-[10px] text-sky-600 font-medium mt-0.5">All Sessions & Staff</div>
        </div>
      </div>

      {/* Controls, Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setFilterRole('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterRole === 'ALL'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterRole('Student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterRole === 'Student'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setFilterRole('Faculty')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterRole === 'Faculty'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Teachers
            </button>
          </div>

          {/* Student Status Filter */}
          {filterRole === 'Student' && (
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              {['ALL', 'Running Student', 'Ex-Student (Alumni)'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStudentStatus(status as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterStudentStatus === status
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}

          {/* Academic Session Filter */}
          <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500">Session:</span>
            <select
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Academic Sessions</option>
              <option value="2020">Session 2020-21</option>
              <option value="2021">Session 2021-22</option>
              <option value="2022">Session 2022-23</option>
              <option value="2023">Session 2023-24</option>
              <option value="2024">Session 2024-25</option>
              <option value="2025">Session 2025-26</option>
              <option value="2026">Session 2026-27</option>
              <option value="2027">Session 2027-28</option>
              <option value="2028">Session 2028-29</option>
              <option value="2029">Session 2029-30</option>
              <option value="Batch 50">Batch 50</option>
              <option value="Batch 51">Batch 51</option>
              <option value="Batch 52">Batch 52</option>
              <option value="Batch 53">Batch 53</option>
              <option value="Batch 54">Batch 54</option>
              <option value="Batch 55">Batch 55</option>
            </select>
          </div>

          {/* Status Filter (Active vs Graduated) */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'ALL'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setFilterStatus('Active')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'Active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🟢 Running
            </button>
            <button
              onClick={() => setFilterStatus('Graduated')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'Graduated'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🎓 Alumni
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          {/* Instant Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Name, Roll / ID, Batch, Phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 font-medium text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Export to CSV / Excel Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all whitespace-nowrap cursor-pointer"
            title="Download directory list to CSV / Excel spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Database Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Member Name & ID</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Batch / Designation</th>
                <th className="py-3 px-4">Tuition Fee Status</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Live Campus Gate Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs bg-slate-50/50">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Directory Starts Empty (0 Records)</h3>
                      <p className="text-xs text-slate-500">
                        No students or teachers found matching your filters. You can register real members manually or perform a bulk CSV import.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <button
                          onClick={() => openAddForm('Student')}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
                        >
                          + Add Student
                        </button>
                        <button
                          onClick={() => openAddForm('Faculty')}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                        >
                          + Add Teacher
                        </button>
                        <button
                          onClick={() => setShowBulkModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 shadow-sm"
                        >
                          📥 Bulk Import CSV
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map(member => {
                  const feeRec = studentFees.find(f => f.studentId === member.rollOrEmpId);
                  const isFeeCleared = !feeRec || feeRec.status === 'PAID';
                  return (
                  <tr key={member.id} className="hover:bg-purple-50/40 transition-all">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs border border-purple-200 overflow-hidden flex-shrink-0">
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            member.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{member.name}</div>
                          <div className="font-mono text-[10px] text-purple-700 font-semibold">{member.rollOrEmpId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        member.role === 'Student'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        {member.role === 'Student' ? '🎓 Student' : '👨‍🏫 Faculty'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {member.batchOrDesignation}
                    </td>
                    <td className="py-3 px-4">
                      {member.role === 'Student' ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isFeeCleared
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {isFeeCleared ? 'PAID / CLEARED' : `DUE (৳${(feeRec?.tuitionFeeUSD + feeRec?.labFeeUSD + feeRec?.libraryFeeUSD - feeRec?.paidAmountUSD).toLocaleString()})`}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">N/A (Faculty)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {isFemaleStudent(member) && member.role === 'Student' ? (
                        <div className="space-y-0.5">
                          {isMasterAdmin ? (
                            <div>
                              <a href={`tel:${member.phone}`} className="hover:text-purple-600 hover:underline flex items-center space-x-1">
                                <Phone className="w-3 h-3 text-purple-600" />
                                <span>{member.phone}</span>
                              </a>
                              <span className="inline-flex items-center space-x-0.5 px-1 py-0.2 text-[8px] font-bold bg-emerald-100 text-emerald-800 rounded">
                                <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Admin View</span>
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1" title="Female Student Contact Masked for Privacy">
                              <Lock className="w-3 h-3 text-rose-500 flex-shrink-0" />
                              <span className="font-mono text-slate-700 font-bold">{getDisplayPhone(member)}</span>
                              <span className="text-[8px] bg-rose-50 text-rose-700 font-bold px-1 py-0.2 rounded border border-rose-200">
                                Protected
                              </span>
                            </div>
                          )}
                          <a href={`mailto:${member.email}`} className="text-[10px] text-slate-400 hover:text-purple-600 hover:underline flex items-center space-x-1 mt-0.5">
                            <Mail className="w-3 h-3 text-indigo-500" />
                            <span>{member.email}</span>
                          </a>
                        </div>
                      ) : (
                        <div>
                          <a href={`tel:${member.phone}`} className="hover:text-purple-600 hover:underline flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-purple-600" />
                            <span>{member.phone}</span>
                          </a>
                          <a href={`mailto:${member.email}`} className="text-[10px] text-slate-400 hover:text-purple-600 hover:underline flex items-center space-x-1 mt-0.5">
                            <Mail className="w-3 h-3 text-indigo-500" />
                            <span>{member.email}</span>
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Inside Campus (Gate 1)</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setShowDigitalIdCard(true);
                          }}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-200 transition-all flex items-center space-x-1"
                          title="View Digital Student ID Card"
                        >
                          <QrCode className="w-3 h-3 text-indigo-600" />
                          <span>ID Card</span>
                        </button>
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-lg border border-purple-200 transition-all"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => setEditingMember(member)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-lg border border-amber-300 transition-all flex items-center space-x-1"
                          title="Edit Member Details"
                        >
                          <Edit3 className="w-3 h-3 text-amber-600" />
                          <span>Edit</span>
                        </button>
                        {onDeleteMember && (
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this profile?")) {
                                onDeleteMember(member.id);
                              }
                            }}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-all flex items-center space-x-1"
                            title="Remove Member from Directory"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE PROFILE MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-purple-600/30 overflow-hidden flex-shrink-0">
                  {selectedMember.photoUrl ? (
                    <img src={selectedMember.photoUrl} alt={selectedMember.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedMember.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-slate-900">{selectedMember.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedMember.role === 'Student' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {selectedMember.role}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-purple-700 font-bold mt-0.5">{selectedMember.rollOrEmpId} • {departmentTitle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{selectedMember.batchOrDesignation}</div>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            {/* Profile Detail Sections */}
            {selectedMember.role === 'Student' ? (
              <div className="space-y-4 text-xs">
                {/* Core Attributes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <div className="text-slate-400 text-[10px]">Academic Semester</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedMember.semester || '5th Semester'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Admission Status</div>
                    <div className={`font-bold mt-0.5 ${selectedMember.admissionStatus === 'Enrolled' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {selectedMember.admissionStatus || 'Pending'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Blood Group</div>
                    <div className="font-bold text-rose-600 mt-0.5">{selectedMember.bloodGroup || 'B+ (Positive)'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Campus Status</div>
                    <div className="font-bold text-emerald-600 mt-0.5">Inside Campus</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Gate Attendance</div>
                    <div className="font-bold text-purple-700 font-mono mt-0.5">95.4 % Rate</div>
                  </div>
                </div>

                {/* Student Direct Contact Info */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <span>Student Contact Information</span>
                    </h4>
                    {isFemaleStudent(selectedMember) && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>{isMasterAdmin ? '🛡️ Admin Decrypted Contact' : '🔒 Female Student Privacy Protected'}</span>
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400">Phone: </span>
                      {isFemaleStudent(selectedMember) && !isMasterAdmin ? (
                        <span className="font-mono font-bold text-slate-700">{getDisplayPhone(selectedMember)}</span>
                      ) : (
                        <a href={`tel:${selectedMember.phone}`} className="font-mono font-bold text-purple-800 hover:underline">
                          {selectedMember.phone}
                        </a>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-400">Email: </span>
                      <a href={`mailto:${selectedMember.email}`} className="font-bold text-indigo-700 hover:underline">
                        {selectedMember.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Guardian Info */}
                <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 space-y-2">
                  <h4 className="font-bold text-purple-900 flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span>Guardian Contact Details</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400">Guardian Name: </span>
                      <span className="font-semibold">{selectedMember.guardianName || 'Mohammad Rahman'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Phone: </span>
                      <span className="font-mono font-bold text-purple-800">{selectedMember.guardianPhone || selectedMember.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Career Placement & Industrial Internship Card */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl border border-indigo-500/30 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-indigo-900/60 pb-2">
                    <h4 className="font-bold text-xs text-purple-300 flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      <span>Career Placement & Industrial Internship Track</span>
                    </h4>
                    {isMasterAdmin && (
                      <button
                        onClick={() => {
                          setEditingMember(selectedMember);
                          setSelectedMember(null);
                        }}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] flex items-center space-x-1 transition-all"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Career Info</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Placement Column */}
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="text-[10px] text-purple-400 uppercase font-mono tracking-wider font-bold">Current Placement & Job</div>
                      <div className="text-sm font-bold text-white">
                        {selectedMember.jobDesignation ? `${selectedMember.jobDesignation}` : (selectedMember.currentPlacement || 'In Academic Studies')}
                      </div>
                      <div className="text-xs text-slate-300 flex items-center space-x-1">
                        <span className="text-slate-500 font-mono">Location/Mill:</span>
                        <span className="font-semibold text-sky-300">{selectedMember.jobLocation || 'RTI Academic Campus'}</span>
                      </div>
                      <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                        Status: {selectedMember.currentPlacement || 'In Academic Studies'}
                      </div>
                    </div>

                    {/* Internship Column */}
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider font-bold">Industrial Internship / Apprenticeship</div>
                      <div className="text-sm font-bold text-emerald-300">
                        {selectedMember.internshipCompany || 'Textile Mill Internship (Pending / In Prep)'}
                      </div>
                      <div className="text-xs text-slate-300 flex items-center space-x-1">
                        <span className="text-slate-500 font-mono">Duration:</span>
                        <span className="font-semibold text-slate-200">{selectedMember.internshipDuration || '4-Month Industrial Period'}</span>
                      </div>
                      <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Internship: {selectedMember.internshipStatus || 'Completed / Verified'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Transcript & Grades */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Academic Transcript & Grades</span>
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold text-[10px]">
                        <tr>
                          <th className="p-2.5">Code & Subject</th>
                          <th className="p-2.5">Credits</th>
                          <th className="p-2.5">Grade</th>
                          <th className="p-2.5">Lab Performance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-2.5 font-medium">TEX-301: Advanced Dyeing & Finishing</td>
                          <td className="p-2.5 font-mono">3.0</td>
                          <td className="p-2.5 font-bold text-emerald-600">A+</td>
                          <td className="p-2.5 font-mono">94 % Score</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium">TEX-302: Chemical Testing & Quality Control</td>
                          <td className="p-2.5 font-mono">3.0</td>
                          <td className="p-2.5 font-bold text-emerald-600">A</td>
                          <td className="p-2.5 font-mono">90 % Score</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-medium">TEX-303: Industrial Boiler & Steam Safety</td>
                          <td className="p-2.5 font-mono">2.0</td>
                          <td className="p-2.5 font-bold text-purple-600">A-</td>
                          <td className="p-2.5 font-mono">88 % Score</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tuition & Laboratory Fee Clearance Module */}
                {(() => {
                  const sf = studentFees.find(f => f.studentId === selectedMember.rollOrEmpId) || {
                    studentId: selectedMember.rollOrEmpId,
                    studentName: selectedMember.name,
                    tuitionFeeUSD: 1200,
                    labFeeUSD: 350,
                    libraryFeeUSD: 100,
                    hostelFeeUSD: 0,
                    paidAmountUSD: 1650,
                    status: 'PAID' as const,
                    dueDate: '2026-08-20',
                    invoiceNo: 'INV-2026-9000'
                  };
                  const totalUSD = sf.tuitionFeeUSD + sf.labFeeUSD + sf.libraryFeeUSD + sf.hostelFeeUSD;
                  const dueUSD = Math.max(0, totalUSD - sf.paidAmountUSD);
                  const statusColor = sf.status === 'PAID' || dueUSD === 0
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : sf.status === 'PARTIAL'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300';

                  return (
                    <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-emerald-400 flex items-center space-x-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span>Tuition & Laboratory Fee Clearance Module</span>
                        </h4>
                        {isMasterAdmin && (
                          <button
                            onClick={() => {
                              setEditingMember(selectedMember);
                              setSelectedMember(null);
                            }}
                            className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] flex items-center space-x-1 transition-all"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Update</span>
                          </button>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusColor}`}>
                          {dueUSD === 0 ? 'PAID / CLEARED' : sf.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Total Fees</span>
                          <span className="font-bold text-white">৳{totalUSD.toLocaleString()} BDT</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Amount Paid</span>
                          <span className="font-bold text-emerald-400">৳{sf.paidAmountUSD.toLocaleString()} BDT</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Outstanding Due</span>
                          <span className={`font-bold ${dueUSD > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                            ৳{dueUSD.toLocaleString()} BDT
                          </span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Invoice / Due Date</span>
                          <span className="text-slate-300 text-[10px]">{sf.dueDate}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="flex justify-between">
                          <span>Tuition (৳1,200) + Lab (৳350) + Library (৳100):</span>
                          <span className="font-mono font-bold">৳{totalUSD.toLocaleString()} BDT</span>
                        </div>
                        {sf.lastPaymentDate && (
                          <div className="flex justify-between text-emerald-400 text-[10px]">
                            <span>Last Payment Received:</span>
                            <span className="font-mono">{sf.lastPaymentDate}</span>
                          </div>
                        )}
                      </div>

                      {dueUSD > 0 ? (
                        <button
                          onClick={() => {
                            if (onPayFeeDues) {
                              onPayFeeDues(selectedMember.rollOrEmpId, dueUSD);
                              alert(`Payment Confirmation: ৳${dueUSD.toLocaleString()} BDT Tuition Fee Dues Cleared for ${selectedMember.name}!`);
                            }
                          }}
                          className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay & Clear Dues Online (৳{dueUSD.toLocaleString()} BDT)</span>
                        </button>
                      ) : (
                        <div className="p-2 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 font-bold flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Tuition & Laboratory Dues 100% Cleared!</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Faculty Profile */
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <div className="text-slate-400 text-[10px]">Employee ID</div>
                    <div className="font-bold font-mono text-purple-700 mt-0.5">{selectedMember.rollOrEmpId}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Designation</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedMember.batchOrDesignation}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Department</div>
                    <div className="font-bold text-indigo-700 mt-0.5">{departmentTitle}</div>
                  </div>
                </div>

                <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 space-y-2">
                  <h4 className="font-bold text-indigo-900 flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Official Office Hours & Availability</span>
                  </h4>
                  <div className="text-slate-800 font-medium">
                    {selectedMember.officeHours || 'Sunday - Wednesday (10:00 AM - 12:30 PM) @ Dept Building Room #302'}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Assigned Courses & Laboratory Batches</span>
                  </h4>
                  <div className="space-y-1.5">
                    {(selectedMember.assignedClasses || ['TEX-301: Coloration Technology', 'TEX-302: Advanced Finishing Range Lab']).map((cls, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-800 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{cls}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              {/* Click to Call / Email Actions */}
              <div className="flex items-center space-x-2 text-xs">
                <a
                  href={`tel:${selectedMember.phone}`}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 flex items-center space-x-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call {selectedMember.phone}</span>
                </a>
                <a
                  href={`mailto:${selectedMember.email}`}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-xl border border-indigo-200 flex items-center space-x-1.5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Email Member</span>
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingMember(selectedMember)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow flex items-center space-x-1.5 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Member</span>
                </button>
                <button
                  onClick={() => setShowDigitalIdCard(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/20 flex items-center space-x-1.5 transition-all"
                >
                  <QrCode className="w-4 h-4 text-purple-200" />
                  <span>🪪 Digital ID Card</span>
                </button>
                <button
                  onClick={() => setShowOfficialCertificate(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all"
                >
                  <FileText className="w-4 h-4 text-emerald-200" />
                  <span>📜 Generate Certificate</span>
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL ID CARD GENERATOR MODAL */}
      {selectedMember && showDigitalIdCard && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full p-4 sm:p-6 shadow-2xl border border-purple-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-widest flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>RTI Digital ID Pass</span>
              </span>
              <button
                onClick={() => setShowDigitalIdCard(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Printable ID Card Container */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-2xl p-5 shadow-xl border border-purple-500/40 space-y-4 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Institute Header */}
              <div className="border-b border-purple-500/30 pb-3">
                <h4 className="font-mono font-black text-xs text-purple-300 tracking-wider uppercase">
                  RANGPUR TEXTILE INSTITUTE
                </h4>
                <p className="text-[9px] text-slate-300 font-medium mt-0.5">
                  OFFICIAL {selectedMember.role.toUpperCase()} IDENTIFICATION CARD
                </p>
              </div>

              {/* Photo & Identity Badge */}
              <div className="space-y-2">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-600 text-white font-extrabold text-2xl flex items-center justify-center border-2 border-purple-400/80 shadow-lg shadow-purple-600/40 overflow-hidden">
                  {selectedMember.photoUrl ? (
                    <img src={selectedMember.photoUrl} alt={selectedMember.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedMember.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">{selectedMember.name}</h3>
                  <div className="font-mono font-bold text-xs text-purple-300 mt-0.5">{selectedMember.rollOrEmpId}</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{selectedMember.batchOrDesignation}</div>
                  <div className="text-[10px] text-purple-200 font-semibold">{departmentTitle}</div>
                </div>
              </div>

              {/* Extra Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/80 p-2.5 rounded-xl border border-purple-500/30">
                <div className="text-left">
                  <span className="text-slate-400 block">Blood Group:</span>
                  <span className="font-extrabold text-rose-400">{selectedMember.bloodGroup || 'B+'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Valid Until:</span>
                  <span className="font-mono font-bold text-emerald-400">DEC 2028</span>
                </div>
              </div>

              {/* Interactive QR Code & Barcode */}
              <div className="bg-white p-3 rounded-xl space-y-1.5 shadow-inner">
                <div className="w-24 h-24 mx-auto bg-slate-900 p-2 rounded-lg flex items-center justify-center">
                  <QrCode className="w-full h-full text-white" />
                </div>
                <div className="font-mono text-[9px] font-bold text-slate-800 tracking-wider">
                  {selectedMember.qrCodeData}
                </div>
                <div className="text-[8px] text-slate-400 font-semibold">SCAN FOR TURNSTILE GATE ACCESS</div>
              </div>
            </div>

            {/* Print Action */}
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => alert(`Printing Official ID Card for ${selectedMember.name}...`)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/20 flex items-center justify-center space-x-2 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Digital ID Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL DOCUMENT & CERTIFICATE GENERATOR MODAL */}
      {selectedMember && showOfficialCertificate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Official Document & Certificate Generator</h3>
              </div>
              <button
                onClick={() => setShowOfficialCertificate(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Document Selector Controls */}
            <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setCertType('TESTIMONIAL')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  certType === 'TESTIMONIAL'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Academic Testimonial
              </button>
              <button
                type="button"
                onClick={() => setCertType('BONAFIDE')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  certType === 'BONAFIDE'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bonafide Student Cert
              </button>
              <button
                type="button"
                onClick={() => setCertType('CLEARANCE')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  certType === 'CLEARANCE'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                No Dues Clearance
              </button>
            </div>

            {/* Printable Formal Document Paper */}
            <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl border-4 border-emerald-800/80 font-serif relative overflow-hidden space-y-6">
              {/* Emblem Watermark Effect */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                <Building2 className="w-96 h-96 text-emerald-900" />
              </div>

              {/* Official Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <div className="font-sans font-black text-xs tracking-widest text-emerald-900 uppercase">
                  GOVERNMENT OF THE PEOPLE'S REPUBLIC OF BANGLADESH
                </div>
                <h2 className="font-sans font-black text-xl text-slate-900 uppercase tracking-wide">
                  RANGPUR TEXTILE INSTITUTE
                </h2>
                <p className="font-sans text-xs text-slate-600">
                  Affiliated with Bangladesh University of Textiles (BUTEX) • Directorate of Textiles
                </p>
                <div className="font-sans text-[10px] text-slate-500 font-mono mt-1">
                  Ref No: RTI/ACAD/CERT/2026/0894 • Date: {new Date().toLocaleDateString('en-GB')}
                </div>
              </div>

              {/* Certificate Title Banner */}
              <div className="text-center">
                <span className="inline-block border-2 border-emerald-900 px-6 py-1.5 rounded-full font-sans font-black text-sm text-emerald-950 uppercase tracking-widest bg-emerald-50">
                  {certType === 'TESTIMONIAL' && 'CHARACTER & ACADEMIC TESTIMONIAL'}
                  {certType === 'BONAFIDE' && 'BONAFIDE STUDENT CERTIFICATE'}
                  {certType === 'CLEARANCE' && 'OFFICIAL NO DUES CLEARANCE CERTIFICATE'}
                </span>
              </div>

              {/* Certificate Body Text */}
              <div className="text-sm leading-relaxed text-slate-800 text-justify space-y-3 font-serif">
                {certType === 'TESTIMONIAL' && (
                  <p>
                    This is to certify that <strong>{selectedMember.name}</strong>, Son/Daughter of{' '}
                    <strong>{selectedMember.guardianName || 'Mohammad Rahman'}</strong>, bearing Student Roll ID{' '}
                    <strong className="font-mono">{selectedMember.rollOrEmpId}</strong>, is a regular student of the Department of{' '}
                    <strong>{departmentTitle}</strong> at Rangpur Textile Institute ({selectedMember.batchOrDesignation}). To the best of our knowledge and records, he/she bears an excellent moral character, exemplary conduct, and an outstanding academic record with a cumulative GPA of <strong>3.82 / 4.00</strong>. He/she has actively participated in departmental laboratory research and Red Crescent voluntary activities. We wish him/her every success in future professional endeavors.
                  </p>
                )}

                {certType === 'BONAFIDE' && (
                  <p>
                    This is to confirm that <strong>{selectedMember.name}</strong> (Student ID:{' '}
                    <strong className="font-mono">{selectedMember.rollOrEmpId}</strong>) is a bonafide full-time student currently enrolled in the{' '}
                    <strong>{selectedMember.semester || '5th Semester'}</strong> of the B.Sc. in Textile Engineering program under the Department of{' '}
                    <strong>{departmentTitle}</strong> for the academic session 2024–2028. This certificate is issued upon his/her request for industrial placement, passport application, or educational stipend verification.
                  </p>
                )}

                {certType === 'CLEARANCE' && (
                  <p>
                    This is to verify that student <strong>{selectedMember.name}</strong> (Roll ID:{' '}
                    <strong className="font-mono">{selectedMember.rollOrEmpId}</strong>, Department of{' '}
                    <strong>{departmentTitle}</strong>) has cleared all outstanding financial dues, tuition fees, library book deposits, and laboratory equipment usages up to the current semester. No liabilities remain against his/her academic account.
                  </p>
                )}
              </div>

              {/* Signatures Row */}
              <div className="pt-10 flex justify-between items-end text-center font-sans text-xs border-t border-slate-200">
                <div className="space-y-1">
                  <div className="font-bold text-slate-800 underline decoration-slate-400">Engr. Department Head</div>
                  <div className="text-[10px] text-slate-500">Dept. of {departmentTitle}</div>
                </div>
                <div className="w-20 h-20 border-2 border-dashed border-emerald-700/40 rounded-full flex items-center justify-center text-[9px] text-emerald-800 font-black tracking-widest text-center uppercase p-1">
                  OFFICIAL SEAL RTI
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 underline decoration-slate-400">Prof. Dr. M. A. Jalil</div>
                  <div className="text-[10px] text-slate-600 font-semibold">Director General, Rangpur Textile Institute</div>
                </div>
              </div>
            </div>

            {/* Print / Download Button */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOfficialCertificate(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Document / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <span>Add New {addType === 'Student' ? 'Student' : 'Teacher / Faculty'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Department Selection *</label>
                <select
                  required
                  value={formDeptKey}
                  onChange={e => setFormDeptKey(e.target.value as DepartmentType)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-white text-xs"
                >
                  <option value="wet_processing">Wet Processing</option>
                  <option value="yarn_mfg">Yarn Manufacturing</option>
                  <option value="fabric_mfg">Fabric Manufacturing</option>
                  <option value="apparel_mfg">Apparel Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder={addType === 'Student' ? 'e.g. Tanvir Hasan' : 'e.g. Prof. Jahangir Alam'}
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              {/* Profile Photo Upload */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block text-slate-700 font-bold">Profile Photo (Upload Picture)</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-300 text-purple-700 font-bold text-xs flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formPhotoUrl ? (
                      <img src={formPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>📷</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddPhotoFile}
                      className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-purple-100 file:text-purple-800 hover:file:bg-purple-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste photo URL..."
                      value={formPhotoUrl}
                      onChange={e => setFormPhotoUrl(e.target.value)}
                      className="w-full p-1 bg-white border border-slate-300 rounded-lg text-[10px] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Roll / ID *</label>
                  <input
                    type="text"
                    value={formRollId}
                    onChange={e => setFormRollId(e.target.value)}
                    placeholder={addType === 'Student' ? 'e.g. 501245' : 'e.g. FAC-201'}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {addType === 'Student' ? 'Batch / Session' : 'Designation'}
                  </label>
                  <input
                    type="text"
                    value={formBatchOrDesignation}
                    onChange={e => setFormBatchOrDesignation(e.target.value)}
                    placeholder={addType === 'Student' ? 'e.g. Session 2026-27' : 'e.g. Lecturer'}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender / Safety</label>
                  <select
                    value={formGender}
                    onChange={e => setFormGender(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female (Protected)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="official@rti.edu.bd"
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {addType === 'Student' ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                      <select
                        value={formBloodGroup}
                        onChange={e => setFormBloodGroup(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Academic Semester</label>
                      <input
                        type="text"
                        value={formSemester}
                        onChange={e => setFormSemester(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Guardian Name</label>
                      <input
                        type="text"
                        value={formGuardianName}
                        onChange={e => setFormGuardianName(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Guardian Phone</label>
                      <input
                        type="text"
                        value={formGuardianPhone}
                        onChange={e => setFormGuardianPhone(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Career Placement & Internship Section for Student/Alumni */}
                  <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2.5">
                    <div className="text-[11px] font-bold text-purple-900 flex items-center space-x-1">
                      <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                      <span>Career Placement & Industrial Internship (Optional / Editable)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">Placement Status</label>
                        <select
                          value={formCurrentPlacement}
                          onChange={e => setFormCurrentPlacement(e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="In Academic Studies">In Academic Studies</option>
                          <option value="Employed / Industry Placed">Employed / Industry Placed</option>
                          <option value="Seeking Placement">Seeking Placement</option>
                          <option value="Higher Studies">Higher Studies</option>
                          <option value="Alumni Entrepreneur">Alumni Entrepreneur</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">Job Designation</label>
                        <input
                          type="text"
                          placeholder="e.g. Assistant Merchandiser"
                          value={formJobDesignation}
                          onChange={e => setFormJobDesignation(e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">Job Location / Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Beximco Textiles (Gazipur) or Square (Dhaka)"
                        value={formJobLocation}
                        onChange={e => setFormJobLocation(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-purple-100">
                      <div>
                        <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">Internship Status</label>
                        <select
                          value={formInternshipStatus}
                          onChange={e => setFormInternshipStatus(e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                          <option value="Seeking Placement">Seeking Placement</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">Internship Mill / Factory</label>
                        <input
                          type="text"
                          placeholder="e.g. Ha-Meem Group"
                          value={formInternshipCompany}
                          onChange={e => setFormInternshipCompany(e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">Duration / Batch</label>
                        <input
                          type="text"
                          placeholder="e.g. 3 Months (Spring 2026)"
                          value={formInternshipDuration}
                          onChange={e => setFormInternshipDuration(e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Official Office Hours</label>
                    <input
                      type="text"
                      value={formOfficeHours}
                      onChange={e => setFormOfficeHours(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Assigned Classes (Comma separated)</label>
                    <input
                      type="text"
                      value={formAssignedClasses}
                      onChange={e => setFormAssignedClasses(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/20"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <span>Edit Record: {editingMember.name}</span>
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Roll / Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.rollOrEmpId}
                    onChange={e => setEditingMember({ ...editingMember, rollOrEmpId: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl font-mono text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role *</label>
                  <select
                    value={editingMember.role}
                    onChange={e => setEditingMember({ ...editingMember, role: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department *</label>
                  <select
                    value={editingMember.department}
                    onChange={e => setEditingMember({ ...editingMember, department: e.target.value as DepartmentType })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    <option value="wet_processing">Wet Processing</option>
                    <option value="yarn_mfg">Yarn Manufacturing</option>
                    <option value="fabric_mfg">Fabric Manufacturing</option>
                    <option value="apparel_mfg">Apparel Engineering</option>
                  </select>
                </div>
              </div>

              {/* Profile Photo Upload Field */}
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-2xl space-y-2">
                <label className="block text-slate-200 font-bold">Profile Photo (Upload / Update Picture)</label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-200 font-bold text-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                    {editingMember.photoUrl ? (
                      <img src={editingMember.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>📷</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditPhotoFile}
                      className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-900 file:text-purple-200 hover:file:bg-purple-800 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste photo URL..."
                      value={editingMember.photoUrl || ''}
                      onChange={e => setEditingMember({ ...editingMember, photoUrl: e.target.value })}
                      className="w-full p-1.5 bg-slate-950 border border-slate-700 text-white rounded-lg text-[11px] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Batch / Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.batchOrDesignation}
                    onChange={e => setEditingMember({ ...editingMember, batchOrDesignation: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender / Safety</label>
                  <select
                    value={editingMember.gender || (isFemaleStudent(editingMember) ? 'Female' : 'Male')}
                    onChange={e => setEditingMember({ ...editingMember, gender: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female (Protected Contact)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Access Status *</label>
                  <select
                    value={editingMember.accessStatus}
                    onChange={e => setEditingMember({ ...editingMember, accessStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Graduated">Graduated</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingMember.email}
                    onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingMember.phone}
                    onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={editingMember.bloodGroup || ''}
                    onChange={e => setEditingMember({ ...editingMember, bloodGroup: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={editingMember.guardianName || ''}
                    onChange={e => setEditingMember({ ...editingMember, guardianName: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Guardian Phone</label>
                  <input
                    type="text"
                    value={editingMember.guardianPhone || ''}
                    onChange={e => setEditingMember({ ...editingMember, guardianPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl font-mono text-xs font-bold"
                  />
                </div>
              </div>

              {/* Career Placement & Industrial Internship Section (Editable) */}
              <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-2xl space-y-3">
                <div className="text-purple-300 font-bold flex items-center space-x-1.5 border-b border-slate-800 pb-2">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span>Career Placement & Industrial Internship Details</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Current Placement / Status</label>
                    <select
                      value={editingMember.currentPlacement || 'In Academic Studies'}
                      onChange={e => setEditingMember({ ...editingMember, currentPlacement: e.target.value })}
                      className="w-full p-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs font-bold"
                    >
                      <option value="In Academic Studies">In Academic Studies</option>
                      <option value="Employed / Industry Placed">Employed / Industry Placed</option>
                      <option value="Seeking Placement">Seeking Placement</option>
                      <option value="Higher Studies">Higher Studies</option>
                      <option value="Alumni Entrepreneur">Alumni Entrepreneur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Job Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Assistant Production Manager / Merchandiser"
                      value={editingMember.jobDesignation || ''}
                      onChange={e => setEditingMember({ ...editingMember, jobDesignation: e.target.value })}
                      className="w-full p-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Job Location / Mill / Factory Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Beximco Textiles (Gazipur) or Square Fashions (Habiganj)"
                    value={editingMember.jobLocation || ''}
                    onChange={e => setEditingMember({ ...editingMember, jobLocation: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Internship Status</label>
                    <select
                      value={editingMember.internshipStatus || 'Not Started'}
                      onChange={e => setEditingMember({ ...editingMember, internshipStatus: e.target.value })}
                      className="w-full p-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs font-bold"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Seeking Placement">Seeking Placement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Internship Mill / Factory</label>
                    <input
                      type="text"
                      placeholder="e.g. Ha-Meem Group Ltd"
                      value={editingMember.internshipCompany || ''}
                      onChange={e => setEditingMember({ ...editingMember, internshipCompany: e.target.value })}
                      className="w-full p-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Duration / Period</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 Months (Spring 2026)"
                      value={editingMember.internshipDuration || ''}
                      onChange={e => setEditingMember({ ...editingMember, internshipDuration: e.target.value })}
                      className="w-full p-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {onDeleteMember && (
                    showDeleteConfirm ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-rose-500">Confirm?</span>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteMember(editingMember.id);
                            setEditingMember(null);
                            setSelectedMember(null);
                            setShowDeleteConfirm(false);
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                        >
                          Yes, Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Record</span>
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(null);
                      setShowDeleteConfirm(false);
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-600/20"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="font-mono font-bold text-base text-white">Bulk Directory Import (CSV / List)</h3>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Paste lines of member data in CSV format below. Each line corresponds to one record:
              <br />
              <span className="font-mono text-[11px] text-purple-300">Full Name, RollOrEmpID, Role(Student/Faculty), Department, BatchOrDesignation, Email, Phone, BloodGroup</span>
            </p>

            <div className="flex items-center space-x-3 text-xs">
              <label className="font-bold text-slate-300">Default Role:</label>
              <select
                value={bulkDefaultRole}
                onChange={e => setBulkDefaultRole(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="Student">Student</option>
                <option value="Faculty">Teacher / Faculty</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setBulkCsvText(
                    `Tanvir Ahmed, RTI-STU-1001, Student, wet_processing, Batch 51 (Textile Eng), tanvir@rti.edu.bd, +880 1711-123456, B+\n` +
                    `Dr. Sharmin Akter, RTI-FAC-2001, Faculty, wet_processing, Associate Professor, sharmin@rti.edu.bd, +880 1819-654321, A+\n` +
                    `Mahmud Hasan, RTI-STU-1002, Student, yarn_mfg, Batch 52 (Yarn Spun), mahmud@rti.edu.bd, +880 1912-887766, O+`
                  );
                }}
                className="ml-auto px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800/60 font-bold text-[11px]"
              >
                ⚡ Insert Sample Template
              </button>
            </div>

            <form onSubmit={handleBulkImportSubmit} className="space-y-4">
              <textarea
                rows={7}
                value={bulkCsvText}
                onChange={e => setBulkCsvText(e.target.value)}
                placeholder="Tanvir Ahmed, RTI-STU-1001, Student, wet_processing, Batch 51, tanvir@rti.edu.bd, +880 1711-000000, O+&#10;Dr. Sharmin Akter, RTI-FAC-2001, Faculty, wet_processing, Associate Professor, sharmin@rti.edu.bd, +880 1819-000000, A+"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-white focus:ring-2 focus:ring-purple-500 placeholder-slate-600"
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">
                  {bulkCsvText.trim() ? `${bulkCsvText.trim().split('\n').length} line(s) detected` : 'Ready to import'}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/30"
                  >
                    Import All Members
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
