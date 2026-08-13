import React, { useState } from 'react';
import { 
  Scissors, 
  Plus, 
  Search, 
  Calculator, 
  FileCheck, 
  Layers, 
  TrendingUp, 
  Users, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { SewingLineRecord, TechPackRecord, RegisteredMember, StudentGradeRecord, StudentFeeStatus } from '../types';
import { DepartmentMemberDirectory } from './DepartmentMemberDirectory';

interface ApparelDeptProps {
  sewingRecords: SewingLineRecord[];
  techPacks: TechPackRecord[];
  isMasterAdmin: boolean;
  registeredMembers?: RegisteredMember[];
  studentGrades?: StudentGradeRecord[];
  studentFees?: StudentFeeStatus[];
  onRegisterMember?: (member: RegisteredMember) => void;
  onUpdateMember?: (member: RegisteredMember) => void;
  onDeleteMember?: (id: string) => void;
  onPayFeeDues?: (studentId: string, amount: number) => void;
  onAddSewingRecord: (record: SewingLineRecord) => void;
  onAddTechPack: (pack: TechPackRecord) => void;
  onDeleteSewingRecord: (id: string) => void;
}

export const ApparelDept: React.FC<ApparelDeptProps> = ({
  sewingRecords,
  techPacks,
  isMasterAdmin,
  registeredMembers = [],
  studentGrades = [],
  studentFees = [],
  onRegisterMember = () => {},
  onUpdateMember,
  onDeleteMember,
  onPayFeeDues,
  onAddSewingRecord,
  onAddTechPack,
  onDeleteSewingRecord
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sewingLines' | 'techPacks' | 'samCalc' | 'studentsTeachers'>('sewingLines');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSewingModal, setShowSewingModal] = useState(false);
  const [showTechPackModal, setShowTechPackModal] = useState(false);

  // New Sewing Line State
  const [lineNo, setLineNo] = useState(`LINE-0${Math.floor(2 + Math.random() * 6)}`);
  const [styleName, setStyleName] = useState('NIOTRON Athletic Crewneck');
  const [garmentType, setGarmentType] = useState<SewingLineRecord['garmentType']>('T-Shirt');
  const [samMinutes, setSamMinutes] = useState(12.5);
  const [operatorCount, setOperatorCount] = useState(24);
  const [targetHourlyQty, setTargetHourlyQty] = useState(115);
  const [actualHourlyQty, setActualHourlyQty] = useState(106);
  const [efficiencyPercent, setEfficiencyPercent] = useState(92.1);
  const [defectRatePercent, setDefectRatePercent] = useState(1.5);
  const [supervisor, setSupervisor] = useState('Engr. Apparel Production Supt');

  // New Tech Pack State
  const [styleCode, setStyleCode] = useState(`NIO-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [buyer, setBuyer] = useState('International Outerwear');
  const [season, setSeason] = useState<TechPackRecord['season']>('SS2026');
  const [tpGarmentType, setTpGarmentType] = useState('Performance Softshell');
  const [fabricSpec, setFabricSpec] = useState('100% Recycled Polyester Micro-Twill 180 GSM');
  const [sizeRange, setSizeRange] = useState('XS to XXL');
  const [designer, setDesigner] = useState('Apparel CAD Studio 2');

  // Interactive SAM Calculator Widget State
  const [calcSam, setCalcSam] = useState(18.5);
  const [calcOperators, setCalcOperators] = useState(30);
  const [calcTargetHours, setCalcTargetHours] = useState(8);

  // Calculated values
  const totalLineCapacityMins = calcOperators * 60 * calcTargetHours;
  const theoreticalTotalGarments = Math.floor(totalLineCapacityMins / calcSam);
  const hourlyTargetGarments = Math.floor((calcOperators * 60) / calcSam);

  const handleSewingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: SewingLineRecord = {
      id: `sl-${Date.now()}`,
      lineNo,
      styleName,
      garmentType,
      samMinutes: Number(samMinutes),
      operatorCount: Number(operatorCount),
      targetHourlyQty: Number(targetHourlyQty),
      actualHourlyQty: Number(actualHourlyQty),
      efficiencyPercent: Number(efficiencyPercent),
      defectRatePercent: Number(defectRatePercent),
      supervisor,
      date: new Date().toISOString().split('T')[0]
    };
    onAddSewingRecord(newRecord);
    setShowSewingModal(false);
  };

  const handleTechPackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPack: TechPackRecord = {
      id: `tp-${Date.now()}`,
      styleCode,
      buyer,
      season,
      garmentType: tpGarmentType,
      fabricSpec,
      sizeRange,
      status: 'Approved',
      designer,
      date: new Date().toISOString().split('T')[0]
    };
    onAddTechPack(newPack);
    setShowTechPackModal(false);
  };

  const filteredLines = sewingRecords.filter(
    s => s.lineNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.supervisor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-800/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <Scissors className="w-64 h-64 text-blue-400" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Scissors className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Academic Department 04
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-mono">
                  Apparel Manufacturing & Garment Technology Department
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl">
              Covers Pattern Engineering, Spreading & Automatic Cutting, Sewing Line Efficiency (SAM), Line Balancing, Garment Inspection, & CAD Tech Pack Specifications.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSewingModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-600/25 transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Log Sewing Line Production</span>
            </button>
            <button
              onClick={() => setShowTechPackModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/40 font-semibold transition-all text-xs"
            >
              <FileCheck className="w-4 h-4" />
              <span>Create Garment Tech Pack</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-900/60">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-blue-800/40">
            <div className="text-xs text-blue-300 font-medium">Active Sewing Lines</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">{sewingRecords.length} Lines</div>
            <div className="text-[10px] text-slate-400 mt-1">Knitwear & Woven Running</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-blue-800/40">
            <div className="text-xs text-blue-300 font-medium">Line SAM Efficiency</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">93.2 %</div>
            <div className="text-[10px] text-emerald-300 mt-1">Pitch Balanced</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-blue-800/40">
            <div className="text-xs text-blue-300 font-medium">Hourly Output Rate</div>
            <div className="text-xl font-bold text-blue-300 font-mono mt-0.5">214 Pcs / Hr</div>
            <div className="text-[10px] text-indigo-200 mt-1">Target 227 Pcs / Hr</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-blue-800/40">
            <div className="text-xs text-blue-300 font-medium">Defect Rate (DHU)</div>
            <div className="text-xl font-bold text-sky-300 font-mono mt-0.5">1.8 %</div>
            <div className="text-[10px] text-sky-200 mt-1">Inline Quality Controlled</div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab('sewingLines')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'sewingLines'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Sewing Line SAM & Efficiency ({sewingRecords.length})
          </button>
          <button
            onClick={() => setActiveSubTab('techPacks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'techPacks'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Garment Tech Pack Spec Sheets ({techPacks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('samCalc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'samCalc'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🧮 Interactive SAM & Line Balancing Calculator
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
            placeholder="Search line, style, supervisor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* SUB TAB 1: Sewing Lines Table */}
      {activeSubTab === 'sewingLines' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Sewing Production Line & SAM Pitch Efficiency</span>
            </h3>
            <span className="text-xs text-slate-500">{filteredLines.length} lines</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Line # / Garment Style</th>
                  <th className="py-3.5 px-4">SAM (Min)</th>
                  <th className="py-3.5 px-4">Operators</th>
                  <th className="py-3.5 px-4">Hourly Qty (Target/Actual)</th>
                  <th className="py-3.5 px-4">Line Efficiency</th>
                  <th className="py-3.5 px-4">Defect Rate</th>
                  <th className="py-3.5 px-4">Supervisor</th>
                  {isMasterAdmin && <th className="py-3.5 px-4 text-right">Admin</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLines.map(line => (
                  <tr key={line.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono">{line.lineNo}</div>
                      <div className="text-slate-600 font-medium">{line.styleName} ({line.garmentType})</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {line.samMinutes} mins
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 font-bold text-slate-800">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{line.operatorCount} Ops</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono">
                        {line.actualHourlyQty} pcs / {line.targetHourlyQty} pcs
                      </div>
                      <div className="text-[10px] text-slate-400">Target Efficiency Pace</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${line.efficiencyPercent}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-blue-700 text-xs">
                          {line.efficiencyPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sky-600">{line.defectRatePercent}% DHU</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">{line.supervisor}</div>
                      <div className="text-[10px] text-slate-400">{line.date}</div>
                    </td>
                    {isMasterAdmin && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteSewingRecord(line.id)}
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

      {/* SUB TAB 2: Tech Pack Library */}
      {activeSubTab === 'techPacks' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2 mb-4">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>Garment Tech Pack & Specification Catalog</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techPacks.map(pack => (
              <div key={pack.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-bold text-xs text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    {pack.styleCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    {pack.status}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 mt-2">{pack.garmentType} ({pack.season})</div>
                <div className="text-xs text-slate-500">Buyer: {pack.buyer}</div>

                <div className="space-y-1 my-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Fabric Spec:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">{pack.fabricSpec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size Range:</span>
                    <span className="font-mono font-bold text-indigo-600">{pack.sizeRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Designed By:</span>
                    <span className="font-medium text-slate-700">{pack.designer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: SAM & Line Balancing Calculator Widget */}
      {activeSubTab === 'samCalc' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto">
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Interactive SAM & Pitch Target Calculator</h3>
              <p className="text-xs text-slate-500">Calculate hourly garment targets based on Standard Allowed Minutes and operator allocation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">Garment SAM (Minutes)</label>
              <input
                type="number"
                step="0.5"
                value={calcSam}
                onChange={e => setCalcSam(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg text-sm font-bold font-mono focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">e.g. Polo Shirt = 14.5 mins</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">Number of Operators</label>
              <input
                type="number"
                value={calcOperators}
                onChange={e => setCalcOperators(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg text-sm font-bold font-mono focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Active sewing operators</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">Shift Duration (Hours)</label>
              <input
                type="number"
                value={calcTargetHours}
                onChange={e => setCalcTargetHours(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg text-sm font-bold font-mono focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Standard 8-hour shift</span>
            </div>
          </div>

          {/* Results Display Box */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-blue-300">Theoretical Target / Hr</div>
                <div className="text-2xl font-black font-mono text-white mt-1">{hourlyTargetGarments} Pcs</div>
              </div>
              <div>
                <div className="text-xs text-blue-300">Total Shift Target ({calcTargetHours}h)</div>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{theoreticalTotalGarments} Pcs</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-xs text-blue-300">Total Available Mins</div>
                <div className="text-2xl font-black font-mono text-sky-300 mt-1">{totalLineCapacityMins} Mins</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Students & Teachers Directory */}
      {activeSubTab === 'studentsTeachers' && (
        <DepartmentMemberDirectory
          departmentKey="apparel_mfg"
          departmentTitle="Apparel Manufacturing Engineering"
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

      {/* FORM MODAL 1: Sewing Line Record */}
      {showSewingModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-blue-600" />
                <span>Sewing Line Production Entry</span>
              </h3>
              <button onClick={() => setShowSewingModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSewingSubmit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Line Number</label>
                  <input
                    type="text"
                    value={lineNo}
                    onChange={e => setLineNo(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Garment Type</label>
                  <select
                    value={garmentType}
                    onChange={e => setGarmentType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="Polo Shirt">Polo Shirt</option>
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Denim Jeans">Denim Jeans</option>
                    <option value="Woven Jacket">Woven Jacket</option>
                    <option value="Workwear">Workwear</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Style Name / Order Ref</label>
                <input
                  type="text"
                  value={styleName}
                  onChange={e => setStyleName(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">SAM (Minutes)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={samMinutes}
                    onChange={e => setSamMinutes(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Operators</label>
                  <input
                    type="number"
                    value={operatorCount}
                    onChange={e => setOperatorCount(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Actual Qty/Hr</label>
                  <input
                    type="number"
                    value={actualHourlyQty}
                    onChange={e => setActualHourlyQty(Number(e.target.value))}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Line Efficiency %</label>
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
                  <label className="block text-slate-700 font-bold mb-1">Supervisor Name</label>
                  <input
                    type="text"
                    value={supervisor}
                    onChange={e => setSupervisor(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowSewingModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md">Save Sewing Line Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL 2: Create Tech Pack */}
      {showTechPackModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Create Tech Pack Specification</span>
              </h3>
              <button onClick={() => setShowTechPackModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleTechPackSubmit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Style Code</label>
                  <input
                    type="text"
                    value={styleCode}
                    onChange={e => setStyleCode(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Season</label>
                  <select
                    value={season}
                    onChange={e => setSeason(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="SS2026">SS2026</option>
                    <option value="FW2026">FW2026</option>
                    <option value="Core 2026">Core 2026</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Buyer / Brand Name</label>
                <input
                  type="text"
                  value={buyer}
                  onChange={e => setBuyer(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Garment Type</label>
                <input
                  type="text"
                  value={tpGarmentType}
                  onChange={e => setTpGarmentType(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Fabric Specification</label>
                <input
                  type="text"
                  value={fabricSpec}
                  onChange={e => setFabricSpec(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Size Range</label>
                <input
                  type="text"
                  value={sizeRange}
                  onChange={e => setSizeRange(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Designer / Studio</label>
                <input
                  type="text"
                  value={designer}
                  onChange={e => setDesigner(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowTechPackModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md">Create Tech Pack</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
