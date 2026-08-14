import React, { useState } from 'react';
import {
  Heart,
  Droplet,
  Search,
  Phone,
  MapPin,
  Calendar,
  UserPlus,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  Clock,
  Shield,
  Trash2,
  Edit3,
  X,
  Sparkles,
  PhoneCall,
  Copy,
  Check,
  Building2,
  Award
} from 'lucide-react';
import { RedCrescentMember } from '../types';

interface BloodDonationClubProps {
  donors: RedCrescentMember[];
  isMasterAdmin: boolean;
  onAddDonor: (donor: RedCrescentMember) => void;
  onUpdateDonor?: (donor: RedCrescentMember) => void;
  onDeleteDonor?: (id: string) => void;
}

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;

export const BloodDonationClub: React.FC<BloodDonationClubProps> = ({
  donors,
  isMasterAdmin,
  onAddDonor,
  onUpdateDonor,
  onDeleteDonor
}) => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showEmergencySOSModal, setShowEmergencySOSModal] = useState<boolean>(false);
  const [editingDonor, setEditingDonor] = useState<RedCrescentMember | null>(null);

  // Registration Form State
  const [donorForm, setDonorForm] = useState({
    name: '',
    studentId: '',
    bloodGroup: 'O+' as RedCrescentMember['bloodGroup'],
    department: 'Wet Processing',
    batchOrSession: 'Session 2025-26 (15th Batch)',
    phone: '',
    location: 'Campus Hostel, Rangpur',
    lastDonationDate: '',
    totalDonations: 1,
    availabilityStatus: 'Available Now' as RedCrescentMember['availabilityStatus'],
    gender: 'Male' as 'Male' | 'Female' | 'Other'
  });

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorForm.name.trim() || !donorForm.phone.trim()) {
      alert('Please fill in your Full Name and Contact Phone Number.');
      return;
    }

    const newDonor: RedCrescentMember = {
      id: `donor-${Date.now()}`,
      studentId: donorForm.studentId.trim() || `RTI-DONOR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: donorForm.name.trim(),
      bloodGroup: donorForm.bloodGroup,
      department: donorForm.department,
      batchOrSession: donorForm.batchOrSession,
      phone: donorForm.phone.trim(),
      location: donorForm.location.trim() || 'Rangpur City',
      roleInUnit: 'Blood Donor',
      lastDonationDate: donorForm.lastDonationDate || new Date().toISOString().split('T')[0],
      totalDonations: Number(donorForm.totalDonations) || 1,
      status: donorForm.availabilityStatus === 'Emergency Only' ? 'Emergency On-Call' : 'Available Now',
      availabilityStatus: donorForm.availabilityStatus,
      gender: donorForm.gender,
      joinDate: new Date().toISOString().split('T')[0]
    };

    onAddDonor(newDonor);
    setShowRegisterModal(false);
    alert(`Thank you ${donorForm.name}! You are now registered in the RTI Blood Donor Directory.`);
    setDonorForm({
      name: '',
      studentId: '',
      bloodGroup: 'O+',
      department: 'Wet Processing',
      batchOrSession: 'Session 2025-26 (15th Batch)',
      phone: '',
      location: 'Campus Hostel, Rangpur',
      lastDonationDate: '',
      totalDonations: 1,
      availabilityStatus: 'Available Now',
      gender: 'Male'
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;

    if (onUpdateDonor) {
      onUpdateDonor(editingDonor);
    }
    setEditingDonor(null);
    alert(`Donor record for ${editingDonor.name} updated successfully.`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the Blood Donor list?`)) {
      if (onDeleteDonor) {
        onDeleteDonor(id);
      }
    }
  };

  // Export Donors to CSV
  const handleExportCSV = () => {
    const headers = [
      'Name',
      'Blood Group',
      'Department',
      'Batch / Session',
      'Phone Number',
      'Location / Hostel',
      'Availability Status',
      'Last Donation Date',
      'Total Donations'
    ];
    const rows = filteredDonors.map(d => [
      `"${(d.name || '').replace(/"/g, '""')}"`,
      `"${(d.bloodGroup || '').replace(/"/g, '""')}"`,
      `"${(d.department || '').replace(/"/g, '""')}"`,
      `"${(d.batchOrSession || '').replace(/"/g, '""')}"`,
      `"${(d.phone || '').replace(/"/g, '""')}"`,
      `"${(d.location || '').replace(/"/g, '""')}"`,
      `"${(d.availabilityStatus || d.status || 'Available').replace(/"/g, '""')}"`,
      `"${(d.lastDonationDate || 'N/A').replace(/"/g, '""')}"`,
      `"${d.totalDonations || 0}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RTI_Blood_Donors_${selectedBloodGroup}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Donors List
  const filteredDonors = donors.filter(d => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !q || 
      d.name.toLowerCase().includes(q) ||
      (d.studentId && d.studentId.toLowerCase().includes(q)) ||
      (d.department && d.department.toLowerCase().includes(q)) ||
      (d.batchOrSession && d.batchOrSession.toLowerCase().includes(q)) ||
      (d.location && d.location.toLowerCase().includes(q)) ||
      (d.phone && d.phone.toLowerCase().includes(q));

    const matchesBlood = selectedBloodGroup === 'All' || d.bloodGroup === selectedBloodGroup;
    const matchesDept = selectedDepartment === 'All' || d.department.toLowerCase().includes(selectedDepartment.toLowerCase());
    
    let matchesStatus = true;
    if (selectedStatus === 'Available') {
      matchesStatus = d.availabilityStatus === 'Available Now' || d.status === 'Available Now';
    } else if (selectedStatus === 'Emergency') {
      matchesStatus = d.availabilityStatus === 'Emergency Only' || d.status === 'Emergency On-Call';
    } else if (selectedStatus === 'Cooldown') {
      matchesStatus = d.availabilityStatus === 'Cooldown / Recently Donated';
    }

    return matchesQuery && matchesBlood && matchesDept && matchesStatus;
  });

  // Calculate Blood Group counts
  const bloodCounts = donors.reduce((acc, d) => {
    acc[d.bloodGroup] = (acc[d.bloodGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Hero Banner with Emergency SOS */}
      <div className="bg-gradient-to-r from-red-950 via-rose-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-rose-700/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-black tracking-wide uppercase">
              <Droplet className="w-3.5 h-3.5 text-red-400 fill-red-400 animate-pulse" />
              <span>RTI Red Crescent Youth Unit & Blood Bank</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>RTI Blood Donation Club</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
              Real-time voluntary blood donor directory for students, teachers, and campus staff of Rangpur Textile Institute. 
              Search by blood group and connect directly for life-saving emergency dispatches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Register as Donor Button */}
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-900/50 transition-all border border-red-400/40 active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as a Blood Donor</span>
            </button>

            {/* Emergency Hotline Button */}
            <button
              onClick={() => setShowEmergencySOSModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-rose-300 font-extrabold text-xs sm:text-sm border border-rose-500/40 transition-all active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-rose-400 animate-bounce" />
              <span>Emergency Blood SOS</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-rose-800/40">
          <div className="bg-slate-950/60 backdrop-blur-xs rounded-2xl p-3.5 border border-rose-900/40">
            <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider block">Total Registered Donors</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{donors.length} Verified</span>
          </div>

          <div className="bg-slate-950/60 backdrop-blur-xs rounded-2xl p-3.5 border border-rose-900/40">
            <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider block">Available Now (Ready)</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              {donors.filter(d => (d.availabilityStatus === 'Available Now' || d.status === 'Available Now')).length} Ready
            </span>
          </div>

          <div className="bg-slate-950/60 backdrop-blur-xs rounded-2xl p-3.5 border border-rose-900/40">
            <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider block">Emergency On-Call</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
              {donors.filter(d => (d.availabilityStatus === 'Emergency Only' || d.status === 'Emergency On-Call')).length} On-Call
            </span>
          </div>

          <div className="bg-slate-950/60 backdrop-blur-xs rounded-2xl p-3.5 border border-rose-900/40">
            <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider block">Total Units Donated</span>
            <span className="text-xl sm:text-2xl font-black text-sky-400 font-mono">
              {donors.reduce((sum, d) => sum + (d.totalDonations || 0), 0)} Units
            </span>
          </div>
        </div>
      </div>

      {/* Blood Group Quick-Filter Badges */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <Droplet className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Select Blood Group Filter</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Showing <strong className="text-rose-600 dark:text-rose-400">{filteredDonors.length}</strong> of {donors.length} Donors
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {BLOOD_GROUPS.map((bg) => {
            const count = bg === 'All' ? donors.length : (bloodCounts[bg] || 0);
            const isSelected = selectedBloodGroup === bg;
            return (
              <button
                key={bg}
                onClick={() => setSelectedBloodGroup(bg)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30 scale-105 font-black ring-2 ring-rose-300'
                    : 'bg-slate-50 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold'
                }`}
              >
                <span className="text-sm font-black tracking-tight">{bg}</span>
                <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-rose-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {count} {count === 1 ? 'Donor' : 'Donors'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Search & Filtering Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Instant Search Bar */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Donor Name, Department, Batch, Location, or Phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100 font-medium"
            >
              <option value="All">All 4 Departments</option>
              <option value="Wet Processing">Wet Processing Technology</option>
              <option value="Yarn">Yarn Manufacturing</option>
              <option value="Fabric">Fabric Manufacturing</option>
              <option value="Apparel">Apparel Manufacturing</option>
            </select>
          </div>

          {/* Availability Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100 font-medium"
            >
              <option value="All">All Availability Statuses</option>
              <option value="Available">Available Now (Ready)</option>
              <option value="Emergency">Emergency On-Call</option>
              <option value="Cooldown">Recently Donated</option>
            </select>
          </div>
        </div>

        {/* Action Bar with CSV Export */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified RTI Red Crescent Blood Network</span>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            title="Download list to Excel/CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Donors CSV</span>
          </button>
        </div>
      </div>

      {/* Donors Grid Cards */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <Droplet className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">No Donors Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No registered donors matched your current filter for blood group <strong>{selectedBloodGroup}</strong>. 
              Try resetting the search or register a new donor!
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedBloodGroup('All');
              setSelectedDepartment('All');
              setSelectedStatus('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => {
            const isReady = donor.availabilityStatus === 'Available Now' || donor.status === 'Available Now';
            const isEmergency = donor.availabilityStatus === 'Emergency Only' || donor.status === 'Emergency On-Call';
            
            return (
              <div
                key={donor.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Blood Group Badge & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex flex-col items-center justify-center font-black shadow-md shadow-rose-600/30 flex-shrink-0">
                        <span className="text-base font-black leading-none">{donor.bloodGroup}</span>
                        <span className="text-[9px] font-medium opacity-80 uppercase tracking-tighter">Blood</span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {donor.name}
                        </h4>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{donor.department}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center space-x-1 ${
                      isReady
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60'
                        : isEmergency
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-500 animate-ping' : isEmergency ? 'bg-amber-500' : 'bg-slate-400'}`} />
                      <span>{isReady ? 'Available' : isEmergency ? 'Emergency' : 'Cooldown'}</span>
                    </span>
                  </div>

                  {/* Donor Info Rows */}
                  <div className="mt-4 space-y-2 text-xs">
                    {donor.batchOrSession && (
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800/60">
                        <span className="text-slate-400 text-[11px]">Academic Batch:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{donor.batchOrSession}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>Location:</span>
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{donor.location || 'Rangpur City'}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        <span>Last Donation:</span>
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{donor.lastDonationDate || 'First Time / Ready'}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 py-1">
                      <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>Total Donations:</span>
                      </span>
                      <span className="font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                        {donor.totalDonations || 0} {donor.totalDonations === 1 ? 'Time' : 'Times'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Section: Direct Phone Dial & Admin Controls */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${donor.phone}`}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-sm transition active:scale-95 text-center"
                      title={`Direct call ${donor.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call: {donor.phone}</span>
                    </a>

                    <button
                      onClick={() => handleCopyPhone(donor.phone)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs transition cursor-pointer"
                      title="Copy phone number"
                    >
                      {copiedPhone === donor.phone ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Admin Direct Actions */}
                  {isMasterAdmin && (
                    <div className="flex items-center justify-end space-x-2 pt-1 text-[11px]">
                      <button
                        onClick={() => setEditingDonor(donor)}
                        className="text-purple-600 dark:text-purple-400 hover:underline font-bold flex items-center space-x-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        onClick={() => handleDelete(donor.id, donor.name)}
                        className="text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REGISTER AS BLOOD DONOR MODAL */}
      {showRegisterModal && (
        <div
          onClick={() => setShowRegisterModal(false)}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                  <Droplet className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">Register as a Blood Donor</h3>
                  <p className="text-[11px] text-slate-500">Rangpur Textile Institute Voluntary Blood Bank</p>
                </div>
              </div>

              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-black text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Md. Tariqul Islam"
                  value={donorForm.name}
                  onChange={e => setDonorForm({ ...donorForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Blood Group *</label>
                  <select
                    value={donorForm.bloodGroup}
                    onChange={e => setDonorForm({ ...donorForm, bloodGroup: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-rose-600 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="A+">A+ (Positive)</option>
                    <option value="A-">A- (Negative)</option>
                    <option value="B+">B+ (Positive)</option>
                    <option value="B-">B- (Negative)</option>
                    <option value="O+">O+ (Positive)</option>
                    <option value="O-">O- (Negative)</option>
                    <option value="AB+">AB+ (Positive)</option>
                    <option value="AB-">AB- (Negative)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Gender</label>
                  <select
                    value={donorForm.gender}
                    onChange={e => setDonorForm({ ...donorForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Department *</label>
                  <select
                    value={donorForm.department}
                    onChange={e => setDonorForm({ ...donorForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Wet Processing">Wet Processing</option>
                    <option value="Yarn Manufacturing">Yarn Manufacturing</option>
                    <option value="Fabric Manufacturing">Fabric Manufacturing</option>
                    <option value="Apparel Manufacturing">Apparel Manufacturing</option>
                    <option value="Faculty & Staff">Faculty & Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Academic Session / Batch</label>
                  <input
                    type="text"
                    placeholder="e.g., Session 2025-26 (15th Batch)"
                    value={donorForm.batchOrSession}
                    onChange={e => setDonorForm({ ...donorForm, batchOrSession: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XX-XXXXXX"
                    value={donorForm.phone}
                    onChange={e => setDonorForm({ ...donorForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Location / Hostel / Address</label>
                  <input
                    type="text"
                    placeholder="e.g., Shahid Titumir Hall / Lalbagh"
                    value={donorForm.location}
                    onChange={e => setDonorForm({ ...donorForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Availability Status</label>
                  <select
                    value={donorForm.availabilityStatus}
                    onChange={e => setDonorForm({ ...donorForm, availabilityStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-bold focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Available Now">Available Now (Ready)</option>
                    <option value="Emergency Only">Emergency Only</option>
                    <option value="Cooldown / Recently Donated">Cooldown / Recently Donated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Last Donation Date</label>
                  <input
                    type="date"
                    value={donorForm.lastDonationDate}
                    onChange={e => setDonorForm({ ...donorForm, lastDonationDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white rounded-xl font-black shadow-md"
                >
                  Confirm & Join Donor Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DONOR MODAL (ADMIN) */}
      {editingDonor && (
        <div
          onClick={() => setEditingDonor(null)}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">Edit Blood Donor Record</h3>
              <button onClick={() => setEditingDonor(null)} className="text-slate-400 hover:text-white font-black">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Donor Name</label>
                <input
                  type="text"
                  required
                  value={editingDonor.name}
                  onChange={e => setEditingDonor({ ...editingDonor, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Blood Group</label>
                  <select
                    value={editingDonor.bloodGroup}
                    onChange={e => setEditingDonor({ ...editingDonor, bloodGroup: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-rose-600"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingDonor.phone}
                    onChange={e => setEditingDonor({ ...editingDonor, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    value={editingDonor.location || ''}
                    onChange={e => setEditingDonor({ ...editingDonor, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Availability Status</label>
                  <select
                    value={editingDonor.availabilityStatus || 'Available Now'}
                    onChange={e => setEditingDonor({ ...editingDonor, availabilityStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="Available Now">Available Now</option>
                    <option value="Emergency Only">Emergency Only</option>
                    <option value="Cooldown / Recently Donated">Cooldown / Recently Donated</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingDonor(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white rounded-xl font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMERGENCY BLOOD SOS MODAL */}
      {showEmergencySOSModal && (
        <div
          onClick={() => setShowEmergencySOSModal(false)}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-rose-500/50 space-y-4 text-center max-h-[90vh] overflow-y-auto"
          >
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto animate-pulse">
              <PhoneCall className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">Emergency Blood SOS Dispatch</h3>
              <p className="text-xs text-slate-500 mt-1">
                Direct hotline to RTI Red Crescent Youth Unit & Campus Medical Officer
              </p>
            </div>

            <div className="space-y-2 text-left text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Youth Red Crescent Coordinator</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Md. Tariqul Islam</span>
                </div>
                <a href="tel:01712-334455" className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg">
                  Call 01712-334455
                </a>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">RTI Medical & First Aid Unit</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Campus Health Center</span>
                </div>
                <a href="tel:+8801711444555" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg">
                  Call First Aid
                </a>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Rangpur Medical College Blood Bank</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Central Blood Bank (RpMC)</span>
                </div>
                <a href="tel:052162333" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg">
                  Call RpMC
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowEmergencySOSModal(false)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200"
            >
              Close SOS Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
