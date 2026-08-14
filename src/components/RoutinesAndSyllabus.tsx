import React from 'react';
import { Calendar, BookOpen, Download, FileText } from 'lucide-react';

export const RoutinesAndSyllabus: React.FC = () => {
  const semesters = [
    { id: 1, name: '1st Semester', routine: 'routine_s1.pdf', syllabus: 'syllabus_s1.pdf' },
    { id: 2, name: '2nd Semester', routine: 'routine_s2.pdf', syllabus: 'syllabus_s2.pdf' },
    { id: 3, name: '3rd Semester', routine: 'routine_s3.pdf', syllabus: 'syllabus_s3.pdf' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-black text-white mb-2">Routines & Syllabus</h2>
        <p className="text-slate-400 text-xs">View and download your semester schedules and course materials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {semesters.map((sem) => (
          <div key={sem.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
              {sem.name}
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between px-3 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
                <span className="flex items-center"><FileText className="w-3.5 h-3.5 mr-2" /> Class Routine</span>
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors">
                <span className="flex items-center"><BookOpen className="w-3.5 h-3.5 mr-2" /> Course Syllabus</span>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
