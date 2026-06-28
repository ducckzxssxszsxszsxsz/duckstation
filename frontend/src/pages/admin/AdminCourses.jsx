import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, FileText, Image, GripVertical, Upload, X, Eye, EyeOff, CheckCircle, MoveUp, MoveDown } from 'lucide-react';
import api from '../../services/api';

// ─── STEP EDITOR ───
const StepEditor = ({ step, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className={`rounded-xl border transition-all ${step.type === 'text' ? 'border-green-500/20 bg-green-500/5' : 'border-purple-500/20 bg-purple-500/5'}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical size={14} className="text-gray-600 cursor-move shrink-0" />
        <span className="text-[10px] font-black text-gray-600 w-5">#{index + 1}</span>

        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${step.type === 'text' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
          {step.type === 'text' ? <FileText size={10} /> : <Image size={10} />}
          {step.type === 'text' ? 'TEKS' : 'GAMBAR'}
        </div>

        <p className="text-xs text-gray-300 flex-1 truncate">
          {step.type === 'text' ? (step.content || '(kosong)') : (step.description || '(tanpa deskripsi)')}
        </p>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onMoveUp} disabled={index === 0} className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"><MoveUp size={12} /></button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"><MoveDown size={12} /></button>
          <button onClick={() => setEditing(!editing)} className="p-1 text-gray-400 hover:text-blue-400 transition-colors"><Edit size={12} /></button>
          <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
        </div>
      </div>

      {editing && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3">
          {step.type === 'text' ? (
            <textarea rows={4} value={step.content} onChange={e => onUpdate({ ...step, content: e.target.value })}
              placeholder="Tuliskan materi/penjelasan langkah ini..."
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary/50 resize-none" />
          ) : (
            <>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-purple-500/30 transition-colors cursor-pointer bg-brand-dark">
                <Upload size={24} className="mx-auto mb-2 text-gray-500" />
                <p className="text-xs text-gray-400">Klik atau drag & drop gambar ke sini</p>
                <p className="text-[10px] text-gray-600 mt-1">JPG, PNG, WebP • Max 5MB</p>
              </div>
              <textarea rows={3} value={step.description} onChange={e => onUpdate({ ...step, description: e.target.value })}
                placeholder="Deskripsi / penjelasan untuk gambar ini..."
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary/50 resize-none" />
            </>
          )}
          <button onClick={() => setEditing(false)} className="px-4 py-1.5 bg-brand-primary text-brand-dark text-xs font-bold rounded-lg hover:bg-yellow-400 transition-colors">
            Simpan Step
          </button>
        </div>
      )}
    </div>
  );
};

// ─── LESSON CARD ───
const LessonCard = ({ lesson, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [editTitle, setEditTitle] = useState(false);

  const updateStep = (stepIdx, newData) => {
    const newSteps = [...lesson.steps];
    newSteps[stepIdx] = newData;
    onUpdate({ ...lesson, steps: newSteps });
  };

  const deleteStep = (stepIdx) => {
    const newSteps = lesson.steps.filter((_, i) => i !== stepIdx);
    onUpdate({ ...lesson, steps: newSteps });
  };

  const moveStep = (from, to) => {
    if (to < 0 || to >= lesson.steps.length) return;
    const newSteps = [...lesson.steps];
    const [moved] = newSteps.splice(from, 1);
    newSteps.splice(to, 0, moved);
    onUpdate({ ...lesson, steps: newSteps });
  };

  const addStep = (type) => {
    const newStep = { id: Date.now(), type, content: '', description: '' };
    onUpdate({ ...lesson, steps: [...lesson.steps, newStep] });
  };

  return (
    <div className="bg-brand-secondary border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/3"
        onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${lesson.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
            {lesson.id || lesson._id}
          </div>
          <div>
            {editTitle ? (
              <input type="text" defaultValue={lesson.title} autoFocus
                onClick={e => e.stopPropagation()}
                onBlur={e => { onUpdate({ ...lesson, title: e.target.value }); setEditTitle(false); }}
                onKeyDown={e => { if (e.key === 'Enter') { onUpdate({ ...lesson, title: e.target.value }); setEditTitle(false); } }}
                className="bg-brand-dark border border-brand-primary/50 rounded-lg px-2 py-1 text-sm text-white focus:outline-none" />
            ) : (
              <p className="font-bold text-sm" onDoubleClick={(e) => { e.stopPropagation(); setEditTitle(true); }}>{lesson.title}</p>
            )}
            <p className="text-[10px] text-gray-500">{lesson.steps?.length || 0} langkah • {(lesson.steps || []).filter(s => s.type === 'image').length} gambar • {(lesson.steps || []).filter(s => s.type === 'text').length} teks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
          {expanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/10 bg-brand-dark/40 p-4 space-y-2">
          {(!lesson.steps || lesson.steps.length === 0) ? (
            <p className="text-sm text-gray-500 text-center py-6">Belum ada konten. Tambahkan langkah di bawah.</p>
          ) : (
            lesson.steps.map((step, idx) => (
              <StepEditor
                key={step.id || idx}
                step={step}
                index={idx}
                total={lesson.steps.length}
                onUpdate={(d) => updateStep(idx, d)}
                onDelete={() => deleteStep(idx)}
                onMoveUp={() => moveStep(idx, idx - 1)}
                onMoveDown={() => moveStep(idx, idx + 1)}
              />
            ))
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={() => addStep('text')}
              className="flex-1 py-2.5 border border-dashed border-green-500/30 text-green-400 hover:bg-green-500/10 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
              <Plus size={13} /> Tambah Teks
            </button>
            <button onClick={() => addStep('image')}
              className="flex-1 py-2.5 border border-dashed border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
              <Plus size={13} /> Tambah Gambar + Deskripsi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN ───
const AdminCourses = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newModule, setNewModule] = useState({ title: '', batch: 'Semua Batch', status: 'draft', free: false });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.getAllModules();
        if (res.success && res.modules) {
          const mapped = res.modules.map(m => ({
            ...m,
            id: m._id,
            lessons: (m.lessons || []).map(l => ({ ...l, id: l._id || l.id, steps: l.steps || [] })),
          }));
          setModules(mapped);
          if (mapped.length > 0) setExpanded(mapped[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch modules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const updateModule = (modIdx, newData) => {
    const updated = [...modules];
    updated[modIdx] = newData;
    setModules(updated);
  };

  const updateLesson = (modIdx, lessonIdx, newLesson) => {
    const updated = [...modules];
    updated[modIdx].lessons[lessonIdx] = newLesson;
    setModules(updated);
  };

  const deleteLesson = (modIdx, lessonIdx) => {
    const updated = [...modules];
    updated[modIdx].lessons = updated[modIdx].lessons.filter((_, i) => i !== lessonIdx);
    setModules(updated);
  };

  const addLesson = (modIdx) => {
    const updated = [...modules];
    updated[modIdx].lessons.push({
      id: Date.now(),
      title: 'Lesson Baru (double-click untuk rename)',
      status: 'draft',
      steps: []
    });
    setModules(updated);
  };

  const addModule = () => {
    if (!newModule.title) return;
    setModules([...modules, { ...newModule, id: Date.now(), lessons: [] }]);
    setNewModule({ title: '', batch: 'Semua Batch', status: 'draft', free: false });
    setShowForm(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1">Course Builder</h2>
          <p className="text-gray-400">Buat materi pembelajaran dengan teks penjelasan dan gambar berdeskripsi per langkah.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-brand-dark font-bold rounded-xl hover:bg-yellow-400 transition-colors">
          <Plus size={18} /> Modul Baru
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Eye size={18} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300">
          <p className="font-bold text-brand-primary mb-1">Cara Menggunakan Course Builder</p>
          <ul className="space-y-1 text-xs text-gray-400">
            <li>• Klik modul → klik lesson → tambahkan <b>langkah</b> berupa <span className="text-green-400 font-bold">Teks</span> atau <span className="text-purple-400 font-bold">Gambar + Deskripsi</span></li>
            <li>• Setiap gambar wajib diisi deskripsi penjelasan agar siswa memahami konteks</li>
            <li>• Double-click judul lesson untuk rename. Geser langkah dengan tombol panah ↑↓</li>
          </ul>
        </div>
      </div>

      {/* Form Tambah Modul */}
      {showForm && (
        <div className="bg-brand-secondary border border-brand-primary/30 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Modul Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Judul Modul</label>
              <input type="text" value={newModule.title} onChange={e => setNewModule({ ...newModule, title: e.target.value })}
                placeholder="Contoh: Modul 4 – Advanced Entry"
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Batch Akses</label>
              <select value={newModule.batch} onChange={e => setNewModule({ ...newModule, batch: e.target.value })}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50">
                <option>Semua Batch</option>
                <option>Batch 5 Basic</option>
                <option>Batch 6 Pro</option>
              </select>
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newModule.free} onChange={e => setNewModule({ ...newModule, free: e.target.checked })} className="w-4 h-4 accent-yellow-400" />
                <span className="text-sm text-gray-300">Preview Gratis</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addModule} className="px-5 py-2 bg-brand-primary text-brand-dark font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors">Simpan</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-white/5 text-gray-400 font-medium rounded-xl text-sm hover:bg-white/10 transition-colors">Batal</button>
          </div>
        </div>
      )}

      {/* Module List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat modul...</div>
        ) : modules.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Belum ada modul.</div>
        ) : (
          modules.map((mod, modIdx) => (
            <div key={mod.id || mod._id} className="bg-brand-secondary border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/3"
                onClick={() => setExpanded(expanded === mod.id ? null : mod.id)}>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold">{mod.title}</h3>
                    {mod.free && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-500/20">GRATIS</span>}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${mod.status === 'published' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-gray-500/20 text-gray-400 border-gray-500/20'}`}>
                      {mod.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Akses: {mod.batch} • {mod.lessons?.length || 0} lessons</p>
                </div>
                <div className="flex items-center gap-2">
                  {expanded === mod.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </div>

              {expanded === mod.id && (
                <div className="border-t border-white/10 bg-brand-dark/50 p-4 space-y-3">
                  {(!mod.lessons || mod.lessons.length === 0) ? (
                    <p className="text-sm text-gray-500 text-center py-4">Belum ada lesson. Klik tombol di bawah.</p>
                  ) : (
                    mod.lessons.map((lesson, lessonIdx) => (
                      <LessonCard
                        key={lesson.id || lessonIdx}
                        lesson={lesson}
                        onUpdate={(d) => updateLesson(modIdx, lessonIdx, d)}
                        onDelete={() => deleteLesson(modIdx, lessonIdx)}
                      />
                    ))
                  )}
                  <button onClick={() => addLesson(modIdx)}
                    className="w-full py-2.5 border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <Plus size={14} /> Tambah Lesson
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
