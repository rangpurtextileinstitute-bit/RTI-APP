import React, { useState } from 'react';
import { 
  FlaskConical, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Sparkles,
  Droplets,
  Layers,
  Thermometer,
  TestTube2,
  Trash2,
  Edit2
} from 'lucide-react';
import { WetProcessingBatch, LabDipRecord, RegisteredMember, StudentGradeRecord, StudentFeeStatus } from '../types';
import { DepartmentMemberDirectory } from './DepartmentMemberDirectory';

interface WetProcessingProps {
  batches: WetProcessingBatch[];
  labDips: LabDipRecord[];
  isMasterAdmin: boolean;
  registeredMembers?: RegisteredMember[];
  studentGrades?: StudentGradeRecord[];
  studentFees?: StudentFeeStatus[];
  onRegisterMember?: (member: RegisteredMember) => void;
  onUpdateMember?: (member: RegisteredMember) => void;
  onDeleteMember?: (id: string) => void;
  onPayFeeDues?: (studentId: string, amount: number) => void;
  onAddBatch: (batch: WetProcessingBatch) => void;
  onAddLabDip: (dip: LabDipRecord) => void;
  onDeleteBatch: (id: string) => void;
}

export const WetProcessingDept: React.FC<WetProcessingProps> = ({
  batches,
  labDips,
  isMasterAdmin,
  registeredMembers = [],
  studentGrades = [],
  studentFees = [],
  onRegisterMember = () => {},
  onUpdateMember,
  onDeleteMember,
  onPayFeeDues,
  onAddBatch,
  onAddLabDip,
  onDeleteBatch
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'batches' | 'labDips' | 'machinery' | 'chemicals' | 'studentsTeachers'>('batches');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showLabDipModal, setShowLabDipModal] = useState(false);

  // New Batch Form State
  const [batchNo, setBatchNo] = useState(`WP-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [fabricLot, setFabricLot] = useState('LOT-COT-89');
  const [fabricType, setFabricType] = useState('100% Combed Cotton Single Jersey 180 GSM');
  const [weightKg, setWeightKg] = useState(350);
  const [dyeType, setDyeType] = useState<WetProcessingBatch['dyeType']>('Reactive');
  const [recipe, setRecipe] = useState('Reactive Blue 3G (2.2%), Salt (45 g/L), Soda Ash (12 g/L)');
  const [liquorRatio, setLiquorRatio] = useState('1:8');
  const [tempC, setTempC] = useState(60);
  const [processTimeMin, setProcessTimeMin] = useState(150);
  const [deltaETarget, setDeltaETarget] = useState(0.5);
  const [actualDeltaE, setActualDeltaE] = useState(0.35);
  const [technician, setTechnician] = useState('Engr. Wet Processing Lab Technician');
  const [notes, setNotes] = useState('Lab trial batch for color fastness verification.');

  // New Lab Dip Form State
  const [sampleCode, setSampleCode] = useState(`LD-DYE-${Math.floor(100 + Math.random() * 900)}`);
  const [buyerName, setBuyerName] = useState('European Textile Buyers Ltd');
  const [fabricQuality, setFabricQuality] = useState('30s Combed Cotton Interlock');
  const [shadeName, setShadeName] = useState('Navy Indigo Deep');
  const [hexColor, setHexColor] = useState('#1E3A8A');
  const [lightSource, setLightSource] = useState<LabDipRecord['lightSource']>('D65');
  const [passFail, setPassFail] = useState<LabDipRecord['passFail']>('PASS');
  const [labDeltaE, setLabDeltaE] = useState(0.38);

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: WetProcessingBatch = {
      id: `wp-${Date.now()}`,
      batchNo,
      fabricLot,
      fabricType,
      weightKg: Number(weightKg),
      dyeType,
      recipe,
      liquorRatio,
      tempC: Number(tempC),
      processTimeMin: Number(processTimeMin),
      deltaETarget: Number(deltaETarget),
      actualDeltaE: Number(actualDeltaE),
      status: 'In Process',
      technician,
      date: new Date().toISOString().split('T')[0],
      notes
    };
    onAddBatch(newBatch);
    setShowBatchModal(false);
  };

  const handleLabDipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDip: LabDipRecord = {
      id: `ld-${Date.now()}`,
      sampleCode,
      buyerName,
      fabricQuality,
      shadeName,
      hexColor,
      lightSource,
      passFail,
      deltaE: Number(labDeltaE),
      date: new Date().toISOString().split('T')[0]
    };
    onAddLabDip(newDip);
    setShowLabDipModal(false);
  };

  const filteredBatches = batches.filter(
    b => b.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
         b.fabricType.toLowerCase().includes(searchQuery.toLowerCase()) ||
         b.dyeType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Department Header Card */}
      <div className="bg-gradient-to-r from-sky-950 via-indigo-950 to-slate-900 border border-sky-800/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <FlaskConical className="w-64 h-64 text-sky-400" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <FlaskConical className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                  Academic Department 01
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-mono">
                  Wet Processing & Textile Chemistry Department
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl">
              Specialized lab environment for Textile Dyeing, Color Matching, Screen Printing, Finishing Treatments, Recipe Development, and Spectrophotometric Shade Analysis.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowBatchModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold shadow-lg shadow-sky-500/25 transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Dyeing Recipe Batch</span>
            </button>
            <button
              onClick={() => setShowLabDipModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/40 font-semibold transition-all text-xs"
            >
              <TestTube2 className="w-4 h-4" />
              <span>Log Lab Dip Shade</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-sky-900/60">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-sky-800/40">
            <div className="text-xs text-sky-300 font-medium">Total Batches</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">{batches.length} Batches</div>
            <div className="text-[10px] text-slate-400 mt-1">Dyeing & Finishing</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-sky-800/40">
            <div className="text-xs text-sky-300 font-medium">Avg Shade Delta-E</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">0.42 ΔE</div>
            <div className="text-[10px] text-emerald-300 mt-1">Within Target Limit (0.5)</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-sky-800/40">
            <div className="text-xs text-sky-300 font-medium">Lab Dip Pass Rate</div>
            <div className="text-xl font-bold text-indigo-300 font-mono mt-0.5">92.8 %</div>
            <div className="text-[10px] text-indigo-200 mt-1">D65 Light Box Validated</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-sky-800/40">
            <div className="text-xs text-sky-300 font-medium">Active Dye Machinery</div>
            <div className="text-xl font-bold text-sky-300 font-mono mt-0.5">4 / 4 Running</div>
            <div className="text-[10px] text-slate-400 mt-1">Jet, Jigger, Stenter, Pad</div>
          </div>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab('batches')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'batches'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Dyeing Batch Records ({batches.length})
          </button>
          <button
            onClick={() => setActiveSubTab('labDips')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'labDips'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Lab Dip Shade Evaluation ({labDips.length})
          </button>
          <button
            onClick={() => setActiveSubTab('machinery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'machinery'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Machinery & Lab Equipment
          </button>
          <button
            onClick={() => setActiveSubTab('studentsTeachers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'studentsTeachers'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            👨‍🎓 Students & Faculty Directory
          </button>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search batches, dyes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>

      {/* SUB-TAB 1: Dyeing Batches */}
      {activeSubTab === 'batches' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>Active Batch Dyeing & Recipe Formulations</span>
            </h3>
            <span className="text-xs text-slate-500">
              {filteredBatches.length} records matching search
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Batch No / Lot</th>
                  <th className="py-3.5 px-4">Fabric Type & Wt</th>
                  <th className="py-3.5 px-4">Dye Class & Recipe</th>
                  <th className="py-3.5 px-4">Process Parameters</th>
                  <th className="py-3.5 px-4">Delta-E (Target/Actual)</th>
                  <th className="py-3.5 px-4">Technician / Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  {isMasterAdmin && <th className="py-3.5 px-4 text-right">Admin</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBatches.map(batch => (
                  <tr key={batch.id} className="hover:bg-sky-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono">{batch.batchNo}</div>
                      <div className="text-[11px] text-slate-500">{batch.fabricLot}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{batch.fabricType}</div>
                      <div className="text-[11px] text-sky-600 font-bold">{batch.weightKg} kg batch</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-sky-100 text-sky-800 mb-1">
                        {batch.dyeType} Dye
                      </span>
                      <div className="text-[11px] text-slate-600 truncate">{batch.recipe}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700">L:R {batch.liquorRatio} | {batch.tempC}°C</div>
                      <div className="text-[11px] text-slate-500">{batch.processTimeMin} mins duration</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-900">Target: {batch.deltaETarget} ΔE</div>
                      <div className={`font-mono text-[11px] font-bold ${
                        batch.actualDeltaE <= batch.deltaETarget ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        Actual: {batch.actualDeltaE} ΔE
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">{batch.technician}</div>
                      <div className="text-[10px] text-slate-400">{batch.date}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        batch.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        batch.status === 'In Process' ? 'bg-sky-100 text-sky-800' :
                        batch.status === 'Quality Check' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        <span>{batch.status}</span>
                      </span>
                    </td>
                    {isMasterAdmin && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteBatch(batch.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete Batch Record (Master Admin Only)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Lab Dip Shade Evaluation */}
      {activeSubTab === 'labDips' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <TestTube2 className="w-4 h-4 text-sky-600" />
              <span>Lab Dip Shade Approvals & Light Box Matching</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {labDips.map(dip => (
              <div key={dip.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                    {dip.sampleCode}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    dip.passFail === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                    dip.passFail === 'FAIL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {dip.passFail}
                  </span>
                </div>

                {/* Color Swatch Preview */}
                <div className="flex items-center space-x-3 my-3">
                  <div 
                    className="w-12 h-12 rounded-xl shadow-inner border border-slate-300"
                    style={{ backgroundColor: dip.hexColor }}
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{dip.shadeName}</h4>
                    <p className="text-xs text-slate-500">{dip.buyerName}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1 pt-2 border-t border-slate-200 text-slate-600">
                  <div className="flex justify-between">
                    <span>Quality:</span>
                    <span className="font-semibold">{dip.fabricQuality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Light Source:</span>
                    <span className="font-bold text-slate-800">{dip.lightSource} Cabinet</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delta-E Spectro:</span>
                    <span className="font-mono font-bold text-sky-600">{dip.deltaE} ΔE</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Machinery Status */}
      {activeSubTab === 'machinery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-slate-800 text-sm">HT High Pressure Jet Dyeing Vessel #01</h4>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">RUNNING (130°C)</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Capacity: 500 kg | Liquor Ratio: 1:8 | Yarn/Fabric Beam</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div className="bg-sky-500 h-2 rounded-full w-[75%]"></div>
            </div>
            <span className="text-[10px] text-slate-400">Batch WP-2026-090 Progress: 75% complete</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-slate-800 text-sm">Atmospheric Jigger Dyeing Machine #02</h4>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">RUNNING (95°C)</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Capacity: 350 kg | Woven Cotton Dyeing Range</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div className="bg-indigo-500 h-2 rounded-full w-[45%]"></div>
            </div>
            <span className="text-[10px] text-slate-400">Batch WP-2026-089 Progress: 45% complete</span>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Students & Teachers Directory */}
      {activeSubTab === 'studentsTeachers' && (
        <DepartmentMemberDirectory
          departmentKey="wet_processing"
          departmentTitle="Wet Processing Engineering"
          registeredMembers={registeredMembers}
          studentGrades={studentGrades}
          studentFees={studentFees}
          onRegisterMember={onRegisterMember}
          onUpdateMember={onUpdateMember}
          onDeleteMember={onDeleteMember}
          onPayFeeDues={onPayFeeDues}
          isMasterAdmin={isMasterAdmin}
        />
      )}

      {/* FORM MODAL 1: New Dyeing Batch */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-xl w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FlaskConical className="w-5 h-5 text-sky-600" />
                <span>New Dyeing Recipe Batch Entry</span>
              </h3>
              <button 
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBatchSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={e => setBatchNo(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fabric Lot ID</label>
                  <input
                    type="text"
                    value={fabricLot}
                    onChange={e => setFabricLot(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fabric Type & GSM</label>
                  <input
                    type="text"
                    value={fabricType}
                    onChange={e => setFabricType(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Weight (Kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Dye Class</label>
                  <select
                    value={dyeType}
                    onChange={e => setDyeType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Reactive">Reactive Dyes (Cotton)</option>
                    <option value="Disperse">Disperse Dyes (Polyester)</option>
                    <option value="Vat">Vat Dyes (Denim Indigo)</option>
                    <option value="Direct">Direct Dyes</option>
                    <option value="Acid">Acid Dyes (Nylon/Silk)</option>
                    <option value="Pigment">Pigment Dyeing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Liquor Ratio (L:R)</label>
                  <input
                    type="text"
                    value={liquorRatio}
                    onChange={e => setLiquorRatio(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Chemical & Dye Recipe Formula</label>
                <textarea
                  rows={2}
                  value={recipe}
                  onChange={e => setRecipe(e.target.value)}
                  required
                  placeholder="e.g. Reactive Blue (2.5%), Salt (50g/L), Soda Ash (15g/L)"
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    value={tempC}
                    onChange={e => setTempC(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={processTimeMin}
                    onChange={e => setProcessTimeMin(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Delta-E</label>
                  <input
                    type="number"
                    step="0.01"
                    value={deltaETarget}
                    onChange={e => setDeltaETarget(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Lab Technician Name</label>
                <input
                  type="text"
                  value={technician}
                  onChange={e => setTechnician(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/30"
                >
                  Save Dyeing Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL 2: New Lab Dip */}
      {showLabDipModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <TestTube2 className="w-5 h-5 text-sky-600" />
                <span>Log Lab Dip Shade Approval</span>
              </h3>
              <button onClick={() => setShowLabDipModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleLabDipSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Sample Code</label>
                <input
                  type="text"
                  value={sampleCode}
                  onChange={e => setSampleCode(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Buyer / Client Name</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Shade Name</label>
                  <input
                    type="text"
                    value={shadeName}
                    onChange={e => setShadeName(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Color Picker</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={hexColor}
                      onChange={e => setHexColor(e.target.value)}
                      className="w-10 h-9 p-0.5 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-slate-600 text-xs">{hexColor}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Light Cabinet Source</label>
                  <select
                    value={lightSource}
                    onChange={e => setLightSource(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="D65">D65 (Daylight)</option>
                    <option value="TL84">TL84 (Store Light)</option>
                    <option value="CWF">CWF (Cool White Fluores.)</option>
                    <option value="UV">UV (Optical Brighteners)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Delta-E Match</label>
                  <input
                    type="number"
                    step="0.01"
                    value={labDeltaE}
                    onChange={e => setLabDeltaE(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pass / Fail Status</label>
                <select
                  value={passFail}
                  onChange={e => setPassFail(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="PASS">PASS (Approved for Production)</option>
                  <option value="FAIL">FAIL (Reshade Required)</option>
                  <option value="PENDING">PENDING Buyer Review</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowLabDipModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md">Save Lab Dip</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
