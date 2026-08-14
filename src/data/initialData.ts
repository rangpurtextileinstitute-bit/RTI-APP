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
} from '../types';

export const INITIAL_WET_PROCESSING_BATCHES: WetProcessingBatch[] = [];
export const INITIAL_LAB_DIPS: LabDipRecord[] = [];
export const INITIAL_YARN_RECORDS: YarnQualityRecord[] = [];
export const INITIAL_FIBER_BALES: FiberBaleInspection[] = [];
export const INITIAL_LOOM_RECORDS: LoomProductionRecord[] = [];
export const INITIAL_FABRIC_INSPECTIONS: FabricInspectionRecord[] = [];
export const INITIAL_SEWING_RECORDS: SewingLineRecord[] = [];
export const INITIAL_TECH_PACKS: TechPackRecord[] = [];

export const REGISTERED_MEMBERS: RegisteredMember[] = [];
export const INITIAL_GATE_LOGS: GateAccessLog[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    timestamp: new Date().toLocaleString(),
    user: 'System Initializer',
    action: 'Clean Slate DB Boot',
    details: 'System database initialized with zero demo records. Ready for live user registration and data entry.',
    department: 'General Administration'
  }
];

export const INITIAL_NOTICES: NoticeRecord[] = [];
export const INITIAL_EVENTS: AcademicEvent[] = [];
export const INITIAL_STUDENT_FEES: StudentFeeStatus[] = [];
export const INITIAL_STUDENT_GRADES: StudentGradeRecord[] = [];
export const INITIAL_GUARDIAN_ALERTS: GuardianAlert[] = [];
export const INITIAL_ALUMNI: AlumniRecord[] = [];
export const INITIAL_RED_CRESCENT_MEMBERS: RedCrescentMember[] = [];
export const INITIAL_MAGAZINES: InstituteMagazine[] = [];
export const INITIAL_TEACHER_LATE_ALERTS: TeacherLateAlert[] = [];
export const INITIAL_CONSECUTIVE_ABSENCES: ConsecutiveAbsenceRecord[] = [];
