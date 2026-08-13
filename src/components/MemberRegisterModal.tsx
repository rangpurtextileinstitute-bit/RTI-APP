import React, { useState } from 'react';
import { UserPlus, Sparkles, QrCode, Camera } from 'lucide-react';
import { RegisteredMember, DepartmentType } from '../types';

interface MemberRegisterModalProps {
  onClose: () => void;
  onRegister: (member: RegisteredMember) => void;
}

export const MemberRegisterModal: React.FC<MemberRegisterModalProps> = ({
  onClose,
  onRegister
}) => {
  const [rollOrEmpId, setRollOrEmpId] = useState(`RTI-REG-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState('');
  const [role, setRole] = useState<RegisteredMember['role']>('Student');
  const [staffCategory, setStaffCategory] = useState<RegisteredMember['staffCategory']>('Student');
  const [department, setDepartment] = useState<DepartmentType | 'General Administration'>('wet_processing');
  const [batchOrDesignation, setBatchOrDesignation] = useState('Batch 52 (Textile Engineering)');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+880 1700-123456');
  const [photoUrl, setPhotoUrl] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mandatory Photo Validation
    if (!photoUrl) {
      alert('⚠️ Mandatory Validation Failed: Profile photo upload is compulsory for all registrations (Student, Teacher, Staff, Lab Users). Please upload a picture before proceeding.');
      return;
    }

    const newMember: RegisteredMember = {
      id: `mem-${Date.now()}`,
      rollOrEmpId,
      name,
      role,
      staffCategory,
      department,
      batchOrDesignation,
      email: email || `${rollOrEmpId.toLowerCase()}@rangpurtextile.edu.bd`,
      phone,
      photoUrl,
      qrCodeData: `RTI:MEMBER:${rollOrEmpId}:${name.replace(/\s+/g, '')}:${role}:${staffCategory || 'General'}`,
      accessStatus: 'Active',
      lastSeen: 'Just Registered'
    };
    onRegister(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-purple-500/40 max-w-lg w-full p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-purple-400" />
            <span>Register Member (Student, Teacher, Staff)</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white font-bold mb-1">ID / Roll Number *</label>
              <input
                type="text"
                value={rollOrEmpId}
                onChange={e => setRollOrEmpId(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-1">System Role *</label>
              <select
                value={role}
                onChange={e => {
                  const val = e.target.value as RegisteredMember['role'];
                  setRole(val);
                  if (val === 'Student') setStaffCategory('Student');
                  else if (val === 'Faculty') setStaffCategory('Teacher');
                  else setStaffCategory('Office Staff');
                }}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 text-white font-bold rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Student">Student</option>
                <option value="Faculty">Teacher / Faculty</option>
                <option value="Staff">Staff Member</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white font-bold mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Dr. Tanvir Rahman"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white font-bold mb-1">Member Category *</label>
              <select
                value={staffCategory}
                onChange={e => setStaffCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 text-white font-bold rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher / Faculty</option>
                <option value="Library Staff / User">Library Staff / User</option>
                <option value="Physics Lab Staff / User">Physics Lab Staff / User</option>
                <option value="Office Staff">Office Staff</option>
                <option value="Lab Technician">Lab Technician</option>
              </select>
            </div>
            <div>
              <label className="block text-white font-bold mb-1">Department *</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 text-white font-bold rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="wet_processing">Wet Processing</option>
                <option value="yarn_mfg">Yarn Manufacturing</option>
                <option value="fabric_mfg">Fabric Manufacturing</option>
                <option value="apparel_mfg">Apparel Manufacturing</option>
                <option value="General Administration">General Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white font-bold mb-1">Batch / Designation *</label>
              <input
                type="text"
                value={batchOrDesignation}
                onChange={e => setBatchOrDesignation(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-1">Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-bold mb-1">Institute Email</label>
            <input
              type="email"
              placeholder="user@rangpurtextile.edu.bd"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Mandatory Profile Photo Upload Field */}
          <div className="p-3.5 bg-purple-950/40 border border-purple-500/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-white font-extrabold flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-purple-400" />
                <span>Mandatory Profile Photo *</span>
              </label>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                COMPULSORY FOR GATE SECURITY
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border-2 border-purple-500/60 text-purple-200 font-bold text-xs flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-500 text-center text-[10px]">No Photo</span>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs text-slate-300 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="Or paste photo URL (https://...)"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4 text-purple-200" />
              <span>Issue QR Gate Pass Badge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

