import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, FileText, Image, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await api.getModules();
        if (res.success && res.modules) {
          const found = res.modules.find(m => m._id === id);
          if (found) {
            setMod(found);
            if (found.lessons && found.lessons.length > 0) {
              setActiveLesson(0);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch module:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="text-center py-20 text-gray-400">Memuat modul...</div>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-4">Modul tidak ditemukan</p>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-brand-primary text-brand-dark font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors">
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentLesson = mod.lessons?.[activeLesson];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} /> Kembali ke Modul
        </button>
        <h2 className="text-2xl sm:text-3xl font-black mb-2">{mod.title}</h2>
        <p className="text-gray-400 text-sm">{mod.lessons?.length || 0} lessons • {mod.batch || 'Semua Batch'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lesson Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Daftar Lesson</h3>
          <div className="space-y-2">
            {mod.lessons?.map((lesson, idx) => (
              <button
                key={idx}
                onClick={() => setActiveLesson(idx)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  activeLesson === idx
                    ? 'bg-brand-primary/15 border border-brand-primary/40 text-brand-primary'
                    : 'bg-brand-secondary border border-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    activeLesson === idx ? 'bg-brand-primary text-brand-dark' : 'bg-white/5 text-gray-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{lesson.title}</p>
                    <p className="text-[10px] text-gray-500">{lesson.steps?.length || 0} langkah</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {currentLesson ? (
            <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 sm:p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{currentLesson.title}</h3>
                <p className="text-sm text-gray-400">{currentLesson.steps?.length || 0} langkah</p>
              </div>

              <div className="space-y-6">
                {currentLesson.steps?.map((step, stepIdx) => (
                  <div key={stepIdx} className="bg-brand-dark border border-white/5 rounded-xl p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-black text-gray-600">LANGKAH {stepIdx + 1}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        step.type === 'text' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {step.type === 'text' ? 'Teks' : 'Gambar'}
                      </span>
                    </div>

                    {step.type === 'text' ? (
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{step.content}</p>
                    ) : (
                      <div>
                        {(step.content || step.imageUrl) && (
                          <img src={step.content || step.imageUrl} alt={step.description || 'Gambar materi'} className="w-full rounded-xl mb-3 max-h-96 object-contain bg-brand-dark" />
                        )}
                        {step.description && (
                          <p className="text-sm text-gray-400 italic bg-brand-secondary/50 rounded-lg p-3 mt-2">{step.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {(!currentLesson.steps || currentLesson.steps.length === 0) && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText size={40} className="mx-auto mb-3 opacity-30" />
                    <p>Belum ada konten untuk lesson ini</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))}
                  disabled={activeLesson === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={16} /> Lesson Sebelumnya
                </button>
                <span className="text-xs text-gray-500">{activeLesson + 1} / {mod.lessons?.length}</span>
                <button
                  onClick={() => setActiveLesson(Math.min(mod.lessons.length - 1, activeLesson + 1))}
                  disabled={activeLesson >= mod.lessons.length - 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Lesson Selanjutnya <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-brand-secondary border border-white/10 rounded-2xl p-12 text-center text-gray-400">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
              <p>Pilih lesson dari sidebar untuk mulai belajar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
