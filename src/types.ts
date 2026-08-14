export type DepartmentType = 'wet_processing' | 'yarn_mfg' | 'fabric_mfg' | 'apparel_mfg';

export interface UserContext {
  isMasterAdmin: boolean;
  currentUser: {
    id: string;
    name: string;
    role: 'Admin' | 'Head of Dept' | 'Faculty' | 'Student' | 'Lab Technician';
    dept: string;
  };
}

// 1. Wet Processing Records
export interface WetProcessingBatch {
  id: string;
  batchNo: string;
  fabricLot: string;
  fabricType: string; // e.g. 100% Combed Cotton, 65/35 Poly-Cotton
  weightKg: number;
  dyeType: 'Reactive' | 'Disperse' | 'Vat' | 'Direct' | 'Acid' | 'Pigment';
  recipe: string; // e.g. Reactive Blue 21 (2.5%), Salt (60g/L), Soda Ash (15g/L)
  liquorRatio: string; // e.g. 1:10
  tempC: number;
  processTimeMin: number;
  deltaETarget: number;
  actualDeltaE: number;
  status: 'Completed' | 'In Process' | 'Quality Check' | 'Rejected' | 'Scheduled';
  technician: string;
  date: string;
  notes?: string;
}

export interface LabDipRecord {
  id: string;
  sampleCode: string;
  buyerName: string;
  fabricQuality: string;
  shadeName: string;
  hexColor: string;
  lightSource: 'D65' | 'TL84' | 'CWF' | 'UV';
  passFail: 'PASS' | 'FAIL' | 'PENDING';
  deltaE: number;
  date: string;
}

// 2. Yarn Manufacturing Records
export interface YarnQualityRecord {
  id: string;
  lotNo: string;
  yarnType: 'Ring Spun' | 'Open End (Rotor)' | 'Air Jet' | 'Compact';
  targetCountNe: number;
  actualCountNe: number;
  csp: number; // Count Strength Product (e.g. 2800)
  ipi: number; // Imperfections per 1000m
  hairinessIndex: number; // H value
  wastePercentage: number;
  spindleRpm: number;
  efficiencyPercent: number;
  operator: string;
  date: string;
  shift: 'Shift A' | 'Shift B' | 'Shift C';
}

export interface FiberBaleInspection {
  id: string;
  baleNo: string;
  origin: 'USA Pima' | 'Egyptian Giza' | 'Indian Shankar-6' | 'Polyester Fiber';
  stapleLengthMm: number;
  micronaire: number;
  trashPercent: number;
  strengthGtex: number;
  grade: 'Strict Middling' | 'Middling' | 'Good Middling' | 'Grade A Synthetic';
  date: string;
}

// 3. Fabric Manufacturing Records
export interface LoomProductionRecord {
  id: string;
  loomNo: string;
  loomType: 'Air-Jet' | 'Rapier' | 'Water-Jet' | 'Circular Knitting';
  weavePattern: 'Plain 1/1' | 'Twill 2/1' | 'Sateen 4/1' | 'Single Jersey' | 'Interlock';
  epi: number;
  ppi: number;
  warpCount: string;
  weftCount: string;
  targetMeters: number;
  producedMeters: number;
  speedRpm: number;
  efficiencyPercent: number;
  status: 'Running' | 'Idle' | 'Warp Break' | 'Maintenance';
  operator: string;
  date: string;
}

export interface FabricInspectionRecord {
  id: string;
  rollNo: string;
  fabricType: string;
  widthInches: number;
  actualGsm: number;
  targetGsm: number;
  defectsCount: number;
  fourPointScore: number; // Points per 100 sq. yards
  grade: 'Grade A' | 'Grade B' | 'Grade C' | 'Rejected';
  inspector: string;
  date: string;
}

// 4. Apparel Manufacturing Records
export interface SewingLineRecord {
  id: string;
  lineNo: string;
  styleName: string;
  garmentType: 'Polo Shirt' | 'Denim Jeans' | 'Woven Jacket' | 'T-Shirt' | 'Workwear';
  samMinutes: number; // Standard Allowed Minutes
  operatorCount: number;
  targetHourlyQty: number;
  actualHourlyQty: number;
  efficiencyPercent: number;
  defectRatePercent: number;
  supervisor: string;
  date: string;
}

export interface TechPackRecord {
  id: string;
  styleCode: string;
  buyer: string;
  season: 'SS2026' | 'FW2026' | 'Core 2026';
  garmentType: string;
  fabricSpec: string;
  sizeRange: string;
  status: 'Approved' | 'Draft' | 'In Review';
  designer: string;
  date: string;
}

// QR Attendance & Gate Log Records
export interface GateAccessLog {
  id: string;
  personId: string;
  personName: string;
  role: 'Student' | 'Faculty' | 'Staff' | 'Visitor';
  department: string;
  qrCode: string;
  timestamp: string;
  gateLocation: 'Main Gate 1' | 'Textile Lab Complex' | 'Academic Wing' | 'Library Turnstile';
  direction: 'IN' | 'OUT';
  status: 'GRANTED' | 'DENIED' | 'FLAGGED_LATE' | 'OVERRIDE_ADMIN';
  temperatureC?: number;
  photoUrl?: string;
  gatePassNo?: string;
  notes?: string;
}

export interface RegisteredMember {
  id: string;
  rollOrEmpId: string;
  name: string;
  role: 'Student' | 'Faculty' | 'Staff';
  department: DepartmentType | 'General Administration';
  staffCategory?: 'Teacher' | 'Library Staff / User' | 'Physics Lab Staff / User' | 'Office Staff' | 'Lab Technician' | 'Student';
  batchOrDesignation: string;
  email: string;
  phone: string;
  photoUrl?: string;
  qrCodeData: string;
  accessStatus: 'Active' | 'Restricted' | 'Graduated' | 'On Leave';
  lastSeen?: string;
  bloodGroup?: string;
  guardianName?: string;
  guardianPhone?: string;
  semester?: string;
  officeHours?: string;
  assignedClasses?: string[];
  gender?: 'Male' | 'Female' | 'Other';
  // Placement & Internship
  currentPlacement?: string; // e.g. "Executive Engineer at Beximco Textiles Ltd"
  jobDesignation?: string;  // e.g. "Assistant Production Manager"
  jobLocation?: string;     // e.g. "Gazipur, Dhaka"
  internshipStatus?: 'Completed' | 'Ongoing' | 'Upcoming' | 'Not Started' | 'Seeking Placement' | string;
  internshipCompany?: string; // e.g. "Square Fashions Ltd"
  internshipDuration?: string; // e.g. "3 Months (Spring 2026)"
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  department?: string;
}

// Digital Notice Board Record
export interface NoticeRecord {
  id: string;
  title: string;
  category: 'Urgent' | 'Academic & Exams' | 'Fees & Dues' | 'Lab Safety' | 'Events & Workshops' | 'Hostel & Mess' | 'General Notice' | 'Blood Donation & Health' | string;
  author: string;
  department: string;
  date: string;
  content: string;
  priority: 'High' | 'Medium' | 'Normal';
  pdfAttachmentUrl?: string;
  isPublished: boolean;
  targetRole?: 'All' | 'Students' | 'Faculty' | 'Guardians';
  refNo: string;
}

// Academic Events Calendar Record
export interface AcademicEvent {
  id: string;
  title: string;
  eventType: 'Exam' | 'Lab Audit' | 'Industrial Visit' | 'Workshop / Conference' | 'Fee Deadline' | 'Holiday';
  department: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  location: string;
  description: string;
  colorHex?: string;
}

// Guardian Portal Student Fee Status
export interface StudentFeeStatus {
  studentId: string; // matches rollOrEmpId
  studentName: string;
  tuitionFeeUSD: number;
  labFeeUSD: number;
  libraryFeeUSD: number;
  hostelFeeUSD: number;
  paidAmountUSD: number;
  status: 'PAID' | 'PARTIAL' | 'DUE_OVERDUE' | 'WAIVED';
  dueDate: string;
  lastPaymentDate?: string;
  invoiceNo: string;
}

// Guardian Portal Student Grade Record
export interface StudentGradeRecord {
  studentId: string;
  semester: string;
  cgpa: number;
  attendancePercent: number;
  subjects: {
    code: string;
    name: string;
    credits: number;
    grade: string;
    labPerformanceScore: number; // e.g. 92%
    attendancePercent: number; // e.g. 88%
  }[];
}

// Alumni Network Record
export interface AlumniRecord {
  id: string;
  studentId: string;
  name: string;
  passingBatch: string;
  department: string;
  graduationYear: number;
  currentCompany: string;
  currentRole: string;
  jobLocation: string;
  phone: string;
  email: string;
  linkedinUrl?: string;
  mentorshipAvailable: boolean;
  achievements?: string;
  placementType?: string;
  internshipStatus?: string;
  salaryBand?: string;
}

// Red Crescent & Blood Donation Club Member Record
export interface RedCrescentMember {
  id: string;
  studentId: string;
  name: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  department: string;
  batchOrSession?: string;
  phone: string;
  location?: string;
  roleInUnit: 'Volunteer' | 'Unit Leader' | 'Unit Team Lead' | 'First Aid Trainer' | 'First Aid Specialist' | 'Blood Donor Coordinator' | 'Blood Donor' | string;
  lastDonationDate?: string;
  totalDonations: number;
  status: 'Active Volunteer' | 'Emergency On-Call' | 'Available Donor' | 'Available Now' | 'In Cooldown';
  availabilityStatus?: 'Available Now' | 'Emergency Only' | 'Cooldown / Recently Donated';
  gender?: 'Male' | 'Female' | 'Other';
  photoUrl?: string;
  joinDate?: string;
}

// Digital Magazine Archive Record
export interface InstituteMagazine {
  id: string;
  title: string;
  issueNo: string;
  year: number;
  editorInChief: string;
  theme: string;
  summary: string;
  pdfUrl?: string;
  totalPages: number;
  featuredArticle: string;
  coverBadgeColor?: string;
  coverPhotoUrl?: string;
  publishedDate?: string;
}

// Teacher / Staff Late Arrival Alert
export interface TeacherLateAlert {
  id: string;
  teacherId: string;
  teacherName: string;
  department: string;
  arrivalTime: string;
  expectedTime: string;
  date: string;
  gateLocation: string;
  status: 'FLAGGED' | 'EXCUSED' | 'ACKNOWLEDGED';
}

// Guardian Alert Log
export interface GuardianAlert {
  id: string;
  studentId: string;
  studentName: string;
  guardianPhone: string;
  alertType: 'LATE_ARRIVAL' | 'FEE_REMINDER' | 'ATTENDANCE_WARNING' | 'EXAM_NOTICE' | 'CONSECUTIVE_ABSENCE';
  message: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

// 3-Day Consecutive Absence Alert Record
export interface ConsecutiveAbsenceRecord {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  batch: string;
  consecutiveDays: number;
  guardianPhone: string;
  autoSmsStatus: 'DISPATCHED' | 'PENDING' | 'MANUAL_OVERRIDE';
  lastAbsentDate: string;
  alertSentTimestamp: string;
}

// Anonymous Safety Report / Complaint Box Record
export interface SafetyReportComplaint {
  id: string;
  reportType: 'Harassment / Eve Teasing' | 'Hostel / Campus Safety' | 'Ragging / Bullying' | 'Academic Concern' | 'General Safety';
  location: string;
  incidentDate: string;
  description: string;
  urgency: 'Immediate Emergency' | 'High Priority' | 'Standard Review';
  isAnonymous: boolean;
  contactEmailOrPhone?: string; // Optional if student wants follow-up
  status: 'Received' | 'Under Investigation' | 'Resolved' | 'Escalated to Proctor';
  submittedAt: string;
  adminNotes?: string;
}

