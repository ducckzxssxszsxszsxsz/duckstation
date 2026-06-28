import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Crown } from 'lucide-react';
import api from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', tier: 'Starter', priceIdr: '', priceUsdt: '', discordRole: '', roleName: '', status: 'open',
  });

  const fetchBatches = async () => {
    try {
      const res = await api.getBatches();
      if (res.success) setBatches(res.batches || []);
    } catch (err) {
      console.error('Failed to fetch batches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreate = async () => {
    if (!form.name) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      }).then(r => r.json());
      if (res.success) {
        fetchBatches();
        setShowForm(false);
        setForm({ name: '', tier: 'Starter', priceIdr: '', priceUsdt: '', discordRole: '', roleName: '', status: 'open' });
      }
    } catch (err) {
      console.error('Failed to create batch:', err);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-1">Batch & Pricing</h2>
          <p className="text-gray-400">Buat angkatan baru, atur harga, dan binding ke Discord Role.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-brand-dark font-bold rounded-xl hover:bg-yellow-400 transition-colors self-start">
          <Plus size={18} /> Batch Baru
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-brand-secondary border border-brand-primary/30 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Buat Batch Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nama Batch</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Contoh: Batch 7: Elite" className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Tier</label>
              <select value={form.tier} onChange={e => setForm({...form, tier: e.target.value})}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50">
                <option>Starter</option>
                <option>Pro</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Harga (Rupiah)</label>
              <input type="text" value={form.priceIdr} onChange={e => setForm({...form, priceIdr: e.target.value})}
                placeholder="Rp 3.000.000" className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Harga (USDT)</label>
              <input type="text" value={form.priceUsdt} onChange={e => setForm({...form, priceUsdt: e.target.value})}
                placeholder="$199" className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Role untuk Member</label>
              <input type="text" value={form.roleName} onChange={e => setForm({...form, roleName: e.target.value})}
                placeholder="contoh: member-basic, pro-trader" className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">ID Discord Role</label>
              <input type="text" value={form.discordRole} onChange={e => setForm({...form, discordRole: e.target.value})}
                placeholder="e.g. 123456789012345678" className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50">
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-5 py-2 bg-brand-primary text-brand-dark font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors">Simpan Batch</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-white/5 text-gray-400 font-medium rounded-xl text-sm hover:bg-white/10 transition-colors">Batal</button>
          </div>
        </div>
      )}

      {/* Batch Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat data...</div>
        ) : batches.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Belum ada batch.</div>
        ) : (
          batches.map(batch => (
            <div key={batch._id} className={`bg-brand-secondary border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${batch.tier === 'Pro' ? 'border-brand-primary/30' : 'border-white/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${batch.tier === 'Pro' ? 'bg-brand-primary/15 text-brand-primary' : 'bg-white/5 text-gray-400'}`}>
                  <Crown size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{batch.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${batch.status === 'open' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                      {batch.status === 'open' ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
                    <span>{batch.priceIdr || '-'} / {batch.priceUsdt || '-'}</span>
                    <span>•</span>
                    {batch.roleName && <span>Role: <span className="text-green-400 font-medium">{batch.roleName}</span></span>}
                    {batch.roleName && <span>•</span>}
                    <span>Discord Role: <span className="text-purple-400 font-medium">@{batch.discordRole || 'n/a'}</span></span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="flex items-center gap-1 px-4 py-2 bg-white/5 text-gray-300 hover:text-white rounded-xl text-sm font-medium border border-white/10 hover:bg-white/10 transition-colors">
                  <Edit size={14} /> Edit
                </button>
                <button className="flex items-center gap-1 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium border border-red-500/20 transition-colors">
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBatches;
