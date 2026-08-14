import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  Award, 
  Share2, 
  Bookmark, 
  Printer, 
  X,
  FileText,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { InstituteMagazine } from '../types';

interface InstituteDigitalMagazineProps {
  magazines: InstituteMagazine[];
  isMasterAdmin: boolean;
  activeRole?: string;
  onAddMagazine: (magazine: InstituteMagazine) => void;
}

export const InstituteDigitalMagazine: React.FC<InstituteDigitalMagazineProps> = ({
  magazines,
  isMasterAdmin,
  activeRole = 'Super Admin',
  onAddMagazine
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingMagazine, setReadingMagazine] = useState<InstituteMagazine | null>(null);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  // New Article Form
  const [formData, setFormData] = useState({
    title: 'Rangpur Textile Canvas 2027',
    issueNo: 'Issue #15 (2027 Special)',
    year: 2027,
    editorInChief: 'Dr. Sharmin Akter',
    theme: 'AI-Driven Smart Textiles & Zero-Waste Dyeing',
    summary: 'Focus on automated loom fault detection, bio-based pigment extraction, and industrial IoT in Bangladesh.',
    totalPages: 92,
    featuredArticle: 'Deep Neural Networks for Online Defect Classification in High-Speed Air-Jet Looms',
    author: 'Engr. Md. Rayhan Kabir',
    category: 'Technical Innovations',
    content: `Rangpur Textile Institute (RTI) proudly releases the latest edition of the Annual Digital Bulletin & Research Magazine. 

Key Articles in this Issue:
1. "Deep Neural Networks for Online Defect Classification in High-Speed Air-Jet Looms" by Engr. Md. Rayhan Kabir.
2. "Natural Pigment Extraction from Indigenous Flora of Rangpur Division for Eco-Friendly Cotton Processing" by Dept of Wet Processing.
3. "Industrial IoT Sensors in Yarn Ring Spinning Frame Vibration Analysis" by Department of Yarn Manufacturing.

Abstract & Insights:
The textile industry in Bangladesh is rapidly transitioning towards Industry 4.0 automation and green sustainability. This research compilation highlights groundbreaking innovations pioneered by RTI faculty and students.`
  });

  const categories = ['All', 'Technical Innovations', 'Research Papers', 'Creative Writing & Poetry', 'Campus News', 'Alumni Stories'];

  const filteredMagazines = magazines.filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.theme?.includes(selectedCategory) || m.title?.includes(selectedCategory);
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.editorInChief.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const canPublish = isMasterAdmin || activeRole === 'Teacher' || activeRole === 'Faculty' || activeRole === 'Dept Admin' || activeRole === 'Super Admin';

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.editorInChief) {
      alert('Please fill in title and editor details.');
      return;
    }

    const newMag: InstituteMagazine = {
      id: `mag-${Date.now()}`,
      title: formData.title,
      issueNo: formData.issueNo,
      year: formData.year,
      coverPhotoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
      editorInChief: formData.editorInChief,
      theme: formData.theme,
      summary: formData.summary,
      totalPages: formData.totalPages,
      featuredArticle: formData.featuredArticle,
      pdfUrl: '#',
      publishedDate: new Date().toISOString().split('T')[0]
    };

    onAddMagazine(newMag);
    setShowPublishModal(false);
    alert('📰 New Magazine Issue / Bulletin published successfully!');
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border border-purple-800/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <BookOpen className="w-64 h-64 text-purple-400" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                  Rangpur Textile Institute Digital Publication
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-mono flex items-center space-x-2">
                  <span>Institute Digital Magazine & Research Bulletin</span>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </h2>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-300 max-w-3xl leading-relaxed">
              Explore annual institute publications, textile research papers, campus innovations, creative poems, stories, and department achievements written by RTI faculty and students.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canPublish ? (
              <button
                onClick={() => setShowPublishModal(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Publish New Edition / Article</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-1">
                <span>🔒 Read-Only Reader Mode</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search magazine, editor, topic..."
            className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Magazine Editions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMagazines.map((mag) => (
          <div
            key={mag.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-purple-500/50 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Cover Photo Banner */}
              <div className="relative h-48 bg-slate-950 overflow-hidden">
                <img
                  src={mag.coverPhotoUrl || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'}
                  alt={mag.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-purple-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-mono font-bold text-purple-300 border border-purple-500/40">
                  {mag.issueNo}
                </div>
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-300 border border-slate-700">
                  {mag.totalPages} Pages
                </div>
              </div>

              {/* Magazine Details */}
              <div className="p-5 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                  <Award className="w-4 h-4" />
                  <span>Editor-in-Chief: {mag.editorInChief}</span>
                </div>

                <h3 className="font-extrabold text-lg text-white font-mono group-hover:text-purple-300 transition-colors">
                  {mag.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {mag.summary}
                </p>

                {mag.featuredArticle && (
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Featured Research:</span>
                    <p className="font-bold text-slate-200 text-xs italic">
                      "{mag.featuredArticle}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-5 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{mag.publishedDate || mag.year}</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setReadingMagazine(mag)}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-1.5 shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read Article</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Magazine Full Reader Modal */}
      {readingMagazine && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-purple-700/60 space-y-4 sm:space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 font-mono text-xs font-bold rounded-lg border border-purple-500/40">
                    {readingMagazine.issueNo}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Published {readingMagazine.publishedDate || readingMagazine.year}</span>
                </div>
                <h2 className="text-2xl font-black text-white font-mono">{readingMagazine.title}</h2>
                <div className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>Editorial Board: {readingMagazine.editorInChief}</span>
                </div>
              </div>

              <button
                onClick={() => setReadingMagazine(null)}
                className="text-slate-400 hover:text-white font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-700">
              <img
                src={readingMagazine.coverPhotoUrl || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'}
                alt={readingMagazine.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                <span className="text-xs font-bold text-purple-300 uppercase">Featured Theme</span>
                <h3 className="text-lg font-bold text-white font-mono">{readingMagazine.theme}</h3>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-extrabold text-sm text-purple-300 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Executive Summary & Editorial Note</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {readingMagazine.summary}
              </p>
            </div>

            {readingMagazine.featuredArticle && (
              <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 space-y-2">
                <h4 className="font-extrabold text-xs uppercase text-indigo-300">Featured Peer-Reviewed Article:</h4>
                <p className="font-bold text-white text-sm">
                  "{readingMagazine.featuredArticle}"
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-mono">
                Total Pages: {readingMagazine.totalPages}
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() => alert('📄 Printable PDF version queued for download.')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full PDF Edition</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish New Article Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-purple-700/60 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-purple-400">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-white">Publish Institute Magazine / Bulletin</h3>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-200 font-bold mb-1">Publication Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Rangpur Textile Canvas 2027"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Issue / Volume No *</label>
                  <input
                    type="text"
                    required
                    value={formData.issueNo}
                    onChange={(e) => setFormData({ ...formData, issueNo: e.target.value })}
                    placeholder="e.g. Issue #15 (2027)"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1">Editor-in-Chief *</label>
                  <input
                    type="text"
                    required
                    value={formData.editorInChief}
                    onChange={(e) => setFormData({ ...formData, editorInChief: e.target.value })}
                    placeholder="e.g. Dr. Sharmin Akter"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Main Theme / Innovation Focus</label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="e.g. AI-Driven Smart Textiles & Bio-Dyeing"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Featured Paper / Headline</label>
                <input
                  type="text"
                  value={formData.featuredArticle}
                  onChange={(e) => setFormData({ ...formData, featuredArticle: e.target.value })}
                  placeholder="Title of lead research article..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Summary / Editorial Note</label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Short abstract of publication..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs shadow-lg shadow-purple-600/30"
                >
                  Publish Edition Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
