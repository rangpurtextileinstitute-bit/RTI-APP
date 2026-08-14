import React, { useState, useEffect } from 'react';
import { 
  Video, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  Maximize2, 
  RefreshCw, 
  Lock, 
  Radio, 
  Play, 
  Pause, 
  Camera, 
  Compass, 
  Activity, 
  Sun, 
  Moon, 
  Zap, 
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Building,
  SlidersHorizontal,
  Flame,
  Volume2
} from 'lucide-react';

interface CCTVMonitoringProps {
  activeRole: string;
  isMasterAdmin: boolean;
}

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'RECORDING' | 'MOTION_DETECTED' | 'MAINTENANCE';
  fps: number;
  resolution: string;
  sensorData: string;
  overlayText: string;
  gradientFrom: string;
  gradientTo: string;
}

const INITIAL_CAMERAS: CameraFeed[] = [
  {
    id: 'cam-01',
    name: 'CAM-01: Main Gate 1 Turnstile & Security Checkpoint',
    location: 'Main Entrance & Vehicle Barrier',
    status: 'RECORDING',
    fps: 30,
    resolution: '4K UltraHD (3840x2160)',
    sensorData: 'Turnstile Active • Plate OCR Enabled',
    overlayText: 'GATE 1 ENTRY • LIVE ANPR',
    gradientFrom: 'from-slate-900',
    gradientTo: 'to-purple-950'
  },
  {
    id: 'cam-02',
    name: 'CAM-02: Wet Processing Dyeing & Bleaching Lab',
    location: 'Chemical Hall & Stenter Range',
    status: 'RECORDING',
    fps: 25,
    resolution: '1080p Full HD',
    sensorData: 'Bath Temp: 85°C • pH Sensor: 7.2',
    overlayText: 'DYEING COMPLEX 03 • TEMP NOMINAL',
    gradientFrom: 'from-sky-950',
    gradientTo: 'to-indigo-950'
  },
  {
    id: 'cam-03',
    name: 'CAM-03: Yarn Mfg Spinning Pilot Mill Floor',
    location: 'Ring Frame & Compact Spinning Line',
    status: 'RECORDING',
    fps: 60,
    resolution: '1080p High Speed',
    sensorData: 'Spindle RPM: 18,500 • Humidity: 65%',
    overlayText: 'SPINNING HALL 01 • USTER SENSOR ON',
    gradientFrom: 'from-purple-950',
    gradientTo: 'to-slate-900'
  },
  {
    id: 'cam-04',
    name: 'CAM-04: Fabric Mfg Air-Jet & Rapier Loom Floor',
    location: 'Weaving Shed & Warp Prep',
    status: 'MOTION_DETECTED',
    fps: 30,
    resolution: '1080p Full HD',
    sensorData: 'Loom Speed: 750 RPM • Weft Fault: 0',
    overlayText: 'WEAVING SHED B • MOTION TRACKING',
    gradientFrom: 'from-indigo-950',
    gradientTo: 'to-violet-950'
  },
  {
    id: 'cam-05',
    name: 'CAM-05: Apparel Cutting & Sewing Line Studio',
    location: 'Garment Sewing Line & CAD Room',
    status: 'RECORDING',
    fps: 30,
    resolution: '1080p Full HD',
    sensorData: 'Sewing Efficiency: 88.4% • Line 02 Active',
    overlayText: 'APPAREL STUDIO 02 • SAM CALCULATOR LINKED',
    gradientFrom: 'from-slate-950',
    gradientTo: 'to-blue-950'
  },
  {
    id: 'cam-06',
    name: 'CAM-06: Central Library & Digital Reading Corridor',
    location: 'Library Hall 2nd Floor',
    status: 'RECORDING',
    fps: 24,
    resolution: '1080p Full HD',
    sensorData: 'Decibels: 32 dB (Quiet) • Occupancy: 42',
    overlayText: 'LIBRARY MAIN HALL • QUIET ZONE',
    gradientFrom: 'from-slate-900',
    gradientTo: 'to-emerald-950'
  }
];

export const CCTVMonitoring: React.FC<CCTVMonitoringProps> = ({
  activeRole,
  isMasterAdmin
}) => {
  // Authorization check
  const isAuthorized = isMasterAdmin || ['Super Admin', 'Dept Admin', 'Teacher', 'Security', 'Staff'].includes(activeRole);

  const [cameras, setCameras] = useState<CameraFeed[]>(INITIAL_CAMERAS);
  const [selectedCam, setSelectedCam] = useState<CameraFeed | null>(null);
  const [gridMode, setGridMode] = useState<'2x2' | '3x2' | 'FOCUS'>('3x2');
  const [nightVision, setNightVision] = useState(false);
  const [motionBox, setMotionBox] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [ptzPreset, setPtzPreset] = useState('Center Gate');
  const [logs, setLogs] = useState<string[]>([
    '21:50:02 - [CAM-01] Vehicle License Plate recognized: RANGPUR-HA-1102 (Institute Bus)',
    '21:48:15 - [CAM-02] Dyeing kettle #3 bath temperature normalized at 85.0°C',
    '21:45:30 - [CAM-04] Motion alert in Rapier loom row 2 (Loom Master Inspection)',
    '21:40:12 - [CAM-03] Spinning mill relative humidity stable at 65.2%'
  ]);

  // Simulate periodic motion detection alerts
  useEffect(() => {
    const timer = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const randomCam = cameras[Math.floor(Math.random() * cameras.length)];
      const newLog = `${timestamp} - [${randomCam.id.toUpperCase()}] Telemetry pulse nominal • Camera feed synchronized`;
      setLogs(prev => [newLog, ...prev.slice(0, 10)]);
    }, 12000);
    return () => clearInterval(timer);
  }, [cameras]);

  const triggerSnapshot = (camName: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`${timestamp} - 📸 SNAPSHOT SAVED: ${camName} (Stored in RTI Encrypted Vault)`, ...prev]);
    alert(`Snapshot successfully taken from ${camName} and logged in security archive.`);
  };

  if (!isAuthorized) {
    return (
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6 max-w-3xl mx-auto my-8">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400">
            <Lock className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/20 text-red-300 border border-red-500/30">
              RESTRICTED ACCESS ZONE
            </span>
            <h2 className="text-xl font-black text-white mt-1">CCTV Live Surveillance Stream Locked</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Access to live IP surveillance feeds across campus labs and main gates is restricted to Principal, Security Officers, Department Admins, and Master Admin.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-300 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Current Role: <span className="text-purple-400 font-mono font-bold">{activeRole}</span></span>
          </div>
          <p className="text-slate-400 text-xs">
            To view live surveillance streams, please switch your role to <span className="text-white font-bold">Security / Super Admin / Dept Admin</span> in the top header bar, or toggle <span className="text-purple-400 font-bold">Master Control Override</span> at top-right.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Surveillance Controls */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-indigo-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-bold text-purple-300 mb-2">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>RTI Security Operations Center (SOC)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wide flex items-center space-x-2">
            <Video className="w-6 h-6 text-purple-400" />
            <span>Live CCTV & Campus Security Feed</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time IP surveillance across 6 critical lab complexes, spinning mills, loom sheds, and main gates.
          </p>
        </div>

        {/* Display controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Grid Mode Selector */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
            <button
              onClick={() => setGridMode('3x2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                gridMode === '3x2' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              6 Grid (3x2)
            </button>
            <button
              onClick={() => setGridMode('2x2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                gridMode === '2x2' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              4 Grid (2x2)
            </button>
          </div>

          {/* Night Vision IR Toggle */}
          <button
            onClick={() => setNightVision(!nightVision)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              nightVision
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {nightVision ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>{nightVision ? 'Infrared NightVision ON' : 'Day Spectrum Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Camera Video Grid */}
      <div className={`grid gap-4 ${
        gridMode === '3x2' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
      }`}>
        {cameras.slice(0, gridMode === '2x2' ? 4 : 6).map((cam) => (
          <div
            key={cam.id}
            className={`relative rounded-2xl border overflow-hidden shadow-2xl transition-all group ${
              nightVision ? 'border-emerald-500/50 bg-emerald-950/80' : 'border-slate-800 bg-slate-950'
            }`}
          >
            {/* Video Canvas Container (Simulated Feed Visualizer) */}
            <div className={`h-56 w-full bg-gradient-to-br ${cam.gradientFrom} ${cam.gradientTo} relative flex flex-col justify-between p-4 ${
              nightVision ? 'filter sepia hue-rotate-90 brightness-90 contrast-125' : ''
            }`}>
              {/* Background Grid Pattern & Scanning Laser */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent animate-pulse pointer-events-none"></div>

              {/* Simulated Motion Detection Bounding Box */}
              {motionBox && (
                <div className="absolute top-1/4 left-1/3 w-28 h-20 border-2 border-dashed border-red-500 bg-red-500/10 rounded animate-pulse flex items-start p-1 pointer-events-none">
                  <span className="text-[9px] font-mono font-black text-red-400 bg-slate-900/90 px-1 rounded">
                    TRACKING #0{cam.id.slice(-1)}
                  </span>
                </div>
              )}

              {/* Top Bar Overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="font-mono text-[11px] font-extrabold text-white">{cam.id.toUpperCase()}</span>
                  <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">REC</span>
                </div>

                <div className="font-mono text-[10px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  {cam.fps} FPS • {cam.resolution.split(' ')[0]}
                </div>
              </div>

              {/* Center Watermark & Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-16 h-16 border border-white/40 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
              </div>

              {/* Bottom Telemetry Overlay */}
              <div className="relative z-10 space-y-1 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-800/80">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{cam.name}</span>
                  <span className="text-[9px] font-mono text-purple-300 font-bold">{cam.sensorData}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>{cam.overlayText}</span>
                </div>
              </div>
            </div>

            {/* Camera Control Footer */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="text-slate-400 font-mono text-[10px] flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>PTZ: Preset #{cam.id.slice(-1)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => triggerSnapshot(cam.name)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-[11px] flex items-center space-x-1 transition-all"
                >
                  <Camera className="w-3 h-3 text-purple-400" />
                  <span>Snapshot</span>
                </button>
                <button
                  onClick={() => setSelectedCam(cam)}
                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[11px] flex items-center space-x-1 transition-all"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Expand PTZ</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PTZ Expand Modal */}
      {selectedCam && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl sm:rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-purple-600/30 border border-purple-500/50 rounded-xl text-purple-300">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedCam.name}</h3>
                  <p className="text-xs text-slate-400">{selectedCam.location} • PTZ Joystick Active</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCam(null)}
                className="text-slate-400 hover:text-white font-bold text-xl px-2"
              >
                ✕
              </button>
            </div>

            {/* Large Feed Display */}
            <div className={`h-80 w-full bg-gradient-to-br ${selectedCam.gradientFrom} ${selectedCam.gradientTo} rounded-2xl relative flex flex-col justify-between p-6 border border-slate-700 overflow-hidden ${
              nightVision ? 'filter sepia hue-rotate-90 brightness-90 contrast-125' : ''
            }`}>
              <div className="flex justify-between items-center z-10">
                <span className="px-3 py-1 bg-red-600 text-white font-mono font-bold text-xs rounded-full animate-pulse">
                  LIVE 4K PTZ FEED
                </span>
                <span className="font-mono text-xs text-purple-300 font-bold bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700">
                  {selectedCam.sensorData}
                </span>
              </div>

              <div className="self-center text-center space-y-2 pointer-events-none">
                <div className="w-24 h-24 border-2 border-purple-500/60 rounded-full mx-auto flex items-center justify-center animate-spin">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div className="font-mono text-xs text-purple-200 font-bold bg-slate-950/80 px-3 py-1 rounded-full">
                  ZOOM: {zoomLevel}% • PRESET: {ptzPreset}
                </div>
              </div>

              <div className="z-10 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400">
                {selectedCam.overlayText}
              </div>
            </div>

            {/* Interactive PTZ Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {/* Pan/Tilt D-Pad */}
              <div className="space-y-2 text-center">
                <span className="text-xs font-bold text-slate-400 block">Pan / Tilt Control</span>
                <div className="inline-grid grid-cols-3 gap-1">
                  <div></div>
                  <button onClick={() => alert('Pan Up')} className="p-2 bg-slate-800 hover:bg-purple-600 rounded-lg text-white font-bold text-xs">▲</button>
                  <div></div>
                  <button onClick={() => alert('Pan Left')} className="p-2 bg-slate-800 hover:bg-purple-600 rounded-lg text-white font-bold text-xs">◄</button>
                  <button onClick={() => alert('Center Reset')} className="p-2 bg-slate-700 hover:bg-purple-600 rounded-lg text-white font-bold text-xs">●</button>
                  <button onClick={() => alert('Pan Right')} className="p-2 bg-slate-800 hover:bg-purple-600 rounded-lg text-white font-bold text-xs">►</button>
                  <div></div>
                  <button onClick={() => alert('Pan Down')} className="p-2 bg-slate-800 hover:bg-purple-600 rounded-lg text-white font-bold text-xs">▼</button>
                  <div></div>
                </div>
              </div>

              {/* Optical Zoom Level */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 block">Optical Zoom Control</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setZoomLevel(Math.max(100, zoomLevel - 25))}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold"
                  >
                    - Zoom Out
                  </button>
                  <span className="font-mono text-purple-400 font-bold text-xs flex-1 text-center bg-slate-900 py-2 rounded-xl border border-slate-800">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(400, zoomLevel + 25))}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-xs font-bold text-white"
                  >
                    + Zoom In
                  </button>
                </div>
              </div>

              {/* Angle Presets */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 block">Preset Camera Angles</span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {['Gate 1 Overhead', 'Dyeing Kettle #3', 'Spinning Ring Frame', 'Loom Floor Row B'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setPtzPreset(preset)}
                      className={`p-2 rounded-lg text-[10px] font-bold text-left transition-all ${
                        ptzPreset === preset ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Security Log Stream */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm flex items-center space-x-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Live IP Camera Telemetry & Event Stream</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Encrypted Log Stream (Port 8443)</span>
        </div>

        <div className="space-y-1.5 font-mono text-xs max-h-36 overflow-y-auto pr-2 scrollbar-thin">
          {logs.map((log, i) => (
            <div key={i} className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/60 text-slate-300 flex items-center justify-between">
              <span>{log}</span>
              <span className="text-[9px] text-emerald-400 font-bold">VERIFIED</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
