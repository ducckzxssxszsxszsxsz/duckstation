import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ExternalLink, Search, Filter } from 'lucide-react';
import api from '../../services/api';

const statusBadge = (status) => {
  if (status === 'approved') return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold border border-green-500/30">Approved</span>;
  if (status === 'rejected') return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/30">Rejected</span>;
  return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-bold border border-yellow-500/30 animate-pulse">Pending</span>;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOrders(filter === 'all' ? '' : filter);
      if (res.success) setOrders(res.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleApprove = async (id) => {
    try {
      const res = await api.approveOrder(id);
      if (res.success) fetchOrders();
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.rejectOrder(id, 'Ditolak oleh admin');
      if (res.success) fetchOrders();
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  const filtered = orders.filter(o => {
    const name = o.user?.name || '';
    const tg = o.user?.telegram || '';
    return name.toLowerCase().includes(search.toLowerCase()) || tg.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-1">Order & Approval</h2>
        <p className="text-gray-400">Kelola pendaftar baru. Klik Telegram untuk konfirmasi, lalu tekan Approve untuk aktivasi akses.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search size={16} className="absolute left-3 top-3.5 text-gray-500" />
          <input type="text" placeholder="Cari nama atau Telegram..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-brand-secondary border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50" />
        </div>
        <div className="flex gap-2">
          {['all','pending','approved','rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors capitalize ${filter === f ? 'bg-brand-primary text-brand-dark' : 'bg-brand-secondary border border-white/10 text-gray-400 hover:text-white'}`}>
              {f === 'all' ? 'Semua' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-brand-secondary border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-4">Pendaftar</th>
                  <th className="text-left px-5 py-4">Batch</th>
                  <th className="text-left px-5 py-4">Metode</th>
                  <th className="text-left px-5 py-4">Discord</th>
                  <th className="text-left px-5 py-4">Tanggal</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-left px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(order => (
                  <tr key={order._id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-white">{order.user?.name || 'Unknown'}</p>
                      <a href={`https://t.me/${order.user?.telegram}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-0.5">
                        @{order.user?.telegram || 'n/a'} <ExternalLink size={10} />
                      </a>
                    </td>
                    <td className="px-5 py-4 text-gray-300">{order.batchName}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${order.method === 'USDT' ? 'bg-teal-500/20 text-teal-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {order.method}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{order.user?.discordTag || '-'}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="px-5 py-4">{statusBadge(order.status)}</td>
                    <td className="px-5 py-4">
                      {order.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(order._id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-bold border border-green-500/30 transition-colors">
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button onClick={() => handleReject(order._id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold border border-red-500/20 transition-colors">
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600 italic">Sudah diproses</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="p-10 text-center text-gray-500">Tidak ada order yang cocok.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
