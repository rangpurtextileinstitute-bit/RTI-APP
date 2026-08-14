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
  Droplet,
  Briefcase,
  Layers,
  LogOut,
  LogIn,
  Mail,
  Key,
  Lock,
  Edit3,
  X,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMasterAdmin: boolean;
  setIsMasterAdmin: (val: boolean) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  activeGateCount: number;
  onRegisterMember?: (member: import('../types').RegisteredMember) => void;
  // Dynamic Admin & Auth Props
  designatedAdminEmail?: string;
  onUpdateAdminEmail?: (newEmail: string) => void;
  adminSecurityPin?: string;
  onUpdateAdminPin?: (newPin: string) => void;
  onSetupAdminCredentials?: (email: string, pin: string) => { success: boolean; message: string };
  currentUser?: { email: string | null; name: string; role: string; isLoggedIn: boolean };
  onLogin?: (email: string, claimAsAdmin?: boolean, pin?: string) => { success: boolean; message: string };
  onLogout?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
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
  designatedAdminEmail = '',
  onUpdateAdminEmail = (_newEmail: string) => {},
  adminSecurityPin = '',
  onUpdateAdminPin = (_newPin: string) => {},
  onSetupAdminCredentials = (_email: string, _pin: string) => ({ success: false, message: '' }),
  currentUser = { email: null, name: 'Guest Visitor', role: 'Student', isLoggedIn: false },
  onLogin = (_email: string, _claimAsAdmin?: boolean, _pin?: string) => ({ success: false, message: '' }),
  onLogout = () => {},
  theme = 'dark',
  onToggleTheme = () => {}
}) => {
  // Google Auth & Admin Verification State (Default: false - hidden until user clicks Sign In)
  const [showGoogleModal, setShowGoogleModal] = React.useState(false);
  const [googleEmail, setGoogleEmail] = React.useState(currentUser?.email || designatedAdminEmail || '');
  const [adminPinInput, setAdminPinInput] = React.useState('');
  const [newAdminEmailInput, setNewAdminEmailInput] = React.useState('');
  const [newAdminPinSetting, setNewAdminPinSetting] = React.useState('');

  // Setup mode state for first-time or re-configuration
  const [isSetupMode, setIsSetupMode] = React.useState(false);
  const [setupEmailInput, setSetupEmailInput] = React.useState('');
  const [setupPinInput, setSetupPinInput] = React.useState('');
  const [setupPinConfirmInput, setSetupPinConfirmInput] = React.useState('');

  // Sync googleEmail when currentUser or designatedAdminEmail changes
  React.useEffect(() => {
    if (currentUser?.email) {
      setGoogleEmail(currentUser.email);
    } else if (designatedAdminEmail) {
      setGoogleEmail(designatedAdminEmail);
    }
  }, [currentUser?.email, designatedAdminEmail]);

  // Auth Toast Notification State
  const [authNotification, setAuthNotification] = React.useState<{ type: 'SUCCESS' | 'WARNING' | 'INFO'; msg: string } | null>(null);

  // Mobile navigation drawer toggle
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

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

  const handleSignInAsUser = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!designatedAdminEmail) {
      setIsSetupMode(true);
      setAuthNotification({
        type: 'INFO',
        msg: '⚙️ Main Admin account is not yet configured. Please set your Admin Gmail and Password below.'
      });
      return;
    }

    const cleanEmail = googleEmail.trim().toLowerCase();
    
    if (cleanEmail !== designatedAdminEmail.trim().toLowerCase()) {
      setAuthNotification({
        type: 'WARNING',
        msg: `⛔ Authorization Denied: Main Admin Login strictly requires the configured admin email (${designatedAdminEmail}).`
      });
      return;
    }

    if (!adminPinInput.trim()) {
      setAuthNotification({
        type: 'WARNING',
        msg: '🔒 Admin Security Password is required to log in as Main Admin!'
      });
      return;
    }

    const res = onLogin(designatedAdminEmail, false, adminPinInput);
    if (res.success) {
      setShowGoogleModal(false);
      setAdminPinInput('');
      setAuthNotification({
        type: 'SUCCESS',
        msg: res.message
      });
    } else {
      setAuthNotification({
        type: 'WARNING',
        msg: res.message
      });
    }
  };

  const handleSaveAdminSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = setupEmailInput.trim().toLowerCase();
    const cleanPin = setupPinInput.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      alert('Please enter a valid Gmail address.');
      return;
    }
    if (!cleanPin || cleanPin.length < 4) {
      alert('Admin Security Password must be at least 4 characters long.');
      return;
    }
    if (cleanPin !== setupPinConfirmInput.trim()) {
      alert('Security Passwords do not match! Please verify.');
      return;
    }

    const res = onSetupAdminCredentials(cleanEmail, cleanPin);
    console.log('Admin Setup Result:', res);
    if (res.success) {
      setShowGoogleModal(false);
      setIsSetupMode(false);
      setSetupEmailInput('');
      setSetupPinInput('');
      setSetupPinConfirmInput('');
      setAuthNotification({
        type: 'SUCCESS',
        msg: res.message
      });
    } else {
      alert(res.message || 'Failed to save admin credentials. Please try again.');
    }
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
    <>
      <header className="bg-slate-900 border-b border-indigo-900/60 text-white sticky top-0 z-40 shadow-xl backdrop-blur-md">
        {/* Top Utility & Institute Branding Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer min-w-0" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-purple-500/20 flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-300 text-base sm:text-lg">
                RTI
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
              <h1 className="text-xs sm:text-base md:text-lg font-black tracking-wide text-white font-mono truncate">
                Rangpur Textile Institute
              </h1>
              <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-purple-500/20 text-purple-300 rounded border border-purple-500/30 whitespace-nowrap">
                RTI OS v5.0
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-purple-200/80 font-medium truncate hidden xs:block sm:block">
              Central Academic, Directory & Attendance Management
            </p>
          </div>
        </div>

        {/* User Session, Admin Controls & Mobile Menu Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Public Self-Registration / Sign Up Button */}
          <button
            onClick={handleOpenSelfReg}
            className="px-2.5 sm:px-3.5 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-white border border-purple-400/50 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all flex items-center space-x-1 sm:space-x-1.5 shadow-sm shadow-purple-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden sm:inline">Sign Up / Register</span>
            <span className="sm:hidden">Register</span>
          </button>

          {/* User Session Status & Log Out Button */}
          {currentUser.isLoggedIn ? (
            <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-950/90 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="font-mono text-slate-200 text-[10px] sm:text-[11px] font-bold truncate max-w-[90px] sm:max-w-[150px]" title={currentUser.email || ''}>
                {currentUser.email}
              </span>
              {isMasterAdmin && (
                <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold uppercase bg-purple-500/30 text-purple-200 border border-purple-400/30 hidden md:inline">
                  MAIN ADMIN
                </span>
              )}
              <button
                onClick={() => {
                  onLogout();
                  setAuthNotification({
                    type: 'INFO',
                    msg: 'Logged out successfully.'
                  });
                }}
                className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-bold transition-all flex items-center space-x-1 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[9px] sm:text-[10px] font-extrabold hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowGoogleModal(true)}
              className="px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[11px] sm:text-xs font-extrabold transition-all flex items-center space-x-1 sm:space-x-1.5 shadow-sm cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-200" />
              <span>Log In</span>
            </button>
          )}

          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-950/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-800 transition-all shadow-xs flex items-center justify-center cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300" />
            )}
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 text-purple-200 border border-purple-700/60 transition-all flex items-center justify-center cursor-pointer"
            title="Toggle Navigation Menu"
            aria-label="Toggle Menu"
          >
            {mobileNavOpen ? (
              <X className="w-4 h-4 text-white" />
            ) : (
              <Menu className="w-4 h-4 text-purple-300" />
            )}
          </button>
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
              className="ml-3 text-slate-400 hover:text-white font-black text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Responsive Tab Bar with Touch Horizontal Scrolling */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-2 sm:px-6 lg:px-8 py-1.5 sm:py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Scrollable Navigation Tabs (Touch-Friendly on Phone & Tablet) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto scrollbar-none py-0.5 w-full md:w-auto scroll-smooth">
            {/* Tab 1: Home */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileNavOpen(false);
              }}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-white border-purple-400 shadow-md shadow-purple-600/30 ring-1 ring-white/20'
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white border-slate-700/80'
              }`}
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
              <span>Home</span>
            </button>

            {/* Tab 2: Students Directory */}
            <button
              onClick={() => {
                setActiveTab('students_directory');
                setMobileNavOpen(false);
              }}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                activeTab === 'students_directory'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white border-slate-700/80'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-300" />
              <span>Students Directory</span>
            </button>

            {/* Tab 3: Faculty Directory */}
            <button
              onClick={() => {
                setActiveTab('faculty_directory');
                setMobileNavOpen(false);
              }}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                activeTab === 'faculty_directory'
                  ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white border-violet-400 shadow-md shadow-violet-600/30 ring-1 ring-white/20'
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white border-slate-700/80'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
              <span>Faculty Directory</span>
            </button>

            {/* Tab 4: Notice Board */}
            <button
              onClick={() => {
                setActiveTab('notices_attendance');
                setMobileNavOpen(false);
              }}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                activeTab === 'notices_attendance' || activeTab === 'notices_events' || activeTab === 'qr_gate' || activeTab === 'dept_attendance'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30 ring-1 ring-white/20'
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white border-slate-700/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
              <span>Notice Board</span>
            </button>

            {/* Tab 5: RTI Blood Donation Club / Blood Bank */}
            <button
              onClick={() => {
                setActiveTab('blood_donors');
                setMobileNavOpen(false);
              }}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                activeTab === 'blood_donors' || activeTab === 'blood_bank' || activeTab === 'red_crescent'
                  ? 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white border-rose-400 shadow-md shadow-rose-600/30 ring-1 ring-white/20'
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white border-slate-700/80'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 fill-rose-400" />
              <span>Blood Donors</span>
            </button>
          </div>

          {/* Admin Console Quick Button (Only when verified) */}
          {isMasterAdmin && (
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('admin_console')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  activeTab === 'admin_console' || activeTab === 'audit_logs'
                    ? 'bg-purple-700 text-white border-purple-400 shadow-md shadow-purple-600/30'
                    : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900 border-purple-700/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>Admin Console</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-purple-500/30 rounded uppercase font-mono">Master</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileNavOpen && (
          <div className="md:hidden mt-2 pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5 pb-2 animate-fadeIn">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileNavOpen(false);
              }}
              className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800"
            >
              <Home className="w-3.5 h-3.5 text-sky-400" />
              <span>Dashboard Home</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('students_directory');
                setMobileNavOpen(false);
              }}
              className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Students Directory</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('faculty_directory');
                setMobileNavOpen(false);
              }}
              className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800"
            >
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              <span>Faculty Directory</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('notices_attendance');
                setMobileNavOpen(false);
              }}
              className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notice Board</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('blood_donors');
                setMobileNavOpen(false);
              }}
              className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800"
            >
              <Droplet className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Blood Donation</span>
            </button>
            {isMasterAdmin ? (
              <button
                onClick={() => {
                  setActiveTab('admin_console');
                  setMobileNavOpen(false);
                }}
                className="flex items-center space-x-2 p-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold border border-purple-600/50"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin Console</span>
              </button>
            ) : null}
          </div>
        )}
      </div>
      </header>

      {/* GOOGLE GMAIL ADMIN OAUTH & CLAIM MODAL */}
      {showGoogleModal && (
        <div 
          onClick={() => {
            setShowGoogleModal(false);
            setIsSetupMode(false);
          }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-700/80 space-y-4 sm:space-y-5 relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-400/50 flex items-center justify-center font-bold text-purple-400 font-mono text-base">
                  RTI
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">System Sign In & Access Control</h3>
                  <p className="text-[11px] text-slate-400">Main Admin Login or Student Quick Access</p>
                </div>
              </div>
              <button
                type="button"
                id="close-admin-auth-modal-btn"
                onClick={() => {
                  setShowGoogleModal(false);
                  setIsSetupMode(false);
                }}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center font-bold text-sm transition-all cursor-pointer shadow-md"
                title="Close setup modal"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-purple-950/60 border border-purple-500/40 rounded-2xl text-purple-200 space-y-1.5 text-xs">
              <div className="font-bold text-white flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Main Admin Account Status</span>
                </span>
                <span className="font-mono text-[11px] text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                  {designatedAdminEmail || 'Not Configured (Setup Required)'}
                </span>
              </div>
              <p className="text-[11px] text-purple-200/90 leading-relaxed">
                {designatedAdminEmail
                  ? `Only ${designatedAdminEmail} with valid Admin Password can access Master Controls.`
                  : 'No Main Admin has been set up yet. Use the setup form below to configure the Main Admin Gmail and Password.'}
              </p>
            </div>

            {(!designatedAdminEmail || isSetupMode) ? (
              <form onSubmit={handleSaveAdminSetup} className="space-y-4 text-xs">
                <div className="p-3 bg-indigo-950/50 border border-indigo-500/40 rounded-2xl space-y-1 text-indigo-200">
                  <h4 className="font-extrabold text-white text-xs flex items-center space-x-1.5">
                    <Key className="w-4 h-4 text-amber-300" />
                    <span>Initial Main Admin Setup</span>
                  </h4>
                  <p className="text-[11px]">Set the official Admin Gmail address and Master Password for RTI Management System.</p>
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1">New Main Admin Gmail Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={setupEmailInput}
                      onChange={(e) => setSetupEmailInput(e.target.value)}
                      placeholder="e.g. admin.rti@gmail.com"
                      className="w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-200 font-bold mb-1">Admin Password *</label>
                    <input
                      type="password"
                      required
                      value={setupPinInput}
                      onChange={(e) => setSetupPinInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-amber-500/50 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-200 font-bold mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={setupPinConfirmInput}
                      onChange={(e) => setSetupPinConfirmInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-amber-500/50 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSetupMode(false);
                      setShowGoogleModal(false);
                    }}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl text-xs border border-slate-700 transition-colors"
                  >
                    Cancel & Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-transform active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Save Main Admin Credentials</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignInAsUser} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-200 font-bold">Official Main Admin Gmail Address *</label>
                    <button
                      type="button"
                      onClick={() => setIsSetupMode(true)}
                      className="text-[10px] text-purple-400 hover:text-purple-300 font-bold underline"
                    >
                      Re-configure Admin Email
                    </button>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder={designatedAdminEmail}
                      className="w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-amber-200 font-bold flex items-center space-x-1.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Admin Security Password *</span>
                    </label>
                  </div>
                  <input
                    type="password"
                    required
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-amber-500/50 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(false)}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl text-xs border border-slate-700 transition-colors"
                  >
                    Cancel & Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-transform active:scale-95 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-amber-300" />
                    <span>Log In as Main Admin</span>
                  </button>
                </div>

                <div className="text-center pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoogleModal(false);
                      handleOpenSelfReg();
                    }}
                    className="text-purple-400 hover:text-purple-300 font-bold text-xs underline underline-offset-4"
                  >
                    Student, Teacher or Staff? Click here for Department Sign Up →
                  </button>
                </div>
              </form>
            )}

            {/* If logged in as Admin, allow changing Admin Security PIN */}
            {isMasterAdmin && (
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>Update Main Admin Security PIN</span>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newAdminPinSetting.trim()) return;
                  onUpdateAdminPin(newAdminPinSetting.trim());
                  setNewAdminPinSetting('');
                  setAuthNotification({
                    type: 'SUCCESS',
                    msg: 'Admin Security PIN updated successfully!'
                  });
                }} className="flex gap-2">
                  <input
                    type="password"
                    required
                    value={newAdminPinSetting}
                    onChange={(e) => setNewAdminPinSetting(e.target.value)}
                    placeholder="New Security PIN..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow"
                  >
                    Update PIN
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PUBLIC SELF REGISTRATION / GENERAL USER SIGNUP MODAL */}
      {showSelfRegModal && (
        <div 
          onClick={() => setShowSelfRegModal(false)}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-700/80 space-y-4 relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                <h3 className="font-extrabold text-base text-white">General User Signup & Self-Registration</h3>
              </div>
              <button
                type="button"
                id="close-self-reg-modal-btn"
                onClick={() => setShowSelfRegModal(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center font-bold text-sm transition-all cursor-pointer shadow-md"
                title="Close registration modal"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
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
                  <label className="block text-slate-200 font-bold mb-1">
                    {regForm.role === 'Student' ? 'Academic Session / Batch *' : 'Designation *'}
                  </label>
                  {regForm.role === 'Student' ? (
                    <select
                      value={regForm.batchOrDesignation || 'Session 2022-23'}
                      onChange={(e) => setRegForm({ ...regForm, batchOrDesignation: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="Session 2020-21">Session 2020-21</option>
                      <option value="Session 2021-22">Session 2021-22</option>
                      <option value="Session 2022-23">Session 2022-23</option>
                      <option value="Session 2023-24">Session 2023-24</option>
                      <option value="Session 2024-25">Session 2024-25</option>
                      <option value="Session 2025-26">Session 2025-26</option>
                      <option value="Session 2026-27">Session 2026-27</option>
                      <option value="Session 2027-28">Session 2027-28</option>
                      <option value="Session 2028-29">Session 2028-29</option>
                      <option value="Session 2029-30">Session 2029-30</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={regForm.batchOrDesignation}
                      onChange={(e) => setRegForm({ ...regForm, batchOrDesignation: e.target.value })}
                      placeholder="e.g. Assistant Professor / Lecturer"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="+880 1711-000000"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1">
                    {regForm.role === 'Student' ? 'Guardian Mobile (SMS Alerts) *' : 'Emergency Contact'}
                  </label>
                  <input
                    type="tel"
                    required={regForm.role === 'Student'}
                    value={regForm.guardianPhone}
                    onChange={(e) => setRegForm({ ...regForm, guardianPhone: e.target.value })}
                    placeholder="+880 1700-000000"
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
    </>
  );
};

