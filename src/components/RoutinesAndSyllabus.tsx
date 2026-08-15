import React, { useState } from 'react';
import { Calendar, BookOpen, Download, FileText, Upload, Edit2, Shield, Check, X, Eye, FileUp, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { safeLocalStorageSet } from '../lib/storage';

interface MaterialItem {
  title: string;
  url: string;
  updatedAt: string;
  fileSize?: string;
  fileName?: string;
}

interface SemesterMaterial {
  id: number;
  name: string;
  routine: MaterialItem;
  syllabus: MaterialItem;
  notes?: string;
}

interface RoutinesAndSyllabusProps {
  isMasterAdmin?: boolean;
}

const DEFAULT_SEMESTERS: SemesterMaterial[] = [
  {
    id: 1,
    name: '1st Semester',
    routine: {
      title: '1st Semester Class Routine (Academic Session 2026)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-08-01',
      fileSize: '1.2 MB',
      fileName: '1st_Semester_Routine_2026.pdf'
    },
    syllabus: {
      title: '1st Semester B.Sc Textile Engineering Complete Syllabus',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-01-10',
      fileSize: '2.8 MB',
      fileName: '1st_Semester_Syllabus.pdf'
    },
    notes: 'Includes General Chemistry, Physics-I, Textile Raw Materials, and Engineering Drawing.'
  },
  {
    id: 2,
    name: '2nd Semester',
    routine: {
      title: '2nd Semester Class Routine (Academic Session 2026)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-08-01',
      fileSize: '1.4 MB',
      fileName: '2nd_Semester_Routine_2026.pdf'
    },
    syllabus: {
      title: '2nd Semester Yarn & Fabric Production Syllabus',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-01-10',
      fileSize: '3.1 MB',
      fileName: '2nd_Semester_Syllabus.pdf'
    },
    notes: 'Focus on Fiber Technology, Textile Mathematics, and Polymer Science.'
  },
  {
    id: 3,
    name: '3rd Semester',
    routine: {
      title: '3rd Semester Class Routine (Academic Session 2026)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-08-01',
      fileSize: '1.1 MB',
      fileName: '3rd_Semester_Routine_2026.pdf'
    },
    syllabus: {
      title: '3rd Semester Wet Processing & Garments Syllabus',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-01-10',
      fileSize: '3.5 MB',
      fileName: '3rd_Semester_Syllabus.pdf'
    },
    notes: 'Covers Short Staple Spinning, Weaving Preparation, and Pre-treatment Chemistry.'
  },
  {
    id: 4,
    name: '4th Semester',
    routine: {
      title: '4th Semester Class Routine (Academic Session 2026)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-08-01',
      fileSize: '1.3 MB',
      fileName: '4th_Semester_Routine_2026.pdf'
    },
    syllabus: {
      title: '4th Semester Advanced Textile Manufacturing Syllabus',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-01-10',
      fileSize: '3.2 MB',
      fileName: '4th_Semester_Syllabus.pdf'
    },
    notes: 'Long Staple Spinning, Knitting Technology, Dyeing Technology I, and Sewing Machinery.'
  },
  {
    id: 5,
    name: '5th Semester',
    routine: {
      title: '5th Semester Class Routine (Academic Session 2026)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-08-01',
      fileSize: '1.5 MB',
      fileName: '5th_Semester_Routine_2026.pdf'
    },
    syllabus: {
      title: '5th Semester Textile Testing & Quality Control Syllabus',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-01-10',
      fileSize: '4.0 MB',
      fileName: '5th_Semester_Syllabus.pdf'
    },
    notes: 'TTQC-I, Printing Technology, Apparel Merchandising, and Non-woven Structures.'
  },
  {
    id: 6,
    name: '6th Semester',
    routine: {
      title: '6th Semester Class Routine (Academic Session 2026)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-08-01',
      fileSize: '1.2 MB',
      fileName: '6th_Semester_Routine_2026.pdf'
    },
    syllabus: {
      title: '6th Semester Special Yarn & Smart Textiles Syllabus',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-01-10',
      fileSize: '3.8 MB',
      fileName: '6th_Semester_Syllabus.pdf'
    },
    notes: 'Special Dyeing, Modern Weaving, Garment Production Planning, and TTQC-II.'
  },
  {
    id: 7,
    name: '7th Semester',
    routine: {
      title: '7th Semester Class Routine (Academic Session 2026)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-08-01',
      fileSize: '1.3 MB',
      fileName: '7th_Semester_Routine_2026.pdf'
    },
    syllabus: {
      title: '7th Semester Technical Textiles & Mill Management Syllabus',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-01-10',
      fileSize: '4.2 MB',
      fileName: '7th_Semester_Syllabus.pdf'
    },
    notes: 'Industrial Engineering, ETP & Environmental Management, and Project Defense.'
  },
  {
    id: 8,
    name: '8th Semester',
    routine: {
      title: '8th Semester Industrial Attachment Routine',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-08-01',
      fileSize: '1.0 MB',
      fileName: '8th_Semester_Industrial_Attachment.pdf'
    },
    syllabus: {
      title: '8th Semester Internship, Thesis & Mill Attachment Guidelines',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      updatedAt: '2026-01-10',
      fileSize: '2.5 MB',
      fileName: '8th_Semester_Syllabus_Thesis.pdf'
    },
    notes: '4 Months Mill Industrial Training, Comprehensive Viva, and Final Thesis Presentation.'
  }
];

export const RoutinesAndSyllabus: React.FC<RoutinesAndSyllabusProps> = ({ isMasterAdmin = false }) => {
  const [semesters, setSemesters] = useState<SemesterMaterial[]>(() => {
    try {
      const saved = localStorage.getItem('rti_routines_syllabus_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SEMESTERS;
    } catch {
      return DEFAULT_SEMESTERS;
    }
  });

  const [editingModal, setEditingModal] = useState<{
    semesterId: number;
    type: 'routine' | 'syllabus';
  } | null>(null);

  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editFileSize, setEditFileSize] = useState('');
  const [editFileName, setEditFileName] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  const saveSemesters = (updated: SemesterMaterial[]) => {
    setSemesters(updated);
    safeLocalStorageSet('rti_routines_syllabus_v1', updated);
  };

  const handleOpenEditModal = (semesterId: number, type: 'routine' | 'syllabus') => {
    if (!isMasterAdmin) return;
    const sem = semesters.find(s => s.id === semesterId);
    if (!sem) return;

    const target = type === 'routine' ? sem.routine : sem.syllabus;
    setEditingModal({ semesterId, type });
    setEditTitle(target.title || '');
    setEditUrl(target.url || '');
    setEditDate(target.updatedAt || new Date().toISOString().split('T')[0]);
    setEditFileSize(target.fileSize || '1.5 MB');
    setEditFileName(target.fileName || `${sem.name}_${type}.pdf`);
    setFileDataUrl(null);
    setUploadSuccessMsg('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Format file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setEditFileSize(sizeInMB);
    setEditFileName(file.name);

    // Read as Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFileDataUrl(result);
        setEditUrl(result);
        setUploadSuccessMsg(`File "${file.name}" uploaded successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = () => {
    if (!editingModal || !isMasterAdmin) return;
    const { semesterId, type } = editingModal;

    const finalUrl = fileDataUrl || editUrl.trim() || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

    const updated = semesters.map(sem => {
      if (sem.id !== semesterId) return sem;
      const updatedItem: MaterialItem = {
        title: editTitle.trim() || `${sem.name} ${type === 'routine' ? 'Routine' : 'Syllabus'}`,
        url: finalUrl,
        updatedAt: editDate || new Date().toISOString().split('T')[0],
        fileSize: editFileSize || '1.5 MB',
        fileName: editFileName || `${sem.name}_${type}.pdf`
      };

      return {
        ...sem,
        [type]: updatedItem
      };
    });

    saveSemesters(updated);
    setEditingModal(null);
  };

  const handleResetDefaults = () => {
    if (!isMasterAdmin) return;
    if (confirm('Are you sure you want to reset all Routines & Syllabus back to default files?')) {
      saveSemesters(DEFAULT_SEMESTERS);
      localStorage.removeItem('rti_routines_syllabus_v1');
    }
  };

  const handleDownload = (item: MaterialItem, defaultName: string) => {
    if (!item.url || item.url === '#') {
      alert(`Downloading official document: ${item.title}`);
      return;
    }

    if (item.url.startsWith('data:') || item.url.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.fileName || defaultName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 border border-indigo-900/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-black text-white">Class Routines & Course Syllabus</h2>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Access official semester class routines, exam schedules, and curriculum documents for 1st through 8th semesters.
          </p>
        </div>

        {isMasterAdmin ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
              title="Reset all routines and syllabus to original state"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Defaults</span>
            </button>
            <div className="px-3.5 py-1.5 bg-purple-950/90 border border-purple-500/50 rounded-xl text-xs font-bold text-purple-300 flex items-center space-x-1.5 shadow-lg shadow-purple-950/50">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Main Admin Edit Mode Active</span>
            </div>
          </div>
        ) : (
          <div className="px-3 py-1.5 bg-indigo-950/60 border border-indigo-800/40 rounded-xl text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Official RTI Academic Documents</span>
          </div>
        )}
      </div>

      {/* Grid of 8 Semesters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {semesters.map((sem) => (
          <div 
            key={sem.id} 
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
          >
            <div>
              {/* Semester Header */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-3">
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-black flex items-center justify-center mr-2 border border-indigo-500/20">
                    S{sem.id}
                  </span>
                  {sem.name}
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  B.Sc Tech
                </span>
              </div>

              {/* Routine Box */}
              <div className="space-y-2 mb-3">
                <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-1.5 text-xs font-black text-indigo-950 dark:text-indigo-200">
                      <FileText className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>Class Routine</span>
                    </div>
                    {isMasterAdmin && (
                      <button
                        onClick={() => handleOpenEditModal(sem.id, 'routine')}
                        className="p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-extrabold flex items-center space-x-1 cursor-pointer transition shadow-sm"
                        title="Edit / Upload Routine PDF for this semester"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                    {sem.routine.title}
                  </p>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-slate-400 border-t border-indigo-100/60 dark:border-indigo-900/40 pt-1.5">
                    <span>Updated: {sem.routine.updatedAt}</span>
                    <span className="font-bold">{sem.routine.fileSize || '1.2 MB'}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(sem.routine, `${sem.name}_Routine.pdf`)}
                    className="w-full mt-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Routine PDF</span>
                  </button>
                </div>

                {/* Syllabus Box */}
                <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-1.5 text-xs font-black text-purple-950 dark:text-purple-200">
                      <BookOpen className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                      <span>Course Syllabus</span>
                    </div>
                    {isMasterAdmin && (
                      <button
                        onClick={() => handleOpenEditModal(sem.id, 'syllabus')}
                        className="p-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-extrabold flex items-center space-x-1 cursor-pointer transition shadow-sm"
                        title="Edit / Upload Syllabus PDF for this semester"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                    {sem.syllabus.title}
                  </p>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-slate-400 border-t border-purple-100/60 dark:border-purple-900/40 pt-1.5">
                    <span>Updated: {sem.syllabus.updatedAt}</span>
                    <span className="font-bold">{sem.syllabus.fileSize || '2.5 MB'}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(sem.syllabus, `${sem.name}_Syllabus.pdf`)}
                    className="w-full mt-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Syllabus PDF</span>
                  </button>
                </div>
              </div>

              {/* Semester Key Topics Notes */}
              {sem.notes && (
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                  <strong className="text-slate-700 dark:text-slate-300 font-bold block mb-0.5">Key Subjects / Modules:</strong>
                  {sem.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Upload Modal (Main Admin Only) */}
      {editingModal && isMasterAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white space-y-4 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-black text-base text-indigo-300 flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-indigo-400" />
                  <span>Update {editingModal.type === 'routine' ? 'Class Routine' : 'Course Syllabus'}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Semester #{editingModal.semesterId} — Admin Document Uploader
                </p>
              </div>
              <button 
                onClick={() => setEditingModal(null)} 
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Document Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="e.g. 1st Semester Final Class Routine 2026"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Upload File Section */}
              <div className="bg-slate-950 p-4 rounded-xl border-2 border-dashed border-indigo-500/40 space-y-2 text-center">
                <FileUp className="w-7 h-7 mx-auto text-indigo-400" />
                <div className="text-slate-300 font-bold">Upload PDF Document File</div>
                <p className="text-[11px] text-slate-500">
                  Select a PDF, DOCX, or image file from your device
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="admin-pdf-upload-input"
                />
                <label
                  htmlFor="admin-pdf-upload-input"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer transition shadow-md"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File to Upload</span>
                </label>

                {uploadSuccessMsg && (
                  <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 font-bold text-[11px] flex items-center justify-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{uploadSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* OR Custom Link / URL */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Or Document Web Link / Cloud URL</label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={e => setEditUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Display Size</label>
                  <input
                    type="text"
                    value={editFileSize}
                    onChange={e => setEditFileSize(e.target.value)}
                    placeholder="e.g. 1.8 MB"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes & Publish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
