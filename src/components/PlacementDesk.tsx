import React from 'react';
import { Briefcase, Building2, MapPin, Clock } from 'lucide-react';

export const PlacementDesk: React.FC = () => {
  const jobs = [
    { id: 1, title: 'Junior Merchandiser', company: 'Square Fashions Ltd', location: 'Dhaka', type: 'Full-time' },
    { id: 2, title: 'Intern - Quality Control', company: 'Pacific Jeans Ltd', location: 'Chittagong', type: 'Internship' },
    { id: 3, title: 'Production Officer', company: 'DBL Group', location: 'Gazipur', type: 'Full-time' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-black text-white mb-2">Job & Internship Placement Desk</h2>
        <p className="text-slate-400 text-xs">Latest opportunities from the textile and garment industry.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 dark:text-white">{job.title}</h3>
              <div className="flex items-center text-xs text-slate-500">
                <Building2 className="w-3.5 h-3.5 mr-1" /> {job.company}
                <MapPin className="w-3.5 h-3.5 ml-3 mr-1" /> {job.location}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${job.type === 'Full-time' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {job.type}
              </span>
              <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors">Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
