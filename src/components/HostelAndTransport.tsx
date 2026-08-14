import React from 'react';
import { Bus, Home, Clock, MapPin } from 'lucide-react';

export const HostelAndTransport: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-black text-white mb-2">Hostel & Transport Info</h2>
        <p className="text-slate-400 text-xs">Bus schedules, routes, and hostel facility details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white flex items-center">
            <Bus className="w-5 h-5 mr-2 text-indigo-500" /> Transport Schedules
          </h3>
          <div className="space-y-3">
             <div className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="font-bold">Route 1: City Center</span>
                <span className="text-slate-500">07:30 AM</span>
             </div>
             <div className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="font-bold">Route 2: Residential Area</span>
                <span className="text-slate-500">08:00 AM</span>
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white flex items-center">
            <Home className="w-5 h-5 mr-2 text-indigo-500" /> Hostel Details
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Information regarding hostel allocation, rules, mess facilities, and room management.
          </p>
           <button className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-xs hover:bg-indigo-100 transition-colors">
             View Hostel Policy
           </button>
        </div>
      </div>
    </div>
  );
};
