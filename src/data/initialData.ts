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
export const INITIAL_RED_CRESCENT_MEMBERS: RedCrescentMember[] = [
  {
    id: 'donor-01',
    studentId: 'RTI-WP-2201',
    name: 'Md. Tariqul Islam',
    bloodGroup: 'O+',
    department: 'Wet Processing',
    batchOrSession: 'Session 2024-25 (14th Batch)',
    phone: '01712-334455',
    location: 'Shahid Titumir Hall, Campus',
    roleInUnit: 'Blood Donor Coordinator',
    lastDonationDate: '2026-05-10',
    totalDonations: 4,
    status: 'Available Now',
    availabilityStatus: 'Available Now',
    gender: 'Male',
    joinDate: '2024-03-15'
  },
  {
    id: 'donor-02',
    studentId: 'RTI-AM-2208',
    name: 'Sumaiya Akter Rimi',
    bloodGroup: 'A+',
    department: 'Apparel Manufacturing',
    batchOrSession: 'Session 2024-25 (14th Batch)',
    phone: '01715-998877',
    location: 'Begum Rokeya Female Hostel, Room 204',
    roleInUnit: 'First Aid Specialist',
    lastDonationDate: '2026-06-18',
    totalDonations: 2,
    status: 'Available Now',
    availabilityStatus: 'Available Now',
    gender: 'Female',
    joinDate: '2024-09-01'
  },
  {
    id: 'donor-03',
    studentId: 'RTI-YM-2115',
    name: 'Ashraful Alam',
    bloodGroup: 'B+',
    department: 'Yarn Manufacturing',
    batchOrSession: 'Session 2023-24 (13th Batch)',
    phone: '01823-456789',
    location: 'Lalbagh, Rangpur Sadar',
    roleInUnit: 'Unit Team Lead',
    lastDonationDate: '2026-04-02',
    totalDonations: 5,
    status: 'Available Now',
    availabilityStatus: 'Available Now',
    gender: 'Male',
    joinDate: '2023-02-10'
  },
  {
    id: 'donor-04',
    studentId: 'RTI-FM-2305',
    name: 'Fahim Morshed',
    bloodGroup: 'AB+',
    department: 'Fabric Manufacturing',
    batchOrSession: 'Session 2025-26 (15th Batch)',
    phone: '01911-223388',
    location: 'Medical More, Rangpur',
    roleInUnit: 'Volunteer',
    lastDonationDate: '2026-07-20',
    totalDonations: 1,
    status: 'Emergency On-Call',
    availabilityStatus: 'Emergency Only',
    gender: 'Male',
    joinDate: '2025-11-05'
  },
  {
    id: 'donor-05',
    studentId: 'RTI-WP-2104',
    name: 'Tanvir Ahmed Joy',
    bloodGroup: 'O-',
    department: 'Wet Processing',
    batchOrSession: 'Session 2023-24 (13th Batch)',
    phone: '01733-112244',
    location: 'Dhap Medical Road, Rangpur',
    roleInUnit: 'Blood Donor',
    lastDonationDate: '2026-03-12',
    totalDonations: 3,
    status: 'Available Now',
    availabilityStatus: 'Available Now',
    gender: 'Male',
    joinDate: '2023-08-20'
  },
  {
    id: 'donor-06',
    studentId: 'RTI-AM-2312',
    name: 'Nusrat Jahan Bristy',
    bloodGroup: 'B-',
    department: 'Apparel Manufacturing',
    batchOrSession: 'Session 2025-26 (15th Batch)',
    phone: '01622-778899',
    location: 'Begum Rokeya Female Hostel, Room 310',
    roleInUnit: 'First Aid Trainer',
    lastDonationDate: '2026-05-30',
    totalDonations: 2,
    status: 'Available Now',
    availabilityStatus: 'Available Now',
    gender: 'Female',
    joinDate: '2025-01-14'
  },
  {
    id: 'donor-07',
    studentId: 'RTI-FM-2219',
    name: 'Mahmudul Hasan Shanto',
    bloodGroup: 'A-',
    department: 'Fabric Manufacturing',
    batchOrSession: 'Session 2024-25 (14th Batch)',
    phone: '01799-556677',
    location: 'Modern More, Rangpur',
    roleInUnit: 'Blood Donor',
    lastDonationDate: '2026-02-14',
    totalDonations: 3,
    status: 'Available Now',
    availabilityStatus: 'Available Now',
    gender: 'Male',
    joinDate: '2024-04-18'
  },
  {
    id: 'donor-08',
    studentId: 'RTI-YM-2207',
    name: 'Kazi Rakibul Islam',
    bloodGroup: 'AB-',
    department: 'Yarn Manufacturing',
    batchOrSession: 'Session 2024-25 (14th Batch)',
    phone: '01511-990011',
    location: 'Park More, Rangpur',
    roleInUnit: 'Volunteer',
    lastDonationDate: '2026-07-28',
    totalDonations: 2,
    status: 'Emergency On-Call',
    availabilityStatus: 'Emergency Only',
    gender: 'Male',
    joinDate: '2024-06-22'
  }
];
export const INITIAL_MAGAZINES: InstituteMagazine[] = [];
export const INITIAL_TEACHER_LATE_ALERTS: TeacherLateAlert[] = [];
export const INITIAL_CONSECUTIVE_ABSENCES: ConsecutiveAbsenceRecord[] = [];
