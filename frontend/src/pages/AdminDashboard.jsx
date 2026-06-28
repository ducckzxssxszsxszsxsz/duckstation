import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, BookOpen, DollarSign,
  Calendar, Users, MessageSquare, Bell, LogOut, Shield, Settings, Menu, X
} from 'lucide-react';
import duckMascot from '../assets/duck-mascot-nobg.png';
import { useAuth } from '../context/AuthContext';

import AdminOverview   from './admin/AdminOverview';
import AdminOrders     from './admin/AdminOrders';
import AdminCourses    from './admin/AdminCourses';
import AdminBatches    from './admin/AdminBatches';
import AdminBooking    from './admin/AdminBooking';
import AdminUsers      from './admin/AdminUsers';
import AdminTickets    from './admin/AdminTickets';
import AdminBroadcast  from './admin/AdminBroadcast';

const SidebarLink = ({ to, icon: Icon, label, active, badge, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
      active
        ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/25'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} />
      <span className="font-medium text-sm">{label}</span>
    </div>
    {badge > 0 && (
      <span className="w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
        {badge}
      </span>
    )}
  </Link>
);

const AdminDashboard = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const path      = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-[calc(100vh-73px)] relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0d0d12] border-r border-white/10 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Mobile close + Admin Badge */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              <Shield size={16} className="text-red-400" />
              <span className="text-red-400 font-bold text-sm tracking-wide">ADMIN PANEL</span>
            </div>
            <button onClick={closeSidebar} className="p-1 rounded-lg hover:bg-white/10 text-gray-400 md:hidden">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-grow overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-4 mt-1 hidden md:block">Overview</div>
          <SidebarLink to="/admin"           icon={LayoutDashboard} label="Dashboard"             active={path === '/admin'} onClick={closeSidebar} />

          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-4 mt-5 hidden md:block">Manajemen</div>
          <SidebarLink to="/admin/orders"    icon={ShoppingBag}     label="Order & Approval"      active={path === '/admin/orders'}   onClick={closeSidebar} />
          <SidebarLink to="/admin/users"     icon={Users}           label="User List & Evaluasi"  active={path === '/admin/users'} onClick={closeSidebar} />
          <SidebarLink to="/admin/courses"   icon={BookOpen}        label="Course Builder"        active={path === '/admin/courses'} onClick={closeSidebar} />
          <SidebarLink to="/admin/batches"   icon={DollarSign}      label="Batch & Pricing"       active={path === '/admin/batches'} onClick={closeSidebar} />

          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-4 mt-5 hidden md:block">Interaksi</div>
          <SidebarLink to="/admin/booking"   icon={Calendar}        label="Booking Control"       active={path === '/admin/booking'} onClick={closeSidebar} />
          <SidebarLink to="/admin/tickets"   icon={MessageSquare}   label="Ticketing Inbox"       active={path === '/admin/tickets'} onClick={closeSidebar} />
          <SidebarLink to="/admin/broadcast" icon={Bell}            label="Broadcast & Notif"     active={path === '/admin/broadcast'} onClick={closeSidebar} />
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-t border-white/10 bg-[#0d0d12]">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-brand-primary/40 bg-brand-secondary shrink-0">
                <img src={duckMascot} alt="admin" className="w-full h-full object-contain scale-110" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-red-400 font-bold">Admin Access</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="text-gray-500 hover:text-red-400 transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-grow overflow-y-auto bg-brand-dark">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0d0d12]/80 md:hidden sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-white/10 text-gray-300">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-red-400" />
            <span className="font-bold text-sm text-red-400">Admin</span>
          </div>
          <div className="w-9" />
        </div>
        <Routes>
          <Route path="/"          element={<AdminOverview />} />
          <Route path="/orders"    element={<AdminOrders />} />
          <Route path="/users"     element={<AdminUsers />} />
          <Route path="/courses"   element={<AdminCourses />} />
          <Route path="/batches"   element={<AdminBatches />} />
          <Route path="/booking"   element={<AdminBooking />} />
          <Route path="/tickets"   element={<AdminTickets />} />
          <Route path="/broadcast" element={<AdminBroadcast />} />
          <Route path="*"          element={<div className="p-10 text-gray-500 text-center">Halaman tidak ditemukan.</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
