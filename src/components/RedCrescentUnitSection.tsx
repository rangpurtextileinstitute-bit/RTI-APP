import React, { useState } from 'react';
import { 
  Heart, 
  Droplet, 
  Plus, 
  Search, 
  CheckCircle2, 
  Shield, 
  Phone, 
  UserCheck, 
  Award, 
  SlidersHorizontal,
  Edit3,
  Trash2,
  AlertCircle,
  X,
  Sparkles,
  ChevronRight,
  UserPlus,
  Users
} from 'lucide-react';
import { RedCrescentMember } from '../types';

interface RedCrescentUnitSectionProps {
  redCrescentMembers: RedCrescentMember[];
  isMasterAdmin: boolean;
  onAddRedCrescentMember: (member: RedCrescentMember) => void;
  onUpdateRedCrescentMember?: (member: RedCrescentMember) => void;
  onDeleteRedCrescentMember?: (id: string) => void;
}

export const RedCrescentUnitSection: React.FC<RedCrescentUnitSectionProps> = ({
  redCrescentMembers,
  isMasterAdmin,
  onAddRedCrescentMember,
  onUpdateRedCrescentMember,
  onDeleteRedCrescentMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  // Modals & Views
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingMember, setEditingMember] = useState<RedCrescentMember | null>(null);

  // Student Join Form State
  const [joinForm, setJoinForm] = useState({
    name: '',
    studentId: '',
    department: 'Wet Processing',
    phone: '',
    bloodGroup: 'O+' as RedCrescentMember['bloodGroup'],
    roleInUnit: 'Volunteer',
    photoUrl: ''
  });

  const handleJoinPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setJoinForm(prev => ({ ...prev, photoUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdminPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAdminForm(prev => ({ ...prev, photoUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin Direct Add / Edit Form State
  const [adminForm, setAdminForm] = useState({
    id: '',
    name: '',
    studentId: '',
    department: 'Wet Processing',
    phone: '',
    bloodGroup: 'O+' as RedCrescentMember['bloodGroup'],
    roleInUnit: 'Volunteer',
    status: 'Active Volunteer' as RedCrescentMember['status'],
    totalDonations: 1,
    photoUrl: ''
  });

  // Filtering
  const filteredMembers = redCrescentMembers.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlood = selectedBloodGroup === 'All' || m.bloodGroup === selectedBloodGroup;
    const matchesRole = selectedRoleFilter === 'All' || m.roleInUnit === selectedRoleFilter;
    return matchesSearch && matchesBlood && matchesRole;
  });

  // Submit Join Application
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinForm.name || !joinForm.phone) {
      alert('Please fill in your full name and contact phone number.');
      return;
    }

    const newMember: RedCrescentMember = {
      id: `rc-${Date.now()}`,
      studentId: joinForm.studentId || `RTI-RC-${Math.floor(1000 + Math.random() * 9000)}`,
      name: joinForm.name,
      bloodGroup: joinForm.bloodGroup,
      department: joinForm.department,
      phone: joinForm.phone,
      roleInUnit: joinForm.roleInUnit,
      lastDonationDate: new Date().toISOString().split('T')[0],
      totalDonations: 0,
      status: 'Active Volunteer',
      photoUrl: joinForm.photoUrl || undefined,
      joinDate: new Date().toISOString().split('T')[0]
    };

    onAddRedCrescentMember(newMember);
    alert(`Success! ${joinForm.name} has been enrolled in the Red Crescent Youth Unit database.`);
    setShowApplyModal(false);
    setJoinForm({
      name: '',
      studentId: '',
      department: 'Wet Processing',
      phone: '',
      bloodGroup: 'O+',
      roleInUnit: 'Volunteer',
      photoUrl: ''
    });
  };

  // Open Edit Admin Modal
  const handleOpenEdit = (m: RedCrescentMember) => {
    setEditingMember(m);
    setAdminForm({
      id: m.id,
      name: m.name,
      studentId: m.studentId,
      department: m.department,
      phone: m.phone,
      bloodGroup: m.bloodGroup,
      roleInUnit: m.roleInUnit,
      status: m.status,
      totalDonations: m.totalDonations,
      photoUrl: m.photoUrl || ''
    });
  };

  // Save Admin Edit / Role Update
  const handleSaveAdminEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const updated: RedCrescentMember = {
      ...editingMember,
      name: adminForm.name,
      studentId: adminForm.studentId,
      department: adminForm.department,
      phone: adminForm.phone,
      bloodGroup: adminForm.bloodGroup,
      roleInUnit: adminForm.roleInUnit,
      status: adminForm.status,
      totalDonations: Number(adminForm.totalDonations),
      photoUrl: adminForm.photoUrl || editingMember.photoUrl
    };

    if (onUpdateRedCrescentMember) {
      onUpdateRedCrescentMember(updated);
    }
    setEditingMember(null);
    alert(`Red Crescent member record updated for ${updated.name}.`);
  };

  // Delete Member
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the Red Crescent Unit database?`)) {
      if (onDeleteRedCrescentMember) {
        onDeleteRedCrescentMember(id);
      }
    }
  };

  // Helper for role badge styling
  const getRoleBadgeStyle = (role: string) => {
    if (role.includes('Leader') || role.includes('Lead')) {
      return 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold';
    }
    if (role.includes('Trainer') || role.includes('First Aid')) {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
    }
    if (role.includes('Coordinator')) {
      return 'bg-sky-100 text-sky-900 border-sky-300 font-bold';
    }
    return 'bg-slate-100 text-slate-800 border-slate-300 font-medium';
  };

  return (
    <div className="bg-white rounded-2xl border border-red-200/80 shadow-md p-5 sm:p-6 space-y-6">
      {/* Banner / Header Section */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 text-white rounded-2xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-400/40 px-3 py-1 rounded-full text-[11px] font-extrabold text-red-200">
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 animate-pulse" />
              <span>RTI Youth Red Crescent Unit (Rangpur Unit)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2">
              <span>Red Crescent Member Directory & Command</span>
            </h2>
            <p className="text-xs text-red-100 max-w-2xl leading-relaxed">
              Official campus emergency response team, certified first aid specialists, and verified blood donor database for instant medical dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Apply / Join Button */}
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-900/40 transition-all flex items-center space-x-1.5 border border-red-400/30"
            >
              <UserPlus className="w-4 h-4 text-red-100" />
              <span>Apply / Join Unit</span>
            </button>

            {/* Manage Unit Button */}
            <button
              onClick={() => setShowManageModal(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 border border-white/20"
            >
              <SlidersHorizontal className="w-4 h-4 text-rose-300" />
              <span>Manage Unit {isMasterAdmin && '(Admin)'}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-red-800/60 text-xs">
          <div className="bg-red-950/60 p-2.5 rounded-xl border border-red-800/40">
            <span className="text-[10px] text-red-200 block uppercase font-mono">Total Volunteers</span>
            <span className="text-lg font-black text-white font-mono">{redCrescentMembers.length} Active</span>
          </div>
          <div className="bg-red-950/60 p-2.5 rounded-xl border border-red-800/40">
            <span className="text-[10px] text-red-200 block uppercase font-mono">Unit Leadership</span>
            <span className="text-lg font-black text-amber-300 font-mono">
              {redCrescentMembers.filter(m => m.roleInUnit.includes('Lead') || m.roleInUnit.includes('Trainer')).length} Officers
            </span>
          </div>
          <div className="bg-red-950/60 p-2.5 rounded-xl border border-red-800/40">
            <span className="text-[10px] text-red-200 block uppercase font-mono">Emergency Donors</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {redCrescentMembers.filter(m => m.status === 'Emergency On-Call').length} On-Call
            </span>
          </div>
          <div className="bg-red-950/60 p-2.5 rounded-xl border border-red-800/40">
            <span className="text-[10px] text-red-200 block uppercase font-mono">Donations Logged</span>
            <span className="text-lg font-black text-sky-300 font-mono">
              {redCrescentMembers.reduce((sum, m) => sum + m.totalDonations, 0)} Units
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search volunteers by name, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-600 font-bold whitespace-nowrap">Role:</span>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="All">All Roles</option>
            <option value="Unit Leader">Unit Leader</option>
            <option value="First Aid Trainer">First Aid Trainer</option>
            <option value="Blood Donor Coordinator">Blood Donor Coordinator</option>
            <option value="Volunteer">Volunteer</option>
          </select>
        </div>

        {/* Blood Group Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-slate-600 font-bold whitespace-nowrap mr-1">Blood:</span>
          {['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+'].map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                selectedBloodGroup === bg
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Member Directory Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Users className="w-4 h-4 text-red-600" />
            <span>Red Crescent Unit Members ({filteredMembers.length})</span>
          </h3>
          <span className="text-xs text-slate-500">
            Showing verified volunteers registered in RTI Red Crescent database
          </span>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700">No Red Crescent members matched your filters.</p>
            <p className="text-xs">Try resetting the search filter or click "Apply / Join Unit" to register a new member.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-red-300 p-4 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Member Header */}
                <div className="flex items-start space-x-3">
                  {/* Profile Picture Placeholder / Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={member.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`}
                      alt={member.name}
                      onError={(e) => {
                        // Fallback image if URL fails
                        (e.target as HTMLElement).setAttribute('src', `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`);
                      }}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-red-100 shadow-sm bg-slate-100"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-red-600 text-white p-0.5 rounded-full border border-white" title={`Blood Group: ${member.bloodGroup}`}>
                      <Droplet className="w-3 h-3 fill-white" />
                    </span>
                  </div>

                  {/* Name, Role & ID */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-red-700 transition-colors">
                        {member.name}
                      </h4>
                      {/* Blood Group Pill */}
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-red-100 text-red-800 border border-red-300 flex items-center space-x-0.5 flex-shrink-0">
                        <Droplet className="w-3 h-3 text-red-600 fill-red-600" />
                        <span>{member.bloodGroup}</span>
                      </span>
                    </div>

                    {/* Designation / Role within Unit */}
                    <div className="mt-1">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border ${getRoleBadgeStyle(member.roleInUnit)}`}>
                        {member.roleInUnit}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mt-1 truncate">
                      {member.department} • <span className="font-semibold text-slate-700">{member.studentId}</span>
                    </div>
                  </div>
                </div>

                {/* Member Details Box */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1.5 font-mono">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-slate-400 font-sans">Contact Phone:</span>
                    <a
                      href={`tel:${member.phone}`}
                      className="font-bold text-red-700 hover:underline flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3 text-red-600" />
                      <span>{member.phone}</span>
                    </a>
                  </div>

                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-slate-400 font-sans">Blood Donations:</span>
                    <span className="font-bold text-slate-900">{member.totalDonations} Units</span>
                  </div>

                  {member.lastDonationDate && (
                    <div className="flex justify-between items-center text-slate-500 text-[10px]">
                      <span className="font-sans">Last Donated:</span>
                      <span>{member.lastDonationDate}</span>
                    </div>
                  )}
                </div>

                {/* Status & Actions Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    member.status === 'Active Volunteer'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{member.status}</span>
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-lg transition-all"
                      title="Edit Member Role / Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {isMasterAdmin && (
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-700 rounded-lg transition-all"
                        title="Remove Member Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STUDENT APPLY / JOIN MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 text-red-600 rounded-xl font-bold">
                  <Heart className="w-5 h-5 fill-red-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Apply to Red Crescent Youth Unit</h3>
                  <p className="text-slate-500 text-xs">Enroll as an active volunteer or blood donor in RTI Unit</p>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  value={joinForm.name}
                  onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                  placeholder="e.g. Siam Chowdhury"
                  className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Roll / ID *</label>
                  <input
                    type="text"
                    required
                    value={joinForm.studentId}
                    onChange={(e) => setJoinForm({ ...joinForm, studentId: e.target.value })}
                    placeholder="e.g. RTI-WP-S52099"
                    className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group *</label>
                  <select
                    value={joinForm.bloodGroup}
                    onChange={(e) => setJoinForm({ ...joinForm, bloodGroup: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 font-bold text-red-400"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Academic Dept *</label>
                  <select
                    value={joinForm.department}
                    onChange={(e) => setJoinForm({ ...joinForm, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Wet Processing">Wet Processing</option>
                    <option value="Yarn Manufacturing">Yarn Manufacturing</option>
                    <option value="Fabric Manufacturing">Fabric Manufacturing</option>
                    <option value="Apparel Manufacturing">Apparel Manufacturing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={joinForm.phone}
                    onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })}
                    placeholder="+880 1700-000000"
                    className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                <label className="block text-slate-200 font-bold">Profile Photo (Upload Picture)</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-500/40 text-red-200 font-bold text-xs flex items-center justify-center overflow-hidden flex-shrink-0">
                    {joinForm.photoUrl ? (
                      <img src={joinForm.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>📷</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleJoinPhotoFile}
                      className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-red-900 file:text-red-100 hover:file:bg-red-800 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste photo URL..."
                      value={joinForm.photoUrl}
                      onChange={(e) => setJoinForm({ ...joinForm, photoUrl: e.target.value })}
                      className="w-full p-1 bg-slate-950 border border-slate-700 text-white rounded-lg text-[10px] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Desired Unit Designation / Role *</label>
                <select
                  value={joinForm.roleInUnit}
                  onChange={(e) => setJoinForm({ ...joinForm, roleInUnit: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  <option value="Volunteer">Volunteer</option>
                  <option value="First Aid Trainer">First Aid Trainer</option>
                  <option value="Blood Donor Coordinator">Blood Donor Coordinator</option>
                  <option value="Unit Leader">Unit Leader</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE UNIT MODAL / DRAWER (Admin Control) */}
      {showManageModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-slate-900 text-white rounded-xl font-bold">
                  <SlidersHorizontal className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Manage Red Crescent Unit Database</h3>
                  <p className="text-slate-500 text-xs">Update volunteer designations, active status, or add members directly</p>
                </div>
              </div>
              <button
                onClick={() => setShowManageModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Members in Manage Modal */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Unit Roster ({redCrescentMembers.length} Members)
              </h4>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                {redCrescentMembers.map(m => (
                  <div key={m.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={m.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}`}
                        alt={m.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{m.name} <span className="text-[10px] text-red-600 font-black">({m.bloodGroup})</span></div>
                        <div className="text-[10px] text-slate-500 font-mono">{m.roleInUnit} • {m.department}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setShowManageModal(false);
                          handleOpenEdit(m);
                        }}
                        className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold rounded-lg border border-purple-200 text-[11px]"
                      >
                        Edit Designation
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Button to open Add New Member modal */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => {
                    setShowManageModal(false);
                    setShowApplyModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Volunteer Direct</span>
                </button>

                <button
                  onClick={() => setShowManageModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER EDIT / ROLE UPDATE MODAL */}
      {editingMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Update Member Role & Details</h3>
              <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Member Name</label>
                <input
                  type="text"
                  required
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit Role / Designation</label>
                  <select
                    value={adminForm.roleInUnit}
                    onChange={(e) => setAdminForm({ ...adminForm, roleInUnit: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl font-bold"
                  >
                    <option value="Unit Leader">Unit Leader</option>
                    <option value="First Aid Trainer">First Aid Trainer</option>
                    <option value="Blood Donor Coordinator">Blood Donor Coordinator</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Active Status</label>
                  <select
                    value={adminForm.status}
                    onChange={(e) => setAdminForm({ ...adminForm, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl"
                  >
                    <option value="Active Volunteer">Active Volunteer</option>
                    <option value="Emergency On-Call">Emergency On-Call</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <select
                    value={adminForm.bloodGroup}
                    onChange={(e) => setAdminForm({ ...adminForm, bloodGroup: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl font-bold text-red-400"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Blood Donations</label>
                  <input
                    type="number"
                    min="0"
                    value={adminForm.totalDonations}
                    onChange={(e) => setAdminForm({ ...adminForm, totalDonations: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 text-white border border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                <label className="block text-slate-200 font-bold">Profile Photo (Upload / Edit Picture)</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center justify-center overflow-hidden flex-shrink-0">
                    {adminForm.photoUrl ? (
                      <img src={adminForm.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>📷</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAdminPhotoFile}
                      className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-purple-900 file:text-purple-100 hover:file:bg-purple-800 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste photo URL..."
                      value={adminForm.photoUrl}
                      onChange={(e) => setAdminForm({ ...adminForm, photoUrl: e.target.value })}
                      className="w-full p-1 bg-slate-950 border border-slate-700 text-white rounded-lg text-[10px] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
