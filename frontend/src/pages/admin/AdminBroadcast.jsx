import React, { useState } from 'react';
import { Bell, Send, Users, Zap, BookOpen } from 'lucide-react';

const history = [
  { id: 1, title: 'Sinyal Live Trade: XAUUSD Buy', target: 'Semua Member', type: 'signal',   sentAt: '28 Jun 2026 • 14:30', reach: 128 },
  { id: 2, title: 'Materi Baru: SMC Advanced ditambahkan!', target: 'Batch 6 Pro', type: 'content',  sentAt: '27 Jun 2026 • 09:00', reach: 83 },
  { id: 3, title: 'Reminder: Deadline Homework Modul 1', target: 'Batch 5 Basic', type: 'reminder', sentAt: '26 Jun 2026 • 12:00', reach: 45 },
];

const typeStyle = (t) => {
  if (t === 'signal')  return { cls: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Sinyal' };
  if (t === 'content') return { cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30',   label: 'Konten Baru' };
  return { cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Reminder' };
};

const AdminBroadcast = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [type, setType] = useState('signal');

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-1">Broadcast & Push Notification</h2>
        <p className="text-gray-400">Kirim pengumuman atau sinyal trading langsung ke dashboard semua member aktif.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compose */}
        <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-5">Buat Broadcast</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Tipe Notifikasi</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 'signal',   icon: Zap,      label: 'Sinyal' },
                  { val: 'content',  icon: BookOpen,  label: 'Konten' },
                  { val: 'reminder', icon: Bell,      label: 'Reminder' },
                ].map(opt => (
                  <button key={opt.val} onClick={() => setType(opt.val)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition-all ${type === opt.val ? 'bg-brand-primary/15 border-brand-primary text-brand-primary' : 'bg-brand-dark border-white/10 text-gray-400 hover:border-white/20'}`}>
                    <opt.icon size={18} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Target Penerima</label>
              <select value={target} onChange={e => setTarget(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50">
                <option value="all">Semua Member (128 orang)</option>
                <option value="batch5">Batch 5 Basic (45 orang)</option>
                <option value="batch6">Batch 6 Pro (83 orang)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Judul Notifikasi</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Sinyal Live Trade XAUUSD Buy!"
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50" />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Isi Pesan</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
                placeholder="Tuliskan detail sinyal, update materi, atau pengumuman..."
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50 resize-none" />
            </div>

            <button className="w-full py-3 bg-brand-primary text-brand-dark font-black rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.2)] flex items-center justify-center gap-2">
              <Send size={18} /> Kirim Sekarang
            </button>
          </div>
        </div>

        {/* History */}
        <div>
          <h3 className="font-bold text-lg mb-4">Riwayat Broadcast</h3>
          <div className="space-y-3">
            {history.map(h => {
              const s = typeStyle(h.type);
              return (
                <div key={h.id} className="bg-brand-secondary border border-white/10 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-bold text-sm text-white">{h.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${s.cls}`}>{s.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><Users size={11}/> {h.reach} penerima</div>
                    <span>•</span>
                    <span>{h.target}</span>
                    <span>•</span>
                    <span>{h.sentAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBroadcast;
