import React, { useState, useEffect } from 'react';
import { Search, Star, Eye, CheckSquare, AlertTriangle, ExternalLink, Crown, ChevronDown, Plus, Mail } from 'lucide-react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [extendDays, setExtendDays] = useState(7);
  const [extendingUser, setExtendingUser] = useState(null);
  const [messageUser, setMessageUser] = useState(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.getAllUsers(search);
        if (res.success) setUsers(res.users || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleSetRole = async (userId) => {
    try {
      const res = await api.setUserRole(userId, newRole, durationDays);
      if (res.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole, roleExpiry: res.user.roleExpiry } : u));
        setEditingRole(null);
        setNewRole('');
      }
    } catch (err) {
      console.error('Failed to set role:', err);
    }
  };

  const handleExtend = async (userId) => {
    try {
      const res = await api.extendUserRole(userId, extendDays);
      if (res.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, roleExpiry: res.user.roleExpiry } : u));
        setExtendingUser(null);
      }
    } catch (err) {
      console.error('Failed to extend role:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageUser || !messageSubject.trim() || !messageBody.trim()) return;
    setSendingMessage(true);
    try {
      await api.sendMessage({ to: messageUser, subject: messageSubject, body: messageBody });
      setMessageUser(null);
      setMessageSubject('');
      setMessageBody('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

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
        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-4">Member</th>
                  <th className="text-left px-5 py-4">Batch</th>
                  <th className="text-left px-5 py-4">Discord</th>
                  <th className="text-left px-5 py-4">Role</th>
                  <th className="text-left px-5 py-4">Progres</th>
                  <th className="text-left px-5 py-4">Quiz Score</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-left px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-white">{u.name}</p>
                      <a href={`https://t.me/${u.telegram}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                        @{u.telegram || 'n/a'} <ExternalLink size={9} />
                      </a>
                    </td>
                    <td className="px-5 py-4 text-gray-300 text-xs">{u.batchName || '-'}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{u.discordTag || '-'}</td>
                    <td className="px-5 py-4">
                      {editingRole === u._id ? (
                        <div className="flex flex-col gap-1">
                          <select value={newRole} onChange={e => setNewRole(e.target.value)}
                            className="bg-brand-dark border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-primary/50">
                            <option value="guest">Guest</option>
                            <option value="user">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                          {newRole === 'user' && (
                            <input type="number" value={durationDays} onChange={e => setDurationDays(parseInt(e.target.value) || 30)}
                              placeholder="Hari" min="1"
                              className="bg-brand-dark border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-primary/50 w-20" />
                          )}
                          <div className="flex gap-1">
                            <button onClick={() => handleSetRole(u._id)} className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px] font-bold">OK</button>
                            <button onClick={() => setEditingRole(null)} className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-[10px]">Batal</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                            u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                            u.role === 'user' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }`}>
                            {u.role === 'admin' ? 'Admin' : u.role === 'user' ? 'Member' : 'Guest'}
                          </span>
                          {u.roleExpiry && (
                            <span className={`text-[10px] ${new Date(u.roleExpiry) < new Date() ? 'text-red-400' : 'text-green-400'}`}>
                              {new Date(u.roleExpiry) < new Date() ? 'Expired' : `Sisa ${Math.max(0, Math.ceil((new Date(u.roleExpiry) - new Date()) / (1000*60*60*24)))}h`}
                            </span>
                          )}
                          <button onClick={() => { setEditingRole(u._id); setNewRole(u.role); }}
                            className="text-[10px] text-brand-primary hover:underline text-left">Ubah Role</button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-brand-dark rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-brand-primary rounded-full" style={{width:`${u.progress || 0}%`}}></div>
                        </div>
                        <span className="text-xs text-gray-400">{u.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold ${(u.quizScore || 0) >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {u.quizScore || 0}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                        u.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        u.status === 'graduated' ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {u.status === 'graduated' ? 'Lulus' : u.status === 'active' ? 'Aktif' : u.status || 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        {extendingUser === u._id ? (
                          <div className="flex items-center gap-1">
                            <input type="number" value={extendDays} onChange={e => setExtendDays(parseInt(e.target.value) || 7)}
                              placeholder="Hari" min="1"
                              className="w-16 bg-brand-dark border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-primary/50" />
                            <button onClick={() => handleExtend(u._id)} className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-[10px] font-bold">OK</button>
                            <button onClick={() => setExtendingUser(null)} className="px-2 py-1 bg-white/5 text-gray-400 rounded-lg text-[10px]">X</button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <button onClick={() => setExtendingUser(u._id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-medium border border-white/10 transition-colors">
                              <Plus size={12} /> Extend
                            </button>
                            <button onClick={() => setMessageUser(u._id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 rounded-lg text-xs font-medium border border-brand-primary/20 transition-colors">
                              <Mail size={12} /> Kirim Pesan
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && users.length === 0 && (
          <div className="p-10 text-center text-gray-500">Tidak ada user ditemukan.</div>
        )}
      </div>

      {/* Send Message Modal */}
      {messageUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setMessageUser(null)}>
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-primary/10 rounded-xl"><Mail size={18} className="text-brand-primary" /></div>
              <h3 className="font-bold text-lg">Kirim Pesan ke User</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Subject</label>
                <input type="text" value={messageSubject} onChange={e => setMessageSubject(e.target.value)}
                  placeholder="Subjek pesan..."
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pesan</label>
                <textarea value={messageBody} onChange={e => setMessageBody(e.target.value)}
                  placeholder="Isi pesan..."
                  rows={4}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setMessageUser(null)} className="px-4 py-2 bg-white/5 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">Batal</button>
              <button onClick={handleSendMessage} disabled={sendingMessage || !messageSubject.trim() || !messageBody.trim()}
                className="px-4 py-2 bg-brand-primary text-brand-dark font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50">
                {sendingMessage ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
