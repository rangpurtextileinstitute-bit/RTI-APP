import React, { useState, useEffect } from 'react';
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
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { GuardianPortal } from './components/GuardianPortal';
import { NoticeAndEventsBoard } from './components/NoticeAndEventsBoard';
import { AuditLogView } from './components/AuditLogView';
import { AlumniNetwork } from './components/AlumniNetwork';
import { InstituteHub } from './components/InstituteHub';
import { CCTVMonitoring } from './components/CCTVMonitoring';
import { DepartmentMemberDirectory } from './components/DepartmentMemberDirectory';
import { RedCrescentUnitSection } from './components/RedCrescentUnitSection';

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
const DATA_VERSION_KEY = 'rti_clean_slate_v6';
if (typeof window !== 'undefined' && localStorage.getItem('rti_data_version') !== DATA_VERSION_KEY) {
  localStorage.removeItem('niotron_batches');
  localStorage.removeItem('niotron_lab_dips');
  localStorage.removeItem('niotron_yarn_records');
  localStorage.removeItem('niotron_fiber_bales');
  localStorage.removeItem('niotron_loom_records');
  localStorage.removeItem('niotron_fabric_inspections');
  localStorage.removeItem('niotron_sewing_records');
  localStorage.removeItem('niotron_tech_packs');
  localStorage.removeItem('niotron_gate_logs');
  localStorage.removeItem('niotron_members');
  localStorage.removeItem('niotron_audit_logs');
  localStorage.removeItem('niotron_notices');
  localStorage.removeItem('niotron_events');
  localStorage.removeItem('niotron_student_fees');
  localStorage.removeItem('niotron_student_grades');
  localStorage.removeItem('niotron_guardian_alerts');
  localStorage.removeItem('rti_alumni');
  localStorage.removeItem('rti_red_crescent');
  localStorage.removeItem('rti_magazines');
  localStorage.removeItem('rti_teacher_late');
  localStorage.removeItem('rti_consecutive_absences');
  localStorage.setItem('rti_data_version', DATA_VERSION_KEY);
}

export default function App() {
  // Master Admin switch state (Top-Right requirement)
  const [isMasterAdmin, setIsMasterAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('rti_master_admin');
    return saved ? JSON.parse(saved) : true;
  });

  // Designated Main Admin Email State
  const [designatedAdminEmail, setDesignatedAdminEmail] = useState<string>(() => {
    return localStorage.getItem('rti_designated_admin_email') || 'dhdrt581@gmail.com';
  });

  // Current Logged-in User State
  const [currentUser, setCurrentUser] = useState<{
    email: string | null;
    name: string;
    role: string;
    isLoggedIn: boolean;
  }>(() => {
    const saved = localStorage.getItem('rti_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      email: 'dhdrt581@gmail.com',
      name: 'Main Admin',
      role: 'Super Admin',
      isLoggedIn: true
    };
  });

  // Role-Based Access Control
  const [activeRole, setActiveRole] = useState<string>('Super Admin');

  const [activeTab, setActiveTab] = useState<string>('dashboard');


  // State with LocalStorage Persistence
  const [batches, setBatches] = useState<WetProcessingBatch[]>(() => {
    const saved = localStorage.getItem('niotron_batches');
    return saved ? JSON.parse(saved) : INITIAL_WET_PROCESSING_BATCHES;
  });

  const [labDips, setLabDips] = useState<LabDipRecord[]>(() => {
    const saved = localStorage.getItem('niotron_lab_dips');
    return saved ? JSON.parse(saved) : INITIAL_LAB_DIPS;
  });

  const [yarnRecords, setYarnRecords] = useState<YarnQualityRecord[]>(() => {
    const saved = localStorage.getItem('niotron_yarn_records');
    return saved ? JSON.parse(saved) : INITIAL_YARN_RECORDS;
  });

  const [fiberBales, setFiberBales] = useState<FiberBaleInspection[]>(() => {
    const saved = localStorage.getItem('niotron_fiber_bales');
    return saved ? JSON.parse(saved) : INITIAL_FIBER_BALES;
  });

  const [loomRecords, setLoomRecords] = useState<LoomProductionRecord[]>(() => {
    const saved = localStorage.getItem('niotron_loom_records');
    return saved ? JSON.parse(saved) : INITIAL_LOOM_RECORDS;
  });

  const [fabricInspections, setFabricInspections] = useState<FabricInspectionRecord[]>(() => {
    const saved = localStorage.getItem('niotron_fabric_inspections');
    return saved ? JSON.parse(saved) : INITIAL_FABRIC_INSPECTIONS;
  });

  const [sewingRecords, setSewingRecords] = useState<SewingLineRecord[]>(() => {
    const saved = localStorage.getItem('niotron_sewing_records');
    return saved ? JSON.parse(saved) : INITIAL_SEWING_RECORDS;
  });

  const [techPacks, setTechPacks] = useState<TechPackRecord[]>(() => {
    const saved = localStorage.getItem('niotron_tech_packs');
    return saved ? JSON.parse(saved) : INITIAL_TECH_PACKS;
  });

  const [gateLogs, setGateLogs] = useState<GateAccessLog[]>(() => {
    const saved = localStorage.getItem('niotron_gate_logs');
    return saved ? JSON.parse(saved) : INITIAL_GATE_LOGS;
  });

  const [registeredMembers, setRegisteredMembers] = useState<RegisteredMember[]>(() => {
    const saved = localStorage.getItem('niotron_members');
    return saved ? JSON.parse(saved) : REGISTERED_MEMBERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('niotron_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notices, setNotices] = useState<NoticeRecord[]>(() => {
    const saved = localStorage.getItem('niotron_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [academicEvents, setAcademicEvents] = useState<AcademicEvent[]>(() => {
    const saved = localStorage.getItem('niotron_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [studentFees, setStudentFees] = useState<StudentFeeStatus[]>(() => {
    const saved = localStorage.getItem('niotron_student_fees');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_FEES;
  });

  const [studentGrades, setStudentGrades] = useState<StudentGradeRecord[]>(() => {
    const saved = localStorage.getItem('niotron_student_grades');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_GRADES;
  });

  const [guardianAlerts, setGuardianAlerts] = useState<GuardianAlert[]>(() => {
    const saved = localStorage.getItem('niotron_guardian_alerts');
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

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem('niotron_master_admin', JSON.stringify(isMasterAdmin));
  }, [isMasterAdmin]);

  useEffect(() => {
    localStorage.setItem('niotron_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('niotron_lab_dips', JSON.stringify(labDips));
  }, [labDips]);

  useEffect(() => {
    localStorage.setItem('niotron_yarn_records', JSON.stringify(yarnRecords));
  }, [yarnRecords]);

  useEffect(() => {
    localStorage.setItem('niotron_fiber_bales', JSON.stringify(fiberBales));
  }, [fiberBales]);

  useEffect(() => {
    localStorage.setItem('niotron_loom_records', JSON.stringify(loomRecords));
  }, [loomRecords]);

  useEffect(() => {
    localStorage.setItem('niotron_fabric_inspections', JSON.stringify(fabricInspections));
  }, [fabricInspections]);

  useEffect(() => {
    localStorage.setItem('niotron_sewing_records', JSON.stringify(sewingRecords));
  }, [sewingRecords]);

  useEffect(() => {
    localStorage.setItem('niotron_tech_packs', JSON.stringify(techPacks));
  }, [techPacks]);

  useEffect(() => {
    localStorage.setItem('niotron_gate_logs', JSON.stringify(gateLogs));
  }, [gateLogs]);

  useEffect(() => {
    localStorage.setItem('niotron_members', JSON.stringify(registeredMembers));
  }, [registeredMembers]);

  useEffect(() => {
    localStorage.setItem('niotron_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('niotron_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('niotron_events', JSON.stringify(academicEvents));
  }, [academicEvents]);

  useEffect(() => {
    localStorage.setItem('niotron_student_fees', JSON.stringify(studentFees));
  }, [studentFees]);

  useEffect(() => {
    localStorage.setItem('niotron_student_grades', JSON.stringify(studentGrades));
  }, [studentGrades]);

  useEffect(() => {
    localStorage.setItem('niotron_guardian_alerts', JSON.stringify(guardianAlerts));
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
    localStorage.setItem('rti_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Auth & Admin Handler Functions
  const handleUpdateAdminEmail = (newEmail: string) => {
    const clean = newEmail.trim().toLowerCase();
    setDesignatedAdminEmail(clean);
    addAuditEntry('Designated Main Admin Changed', `Updated Main Admin Gmail address to ${clean}`, 'Security Administration');
  };

  const handleLogin = (email: string, claimAsAdmin = false) => {
    const cleanEmail = email.trim().toLowerCase();
    if (claimAsAdmin) {
      setDesignatedAdminEmail(cleanEmail);
      setIsMasterAdmin(true);
      setActiveRole('Super Admin');
      setCurrentUser({
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'Super Admin',
        isLoggedIn: true
      });
      addAuditEntry('Main Admin Claimed', `${cleanEmail} claimed and set as the new Main Admin.`, 'Security Administration');
    } else if (cleanEmail === designatedAdminEmail.trim().toLowerCase()) {
      setIsMasterAdmin(true);
      setActiveRole('Super Admin');
      setCurrentUser({
        email: cleanEmail,
        name: 'Main Admin',
        role: 'Super Admin',
        isLoggedIn: true
      });
      addAuditEntry('Admin Login Successful', `${cleanEmail} authenticated as Main Admin.`, 'Security Administration');
    } else {
      setIsMasterAdmin(false);
      setActiveRole('Student');
      setCurrentUser({
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'Student',
        isLoggedIn: true
      });
      addAuditEntry('User Login', `Signed in as regular user ${cleanEmail}`, 'User Portal');
    }
  };

  const handleLogout = () => {
    setIsMasterAdmin(false);
    setActiveRole('Student');
    setCurrentUser({
      email: null,
      name: 'Guest User',
      role: 'Student',
      isLoggedIn: false
    });
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
  const handleAddBatch = (batch: WetProcessingBatch) => {
    setBatches(prev => [batch, ...prev]);
    addAuditEntry('New Wet Processing Batch Created', `Batch ${batch.batchNo} (${batch.fabricType}) added.`, 'Wet Processing');
  };

  const handleAddLabDip = (dip: LabDipRecord) => {
    setLabDips(prev => [dip, ...prev]);
    addAuditEntry('Lab Dip Logged', `Sample ${dip.sampleCode} (${dip.shadeName}) status: ${dip.passFail}`, 'Wet Processing');
  };

  const handleDeleteBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
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

  const handleRegisterMember = (member: RegisteredMember) => {
    setRegisteredMembers(prev => [member, ...prev]);
    addAuditEntry('Member ID Issued', `Registered ${member.name} (${member.rollOrEmpId})`, 'Admin');
  };

  const handleUpdateMember = (updatedMember: RegisteredMember) => {
    setRegisteredMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    addAuditEntry('Member Details Updated', `Updated profile for ${updatedMember.name} (${updatedMember.rollOrEmpId})`, updatedMember.department);
  };

  const handleDeleteMember = (id: string) => {
    const member = registeredMembers.find(m => m.id === id);
    setRegisteredMembers(prev => prev.filter(m => m.id !== id));
    if (member) {
      addAuditEntry('Member Removed', `Removed ${member.name} (${member.rollOrEmpId})`, member.department);
    }
  };

  const handlePublishNotice = (notice: NoticeRecord) => {
    setNotices(prev => [notice, ...prev]);
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

  const handleSendGuardianAlert = (studentId: string, alertType: any, msg: string) => {
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

  const handleResetDefaults = () => {
    if (window.confirm('Clear all institute records and reset database to an empty slate (0 records)?')) {
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
      institute: 'NIOTRON Textile Institute',
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
    downloadAnchor.setAttribute("download", `NIOTRON_Institute_Data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addAuditEntry('Data Exported', 'Downloaded complete institute JSON backup.');
  };

  const activeGateCount = gateLogs.filter(l => l.direction === 'IN' && l.status === 'GRANTED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
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
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Master Admin Control Banner (Displayed when Master Admin is active and Admin role selected) */}
      {isMasterAdmin && (activeRole === 'Super Admin' || activeRole === 'Dept Admin') && (
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

        {activeTab === 'qr_gate' && (
          <QRAttendanceGate
            gateLogs={gateLogs}
            registeredMembers={registeredMembers}
            isMasterAdmin={isMasterAdmin}
            onScanGatePass={handleScanGatePass}
            onOverrideAccess={handleOverrideAccess}
            teacherLateAlerts={teacherLateAlerts}
            consecutiveAbsences={consecutiveAbsences}
            onTriggerAbsenceSms={handleTriggerAbsenceSms}
          />
        )}

        {activeTab === 'cctv_surveillance' && (
          <CCTVMonitoring
            activeRole={activeRole}
            isMasterAdmin={isMasterAdmin}
          />
        )}

        {activeTab === 'alumni_network' && (
          <AlumniNetwork
            alumniList={alumniList}
            isMasterAdmin={isMasterAdmin}
            onAddAlumni={handleAddAlumni}
          />
        )}

        {activeTab === 'institute_hub' && (
          <InstituteHub
            redCrescentMembers={redCrescentMembers}
            magazines={magazines}
            events={academicEvents}
            isMasterAdmin={isMasterAdmin}
            onAddRedCrescentMember={handleAddRedCrescentMember}
            onUpdateRedCrescentMember={handleUpdateRedCrescentMember}
            onDeleteRedCrescentMember={handleDeleteRedCrescentMember}
            onAddMagazine={handleAddMagazine}
            onAddEvent={handleAddEvent}
          />
        )}

        {activeTab === 'notices_events' && (
          <NoticeAndEventsBoard
            notices={notices}
            events={academicEvents}
            isMasterAdmin={isMasterAdmin}
            activeRole={activeRole}
            onAddNotice={handlePublishNotice}
            onAddEvent={handleAddEvent}
            onOpenAiDrafter={() => setActiveTab('ai_assistant')}
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

        {activeTab === 'ai_assistant' && (
          <AIAssistantWidget
            members={registeredMembers}
            gateLogs={gateLogs}
            studentFees={studentFees}
            studentGrades={studentGrades}
            onPublishNotice={handlePublishNotice}
            onSendGuardianAlert={handleSendGuardianAlert}
          />
        )}

        {(activeTab === 'audit_logs' || activeTab === 'admin_console') && (
          <AuditLogView
            logs={auditLogs}
            isMasterAdmin={isMasterAdmin}
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

        {activeTab === 'red_crescent' && (
          <RedCrescentUnitSection
            redCrescentMembers={redCrescentMembers}
            isMasterAdmin={isMasterAdmin}
            onAddRedCrescentMember={handleAddRedCrescentMember}
            onUpdateRedCrescentMember={handleUpdateRedCrescentMember}
            onDeleteRedCrescentMember={handleDeleteRedCrescentMember}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/40 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            <span className="font-bold text-slate-300 font-mono">RANGPUR TEXTILE INSTITUTE</span> — Management Information System (RTI OS v5.0)
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>4 Academic Depts</span>
            <span>•</span>
            <span>Alumni Directory</span>
            <span>•</span>
            <span>Red Crescent Unit</span>
            <span>•</span>
            <span className="text-purple-400 font-bold">Purple/Blue Theme</span>
          </div>
        </div>
      </footer>


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
    </div>
  );
}
