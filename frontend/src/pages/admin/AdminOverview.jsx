import React from 'react';
import { ShoppingBag, Users, DollarSign, MessageSquare, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

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

const AdminOverview = () => (
  <div className="p-6 md:p-8 max-w-7xl mx-auto">
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-1">Admin Dashboard</h2>
      <p className="text-gray-400">Selamat datang kembali, Super Admin. Berikut ringkasan hari ini.</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      <StatCard icon={ShoppingBag}   label="Order Baru"      value="3"    sub="Menunggu approval"       color="bg-yellow-500/10 text-yellow-400" />
      <StatCard icon={Users}         label="Total Member"    value="128"  sub="12 bergabung bulan ini"  color="bg-blue-500/10 text-blue-400" />
      <StatCard icon={DollarSign}    label="Revenue Bulan Ini" value="$4.2k" sub="vs $3.1k bulan lalu" color="bg-green-500/10 text-green-400" />
      <StatCard icon={MessageSquare} label="Tiket Open"      value="5"    sub="Butuh balasan admin"     color="bg-red-500/10 text-red-400" />
    </div>

    {/* Recent Orders + Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Orders */}
      <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg">Order Terbaru</h3>
          <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-bold border border-red-500/30">3 Pending</span>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Ahmad Rizky', batch: 'Batch 6 Pro', method: 'QRIS', status: 'pending', tg: 'ahmad_rz' },
            { name: 'Siti Nur',    batch: 'Batch 5 Basic', method: 'USDT', status: 'pending', tg: 'siti_nur' },
            { name: 'Budi Santoso',batch: 'Batch 6 Pro', method: 'QRIS', status: 'pending', tg: 'budi_s' },
          ].map((order, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-brand-dark rounded-xl border border-white/5">
              <div>
                <p className="font-bold text-sm">{order.name}</p>
                <p className="text-xs text-gray-400">{order.batch} • {order.method}</p>
              </div>
              <div className="flex items-center gap-2">
                <a href={`https://t.me/${order.tg}`} target="_blank" rel="noreferrer"
                  className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-lg font-bold border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                  Telegram
                </a>
                <button className="px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded-lg font-bold border border-green-500/30 hover:bg-green-500/30 transition-colors flex items-center gap-1">
                  <CheckCircle size={11} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-5">Aktivitas Terkini</h3>
        <div className="space-y-4">
          {[
            { icon: CheckCircle, color: 'text-green-400', text: 'Budi Santoso diapprove ke Batch 6', time: '5 menit lalu' },
            { icon: MessageSquare, color: 'text-blue-400', text: 'Tiket baru dari "Dewi Putri" masuk', time: '20 menit lalu' },
            { icon: Users, color: 'text-purple-400', text: 'Reza Pratama mendaftar Batch 5', time: '1 jam lalu' },
            { icon: AlertTriangle, color: 'text-yellow-400', text: 'Siti Nur gagal verifikasi QRIS', time: '2 jam lalu' },
            { icon: TrendingUp, color: 'text-brand-primary', text: 'Revenue hari ini: $540', time: '3 jam lalu' },
          ].map((act, i) => (
            <div key={i} className="flex items-center gap-3">
              <act.icon size={16} className={`${act.color} shrink-0`} />
              <div className="flex-grow">
                <p className="text-sm text-gray-200">{act.text}</p>
              </div>
              <p className="text-xs text-gray-500 shrink-0">{act.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AdminOverview;
