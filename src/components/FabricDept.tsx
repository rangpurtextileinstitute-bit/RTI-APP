import React, { useState } from 'react';
import { 
  Grid, 
  Plus, 
  Search, 
  Ruler, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  ShieldCheck, 
  Trash2,
  Sliders
} from 'lucide-react';
import { LoomProductionRecord, FabricInspectionRecord, RegisteredMember, StudentGradeRecord, StudentFeeStatus } from '../types';
import { DepartmentMemberDirectory } from './DepartmentMemberDirectory';

interface FabricDeptProps {
  loomRecords: LoomProductionRecord[];
  fabricInspections: FabricInspectionRecord[];
  isMasterAdmin: boolean;
  registeredMembers?: RegisteredMember[];
  studentGrades?: StudentGradeRecord[];
  studentFees?: StudentFeeStatus[];
  onRegisterMember?: (member: RegisteredMember) => void;
  onUpdateMember?: (member: RegisteredMember) => void;
  onDeleteMember?: (id: string) => void;
  onPayFeeDues?: (studentId: string, amount: number) => void;
  onAddLoomRecord: (record: LoomProductionRecord) => void;
  onAddInspection: (inspection: FabricInspectionRecord) => void;
  onDeleteLoomRecord: (id: string) => void;
}

export const FabricDept: React.FC<FabricDeptProps> = ({
  loomRecords,
  fabricInspections,
  isMasterAdmin,
  registeredMembers = [],
  studentGrades = [],
  studentFees = [],
  onRegisterMember = () => {},
  onUpdateMember,
  onDeleteMember,
  onPayFeeDues,
  onAddLoomRecord,
  onAddInspection,
  onDeleteLoomRecord
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'looms' | 'inspections' | 'studentsTeachers'>('looms');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoomModal, setShowLoomModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  // New Loom Form State
  const [loomNo, setLoomNo] = useState(`AJ-LOOM-0${Math.floor(5 + Math.random() * 5)}`);
  const [loomType, setLoomType] = useState<LoomProductionRecord['loomType']>('Air-Jet');
  const [weavePattern, setWeavePattern] = useState<LoomProductionRecord['weavePattern']>('Twill 2/1');
  const [epi, setEpi] = useState(110);
  const [ppi, setPpi] = useState(78);
  const [warpCount, setWarpCount] = useState('40s Combed Cotton');
  const [weftCount, setWeftCount] = useState('40s Combed Cotton');
  const [targetMeters, setTargetMeters] = useState(1200);
  const [producedMeters, setProducedMeters] = useState(650);
  const [speedRpm, setSpeedRpm] = useState(820);
  const [efficiencyPercent, setEfficiencyPercent] = useState(91.5);
  const [status, setStatus] = useState<LoomProductionRecord['status']>('Running');
  const [operator, setOperator] = useState('Engr. Weaving Floor Master');

  // New 4-Point Inspection State
  const [rollNo, setRollNo] = useState(`ROLL-DEN-${Math.floor(100 + Math.random() * 900)}`);
  const [fabricType, setFabricType] = useState('Cotton Denim Twill 3/1 11.5 oz');
  const [widthInches, setWidthInches] = useState(58);
  const [actualGsm, setActualGsm] = useState(240);
  const [targetGsm, setTargetGsm] = useState(240);
  const [defectsCount, setDefectsCount] = useState(2);
  const [fourPointScore, setFourPointScore] = useState(3.2);
  const [grade, setGrade] = useState<FabricInspectionRecord['grade']>('Grade A');
  const [inspector, setInspector] = useState('QA Fabric Inspector');

  const handleLoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoom: LoomProductionRecord = {
      id: `lm-${Date.now()}`,
      loomNo,
      loomType,
      weavePattern,
      epi: Number(epi),
      ppi: Number(ppi),
      warpCount,
      weftCount,
      targetMeters: Number(targetMeters),
      producedMeters: Number(producedMeters),
      speedRpm: Number(speedRpm),
      efficiencyPercent: Number(efficiencyPercent),
      status,
      operator,
      date: new Date().toISOString().split('T')[0]
    };
    onAddLoomRecord(newLoom);
    setShowLoomModal(false);
  };

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInsp: FabricInspectionRecord = {
      id: `fi-${Date.now()}`,
      rollNo,
      fabricType,
      widthInches: Number(widthInches),
      actualGsm: Number(actualGsm),
      targetGsm: Number(targetGsm),
      defectsCount: Number(defectsCount),
      fourPointScore: Number(fourPointScore),
      grade,
      inspector,
      date: new Date().toISOString().split('T')[0]
    };
    onAddInspection(newInsp);
    setShowInspectionModal(false);
  };

  const filteredLooms = loomRecords.filter(
    l => l.loomNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
         l.weavePattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
         l.operator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-900 border border-violet-800/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <Grid className="w-64 h-64 text-violet-400" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Grid className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
                  Academic Department 03
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-mono">
                  Fabric Manufacturing & Weaving/Knitting Department
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl">
              Handles Air-Jet Looms, Rapier Looms, Circular Knitting, Dobby/Jacquard Weave Patterns, Fabric Construction (EPI x PPI), GSM Measurement, & ASTM 4-Point Defect Inspection.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowLoomModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-violet-600/25 transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Allocate New Loom / Machine</span>
            </button>
            <button
              onClick={() => setShowInspectionModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-violet-300 border border-violet-500/40 font-semibold transition-all text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Log 4-Point Roll Inspection</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-violet-900/60">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-violet-800/40">
            <div className="text-xs text-violet-300 font-medium">Active Weaving Looms</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">{loomRecords.length} Looms</div>
            <div className="text-[10px] text-slate-400 mt-1">Air-Jet & Rapier Active</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-violet-800/40">
            <div className="text-xs text-violet-300 font-medium">Avg Weaving Speed</div>
            <div className="text-xl font-bold text-violet-300 font-mono mt-0.5">820 RPM</div>
            <div className="text-[10px] text-emerald-300 mt-1">High-Speed Insertion</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-violet-800/40">
            <div className="text-xs text-violet-300 font-medium">4-Point Defect Score</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">2.8 pts</div>
            <div className="text-[10px] text-emerald-300 mt-1">Below 20 pt Max Limit</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-violet-800/40">
            <div className="text-xs text-violet-300 font-medium">Grade A Quality Rate</div>
            <div className="text-xl font-bold text-indigo-300 font-mono mt-0.5">96.4 %</div>
            <div className="text-[10px] text-indigo-200 mt-1">Zero Critical Slubs</div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab('looms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'looms'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Loom & Knitting Production ({loomRecords.length})
          </button>
          <button
            onClick={() => setActiveSubTab('inspections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'inspections'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            4-Point Fabric Quality Inspections ({fabricInspections.length})
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

        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search loom, pattern, roll..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* SUB TAB 1: Loom Floor Table */}
      {activeSubTab === 'looms' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-violet-600" />
              <span>Weaving & Knitting Machinery Allocation Floor</span>
            </h3>
            <span className="text-xs text-slate-500">{filteredLooms.length} active machines</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Loom ID / Type</th>
                  <th className="py-3.5 px-4">Weave Pattern</th>
                  <th className="py-3.5 px-4">Density (EPI x PPI)</th>
                  <th className="py-3.5 px-4">Warp / Weft Yarn</th>
                  <th className="py-3.5 px-4">Production (Target/Meters)</th>
                  <th className="py-3.5 px-4">Speed & Efficiency</th>
                  <th className="py-3.5 px-4">Status</th>
                  {isMasterAdmin && <th className="py-3.5 px-4 text-right">Admin</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLooms.map(loom => (
                  <tr key={loom.id} className="hover:bg-violet-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono">{loom.loomNo}</div>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-violet-100 text-violet-800 mt-0.5">
                        {loom.loomType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{loom.weavePattern}</div>
                      <div className="text-[10px] text-slate-400">Master Design Spec</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">
                      {loom.epi} EPI x {loom.ppi} PPI
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>Warp: {loom.warpCount}</div>
                      <div className="text-[10px] text-slate-500">Weft: {loom.weftCount}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono">{loom.producedMeters} m / {loom.targetMeters} m</div>
                      <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="bg-violet-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (loom.producedMeters / loom.targetMeters) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-900">{loom.speedRpm} RPM</div>
                      <div className="text-[11px] font-bold text-indigo-600">{loom.efficiencyPercent}% Eff.</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        loom.status === 'Running' ? 'bg-emerald-100 text-emerald-800' :
                        loom.status === 'Idle' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {loom.status}
                      </span>
                    </td>
                    {isMasterAdmin && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteLoomRecord(loom.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
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

      {/* SUB TAB 2: Fabric Quality Inspections */}
      {activeSubTab === 'inspections' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2 mb-4">
            <Ruler className="w-4 h-4 text-violet-600" />
            <span>4-Point Fabric Roll Inspection & GSM Records</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fabricInspections.map(insp => (
              <div key={insp.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-bold text-xs text-violet-800 bg-violet-100 px-2 py-0.5 rounded">
                    {insp.rollNo}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                    insp.grade === 'Grade A' ? 'bg-emerald-100 text-emerald-800' :
                    insp.grade === 'Grade B' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {insp.grade}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 mt-2">{insp.fabricType}</div>

                <div className="grid grid-cols-3 gap-2 my-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                  <div>
                    <span className="block text-[10px] text-slate-400">Width:</span>
                    <span className="font-mono font-bold text-slate-800">{insp.widthInches}" Inches</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Actual GSM:</span>
                    <span className="font-mono font-bold text-indigo-600">{insp.actualGsm} GSM</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">4-Point Score:</span>
                    <span className="font-mono font-bold text-emerald-600">{insp.fourPointScore} pts</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between pt-2 border-t border-slate-200">
                  <span>Inspector: {insp.inspector}</span>
                  <span>{insp.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Students & Teachers Directory */}
      {activeSubTab === 'studentsTeachers' && (
        <DepartmentMemberDirectory
          departmentKey="fabric_mfg"
          departmentTitle="Fabric Manufacturing Engineering"
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

      {/* FORM MODAL 1: Allocate Loom */}
      {showLoomModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Grid className="w-5 h-5 text-violet-600" />
                <span>Allocate Machine / Loom Entry</span>
              </h3>
              <button onClick={() => setShowLoomModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleLoomSubmit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Loom / Machine ID</label>
                  <input
                    type="text"
                    value={loomNo}
                    onChange={e => setLoomNo(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Machine Type</label>
                  <select
                    value={loomType}
                    onChange={e => setLoomType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Air-Jet">Air-Jet High Speed Loom</option>
                    <option value="Rapier">Rapier Flexible Loom</option>
                    <option value="Water-Jet">Water-Jet Loom</option>
                    <option value="Circular Knitting">Circular Knitting Machine</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Weave / Knit Structure</label>
                  <select
                    value={weavePattern}
                    onChange={e => setWeavePattern(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Twill 2/1">Twill 2/1</option>
                    <option value="Plain 1/1">Plain 1/1</option>
                    <option value="Sateen 4/1">Sateen 4/1</option>
                    <option value="Single Jersey">Single Jersey</option>
                    <option value="Interlock">Interlock</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">EPI</label>
                    <input
                      type="number"
                      value={epi}
                      onChange={e => setEpi(Number(e.target.value))}
                      required
                      className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">PPI</label>
                    <input
                      type="number"
                      value={ppi}
                      onChange={e => setPpi(Number(e.target.value))}
                      required
                      className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Warp Yarn Spec</label>
                  <input
                    type="text"
                    value={warpCount}
                    onChange={e => setWarpCount(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Weft Yarn Spec</label>
                  <input
                    type="text"
                    value={weftCount}
                    onChange={e => setWeftCount(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Meters</label>
                  <input
                    type="number"
                    value={targetMeters}
                    onChange={e => setTargetMeters(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Speed (RPM)</label>
                  <input
                    type="number"
                    value={speedRpm}
                    onChange={e => setSpeedRpm(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Efficiency %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={efficiencyPercent}
                    onChange={e => setEfficiencyPercent(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Operator Name</label>
                <input
                  type="text"
                  value={operator}
                  onChange={e => setOperator(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowLoomModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md">Allocate Loom</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL 2: 4-Point Inspection */}
      {showInspectionModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-violet-600" />
                <span>4-Point Fabric Inspection Entry</span>
              </h3>
              <button onClick={() => setShowInspectionModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleInspectionSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Fabric Roll No</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Fabric Type / Construction</label>
                <input
                  type="text"
                  value={fabricType}
                  onChange={e => setFabricType(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Width (Inches)</label>
                  <input
                    type="number"
                    value={widthInches}
                    onChange={e => setWidthInches(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Actual GSM</label>
                  <input
                    type="number"
                    value={actualGsm}
                    onChange={e => setActualGsm(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">4-Point Score / 100yd²</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fourPointScore}
                    onChange={e => setFourPointScore(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Final Grade</label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="Grade A">Grade A (Pass)</option>
                    <option value="Grade B">Grade B (Minor Blemish)</option>
                    <option value="Grade C">Grade C (Discounted)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Inspector Name</label>
                <input
                  type="text"
                  value={inspector}
                  onChange={e => setInspector(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowInspectionModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md">Save Fabric Inspection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
