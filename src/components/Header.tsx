import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  QrCode, 
  FlaskConical, 
  Boxes, 
  Grid, 
  Scissors, 
  BarChart3,
  Users,
  Sparkles,
  FileText,
  Bot,
  Shield,
  FileCheck,
  GraduationCap,
  Building,
  UserCheck,
  Video,
  Home,
  Heart,
  Briefcase,
  Layers,
  LogOut,
  LogIn,
  Mail,
  Key,
  Lock,
  Edit3
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMasterAdmin: boolean;
  setIsMasterAdmin: (val: boolean) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  activeGateCount: number;
  onRegisterMember?: (member: any) => void;
  // Dynamic Admin & Auth Props
  designatedAdminEmail?: string;
  onUpdateAdminEmail?: (newEmail: string) => void;
  currentUser?: { email: string | null; name: string; role: string; isLoggedIn: boolean };
  onLogin?: (email: string, claimAsAdmin?: boolean) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMasterAdmin,
  setIsMasterAdmin,
  activeRole,
  setActiveRole,
  activeGateCount,
  onRegisterMember,
  designatedAdminEmail = 'dhdrt581@gmail.com',
  onUpdateAdminEmail = (_newEmail: string) => {},
  currentUser = { email: 'dhdrt581@gmail.com', name: 'Main Admin', role: 'Super Admin', isLoggedIn: true },
  onLogin = (_email: string, _claimAsAdmin?: boolean) => {},
  onLogout = () => {}
}) => {
  // Google Auth & Admin Verification State
  const [showGoogleModal, setShowGoogleModal] = React.useState(false);
  const [googleEmail, setGoogleEmail] = React.useState(currentUser?.email || designatedAdminEmail);
  const [newAdminEmailInput, setNewAdminEmailInput] = React.useState('');

  // Sync googleEmail when currentUser changes
  React.useEffect(() => {
    if (currentUser?.email) {
      setGoogleEmail(currentUser.email);
    }
  }, [currentUser?.email]);

  // Auth Toast Notification State
  const [authNotification, setAuthNotification] = React.useState<{ type: 'SUCCESS' | 'WARNING' | 'INFO'; msg: string } | null>(null);

  // Self Registration State
  const [showSelfRegModal, setShowSelfRegModal] = React.useState(false);
  const [regForm, setRegForm] = React.useState({
    name: '',
    role: 'Student' as 'Student' | 'Faculty' | 'Staff',
    department: 'wet_processing',
    rollOrEmpId: '',
    batchOrDesignation: '',
    email: '',
    phone: '',
    bloodGroup: 'B+',
    semester: '1st Semester',
    guardianName: '',
    guardianPhone: '',
    photoUrl: ''
  });

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRegForm(prev => ({ ...prev, photoUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenSelfReg = () => {
    const isDept = ['wet_processing', 'yarn_mfg', 'fabric_mfg', 'apparel_mfg'].includes(activeTab);
    const defaultDept = isDept ? activeTab : 'wet_processing';
    setRegForm(prev => ({ ...prev, department: defaultDept }));
    setShowSelfRegModal(true);
  };

  const handleSignInAsUser = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      alert('Please enter a valid Gmail address.');
      return;
    }
    onLogin(cleanEmail, false);
    setShowGoogleModal(false);
    
    if (cleanEmail === designatedAdminEmail.trim().toLowerCase()) {
      setAuthNotification({
        type: 'SUCCESS',
        msg: `Main Admin Login Successful for '${cleanEmail}'! Full Master Control enabled.`
      });
    } else {
      setAuthNotification({
        type: 'INFO',
        msg: `Signed in as Regular User '${cleanEmail}'. Master Admin features are locked to designated admin (${designatedAdminEmail}).`
      });
    }
  };

  const handleClaimAdmin = () => {
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      alert('Please enter a valid Gmail address to claim as Main Admin.');
      return;
    }
    onLogin(cleanEmail, true);
    setShowGoogleModal(false);
    setAuthNotification({
      type: 'SUCCESS',
      msg: `👑 '${cleanEmail}' has claimed and registered as the new Main Admin! Master Control unlocked.`
    });
  };

  const handleUpdateDesignatedAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newAdminEmailInput.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      alert('Please enter a valid Gmail address.');
      return;
    }
    onUpdateAdminEmail(clean);
    setNewAdminEmailInput('');
    setAuthNotification({
      type: 'SUCCESS',
      msg: `Designated Main Admin Gmail address updated to '${clean}'.`
    });
  };

  const handleToggleMasterAdmin = () => {
    if (!isMasterAdmin) {
      if (currentUser.isLoggedIn && currentUser.email?.toLowerCase() === designatedAdminEmail.toLowerCase()) {
        setIsMasterAdmin(true);
        setActiveRole('Super Admin');
        setAuthNotification({
          type: 'SUCCESS',
          msg: `Master Control Override Enabled for ${currentUser.email}.`
        });
      } else {
        setAuthNotification({
          type: 'WARNING',
          msg: `Master Admin access requires logging in as or claiming Main Admin (${designatedAdminEmail}). Please authenticate below.`
        });
        setShowGoogleModal(true);
      }
    } else {
      setIsMasterAdmin(false);
      setActiveRole('Student');
      setAuthNotification({
        type: 'INFO',
        msg: 'Master Control disabled. Switched to Standard User Mode.'
      });
    }
  };

  const handleSelfRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone) {
      alert('Please enter your full name and phone number.');
      return;
    }
    if (!regForm.photoUrl) {
      alert('⚠️ Mandatory Field Required: Profile photo upload is compulsory for all registrations (Student, Teacher, Staff, Lab Users). Please upload a picture before completing registration.');
      return;
    }
    const newMember = {
      id: `mem-self-${Date.now()}`,
      rollOrEmpId: regForm.rollOrEmpId || `RTI-${regForm.department.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: regForm.name,
      role: regForm.role,
      staffCategory: regForm.role === 'Student' ? 'Student' : regForm.role === 'Faculty' ? 'Teacher' : 'Office Staff',
      department: regForm.department,
      batchOrDesignation: regForm.batchOrDesignation || (regForm.role === 'Student' ? 'Batch 51' : 'Lecturer'),
      email: regForm.email || `${regForm.name.toLowerCase().replace(/\s+/g, '.')}@rangpurtextile.edu.bd`,
      phone: regForm.phone,
      photoUrl: regForm.photoUrl,
      qrCodeData: `RTI:MEMBER:${regForm.rollOrEmpId || 'TEMP'}:${regForm.name.replace(/\s+/g, '')}:${regForm.role}`,
      accessStatus: 'Active' as const,
      lastSeen: 'Just Registered',
      bloodGroup: regForm.bloodGroup,
      semester: regForm.role === 'Student' ? regForm.semester : undefined,
      guardianName: regForm.role === 'Student' ? regForm.guardianName : undefined,
      guardianPhone: regForm.role === 'Student' ? regForm.guardianPhone : undefined
    };

    if (onRegisterMember) {
      onRegisterMember(newMember);
    }
    
    // Auto login newly registered member
    onLogin(newMember.email, false);
    setIsMasterAdmin(false);
    setActiveRole(regForm.role);
    setShowSelfRegModal(false);
    setAuthNotification({
      type: 'SUCCESS',
      msg: `Self-Registration Complete! Registered ${regForm.name} as ${regForm.role} under ${regForm.department.replace('_', ' ').toUpperCase()} Department.`
    });
  };

  return (
    <header className="bg-slate-900 border-b border-indigo-900/60 text-white sticky top-0 z-40 shadow-xl backdrop-blur-md">
      {/* Top Utility & Institute Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-300 text-lg">
                RTI
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-wider text-white font-mono">
                RANGPUR TEXTILE
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                RTI OS v5.0
              </span>
            </div>
            <p className="text-xs text-purple-200/80 font-medium">
              Rangpur Textile Institute Management System
            </p>
          </div>
        </div>

        {/* Role-Based Selector, Google Auth & Master Admin Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Public Self-Registration / Sign Up Button */}
          <button
            onClick={handleOpenSelfReg}
            className="px-3.5 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-white border border-purple-400/50 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 shadow-sm shadow-purple-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" />
            <span>Sign Up / Register</span>
          </button>

          {/* User Session Status & Log Out Button */}
          {currentUser.isLoggedIn ? (
            <div className="flex items-center space-x-2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="font-mono text-slate-200 text-[11px] font-bold truncate max-w-[150px]" title={currentUser.email || ''}>
                {currentUser.email}
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                isMasterAdmin ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30' : 'bg-slate-800 text-slate-300'
              }`}>
                {isMasterAdmin ? 'ADMIN' : 'USER'}
              </span>
              <button
                onClick={() => {
                  onLogout();
                  setAuthNotification({
                    type: 'INFO',
                    msg: 'Logged out successfully. Switched to Guest / Student mode.'
                  });
                }}
                className="ml-1 px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-bold transition-all flex items-center space-x-1"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[10px] font-extrabold">Log Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowGoogleModal(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-200" />
              <span>Sign In / Claim Admin</span>
            </button>
          )}

          {/* Main Admin Setup / Auth Modal Trigger */}
          <button
            onClick={() => setShowGoogleModal(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 border ${
              isMasterAdmin
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
            title="Manage Login & Admin Setup"
          >
            <span className="font-mono text-xs font-black text-blue-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-blue-400/30">G</span>
            <span>{isMasterAdmin ? 'Main Admin Verified' : 'Admin Setup'}</span>
          </button>

          {/* Active Role Selector */}
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300 font-bold hidden sm:inline">Role:</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="bg-transparent font-bold text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="Super Admin" className="bg-slate-900 text-white">Super Admin</option>
              <option value="Dept Admin" className="bg-slate-900 text-white">Dept Admin</option>
              <option value="Teacher" className="bg-slate-900 text-white">Teacher / Faculty</option>
              <option value="Student" className="bg-slate-900 text-white">Student</option>
              <option value="Guardian" className="bg-slate-900 text-white">Guardian</option>
              <option value="Staff" className="bg-slate-900 text-white">Staff Officer</option>
              <option value="Security" className="bg-slate-900 text-white">Gate Security</option>
            </select>
          </div>

          {/* Master Admin Switch */}
          <div className={`p-1.5 rounded-2xl transition-all duration-300 flex items-center space-x-3 border ${
            isMasterAdmin 
              ? 'bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 border-purple-500/50 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30' 
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div className="flex items-center space-x-2 pl-2">
              {isMasterAdmin ? (
                <ShieldCheck className="w-5 h-5 text-purple-400 animate-bounce" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-slate-400" />
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-slate-100 flex items-center space-x-1">
                  <span>Master Control</span>
                  {isMasterAdmin && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-purple-500 text-white font-extrabold rounded-full uppercase tracking-wider">
                      FULL
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isMasterAdmin ? 'Full Override Active' : 'Standard Access'}
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggleMasterAdmin}
              type="button"
              id="master-admin-switch-btn"
              aria-label="Toggle Master Admin Mode"
              className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                isMasterAdmin ? 'bg-purple-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isMasterAdmin ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Toast Notification Banner */}
      {authNotification && (
        <div className={`px-4 py-2 text-xs font-bold flex items-center justify-between border-b ${
          authNotification.type === 'SUCCESS'
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/60'
            : authNotification.type === 'WARNING'
            ? 'bg-amber-950/90 text-amber-200 border-amber-700/60'
            : 'bg-indigo-950/90 text-indigo-200 border-indigo-700/60'
        }`}>
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{authNotification.msg}</span>
            </div>
            <button
              onClick={() => setAuthNotification(null)}
              className="ml-3 text-slate-400 hover:text-white font-black text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Core Navigation Bar */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto space-y-2">
          {/* Core Menu Navigation Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 border-b border-slate-800/60">
            {/* 1. Home (Overview Dashboard) */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-white border-purple-400 shadow-md shadow-purple-600/30 ring-1 ring-white/20'
                  : 'bg-slate-900 text-white hover:bg-slate-800/90 hover:text-white border-slate-700/80'
              }`}
            >
              <Home className="w-4 h-4 text-sky-400" />
              <span className="text-white">Home (Overview)</span>
            </button>

            {/* 2. Admin Console (Master Control & Audit Logs - Admin Restricted) */}
            <button
              onClick={() => setActiveTab('admin_console')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTab === 'admin_console' || activeTab === 'audit_logs'
                  ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white border-purple-400 shadow-md shadow-purple-600/30 ring-1 ring-white/20'
                  : 'bg-slate-900 text-white hover:bg-slate-800/90 hover:text-white border-slate-700/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="text-white">Admin Console</span>
              {isMasterAdmin ? (
                <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded uppercase font-extrabold">Master</span>
              ) : (
                <Lock className="w-3 h-3 text-amber-400" />
              )}
            </button>

            {/* 3. Students Directory */}
            <button
              onClick={() => setActiveTab('students_directory')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTab === 'students_directory'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                  : 'bg-slate-900 text-white hover:bg-slate-800/90 hover:text-white border-slate-700/80'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-sky-300" />
              <span className="text-white">Students Directory</span>
            </button>

            {/* 4. Faculty Directory */}
            <button
              onClick={() => setActiveTab('faculty_directory')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTab === 'faculty_directory'
                  ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white border-violet-400 shadow-md shadow-violet-600/30 ring-1 ring-white/20'
                  : 'bg-slate-900 text-white hover:bg-slate-800/90 hover:text-white border-slate-700/80'
              }`}
            >
              <Briefcase className="w-4 h-4 text-purple-300" />
              <span className="text-white">Faculty Directory</span>
            </button>

            {/* 5. Red Crescent Unit */}
            <button
              onClick={() => setActiveTab('red_crescent')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTab === 'red_crescent'
                  ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white border-rose-400 shadow-md shadow-rose-600/30 ring-1 ring-white/20'
                  : 'bg-slate-900 text-white hover:bg-slate-800/90 hover:text-white border-slate-700/80'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="text-white">Red Crescent Unit</span>
            </button>

            {/* 6. Departments Group Header */}
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300 flex items-center space-x-1 pr-1">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Depts:</span>
              </span>

              <button
                onClick={() => setActiveTab('wet_processing')}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  activeTab === 'wet_processing'
                    ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-600/30 ring-1 ring-white/20'
                    : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-700'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
                <span>Wet Processing</span>
              </button>

              <button
                onClick={() => setActiveTab('yarn_mfg')}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  activeTab === 'yarn_mfg'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30 ring-1 ring-white/20'
                    : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-700'
                }`}
              >
                <Boxes className="w-3.5 h-3.5 text-purple-400" />
                <span>Yarn Mfg</span>
              </button>

              <button
                onClick={() => setActiveTab('fabric_mfg')}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  activeTab === 'fabric_mfg'
                    ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30 ring-1 ring-white/20'
                    : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-700'
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-violet-400" />
                <span>Fabric Mfg</span>
              </button>

              <button
                onClick={() => setActiveTab('apparel_mfg')}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  activeTab === 'apparel_mfg'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                    : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-700'
                }`}
              >
                <Scissors className="w-3.5 h-3.5 text-indigo-400" />
                <span>Apparel Mfg</span>
              </button>
            </div>
          </div>

          {/* Secondary Operational Quick Access Bar */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none pt-0.5">
            <button
              onClick={() => setActiveTab('qr_gate')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                activeTab === 'qr_gate'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                  : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Attendance & Gate Pass</span>
            </button>

            <button
              onClick={() => setActiveTab('notices_events')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                activeTab === 'notices_events'
                  ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                  : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Notice Board</span>
            </button>

            <button
              onClick={() => setActiveTab('guardian_portal')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                activeTab === 'guardian_portal'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                  : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-300" />
              <span>Guardian Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('alumni_network')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                activeTab === 'alumni_network'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                  : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              <span>Alumni Network</span>
            </button>

            <button
              onClick={() => setActiveTab('cctv_surveillance')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                activeTab === 'cctv_surveillance'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                  : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-purple-300" />
              <span>CCTV Feeds</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_assistant')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                activeTab === 'ai_assistant'
                  ? 'bg-violet-600 text-white border-violet-400 shadow-sm'
                  : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Operations Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* GOOGLE GMAIL ADMIN OAUTH & CLAIM MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-700/80 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-400/50 flex items-center justify-center font-bold text-blue-400 font-mono text-base">
                  G
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Google Auth & Admin Access</h3>
                  <p className="text-[11px] text-slate-400">Sign in as User or Claim Main Admin Privileges</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-blue-950/60 border border-blue-500/40 rounded-2xl text-blue-200 space-y-1.5 text-xs">
              <div className="font-bold text-white flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Designated Main Admin Email</span>
                </span>
                <span className="font-mono text-[11px] text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                  {designatedAdminEmail}
                </span>
              </div>
              <p className="text-[11px] text-blue-200/90 leading-relaxed">
                Only the designated Main Admin Gmail account has full access to Master Control, Admin Console, and Data Editing. Any new user can claim or register as Main Admin below.
              </p>
            </div>

            <form onSubmit={handleSignInAsUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-200 font-bold mb-1.5">Enter Gmail Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com or admin@rangpurtextile.edu.bd"
                    className="w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 flex items-center justify-center space-x-1.5"
                >
                  <UserCheck className="w-4 h-4 text-sky-400" />
                  <span>Sign In as User / Student</span>
                </button>

                <button
                  type="button"
                  onClick={handleClaimAdmin}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs shadow-md shadow-purple-600/30 flex items-center justify-center space-x-1.5"
                >
                  <Key className="w-4 h-4 text-amber-300" />
                  <span>Claim / Set as Main Admin</span>
                </button>
              </div>
            </form>

            {/* If logged in as Admin, allow changing designated Admin email dynamically */}
            {isMasterAdmin && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Designated Admin Gmail Dynamically</span>
                </div>
                <form onSubmit={handleUpdateDesignatedAdminSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newAdminEmailInput}
                    onChange={(e) => setNewAdminEmailInput(e.target.value)}
                    placeholder="New admin Gmail..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow"
                  >
                    Update
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PUBLIC SELF REGISTRATION / GENERAL USER SIGNUP MODAL */}
      {showSelfRegModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                <h3 className="font-extrabold text-base text-white">General User Signup & Self-Registration</h3>
              </div>
              <button
                onClick={() => setShowSelfRegModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-purple-950/50 border border-purple-500/30 rounded-2xl text-purple-200 text-xs">
              <span className="font-bold text-white flex items-center space-x-1 mb-1">
                <UserCheck className="w-4 h-4 text-purple-400" />
                <span>Standard Role Access Registration</span>
              </span>
              <p className="text-[11px] text-purple-200/90 leading-relaxed">
                Newly registered accounts receive default student/faculty/staff roles and cannot access Master Admin settings without admin authorization.
              </p>
            </div>

            <form onSubmit={handleSelfRegSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Registration Role *</label>
                  <select
                    value={regForm.role}
                    onChange={(e) => setRegForm({ ...regForm, role: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Student" className="bg-slate-900 text-white">Student Registration</option>
                    <option value="Faculty" className="bg-slate-900 text-white">Teacher / Faculty Registration</option>
                    <option value="Staff" className="bg-slate-900 text-white">Staff Officer Registration</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-200 font-bold">Department *</label>
                    {['wet_processing', 'yarn_mfg', 'fabric_mfg', 'apparel_mfg'].includes(activeTab) && (
                      <span className="text-[10px] text-purple-300 font-extrabold bg-purple-950 px-2 py-0.5 rounded-full border border-purple-500/40">
                        ⚡ Auto-Selected
                      </span>
                    )}
                  </div>
                  <select
                    required
                    value={regForm.department}
                    onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="wet_processing" className="bg-slate-900 text-white">Wet Processing</option>
                    <option value="yarn_mfg" className="bg-slate-900 text-white">Yarn Manufacturing</option>
                    <option value="fabric_mfg" className="bg-slate-900 text-white">Fabric Manufacturing</option>
                    <option value="apparel_mfg" className="bg-slate-900 text-white">Apparel Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="e.g. Md. Tanvir Hossain"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Roll / Employee ID</label>
                  <input
                    type="text"
                    value={regForm.rollOrEmpId}
                    onChange={(e) => setRegForm({ ...regForm, rollOrEmpId: e.target.value })}
                    placeholder="e.g. RTI-WET-9801"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="+880 1711-000000"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="student@rangpurtextile.edu.bd"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              {/* Profile Photo File Upload Field */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-extrabold flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Upload Profile Photo *</span>
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">Compulsory</span>
                </div>

                <div className="flex items-center space-x-3">
                  {regForm.photoUrl ? (
                    <img
                      src={regForm.photoUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500 shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs flex-shrink-0">
                      Photo
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600/30 file:text-purple-300 hover:file:bg-purple-600/50 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSelfRegModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-purple-600/30 flex items-center space-x-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Complete Self Registration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

