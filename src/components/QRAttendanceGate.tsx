import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Building2, 
  UserCheck, 
  Search, 
  Download, 
  Printer, 
  Sparkles, 
  Clock, 
  Key,
  Unlock,
  Radio,
  ScanLine,
  ChevronRight,
  Camera,
  Upload,
  Volume2,
  RefreshCw,
  Play,
  Square
} from 'lucide-react';
import { GateAccessLog, RegisteredMember, TeacherLateAlert, ConsecutiveAbsenceRecord } from '../types';

interface QRAttendanceGateProps {
  gateLogs: GateAccessLog[];
  registeredMembers: RegisteredMember[];
  isMasterAdmin: boolean;
  onScanGatePass: (log: GateAccessLog) => void;
  onOverrideAccess: (logId: string) => void;
  teacherLateAlerts?: TeacherLateAlert[];
  consecutiveAbsences?: ConsecutiveAbsenceRecord[];
  onTriggerAbsenceSms?: (studentId: string) => void;
}

export const QRAttendanceGate: React.FC<QRAttendanceGateProps> = ({
  gateLogs,
  registeredMembers,
  isMasterAdmin,
  onScanGatePass,
  onOverrideAccess,
  teacherLateAlerts = [],
  consecutiveAbsences = [],
  onTriggerAbsenceSms
}) => {
  const [activeGateTab, setActiveGateTab] = useState<'monitor' | 'simulator' | 'deptAnalytics' | 'badgeIssuer' | 'securityAlerts'>('monitor');
  const [isServerGateLocked, setIsServerGateLocked] = useState<boolean>(false);
  const [selectedGate, setSelectedGate] = useState<'Main Gate 1' | 'Textile Lab Complex' | 'Academic Wing' | 'Library Turnstile'>('Main Gate 1');

  const [scanDirection, setScanDirection] = useState<'IN' | 'OUT'>('IN');
  const [selectedMember, setSelectedMember] = useState<RegisteredMember | undefined>(registeredMembers[0]);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [manualQrInput, setManualQrInput] = useState('');
  const [lastScanResult, setLastScanResult] = useState<GateAccessLog | null>(null);
  const [searchLog, setSearchLog] = useState('');
  const [lastScannedQrText, setLastScannedQrText] = useState<string>('');
  const lastScannedCodeRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);

  // Audio Beep Feedback
  const playScanBeep = (granted = true) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(granted ? 880 : 330, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (err) {
      // Audio block ignored
    }
  };

  // Process decoded QR string (from text input, quick select, or file upload)
  const handleProcessScannedQr = (rawCode: string) => {
    if (!rawCode || !rawCode.trim()) return;
    const cleaned = rawCode.trim();

    // Prevent duplicate scans within 2.5 seconds
    const now = Date.now();
    if (lastScannedCodeRef.current === cleaned && (now - lastScannedTimeRef.current) < 2500) {
      return;
    }
    lastScannedCodeRef.current = cleaned;
    lastScannedTimeRef.current = now;
    setLastScannedQrText(cleaned);

    // Look up member
    let member = registeredMembers.find(m => 
      m.qrCodeData === cleaned || 
      m.rollOrEmpId.toLowerCase() === cleaned.toLowerCase() ||
      cleaned.toLowerCase().includes(m.rollOrEmpId.toLowerCase())
    );

    if (!member && cleaned.includes(':')) {
      const parts = cleaned.split(':');
      if (parts.length >= 3) {
        const empId = parts[2] || 'RTI-PASS';
        const name = parts[3] || 'Scanned Gate Pass';
        const roleStr = parts[4] || 'Student';
        member = {
          id: `mem-qr-${Date.now()}`,
          rollOrEmpId: empId,
          name,
          role: roleStr === 'Faculty' ? 'Faculty' : roleStr === 'Staff' ? 'Staff' : 'Student',
          department: 'wet_processing',
          batchOrDesignation: 'Scanned Pass',
          email: `${empId.toLowerCase()}@rangpurtextile.edu.bd`,
          phone: '+8801700000000',
          photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
          qrCodeData: cleaned,
          accessStatus: 'Active',
          lastSeen: 'Just Scanned'
        };
      }
    }

    if (!member) {
      member = {
        id: `mem-guest-${Date.now()}`,
        rollOrEmpId: cleaned.slice(0, 16) || 'GUEST-SCAN',
        name: `Scanned Member (${cleaned.slice(0, 12)})`,
        role: 'Student',
        department: 'wet_processing',
        batchOrDesignation: 'QR Scan Pass',
        email: 'pass@rangpurtextile.edu.bd',
        phone: '+8801700000000',
        photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleaned)}`,
        qrCodeData: cleaned,
        accessStatus: 'Active',
        lastSeen: 'Just Scanned'
      };
    }

    playScanBeep(member.accessStatus !== 'Restricted');
    handleExecuteScan(member);
  };

  // Decode Image File containing QR
  const handleImageFileQrDecode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleProcessScannedQr(code.data);
          } else {
            alert('⚠️ No readable QR code detected in the uploaded image. Please ensure the QR code badge is clearly visible.');
          }
        }
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Bulk / Manual Gate Entry Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');

  // Manual Entry Form State
  const [manualName, setManualName] = useState('');
  const [manualId, setManualId] = useState('');
  const [manualRole, setManualRole] = useState<'Student' | 'Faculty' | 'Staff'>('Student');
  const [manualGateLoc, setManualGateLoc] = useState<GateAccessLog['gateLocation']>('Main Gate 1');
  const [manualDir, setManualDir] = useState<'IN' | 'OUT'>('IN');
  const [manualStatus, setManualStatus] = useState<GateAccessLog['status']>('GRANTED');
  const [manualPhotoUrl, setManualPhotoUrl] = useState('');

  const handleManualPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setManualPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!selectedMember && registeredMembers.length > 0) {
      setSelectedMember(registeredMembers[0]);
    }
  }, [registeredMembers]);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas ref for generating QR Code badge
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedMember && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, selectedMember.qrCodeData, {
        width: 180,
        margin: 1,
        color: {
          dark: '#1E1B4B',
          light: '#FFFFFF'
        }
      }, (err) => {
        if (err) console.error(err);
      });
    }
  }, [selectedMember, activeGateTab]);

  const [showScanResultModal, setShowScanResultModal] = useState(false);

  // Execute scan simulation
  const handleExecuteScan = (memberToScan?: RegisteredMember) => {
    const member = memberToScan || selectedMember || registeredMembers[0];
    if (!member) {
      alert('Please register at least one student or faculty member first before recording attendance scans.');
      return;
    }
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    // Determine status (Late if IN scan after 9:00 AM for students)
    const isLate = scanDirection === 'IN' && now.getHours() >= 9;
    const isRestricted = member.accessStatus === 'Restricted';

    let status: GateAccessLog['status'] = 'GRANTED';
    let notes = 'Successful turnstile validation.';

    if (isRestricted) {
      status = 'DENIED';
      notes = 'Access restricted by Registrar / Fee dues flag.';
    } else if (isLate && member.role === 'Student') {
      status = 'FLAGGED_LATE';
      notes = 'Arrived after 09:00 AM class cutoff.';
    }

    const photoToUse = uploadedPhotoUrl || member.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`;

    const newLog: GateAccessLog = {
      id: `gt-${Date.now()}`,
      personId: member.rollOrEmpId,
      personName: member.name,
      role: member.role,
      department: member.department,
      qrCode: member.qrCodeData,
      timestamp: `${dateStr} ${timeStr}`,
      gateLocation: selectedGate,
      direction: scanDirection,
      status,
      temperatureC: Number((36.3 + Math.random() * 0.5).toFixed(1)),
      photoUrl: photoToUse,
      notes
    };

    onScanGatePass(newLog);
    setLastScanResult(newLog);
    setShowScanResultModal(true);
  };

  const handleManualEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const log: GateAccessLog = {
      id: `gt-${Date.now()}`,
      personId: manualId || `RTI-MAN-${Math.floor(1000 + Math.random() * 9000)}`,
      personName: manualName,
      role: manualRole,
      department: 'wet_processing',
      qrCode: `RTI:MANUAL:${manualId}:${manualName}`,
      timestamp: `${dateStr} ${timeStr}`,
      gateLocation: manualGateLoc,
      direction: manualDir,
      status: manualStatus,
      temperatureC: 36.5,
      photoUrl: manualPhotoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(manualName)}`,
      notes: 'Manually logged by Admin.'
    };

    onScanGatePass(log);
    setShowManualModal(false);
    setManualName('');
    setManualId('');
    setManualPhotoUrl('');
  };

  const handleBulkGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkCsvText.trim()) return;

    const lines = bulkCsvText.trim().split('\n');
    let count = 0;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    lines.forEach((line, idx) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 2) return;

      const personName = parts[0];
      const personId = parts[1];
      const roleStr = parts[2] || 'Student';
      const dirStr = (parts[3] === 'OUT' ? 'OUT' : 'IN') as 'IN' | 'OUT';
      const gateLoc = (parts[4] as any) || 'Main Gate 1';
      const statusStr = (parts[5] as any) || 'GRANTED';

      const log: GateAccessLog = {
        id: `gt-bulk-${Date.now()}-${idx}`,
        personId,
        personName,
        role: roleStr as any,
        department: 'wet_processing',
        qrCode: `RTI:BULK:${personId}`,
        timestamp: `${dateStr} ${now.toLocaleTimeString('en-US')}`,
        gateLocation: gateLoc,
        direction: dirStr,
        status: statusStr,
        temperatureC: 36.6,
        photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(personName)}`,
        notes: 'Bulk imported attendance log.'
      };

      onScanGatePass(log);
      count++;
    });

    alert(`Successfully imported ${count} gate access log(s).`);
    setBulkCsvText('');
    setShowBulkModal(false);
  };

  const activeOnCampusCount = gateLogs.filter(l => l.direction === 'IN' && l.status === 'GRANTED').length;
  const lateCountToday = gateLogs.filter(l => l.status === 'FLAGGED_LATE').length;

  const filteredLogs = gateLogs.filter(
    l => l.personName.toLowerCase().includes(searchLog.toLowerCase()) ||
         l.personId.toLowerCase().includes(searchLog.toLowerCase()) ||
         l.gateLocation.toLowerCase().includes(searchLog.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <QrCode className="w-64 h-64 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Automated Security OS
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-mono flex items-center space-x-2">
                  <span>QR Attendance & Live Campus Gate Monitor</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl">
              Real-time RFID & QR turnstile access monitor across Main Gate, Textile Labs, Academic Wing, & Library. Features instant QR ID pass generator & scanner.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setShowManualModal(true)}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-xs shadow-md"
            >
              <UserCheck className="w-4 h-4" />
              <span>+ Manual Log Entry</span>
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all text-xs"
            >
              <span>📥 Bulk Import Logs</span>
            </button>
            <button
              onClick={() => setActiveGateTab('simulator')}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all text-xs"
            >
              <ScanLine className="w-4 h-4" />
              <span>Launch Live QR Scanner</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-900/60">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-800/40">
            <div className="text-xs text-emerald-300 font-medium">Active On-Site Campus</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{activeOnCampusCount} Inside</div>
            <div className="text-[10px] text-slate-400 mt-1">Calculated from Live Gate Logs</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-800/40">
            <div className="text-xs text-emerald-300 font-medium">Late Arrival Alerts Today</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">{lateCountToday} Flagged</div>
            <div className="text-[10px] text-amber-300 mt-1">Class Cutoff Flagged</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-800/40">
            <div className="text-xs text-emerald-300 font-medium">Turnstiles Status</div>
            <div className="text-xl font-bold text-emerald-300 font-mono mt-0.5">4 / 4 ONLINE</div>
            <div className="text-[10px] text-emerald-200 mt-1">Optical Sensors Active</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-800/40">
            <div className="text-xs text-emerald-300 font-medium">Thermal Body Scanner</div>
            <div className="text-xl font-bold text-teal-300 font-mono mt-0.5">36.5°C Avg</div>
            <div className="text-[10px] text-slate-400 mt-1">Automatic Thermal Check</div>
          </div>
        </div>
      </div>

      {/* Sub Tab Buttons */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
        <div className="flex flex-wrap space-x-2">
          <button
            onClick={() => setActiveGateTab('monitor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGateTab === 'monitor'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Live Turnstile Log ({gateLogs.length})
          </button>
          <button
            onClick={() => setActiveGateTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGateTab === 'simulator'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Instant QR Scanner Simulator
          </button>
          <button
            onClick={() => setActiveGateTab('deptAnalytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGateTab === 'deptAnalytics'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            📊 Dept Attendance Stats Chart
          </button>
          <button
            onClick={() => setActiveGateTab('badgeIssuer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGateTab === 'badgeIssuer'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🪪 ID Badge Issuer
          </button>
          <button
            onClick={() => setActiveGateTab('securityAlerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeGateTab === 'securityAlerts'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Late Teachers & Auto-SMS ({teacherLateAlerts.length + consecutiveAbsences.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsServerGateLocked(!isServerGateLocked)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
              isServerGateLocked
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
            }`}
          >
            {isServerGateLocked ? (
              <>
                <Key className="w-3.5 h-3.5 text-rose-400" />
                <span>Curfew Gate LOCKED (Server Time)</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gates UNLOCKED</span>
              </>
            )}
          </button>

          <div className="relative w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search log..."
              value={searchLog}
              onChange={e => setSearchLog(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>


      {/* VIEW 1: Live Gate Stream */}
      {activeGateTab === 'monitor' && (
        <div className="space-y-6">
          {/* Turnstile Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['Main Gate 1', 'Textile Lab Complex', 'Academic Wing', 'Library Turnstile'] as const).map(gate => {
              const gateLogsCount = gateLogs.filter(l => l.gateLocation === gate).length;
              return (
                <div key={gate} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{gate}</span>
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <div className="text-xs text-slate-500">Scan Activity Today:</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">{gateLogsCount} Scans</div>
                </div>
              );
            })}
          </div>

          {/* Table of Scans */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Real-Time Turnstile Access Logs</span>
              </h3>
              <span className="text-xs text-slate-500">{filteredLogs.length} entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Photo / ID</th>
                    <th className="py-3.5 px-4">Member Name / Roll ID</th>
                    <th className="py-3.5 px-4">Role & Dept</th>
                    <th className="py-3.5 px-4">Gate Location</th>
                    <th className="py-3.5 px-4">Direction & Time</th>
                    <th className="py-3.5 px-4">Temp (°C)</th>
                    <th className="py-3.5 px-4">Access Status</th>
                    <th className="py-3.5 px-4">Notes</th>
                    {isMasterAdmin && <th className="py-3.5 px-4 text-right">Master Admin</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLogs.map(log => {
                    const avatarSrc = log.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(log.personName)}`;
                    return (
                    <tr key={log.id} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <img
                          src={avatarSrc}
                          alt={log.personName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{log.personName}</div>
                        <div className="font-mono text-[11px] text-slate-500">{log.personId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-800 mb-0.5">
                          {log.role}
                        </span>
                        <div className="text-[10px] text-slate-500 capitalize">{log.department.replace('_', ' ')}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {log.gateLocation}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                          log.direction === 'IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {log.direction}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">{log.timestamp}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {log.temperatureC ? `${log.temperatureC}°C` : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          log.status === 'GRANTED' ? 'bg-emerald-100 text-emerald-800' :
                          log.status === 'FLAGGED_LATE' ? 'bg-amber-100 text-amber-800' :
                          log.status === 'OVERRIDE_ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          <span>{log.status.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {log.notes || '-'}
                      </td>
                      {isMasterAdmin && (
                        <td className="py-3.5 px-4 text-right">
                          {log.status !== 'GRANTED' && (
                            <button
                              onClick={() => onOverrideAccess(log.id)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] shadow-sm transition-all"
                            >
                              Force Override
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Instant Digital QR & Roll Attendance Terminal */}
      {activeGateTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Digital Terminal Controls */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Terminal Header & Status Panel */}
            <div className="bg-slate-950 rounded-2xl border-2 border-emerald-500/50 p-4 text-white shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <ScanLine className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="font-extrabold text-xs text-emerald-400 font-mono uppercase tracking-wider">
                    RTI DIGITAL ATTENDANCE TERMINAL
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ● TERMINAL READY
                  </span>
                </div>
              </div>

              {/* Instant Scan Terminal Input HUD */}
              <div className="mt-4 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                    <span>⚡ Quick Scan / Barcode / Roll Number Input</span>
                    <span className="text-[10px] font-normal text-emerald-400 font-mono">Press [ENTER] to Log</span>
                  </label>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (manualQrInput.trim()) {
                        handleProcessScannedQr(manualQrInput.trim());
                        setManualQrInput('');
                      }
                    }}
                    className="flex space-x-2"
                  >
                    <input
                      type="text"
                      placeholder="Enter Student Roll, Faculty ID, or QR string..."
                      value={manualQrInput}
                      onChange={e => setManualQrInput(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-white font-mono text-xs rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md shrink-0 flex items-center space-x-1.5"
                    >
                      <ScanLine className="w-4 h-4" />
                      <span>Scan & Log</span>
                    </button>
                  </form>
                </div>

                {lastScannedQrText && (
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">Last Processed Code:</span>
                    <span className="font-mono font-bold text-emerald-300">{lastScannedQrText}</span>
                  </div>
                )}
              </div>

              {/* Selected Gate & Direction Bar */}
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Target Gate Turnstile</label>
                  <select
                    value={selectedGate}
                    onChange={e => setSelectedGate(e.target.value as any)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 text-white font-bold text-xs rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Main Gate 1">Main Gate 1 (North Entrance)</option>
                    <option value="Textile Lab Complex">Textile Lab Complex Turnstile</option>
                    <option value="Academic Wing">Academic Wing Central Hall</option>
                    <option value="Library Turnstile">Library & Resource Hub</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Turnstile Direction</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setScanDirection('IN')}
                      className={`py-2 rounded-xl font-bold text-xs transition-all ${
                        scanDirection === 'IN' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      ENTRY (IN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setScanDirection('OUT')}
                      className={`py-2 rounded-xl font-bold text-xs transition-all ${
                        scanDirection === 'OUT' ? 'bg-slate-700 text-white shadow-md' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      EXIT (OUT)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Fallback Option 1: Manual Input & Image QR Decoder */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <ScanLine className="w-4 h-4 text-purple-600" />
                <span>Fallback Scanners (Instant Manual Input & Image Upload)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Manual Text / QR Code Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (manualQrInput) {
                      handleProcessScannedQr(manualQrInput);
                      setManualQrInput('');
                    }
                  }}
                  className="space-y-1.5"
                >
                  <label className="block text-xs font-bold text-slate-700">1. Instant QR / Member ID Input</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Paste QR Code or ID (e.g. RTI-REG-1002)..."
                      value={manualQrInput}
                      onChange={e => setManualQrInput(e.target.value)}
                      className="flex-1 p-2.5 bg-slate-950 border border-slate-700 text-white font-mono text-xs rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md shrink-0"
                    >
                      Scan & Verify
                    </button>
                  </div>
                </form>

                {/* Upload Image Containing QR Code */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">2. Upload QR Badge Image File</label>
                  <label className="flex items-center justify-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-700">Select Image to Decode QR</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileQrDecode}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Fallback Option 3: Quick Test Member Badges */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">3. One-Click Quick Test Badges</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {registeredMembers.map(mem => (
                    <button
                      key={mem.id}
                      onClick={() => handleProcessScannedQr(mem.qrCodeData || mem.rollOrEmpId)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 text-left transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={mem.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(mem.name)}`}
                          alt={mem.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div className="truncate">
                          <div className="font-bold text-slate-900 text-xs truncate">{mem.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">{mem.rollOrEmpId} • {mem.role}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-time Turnstile Result Display */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>LIVE TURNSTILE SCAN FEEDBACK</span>
                </h4>
                {lastScannedQrText && (
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                    Last: {lastScannedQrText}
                  </span>
                )}
              </div>

              {lastScanResult ? (
                <div className={`p-6 rounded-2xl border text-center space-y-4 ${
                  lastScanResult.status === 'GRANTED' ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-200' :
                  lastScanResult.status === 'FLAGGED_LATE' ? 'bg-amber-950/90 border-amber-500/80 text-amber-200' :
                  'bg-rose-950/90 border-rose-500/80 text-rose-200'
                }`}>
                  <div className="flex justify-center relative">
                    <img
                      src={lastScanResult.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(lastScanResult.personName)}`}
                      alt={lastScanResult.personName}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-emerald-400 shadow-xl shadow-emerald-500/20"
                    />
                    <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase font-mono shadow">
                      VERIFIED
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="text-2xl font-black font-mono tracking-tight text-white">
                      CHECKED-{lastScanResult.direction} ({lastScanResult.status.replace('_', ' ')})
                    </div>
                    <div className="text-lg font-extrabold text-emerald-300 mt-1">
                      {lastScanResult.personName}
                    </div>
                    <div className="text-xs font-mono text-slate-300 mt-0.5">
                      ID: {lastScanResult.personId} • {lastScanResult.role}
                    </div>
                  </div>

                  <div className="text-xs opacity-90 font-mono bg-slate-950/60 p-2.5 rounded-xl text-slate-200 space-y-1">
                    <div>Location: <span className="font-bold text-white">{lastScanResult.gateLocation}</span></div>
                    <div>Timestamp: <span className="text-emerald-300">{lastScanResult.timestamp}</span></div>
                    <div>Thermal Body Temp: <span className="text-teal-300">{lastScanResult.temperatureC}°C Normal</span></div>
                  </div>

                  <p className="text-xs italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                    "{lastScanResult.notes}"
                  </p>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <QrCode className="w-8 h-8 text-emerald-400 opacity-60 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-300">Auto-Scanner Ready & Listening</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Present any member QR code badge to your web camera, upload an image file, or paste code above.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between font-mono">
              <span>Rangpur Textile Institute Gate Node #01</span>
              <span className="text-emerald-400 font-bold">Hardware: ONLINE (WebRTC + jsQR)</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Department Attendance Statistics Visual Graph/Chart */}
      {activeGateTab === 'deptAnalytics' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Department-wise Attendance Statistics & Visual Chart</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time attendance rates and gate scan telemetry breakdown across all academic departments.</p>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 font-mono text-xs font-bold rounded-lg">
              Overall Campus Rate: 95.8%
            </span>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { dept: 'Wet Processing', code: 'wet_processing', rate: 96.2, present: 310, late: 12, absent: 8, color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-700' },
              { dept: 'Yarn Manufacturing', code: 'yarn_mfg', rate: 94.8, present: 285, late: 15, absent: 11, color: 'from-indigo-500 to-purple-600', textColor: 'text-indigo-700' },
              { dept: 'Fabric Manufacturing', code: 'fabric_mfg', rate: 95.5, present: 298, late: 10, absent: 9, color: 'from-teal-500 to-cyan-600', textColor: 'text-teal-700' },
              { dept: 'Apparel Engineering', code: 'apparel_mfg', rate: 97.1, present: 340, late: 8, absent: 6, color: 'from-purple-500 to-pink-600', textColor: 'text-purple-700' },
            ].map(d => (
              <div key={d.code} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">{d.dept}</span>
                  <span className={`text-xs font-black font-mono ${d.textColor}`}>{d.rate}%</span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${d.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${d.rate}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono font-bold text-center pt-1 border-t border-slate-200">
                  <div className="bg-emerald-100 text-emerald-800 p-1 rounded">
                    <div>P</div>
                    <div>{d.present}</div>
                  </div>
                  <div className="bg-amber-100 text-amber-800 p-1 rounded">
                    <div>L</div>
                    <div>{d.late}</div>
                  </div>
                  <div className="bg-rose-100 text-rose-800 p-1 rounded">
                    <div>A</div>
                    <div>{d.absent}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SVG Visual Graph Representation */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Department Attendance Comparison Bar Graph
            </h4>

            <div className="space-y-4 pt-2">
              {[
                { name: 'Wet Processing Dept', percent: 96.2, bg: 'bg-emerald-500', val: '310 Present / 330 Total' },
                { name: 'Yarn Manufacturing Dept', percent: 94.8, bg: 'bg-indigo-500', val: '285 Present / 311 Total' },
                { name: 'Fabric Manufacturing Dept', percent: 95.5, bg: 'bg-teal-500', val: '298 Present / 317 Total' },
                { name: 'Apparel Engineering Dept', percent: 97.1, bg: 'bg-purple-500', val: '340 Present / 354 Total' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{item.name}</span>
                    <span className="font-mono font-bold text-emerald-400">{item.percent}% ({item.val})</span>
                  </div>
                  <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className={`h-full ${item.bg} rounded-full transition-all duration-700`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Badge Issuer & Generator */}
      {activeGateTab === 'badgeIssuer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Select Student or Faculty Member</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {registeredMembers.map(mem => (
                <button
                  key={mem.id}
                  onClick={() => setSelectedMember(mem)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    selectedMember.id === mem.id 
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs">{mem.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{mem.rollOrEmpId} • {mem.batchOrDesignation}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Printable Badge Preview */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center">
            {/* Visual ID Card Card */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border-2 border-indigo-500/50 rounded-2xl w-80 p-5 text-white shadow-2xl relative overflow-hidden">
              <div className="text-center pb-3 border-b border-indigo-800/60">
                <div className="font-black font-mono text-base tracking-widest text-sky-400">RANGPUR TEXTILE</div>
                <div className="text-[9px] uppercase font-bold text-indigo-300">Textile Institute Official ID</div>
              </div>

              <div className="flex flex-col items-center my-4 space-y-3">
                {/* Canvas QR Render */}
                <div className="p-2 bg-white rounded-xl shadow-lg border border-indigo-200">
                  <canvas ref={canvasRef} className="w-32 h-32"></canvas>
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-sm text-white">{selectedMember.name}</h4>
                  <p className="font-mono text-xs text-sky-300 font-bold">{selectedMember.rollOrEmpId}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-indigo-500 text-white">
                    {selectedMember.role}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-indigo-800/60 text-[10px] text-indigo-200 flex justify-between">
                <span>Dept: {selectedMember.department}</span>
                <span>STATUS: ACTIVE</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Official QR Access Badge ready for smart gate turnstiles.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 4: Late Teachers & Auto-SMS Alerts */}
      {activeGateTab === 'securityAlerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Late Teachers Monitoring Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Late Teacher Arrivals (Departmental Cutoff: 08:30 AM)</span>
              </h3>
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold font-mono">
                {teacherLateAlerts.length} Flagged
              </span>
            </div>

            <div className="space-y-3">
              {teacherLateAlerts.map(alert => (
                <div key={alert.id} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{alert.teacherName} ({alert.employeeId})</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{alert.department} • Scheduled: {alert.scheduledTime}</div>
                    <div className="text-[11px] font-semibold text-amber-800 mt-1">
                      Actual Arrival: <span className="font-mono font-bold text-rose-600">{alert.actualTime}</span> ({alert.delayMinutes} mins late)
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-mono text-[10px] font-bold rounded">
                    FLAGGED
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Consecutive-Day Absence & Guardian Auto-SMS Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>3-Consecutive-Day Absence & Auto-SMS Alerts</span>
              </h3>
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full text-xs font-bold font-mono">
                {consecutiveAbsences.length} Triggers
              </span>
            </div>

            <div className="space-y-3">
              {consecutiveAbsences.map(rec => (
                <div key={rec.id} className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{rec.studentName} ({rec.studentId})</div>
                      <div className="text-[10px] text-slate-500">{rec.department} • Batch {rec.batch}</div>
                      <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
                        Consecutive Days Absent: <span className="font-bold font-mono">{rec.consecutiveDays} Days</span> ({rec.datesAbsent.join(', ')})
                      </div>
                    </div>
                    {rec.autoSmsSent ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>SMS Dispatched</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onTriggerAbsenceSms && onTriggerAbsenceSms(rec.studentId)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-all"
                      >
                        Dispatch Auto-SMS
                      </button>
                    )}
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-rose-200 text-[10px] text-slate-600 font-mono">
                    Guardian Contact: {rec.guardianPhone}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-mono font-bold text-base text-white">+ Manual Gate Attendance Entry</h3>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleManualEntrySubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold text-xs mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shakil Ahmed"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold text-xs mb-1">ID / Roll No *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RTI-STU-8821"
                  value={manualId}
                  onChange={e => setManualId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold text-xs mb-1">Role</label>
                  <select
                    value={manualRole}
                    onChange={e => setManualRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold text-xs mb-1">Direction</label>
                  <select
                    value={manualDir}
                    onChange={e => setManualDir(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white"
                  >
                    <option value="IN">IN (Entry)</option>
                    <option value="OUT">OUT (Exit)</option>
                  </select>
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="block text-slate-300 font-bold text-xs">Person Photo (Upload Picture)</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center justify-center overflow-hidden flex-shrink-0">
                    {manualPhotoUrl ? (
                      <img src={manualPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>📷</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleManualPhotoUpload}
                      className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-purple-900 file:text-purple-200 hover:file:bg-purple-800 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste image URL..."
                      value={manualPhotoUrl}
                      onChange={e => setManualPhotoUrl(e.target.value)}
                      className="w-full p-1 bg-slate-900 border border-slate-800 text-white rounded-lg text-[10px] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold text-xs mb-1">Gate Location</label>
                  <select
                    value={manualGateLoc}
                    onChange={e => setManualGateLoc(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white"
                  >
                    <option value="Main Gate 1">Main Gate 1</option>
                    <option value="Textile Lab Complex">Textile Lab Complex</option>
                    <option value="Academic Wing">Academic Wing</option>
                    <option value="Library Turnstile">Library Turnstile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold text-xs mb-1">Status</label>
                  <select
                    value={manualStatus}
                    onChange={e => setManualStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white"
                  >
                    <option value="GRANTED">GRANTED</option>
                    <option value="FLAGGED_LATE">FLAGGED_LATE</option>
                    <option value="DENIED">DENIED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Attendance Logs Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-mono font-bold text-base text-white">📥 Bulk Import Gate Attendance Logs</h3>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Paste lines of attendance logs in CSV format:
              <br />
              <span className="font-mono text-[11px] text-emerald-400">Person Name, ID/Roll, Role, Direction(IN/OUT), Gate Location, Status(GRANTED/FLAGGED_LATE/DENIED)</span>
            </p>

            <button
              type="button"
              onClick={() => {
                setBulkCsvText(
                  `Tanvir Ahmed, RTI-STU-1001, Student, IN, Main Gate 1, GRANTED\n` +
                  `Dr. Sharmin Akter, RTI-FAC-2001, Faculty, IN, Textile Lab Complex, GRANTED\n` +
                  `Mahmud Hasan, RTI-STU-1002, Student, IN, Main Gate 1, FLAGGED_LATE`
                );
              }}
              className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-xs"
            >
              ⚡ Insert Sample Attendance Template
            </button>

            <form onSubmit={handleBulkGateSubmit} className="space-y-4">
              <textarea
                rows={7}
                value={bulkCsvText}
                onChange={e => setBulkCsvText(e.target.value)}
                placeholder="Tanvir Ahmed, RTI-STU-1001, Student, IN, Main Gate 1, GRANTED&#10;Dr. Sharmin Akter, RTI-FAC-2001, Faculty, IN, Textile Lab Complex, GRANTED"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-white focus:ring-2 focus:ring-emerald-500 placeholder-slate-600"
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-mono">
                  {bulkCsvText.trim() ? `${bulkCsvText.trim().split('\n').length} record(s) ready` : 'Ready to import'}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30"
                  >
                    Import All Logs
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Real-time Turnstile Verification Modal Popup */}
      {showScanResultModal && lastScanResult && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 text-white shadow-2xl space-y-4 sm:space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">
                  TURNSTILE SCAN VERIFICATION
                </span>
              </div>
              <button
                onClick={() => setShowScanResultModal(false)}
                className="text-slate-400 hover:text-white font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Profile Photo & Large Verification Card */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative">
                <img
                  src={lastScanResult.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(lastScanResult.personName)}`}
                  alt={lastScanResult.personName}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-emerald-400 shadow-xl shadow-emerald-500/20"
                />
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                  VERIFIED
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white tracking-tight">{lastScanResult.personName}</h3>
                <div className="font-mono text-xs text-emerald-300 font-bold mt-0.5">
                  ID: {lastScanResult.personId} • {lastScanResult.role}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Department: <span className="text-slate-200 font-semibold uppercase">{lastScanResult.department.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Direction & Status Big Badge */}
              <div className={`w-full py-3 px-4 rounded-2xl border text-center font-mono space-y-1 ${
                lastScanResult.status === 'GRANTED' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200' :
                lastScanResult.status === 'FLAGGED_LATE' ? 'bg-amber-950/90 border-amber-500 text-amber-200' :
                'bg-rose-950/90 border-rose-500 text-rose-200'
              }`}>
                <div className="text-2xl font-black tracking-wider flex items-center justify-center space-x-2">
                  <span>Checked-{lastScanResult.direction}</span>
                  <span className="text-lg">
                    ({lastScanResult.status === 'GRANTED' ? 'SUCCESS' : lastScanResult.status})
                  </span>
                </div>
                <div className="text-xs font-bold opacity-90">
                  {lastScanResult.gateLocation} • {lastScanResult.timestamp}
                </div>
              </div>

              {/* Notification Dispatch Alert */}
              <div className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center justify-between">
                  <span>AUTOMATED DISPATCH NOTIFICATION</span>
                  <span className="px-1.5 py-0.5 bg-purple-500/20 rounded text-purple-300">SENT</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug font-mono">
                  {lastScanResult.role === 'Student' ? (
                    <span>📱 Parent/Guardian SMS auto-dispatched to registered phone with timestamp & status.</span>
                  ) : (
                    <span>📋 Faculty/Staff gate event logged into System Audit Trail for Admin review.</span>
                  )}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">Rangpur Textile Institute Security Turnstile</span>
              <button
                onClick={() => setShowScanResultModal(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

