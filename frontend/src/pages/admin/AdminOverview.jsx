import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, DollarSign, MessageSquare, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-brand-secondary border border-white/10 rounded-2xl p-5">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}><Icon size={20} /></div>
    </div>
    <p className="text-3xl font-black mb-1">{value}</p>
    <p className="text-sm font-bold text-white">{label}</p>
    <p className="text-xs text-gray-500 mt-1">{sub}</p>
  </div>
);

const AdminOverview = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, usersRes, ticketsRes] = await Promise.all([
          api.getAdminOrders('pending'),
          api.getAllUsers(),
          api.getAdminTickets(),
        ]);
        if (ordersRes.success) setOrders(ordersRes.orders || []);
        if (usersRes.success) setUsers(usersRes.users || []);
        if (ticketsRes.success) setTickets(ticketsRes.tickets || []);
      } catch (err) {
        console.error('Failed to fetch overview data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const pendingOrders = orders;
  const openTickets = tickets.filter(t => t.status === 'open');
  const recentOrders = pendingOrders.slice(0, 5);

  const activityLog = [
    ...recentOrders.slice(0, 3).map(o => ({
      icon: Clock, color: 'text-yellow-400',
      text: `${o.user?.name || 'User'} mendaftar ${o.batchName || 'batch'}`,
      time: new Date(o.createdAt).toLocaleDateString('id-ID'),
    })),
    ...openTickets.slice(0, 2).map(t => ({
      icon: MessageSquare, color: 'text-blue-400',
      text: `Tiket baru dari "${t.user?.name || 'User'}": ${t.subject}`,
      time: new Date(t.updatedAt).toLocaleDateString('id-ID'),
    })),
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-1">Admin Dashboard</h2>
        <p className="text-gray-400">Selamat datang kembali. Berikut ringkasan hari ini.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={ShoppingBag} label="Order Baru" value={pendingOrders.length} sub="Menunggu approval" color="bg-yellow-500/10 text-yellow-400" />
        <StatCard icon={Users} label="Total Member" value={users.length} sub="Total terdaftar" color="bg-blue-500/10 text-blue-400" />
        <StatCard icon={DollarSign} label="Revenue Bulan Ini" value="$0" sub="Belum ada data" color="bg-green-500/10 text-green-400" />
        <StatCard icon={MessageSquare} label="Tiket Open" value={openTickets.length} sub="Butuh balasan admin" color="bg-red-500/10 text-red-400" />
      </div>

      {/* Recent Orders + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg">Order Terbaru</h3>
            <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-bold border border-red-500/30">{pendingOrders.length} Pending</span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="p-6 text-center text-gray-500 text-sm">Memuat data...</div>
            ) : recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">Tidak ada order pending.</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-brand-dark rounded-xl border border-white/5">
                  <div>
                    <p className="font-bold text-sm">{order.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{order.batchName} • {order.method}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`https://t.me/${order.user?.telegram}`} target="_blank" rel="noreferrer"
                      className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-lg font-bold border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                      Telegram
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-5">Aktivitas Terkini</h3>
          <div className="space-y-4">
            {activityLog.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada aktivitas.</p>
            ) : (
              activityLog.map((act, i) => (
                <div key={i} className="flex items-center gap-3">
                  <act.icon size={16} className={`${act.color} shrink-0`} />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-200">{act.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 shrink-0">{act.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
