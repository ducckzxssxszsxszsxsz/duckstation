import React, { useState } from 'react';
import { Search, Star, Eye, CheckSquare, AlertTriangle, ExternalLink } from 'lucide-react';

const users = [
  { id: 1, name: 'Ahmad Rizky',   tg: 'ahmad_rz',   batch: 'Batch 6 Pro',   discord: 'ahmad#1234', progress: 45, hw: '3/5', status: 'active' },
  { id: 2, name: 'Siti Nur',      tg: 'siti_nur',   batch: 'Batch 5 Basic', discord: 'siti#5678',  progress: 80, hw: '5/5', status: 'active' },
  { id: 3, name: 'Dewi Putri',    tg: 'dewi_p',     batch: 'Batch 6 Pro',   discord: 'dewi#3456',  progress: 20, hw: '1/5', status: 'inactive' },
  { id: 4, name: 'Reza Pratama',  tg: 'reza_pt',    batch: 'Batch 6 Pro',   discord: 'reza#7890',  progress: 60, hw: '4/5', status: 'active' },
  { id: 5, name: 'Budi Santoso',  tg: 'budi_s',     batch: 'Batch 5 Basic', discord: 'budi#9012',  progress: 100, hw: '5/5', status: 'graduated' },
];

const AdminUsers = () => {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.tg.includes(search));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-1">User List & Evaluasi</h2>
        <p className="text-gray-400">Pantau progres, status aktif, dan evaluasi seluruh member.</p>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-3.5 text-gray-500" />
        <input type="text" placeholder="Cari nama atau Telegram..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full md:w-96 bg-brand-secondary border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50" />
      </div>

      <div className="bg-brand-secondary border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-4">Member</th>
                <th className="text-left px-5 py-4">Batch</th>
                <th className="text-left px-5 py-4">Discord</th>
                <th className="text-left px-5 py-4">Progres</th>
                <th className="text-left px-5 py-4">Homework</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-left px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white">{u.name}</p>
                    <a href={`https://t.me/${u.tg}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                      @{u.tg} <ExternalLink size={9} />
                    </a>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-xs">{u.batch}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{u.discord}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-brand-dark rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-brand-primary rounded-full" style={{width:`${u.progress}%`}}></div>
                      </div>
                      <span className="text-xs text-gray-400">{u.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold ${u.hw === '5/5' ? 'text-green-400' : 'text-yellow-400'}`}>{u.hw}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                      u.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      u.status === 'graduated' ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                      {u.status === 'graduated' ? 'Lulus' : u.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-medium border border-white/10 transition-colors">
                      <Eye size={12} /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
