import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Sparkles, CheckCircle2, X, Building2, ShieldCheck } from 'lucide-react';
import { Header } from './components/Header';
import { MasterAdminBanner } from './components/MasterAdminBanner';
import { DashboardOverview } from './components/DashboardOverview';
import { WetProcessingDept } from './components/WetProcessingDept';
import { YarnDept } from './components/YarnDept';
import { FabricDept } from './components/FabricDept';
import { ApparelDept } from './components/ApparelDept';
import { QRAttendanceGate } from './components/QRAttendanceGate';
import { MemberRegisterModal } from './components/MemberRegisterModal';
import { AuditLogModal } from './components/AuditLogModal';
import { NoticeAndAttendanceHub } from './components/NoticeAndAttendanceHub';
import { GuardianPortal } from './components/GuardianPortal';
import { NoticeAndEventsBoard } from './components/NoticeAndEventsBoard';
import { AuditLogView } from './components/AuditLogView';
import { AlumniNetwork } from './components/AlumniNetwork';
import { InstituteHub } from './components/InstituteHub';
import { DepartmentMemberDirectory } from './components/DepartmentMemberDirectory';
import { RedCrescentUnitSection } from './components/RedCrescentUnitSection';
import { BloodDonationClub } from './components/BloodDonationClub';
import { DepartmentAttendance } from './components/DepartmentAttendance';
import { InstituteDigitalMagazine } from './components/InstituteDigitalMagazine';
import { UpdateCheckerModal, CURRENT_APP_VERSION } from './components/UpdateCheckerModal';

import {
  WetProcessingBatch,
  LabDipRecord,
  YarnQualityRecord,
  FiberBaleInspection,
  LoomProductionRecord,
  FabricInspectionRecord,
  SewingLineRecord,
  TechPackRecord,
  GateAccessLog,
  RegisteredMember,
  AuditLog,
  NoticeRecord,
  AcademicEvent,
  StudentFeeStatus,
  StudentGradeRecord,
  GuardianAlert,
  AlumniRecord,
  RedCrescentMember,
  InstituteMagazine,
  TeacherLateAlert,
  ConsecutiveAbsenceRecord
} from './types';

import {
  INITIAL_WET_PROCESSING_BATCHES,
  INITIAL_LAB_DIPS,
  INITIAL_YARN_RECORDS,
  INITIAL_FIBER_BALES,
  INITIAL_LOOM_RECORDS,
  INITIAL_FABRIC_INSPECTIONS,
  INITIAL_SEWING_RECORDS,
  INITIAL_TECH_PACKS,
  REGISTERED_MEMBERS,
  INITIAL_GATE_LOGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_STUDENT_FEES,
  INITIAL_STUDENT_GRADES,
  INITIAL_GUARDIAN_ALERTS,
  INITIAL_ALUMNI,
  INITIAL_RED_CRESCENT_MEMBERS,
  INITIAL_MAGAZINES,
  INITIAL_TEACHER_LATE_ALERTS,
  INITIAL_CONSECUTIVE_ABSENCES
} from './data/initialData';

// Force clear old mock data from previous sessions
const DATA_VERSION_KEY = 'rti_clean_slate_zero_records_v10';
if (typeof window !== 'undefined' && localStorage.getItem('rti_data_version') !== DATA_VERSION_KEY) {
  localStorage.clear();
  localStorage.setItem('rti_data_version', DATA_VERSION_KEY);
}

export default function App() {
  // Master Admin switch state (Default: false for unauthenticated visitors)
  const [isMasterAdmin, setIsMasterAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('rti_master_admin');
    return saved ? JSON.parse(saved) : false;
  });

  // Designated Single Main Admin Email State (Dynamic - defined by user during setup)
  const [designatedAdminEmail, setDesignatedAdminEmail] = useState<string>(() => {
    return localStorage.getItem('rti_designated_admin_email') || '';
  });

  // Admin Security PIN State (Dynamic - defined by user during setup)
  const [adminSecurityPin, setAdminSecurityPin] = useState<string>(() => {
    return localStorage.getItem('rti_admin_pin') || '';
  });

  // Current Logged-in User State (Default: Unauthenticated Guest Visitor)
  const [currentUser, setCurrentUser] = useState<{
    email: string | null;
    name: string;
    role: string;
    isLoggedIn: boolean;
  }>(() => {
    const saved = localStorage.getItem('rti_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.isLoggedIn === 'boolean') {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return {
      email: null,
      name: 'Guest Visitor',
      role: 'Student',
      isLoggedIn: false
    };
  });

  // Role-Based Access Control (Default: Student)
  const [activeRole, setActiveRole] = useState<string>(() => {
    const saved = localStorage.getItem('rti_active_role');
    if (saved) return saved;
    const isSavedAdmin = localStorage.getItem('rti_master_admin');
    return isSavedAdmin && JSON.parse(isSavedAdmin) ? 'Super Admin' : 'Student';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showManualUpdateModal, setShowManualUpdateModal] = useState<boolean>(false);

  // Dark/Light Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('rti_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('rti_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };


  // State with LocalStorage Persistence
  const [batches, setBatches] = useState<WetProcessingBatch[]>(() => {
    const saved = localStorage.getItem('rti_batches');
    return saved ? JSON.parse(saved) : INITIAL_WET_PROCESSING_BATCHES;
  });

  const [labDips, setLabDips] = useState<LabDipRecord[]>(() => {
    const saved = localStorage.getItem('rti_lab_dips');
    return saved ? JSON.parse(saved) : INITIAL_LAB_DIPS;
  });

  const [yarnRecords, setYarnRecords] = useState<YarnQualityRecord[]>(() => {
    const saved = localStorage.getItem('rti_yarn_records');
    return saved ? JSON.parse(saved) : INITIAL_YARN_RECORDS;
  });

  const [fiberBales, setFiberBales] = useState<FiberBaleInspection[]>(() => {
    const saved = localStorage.getItem('rti_fiber_bales');
    return saved ? JSON.parse(saved) : INITIAL_FIBER_BALES;
  });

  const [loomRecords, setLoomRecords] = useState<LoomProductionRecord[]>(() => {
    const saved = localStorage.getItem('rti_loom_records');
    return saved ? JSON.parse(saved) : INITIAL_LOOM_RECORDS;
  });

  const [fabricInspections, setFabricInspections] = useState<FabricInspectionRecord[]>(() => {
    const saved = localStorage.getItem('rti_fabric_inspections');
    return saved ? JSON.parse(saved) : INITIAL_FABRIC_INSPECTIONS;
  });

  const [sewingRecords, setSewingRecords] = useState<SewingLineRecord[]>(() => {
    const saved = localStorage.getItem('rti_sewing_records');
    return saved ? JSON.parse(saved) : INITIAL_SEWING_RECORDS;
  });

  const [techPacks, setTechPacks] = useState<TechPackRecord[]>(() => {
    const saved = localStorage.getItem('rti_tech_packs');
    return saved ? JSON.parse(saved) : INITIAL_TECH_PACKS;
  });

  const [gateLogs, setGateLogs] = useState<GateAccessLog[]>(() => {
    const saved = localStorage.getItem('rti_gate_logs');
    return saved ? JSON.parse(saved) : INITIAL_GATE_LOGS;
  });

  const [registeredMembers, setRegisteredMembers] = useState<RegisteredMember[]>(() => {
    const saved = localStorage.getItem('rti_members');
    return saved ? JSON.parse(saved) : REGISTERED_MEMBERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('rti_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notices, setNotices] = useState<NoticeRecord[]>(() => {
    const saved = localStorage.getItem('rti_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [academicEvents, setAcademicEvents] = useState<AcademicEvent[]>(() => {
    const saved = localStorage.getItem('rti_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [studentFees, setStudentFees] = useState<StudentFeeStatus[]>(() => {
    const saved = localStorage.getItem('rti_student_fees');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_FEES;
  });

  const [studentGrades, setStudentGrades] = useState<StudentGradeRecord[]>(() => {
    const saved = localStorage.getItem('rti_student_grades');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_GRADES;
  });

  const [guardianAlerts, setGuardianAlerts] = useState<GuardianAlert[]>(() => {
    const saved = localStorage.getItem('rti_guardian_alerts');
    return saved ? JSON.parse(saved) : INITIAL_GUARDIAN_ALERTS;
  });

  const [alumniList, setAlumniList] = useState<AlumniRecord[]>(() => {
    const saved = localStorage.getItem('rti_alumni');
    return saved ? JSON.parse(saved) : INITIAL_ALUMNI;
  });

  const [redCrescentMembers, setRedCrescentMembers] = useState<RedCrescentMember[]>(() => {
    const saved = localStorage.getItem('rti_red_crescent');
    return saved ? JSON.parse(saved) : INITIAL_RED_CRESCENT_MEMBERS;
  });

  const [magazines, setMagazines] = useState<InstituteMagazine[]>(() => {
    const saved = localStorage.getItem('rti_magazines');
    return saved ? JSON.parse(saved) : INITIAL_MAGAZINES;
  });

  const [teacherLateAlerts, setTeacherLateAlerts] = useState<TeacherLateAlert[]>(() => {
    const saved = localStorage.getItem('rti_teacher_late');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_LATE_ALERTS;
  });

  const [consecutiveAbsences, setConsecutiveAbsences] = useState<ConsecutiveAbsenceRecord[]>(() => {
    const saved = localStorage.getItem('rti_consecutive_absences');
    return saved ? JSON.parse(saved) : INITIAL_CONSECUTIVE_ABSENCES;
  });

  // Modal States

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState<boolean>(() => !sessionStorage.getItem('welcome_dismissed'));

  const handleDismissWelcome = () => {
    sessionStorage.setItem('welcome_dismissed', 'true');
    setShowWelcomeToast(false);
  };

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem('rti_master_admin', JSON.stringify(isMasterAdmin));
  }, [isMasterAdmin]);

  useEffect(() => {
    localStorage.setItem('rti_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('rti_admin_pin', adminSecurityPin);
  }, [adminSecurityPin]);

  useEffect(() => {
    localStorage.setItem('rti_active_role', activeRole);
  }, [activeRole]);


  useEffect(() => {
    localStorage.setItem('rti_lab_dips', JSON.stringify(labDips));
  }, [labDips]);

  useEffect(() => {
    localStorage.setItem('rti_yarn_records', JSON.stringify(yarnRecords));
  }, [yarnRecords]);

  useEffect(() => {
    localStorage.setItem('rti_fiber_bales', JSON.stringify(fiberBales));
  }, [fiberBales]);

  useEffect(() => {
    localStorage.setItem('rti_loom_records', JSON.stringify(loomRecords));
  }, [loomRecords]);

  useEffect(() => {
    localStorage.setItem('rti_fabric_inspections', JSON.stringify(fabricInspections));
  }, [fabricInspections]);

  useEffect(() => {
    localStorage.setItem('rti_sewing_records', JSON.stringify(sewingRecords));
  }, [sewingRecords]);

  useEffect(() => {
    localStorage.setItem('rti_tech_packs', JSON.stringify(techPacks));
  }, [techPacks]);

  useEffect(() => {
    localStorage.setItem('rti_gate_logs', JSON.stringify(gateLogs));
  }, [gateLogs]);


  useEffect(() => {
    if (!db) return;

    const unsubBatches = onSnapshot(collection(db, 'batches'), (snapshot) => {
      if (!snapshot.empty) {
        setBatches(snapshot.docs.map(d => d.data() as WetProcessingBatch));
      } else {
        const wb = writeBatch(db);
        INITIAL_WET_PROCESSING_BATCHES.forEach(item => wb.set(doc(db, 'batches', item.id), item));
        wb.commit();
      }
    });

    const unsubMembers = onSnapshot(collection(db, 'registeredMembers'), (snapshot) => {
      if (!snapshot.empty) {
        setRegisteredMembers(snapshot.docs.map(d => d.data() as RegisteredMember));
      } else {
        const wb = writeBatch(db);
        REGISTERED_MEMBERS.forEach(item => wb.set(doc(db, 'registeredMembers', item.id), item));
        wb.commit();
      }
    });

    const unsubNotices = onSnapshot(collection(db, 'notices'), (snapshot) => {
      if (!snapshot.empty) {
        setNotices(snapshot.docs.map(d => d.data() as NoticeRecord));
      } else {
        const wb = writeBatch(db);
        INITIAL_NOTICES.forEach(item => wb.set(doc(db, 'notices', item.id), item));
        wb.commit();
      }
    });

    return () => {
      unsubBatches();
      unsubMembers();
      unsubNotices();
    };
  }, []);


  useEffect(() => {
    localStorage.setItem('rti_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('rti_members', JSON.stringify(registeredMembers));
  }, [registeredMembers]);

  useEffect(() => {
    localStorage.setItem('rti_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('rti_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);


  useEffect(() => {
    localStorage.setItem('rti_events', JSON.stringify(academicEvents));
  }, [academicEvents]);

  useEffect(() => {
    localStorage.setItem('rti_student_fees', JSON.stringify(studentFees));
  }, [studentFees]);

  useEffect(() => {
    localStorage.setItem('rti_student_grades', JSON.stringify(studentGrades));
  }, [studentGrades]);

  useEffect(() => {
    localStorage.setItem('rti_guardian_alerts', JSON.stringify(guardianAlerts));
  }, [guardianAlerts]);

  useEffect(() => {
    localStorage.setItem('rti_alumni', JSON.stringify(alumniList));
  }, [alumniList]);

  useEffect(() => {
    localStorage.setItem('rti_red_crescent', JSON.stringify(redCrescentMembers));
  }, [redCrescentMembers]);

  useEffect(() => {
    localStorage.setItem('rti_magazines', JSON.stringify(magazines));
  }, [magazines]);

  useEffect(() => {
    localStorage.setItem('rti_designated_admin_email', designatedAdminEmail);
  }, [designatedAdminEmail]);

  useEffect(() => {
    localStorage.setItem('rti_admin_pin', adminSecurityPin);
  }, [adminSecurityPin]);

  useEffect(() => {
    localStorage.setItem('rti_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Security Enforcement Guard: Ensure isMasterAdmin can NEVER be true if user is not authenticated as Main Admin
  useEffect(() => {
    if (!currentUser.isLoggedIn || !currentUser.email || currentUser.email.toLowerCase() !== designatedAdminEmail.toLowerCase()) {
      if (isMasterAdmin) {
        setIsMasterAdmin(false);
      }
    }
  }, [currentUser, designatedAdminEmail, isMasterAdmin]);

  // Auth & Admin Handler Functions
  const handleSetupAdminCredentials = (email: string, pin: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = pin.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid Gmail address for the Main Admin.' };
    }
    if (!cleanPin || cleanPin.length < 4) {
      return { success: false, message: 'Admin Security Password must be at least 4 characters long.' };
    }

    setDesignatedAdminEmail(cleanEmail);
    setAdminSecurityPin(cleanPin);
    localStorage.setItem('rti_designated_admin_email', cleanEmail);
    localStorage.setItem('rti_admin_pin', cleanPin);

    setIsMasterAdmin(true);
    setActiveRole('Super Admin');
    const adminUser = {
      email: cleanEmail,
      name: 'Main Admin',
      role: 'Super Admin',
      isLoggedIn: true
    };
    setCurrentUser(adminUser);

    localStorage.setItem('rti_master_admin', JSON.stringify(true));
    localStorage.setItem('rti_current_user', JSON.stringify(adminUser));
    localStorage.setItem('rti_active_role', 'Super Admin');

    addAuditEntry('Main Admin Credentials Set', `Configured Main Admin account for ${cleanEmail}`, 'Security Administration');
    return { success: true, message: `✅ Main Admin configured! Logged in as ${cleanEmail}.` };
  };

  const handleUpdateAdminEmail = (newEmail: string) => {
    const clean = newEmail.trim().toLowerCase();
    setDesignatedAdminEmail(clean);
    localStorage.setItem('rti_designated_admin_email', clean);
    addAuditEntry('Designated Main Admin Changed', `Updated Main Admin Gmail address to ${clean}`, 'Security Administration');
  };

  const handleUpdateAdminPin = (newPin: string) => {
    if (newPin.trim()) {
      setAdminSecurityPin(newPin.trim());
      localStorage.setItem('rti_admin_pin', newPin.trim());
      addAuditEntry('Admin Security PIN Updated', 'Master Admin updated security verification PIN.', 'Security Administration');
    }
  };


  const handleLogin = (
    email: string, 
    _claimAsAdmin = false, 
    enteredPin?: string
  ): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (!designatedAdminEmail) {
      return {
        success: false,
        message: '⚠️ Main Admin has not been configured yet. Please perform Initial Main Admin Setup.'
      };
    }

    if (cleanEmail === designatedAdminEmail.trim().toLowerCase()) {
      const inputPin = (enteredPin || '').trim();
      const validPin = (adminSecurityPin || '').trim();
      
      if (!inputPin || (validPin && inputPin !== validPin)) {
        addAuditEntry('Admin Access Blocked', `Failed Security PIN verification for ${cleanEmail}`, 'Security Administration');
        return { 
          success: false, 
          message: '⛔ Incorrect Admin Password! Authorization rejected.' 
        };
      }

      setIsMasterAdmin(true);
      setActiveRole('Super Admin');
      const adminUser = {
        email: designatedAdminEmail,
        name: 'Main Admin',
        role: 'Super Admin',
        isLoggedIn: true
      };
      setCurrentUser(adminUser);

      // Save session immediately to localStorage
      localStorage.setItem('rti_master_admin', JSON.stringify(true));
      localStorage.setItem('rti_current_user', JSON.stringify(adminUser));
      localStorage.setItem('rti_active_role', 'Super Admin');

      addAuditEntry('Admin Login Successful', `${cleanEmail} authenticated as Main Admin.`, 'Security Administration');
      return { success: true, message: `✅ Security verification successful! Logged in as Main Admin.` };
    } else {
      // Regular Student / User Login
      setIsMasterAdmin(false);
      setActiveRole('Student');
      const userName = cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanEmail;
      const studentUser = {
        email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail.toLowerCase()}@rangpurtextile.edu.bd`,
        name: userName,
        role: 'Student',
        isLoggedIn: true
      };
      setCurrentUser(studentUser);

      localStorage.setItem('rti_master_admin', JSON.stringify(false));
      localStorage.setItem('rti_current_user', JSON.stringify(studentUser));
      localStorage.setItem('rti_active_role', 'Student');

      addAuditEntry('Student Login', `Signed in as student ${cleanEmail}`, 'User Portal');
      return { success: true, message: `Welcome ${userName}! Signed in as Student.` };
    }
  };

  const handleLogout = () => {
    setIsMasterAdmin(false);
    setActiveRole('Student');
    const guestUser = {
      email: null,
      name: 'Guest User',
      role: 'Student',
      isLoggedIn: false
    };
    setCurrentUser(guestUser);
    localStorage.setItem('rti_master_admin', JSON.stringify(false));
    localStorage.setItem('rti_current_user', JSON.stringify(guestUser));
    localStorage.setItem('rti_active_role', 'Student');
    addAuditEntry('User Logout', 'User logged out. Switched to Guest / Student mode.', 'User Portal');
  };

  // Handler functions

  const addAuditEntry = (action: string, details: string, department = 'General') => {
    const newAudit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: isMasterAdmin ? 'Master Admin' : 'Dept Staff',
      action,
      details,
      department
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Department 1: Wet Processing handlers
  const handleAddBatch = async (batch: WetProcessingBatch) => {
    setBatches(prev => [batch, ...prev]);
    if (db) await setDoc(doc(db, 'batches', batch.id), batch);
    addAuditEntry('New Wet Processing Batch Created', `Batch ${batch.batchNo} (${batch.fabricType}) added.`, 'Wet Processing');
  };

  const handleAddLabDip = (dip: LabDipRecord) => {
    setLabDips(prev => [dip, ...prev]);
    addAuditEntry('Lab Dip Logged', `Sample ${dip.sampleCode} (${dip.shadeName}) status: ${dip.passFail}`, 'Wet Processing');
  };

  const handleDeleteBatch = async (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
    if (db) await deleteDoc(doc(db, 'batches', id));
    addAuditEntry('Batch Deleted', `Deleted batch ID ${id}`, 'Wet Processing');
  };

  // Department 2: Yarn Mfg handlers
  const handleAddYarnRecord = (record: YarnQualityRecord) => {
    setYarnRecords(prev => [record, ...prev]);
    addAuditEntry('Yarn Count Quality Logged', `Lot ${record.lotNo} Ne ${record.actualCountNe}`, 'Yarn Mfg');
  };

  const handleAddFiberBale = (bale: FiberBaleInspection) => {
    setFiberBales(prev => [bale, ...prev]);
    addAuditEntry('Fiber Bale Inspected', `Bale ${bale.baleNo} (${bale.origin})`, 'Yarn Mfg');
  };

  const handleDeleteYarnRecord = (id: string) => {
    setYarnRecords(prev => prev.filter(y => y.id !== id));
    addAuditEntry('Yarn Record Deleted', `Deleted yarn record ${id}`, 'Yarn Mfg');
  };

  // Department 3: Fabric Mfg handlers
  const handleAddLoomRecord = (record: LoomProductionRecord) => {
    setLoomRecords(prev => [record, ...prev]);
    addAuditEntry('Loom Allocated', `Machine ${record.loomNo} (${record.weavePattern})`, 'Fabric Mfg');
  };

  const handleAddFabricInspection = (inspection: FabricInspectionRecord) => {
    setFabricInspections(prev => [inspection, ...prev]);
    addAuditEntry('4-Point Inspection Logged', `Roll ${inspection.rollNo} Grade ${inspection.grade}`, 'Fabric Mfg');
  };

  const handleDeleteLoomRecord = (id: string) => {
    setLoomRecords(prev => prev.filter(l => l.id !== id));
    addAuditEntry('Loom Record Deleted', `Deleted loom record ${id}`, 'Fabric Mfg');
  };

  // Department 4: Apparel Mfg handlers
  const handleAddSewingRecord = (record: SewingLineRecord) => {
    setSewingRecords(prev => [record, ...prev]);
    addAuditEntry('Sewing Line SAM Logged', `Line ${record.lineNo} (${record.styleName})`, 'Apparel Mfg');
  };

  const handleAddTechPack = (pack: TechPackRecord) => {
    setTechPacks(prev => [pack, ...prev]);
    addAuditEntry('Tech Pack Created', `Style ${pack.styleCode} (${pack.buyer})`, 'Apparel Mfg');
  };

  const handleDeleteSewingRecord = (id: string) => {
    setSewingRecords(prev => prev.filter(s => s.id !== id));
    addAuditEntry('Sewing Record Deleted', `Deleted line record ${id}`, 'Apparel Mfg');
  };

  // QR Gate handlers
  const handleScanGatePass = (log: GateAccessLog) => {
    setGateLogs(prev => [log, ...prev]);
    addAuditEntry('Gate Scan Recorded', `${log.personName} (${log.direction}) at ${log.gateLocation} - ${log.status}`, 'Gate Security');
  };

  const handleOverrideAccess = (logId: string) => {
    setGateLogs(prev => prev.map(l => {
      if (l.id === logId) {
        return {
          ...l,
          status: 'OVERRIDE_ADMIN',
          notes: 'Force Override granted by Master Admin.'
        };
      }
      return l;
    }));
    addAuditEntry('Master Admin Gate Override', `Forced access grant for scan log ${logId}`, 'Gate Security');
  };

  const handleRegisterMember = async (member: RegisteredMember) => {
    setRegisteredMembers(prev => [member, ...prev]);
    if (db) await setDoc(doc(db, 'registeredMembers', member.id), member);
    addAuditEntry('Member ID Issued', `Registered ${member.name} (${member.rollOrEmpId})`, 'Admin');
  };

  const handleUpdateMember = async (updatedMember: RegisteredMember) => {
    setRegisteredMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    if (db) await setDoc(doc(db, 'registeredMembers', updatedMember.id), updatedMember);
    addAuditEntry('Member Details Updated', `Updated profile for ${updatedMember.name} (${updatedMember.rollOrEmpId})`, updatedMember.department);
  };

  const handleDeleteMember = async (id: string) => {
    const member = registeredMembers.find(m => m.id === id);
    setRegisteredMembers(prev => prev.filter(m => m.id !== id));
    if (db) await deleteDoc(doc(db, 'registeredMembers', id));
    if (member) {
      addAuditEntry('Member Removed', `Removed ${member.name} (${member.rollOrEmpId})`, member.department);
    }
  };

  const handlePublishNotice = async (notice: NoticeRecord) => {
    setNotices(prev => [notice, ...prev]);
    if (db) await setDoc(doc(db, 'notices', notice.id), notice);
    addAuditEntry('Notice Published', `Title: "${notice.title}" Category: ${notice.category}`, 'Communications');
  };

  const handleAddEvent = (evt: AcademicEvent) => {
    setAcademicEvents(prev => [evt, ...prev]);
    addAuditEntry('Academic Event Scheduled', `Title: "${evt.title}" Date: ${evt.startDate}`, 'Academic');
  };

  const handleAddAlumni = (alumni: AlumniRecord) => {
    setAlumniList(prev => [alumni, ...prev]);
    addAuditEntry('Alumni Profile Registered', `Added alumnus ${alumni.name} (${alumni.currentCompany})`, 'Alumni Network');
  };

  const handleAddRedCrescentMember = (member: RedCrescentMember) => {
    setRedCrescentMembers(prev => [member, ...prev]);
    addAuditEntry('Red Crescent Volunteer Enrolled', `Registered volunteer ${member.name} (${member.bloodGroup})`, 'Institute Hub');
  };

  const handleUpdateRedCrescentMember = (updated: RedCrescentMember) => {
    setRedCrescentMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
    addAuditEntry('Red Crescent Member Updated', `Updated role/status for ${updated.name} (${updated.roleInUnit})`, 'Institute Hub');
  };

  const handleDeleteRedCrescentMember = (id: string) => {
    const member = redCrescentMembers.find(m => m.id === id);
    setRedCrescentMembers(prev => prev.filter(m => m.id !== id));
    if (member) {
      addAuditEntry('Red Crescent Member Removed', `Removed ${member.name} from Red Crescent Unit`, 'Institute Hub');
    }
  };

  const handleAddMagazine = (magazine: InstituteMagazine) => {
    setMagazines(prev => [magazine, ...prev]);
    addAuditEntry('Institute Magazine Uploaded', `Published "${magazine.title}"`, 'Institute Hub');
  };

  const handleTriggerAbsenceSms = (studentId: string) => {
    const student = registeredMembers.find(m => m.rollOrEmpId === studentId);
    if (!student) return;
    const msg = `AUTOMATED ABSENCE ALERT: Student ${student.name} (${studentId}) has been ABSENT for 3 consecutive days at Rangpur Textile Institute. Please contact the department administration immediately.`;
    handleSendGuardianAlert(studentId, 'CONSECUTIVE_ABSENCE', msg);

    setConsecutiveAbsences(prev => prev.map(rec => {
      if (rec.studentId === studentId) {
        return {
          ...rec,
          autoSmsSent: true,
          smsTimestamp: new Date().toLocaleString()
        };
      }
      return rec;
    }));
  };


  const handlePayFeeDues = (studentId: string, amount: number) => {
    setStudentFees(prev => prev.map(f => {
      if (f.studentId === studentId) {
        const newPaid = f.paidAmountUSD + amount;
        const total = f.tuitionFeeUSD + f.labFeeUSD + f.libraryFeeUSD + f.hostelFeeUSD;
        return {
          ...f,
          paidAmountUSD: newPaid,
          status: newPaid >= total ? 'PAID' : 'PARTIAL',
          lastPaymentDate: new Date().toISOString().split('T')[0]
        };
      }
      return f;
    }));
    addAuditEntry('Fee Dues Cleared Online', `Student ${studentId} paid ৳${amount} BDT via Guardian Gateway.`, 'Accounts');
  };

  const handleSendGuardianAlert = (studentId: string, alertType: GuardianAlert['alertType'], msg: string) => {
    const student = registeredMembers.find(m => m.rollOrEmpId === studentId);
    const newAlert: GuardianAlert = {
      id: `alt-${Date.now()}`,
      studentId,
      studentName: student ? student.name : 'Student',
      guardianPhone: student ? student.phone : '+880 1700-000000',
      alertType,
      message: msg,
      timestamp: new Date().toLocaleString(),
      status: 'DELIVERED'
    };
    setGuardianAlerts(prev => [newAlert, ...prev]);
    addAuditEntry('Guardian SMS Alert Dispatched', `Alert sent to ${studentId}: ${alertType}`, 'Guardian Portal');
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Clear all institute records and reset database to an empty slate (0 records)?')) {
      // Clear Firestore collections if DB exists
      if (db) {
        const clearCollection = async (collName: string) => {
          const snap = await getDocs(collection(db, collName));
          const wb = writeBatch(db);
          snap.docs.forEach(d => wb.delete(d.ref));
          await wb.commit();
        };
        await Promise.all([
          clearCollection('batches'),
          clearCollection('registeredMembers'),
          clearCollection('notices')
        ]);
      }

      setBatches([]);
      setLabDips([]);
      setYarnRecords([]);
      setFiberBales([]);
      setLoomRecords([]);
      setFabricInspections([]);
      setSewingRecords([]);
      setTechPacks([]);
      setGateLogs([]);
      setRegisteredMembers([]);
      setNotices([]);
      setAcademicEvents([]);
      setStudentFees([]);
      setStudentGrades([]);
      setGuardianAlerts([]);
      setAlumniList([]);
      setRedCrescentMembers([]);
      setMagazines([]);
      setTeacherLateAlerts([]);
      setConsecutiveAbsences([]);
      setAuditLogs([{
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        user: 'Master Admin',
        action: 'Database System Purged',
        details: 'All directory records, gate logs, notices, and fee entries cleared.',
        department: 'General Administration'
      }]);
    }
  };

  const handleExportData = () => {
    const exportObject = {
      institute: 'Rangpur Textile Institute',
      exportedAt: new Date().toISOString(),
      batches,
      labDips,
      yarnRecords,
      fiberBales,
      loomRecords,
      fabricInspections,
      sewingRecords,
      techPacks,
      gateLogs,
      registeredMembers
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `RTI_Institute_Data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addAuditEntry('Data Exported', 'Downloaded complete institute JSON backup.');
  };

  const activeGateCount = gateLogs.filter(l => l.direction === 'IN' && l.status === 'GRANTED').length;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
      {/* Top Navigation & Master Admin Switch */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMasterAdmin={isMasterAdmin}
        setIsMasterAdmin={setIsMasterAdmin}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        activeGateCount={activeGateCount}
        onRegisterMember={handleRegisterMember}
        designatedAdminEmail={designatedAdminEmail}
        onUpdateAdminEmail={handleUpdateAdminEmail}
        adminSecurityPin={adminSecurityPin}
        onUpdateAdminPin={handleUpdateAdminPin}
        onSetupAdminCredentials={handleSetupAdminCredentials}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Master Admin Control Banner (Displayed ONLY when verified Master Admin is logged in and active) */}
      {isMasterAdmin && currentUser.isLoggedIn && currentUser.email?.toLowerCase() === designatedAdminEmail.toLowerCase() && (activeRole === 'Super Admin' || activeRole === 'Dept Admin') && (
        <MasterAdminBanner
          onOpenRegisterModal={() => setShowRegisterModal(true)}
          onOpenAuditModal={() => setShowAuditModal(true)}
          onResetData={handleResetDefaults}
          onExportData={handleExportData}
          onQuickGateOverride={() => {
            setActiveTab('qr_gate');
          }}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            batches={batches}
            yarnRecords={yarnRecords}
            loomRecords={loomRecords}
            sewingRecords={sewingRecords}
            gateLogs={gateLogs}
            notices={notices}
            redCrescentMembers={redCrescentMembers}
            onAddRedCrescentMember={handleAddRedCrescentMember}
            onUpdateRedCrescentMember={handleUpdateRedCrescentMember}
            onDeleteRedCrescentMember={handleDeleteRedCrescentMember}
            onNavigateTab={setActiveTab}
            isMasterAdmin={isMasterAdmin}
          />
        )}

        {activeTab === 'wet_processing' && (
          <WetProcessingDept
            batches={batches}
            labDips={labDips}
            isMasterAdmin={isMasterAdmin}
            registeredMembers={registeredMembers}
            studentGrades={studentGrades}
            studentFees={studentFees}
            onRegisterMember={handleRegisterMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onPayFeeDues={handlePayFeeDues}
            onAddBatch={handleAddBatch}
            onAddLabDip={handleAddLabDip}
            onDeleteBatch={handleDeleteBatch}
          />
        )}

        {activeTab === 'yarn_mfg' && (
          <YarnDept
            yarnRecords={yarnRecords}
            fiberBales={fiberBales}
            isMasterAdmin={isMasterAdmin}
            registeredMembers={registeredMembers}
            studentGrades={studentGrades}
            studentFees={studentFees}
            onRegisterMember={handleRegisterMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onPayFeeDues={handlePayFeeDues}
            onAddYarnRecord={handleAddYarnRecord}
            onAddFiberBale={handleAddFiberBale}
            onDeleteYarnRecord={handleDeleteYarnRecord}
          />
        )}

        {activeTab === 'fabric_mfg' && (
          <FabricDept
            loomRecords={loomRecords}
            fabricInspections={fabricInspections}
            isMasterAdmin={isMasterAdmin}
            registeredMembers={registeredMembers}
            studentGrades={studentGrades}
            studentFees={studentFees}
            onRegisterMember={handleRegisterMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onPayFeeDues={handlePayFeeDues}
            onAddLoomRecord={handleAddLoomRecord}
            onAddInspection={handleAddFabricInspection}
            onDeleteLoomRecord={handleDeleteLoomRecord}
          />
        )}

        {activeTab === 'apparel_mfg' && (
          <ApparelDept
            sewingRecords={sewingRecords}
            techPacks={techPacks}
            isMasterAdmin={isMasterAdmin}
            registeredMembers={registeredMembers}
            studentGrades={studentGrades}
            studentFees={studentFees}
            onRegisterMember={handleRegisterMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onPayFeeDues={handlePayFeeDues}
            onAddSewingRecord={handleAddSewingRecord}
            onAddTechPack={handleAddTechPack}
            onDeleteSewingRecord={handleDeleteSewingRecord}
          />
        )}

        {(activeTab === 'notices_attendance' || activeTab === 'notices_events' || activeTab === 'qr_gate' || activeTab === 'dept_attendance') && (
          <NoticeAndAttendanceHub
            notices={notices}
            events={academicEvents}
            registeredMembers={registeredMembers}
            gateLogs={gateLogs}
            teacherLateAlerts={teacherLateAlerts}
            consecutiveAbsences={consecutiveAbsences}
            isMasterAdmin={isMasterAdmin}
            activeRole={activeRole}
            onAddNotice={handlePublishNotice}
            onAddEvent={handleAddEvent}
            onScanGatePass={handleScanGatePass}
            onOverrideAccess={handleOverrideAccess}
            onTriggerAbsenceSms={handleTriggerAbsenceSms}
          />
        )}

        {(activeTab === 'magazine' || activeTab === 'digital_magazine') && (
          <InstituteDigitalMagazine
            magazines={magazines}
            isMasterAdmin={isMasterAdmin}
            activeRole={activeRole}
            onAddMagazine={handleAddMagazine}
          />
        )}

        {activeTab === 'alumni_network' && (
          <AlumniNetwork
            alumniList={alumniList}
            isMasterAdmin={isMasterAdmin}
            onAddAlumni={handleAddAlumni}
          />
        )}

        {activeTab === 'guardian_portal' && (
          <GuardianPortal
            members={registeredMembers}
            gateLogs={gateLogs}
            studentFees={studentFees}
            studentGrades={studentGrades}
            guardianAlerts={guardianAlerts}
            onPayFeeDues={handlePayFeeDues}
          />
        )}

        {(activeTab === 'audit_logs' || activeTab === 'admin_console') && (
          <AuditLogView
            logs={auditLogs}
            isMasterAdmin={isMasterAdmin && currentUser.isLoggedIn && currentUser.email?.toLowerCase() === designatedAdminEmail.toLowerCase()}
          />
        )}

        {activeTab === 'students_directory' && (
          <DepartmentMemberDirectory
            departmentKey="wet_processing"
            departmentTitle="Rangpur Textile Institute — Complete Students Directory"
            registeredMembers={registeredMembers.filter(m => m.role === 'Student' || !m.role)}
            studentGrades={studentGrades}
            studentFees={studentFees}
            onRegisterMember={handleRegisterMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onPayFeeDues={handlePayFeeDues}
            isMasterAdmin={isMasterAdmin}
            activeRole={activeRole}
            initialRoleFilter="Student"
          />
        )}

        {activeTab === 'faculty_directory' && (
          <DepartmentMemberDirectory
            departmentKey="wet_processing"
            departmentTitle="Rangpur Textile Institute — Complete Faculty & Teachers Directory"
            registeredMembers={registeredMembers.filter(m => m.role === 'Faculty' || m.role === 'Teacher')}
            studentGrades={studentGrades}
            studentFees={studentFees}
            onRegisterMember={handleRegisterMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onPayFeeDues={handlePayFeeDues}
            isMasterAdmin={isMasterAdmin}
            activeRole={activeRole}
            initialRoleFilter="Faculty"
          />
        )}

        {(activeTab === 'blood_donors' || activeTab === 'blood_bank' || activeTab === 'red_crescent') && (
          <BloodDonationClub
            donors={redCrescentMembers}
            isMasterAdmin={isMasterAdmin}
            onAddDonor={handleAddRedCrescentMember}
            onUpdateDonor={handleUpdateRedCrescentMember}
            onDeleteDonor={handleDeleteRedCrescentMember}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/40 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            <span className="font-bold text-slate-300 font-mono">RANGPUR TEXTILE INSTITUTE</span> — Management Information System (RTI OS v5.0)
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>4 Academic Depts</span>
            <span>•</span>
            <span>Alumni Directory</span>
            <span>•</span>
            <button
              onClick={() => setShowManualUpdateModal(true)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-white font-bold rounded-lg border border-purple-500/40 transition shadow-sm"
              title="Check for application updates"
            >
              <span>🚀 v{CURRENT_APP_VERSION}</span>
              <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded font-extrabold uppercase">Updates</span>
            </button>
          </div>
        </div>
      </footer>

      {/* In-App Automatic & Manual Update Checker Modal */}
      <UpdateCheckerModal
        manualTrigger={showManualUpdateModal}
        onCloseManualTrigger={() => setShowManualUpdateModal(false)}
      />

      {/* Master Admin Modals */}
      {showRegisterModal && (
        <MemberRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegister={handleRegisterMember}
        />
      )}

      {showAuditModal && (
        <AuditLogModal
          logs={auditLogs}
          onClose={() => setShowAuditModal(false)}
          onExport={handleExportData}
        />
      )}

      {/* AUTOMATIC WELCOME NOTIFICATION / TOAST OVERLAY */}
      {showWelcomeToast && (
        <div 
          id="welcome-toast-overlay"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 z-[90] sm:w-[400px] animate-slideUp"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-indigo-500/50 text-white p-4 sm:p-5 rounded-2xl shadow-2xl shadow-indigo-950/80 relative flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/30">
              <Building2 className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0 pr-6 space-y-1">
              <div className="flex items-center space-x-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">System Online</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                Welcome to the RTI Management System
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rangpur Textile Institute Central Operations & Student Information System (RTI OS v5.0).
              </p>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  id="welcome-toast-ok-btn"
                  onClick={handleDismissWelcome}
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>OK</span>
                </button>
              </div>
            </div>

            {/* Top-right close '✕' button */}
            <button
              type="button"
              id="welcome-toast-close-btn"
              onClick={handleDismissWelcome}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Dismiss welcome message"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
