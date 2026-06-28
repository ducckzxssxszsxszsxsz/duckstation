import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, CheckSquare, MessageSquare, Shield, DollarSign, Crown, Play, Lock, ChevronRight, User, Settings, LogOut, Bell, AlertTriangle, RotateCcw, CheckCircle, Clock, ArrowRight, Menu, X } from 'lucide-react';
import BookingPage from './BookingPage';
import HomeworkPage from './HomeworkPage';
import TicketingPage from './TicketingPage';
import BatchSelection from './BatchSelection';
import HowToStart from './HowToStart';

const SidebarLink = ({ to, icon: Icon, label, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black mb-1">Modul Materi 📚</h2>
          <p className="text-gray-400 text-sm sm:text-base">Kurikulum berjenjang — selesaikan quiz & belajar secara sistematis.</p>
        </div>
        <button onClick={() => navigate('/dashboard/how-to')}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-colors self-start sm:self-auto">
          <ArrowRight size={14} /> Cara Memulai
        </button>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {/* Module 1 — Free */}
        <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:border-brand-primary/50 cursor-pointer transition-all group shadow-lg">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Play size={22} className="ml-1" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Modul 1</span>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-500/20">GRATIS</span>
              </div>
              <h4 className="font-bold text-base sm:text-lg">Fundamental Market & Candlestick</h4>
              <p className="text-xs sm:text-sm text-gray-400">Teks & Gambar • 6 Langkah</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors border border-white/10 w-full sm:w-auto text-sm">
            Mulai Belajar <ChevronRight size={16} />
          </button>
        </div>

        {/* Module 2 — Locked */}
        <div className="bg-brand-secondary/40 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => navigate('/dashboard/batches')}
              className="flex items-center gap-2 bg-brand-primary text-brand-dark px-6 py-2 rounded-lg font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-sm">
              <Lock size={16} /> Buka Akses Premium
            </button>
          </div>
          <div className="flex items-center gap-4 opacity-50 relative z-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-800 text-gray-500 flex items-center justify-center shrink-0"><Lock size={22} /></div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Modul 2</span>
              </div>
              <h4 className="font-bold text-base sm:text-lg text-gray-300">Smart Money Concepts (SMC)</h4>
              <p className="text-xs sm:text-sm text-gray-500">Khusus Kelas Premium</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-500 font-medium z-0"><Lock size={16} /> Terkunci</div>
        </div>

        {/* Module 3 — Locked */}
        <div className="bg-brand-secondary/40 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => navigate('/dashboard/batches')}
              className="flex items-center gap-2 bg-brand-primary text-brand-dark px-6 py-2 rounded-lg font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-sm">
              <Lock size={16} /> Buka Akses Premium
            </button>
          </div>
          <div className="flex items-center gap-4 opacity-50 relative z-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-800 text-gray-500 flex items-center justify-center shrink-0"><Lock size={22} /></div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Modul 3</span>
              </div>
              <h4 className="font-bold text-base sm:text-lg text-gray-300">Liquidity & Risk Management</h4>
              <p className="text-xs sm:text-sm text-gray-500">Khusus Kelas Premium</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-500 font-medium z-0"><Lock size={16} /> Terkunci</div>
        </div>
      </div>
    </div>
  );
};

const UserSettings = () => (
  <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Pengaturan Akun</h2>
      <p className="text-gray-400 text-sm sm:text-base">Kelola profil, integrasi Web3, dan binding Discord Anda di sini.</p>
    </div>

    <div className="space-y-6">
      {/* Profil Dasar */}
      <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-4">Profil & Kontak</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email (Google Login)</label>
            <input type="email" disabled value="user@example.com" className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-gray-300 cursor-not-allowed text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username Telegram (Wajib untuk komunikasi Admin)</label>
            <div className="flex relative">
              <span className="absolute left-4 top-3 text-gray-500">@</span>
              <input type="text" placeholder="username_telegram" className="w-full bg-brand-dark border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-colors text-sm" />
            </div>
          </div>
          <button className="px-6 py-2.5 bg-brand-primary text-brand-dark font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors">Simpan Profil</button>
        </div>
      </div>

      {/* Integrasi Discord */}
      <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-4">Integrasi Discord</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-brand-dark border border-white/5 rounded-xl gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#5865F2]/10 text-[#5865F2] rounded-lg"><MessageSquare size={20} /></div>
              <div>
                <p className="font-bold text-sm">Discord Akun</p>
                <p className="text-xs text-gray-400">Wajib untuk akses grup kelas</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-lg text-sm transition-colors self-start sm:self-auto">
              Authorize Discord
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;
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

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-brand-secondary/50 border-r border-white/10 flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex-grow overflow-y-auto p-4 space-y-1 scrollbar-hide">
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <span className="font-bold text-white">Menu</span>
            <button onClick={closeSidebar} className="p-1 rounded-lg hover:bg-white/10 text-gray-400">
              <X size={20} />
            </button>
          </div>

          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4 mt-2 hidden md:block">Menu Utama</div>
          <SidebarLink to="/dashboard" icon={BookOpen} label="Modul Materi" active={currentPath === '/dashboard'} onClick={closeSidebar} />
          <SidebarLink to="/dashboard/how-to" icon={ArrowRight} label="Cara Memulai" active={currentPath === '/dashboard/how-to'} onClick={closeSidebar} />
          <SidebarLink to="/dashboard/batches" icon={DollarSign} label="Pilih Kelas / Batch" active={currentPath === '/dashboard/batches'} onClick={closeSidebar} />
          
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-6 mb-3 px-4 hidden md:block">Interaksi</div>
          <SidebarLink to="/dashboard/booking" icon={Calendar} label="Booking 1-on-1" active={currentPath === '/dashboard/booking'} onClick={closeSidebar} />
          <SidebarLink to="/dashboard/homework" icon={CheckSquare} label="Homework & Quiz" active={currentPath === '/dashboard/homework'} onClick={closeSidebar} />
          <SidebarLink to="/dashboard/tickets" icon={MessageSquare} label="Private Ticketing" active={currentPath === '/dashboard/tickets'} onClick={closeSidebar} />
          
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-6 mb-3 px-4 hidden md:block">Akun Saya</div>
          <SidebarLink to="/dashboard/settings" icon={Settings} label="Pengaturan Akun" active={currentPath === '/dashboard/settings'} onClick={closeSidebar} />
        </div>
        
        {/* User Mini Profile di Bawah Sidebar */}
        <div className="p-4 border-t border-white/10 bg-brand-secondary/30">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400 relative shrink-0">
                U
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#1A1A24] rounded-full"></span>
              </div>
              <div>
                <p className="font-medium text-sm truncate max-w-[90px]">Guest User</p>
                <p className="text-[10px] text-gray-500 font-semibold">Free Tier</p>
              </div>
            </div>
            <button className="text-gray-500 group-hover:text-red-400 transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto bg-brand-dark">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-brand-secondary/30 md:hidden sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-white/10 text-gray-300">
            <Menu size={22} />
          </button>
          <span className="font-bold text-sm">DuckStation</span>
          <div className="w-9" />
        </div>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/how-to" element={<HowToStart />} />
          <Route path="/batches" element={<BatchSelection />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/homework" element={<HomeworkPage />} />
          <Route path="/tickets" element={<TicketingPage />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="*" element={<div className="p-8 text-gray-400 flex items-center justify-center h-full">Modul ini sedang dalam tahap pengembangan (WIP).</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
