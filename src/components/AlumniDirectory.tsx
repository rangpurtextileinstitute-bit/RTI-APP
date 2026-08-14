import React, { useState } from 'react';
import { Search, MapPin, Building2, Briefcase, Mail, Phone, GraduationCap } from 'lucide-react';
import { AlumniRecord } from '../types';

interface AlumniDirectoryProps {
  alumniList: AlumniRecord[];
}

export const AlumniDirectory: React.FC<AlumniDirectoryProps> = ({ alumniList }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlumni = alumniList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.currentCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.passingBatch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-black text-white mb-4">Ex-Students (Alumni) Directory</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, company, role, or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlumni.map((alumni) => (
          <div key={alumni.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-950/50 rounded-lg">
                <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                {alumni.passingBatch}
              </span>
            </div>
            
            <div>
              <h3 className="font-black text-slate-900 dark:text-white">{alumni.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{alumni.department}</p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <Briefcase className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                {alumni.currentRole}
              </div>
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <Building2 className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                {alumni.currentCompany}
              </div>
              <div className="flex items-center text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 mr-2" />
                {alumni.jobLocation}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex space-x-2">
              <a href={`mailto:${alumni.email}`} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                <Mail className="w-4 h-4" />
              </a>
              <a href={`tel:${alumni.phone}`} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
