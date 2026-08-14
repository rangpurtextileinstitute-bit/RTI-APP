import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  Activity, 
  Gauge, 
  Layers, 
  Cpu, 
  Trash2,
  FileCheck2
} from 'lucide-react';
import { YarnQualityRecord, FiberBaleInspection, RegisteredMember, StudentGradeRecord, StudentFeeStatus } from '../types';
import { DepartmentMemberDirectory } from './DepartmentMemberDirectory';

interface YarnDeptProps {
  yarnRecords: YarnQualityRecord[];
  fiberBales: FiberBaleInspection[];
  isMasterAdmin: boolean;
  registeredMembers?: RegisteredMember[];
  studentGrades?: StudentGradeRecord[];
  studentFees?: StudentFeeStatus[];
  onRegisterMember?: (member: RegisteredMember) => void;
  onUpdateMember?: (member: RegisteredMember) => void;
  onDeleteMember?: (id: string) => void;
  onPayFeeDues?: (studentId: string, amount: number) => void;
  onAddYarnRecord: (record: YarnQualityRecord) => void;
  onAddFiberBale: (bale: FiberBaleInspection) => void;
  onDeleteYarnRecord: (id: string) => void;
}

export const YarnDept: React.FC<YarnDeptProps> = ({
  yarnRecords,
  fiberBales,
  isMasterAdmin,
  registeredMembers = [],
  studentGrades = [],
  studentFees = [],
  onRegisterMember = () => {},
  onUpdateMember,
  onDeleteMember,
  onPayFeeDues,
  onAddYarnRecord,
  onAddFiberBale,
  onDeleteYarnRecord
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'yarnQuality' | 'fiberBales' | 'spindles' | 'studentsTeachers'>('yarnQuality');
  const [searchQuery, setSearchQuery] = useState('');
  const [showYarnModal, setShowYarnModal] = useState(false);
  const [showBaleModal, setShowBaleModal] = useState(false);

  // New Yarn Form State
  const [lotNo, setLotNo] = useState(`YRN-${Math.floor(10 + Math.random() * 90)}S-COMP`);
  const [yarnType, setYarnType] = useState<YarnQualityRecord['yarnType']>('Compact');
  const [targetCountNe, setTargetCountNe] = useState(40);
  const [actualCountNe, setActualCountNe] = useState(40.1);
  const [csp, setCsp] = useState(2880);
  const [ipi, setIpi] = useState(92);
  const [hairinessIndex, setHairinessIndex] = useState(4.2);
  const [wastePercentage, setWastePercentage] = useState(14.5);
  const [spindleRpm, setSpindleRpm] = useState(18200);
  const [efficiencyPercent, setEfficiencyPercent] = useState(94.2);
  const [operator, setOperator] = useState('Engr. Spinning Mill Operator');
  const [shift, setShift] = useState<YarnQualityRecord['shift']>('Shift A');

  // New Fiber Bale Form State
  const [baleNo, setBaleNo] = useState(`BALE-COT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [origin, setOrigin] = useState<FiberBaleInspection['origin']>('USA Pima');
  const [stapleLengthMm, setStapleLengthMm] = useState(34.5);
  const [micronaire, setMicronaire] = useState(4.1);
  const [trashPercent, setTrashPercent] = useState(1.4);
  const [strengthGtex, setStrengthGtex] = useState(36.2);
  const [grade, setGrade] = useState<FiberBaleInspection['grade']>('Strict Middling');

  const handleYarnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: YarnQualityRecord = {
      id: `yn-${Date.now()}`,
      lotNo,
      yarnType,
      targetCountNe: Number(targetCountNe),
      actualCountNe: Number(actualCountNe),
      csp: Number(csp),
      ipi: Number(ipi),
      hairinessIndex: Number(hairinessIndex),
      wastePercentage: Number(wastePercentage),
      spindleRpm: Number(spindleRpm),
      efficiencyPercent: Number(efficiencyPercent),
      operator,
      date: new Date().toISOString().split('T')[0],
      shift
    };
    onAddYarnRecord(newRecord);
    setShowYarnModal(false);
  };

  const handleBaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBale: FiberBaleInspection = {
      id: `fb-${Date.now()}`,
      baleNo,
      origin,
      stapleLengthMm: Number(stapleLengthMm),
      micronaire: Number(micronaire),
      trashPercent: Number(trashPercent),
      strengthGtex: Number(strengthGtex),
      grade,
      date: new Date().toISOString().split('T')[0]
    };
    onAddFiberBale(newBale);
    setShowBaleModal(false);
  };

  const filteredYarn = yarnRecords.filter(
    y => y.lotNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
         y.yarnType.toLowerCase().includes(searchQuery.toLowerCase()) ||
         y.operator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Department Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border border-purple-800/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <Boxes className="w-64 h-64 text-purple-400" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Boxes className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                  Academic Department 02
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-mono">
                  Yarn Manufacturing & Fiber Technology Department
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl">
              Covers Fiber Testing (HVI / AFIS), Blowroom, Carding, Combing, Ring Spinning, Compact Spinning, Rotor Open-End, Yarn Count Testing (Ne/Tex), CSP Strength, & Hairiness Index.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowYarnModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-600/25 transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Log Yarn Quality & Count Test</span>
            </button>
            <button
              onClick={() => setShowBaleModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 font-semibold transition-all text-xs"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Inspect Fiber Bale</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-900/60">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-purple-800/40">
            <div className="text-xs text-purple-300 font-medium">Avg Ring Spindle Speed</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">18,450 RPM</div>
            <div className="text-[10px] text-slate-400 mt-1">High Efficiency Spinning</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-purple-800/40">
            <div className="text-xs text-purple-300 font-medium">Avg Yarn CSP Strength</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">2,840 CSP</div>
            <div className="text-[10px] text-emerald-300 mt-1">Exceeds Export Grade</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-purple-800/40">
            <div className="text-xs text-purple-300 font-medium">Waste % Drop Rate</div>
            <div className="text-xl font-bold text-amber-300 font-mono mt-0.5">13.8 %</div>
            <div className="text-[10px] text-slate-400 mt-1">Comber Noil & Card Fly</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-purple-800/40">
            <div className="text-xs text-purple-300 font-medium">Testing Standards</div>
            <div className="text-xl font-bold text-purple-300 font-mono mt-0.5">Uster 5% Stat</div>
            <div className="text-[10px] text-purple-200 mt-1">ISO 9001 Lab Certified</div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab('yarnQuality')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'yarnQuality'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Yarn Quality & Count Testing ({yarnRecords.length})
          </button>
          <button
            onClick={() => setActiveSubTab('fiberBales')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'fiberBales'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Cotton & Fiber Bale Testing ({fiberBales.length})
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
            placeholder="Search lot, count, operator..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* SUB TAB 1: Yarn Quality Table */}
      {activeSubTab === 'yarnQuality' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>Yarn Spinning Quality Control Logs</span>
            </h3>
            <span className="text-xs text-slate-500">{filteredYarn.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Lot No / Type</th>
                  <th className="py-3.5 px-4">Count Ne (Target/Actual)</th>
                  <th className="py-3.5 px-4">Strength (CSP)</th>
                  <th className="py-3.5 px-4">IPI & Hairiness (H)</th>
                  <th className="py-3.5 px-4">Spindle RPM & Waste %</th>
                  <th className="py-3.5 px-4">Efficiency</th>
                  <th className="py-3.5 px-4">Operator / Shift</th>
                  {isMasterAdmin && <th className="py-3.5 px-4 text-right">Admin</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredYarn.map(record => (
                  <tr key={record.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono">{record.lotNo}</div>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-800 mt-0.5">
                        {record.yarnType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">Target: Ne {record.targetCountNe}</div>
                      <div className="font-mono text-xs font-bold text-indigo-600">
                        Actual: Ne {record.actualCountNe}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{record.csp} CSP</div>
                      <div className="text-[10px] text-emerald-600 font-bold">Grade A Strength</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700">IPI: {record.ipi} / 1000m</div>
                      <div className="text-[11px] text-slate-500">Hairiness H: {record.hairinessIndex}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-mono">{record.spindleRpm.toLocaleString()} RPM</div>
                      <div className="text-[11px] text-amber-600 font-bold">Waste: {record.wastePercentage}%</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-12 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${record.efficiencyPercent}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-purple-700 text-xs">
                          {record.efficiencyPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">{record.operator}</div>
                      <div className="text-[10px] text-slate-400">{record.shift} • {record.date}</div>
                    </td>
                    {isMasterAdmin && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteYarnRecord(record.id)}
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

      {/* SUB TAB 2: Fiber Bales */}
      {activeSubTab === 'fiberBales' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2 mb-4">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Raw Cotton & Synthetic Fiber Quality Testing</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fiberBales.map(bale => (
              <div key={bale.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-bold text-xs text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                    {bale.baleNo}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {bale.grade}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 mt-2">{bale.origin} Fiber</div>

                <div className="grid grid-cols-2 gap-2 my-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                  <div>
                    <span className="block text-[10px] text-slate-400">Staple Length:</span>
                    <span className="font-mono font-bold text-slate-800">{bale.stapleLengthMm} mm</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Micronaire:</span>
                    <span className="font-mono font-bold text-slate-800">{bale.micronaire}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Strength:</span>
                    <span className="font-mono font-bold text-indigo-600">{bale.strengthGtex} g/tex</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Trash Content:</span>
                    <span className="font-mono font-bold text-amber-600">{bale.trashPercent} %</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Students & Teachers Directory */}
      {activeSubTab === 'studentsTeachers' && (
        <DepartmentMemberDirectory
          departmentKey="yarn_mfg"
          departmentTitle="Yarn Manufacturing Engineering"
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

      {/* FORM MODAL: Log Yarn Quality */}
      {showYarnModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Boxes className="w-5 h-5 text-purple-600" />
                <span>Log Yarn Quality & Count Test Entry</span>
              </h3>
              <button onClick={() => setShowYarnModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleYarnSubmit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lot Number</label>
                  <input
                    type="text"
                    value={lotNo}
                    onChange={e => setLotNo(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Spinning Type</label>
                  <select
                    value={yarnType}
                    onChange={e => setYarnType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Compact">Compact Spinning</option>
                    <option value="Ring Spun">Ring Spun</option>
                    <option value="Open End (Rotor)">Open End (Rotor)</option>
                    <option value="Air Jet">Air Jet Spinning</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Count (Ne)</label>
                  <input
                    type="number"
                    value={targetCountNe}
                    onChange={e => setTargetCountNe(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Actual Count (Ne)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={actualCountNe}
                    onChange={e => setActualCountNe(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CSP Strength</label>
                  <input
                    type="number"
                    value={csp}
                    onChange={e => setCsp(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">IPI / 1000m</label>
                  <input
                    type="number"
                    value={ipi}
                    onChange={e => setIpi(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hairiness (H)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={hairinessIndex}
                    onChange={e => setHairinessIndex(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Spindle RPM</label>
                  <input
                    type="number"
                    value={spindleRpm}
                    onChange={e => setSpindleRpm(Number(e.target.value))}
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
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={e => setShift(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Shift A">Shift A (Morning)</option>
                    <option value="Shift B">Shift B (Evening)</option>
                    <option value="Shift C">Shift C (Night)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Operator / Lab Tester Name</label>
                <input
                  type="text"
                  value={operator}
                  onChange={e => setOperator(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowYarnModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md">Save Yarn Quality Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: Log Fiber Bale */}
      {showBaleModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-purple-600" />
                <span>Raw Fiber Bale Inspection Entry</span>
              </h3>
              <button onClick={() => setShowBaleModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleBaleSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Bale Number</label>
                <input
                  type="text"
                  value={baleNo}
                  onChange={e => setBaleNo(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Fiber Origin / Type</label>
                <select
                  value={origin}
                  onChange={e => setOrigin(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="USA Pima">USA Pima (Extra Long Staple)</option>
                  <option value="Egyptian Giza">Egyptian Giza Cotton</option>
                  <option value="Indian Shankar-6">Indian Shankar-6</option>
                  <option value="Polyester Fiber">1.4 Denier Recycled Polyester</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Staple Length (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={stapleLengthMm}
                    onChange={e => setStapleLengthMm(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Micronaire</label>
                  <input
                    type="number"
                    step="0.1"
                    value={micronaire}
                    onChange={e => setMicronaire(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Strength (g/tex)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={strengthGtex}
                    onChange={e => setStrengthGtex(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Trash %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={trashPercent}
                    onChange={e => setTrashPercent(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Grade</label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="Strict Middling">Strict Middling</option>
                  <option value="Middling">Middling</option>
                  <option value="Good Middling">Good Middling</option>
                  <option value="Grade A Synthetic">Grade A Synthetic</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowBaleModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md">Save Fiber Inspection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
